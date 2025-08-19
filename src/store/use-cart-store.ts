import {create} from "zustand"
import {persist} from "zustand/middleware"

type CartItem = {
  id: string;
  quantity: number;
}

type CartState = {
  cart: CartItem[];
}

type CartActions = {
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set,get)=>({
      cart: [],

      addToCart: (item) => {
        const cart = get().cart;
        const existingItem = cart.find((c) => c.id === item.id);

        if (existingItem) {
          set({
            cart: cart.map((c) =>
              c.id === item.id
                ? { ...c, quantity: c.quantity + item.quantity }
                : c
            ),
          });
        } else {
          set({ cart: [...cart, item] });
        }
      },

      removeFromCart: (id) =>
        set({
          cart: get().cart.filter((item) => item.id !== id),
        }),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'cart-storage'
    }
))