// src/api/doctorApi.ts
import axiosClient from './axiosClient';
import type { Doctor } from '../types/doctor';

export interface DoctorSearchParams {
  query?: string;
  specialty?: string | null;
  radiusKm?: number;
  lat?: number;
  lng?: number;
}

export interface AppointmentPayload {
  doctorId: string;
  consultationType: 'in-person' | 'video';
  date: string;
  time: string;
  patientId?: string; // If user is logged in
  patientDetails: any; // Fallback for guest booking
}

export const doctorApi = {
  // Get list of doctors with optional filters
  getDoctors: (params?: DoctorSearchParams): Promise<Doctor[]> => {
    return axiosClient.get('/doctors', { params });
  },

  // Get a single doctor's full profile
  getDoctorById: (id: string): Promise<Doctor> => {
    return axiosClient.get(`/doctors/${id}`);
  },

  // Submit an appointment booking
  bookAppointment: (payload: AppointmentPayload): Promise<{ success: boolean; bookingId: string }> => {
    return axiosClient.post('/doctors/book', payload);
  }
};