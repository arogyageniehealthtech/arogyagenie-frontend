import  { useState, useMemo } from 'react';
import { doctors as mockDoctors } from '../data/doctors.data';
import { LocationSelector } from '../components/care.component/LocationSelector';
import { CareSearchBar } from "../components/care.component/CareSearchBar"
import { SpecialtyFilters } from '../components/care.component/SpecialtyFilters';
import { DoctorMap } from '../components/care.component/Map';
import { DoctorList } from '../components/care.component/DoctorList';

export default function CarePage() {
  const [doctors, setDoctors] = useState(mockDoctors);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [location, setLocation] = useState('New York, USA');

  const handleToggleFavorite = (id: string) => {
    setDoctors(prev => prev.map(doc => 
      doc.id === id ? { ...doc, isFavorite: !doc.isFavorite } : doc
    ));
  };

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      const matchesSearch = 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.hospital.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;

      return matchesSearch && matchesSpecialty;
    });
  }, [doctors, searchTerm, selectedSpecialty]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 lg:pt-8 flex flex-col gap-5">
        
        {/* Header Section */}
        <header className="flex flex-col gap-4">
          <LocationSelector location={location} onChange={setLocation} />
          <CareSearchBar value={searchTerm} onChange={setSearchTerm} />
          <SpecialtyFilters selected={selectedSpecialty} onChange={setSelectedSpecialty} />
        </header>

        <div className="flex flex-col lg:flex-row lg:gap-8 lg:mt-4">
          
         
          <div className="lg:hidden shrink-0">
            <DoctorMap />
          </div>

         
          <div className="flex-1 lg:w-[45%] lg:max-w-md shrink-0">
            <h2 className="text-sm font-bold text-slate-800 mb-4 hidden lg:block">Available Doctors</h2>
            <DoctorList doctors={filteredDoctors} onToggleFavorite={handleToggleFavorite} />
          </div>

          
          <div className="hidden lg:block lg:flex-1 sticky top-24 h-[calc(100vh-140px)]">
            <DoctorMap />
          </div>

        </div>
      </div>
    </div>
  );
}
