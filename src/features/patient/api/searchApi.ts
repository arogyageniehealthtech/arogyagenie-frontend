import axiosClient from '../../../lib/axios';

export interface SearchParams {
  q: string;
  types?: string; // Comma-separated: DOCTOR,HOSPITAL,CLINIC,LAB,PHARMACY,MEDICINE
  limit?: number; // Default 10, maximum 20
}

export interface SearchResponse {
  doctors?: any[];
  facilities?: any[];
  medicines?: any[];
  [key: string]: any;
}

export const searchApi = {
  // [GET] Cross-entity substring search over doctors/facilities/medicines
  globalSearch: async (params: SearchParams): Promise<SearchResponse> => {
    const response = await axiosClient.get<SearchResponse>('/search', { params });
    return response.data;
  },
};

export default searchApi;