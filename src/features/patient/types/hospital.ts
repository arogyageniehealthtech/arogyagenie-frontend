import type{ BaseFacility } from './common';

export type BedType = 'general' | 'semi-private' | 'private' | 'icu' | 'hdu' | 'nicu';

export interface BedOption {
  type: BedType;
  label: string;
  rate: number;
  availableCount: number; 

}

export interface Hospital extends BaseFacility {
  facilityType: string;
  establishedYear: number;
  nextAvailableBed: string;
  departments: string[];
  bedOptions: BedOption[];
  emergencyServices?: boolean;
}