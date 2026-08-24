import type { Pharmacy } from '../types/pharmacy';

export const DUMMY_PHARMACIES: Pharmacy[] = [
  { id: 'p1', name: 'Sanjivani Medico', address: 'Station Road, Khardaha', distance: 1.2, status: 'Open', verified: true, lat: 22.738, lng: 88.375, category: 'pharmacy' },
  { id: 'p2', name: 'Apollo Pharmacy', address: 'Sodepur Barasat Road', distance: 2.5, status: 'Open', verified: true, lat: 22.715, lng: 88.382, category: 'pharmacy' },
  { id: 'p3', name: 'Frank Ross Pharmacy', address: 'BT Road, Titagarh', distance: 3.8, status: 'Open', verified: true, lat: 22.749, lng: 88.370, category: 'pharmacy' },
  { id: 'p4', name: 'Wellness 24/7 Care', address: 'Panihati Crossing', distance: 6.2, status: 'Open', verified: false, lat: 22.705, lng: 88.365, category: 'pharmacy' },
  { id: 'p5', name: 'MedPlus Pharmacy', address: 'Barrackpore', distance: 12.5, status: 'Open', verified: true, lat: 22.765, lng: 88.378, category: 'pharmacy' },
];

export const QUICK_MEDICINES = [
  { id: 'qm1', name: 'Paracetamol 650', dosage: '650mg', form: 'Tablet', requiresPrescription: false },
  { id: 'qm2', name: 'Dolo 650', dosage: '650mg', form: 'Tablet', requiresPrescription: false },
  { id: 'qm3', name: 'Azithromycin 500mg', dosage: '500mg', form: 'Tablet', requiresPrescription: true },
  { id: 'qm4', name: 'Amoxicillin 500mg', dosage: '500mg', form: 'Capsule', requiresPrescription: true },
  { id: 'qm5', name: 'Pantoprazole 40mg', dosage: '40mg', form: 'Tablet', requiresPrescription: false },
  { id: 'qm6', name: 'Cetirizine 10mg', dosage: '10mg', form: 'Tablet', requiresPrescription: false },
  { id: 'qm7', name: 'Cough Syrup', dosage: '100ml', form: 'Syrup', requiresPrescription: false },
  { id: 'qm8', name: 'ORS Electrolyte', dosage: '21.8g', form: 'Powder', requiresPrescription: false },
  { id: 'qm9', name: 'Vitamin C + Zinc', dosage: '500mg', form: 'Tablet', requiresPrescription: false },
];