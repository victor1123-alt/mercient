// src/context/CartContext.tsx
import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export interface ProductItem {
  img: string;
  name: string;
  price: string; // e.g. "$50"
  button: string;
}

export interface CartProduct extends ProductItem {
  quantity: number;
}

interface CartContextType {
  cartItems: CartProduct[];
  cartCount: number;
  addToCart: (item: ProductItem) => void;
  increaseQty: (itemName: string) => void;
  decreaseQty: (itemName: string) => void;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartProduct[]>([]);

  // ✅ Add product to cart
  const addToCart = (item: ProductItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (existing) {
        // if product already exists, increase quantity
        return prev.map((i) =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      // otherwise add new item
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // ✅ Increase quantity
  const increaseQty = (itemName: string) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.name === itemName ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  };

  // ✅ Decrease quantity (remove if 0)
  const decreaseQty = (itemName: string) => {
    setCartItems((prev) =>
      prev
        .map((i) =>
          i.name === itemName ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  // ✅ Calculate total price
  const totalPrice = cartItems.reduce((total, item) => {
    const priceNumber = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
    return total + priceNumber * item.quantity;
  }, 0);

  // ✅ Count total quantity across all items
  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount: totalQuantity, // 🔥 now shows total quantity instead of item types
        addToCart,
        increaseQty,
        decreaseQty,
        totalPrice,
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
