import { useState, useMemo, useRef, useEffect } from 'react';
import { 
  FileText, Search, Calendar, Stethoscope, 
  Download, Eye, Pill, X, Loader2, AlertTriangle, RefreshCcw,
  ChevronDown, Check
} from 'lucide-react';

// ==========================================
// Types
// ==========================================
interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface Prescription {
  id: string;
  doctorName: string;
  specialization: string;
  hospitalName: string;
  date: string;
  diagnosis: string;
  medicines: Medication[];
  notes?: string;
  prescriptionUrl?: string;
}

type SortOrder = 'newest' | 'oldest';

// ==========================================
// Utility Functions
// ==========================================
function parseDate(dateStr: string): number {
  const parsed = Date.parse(dateStr);
  return Number.isNaN(parsed) ? 0 : parsed;
}

// ==========================================
// Main Component
// ==========================================
export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const fetchPrescriptions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      const response = { ok: true, json: async () => MOCK_API_RESPONSE };
      if (!response.ok) throw new Error('Failed to fetch prescriptions.');
      setPrescriptions(await response.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) setIsSortOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredPrescriptions = useMemo(() => {
    let result = prescriptions.filter(rx => 
      rx.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.hospitalName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return result.sort((a, b) => {
      const diff = parseDate(a.date) - parseDate(b.date);
      return sortOrder === 'newest' ? -diff : diff;
    });
  }, [prescriptions, searchQuery, sortOrder]);

  return (
    <div className="max-w-5xl mx-auto space-y-4 pb-16 px-4 sm:px-6 pt-4 sm:pt-6">
      
      {/* --- UNIFIED CONTROL BAR (Sort + Search in a straight line) --- */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200 shadow-sm relative z-10">
        
        {/* Custom Sort Dropdown (Moved to Left) */}
        <div className="w-full lg:w-auto flex items-center justify-between lg:justify-start gap-2 shrink-0" ref={sortRef}>
          <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">Sort by:</span>
          <div className="relative">
            <button
              onClick={() => !isLoading && !error && setIsSortOpen(!isSortOpen)}
              disabled={isLoading || !!error}
              className={`flex items-center justify-between gap-3 bg-slate-50 hover:bg-slate-100 border transition-all rounded-lg pl-3 pr-2 py-1.5 text-[11px] font-bold w-[125px] disabled:opacity-60 disabled:cursor-not-allowed ${
                isSortOpen ? 'border-indigo-600 ring-2 ring-indigo-600/20 text-indigo-600' : 'border-slate-200 text-slate-700'
              }`}
            >
              {sortOrder === 'newest' ? 'Date: Newest' : 'Date: Oldest'}
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isSortOpen ? 'rotate-180 text-indigo-600' : ''}`} />
            </button>

            {isSortOpen && (
              <div className="absolute left-0 top-full mt-2 w-36 bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-200/50 overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-100 origin-top-left">
                <div className="p-1.5 space-y-0.5">
                  <button
                    onClick={() => { setSortOrder('newest'); setIsSortOpen(false); }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 text-[11px] font-bold rounded-lg transition-colors ${
                      sortOrder === 'newest' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Date: Newest
                    {sortOrder === 'newest' && <Check className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => { setSortOrder('oldest'); setIsSortOpen(false); }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 text-[11px] font-bold rounded-lg transition-colors ${
                      sortOrder === 'oldest' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Date: Oldest
                    {sortOrder === 'oldest' && <Check className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-px h-6 bg-slate-200 hidden lg:block shrink-0 mx-1" />

        {/* Search Bar (Moved to Right) */}
        <div className="relative w-full lg:w-64 shrink-0 lg:ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search doctor, diagnosis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isLoading || !!error}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

      </div>

      {/* --- CONTENT AREA (LOADING / ERROR / LIST) --- */}
      <div className="space-y-3 relative z-0">
        
        {isLoading ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-sm flex flex-col items-center justify-center animate-pulse min-h-[250px]">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
            <h3 className="font-bold text-sm text-slate-900">Loading Prescriptions</h3>
            <p className="text-xs font-medium text-slate-500 mt-1">Securely retrieving your medical records...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center shadow-sm flex flex-col items-center min-h-[250px] justify-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-bold text-sm text-red-900">Unable to load prescriptions</h3>
            <p className="text-xs font-medium text-red-700 mt-1 max-w-sm">{error}</p>
            <button onClick={fetchPrescriptions} className="mt-4 flex items-center gap-1.5 px-4 py-2 bg-white text-red-700 hover:bg-red-50 border border-red-200 rounded-lg text-xs font-bold transition-colors shadow-sm">
              <RefreshCcw className="w-3.5 h-3.5" /> Try Again
            </button>
          </div>
        ) : filteredPrescriptions.length === 0 ? (
          <div className="bg-white border border-slate-200/80 border-dashed rounded-2xl p-8 text-center shadow-sm flex flex-col items-center min-h-[250px] justify-center">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3 border border-slate-100">
              <FileText className="w-6 h-6 text-slate-300" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">No prescriptions found</h3>
            <p className="text-xs font-medium text-slate-500 mt-1">Try adjusting your search.</p>
          </div>
        ) : (
          filteredPrescriptions.map(rx => (
            <div key={rx.id} className="bg-white p-3 sm:p-3.5 rounded-xl border border-slate-200/70 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
              
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center border border-indigo-100 shrink-0 transition-transform group-hover:scale-105">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-bold text-sm text-slate-900 truncate">{rx.doctorName}</h3>
                    <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded uppercase tracking-wider">
                      {rx.diagnosis}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 mt-0.5">
                    <span className="text-indigo-600 font-semibold">{rx.specialization}</span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {rx.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mt-1">
                    <Pill className="w-3 h-3 text-slate-400" />
                    <span>{rx.medicines.length} Medicines</span>
                    <span className="text-slate-300 mx-0.5">•</span>
                    <span className="truncate max-w-[120px] sm:max-w-[200px] text-slate-400 font-medium">
                      {rx.medicines.map(m => m.name).join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                <button onClick={() => setSelectedPrescription(rx)} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] transition-colors">
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
                <button onClick={() => alert(`Downloading API endpoint triggered for ${rx.id}...`)} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-[11px] shadow-sm transition-all active:scale-[0.98]">
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* --- VIEW FULL PREVIEW MODAL --- */}
      {selectedPrescription && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-base text-slate-900">Prescription Details</h3>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">{selectedPrescription.id}</p>
              </div>
              <button onClick={() => setSelectedPrescription(null)} className="p-1.5 bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-full border border-slate-200 shadow-sm transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
              <div className="flex items-center gap-3 bg-indigo-50/50 border border-indigo-100 p-3 rounded-xl">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold shadow-sm">Rx</div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{selectedPrescription.doctorName}</h4>
                  <p className="text-[11px] text-indigo-700 font-semibold">{selectedPrescription.specialization}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Date</span>
                  <span className="font-bold text-slate-900">{selectedPrescription.date}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Diagnosis</span>
                  <span className="font-bold text-slate-900 truncate block">{selectedPrescription.diagnosis}</span>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 text-xs mb-2 flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-indigo-500" /> Prescribed Medicines
                </h5>
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {selectedPrescription.medicines.map((m, i) => (
                        <tr key={i} className="bg-white">
                          <td className="p-2 sm:p-3">
                            <span className="font-bold text-slate-800 block">{m.name}</span>
                            <span className="text-[10px] text-slate-500 font-medium">{m.frequency}</span>
                          </td>
                          <td className="p-2 sm:p-3 text-right">
                            <span className="font-semibold text-slate-700 block">{m.dosage}</span>
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{m.duration}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedPrescription.notes && (
                <div className="bg-amber-50/50 border border-amber-100 p-3 rounded-xl">
                  <span className="text-[9px] font-bold text-amber-700 uppercase tracking-wider block mb-1">Doctor's Note</span>
                  <p className="text-xs font-medium text-slate-700">{selectedPrescription.notes}</p>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50 flex gap-2">
              <button onClick={() => setSelectedPrescription(null)} className="flex-1 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg font-bold border border-slate-200 text-xs transition-colors">
                Close
              </button>
              <button onClick={() => alert(`Downloading full prescription API...`)} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-sm text-xs transition-all flex items-center justify-center gap-1.5">
                <Download className="w-3.5 h-3.5" /> Full PDF
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}

// ==========================================
// Fallback Mock Data for API Demo
// ==========================================
const MOCK_API_RESPONSE: Prescription[] = [
  {
    id: 'RX-84920',
    doctorName: 'Dr. Arup Kumar',
    specialization: 'Cardiology',
    hospitalName: 'City Care Multispecialty Hospital',
    date: 'August 18, 2026',
    diagnosis: 'Hypertension & Mild Tachycardia',
    medicines: [
      { name: 'Telmisartan', dosage: '40mg', frequency: 'Once daily (Morning)', duration: '30 Days' },
      { name: 'Metoprolol', dosage: '25mg', frequency: 'Twice daily', duration: '15 Days' },
    ],
    notes: 'Reduce salt intake and monitor blood pressure twice daily.',
  },
  {
    id: 'RX-73619',
    doctorName: 'Dr. Sunita Sen',
    specialization: 'Pediatrics',
    hospitalName: 'LifeSpring Maternity Center',
    date: 'July 12, 2026',
    diagnosis: 'Viral Upper Respiratory Infection',
    medicines: [
      { name: 'Paracetamol Syrup', dosage: '250mg', frequency: 'Every 6 hours as needed', duration: '5 Days' },
      { name: 'Cetirizine Drops', dosage: '5ml', frequency: 'Once at bedtime', duration: '7 Days' },
    ],
    notes: 'Ensure adequate hydration and warm water gargles.',
  },
  {
    id: 'RX-52910',
    doctorName: 'Dr. Rajesh Das',
    specialization: 'Orthopedics',
    hospitalName: 'Apex Ortho Clinic',
    date: 'June 04, 2026',
    diagnosis: 'Lower Back Strain',
    medicines: [
      { name: 'Aceclofenac + Paracetamol', dosage: '100mg/325mg', frequency: 'Twice daily after meals', duration: '5 Days' },
      { name: 'Thiocolchicoside Gel', dosage: 'Topical', frequency: 'Apply gently 3 times a day', duration: '7 Days' },
    ],
    notes: 'Avoid heavy lifting and practice recommended lower back stretches.',
  },
];