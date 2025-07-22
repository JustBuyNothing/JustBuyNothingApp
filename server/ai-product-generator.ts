import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface AIProduct {
  name: string;
  category: string;
  short_description: string;
  full_description: string;
  price: number;
  discounted_price: number;
  star_rating: number;
  review_count: number;
  image_prompt: string;
}

export async function generateGhostProducts(category: string, count: number = 5): Promise<AIProduct[]> {
  const prompt = `Generate ${count} unique ghost-themed products for the "${category}" category. Each product should feel like a real e-commerce item but with a ghostly twist. The products should be diverse and creative within the category.

Return a JSON object with a "products" array containing exactly ${count} products, each following this structure:
{
  "products": [
    {
      "name": "Product Name",
      "category": "${category}",
      "short_description": "1-2 sentence pitch",
      "full_description": "2-3 sentence marketing-style description",
      "price": 49.99,
      "discounted_price": 39.99,
      "star_rating": 4.7,
      "review_count": 312,
      "image_prompt": "Studio photo of a modern electric kettle on a white background"
    }
  ]
}

Guidelines:
- Product names should include ghost-related terms like "Phantom", "Spirit", "Ghost", "Ethereal", "Spectral", "Void", etc.
- Prices should be realistic for the category (electronics: $50-2000, clothing: $20-300, jewelry: $30-500)
- Discounted prices should be 15-30% less than regular price
- Star ratings should be between 3.8-4.9
- Review counts should be realistic (50-3000)
- Image prompts should describe a professional product photo suitable for e-commerce
- Descriptions should be compelling and reference both the product function and ghost theme

Return only the JSON object with the "products" array, no other text.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a creative e-commerce product generator specializing in ghost-themed variations of real products. Generate realistic, marketable products with compelling descriptions. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    // Parse the JSON response
    const parsed = JSON.parse(content);
    
    // Handle both array and object responses
    if (Array.isArray(parsed)) {
      return parsed;
    } else if (parsed.products && Array.isArray(parsed.products)) {
      return parsed.products;
    } else {
      throw new Error("Invalid response format from OpenAI");
    }
  } catch (error) {
    console.error("Error generating ghost products:", error);
    throw new Error(`Failed to generate ghost products: ${error.message}`);
  }
}

export async function generateProductsForAllCategories(): Promise<AIProduct[]> {
  const categories = [
    "electronics",
    "jewelery", 
    "men's clothing",
    "women's clothing"
  ];

  const allProducts: AIProduct[] = [];

  for (const category of categories) {
    try {
      console.log(`Generating products for category: ${category}`);
      const products = await generateGhostProducts(category, 6);
      allProducts.push(...products);
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Failed to generate products for ${category}:`, error);
      // Continue with other categories even if one fails
    }
  }

  return allProducts;
}