export interface ChatMessageData {
  id: string;
  type: "ai" | "user";
  message: string;
  timestamp?: string;
}

export interface HealthMetric {
  label: string;
  value: string;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}