import React from 'react';
import { Star } from 'lucide-react';

export const DoctorRating: React.FC<{ rating: number; reviews: number }> = ({ rating, reviews }) => (
  <div className="flex items-center gap-1.5 mt-1">
    <Star size={14} className="fill-[#F59E0B] text-[#F59E0B]" />
    <span className="text-xs font-bold text-slate-700">{rating}</span>
    <span className="text-[11px] text-slate-400">({reviews} reviews)</span>
  </div>
);