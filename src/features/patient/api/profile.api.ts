import axiosClient from './axiosClient';
import type { UserProfile } from '../types/profile.types';

export const getProfile = async (): Promise<UserProfile> => {
  try {
    const res = await axiosClient.get('/patient/profile');
    return res.data;
  } catch {
    // Fallback default profile
    return {
      id: 'usr_1',
      firstName: 'Rajat',
      lastName: 'Mondal',
      email: 'userrajat@gmail.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      membership: 'Premium Member',
      phone: '+9174788971622',
      bloodGroup: 'O+',
    };
  }
};

export const updateProfile = async (data: Partial<UserProfile>): Promise<UserProfile> => {
  const res = await axiosClient.put('/patient/profile', data);
  return res.data;
};
