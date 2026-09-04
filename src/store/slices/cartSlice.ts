import { createSlice, } from '@reduxjs/toolkit';
import type { PayloadAction, } from '@reduxjs/toolkit';

import type { Medicine, CartItem } from '../../types/medicine.type.';

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<{ medicine: Medicine; quantity?: number }>) => {
      const { medicine, quantity = 1 } = action.payload;
      const existingItem = state.items.find((item) => item.medicineId === medicine.id);

      if (existingItem) {
        existingItem.quantity = Math.min(existingItem.quantity + quantity, medicine.stock);
      } else {
        state.items.push({
          medicineId: medicine.id,
          medicine,
          quantity,
          unitPrice: medicine.price,
        });
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.medicineId !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ medicineId: string; quantity: number }>) => {
      const { medicineId, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.medicineId !== medicineId);
        return;
      }
      const existingItem = state.items.find((item) => item.medicineId === medicineId);
      if (existingItem) {
        existingItem.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;

// --- Selectors ---
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;

export const selectCartTotalItems = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const selectCartTotalPrice = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);

export const selectCartItemById = (medicineId: string) => (state: { cart: CartState }) =>
  state.cart.items.find((item) => item.medicineId === medicineId);

export default cartSlice.reducer;