// src/api/hospitalApi.ts
import axiosClient from '../../../lib/axios';
import type { Hospital } from '../types/hospital';

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
  date?: string; // Optional for emergencies
  time?: string; // Optional for emergencies
  patientDetails: any;
}

export const hospitalApi = {
  // Fetch hospitals based on search criteria
  getHospitals: (params?: HospitalSearchParams): Promise<Hospital[]> => {
    return axiosClient.get('/hospitals', { params });
  },

  // Fetch detailed hospital info (including live bed count)
  getHospitalById: (id: string): Promise<Hospital> => {
    return axiosClient.get(`/hospitals/${id}`);
  },

  // Book a hospital bed
  bookBed: (payload: BedBookingPayload): Promise<{ success: boolean; admissionId: string }> => {
    return axiosClient.post('/hospitals/book-bed', payload);
  }
};