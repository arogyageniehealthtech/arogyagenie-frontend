import type {AuthUser}  from '../../../types/auth.types'
import API from '../../../lib/axios'
export const getProfile = async (): Promise<AuthUser> => {
  const response = await API.get<AuthUser>("/patient/profile");
  return response.data;
};
