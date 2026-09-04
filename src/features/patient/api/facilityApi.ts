import axiosInstance from '@/lib/axios';
import axios from 'axios';

export type FacilityType = 'HOSPITAL' | 'CLINIC' | 'PHARMACY' | 'LAB';

export interface NearbyFacilityParams {
  latitude: number;
  longitude: number;
  radiusKm?: number;
  type?: FacilityType;
  limit?: number;
}

export interface Facility {
  id: string | number;
  name: string;
  lat: number;
  lng: number;
  distanceKm: number;
  rating?: number;
  reviewCount?: number;
  availableTests?: { name: string; rate: number }[];
  // Added optional fields required by DiagnosticCentre / LabCard components
  establishedYear?: number;
  verified?: boolean;
  address?: string;
  about?: string;
  availableDates?: string[];
  facilityType?: string;
  departments?: string[];
}

export const facilityApi = {
  getNearbyFacilities: async (params: NearbyFacilityParams): Promise<Facility[]> => {
    const response = await axiosInstance.get('/locations/nearby-facilities', { params });
    console.log(response.data);
    return response.data?.data || response.data;
  }
};