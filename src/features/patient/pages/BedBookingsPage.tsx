// import { useState, useEffect } from 'react';
// import { 
//   Calendar, Clock, Building2, Search, CalendarDays, 
//   AlertCircle, Bed, MapPin,
//   User
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { ROUTES } from '../../../constants/routes.constants';
// import { useToast } from '@/hooks/use-toast';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import hospitalApi from '../api/hospitalApi';

// type TabStatus = 'upcoming' | 'completed' | 'cancelled' | 'all';

// interface BedBookingRecord {
//   id: string;
//   facilityId: string;
//   hospitalName: string;
//   bedType: string;
//   admissionType: string;
//   date: string;
//   time: string;
//   status: string;
//   patientName: string;
//   rate: number;
//   imageUrl: string;
//   raw?: any;
// }

// export default function BedBookingsPage() {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [activeTab, setActiveTab] = useState<TabStatus>('upcoming');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [bookings, setBookings] = useState<BedBookingRecord[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const [cancelModalOpen, setCancelModalOpen] = useState(false);
//   const [targetCancelId, setTargetCancelId] = useState<string | null>(null);
//   const [cancelReason, setCancelReason] = useState('');

//   const fetchBookings = async () => {
//     try {
//       setIsLoading(true);
//       const rawBookings = await hospitalApi.getBookedBeds();
      
//       const formatted: BedBookingRecord[] = (rawBookings || []).map((b: any) => {
//         const start = new Date(b.scheduledStart);
//         const dateStr = !isNaN(start.getTime()) 
//           ? start.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) 
//           : (b.date || 'Immediate');
//         const timeStr = !isNaN(start.getTime()) 
//           ? start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
//           : (b.time || 'Immediate');

//         return {
//           id: b.id,
//           facilityId: b.facilityId,
//           hospitalName: b.hospitalName || 'Apollo Multispeciality Hospital',
//           bedType: b.bedType ? b.bedType.replace(/_/g, ' ') : 'General Ward',
//           admissionType: b.admissionType || 'PLANNED',
//           date: dateStr,
//           time: timeStr,
//           status: b.status || 'CONFIRMED',
//           patientName: b.patientDetails?.name || 'Patient',
//           rate: b.rate || 1500,
//           imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=150&h=150',
//           raw: b,
//         };
//       });

//       setBookings(formatted);
//     } catch (err) {
//       console.warn('Could not load bed bookings from storage:', err);
//       setBookings([
//         {
//           id: 'adm_sample_1',
//           facilityId: 'fac-1',
//           hospitalName: 'Apollo Multispeciality Hospital',
//           bedType: 'GENERAL WARD',
//           admissionType: 'PLANNED',
//           date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
//           time: '10:00 AM',
//           status: 'CONFIRMED',
//           patientName: 'Justin Mason',
//           rate: 1500,
//           imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=150&h=150',
//         },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   const handleCancelClick = (id: string) => {
//     setTargetCancelId(id);
//     setCancelReason('');
//     setCancelModalOpen(true);
//   };

//   const handleConfirmCancel = async () => {
//     if (!targetCancelId) return;
//     try {
//       const stored = JSON.parse(localStorage.getItem('mock_bed_bookings') || '[]');
//       const updated = stored.map((item: any) => 
//         item.id === targetCancelId ? { ...item, status: 'CANCELLED', cancelReason } : item
//       );
//       localStorage.setItem('mock_bed_bookings', JSON.stringify(updated));

//       toast({
//         title: 'Bed Reservation Cancelled',
//         description: 'Your bed admission has been cancelled successfully.',
//       });
//       setCancelModalOpen(false);
//       fetchBookings();
//     } catch (err: any) {
//       toast({
//         title: 'Cancel Failed',
//         description: 'Failed to cancel bed reservation',
//         variant: 'destructive',
//       });
//     }
//   };

//   const isUpcoming = (s: string) => ['CONFIRMED', 'SCHEDULED', 'upcoming', 'pending'].includes(s);
//   const isCompleted = (s: string) => ['COMPLETED', 'DISCHARGED', 'completed'].includes(s);
//   const isCancelled = (s: string) => ['CANCELLED', 'cancelled'].includes(s);

//   const counts = {
//     upcoming: bookings.filter(b => isUpcoming(b.status)).length,
//     completed: bookings.filter(b => isCompleted(b.status)).length,
//     cancelled: bookings.filter(b => isCancelled(b.status)).length,
//     all: bookings.length,
//   };

