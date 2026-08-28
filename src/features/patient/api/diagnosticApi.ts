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
  patientDetails: any;
  prescriptionUrl?: string; // If user uploaded a prescription to cloud storage first
}

export const diagnosticApi = {
  // Fetch labs/diagnostic centres
  getCentres: (params?: DiagnosticSearchParams): Promise<DiagnosticCentre[]> => {
    return axiosClient.get('/diagnostics', { params });
  },

  // Fetch a specific lab's details and test catalog
  getCentreById: (id: string): Promise<DiagnosticCentre> => {
    return axiosClient.get(`/diagnostics/${id}`);
  },

  // Book a lab test
  bookLabTest: (payload: LabBookingPayload): Promise<{ success: boolean; orderId: string }> => {
    return axiosClient.post('/diagnostics/book', payload);
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