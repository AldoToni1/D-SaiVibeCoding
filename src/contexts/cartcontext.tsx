'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "qty">) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const STORAGE_KEY = "menuKu_cart";
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load from localStorage saat reload
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setCart(JSON.parse(stored));
  }, []);

  const sync = (items: CartItem[]) => {
    setCart(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const addToCart = (item: Omit<CartItem, "qty">) => {
    const existing = cart.find((i) => i.id === item.id);
    if (existing) {
      sync(cart.map(i =>
        i.id === item.id ? { ...i, qty: i.qty + 1 } : i
      ));
    } else {
      sync([...cart, { ...item, qty: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    sync(cart.filter((i) => i.id !== id));
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      // Jika qty <= 0, hapus dari cart
      sync(cart.filter((i) => i.id !== id));
    } else {
      sync(cart.map(i => i.id === id ? { ...i, qty } : i));
    }
  };

  const clearCart = () => sync([]);

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.qty, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.qty * item.price, 0);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQty, 
      clearCart,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
