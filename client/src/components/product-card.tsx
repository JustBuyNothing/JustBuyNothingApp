import { Link } from 'wouter';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, type Product } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ShoppingCart, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const addToCartMutation = useMutation({
    mutationFn: () => api.cart.addItem(product.id, 1, user?.id?.toString() || 'guest'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: "Added to cart!",
        description: "Item has been added to your ghost cart.",
      });
    },
  });

  const rating = parseFloat(product.rating);
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCartMutation.mutate();
  };

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-0">
          <Link href={`/product/${product.id}`}>
            <div className="flex items-center space-x-4 p-4 cursor-pointer">
              <div className="relative flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <Badge className="absolute -top-2 -right-2 bg-ghost-teal hover:bg-ghost-teal text-xs">
                  GHOST
                </Badge>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-amazon-dark mb-1 truncate">{product.title}</h3>
                <div className="flex items-center mb-2">
                  {stars.map(star => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-2">({product.ratingCount})</span>
                </div>
                <Badge variant="outline" className="capitalize text-xs">
                  {product.category}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold text-amazon-orange">${product.price}</span>
                <Button
                  onClick={handleAddToCart}
                  disabled={addToCartMutation.isPending}
                  className="bg-amazon-orange hover:bg-amazon-orange/90"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
                </Button>
              </div>
            </div>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 h-full">
      <CardContent className="p-0 h-full flex flex-col">
        <Link href={`/product/${product.id}`}>
          <div className="cursor-pointer flex-1 flex flex-col">
            <div className="relative">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              {Math.random() > 0.6 && (
                <div className="absolute bottom-1 left-1 bg-amazon-orange text-white text-xs px-2 py-1 rounded font-bold">
                  BESTSELLER
                </div>
              )}
              {Math.random() > 0.7 && (
                <div className="absolute bottom-1 right-1 bg-blue-600 text-white text-xs px-2 py-1 rounded font-bold">
                  LIMITED
                </div>
              )}
            </div>
            
            <div className="p-3 flex-1 flex flex-col">
              <h3 className="font-medium text-amazon-dark mb-2 text-sm h-[2.5rem] leading-tight overflow-hidden">
                {product.title.length > 50 ? product.title.substring(0, 50) + '...' : product.title}
              </h3>
              
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {stars.slice(0, 5).map(star => (
                    <Star
                      key={star}
                      className={`w-3 h-3 ${
                        star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">({product.ratingCount})</span>
                </div>
              </div>
              
              <div className="mb-3 flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg font-bold text-amazon-orange">${product.price}</span>
                  <span className="text-xs text-gray-500 line-through">${(parseFloat(product.price) * 2).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline" className="capitalize text-xs">
                    {product.category}
                  </Badge>
                  <span className="text-xs text-green-600 font-medium">
                    FREE delivery
                  </span>
                </div>
                <div className="h-4 flex items-center">
                  {Math.random() > 0.5 && (
                    <div className="text-xs text-red-600 font-medium">
                      Only {Math.floor(Math.random() * 10) + 1} left in stock!
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-auto space-y-1">
                <Button
                  onClick={handleAddToCart}
                  disabled={addToCartMutation.isPending}
                  className="w-full bg-amazon-orange hover:bg-amazon-orange/90 text-white font-semibold text-sm py-2 transform transition-all duration-150 hover:scale-105 active:scale-95"
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
                </Button>
                
                <p className="text-xs text-gray-400 text-center flex items-center justify-center">
                  <Info className="w-3 h-3 mr-1" />
                  No real money charged
                </p>
              </div>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
