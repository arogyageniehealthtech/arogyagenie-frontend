// import type { Facility, Employee, OrganizationDashboardData } from '../types/organization.types';

// export const MOCK_DASHBOARD_STATS: OrganizationDashboardData = {
//   facilityCountsByType: {
//     HOSPITAL: 1,
//     CLINIC: 3,
//     LAB: 2,
//     PHARMACY: 4
//   },
//   activeMembershipCount: 124,
//   pendingVerificationDocs: 2,
//   fleetSize: 8,
//   recentAppointmentVolume: 845
// };

// export const MOCK_FACILITIES: Facility[] = [
//   {
//     id: 'fac-1',
//     organizationId: 'org-1',
//     name: 'Apex Super Specialty Hospital',
//     type: 'HOSPITAL',
//     phone: '+91 9876543210',
//     status: 'ACTIVE',
//     address: { line1: 'Sector V, Salt Lake', city: 'Kolkata', state: 'West Bengal', postalCode: '700091' },
//     facilityType: 'HOSPITAL'
//   },
//   {
//     id: 'fac-2',
//     organizationId: 'org-1',
//     name: 'Apex Diagnostic Center',
//     type: 'LAB',
//     phone: '+91 9876543211',
//     status: 'ACTIVE',
//     address: { line1: 'Park Street', city: 'Kolkata', state: 'West Bengal', postalCode: '700016' },
//     facilityType: undefined
//   },
//   {
//     id: 'fac-3',
//     organizationId: 'org-1',
//     name: 'Apex Pharmacy Plus',
//     type: 'PHARMACY',
//     status: 'SUSPENDED',
//     address: { line1: 'New Town Action Area 1', city: 'Kolkata', state: 'West Bengal', postalCode: '700156' },
//     facilityType: undefined
//   },
//   {
//     id: 'fac-4',
//     organizationId: 'org-1',
//     name: 'Apex Primary Clinic',
//     type: 'CLINIC',
//     status: 'ACTIVE',
//     address: { line1: 'Gariahat Road', city: 'Kolkata', state: 'West Bengal', postalCode: '700019' },
//     facilityType: undefined
//   }
// ];

// export const MOCK_EMPLOYEES: Employee[] = [
//   {
//     id: 'emp-1',
//     organizationId: 'org-1',
//     email: 'dr.sharma@apex.com',
//     phone: '+91 9999900001',
//     facilityId: 'fac-1',
//     department: 'Cardiology',
//     designation: 'Senior Consultant',
//     startDate: '2023-01-15',
//     status: 'ACTIVE',
//     user: { firstName: 'Rajesh', lastName: 'Sharma', email: 'dr.sharma@apex.com' }
//   },
//   {
//     id: 'emp-2',
//     organizationId: 'org-1',
//     email: 'amit.lab@apex.com',
//     facilityId: 'fac-2',
//     department: 'Pathology',
//     designation: 'Lab Technician',
//     startDate: '2024-03-10',
//     status: 'ACTIVE',
//     user: { firstName: 'Amit', lastName: 'Banerjee', email: 'amit.lab@apex.com' }
//   },
//   {
//     id: 'emp-3',
//     organizationId: 'org-1',
//     email: 'sunita.pharm@apex.com',
//     phone: '+91 9999900003',
//     facilityId: 'fac-3',
//     designation: 'Lead Pharmacist',
//     startDate: '2025-06-01',
//     status: 'ON_LEAVE',
//     user: { firstName: 'Sunita', lastName: 'Sen', email: 'sunita.pharm@apex.com' }
//   },
//   {
//     id: 'emp-4',
//     organizationId: 'org-1',
//     email: 'admin@apex.com',
//     designation: 'Operations Head',
//     startDate: '2022-11-20',
//     status: 'ACTIVE',
//     user: { firstName: 'Neha', lastName: 'Gupta', email: 'admin@apex.com' }
//   }
// ];