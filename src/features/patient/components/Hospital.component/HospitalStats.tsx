import React from "react";
import { ShieldAlert, HeartPulse, Bed, UsersRound } from "lucide-react";

interface HospitalStatsProps {
  icuBeds: number;
  generalBeds: number;
  specialistCount: number;
}

export const HospitalStats: React.FC<HospitalStatsProps> = ({
  icuBeds,
  generalBeds,
  specialistCount,
}) => {
  const stats = [
    { label: "Emergency", value: "24/7", icon: ShieldAlert, color: "text-red-500" },
    { label: "ICU Beds", value: `${icuBeds}`, icon: HeartPulse, color: "text-purple-700" },
    { label: "Gen. Beds", value: `${generalBeds}`, icon: Bed, color: "text-purple-700" },
    { label: "Specialists", value: `${specialistCount}+`, icon: UsersRound, color: "text-purple-700" },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 my-5">
      {stats.map((stat, idx) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={idx}
            className="bg-purple-50/60 border border-purple-100/80 rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-xs transition hover:bg-purple-50"
          >
            <IconComponent className={`w-5 h-5 mb-1.5 ${stat.color}`} />
            <span className="text-sm md:text-base font-bold text-[#14152B]">{stat.value}</span>
            <span className="text-[11px] md:text-xs text-[#64748B] font-medium mt-0.5 truncate w-full">{stat.label}</span>
          </div>
        );
      })}
    </div>
  );
};