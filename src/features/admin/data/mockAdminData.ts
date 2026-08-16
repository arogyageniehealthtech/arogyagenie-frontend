export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalDoctors: number;
  totalDiagnosticCenters: number;
  totalPharmacies: number;
  totalAppointments: number;
  appointmentsThisMonth: number;
  totalLabReports: number;
  pendingApprovals: number;
  totalPatients: number;
  appointmentsByStatus?: {
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
}

export interface AdminUser {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  displayName?: string | null;
  email: string;
  phone?: string | null;
  role: "admin" | "patient" | "doctor" | "diagnostic_center" | "pharmacy";
  status: "active" | "suspended" | "pending";
  address?: string | null;
  city?: string | null;
  specialty?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  createdAt: string;
}

export interface AdminAppointment {
  id: number;
  patientId: number;
  doctorId: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  appointmentDate: string;
  appointmentTime: string;
}

export interface ProviderApplication {
  id: number;
  type: "DOCTOR" | "DIAGNOSTIC_CENTER" | "PHARMACY";
  status: "PENDING" | "APPROVED" | "REJECTED";
  userId: number | null;
  firstName: string | null;
  lastName: string | null;
  name: string | null;
  email: string;
  phone: string;
  specialty: string | null;
  address: string | null;
  city: string | null;
  rejectionReason: string | null;
  reviewedBy: number | null;
  reviewedAt: string | null;
  createdAt: string;
}

export const MOCK_ADMIN_STATS: AdminStats = {
  totalUsers: 1482,
  activeUsers: 1390,
  totalDoctors: 128,
  totalDiagnosticCenters: 45,
  totalPharmacies: 62,
  totalAppointments: 3840,
  appointmentsThisMonth: 412,
  totalLabReports: 950,
  pendingApprovals: 14,
  totalPatients: 1247,
  appointmentsByStatus: {
    pending: 38,
    confirmed: 142,
    completed: 3580,
    cancelled: 80,
  },
};

export const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    id: 1,
    firstName: "Arun",
    lastName: "Sharma",
    email: "arun.sharma@example.com",
    phone: "+91 98765 43210",
    role: "patient",
    status: "active",
    address: "Flat 402, Green Glen Heights, Outer Ring Rd",
    city: "Bangalore",
    dateOfBirth: "1990-05-14",
    gender: "Male",
    createdAt: "2024-01-15T08:30:00.000Z",
  },
  {
    id: 2,
    firstName: "Priya",
    lastName: "Nair",
    email: "priya.nair@example.com",
    phone: "+91 98111 22334",
    role: "doctor",
    status: "active",
    address: "Clinic 12, Indiranagar 100ft Rd",
    city: "Bangalore",
    specialty: "Cardiology",
    createdAt: "2024-01-18T10:15:00.000Z",
  },
  {
    id: 3,
    firstName: "Apex",
    lastName: "Diagnostics",
    name: "Apex Diagnostic & Imaging Center",
    email: "contact@apexdiagnostics.com",
    phone: "+91 80 4455 6677",
    role: "diagnostic_center",
    status: "active",
    address: "742, Koramangala 4th Block",
    city: "Bangalore",
    createdAt: "2024-02-01T11:00:00.000Z",
  },
  {
    id: 4,
    firstName: "Apollo",
    lastName: "Pharmacy Whitefield",
    name: "Apollo Pharmacy Whitefield",
    email: "whitefield@apollopharmacy.com",
    phone: "+91 80 2845 1122",
    role: "pharmacy",
    status: "active",
    address: "Plot 88, ITPL Main Rd, Whitefield",
    city: "Bangalore",
    createdAt: "2024-02-05T09:45:00.000Z",
  },
  {
    id: 5,
    firstName: "Vikram",
    lastName: "Reddy",
    email: "vikram.reddy@example.com",
    phone: "+91 97400 55667",
    role: "doctor",
    status: "pending",
    address: "Healthcare Hub, HSR Layout",
    city: "Bangalore",
    specialty: "Neurology",
    createdAt: "2024-03-10T14:20:00.000Z",
  },
  {
    id: 6,
    firstName: "Deepa",
    lastName: "Menon",
    email: "deepa.menon@example.com",
    phone: "+91 99001 88223",
    role: "patient",
    status: "active",
    address: "15, Palm Meadows, Whitefield",
    city: "Bangalore",
    dateOfBirth: "1988-11-23",
    gender: "Female",
    createdAt: "2024-02-14T16:00:00.000Z",
  },
  {
    id: 7,
    firstName: "CarePlus",
    lastName: "Pharmacy",
    name: "CarePlus MedStore & Wellness",
    email: "support@careplusrx.com",
    phone: "+91 80 6677 8899",
    role: "pharmacy",
    status: "suspended",
    address: "12A, MG Road Commercial Complex",
    city: "Bangalore",
    createdAt: "2024-01-20T12:30:00.000Z",
  },
  {
    id: 8,
    firstName: "Sunil",
    lastName: "Kapoor",
    email: "sunil.kapoor@example.com",
    phone: "+91 98450 11998",
    role: "doctor",
    status: "active",
    address: "Fortis Hospital Medical Block, Bannerghatta Rd",
    city: "Bangalore",
    specialty: "Orthopedics",
    createdAt: "2024-02-28T15:40:00.000Z",
  },
  {
    id: 9,
    firstName: "Metropolis",
    lastName: "Lab Central",
    name: "Metropolis PathLab Diagnostics",
    email: "bangalore@metropolislabs.com",
    phone: "+91 80 3344 5566",
    role: "diagnostic_center",
    status: "active",
    address: "301, Brigade Tower, Ashok Nagar",
    city: "Bangalore",
    createdAt: "2024-03-01T08:00:00.000Z",
  },
  {
    id: 10,
    firstName: "System",
    lastName: "Administrator",
    name: "System Admin",
    displayName: "Platform Admin",
    email: "admin@arogyagenie.com",
    phone: "+91 80 1234 5678",
    role: "admin",
    status: "active",
    city: "Bangalore",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
];

