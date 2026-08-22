import { useState } from 'react';
import { Marker, InfoWindow } from '@react-google-maps/api';
import type { Provider } from '../types/healthcare';

interface Props {
  provider: Provider;
}

export function MapMarker({ provider }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Marker 
      position={{ lat: provider.lat, lng: provider.lng }}
      onClick={() => setIsOpen(true)}
    >
      {isOpen && (
        <InfoWindow onCloseClick={() => setIsOpen(false)}>
          <div className="p-1 min-w-[150px] font-sans">
            <h4 className="font-bold text-[#14152B] m-0 text-sm">{provider.name}</h4>
            <p className="text-xs text-red-600 font-semibold m-0 mt-1">{provider.type}</p>
            <p className="text-xs text-gray-500 m-0 mt-1">{provider.distance} km away</p>
            <button className="mt-2 text-xs font-semibold text-white bg-[#E50914] px-3 py-1.5 rounded-md w-full hover:bg-red-700 transition-colors">
              View Details
            </button>
          </div>
        </InfoWindow>
      )}
    </Marker>
  );
}