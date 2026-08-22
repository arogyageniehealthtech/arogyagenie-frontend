import { useState } from 'react';
import { MapPin } from 'lucide-react';
import type { ProviderType, Provider } from '../types/healthcare';
import { useGeolocation } from '../hooks/useGeolocation';
import { useHealthcareProviders } from '../hooks/useHealthcareProviders';
import { HealthcareHeader } from './HealthcareHeader';
import { ProviderFilters } from './ProviderFilters';
import { RadiusControl } from './RadiusControl';
import { ProviderList } from './ProviderList';
import { HealthcareMap } from './HealthcareMap';
import { LocationPermissionModal } from './LocationPermissionModal';
// import { BookAppointmentModal } from '../../patient/components/Appointment.component/BookAppointmentModal';

export function HealthcareDiscovery() {
  const { location, requestLocation, isLoading, permissionDenied, setPermissionDenied } = useGeolocation();
  
  const [showModal, setShowModal] = useState(true);
  const [activeTab, setActiveTab] = useState<ProviderType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [radius, setRadius] = useState<number>(10);
  
  // STATE: Tracks which provider the user wants directions to
  const [selectedDestination, setSelectedDestination] = useState<Provider | null>(null);

  // NEW STATE: Tracks which provider the user wants to book an appointment with
  const [bookingProvider, setBookingProvider] = useState<Provider | null>(null);

  // This is the variable your code couldn't find! It fetches the filtered data.
  const filteredProviders = useHealthcareProviders(activeTab, searchQuery, location, radius);

  const handleAllowClick = () => {
    setShowModal(false);
    requestLocation();
  };

  const handleDenyClick = () => {
    setShowModal(false);
    setPermissionDenied(true);
  };

  return (
    <div className="min-h-screen font-sans bg-[#F8FAFC] text-[#14152B] p-4 md:p-8 relative">
      
      {showModal && (
        <LocationPermissionModal onAllow={handleAllowClick} onDeny={handleDenyClick} />
      )}

      <div className={`max-w-[1400px] mx-auto space-y-6 transition-all duration-500 ${!location ? 'blur-sm pointer-events-none opacity-50' : ''}`}>
        
        <HealthcareHeader 
          radius={radius}
          location={location || { lat: 0, lng: 0, name: 'Waiting for location...' }}
          onUseGPS={requestLocation}
          isGpsLoading={isLoading}
        />

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-5">
          <ProviderFilters 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            totalProviders={filteredProviders.length}
          />
          <div className="h-px bg-gray-100 w-full" />
          <RadiusControl radius={radius} setRadius={setRadius} />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <ProviderList 
            providers={filteredProviders} 
            onGetDirections={(provider) => setSelectedDestination(provider)}
            onBookAppointment={(provider) => setBookingProvider(provider)}
          />
          
          {location && (
            <HealthcareMap 
              userLocation={location} 
              providers={filteredProviders} 
              radius={radius}
              selectedDestination={selectedDestination}
              onClearRoute={() => setSelectedDestination(null)}
              onCenterMap={requestLocation} 
            />
          )}
        </div>
      </div>

      {isLoading && !showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F8FAFC]/80 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-[#5B21B6] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-semibold">Acquiring GPS Signal...</p>
            <p className="text-sm text-gray-500 mt-1">Please accept the browser prompt</p>
          </div>
        </div>
      )}

      {permissionDenied && !showModal && !location && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F8FAFC]/90 backdrop-blur-md">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full text-center border border-red-100">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold mb-2">Location Required</h2>
            <p className="text-gray-500 text-sm mb-6">
              We cannot show you nearby healthcare providers without knowing your location. Please enable location services in your browser settings and try again.
            </p>
            <button 
              onClick={requestLocation}
              className="bg-[#5B21B6] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#4c1d95] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Renders the booking modal when a provider is selected */}
      {bookingProvider && (
        <BookAppointmentModal 
          isOpen={true} 
          onClose={() => setBookingProvider(null)} 
          provider={bookingProvider} 
        />
      )}
    </div>
  );
}