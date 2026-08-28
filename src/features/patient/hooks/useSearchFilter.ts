import { useMemo } from 'react';
import { calculateDistance } from '../utils/distance';

interface Coordinates {
  lat: number;
  lng: number;
}
interface SearchParams<T> {
  data: T[];
  query: string;
  radiusKm: number;
  categoryFilter?: string | null;
  userLocation: Coordinates;
  getSearchableText: (item: T) => string;
  getCategory?: (item: T) => string | string[];
}

// FIX: Properly constrain T to include the required properties
export function useSearchFilter<T extends { distanceKm: number; lat?: number; lng?: number }>({
  data,
  query,
  radiusKm,
  categoryFilter,
  userLocation,
  getSearchableText,
  getCategory
}: SearchParams<T>) {
  return useMemo(() => {
    // 1. Calculate dynamic distances for every item
    const augmentedData = data.map(item => {
      // Fallback to static distance if no coordinates are provided in mock data
      const dynamicDistance = (item.lat && item.lng) 
        ? calculateDistance(userLocation.lat, userLocation.lng, item.lat, item.lng)
        : item.distanceKm;

      return {
        ...item,
        distanceKm: dynamicDistance // Overwrite static distance
      };
    });

    // 2. Filter by text, category, and the NEW dynamic radius
    const filtered = augmentedData.filter(item => {
      const textMatches = getSearchableText(item).toLowerCase().includes(query.toLowerCase());
      const radiusMatches = item.distanceKm <= radiusKm;
      
      let categoryMatches = true;
      if (categoryFilter && getCategory) {
        const itemCategory = getCategory(item);
        categoryMatches = Array.isArray(itemCategory) 
          ? itemCategory.includes(categoryFilter)
          : itemCategory === categoryFilter;
      }

      return textMatches && radiusMatches && categoryMatches;
    });

    // 3. Sort results so the closest facilities appear first
    return filtered.sort((a, b) => a.distanceKm - b.distanceKm);

  }, [data, query, radiusKm, categoryFilter, userLocation, getSearchableText, getCategory]);
}