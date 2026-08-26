import  { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, CircleF, InfoWindowF } from '@react-google-maps/api';

interface MapContainerProps {
  locations: Array<{
    id: string;
    name: string;
    lat?: number;
    lng?: number;
    specialty?: string;
    category?: string;
  }>;
  radiusKm: number;
  centerCoordinates?: { lat: number; lng: number };
}

const containerStyle = { width: '100%', height: '100%' };
const DEFAULT_CENTER = { lat: 22.7230, lng: 88.3780 };

const DOCTOR_ICON = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg width="44" height="52" viewBox="0 0 44 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 2C12.059 2 4 10.059 4 20C4 35 22 49 22 49C22 49 40 35 40 20C40 10.059 31.941 2 22 2Z" fill="#059669" stroke="#FFFFFF" stroke-width="3"/>
    <circle cx="22" cy="19" r="9" fill="#FFFFFF"/>
    <path d="M22 14.5v9m-4.5-4.5h9" stroke="#059669" stroke-width="2.5" stroke-linecap="round"/>
  </svg>
`)}`;

const USER_ICON = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="14" fill="#3B82F6" fill-opacity="0.25"/>
    <circle cx="16" cy="16" r="7" fill="#1D4ED8" stroke="#FFFFFF" stroke-width="3"/>
  </svg>
`)}`;

const MAP_STYLES = [
  { elementType: "geometry", stylers: [{ lightness: 35 }, { saturation: -25 }] },
  { featureType: "poi.business", stylers: [{ visibility: "off" }] },
  { featureType: "poi.attraction", stylers: [{ visibility: "off" }] },
  { featureType: "transit", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#ffffff" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#f3f4f6" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#dbeafe" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#6b7280" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }, { weight: 3 }] }
];

export default function MapContainer({ locations, radiusKm, centerCoordinates }: MapContainerProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [isUserMarkerOpen, setIsUserMarkerOpen] = useState(false);

  const currentCenter = centerCoordinates || DEFAULT_CENTER;

  const onLoad = useCallback(function callback(mapInstance: google.maps.Map) { 
    setMap(mapInstance); 
  }, []);
  
  const onUnmount = useCallback(function callback() { 
    setMap(null); 
  }, []);

  // Force map to re-center immediately when coordinates or radius change
  useEffect(() => {
    if (map) {
      map.setCenter(currentCenter);
      map.panTo(currentCenter);

      if (window.google) {
        const circleBounds = new window.google.maps.Circle({
          center: currentCenter,
          radius: radiusKm * 1000 
        }).getBounds();

        if (circleBounds) {
          map.fitBounds(circleBounds);
        }
      }
    }
  }, [map, currentCenter, radiusKm]);

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center">
        <span className="text-slate-400 font-medium text-sm">Loading Interactive Map...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative z-10">
      <GoogleMap
        mapContainerStyle={containerStyle} 
        center={currentCenter} 
        zoom={14} 
        onLoad={onLoad} 
        onUnmount={onUnmount}
        options={{
          mapTypeControl: false, 
          streetViewControl: false, 
          fullscreenControl: false, // Removed fullscreen button
          zoomControl: false,       // Removed zoom controls (+ / - buttons)
          styles: MAP_STYLES
        }}
      >
        {/* Distinct User Location Pin */}
        <MarkerF 
          position={currentCenter} 
          icon={{ url: USER_ICON, scaledSize: new window.google.maps.Size(32, 32), anchor: new window.google.maps.Point(16, 16) }} 
          title="Your Current Location"
          onClick={() => setIsUserMarkerOpen(true)}
        >
          {isUserMarkerOpen && (
            <InfoWindowF onCloseClick={() => setIsUserMarkerOpen(false)}>
              <div className="p-1.5 max-w-37.5 font-sans text-center">
                <span className="font-bold text-blue-600 text-xs block mb-0.5">📍 You are here</span>
                <p className="text-[10px] text-slate-500 m-0">Lat: {currentCenter.lat.toFixed(4)}, Lng: {currentCenter.lng.toFixed(4)}</p>
              </div>
            </InfoWindowF>
          )}
        </MarkerF>
        
        {/* Radius Circle Area */}
        <CircleF 
          center={currentCenter} 
          radius={radiusKm * 1000} 
          options={{ 
            fillColor: '#3B82F6', fillOpacity: 0.05, 
            strokeColor: '#3B82F6', strokeOpacity: 0.4, strokeWeight: 2, 
            clickable: false, zIndex: 1 
          }} 
        />
        
        {/* Markers */}
        {locations
          .filter((loc): loc is typeof loc & { lat: number; lng: number } => typeof loc.lat === 'number' && typeof loc.lng === 'number')
          .map((loc) => (
          <MarkerF
            key={loc.id}
            position={{ lat: loc.lat, lng: loc.lng }}
            icon={{ url: DOCTOR_ICON, scaledSize: new window.google.maps.Size(32, 32), anchor: new window.google.maps.Point(16, 32) }}
            onClick={() => setActiveMarker(loc.id)}
          >
            {activeMarker === loc.id && (
              <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
                <div className="p-1.5 max-w-40 font-sans">
                  <h3 className="font-bold text-[#13102F] m-0 text-sm leading-tight mb-1">{loc.name}</h3>
                  {loc.specialty && (
                    <span className="inline-block bg-[#5B21B6]/10 text-[#5B21B6] px-1.5 py-0.5 rounded text-[10px] font-bold">
                      {loc.specialty}
                    </span>
                  )}
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2.5 block w-full text-center bg-slate-900 text-white text-[11px] font-semibold py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Get Directions
                  </a>
                </div>
              </InfoWindowF>
            )}
          </MarkerF>
        ))}
      </GoogleMap>
    </div>
  );
}