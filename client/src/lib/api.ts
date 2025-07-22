import { apiRequest } from './queryClient';

export interface Product {
  id: number;
  title: string;
  price: string;
  description: string;
  category: string;
  subcategory?: string;
  image: string;
  rating: string;
  ratingCount: number;
  features?: string[];
  detailedDescription?: string;
}

export interface Review {
  id: number;
  productId: number;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  helpful: number;
  createdAt: Date;
}

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  userId: string;
  product?: Product;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: string;
  total: string;
  status: string;
  createdAt: Date;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: string;
  title: string;
  image: string;
}

export const api = {
  products: {
    getAll: async (): Promise<Product[]> => {
      const response = await apiRequest('GET', '/api/products');
      return response.json();
    },
    getById: async (id: number): Promise<Product> => {
      const response = await apiRequest('GET', `/api/products/${id}`);
      return response.json();
    },
    getReviews: async (productId: number): Promise<Review[]> => {
      const response = await apiRequest('GET', `/api/products/${productId}/reviews`);
      return response.json();
    },
  },
  
  cart: {
    getItems: async (userId: string = 'guest'): Promise<CartItem[]> => {
      const response = await apiRequest('GET', `/api/cart?userId=${userId}`);
      return response.json();
    },
    addItem: async (productId: number, quantity: number = 1, userId: string = 'guest'): Promise<CartItem> => {
      const response = await apiRequest('POST', '/api/cart', {
        productId,
        quantity,
        userId,
      });
      return response.json();
    },
    updateItem: async (id: number, quantity: number): Promise<CartItem> => {
      const response = await apiRequest('PUT', `/api/cart/${id}`, { quantity });
      return response.json();
    },
    removeItem: async (id: number): Promise<void> => {
      await apiRequest('DELETE', `/api/cart/${id}`);
    },
  },
  
  orders: {
    getAll: async (userId: string = 'guest'): Promise<Order[]> => {
      const response = await apiRequest('GET', `/api/orders?userId=${userId}`);
      return response.json();
    },
    getById: async (id: number): Promise<Order> => {
      const response = await apiRequest('GET', `/api/orders/${id}`);
      return response.json();
    },
    create: async (userId: string = 'guest'): Promise<Order> => {
      const response = await apiRequest('POST', '/api/orders', { userId });
      return response.json();
    },
  },
};
