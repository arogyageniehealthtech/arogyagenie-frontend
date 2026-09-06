import { useMutation, useQuery } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';

// Module-level conversation ID — reset when user starts a new chat session
let activeConversationId: string | null = null;

/**
 * Reset the active conversation so the next message starts a fresh one.
 * Call this from handleNewChat() in the chatbot component.
 */
export function resetConversation() {
  activeConversationId = null;
}

export const useAskHealthAssistant = () => {
  return useMutation({
    mutationFn: async (payload: { data: { query: string; history?: any[] } }) => {
      // Step 1: Create a new conversation if none is active
      if (!activeConversationId) {
        // Backend schema is .strict() — ONLY { channel } is accepted.
        // Sending extra fields (like "title") causes a 400 ZodError.
        const convRes = await axiosInstance.post('/ai/conversations', {
          channel: 'CHAT',
        });
        // Backend returns the DTO directly (not nested under .data)
        activeConversationId = convRes.data?.id ?? null;
      }

      if (!activeConversationId) {
        throw new Error('Failed to create AI conversation session.');
      }

      // Step 2: Send the user message
      // Backend sendMessageSchema: { content: string } — .strict()
      const msgRes = await axiosInstance.post(
        `/ai/conversations/${activeConversationId}/messages`,
        { content: payload.data.query },
      );

      // Backend response shape (201):
      // { userMessage, assistantMessage, emergencyDetected, selfHarmConcern }
      // The response is at msgRes.data — not nested under msgRes.data.data
      const responseData = msgRes.data;
      const assistantText: string =
        responseData?.assistantMessage?.content ||
        "I'm unable to generate a response right now. Please try again or consult a doctor.";

      return {
        answer: assistantText,
        content: assistantText,
        usedRag: true,
        sources: [],
        disclaimer: 'This AI consultation is for informational purposes and does not replace in-person clinical assessment.',
        emergencyDetected: responseData?.emergencyDetected ?? false,
        selfHarmConcern: responseData?.selfHarmConcern ?? false,
      };
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
