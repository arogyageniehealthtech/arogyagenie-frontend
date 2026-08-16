import React from 'react';

export const AvailabilityBadge: React.FC<{ text: string }> = ({ text }) => (
  <span className="px-3 py-1 bg-[#10B981]/10 text-[#10B981] text-[10px] font-bold rounded-full tracking-wide">
    {text}
  </span>
);