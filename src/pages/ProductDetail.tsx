import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Star, ShoppingCart, Heart, Share2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { ReviewForm } from '@/components/ReviewForm';

interface Product {
  id: string;
  name: string;
  description?: string;
  manufacturer?: string;
  price: number;
  image_url?: string;
  rating?: number;
  review_count?: number;
  category?: {
    name: string;
    slug: string;
  };
}

interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchReviews();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name, slug)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleAddToCart = () => {
    if (product) {
      // Convert to cart-compatible format
      const cartProduct = {
        ...product,
        category_id: product.category?.slug || 'uncategorized',
        category: product.category ? {
          ...product.category,
          id: product.category.slug,
          description: undefined
        } : undefined
      };
      addToCart(cartProduct);
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart`,
        variant: 'default'
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Product link has been copied to clipboard",
      variant: 'default'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-32"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-6 bg-muted rounded w-1/4"></div>
                <div className="h-20 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">
              {error || "The product you're looking for doesn't exist or has been removed."}
            </p>
            <Link to="/marketplace">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Product Hero Banner */}
      <div className="bg-gradient-to-r from-primary/20 to-primary/10 py-12">
        <div className="container mx-auto px-4">
          <Link to="/marketplace" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="aspect-square bg-background rounded-lg p-8 flex items-center justify-center">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              ) : (
                <div className="text-6xl text-muted-foreground">📦</div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
               <div>
                  <Badge variant="secondary" className="mb-2">
                    {product.category?.name}
                 </Badge>
                 <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
                <p className="text-lg text-muted-foreground">{product.manufacturer}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {renderStars(product.rating || 0)}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating?.toFixed(1)} ({product.review_count || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="text-3xl font-bold text-primary">
                ₸{product.price.toFixed(2)}
              </div>

              {/* Product Details Grid */}
              <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                 <div>
                   <h4 className="font-semibold text-sm text-muted-foreground">SKU</h4>
                   <p className="text-sm">{product.id.slice(0, 8).toUpperCase()}</p>
                 </div>
                 <div>
                   <h4 className="font-semibold text-sm text-muted-foreground">Category</h4>
                   <p className="text-sm">{product.category?.name || 'Uncategorized'}</p>
                 </div>
                 <div>
                   <h4 className="font-semibold text-sm text-muted-foreground">Manufacturer</h4>
                   <p className="text-sm">{product.manufacturer || 'N/A'}</p>
                 </div>
                 <div>
                   <h4 className="font-semibold text-sm text-muted-foreground">Availability</h4>
                   <p className="text-sm text-green-600">In Stock</p>
                 </div>
              </div>

              {/* Description */}
               <div>
                 <h3 className="text-lg font-semibold mb-2">Product Description</h3>
                 <p className="text-muted-foreground leading-relaxed">
                   {product.description || 'Experience the authentic flavors of traditional Indian cuisine with this premium product. Carefully sourced and selected for quality, this item brings the essence of Indian culinary heritage to your kitchen.'}
                </p>
               </div>

              {/* Features */}
               <div>
                 <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                 <ul className="space-y-2 text-sm text-muted-foreground">
                   <li className="flex items-center">
                     <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                     Premium Quality
                   </li>
                   <li className="flex items-center">
                     <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                     Traditional Sourcing
                   </li>
                   <li className="flex items-center">
                     <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                     Carefully Processed
                   </li>
                   <li className="flex items-center">
                     <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                     Authentic Flavor
                   </li>
                 </ul>
               </div>

              {/* Shipping Info */}
               <div className="bg-primary/10 p-4 rounded-lg">
                 <h4 className="font-semibold mb-2">Shipping Information</h4>
                 <div className="space-y-1 text-sm text-muted-foreground">
                   <p>• Free shipping on orders over ₸5000</p>
                   <p>• Express delivery: 1-2 business days</p>
                   <p>• Standard delivery: 3-5 business days</p>
                   <p>• International shipping available</p>
                 </div>
               </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                 <Button onClick={handleAddToCart} className="flex-1 min-w-0">
                   <ShoppingCart className="h-4 w-4 mr-2" />
                   Add to Cart
                 </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="shrink-0">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleShare} className="shrink-0">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="container mx-auto px-4 py-12 space-y-8">
        {/* Review Form */}
        <ReviewForm 
          productId={product.id} 
          onReviewSubmitted={() => {
            fetchReviews();
            fetchProduct(); // Refresh to get updated ratings
          }} 
        />
        
        {/* Reviews List */}
        <Card>
          <CardHeader>
             <CardTitle className="flex items-center justify-between">
               <span>Customer Reviews</span>
               <Badge variant="outline">{reviews.length} reviews</Badge>
             </CardTitle>
          </CardHeader>
          <CardContent>
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <div key={review.id}>
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {review.user_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium">{review.user_name}</span>
                          <div className="flex items-center">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-muted-foreground">{review.comment}</p>
                        )}
                      </div>
                    </div>
                    {index < reviews.length - 1 && <Separator className="mt-6" />}
                  </div>
                ))}
              </div>
            ) : (
               <div className="text-center py-8">
                 <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
               </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}