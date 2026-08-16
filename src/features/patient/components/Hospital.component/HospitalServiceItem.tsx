import React from "react";
import { 
  HeartPulse, 
  Ambulance, 
  Pill, 
  FlaskConical, 
  Utensils, 
  Droplets, 
  Scan, 
  ShieldAlert,
  Activity 
} from "lucide-react";
import type{ HospitalServiceType } from "../../types/hospital.types";

interface HospitalServiceItemProps {
  type: HospitalServiceType;
  name: string;
  isAvailable: boolean;
}

const serviceIconMap: Record<HospitalServiceType, React.ElementType> = {
  EMERGENCY: HeartPulse,
  AMBULANCE: Ambulance,
  PHARMACY: Pill,
  LAB: FlaskConical,
  CAFETERIA: Utensils,
  BLOOD_BANK: Droplets,
  MRI: Scan,
  CT_SCAN: ShieldAlert,
  ICU: Activity,
};

export const HospitalServiceItem: React.FC<HospitalServiceItemProps> = ({
  type,
  name,
  isAvailable,
}) => {
  const IconComponent = serviceIconMap[type] || Activity;

  return (
    <div className="flex flex-col items-center justify-center p-3 bg-purple-50/40 border border-purple-100/60 rounded-xl transition hover:bg-purple-50">
      <div className="w-10 h-10 rounded-full bg-white text-purple-700 flex items-center justify-center shadow-xs mb-2 border border-purple-100">
        <IconComponent className="w-5 h-5" />
      </div>
      <span className="text-xs font-medium text-[#14152B] text-center truncate w-full">
        {name}
      </span>
      <span className={`text-[10px] font-semibold mt-0.5 ${isAvailable ? "text-green-600" : "text-gray-400"}`}>
        {isAvailable ? "Available" : "Unavailable"}
      </span>
    </div>
  );
};