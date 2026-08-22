export type ProviderType = 'All' | 'Doctor' | 'Diagnostic Lab' | 'Pharmacy';

export interface Location {
  lat: number;
  lng: number;
  name: string;
}

export interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  specialization: string;
  address: string;
  distance: number; 
  lat: number;
  lng: number;
}