import { analyzeProductImage } from './ai-image-analyzer';
import { storage } from '../server/storage';
import fs from 'fs';
import path from 'path';

interface ProcessedProduct {
  productName: string;
  category: string;
  subcategory: string;
  description: string;
  features: string[];
  price: number;
  rating: number;
  ratingCount: number;
  imagePath: string;
  originalFile: string;
}

async function processNewImages(categoryFolder: string) {
  const validCategories = ['electronics', 'home-and-kitchen', 'books', 'video-games', 'toys-and-games'];
  
  if (!validCategories.includes(categoryFolder)) {
    console.error(`❌ Invalid category: ${categoryFolder}`);
    console.log(`Valid categories: ${validCategories.join(', ')}`);
    return;
  }

  const sourceDir = path.join('midjourney-images', categoryFolder);
  const assetsDir = 'client/src/assets';
  
  if (!fs.existsSync(sourceDir)) {
    console.error(`❌ Source directory not found: ${sourceDir}`);
    return;
  }

  // Get all image files
  const imageFiles = fs.readdirSync(sourceDir)
    .filter(file => file.match(/\.(png|jpg|jpeg)$/i))
    .sort();

  if (imageFiles.length === 0) {
    console.log(`📁 No images found in ${sourceDir}`);
    return;
  }

  console.log(`🚀 Processing ${imageFiles.length} images from ${categoryFolder}`);
  console.log('==========================================');

  const processedProducts: ProcessedProduct[] = [];
  const errors: string[] = [];

  for (let i = 0; i < imageFiles.length; i++) {
    const imageFile = imageFiles[i];
    const sourcePath = path.join(sourceDir, imageFile);
    
    console.log(`\n📸 Processing ${i + 1}/${imageFiles.length}: ${imageFile}`);
    
    try {
      // Analyze image with AI
      const analysis = await analyzeProductImage(sourcePath);
      
      // Generate unique asset filename
      const fileExt = path.extname(imageFile);
      const baseName = analysis.productName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
      
      const assetFileName = `${baseName}_${i + 1}${fileExt}`;
      const assetPath = path.join(assetsDir, assetFileName);
      
      // Copy image to assets
      fs.copyFileSync(sourcePath, assetPath);
      
      // Prepare product data
      const productData = {
        title: analysis.productName,
        description: analysis.description,
        price: analysis.price,
        category: categoryFolder === 'home-and-kitchen' ? 'home and kitchen' : analysis.category,
        subcategory: analysis.subcategory,
        image: `/src/assets/${assetFileName}`,
        rating: analysis.rating,
        ratingCount: analysis.ratingCount,
        features: analysis.features || []
      };
      
      // Add to database
      const product = await storage.createProduct(productData);
      
      processedProducts.push({
        ...analysis,
        imagePath: assetPath,
        originalFile: imageFile
      });
      
      console.log(`✅ ${analysis.productName} - $${analysis.price}`);
      console.log(`   📂 Category: ${productData.category} > ${analysis.subcategory}`);
      console.log(`   🖼️  Asset: ${assetFileName}`);
      console.log(`   📊 Rating: ${analysis.rating}⭐ (${analysis.ratingCount} reviews)`);
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`❌ Failed to process ${imageFile}:`, error);
      errors.push(`${imageFile}: ${error.message}`);
    }
  }

  // Save processing report
  const timestamp = new Date().toISOString().split('T')[0];
  const reportFile = `processing-report-${categoryFolder}-${timestamp}.json`;
  
  const report = {
    category: categoryFolder,
    timestamp: new Date().toISOString(),
    totalFiles: imageFiles.length,
    successful: processedProducts.length,
    errors: errors.length,
    processedProducts,
    errors
  };
  
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  
  console.log(`\n🎯 Processing Complete!`);
  console.log(`✅ Successfully processed: ${processedProducts.length} images`);
  console.log(`❌ Errors: ${errors.length}`);
  console.log(`📁 Report saved: ${reportFile}`);
  
  if (errors.length > 0) {
    console.log('\n❌ Errors:');
    errors.forEach(error => console.log(`  - ${error}`));
  }
  
  return report;
}

// Export for use in other scripts
export { processNewImages };

// Command line usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const category = process.argv[2];
  
  if (!category) {
    console.log('Usage: tsx scripts/process-new-images.ts <category>');
    console.log('Categories: electronics, home-and-kitchen, books, video-games, toys-and-games');
    process.exit(1);
  }
  
  processNewImages(category)
    .then(report => {
      console.log('\n🎊 Processing workflow complete!');
      if (report) {
        console.log(`📊 Added ${report.successful} new products to catalog`);
      }
    })
    .catch(error => {
      console.error('❌ Processing failed:', error);
      process.exit(1);
    });
}