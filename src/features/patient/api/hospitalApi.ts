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
  facilityId: string;
  bedType: string;
  admissionType?: string;
  scheduledStart: string;
  scheduledEnd: string;
  patientDetails: {
    name: string;
    age: number;
    gender: string;
    phone: string;
    emergencyPhone: string;
    bloodGroup?: string;
    address: string;
  };
}

const DEFAULT_BED_OPTIONS: BedOption[] = [
  { type: 'general', label: 'General Ward', rate: 1500, availableCount: 8 },
  { type: 'semi-private', label: 'Semi-Private Room', rate: 3000, availableCount: 3 },
  { type: 'private', label: 'Private Room', rate: 4500, availableCount: 2 },
  { type: 'icu', label: 'ICU Bed', rate: 8000, availableCount: 1 },
];

const LOCAL_STORAGE_KEY = 'mock_bed_bookings';

function mapFacilityToHospital(f: any): Hospital {
  const lat = f.address?.latitude ? Number(f.address.latitude) : (f.lat ?? 0);
  const lng = f.address?.longitude ? Number(f.address.longitude) : (f.lng ?? 0);
  
  const formattedAddress = typeof f.address === 'object' && f.address !== null
    ? {
        id: f.address.id || f.id,
        line1: f.address.line1 || '',
        line2: f.address.line2 || '',
        city: f.address.city || '',
        state: f.address.state || '',
        postalCode: f.address.postalCode || '',
        country: f.address.country || 'IN',
        latitude: lat,
        longitude: lng,
        landmark: f.address.landmark || ''
      }
    : (f.address || 'Address not specified');

  return {
    id: f.id,
    facilityId: f.facilityId || f.id,
    organizationId: f.organizationId || '',
    name: f.name,
    phone: f.phone || '',
    status: f.status || 'ACTIVE',
    address: formattedAddress,
    bedCapacity: f.bedCapacity ?? 250,
    hasEmergency: f.hasEmergency ?? true,
    hasIcu: f.hasIcu ?? true,
    departments: f.departments || [],
    facilityType: f.facilityType || 'Multispecialty',
    establishedYear: f.establishedYear ?? 2005,
    rating: 4.7,
    reviewCount: 120,
    distanceKm: f.distanceKm !== undefined ? Number(f.distanceKm.toFixed(1)) : 0,
    lat,
    lng,
    nextAvailableBed: 'Immediate',
    bedOptions: DEFAULT_BED_OPTIONS,
    about: 'A leading hospital providing comprehensive healthcare and emergency services.',
    availableDates: ['2026-09-05', '2026-09-06', '2026-09-07'],
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=600&h=400',
    emergencyServices: f.hasEmergency ?? true,
  };
}

export const hospitalApi = {
  // Fetch detailed hospital info
  getHospitalById: async (id: string): Promise<Hospital | null> => {
    try {
      const response = await axiosClient.get(`/locations/nearby-facilities?limit=50`);
      const facilities = response.data?.data ?? response.data ?? [];
      const found = facilities.find((f: any) => f.id === id || f.facilityId === id);
      return found ? mapFacilityToHospital(found) : null;
    } catch {
      return null;
    }
  },

  // Book a hospital bed with local storage persistence
  bookBed: async (payload: BedBookingPayload): Promise<{ success: boolean; admissionId: string; data: any }> => {
    const admissionId = 'adm_' + Math.random().toString(36).substring(2, 9);
    const newBooking = {
      id: admissionId,
      ...payload,
      createdAt: new Date().toISOString(),
      status: 'CONFIRMED'
    };

    try {
      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([newBooking, ...existing]));
    } catch (e) {
      console.error("Failed to save booking to local storage", e);
    }

    return {
      success: true,
      admissionId,
      data: newBooking
    };
  },

  // Fetch all stored bed bookings from browser storage
  getBookedBeds: async (): Promise<any[]> => {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }
};

export default hospitalApi;