// src/api/prescriptionApi.ts
import axiosClient from '../../../lib/axios';
import { ROUTES } from '@/constants/routes.constants';

export interface PrescriptionItem {
  medicineId?: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  durationDays?: number;
  quantity: number;
  instructions?: string;
}

export interface CreatePrescriptionPayload {
  consultationId: string;
  notes?: string;
  items: PrescriptionItem[];
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface Prescription {
  id: string;
  doctorName: string;
  specialization: string;
  hospitalName: string;
  date: string;
  diagnosis: string;
  medicines: Medication[];
  notes?: string;
  prescriptionUrl?: string;
}

export interface PrescriptionQueryParams {
  page?: number;
  limit?: number;
  query?: string;
  sortOrder?: 'newest' | 'oldest';
}

export interface PrescriptionListResponse {
  data: Prescription[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const prescriptionApi = {
  // [POST] Issue a prescription tied to a consultation (Doctor)
  createPrescription: async (payload: CreatePrescriptionPayload): Promise<{ data: Prescription }> => {
    const response = await axiosClient.post<{ data: Prescription }>(ROUTES.PRESCRIPTION.CREATE_PRESCRIPTION, payload);
    return response.data;
  },

  // [GET] List own prescriptions with pagination (Patient)
  getPrescriptions: async (params?: PrescriptionQueryParams): Promise<PrescriptionListResponse> => {
    const response = await axiosClient.get<PrescriptionListResponse>(ROUTES.PRESCRIPTION.ALL_PRESCRIPTION, { params });
    return response.data;
  },

  // [GET] Fetch a single prescription by its ID
  getPrescriptionById: async (id: string): Promise<{ data: Prescription }> => {
    const response = await axiosClient.get<{ data: Prescription }>(ROUTES.PRESCRIPTION.GET_PRESCRIPTION_ID(id));
    return response.data;
  },

  // [GET] Download prescription PDF file
  downloadPrescriptionPdf: async (id: string): Promise<Blob> => {
    const response = await axiosClient.get(`/prescriptions/${id}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default prescriptionApi;