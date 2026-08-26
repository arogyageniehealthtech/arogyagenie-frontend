export type BedType =
  | 'GENERAL_WARD'
  | 'SEMI_PRIVATE'
  | 'PRIVATE_ROOM'
  | 'ICU'
  | 'NICU'
  | 'PICU'
  | 'EMERGENCY'
  | 'general'
  | 'semi-private'
  | 'private'
  | 'icu'
  | 'hdu'
  | 'nicu';

export interface BedOption {
  type: BedType;
  label: string;
  rate: number;
  availableCount: number;
}
