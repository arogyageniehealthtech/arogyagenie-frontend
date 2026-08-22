import { useState, useCallback, useEffect } from 'react';
import { GoogleMap, Circle, Marker, InfoWindow, useLoadScript, DirectionsRenderer } from '@react-google-maps/api';
import { Maximize, Navigation, X } from 'lucide-react';
import type { Location, Provider } from '../types/healthcare';
import { MapMarker } from './MapMarker';

interface Props {
  userLocation: Location;
  providers: Provider[];
  radius: number;
  selectedDestination: Provider | null;
  onClearRoute: () => void;
  onCenterMap: () => void;
}

const containerStyle = {
  width: '100%',
  height: '100%'
};

export function HealthcareMap({ userLocation, providers, radius, selectedDestination, onClearRoute, onCenterMap }: Props) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userPopupOpen, setUserPopupOpen] = useState(false);
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  // Fetch the route when a destination is selected
  useEffect(() => {
    if (!selectedDestination || !userLocation || !window.google) {
      setDirectionsResponse(null);
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: { lat: userLocation.lat, lng: userLocation.lng },
        destination: { lat: selectedDestination.lat, lng: selectedDestination.lng },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirectionsResponse(result);
        } else {
          console.error(`Error fetching directions: ${status}`);
        }
      }
    );
  }, [selectedDestination, userLocation, isLoaded]);

  // Smoothly pan to user location if no route is active
  useEffect(() => {
    if (map && !selectedDestination) {
      map.panTo({ lat: userLocation.lat, lng: userLocation.lng });
      map.setZoom(12);
    }
  }, [userLocation, map, selectedDestination]);

  if (loadError) return <div className="w-full lg:w-[58%] h-[500px] lg:h-[700px] rounded-2xl flex items-center justify-center bg-red-50 text-red-500">Error loading map.</div>;
  if (!isLoaded) return <div className="w-full lg:w-[58%] h-[500px] lg:h-[700px] rounded-2xl flex items-center justify-center bg-gray-50 animate-pulse text-gray-400">Loading Map...</div>;

  return (
    <div className="w-full lg:w-[58%] h-[500px] lg:h-[700px] rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative z-0">
      
      {/* Map Type Controls */}
      <div className="absolute top-4 right-4 z-[10] flex bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden text-sm font-medium">
        <button onClick={() => map?.setMapTypeId('roadmap')} className="px-4 py-2 bg-white text-gray-800 hover:bg-gray-50">Map</button>
        <div className="w-px bg-gray-200"></div>
        <button onClick={() => map?.setMapTypeId('satellite')} className="px-4 py-2 bg-white text-gray-500 hover:bg-gray-50">Satellite</button>
      </div>
      
      <div className="absolute top-16 right-4 z-[10]">
        <button onClick={() => document.documentElement.requestFullscreen()} className="p-2 bg-white rounded-lg shadow-md border border-gray-200 text-gray-600 hover:bg-gray-50">
          <Maximize className="w-5 h-5" />
        </button>
      </div>

      {/* Center Map Button */}
      <div className="absolute bottom-6 left-6 z-[10]">
        <button onClick={onCenterMap} className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-full shadow-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50">
          <Navigation className="w-4 h-4 text-[#5B21B6]" />
          Center on Me
        </button>
      </div>

      {/* Clear Route Button (Only shows when navigating) */}
      {selectedDestination && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[10]">
          <button 
            onClick={onClearRoute} 
            className="flex items-center gap-2 px-5 py-2.5 bg-[#E50914] text-white rounded-full shadow-lg text-sm font-bold hover:bg-red-700 transition-colors animate-in slide-in-from-top-4"
          >
            <X className="w-4 h-4" />
            Clear Route
          </button>
        </div>
      )}

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: userLocation.lat, lng: userLocation.lng }}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{ disableDefaultUI: true, zoomControl: true }}
      >
        {/* Draw the Route */}
        {directionsResponse && (
          <DirectionsRenderer 
            directions={directionsResponse}
            options={{
              suppressMarkers: true, // We suppress default markers so we can use our custom ones
              polylineOptions: {
                strokeColor: '#5B21B6',
                strokeWeight: 6,
                strokeOpacity: 0.8,
              }
            }} 
          />
        )}

        {/* User Location Marker */}
        <Marker 
          position={{ lat: userLocation.lat, lng: userLocation.lng }}
          onClick={() => setUserPopupOpen(true)}
          icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }}
        >
          {userPopupOpen && (
            <InfoWindow onCloseClick={() => setUserPopupOpen(false)}>
              <div className="font-sans p-1 text-sm">
                <strong>Your Location</strong><br/>
                {userLocation.name}
              </div>
            </InfoWindow>
          )}
        </Marker>

        {/* Search Radius Circle (Hide it when showing route to keep map clean) */}
        {!selectedDestination && (
          <Circle
            center={{ lat: userLocation.lat, lng: userLocation.lng }}
            radius={radius * 1000}
            options={{
              strokeColor: '#5B21B6',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#5B21B6',
              fillOpacity: 0.08,
              clickable: false,
              draggable: false,
              editable: false,
            }}
          />
        )}

        {/* Provider Markers */}
        {providers.map(provider => (
          <MapMarker key={provider.id} provider={provider} />
        ))}
      </GoogleMap>
    </div>
  );
}