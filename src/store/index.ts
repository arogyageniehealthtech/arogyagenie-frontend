import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import locationReducer from './slices/locationSlice'
import cartReducer from './slices/cartSlice'
import deliveryReducer from './slices/deliverySlice'
export const store = configureStore({
  reducer: {
    auth: authReducer,
    location: locationReducer,
    cart: cartReducer,
    delivery: deliveryReducer,
    
  },
  
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;