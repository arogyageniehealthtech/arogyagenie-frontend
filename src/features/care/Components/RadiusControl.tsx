import { SlidersHorizontal } from 'lucide-react';

interface Props {
  radius: number;
  setRadius: (radius: number) => void;
}

export function RadiusControl({ radius, setRadius }: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex items-center gap-3">
        <SlidersHorizontal className="w-5 h-5 text-gray-400" />
        <span className="text-sm text-gray-600">Search Radius:</span>
        <div className="px-3 py-1 bg-gray-100 rounded-md text-sm font-semibold border border-gray-200">
          {radius} km
        </div>
        <span className="text-xs text-gray-400 ml-2">(Min: 0 km • Max: 32 km)</span>
      </div>

      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <span className="text-xs text-gray-400 font-medium">0 km</span>
        <input
          type="range"
          min="0"
          max="32"
          step="1"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5B21B6]"
        />
        <span className="text-xs text-gray-400 font-medium">32 km</span>
        
        {/* Updated Quick Selection Filters */}
        <div className="flex gap-1.5 ml-4">
          {[2, 4, 8, 16, 32].map(preset => (
            <button
              key={preset}
              onClick={() => setRadius(preset)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                radius === preset 
                ? 'bg-[#5B21B6] text-white' 
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {preset} km
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}