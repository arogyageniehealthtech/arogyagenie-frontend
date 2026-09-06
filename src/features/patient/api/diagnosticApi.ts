// src/api/diagnosticApi.ts
import axiosClient from '../../../lib/axios';
import type { DiagnosticCentre } from '../../patient/types/diagnostic';

export interface DiagnosticSearchParams {
  query?: string;
  testName?: string | null;
  radiusKm?: number;
  lat?: number;
  lng?: number;
}

export interface LabBookingPayload {
  centreId: string;
  testId: string;
  collectionMethod: 'centre' | 'home';
  date: string;
  time: string;
  rate?: number;
  patientDetails: any;
  prescriptionUrl?: string;
}

const LOCAL_STORAGE_KEY = 'mock_lab_bookings';

export const diagnosticApi = {
  // Fetch a specific lab's details and test catalog
  getCentreById: async (id: string): Promise<DiagnosticCentre | null> => {
    try {
      const response = await axiosClient.get(`/diagnostics/${id}`);
      return response.data?.data ?? response.data ?? null;
    } catch {
      return null;
    }
  },

  // Book a lab test with local storage persistence fallback matching bed bookings
  bookLabTest: async (payload: LabBookingPayload): Promise<{ success: boolean; orderId: string; data: any }> => {
    const orderId = 'lab_' + Math.random().toString(36).substring(2, 9);
    const newBooking = {
      id: orderId,
      ...payload,
      createdAt: new Date().toISOString(),
      status: 'CONFIRMED'
    };

    try {
      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([newBooking, ...existing]));
    } catch (e) {
      console.error("Failed to save lab booking to local storage", e);
    }

    return {
      success: true,
      orderId,
      data: newBooking
    };
  },

  // Fetch all stored lab bookings from browser storage
  getBookedLabs: async (): Promise<any[]> => {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  },

  // Upload prescription file (returns URL from your backend/S3)
  uploadPrescription: (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('prescription', file);
    return axiosClient.post('/diagnostics/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

export default diagnosticApi;