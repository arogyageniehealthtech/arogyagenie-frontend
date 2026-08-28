export interface PatientInfo {
  name: string;
  age: string;
  gender: string;
  mobile: string;
  address: string;
  bloodGroup: string;
  emergencyContact: string;
}

export interface BaseFacility {
  id: string;
  name: string;
  image?: string;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  address: string;
  about: string;
  availableDates: string[];
  lat?: number; // Added for Google Maps
  lng?: number; // Added for Google Maps
}