// src/api/pharmacyApi.ts
import axiosClient from './axiosClient';
// Assuming you have Pharmacy and Medicine types defined
import type { Pharmacy, Medicine, OrderPayload } from '../types/pharmacy'; 

export interface PharmacySearchParams {
  query?: string;
  radiusKm?: number;
  lat?: number;
  lng?: number;
}

export const pharmacyApi = {
  // Fetch nearby pharmacies
  getPharmacies: (params?: PharmacySearchParams): Promise<Pharmacy[]> => {
    return axiosClient.get('/pharmacies', { params });
  },

  // Global search for specific medicines across all nearby pharmacies
  searchMedicines: (query: string, lat?: number, lng?: number): Promise<Medicine[]> => {
    return axiosClient.get('/pharmacies/medicines/search', { params: { query, lat, lng } });
  },

  // Place an order for medicines
  placeOrder: (payload: OrderPayload): Promise<{ success: boolean; orderId: string; eta: string }> => {
    return axiosClient.post('/pharmacies/order', payload);
  },

  // Upload prescription for Rx-required medicines
  uploadPrescription: (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('prescription', file);
    return axiosClient.post('/pharmacies/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};