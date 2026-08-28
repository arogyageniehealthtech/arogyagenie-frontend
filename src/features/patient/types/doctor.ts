// ../types/doctor.ts

export interface ConsultationOption {
  mode: "IN_PERSON" | "VIDEO" ;
  fee: number;
}

export interface Qualification {
  id: string;
  doctorId: string;
  degree: string;
  institution: string;
  year: number;
}

export interface Specialization {
  id: string;
  name: string;
}

export interface DoctorSpecialization {
  doctorId: string;
  specializationId: string;
  specialization: Specialization;
}

export interface Address {
  id: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude: string | null;
  longitude: string | null;
  landmark: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Facility {
  id: string;
  organizationId: string;
  type: "HOSPITAL" | "CLINIC";
  name: string;
  addressId: string;
  phone: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  address: Address;
}

export interface FacilityAffiliation {
  id: string;
  doctorId: string;
  facilityId: string;
  department: string;
  position: string;
  consultationFee: string;
  consultationModes: "IN_PERSON" | "VIDEO" | "BOTH";
  status: "ACTIVE" | "INACTIVE";
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  facility: Facility;
}

export interface Doctor {
  id: string;
  authUserId?: string;
  firstName: string;
  lastName: string;
  image?: string;
  licenseNumber?: string;
  licenseAuthority?: string;
  experienceYears: number;
  bio?: string;
  languages?: string[];
  verificationStatus?: "VERIFIED" | "PENDING" | "REJECTED";
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;

  qualifications?: Qualification[];
  specializations?: DoctorSpecialization[]; // real API field: array of specializations
  specialization?: { id: string; name: string }; // kept from your original (singular)
  facilityAffiliations: FacilityAffiliation[]; // fixed: was invalid syntax before

  consultationFee?: number;
  // fee:number;
  // price:number,
  rating?: number;
  reviewCount?: number;
  distanceKm?: number;
  lat?: number;
  lng?: number;
  verified?: boolean;
  clinicName?: string;
  clinicAddress?: string;
  nextAvailableSlot?: string;
  consultationOptions?: ConsultationOption[];
  about?: string;
  availableDates?: string[];
}