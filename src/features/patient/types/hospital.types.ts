export type HospitalServiceType =
  | "EMERGENCY"
  | "AMBULANCE"
  | "PHARMACY"
  | "LAB"
  | "CAFETERIA"
  | "BLOOD_BANK"
  | "MRI"
  | "CT_SCAN"
  | "ICU";

export interface HospitalService {
  id: string;
  type: HospitalServiceType;
  name: string;
  isAvailable: boolean;
}

export interface Hospital {
  id: string;
  name: string;
  image: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isEmergencyAvailable: boolean;
  icuBedsAvailable: number;
  generalBedsAvailable: number;
  privateRoomsAvailable: number;
  specialistCount: number;
  specialties: string[];
  services: HospitalService[];
  phoneNumber: string;
  isFavorite: boolean;
}