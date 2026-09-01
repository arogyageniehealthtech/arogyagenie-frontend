export type MedicineType = 
  | 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' 
  | 'Cream' | 'Ointment' | 'Drops' | 'Inhaler' 
  | 'Powder' | 'Gel' | 'Other';

export interface Medicine {
  id: string;
  name: string;
  genericName?: string;
  brandName: string;
  manufacturer?: string;
  medicineType: MedicineType;
  category?: string;
  description?: string;
  imageUrl?: string;
  price: number;
  mrp?: number;
  discountPercentage?: number;
  stock: number;
  prescriptionRequired: boolean;
  dosage?: string;
  strength?: string;
  packSize?: string;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
}

export interface CartItem {
  medicineId: string;
  medicine: Medicine;
  quantity: number;
  unitPrice: number;
}