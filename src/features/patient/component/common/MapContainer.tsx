import { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, CircleF, InfoWindowF } from '@react-google-maps/api';
import { LocateFixed, MapPin, AlertTriangle, ExternalLink } from 'lucide-react';

export interface MapLocation {
  id: string | number;
  name?: string;
  lat: number;
  lng: number;
  specialty?: string;
  category: 'doctor' | 'clinic' | 'lab' | 'hospital';
  address?: string;
  distanceKm?: number;
  rating?: number;
}

interface MapContainerProps {
  locations: MapLocation[];
  radiusKm: number;
  centerCoordinates?: { lat: number; lng: number };
  selectedLocationId?: string | number | null;
  onSelectLocation?: (id: string | number) => void;
  category?: 'doctor' | 'hospital' | 'lab';
}

const containerStyle = { width: '100%', height: '100%' };
const FALLBACK_CENTER = { lat: 22.5726, lng: 88.3639 }; // Kolkata default fallback

// Custom SVG map pin generators
const DOCTOR_PIN = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg width="44" height="52" viewBox="0 0 44 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <filter id="shadow" x="0" y="0" width="44" height="52" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#064E3B" flood-opacity="0.35"/>
    </filter>
    <path d="M22 3C12.059 3 4 11.059 4 21C4 36 22 49 22 49C22 49 40 36 40 21C40 11.059 31.941 3 22 3Z" fill="#059669" stroke="#FFFFFF" stroke-width="2.5" filter="url(#shadow)"/>
    <circle cx="22" cy="20" r="10" fill="#FFFFFF"/>
    <path d="M22 15v10m-5-5h10" stroke="#059669" stroke-width="2.6" stroke-linecap="round"/>
  </svg>
`)}`;

const DOCTOR_PIN_ACTIVE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg width="52" height="60" viewBox="0 0 52 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <filter id="shadowActive" x="0" y="0" width="52" height="60" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#064E3B" flood-opacity="0.5"/>
    </filter>
    <path d="M26 3C14.4 3 5 12.4 5 24C5 41.5 26 57 26 57C26 57 47 41.5 47 24C47 12.4 37.6 3 26 3Z" fill="#047857" stroke="#FDE047" stroke-width="3.5" filter="url(#shadowActive)"/>
    <circle cx="26" cy="23" r="12" fill="#FFFFFF"/>
    <path d="M26 17v12m-6-6h12" stroke="#047857" stroke-width="3" stroke-linecap="round"/>
  </svg>
`)}`;

const HOSPITAL_PIN = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg width="44" height="52" viewBox="0 0 44 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <filter id="hShadow" x="0" y="0" width="44" height="52" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#1E1B4B" flood-opacity="0.35"/>
    </filter>
    <path d="M22 3C12.059 3 4 11.059 4 21C4 36 22 49 22 49C22 49 40 36 40 21C40 11.059 31.941 3 22 3Z" fill="#4F46E5" stroke="#FFFFFF" stroke-width="2.5" filter="url(#hShadow)"/>
    <circle cx="22" cy="20" r="10" fill="#FFFFFF"/>
    <path d="M16.5 23.5V17.5C16.5 17 17 16.5 17.5 16.5H26.5C27 16.5 27.5 17 27.5 17.5V23.5H16.5Z" fill="#4F46E5"/>
    <rect x="20" y="20" width="4" height="4.5" fill="#FFFFFF"/>
    <path d="M18 15h8" stroke="#4F46E5" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
`)}`;

const HOSPITAL_PIN_ACTIVE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg width="52" height="60" viewBox="0 0 52 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <filter id="hShadowActive" x="0" y="0" width="52" height="60" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#1E1B4B" flood-opacity="0.5"/>
    </filter>
    <path d="M26 3C14.4 3 5 12.4 5 24C5 41.5 26 57 26 57C26 57 47 41.5 47 24C47 12.4 37.6 3 26 3Z" fill="#4338CA" stroke="#FDE047" stroke-width="3.5" filter="url(#hShadowActive)"/>
    <circle cx="26" cy="23" r="12" fill="#FFFFFF"/>
    <path d="M19.5 27V19.5C19.5 19 20 18.5 20.5 18.5H31.5C32 18.5 32.5 19 32.5 19.5V27H19.5Z" fill="#4338CA"/>
    <rect x="24" y="22.5" width="4" height="5.5" fill="#FFFFFF"/>
  </svg>
`)}`;

