import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { Medicine } from '../../../types/medicine.type.';

// Using Axios interceptors/config from existing project setup usually
const api = axios.create({ baseURL: '/api/v1' });

export interface FetchMedicinesParams {
  q?: string;
  type?: string;
  category?: string;
  sort?: string;
  prescription?: string;
}

const fetchMedicines = async (params: FetchMedicinesParams): Promise<Medicine[]> => {
  // In a real project, this would map directly to your backend
  // e.g., const { data } = await api.get('/medicines', { params });
  
  // For the sake of this implementation, returning mock structure to demonstrate integration
  const { data } = await axios.get<Medicine[]>('https://run.mocky.io/v3/cf431e78-3a21-4f16-8f35-081cfef7a36d', { params }); 
  return data || [];
};

export const useMedicines = (params: FetchMedicinesParams) => {
  return useQuery({
    queryKey: ['medicines', params],
    queryFn: () => fetchMedicines(params),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};

export const useMedicineRecommendations = (seedId?: string) => {
  return useQuery({
    queryKey: ['medicines-recommendations', seedId],
    queryFn: () => fetchMedicines({ sort: 'popular' }),
    staleTime: 1000 * 60 * 30, // Recommendations cache longer
  });
};