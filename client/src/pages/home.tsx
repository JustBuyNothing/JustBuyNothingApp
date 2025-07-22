import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { api } from '@/lib/api';
import Header from '@/components/header';
import CategoryNavigation from '@/components/category-navigation';
import ProductCard from '@/components/product-card';
import CartSidebar from '@/components/cart-sidebar';
import CheckoutModal from '@/components/checkout-modal';
import OrderTrackingModal from '@/components/order-tracking-modal';

import { UserStats } from '@/components/user-stats';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCartStore } from '@/lib/cart-store';
import { Filter, Grid, List, Shield, Infinity, Heart, Package, ShoppingBag, Home as HomeIcon } from 'lucide-react';
import BuyNothingHeroLogo from '@/components/buy-nothing-hero-logo';
import { sortCategoriesByOrder, getCategoryDisplayName } from '@/lib/categories';
import { searchProducts } from '@/lib/search-utils';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<number | null>(null);
  
  const { isOpen: isCartOpen } = useCartStore();
  const { user } = useAuth();
  
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['/api/products'],
    queryFn: () => api.products.getAll(),
  });

  const filteredProducts = searchProducts(products, searchTerm, selectedCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price-high':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'rating':
        return parseFloat(b.rating) - parseFloat(a.rating);
      default:
        return 0;
    }
  });

  const categories = [...new Set(products.map(p => p.category))];
  const sortedCategories = sortCategoriesByOrder(categories);

  const handleOrderComplete = (orderId: number) => {
    setLastOrderId(orderId);
    setIsCheckoutOpen(false);
    setIsTrackingOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <CategoryNavigation />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-ghost-teal/10 to-amazon-blue/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-amazon-dark">
                Happy BuyNothing Day!
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-600">
                Discover amazing deals on electronics, fashion, jewelry, and more. Experience the joy of shopping without the commitment!
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  size="lg" 
                  className="bg-amazon-orange hover:bg-amazon-orange/90 text-white font-bold px-8 py-3 text-lg transform hover:scale-105 transition-all duration-200"
                  onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Shop BuyNothing Day Deals
                </Button>
              </div>
            </div>
            <div className="relative flex justify-center">
              <BuyNothingHeroLogo className="w-80 h-80 opacity-90" />
            </div>
          </div>
        </div>
      </div>



      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Stats Dashboard */}
        <div className="mb-8">
          <UserStats />
        </div>
        

        
        {/* Happy BuyNothing Day Banner */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-ghost-teal text-white px-3 py-1 rounded text-sm font-bold">
                HAPPY BUYNOTHING DAY
              </div>
              <div>
                <h2 className="text-lg font-bold text-amazon-dark">Happy BuyNothing Day! Enjoy These Deals</h2>
                <p className="text-gray-600">Special offers on all your favorite items</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-ghost-teal">🛍️</div>
              <div className="text-sm text-gray-500">BuyNothing Day Special</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-wrap items-center space-x-4 mb-4 md:mb-0">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {sortedCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {getCategoryDisplayName(category)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">View:</span>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="bg-amazon-orange hover:bg-amazon-orange/90"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Product Grid */}
        <div id="products">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse">
                  <div className="h-40 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-3">
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`grid gap-4 ${
              viewMode === 'grid' 
                ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6' 
                : 'grid-cols-1'
            }`}>
              {sortedProducts.map(product => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
              ))}
            </div>
          )}
        </div>

        {sortedProducts.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          </div>
        )}
      </main>

      {/* Modals and Sidebars */}
      <CartSidebar onCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onComplete={handleOrderComplete}
      />
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        orderId={lastOrderId}
      />
      
      {/* Overlay */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => useCartStore.getState().toggleCart()}
        />
      )}
    </div>
  );
}
