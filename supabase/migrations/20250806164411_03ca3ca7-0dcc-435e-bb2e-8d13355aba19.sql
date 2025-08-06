-- Update reviews table to allow updates and deletes if not already done
DROP POLICY IF EXISTS "Anyone can create reviews" ON public.reviews;

CREATE POLICY "Anyone can manage reviews" 
ON public.reviews 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create function to update product ratings when reviews change
CREATE OR REPLACE FUNCTION public.update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the product's rating and review count
  UPDATE public.products 
  SET 
    rating = (
      SELECT COALESCE(AVG(rating::numeric), 0) 
      FROM public.reviews 
      WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
    ),
    review_count = (
      SELECT COUNT(*) 
      FROM public.reviews 
      WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
    )
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update product ratings
DROP TRIGGER IF EXISTS update_product_rating_trigger ON public.reviews;
CREATE TRIGGER update_product_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_product_rating();