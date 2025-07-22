import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Package, Truck, Home, X } from 'lucide-react';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number | null;
}

export default function OrderTrackingModal({ isOpen, onClose, orderId }: OrderTrackingModalProps) {
  const { data: order } = useQuery({
    queryKey: ['/api/orders', orderId],
    queryFn: () => api.orders.getById(orderId!),
    enabled: !!orderId,
  });

  const trackingSteps = [
    {
      id: 'confirmed',
      title: 'Order Confirmed',
      description: 'Your ghost order has been received',
      icon: CheckCircle,
      completed: true,
    },
    {
      id: 'processing',
      title: 'Processing',
      description: 'Preparing your imaginary items',
      icon: Package,
      completed: true,
    },
    {
      id: 'shipped',
      title: 'Shipped',
      description: 'Will never actually ship!',
      icon: Truck,
      completed: false,
    },
    {
      id: 'delivered',
      title: 'Delivered',
      description: 'To your imagination only',
      icon: Home,
      completed: false,
    },
  ];

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Order Tracking
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Order Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Order #{order.orderNumber}</span>
              <Badge className="bg-green-100 text-green-800">
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Placed: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Total: <span className="font-semibold text-amazon-orange">${parseFloat(order.total).toFixed(2)}</span></p>
            </div>
          </div>

          {/* Tracking Steps */}
          <div className="space-y-4">
            {trackingSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                    <p className={`text-sm ${step.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                      {step.description}
                    </p>
                  </div>
                  {step.completed && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Fun Message */}
          <div className="bg-ghost-teal/10 p-4 rounded-lg border border-ghost-teal/20">
            <p className="text-sm text-ghost-teal font-medium text-center">
              🎉 Congratulations! You've successfully avoided spending real money while still enjoying the shopping experience!
            </p>
          </div>

          {/* Order Items */}
          {order.items && order.items.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Items in this order:</h4>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-amazon-orange">
                      ${parseFloat(item.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-4">
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
