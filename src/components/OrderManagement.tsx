import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Calendar, DollarSign, Mail, Package, Clock, FileText, Eye, EyeOff } from "lucide-react";

type OrderStatus = "pending" | "confirmed" | "preparing" | "in_transit" | "delivered" | "cancelled";

interface Order {
  id: string;
  customer_email: string;
  total_amount: number;
  status: OrderStatus;
  admin_notes: string | null;
  created_at: string;
  status_updated_at: string;
  order_items: Array<{
    product_id: string;
    quantity: number;
    price: number;
  }>;
}

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "confirmed": return "bg-blue-100 text-blue-800 border-blue-200";
    case "preparing": return "bg-purple-100 text-purple-800 border-purple-200";
    case "in_transit": return "bg-orange-100 text-orange-800 border-orange-200";
    case "delivered": return "bg-green-100 text-green-800 border-green-200";
    case "cancelled": return "bg-red-100 text-red-800 border-red-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const { adminUser } = useAdminAuth();

  const toggleOrderExpanded = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, 
          customer_email, 
          total_amount, 
          status, 
          admin_notes, 
          created_at, 
          status_updated_at,
          order_items (product_id, quantity, price)
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
          status: newStatus as OrderStatus,
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

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold font-serif text-red-700">Order Management</h2>
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold font-serif text-red-700">Order Management</h2>
        <Badge variant="secondary" className="text-sm px-3 py-1">
          {orders.length} Total Orders
        </Badge>
      </div>
      
      <div className="space-y-4">
        {orders.map((order) => {
          const isExpanded = expandedOrders.has(order.id);
          const totalItems = order.order_items.reduce((sum, item) => sum + item.quantity, 0);
          
          return (
            <Card key={order.id} className="overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 border-l-red-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        Order #{order.id.slice(0, 8)}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        <Calendar className="inline h-4 w-4 mr-1" />
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge 
                      className={`${getStatusColor(order.status)} border px-3 py-1 font-medium`}
                      variant="outline"
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleOrderExpanded(order.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {isExpanded ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {isExpanded ? 'Hide' : 'Show'} Details
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {/* Always visible summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-medium">{order.customer_email}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Total:</span>
                    <span className="font-medium text-green-700">${order.total_amount.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Items:</span>
                    <span className="font-medium">{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Status update controls */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Update Status:</label>
                    <Select
                      disabled={updatingOrder === order.id}
                      onValueChange={(value) => updateOrderStatus(order.id, value)}
                      value={order.status}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
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
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    {/* Order items */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Order Items
                      </h4>
                      <div className="bg-gray-50 rounded-lg p-3">
                        {order.order_items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center py-1">
                            <span className="text-sm text-gray-600">
                              Product ID: {item.product_id.slice(0, 8)}...
                            </span>
                            <div className="text-sm">
                              <span className="text-gray-600">Qty: </span>
                              <span className="font-medium">{item.quantity}</span>
                              <span className="text-gray-600 mx-2">•</span>
                              <span className="font-medium text-green-700">${item.price.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Timestamps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-sm">
                        <span className="text-gray-600 flex items-center gap-1 mb-1">
                          <Clock className="h-3 w-3" />
                          Order Created:
                        </span>
                        <span className="font-medium">{formatDate(order.created_at)}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600 flex items-center gap-1 mb-1">
                          <Clock className="h-3 w-3" />
                          Last Updated:
                        </span>
                        <span className="font-medium">{formatDate(order.status_updated_at)}</span>
                      </div>
                    </div>

                    {/* Admin notes */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Admin Notes
                      </h4>
                      {editingNotes === order.id ? (
                        <div className="space-y-3">
                          <Textarea
                            placeholder="Add notes about this order..."
                            defaultValue={order.admin_notes || ""}
                            onChange={(e) => setNoteText(e.target.value)}
                            className="min-h-[80px]"
                          />
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setEditingNotes(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => saveNotes(order.id)}
                              disabled={updatingOrder === order.id}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {updatingOrder === order.id ? 'Saving...' : 'Save Notes'}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-700 mb-3">
                            {order.admin_notes || "No notes added yet."}
                          </p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              setEditingNotes(order.id);
                              setNoteText(order.admin_notes || "");
                            }}
                          >
                            {order.admin_notes ? 'Edit Notes' : 'Add Notes'}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {orders.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-500">Orders will appear here when customers place them.</p>
        </div>
      )}
    </div>
  );
};
