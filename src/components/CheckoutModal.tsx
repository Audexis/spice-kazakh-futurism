import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, Mail, Phone } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, getCartTotal, clearCart } = useCart();
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const { toast } = useToast();

  const handleSubmitOrder = async () => {
    if (!customerEmail || !customerWhatsapp) {
      toast({
        title: 'Missing Information',
        description: 'Please provide both email and WhatsApp number.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_email: customerEmail,
          customer_whatsapp: customerWhatsapp,
          total_amount: getCartTotal()
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Send Discord webhook
      const webhookData = {
        customer_email: customerEmail,
        customer_whatsapp: customerWhatsapp,
        total_amount: getCartTotal(),
        order_items: items.map(item => ({
          product_name: item.product.name,
          quantity: item.quantity,
          price: item.product.price
        }))
      };

      await supabase.functions.invoke('send-order-webhook', {
        body: webhookData
      });

      setOrderPlaced(true);
      clearCart();
      
      toast({
        title: 'Order Placed Successfully!',
        description: 'We will contact you within 12 hours to confirm your order.',
        variant: 'default'
      });

    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: 'Order Failed',
        description: 'There was an error placing your order. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCustomerEmail('');
    setCustomerWhatsapp('');
    setOrderPlaced(false);
    onClose();
  };

  const handleWhatsAppContact = () => {
    // This will be updated with the actual WhatsApp link later
    toast({
      title: 'WhatsApp Contact',
      description: 'WhatsApp integration coming soon! We will contact you via the provided number.',
    });
  };

  if (orderPlaced) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-green-600">
              🎉 Order Placed Successfully!
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center space-y-4 py-6">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-lg font-semibold">Thank you for your order!</h3>
            <p className="text-muted-foreground">
              We will contact you within the next 12 hours to arrange payment and delivery.
            </p>
            
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm">
                <Mail className="h-4 w-4" />
                <span>{customerEmail}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm">
                <Phone className="h-4 w-4" />
                <span>{customerWhatsapp}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button onClick={handleWhatsAppContact} variant="outline" className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact us on WhatsApp
              </Button>
              
              <Button onClick={handleClose} className="w-full">
                Continue Shopping
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <div>
            <h3 className="font-semibold mb-3">Order Summary</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span>{item.product.name} x{item.quantity}</span>
                  <span>₸{(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>₸{getCartTotal().toFixed(2)}</span>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact Information</h3>
            
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <Input
                id="whatsapp"
                type="tel"
                value={customerWhatsapp}
                onChange={(e) => setCustomerWhatsapp(e.target.value)}
                placeholder="+7 xxx xxx xxxx"
                required
              />
            </div>
          </div>

          {/* Order Information */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">What happens next?</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• We'll contact you within 12 hours</li>
              <li>• Confirm your order details</li>
              <li>• Arrange payment and delivery</li>
              <li>• You can also contact us directly on WhatsApp</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitOrder} 
              disabled={isSubmitting || !customerEmail || !customerWhatsapp}
              className="flex-1"
            >
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}