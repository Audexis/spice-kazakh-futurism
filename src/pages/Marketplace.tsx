
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { SpiceCard } from "@/components/SpiceCard";
import { AdminPanel } from "@/components/AdminPanel";
import { OrderManagement } from "@/components/OrderManagement";
import { AdminProductEdit } from "@/components/AdminProductEdit";
import { useSpiceData } from "@/hooks/useSpiceData";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter } from "lucide-react";
import { Product } from "@/hooks/useSpiceData";

const Marketplace = () => {
  const { categories, products, loading } = useSpiceData();
  const { adminUser } = useAdminAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Filter products based on category and search query
  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.manufacturer?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const handleProductUpdated = () => {
    setEditingProduct(null);
  };

  if (isAdminMode && adminUser) {
    return (
      <>
        <Navbar 
          isAdmin={isAdminMode} 
          onAdminToggle={() => setIsAdminMode(!isAdminMode)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
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
      <Navbar 
        isAdmin={isAdminMode} 
        onAdminToggle={() => setIsAdminMode(!isAdminMode)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border-b border-border/20">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold font-orbitron text-primary-gradient mb-6">
              Spice Marketplace
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse our complete collection of premium Kazakhstani spices and seasonings
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Products */}
      <div className="container mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </span>
          </div>
          
          {(selectedCategory || searchQuery) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCategory(null);
                setSearchQuery("");
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card-modern h-96 animate-pulse bg-muted/50" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="relative">
                <SpiceCard product={product} />
                {isAdminMode && adminUser && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingProduct(product)}
                    className="absolute top-2 right-2 z-10 bg-background/90 backdrop-blur-sm"
                  >
                    Edit
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory(null);
                setSearchQuery("");
              }}
            >
              View All Products
            </Button>
          </div>
        )}

        {/* Admin Panel for adding products */}
        {isAdminMode && adminUser && (
          <AdminPanel categories={categories} onProductAdded={handleProductUpdated} />
        )}
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
  );
};

export default Marketplace;
