import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Globe, Star, Sparkles } from 'lucide-react';
import { SpiceCard } from '@/components/SpiceCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { SpiceScene } from '@/components/SpiceScene';
import { AdminPanel } from '@/components/AdminPanel';
import { useSpiceData } from '@/hooks/useSpiceData';
import { useToast } from '@/hooks/use-toast';
import anime from 'animejs';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false); // For demo purposes - in real app, check auth
  const { categories, products, loading, deleteProduct, refetch } = useSpiceData();
  const { toast } = useToast();

  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category_id === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.manufacturer?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [products, selectedCategory, searchQuery]);

  useEffect(() => {
    // Animate hero section on load
    anime({
      targets: '.hero-element',
      opacity: [0, 1],
      translateY: [100, 0],
      scale: [0.8, 1],
      duration: 1200,
      delay: anime.stagger(200),
      easing: 'easeOutElastic(1, .5)'
    });
  }, []);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading spice marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-md bg-background/80">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg"></div>
            <h1 className="text-xl font-semibold">Spice Bazaar</h1>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdmin(!isAdmin)}
            className="focus-ring"
          >
            {isAdmin ? '👤 User' : '🔧 Admin'}
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-12">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="animate-fade-in">
              <Badge variant="secondary" className="mb-4">
                <Globe className="h-4 w-4 mr-2" />
                Authentic Indian Spices in Kazakhstan
              </Badge>
            </div>

            <h1 className="animate-slide-up text-5xl md:text-6xl font-bold text-primary-gradient">
              Premium Spice Collection
            </h1>

            <p className="animate-slide-up text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience authentic Indian flavors with our curated selection of premium spices, 
              traditional snacks, and specialty ingredients.
            </p>

            <div className="animate-slide-up flex items-center justify-center gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <span>4.9/5 from 500+ customers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-20 space-y-8">
        {/* Search Bar */}
        <div className="card-modern max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 focus-ring"
            />
          </div>
        </div>

        {/* Category Filter */}
        <CategoryFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
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

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-muted-foreground mb-2">
              No products found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or category filter
            </p>
          </div>
        )}
      </main>

      {/* Admin Panel */}
      {isAdmin && (
        <AdminPanel 
          categories={categories}
          onProductAdded={handleProductAdded}
        />
      )}
    </div>
  );
};

export default Index;
