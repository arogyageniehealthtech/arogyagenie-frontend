import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Microscope, Search, Calendar, Download,
  Eye, Activity, FileCheck, Clock, AlertTriangle, X,
  FlaskConical, TrendingUp, Printer, ChevronDown, Check, Loader2, RefreshCcw
} from 'lucide-react';

// ==========================================
// Types
// ==========================================
type ReportStatus = 'available' | 'processing';
type SortOrder = 'newest' | 'oldest';
type StatusFilter = 'all' | ReportStatus;

interface TestParameter {
  name: string;
  result: string;
  unit: string;
  normalRange: string;
  isAbnormal: boolean;
}

interface LabReport {
  id: string; 
  testName: string;
  labName: string;
  date: string;
  status: ReportStatus;
  parameters?: TestParameter[];
  summaryNote?: string;
}

// ==========================================
// Utility Functions
// ==========================================
function parseReportDate(dateStr: string): number {
  const parsed = Date.parse(dateStr);
  return Number.isNaN(parsed) ? 0 : parsed;
}

// ==========================================
// Main Component
// ==========================================
export default function LabReportsPage() {
  // --- Data State ---
  const [reports, setReports] = useState<LabReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- UI State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<LabReport | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // ==========================================
  // API Integration
  // ==========================================
  const fetchReports = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // REPLACE THIS URL with your actual API endpoint
      // const response = await fetch('https://api.yourdomain.com/v1/lab-reports');
      
      // --- Simulated API Delay for Demonstration ---
      await new Promise(resolve => setTimeout(resolve, 1200));
      const response = { 
        ok: true, 
        json: async () => MOCK_API_RESPONSE // Using mock data at bottom of file for demo
      };
      // ---------------------------------------------

      if (!response.ok) {
        throw new Error('Failed to fetch lab reports. Please try again later.');
      }

      const data = await response.json();
      setReports(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on initial mount
  useEffect(() => {
    fetchReports();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter & Sort Logic
  const filteredReports = useMemo(() => {
    let result = reports.filter(report =>
      report.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.labName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (statusFilter !== 'all') {
      result = result.filter(r => r.status === statusFilter);
    }

    return result.sort((a, b) => {
      const diff = parseReportDate(a.date) - parseReportDate(b.date);
      return sortOrder === 'newest' ? -diff : diff;
    });
  }, [reports, searchQuery, statusFilter, sortOrder]);

  const activeFilterCount = statusFilter !== 'all' ? 1 : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-16 px-4 sm:px-6 pt-4 sm:pt-6">

      {/* --- STANDALONE SEARCH BAR --- */}
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search test or lab name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={isLoading || !!error}
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
        />
      </div>


      {/* --- ALWAYS VISIBLE FILTER & SORT BAR --- */}
      <div className="flex flex-wrap items-center gap-3  p-2.5 sm:p-3 rounded-xl  border-slate-200 relative z-10">
        
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-500 mr-1 hidden sm:inline">Status:</span>
          {(['all', 'available', 'processing'] as StatusFilter[]).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              disabled={isLoading || !!error}
              className={`px-3 py-1.5 rounded-md text-[11px] font-bold border capitalize transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                statusFilter === s ? 'bg-[#5B21B6] text-white border-[#5B21B6]' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-[#5B21B6]/40'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {activeFilterCount > 0 && (
          <>
            <div className="w-px h-5 bg-slate-200 hidden sm:block mx-1" />
            <button onClick={() => setStatusFilter('all')} className="text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors">
              Clear filters
            </button>
          </>
        )}

        <div className="ml-auto flex items-center gap-2" ref={sortRef}>
          <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">Sort by:</span>
          <div className="relative">
            <button
              onClick={() => !isLoading && !error && setIsSortOpen(!isSortOpen)}
              disabled={isLoading || !!error}
              className={`flex items-center justify-between gap-3 bg-slate-50 hover:bg-slate-100 border transition-all rounded-lg pl-3 pr-2 py-1.5 text-[11px] font-bold w-[125px] disabled:opacity-60 disabled:cursor-not-allowed ${
                isSortOpen ? 'border-[#5B21B6] ring-2 ring-[#5B21B6]/20 text-[#5B21B6]' : 'border-slate-200 text-slate-700'
              }`}
            >
              {sortOrder === 'newest' ? 'Date: Newest' : 'Date: Oldest'}
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isSortOpen ? 'rotate-180 text-[#5B21B6]' : ''}`} />
            </button>

            {isSortOpen && (
              <div className="absolute right-0 top-full mt-2 w-36 bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-200/50 overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                <div className="p-1.5 space-y-0.5">
                  <button
                    onClick={() => { setSortOrder('newest'); setIsSortOpen(false); }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 text-[11px] font-bold rounded-lg transition-colors ${
                      sortOrder === 'newest' ? 'bg-[#5B21B6]/10 text-[#5B21B6]' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Date: Newest
                    {sortOrder === 'newest' && <Check className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => { setSortOrder('oldest'); setIsSortOpen(false); }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 text-[11px] font-bold rounded-lg transition-colors ${
                      sortOrder === 'oldest' ? 'bg-[#5B21B6]/10 text-[#5B21B6]' : 'text-slate-600 hover:bg-slate-50'
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
      </div>

      {/* --- CONTENT AREA (LOADING / ERROR / LIST) --- */}
      <div className="space-y-3 relative z-0">
        
        {/* State 1: Loading */}
        {isLoading ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-sm flex flex-col items-center justify-center animate-pulse min-h-[250px]">
            <Loader2 className="w-8 h-8 text-[#5B21B6] animate-spin mb-4" />
            <h3 className="font-bold text-sm text-slate-900">Fetching Lab Reports</h3>
            <p className="text-xs font-medium text-slate-500 mt-1">Please wait while we securely load your data...</p>
          </div>
        ) : 
        
        /* State 2: Error */
        error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center shadow-sm flex flex-col items-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-bold text-sm text-red-900">Unable to load reports</h3>
            <p className="text-xs font-medium text-red-700 mt-1 max-w-sm">{error}</p>
            <button 
              onClick={fetchReports}
              className="mt-4 flex items-center gap-1.5 px-4 py-2 bg-white text-red-700 hover:bg-red-50 border border-red-200 rounded-lg text-xs font-bold transition-colors shadow-sm"
            >
              <RefreshCcw className="w-3.5 h-3.5" /> Try Again
            </button>
          </div>
        ) : 
        
        /* State 3: Empty Results */
        filteredReports.length === 0 ? (
          <div className="bg-white border border-slate-200/80 border-dashed rounded-2xl p-8 text-center shadow-sm flex flex-col items-center">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3 border border-slate-100">
              <Microscope className="w-6 h-6 text-slate-300" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">No lab reports found</h3>
            <p className="text-xs font-medium text-slate-500 mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : 
        
        /* State 4: List View */
        (
          filteredReports.map(report => {
            const hasAbnormal = report.parameters?.some(p => p.isAbnormal);
            
            return (
              <div key={report.id} className=" rounded-xl  shadow-sm hover:shadow-md hover:border-[#5B21B6]/30 transition-all duration-300 overflow-hidden group p-3 sm:p-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105 ${
                      report.status === 'available' ? 'bg-gradient-to-br from-[#5B21B6] to-indigo-600 text-white border-transparent shadow-sm shadow-indigo-600/20' : 'bg-amber-50 text-amber-600 border-amber-200'
                    }`}>
                      {report.status === 'available' ? <FileCheck className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-bold text-sm text-slate-900 leading-snug">{report.testName}</h3>
                        {hasAbnormal && (
                          <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                            <AlertTriangle className="w-2.5 h-2.5" /> Flagged
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1 text-[#5B21B6] font-semibold"><FlaskConical className="w-3 h-3" /> {report.labName}</span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {report.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {report.status === 'available' ? (
                      <>
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                        <button
                          onClick={() => alert(`Downloading report API endpoint triggered...`)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#5B21B6] to-indigo-600 hover:from-[#4c1d95] hover:to-indigo-700 text-white rounded-lg font-bold text-[11px] shadow-sm transition-all active:scale-[0.98]"
                        >
                          <Download className="w-3.5 h-3.5" /> PDF
                        </button>
                      </>
                    ) : (
                      <div className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 w-full text-center">
                        Processing...
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* --- VIEW RESULTS MODAL --- */}
      {selectedReport && selectedReport.status === 'available' && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">

            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-br from-[#4c1d95] to-[#5B21B6]">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Diagnostic Results
                </h3>
                <p className="text-[11px] text-indigo-100 font-medium mt-0.5">{selectedReport.testName}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => window.print()} className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 transition-all shrink-0">
                  <Printer className="w-4 h-4" />
                </button>
                <button onClick={() => setSelectedReport(null)} className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 transition-all shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
              
              <div className="grid grid-cols-2 gap-3 bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Date</span>
                  <span className="font-bold text-slate-900">{selectedReport.date}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Lab</span>
                  <span className="font-bold text-slate-900 truncate block">{selectedReport.labName}</span>
                </div>
              </div>

              {selectedReport.summaryNote && (
                <div className={`p-3 rounded-xl border flex gap-2.5 items-start ${selectedReport.parameters?.some(p => p.isAbnormal) ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
                  <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${selectedReport.parameters?.some(p => p.isAbnormal) ? 'text-amber-600' : 'text-emerald-600'}`} />
                  <div>
                    <h4 className={`text-xs font-bold ${selectedReport.parameters?.some(p => p.isAbnormal) ? 'text-amber-900' : 'text-emerald-900'}`}>Report Summary</h4>
                    <p className={`text-xs mt-0.5 font-medium leading-relaxed ${selectedReport.parameters?.some(p => p.isAbnormal) ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {selectedReport.summaryNote}
                    </p>
                  </div>
                </div>
              )}

              {selectedReport.parameters && selectedReport.parameters.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-slate-900 text-xs">Test Parameters</h4>
                    <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {selectedReport.parameters.filter(p => p.isAbnormal).length} of {selectedReport.parameters.length} flagged
                    </span>
                  </div>
                  
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                          <th className="p-2 sm:p-3">Parameter</th>
                          <th className="p-2 sm:p-3">Result</th>
                          <th className="p-2 sm:p-3 hidden sm:table-cell">Unit</th>
                          <th className="p-2 sm:p-3 text-right">Ref. Range</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {selectedReport.parameters.map((param, idx) => (
                          <tr key={idx} className={param.isAbnormal ? 'bg-red-50/60' : idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}>
                            <td className="p-2 sm:p-3 font-semibold text-slate-800">
                              {param.name}
                              {param.isAbnormal && <span className="sm:hidden block text-[9px] text-red-500 font-bold uppercase mt-0.5">Abnormal</span>}
                            </td>
                            <td className="p-2 sm:p-3">
                              <span className={`font-bold px-1.5 py-0.5 rounded ${param.isAbnormal ? 'bg-red-100 text-red-700 border border-red-200' : 'text-slate-900'}`}>
                                {param.result} <span className="sm:hidden text-[10px] font-normal ml-1 text-slate-500">{param.unit}</span>
                              </span>
                            </td>
                            <td className="p-2 sm:p-3 text-slate-500 font-medium hidden sm:table-cell">{param.unit}</td>
                            <td className="p-2 sm:p-3 text-right text-slate-500 font-medium">{param.normalRange}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
              <button onClick={() => setSelectedReport(null)} className="flex-1 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg font-bold border border-slate-200 text-xs transition-colors">
                Close
              </button>
              <button onClick={() => alert(`Downloading full report API endpoint triggered...`)} className="flex-1 py-2 bg-gradient-to-r from-[#5B21B6] to-indigo-600 hover:from-[#4c1d95] hover:to-indigo-700 text-white rounded-lg font-bold shadow-sm text-xs transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]">
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
const MOCK_API_RESPONSE: LabReport[] = [
  {
    id: 'LAB-98421',
    testName: 'Complete Blood Count (CBC)',
    labName: 'City Diagnostics Center',
    date: 'August 18, 2026',
    status: 'available',
    summaryNote: 'Slightly low Hemoglobin levels observed. Consult your physician for dietary or supplement adjustments.',
    parameters: [
      { name: 'Hemoglobin (Hb)', result: '11.2', unit: 'g/dL', normalRange: '13.0 - 17.0', isAbnormal: true },
      { name: 'Total WBC Count', result: '7,500', unit: 'cumm', normalRange: '4,000 - 10,000', isAbnormal: false },
      { name: 'Platelet Count', result: '2.5', unit: 'Lakhs/cumm', normalRange: '1.5 - 4.5', isAbnormal: false },
      { name: 'RBC Count', result: '4.8', unit: 'Mill/cumm', normalRange: '4.5 - 5.5', isAbnormal: false },
    ]
  },
  {
    id: 'LAB-87310',
    testName: 'Lipid Profile',
    labName: 'Apollo Diagnostics',
    date: 'July 25, 2026',
    status: 'available',
    summaryNote: 'LDL Cholesterol is bordering high. Advised to reduce saturated fat intake.',
    parameters: [
      { name: 'Total Cholesterol', result: '195', unit: 'mg/dL', normalRange: '< 200', isAbnormal: false },
      { name: 'Triglycerides', result: '140', unit: 'mg/dL', normalRange: '< 150', isAbnormal: false },
      { name: 'HDL Cholesterol', result: '45', unit: 'mg/dL', normalRange: '> 40', isAbnormal: false },
      { name: 'LDL Cholesterol', result: '135', unit: 'mg/dL', normalRange: '< 100', isAbnormal: true },
    ]
  },
  {
    id: 'LAB-75211',
    testName: 'Thyroid Profile (T3, T4, TSH)',
    labName: 'City Care Pathology',
    date: 'August 20, 2026',
    status: 'processing'
  }
];