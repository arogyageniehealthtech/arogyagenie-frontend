import React from "react";

interface BedAvailabilityRowProps {
  label: string;
  availableBeds: number;
}

export const BedAvailabilityRow: React.FC<BedAvailabilityRowProps> = ({
  label,
  availableBeds,
}) => {
  const getBadgeStyle = (count: number) => {
    if (count > 5) return { text: `${count} Available`, bg: "bg-green-50 text-green-700 border-green-200" };
    if (count >= 1) return { text: `${count} Limited`, bg: "bg-amber-50 text-amber-700 border-amber-200" };
    return { text: "0 Full", bg: "bg-red-50 text-red-700 border-red-200" };
  };

  const badge = getBadgeStyle(availableBeds);

  return (
    <div className="flex items-center justify-between p-3.5 bg-white border border-purple-100/70 rounded-xl shadow-xs transition hover:border-purple-200">
      <span className="text-sm font-semibold text-[#14152B]">{label}</span>
      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${badge.bg}`}>
        {badge.text}
      </span>
    </div>
  );
};