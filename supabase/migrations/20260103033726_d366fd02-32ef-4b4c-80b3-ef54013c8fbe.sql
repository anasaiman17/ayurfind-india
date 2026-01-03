-- Add new columns for region availability and medicine category
ALTER TABLE public.plants 
ADD COLUMN IF NOT EXISTS region_availability text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS medicine_category text DEFAULT 'Ayurveda';

-- Create storage bucket for plant images
INSERT INTO storage.buckets (id, name, public)
VALUES ('plant-images', 'plant-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view plant images (public bucket)
CREATE POLICY "Anyone can view plant images"
ON storage.objects FOR SELECT
USING (bucket_id = 'plant-images');

-- Only admins can upload plant images
CREATE POLICY "Admins can upload plant images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'plant-images' AND has_role(auth.uid(), 'admin'));

-- Only admins can update plant images
CREATE POLICY "Admins can update plant images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'plant-images' AND has_role(auth.uid(), 'admin'));

-- Only admins can delete plant images
CREATE POLICY "Admins can delete plant images"
ON storage.objects FOR DELETE
USING (bucket_id = 'plant-images' AND has_role(auth.uid(), 'admin'));