import axiosClient from '../../../lib/axios';

export type DeliveryStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE';

export const deliveryApi = {
  // 1. Get Delivery Partner Profile
  getProfile: async () => {
    return axiosClient.get('/delivery/partners/me');
  },

  // 2. Update Online/Offline Status
  updateStatus: async (currentStatus: DeliveryStatus) => {
    return axiosClient.patch('/delivery/partners/me/status', { currentStatus });
  },

  // 3. Update Live Location
  updateLocation: async (latitude: number, longitude: number) => {
    return axiosClient.patch('/delivery/partners/me/location', { latitude, longitude });
  },

  // 4. Fetch Nearby Unclaimed Deliveries
  getNearbyRequests: async (latitude: number, longitude: number, radiusKm: number = 10) => {
    return axiosClient.get('/pharmacy/delivery/nearby-open', {
      params: { latitude, longitude, radiusKm }
    });
  },

  // 5. Claim a Delivery Assignment
  claimRequest: async (assignmentId: string) => {
    return axiosClient.post(`/pharmacy/delivery/${assignmentId}/claim`);
  },

  // 6. Confirm Pickup (requires OTP from Pharmacy)
  confirmPickup: async (assignmentId: string, otp: string) => {
    return axiosClient.post(`/pharmacy/delivery/${assignmentId}/pickup`, { otp });
  },

  // 7. Confirm Delivery (requires OTP from Patient)
  confirmDelivery: async (assignmentId: string, otp: string) => {
    return axiosClient.post(`/pharmacy/delivery/${assignmentId}/deliver`, { otp });
  }
};