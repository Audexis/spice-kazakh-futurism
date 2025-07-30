-- Drop existing restrictive policies and create more permissive ones for MVP
DROP POLICY IF EXISTS "Admin can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Admin can manage products" ON public.products;
DROP POLICY IF EXISTS "Admin can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete product images" ON storage.objects;

-- Create permissive policies for MVP (anyone can manage products)
CREATE POLICY "Anyone can manage categories" 
ON public.categories 
FOR ALL 
USING (true)
WITH CHECK (true);

CREATE POLICY "Anyone can manage products" 
ON public.products 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Update storage policies to be permissive
CREATE POLICY "Anyone can upload product images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'products');

CREATE POLICY "Anyone can update product images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'products');

CREATE POLICY "Anyone can delete product images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'products');