import React, { useEffect } from 'react';
import { ArrowLeft, MapPin, Maximize2, X, LocateFixed } from 'lucide-react';
import MapContainer, { type MapLocation } from './MapContainer';
import MapBottomSheet, { type SheetSnapState } from './MapBottomSheet';

interface ExpandedMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  itemNoun: string;
  category: 'doctor' | 'hospital' | 'lab';
  locations: MapLocation[];
  radiusKm: number;
  centerCoordinates?: { lat: number; lng: number };
  selectedLocationId?: string | number | null;
  onSelectLocation: (id: string | number) => void;
  resultCount: number;
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function ExpandedMapModal({
  isOpen,
  onClose,
  title,
  itemNoun,
  category,
  locations,
  radiusKm,
  centerCoordinates,
  selectedLocationId,
  onSelectLocation,
  resultCount,
  isLoading = false,
  children,
}: ExpandedMapModalProps) {
  // Handle device / browser back button via popstate
  useEffect(() => {
    if (!isOpen) return;

    // Push a state into history so the physical/browser back button closes the map
    window.history.pushState({ mapExpanded: true }, '');

    const handlePopState = () => {
      onClose();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 bg-[#F8FAFC] flex flex-col font-sans overflow-hidden animate-in fade-in duration-200">
      
      {/* ========================================================================= */}
      {/* EXPANDED MAP TOP NAVIGATION BAR                                           */}
      {/* ========================================================================= */}
      <header className="relative z-20 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3 sm:px-4 py-2.5 flex items-center justify-between shadow-xs shrink-0">
        
        {/* Back Button & Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-[#5B21B6] transition-all flex items-center gap-1.5 text-xs font-black active:scale-95 cursor-pointer shadow-2xs shrink-0"
            title="Back to List"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to List</span>
          </button>

          <div className="min-w-0 flex flex-col">
            <h1 className="text-xs sm:text-sm font-black text-slate-900 truncate leading-tight">
              {title}
            </h1>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 text-[#5B21B6] shrink-0" />
              <span>{resultCount} {resultCount === 1 ? itemNoun : itemNoun + 's'} nearby • Within {radiusKm} KM</span>
            </p>
          </div>
        </div>

        {/* Close Button / Counter Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="px-2.5 py-1 bg-purple-50 text-[#5B21B6] border border-purple-100 rounded-lg text-xs font-black shadow-2xs">
            {isLoading ? '...' : `${resultCount} Found`}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Close Expanded Map"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      </header>

      {/* ========================================================================= */}
      {/* FULL-SCREEN MAP CANVAS + OVERLAY BOTTOM SHEET                             */}
      {/* ========================================================================= */}
      <div className="relative flex-1 w-full h-full min-h-0 overflow-hidden">
        
        {/* FULL INTERACTIVE GOOGLE MAP */}
        <div className="absolute inset-0 z-0">
          <MapContainer
            category={category}
            locations={locations}
            radiusKm={radiusKm}
            centerCoordinates={centerCoordinates}
            selectedLocationId={selectedLocationId}
            onSelectLocation={onSelectLocation}
          />
        </div>

        {/* BOTTOM SHEET FOR FULL MAP BROWSING */}
        <MapBottomSheet
          resultCount={resultCount}
          itemNoun={itemNoun}
          radiusKm={radiusKm}
          isLoading={isLoading}
        >
          {children}
        </MapBottomSheet>

      </div>

    </div>
  );
}
