import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Appointment {
  id: number;
  patientId: number;
  patientName?: string | null;
  appointmentDate: string;
  appointmentTime: string;
  type: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  symptoms?: string | null;
  consultationFee?: number;
  notes?: string;
}

export interface PatientSummary {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  totalVisits: number;
  lastVisit?: string | null;
}

export interface Prescription {
  id: number;
  patientId: number;
  patientName?: string | null;
  diagnosis: string;
  medicines: string;
  instructions?: string | null;
  prescribedDate: string;
  status: string;
}

export interface DoctorDashboardData {
  firstName?: string;
  userName?: string;
  todayAppointments: number;
  totalPatients: number;
  pendingAppointments: number;
  totalPrescriptions: number;
  upcomingAppointments: Appointment[];
  recentPatients: PatientSummary[];
}

export interface DoctorProfileData {
  id?: number;
  firstName?: string;
  lastName?: string;
  specialty?: string;
  qualification?: string;
  licenseNumber?: string;
  clinicName?: string;
  clinicAddress?: string;
  consultationFee?: number;
  experience?: number;
  bio?: string;
  availableDays?: string;
  availableHours?: string;
}

export interface DoctorPatientAiSummary {
  patientOverview: string;
  keyDiagnoses: string[];
  activeMedications: string[];
  allergies?: string[];
  riskFactors?: string[];
  disclaimer?: string;
}

// Query keys
export const getGetDoctorDashboardQueryKey = () => ["doctor-dashboard"];
export const getListDoctorAppointmentsQueryKey = (params?: any) => ["doctor-appointments", params];
export const getListPrescriptionsQueryKey = () => ["doctor-prescriptions"];
export const getGetDoctorProfileQueryKey = () => ["doctor-profile"];

// Mock initial datasets
const mockAppointments: Appointment[] = [
  {
    id: 101,
    patientId: 1,
    patientName: "Sarah Jenkins",
    appointmentDate: new Date().toISOString().split("T")[0],
    appointmentTime: "10:30 AM",
    type: "video_consultation",
    status: "confirmed",
    symptoms: "Persistent dry cough and mild fever for 3 days",
  },
  {
    id: 102,
    patientId: 2,
    patientName: "David Miller",
    appointmentDate: new Date().toISOString().split("T")[0],
    appointmentTime: "11:45 AM",
    type: "in_person",
    status: "pending",
    symptoms: "Post-surgery follow-up checkup",
  },
  {
    id: 103,
    patientId: 3,
    patientName: "Emily Watson",
    appointmentDate: new Date().toISOString().split("T")[0],
    appointmentTime: "02:15 PM",
    type: "in_person",
    status: "confirmed",
    symptoms: "Allergic skin rash and itching on arms",
  },
];

const mockPatients: PatientSummary[] = [
  {
    id: 1,
    firstName: "Sarah",
    lastName: "Jenkins",
    email: "sarah.j@example.com",
    totalVisits: 4,
    lastVisit: "2026-08-14",
  },
  {
    id: 2,
    firstName: "David",
    lastName: "Miller",
    email: "david.m@example.com",
    totalVisits: 2,
    lastVisit: "2026-08-01",
  },
  {
    id: 3,
    firstName: "Emily",
    lastName: "Watson",
    email: "emily.w@example.com",
    totalVisits: 1,
    lastVisit: "2026-07-22",
  },
];

const mockPrescriptions: Prescription[] = [
  {
    id: 501,
    patientId: 1,
    patientName: "Sarah Jenkins",
    diagnosis: "Acute Bronchitis",
    medicines: "Azithromycin 500mg (1x daily for 3 days), Levocetirizine 5mg (1x at night)",
    instructions: "Drink warm fluids, rest well, revisit if fever persists past 48h.",
    prescribedDate: "2026-08-14",
    status: "active",
  },
];

// Hooks
export const useGetDoctorDashboard = () => {
  return useQuery<DoctorDashboardData>({
    queryKey: getGetDoctorDashboardQueryKey(),
    queryFn: async () => ({
      firstName: "Dr. Rajesh",
      userName: "Dr. Rajesh Sharma",
      todayAppointments: mockAppointments.length,
      totalPatients: mockPatients.length,
      pendingAppointments: mockAppointments.filter((a) => a.status === "pending").length,
      totalPrescriptions: mockPrescriptions.length,
      upcomingAppointments: mockAppointments,
      recentPatients: mockPatients,
    }),
  });
};

