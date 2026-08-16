import type { UserProfile } from "../types/profile.types";
import { MOCK_PROFILE } from "../data/profile.mock";

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getProfile = async (): Promise<UserProfile> => {
  await delay(800);
  // Future: return axios.get('/api/v1/profile').then(res => res.data);
  return MOCK_PROFILE;
};