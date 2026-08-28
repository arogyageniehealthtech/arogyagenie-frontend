// src/store/locationSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'
export interface Coordinates {
  lat: number;
  lng: number;
}

interface LocationState {
  coordinates: Coordinates;
  addressString: string;
  isUsingCustom: boolean;
  isLoading: boolean;
  error: string | null;
}

// Default to Khardaha, West Bengal
const initialState: LocationState = {
  coordinates: { lat: 22.7281, lng: 88.3752 },
  addressString: "Khardaha, West Bengal",
  isUsingCustom: false,
  isLoading: false,
  error: null,
};

// Async Thunk for Geolocation API
export const fetchCurrentLocation = createAsyncThunk(
  'location/fetchCurrentLocation',
  async (_, { rejectWithValue }) => {
    if (!navigator.geolocation) {
      return rejectWithValue("Geolocation is not supported by your browser");
    }

    return new Promise<{ lat: number; lng: number }>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          rejectWithValue("Unable to retrieve your location. Please check permissions.");
        },
        { enableHighAccuracy: true }
      );
    });
  }
);

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setCustomLocation: (
      state, 
      action: PayloadAction<{ lat: number; lng: number; address: string }>
    ) => {
      state.coordinates = { lat: action.payload.lat, lng: action.payload.lng };
      state.addressString = action.payload.address;
      state.isUsingCustom = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentLocation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentLocation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.coordinates = action.payload;
        state.addressString = "Current Live Location";
        state.isUsingCustom = false;
      })
      .addCase(fetchCurrentLocation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCustomLocation } = locationSlice.actions;
export default locationSlice.reducer;