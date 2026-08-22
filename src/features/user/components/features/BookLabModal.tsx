import React, { useState } from 'react';
import { 
  X, SearchIcon, AlertTriangle, Home, Building2, TestTube, 
  ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, 
  User, Phone, Droplet, MapPin, Upload, FileText 
} from 'lucide-react';
import CustomSelect from '../common/CustomSelect';
import type { DiagnosticCentre, TestOption, CollectionMethod } from '../../types/diagnostic';

interface BookLabModalProps {
  centre: DiagnosticCentre;
  onClose: () => void;
}

export default function BookLabModal({ centre, onClose }: BookLabModalProps) {
  const [step, setStep] = useState(1);
  
  // Form State
  const [selectedTest, setSelectedTest] = useState<TestOption | null>(null);
  const [testSearchQuery, setTestSearchQuery] = useState("");
  const [collectionMethod, setCollectionMethod] = useState<CollectionMethod | null>(null);
  
  // Calendar State
  const [monthOffset, setMonthOffset] = useState(0); 
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  const [patientInfo, setPatientInfo] = useState({
    name: '', age: '', gender: '', mobile: '', address: '', bloodGroup: '', emergencyContact: ''
  });

  // Derived Values
  const filteredTests = centre.availableTests.filter(t => 
    t.name.toLowerCase().includes(testSearchQuery.toLowerCase())
  );

  const baseDate = new Date(2026, 7 + monthOffset, 1); 
  const viewYear = baseDate.getFullYear();
  const viewMonth = baseDate.getMonth() + 1;
  const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
  let startDay = baseDate.getDay() - 1;
  if (startDay === -1) startDay = 6;
  const monthLabel = baseDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateStr = `${viewYear}-${viewMonth.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const isAvailable = centre.availableDates?.includes(dateStr) || false;
    return { day, dateStr, isAvailable };
  });

  const timeSlots = ["07:00 AM", "08:30 AM", "10:00 AM", "11:30 AM", "01:00 PM", "04:00 PM"];

  const handleAutoFill = () => {
    setPatientInfo({
      name: 'Justin Mason', age: '34', gender: 'Male', mobile: '+91 9876543210', 
      address: 'Khardaha, West Bengal', bloodGroup: 'O+', emergencyContact: '+91 9123456789'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b relative flex justify-center items-center bg-gray-50/80 shrink-0">
          <div className="text-center mt-1">
            <h2 className="font-bold text-2xl text-gray-900 tracking-tight">Book Lab Test</h2>
            <p className="text-sm font-medium text-gray-600 mt-1">{centre.name}</p>
          </div>
          <button 
            onClick={onClose} 
            className="absolute right-5 top-5 p-2 bg-white border border-gray-200 shadow-sm hover:bg-red-50 hover:text-red-500 text-gray-400 rounded-full transition-all focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          
          {/* STEP 1: Test Selection */}
          {step === 1 && (
            <div className="space-y-4 flex flex-col h-full max-h-[60vh]">
              <div>
                <h4 className="font-bold text-gray-900 text-lg">Step 1: Select Test or Package</h4>
                <p className="text-sm text-gray-500 mt-1">Choose the specific diagnostic test required.</p>
              </div>

              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search tests (e.g., Blood, X-Ray)..."
                  value={testSearchQuery}
                  onChange={(e) => setTestSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all text-sm"
                />
              </div>

              <div className="overflow-y-auto pr-2 pb-2 space-y-3 flex-1">
                {filteredTests.length > 0 ? (
                  filteredTests.map(test => (
                    <button
                      key={test.id}
                      onClick={() => {
                        setSelectedTest(test);
                        // Reset collection method if test changes and doesn't support home
                        if (!test.homeCollectionAvailable && collectionMethod === 'home') {
                          setCollectionMethod(null);
                        }
                      }}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${
                        selectedTest?.id === test.id 
                          ? 'border-purple-600 bg-purple-50' 
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-lg ${selectedTest?.id === test.id ? 'bg-purple-200 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                          <TestTube className="w-5 h-5" />
                        </div>
                        <div>
                          <p className={`font-bold ${selectedTest?.id === test.id ? 'text-purple-900' : 'text-gray-900'}`}>{test.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-semibold text-gray-700">₹{test.rate}</span>
                            {!test.homeCollectionAvailable && (
                              <>
                                <span className="text-gray-300">•</span>
                                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">Centre Visit Only</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedTest?.id === test.id ? 'border-purple-600' : 'border-gray-300'}`}>
                        {selectedTest?.id === test.id && <div className="w-2.5 h-2.5 bg-purple-600 rounded-full" />}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500 text-sm">
                    No tests match your search.
                  </div>
                )}
              </div>
              
              <div className="pt-2 shrink-0">
                <button 
                  disabled={!selectedTest}
                  onClick={() => setStep(2)}
                  className="w-full py-3.5 bg-purple-600 text-white rounded-xl font-medium disabled:opacity-50 hover:bg-purple-700 transition-colors shadow-sm"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Collection Method */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h4 className="font-bold text-gray-900 text-lg">Step 2: Sample Collection Method</h4>
                <p className="text-sm text-gray-500 mt-1">How would you like to provide your sample?</p>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => setCollectionMethod('centre')}
                  className={`w-full p-5 rounded-xl border-2 text-left transition-all flex items-start gap-4 ${
                    collectionMethod === 'centre' 
                      ? 'border-purple-600 bg-purple-50 shadow-sm' 
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className={`p-3 rounded-full shrink-0 ${collectionMethod === 'centre' ? 'bg-purple-200 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold text-lg ${collectionMethod === 'centre' ? 'text-purple-900' : 'text-gray-900'}`}>Visit Diagnostic Centre</p>
                    <p className="text-sm text-gray-500 mt-1">Visit the lab personally for the test/scan.</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 shrink-0 ${collectionMethod === 'centre' ? 'border-purple-600' : 'border-gray-300'}`}>
                    {collectionMethod === 'centre' && <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />}
                  </div>
                </button>

                <button
                  disabled={!selectedTest?.homeCollectionAvailable}
                  onClick={() => setCollectionMethod('home')}
                  className={`w-full p-5 rounded-xl border-2 text-left transition-all flex items-start gap-4 ${
                    !selectedTest?.homeCollectionAvailable 
                      ? 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
                      : collectionMethod === 'home' 
                        ? 'border-purple-600 bg-purple-50 shadow-sm' 
                        : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className={`p-3 rounded-full shrink-0 ${collectionMethod === 'home' ? 'bg-purple-200 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                    <Home className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold text-lg ${collectionMethod === 'home' ? 'text-purple-900' : 'text-gray-900'}`}>Home Sample Collection</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {!selectedTest?.homeCollectionAvailable 
                        ? 'Not available for radiological/imaging tests.' 
                        : 'A phlebotomist will visit your address.'}
                    </p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 shrink-0 ${collectionMethod === 'home' ? 'border-purple-600' : 'border-gray-300'}`}>
                    {collectionMethod === 'home' && <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />}
                  </div>
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(1)} className="px-6 py-3.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">Back</button>
                <button 
                  disabled={!collectionMethod}
                  onClick={() => setStep(3)}
                  className="flex-1 py-3.5 bg-purple-600 text-white rounded-xl font-medium disabled:opacity-50 hover:bg-purple-700 transition-colors shadow-sm"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Select Date & Time */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h4 className="font-bold text-gray-900 text-lg">Step 3: Schedule</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Select a date and time slot for your {collectionMethod === 'home' ? 'home visit' : 'lab visit'}.
                </p>
              </div>

              <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h4 className="font-bold text-gray-900 text-lg">{monthLabel}</h4>
                  <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
                    <button onClick={() => { setMonthOffset(m => Math.max(0, m - 1)); setSelectedDate(null); setSelectedTime(null); }} disabled={monthOffset === 0} className="p-1.5 rounded-lg text-gray-600 hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all"><ChevronLeft className="w-5 h-5" /></button>
                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                    <button onClick={() => { setMonthOffset(m => Math.min(2, m + 1)); setSelectedDate(null); setSelectedTime(null); }} disabled={monthOffset === 2} className="p-1.5 rounded-lg text-gray-600 hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all"><ChevronRight className="w-5 h-5" /></button>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center">
                  {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => <div key={d} className="text-xs font-bold text-gray-400 uppercase tracking-wider pb-2">{d}</div>)}
                  {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
                  
                  {calendarDays.map((date) => (
                    <button
                      key={date.dateStr}
                      disabled={!date.isAvailable}
                      onClick={() => { setSelectedDate(date.dateStr); setSelectedTime(null); }}
                      className={`relative w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 ${
                        selectedDate === date.dateStr ? 'bg-purple-600 text-white shadow-lg ring-4 ring-purple-50' 
                        : date.isAvailable ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-500 hover:text-white' 
                        : 'text-gray-300 bg-transparent cursor-not-allowed'
                      }`}
                    >
                      {date.day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots Section */}
              <div className="min-h-[148px] bg-gray-50 rounded-2xl p-5 border border-gray-100 flex flex-col justify-center">
                {selectedDate ? (
                  <div className="animate-in fade-in zoom-in-95 duration-200">
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-600"/> Available Time Slots
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      {timeSlots.map(time => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            selectedTime === time 
                              ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-100 ring-offset-1' 
                              : 'bg-white border border-gray-200 text-gray-700 hover:border-purple-300 hover:text-purple-700'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400 py-6">
                    <CalendarIcon className="w-8 h-8 mb-3 opacity-20" />
                    <p className="text-sm font-medium">Select a date above to view slots</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(2)} className="px-6 py-3.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50">Back</button>
                <button disabled={!selectedDate || !selectedTime} onClick={() => setStep(4)} className="flex-1 py-3.5 bg-purple-600 text-white rounded-xl font-medium disabled:opacity-50 hover:bg-purple-700 shadow-sm">Continue</button>
              </div>
            </div>
          )}

          {/* STEP 4: Patient Details */}
          {step === 4 && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-purple-50/50 p-4 rounded-2xl border border-purple-100/50">
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">Patient Details</h4>
                  <p className="text-sm text-gray-500">Enter details or auto-fill from your profile.</p>
                </div>
                <button 
                  onClick={handleAutoFill} 
                  className="shrink-0 flex items-center justify-center gap-2 text-sm font-bold text-purple-700 bg-white shadow-sm border border-purple-200 px-4 py-2.5 rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-all"
                >
                  <User className="w-4 h-4" /> Auto-fill Info
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={patientInfo.name} onChange={e => setPatientInfo({...patientInfo, name: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-500 hover:border-gray-300 transition-all text-sm font-medium text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none" placeholder="Patient's legal name" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Age *</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="number" value={patientInfo.age} onChange={e => setPatientInfo({...patientInfo, age: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-500 hover:border-gray-300 transition-all text-sm font-medium text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none" placeholder="Years" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Gender *</label>
                  <CustomSelect 
                    value={patientInfo.gender}
                    onChange={(val: string) => setPatientInfo({...patientInfo, gender: val})}
                    options={["Male", "Female", "Other"]}
                    placeholder="Select Gender"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Mobile Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="tel" value={patientInfo.mobile} onChange={e => setPatientInfo({...patientInfo, mobile: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-500 hover:border-gray-300 transition-all text-sm font-medium text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none" placeholder="+91" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Blood Group</label>
                  <CustomSelect 
                    value={patientInfo.bloodGroup}
                    onChange={(val: string) => setPatientInfo({...patientInfo, bloodGroup: val})}
                    options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]}
                    placeholder="Select Type"
                    icon={Droplet}
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm font-semibold text-gray-700">
                    {collectionMethod === 'home' ? 'Home Collection Address *' : 'Residential Address *'}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                    <textarea value={patientInfo.address} onChange={e => setPatientInfo({...patientInfo, address: e.target.value})} rows={2} className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-500 hover:border-gray-300 transition-all text-sm font-medium text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none resize-none" placeholder="Full address" />
                  </div>
                </div>

              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button onClick={() => setStep(3)} className="px-6 py-3.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">Back</button>
                <button 
                  disabled={!patientInfo.name || !patientInfo.age || !patientInfo.mobile || !patientInfo.gender || !patientInfo.address}
                  onClick={() => setStep(5)} 
                  className="flex-1 py-3.5 bg-purple-600 text-white rounded-xl font-medium disabled:opacity-50 hover:bg-purple-700 shadow-sm transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Upload Prescription */}
          {step === 5 && (
            <div className="space-y-6">
              
              <div className="space-y-3">
                <h4 className="font-bold text-gray-900 text-lg">Step 5: Doctor's Prescription</h4>
                <p className="text-sm text-gray-500">Upload a valid prescription. Required for most radiological and specialized tests.</p>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 bg-gray-50 flex flex-col items-center justify-center text-center hover:bg-gray-100 transition-colors cursor-pointer group mt-4">
                  <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="font-bold text-gray-900">Upload Prescription</p>
                  <p className="text-xs text-gray-500 mt-1.5 max-w-[250px]">PDF, JPG, or PNG up to 5MB.</p>
                  <button className="mt-5 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-purple-700 shadow-sm hover:border-purple-300">Choose File</button>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button onClick={() => setStep(4)} className="px-6 py-3.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">Back</button>
                <button 
                  onClick={() => setStep(6)} 
                  className="flex-1 py-3.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 shadow-sm transition-colors"
                >
                  Skip or Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Review & Confirmation */}
          {step === 6 && (
            <div className="space-y-6">
              
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-5">
                <h4 className="font-bold text-gray-900 text-lg border-b border-gray-200 pb-4">Booking Summary</h4>
                
                <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-sm">
                  <div>
                    <p className="text-gray-500 font-medium mb-0.5">Patient</p>
                    <p className="font-bold text-gray-900">{patientInfo.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium mb-0.5">Lab / Diagnostic Centre</p>
                    <p className="font-bold text-gray-900">{centre.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium mb-0.5">Test Selected</p>
                    <p className="font-bold text-gray-900">{selectedTest?.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium mb-0.5">Collection Method</p>
                    <p className="font-bold text-gray-900 capitalize">{collectionMethod === 'home' ? 'Home Sample Collection' : 'Visit Diagnostic Centre'}</p>
                  </div>
                  <div className="col-span-2 p-3 rounded-xl border bg-white border-gray-200 flex justify-between items-center shadow-sm">
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Scheduled For</p>
                      <p className="font-bold text-purple-700">
                        {selectedDate} at {selectedTime}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-2 flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Test Price</span>
                  <span className="text-2xl font-bold text-gray-900">₹{selectedTest?.rate}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(5)} className="px-6 py-3.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50">Back</button>
                <button 
                  onClick={() => {
                    alert("Lab Test Booking Confirmed!");
                    onClose();
                  }}
                  className="flex-1 py-3.5 bg-purple-600 text-white rounded-xl font-bold shadow-md hover:bg-purple-700 focus:ring-4 focus:ring-purple-100 transition-all"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}