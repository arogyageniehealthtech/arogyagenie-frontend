export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: 'appointments' | 'orders' | 'reports' | 'alerts';
  read: boolean;
}