import  { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Star, Building2, ArrowLeft } from "lucide-react"; // Added ArrowLeft

interface HospitalOption {
  id: string;
  name: string;
  location: string;
  distance: string;
  rating: number;
  reviewCount: number;
  image: string;
}

const DUMMY_HOSPITALS: HospitalOption[] = [
  {
    id: "hospital_001",
    name: "CarePlus Multi-Specialty Hospital",
    location: "Downtown, New York",
    distance: "2.1 km away",
    rating: 4.7,
    reviewCount: 820,
    image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "hospital_002",
    name: "City General Medical Center",
    location: "North Zone, New York",
    distance: "4.5 km away",
    rating: 4.5,
    reviewCount: 510,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "hospital_003",
    name: "Apex Health & Trauma Institute",
    location: "Westside, New York",
    distance: "5.8 km away",
    rating: 4.8,
    reviewCount: 940,
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80",
  },
];

export default function HospitalSearchPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");


  const filteredHospitals = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return DUMMY_HOSPITALS.filter(
      (hospital) =>
        hospital.name.toLowerCase().includes(query) ||
        hospital.location.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 bg-[#F8FAFC] min-h-screen">
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-purple-100 text-purple-700 hover:bg-purple-50 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-700"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#14152B]">Find Hospitals</h1>
          <p className="text-sm text-[#64748B]">Search by hospital name or location to view details and bed availability.</p>
        </div>
      </div>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
        </div>
        <input
          type="text"
          placeholder="Search by hospital name or location (e.g., Downtown, CarePlus)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-[#14152B] placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all"
        />
      </div>
      <div className="space-y-4">
        {filteredHospitals.map((hospital) => (
          <div
            key={hospital.id}
            className="bg-white border border-purple-100 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition hover:border-purple-300"
          >
            <div className="flex items-center gap-4">
              <img
                src={hospital.image}
                alt={hospital.name}
                className="w-16 h-16 rounded-xl object-cover border border-purple-50"
              />
              <div className="space-y-1">
                <h3 className="font-bold text-[#14152B] text-base">{hospital.name}</h3>
                <p className="text-xs text-[#64748B] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-purple-700" />
                  {hospital.location} • {hospital.distance}
                </p>
                <div className="flex items-center gap-1 text-xs font-semibold text-amber-500 pt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{hospital.rating}</span>
                  <span className="text-[#64748B] font-normal">({hospital.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate(`/hospitals/${hospital.id}`)}
              className="w-full sm:w-auto bg-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:bg-purple-800 transition whitespace-nowrap"
            >
              Select Hospital
            </button>
          </div>
        ))}

        {filteredHospitals.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-500">No hospitals found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}