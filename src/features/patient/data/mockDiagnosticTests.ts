export interface TestOption {
  id: string;
  name: string;
  rate: number;
  homeCollectionAvailable: boolean;
  description?: string;
}

export const COMMON_DIAGNOSTIC_TESTS: TestOption[] = [
  {
    id: 'test-1',
    name: 'Complete Blood Count (CBC)',
    rate: 450,
    homeCollectionAvailable: true,
    description: 'Measures several components and features of your blood.'
  },
  {
    id: 'test-2',
    name: 'Lipid Profile',
    rate: 799,
    homeCollectionAvailable: true,
    description: 'Measures cholesterol and triglyceride levels.'
  },
  {
    id: 'test-3',
    name: 'Thyroid Function Test (TFT / T3, T4, TSH)',
    rate: 850,
    homeCollectionAvailable: true,
    description: 'Evaluates how well your thyroid gland is working.'
  },
  {
    id: 'test-4',
    name: 'HbA1c (Glycated Hemoglobin)',
    rate: 550,
    homeCollectionAvailable: true,
    description: 'Shows your average blood sugar levels for the past 3 months.'
  },
  {
    id: 'test-5',
    name: 'Liver Function Test (LFT)',
    rate: 999,
    homeCollectionAvailable: true,
    description: 'Checks the overall health of your liver.'
  },
  {
    id: 'test-6',
    name: 'Kidney Function Test (KFT / RFT)',
    rate: 900,
    homeCollectionAvailable: true,
    description: 'Measures markers like creatinine and blood urea nitrogen.'
  },
  {
    id: 'test-7',
    name: 'Vitamin D (25-OH)',
    rate: 1200,
    homeCollectionAvailable: true,
    description: 'Determines vitamin D levels in your blood.'
  },
  {
    id: 'test-8',
    name: 'Vitamin B12',
    rate: 1100,
    homeCollectionAvailable: true,
    description: 'Checks vitamin B12 levels for nerve and blood cell health.'
  },
  {
    id: 'test-9',
    name: 'Blood Glucose Fasting (FBS)',
    rate: 200,
    homeCollectionAvailable: true,
    description: 'Measures blood sugar after an overnight fast.'
  },
  {
    id: 'test-10',
    name: 'MRI Brain Scan',
    rate: 4500,
    homeCollectionAvailable: false,
    description: 'Detailed imaging of brain structure (Centre Visit Only).'
  },
  {
    id: 'test-11',
    name: 'HRCT Chest (COVID / Lung Scan)',
    rate: 3200,
    homeCollectionAvailable: false,
    description: 'High-resolution CT scan of the chest (Centre Visit Only).'
  },
  {
    id: 'test-12',
    name: 'Ultrasound Abdomen & Pelvis',
    rate: 1500,
    homeCollectionAvailable: false,
    description: 'Sonography of abdominal organs (Centre Visit Only).'
  }
];