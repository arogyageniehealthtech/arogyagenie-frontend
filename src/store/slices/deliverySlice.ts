import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { DeliveryStatus } from '@/features/delivery-partner/types/delivery';

// Re-export the type so other files can import it from this slice
export type { DeliveryStatus };

interface DeliveryState {
  isOnline: boolean;
  activeDeliveryId: string | null;
  activeDeliveryStatus: DeliveryStatus | null;
}

const initialState: DeliveryState = {
  isOnline: false,
  activeDeliveryId: null,
  activeDeliveryStatus: null,
};

const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {
    toggleOnlineStatus: (state) => {
      state.isOnline = !state.isOnline;
    },
    setActiveDelivery: (state, action: PayloadAction<{ id: string; status: DeliveryStatus }>) => {
      state.activeDeliveryId = action.payload.id;
      state.activeDeliveryStatus = action.payload.status;
    },
    updateActiveStatus: (state, action: PayloadAction<DeliveryStatus>) => {
      state.activeDeliveryStatus = action.payload;
    },
    clearActiveDelivery: (state) => {
      state.activeDeliveryId = null;
      state.activeDeliveryStatus = null;
    },
  },
});

export const { toggleOnlineStatus, setActiveDelivery, updateActiveStatus, clearActiveDelivery } = deliverySlice.actions;
export default deliverySlice.reducer;