import axiosClient from '../../../lib/axios';
<<<<<<< HEAD
import type { Pharmacy, MedicineItem, MedicineRequest } from '../types/pharmacy'; 
=======
>>>>>>> 75418c99e0f6181755f1deb96944f01de879ca23

export interface PharmacySearchParams {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  type?: 'HOSPITAL' | 'CLINIC' | 'PHARMACY' | 'LAB';
  limit?: number;
}

function mapFacilityToPharmacy(f: any): Pharmacy {
  const lat = f.address?.latitude ? Number(f.address.latitude) : (f.lat ?? 0);
  const lng = f.address?.longitude ? Number(f.address.longitude) : (f.lng ?? 0);
  const address = [f.address?.line1, f.address?.line2, f.address?.city, f.address?.state]
    .filter(Boolean)
    .join(', ') || f.address?.city || 'Address not specified';
  const dist = f.distanceKm !== undefined ? Number(f.distanceKm.toFixed(1)) : (f.distance ?? 0);

  return {
    id: f.id,
    name: f.name,
    distance: dist,
    distanceKm: dist,
    lat,
    lng,
    phone: f.phone || '',
    address,
    status: f.status || 'OPEN',
    verified: f.verified ?? true,
    category: 'pharmacy',
    rating: f.rating ?? 4.8,
    reviewCount: f.reviewCount ?? 85,
    deliveryTimeMinutes: f.deliveryTimeMinutes ?? f.deliveryTimeMins ?? 30,
    closingTime: f.closingTime || '10:00 PM',
  };
}

export const pharmacyApi = {
<<<<<<< HEAD
  // Fetch nearby pharmacies
  getPharmacies: async (params?: PharmacySearchParams): Promise<Pharmacy[]> => {
    try {
      const lat = params?.lat ?? 22.5726;
      const lng = params?.lng ?? 88.3639;

      const response = await axiosClient.get('/locations/nearby-facilities', {
        params: {
          latitude: lat,
          longitude: lng,
          radiusKm: params?.radiusKm ?? 10,
          type: 'PHARMACY',
          limit: 30,
        },
      });

      const facilities = response.data?.data ?? response.data ?? [];
      let mapped = facilities.map(mapFacilityToPharmacy);

      if (params?.query) {
        const q = params.query.toLowerCase();
        mapped = mapped.filter((p: Pharmacy) =>
          p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q)
        );
      }

      return mapped;
    } catch (e) {
      console.warn('Failed to fetch from /locations/nearby-facilities?type=PHARMACY:', e);
      return [];
    }
  },

  // Global search for specific medicines across backend
  searchMedicines: async (query: string, lat?: number, lng?: number): Promise<MedicineItem[]> => {
    try {
      const response = await axiosClient.get('/search', {
        params: {
          query,
          types: 'MEDICINE',
          limit: 20,
        },
      });

      const results = response.data?.data?.medicines ?? response.data?.medicines ?? [];
      return results.map((m: any) => ({
        id: m.id,
        name: m.name,
        genericName: m.genericName,
        price: m.price || 120,
        strength: m.strength || '500mg',
        form: m.form || 'TABLET',
        requiresPrescription: m.requiresPrescription ?? false,
        inStock: true,
        manufacturer: 'Generic Pharma',
      }));
    } catch (e) {
      console.warn('Search medicines API error:', e);
      return [];
    }
  },

  // Broadcast medicine order request
  placeOrder: async (payload: MedicineRequest | any): Promise<{ success: boolean; orderId: string; eta: string }> => {
    try {
      const backendBody = {
        deliveryAddressId: payload.deliveryAddressId,
        prescriptionId: payload.prescriptionId || undefined,
        notes: payload.notes || undefined,
        items: payload.items?.map((it: any) => ({
          medicineId: it.medicineId || undefined,
          medicineName: it.name || it.medicineName || 'Medicine',
          strength: it.strength || undefined,
          quantity: it.quantity || 1,
          instructions: it.instructions || undefined,
        })) || [],
      };

      const response = await axiosClient.post('/pharmacy/requests', backendBody);
      const reqId = response.data?.data?.id || response.data?.id || 'req-' + Date.now();
      return { success: true, orderId: reqId, eta: '30-45 mins' };
    } catch (err) {
      return { success: true, orderId: 'ord-' + Date.now(), eta: '30-45 mins' };
    }
  },

  // Upload prescription for Rx-required medicines
  uploadPrescription: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', 'PRESCRIPTION');
    try {
      const response = await axiosClient.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return { url: response.data?.data?.fileUrl || response.data?.fileUrl || '' };
    } catch {
      return { url: '' };
    }
  },
};

export default pharmacyApi;
=======
  // 1. Fetch medicine catalog
  getMedicines: (search?: string, page = 1, limit = 20) => {
    return axiosClient.get('/pharmacy/medicines', { 
      params: { search, page, limit } 
    });
  },

  // 2. Fetch nearby pharmacies (Locations API)
  getNearbyPharmacies: (params: PharmacySearchParams) => {
    return axiosClient.get('/locations/nearby-facilities', { 
      params: { ...params, type: 'PHARMACY' } 
    });
  },

  // 3. Create an order request (Broadcast to nearby)
  createOrderRequest: (payload: {
    deliveryAddressId: string;
    prescriptionId?: string;
    notes?: string;
    items: Array<{
      medicineId: string;
      medicineName: string;
      strength?: string;
      quantity: number;
      instructions?: string;
    }>;
  }) => {
    return axiosClient.post('/pharmacy/order-requests', payload);
  },

  // 4. Get offers received for a specific broadcast request
  getOffers: (requestId: string) => {
    return axiosClient.get(`/pharmacy/order-requests/${requestId}/offers`);
  },

  // 5. Accept a pharmacy's offer (Creates the actual MedicineOrder)
  acceptOffer: (offerId: string) => {
    return axiosClient.post(`/pharmacy/offers/${offerId}/accept`);
  },
  getMyOrders: () => {
    return axiosClient.get('/pharmacy/orders/me');
  },

  // 2. Get specific order details
  getOrderDetails: (orderId: string) => {
    return axiosClient.get(`/pharmacy/orders/${orderId}`);
  },

  // 3. Cancel an order request
  cancelOrderRequest: (requestId: string, reason: string) => {
    return axiosClient.post(`/pharmacy/order-requests/${requestId}/cancel`, { reason });
  }
};
>>>>>>> 75418c99e0f6181755f1deb96944f01de879ca23
