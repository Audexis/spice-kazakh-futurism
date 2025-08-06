
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Package, Clock, Truck, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Order {
  id: string;
  customer_email: string;
  customer_whatsapp: string;
  total_amount: number;
  status: string;
  admin_notes: string | null;
  created_at: string;
  status_updated_at: string;
  order_items: Array<{
    id: string;
    quantity: number;
    price: number;
    product_id: string;
  }>;
}

const statusIcons = {
  pending: <Clock className="h-4 w-4" />,
  confirmed: <CheckCircle className="h-4 w-4" />,
  preparing: <Package className="h-4 w-4" />,
  in_transit: <Truck className="h-4 w-4" />,
  delivered: <CheckCircle className="h-4 w-4" />,
  cancelled: <XCircle className="h-4 w-4" />
};

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
  confirmed: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
  preparing: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
  in_transit: 'bg-orange-500/10 text-orange-700 border-orange-500/20',
  delivered: 'bg-green-500/10 text-green-700 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-700 border-red-500/20'
};

export const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();
  const { adminUser } = useAdminAuth();

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            price,
            product_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch orders',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async () => {
    if (!selectedOrder || !newStatus || !adminUser) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: newStatus,
          admin_notes: adminNotes || null,
          updated_by_admin: adminUser.id
        })
        .eq('id', selectedOrder.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Order status updated successfully',
      });

      // Refresh orders
      await fetchOrders();
      setSelectedOrder(null);
      setNewStatus('');
      setAdminNotes('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive'
      });
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="flex justify-center p-8">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-orbitron">
            <Package className="h-5 w-5" />
            Order Management Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">
                      {order.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customer_email}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.customer_whatsapp}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ₸{order.total_amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${statusColors[order.status as keyof typeof statusColors]} flex items-center gap-1 w-fit`}>
                        {statusIcons[order.status as keyof typeof statusIcons]}
                        {order.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedOrder(order);
                          setNewStatus(order.status);
                          setAdminNotes(order.admin_notes || '');
                        }}
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {orders.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No orders found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedOrder && (
        <Card>
          <CardHeader>
            <CardTitle className="font-orbitron">Update Order Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Customer Email</Label>
                <p className="text-sm text-muted-foreground">{selectedOrder.customer_email}</p>
              </div>
              <div>
                <Label>WhatsApp</Label>
                <p className="text-sm text-muted-foreground">{selectedOrder.customer_whatsapp}</p>
              </div>
            </div>

            <div>
              <Label htmlFor="status">Order Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="admin-notes">Admin Notes</Label>
              <Textarea
                id="admin-notes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add any notes about this order..."
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={updateOrderStatus}
                disabled={updating}
                className="btn-primary"
              >
                {updating ? 'Updating...' : 'Update Order'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedOrder(null)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
