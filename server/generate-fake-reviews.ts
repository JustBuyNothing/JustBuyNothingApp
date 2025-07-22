import { db } from "./db";
import { products, reviews } from "@shared/schema";
import { eq } from "drizzle-orm";

const reviewTemplates = [
  // 5-star reviews
  { rating: 5, templates: [
    "Absolutely love this product! Exceeded my expectations in every way.",
    "Outstanding quality and exactly as described. Highly recommend!",
    "Perfect addition to my kitchen/home. Works flawlessly!",
    "Amazing quality for the price. Very happy with this purchase.",
    "Excellent product! Fast shipping and great customer service.",
    "Top-notch quality and design. Worth every penny!",
    "Couldn't be happier with this purchase. 5 stars!",
    "Superb quality and performance. Highly recommend to others!"
  ]},
  // 4-star reviews  
  { rating: 4, templates: [
    "Great product overall, just minor issues with setup.",
    "Really good quality, though a bit pricey for what it is.",
    "Works well and looks nice. Good value for money.",
    "Solid product with good build quality. Recommend!",
    "Pretty good purchase, meets most of my expectations.",
    "Good quality but took longer to arrive than expected.",
    "Nice product, though the instructions could be clearer.",
    "Works as expected and good quality materials."
  ]},
  // 3-star reviews
  { rating: 3, templates: [
    "Decent product but not amazing. Does the job.",
    "Average quality for the price point. It's okay.",
    "Works fine but nothing special about it.",
    "Good enough for basic needs but not outstanding.",
    "Mixed feelings - some good points, some not so much.",
    "It's fine but I expected more for this price.",
    "Does what it's supposed to do, nothing more.",
    "Acceptable quality but room for improvement."
  ]}
];

const reviewerNames = [
  "Sarah M.", "John D.", "Emily R.", "Michael B.", "Jessica L.", "David W.", 
  "Amanda K.", "Chris P.", "Jennifer S.", "Mark T.", "Lisa H.", "Ryan C.",
  "Rachel G.", "Kevin A.", "Nicole F.", "Brian J.", "Ashley N.", "Matt L.",
  "Stephanie V.", "Daniel R.", "Megan O.", "Tyler K.", "Kristin B.", "Josh M.",
  "Lauren S.", "Alex H.", "Taylor W.", "Jordan P.", "Casey R.", "Morgan D."
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateReviewTitle(rating: number): string {
  const titles = {
    5: ["Amazing!", "Love it!", "Perfect!", "Excellent quality", "Highly recommend", "Outstanding!", "Best purchase ever"],
    4: ["Great product", "Really good", "Solid choice", "Good quality", "Recommended", "Worth it", "Pretty good"],
    3: ["It's okay", "Decent", "Average", "Does the job", "Not bad", "Acceptable", "Fair quality"]
  };
  return getRandomElement(titles[rating as keyof typeof titles]);
}

export async function generateFakeReviewsForProduct(productId: number, productTitle: string): Promise<void> {
  try {
    // Get the product to check review count
    const [product] = await db.select().from(products).where(eq(products.id, productId));
    if (!product) return;

    const targetReviewCount = product.reviewCount || Math.floor(Math.random() * 50) + 10;
    
    // Generate reviews based on rating distribution
    const reviews5Star = Math.floor(targetReviewCount * 0.6); // 60% 5-star
    const reviews4Star = Math.floor(targetReviewCount * 0.25); // 25% 4-star  
    const reviews3Star = targetReviewCount - reviews5Star - reviews4Star; // Rest 3-star

    const reviewsToGenerate = [
      ...Array(reviews5Star).fill(5),
      ...Array(reviews4Star).fill(4),
      ...Array(reviews3Star).fill(3)
    ];

    // Shuffle the ratings
    for (let i = reviewsToGenerate.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [reviewsToGenerate[i], reviewsToGenerate[j]] = [reviewsToGenerate[j], reviewsToGenerate[i]];
    }

    const generatedReviews = [];
    
    for (let i = 0; i < reviewsToGenerate.length; i++) {
      const rating = reviewsToGenerate[i];
      const ratingGroup = reviewTemplates.find(group => group.rating === rating);
      if (!ratingGroup) continue;

      const reviewText = getRandomElement(ratingGroup.templates);
      const reviewerName = getRandomElement(reviewerNames);
      const title = generateReviewTitle(rating);
      
      // Generate random date within last 6 months
      const daysAgo = Math.floor(Math.random() * 180);
      const reviewDate = new Date();
      reviewDate.setDate(reviewDate.getDate() - daysAgo);

      generatedReviews.push({
        productId,
        rating,
        title,
        comment: reviewText,
        reviewerName,
        createdAt: reviewDate
      });
    }

    // Insert all reviews at once
    if (generatedReviews.length > 0) {
      await db.insert(reviews).values(generatedReviews);
      console.log(`✓ Generated ${generatedReviews.length} reviews for: ${productTitle}`);
    }
  } catch (error) {
    console.error(`Failed to generate reviews for product ${productId}:`, error);
  }
}

export async function generateFakeReviewsForAllHomeKitchenProducts(): Promise<void> {
  try {
    console.log('Generating fake reviews for all Home & Kitchen products...');
    
    const homeKitchenProducts = await db
      .select()
      .from(products)
      .where(eq(products.category, 'Home and Kitchen'));

    console.log(`Found ${homeKitchenProducts.length} Home & Kitchen products`);

    for (const product of homeKitchenProducts) {
      await generateFakeReviewsForProduct(product.id, product.title);
      // Small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n✅ Fake review generation complete for all Home & Kitchen products!');
  } catch (error) {
    console.error('Error generating fake reviews:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateFakeReviewsForAllHomeKitchenProducts()
    .then(() => {
      console.log('Review generation completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Review generation failed:', error);
      process.exit(1);
    });
}