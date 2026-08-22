import { MapPin, Navigation } from 'lucide-react';

interface Props {
  onAllow: () => void;
  onDeny: () => void;
}

export function LocationPermissionModal({ onAllow, onDeny }: Props) {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#14152B]/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <Navigation className="w-8 h-8 text-[#5B21B6]" />
        </div>
        
        <h2 className="text-xl font-bold text-center text-[#14152B] mb-2">
          Allow "ArogyaGenie" to use your location?
        </h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          We need your location to discover nearby doctors, diagnostic labs, and pharmacies.
        </p>

        <div className="flex flex-col gap-3">
          <button 
            onClick={onAllow}
            className="w-full bg-[#5B21B6] text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-[#4c1d95] transition-colors"
          >
            Allow when I use this website
          </button>
          
          <button 
            onClick={onAllow}
            className="w-full bg-purple-50 text-[#5B21B6] py-3.5 rounded-xl font-semibold text-sm hover:bg-purple-100 transition-colors"
          >
            Allow this time
          </button>
          
          <button 
            onClick={onDeny}
            className="w-full bg-transparent text-gray-500 py-3.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Don't allow
          </button>
        </div>
      </div>
    </div>
  );
}