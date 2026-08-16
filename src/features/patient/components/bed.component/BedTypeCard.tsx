import React from "react";
import type { HospitalBedAvailability } from "../../types/bed.types";
import { BED_LABELS } from "../../../../constants/bed.constants";

interface Props {
  availability: HospitalBedAvailability;
  onSelect: (bedType: HospitalBedAvailability) => void;
}

export const BedTypeCard: React.FC<Props> = ({ availability, onSelect }) => {
  const { bedType, availableBeds, pricePerDay } = availability;

  const getBadgeText = () => {
    if (availableBeds > 5) return `${availableBeds} Available`;
    if (availableBeds >= 1) return `${availableBeds} Limited`;
    return "Currently Full";
  };

  return (
    <div className="border border-purple-200 rounded-lg p-5 bg-white shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-lg font-bold text-purple-900">{BED_LABELS[bedType]}</h4>
          <span className="text-xs px-2 py-1 rounded bg-purple-50 text-purple-700 font-medium border border-purple-200">
            {getBadgeText()}
          </span>
        </div>
        <p className="text-2xl font-extrabold text-purple-700 mb-4">
          ₹{pricePerDay.toLocaleString()} <span className="text-sm font-normal text-gray-500">/ day</span>
        </p>
        
        {bedType === "EMERGENCY" && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-2 rounded mb-3">
            Emergency Bed: Availability may change rapidly.
          </div>
        )}
      </div>

      <button
        disabled={availableBeds === 0}
        onClick={() => onSelect(availability)}
        className={`w-full py-2 rounded-md font-medium transition ${
          availableBeds === 0 
            ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
            : "bg-purple-700 text-white hover:bg-purple-800"
        }`}
      >
        {availableBeds === 0 ? "Currently Full" : "Select"}
      </button>
    </div>
  );
};