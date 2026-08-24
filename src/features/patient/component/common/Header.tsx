import React, { useState } from 'react';
import { Navigation2, MapPin, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { fetchCurrentLocation } from '../../../../store/slices/locationSlice';
import CustomLocationModal from './CustomLocationModal';

export default function Header({ title,  }: { title: string, subtitle: string, icon: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { addressString, isLoading } = useAppSelector((state) => state.location);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="w-full sticky top-0 z-30">
        {/* Increased height slightly to accommodate larger text */}
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            {/* <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">{icon}</div> */}
            <div>
              {/* INCREASED TITLE SIZE: Scales from text-xl (mobile) to text-3xl (desktop) */}
              <h1 className="font-bold text-gray-900 leading-tight text-xl sm:text-2xl md:text-3xl mb-0.5">
                {title}
              </h1>
              
              {/* INCREASED SUBTITLE SIZE: From text-[10px] to text-sm */}
              <p className="text-xs sm:text-sm font-medium text-gray-500 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-purple-600" /> {addressString}
              </p>
            </div>
          </div>
          
          {/* INCREASED BUTTON SIZES: Changed text-sm to text-base and slightly larger padding/icons */}
          <div className="hidden md:flex items-center gap-3 text-base">
            <button 
              onClick={() => dispatch(fetchCurrentLocation())} 
              disabled={isLoading} 
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-50 text-purple-700 font-semibold hover:bg-purple-100 disabled:opacity-50 transition-colors"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation2 className="w-5 h-5" />} 
              Current Location
            </button>
            
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <MapPin className="w-5 h-5 text-gray-400" /> 
              Custom Location
            </button>
          </div>
          
        </div>
      </header>
      
      <CustomLocationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
