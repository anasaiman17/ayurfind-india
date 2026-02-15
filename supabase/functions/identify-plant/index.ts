import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, plantNames } = await req.json();

    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const knownPlants = plantNames?.join(", ") || "Tulsi, Neem, Turmeric, Ashwagandha, Aloe Vera, Brahmi, Giloy, Moringa, Amla, Ginger, Garlic";

    const prompt = `You are an expert botanist specializing in medicinal plants of India. Analyze this plant image and identify it.

Known medicinal plants in our database: ${knownPlants}

Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{
  "identified": true,
  "plantName": "English common name of the plant",
  "scientificName": "Scientific name",
  "confidence": 85,
  "reasoning": "Brief explanation of why this identification was made based on visible features",
  "matchedFeatures": ["feature1", "feature2", "feature3"],
  "isInDatabase": true,
  "suggestions": ["If not confidently identified, suggest possible matches"]
}

If you cannot identify the plant or it's not a plant image, set "identified" to false and confidence to 0.
Be honest about confidence levels. Only give high confidence (>80) if you're quite sure.`;

    // Clean the base64
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, "");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${cleanBase64}`,
                },
              },
            ],
          },
        ],
        temperature: 0.3,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const aiResult = await response.json();
    const textContent = aiResult.choices?.[0]?.message?.content || "";
    
    console.log("AI raw response:", textContent);

    let identification;
    try {
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        identification = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Parse error:", parseError);
      identification = {
        identified: false,
        plantName: "Unknown",
        scientificName: "Unknown",
        confidence: 0,
        reasoning: "Could not parse AI response",
        matchedFeatures: [],
        isInDatabase: false,
        suggestions: [],
      };
    }

    return new Response(JSON.stringify(identification), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in identify-plant function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to identify plant" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
