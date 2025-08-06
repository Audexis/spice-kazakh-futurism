
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { PhysicsSpiceScene } from "@/components/PhysicsSpiceScene";
import { CategoryFilter } from "@/components/CategoryFilter";
import { SpiceCard } from "@/components/SpiceCard";
import { AdminPanel } from "@/components/AdminPanel";
import { OrderManagement } from "@/components/OrderManagement";
import { AdminProductEdit } from "@/components/AdminProductEdit";
import { useSpiceData } from "@/hooks/useSpiceData";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from "@/hooks/useSpiceData";

const Index = () => {
  const { categories, products, loading } = useSpiceData();
  const { adminUser } = useAdminAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = selectedCategory
    ? products.filter(product => product.category_id === selectedCategory)
    : products;

  const handleProductUpdated = () => {
    // The useSpiceData hook will automatically refresh
    setEditingProduct(null);
  };

  if (isAdminMode && adminUser) {
    return (
      <>
        <Navbar 
          isAdmin={isAdminMode} 
          onAdminToggle={() => setIsAdminMode(!isAdminMode)} 
        />
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold font-orbitron text-primary-gradient mb-2">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Welcome back, {adminUser.name}
              </p>
            </div>

            <Tabs defaultValue="orders" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="orders">Order Management</TabsTrigger>
                <TabsTrigger value="products">Product Management</TabsTrigger>
              </TabsList>
              
              <TabsContent value="orders">
                <OrderManagement />
              </TabsContent>
              
              <TabsContent value="products">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                      <div key={product.id} className="relative">
                        <SpiceCard product={product} />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingProduct(product)}
                          className="absolute top-2 right-2 z-10 bg-background/90 backdrop-blur-sm"
                        >
                          Edit
                        </Button>
                      </div>
                    ))}
                  </div>
                  <AdminPanel categories={categories} onProductAdded={handleProductUpdated} />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {editingProduct && (
            <AdminProductEdit
              product={editingProduct}
              categories={categories}
              isOpen={!!editingProduct}
              onClose={() => setEditingProduct(null)}
              onProductUpdated={handleProductUpdated}
            />
          )}
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAdmin={isAdminMode} onAdminToggle={() => setIsAdminMode(!isAdminMode)} />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <PhysicsSpiceScene />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-32 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold font-orbitron text-primary-gradient mb-6 animate-fade-up">
              Kazakhstani Spice Marketplace
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-up animation-delay-200">
              Discover authentic flavors from the heart of Central Asia
            </p>
            <Button 
              size="lg" 
              className="btn-primary animate-fade-up animation-delay-400"
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Products
            </Button>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div id="products" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-orbitron text-primary-gradient mb-4">
            Premium Spices
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hand-selected spices sourced directly from trusted farmers across Kazakhstan
          </p>
        </div>

        <div className="mb-8">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card-modern h-96 animate-pulse bg-muted/50" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <SpiceCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
