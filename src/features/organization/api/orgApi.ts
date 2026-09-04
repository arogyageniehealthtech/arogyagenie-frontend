// src/lib/api/orgApi.ts
import apiClient from '@/lib/axios';

// --- Type Definitions ---
export interface AddressPayload {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  landmark?: string;
}

export interface CreateOrgPayload {
  name: string;
  contactEmail: string;
  contactPhone?: string;
  address: AddressPayload;
}

export interface CreateFacilityPayload {
  name: string;
  type: 'HOSPITAL' | 'CLINIC' | 'LABORATORY' | 'PHARMACY';
  phone?: string;
  address: AddressPayload;
}

export interface OnboardEmployeePayload {
  email: string;
  designation: string;
  startDate: string;
  phone?: string;
  facilityId?: string;
  department?: string;
}

// --- API Services ---

export const authApi = {
  getMe: () => apiClient.get('/auth/me').then(res => res.data),
  switchOrganization: (organizationId: string) => 
    apiClient.post('/auth/switch-organization', { organizationId }).then(res => res.data),
};

export const organizationApi = {
  // Core Org
  create: (data: CreateOrgPayload) => apiClient.post('/organizations', data).then(res => res.data),
  getById: (orgId: string) => apiClient.get(`/organizations/${orgId}`).then(res => res.data),
  update: (orgId: string, data: Partial<CreateOrgPayload>) => apiClient.patch(`/organizations/${orgId}`, data).then(res => res.data),
  softDelete: (orgId: string) => apiClient.delete(`/organizations/${orgId}`).then(res => res.data),
  restore: (orgId: string) => apiClient.post(`/organizations/${orgId}/restore`).then(res => res.data),

  // Verification Documents
  getDocuments: (orgId: string) => apiClient.get(`/organizations/${orgId}/documents`).then(res => res.data),
  getUploadUrl: (orgId: string, data: { fileName: string; fileType: string }) => 
    apiClient.post(`/organizations/${orgId}/documents/upload-url`, data).then(res => res.data),
  addDocument: (orgId: string, data: any) => apiClient.post(`/organizations/${orgId}/documents`, data).then(res => res.data),
};

export const facilityApi = {
  getAll: (orgId: string) => apiClient.get(`/organizations/${orgId}/facilities`).then(res => res.data),
  getById: (orgId: string, facilityId: string) => apiClient.get(`/organizations/${orgId}/facilities/${facilityId}`).then(res => res.data),
  create: (orgId: string, data: CreateFacilityPayload) => apiClient.post(`/organizations/${orgId}/facilities`, data).then(res => res.data),
  update: (orgId: string, facilityId: string, data: Partial<CreateFacilityPayload>) => 
    apiClient.patch(`/organizations/${orgId}/facilities/${facilityId}`, data).then(res => res.data),
  deactivate: (orgId: string, facilityId: string) => apiClient.delete(`/organizations/${orgId}/facilities/${facilityId}`).then(res => res.data),
  restore: (orgId: string, facilityId: string) => apiClient.post(`/organizations/${orgId}/facilities/${facilityId}/restore`).then(res => res.data),
  getAddress: (orgId: string, facilityId: string) => apiClient.get(`/organizations/${orgId}/facilities/${facilityId}/address`).then(res => res.data),
};

export const memberApi = {
  getAll: (orgId: string) => apiClient.get(`/organizations/${orgId}/members`).then(res => res.data),
  addExisting: (orgId: string, data: { email: string; role: string; facilityId?: string }) => 
    apiClient.post(`/organizations/${orgId}/members`, data).then(res => res.data),
  updateRole: (orgId: string, membershipId: string, data: { role: string }) => 
    apiClient.patch(`/organizations/${orgId}/members/${membershipId}`, data).then(res => res.data),
  remove: (orgId: string, membershipId: string) => apiClient.delete(`/organizations/${orgId}/members/${membershipId}`).then(res => res.data),
};

export const employeeApi = {
  getAll: (orgId: string) => apiClient.get(`/organizations/${orgId}/employees`).then(res => res.data),
  getById: (orgId: string, employeeId: string) => apiClient.get(`/organizations/${orgId}/employees/${employeeId}`).then(res => res.data),
  onboard: (orgId: string, data: OnboardEmployeePayload) => apiClient.post(`/organizations/${orgId}/employees`, data).then(res => res.data),
  
  // Assignment & Status Management
  getAssignments: (orgId: string, employeeId: string) => 
    apiClient.get(`/organizations/${orgId}/employees/${employeeId}/assignments`).then(res => res.data),
  updateAssignment: (orgId: string, employeeId: string, data: { department?: string; designation?: string }) => 
    apiClient.patch(`/organizations/${orgId}/employees/${employeeId}/assignment`, data).then(res => res.data),
  transfer: (orgId: string, employeeId: string, data: { facilityId: string; department?: string }) => 
    apiClient.post(`/organizations/${orgId}/employees/${employeeId}/transfer`, data).then(res => res.data),
  updateStatus: (orgId: string, employeeId: string, data: { status: 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED' }) => 
    apiClient.post(`/organizations/${orgId}/employees/${employeeId}/status`, data).then(res => res.data),
};

export const invitationApi = {
  // Org Admin Actions
  getAll: (orgId: string) => apiClient.get(`/invitations/organizations/${orgId}`).then(res => res.data),
  inviteDoctor: (orgId: string, data: { email: string; facilityId: string; designation?: string }) => 
    apiClient.post(`/invitations/organizations/${orgId}/invite`, { ...data, role: 'DOCTOR' }).then(res => res.data),
  revoke: (orgId: string, invitationId: string) => apiClient.delete(`/invitations/organizations/${orgId}/${invitationId}`).then(res => res.data),
  
  // Public Actions
  accept: (data: any) => apiClient.post('/invitations/accept', data).then(res => res.data),
};

export const platformAdminApi = {
  getAllOrgs: () => apiClient.get('/organizations/admin').then(res => res.data),
  updateVerification: (orgId: string, status: 'VERIFIED' | 'REJECTED' | 'PENDING') => 
    apiClient.patch(`/organizations/${orgId}/verification-status`, { verificationStatus: status }).then(res => res.data),
};