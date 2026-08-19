import type { PartnerNotification } from '../../types/partner.types';

export const MOCK_NOTIFICATIONS: PartnerNotification[] = [
  // Pharmacy Notifications
  {
    id: 'notif-ph-1',
    providerId: 'provider-pharmacy-1',
    title: 'New Prescription Request Received',
    message: 'Aarav Sharma requested prescription order for Augmentin 625 & Pan 40.',
    type: 'NEW_REQUEST',
    timestamp: '10:15 AM',
    isRead: false,
    link: '/partner/requests',
    priority: 'HIGH',
  },
  {
    id: 'notif-ph-2',
    providerId: 'provider-pharmacy-1',
    title: 'Low Stock Alert: Telma 40 Tablets',
    message: 'Current stock is 8 strips (below threshold of 20). Please reorder from distributor.',
    type: 'LOW_STOCK',
    timestamp: '09:00 AM',
    isRead: false,
    link: '/partner/inventory',
    priority: 'MEDIUM',
  },
  {
    id: 'notif-ph-3',
    providerId: 'provider-pharmacy-1',
    title: 'Order ORD-PH-9019 Delivered',
    message: 'Rohan Gupta confirmed delivery of OTC first aid kit.',
    type: 'ORDER_UPDATE',
    timestamp: 'Yesterday 04:58 PM',
    isRead: true,
    link: '/partner/orders',
    priority: 'LOW',
  },

  // Lab Notifications
  {
    id: 'notif-lab-1',
    providerId: 'provider-lab-1',
    title: 'Home Sample Collection Assigned',
    message: 'Sneha Patel requested 11:00 AM collection slot. Phlebotomist Ramesh assigned.',
    type: 'NEW_REQUEST',
    timestamp: '08:45 AM',
    isRead: false,
    link: '/partner/test-bookings',
    priority: 'HIGH',
  },
  {
    id: 'notif-lab-2',
    providerId: 'provider-lab-1',
    title: 'Report Pending Pathologist Review',
    message: 'Thyroid Panel & Vit D3 for Vikram Nair ready for signature.',
    type: 'LAB_REPORT',
    timestamp: '11:00 AM',
    isRead: false,
    link: '/partner/lab-reports',
    priority: 'MEDIUM',
  },

  // Hospital Notifications
  {
    id: 'notif-hosp-1',
    providerId: 'provider-hospital-1',
    title: 'Emergency Triage Check-in',
    message: 'Manish Chawla arrived with suspected acute ligament injury. Bay 3 allocated.',
    type: 'URGENT',
    timestamp: '09:40 AM',
    isRead: false,
    link: '/partner/check-ins',
    priority: 'HIGH',
  },
  {
    id: 'notif-hosp-2',
    providerId: 'provider-hospital-1',
    title: 'New Cardiology Appointment Booked',
    message: 'Ananya Rao booked 11:30 AM slot with Dr. Rajesh Iyer.',
    type: 'NEW_REQUEST',
    timestamp: '09:00 AM',
    isRead: true,
    link: '/partner/appointments',
    priority: 'MEDIUM',
  },

  // Clinic Notifications
  {
    id: 'notif-cln-1',
    providerId: 'provider-clinic-1',
    title: 'New Walk-in Appointment Request',
    message: 'Kavita Sundaram booked 03:30 PM slot for Flu shot consultation.',
    type: 'NEW_REQUEST',
    timestamp: '08:30 AM',
    isRead: false,
    link: '/partner/requests',
    priority: 'NORMAL' as any,
  },
];
