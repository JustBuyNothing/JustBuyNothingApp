import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ShoppingCart, CreditCard, Package } from 'lucide-react';
import Header from '@/components/header';

export default function TestExtension() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/add-ons">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Add Ons
            </Button>
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Extension Testing Page
          </h1>
          <p className="text-gray-600">
            This page mimics Amazon's checkout flow to test the iBuyNothing Guard extension
          </p>
        </div>

        {/* Mock Amazon Header */}
        <div className="bg-amazon-navy text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold">amazon</span>
              <span className="text-sm">.com</span>
            </div>
            <div className="flex items-center space-x-4">
              <ShoppingCart className="w-6 h-6" />
              <span>Cart (3)</span>
            </div>
          </div>
        </div>

        {/* Mock Amazon Content */}
        <Card className="rounded-t-none border-t-0">
          <CardHeader className="bg-yellow-50 border-b">
            <CardTitle className="text-xl text-gray-900">Your Cart</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-500 text-xs">IMG</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Wireless Bluetooth Headphones</h3>
                    <p className="text-sm text-gray-600">Color: Black | Size: One Size</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">$89.99</p>
                  <p className="text-sm text-gray-600">Qty: 1</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-500 text-xs">IMG</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Premium Cotton T-Shirt</h3>
                    <p className="text-sm text-gray-600">Color: Navy | Size: M</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">$24.99</p>
                  <p className="text-sm text-gray-600">Qty: 2</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-500 text-xs">IMG</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Stainless Steel Water Bottle</h3>
                    <p className="text-sm text-gray-600">Color: Silver | Size: 32oz</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">$19.99</p>
                  <p className="text-sm text-gray-600">Qty: 1</p>
                </div>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal (4 items):</span>
                  <span>$159.96</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>$9.99</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>$13.60</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-amazon-orange">$183.55</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Buttons - These will trigger the extension */}
            <div className="space-y-4">
              <Button 
                className="w-full bg-amazon-orange hover:bg-amazon-orange/90 text-white py-3 text-lg"
                id="sc-buy-box-ptc-button"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Proceed to Checkout
              </Button>
              
              <Button 
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-3 text-lg"
                id="buyNowButton"
              >
                <Package className="w-5 h-5 mr-2" />
                Buy Now
              </Button>
              
              <Button 
                className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 text-lg"
                name="placeYourOrder1"
              >
                Place Your Order
              </Button>
            </div>

            {/* Testing Instructions */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Testing Instructions:</h3>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Install the iBuyNothing Guard extension first</li>
                <li>2. Open Browser Console (F12 → Console tab)</li>
                <li>3. Look for "iBuyNothing Guard loaded" message</li>
                <li>4. Click any of the checkout buttons above</li>
                <li>5. The extension should intercept and show the intervention modal</li>
                <li>6. Check that the modal shows the correct cart total ($183.55)</li>
              </ol>
              <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Troubleshooting:</strong> If nothing happens when clicking buttons, check the browser console for extension messages. The extension needs to be properly installed and have permission to run on this domain.
                </p>
              </div>
            </div>

            {/* Extension Test Button */}
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Quick Extension Test:</h3>
              <button 
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                onClick={() => {
                  console.log('Test button clicked - checking if extension is loaded');
                  if (document.querySelector('#buynothing-guard-modal')) {
                    console.log('Extension modal already exists');
                  } else {
                    console.log('No extension modal found - extension may not be loaded');
                  }
                }}
              >
                Test Extension Status
              </button>
              <p className="text-sm text-green-700 mt-2">
                Click this button and check the browser console for extension status messages.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}