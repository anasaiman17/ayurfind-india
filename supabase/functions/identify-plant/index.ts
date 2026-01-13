import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PlantInfo {
  id: string;
  englishName: string;
  scientificName: string;
  family: string;
  description: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Optional authentication - allow anonymous users for plant identification
    const authHeader = req.headers.get("authorization");
    let userId = "anonymous";
    
    if (authHeader?.startsWith("Bearer ")) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
      
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } }
      });

      // Try to verify the JWT token - but don't fail if it doesn't work
      const token = authHeader.replace("Bearer ", "");
      try {
        const { data: claimsData } = await supabase.auth.getClaims(token);
        if (claimsData?.claims?.sub) {
          userId = claimsData.claims.sub;
        }
      } catch (authError) {
        console.log("Auth verification skipped:", authError);
      }
    }

    console.log(`Plant identification request from user: ${userId}`);

    const { imageBase64, plants } = await req.json();
    
    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build plant catalog for the AI to match against
    const plantCatalog = (plants || []).map((p: PlantInfo) => ({
      id: p.id,
      name: p.englishName,
      scientificName: p.scientificName,
      family: p.family,
      description: p.description?.substring(0, 200)
    }));

    const systemPrompt = `You are an expert botanist specializing in medicinal plants identification. 
Your task is to analyze plant images and identify them by matching against a database of known plants.

Available plants in the database:
${JSON.stringify(plantCatalog, null, 2)}

Analyze the image and identify which plant(s) from the database it most likely matches.
Consider:
- Leaf shape, size, and arrangement
- Leaf texture and vein patterns
- Stem characteristics
- Overall plant structure
- Color and patterns

Respond with a JSON object containing:
{
  "matches": [
    {
      "plantId": "id from database",
      "confidence": 0-100 (percentage),
      "matchedFeatures": ["list of visual features that matched"],
      "reasoning": "brief explanation of why this plant matches"
    }
  ],
  "plantDetected": true/false (whether a plant was detected in the image),
  "imageQuality": "good" | "poor",
  "qualityIssues": ["list of any image quality issues"]
}

If no plant from the database matches well (confidence < 30%), still provide your best guesses.
If the image doesn't contain a clear plant, set plantDetected to false.
Always return valid JSON only, no markdown or extra text.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this plant image and identify it from the database. Return your analysis as JSON."
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse the JSON response
    let analysisResult;
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysisResult = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI analysis");
    }

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in identify-plant function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
