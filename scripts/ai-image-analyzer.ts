import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface AnalyzedProduct {
  productName: string;
  category: string;
  subcategory: string;
  description: string;
  features: string[];
  price: number;
  rating: number;
  ratingCount: number;
  specifications: Record<string, string>;
}

export async function analyzeProductImage(imagePath: string): Promise<AnalyzedProduct> {
  try {
    // Read image file and convert to base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are a professional e-commerce product analyst. Analyze the product image and create comprehensive product details.
          
          Focus on:
          1. Identify the exact product type and generate an authentic product name
          2. Determine appropriate category and subcategory
          3. Create realistic pricing based on the product's apparent quality and features
          4. Generate professional product descriptions and features
          5. Include technical specifications visible in the image
          6. Provide realistic ratings and review counts
          
          Return JSON in this exact format:
          {
            "productName": "Professional Product Name",
            "category": "electronics",
            "subcategory": "Cameras",
            "description": "Professional description highlighting key benefits",
            "features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5", "Feature 6", "Feature 7", "Feature 8"],
            "price": 899.99,
            "rating": 4.5,
            "ratingCount": 1247,
            "specifications": {
              "Brand": "Professional",
              "Model": "Pro Series",
              "Key Spec": "Value"
            }
          }`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this product image and provide comprehensive e-commerce product details. Be specific about what you see and create realistic pricing based on the product's apparent quality and features."
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
      max_tokens: 1500
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Validate and clean the result
    return {
      productName: result.productName || "Professional Product",
      category: result.category || "electronics",
      subcategory: result.subcategory || "General",
      description: result.description || "Professional quality product",
      features: Array.isArray(result.features) ? result.features.slice(0, 8) : [],
      price: typeof result.price === 'number' ? result.price : 99.99,
      rating: typeof result.rating === 'number' ? Math.min(Math.max(result.rating, 3.5), 5.0) : 4.2,
      ratingCount: typeof result.ratingCount === 'number' ? result.ratingCount : Math.floor(Math.random() * 2000) + 100,
      specifications: result.specifications || {}
    };
    
  } catch (error) {
    console.error(`Error analyzing image ${imagePath}:`, error);
    throw error;
  }
}

export async function batchAnalyzeImages(imageDirectory: string, outputFile: string) {
  const imageFiles = fs.readdirSync(imageDirectory)
    .filter(file => file.match(/\.(png|jpg|jpeg)$/i))
    .sort();
  
  console.log(`Found ${imageFiles.length} images to analyze`);
  
  const results: Array<AnalyzedProduct & { imagePath: string }> = [];
  
  for (let i = 0; i < imageFiles.length; i++) {
    const imageFile = imageFiles[i];
    const imagePath = path.join(imageDirectory, imageFile);
    
    console.log(`\n📸 Analyzing ${i + 1}/${imageFiles.length}: ${imageFile}`);
    
    try {
      const analysis = await analyzeProductImage(imagePath);
      results.push({
        ...analysis,
        imagePath: imageFile
      });
      
      console.log(`✅ ${analysis.productName} - $${analysis.price} (${analysis.subcategory})`);
      
      // Small delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Failed to analyze ${imageFile}:`, error);
    }
  }
  
  // Save results to file
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
  console.log(`\n📊 Analysis complete! Results saved to ${outputFile}`);
  console.log(`Successfully analyzed ${results.length} out of ${imageFiles.length} images`);
  
  return results;
}