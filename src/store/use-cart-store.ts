import {create} from "zustand"
import {persist} from "zustand/middleware"

type CartItem = {
  id: string;
  quantity: number;
}

type CartState = {
  cart: CartItem[];
  openCart: boolean;
}

type CartActions = {
  setOpenCart: (open: boolean) => void;
  addToCart: (item: CartItem) => void;
  decrementQuantity: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set,get)=>({
      cart: [],
      openCart: false,
      setOpenCart: (open) => set({ openCart: open }),

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

      decrementQuantity: (id) => {
        const cart = get().cart;
        const existingItem = cart.find((c) => c.id === id);

        if (existingItem) {
          if (existingItem.quantity > 1) {
            set({
              cart: cart.map((c) =>
                c.id === id ? { ...c, quantity: c.quantity - 1 } : c
              ),
            });
          } else {
            set({ cart: cart.filter((c) => c.id !== id) });
          }
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