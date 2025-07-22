import { storage } from "./storage";
import { generateProductsForAllCategories } from "./ai-product-generator";

// This script can be run manually to seed the database with AI-generated products
export async function seedDatabase() {
  try {
    console.log("Starting database seeding...");
    
    // Check if products already exist
    const existingProducts = await storage.getProducts();
    if (existingProducts.length > 0) {
      console.log(`Database already contains ${existingProducts.length} products. Skipping seeding.`);
      return;
    }
    
    // Generate AI products
    console.log("Generating AI products...");
    const aiProducts = await generateProductsForAllCategories();
    
    // Store products in database
    console.log("Storing products in database...");
    for (const aiProduct of aiProducts) {
      await storage.createProduct({
        title: aiProduct.name,
        price: aiProduct.discounted_price.toString(),
        description: aiProduct.full_description,
        category: aiProduct.category,
        image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg", // Placeholder
        rating: aiProduct.star_rating.toString(),
        ratingCount: aiProduct.review_count,
      });
    }
    
    console.log(`Successfully seeded database with ${aiProducts.length} products!`);
    
  } catch (error) {
    console.error("Error seeding database:", error);
    
    // Fallback to manual products
    console.log("Falling back to manual products...");
    const fallbackProducts = [
      {
        title: "Ethereal Smartphone - GhostPhone 15 Pro",
        price: "1299.99",
        description: "Revolutionary ghost communication device. Experience calls from the other side with crystal-clear spectral audio. Features phantom touch screen and soul-powered battery.",
        category: "electronics",
        image: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg",
        rating: "4.9",
        ratingCount: 2847
      },
      {
        title: "Phantom Gaming Console - GhostBox Ultra",
        price: "799.99",
        description: "Next-generation ghost gaming experience. Play with spirits from around the world in hauntingly beautiful virtual realms. Includes 50 pre-installed ghost games.",
        category: "electronics",
        image: "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg",
        rating: "4.8",
        ratingCount: 1923
      },
      {
        title: "Spectral Luxury Watch - TimeShadow Elite",
        price: "2499.99",
        description: "Timepiece that exists between dimensions. Track time in the living world and the spiritual realm simultaneously. Handcrafted by ghost artisans.",
        category: "jewelery",
        image: "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg",
        rating: "4.7",
        ratingCount: 756
      },
      {
        title: "Phantom Designer Handbag - VoidVogue Limited",
        price: "899.99",
        description: "Exclusive ghost fashion accessory. Made from ethereal materials that feel real but weigh nothing. Perfect for carrying your deepest spiritual desires.",
        category: "women's clothing",
        image: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg",
        rating: "4.6",
        ratingCount: 1234
      },
      {
        title: "Spectral Workout Gear - GhostFit Pro Set",
        price: "299.99",
        description: "Complete phantom fitness collection. Exercise in the spiritual realm while your body remains at rest. Includes ghost weights and ethereal yoga mat.",
        category: "men's clothing",
        image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
        rating: "4.5",
        ratingCount: 892
      }
    ];
    
    for (const product of fallbackProducts) {
      await storage.createProduct(product);
    }
    
    console.log(`Fallback seeding completed with ${fallbackProducts.length} products.`);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase().then(() => {
    console.log("Seeding completed!");
    process.exit(0);
  }).catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
}