export const useListDoctorAppointments = (params?: { status?: string; date?: string }) => {
  return useQuery<Appointment[]>({
    queryKey: getListDoctorAppointmentsQueryKey(params),
    queryFn: async () => {
      let res = [...mockAppointments];
      if (params?.status) {
        res = res.filter((a) => a.status === params.status);
      }
      if (params?.date) {
        res = res.filter((a) => a.appointmentDate === params.date);
      }
      return res;
    },
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { status: "confirmed" | "completed" | "cancelled" } }) => {
      const target = mockAppointments.find((a) => a.id === id);
      if (target) {
        target.status = data.status;
      }
      return { success: true, id, status: data.status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetDoctorDashboardQueryKey() });
      queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
    },
  });
};

export const useListDoctorPatients = (_params?: any) => {
  return useQuery<PatientSummary[]>({
    queryKey: ["doctor-patients"],
    queryFn: async () => mockPatients,
  });
};

export const useListPrescriptions = (_params?: any) => {
  return useQuery<Prescription[]>({
    queryKey: getListPrescriptionsQueryKey(),
    queryFn: async () => mockPrescriptions,
  });
};

export const useGetDoctorProfile = () => {
  return useQuery<DoctorProfileData>({
    queryKey: getGetDoctorProfileQueryKey(),
    queryFn: async () => ({
      id: 1,
      firstName: "Rajesh",
      lastName: "Sharma",
      specialty: "General Physician",
      qualification: "MBBS, MD (General Medicine)",
      licenseNumber: "MED-IN-889201",
      clinicName: "Aarogya Life Care Clinic",
      clinicAddress: "Sector 14, Ring Road, New Delhi",
      consultationFee: 500,
      experience: 12,
      bio: "Experienced general physician specializing in preventative wellness, chronic disease management, and family health.",
      availableDays: "Mon - Sat",
      availableHours: "09:00 AM - 05:00 PM",
    }),
  });
};

export const useUpdateDoctorProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { data: Partial<DoctorProfileData> } | Partial<DoctorProfileData>) => {
      const data = 'data' in payload ? payload.data : payload;
      return { success: true, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetDoctorProfileQueryKey() });
    },
  });
};

export const useGetDoctorPatientAiSummary = (patientId: number) => {
  return useQuery<DoctorPatientAiSummary>({
    queryKey: ["doctor-patient-ai-summary", patientId],
    queryFn: async () => ({
      patientOverview: "Adult patient presenting with mild seasonal allergies and well-controlled baseline hypertension.",
      keyDiagnoses: ["Primary Hypertension (2024)", "Seasonal Allergic Rhinitis"],
      activeMedications: ["Amlodipine 5mg (Once daily)", "Cetirizine 10mg (PRN)"],
      allergies: ["Penicillin", "Sulfa Drugs"],
      riskFactors: ["Sedentary desk lifestyle", "Family history of early cardiovascular disease"],
      disclaimer: "AI-generated summary based on longitudinal health records. Clinical review recommended.",
    }),
  });
};

export const useCreatePrescription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const newRx: Prescription = {
        id: Date.now(),
        patientId: data.patientId,
        patientName: data.patientName || `Patient #${data.patientId}`,
        diagnosis: data.diagnosis,
        medicines: data.medicines,
        instructions: data.instructions,
        prescribedDate: data.prescribedDate || new Date().toISOString().split("T")[0],
        status: "active",
      };
      mockPrescriptions.unshift(newRx);
      return newRx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getListPrescriptionsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetDoctorDashboardQueryKey() });
    },
  });
};

export const useExtractOcr = () => {
  return useMutation({
    mutationFn: async (_params: { data: { imageBase64?: string; currentMedicines?: string; rawText?: string } }) => {
      return {
        extractedText: "Paracetamol 650mg TDS x 3 days\nAmoxicillin 500mg BD x 5 days\nVitamin C 500mg OD x 10 days",
        extractedMedicines: ["Paracetamol 650mg", "Amoxicillin 500mg", "Vitamin C 500mg"],
        confidenceScore: 0.96,
        rawExtractedText: "Paracetamol 650mg TDS x 3 days\nAmoxicillin 500mg BD x 5 days\nVitamin C 500mg OD x 10 days",
      };
    },
  });
};
