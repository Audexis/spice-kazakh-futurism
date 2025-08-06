-- Insert demo spice products
INSERT INTO public.products (name, description, manufacturer, price, category_id) VALUES
('Garam Masala Premium', 'Authentic blend of aromatic spices perfect for Indian cuisine', 'Spice Master', 12.99, (SELECT id FROM categories WHERE slug = 'spices')),
('Turmeric Powder', 'Pure golden turmeric powder with anti-inflammatory properties', 'Golden Spice Co', 8.50, (SELECT id FROM categories WHERE slug = 'spices')),
('Cumin Seeds Whole', 'Fresh whole cumin seeds for tempering and grinding', 'Heritage Spices', 6.75, (SELECT id FROM categories WHERE slug = 'spices')),
('Red Chili Powder', 'Hot and flavorful red chili powder from Kashmir', 'Fire Spices', 9.25, (SELECT id FROM categories WHERE slug = 'spices')),
('Basmati Rice Premium', 'Long grain aromatic basmati rice from India', 'Royal Grain', 15.99, (SELECT id FROM categories WHERE slug = 'flour')),
('Chickpea Flour (Besan)', 'Fine ground chickpea flour for snacks and sweets', 'Mill Fresh', 7.50, (SELECT id FROM categories WHERE slug = 'flour')),
('Moong Dal Yellow', 'Split yellow mung beans, protein-rich lentils', 'Lentil King', 5.99, (SELECT id FROM categories WHERE slug = 'lentils')),
('Toor Dal', 'Yellow pigeon peas, staple protein in Indian cooking', 'Dal Master', 6.50, (SELECT id FROM categories WHERE slug = 'lentils')),
('Masala Papad', 'Crispy lentil crackers with spices', 'Snack Time', 4.25, (SELECT id FROM categories WHERE slug = 'snacks')),
('Namkeen Mix', 'Traditional Indian savory snack mix', 'Tasty Treats', 8.99, (SELECT id FROM categories WHERE slug = 'snacks')),
('Gulab Jamun Mix', 'Ready-to-make sweet dumplings in syrup', 'Sweet Dreams', 11.75, (SELECT id FROM categories WHERE slug = 'sweets')),
('Rasgulla Pack', 'Soft cottage cheese balls in sugar syrup', 'Bengal Sweets', 13.50, (SELECT id FROM categories WHERE slug = 'sweets'));