// // // ==========================================
// // // src/features/organization/types/organization.types.ts
// // // ==========================================

// // export type FacilityType = 'HOSPITAL' | 'CLINIC' | 'LAB' | 'PHARMACY';
// // export type FacilityStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
// // export type EmployeeStatus = 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED';
// // export type ExtendedEmployeeStatus = EmployeeStatus | 'INVITED'; // Added INVITED for the UI mock state
// // export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'REVOKED' | 'EXPIRED';

// // export interface Address {
// //   id?: string;
// //   line1: string;
// //   line2?: string | null;
// //   city: string;
// //   state: string;
// //   postalCode: string;
// //   country?: string; // Default: 'IN'
// //   latitude?: number | null;
// //   longitude?: number | null;
// //   landmark?: string | null;
// // }

// // export interface Organization {
// //   id: string;
// //   name: string;
// //   legalName?: string;
// //   registrationNumber?: string;
// //   role: 'ORG_MEMBER' | 'ORG_OWNER' | 'ORG_ADMIN';
// // }

// // export interface Facility {
// //   [x: string]: any;
// //   facilityType: any;
// //   id: string;
// //   organizationId: string;
// //   type: FacilityType;
// //   name: string;
// //   phone?: string | null;
// //   status: FacilityStatus;
// //   address: Address;
// //   // UI Helpers
// //   staffCount?: number;
// //   licenseNumber?: string;
// // }

// // export interface CreateFacilityPayload {
// //   name: string;
// //   phone?: string;
// //   type: FacilityType;
// //   address: Address;
  
// //   // Hospital Specific
// //   bedCapacity?: number;
// //   hasEmergency?: boolean;
// //   hasIcu?: boolean;
// //   departments?: string[];

// //   // Lab Specific
// //   licenseNumber?: string;
// //   homeCollectionAvailable?: boolean;
// // }

// // export interface Employee {
// //   id: string;
// //   organizationId: string;
// //   authUserId?: string;
// //   email: string;
// //   phone?: string | null;
// //   facilityId?: string | null;
// //   department?: string | null;
// //   designation: string;
// //   startDate: string;
// //   status: ExtendedEmployeeStatus;
// //   user?: {
// //     firstName?: string | null;
// //     lastName?: string | null;
// //     email: string;
// //     phone?: string | null;
// //   };
// // }

// // export interface CreateEmployeePayload {
// //   email: string;
// //   phone?: string;
// //   facilityId?: string;
// //   department?: string;
// //   designation: string;
// //   startDate: string;
// // }

// // export interface Invitation {
// //   id: string;
// //   organizationId: string;
// //   facilityId?: string | null;
// //   email: string;
// //   role: 'ORG_OWNER' | 'ORG_ADMIN' | 'DOCTOR' | 'EMPLOYEE';
// //   status: InvitationStatus;
// //   expiresAt: string;
// // }

// // export interface InviteDoctorPayload {
// //   email: string;
// //   role: 'DOCTOR';
// //   facilityId?: string;
// //   designation?: string;
// // }

// // export interface OrganizationDashboardData {
// //   facilityCountsByType: Record<FacilityType, number>;
// //   activeMembershipCount: number;
// //   pendingVerificationDocs: number;
// //   fleetSize: number;
// //   recentAppointmentVolume: number;
// // }

// export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
// export type OrgActiveStatus = 'ACTIVE' | 'INACTIVE';
// export type OrgType = 'HOSPITAL' | 'CLINIC' | 'LAB' | 'DIAGNOSTIC_CENTER' | 'PHARMACY' | 'OTHER';

// export interface AdminOrganization {
//   id: string;
//   name: string;
//   verificationStatus: VerificationStatus;
//   status: OrgActiveStatus;
//   facilityCount?: number;
//   type?: OrgType | string;
//   createdAt?: string;
//   email?: string;
//   phone?: string;
// }

// export interface AdminOrganizationFilterParams {
//   search?: string;
//   verificationStatus?: VerificationStatus | 'ALL';
//   status?: OrgActiveStatus | 'ALL';
//   type?: string | 'ALL';
//   page?: number;
//   limit?: number;
// }

// export interface UpdateVerificationStatusPayload {
//   verificationStatus: VerificationStatus;
// }