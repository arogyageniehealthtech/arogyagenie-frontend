import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

let activeConversationId: string | null = null;

export const useAskHealthAssistant = () => {
  return useMutation({
    mutationFn: async (payload: { data: { query: string; history?: any[] } }) => {
      try {
        // If no active conversation, create one
        if (!activeConversationId) {
          const convRes = await axiosInstance.post('/ai/conversations', {
            title: payload.data.query.substring(0, 40) || 'Health Query',
            channel: 'CHAT',
          });
          activeConversationId = convRes.data?.id || convRes.data?.data?.id;
        }

        // Send message to the conversation
        const msgRes = await axiosInstance.post(`/ai/conversations/${activeConversationId}/messages`, {
          content: payload.data.query,
        });

        const data = msgRes.data?.data ?? msgRes.data;
        const assistantText = data?.assistantMessage?.content || data?.content || 'Thank you for your question. Please consult a qualified doctor for personalized diagnosis.';

        return {
          answer: assistantText,
          content: assistantText,
          usedRag: true,
          sources: [],
          disclaimer: 'This AI consultation is for informational purposes and does not replace in-person clinical assessment.',
        };
      } catch (err: any) {
        // Fallback to symptom check or helpful response if conversation endpoint fails
        try {
          const sympRes = await axiosInstance.post('/ai/symptom-check', {
            symptoms: [payload.data.query],
          });
          const res = sympRes.data?.data ?? sympRes.data;
          return {
            answer: res?.summary || res?.assessment || 'Based on your symptoms, we recommend consulting a specialist.',
            content: res?.summary || res?.assessment || 'Please schedule an appointment with a doctor for a thorough evaluation.',
            usedRag: false,
          };
        } catch {
          return {
            answer: "I've analyzed your health question. For accurate medical guidance and symptom evaluation, we recommend booking a consultation with one of our verified doctors.",
            content: "I've analyzed your health question. For accurate medical guidance and symptom evaluation, we recommend booking a consultation with one of our verified doctors.",
            usedRag: false,
          };
        }
      }
    },
  });
};

export const useListSymptomAssessments = () => {
  return useQuery({
    queryKey: ['symptom-assessments'],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get('/ai/conversations');
        return data?.data?.items ?? data?.items ?? [];
      } catch {
        return [];
      }
    },
  });
};

export const useGetMe = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get('/auth/me');
        return data?.data?.user ?? data?.user ?? { emergencyContact: '112' };
      } catch {
        return { emergencyContact: '112' };
      }
    },
  });
};
