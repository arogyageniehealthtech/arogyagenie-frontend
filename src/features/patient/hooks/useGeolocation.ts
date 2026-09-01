import { useState, useCallback } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { setCustomLocation } from '@/store/slices/locationSlice';

interface Coordinates {
  lat: number;
  lng: number;
}

export function useGeolocation(initialCoords: Coordinates) {
  const [coords, setCoords] = useState<Coordinates>(initialCoords);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const fetchLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCoords(newCoords);
        dispatch(setCustomLocation({ ...newCoords, address: "Current Live Location" }));
        setIsLocating(false);
      },
      (err) => {
        console.error("Error obtaining location:", err);
        setError("Unable to retrieve precise location. Please ensure location permissions are allowed.");
        setIsLocating(false);
      },
      { 
        enableHighAccuracy: true,
        maximumAge: 0
      }
    );
  }, [dispatch]);

  return { coords, isLocating, error, fetchLocation };
}