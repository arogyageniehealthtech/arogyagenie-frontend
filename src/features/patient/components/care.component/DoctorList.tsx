import React from 'react';
import type { Doctor } from '../../types/doctor.types';
import { DoctorCard } from './DoctorCard';

interface DoctorListProps {
  doctors: Doctor[];
  onToggleFavorite: (id: string) => void;
}

export const DoctorList: React.FC<DoctorListProps> = ({ doctors, onToggleFavorite }) => {
  if (doctors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-2xl border border-slate-100">
        <span className="text-4xl mb-3">🔍</span>
        <h3 className="text-sm font-bold text-slate-800">No doctors found</h3>
        <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {doctors.map((doctor) => (
        <DoctorCard 
          key={doctor.id} 
          doctor={doctor} 
          onToggleFavorite={onToggleFavorite} 
        />
      ))}
    </div>
  );
};