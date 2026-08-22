import { useMemo } from 'react';
import type { Provider, ProviderType, Location } from '../types/healthcare';
import { MOCK_PROVIDERS } from '../data/healthcareProviders';
import { calculateDistance } from '../utils/distance';

export function useHealthcareProviders(
  activeTab: ProviderType, 
  searchQuery: string, 
  userLocation: Location | null,
  radius: number
) {
  return useMemo(() => {
    // 1. If the browser hasn't provided a location yet, show nothing.
    if (!userLocation) return [];

    // 2. Map over the providers and calculate the REAL distance
    return MOCK_PROVIDERS.map(provider => {
      // Here we grab the live GPS coordinates (userLocation) and calculate the distance 
      // to the provider's coordinates.
      const liveCalculatedDistance = calculateDistance(
        userLocation.lat, 
        userLocation.lng, 
        provider.lat, 
        provider.lng
      );

      return {
        ...provider,
        distance: liveCalculatedDistance // Overwriting the 0 with the real number!
      };
    }).filter(provider => {
      // 3. Filter by Tab
      const matchesType = activeTab === 'All' || provider.type === activeTab;
      
      // 4. Filter by Search
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = provider.name.toLowerCase().includes(searchLower) || 
                            provider.specialization.toLowerCase().includes(searchLower);
      
      // 5. Filter by Radius using the newly calculated live distance
      const matchesDistance = provider.distance <= radius;

      return matchesType && matchesSearch && matchesDistance;
    }).sort((a, b) => a.distance - b.distance); // 6. Sort closest to furthest
    
  }, [activeTab, searchQuery, userLocation, radius]);
}