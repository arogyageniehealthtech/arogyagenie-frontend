import type { ComponentType } from 'react';
export type GenderType = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
export interface ProfileMenuItemConfig {
  label: string;
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  href: string;
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: GenderType;
  bloodGroup: string;
  phone: string;
  emergencyContact: string;
  city: string;
  state: string;
  address: string;
  allergies: string;
  existingConditions: string;
  currentMedications: string;
  previousSurgeries: string;
}
