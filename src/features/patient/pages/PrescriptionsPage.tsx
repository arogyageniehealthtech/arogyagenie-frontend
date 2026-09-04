<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { 
  FileText, Search, Calendar, Stethoscope, 
  Download, Eye, ArrowLeft, Pill, X, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../lib/axios';
=======
import { useState, useMemo, useRef, useEffect } from 'react';
import { 
  FileText, Search, Calendar, Stethoscope, 
  Download, Eye, Pill, X, Loader2, AlertTriangle, RefreshCcw,
  ChevronDown, Check
} from 'lucide-react';
import prescriptionApi from '../api/presciptionApi';
import { type Prescription, type PrescriptionQueryParams } from '../api/presciptionApi';
>>>>>>> 75418c99e0f6181755f1deb96944f01de879ca23

function parseDate(dateStr: string): number {
  const parsed = Date.parse(dateStr);
  return Number.isNaN(parsed) ? 0 : parsed;
}

<<<<<<< HEAD
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

// ==========================================
// Mock Prescriptions Data Fallback
// ==========================================
const MOCK_PRESCRIPTIONS: Prescription[] = [
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

export default function PrescriptionsPage() {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(MOCK_PRESCRIPTIONS);
  const [loading, setLoading] = useState(false);
=======
type SortOrder = 'newest' | 'oldest';

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
>>>>>>> 75418c99e0f6181755f1deb96944f01de879ca23
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

<<<<<<< HEAD
  useEffect(() => {
    let mounted = true;
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/prescriptions/me');
        const rawItems = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data?.data?.items)
          ? res.data.data.items
          : Array.isArray(res.data)
          ? res.data
          : [];

        if (rawItems.length > 0 && mounted) {
          const mapped: Prescription[] = rawItems.map((item: any) => ({
            id: item.id || `RX-${Math.floor(10000 + Math.random() * 90000)}`,
            doctorName: item.doctor?.user?.fullName || item.doctorName || 'Dr. Medical Practitioner',
            specialization: item.doctor?.specialization?.name || item.specialization || 'General Physician',
            hospitalName: item.facility?.name || item.hospitalName || 'Healthcare Center',
            date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
            diagnosis: item.diagnosis || item.consultation?.symptoms || 'General Consultation',
            medicines: Array.isArray(item.medications) 
              ? item.medications.map((m: any) => ({
                  name: m.medicineName || m.name || 'Prescribed Medicine',
                  dosage: m.dosage || 'As directed',
                  frequency: m.frequency || 'Once daily',
                  duration: m.duration || '5 Days'
                }))
              : (Array.isArray(item.medicines) ? item.medicines : []),
            notes: item.notes || item.instructions || '',
            prescriptionUrl: item.fileUrl || item.prescriptionUrl
          }));
          setPrescriptions(mapped);
        }
      } catch {
        // Fall back to default mock prescriptions
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchPrescriptions();
    return () => { mounted = false; };
  }, []);

  // Filter prescriptions based on search query
  const filteredPrescriptions = prescriptions.filter(rx => 
    rx.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rx.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rx.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rx.hospitalName.toLowerCase().includes(searchQuery.toLowerCase())
  );
=======
  const fetchPrescriptions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: PrescriptionQueryParams = { page: 1, limit: 50 };
      const response = await prescriptionApi.getPrescriptions(params);
      setPrescriptions(Array.isArray(response?.data) ? response.data : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchPrescriptions(); }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setIsSortOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredPrescriptions = useMemo(() => {
    return prescriptions
      .filter(rx => 
        rx.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rx.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rx.hospitalName.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        const diff = parseDate(a.date) - parseDate(b.date);
        return sortOrder === 'newest' ? -diff : diff;
      });
  }, [prescriptions, searchQuery, sortOrder]);

  const handleDownloadPdf = async (id: string) => {
    try {
      const blob = await prescriptionApi.downloadPrescriptionPdf(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prescription_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to download prescription PDF.');
    }
  };
>>>>>>> 75418c99e0f6181755f1deb96944f01de879ca23

  return (
    <div className="w-full max-w-5xl mx-auto space-y-2.5 pb-12 px-2 sm:px-4 pt-2 sm:pt-4 font-sans">
      
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-white p-2 sm:p-2.5 rounded-xl border border-slate-200/80 shadow-xs relative z-10">
        <div className="relative w-full sm:w-64 shrink-0 order-1 sm:order-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search doctor, diagnosis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isLoading || !!error}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all disabled:opacity-60 shadow-inner"
          />
        </div>

        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 shrink-0 order-2 sm:order-2" ref={sortRef}>
          <span className="text-[11px] font-semibold text-slate-500">Sort by:</span>
          <div className="relative flex-1 sm:flex-initial">
            <button
              onClick={() => !isLoading && !error && setIsSortOpen(!isSortOpen)}
              disabled={isLoading || !!error}
              className={`flex items-center justify-between gap-2 bg-slate-50 hover:bg-slate-100 border transition-all rounded-lg px-2.5 py-1.5 text-xs font-bold w-full sm:w-[125px] disabled:opacity-60 ${
                isSortOpen ? 'border-indigo-600 ring-2 ring-indigo-600/20 text-indigo-600' : 'border-slate-200 text-slate-700'
              }`}
            >
              {sortOrder === 'newest' ? 'Date: Newest' : 'Date: Oldest'}
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isSortOpen ? 'rotate-180 text-indigo-600' : ''}`} />
            </button>

            {isSortOpen && (
              <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-1 w-full sm:w-36 bg-white border border-slate-200 rounded-xl shadow-lg z-20">
                <div className="p-1 space-y-0.5">
                  <button onClick={() => { setSortOrder('newest'); setIsSortOpen(false); }} className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-bold rounded-lg ${sortOrder === 'newest' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                    Date: Newest {sortOrder === 'newest' && <Check className="w-3 h-3" />}
                  </button>
                  <button onClick={() => { setSortOrder('oldest'); setIsSortOpen(false); }} className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-bold rounded-lg ${sortOrder === 'oldest' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                    Date: Oldest {sortOrder === 'oldest' && <Check className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative z-0">
        {isLoading ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center shadow-xs flex flex-col items-center justify-center min-h-[240px]">
            <Loader2 className="w-7 h-7 text-indigo-600 animate-spin mb-2.5" />
            <h3 className="font-extrabold text-sm text-slate-900">Fetching Prescriptions</h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Please wait while we load your records...</p>
          </div>
        ) : error ? (
          <div className="bg-white border border-rose-100 rounded-2xl p-6 text-center shadow-xs flex flex-col items-center min-h-[240px] justify-center">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center mb-3 border border-rose-100"><AlertTriangle className="w-6 h-6" /></div>
            <h3 className="font-extrabold text-sm text-slate-900">Failed to Load</h3>
            <p className="text-xs font-medium text-slate-500 mt-1 max-w-sm">{error}</p>
            <button onClick={fetchPrescriptions} className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs"><RefreshCcw className="w-3.5 h-3.5" /> Try Again</button>
          </div>
        ) : filteredPrescriptions.length === 0 ? (
          <div className="bg-white border border-slate-200/80 border-dashed rounded-2xl p-8 text-center shadow-xs flex flex-col items-center min-h-[240px] justify-center">
            <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mb-3 border border-slate-100"><FileText className="w-6 h-6" /></div>
            <h3 className="font-extrabold text-sm text-slate-900">No Prescriptions Found</h3>
            <p className="text-xs font-medium text-slate-500 mt-1">{searchQuery ? `No matches for "${searchQuery}".` : "No prescriptions issued yet."}</p>
            {searchQuery && <button onClick={() => setSearchQuery('')} className="mt-3 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-bold text-xs">Clear Search</button>}
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredPrescriptions.map(rx => (
              <div key={rx.id} className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center border border-indigo-100 shrink-0"><Stethoscope className="w-4 h-4" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">{rx.doctorName}</h3>
                      <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded uppercase">{rx.diagnosis}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 mt-0.5 flex-wrap">
                      <span className="text-indigo-600 font-bold">{rx.specialization}</span><span>•</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-slate-400" /> {rx.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 mt-1">
                      <Pill className="w-3 h-3 text-indigo-500 shrink-0" />
                      <span>{rx.medicines?.length || 0} Medicines</span><span>•</span>
                      <span className="truncate text-slate-400">{rx.medicines?.map(m => m.name).join(', ')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-slate-100 pt-2.5 sm:pt-0">
                  <button onClick={() => setSelectedPrescription(rx)} className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs"><Eye className="w-3.5 h-3.5" /> View</button>
                  <button onClick={() => handleDownloadPdf(rx.id)} className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs"><Download className="w-3.5 h-3.5" /> PDF</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-2 sm:p-3">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Prescription Details</h3>
                <p className="text-[10px] uppercase font-bold text-slate-400">{selectedPrescription.id}</p>
              </div>
              <button onClick={() => setSelectedPrescription(null)} className="p-1.5 bg-white hover:bg-slate-100 text-slate-400 rounded-full border border-slate-200"><X className="w-4 h-4" /></button>
            </div>

            <div className="p-3.5 sm:p-4 overflow-y-auto space-y-3">
              <div className="flex items-center gap-3 bg-indigo-50/60 border border-indigo-100 p-3 rounded-xl">
                <div className="w-9 h-9 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-black text-xs">Rx</div>
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900">{selectedPrescription.doctorName}</h4>
                  <p className="text-[11px] text-indigo-700 font-bold">{selectedPrescription.specialization}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs">
                <div><span className="text-[10px] uppercase font-bold text-slate-400 block">Date</span><span className="font-bold text-slate-900">{selectedPrescription.date}</span></div>
                <div><span className="text-[10px] uppercase font-bold text-slate-400 block">Diagnosis</span><span className="font-bold text-slate-900 truncate block">{selectedPrescription.diagnosis}</span></div>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 text-xs mb-1.5 flex items-center gap-1.5"><Pill className="w-3.5 h-3.5 text-indigo-500" /> Prescribed Medicines</h5>
                <div className="border border-slate-200/80 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {selectedPrescription.medicines?.map((m, i) => (
                        <tr key={i} className="bg-white">
                          <td className="p-2.5"><span className="font-bold text-slate-900 block">{m.name}</span><span className="text-[10px] text-slate-500">{m.frequency}</span></td>
                          <td className="p-2.5 text-right"><span className="font-semibold text-slate-700 block">{m.dosage}</span><span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md">{m.duration}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedPrescription.notes && (
                <div className="bg-amber-50/60 border border-amber-200/60 p-3 rounded-xl">
                  <span className="text-[10px] font-extrabold text-amber-700 uppercase block mb-0.5">Doctor's Note</span>
                  <p className="text-xs font-medium text-slate-700">{selectedPrescription.notes}</p>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50/70 flex gap-2">
              <button onClick={() => setSelectedPrescription(null)} className="flex-1 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg font-bold border border-slate-200 text-xs">Close</button>
              <button onClick={() => handleDownloadPdf(selectedPrescription.id)} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1"><Download className="w-3.5 h-3.5" /> Full PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}