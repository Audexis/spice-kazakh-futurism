-- Add rating field to products table
ALTER TABLE public.products ADD COLUMN rating DECIMAL(3,2) DEFAULT 4.5;
ALTER TABLE public.products ADD COLUMN review_count INTEGER DEFAULT 0;

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for reviews
CREATE POLICY "Reviews are publicly readable" 
ON public.reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create reviews" 
ON public.reviews 
FOR INSERT 
WITH CHECK (true);

-- Update existing products with sample ratings
UPDATE public.products SET 
  rating = 4.5 + (RANDOM() * 1.0),
  review_count = FLOOR(RANDOM() * 50) + 5
WHERE rating IS NULL;

-- Insert sample reviews for demo
INSERT INTO public.reviews (product_id, user_name, rating, comment) VALUES
((SELECT id FROM products WHERE name = 'Garam Masala Premium'), 'Aida K.', 5, 'Absolutely authentic taste! Reminds me of my grandmother''s cooking.'),
((SELECT id FROM products WHERE name = 'Garam Masala Premium'), 'Sergey M.', 4, 'Great quality spices, fast delivery to Almaty.'),
((SELECT id FROM products WHERE name = 'Turmeric Powder'), 'Elena R.', 5, 'Pure and fresh turmeric. Great for health and cooking.'),
((SELECT id FROM products WHERE name = 'Basmati Rice Premium'), 'Ahmed S.', 5, 'Best basmati rice in Kazakhstan! Perfect grains every time.'),
((SELECT id FROM products WHERE name = 'Red Chili Powder'), 'Mira T.', 4, 'Good heat level, perfect for our family dishes.');