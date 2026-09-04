// src/api/hospitalApi.ts
import axiosClient from '../../../lib/axios';
import type { Hospital, BedOption } from '../types/hospital';

export interface HospitalSearchParams {
  query?: string;
  department?: string | null;
  radiusKm?: number;
  lat?: number;
  lng?: number;
}

export interface BedBookingPayload {
  hospitalId: string;
  admissionType: 'planned' | 'emergency' | 'daycare';
  department: string;
  bedType: string;
  date?: string;
  time?: string;
  patientDetails?: any;
}

const DEFAULT_BED_OPTIONS: BedOption[] = [
  { type: 'general', label: 'General Ward', rate: 1500, availableCount: 8 },
  { type: 'semi-private', label: 'Semi-Private Room', rate: 3000, availableCount: 3 },
  { type: 'private', label: 'Private Room', rate: 4500, availableCount: 2 },
  { type: 'icu', label: 'ICU Bed', rate: 8000, availableCount: 1 },
];

function mapFacilityToHospital(f: any): Hospital {
  const lat = f.address?.latitude ? Number(f.address.latitude) : (f.lat ?? undefined);
  const lng = f.address?.longitude ? Number(f.address.longitude) : (f.lng ?? undefined);
  const fullAddress = [f.address?.line1, f.address?.line2, f.address?.city, f.address?.state]
    .filter(Boolean)
    .join(', ') || f.address?.city || 'Address not specified';

  return {
    id: f.id,
    name: f.name,
    facilityType: f.type || 'Multispecialty',
    establishedYear: f.establishedYear ?? 2005,
    rating: f.rating ?? 4.7,
    reviewCount: f.reviewCount ?? 120,
    distanceKm: f.distanceKm !== undefined ? Number(f.distanceKm.toFixed(1)) : 0,
    lat,
    lng,
    phone: f.phone || '',
    nextAvailableBed: f.nextAvailableBed || 'Immediate',
    departments: f.departments || ['Emergency Care', 'Cardiology', 'General Medicine', 'Neurology'],
    bedOptions: f.bedOptions || DEFAULT_BED_OPTIONS,
    about: f.about || 'A leading hospital providing comprehensive healthcare and emergency services.',
    availableDates: f.availableDates || ['2026-09-05', '2026-09-06', '2026-09-07'],
    address: fullAddress,
    image: f.image || 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=600&h=400',
  };
}

export const hospitalApi = {
  // Fetch hospitals based on coordinates and radius, with search query support
  getHospitals: async (params?: HospitalSearchParams): Promise<Hospital[]> => {
    try {
      const lat = params?.lat ?? 22.5726; // Default to Kolkata or user coords
      const lng = params?.lng ?? 88.3639;

      const response = await axiosClient.get('/locations/nearby-facilities', {
        params: {
          latitude: lat,
          longitude: lng,
          radiusKm: params?.radiusKm ?? 32,
          type: 'HOSPITAL',
          limit: 30,
        },
      });

      const facilities = response.data?.data ?? response.data ?? [];
      let mapped = facilities.map(mapFacilityToHospital);

      if (params?.query) {
        const q = params.query.toLowerCase();
        mapped = mapped.filter((h: Hospital) =>
          h.name.toLowerCase().includes(q) || h.address.toLowerCase().includes(q)
        );
      }

      if (params?.department && params.department !== 'All Departments') {
        const dept = params.department.toLowerCase();
        mapped = mapped.filter((h: Hospital) =>
          h.departments?.some((d) => d.toLowerCase().includes(dept))
        );
      }

      return mapped;
    } catch (err) {
      console.warn('Failed to fetch from /locations/nearby-facilities:', err);
      return [];
    }
  },

  // Fetch detailed hospital info
  getHospitalById: async (id: string): Promise<Hospital | null> => {
    try {
      const response = await axiosClient.get(`/locations/nearby-facilities?limit=50`);
      const facilities = response.data?.data ?? response.data ?? [];
      const found = facilities.find((f: any) => f.id === id);
      return found ? mapFacilityToHospital(found) : null;
    } catch {
      return null;
    }
  },

  // Book a hospital bed
  bookBed: async (payload: BedBookingPayload): Promise<{ success: boolean; admissionId: string }> => {
    return {
      success: true,
      admissionId: 'adm-' + Date.now(),
    };
  },
};

export default hospitalApi;