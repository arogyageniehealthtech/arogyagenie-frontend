import type { ComponentType } from 'react';

export interface ProfileMenuItemConfig {
  label: string;
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  href: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  membership?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  bloodGroup?: string;
  allergies?: string;
  existingConditions?: string;
  currentMedications?: string;
  previousSurgeries?: string;
}