//   const filteredBookings = bookings.filter(b => {
//     let matchesTab = true;
//     if (activeTab === 'upcoming') matchesTab = isUpcoming(b.status);
//     else if (activeTab === 'completed') matchesTab = isCompleted(b.status);
//     else if (activeTab === 'cancelled') matchesTab = isCancelled(b.status);

//     const matchesSearch = b.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                           b.bedType.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                           b.patientName.toLowerCase().includes(searchQuery.toLowerCase());
//     return matchesTab && matchesSearch;
//   });

//   return (
//     <div className="max-w-5xl mx-auto space-y-5 pt-4 sm:pt-6 pb-16 px-3 sm:px-6 font-sans">
      
//       {/* Header Tabs & Search Bar */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
//         <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
//           {[
//             { id: 'upcoming', label: 'Upcoming', count: counts.upcoming },
//             { id: 'completed', label: 'Completed', count: counts.completed },
//             { id: 'cancelled', label: 'Cancelled', count: counts.cancelled },
//             { id: 'all', label: 'All History', count: counts.all },
//           ].map(tab => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id as any)}
//               disabled={isLoading}
//               className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed ${
//                 activeTab === tab.id 
//                   ? 'bg-[#5B21B6] text-white border-[#5B21B6] shadow-sm' 
//                   : 'bg-white text-slate-700 border-slate-200 hover:border-[#5B21B6]/40 hover:text-[#5B21B6]'
//               }`}
//             >
//               <span>{tab.label}</span>
//               <span className={`px-1.5 py-0.5 rounded-md text-[11px] font-extrabold ${
//                 activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
//               }`}>
//                 {tab.count}
//               </span>
//             </button>
//           ))}
//         </div>

//         <div className="relative w-full sm:w-64 shrink-0">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//           <input 
//             type="text"
//             placeholder="Search hospital or bed type..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all shadow-inner"
//           />
//         </div>
//       </div>

//       {/* Bookings List */}
//       <div className="space-y-3.5">
//         {isLoading ? (
//           <div className="py-20 text-center text-slate-400 font-medium space-y-2">
//             <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent mx-auto" />
//             <p className="text-xs">Loading bed reservations...</p>
//           </div>
//         ) : filteredBookings.length === 0 ? (
//           <div className="bg-white border border-slate-200/80 border-dashed rounded-2xl p-12 text-center shadow-sm flex flex-col items-center">
//             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3 border border-slate-100">
//               <CalendarDays className="w-7 h-7 text-slate-300" />
//             </div>
//             <h3 className="font-bold text-slate-900 text-sm">No bed bookings found</h3>
//             <p className="text-xs font-medium text-slate-500 mt-0.5 max-w-xs">You don't have any bed admissions matching this category or search.</p>
//           </div>
//         ) : (
//           filteredBookings.map(booking => {
//             const upcoming = isUpcoming(booking.status);
//             const completed = isCompleted(booking.status);
//             const cancelled = isCancelled(booking.status);

//             return (
//               <div 
//                 key={booking.id}
//                 className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-violet-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
//               >
//                 <div className="flex items-start gap-3.5">
//                   <img 
//                     src={booking.imageUrl} 
//                     alt={booking.hospitalName} 
//                     className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover bg-slate-100 border border-slate-200 shrink-0 shadow-sm" 
//                   />
//                   <div className="space-y-1">
//                     <div className="flex items-center gap-2 flex-wrap">
//                       <h3 className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-violet-700 transition-colors">
//                         {booking.hospitalName}
//                       </h3>
//                       <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-lg border ${
//                         upcoming ? 'bg-amber-50 border-amber-200 text-amber-700' :
//                         completed ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
//                         'bg-rose-50 border-rose-200 text-rose-700'
//                       }`}>
//                         {booking.status}
//                       </span>
//                     </div>
//                     <p className="text-xs font-bold text-[#5B21B6] uppercase tracking-wide flex items-center gap-1">
//                       <Bed className="w-3.5 h-3.5" /> {booking.bedType} ({booking.admissionType})
//                     </p>
//                     <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5 pt-0.5 truncate">
//                       <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
//                       <span className="truncate">Patient: {booking.patientName}</span>
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
//                   <div className="bg-slate-50 border border-slate-200/70 px-3.5 py-2 rounded-xl flex flex-col justify-center shrink-0">
//                     <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
//                       <Calendar className="w-3.5 h-3.5 text-[#5B21B6]" /> {booking.date}
//                     </span>
//                     <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 mt-0.5">
//                       <Clock className="w-3.5 h-3.5 text-slate-400" /> {booking.time}
//                     </span>
//                   </div>

