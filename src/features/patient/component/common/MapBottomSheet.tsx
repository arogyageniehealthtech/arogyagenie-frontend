import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, animate, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, MapPin } from 'lucide-react';

export type SheetSnapState = 'min' | 'half' | 'full';

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
  snapState: externalSnapState,
  onSnapChange,
}: MapBottomSheetProps) {
  // Snap state tracking (default: 'half')
  const [internalSnap, setInternalSnap] = useState<SheetSnapState>('half');
  const snap = externalSnapState !== undefined ? externalSnapState : internalSnap;

  const setSnapState = useCallback((newSnap: SheetSnapState) => {
    setInternalSnap(newSnap);
    if (onSnapChange) {
      onSnapChange(newSnap);
    }
  }, [onSnapChange]);

  // Viewport height tracking for pixel-perfect snap heights
  const [vh, setVh] = useState<number>(() => (typeof window !== 'undefined' ? window.innerHeight : 800));

  useEffect(() => {
    const handleResize = () => setVh(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Snap offsets from top of sheet container:
  // - SNAP_FULL: 0px (sheet fully expanded covering ~88vh)
  // - SNAP_HALF: ~38% offset (sheet displays ~50vh from bottom)
  // - SNAP_MIN: ~68% offset (sheet displays ~20vh from bottom)
  const SNAP_FULL = 0;
  const SNAP_HALF = Math.round(vh * 0.38);
  const SNAP_MIN = Math.round(vh * 0.68);

  const y = useMotionValue(SNAP_HALF);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Gesture tracking refs
  const touchStartY = useRef<number>(0);
  const touchStartX = useRef<number>(0);
  const startTranslateY = useRef<number>(SNAP_HALF);
  const isDraggingSheet = useRef<boolean>(false);
  const dragStartTime = useRef<number>(0);

  // Animate to snap point when snap state changes
  useEffect(() => {
    const targetY = snap === 'full' ? SNAP_FULL : snap === 'min' ? SNAP_MIN : SNAP_HALF;
    animate(y, targetY, { type: 'spring', damping: 30, stiffness: 320 });
  }, [snap, SNAP_FULL, SNAP_HALF, SNAP_MIN, y]);

  const snapTo = useCallback((targetSnap: SheetSnapState) => {
    setSnapState(targetSnap);
    const targetY = targetSnap === 'full' ? SNAP_FULL : targetSnap === 'min' ? SNAP_MIN : SNAP_HALF;
    animate(y, targetY, { type: 'spring', damping: 30, stiffness: 320 });
  }, [SNAP_FULL, SNAP_HALF, SNAP_MIN, setSnapState, y]);

  // Handle Touch Start anywhere on the mobile bottom sheet
  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    const touch = e.touches[0];
    touchStartY.current = touch.clientY;
    touchStartX.current = touch.clientX;
    startTranslateY.current = y.get();
    dragStartTime.current = Date.now();
    isDraggingSheet.current = false;
  };

  // Handle Touch Move with nested scroll coordination
  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    const touch = e.touches[0];
    const deltaY = touch.clientY - touchStartY.current;
    const deltaX = touch.clientX - touchStartX.current;

    // Ignore if horizontal swipe is dominant
    if (Math.abs(deltaX) > Math.abs(deltaY) && !isDraggingSheet.current) {
      return;
    }

    const currentScrollTop = listRef.current?.scrollTop || 0;

    // Nested Scroll Coordination Logic:
    if (snap === 'full') {
      // When fully expanded:
      // If user is at top of list (scrollTop <= 0) and dragging DOWN (deltaY > 0), drag the sheet down
      if (currentScrollTop <= 0 && deltaY > 0) {
        isDraggingSheet.current = true;
        const newY = Math.max(SNAP_FULL, startTranslateY.current + deltaY);
        y.set(newY);
        if (e.cancelable) e.preventDefault();
      } else {
        // Allow native list scroll
        isDraggingSheet.current = false;
      }
    } else {
      // When in 'half' or 'min' mode:
      // Swiping up or down anywhere on the sheet moves the sheet
      if (Math.abs(deltaY) > 6 || isDraggingSheet.current) {
        isDraggingSheet.current = true;
        let newY = startTranslateY.current + deltaY;
        // Rubber-band resistance when pulling higher than SNAP_FULL
        if (newY < SNAP_FULL) {
          newY = SNAP_FULL + (newY - SNAP_FULL) * 0.25;
        }
        y.set(newY);
        if (e.cancelable) e.preventDefault();
      }
    }
  };

  // Handle Touch End with velocity and distance thresholds
  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!isDraggingSheet.current) return;
    isDraggingSheet.current = false;

    const touch = e.changedTouches[0];
    const deltaY = touch.clientY - touchStartY.current;
    const duration = Math.max(1, Date.now() - dragStartTime.current);
    const velocity = deltaY / duration; // px/ms

    const currentY = y.get();

    if (snap === 'half') {
      if (deltaY < -40 || velocity < -0.3) {
        // Swiped UP -> Expand to Full
        snapTo('full');
      } else if (deltaY > 60 || velocity > 0.4) {
        // Swiped DOWN -> Collapse to Min
        snapTo('min');
      } else {
        snapTo('half');
      }
    } else if (snap === 'full') {
      if (deltaY > 40 || velocity > 0.3) {
        // Swiped DOWN from full -> Return to Half
        snapTo('half');
      } else {
        snapTo('full');
      }
    } else if (snap === 'min') {
      if (deltaY < -40 || velocity < -0.3) {
        // Swiped UP from min -> Return to Half
        snapTo('half');
      } else {
        snapTo('min');
      }
    } else {
      if (currentY < SNAP_HALF * 0.5) {
        snapTo('full');
      } else if (currentY > SNAP_HALF * 1.4) {
        snapTo('min');
      } else {
        snapTo('half');
      }
    }
  };

  const toggleExpand = () => {
    if (snap === 'full') {
      snapTo('half');
    } else {
      snapTo('full');
    }
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* MOBILE BOTTOM SHEET (visible on < lg screens)                            */}
      {/* ========================================================================= */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-30 pointer-events-none pb-[env(safe-area-inset-bottom)]">
        {/* Semi-transparent backdrop when fully expanded */}
        <AnimatePresence>
          {snap === 'full' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => snapTo('half')}
              className="fixed inset-0 bg-slate-900 pointer-events-auto z-0"
            />
          )}
        </AnimatePresence>

        {/* DRAGGABLE FULL BOTTOM SHEET CONTAINER */}
        <motion.div
          style={{ y }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          className="relative z-10 pointer-events-auto w-full h-[88vh] bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.18)] border-t border-slate-200 flex flex-col overflow-hidden select-none touch-pan-y"
        >
          {/* DRAG HANDLE & HEADER BAR */}
          <div
            onClick={toggleExpand}
            className="w-full pt-2.5 pb-2 px-4 flex flex-col items-center justify-center cursor-pointer select-none shrink-0 group active:bg-slate-50/60 rounded-t-3xl bg-white border-b border-slate-100"
          >
            {/* Pill drag indicator */}
            <div className="w-10 h-1.5 bg-slate-300 group-hover:bg-[#5B21B6] rounded-full transition-colors mb-1.5" />

            {/* Compact Header Summary */}
            <div className="w-full flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-5 h-5 rounded-full bg-purple-50 text-[#5B21B6] flex items-center justify-center font-black text-[11px] shrink-0 shadow-2xs border border-purple-100">
                  {isLoading ? '...' : resultCount}
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-black text-slate-900 tracking-tight leading-tight truncate">
                    {isLoading
                      ? `Searching ${itemNoun}...`
                      : `${resultCount} ${resultCount === 1 ? itemNoun : itemNoun + 's'} Nearby`}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium truncate flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-[#5B21B6] shrink-0" />
                    <span>Within {radiusKm} KM • {snap === 'full' ? 'Swipe down to collapse' : 'Swipe up to expand'}</span>
                  </p>
                </div>
              </div>

              {/* Snap State Toggle Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand();
                }}
                className="p-1 rounded-lg bg-slate-100 hover:bg-purple-50 text-slate-600 hover:text-[#5B21B6] transition-colors shrink-0 cursor-pointer"
                title={snap === 'full' ? 'Collapse' : 'Expand full list'}
              >
                {snap === 'full' ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* SCROLLABLE CARDS & EMPTY SPACE CONTENT */}
          <div
            ref={listRef}
            className={`flex-1 bg-white overflow-y-auto px-2.5 sm:px-4 pb-20 pt-2.5 space-y-2.5 custom-scrollbar overscroll-contain min-h-0 flex flex-col ${
              snap === 'min' ? 'overflow-hidden pointer-events-none opacity-40' : 'opacity-100'
            }`}
          >
            <div className="w-full bg-white flex flex-col gap-2.5">
              {children}
            </div>
            
            {/* Draggable Solid White Empty Space Layer (Ensures smooth drag even with 1 result) */}
            <div className="flex-1 w-full min-h-36 bg-white" />
          </div>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP / TABLET RESULTS PANEL (visible on lg+ screens)                   */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex absolute left-4 top-4 bottom-4 z-20 w-96 lg:w-[420px] shrink-0 flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Results Header */}
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-sm font-black text-slate-900 tracking-tight">
              {isLoading
                ? `Searching ${itemNoun}...`
                : `${resultCount} Available ${resultCount === 1 ? itemNoun : itemNoun + 's'}`}
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Filtered within <span className="font-bold text-[#5B21B6]">{radiusKm} KM</span> of your location
            </p>
          </div>
          <div className="px-2.5 py-1 bg-purple-50 text-[#5B21B6] border border-purple-100 rounded-lg text-xs font-black shadow-2xs">
            {resultCount} Results
          </div>
        </div>

        {/* Scrollable Results List */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 custom-scrollbar bg-white flex flex-col">
          <div className="w-full bg-white flex flex-col gap-2.5">
            {children}
          </div>
          <div className="flex-1 w-full min-h-16 bg-white" />
        </div>
      </div>
    </>
  );
}
