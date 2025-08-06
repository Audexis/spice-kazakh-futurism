import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SpiceCard } from '@/components/SpiceCard';
import { AdminPanel } from '@/components/AdminPanel';
import { Navbar } from '@/components/Navbar';
import { useSpiceData } from '@/hooks/useSpiceData';
import { useToast } from '@/hooks/use-toast';
import { Search } from 'lucide-react';

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high' | 'rating'>('name');
  const [isAdmin, setIsAdmin] = useState(false);
  const { categories, products, loading, deleteProduct, refetch } = useSpiceData();
  const { toast } = useToast();

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category_id === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.manufacturer?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort products
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });
    
    return sorted;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id);
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
        variant: 'default'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive'
      });
    }
  };

  const handleProductAdded = () => {
    refetch();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading marketplace...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        isAdmin={isAdmin}
        onAdminToggle={() => setIsAdmin(!isAdmin)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-heading font-bold text-primary-gradient">
            MARKETPLACE
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our complete collection of authentic spices, grains, and traditional ingredients
          </p>
          <div className="text-sm text-muted-foreground">
            Showing {filteredAndSortedProducts.length} of {products.length} products
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Horizontal Category Filter */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-center">Browse Categories</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="rounded-full"
            >
              All Products
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="rounded-full"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Section */}
        <div className="space-y-6">
          {/* Sort Controls */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Products</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="price-low">Price (Low to High)</SelectItem>
                  <SelectItem value="price-high">Price (High to Low)</SelectItem>
                  <SelectItem value="rating">Rating (High to Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid */}
          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <SpiceCard
                  key={product.id}
                  product={product}
                  isAdmin={isAdmin}
                  onEdit={(product) => {
                    toast({
                      title: 'Edit Product',
                      description: 'Edit functionality coming soon!',
                      variant: 'default'
                    });
                  }}
                  onDelete={handleDeleteProduct}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-muted-foreground mb-2">
                No products found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Admin Panel */}
      {isAdmin && (
        <AdminPanel 
          categories={categories}
          onProductAdded={handleProductAdded}
        />
      )}
    </div>
  );
}