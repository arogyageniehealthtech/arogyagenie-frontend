import React, { useState } from 'react';
import { X, MapPin, Search } from 'lucide-react';
import { useAppDispatch } from '../../../../store/hooks';
import { setCustomLocation } from '../../../../store/slices/locationSlice';

// FIX APPLIED: Correct Interface Name
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_LOCATIONS = [
  { name: "Khardaha, West Bengal", lat: 22.7281, lng: 88.3752 },
  { name: "Lake Town, Kolkata", lat: 22.6050, lng: 88.4020 },
  { name: "Salt Lake Sector V, Kolkata", lat: 22.5726, lng: 88.4372 },
];

export default function CustomLocationModal({ isOpen, onClose }: ModalProps) {
  const dispatch = useAppDispatch();
  const [inputVal, setInputVal] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-600" /> Set Location
          </h3>
          <button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 text-gray-500"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); if(inputVal.trim()) { dispatch(setCustomLocation({ lat: 22.5726, lng: 88.3639, address: inputVal })); onClose(); } }} className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search city or area..." value={inputVal} onChange={(e) => setInputVal(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" />
        </form>
        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-400 uppercase">Popular Locations</p>
          <div className="space-y-1">
            {POPULAR_LOCATIONS.map((loc) => (
              <button key={loc.name} type="button" onClick={() => { dispatch(setCustomLocation({ lat: loc.lat, lng: loc.lng, address: loc.name })); onClose(); }} className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2 text-gray-700">
                <MapPin className="w-4 h-4 text-gray-400" /> {loc.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}