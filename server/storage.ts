import { products, cartItems, orders, orderItems, users, userSessions, savingsEvents, type Product, type CartItem, type Order, type OrderItem, type User, type UserSession, type SavingsEvent, type InsertProduct, type InsertCartItem, type InsertOrder, type InsertOrderItem, type InsertUser, type InsertUserSession, type InsertSavingsEvent } from "@shared/schema";
import { db } from "./db";
import { eq, and, sql } from "drizzle-orm";
import bcrypt from "bcrypt";
import crypto from "crypto";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProductImage(id: number, imageUrl: string): Promise<Product | undefined>;
  updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<void>;
  
  // Cart
  getCartItems(userId: string): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<void>;
  clearCart(userId: string): Promise<void>;
  
  // Orders
  getOrders(userId: string): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  
  // Users & Authentication
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  verifyPassword(email: string, password: string): Promise<User | undefined>;
  
  // Sessions
  createSession(session: InsertUserSession): Promise<UserSession>;
  getSessionByToken(token: string): Promise<UserSession | undefined>;
  deleteSession(token: string): Promise<void>;
  
  // Savings tracking
  addSavingsEvent(event: InsertSavingsEvent): Promise<SavingsEvent>;
  getUserSavingsEvents(userId: number): Promise<SavingsEvent[]>;
  updateUserVisit(userId: number): Promise<User | undefined>;
  updateUserMoneySaved(userId: number, amount: number): Promise<User | undefined>;
  createSavingsEvent(event: InsertSavingsEvent): Promise<SavingsEvent>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  async updateProductImage(id: number, imageUrl: string): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set({ image: imageUrl })
      .where(eq(products.id, id))
      .returning();
    return product || undefined;
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set(updates)
      .where(eq(products.id, id))
      .returning();
    return product || undefined;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async getCartItems(userId: string): Promise<CartItem[]> {
    return await db.select().from(cartItems).where(eq(cartItems.userId, userId));
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const [existingItem] = await db
      .select()
      .from(cartItems)
      .where(and(
        eq(cartItems.productId, insertItem.productId),
        eq(cartItems.userId, insertItem.userId || "guest")
      ));
    
    if (existingItem) {
      // Update quantity if item exists
      const [updatedItem] = await db
        .update(cartItems)
        .set({ quantity: existingItem.quantity + (insertItem.quantity || 1) })
        .where(eq(cartItems.id, existingItem.id))
        .returning();
      return updatedItem;
    }

    // Create new cart item
    const [cartItem] = await db
      .insert(cartItems)
      .values({
        ...insertItem,
        quantity: insertItem.quantity || 1,
        userId: insertItem.userId || "guest"
      })
      .returning();
    return cartItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const [cartItem] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return cartItem || undefined;
  }

  async removeFromCart(id: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }

  async clearCart(userId: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }

  async getOrders(userId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db
      .insert(orders)
      .values({
        ...insertOrder,
        userId: insertOrder.userId || "guest",
        status: insertOrder.status || "confirmed"
      })
      .returning();
    return order;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(insertItem: InsertOrderItem): Promise<OrderItem> {
    const [orderItem] = await db
      .insert(orderItems)
      .values(insertItem)
      .returning();
    return orderItem;
  }

  // User & Authentication methods
  async createUser(insertUser: InsertUser): Promise<User> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(insertUser.password, saltRounds);
    
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        password: hashedPassword,
      })
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async verifyPassword(email: string, password: string): Promise<User | undefined> {
    const user = await this.getUserByEmail(email);
    if (!user) return undefined;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : undefined;
  }

  // Session methods
  async createSession(insertSession: InsertUserSession): Promise<UserSession> {
    const [session] = await db
      .insert(userSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async getSessionByToken(token: string): Promise<UserSession | undefined> {
    const [session] = await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.sessionToken, token));
    return session || undefined;
  }

  async deleteSession(token: string): Promise<void> {
    await db.delete(userSessions).where(eq(userSessions.sessionToken, token));
  }

  // Savings tracking methods
  async addSavingsEvent(insertEvent: InsertSavingsEvent): Promise<SavingsEvent> {
    const [event] = await db
      .insert(savingsEvents)
      .values(insertEvent)
      .returning();
    
    // Update user's total money saved
    await db
      .update(users)
      .set({
        totalMoneySaved: sql`${users.totalMoneySaved} + ${insertEvent.amountSaved}`,
        updatedAt: new Date()
      })
      .where(eq(users.id, insertEvent.userId));
    
    return event;
  }

  async getUserSavingsEvents(userId: number): Promise<SavingsEvent[]> {
    return await db
      .select()
      .from(savingsEvents)
      .where(eq(savingsEvents.userId, userId));
  }

  async updateUserVisit(userId: number): Promise<User | undefined> {
    const user = await this.getUserById(userId);
    if (!user) return undefined;

    const today = new Date().toISOString().split('T')[0];
    const lastVisit = user.lastVisitDate ? new Date(user.lastVisitDate).toISOString().split('T')[0] : null;
    
    let newCurrentStreak = user.currentStreak || 0;
    let newLongestStreak = user.longestStreak || 0;

    if (lastVisit) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastVisit === yesterdayStr) {
        // Consecutive day visit
        newCurrentStreak = newCurrentStreak + 1;
      } else if (lastVisit !== today) {
        // Streak broken (not today and not yesterday)
        newCurrentStreak = 1;
      }
      // If lastVisit === today, don't increment (already visited today)
    } else {
      // First visit ever
      newCurrentStreak = 1;
    }

    // Update longest streak if current streak is longer
    if (newCurrentStreak > newLongestStreak) {
      newLongestStreak = newCurrentStreak;
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        lastVisitDate: today,
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        totalVisits: sql`${users.totalVisits} + 1`,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();

    return updatedUser || undefined;
  }

  async updateUserMoneySaved(userId: number, amount: number): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set({
        totalMoneySaved: sql`${users.totalMoneySaved} + ${amount}`,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();

    return updatedUser || undefined;
  }

  async createSavingsEvent(event: InsertSavingsEvent): Promise<SavingsEvent> {
    const [savingsEvent] = await db
      .insert(savingsEvents)
      .values(event)
      .returning();
    return savingsEvent;
  }
}

export const storage = new DatabaseStorage();
