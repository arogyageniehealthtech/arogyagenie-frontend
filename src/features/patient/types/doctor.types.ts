export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  hospital: string;
  rating: number;
  reviewCount: number;
  distance: number;
  consultationFee: number;
  availability: string;
  image: string;
  isFavorite: boolean;
}