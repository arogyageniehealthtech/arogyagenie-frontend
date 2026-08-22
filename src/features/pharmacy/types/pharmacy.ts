export type OrderStatus = 'DRAFT' | 'OPEN' | 'OFFERS_RECEIVED' | 'ACCEPTED' | 'PREPARING' | 'OUT_FOR_DELIVERY';
export type FulfillmentMode = 'SPECIFIC' | 'BROADCAST';

export interface MedicineItem {
  id: string;
  name: string;
  quantity: number;
  dosage: string;
  form: string;
  requiresPrescription: boolean;
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

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  distance: number;
  status: string;
  verified: boolean;
  lat: number;
  lng: number;
  category: 'pharmacy';
}