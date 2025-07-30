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
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}} />
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="hero-element opacity-0">
              <Badge className="mb-6 bg-gradient-to-r from-spice-saffron to-spice-paprika text-black font-semibold px-4 py-2">
                <Globe className="h-4 w-4 mr-2" />
                Authentic Indian Spices in Kazakhstan
              </Badge>
            </div>

            <h1 className="hero-element opacity-0 text-5xl md:text-7xl font-bold text-gradient-cosmic leading-tight">
              Spice Bazaar
              <span className="block text-gradient-spice">Kazakhstan</span>
            </h1>

            <p className="hero-element opacity-0 text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Experience the authentic flavors of India with our premium collection of spices, 
              snacks, and traditional ingredients delivered fresh to your doorstep.
            </p>

            <div className="hero-element opacity-0 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button className="btn-futuristic text-lg px-8 py-4">
                <Sparkles className="h-5 w-5 mr-2" />
                Explore Collection
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <span>4.9/5 rating from 500+ customers</span>
              </div>
            </div>
          </div>

          {/* 3D Spice Scene */}
          <div className="hero-element opacity-0 mt-16">
            <SpiceScene />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative container mx-auto px-4 pb-20">
        {/* Search Bar */}
        <div className="glass-card p-6 mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search spices, snacks, or brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass text-lg"
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

      {/* Admin Toggle (for demo) */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsAdmin(!isAdmin)}
        className="fixed top-4 right-4 glass z-50"
      >
        {isAdmin ? '👤 User Mode' : '🔧 Admin Mode'}
      </Button>
    </div>
  );
};

export default Index;
