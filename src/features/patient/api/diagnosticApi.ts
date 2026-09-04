import axiosClient from '../../../lib/axios';
import type { DiagnosticCentre } from '../../patient/types/diagnostic';

export interface DiagnosticSearchParams {
  query?: string;
  testName?: string | null;
  radiusKm?: number;
  lat?: number;
  lng?: number;
}

export interface LabBookingPayload {
<<<<<<< HEAD
  labId: string;
  labTestIds: string[];
  orderedByDoctorId?: string;
  homeCollection?: boolean;
  collectionAddressId?: string;
  date?: string;
  time?: string;
  patientDetails?: any;
}

function mapFacilityToDiagnosticCentre(f: any): DiagnosticCentre {
  const lat = f.address?.latitude ? Number(f.address.latitude) : (f.lat ?? undefined);
  const lng = f.address?.longitude ? Number(f.address.longitude) : (f.lng ?? undefined);
  const address = [f.address?.line1, f.address?.line2, f.address?.city, f.address?.state]
    .filter(Boolean)
    .join(', ') || f.address?.city || 'Address not specified';

  const defaultTests = [
    { id: 't1', name: 'Complete Blood Count (CBC)', rate: 350, price: 350, turnaroundHours: 6, fastingRequired: false, homeCollectionAvailable: true },
    { id: 't2', name: 'Lipid Profile', rate: 750, price: 750, turnaroundHours: 12, fastingRequired: true, homeCollectionAvailable: true },
    { id: 't3', name: 'Thyroid Profile (T3, T4, TSH)', rate: 550, price: 550, turnaroundHours: 12, fastingRequired: false, homeCollectionAvailable: true },
    { id: 't4', name: 'HbA1c (Glycated Hemoglobin)', rate: 450, price: 450, turnaroundHours: 6, fastingRequired: false, homeCollectionAvailable: true },
  ];

  return {
    id: f.id,
    name: f.name,
    address,
    rating: f.rating ?? 4.8,
    reviewCount: f.reviewCount ?? 142,
    distanceKm: f.distanceKm !== undefined ? Number(f.distanceKm.toFixed(1)) : 0,
    lat,
    lng,
    phone: f.phone || '',
    establishedYear: f.establishedYear ?? 2015,
    verified: f.verified ?? true,
    about: f.about || 'Advanced diagnostic pathology lab with home collection facilities.',
    availableDates: f.availableDates || ['2026-09-05', '2026-09-06', '2026-09-07'],
    image: f.image || '',
    homeCollection: f.homeCollectionAvailable ?? true,
    accreditation: ['NABL', 'ICMR'],
    turnaroundHours: 12,
    availableTests: f.availableTests || defaultTests,
    popularTests: defaultTests,
  };
}

export const diagnosticApi = {
  // Fetch labs/diagnostic centres from location service
  getCentres: async (params?: DiagnosticSearchParams): Promise<DiagnosticCentre[]> => {
    try {
      const lat = params?.lat ?? 22.5726;
      const lng = params?.lng ?? 88.3639;

      const response = await axiosClient.get('/locations/nearby-facilities', {
        params: {
          latitude: lat,
          longitude: lng,
          radiusKm: params?.radiusKm ?? 32,
          type: 'LAB',
          limit: 30,
        },
      });

      const facilities = response.data?.data ?? response.data ?? [];
      let mapped = facilities.map(mapFacilityToDiagnosticCentre);

      if (params?.query) {
        const q = params.query.toLowerCase();
        mapped = mapped.filter((c: DiagnosticCentre) =>
          c.name.toLowerCase().includes(q) || c.address.toLowerCase().includes(q)
        );
      }

      return mapped;
    } catch (e) {
      console.warn('Failed to fetch from /locations/nearby-facilities?type=LAB:', e);
      return [];
    }
=======
  centreId: string;
  testId: string;
  collectionMethod: 'centre' | 'home';
  date: string;
  time: string;
  patientDetails: any;
  prescriptionUrl?: string;
}

export const diagnosticApi = {
  // Fetch labs/diagnostic centres mapped precisely to backend Swagger /locations/nearby-facilities
  getCentres: async (params?: DiagnosticSearchParams): Promise<DiagnosticCentre[]> => {
    const response = await axiosClient.get('/locations/nearby-facilities', {
      params: {
        // latitude: params?.lat,
        // longitude: params?.lng,
        radiusKm: params?.radiusKm ?? 100,
        type: 'LAB',
        limit: 50
      }
    });
    return response.data;
>>>>>>> 75418c99e0f6181755f1deb96944f01de879ca23
  },

  // Fetch a specific lab's details and test catalog
  getCentreById: async (id: string): Promise<DiagnosticCentre | null> => {
    try {
      const response = await axiosClient.get(`/labs/${id}/tests`);
      const tests = response.data?.data ?? response.data ?? [];
      const mappedTests = tests.map((t: any) => ({
        id: t.id,
        name: t.name,
        price: t.price ?? 500,
        rate: t.price ?? 500,
        turnaroundHours: 12,
        fastingRequired: false,
        homeCollectionAvailable: true,
      }));

      return {
        id,
        name: 'Diagnostic Centre',
        address: 'Diagnostic Laboratory',
        rating: 4.8,
        reviewCount: 90,
        distanceKm: 0,
        establishedYear: 2015,
        verified: true,
        about: 'Diagnostic and pathology services.',
        availableDates: ['2026-09-05', '2026-09-06'],
        homeCollection: true,
        accreditation: ['NABL'],
        turnaroundHours: 12,
        availableTests: mappedTests,
        popularTests: mappedTests,
      };
    } catch {
      return null;
    }
  },

  // Book a lab test
  bookLabTest: async (payload: LabBookingPayload): Promise<{ success: boolean; orderId: string }> => {
    try {
      const backendBody = {
        labId: payload.labId,
        labTestIds: payload.labTestIds && payload.labTestIds.length > 0 ? payload.labTestIds : ['t1'],
        homeCollection: payload.homeCollection ?? false,
        orderedByDoctorId: payload.orderedByDoctorId || undefined,
        collectionAddressId: payload.collectionAddressId || undefined,
      };

      const response = await axiosClient.post('/labs/bookings', backendBody);
      const bookingId = response.data?.data?.id || response.data?.id || 'lab-' + Date.now();
      return { success: true, orderId: bookingId };
    } catch {
      return { success: true, orderId: 'lab-' + Date.now() };
    }
  },

  // Upload prescription file
  uploadPrescription: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', 'LAB_ORDER');
    try {
      const response = await axiosClient.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return { url: response.data?.data?.fileUrl || response.data?.fileUrl || '' };
    } catch {
      return { url: '' };
    }
  },
};

export default diagnosticApi;