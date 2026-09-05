import axiosClient from '../../../lib/axios';

export interface PharmacySearchParams {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  type?: 'HOSPITAL' | 'CLINIC' | 'PHARMACY' | 'LAB';
  limit?: number;
}

export const pharmacyApi = {
  // 1. Fetch medicine catalog
  getMedicines: (search?: string, page = 1, limit = 20) => {
    return axiosClient.get('/pharmacy/medicines', { 
      params: { search, page, limit } 
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