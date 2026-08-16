import React from "react";
import { Phone, CalendarCheck, Stethoscope, Navigation } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getHospitalDirectionsUrl } from "../../api/hospitals.api";

interface HospitalActionsProps {
  hospitalId: string;
  phoneNumber: string;
  latitude: number;
  longitude: number;
}

export const HospitalActions: React.FC<HospitalActionsProps> = ({
  hospitalId,
  phoneNumber,
  latitude,
  longitude,
}) => {
  const navigate = useNavigate();

  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleGetDirections = () => {
    const url = getHospitalDirectionsUrl(latitude, longitude);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-purple-100 p-4 mt-8 shadow-lg z-20">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleCall}
          className="flex-1 flex items-center justify-center gap-2 border border-purple-700 text-purple-700 bg-white py-3 px-4 rounded-xl font-semibold text-sm transition hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-700"
        >
          <Phone className="w-4 h-4" />
          Call Hospital
        </button>

        <button
          onClick={() => navigate(`/find-doctors?hospitalId=${hospitalId}`)}
          className="flex-1 flex items-center justify-center gap-2 border border-purple-200 text-purple-900 bg-purple-50/50 py-3 px-4 rounded-xl font-semibold text-sm transition hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-700"
        >
          <Stethoscope className="w-4 h-4 text-purple-700" />
          Find Doctors
        </button>

        <button
          onClick={handleGetDirections}
          className="flex-1 flex items-center justify-center gap-2 border border-purple-200 text-purple-900 bg-purple-50/50 py-3 px-4 rounded-xl font-semibold text-sm transition hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-700"
        >
          <Navigation className="w-4 h-4 text-purple-700" />
          Directions
        </button>

        <button
          onClick={() => navigate(`/hospitals/${hospitalId}/admission`)}
          className="flex-1 flex items-center justify-center gap-2 bg-purple-700 text-white py-3 px-4 rounded-xl font-semibold text-sm shadow-md transition hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-700"
        >
          <CalendarCheck className="w-4 h-4" />
          Request Admission
        </button>
      </div>
    </div>
  );
};