const LAB_PIN = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg width="44" height="52" viewBox="0 0 44 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <filter id="lShadow" x="0" y="0" width="44" height="52" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#581C87" flood-opacity="0.35"/>
    </filter>
    <path d="M22 3C12.059 3 4 11.059 4 21C4 36 22 49 22 49C22 49 40 36 40 21C40 11.059 31.941 3 22 3Z" fill="#7C3AED" stroke="#FFFFFF" stroke-width="2.5" filter="url(#lShadow)"/>
    <circle cx="22" cy="20" r="10" fill="#FFFFFF"/>
    <circle cx="20" cy="18" r="2.5" fill="#7C3AED"/>
    <path d="M22 17l4 6m-5 1h6" stroke="#7C3AED" stroke-width="2" stroke-linecap="round"/>
  </svg>
`)}`;

const LAB_PIN_ACTIVE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg width="52" height="60" viewBox="0 0 52 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <filter id="lShadowActive" x="0" y="0" width="52" height="60" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#581C87" flood-opacity="0.5"/>
    </filter>
    <path d="M26 3C14.4 3 5 12.4 5 24C5 41.5 26 57 26 57C26 57 47 41.5 47 24C47 12.4 37.6 3 26 3Z" fill="#6D28D9" stroke="#FDE047" stroke-width="3.5" filter="url(#lShadowActive)"/>
    <circle cx="26" cy="23" r="12" fill="#FFFFFF"/>
    <circle cx="24" cy="21" r="3" fill="#6D28D9"/>
    <path d="M26 19l5 8m-7 1h8" stroke="#6D28D9" stroke-width="2.4" stroke-linecap="round"/>
  </svg>
`)}`;

const USER_ICON = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="18" r="17" fill="#3B82F6" fill-opacity="0.2"/>
    <circle cx="18" cy="18" r="11" fill="#2563EB" fill-opacity="0.4"/>
    <circle cx="18" cy="18" r="6" fill="#1D4ED8" stroke="#FFFFFF" stroke-width="2.5"/>
  </svg>
`)}`;

