import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

// API adapter to connect the frontend to the standalone backend
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const useAskHealthAssistant = () => {
  return useMutation({
    mutationFn: async (payload: { data: { query: string; history?: any[] } }) => {
      const { data } = await apiClient.post('/ai/health-assistant', payload.data);
      return data;
    },
  });
};

export const useListSymptomAssessments = () => {
  return useQuery({
    queryKey: ['symptom-assessments'],
    queryFn: async () => {
      // Mocked to prevent errors as this endpoint might not exist locally
      return [];
    },
  });
};

export const useGetMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      // Mocked emergency contact
      return { emergencyContact: '112' };
    },
  });
};
