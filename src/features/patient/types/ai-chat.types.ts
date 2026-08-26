export interface ChatMessageData {
  id: string;
  type: 'user' | 'ai';
  message: string;
  timestamp?: string;
  sources?: Array<{
    documentId?: string;
    title?: string;
    source?: string;
  }>;
}
