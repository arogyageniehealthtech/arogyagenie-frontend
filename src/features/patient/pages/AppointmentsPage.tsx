import { useState, useMemo, useEffect } from 'react';
import { 
  Calendar, Clock, Video, MapPin, Search, CalendarDays, Loader2, AlertTriangle, RefreshCcw 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes.constants';

// ==========================================
// Types
// ==========================================
type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';
type ConsultationType = 'video' | 'in-person';

interface Appointment {
  id: string;
  doctorName: string;
  specialization: string;
  hospitalOrClinic: string;
  date: string;
  time: string;
  type: ConsultationType;
  status: AppointmentStatus;
  consultationFee: number;
  imageUrl: string;
}

// ==========================================
// Main Component
// ==========================================
export default function AppointmentsPage() {
  const navigate = useNavigate();
  
  // --- Data State ---
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- UI State ---
  const [activeTab, setActiveTab] = useState<AppointmentStatus | 'all'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  // ==========================================
  // API Integration
  // ==========================================
  const fetchAppointments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // REPLACE THIS URL with your actual API endpoint
      // const response = await fetch('https://api.yourdomain.com/v1/appointments');
      
      // --- Simulated API Delay for Demonstration ---
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = { 
        ok: true, 
        json: async () => MOCK_API_RESPONSE 
      };
      // ---------------------------------------------

      if (!response.ok) {
        throw new Error('Failed to fetch appointments. Please try again later.');
      }

      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on initial mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  // ==========================================
  // Derived State (Counts & Filtering)
  // ==========================================
  const counts = useMemo(() => ({
    upcoming: appointments.filter(a => a.status === 'upcoming').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
    all: appointments.length,
  }), [appointments]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const matchesTab = activeTab === 'all' ? true : apt.status === activeTab;
      const matchesSearch = apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            apt.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            apt.hospitalOrClinic.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [appointments, activeTab, searchQuery]);

  return (
    <div className="max-w-5xl mx-auto space-y-4 pt-4 sm:pt-6 pb-16 px-3 sm:px-6 font-sans">
      
      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Tabs with Counts */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
          {[
            { id: 'upcoming', label: 'Upcoming', count: counts.upcoming },
            { id: 'completed', label: 'Completed', count: counts.completed },
            { id: 'cancelled', label: 'Cancelled', count: counts.cancelled },
            { id: 'all', label: 'All History', count: counts.all },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              disabled={isLoading || !!error}
              className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed ${
                activeTab === tab.id 
                  ? 'bg-[#5B21B6] text-white border-[#5B21B6] shadow-sm' 
                  : 'bg-white text-slate-700 border-slate-200 hover:border-[#5B21B6]/40 hover:text-[#5B21B6]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[11px] font-extrabold ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search doctor or clinic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isLoading || !!error}
            className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {/* --- CONTENT AREA (LOADING / ERROR / LIST) --- */}
      <div className="space-y-3">
        
        {/* State 1: Loading */}
        {isLoading ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-sm flex flex-col items-center justify-center animate-pulse min-h-[300px]">
            <Loader2 className="w-8 h-8 text-[#5B21B6] animate-spin mb-4" />
            <h3 className="font-bold text-sm text-slate-900">Loading Appointments</h3>
            <p className="text-xs font-medium text-slate-500 mt-1">Retrieving your consultation history...</p>
          </div>
        ) : 
        
        /* State 2: Error */
        error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-10 text-center shadow-sm flex flex-col items-center min-h-[300px] justify-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-bold text-sm text-red-900">Unable to load appointments</h3>
            <p className="text-xs font-medium text-red-700 mt-1 max-w-sm">{error}</p>
            <button 
              onClick={fetchAppointments}
              className="mt-4 flex items-center gap-1.5 px-4 py-2 bg-white text-red-700 hover:bg-red-50 border border-red-200 rounded-lg text-xs font-bold transition-colors shadow-sm"
            >
              <RefreshCcw className="w-3.5 h-3.5" /> Try Again
            </button>
          </div>
        ) : 
        
        /* State 3: Empty Results */
        filteredAppointments.length === 0 ? (
          <div className="bg-white border border-slate-200/80 border-dashed rounded-2xl p-12 text-center shadow-sm flex flex-col items-center min-h-[300px] justify-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3 border border-slate-100">
              <CalendarDays className="w-7 h-7 text-slate-300" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">No appointments found</h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5 max-w-xs">You don't have any appointments matching this category or search.</p>
          </div>
        ) : 
        
        /* State 4: List View */
        (
          filteredAppointments.map(apt => (
            <div 
              key={apt.id}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              {/* Doctor Details */}
              <div className="flex items-start gap-3.5">
                <img 
                  src={apt.imageUrl} 
                  alt={apt.doctorName} 
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover bg-slate-100 border border-slate-200 shrink-0 shadow-sm" 
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-black text-slate-900 text-sm sm:text-base group-hover:text-indigo-600 transition-colors">{apt.doctorName}</h3>
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-lg border ${
                      apt.status === 'upcoming' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                      apt.status === 'completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                      'bg-rose-50 border-rose-200 text-rose-700'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[#5B21B6]">{apt.specialization}</p>
                  <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5 pt-0.5 truncate">
                    {apt.type === 'video' ? <Video className="w-3.5 h-3.5 text-[#5B21B6] shrink-0" /> : <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                    <span className="truncate">{apt.hospitalOrClinic}</span>
                  </p>
                </div>
              </div>

              {/* Date, Time & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="bg-slate-50 border border-slate-200/70 px-3.5 py-2 rounded-xl flex flex-col justify-center shrink-0">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#5B21B6]" /> {apt.date}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {apt.time}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {apt.status === 'upcoming' && (
                    <>
                      {apt.type === 'video' && (
                        <button 
                          onClick={() => alert(`Joining video consultation API endpoint triggered...`)}
                          className="px-3.5 py-2 bg-[#5B21B6] hover:bg-[#4c1d95] text-white rounded-xl font-bold text-xs shadow-sm transition-all flex items-center gap-1"
                        >
                          <Video className="w-3.5 h-3.5" /> Join
                        </button>
                      )}
                      <button 
                        onClick={() => alert(`Reschedule API endpoint triggered...`)}
                        className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs transition-colors shadow-sm"
                      >
                        Reschedule
                      </button>
                      <button 
                        onClick={() => alert(`Cancel API endpoint triggered...`)}
                        className="px-2.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-xl font-bold text-xs transition-colors"
                        title="Cancel appointment"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {apt.status === 'completed' && (
                    <button 
                      onClick={() => navigate('/patient/prescriptions')}
                      className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs transition-colors shadow-sm"
                    >
                      Prescription
                    </button>
                  )}

                  {apt.status === 'cancelled' && (
                    <button 
                      onClick={() => navigate(ROUTES.PATIENT.FINDDOCTOR)}
                      className="px-3.5 py-2 bg-[#5B21B6]/10 hover:bg-[#5B21B6]/20 text-[#5B21B6] rounded-xl font-bold text-xs transition-colors"
                    >
                      Book Again
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

// ==========================================
// Fallback Mock Data for API Demo
// ==========================================
const MOCK_API_RESPONSE: Appointment[] = [
  {
    id: 'APT-9042',
    doctorName: 'Dr. Arup Kumar',
    specialization: 'Cardiology',
    hospitalOrClinic: 'City Care Multispecialty Hospital',
    date: 'August 21, 2026',
    time: '05:30 PM',
    type: 'in-person',
    status: 'upcoming',
    consultationFee: 1000,
    imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'APT-8120',
    doctorName: 'Dr. Sunita Sen',
    specialization: 'Pediatrics',
    hospitalOrClinic: 'LifeSpring Maternity Center',
    date: 'August 25, 2026',
    time: '10:00 AM',
    type: 'video',
    status: 'upcoming',
    consultationFee: 800,
    imageUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D',
  },
  {
    id: 'APT-6512',
    doctorName: 'Dr. Rajesh Das',
    specialization: 'Orthopedics',
    hospitalOrClinic: 'Apex Ortho Clinic',
    date: 'August 10, 2026',
    time: '11:30 AM',
    type: 'in-person',
    status: 'completed',
    consultationFee: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: 'APT-4391',
    doctorName: 'Dr. Neha Gupta',
    specialization: 'Dermatology',
    hospitalOrClinic: 'Skin & Care Center',
    date: 'July 15, 2026',
    time: '04:00 PM',
    type: 'video',
    status: 'cancelled',
    consultationFee: 700,
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80',
  },
];