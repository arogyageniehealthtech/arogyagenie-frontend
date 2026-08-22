// Inside ../types/doctor.ts

export interface Doctor {
  id: string;
  name: string;
  image: string; // <--- Add this line here
  specialty: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  lat: number;
  lng: number;
  verified: boolean;
  clinicName: string;
  clinicAddress: string;
  nextAvailableSlot: string;
  consultationOptions: ConsultationOption[]; // assuming you have this type defined
  about: string;
  availableDates: string[];
}

// Example ConsultationOption type if you need it:
export interface ConsultationOption {
  type: "in-person" | "video";
  label: string;
  fee: number;
}