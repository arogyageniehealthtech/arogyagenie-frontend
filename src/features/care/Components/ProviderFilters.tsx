import { Search, Activity, Stethoscope, FlaskConical, Pill } from 'lucide-react';
import type { ProviderType } from '../types/healthcare';
import { DOCTOR_SPECIALTIES } from '../data/healthcareProviders';

interface Props {
  activeTab: ProviderType;
  setActiveTab: (tab: ProviderType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalProviders: number;
}

export function ProviderFilters({ activeTab, setActiveTab, searchQuery, setSearchQuery, totalProviders }: Props) {
  return (
    <>
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => setActiveTab('All')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'All' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Activity className="w-4 h-4" />
            All Providers ({totalProviders})
          </button>
          <button 
            onClick={() => setActiveTab('Doctor')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'Doctor' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Stethoscope className="w-4 h-4" />
            Doctors
          </button>
          <button 
            onClick={() => setActiveTab('Diagnostic Lab')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'Diagnostic Lab' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <FlaskConical className="w-4 h-4" />
            Diagnostic Labs
          </button>
          <button 
            onClick={() => setActiveTab('Pharmacy')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'Pharmacy' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Pill className="w-4 h-4" />
            Pharmacies & Medicines
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full xl:w-96">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search any doctor, lab, or medicine..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#5B21B6] focus:ring-1 focus:ring-[#5B21B6] transition-all"
          />
        </div>
      </div>

      {/* Conditionally render specialties ONLY when the Doctor tab is active */}
      {activeTab === 'Doctor' && (
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-xs font-bold text-gray-400 tracking-wider mr-2">DOCTOR CATEGORIES:</span>
          {DOCTOR_SPECIALTIES.map((opt) => (
            <button
              key={opt}
              onClick={() => setSearchQuery(opt)}
              className="px-4 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-[#5B21B6] hover:text-[#5B21B6] transition-colors bg-white"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </>
  );
}