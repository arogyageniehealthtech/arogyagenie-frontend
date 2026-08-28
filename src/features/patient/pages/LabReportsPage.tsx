import { useState, useMemo } from 'react';
import {
  Microscope, Search, Calendar, Download,
  Eye, ArrowLeft, Activity, FileCheck, Clock, AlertTriangle, X,
  FlaskConical, SlidersHorizontal, TrendingUp, Printer, ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  referredBy: string;
  date: string;
  status: ReportStatus;
  parameters?: TestParameter[];
  summaryNote?: string;
}

// ==========================================
// Mock Lab Reports Data
// ==========================================
const MOCK_REPORTS: LabReport[] = [
  {
    id: 'LAB-98421',
    testName: 'Complete Blood Count (CBC)',
    labName: 'City Diagnostics Center',
    referredBy: 'Dr. Arup Kumar',
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
    referredBy: 'Self',
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
    referredBy: 'Dr. Neha Gupta',
    date: 'August 20, 2026',
    status: 'processing'
  }
];

// Parse "August 18, 2026" style strings for sorting
function parseReportDate(dateStr: string): number {
  const parsed = Date.parse(dateStr);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export default function LabReportsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<LabReport | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [abnormalOnly, setAbnormalOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Derived stats for the summary strip
  const stats = useMemo(() => {
    const available = MOCK_REPORTS.filter(r => r.status === 'available').length;
    const processing = MOCK_REPORTS.filter(r => r.status === 'processing').length;
    const flagged = MOCK_REPORTS.filter(r => r.parameters?.some(p => p.isAbnormal)).length;
    return { total: MOCK_REPORTS.length, available, processing, flagged };
  }, []);

  const filteredReports = useMemo(() => {
    let result = MOCK_REPORTS.filter(report =>
      report.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.labName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (statusFilter !== 'all') {
      result = result.filter(r => r.status === statusFilter);
    }

    if (abnormalOnly) {
      result = result.filter(r => r.parameters?.some(p => p.isAbnormal));
    }

    result = [...result].sort((a, b) => {
      const diff = parseReportDate(a.date) - parseReportDate(b.date);
      return sortOrder === 'newest' ? -diff : diff;
    });

    return result;
  }, [searchQuery, statusFilter, abnormalOnly, sortOrder]);

  const activeFilterCount = (statusFilter !== 'all' ? 1 : 0) + (abnormalOnly ? 1 : 0);

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-16 px-4 sm:px-6 pt-4 sm:pt-6">

      {/* --- HEADER BAR --- */}
      <div className="relative overflow-hidden bg-linear-to-br from-[#4c1d95] to-[#5B21B6] p-6 sm:p-7 rounded-3xl shadow-lg shadow-indigo-900/10">
        <div className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-3xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 bg-white/10 text-white hover:bg-white/20 rounded-2xl transition-all border border-white/20 backdrop-blur-sm shrink-0"
              title="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Lab Reports</h2>
                <span className="bg-white/15 text-white font-bold text-xs px-2.5 py-0.5 rounded-full border border-white/25 backdrop-blur-sm">
                  {stats.total} Tests
                </span>
              </div>
              <p className="text-sm font-medium text-indigo-100 mt-1">Access, view, and download your diagnostic test results.</p>
            </div>
          </div>

          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search test or lab name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/95 border border-white/20 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/60 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Quick stat pills */}
        <div className="relative flex flex-wrap gap-2 mt-5">
          <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
            <FileCheck className="w-3.5 h-3.5" /> {stats.available} Available
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
            <Clock className="w-3.5 h-3.5" /> {stats.processing} Processing
          </div>
          {stats.flagged > 0 && (
            <div className="flex items-center gap-1.5 bg-amber-400/20 border border-amber-300/30 rounded-xl px-3 py-1.5 text-xs font-semibold text-amber-100 backdrop-blur-sm">
              <AlertTriangle className="w-3.5 h-3.5" /> {stats.flagged} Need Attention
            </div>
          )}
        </div>
      </div>

      {/* --- FILTER BAR --- */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setShowFilters(v => !v)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
            showFilters || activeFilterCount > 0
              ? 'bg-[#5B21B6] text-white border-[#5B21B6]'
              : 'bg-white text-slate-700 border-slate-200 hover:border-[#5B21B6]/40'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
          {activeFilterCount > 0 && (
            <span className="bg-white/25 text-white px-1.5 rounded-md text-[10px]">{activeFilterCount}</span>
          )}
        </button>

        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Sort:</span>
          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] cursor-pointer"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center gap-2 shadow-sm animate-in fade-in slide-in-from-top-1 duration-150">
          <span className="text-xs font-bold text-slate-500 mr-1">Status:</span>
          {(['all', 'available', 'processing'] as StatusFilter[]).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border capitalize transition-all ${
                statusFilter === s
                  ? 'bg-[#5B21B6] text-white border-[#5B21B6]'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-[#5B21B6]/40'
              }`}
            >
              {s}
            </button>
          ))}

          <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block" />

          <button
            onClick={() => setAbnormalOnly(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              abnormalOnly
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-amber-400/50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Flagged results only
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={() => { setStatusFilter('all'); setAbnormalOnly(false); }}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 ml-auto"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* --- REPORTS LIST --- */}
      <div className="space-y-3.5">
        {filteredReports.length === 0 ? (
          <div className="bg-white border border-slate-200/80 border-dashed rounded-3xl p-14 sm:p-16 text-center shadow-sm flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
              <Microscope className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">No lab reports found</h3>
            <p className="text-sm font-medium text-slate-500 mt-1 max-w-sm">Try adjusting your search or filters.</p>
            {(searchQuery || activeFilterCount > 0) && (
              <button
                onClick={() => { setSearchQuery(''); setStatusFilter('all'); setAbnormalOnly(false); }}
                className="mt-4 text-xs font-bold text-[#5B21B6] hover:underline"
              >
                Reset all filters
              </button>
            )}
          </div>
        ) : (
          filteredReports.map(report => {
            const hasAbnormal = report.parameters?.some(p => p.isAbnormal);
            return (
              <div
                key={report.id}
                className="bg-white rounded-3xl border border-slate-200/70 shadow-sm hover:shadow-lg hover:border-[#5B21B6]/30 transition-all duration-300 overflow-hidden group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 sm:p-6 pb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105 ${
                      report.status === 'available'
                        ? 'bg-linear-to-br from-[#5B21B6] to-indigo-600 text-white border-transparent shadow-md shadow-indigo-600/25'
                        : 'bg-amber-50 text-amber-600 border-amber-200'
                    }`}>
                      {report.status === 'available' ? <FileCheck className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-snug">{report.testName}</h3>
                        {hasAbnormal && (
                          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                            <AlertTriangle className="w-3 h-3" /> Flagged
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-[#5B21B6] flex items-center gap-1.5 mt-0.5">
                        <FlaskConical className="w-3 h-3" /> {report.labName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${
                      report.status === 'available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {report.status === 'available' ? 'Available' : 'Processing'}
                    </span>
                    <span className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-slate-100">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {report.date}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-slate-100 mx-5 sm:mx-6" />

                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-5 sm:p-6 pt-4">
                  <div className="flex gap-5 text-sm">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Report ID</span>
                      <span className="font-bold text-slate-800">{report.id}</span>
                    </div>
                    <div className="w-px h-8 bg-slate-200 hidden sm:block" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Referred By</span>
                      <span className="font-bold text-slate-800">{report.referredBy}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {report.status === 'available' ? (
                      <>
                        <button
                          onClick={() => setSelectedReport(report)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
                        >
                          <Eye className="w-4 h-4" /> View Results
                        </button>
                        <button
                          onClick={() => alert(`Downloading report ${report.id}...`)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-[#5B21B6] to-indigo-600 hover:from-[#4c1d95] hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-[#5B21B6]/20 transition-all active:scale-[0.98]"
                        >
                          <Download className="w-4 h-4" /> Download PDF
                        </button>
                      </>
                    ) : (
                      <div className="text-xs font-semibold text-amber-700 bg-amber-50 px-4 py-2.5 rounded-xl border border-amber-200 w-full text-center">
                        Report usually available within 24 hours
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
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">

            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-linear-to-br from-[#4c1d95] to-[#5B21B6]">
              <div>
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <Activity className="w-5 h-5" /> Diagnostic Results
                </h3>
                <p className="text-xs text-indigo-100 font-medium mt-0.5">{selectedReport.testName}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => window.print()}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 transition-all shrink-0"
                  title="Print report"
                >
                  <Printer className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 transition-all shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6">

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Date</span>
                  <span className="font-bold text-slate-900">{selectedReport.date}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Lab</span>
                  <span className="font-bold text-slate-900">{selectedReport.labName}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Report ID</span>
                  <span className="font-bold text-slate-900">{selectedReport.id}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Referred By</span>
                  <span className="font-bold text-slate-900">{selectedReport.referredBy}</span>
                </div>
              </div>

              {selectedReport.summaryNote && (
                <div className={`p-4 rounded-2xl border flex gap-3 items-start ${
                  selectedReport.parameters?.some(p => p.isAbnormal) ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'
                }`}>
                  <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${
                    selectedReport.parameters?.some(p => p.isAbnormal) ? 'text-amber-600' : 'text-emerald-600'
                  }`} />
                  <div>
                    <h4 className={`text-sm font-bold ${selectedReport.parameters?.some(p => p.isAbnormal) ? 'text-amber-900' : 'text-emerald-900'}`}>
                      Report Summary
                    </h4>
                    <p className={`text-sm mt-1 font-medium leading-relaxed ${selectedReport.parameters?.some(p => p.isAbnormal) ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {selectedReport.summaryNote}
                    </p>
                  </div>
                </div>
              )}

              {selectedReport.parameters && selectedReport.parameters.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-slate-900 text-sm">Test Parameters Breakdown</h4>
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {selectedReport.parameters.filter(p => p.isAbnormal).length} of {selectedReport.parameters.length} flagged
                    </span>
                  </div>
                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                          <th className="p-3 sm:p-4">Parameter</th>
                          <th className="p-3 sm:p-4">Result</th>
                          <th className="p-3 sm:p-4 hidden sm:table-cell">Unit</th>
                          <th className="p-3 sm:p-4 text-right">Reference Range</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {selectedReport.parameters.map((param, idx) => (
                          <tr key={idx} className={param.isAbnormal ? 'bg-red-50/60' : idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}>
                            <td className="p-3 sm:p-4 font-semibold text-slate-800">
                              {param.name}
                              {param.isAbnormal && <span className="sm:hidden block text-[10px] text-red-500 font-bold uppercase mt-0.5">Abnormal</span>}
                            </td>
                            <td className="p-3 sm:p-4">
                              <span className={`font-bold px-2 py-1 rounded-md ${
                                param.isAbnormal ? 'bg-red-100 text-red-700 border border-red-200' : 'text-slate-900'
                              }`}>
                                {param.result} <span className="sm:hidden text-xs font-normal ml-1 text-slate-500">{param.unit}</span>
                              </span>
                            </td>
                            <td className="p-3 sm:p-4 text-slate-500 font-medium hidden sm:table-cell">{param.unit}</td>
                            <td className="p-3 sm:p-4 text-right text-slate-500 font-medium">{param.normalRange}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex gap-3">
              <button
                onClick={() => setSelectedReport(null)}
                className="flex-1 py-3 bg-white hover:bg-slate-100 text-slate-700 rounded-xl font-bold border border-slate-200 text-sm transition-colors"
              >
                Close Preview
              </button>
              <button
                onClick={() => alert(`Downloading full report for ${selectedReport.id}...`)}
                className="flex-1 py-3 bg-linear-to-r from-[#5B21B6] to-indigo-600 hover:from-[#4c1d95] hover:to-indigo-700 text-white rounded-xl font-bold shadow-md shadow-[#5B21B6]/20 text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Download className="w-4 h-4" /> Download Full PDF
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}