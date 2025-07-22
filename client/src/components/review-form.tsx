import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReviewFormProps {
  productId: number;
  onReviewSubmitted?: () => void;
}

export default function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitReview = async (reviewData: any) => {
    const response = await fetch(`/api/products/${productId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit review');
    }
    
    return response.json();
  };

  const reviewMutation = useMutation({
    mutationFn: submitReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products', productId, 'reviews'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products', productId] });
      
      toast({
        title: "Review submitted!",
        description: "Thank you for your feedback. Your review has been added to the product.",
      });
      
      // Reset form
      setRating(0);
      setHoverRating(0);
      setCustomerName('');
      setTitle('');
      setComment('');
      setIsOpen(false);
      
      onReviewSubmitted?.();
    },
    onError: (error) => {
      console.error('Review submission error:', error);
      toast({
        title: "Error submitting review",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName || !title || !comment || rating === 0) {
      toast({
        title: "Please fill out all fields",
        description: "All fields are required to submit a review.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Submitting review:', { customerName, rating, title, comment });
      await reviewMutation.mutateAsync({
        customerName,
        rating,
        title,
        comment,
        verified: Math.random() > 0.5, // Randomly assign verification
        helpful: Math.floor(Math.random() * 20), // Random helpful count
      });
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating: number) => {
    setHoverRating(starRating);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  if (!isOpen) {
    return (
      <div className="text-center">
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          className="px-6 py-2"
        >
          Write a Review
        </Button>
      </div>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div>
            <Label className="text-sm font-medium">Rating</Label>
            <div className="flex items-center space-x-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={handleStarLeave}
                  className="p-1 focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select a rating'}
              </span>
            </div>
          </div>

          {/* Customer Name */}
          <div>
            <Label htmlFor="customerName" className="text-sm font-medium">
              Your Name
            </Label>
            <Input
              id="customerName"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter your name"
              className="mt-1"
              required
            />
          </div>

          {/* Review Title */}
          <div>
            <Label htmlFor="reviewTitle" className="text-sm font-medium">
              Review Title
            </Label>
            <Input
              id="reviewTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your review"
              className="mt-1"
              required
            />
          </div>

          {/* Review Comment */}
          <div>
            <Label htmlFor="reviewComment" className="text-sm font-medium">
              Review
            </Label>
            <Textarea
              id="reviewComment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about your experience with this product..."
              className="mt-1 min-h-[100px]"
              required
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="flex-1 bg-amazon-orange hover:bg-amazon-orange/90"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}