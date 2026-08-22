import { MapPin, Navigation, Stethoscope, FlaskConical, Pill } from 'lucide-react';
import type { Provider } from '../../care/types/healthcare';

interface Props {
  provider: Provider;
  onGetDirections: (provider: Provider) => void;
  // NEW: Add the booking handler prop
  onBookAppointment: (provider: Provider) => void; 
}

export function ProviderCard({ provider, onGetDirections, onBookAppointment }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow relative overflow-hidden">
      {/* ... existing header and badges ... */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-1.5 bg-red-50 text-red-600 px-2.5 py-1 rounded-full text-xs font-semibold border border-red-100">
          {provider.type === 'Doctor' && <Stethoscope className="w-3 h-3" />}
          {provider.type === 'Diagnostic Lab' && <FlaskConical className="w-3 h-3" />}
          {provider.type === 'Pharmacy' && <Pill className="w-3 h-3" />}
          {provider.type}
        </div>
        
        <div className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
          {provider.distance} km
        </div>
      </div>

      <h3 className="text-lg font-bold text-[#14152B]">{provider.name}</h3>
      <p className="text-sm font-semibold text-red-600 mt-1">{provider.specialization}</p>
      
      <div className="flex items-start gap-2 mt-3 text-sm text-gray-500">
        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <p>{provider.address}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-5">
        {/* NEW: Attach the handler to this button */}
        <button 
          onClick={() => onBookAppointment(provider)}
          className="bg-[#E50914] text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-red-700 transition-colors shadow-sm"
        >
          Book Appointment
        </button>
        <button 
          onClick={() => onGetDirections(provider)}
          className="bg-white text-gray-700 border border-gray-300 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <Navigation className="w-4 h-4 text-[#5B21B6]" />
          Directions
        </button>
      </div>
    </div>
  );
}