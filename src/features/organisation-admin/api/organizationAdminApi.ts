// import axiosClient from '@/lib/axios';
// import type { 
//   Facility, 
//   CreateFacilityPayload, 
//   Employee, 
//   CreateEmployeePayload, 
//   Invitation,
//   InviteDoctorPayload,
//   OrganizationDashboardData 
// } from '../types/organization.types';

// export const organizationAdminApi = {
//   // Dashboard Landing
//   getDashboardStats: async (organizationId: string): Promise<OrganizationDashboardData> => {
//     const res = await axiosClient.get(`/organizations/${organizationId}/dashboard`);
//     return res.data.data;
//   },

//   // Facility Management
//   getFacilities: async (organizationId: string): Promise<Facility[]> => {
//     const res = await axiosClient.get(`/organizations/${organizationId}/facilities`);
//     return res.data.data || [];
//   },

//   createFacility: async (organizationId: string, payload: CreateFacilityPayload): Promise<Facility> => {
//     const res = await axiosClient.post(`/organizations/${organizationId}/facilities`, payload);
//     return res.data.data;
//   },

//   updateFacilityStatus: async (organizationId: string, facilityId: string, status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED') => {
//     const res = await axiosClient.patch(`/organizations/${organizationId}/facilities/${facilityId}`, { status });
//     return res.data.data;
//   },

//   deleteFacility: async (organizationId: string, facilityId: string) => {
//     const res = await axiosClient.delete(`/organizations/${organizationId}/facilities/${facilityId}`);
//     return res.data;
//   },

//   // Employee Management
//   getEmployees: async (organizationId: string): Promise<Employee[]> => {
//     const res = await axiosClient.get(`/organizations/${organizationId}/employees`);
//     return res.data.data || [];
//   },

//   createEmployee: async (organizationId: string, payload: CreateEmployeePayload): Promise<Employee> => {
//     const res = await axiosClient.post(`/organizations/${organizationId}/employees`, payload);
//     return res.data.data;
//   },

//   updateEmployeeStatus: async (organizationId: string, employeeId: string, status: 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED') => {
//     const res = await axiosClient.post(`/organizations/${organizationId}/employees/${employeeId}/status`, { status });
//     return res.data.data;
//   },

//   // Invitations (Doctor onboarding)
//   getInvitations: async (organizationId: string): Promise<Invitation[]> => {
//     const res = await axiosClient.get(`/invitations/organizations/${organizationId}`);
//     return res.data.data || [];
//   },

//   inviteDoctor: async (organizationId: string, payload: InviteDoctorPayload): Promise<Invitation> => {
//     const res = await axiosClient.post(`/invitations/organizations/${organizationId}/invite`, payload);
//     return res.data.data;
//   },

//   revokeInvitation: async (organizationId: string, invitationId: string) => {
//     const res = await axiosClient.delete(`/invitations/organizations/${organizationId}/${invitationId}`);
//     return res.data;
//   }
// };