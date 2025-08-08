-- Fix the function search path security warnings by setting secure search_path

-- Update the update_product_rating function to be more secure
CREATE OR REPLACE FUNCTION public.update_product_rating()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
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
$function$;

-- Update the update_order_status_timestamp function to be more secure
CREATE OR REPLACE FUNCTION public.update_order_status_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  NEW.status_updated_at = now();
  RETURN NEW;
END;
$function$;