// src/context/CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { cartAPI } from "../utils/api";

export interface CartItem {
  _id: string;
  productId: {
    _id: string;
    productName: string;
    price: number;
    description?: string;
    category?: string;
  };
  quantity: number;
  price: number;
}

interface Cart {
  _id: string;
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: (shippingAddress: string, paymentMethod: string) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.data.cart);
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setCart(null);
      } else {
        setError(err.response?.data?.message || 'Failed to fetch cart');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addToCart = async (productId: string, quantity: number) => {
    try {
      setLoading(true);
      await cartAPI.addToCart({ productId, quantity });
      await refreshCart();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add to cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    try {
      setLoading(true);
      await cartAPI.updateCartItem(itemId, { quantity });
      await refreshCart();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update cart item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      setLoading(true);
      await cartAPI.removeFromCart(itemId);
      await refreshCart();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove from cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await cartAPI.clearCart();
      await refreshCart();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to clear cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkout = async (shippingAddress: string, paymentMethod: string) => {
    try {
      setLoading(true);
      await cartAPI.checkout({ shippingAddress, paymentMethod });
      await refreshCart();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Checkout failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        checkout,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
