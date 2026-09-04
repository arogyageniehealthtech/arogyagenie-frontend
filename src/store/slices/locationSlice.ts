// src/store/locationSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Coordinates {
  lat: number;
  lng: number;
}

interface LocationState {
  coordinates: Coordinates | null;
  addressString: string;
  isUsingCustom: boolean;
  isLoading: boolean;
  error: string | null;
} 

// Initial state starts with null coordinates until fetched from the browser
const initialState: LocationState = {
  coordinates: null,
  addressString: "Fetching location...",
  isUsingCustom: false,
  isLoading: false,
  error: null,
} ;

export const fetchCurrentLocation = createAsyncThunk(
  'location/fetchCurrentLocation',
  async (_, { rejectWithValue }) => {
    if (!navigator.geolocation) {
      return rejectWithValue("Geolocation is not supported by your browser");
    }

    return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          reject("Unable to retrieve your location. Please check permissions.");
        },
        { enableHighAccuracy: true, maximumAge: 0 }
      );
    }).catch((err) => rejectWithValue(err));
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