import type { NotificationItem } from "../types/Notification.types";



export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Appointment Confirmed',
    message: 'Your upcoming consultation with Dr. Arup Kumar is confirmed for tomorrow.',
    timestamp: '10m ago',
    category: 'appointments',
    read: false,
  },
  {
    id: 'n2',
    title: 'Medicine Request Accepted',
    message: 'Apollo Pharmacy accepted your order and is preparing it for dispatch.',
    timestamp: '1h ago',
    category: 'orders',
    read: false,
  },
  {
    id: 'n3',
    title: 'Lab Report Ready',
    message: 'Your CBC lab report from City Diagnostics is now available.',
    timestamp: 'Yesterday',
    category: 'reports',
    read: true,
  },
];