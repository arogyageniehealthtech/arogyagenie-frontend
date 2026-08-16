import React from 'react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router';
import type { Doctor } from '../../types/doctor.types';
import { DoctorRating } from './DoctorRating';
import { AvailabilityBadge } from './AvailabilityBadge';

interface DoctorCardProps {
  doctor: Doctor;
  onToggleFavorite: (id: string) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onToggleFavorite }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex gap-4 transition-all hover:shadow-md">
      {/* Avatar */}
      <div className="shrink-0">
        <img 
          src={doctor.image} 
          alt={doctor.name} 
          className="w-18 h-18 object-cover rounded-[20px] shadow-sm bg-slate-100"
          loading="lazy"
        />
      </div>

      
      <div className="flex-1 min-w-0 py-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-bold text-[#14152B] truncate">{doctor.name}</h3>
            <p className="text-[11px] text-[#64748B] mt-0.5">
              {doctor.specialty} • {doctor.experience}+ years exp.
            </p>
            <p className="text-[11px] text-[#64748B]">{doctor.hospital}</p>
          </div>
          <button 
            onClick={() => onToggleFavorite(doctor.id)}
            className="p-1 -mr-2 -mt-1 text-slate-400 hover:text-red-500 transition-colors"
            aria-label={`Toggle favorite for ${doctor.name}`}
          >
            <Heart size={20} className={doctor.isFavorite ? 'fill-red-500 text-red-500' : ''} />
          </button>
        </div>

        <DoctorRating rating={doctor.rating} reviews={doctor.reviewCount} />

       
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-col gap-2">
             <span className="text-[10px] text-[#64748B] ml-1">{doctor.distance} km away</span>
             <div className="flex items-center gap-3">
               <span className="text-base font-bold text-[#14152B]">₹{doctor.consultationFee}</span>
               <AvailabilityBadge text={doctor.availability} />
             </div>
          </div>
          <button 
            onClick={() => navigate(`/appointments/${doctor.id}`)}
            className="px-6 py-2 bg-[#6D28D9] hover:bg-[#5B21B6] transition-colors text-white text-xs font-bold rounded-xl shadow-[0_4px_12px_rgba(109,40,217,0.25)]"
          >
            Book
          </button>
        </div>
      </div>
    </div>
  );
};