//                   <div className="flex items-center gap-2 flex-wrap">
//                     {upcoming && (
//                       <>
//                         <button 
//                           onClick={() => navigate('/patient/hospitals')}
//                           className="px-3.5 py-2 bg-[#5B21B6] hover:bg-[#4c1d95] text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
//                         >
//                           <Building2 className="w-3.5 h-3.5" /> Hospital Info
//                         </button>
//                         <button 
//                           onClick={() => handleCancelClick(booking.id)}
//                           className="px-2.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl font-bold text-xs transition-colors"
//                           title="Cancel bed booking"
//                         >
//                           Cancel
//                         </button>
//                       </>
//                     )}

//                     {completed && (
//                       <button 
//                         onClick={() => navigate('/patient/medical-history')}
//                         className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs transition-colors shadow-xs"
//                       >
//                         Discharge Summary
//                       </button>
//                     )}

//                     {cancelled && (
//                       <button 
//                         onClick={() => navigate('/patient/hospitals')}
//                         className="px-3.5 py-2 bg-[#5B21B6]/10 hover:bg-[#5B21B6]/20 text-[#5B21B6] rounded-xl font-bold text-xs transition-colors"
//                       >
//                         Book Again
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>

//       {/* Cancel Confirmation Modal */}
//       <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
//         <DialogContent className="sm:max-w-md rounded-3xl">
//           <DialogHeader>
//             <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
//               <AlertCircle className="h-5 w-5 text-rose-500" /> Cancel Bed Reservation
//             </DialogTitle>
//           </DialogHeader>
//           <div className="space-y-3 py-2 text-xs">
//             <p className="text-slate-600">
//               Are you sure you want to cancel this bed booking? Please state a reason:
//             </p>
//             <Input
//               placeholder="e.g. Admitted elsewhere / Condition improved"
//               value={cancelReason}
//               onChange={(e) => setCancelReason(e.target.value)}
//               className="rounded-xl"
//             />
//           </div>
//           <DialogFooter className="gap-2">
//             <Button variant="outline" onClick={() => setCancelModalOpen(false)} className="rounded-xl">
//               Keep Booking
//             </Button>
//             <Button onClick={handleConfirmCancel} className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl">
//               Cancel Booking
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }









