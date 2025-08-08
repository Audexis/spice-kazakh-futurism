-- Remove the existing demo admin user
DELETE FROM public.admin_users WHERE email = 'admin@spicebazaar.com';

-- Add the two new admin users
INSERT INTO public.admin_users (email, password_hash, name) VALUES
('chikasucks@spicebazaar.com', 'AssassiNisTheGoat', 'Chika Admin'),
('khushiftw@spicebazaar.com', 'chikaStillSucksLol', 'Khushi Admin');