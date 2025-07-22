import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCartItemSchema, insertOrderSchema, insertOrderItemSchema, reviews, insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { generateProductsForAllCategories } from "./ai-product-generator";
import { eq } from "drizzle-orm";
import { db } from "./db";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to extract user from JWT token
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const user = await storage.getUserById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, username, password, firstName, lastName } = req.body;
      
      // Validate input
      if (!email || !username || !password) {
        return res.status(400).json({ error: "Email, username, and password are required" });
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists" });
      }
      
      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ error: "Username already taken" });
      }
      
      // Create user
      const user = await storage.createUser({
        email,
        username,
        password,
        firstName,
        lastName,
      });
      
      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      
      // Don't send password in response
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(201).json({
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Failed to create account" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      
      // Verify user credentials
      const user = await storage.verifyPassword(email, password);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      
      // Don't send password in response
      const { password: _, ...userWithoutPassword } = user;
      
      res.json({
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: any, res) => {
    try {
      const { password: _, ...userWithoutPassword } = req.user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.post("/api/auth/logout", authenticateToken, async (req: any, res) => {
    try {
      // In a more sophisticated setup, you'd blacklist the token
      // For now, we'll just respond with success
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to logout" });
    }
  });

  app.post("/api/auth/visit", authenticateToken, async (req: any, res) => {
    try {
      const updatedUser = await storage.updateUserVisit(req.user.id);
      if (updatedUser) {
        const { password: _, ...userWithoutPassword } = updatedUser;
        res.json(userWithoutPassword);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Visit update error:", error);
      res.status(500).json({ error: "Failed to update visit" });
    }
  });

  // Add savings event (for when user abandons cart or is interrupted by extension)
  app.post("/api/auth/savings", authenticateToken, async (req: any, res) => {
    try {
      const { eventType, amountSaved, description } = req.body;
      
      if (!eventType || !amountSaved) {
        return res.status(400).json({ error: "Event type and amount saved are required" });
      }
      
      const savingsEvent = await storage.addSavingsEvent({
        userId: req.user.id,
        eventType,
        amountSaved: amountSaved.toString(),
        description,
      });
      
      res.json(savingsEvent);
    } catch (error) {
      console.error("Savings event error:", error);
      res.status(500).json({ error: "Failed to record savings event" });
    }
  });

  // Get user's savings events
  app.get("/api/auth/savings", authenticateToken, async (req: any, res) => {
    try {
      const events = await storage.getUserSavingsEvents(req.user.id);
      res.json(events);
    } catch (error) {
      console.error("Fetch savings events error:", error);
      res.status(500).json({ error: "Failed to fetch savings events" });
    }
  });
  // Fetch products from FakeStore API and add ghost-themed variations
  app.get("/api/products", async (req, res) => {
    try {
      let products = await storage.getProducts();
      
      // If no products in storage, seed the database
      if (products.length === 0) {
        console.log("Database is empty, seeding with products...");
        
        // Seed with pre-generated products to avoid API calls on every load
        const seedProducts = [
          {
            title: "Phantom Shadow Hoodie",
            price: "89.99",
            description: "Ethereal comfort meets spectral style. This ghost-woven hoodie provides warmth from another dimension while maintaining the perfect balance between earthly fashion and otherworldly elegance.",
            category: "men's clothing",
            image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
            rating: "4.6",
            ratingCount: 1247
          },
          {
            title: "Spectral Gaming Console - GhostBox Pro",
            price: "499.99",
            description: "Next-generation phantom gaming experience. Play with spirits from parallel dimensions in ultra-high definition. Includes 20 pre-installed ghost games and ethereal controller.",
            category: "electronics",
            image: "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg",
            rating: "4.8",
            ratingCount: 892
          },
          {
            title: "Ethereal Diamond Ring - Spirit Shine",
            price: "1299.99",
            description: "Handcrafted by ghost artisans in the ethereal realm. This phantom diamond ring captures light from both worlds, creating a mesmerizing glow that exists beyond physical reality.",
            category: "jewelery",
            image: "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg",
            rating: "4.9",
            ratingCount: 456
          },
          {
            title: "Phantom Silk Dress - VoidVogue Collection",
            price: "159.99",
            description: "Elegant ghostly fashion that flows like mist. This spectral silk dress adapts to your spiritual energy while maintaining perfect form in the physical world.",
            category: "women's clothing",
            image: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg",
            rating: "4.7",
            ratingCount: 634
          },
          {
            title: "Spirit Smartphone - GhostPhone 14",
            price: "899.99",
            description: "Revolutionary communication device for the digital afterlife. Features phantom touch screen, soul-powered battery, and ability to call between dimensions.",
            category: "electronics",
            image: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg",
            rating: "4.8",
            ratingCount: 1892
          },
          {
            title: "Phantom Luxury Watch - TimeShadow Elite",
            price: "2499.99",
            description: "Timepiece that exists between dimensions. Track time in multiple realms simultaneously. Handcrafted by master ghost horologists with ethereal precision.",
            category: "jewelery",
            image: "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg",
            rating: "4.9",
            ratingCount: 789
          },
          {
            title: "Spectral Workout Shirt - GhostFit Pro",
            price: "49.99",
            description: "High-performance phantom athletic wear. Exercise in the spiritual realm while your body remains comfortable. Moisture-wicking ethereal fabric.",
            category: "men's clothing",
            image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
            rating: "4.5",
            ratingCount: 1156
          },
          {
            title: "Ethereal Handbag - VoidVogue Limited",
            price: "249.99",
            description: "Exclusive ghost fashion accessory. Made from ethereal materials that feel real but weigh nothing. Perfect for carrying your deepest spiritual desires.",
            category: "women's clothing",
            image: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg",
            rating: "4.6",
            ratingCount: 923
          }
        ];
        
        for (const product of seedProducts) {
          await storage.createProduct(product);
        }
        
        products = await storage.getProducts();
        console.log(`Database seeded with ${products.length} products`);
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Get product reviews
  app.get("/api/products/:id/reviews", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const productReviews = await db
        .select()
        .from(reviews)
        .where(eq(reviews.productId, productId))
        .orderBy(reviews.createdAt);
      
      res.json(productReviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  // Submit a product review
  app.post("/api/products/:id/reviews", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const { customerName, rating, title, comment, verified = false, helpful = 0 } = req.body;
      
      // Validate required fields
      if (!customerName || !rating || !title || !comment) {
        return res.status(400).json({ error: "All fields are required" });
      }
      
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating must be between 1 and 5" });
      }
      
      // Insert the review
      const [newReview] = await db
        .insert(reviews)
        .values({
          productId,
          customerName,
          rating,
          title,
          comment,
          verified,
          helpful,
        })
        .returning();
      
      res.status(201).json(newReview);
    } catch (error) {
      res.status(500).json({ error: "Failed to submit review" });
    }
  });

  // Get cart items
  app.get("/api/cart", async (req, res) => {
    try {
      const userId = req.query.userId as string || "guest";
      const cartItems = await storage.getCartItems(userId);
      
      // Get full product details for each cart item
      const cartWithProducts = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return {
            ...item,
            product,
          };
        })
      );
      
      res.json(cartWithProducts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cart" });
    }
  });

  // Add to cart
  app.post("/api/cart", async (req, res) => {
    try {
      const validatedData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addToCart(validatedData);
      res.json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid cart item data" });
      } else {
        res.status(500).json({ error: "Failed to add to cart" });
      }
    }
  });

  // Update cart item
  app.put("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      
      if (quantity <= 0) {
        await storage.removeFromCart(id);
        res.json({ message: "Item removed from cart" });
      } else {
        const updatedItem = await storage.updateCartItem(id, quantity);
        res.json(updatedItem);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to update cart item" });
    }
  });

  // Remove from cart
  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.removeFromCart(id);
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove from cart" });
    }
  });

  // Create order
  app.post("/api/orders", async (req, res) => {
    try {
      const userId = req.body.userId || "guest";
      const cartItems = await storage.getCartItems(userId);
      
      if (cartItems.length === 0) {
        return res.status(400).json({ error: "Cart is empty" });
      }

      // Calculate total
      let total = 0;
      const orderItemsData = [];
      
      for (const cartItem of cartItems) {
        const product = await storage.getProduct(cartItem.productId);
        if (product) {
          const itemTotal = parseFloat(product.price) * cartItem.quantity;
          total += itemTotal;
          orderItemsData.push({
            productId: product.id,
            quantity: cartItem.quantity,
            price: product.price,
            title: product.title,
            image: product.image,
          });
        }
      }

      // Generate order number
      const orderNumber = `GH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Create order
      const order = await storage.createOrder({
        orderNumber,
        userId,
        total: total.toString(),
        status: "confirmed",
      });

      // Create order items
      for (const itemData of orderItemsData) {
        await storage.createOrderItem({
          orderId: order.id,
          ...itemData,
        });
      }

      // Clear cart
      await storage.clearCart(userId);

      // Update user's money saved (if user is logged in)
      if (userId !== "guest") {
        try {
          const numericUserId = parseInt(userId);
          await storage.updateUserMoneySaved(numericUserId, total);
          
          // Create savings event record
          await storage.createSavingsEvent({
            userId: numericUserId,
            eventType: 'checkout_prevented',
            amountSaved: total.toString(),
            description: `Fake checkout completed - saved $${total.toFixed(2)} by not making real purchase`,
          });
        } catch (error) {
          console.error('Failed to update user money saved:', error);
          // Don't fail the entire checkout if this fails
        }
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // Get orders
  app.get("/api/orders", async (req, res) => {
    try {
      const userId = req.query.userId as string || "guest";
      const orders = await storage.getOrders(userId);
      
      // Get order items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await storage.getOrderItems(order.id);
          return {
            ...order,
            items,
          };
        })
      );
      
      res.json(ordersWithItems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Get single order
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      const items = await storage.getOrderItems(order.id);
      res.json({
        ...order,
        items,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  // Download Chrome extension
  app.get("/api/download/buynothing-guard-extension.zip", async (req, res) => {
    try {
      const zipPath = path.join(process.cwd(), 'chrome-extension.zip');
      
      // Check if zip file exists, if not create it
      if (!fs.existsSync(zipPath)) {
        return res.status(404).json({ error: "Extension zip file not found" });
      }
      
      // Set response headers for zip download
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="buynothing-guard-extension.zip"');
      
      // Stream the zip file
      const fileStream = fs.createReadStream(zipPath);
      fileStream.pipe(res);
      
    } catch (error) {
      console.error('Download error:', error);
      res.status(500).json({ error: "Failed to prepare extension download" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
