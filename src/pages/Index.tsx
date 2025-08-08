
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Navbar } from "@/components/Navbar";
import indianSpicesBackground from "@/assets/indian-spices-background.jpg";
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
  const { t } = useTranslation();
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
                {t('admin.dashboard')}
              </h1>
              <p className="text-muted-foreground">
                {t('admin.welcome_back', { name: adminUser.name })}
              </p>
            </div>

            <Tabs defaultValue="orders" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="orders">{t('admin.order_management')}</TabsTrigger>
                <TabsTrigger value="products">{t('admin.product_management')}</TabsTrigger>
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
                          {t('common.edit')}
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
      <div className="relative overflow-hidden min-h-screen">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${indianSpicesBackground})` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-32 text-center flex items-center justify-center min-h-screen">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold font-serif text-white mb-6 drop-shadow-2xl">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow-lg">
              {t('hero.subtitle')}
            </p>
            <p className="text-lg text-white/80 mb-6 drop-shadow-lg">
              {t('hero.description')}
            </p>
            <div className="bg-red-600/20 border border-red-400/30 rounded-lg px-6 py-3 mb-8 backdrop-blur-sm">
              <p className="text-white font-semibold text-sm uppercase tracking-wide mb-1">
                🚚 {t('hero.delivery_title')}
              </p>
              <p className="text-white/90 text-sm">
                {t('hero.delivery_description')}
              </p>
            </div>
            <Button 
              size="lg" 
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4 text-lg shadow-xl"
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('common.shop_now')}
            </Button>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div id="products" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-serif text-red-700 mb-4">
            {t('products.section_title')}
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            {t('products.section_description')}
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
