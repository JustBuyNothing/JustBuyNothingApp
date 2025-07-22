import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Shield, Chrome, ArrowLeft, Clock, Heart, Zap } from 'lucide-react';
import Header from '@/components/header';

export default function AddOns() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleDownloadExtension = () => {
    // Create a download link for the Chrome extension zip file
    window.open('/api/download/buynothing-guard-extension.zip', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Store
            </Button>
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            BuyNothing Add-Ons
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Extend your dopamine-free shopping experience with powerful browser extensions 
            and tools designed to help you make mindful purchasing decisions.
          </p>
        </div>

        {/* Chrome Extension Card */}
        <Card className="mb-8 border-2 border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="w-8 h-8" />
                <div>
                  <CardTitle className="text-2xl">iBuyNothing Guard</CardTitle>
                  <CardDescription className="text-purple-100">
                    Chrome Extension • Version 1.0
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  <Chrome className="w-4 h-4 mr-1" />
                  Chrome
                </Badge>
                <Badge variant="secondary" className="bg-green-500 text-white">
                  Free
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column - Features */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-purple-600" />
                  Key Features
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <Clock className="w-5 h-5 mr-2 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Smart Timing:</strong> Time-aware messages that adapt to late-night shopping and emotional spending patterns</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="w-5 h-5 mr-2 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Gentle Interruption:</strong> Thoughtful "Are you sure?" prompts at Amazon checkout</span>
                  </li>
                  <li className="flex items-start">
                    <Heart className="w-5 h-5 mr-2 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Mindful Messaging:</strong> Supportive, non-judgmental reminders to pause and reflect</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowLeft className="w-5 h-5 mr-2 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span><strong>BuyNothing Redirect:</strong> Direct link back to practice guilt-free shopping</span>
                  </li>
                </ul>
              </div>

              {/* Right Column - Download */}
              <div className="flex flex-col justify-center">
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <Shield className="w-16 h-16 mx-auto mb-4 text-purple-600" />
                  <h4 className="text-lg font-semibold mb-2">Ready to Install</h4>
                  <p className="text-gray-600 mb-4 text-sm">
                    Download the extension package and install it in Chrome
                  </p>
                  <Button 
                    onClick={handleDownloadExtension}
                    className="w-full bg-purple-600 hover:bg-purple-700 mb-3"
                    size="lg"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Extension
                  </Button>
                  <Link href="/test-extension">
                    <Button 
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      Test Extension
                    </Button>
                  </Link>
                  <p className="text-xs text-gray-500 mt-2">
                    Compatible with Chrome 88+
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl">About iBuyNothing Guard</CardTitle>
            <CardDescription>
              Take your power back. One checkout at a time.
            </CardDescription>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p className="text-gray-700 mb-4">
              We all know the feeling.
            </p>
            <p className="text-gray-700 mb-4">
              You add something to your cart — maybe it's late at night, maybe you had a rough day, maybe it's just habit.
              You scroll through endless deals. You reach checkout. You're about to click Buy Now.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>That's when iBuyNothing Guard steps in.</strong>
            </p>
            <p className="text-gray-700 mb-4">
              This extension gently interrupts your checkout flow with one simple question:
              <em>"Are you sure?"</em>
            </p>
            <p className="text-gray-700 mb-4">
              Not because you're weak. Not because you're wrong. But because the world is designed to make you buy things you don't need — to numb, to distract, to cope.
              Meanwhile, prices go up. Quality goes down. And the dopamine hit wears off before the package even arrives.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>iBuyNothing Guard is your quiet resistance.</strong>
            </p>
            <p className="text-gray-700 mb-4">
              It's your reminder that you don't have to give in to a system that treats your attention like currency and your emotions like leverage.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>With one little pause, you can:</strong>
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Redirect to the iBuyNothing site where you can practice guilt-free shopping without spending a cent</li>
              <li>Catch your breath before spending impulsively</li>
              <li>Start building better habits — without shame</li>
              <li>Break the cycle of emotional spending</li>
            </ul>
            <p className="text-gray-700 mb-4">
              No tracking. No judgment. Just support when you need it most.
            </p>
            <p className="text-gray-700 mb-4">
              Join thousands of others using intention and mindful intervention to take back control of their spending habits.
            </p>
            <p className="text-purple-600 font-semibold text-lg">
              Buy less. Feel more. Reclaim your checkout.
            </p>
            <p className="text-gray-600 italic">
              iBuyNothing Guard — for when your cart is full but your soul is tired.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}