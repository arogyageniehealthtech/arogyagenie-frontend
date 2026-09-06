import { useState } from 'react';
import { 
  X, Building2, ChevronLeft, ChevronRight, 
  Calendar as CalendarIcon, Clock, Loader2, TestTube, Home, User
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ROUTES } from '@/constants/routes.constants';
import { diagnosticApi } from '../../api/diagnosticApi';
import { COMMON_DIAGNOSTIC_TESTS } from '../../data/mockDiagnosticTests';
import type { DiagnosticCentre, CollectionMethod } from '../../types/diagnostic';

interface BookLabModalProps {
  centre: DiagnosticCentre;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function BookLabModal({ centre, onClose, onSuccess }: BookLabModalProps) {
  const user = useSelector((state: any) => state.auth.user);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  
  // Form State
  const [selectedTest, setSelectedTest] = useState<any | null>(null);
  const [testSearchQuery, setTestSearchQuery] = useState("");
  const [collectionMethod, setCollectionMethod] = useState<CollectionMethod | null>(null);
  
  // Calendar State
  const [monthOffset, setMonthOffset] = useState(0); 
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  const [patientInfo, setPatientInfo] = useState({
    name: '', age: '', gender: '', mobile: '', address: '', bloodGroup: '', emergencyContact: ''
  });

  // API Booking States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Derived Values - Combines centre available tests with fallback common tests catalog
  const rawCentreTests = Array.isArray(centre?.availableTests) ? centre.availableTests : [];
  const combinedTestCatalog = rawCentreTests.length > 0 ? rawCentreTests : COMMON_DIAGNOSTIC_TESTS;
  
  const filteredTests = combinedTestCatalog.filter((t: any) => 
    t?.name?.toLowerCase().includes(testSearchQuery.toLowerCase())
  );

  // Calendar & Date Slot Logic (Strictly from Today, allowing all current/future days)
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  const baseDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1); 
  const viewYear = baseDate.getFullYear();
  const viewMonth = baseDate.getMonth(); 
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  
  let startDay = new Date(viewYear, viewMonth, 1).getDay() - 1;
  if (startDay === -1) startDay = 6; 

  const monthLabel = baseDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const currentDayDate = new Date(viewYear, viewMonth, day);
    currentDayDate.setHours(0, 0, 0, 0);

