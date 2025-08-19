import { useEffect, useState } from "react";

const CART_KEY = 'cart';

interface CartItem {
  id: string;
  quantity: number;
}

export const useCart = ()=>{
  
  const [cart,setCart] = useState<CartItem[]>([])

  useEffect(()=>{
    const storedCart = localStorage.getItem(CART_KEY);
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    } else {
      setCart([]);
    }
  },[])

  useEffect(()=>{
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  },[cart])

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === item.id);
      if (existing) {
        return prev.map(p =>
          p.id === item.id ? { ...p, quantity: p.quantity + item.quantity } : p
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  return { cart, addToCart, removeFromCart, clearCart };

}