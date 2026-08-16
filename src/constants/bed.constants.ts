import type { BedType } from "../features/patient/types/bed.types";

export const BED_PRICES: Record<BedType, number> = {
  GENERAL_WARD: 2000,
  SEMI_PRIVATE: 4000,
  PRIVATE_ROOM: 6000,
  ICU: 8000,
  NICU: 9000,
  PICU: 8500,
  EMERGENCY: 5000,
};

export const BED_LABELS: Record<BedType, string> = {
  GENERAL_WARD: "General Ward",
  SEMI_PRIVATE: "Semi-Private",
  PRIVATE_ROOM: "Private Room",
  ICU: "ICU",
  NICU: "NICU",
  PICU: "PICU",
  EMERGENCY: "Emergency Bed",
};