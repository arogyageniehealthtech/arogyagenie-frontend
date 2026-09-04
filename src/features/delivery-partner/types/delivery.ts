export type DeliveryStatus = 
  | 'PENDING'
  | 'ACCEPTED'
  | 'GOING_TO_PICKUP'
  | 'ARRIVED_AT_PICKUP'
  | 'PICKED_UP'
  | 'OUT_FOR_DELIVERY'
  | 'ARRIVED_AT_DESTINATION'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'FAILED';

export interface Location {
  address: string;
  lat: number;
  lng: number;
}

export interface DeliveryRequest {
  id: string;
  orderId: string;
  status: DeliveryStatus;
  pharmacy: {
    name: string;
    location: Location;
    phone: string;
  };
  destination: {
    area: string; // Keep abstract until picked up
    fullAddress?: string; // Revealed later
    location: Location;
  };
  distance: number; // in km
  estimatedTime: number; // in mins
  earnings: number;
  orderValue: number;
  itemCount: number;
  priority: 'NORMAL' | 'HIGH';
  createdAt: string;
}

export interface DeliveryPartnerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'ONLINE' | 'OFFLINE';
  rating: number;
  totalDeliveries: number;
  acceptanceRate: number;
  completionRate: number;
}