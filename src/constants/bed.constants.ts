import type { BedType } from "../features/patient/types/bed.types";

export const BED_PRICES: Record<string, number> = {
  GENERAL_WARD: 2000,
  SEMI_PRIVATE: 4000,
  PRIVATE_ROOM: 6000,
  ICU: 8000,
  NICU: 9000,
  PICU: 8500,
  EMERGENCY: 5000,
  general: 2000,
  'semi-private': 4000,
  private: 6000,
  icu: 8000,
  hdu: 7000,
  nicu: 9000,
};

export const BED_LABELS: Record<string, string> = {
  GENERAL_WARD: "General Ward",
  SEMI_PRIVATE: "Semi-Private",
  PRIVATE_ROOM: "Private Room",
  ICU: "ICU",
  NICU: "NICU",
  PICU: "PICU",
  EMERGENCY: "Emergency Bed",
  general: "General Ward",
  'semi-private': "Semi-Private",
  private: "Private Room",
  icu: "ICU",
  hdu: "HDU",
  nicu: "NICU",
};