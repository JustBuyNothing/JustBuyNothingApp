import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { X } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (orderId: number) => void;
}

export default function CheckoutModal({ isOpen, onClose, onComplete }: CheckoutModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    zipCode: '',
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const createOrderMutation = useMutation({
    mutationFn: () => api.orders.create(user?.id?.toString() || 'guest'),
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      onComplete(order.id);
      setStep(1);
      setFormData({
        fullName: '',
        address: '',
        city: '',
        zipCode: '',
      });
      toast({
        title: "Order placed successfully!",
        description: "Your ghost order has been confirmed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      createOrderMutation.mutate();
    }
  };

  const handleClose = () => {
    setStep(1);
    setFormData({
      fullName: '',
      address: '',
      city: '',
      zipCode: '',
    });
    onClose();
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.fullName && formData.address && formData.city && formData.zipCode;
      case 2:
        return true; // Payment step is simulated
      case 3:
        return true; // Review step
      default:
        return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Ghost Checkout
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 1 ? 'bg-amazon-orange text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                1
              </div>
              <span className={`ml-2 text-sm ${step >= 1 ? 'font-medium' : 'text-gray-500'}`}>
                Shipping
              </span>
            </div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 2 ? 'bg-amazon-orange text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                2
              </div>
              <span className={`ml-2 text-sm ${step >= 2 ? 'font-medium' : 'text-gray-500'}`}>
                Payment
              </span>
            </div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 3 ? 'bg-amazon-orange text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                3
              </div>
              <span className={`ml-2 text-sm ${step >= 3 ? 'font-medium' : 'text-gray-500'}`}>
                Review
              </span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="123 Main St"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="New York"
                />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="10001"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <h3 className="font-semibold mb-2">Payment Information</h3>
              <p className="text-sm text-gray-600 mb-4">
                This is a simulated payment. No real payment processing occurs.
              </p>
              <div className="space-y-2">
                <Input placeholder="**** **** **** 1234" disabled />
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="MM/YY" disabled />
                  <Input placeholder="CVV" disabled />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Shipping to:</span>
                  <span className="font-medium">{formData.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Address:</span>
                  <span className="font-medium">{formData.address}</span>
                </div>
                <div className="flex justify-between">
                  <span>City:</span>
                  <span className="font-medium">{formData.city}, {formData.zipCode}</span>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>Remember:</strong> This is a ghost order! No real items will be shipped and no money will be charged.
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={step > 1 ? () => setStep(step - 1) : handleClose}
          >
            {step > 1 ? 'Back' : 'Cancel'}
          </Button>
          <Button
            onClick={handleNextStep}
            disabled={!isStepValid() || createOrderMutation.isPending}
            className="bg-amazon-orange hover:bg-amazon-orange/90"
          >
            {step === 3 ? 
              (createOrderMutation.isPending ? 'Processing...' : 'Complete Ghost Order') : 
              'Next'
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
