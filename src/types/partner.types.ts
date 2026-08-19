// =============================================================================
// AarogyaGenie Partner / Provider Types (API-Ready Architecture)
// =============================================================================

export type PartnerProviderType = 'PHARMACY' | 'LAB' | 'HOSPITAL' | 'CLINIC';

export interface PartnerProvider {
  id: string;
  name: string;
  type: PartnerProviderType;
  licenseNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  rating: number;
  reviewsCount: number;
  operationalHours: string;
  isOpen: boolean;
  avatar: string;
  tagline: string;
  emergencyContact?: string;
  verifiedAt: string;
}

export type PartnerRequestStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED';

export type RequestPriority = 'NORMAL' | 'HIGH' | 'EMERGENCY';

export interface RequestTimelineStep {
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
}

export interface PatientSummary {
  id: string;
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone: string;
  email?: string;
  address?: string;
  bloodGroup?: string;
  avatar?: string;
}

export interface PartnerRequest {
  id: string;
  providerId: string;
  requestNumber: string; // e.g. "REQ-2026-8821"
  patient: PatientSummary;
  serviceType: string;
  category: 'MEDICINE' | 'LAB_TEST' | 'DOCTOR_CONSULT' | 'CHECK_IN' | 'EMERGENCY';
  status: PartnerRequestStatus;
  priority: RequestPriority;
  requestedDate: string;
  requestedTime: string;
  estimatedAmount: number;
  notes?: string;
  prescriptionUrl?: string;
  medicines?: Array<{
    name: string;
    dosage: string;
    quantity: number;
    price: number;
  }>;
  testItems?: string[];
  rejectionReason?: string;
  timeline: RequestTimelineStep[];
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// Pharmacy Specific Types
// -----------------------------------------------------------------------------

export type OrderPaymentStatus = 'PAID' | 'CASH_ON_DELIVERY' | 'PENDING';
export type OrderFulfillmentType = 'HOME_DELIVERY' | 'STORE_PICKUP';

export interface PharmacyOrderItem {
  id: string;
  medicineName: string;
  dosage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  instruction?: string;
}

export interface PharmacyOrder {
  id: string;
  providerId: string;
  orderNumber: string; // e.g. "ORD-PH-9021"
  patient: PatientSummary;
  items: PharmacyOrderItem[];
  totalAmount: number;
  paymentStatus: OrderPaymentStatus;
  orderStatus: PartnerRequestStatus;
  fulfillmentType: OrderFulfillmentType;
  deliveryAddress?: string;
  prescriptionUrl?: string;
  riderName?: string;
  riderPhone?: string;
  timeline: RequestTimelineStep[];
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  providerId: string;
  name: string;
  genericName: string;
  category: string;
  stock: number;
  unit: string;
  minThreshold: number;
  unitPrice: number;
  batchNumber: string;
  expiryDate: string;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

// -----------------------------------------------------------------------------
// Laboratory Specific Types
// -----------------------------------------------------------------------------

export type SampleCollectionMode = 'HOME_COLLECTION' | 'WALK_IN';
export type SampleStatus = 'PENDING_COLLECTION' | 'COLLECTED' | 'IN_TRANSIT' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';

export interface LabBooking {
  id: string;
  providerId: string;
  bookingNumber: string; // e.g. "LAB-BK-4012"
  patient: PatientSummary;
  testName: string;
  testCategory: string;
  sampleType: string;
  collectionMode: SampleCollectionMode;
  scheduledDate: string;
  scheduledTime: string;
  status: PartnerRequestStatus;
  sampleStatus: SampleStatus;
  sampleBarcode?: string;
  phlebotomistName?: string;
  phlebotomistPhone?: string;
  fastingRequired: boolean;
  totalAmount: number;
  timeline: RequestTimelineStep[];
  createdAt: string;
}

export interface LabReport {
  id: string;
  providerId: string;
  bookingId: string;
  reportNumber: string; // e.g. "REP-7731"
  patient: PatientSummary;
  testName: string;
  completionDate: string;
  reportStatus: 'PENDING_VALIDATION' | 'VALIDATED' | 'RELEASED';
  resultSummary: string;
  fileUrl?: string;
  normalRangeFlags: Array<{
    parameter: string;
    value: string;
    referenceRange: string;
    isAbnormal: boolean;
  }>;
  verifiedByDoctor: string;
  releasedAt?: string;
}

// -----------------------------------------------------------------------------
// Hospital Specific Types
// -----------------------------------------------------------------------------

export type HospitalAppointmentType = 'IN_PERSON' | 'VIDEO_CONSULTATION';

export interface HospitalAppointment {
  id: string;
  providerId: string;
  appointmentNumber: string; // e.g. "APT-HOSP-5102"
  patient: PatientSummary;
  doctorName: string;
  department: string;
  date: string;
  timeSlot: string;
  tokenNumber: number;
  appointmentType: HospitalAppointmentType;
  status: PartnerRequestStatus;
  symptoms: string[];
  vitals?: {
    bp?: string;
    pulse?: string;
    temperature?: string;
    spO2?: string;
  };
  timeline: RequestTimelineStep[];
  createdAt: string;
}

export interface HospitalCheckIn {
  id: string;
  providerId: string;
  tokenNumber: number;
  patient: PatientSummary;
  department: string;
  doctorName?: string;
  checkInTime: string;
  estimatedWaitMins: number;
  roomNumber: string;
  triageLevel: 'NORMAL' | 'URGENT' | 'EMERGENCY';
  status: 'WAITING' | 'WITH_DOCTOR' | 'COMPLETED' | 'CANCELLED';
}

// -----------------------------------------------------------------------------
// Patients, Services, Notifications & Analytics
// -----------------------------------------------------------------------------

export interface PartnerPatient {
  id: string;
  providerId: string;
  name: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone: string;
  email: string;
  bloodGroup: string;
  totalVisits: number;
  lastInteraction: string;
  lastService: string;
  allergies?: string[];
  chronicConditions?: string[];
  status: 'ACTIVE' | 'INACTIVE';
}

export interface PartnerServiceItem {
  id: string;
  providerId: string;
  name: string;
  category: string;
  price: number;
  duration: string;
  isAvailable: boolean;
  turnaroundTime: string;
  description: string;
}

export interface PartnerNotification {
  id: string;
  providerId: string;
  title: string;
  message: string;
  type: 'NEW_REQUEST' | 'URGENT' | 'ORDER_UPDATE' | 'LAB_REPORT' | 'LOW_STOCK' | 'SYSTEM';
  timestamp: string;
  isRead: boolean;
  link?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface PartnerActivityLog {
  id: string;
  providerId: string;
  action: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'REQUEST' | 'ORDER' | 'BOOKING' | 'INVENTORY' | 'CHECKIN' | 'SETTINGS';
}

export interface PartnerDashboardStats {
  newRequestsCount: number;
  todayOperationsCount: number;
  pendingActionsCount: number;
  completedCount: number;
  revenueTotal: number;
  revenueChangePercent: number;
  operationalSatisfactionScore: number;
  averageTurnaroundTime: string;
}

export interface PartnerAnalytics {
  kpis: {
    totalRequests: number;
    completionRatePercent: number;
    avgResponseMins: number;
    monthlyRevenue: number;
  };
  requestTrends: Array<{
    day: string;
    requests: number;
    completed: number;
  }>;
  serviceDistribution: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  peakHours: Array<{
    hour: string;
    volume: number;
  }>;
}
