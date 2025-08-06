import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Globe, Star } from 'lucide-react';
import { SpiceCard } from '@/components/SpiceCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { SpiceCollisionAnimation } from '@/components/SpiceCollisionAnimation';
import { FuturisticScrollHint } from '@/components/FuturisticScrollHint';
import { AdminPanel } from '@/components/AdminPanel';
import { Navbar } from '@/components/Navbar';
import { useSpiceData } from '@/hooks/useSpiceData';
import { useToast } from '@/hooks/use-toast';
import anime from 'animejs';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { categories, products, loading, deleteProduct, refetch } = useSpiceData();
  const { toast } = useToast();

  // Show only top 10 highest rated products on home page
  const topRatedProducts = useMemo(() => {
    return products
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 10)
      .filter(product => {
        if (selectedCategory) {
          return product.category_id === selectedCategory;
        }
        if (searchQuery) {
          return product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 product.manufacturer?.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
      });
  }, [products, selectedCategory, searchQuery]);

  useEffect(() => {
    // Animate content sections on scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          anime({
            targets: entry.target,
            opacity: [0, 1],
            translateY: [50, 0],
            duration: 800,
            easing: 'easeOutQuart'
          });
        }
      });
    }, observerOptions);

    const contentSections = document.querySelectorAll('.animate-on-scroll');
    contentSections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

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
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar 
        isAdmin={isAdmin}
        onAdminToggle={() => setIsAdmin(!isAdmin)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Immersive 3D Hero Section */}
      <section className="h-screen relative overflow-hidden bg-background">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90" />
        
        {/* Spice Collision Animation */}
        <SpiceCollisionAnimation />

        {/* Subtitle overlay */}
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 text-center z-40">
          <h1 className="text-5xl font-orbitron font-bold text-primary-gradient mb-4">
            SPICE BAZAAR
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-4 font-exo">
            Experience authentic Indian flavors with our curated selection of premium spices and traditional ingredients
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-exo">
            <Star className="h-4 w-4 fill-current text-yellow-500" />
            <span>4.9/5 from 500+ customers in Kazakhstan</span>
          </div>
        </div>

        {/* Futuristic scroll hint */}
        <FuturisticScrollHint onClick={scrollToContent} />
      </section>

      {/* Content Section */}
      <div ref={contentRef} className="relative bg-background z-20 min-h-screen">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, hsl(var(--primary)) 0%, transparent 50%), 
                             radial-gradient(circle at 80% 50%, hsl(var(--primary)) 0%, transparent 50%)`
          }} />
        </div>

        <main className="relative container mx-auto px-4 py-20 space-y-16">
          {/* Featured Products Section */}
          <div className="animate-on-scroll">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-orbitron font-bold text-primary-gradient mb-4">
                TOP RATED PRODUCTS
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto font-exo mb-6">
                Discover our most loved spices and ingredients, highly rated by customers across Kazakhstan
              </p>
              <Link to="/marketplace">
                <Button variant="outline" className="mb-8">
                  View Full Marketplace →
                </Button>
              </Link>
            </div>

            {/* Quick Category Filter */}
            <div className="flex justify-center">
              <CategoryFilter 
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {topRatedProducts.map((product) => (
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

            {topRatedProducts.length === 0 && (
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
          </div>
        </main>
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
};

export default Index;