// src/pages/patient/BedBookingsPage.tsx
import { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Building2, Search, CalendarDays, 
  AlertCircle, Bed, User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes.constants';
import { useToast } from '@/features/patient/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import hospitalApi from '../api/hospitalApi';

type TabStatus = 'upcoming' | 'completed' | 'cancelled' | 'all';

interface PatientBedBooking {
  id: string;
  facilityId: string;
  hospitalName: string;
  bedType: string;
  admissionType: string;
  date: string;
  time: string;
  status: string;
  patientName: string;
  rate: number;
  imageUrl: string;
  raw?: any;
}

export default function BedBookingsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabStatus>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState<PatientBedBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [targetCancelId, setTargetCancelId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const fetchBedBookings = async () => {
    try {
      setIsLoading(true);
      const rawBookings = await hospitalApi.getBookedBeds();
      
      const formatted: PatientBedBooking[] = (rawBookings || []).map((b: any) => {
        const start = new Date(b.scheduledStart);
        const dateStr = !isNaN(start.getTime()) 
          ? start.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) 
          : (b.date || 'Immediate');
        const timeStr = !isNaN(start.getTime()) 
          ? start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
          : (b.time || 'Immediate');

        return {
          id: b.id,
          facilityId: b.facilityId,
          hospitalName: b.hospitalName || 'Apollo Multispeciality Hospital',
          bedType: b.bedType ? b.bedType.replace(/_/g, ' ') : 'General Ward',
          admissionType: b.admissionType || 'PLANNED',
          date: dateStr,
          time: timeStr,
          status: b.status || 'CONFIRMED',
          patientName: b.patientDetails?.name || 'Patient',
          rate: b.rate || 1500,
          imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=150&h=150',
          raw: b,
        };
      });

      setBookings(formatted);
    } catch (err) {
      console.warn('Could not load bed bookings from storage:', err);
      setBookings([
        {
          id: 'adm_sample_1',
          facilityId: 'fac-1',
          hospitalName: 'Apollo Multispeciality Hospital',
          bedType: 'GENERAL WARD',
          admissionType: 'PLANNED',
          date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
          time: '10:00 AM',
          status: 'CONFIRMED',
          patientName: 'Justin Mason',
          rate: 1500,
          imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=150&h=150',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBedBookings();
  }, []);

  const handleCancelClick = (id: string) => {
    setTargetCancelId(id);
    setCancelReason('');
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!targetCancelId) return;
    try {
      const stored = JSON.parse(localStorage.getItem('mock_bed_bookings') || '[]');
      const updated = stored.map((item: any) => 
        item.id === targetCancelId ? { ...item, status: 'CANCELLED', cancelReason } : item
      );
      localStorage.setItem('mock_bed_bookings', JSON.stringify(updated));

      toast({
        title: 'Bed Reservation Cancelled',
        description: 'Your bed admission has been cancelled successfully.',
      });
      setCancelModalOpen(false);
      fetchBedBookings();
    } catch (err: any) {
      toast({
        title: 'Cancel Failed',
        description: 'Failed to cancel bed reservation',
        variant: 'destructive',
      });
    }
  };

  const isUpcoming = (s: string) => ['CONFIRMED', 'SCHEDULED', 'upcoming', 'pending', 'confirmed'].includes(s);
  const isCompleted = (s: string) => ['COMPLETED', 'DISCHARGED', 'completed', 'discharged'].includes(s);
  const isCancelled = (s: string) => ['CANCELLED', 'cancelled'].includes(s);

  const counts = {
    upcoming: bookings.filter(b => isUpcoming(b.status)).length,
    completed: bookings.filter(b => isCompleted(b.status)).length,
    cancelled: bookings.filter(b => isCancelled(b.status)).length,
    all: bookings.length,
  };

  const filteredBookings = bookings.filter(b => {
    let matchesTab = true;
    if (activeTab === 'upcoming') matchesTab = isUpcoming(b.status);
    else if (activeTab === 'completed') matchesTab = isCompleted(b.status);
    else if (activeTab === 'cancelled') matchesTab = isCancelled(b.status);

    const matchesSearch = b.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.bedType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.patientName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-5 pt-4 sm:pt-6 pb-16 px-3 sm:px-6 font-sans">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
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
              disabled={isLoading}
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

        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search hospital or bed type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all shadow-inner"
          />
        </div>
      </div>

      <div className="space-y-3.5">
        {isLoading ? (
          <div className="py-20 text-center text-slate-400 font-medium space-y-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent mx-auto" />
            <p className="text-xs">Loading bed reservations...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white border border-slate-200/80 border-dashed rounded-2xl p-12 text-center shadow-sm flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3 border border-slate-100">
              <CalendarDays className="w-7 h-7 text-slate-300" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">No bed bookings found</h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5 max-w-xs">You don't have any bed admissions matching this category or search.</p>
          </div>
        ) : (
          filteredBookings.map(booking => {
            const upcoming = isUpcoming(booking.status);
            const completed = isCompleted(booking.status);
            const cancelled = isCancelled(booking.status);

            return (
              <div 
                key={booking.id}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-violet-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-3.5">
                  <img 
                    src={booking.imageUrl} 
                    alt={booking.hospitalName} 
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover bg-slate-100 border border-slate-200 shrink-0 shadow-sm" 
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-violet-700 transition-colors">
                        {booking.hospitalName}
                      </h3>
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-lg border ${
                        upcoming ? 'bg-amber-50 border-amber-200 text-amber-700' :
                        completed ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                        'bg-rose-50 border-rose-200 text-rose-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#5B21B6] uppercase tracking-wide flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5" /> {booking.bedType} ({booking.admissionType})
                    </p>
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5 pt-0.5 truncate">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">Patient: {booking.patientName}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="bg-slate-50 border border-slate-200/70 px-3.5 py-2 rounded-xl flex flex-col justify-center shrink-0">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#5B21B6]" /> {booking.date}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {booking.time}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {upcoming && (
                      <>
                        <button 
                          onClick={() => navigate('/patient/hospitals')}
                          className="px-3.5 py-2 bg-[#5B21B6] hover:bg-[#4c1d95] text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                        >
                          <Building2 className="w-3.5 h-3.5" /> Hospital Info
                        </button>
                        <button 
                          onClick={() => handleCancelClick(booking.id)}
                          className="px-2.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl font-bold text-xs transition-colors"
                          title="Cancel bed booking"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {completed && (
                      <button 
                        onClick={() => navigate('/patient/medical-history')}
                        className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs transition-colors shadow-xs"
                      >
                        Discharge Summary
                      </button>
                    )}

                    {cancelled && (
                      <button 
                        onClick={() => navigate('/patient/hospitals')}
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

      <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-rose-500" /> Cancel Bed Reservation
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <p className="text-slate-600">
              Are you sure you want to cancel this bed booking? Please state a reason:
            </p>
            <Input
              placeholder="e.g. Admitted elsewhere / Condition improved"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCancelModalOpen(false)} className="rounded-xl">
              Keep Booking
            </Button>
            <Button onClick={handleConfirmCancel} className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl">
              Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}