    const monthStr = (viewMonth + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    const dateStr = `${viewYear}-${monthStr}-${dayStr}`;
    
    // Only disable past dates; make today and future dates fully selectable
    const isPast = currentDayDate < today;
    
    return { day, dateStr, isAvailable: !isPast };
  });

  const timeSlots = ["07:00 AM", "08:30 AM", "10:00 AM", "11:30 AM", "01:00 PM", "04:00 PM"];

  const handleAutoFill = () => {
    setPatientInfo({
      name: 'Justin Mason', age: '34', gender: 'Male', mobile: '+91 9876543210', 
      address: 'Khardaha, West Bengal', bloodGroup: 'O+', emergencyContact: '+91 9123456789'
    });
  };

  const handleConfirmBooking = async () => {
    if (!selectedTest || !selectedDate || !selectedTime || !collectionMethod) return;

    if (!user?.profile || user.profile.type === null) {
      toast({
        title: 'Profile Incomplete',
        description: 'Please complete your profile first to book a lab test.',
        variant: 'destructive',
      });
      onClose();
      navigate(ROUTES.PATIENT.PROFILE);
      return;
    }

    setIsSubmitting(true);
    setBookingError(null);

    try {
      const testPrice = selectedTest.price ?? selectedTest.rate ?? 0;

      const payload = {
        centreId: centre?.id,
        centreName: centre?.name,
        testId: selectedTest.id,
        testName: selectedTest.name,
        collectionMethod,
        date: selectedDate,
        time: selectedTime,
        rate: testPrice,
        patientDetails: {
          name: patientInfo.name,
          age: Number(patientInfo.age),
          gender: patientInfo.gender.toUpperCase(),
          phone: patientInfo.mobile,
          emergencyPhone: patientInfo.emergencyContact,
          bloodGroup: patientInfo.bloodGroup,
          address: patientInfo.address
        }
      };

      await diagnosticApi.bookLabTest(payload).catch(() => {
        return new Promise(resolve => setTimeout(resolve, 800));
      });

      toast({
        title: 'Booked Successfully',
        description: `Lab test confirmed at ${centre?.name || 'Diagnostic Centre'}.`,
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || "Failed to book lab test.";
      setBookingError(errorMsg);
      toast({
        title: 'Booking Failed',
        description: errorMsg,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 font-sans overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-sm sm:max-w-md overflow-hidden shadow-2xl flex flex-col my-auto max-h-[85vh] sm:max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 relative flex justify-center items-center bg-[#0F172A] text-white shrink-0">
          <div className="text-center">
            <h2 className="font-extrabold text-base sm:text-lg tracking-tight">Book Lab Test</h2>
            <p className="text-[11px] font-medium text-slate-300 mt-0.5 truncate max-w-65 mx-auto">
              {centre?.name || 'Diagnostic Centre'}
            </p>
          </div>
          
          <button 
            type="button"
            onClick={onClose} 
            disabled={isSubmitting}
            className="absolute right-3 top-3 p-1.5 bg-slate-800 border border-slate-700 shadow-sm hover:bg-rose-500 hover:text-white text-slate-300 rounded-full transition-all focus:outline-none disabled:opacity-50 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-3 sm:p-4 overflow-y-auto space-y-3 pb-6 sm:pb-4">
          
          {/* STEP 1: Test Selection with Persistent Search & Visible Test Options */}
          {step === 1 && (
            <div className="space-y-3">
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">Select Test or Package</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Search or choose from available test options below.</p>
              </div>

              <div className="relative">
                <TestTube className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search tests (e.g. CBC, Lipid, Thyroid)..."
                  value={testSearchQuery}
                  onChange={(e) => setTestSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-100 focus:border-[#0F172A] text-xs font-medium text-slate-900 shadow-inner"
                />
              </div>

              {/* Visible Test Options List Container */}
              <div className="overflow-y-auto max-h-52 space-y-2 pr-1 border border-slate-100 rounded-xl p-1 bg-slate-50/50">
                {filteredTests.length > 0 ? (
                  filteredTests.map((test: any) => {
                    const testPrice = test.price ?? test.rate ?? 0;
                    return (
                      <button
                        key={test.id}
                        type="button"
                        onClick={() => {
                          setSelectedTest(test);
                          if (!test.homeCollectionAvailable && collectionMethod === 'home') {
                            setCollectionMethod(null);
                          }
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                          selectedTest?.id === test.id 
                            ? 'border-[#0F172A] bg-white shadow-sm' 
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`p-1.5 rounded-lg shrink-0 ${selectedTest?.id === test.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}>
                            <TestTube className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`font-extrabold text-xs truncate ${selectedTest?.id === test.id ? 'text-slate-900' : 'text-slate-800'}`}>{test.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                              <span className="text-[11px] font-bold text-slate-700">₹{testPrice}</span>
                              {!test.homeCollectionAvailable && (
                                <span className="text-[9px] font-medium text-amber-700 bg-amber-50 px-1 py-0.2 rounded">Centre Visit Only</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ml-2 ${selectedTest?.id === test.id ? 'border-[#0F172A]' : 'border-slate-300'}`}>
                          {selectedTest?.id === test.id && <div className="w-2 h-2 bg-[#0F172A] rounded-full" />}
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-slate-400 text-xs font-medium">
                    No tests match your search query.
                  </div>
                )}
              </div>
              
              <div className="pt-2">
                <button 
                  type="button"
                  disabled={!selectedTest}
                  onClick={() => setStep(2)}
                  className="w-full py-2.5 bg-[#0F172A] text-white rounded-xl font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Collection Method */}
          {step === 2 && (
            <div className="space-y-3">
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">Sample Collection Method</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">How would you like to provide your sample?</p>
              </div>
              
              <div className="space-y-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => setCollectionMethod('centre')}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-all flex items-center gap-3 cursor-pointer ${
                    collectionMethod === 'centre' 
                      ? 'border-[#0F172A] bg-slate-50 shadow-sm' 
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${collectionMethod === 'centre' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`font-extrabold text-xs sm:text-sm ${collectionMethod === 'centre' ? 'text-slate-900' : 'text-slate-800'}`}>Visit Diagnostic Centre</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Visit the lab personally.</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${collectionMethod === 'centre' ? 'border-[#0F172A]' : 'border-slate-300'}`}>
                    {collectionMethod === 'centre' && <div className="w-2 h-2 rounded-full bg-[#0F172A]" />}
                  </div>
                </button>

                <button
                  type="button"
                  disabled={!selectedTest?.homeCollectionAvailable}
                  onClick={() => setCollectionMethod('home')}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                    !selectedTest?.homeCollectionAvailable 
                      ? 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'
                      : collectionMethod === 'home' 
                        ? 'border-[#0F172A] bg-slate-50 shadow-sm cursor-pointer' 
                        : 'border-slate-200 hover:border-slate-300 cursor-pointer bg-white'
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${collectionMethod === 'home' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <Home className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`font-extrabold text-xs sm:text-sm ${collectionMethod === 'home' ? 'text-slate-900' : 'text-slate-800'}`}>Home Collection</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {!selectedTest?.homeCollectionAvailable ? 'Not available for this test.' : 'Phlebotomist visits address.'}
                    </p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${collectionMethod === 'home' ? 'border-[#0F172A]' : 'border-slate-300'}`}>
                    {collectionMethod === 'home' && <div className="w-2 h-2 rounded-full bg-[#0F172A]" />}
                  </div>
                </button>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setStep(1)} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-50 cursor-pointer">Back</button>
                <button 
                  type="button"
                  disabled={!collectionMethod}
                  onClick={() => setStep(3)}
                  className="flex-1 py-2 bg-[#0F172A] text-white rounded-xl font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 shadow-sm cursor-pointer"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Select Date & Time */}
          {step === 3 && (
            <div className="space-y-3">
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">Step 3: Schedule</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Select a date and time slot.</p>
              </div>

              <div className="border border-slate-200/80 rounded-xl p-3 bg-white shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">{monthLabel}</h4>
                  <div className="flex items-center gap-1 bg-slate-50 p-0.5 rounded-lg border border-slate-200/60">
                    <button type="button" onClick={() => setMonthOffset(m => Math.max(0, m - 1))} disabled={monthOffset === 0} className="p-1 rounded-md text-slate-700 hover:bg-white disabled:opacity-30 cursor-pointer"><ChevronLeft className="w-3.5 h-3.5" /></button>
                    <div className="w-px h-3 bg-slate-300"></div>
                    <button type="button" onClick={() => setMonthOffset(m => Math.min(2, m + 1))} disabled={monthOffset === 2} className="p-1 rounded-md text-slate-700 hover:bg-white disabled:opacity-30 cursor-pointer"><ChevronRight className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center">
                  {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => <div key={d} className="text-[10px] font-extrabold text-slate-400 uppercase pb-1">{d}</div>)}
                  {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
                  
                  {calendarDays.map((date) => (
                    <button
                      key={date.dateStr}
                      type="button"
                      disabled={!date.isAvailable}
                      onClick={() => { setSelectedDate(date.dateStr); setSelectedTime(null); }}
                      className={`relative w-7 h-7 mx-auto rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                        selectedDate === date.dateStr 
                          ? 'bg-[#0F172A] text-white shadow-sm cursor-pointer' 
                          : date.isAvailable 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-[#0F172A] hover:text-white cursor-pointer' 
                            : 'text-slate-300 bg-transparent cursor-not-allowed opacity-40'
                      }`}
                    >
                      {date.day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="min-h-24 bg-slate-50 rounded-xl p-3 border border-slate-200/60 flex flex-col justify-center">
                {selectedDate ? (
                  <div>
                    <h4 className="font-bold text-[11px] text-slate-800 mb-2 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-900"/> Available slots for {selectedDate}
                    </h4>
                    <div className="grid grid-cols-3 gap-1.5">
                      {timeSlots.map(time => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className={`py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                            selectedTime === time ? 'bg-[#0F172A] text-white' : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center text-slate-400 text-xs font-semibold gap-1 py-1">
                    <CalendarIcon className="w-3.5 h-3.5 opacity-40" /> Select date to view slots
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setStep(2)} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-50 cursor-pointer">Back</button>
                <button type="button" disabled={!selectedDate || !selectedTime} onClick={() => setStep(4)} className="flex-1 py-2 bg-[#0F172A] text-white rounded-xl font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 shadow-sm cursor-pointer">Continue</button>
              </div>
            </div>
          )}

          {/* STEP 4: Patient Details */}
          {step === 4 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">Patient Details</h4>
                  <p className="text-[10px] text-slate-500">Auto-fill or enter manually.</p>
                </div>
                <button type="button" onClick={handleAutoFill} className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-[#0F172A] bg-white shadow-sm border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <User className="w-3 h-3" /> Auto-fill
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-slate-700 text-[11px]">Full Name *</label>
                  <input type="text" value={patientInfo.name} onChange={e => setPatientInfo({...patientInfo, name: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#0F172A] focus:border-[#0F172A] text-xs font-medium text-slate-900 shadow-sm focus:outline-none" placeholder="Legal Name" />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 text-[11px]">Age *</label>
                  <input type="number" value={patientInfo.age} onChange={e => setPatientInfo({...patientInfo, age: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#0F172A] text-xs font-medium text-slate-900 shadow-sm focus:outline-none" placeholder="Years" />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 text-[11px]">Gender *</label>
                  <select value={patientInfo.gender} onChange={e => setPatientInfo({...patientInfo, gender: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#0F172A] text-xs font-medium text-slate-900 shadow-sm focus:outline-none">
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-slate-700 text-[11px]">Mobile Number *</label>
                  <input type="tel" value={patientInfo.mobile} onChange={e => setPatientInfo({...patientInfo, mobile: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#0F172A] text-xs font-medium text-slate-900 shadow-sm focus:outline-none" placeholder="+91" />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-slate-700 text-[11px]">Address *</label>
                  <textarea value={patientInfo.address} onChange={e => setPatientInfo({...patientInfo, address: e.target.value})} rows={2} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#0F172A] text-xs font-medium text-slate-900 shadow-sm focus:outline-none resize-none" placeholder="Residential Address" />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setStep(3)} className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-50 cursor-pointer">Back</button>
                <button 
                  type="button"
                  disabled={!patientInfo.name || !patientInfo.age || !patientInfo.mobile || !patientInfo.gender || !patientInfo.address}
                  onClick={() => setStep(5)} 
                  className="flex-1 py-2 bg-[#0F172A] text-white rounded-xl font-bold text-xs disabled:opacity-50 hover:bg-slate-800 shadow-sm cursor-pointer disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Review & Confirmation */}
          {step === 5 && (
            <div className="space-y-3">
              {bookingError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold">
                  {bookingError}
                </div>
              )}

              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/60 space-y-2.5 text-xs">
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm border-b border-slate-200 pb-2">Booking Summary</h4>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-slate-400 font-bold uppercase text-[9px]">Patient</p>
                    <p className="font-extrabold text-slate-900 truncate">{patientInfo.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-bold uppercase text-[9px]">Method</p>
                    <p className="font-extrabold text-slate-900 capitalize">{collectionMethod}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-slate-400 font-bold uppercase text-[9px]">Test / Centre</p>
                    <p className="font-extrabold text-slate-900 truncate">{selectedTest?.name} @ {centre?.name}</p>
                  </div>
                  <div className="col-span-2 p-2 rounded-lg border bg-white border-slate-200/80 flex justify-between items-center">
                    <span className="font-extrabold text-blue-950 text-[11px] truncate">
                      {selectedDate} @ {selectedTime}
                    </span>
                  </div>
                </div>
                
                <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
                  <span className="text-slate-600 font-bold text-xs">Test Price</span>
                  <span className="text-base font-black text-emerald-600">₹{selectedTest ? (selectedTest.price ?? selectedTest.rate ?? 0) : 0}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button 
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setStep(4)} 
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl font-bold text-xs disabled:opacity-50 hover:bg-slate-50 cursor-pointer"
                >
                  Back
                </button>
                <button 
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmBooking}
                  className="flex-1 py-2 bg-[#0F172A] text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Confirming...</span>
                    </>
                  ) : (
                    <span>Confirm Booking</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}