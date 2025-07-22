import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useCartStore } from '@/lib/cart-store';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { ShoppingBag, Search, User, ShoppingCart, Package, ChevronDown, LogOut, TrendingUp, Settings } from 'lucide-react';
import BuyNothingLogo from './buy-nothing-logo';
import { sortCategoriesByOrder, getCategoryDisplayName } from '@/lib/categories';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function Header({ searchTerm, onSearchChange }: HeaderProps) {
  const [location] = useLocation();
  const { toggleCart, getTotalItems } = useCartStore();
  const { user, logout } = useAuth();
  
  const { data: cartItems = [] } = useQuery({
    queryKey: ['/api/cart'],
    queryFn: () => api.cart.getItems(user?.id?.toString() || 'guest'),
  });

  const { data: products = [] } = useQuery({
    queryKey: ['/api/products'],
    queryFn: () => api.products.getAll(),
  });

  const categories = [...new Set(products.map(p => p.category))];
  const sortedCategories = sortCategoriesByOrder(categories);
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
  };

  return (
    <header className="bg-amazon-navy sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <BuyNothingLogo className="w-8 h-8 mr-2" />
              <span className="text-white text-xl font-bold">BuyNothing</span>
              <span className="text-ghost-teal text-xs ml-2 bg-ghost-teal/20 px-2 py-1 rounded">
                BETA
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-12 bg-white border-gray-300 focus:ring-2 focus:ring-amazon-orange focus:border-transparent text-gray-900 placeholder:text-gray-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Button
                size="sm"
                className="absolute right-0.5 top-1/2 transform -translate-y-1/2 bg-amazon-orange hover:bg-amazon-orange/90 px-2 py-1 h-8 rounded-r-md"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center space-x-2">
            {/* Add Ons Link */}
            <Link href="/add-ons">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-ghost-teal hover:bg-white/10 px-3 py-2"
              >
                Add Ons
              </Button>
            </Link>

            {/* Category Dropdown */}
            <div className="relative">
              <select 
                className="bg-amazon-navy text-white border-none outline-none pr-8 pl-3 py-2 rounded hover:bg-amazon-navy/80 appearance-none cursor-pointer min-w-[120px] text-sm"
                onChange={(e) => {
                  if (e.target.value === 'all') {
                    window.location.href = '/';
                  } else {
                    window.location.href = `/category/${e.target.value}`;
                  }
                }}
              >
                <option value="all">All Categories</option>
                {sortedCategories.map(category => (
                  <option key={category} value={category}>
                    {getCategoryDisplayName(category)}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-white pointer-events-none" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:text-ghost-teal px-2 py-1">
                  <div className="flex flex-col items-center">
                    <User className="w-5 h-5" />
                    <div className="text-xs hidden sm:block">
                      <div className="text-gray-300 font-bold">
                        {user?.firstName || user?.username || 'Account'}
                      </div>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 border-b">
                  <p className="font-medium">{user?.firstName || user?.username}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-600">
                      {formatCurrency(user?.totalMoneySaved || 0)} saved
                    </span>
                    <span className="text-xs text-orange-600">
                      {user?.currentStreak || 0} day streak
                    </span>
                  </div>
                </div>
                <DropdownMenuItem asChild>
                  <Link href="/account" className="w-full">
                    <User className="w-4 h-4 mr-2" />
                    Your Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="w-full">
                    <Package className="w-4 h-4 mr-2" />
                    Your Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              variant="ghost"
              className="text-white hover:text-ghost-teal relative px-2 py-1"
              onClick={toggleCart}
            >
              <div className="flex items-center">
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amazon-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </div>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