const MAP_STYLES = [
  { elementType: "geometry", stylers: [{ lightness: 20 }, { saturation: -15 }] },
  { featureType: "poi.business", stylers: [{ visibility: "off" }] },
  { featureType: "poi.attraction", stylers: [{ visibility: "off" }] },
  { featureType: "transit", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#ffffff" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#e2e8f0" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#dbeafe" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#475569" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }, { weight: 3 }] }
];

export default function MapContainer({
  locations,
  radiusKm,
  centerCoordinates,
  selectedLocationId,
  onSelectLocation,
  category = 'doctor'
}: MapContainerProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey
  });

  const [hasAuthError, setHasAuthError] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [activeMarkerId, setActiveMarkerId] = useState<string | number | null>(selectedLocationId ?? null);
  const [isUserMarkerOpen, setIsUserMarkerOpen] = useState(false);
  const [browserCoords, setBrowserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const hasInitiallyFittedBounds = useRef(false);

  // Catch Google Maps authentication failure callback (BillingNotEnabled, ApiNotActivated, RefererNotAllowed)
  useEffect(() => {
    const originalAuthFailure = (window as any).gm_authFailure;
    (window as any).gm_authFailure = () => {
      console.warn("Google Maps Platform auth failure intercepted.");
      setHasAuthError(true);
      if (typeof originalAuthFailure === 'function') {
        originalAuthFailure();
      }
    };

    return () => {
      (window as any).gm_authFailure = originalAuthFailure;
    };
  }, []);

  // Sync activeMarkerId with selectedLocationId from parent
  useEffect(() => {
    if (selectedLocationId !== undefined) {
      setActiveMarkerId(selectedLocationId);
    }
  }, [selectedLocationId]);

  // Request browser GPS coordinates on mount if no centerCoordinates provided
  useEffect(() => {
    if (!centerCoordinates && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setBrowserCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Browser geolocation unavailable:", error.message);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, [centerCoordinates]);

  const currentCenter = centerCoordinates || browserCoords || FALLBACK_CENTER;

  const onLoad = useCallback(function callback(mapInstance: google.maps.Map) {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  // When selectedLocationId changes, smoothly pan map to it
  useEffect(() => {
    if (map && activeMarkerId) {
      const selectedLoc = locations.find((l) => String(l.id) === String(activeMarkerId));
      if (selectedLoc && typeof selectedLoc.lat === 'number' && typeof selectedLoc.lng === 'number') {
        map.panTo({ lat: selectedLoc.lat, lng: selectedLoc.lng });
        if (map.getZoom() && (map.getZoom() || 0) < 14) {
          map.setZoom(15);
        }
      }
    }
  }, [map, activeMarkerId, locations]);

  // Re-center and adjust bounds when center coordinates or radius changes
  useEffect(() => {
    if (map && currentCenter) {
      if (!hasInitiallyFittedBounds.current) {
        map.setCenter(currentCenter);
        if (window.google) {
          const circleBounds = new window.google.maps.Circle({
            center: currentCenter,
            radius: radiusKm * 1000
          }).getBounds();
          if (circleBounds) {
            map.fitBounds(circleBounds);
            hasInitiallyFittedBounds.current = true;
          }
        }
      }
    }
  }, [map, currentCenter, radiusKm]);

  const handleRecenter = () => {
    if (map && currentCenter) {
      map.panTo(currentCenter);
      map.setZoom(14);
      setActiveMarkerId(null);
    }
  };

  const handleMarkerClick = (loc: MapLocation) => {
    setActiveMarkerId(loc.id);
    if (onSelectLocation) {
      onSelectLocation(loc.id);
    }
    if (map) {
      map.panTo({ lat: loc.lat, lng: loc.lng });
    }
  };

  const getMarkerIcon = (loc: MapLocation, isActive: boolean) => {
    const locCat = loc.category || category;
    if (locCat === 'hospital') {
      return isActive ? HOSPITAL_PIN_ACTIVE : HOSPITAL_PIN;
    }
    if (locCat === 'lab' || locCat === 'clinic') {
      return isActive ? LAB_PIN_ACTIVE : LAB_PIN;
    }
    return isActive ? DOCTOR_PIN_ACTIVE : DOCTOR_PIN;
  };

  const validLocations = locations.filter(
    (loc): loc is MapLocation & { lat: number; lng: number } =>
      typeof loc.lat === 'number' && typeof loc.lng === 'number' && !isNaN(loc.lat) && !isNaN(loc.lng)
  );

  // =========================================================================
  // GRACEFUL FALLBACK RADAR CANVAS (Rendered if Google Maps auth/billing fails)
  // =========================================================================
  if (hasAuthError || loadError || !apiKey) {
    return (
      <div className="w-full h-full relative bg-slate-900 overflow-hidden flex flex-col justify-between p-4 select-none font-sans">
        {/* Animated Background Vector Grid / Radar Rings */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#6366F1" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Concentric Radar Rings */}
            <circle cx="50%" cy="50%" r="28%" fill="none" stroke="#818CF8" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />
            <circle cx="50%" cy="50%" r="42%" fill="none" stroke="#6366F1" strokeWidth="1" />
          </svg>
        </div>

        {/* Top Status Banner */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          <div className="px-2.5 py-1 bg-slate-800/90 backdrop-blur-md rounded-xl border border-slate-700/80 shadow-md flex items-center gap-1.5 text-xs text-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-[11px]">Active GPS Location • {radiusKm} KM Radius</span>
          </div>

          <div className="px-2 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-lg text-[10px] font-bold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>Fallback Map Canvas</span>
          </div>
        </div>

        {/* Center User Radar Location Pin */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 animate-ping absolute" />
            <div className="w-10 h-10 rounded-full bg-blue-500/30 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
            </div>
            <span className="absolute -bottom-6 bg-slate-950/90 px-2 py-0.5 rounded text-[10px] font-extrabold text-blue-400 border border-blue-500/40 whitespace-nowrap shadow-md">
              📍 You ({currentCenter.lat.toFixed(2)}, {currentCenter.lng.toFixed(2)})
            </span>
          </div>
        </div>

        {/* Interactive Simulated Marker Coordinates on Canvas */}
        <div className="absolute inset-0 z-20 pointer-events-auto overflow-hidden">
          {validLocations.map((loc, idx) => {
            const isSelected = String(loc.id) === String(activeMarkerId);
            
            // Calculate proportional offset from center (normalized to canvas view)
            const angle = (idx * (360 / Math.max(1, validLocations.length)) * Math.PI) / 180;
            const distRatio = Math.min(0.35, 0.15 + (idx * 0.05));
            const leftPct = 50 + Math.cos(angle) * (distRatio * 100);
            const topPct = 50 + Math.sin(angle) * (distRatio * 100);

            return (
              <div
                key={loc.id}
                style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                onClick={() => handleMarkerClick(loc)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-110 z-20'
                }`}
              >
                <div className={`p-1.5 rounded-xl shadow-xl flex items-center gap-1 border transition-all ${
                  isSelected 
                    ? 'bg-yellow-400 text-slate-950 border-white ring-2 ring-yellow-300' 
                    : 'bg-slate-900/90 text-white border-purple-500/50 hover:border-purple-400'
                }`}>
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-purple-400'}`} />
                  <span className="text-[10px] font-black truncate max-w-24">{loc.name}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Interactive Notice & External Map Direction Bar */}
        <div className="relative z-10 flex items-center justify-between gap-2 mt-auto">
          <div className="text-[10px] text-slate-400 font-medium">
            {validLocations.length} providers within {radiusKm} KM radius
          </div>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(category + ' near ' + currentCenter.lat + ',' + currentCenter.lng)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-md transition-all active:scale-95"
          >
            <span>Open Google Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  // Loading State
  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-slate-900/10 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center animate-pulse">
        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <span className="text-slate-600 font-bold text-xs uppercase tracking-wider">Loading Map Canvas...</span>
      </div>
    );
  }

  // =========================================================================
  // STANDARD GOOGLE MAP CANVAS
  // =========================================================================
  return (
    <div className="w-full h-full relative z-0 overflow-hidden select-none">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentCenter}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: false,
          styles: MAP_STYLES,
          clickableIcons: false,
          gestureHandling: 'greedy',
        }}
      >
        {/* User Location Pulse Pin */}
        <MarkerF
          position={currentCenter}
          icon={{
            url: USER_ICON,
            scaledSize: new window.google.maps.Size(36, 36),
            anchor: new window.google.maps.Point(18, 18),
          }}
          title="You are here"
          zIndex={100}
          onClick={() => setIsUserMarkerOpen(true)}
        >
          {isUserMarkerOpen && (
            <InfoWindowF onCloseClick={() => setIsUserMarkerOpen(false)}>
              <div className="p-1 font-sans text-center min-w-32">
                <span className="font-bold text-blue-600 text-xs block mb-0.5">📍 Your Location</span>
                <p className="text-[10px] text-slate-500 m-0">
                  {currentCenter.lat.toFixed(4)}, {currentCenter.lng.toFixed(4)}
                </p>
              </div>
            </InfoWindowF>
          )}
        </MarkerF>

        {/* Radius Circle */}
        <CircleF
          center={currentCenter}
          radius={radiusKm * 1000}
          options={{
            fillColor: '#6366F1',
            fillOpacity: 0.06,
            strokeColor: '#6366F1',
            strokeOpacity: 0.35,
            strokeWeight: 1.5,
            clickable: false,
            zIndex: 1,
          }}
        />

        {/* Location Markers */}
        {validLocations.map((loc) => {
          const isActive = String(loc.id) === String(activeMarkerId);
          const iconUrl = getMarkerIcon(loc, isActive);
          const size = isActive ? new window.google.maps.Size(46, 54) : new window.google.maps.Size(38, 45);
          const anchor = isActive ? new window.google.maps.Point(23, 54) : new window.google.maps.Point(19, 45);

          return (
            <MarkerF
              key={loc.id}
              position={{ lat: loc.lat, lng: loc.lng }}
              icon={{
                url: iconUrl,
                scaledSize: size,
                anchor: anchor,
              }}
              zIndex={isActive ? 90 : 10}
              onClick={() => handleMarkerClick(loc)}
            >
              {isActive && (
                <InfoWindowF onCloseClick={() => setActiveMarkerId(null)}>
                  <div className="p-1 max-w-48 font-sans">
                    <h3 className="font-extrabold text-slate-900 m-0 text-xs leading-tight mb-1">
                      {loc.name}
                    </h3>
                    {loc.specialty && (
                      <span className="inline-block bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded text-[10px] font-bold mb-1">
                        {loc.specialty}
                      </span>
                    )}
                    {loc.address && (
                      <p className="text-[10px] text-slate-500 line-clamp-2 m-0 mb-2 leading-tight">
                        {loc.address}
                      </p>
                    )}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold py-1.5 rounded-md transition-colors"
                    >
                      Open Directions ↗
                    </a>
                  </div>
                </InfoWindowF>
              )}
            </MarkerF>
          );
        })}
      </GoogleMap>

      {/* Floating Recenter Quick Control */}
      <div className="absolute right-3 bottom-24 lg:bottom-5 z-20 flex flex-col gap-2">
        <button
          onClick={handleRecenter}
          className="w-10 h-10 bg-white/95 backdrop-blur-md hover:bg-white text-slate-700 hover:text-indigo-600 rounded-xl shadow-lg border border-slate-200/80 flex items-center justify-center transition-all active:scale-90 cursor-pointer"
          title="Recenter Map"
        >
          <LocateFixed className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}