import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Layers, MapPin, Sparkles } from 'lucide-react';

export type SheetSnapState = 'peek' | 'half' | 'full';

interface MapBottomSheetProps {
  children: React.ReactNode;
  resultCount: number;
  itemNoun: string; // e.g., 'Doctor', 'Doctors', 'Hospital', 'Hospitals'
  radiusKm: number;
  isLoading?: boolean;
  activeLocationName?: string;
  snapState?: SheetSnapState;
  onSnapChange?: (state: SheetSnapState) => void;
}

export default function MapBottomSheet({
  children,
  resultCount,
  itemNoun,
  radiusKm,
  isLoading = false,
  activeLocationName,
  snapState: externalSnapState,
  onSnapChange,
}: MapBottomSheetProps) {
  const [internalSnap, setInternalSnap] = useState<SheetSnapState>('peek');
  const snap = externalSnapState !== undefined ? externalSnapState : internalSnap;

  const setSnap = (newSnap: SheetSnapState) => {
    setInternalSnap(newSnap);
    if (onSnapChange) {
      onSnapChange(newSnap);
    }
  };

  // Drag handling variables
  const dragStartY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  // Height configurations for mobile
  // peek: 88px, half: 48vh, full: calc(100vh - 120px)
  const getSheetStyle = () => {
    switch (snap) {
      case 'peek':
        return 'h-24 sm:h-28';
      case 'half':
        return 'h-[50vh] sm:h-[52vh]';
      case 'full':
        return 'h-[86vh] sm:h-[88vh]';
    }
  };

  const cycleSnap = () => {
    if (snap === 'peek') setSnap('half');
    else if (snap === 'half') setSnap('full');
    else setSnap('peek');
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
    isDragging.current = true;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const deltaY = e.changedTouches[0].clientY - dragStartY.current;
    isDragging.current = false;

    // Upward drag (negative deltaY) expands
    if (deltaY < -40) {
      if (snap === 'peek') setSnap('half');
      else if (snap === 'half') setSnap('full');
    } 
    // Downward drag (positive deltaY) collapses
    else if (deltaY > 40) {
      if (snap === 'full') setSnap('half');
      else if (snap === 'half') setSnap('peek');
    }
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* MOBILE BOTTOM SHEET (visible on < lg screens)                            */}
      {/* ========================================================================= */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-30 pointer-events-none pb-[env(safe-area-inset-bottom)]">
        {/* Backdrop for full expansion */}
        <AnimatePresence>
          {snap === 'full' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setSnap('half')}
              className="fixed inset-0 bg-slate-900 pointer-events-auto"
            />
          )}
        </AnimatePresence>

        <motion.div
          layout
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className={`pointer-events-auto w-full bg-white/98 backdrop-blur-xl rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.18)] border-t border-slate-200/80 flex flex-col transition-all duration-300 ${getSheetStyle()}`}
        >
          {/* DRAG HANDLE BAR */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={cycleSnap}
            className="w-full pt-2.5 pb-2 px-4 flex flex-col items-center justify-center cursor-pointer select-none shrink-0 group active:bg-slate-50/50 rounded-t-3xl"
          >
            {/* Pill drag indicator */}
            <div className="w-12 h-1.5 bg-slate-300 group-hover:bg-indigo-500 rounded-full transition-colors mb-1.5" />

            {/* Compact Header Summary Bar */}
            <div className="w-full flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                  {isLoading ? '...' : resultCount}
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-black text-slate-900 tracking-tight leading-tight truncate">
                    {isLoading
                      ? `Searching ${itemNoun}...`
                      : `${resultCount} ${resultCount === 1 ? itemNoun : itemNoun + 's'} Nearby`}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium truncate flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-indigo-500 shrink-0" />
                    <span>Within {radiusKm} KM radius</span>
                  </p>
                </div>
              </div>

              {/* Snap State Toggle Button */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    cycleSnap();
                  }}
                  className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[11px] font-extrabold flex items-center gap-1 transition-all"
                >
                  <span>{snap === 'full' ? 'Collapse' : snap === 'half' ? 'Full List' : 'View List'}</span>
                  {snap === 'full' ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronUp className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* SCROLLABLE CARDS CONTENT */}
          <div
            className={`flex-1 overflow-y-auto px-3 sm:px-4 pb-16 pt-1 space-y-3 custom-scrollbar ${
              snap === 'peek' ? 'overflow-hidden pointer-events-none opacity-40' : 'opacity-100'
            }`}
          >
            {children}
          </div>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP / TABLET RESULTS PANEL (visible on lg+ screens)                   */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex w-5/12 xl:w-[42%] shrink-0 flex-col h-[calc(100vh-140px)] min-h-125 bg-white/95 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden">
        {/* Results Header */}
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-sm font-black text-slate-900 tracking-tight">
              {isLoading
                ? `Searching ${itemNoun}...`
                : `${resultCount} Available ${resultCount === 1 ? itemNoun : itemNoun + 's'}`}
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Filtered within <span className="font-bold text-indigo-600">{radiusKm} KM</span> of your location
            </p>
          </div>
          <div className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-black shadow-2xs">
            {resultCount} Results
          </div>
        </div>

        {/* Scrollable Results List */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3 custom-scrollbar">
          {children}
        </div>
      </div>
    </>
  );
}
