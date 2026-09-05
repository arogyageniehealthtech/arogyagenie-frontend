import axiosClient from '../../../lib/axios';

// ============================================================================
// TYPES & SCHEMAS
// ============================================================================

export interface Medicine {
  id: string;
  name: string;
  brandName?: string;
  genericName?: string;
  medicineType?: string;
  category?: string;
  price: number;
  mrp?: number;
  discountPercentage?: number;
  stock?: number;
  prescriptionRequired?: boolean;
  packSize?: string;
  imageUrl?: string;
}

export interface MedicineCatalogParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface OrderRequestItemPayload {
  medicineId?: string;
  medicineName: string;
  strength?: string;
  quantity: number;
  instructions?: string;
}

export interface CreateOrderRequestPayload {
  deliveryAddressId: string;
  prescriptionId?: string;
  notes?: string;
  items: OrderRequestItemPayload[];
}

export interface MedicineOrderRequest {
  id: string;
  patientId: string;
  deliveryAddressId: string;
  prescriptionId?: string;
  notes?: string;
  status: 'PENDING' | 'OFFERS_RECEIVED' | 'ACCEPTED' | 'CANCELLED';
  items: Array<{
    id: string;
    medicineId?: string;
    medicineName: string;
    strength?: string;
    quantity: number;
    instructions?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface PharmacyOfferItem {
  requestItemId: string;
  medicineId?: string;
  available?: boolean;
  price: number;
  disc?: number;
}

export interface PharmacyOffer {
  id: string;
  requestId: string;
  pharmacyId: string;
  pharmacy?: {
    id: string;
    name: string;
    address?: string;
    distance?: number;
    rating?: number;
  };
  items: PharmacyOfferItem[];
  totalPrice?: number;
  totalDiscount?: number;
  estimatedDeliveryMinutes?: number;
  createdAt: string;
}

export interface SubmitOfferPayload {
  items: {
    requestItemId: string;
    medicineId?: string;
    available?: boolean;
    price: number;
  }[];
}

export type OrderStatus = 'CONFIRMED' | 'PREPARING' | 'READY_FOR_PICKUP' | 'CANCELLED' | 'OUT_FOR_DELIVERY' | 'DELIVERED';

export interface MedicineOrderItem {
  medicineId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface MedicineOrder {
  id: string;
  orderRequestId?: string;
  pharmacyId?: string;
  pharmacyName: string;
  pharmacyAddress: string;
  deliveryAddress: string;
  status: OrderStatus;
  totalAmount: number;
  items: MedicineOrderItem[];
  otp?: string;
  eta?: string;
  riderName?: string;
  riderPhone?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DeliveryAssignment {
  id: string;
  orderId: string;
  pharmacy: {
    name: string;
    address: string;
    latitude?: number;
    longitude?: number;
  };
  destination: {
    address: string;
    area?: string;
    latitude?: number;
    longitude?: number;
  };
  distanceKm?: number;
  estimatedMinutes?: number;
  earnings?: number;
  status: 'OPEN' | 'CLAIMED' | 'PICKED_UP' | 'DELIVERED';
  createdAt: string;
}

// ============================================================================
// PHARMACY API SERVICE
// ============================================================================

export const pharmacyApi = {
  // --- Medicine Catalog ---

  /** Search / browse the medicine catalog */
  getMedicines: (params?: MedicineCatalogParams): Promise<{ data: Medicine[] }> => {
    return axiosClient.get('/pharmacy/medicines', { params });
  },

  // --- Prescription Upload ---

  /** Upload prescription file */
  uploadPrescription: (file: File): Promise<{ url: string; id?: string }> => {
    const formData = new FormData();
    formData.append('prescription', file);

    return axiosClient.post('/pharmacy/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // --- Order Requests (Patient Bidding / Broadcast) ---

  /** [Patient] Create an order request (broadcasts to nearby pharmacies) */
  createOrderRequest: (payload: CreateOrderRequestPayload): Promise<{ data: MedicineOrderRequest }> => {
    return axiosClient.post('/pharmacy/order-requests', payload);
  },

  /** [Patient] List own order requests */
  getMyOrderRequests: (): Promise<{ data: MedicineOrderRequest[] }> => {
    return axiosClient.get('/pharmacy/order-requests/me');
  },

  /** Get an order request by ID */
  getOrderRequest: (requestId: string): Promise<{ data: MedicineOrderRequest }> => {
    return axiosClient.get(`/pharmacy/order-requests/${requestId}`);
  },

  /** [Patient] Cancel an order request */
  cancelOrderRequest: (requestId: string, reason?: string): Promise<{ message: string }> => {
    return axiosClient.post(`/pharmacy/order-requests/${requestId}/cancel`, { reason });
  },

  // --- Offers / Bids ---

  /** List offers received for an order request */
  getOffers: (requestId: string): Promise<{ data: PharmacyOffer[] }> => {
    return axiosClient.get(`/pharmacy/order-requests/${requestId}/offers`);
  },

  /** [Pharmacy staff] Submit an offer for a broadcast request */
  submitOffer: (requestId: string, payload: SubmitOfferPayload): Promise<{ data: PharmacyOffer }> => {
    return axiosClient.post(`/pharmacy/order-requests/${requestId}/offers`, payload);
  },

  /** [Patient] Accept a pharmacy's offer — creates the MedicineOrder */
  acceptOffer: (offerId: string): Promise<{ data: MedicineOrder }> => {
    return axiosClient.post(`/pharmacy/offers/${offerId}/accept`);
  },

  // --- Orders ---

  /** [Patient] List own orders */
  getMyOrders: (): Promise<{ data: MedicineOrder[] }> => {
    return axiosClient.get('/pharmacy/orders/me');
  },

  /** Get an order by ID */
  getOrder: (orderId: string): Promise<{ data: MedicineOrder }> => {
    return axiosClient.get(`/pharmacy/orders/${orderId}`);
  },

  /** [Pharmacy staff] Advance order status (CONFIRMED -> PREPARING -> READY_FOR_PICKUP -> CANCELLED) */
  updateOrderStatus: (
    orderId: string,
    status: 'CONFIRMED' | 'PREPARING' | 'READY_FOR_PICKUP' | 'CANCELLED'
  ): Promise<{ data: MedicineOrder }> => {
    return axiosClient.patch(`/pharmacy/orders/${orderId}/status`, { status });
  },

  // --- Delivery Partner Operations ---

  /** [Delivery partner] Browse nearby unclaimed delivery assignments */
  getNearbyDeliveryAssignments: (params: {
    latitude: number;
    longitude: number;
    radiusKm?: number;
  }): Promise<{ data: DeliveryAssignment[] }> => {
    return axiosClient.get('/pharmacy/delivery/nearby-open', { params });
  },

  /** [Delivery partner] Claim an open delivery assignment */
  claimDeliveryAssignment: (assignmentId: string): Promise<{ data: DeliveryAssignment }> => {
    return axiosClient.post(`/pharmacy/delivery/${assignmentId}/claim`);
  },

  /** [Delivery partner] Confirm pickup via OTP */
  confirmDeliveryPickup: (assignmentId: string, otp: string): Promise<{ message: string }> => {
    return axiosClient.post(`/pharmacy/delivery/${assignmentId}/pickup`, { otp });
  },

  /** [Delivery partner] Confirm delivery via OTP */
  confirmDeliveryDropoff: (assignmentId: string, otp: string): Promise<{ message: string }> => {
    return axiosClient.post(`/pharmacy/delivery/${assignmentId}/deliver`, { otp });
  }
};