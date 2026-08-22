import { useState } from 'react';
import type { Location } from '../types/healthcare';

export function useGeolocation() {
  // Start with absolutely NO location
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const requestLocation = () => {
    setIsLoading(true);
    setPermissionDenied(false);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            name: 'Current Location (GPS)'
          });
          setIsLoading(false);
          setPermissionDenied(false);
        },
        (err) => {
          console.error("Location error:", err);
          setIsLoading(false);
          setPermissionDenied(true); // User blocked the native browser prompt
        }
      );
    } else {
      setIsLoading(false);
      setPermissionDenied(true);
    }
  };

  return { 
    location, 
    requestLocation, 
    isLoading, 
    permissionDenied, 
    setPermissionDenied 
  };
}