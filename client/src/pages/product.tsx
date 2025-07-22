import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useCartStore } from '@/lib/cart-store';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ShoppingCart, Star, Shield, Infinity, Heart, Check, ThumbsUp, VerifiedIcon } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import CustomerReviews from '@/components/customer-reviews';
import { useAuth } from '@/hooks/useAuth';

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const { data: product, isLoading } = useQuery({
    queryKey: ['/api/products', id],
    queryFn: () => api.products.getById(parseInt(id!)),
    enabled: !!id,
  });

  const addToCartMutation = useMutation({
    mutationFn: (data: { productId: number; quantity: number }) => 
      api.cart.addItem(data.productId, data.quantity, user?.id?.toString() || 'guest'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: "Added to cart!",
        description: "Item has been added to your ghost cart.",
      });
    },
  });

  const handleAddToCart = () => {
    if (product) {
      addToCartMutation.mutate({ productId: product.id, quantity });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header searchTerm="" onSearchChange={() => {}} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-12 bg-gray-200 rounded w-1/3"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header searchTerm="" onSearchChange={() => {}} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const rating = parseFloat(product.rating);
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header searchTerm="" onSearchChange={() => {}} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-amazon-orange hover:text-amazon-orange/80">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Image */}
          <div className="relative">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-96 object-contain bg-white rounded-lg shadow-md"
            />
            <Badge className="absolute top-4 right-4 bg-ghost-teal hover:bg-ghost-teal">
              GHOST
            </Badge>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-amazon-dark mb-2">{product.title}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {stars.map(star => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">({product.ratingCount} reviews)</span>
                </div>
                <Badge variant="outline" className="capitalize">
                  {product.category}
                </Badge>
              </div>
              <p className="text-4xl font-bold text-amazon-orange mb-4">${product.price}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-center space-x-6 text-sm">
                <div className="flex items-center text-green-600">
                  <Shield className="w-4 h-4 mr-2" />
                  100% Guilt-Free
                </div>
                <div className="flex items-center text-ghost-teal">
                  <Infinity className="w-4 h-4 mr-2" />
                  Unlimited Budget
                </div>
                <div className="flex items-center text-red-500">
                  <Heart className="w-4 h-4 mr-2" />
                  Save Real Money
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium">Quantity:</label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <Button
                onClick={handleAddToCart}
                className="w-full bg-amazon-orange hover:bg-amazon-orange/90 text-white py-3 text-lg font-semibold"
                disabled={addToCartMutation.isPending}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {addToCartMutation.isPending ? 'Adding...' : 'Add to BuyNothing'}
              </Button>
              
              <p className="text-xs text-gray-500 text-center">
                <Shield className="w-3 h-3 inline mr-1" />
                This is a simulated purchase - no real money will be charged
              </p>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="space-y-8">
          {/* Detailed Description */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">About this item</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {product.detailedDescription || product.description}
              </p>
              
              {/* Product Features */}
              {product.features && product.features.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Reviews */}
          <CustomerReviews productId={product.id} />
        </div>
      </div>
    </div>
  );
}
