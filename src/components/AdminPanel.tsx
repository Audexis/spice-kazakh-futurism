import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Upload } from 'lucide-react';
import { Product, Category, useSpiceData } from '@/hooks/useSpiceData';

interface AdminPanelProps {
  categories: Category[];
  onProductAdded: () => void;
}

export const AdminPanel = ({ categories, onProductAdded }: AdminPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { addProduct, uploadProductImage } = useSpiceData();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    manufacturer: '',
    price: '',
    category_id: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category_id) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      let imageUrl = '';
      
      if (imageFile) {
        imageUrl = await uploadProductImage(imageFile, formData.name);
      }

      await addProduct({
        name: formData.name,
        description: formData.description || undefined,
        manufacturer: formData.manufacturer || undefined,
        price: parseFloat(formData.price),
        category_id: formData.category_id,
        image_url: imageUrl || undefined
      });

      toast({
        title: 'Success',
        description: 'Product added successfully!',
        variant: 'default'
      });

      setFormData({
        name: '',
        description: '',
        manufacturer: '',
        price: '',
        category_id: ''
      });
      setImageFile(null);
      setIsOpen(false);
      onProductAdded();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add product',
        variant: 'destructive'
      });
    }
    setLoading(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="btn-futuristic fixed bottom-6 right-6 z-50 shadow-2xl">
          <Plus className="h-5 w-5 mr-2" />
          Add Product
        </Button>
      </DialogTrigger>
      
      <DialogContent className="glass-card max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gradient-primary text-xl">
            Add New Product
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="glass"
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select 
              value={formData.category_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
            >
              <SelectTrigger className="glass">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="manufacturer">Manufacturer</Label>
            <Input
              id="manufacturer"
              value={formData.manufacturer}
              onChange={(e) => setFormData(prev => ({ ...prev, manufacturer: e.target.value }))}
              className="glass"
              placeholder="Enter manufacturer"
            />
          </div>

          <div>
            <Label htmlFor="price">Price (₸) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              className="glass"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="glass resize-none"
              placeholder="Product description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="image">Product Image</Label>
            <div className="glass border-dashed border-2 border-border/50 rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <Label htmlFor="image" className="cursor-pointer flex flex-col items-center space-y-2">
                <Upload className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {imageFile ? imageFile.name : 'Click to upload image'}
                </span>
              </Label>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full btn-futuristic" 
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Product'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};