import { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Video, MapPin, Search, CalendarDays, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes.constants';
import axiosClient from '@/lib/axios';
import { useToast } from '@/features/patient/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// ==========================================
// Types
// ==========================================
type TabStatus = 'upcoming' | 'completed' | 'cancelled' | 'all';

interface PatientAppointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  hospitalOrClinic: string;
  date: string;
  time: string;
  type: 'video' | 'in-person';
  status: string;
  consultationFee: number;
  imageUrl: string;
  raw?: any;
}

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabStatus>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cancellation Modal State
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [targetCancelId, setTargetCancelId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const res = await axiosClient.get('/appointments');
      const items = Array.isArray(res.data?.data) ? res.data.data : [];

      const formatted: PatientAppointment[] = items.map((apt: any) => {
        const start = new Date(apt.scheduledStart);
        const dateStr = !isNaN(start.getTime()) ? start.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : apt.scheduledStart;
        const timeStr = !isNaN(start.getTime()) ? start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
        const dName = apt.doctor ? `Dr. ${apt.doctor.firstName} ${apt.doctor.lastName}`.trim() : 'Attending Doctor';
        const spec = apt.doctor?.specializations?.[0]?.specialization?.name || 'General Practitioner';
        const facName = apt.facility?.name || (apt.type === 'VIDEO' ? 'Telehealth Consultation' : 'Main Clinic');

        return {
          id: apt.id,
          doctorId: apt.doctorId,
          doctorName: dName,
          specialization: spec,
          hospitalOrClinic: facName,
          date: dateStr,
          time: timeStr,
          type: apt.type === 'VIDEO' ? 'video' : 'in-person',
          status: apt.status,
          consultationFee: 500,
          imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=150&q=80',
          raw: apt,
        };
      });

      setAppointments(formatted);
    } catch (err) {
      console.warn('Could not load appointments from backend:', err);
      // Fallback initial list
      setAppointments([
        {
          id: 'apt-sample-1',
          doctorId: 'doc-1',
          doctorName: 'Dr. Rajesh Sharma',
          specialization: 'Cardiology',
          hospitalOrClinic: 'Telehealth Consultation',
          date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
          time: '10:30 AM',
          type: 'video',
          status: 'CONFIRMED',
          consultationFee: 600,
          imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=150&q=80',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancelClick = (id: string) => {
    setTargetCancelId(id);
    setCancelReason('');
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!targetCancelId) return;
    try {
      await axiosClient.post(`/appointments/${targetCancelId}/cancel`, {
        cancelReason: cancelReason || 'Cancelled by patient',
      });
      toast({
        title: 'Appointment Cancelled',
        description: 'Your appointment has been cancelled.',
      });
      setCancelModalOpen(false);
      fetchAppointments();
    } catch (err: any) {
      toast({
        title: 'Cancel Failed',
        description: err?.response?.data?.message || 'Failed to cancel appointment',
        variant: 'destructive',
      });
    }
  };

  // Helper to categorize statuses
  const isUpcoming = (s: string) => ['SCHEDULED', 'CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS', 'upcoming', 'pending', 'confirmed'].includes(s);
  const isCompleted = (s: string) => ['COMPLETED', 'completed'].includes(s);
  const isCancelled = (s: string) => ['CANCELLED', 'NO_SHOW', 'cancelled', 'no_show'].includes(s);

  // Calculate counts for each tab
  const counts = {
    upcoming: appointments.filter(a => isUpcoming(a.status)).length,
    completed: appointments.filter(a => isCompleted(a.status)).length,
    cancelled: appointments.filter(a => isCancelled(a.status)).length,
    all: appointments.length,
  };

  // Filter appointments
  const filteredAppointments = appointments.filter(apt => {
    let matchesTab = true;
    if (activeTab === 'upcoming') matchesTab = isUpcoming(apt.status);
    else if (activeTab === 'completed') matchesTab = isCompleted(apt.status);
    else if (activeTab === 'cancelled') matchesTab = isCancelled(apt.status);

    const matchesSearch = apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          apt.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          apt.hospitalOrClinic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-5 pt-4 sm:pt-6 pb-16 px-3 sm:px-6 font-sans">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-7 h-7 text-[#5B21B6]" />
            My Appointments
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Track your doctor appointments, join live video consultations, and review prescriptions.
          </p>
        </div>
        <button
          onClick={() => navigate(ROUTES.PATIENT.FINDDOCTOR)}
          className="px-4 py-2.5 bg-[#5B21B6] hover:bg-[#4c1d95] text-white font-bold text-xs rounded-xl shadow-md transition-all self-start sm:self-auto"
        >
          Book New Doctor
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
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
              className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center gap-1.5 ${
                activeTab === tab.id 
                  ? 'bg-[#5B21B6] text-white border-[#5B21B6] shadow-sm' 
                  : 'bg-white text-slate-700 border-slate-200 hover:border-[#5B21B6]/40 hover:text-[#5B21B6]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-md text-[11px] font-extrabold ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search doctor or clinic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all shadow-inner"
          />
        </div>
      </div>

      {/* --- APPOINTMENTS LIST --- */}
      <div className="space-y-3.5">
        {isLoading ? (
          <div className="py-20 text-center text-slate-400 font-medium space-y-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent mx-auto" />
            <p className="text-xs">Loading appointments...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-white border border-slate-200/80 border-dashed rounded-2xl p-12 text-center shadow-sm flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3 border border-slate-100">
              <CalendarDays className="w-7 h-7 text-slate-300" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">No appointments found</h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5 max-w-xs">You don't have any appointments matching this category.</p>
          </div>
        ) : (
          filteredAppointments.map(apt => {
            const upcoming = isUpcoming(apt.status);
            const completed = isCompleted(apt.status);
            const cancelled = isCancelled(apt.status);

            return (
              <div 
                key={apt.id}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-violet-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
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
                      <h3 className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-violet-700 transition-colors">
                        {apt.doctorName}
                      </h3>
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-lg border ${
                        upcoming ? 'bg-amber-50 border-amber-200 text-amber-700' :
                        completed ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
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
                  <div className="flex items-center gap-2 flex-wrap">
                    {upcoming && (
                      <>
                        {apt.type === 'video' && (
                          <button 
                            onClick={() => navigate(`/video-call/${apt.id}`)}
                            className="px-3.5 py-2 bg-[#5B21B6] hover:bg-[#4c1d95] text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                          >
                            <Video className="w-3.5 h-3.5" /> Join Video Call
                          </button>
                        )}
                        <button 
                          onClick={() => handleCancelClick(apt.id)}
                          className="px-2.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl font-bold text-xs transition-colors"
                          title="Cancel appointment"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {completed && (
                      <button 
                        onClick={() => navigate('/patient/Prescriptions')}
                        className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs transition-colors shadow-xs"
                      >
                        View Prescription
                      </button>
                    )}

                    {cancelled && (
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
            );
          })
        )}
      </div>

      {/* Cancellation Modal */}
      <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-rose-500" /> Cancel Appointment
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <p className="text-slate-600">
              Are you sure you want to cancel this appointment? Please state a reason:
            </p>
            <Input
              placeholder="e.g. Schedule conflict / Rescheduling later"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCancelModalOpen(false)} className="rounded-xl">
              Keep Appointment
            </Button>
            <Button onClick={handleConfirmCancel} className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl">
              Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}