export const MOCK_ADMIN_APPOINTMENTS: AdminAppointment[] = [
  {
    id: 101,
    patientId: 1,
    doctorId: 2,
    status: "confirmed",
    appointmentDate: "2026-08-18",
    appointmentTime: "10:30 AM",
  },
  {
    id: 102,
    patientId: 6,
    doctorId: 8,
    status: "completed",
    appointmentDate: "2026-08-16",
    appointmentTime: "02:00 PM",
  },
  {
    id: 103,
    patientId: 1,
    doctorId: 5,
    status: "pending",
    appointmentDate: "2026-08-19",
    appointmentTime: "11:15 AM",
  },
  {
    id: 104,
    patientId: 6,
    doctorId: 2,
    status: "cancelled",
    appointmentDate: "2026-08-15",
    appointmentTime: "04:30 PM",
  },
  {
    id: 105,
    patientId: 1,
    doctorId: 8,
    status: "confirmed",
    appointmentDate: "2026-08-20",
    appointmentTime: "09:00 AM",
  },
];

export const MOCK_PROVIDER_APPLICATIONS: ProviderApplication[] = [
  {
    id: 201,
    type: "DOCTOR",
    status: "PENDING",
    userId: 5,
    firstName: "Vikram",
    lastName: "Reddy",
    name: "Dr. Vikram Reddy",
    email: "vikram.reddy@example.com",
    phone: "+91 97400 55667",
    specialty: "Neurology",
    address: "Healthcare Hub, HSR Layout",
    city: "Bangalore",
    rejectionReason: null,
    reviewedBy: null,
    reviewedAt: null,
    createdAt: "2026-08-15T14:20:00.000Z",
  },
  {
    id: 202,
    type: "DIAGNOSTIC_CENTER",
    status: "PENDING",
    userId: null,
    firstName: null,
    lastName: null,
    name: "MediScan Advanced Imaging",
    email: "info@mediscanimaging.com",
    phone: "+91 80 8899 0011",
    specialty: null,
    address: "88, Ring Road, BTM Layout 2nd Stage",
    city: "Bangalore",
    rejectionReason: null,
    reviewedBy: null,
    reviewedAt: null,
    createdAt: "2026-08-14T09:15:00.000Z",
  },
  {
    id: 203,
    type: "PHARMACY",
    status: "PENDING",
    userId: null,
    firstName: null,
    lastName: null,
    name: "TrustMed Pharmacy & Chemists",
    email: "contact@trustmedrx.in",
    phone: "+91 98455 44332",
    specialty: null,
    address: "Shop 4, Market Complex, Jayanagar 4th Block",
    city: "Bangalore",
    rejectionReason: null,
    reviewedBy: null,
    reviewedAt: null,
    createdAt: "2026-08-13T16:45:00.000Z",
  },
  {
    id: 204,
    type: "DOCTOR",
    status: "APPROVED",
    userId: 2,
    firstName: "Priya",
    lastName: "Nair",
    name: "Dr. Priya Nair",
    email: "priya.nair@example.com",
    phone: "+91 98111 22334",
    specialty: "Cardiology",
    address: "Clinic 12, Indiranagar 100ft Rd",
    city: "Bangalore",
    rejectionReason: null,
    reviewedBy: 10,
    reviewedAt: "2026-08-10T11:00:00.000Z",
    createdAt: "2026-08-08T10:00:00.000Z",
  },
  {
    id: 205,
    type: "PHARMACY",
    status: "REJECTED",
    userId: null,
    firstName: null,
    lastName: null,
    name: "QuickDrugs Discount Store",
    email: "support@quickdrugs.com",
    phone: "+91 99887 76655",
    specialty: null,
    address: "Opp. City Mall, Electronic City",
    city: "Bangalore",
    rejectionReason: "Incomplete state drug license documentation and unverified GST credentials.",
    reviewedBy: 10,
    reviewedAt: "2026-08-11T15:30:00.000Z",
    createdAt: "2026-08-09T13:20:00.000Z",
  },
];
