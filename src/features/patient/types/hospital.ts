import type { BaseFacility } from './common';

export type BedType = 'general' | 'semi-private' | 'private' | 'icu' | 'hdu' | 'nicu';

export interface BedOption {
  type: BedType;
  label: string;
  rate: number;
  availableCount: number;
}

export interface HospitalAddress {
  id: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
  landmark?: string;
}

export interface Department {
  id: string;
  name: string;
  createdAt: string;
}

export interface Hospital extends Omit<BaseFacility, 'address' | 'rating' | 'reviewCount' | 'distanceKm' | 'about'> {
  id: string;
  facilityId: string;
  organizationId: string;
  status: string;
  address: HospitalAddress | string;
  bedCapacity: number;
  rating: number;
  reviewCount: number;
  distanceKm?: number;
  about?: string;
  hasEmergency: boolean;
  hasIcu: boolean;
  departments: Department[];
  facilityType?: string;
  establishedYear?: number;
  nextAvailableBed?: string;
  bedOptions?: BedOption[];
  emergencyServices?: boolean;
}