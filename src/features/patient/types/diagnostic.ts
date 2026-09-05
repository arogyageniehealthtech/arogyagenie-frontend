import type { BaseFacility } from './common';

export type CollectionMethod = 'centre' | 'home';

export interface TestOption {
  id: string;
  name: string;
  price: number;
  rate: number;
  homeCollectionAvailable: boolean;
  turnaroundHours?: number;
  fastingRequired?: boolean;
}

export interface DiagnosticCentre extends BaseFacility {
  establishedYear: number;
  verified: boolean;
  availableTests: TestOption[];
  phone?: string;
  homeCollection?: boolean;
  accreditation?: string[];
  turnaroundHours?: number;
  popularTests?: TestOption[];
}