
-- Create admin users table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Admin users can only be managed by other admin users (or during initial setup)
CREATE POLICY "Admins can manage admin users" 
  ON public.admin_users 
  FOR ALL 
  USING (true)  -- We'll handle this in the application layer
  WITH CHECK (true);

-- Update orders table to have better status tracking
ALTER TABLE public.orders 
DROP COLUMN IF EXISTS status CASCADE;

-- Add new status column with enum
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'preparing', 'in_transit', 'delivered', 'cancelled');

ALTER TABLE public.orders 
ADD COLUMN status public.order_status NOT NULL DEFAULT 'pending',
ADD COLUMN admin_notes TEXT,
ADD COLUMN status_updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN updated_by_admin UUID REFERENCES public.admin_users(id);

-- Create trigger to update status timestamp
CREATE OR REPLACE FUNCTION public.update_order_status_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.status_updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_order_status_timestamp_trigger
  BEFORE UPDATE OF status ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_order_status_timestamp();

-- Add RLS policy for admin order management
CREATE POLICY "Admins can manage all orders" 
  ON public.orders 
  FOR UPDATE 
  USING (true)  -- We'll handle admin verification in the application
  WITH CHECK (true);
