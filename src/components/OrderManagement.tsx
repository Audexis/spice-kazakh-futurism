import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";

type OrderStatus = "pending" | "confirmed" | "preparing" | "in_transit" | "delivered" | "cancelled";

interface Order {
  id: string;
  user_email: string;
  total_amount: number;
  status: OrderStatus;
  admin_notes: string | null;
  created_at: string;
  status_updated_at: string;
  items: Array<{
    product_name: string;
    quantity: number;
    price: number;
  }>;
}

export const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const { toast } = useToast();
  const { adminUser } = useAdminAuth();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, 
          user_email, 
          total_amount, 
          status, 
          admin_notes, 
          created_at, 
          status_updated_at,
          items (product_name, quantity, price)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOrders(data as Order[]);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string, notes?: string) => {
    if (!adminUser) return;
    
    setUpdatingOrder(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: newStatus as OrderStatus, // Cast string to OrderStatus type
          admin_notes: notes || null,
          updated_by_admin: adminUser.id
        })
        .eq('id', orderId);

      if (error) throw error;

      await fetchOrders();
      toast({
        title: "Order updated",
        description: `Order status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    } finally {
      setUpdatingOrder(null);
    }
  };

  const saveNotes = async (orderId: string) => {
    if (!adminUser) return;

    setUpdatingOrder(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          admin_notes: noteText,
          updated_by_admin: adminUser.id
        })
        .eq('id', orderId);

      if (error) throw error;

      await fetchOrders();
      toast({
        title: "Notes saved",
        description: "Admin notes have been updated",
      });
    } catch (error) {
      console.error('Error saving notes:', error);
      toast({
        title: "Error",
        description: "Failed to save notes",
        variant: "destructive",
      });
    } finally {
      setUpdatingOrder(null);
      setEditingNotes(null);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Order Management</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle>Order ID: {order.id}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>User Email: {order.user_email}</p>
                <p>Total Amount: ${order.total_amount}</p>
                <Badge variant="secondary">{order.status}</Badge>
                <p>Created At: {new Date(order.created_at).toLocaleString()}</p>
                <p>Status Updated At: {new Date(order.status_updated_at).toLocaleString()}</p>
                <div>
                  <h3 className="text-sm font-semibold">Items:</h3>
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index} className="text-xs">
                        {item.quantity} x {item.product_name} - ${item.price}
                      </li>
                    ))}
                  </ul>
                </div>
                <Select
                  disabled={updatingOrder === order.id}
                  onValueChange={(value) => updateOrderStatus(order.id, value)}
                >
                  <SelectTrigger className="w-[100%]">
                    <SelectValue placeholder={order.status} />
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
                <div>
                  <h3 className="text-sm font-semibold">Admin Notes:</h3>
                  {editingNotes === order.id ? (
                    <div className="space-y-2">
                      <Textarea
                        defaultValue={order.admin_notes || ""}
                        onChange={(e) => setNoteText(e.target.value)}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditingNotes(null)}>
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => saveNotes(order.id)}
                          disabled={updatingOrder === order.id}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm">{order.admin_notes || "No notes"}</p>
                      <Button variant="outline" size="sm" onClick={() => {
                        setEditingNotes(order.id);
                        setNoteText(order.admin_notes || "");
                      }}>
                        Edit Notes
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
