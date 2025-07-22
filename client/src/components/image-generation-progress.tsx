import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Image, CheckCircle, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface ImageGenerationStats {
  totalProducts: number;
  aiGenerated: number;
  placeholder: number;
  completionRate: number;
  categoryBreakdown: Record<string, { total: number; aiGenerated: number }>;
  recentlyGenerated: Array<{ title: string; category: string; timestamp: Date }>;
}

export default function ImageGenerationProgress() {
  const [isVisible, setIsVisible] = useState(false);
  
  const { data: products = [], isLoading, refetch } = useQuery({
    queryKey: ['/api/products'],
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  // Calculate generation stats
  const stats: ImageGenerationStats = {
    totalProducts: products.length,
    aiGenerated: products.filter(p => 
      p.image.includes('cloud.leonardo.ai') || 
      p.image.includes('firebasestorage.googleapis.com')
    ).length,
    placeholder: products.filter(p => 
      p.image.includes('unsplash.com') || 
      p.image.includes('placeholder')
    ).length,
    completionRate: 0,
    categoryBreakdown: {},
    recentlyGenerated: []
  };

  stats.completionRate = stats.totalProducts > 0 ? (stats.aiGenerated / stats.totalProducts) * 100 : 0;

  // Calculate category breakdown
  const categories = ['electronics', 'jewelery', "men's clothing", "women's clothing", 'books', 'video games', 'toys and games', 'movies', 'home'];
  categories.forEach(category => {
    const categoryProducts = products.filter(p => p.category === category);
    const categoryAI = categoryProducts.filter(p => 
      p.image.includes('cloud.leonardo.ai') || 
      p.image.includes('firebasestorage.googleapis.com')
    );
    
    stats.categoryBreakdown[category] = {
      total: categoryProducts.length,
      aiGenerated: categoryAI.length
    };
  });

  // Show progress bar if generation is in progress
  useEffect(() => {
    if (stats.aiGenerated > 0 && stats.aiGenerated < stats.totalProducts) {
      setIsVisible(true);
    } else if (stats.aiGenerated === stats.totalProducts && stats.totalProducts > 0) {
      // Keep visible for 10 seconds after completion
      const timer = setTimeout(() => setIsVisible(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [stats.aiGenerated, stats.totalProducts]);

  if (!isVisible || isLoading || stats.totalProducts === 0) {
    return null;
  }

  const isComplete = stats.aiGenerated === stats.totalProducts;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96">
      <Card className="bg-white dark:bg-gray-800 shadow-lg border-2 border-blue-200 dark:border-blue-700">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            {isComplete ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            )}
            {isComplete ? 'Generation Complete!' : 'AI Image Generation'}
          </CardTitle>
          <CardDescription>
            {isComplete 
              ? 'All product images have been generated successfully'
              : 'Leonardo AI is generating professional product images'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Main Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {stats.aiGenerated}/{stats.totalProducts}
              </span>
            </div>
            <Progress 
              value={stats.completionRate} 
              className="h-3"
            />
            <div className="text-center text-sm font-medium text-blue-600 dark:text-blue-400">
              {Math.round(stats.completionRate)}% Complete
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Categories</div>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {Object.entries(stats.categoryBreakdown).map(([category, data]) => {
                if (data.total === 0) return null;
                
                const categoryRate = (data.aiGenerated / data.total) * 100;
                const displayName = category.charAt(0).toUpperCase() + category.slice(1);
                
                return (
                  <div key={category} className="flex items-center gap-2">
                    <Badge 
                      variant={data.aiGenerated === data.total ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {displayName}
                    </Badge>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {data.aiGenerated}/{data.total}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status indicators */}
          <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Image className="h-3 w-3" />
              <span>AI Generated: {stats.aiGenerated}</span>
            </div>
            <div className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              <span>Pending: {stats.placeholder}</span>
            </div>
          </div>

          {/* Estimated time */}
          {!isComplete && (
            <div className="text-xs text-center text-gray-500 dark:text-gray-400">
              Estimated time remaining: {Math.ceil(stats.placeholder * 0.5)} minutes
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}