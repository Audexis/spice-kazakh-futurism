import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Edit, Trash2 } from 'lucide-react';
import { Product } from '@/hooks/useSpiceData';
import anime from 'animejs';

interface SpiceCardProps {
  product: Product;
  isAdmin?: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
}

export const SpiceCard = ({ product, isAdmin, onEdit, onDelete }: SpiceCardProps) => {
  const [cardRef, setCardRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (cardRef) {
      // Animate card entrance
      anime({
        targets: cardRef,
        opacity: [0, 1],
        translateY: [50, 0],
        scale: [0.8, 1],
        duration: 800,
        easing: 'easeOutElastic(1, .5)',
        delay: Math.random() * 200
      });
    }
  }, [cardRef]);

  const handleWhatsAppOrder = () => {
    const message = `Hello, I'm interested in buying ${product.name} from your Kazakh e-store. Please provide more details.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/+91XXXXXXXXXX?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCardHover = () => {
    if (cardRef) {
      anime({
        targets: cardRef,
        scale: 1.05,
        rotateY: 5,
        rotateX: 5,
        duration: 300,
        easing: 'easeOutQuart'
      });
    }
  };

  const handleCardLeave = () => {
    if (cardRef) {
      anime({
        targets: cardRef,
        scale: 1,
        rotateY: 0,
        rotateX: 0,
        duration: 300,
        easing: 'easeOutQuart'
      });
    }
  };

  return (
    <Card 
      ref={setCardRef}
      className="glass-card card-3d group overflow-hidden hover:shadow-2xl transition-all duration-500"
      onMouseEnter={handleCardHover}
      onMouseLeave={handleCardLeave}
    >
      <div className="relative aspect-square overflow-hidden rounded-t-2xl">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-spice-saffron to-spice-paprika flex items-center justify-center">
            <span className="text-6xl opacity-20">🌶️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {isAdmin && (
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button 
              size="sm" 
              variant="secondary" 
              className="glass h-8 w-8 p-0"
              onClick={() => onEdit?.(product)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="destructive" 
              className="h-8 w-8 p-0"
              onClick={() => onDelete?.(product.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}

        <Badge className="absolute top-2 left-2 bg-gradient-to-r from-spice-saffron to-spice-turmeric text-black font-semibold">
          {product.category?.name}
        </Badge>
      </div>

      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-gradient-primary group-hover:text-gradient-cosmic transition-all duration-300">
            {product.name}
          </h3>
          {product.manufacturer && (
            <p className="text-sm text-muted-foreground font-medium">
              by {product.manufacturer}
            </p>
          )}
        </div>

        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="text-2xl font-bold text-gradient-spice">
            ₸{product.price.toFixed(2)}
          </div>
          
          <Button 
            onClick={handleWhatsAppOrder}
            className="btn-futuristic relative z-10"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Buy Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};