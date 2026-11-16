import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { createStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  productId: number;
  name: string;
  image?: string;
  basePrice: number;
  discountedPrice?: number;
  quantity: number;
  attributes?: Record<string, string>;
}

export interface CartState {
  items: CartItem[];
  isHydrated: boolean;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setHydrated: (isHydrated: boolean) => void;
}

export const useCartStore = createStore<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isHydrated: false,
      setHydrated: (isHydrated: boolean) => set({ isHydrated }),
      addItem: (newItem) => {
        const { items } = get();
        const quantityToAdd = newItem.quantity ?? 1;
        const existingIndex = items.findIndex((i) => i.id === newItem.id);

        if (existingIndex > -1) {
          const updated = [...items];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantityToAdd,
          };
          set({ items: updated });
        } else {
          set({
            items: [
              ...items,
              {
                ...newItem,
                quantity: quantityToAdd,
              },
            ],
          });
        }
      },
      removeItem: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        });
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: "fine-shop-cart",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

export const useCartSelector = createSelectorHooks(useCartStore);

/**
 * Custom hook to safely get cart state on the client side without hydration mismatch
 */
export function useCart() {
  const isHydrated = useCartSelector.useIsHydrated();
  const items = useCartSelector.useItems();
  const addItem = useCartSelector.useAddItem();
  const removeItem = useCartSelector.useRemoveItem();
  const updateQuantity = useCartSelector.useUpdateQuantity();
  const clearCart = useCartSelector.useClearCart();

  const safeItems = isHydrated ? items : [];

  const totalItems = safeItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotalPrice = safeItems.reduce(
    (acc, item) => acc + item.basePrice * item.quantity,
    0
  );

  const totalPayablePrice = safeItems.reduce(
    (acc, item) =>
      acc + (item.discountedPrice ?? item.basePrice) * item.quantity,
    0
  );

  const totalDiscount = Math.max(0, subtotalPrice - totalPayablePrice);

  return {
    items: safeItems,
    isHydrated,
    totalItems,
    subtotalPrice,
    totalDiscount,
    totalPayablePrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
}
