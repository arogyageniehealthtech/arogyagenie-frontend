import type{ BaseFacility } from '../../patient/types/common';

export type CollectionMethod = 'centre' | 'home';

export interface TestOption {
  id: string;
  name: string;
  rate: number;
  homeCollectionAvailable: boolean;
}

export interface DiagnosticCentre extends BaseFacility {
  establishedYear: number;
  verified: boolean;
  availableTests: TestOption[];
}