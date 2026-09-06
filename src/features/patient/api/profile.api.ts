// Adjust this import path to point to your configured axios instance
import axiosInstance from '@/lib/axios';

export interface CorePatientProfile {
  firstName: string;
  lastName: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  bloodGroup?: string;
  heightCm?: number;
  weightKg?: number;
}

export const patientApi = {
  // 1. Get Core Profile
  getMe: async () => {
    const response = await axiosInstance.get('/patients/me');
    // Assuming backend wraps in { success: true, data: {...} } based on your previous responses
    return response.data?.data || response.data;
  },

  // 2. Create Core Profile (Required first time)
  createProfile: async (payload: CorePatientProfile) => {
    const response = await axiosInstance.post('/patients', payload);
    return response.data?.data || response.data;
  },

  // 3. Update Core Profile
  updateProfile: async (payload: Partial<CorePatientProfile>) => {
    const response = await axiosInstance.patch('/patients/me', payload);
    return response.data?.data || response.data;
  },

  // NOTE: Based on your swagger docs, Addresses, Allergies, Medications, etc., 
  // require their own specific API calls. You can add them here as needed:
  /*
  addAddress: async (payload: any) => axiosInstance.post('/patients/me/addresses', payload),
  addAllergy: async (payload: any) => axiosInstance.post('/patients/me/allergies', payload),
  addMedication: async (payload: any) => axiosInstance.post('/patients/me/medications', payload),
  */
};