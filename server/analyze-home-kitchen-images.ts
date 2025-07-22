import OpenAI from "openai";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { db } from "./db";
import { products } from "@shared/schema";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface AnalyzedProduct {
  name: string;
  category: string;
  subcategory: string;
  short_description: string;
  full_description: string;
  features: string[];
  price: number;
  discounted_price: number;
  star_rating: number;
  review_count: number;
  image_path: string;
}

export async function analyzeHomeKitchenImage(imagePath: string): Promise<AnalyzedProduct> {
  try {
    // Read and encode the image
    const imageBuffer = readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are an expert e-commerce product analyzer. Analyze product images and create authentic, professional product listings. Focus on realistic brand names, model numbers, and market-appropriate pricing.

Return JSON with this exact structure:
{
  "name": "Realistic product name with brand and model",
  "category": "Home and Kitchen",
  "subcategory": "Kitchen Appliances|Home Decor|Storage & Organization|Cleaning Supplies|Garden & Outdoor",
  "short_description": "1-2 sentence compelling product pitch",
  "full_description": "2-3 sentence detailed description highlighting key benefits",
  "features": ["8 specific detailed features about the product"],
  "price": 89.99,
  "discounted_price": 69.99,
  "star_rating": 4.5,
  "review_count": 1247,
  "image_path": "${imagePath}"
}`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this home and kitchen product image and create a realistic product listing. Generate an authentic brand name, model number, and features that match what you see in the image. Price should be realistic for the product type and quality shown."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/png;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    const analyzed = JSON.parse(content);
    return analyzed;
  } catch (error) {
    console.error(`Error analyzing image ${imagePath}:`, error);
    throw error;
  }
}

export async function processAllHomeKitchenImages(): Promise<void> {
  const imageDir = join(process.cwd(), "midjourney-images", "home-and-kitchen", "Kitchen and Home");
  
  try {
    const imageFiles = readdirSync(imageDir)
      .filter(file => file.toLowerCase().endsWith('.png'))
      .sort();

    console.log(`Found ${imageFiles.length} images to process`);

    for (let i = 0; i < imageFiles.length; i++) {
      const imageFile = imageFiles[i];
      const imagePath = join(imageDir, imageFile);
      
      try {
        console.log(`Processing ${i + 1}/${imageFiles.length}: ${imageFile}`);
        
        const analyzed = await analyzeHomeKitchenImage(imagePath);
        
        // Insert into database
        await db.insert(products).values({
          title: analyzed.name,
          price: analyzed.price,
          discountedPrice: analyzed.discounted_price,
          description: analyzed.full_description,
          category: "Home and Kitchen",
          subcategory: analyzed.subcategory,
          image: `/midjourney-images/home-and-kitchen/Kitchen and Home/${imageFile}`,
          rating: analyzed.star_rating,
          reviewCount: analyzed.review_count,
          features: analyzed.features,
          shortDescription: analyzed.short_description,
          badge: Math.random() > 0.7 ? "bestseller" : undefined,
        });

        console.log(`✓ Added product: ${analyzed.name}`);
        
        // Rate limiting - wait 2 seconds between requests
        if (i < imageFiles.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error(`Failed to process ${imageFile}:`, error);
        // Continue with next image
      }
    }

    console.log('\n✅ Home and Kitchen image processing complete!');
  } catch (error) {
    console.error('Error processing home and kitchen images:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  processAllHomeKitchenImages()
    .then(() => {
      console.log('All images processed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Processing failed:', error);
      process.exit(1);
    });
}