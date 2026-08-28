import type{ BaseFacility } from './common';

export type CollectionMethod = 'centre' | 'home';

export interface TestOption {
  price: number;
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