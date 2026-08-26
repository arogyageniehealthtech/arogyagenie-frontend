export type OrderStatus = 'DRAFT' | 'OPEN' | 'OFFERS_RECEIVED' | 'ACCEPTED' | 'PREPARING' | 'OUT_FOR_DELIVERY';
export type FulfillmentMode = 'SPECIFIC' | 'BROADCAST';

export interface MedicineItem {
  id: string;
  name: string;
  quantity: number;
  dosage: string;
  price: number;
  composition: string;
  packSize: string;
  form: string;
  requiresPrescription: boolean;
}

export type Medicine = MedicineItem;

export interface OrderPayload {
  items: Array<{ medicineId: string; quantity: number }>;
  pharmacyId?: string;
  deliveryAddress?: string;
  prescriptionUrl?: string;
}

export interface PharmacyOffer {
  pharmacyId: string;
  pharmacyName: string;
  distanceKm: number;
}

export interface MedicineRequest {
  id: string;
  patientName: string;
  distanceKm: number;
  mode: FulfillmentMode;
  status: OrderStatus;
  medicines: MedicineItem[];
  hasPrescription: boolean;
  offers: PharmacyOffer[];
  assignedPharmacyId: string | null;
  createdAt: string;
}

// src/types/pharmacy.ts

export interface Pharmacy {
  id: string;
  name: string;
  image?: string;
  address: string;
  distance: number;
  status: string;      // e.g., 'OPEN' or 'CLOSED'
  verified: boolean;
  lat: number;
  lng: number;
  category: 'pharmacy';
  
  // Optional extra properties used in the card UI if provided by the backend
  rating?: number;
  reviewCount?: number;
  deliveryTimeMinutes?: number;
  closingTime?: string;
}