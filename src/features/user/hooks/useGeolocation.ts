import { useState, useCallback } from 'react';

interface Coordinates {
  lat: number;
  lng: number;
}

export function useGeolocation(initialCoords: Coordinates) {
  const [coords, setCoords] = useState<Coordinates>(initialCoords);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      (err) => {
        console.error("Error obtaining location:", err);
        setError("Unable to retrieve precise location. Please ensure location permissions are allowed.");
        setIsLocating(false);
      },
      { 
        enableHighAccuracy: true, // Forces device GPS/Wi-Fi triangulation instead of IP lookup
        // timeout: 15000,           // Allows up to 15 seconds to fetch a precise lock
        maximumAge: 0             // Disables cached positions to ensure fresh data
      }
    );
  }, []);

  return { coords, isLocating, error, fetchLocation };
}