import { useQuery } from '@tanstack/react-query';
import { api, type Review } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ThumbsUp, VerifiedIcon } from 'lucide-react';
import ReviewForm from './review-form';

interface CustomerReviewsProps {
  productId: number;
}

export default function CustomerReviews({ productId }: CustomerReviewsProps) {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['/api/products', productId, 'reviews'],
    queryFn: () => api.products.getReviews(productId),
  });

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
  }));

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
          <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review this product!</p>
          
          {/* Review Form for products with no reviews */}
          <ReviewForm 
            productId={productId} 
            onReviewSubmitted={() => {
              // This will be handled by the React Query mutation
            }} 
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Customer Reviews</h2>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= averageRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {averageRating.toFixed(1)} out of 5 stars ({reviews.length} reviews)
            </span>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Rating breakdown</h3>
          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-16">
                  <span className="text-sm">{rating}</span>
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Individual Reviews */}
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-ghost-teal rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {review.customerName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{review.customerName}</span>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs">
                          <VerifiedIcon className="w-3 h-3 mr-1" />
                          Verified Purchase
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="ml-10">
                <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>
                
                <div className="flex items-center space-x-4 text-sm">
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    Helpful ({review.helpful})
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                    Report
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* See More Reviews Button */}
        {reviews.length > 0 && (
          <div className="mt-6 text-center">
            <Button variant="outline" className="px-6">
              See all {reviews.length} reviews
            </Button>
          </div>
        )}

        {/* Review Form */}
        <ReviewForm 
          productId={productId} 
          onReviewSubmitted={() => {
            // This will be handled by the React Query mutation
          }} 
        />
      </CardContent>
    </Card>
  );
}