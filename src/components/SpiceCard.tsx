import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/hooks/useSpiceData";
import { MoreHorizontal, Edit, Trash2, Star, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SpiceCardProps {
  product: Product;
  isAdmin?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
}

export const SpiceCard = ({ product, isAdmin, onEdit, onDelete }: SpiceCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { addToCart } = useCart();
  const { t } = useTranslation();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to product page
    addToCart(product);
    toast({
      title: t('success'),
      description: `${product.name} has been added to your cart.`,
      variant: 'default'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(product.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <Link to={`/product/${product.id}`} className="block">
        <CardHeader className="pb-3">
          <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-muted">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl text-muted-foreground">
                📦
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg leading-tight line-clamp-2">
                {product.name}
              </CardTitle>
              {isAdmin && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        onEdit?.(product);
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      {t('edit')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete();
                      }}
                      className="text-destructive"
                      disabled={isDeleting}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {isDeleting ? t('loading') : t('delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {product.category && (
              <Badge variant="secondary" className="text-xs">
                {product.category.name}
              </Badge>
            )}

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center space-x-1">
                <div className="flex items-center">
                  {renderStars(product.rating)}
                </div>
                <span className="text-xs text-muted-foreground">
                  {product.rating.toFixed(1)} ({product.review_count || 0} reviews)
                </span>
              </div>
            )}
          </div>
        </CardHeader>
      </Link>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          )}
          
          {product.manufacturer && (
            <p className="text-xs text-muted-foreground">
              by {product.manufacturer}
            </p>
          )}
          
          <div className="flex items-center justify-between gap-2">
            <span className="text-lg font-bold text-primary">
              ₸{product.price.toFixed(2)}
            </span>
          </div>
          
          <div className="flex flex-col gap-2 mt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddToCart}
              className="w-full"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {t('addToCart')}
            </Button>
            <Link to={`/product/${product.id}`} className="w-full">
              <Button size="sm" className="w-full">
                {t('viewDetails')}
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};