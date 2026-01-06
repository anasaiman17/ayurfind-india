-- Drop the existing restrictive policy and recreate as permissive
DROP POLICY IF EXISTS "Everyone can view plants" ON public.plants;

CREATE POLICY "Everyone can view plants" 
ON public.plants 
FOR SELECT 
TO public
USING (true);