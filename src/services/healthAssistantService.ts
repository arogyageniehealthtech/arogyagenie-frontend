import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

export const useAskHealthAssistant = () => {
  return useMutation({
    mutationFn: async (payload: { data: { query: string; history?: any[] } }) => {
      const { data } = await axiosInstance.post('/ai/health-assistant', payload.data);
      return data;
    },
  });
};

export const useListSymptomAssessments = () => {
  return useQuery({
    queryKey: ['symptom-assessments'],
    queryFn: async () => {
      return [];
    },
  });
};

export const useGetMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      return { emergencyContact: '112' };
    },
  });
};
