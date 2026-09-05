import API from '../../../lib/axios';
import type { AuthUser } from '../../../types/auth.types';

export interface PatientAddress {
  id: string;
  type: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface PatientEmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimary: boolean;
}

export interface PatientAllergy {
  id: string;
  allergen: string;
  reaction?: string | null;
  severity?: string | null;
}

export interface PatientCondition {
  id: string;
  conditionName: string;
  diagnosedDate?: string | null;
  status: string;
}

export interface PatientProfile {
  id: string;
  authUserId: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string | null;
  gender?: string | null;
  bloodGroup?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  addresses?: PatientAddress[];
  allergies?: PatientAllergy[];
  conditions?: PatientCondition[];
  emergencyContacts?: PatientEmergencyContact[];
  lifestyle?: any;
  preference?: any;
}

export const getProfile = async (): Promise<PatientProfile | null> => {
  try {
    const response = await API.get('/patients/me');
    return response.data?.data ?? response.data;
  } catch (err: any) {
    if (err?.response?.status === 404) {
      return null;
    }
    throw err;
  }
};

export const updatePatientProfile = async (data: Partial<PatientProfile>): Promise<PatientProfile> => {
  const response = await API.patch('/patients/me', data);
  return response.data?.data ?? response.data;
};

export const createPatientProfile = async (data: Partial<PatientProfile>): Promise<PatientProfile> => {
  const response = await API.post('/patients', data);
  return response.data?.data ?? response.data;
};

export const getAuthProfile = async (): Promise<AuthUser> => {
  const response = await API.get('/auth/me');
  return response.data?.data ?? response.data;
};
