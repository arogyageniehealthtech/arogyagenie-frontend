import React from "react";
import { BedAvailabilityRow } from "./BedAvailabilityRow";
import { useNavigate } from "react-router-dom";


interface BedAvailabilityProps {
  hospitalId: string;
  icuBeds: number;
  generalBeds: number;
  privateRooms: number;
}

export const BedAvailability: React.FC<BedAvailabilityProps> = ({
  hospitalId,
  icuBeds,
  generalBeds,
  privateRooms,
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-3 my-6">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-bold text-[#14152B]">Bed Availability</h3>
        <button
          onClick={() => navigate(`/hospitals/${hospitalId}/beds`)}
          className="text-xs font-semibold text-purple-700 hover:text-purple-900 transition underline underline-offset-2"
        >
          Book a Bed
        </button>
      </div>

      <div className="space-y-2.5">
        <BedAvailabilityRow label="ICU Beds" availableBeds={icuBeds} />
        <BedAvailabilityRow label="General Beds" availableBeds={generalBeds} />
        <BedAvailabilityRow label="Private Rooms" availableBeds={privateRooms} />
      </div>
    </div>
  );
};