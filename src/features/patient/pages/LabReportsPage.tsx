import React, { useState } from 'react';
import { 
  Microscope, Search, Calendar, FileText, Download, 
  Eye, ArrowLeft, Activity, FileCheck, Clock, AlertTriangle, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ==========================================
// Types
// ==========================================
type ReportStatus = 'available' | 'processing';

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

export default function LabReportsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<LabReport | null>(null);

  // Filter reports
  const filteredReports = MOCK_REPORTS.filter(report => 
    report.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.labName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 px-4 sm:px-6">
      
      {/* --- HEADER BAR --- */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_20px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2.5 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-2xl transition-all border border-slate-200"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Lab Reports</h2>
              <span className="bg-[#5B21B6]/10 text-[#5B21B6] font-bold text-xs px-2.5 py-0.5 rounded-full border border-[#5B21B6]/20">
                {MOCK_REPORTS.length} Tests
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500 mt-0.5">Access, view, and download your diagnostic test results.</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search test or lab name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 focus:border-[#5B21B6] transition-all shadow-sm"
          />
        </div>
      </div>

      {/* --- REPORTS LIST --- */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="bg-white border border-slate-200/80 border-dashed rounded-3xl p-16 text-center shadow-sm flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
              <Microscope className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">No lab reports found</h3>
            <p className="text-sm font-medium text-slate-500 mt-1 max-w-sm">We couldn't find any reports matching your search query.</p>
          </div>
        ) : (
          filteredReports.map(report => (
            <div 
              key={report.id}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-all flex flex-col gap-4 group"
            >
              {/* Card Top Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm shrink-0 ${
                    report.status === 'available' ? 'bg-[#5B21B6]/10 text-[#5B21B6] border-[#5B21B6]/20' : 'bg-amber-50 text-amber-600 border-amber-200'
                  }`}>
                    {report.status === 'available' ? <FileCheck className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{report.testName}</h3>
                    <p className="text-xs font-semibold text-[#5B21B6] flex items-center gap-1.5 mt-0.5">
                      <Microscope className="w-3 h-3" /> {report.labName}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                    report.status === 'available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {report.status === 'available' ? 'Available' : 'Processing...'}
                  </span>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> {report.date}
                  </span>
                </div>
              </div>

              {/* Patient/Referral Context */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center text-sm">
                <div className="flex gap-4">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Report ID</span>
                    <span className="font-bold text-slate-800">{report.id}</span>
                  </div>
                  <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Referred By</span>
                    <span className="font-bold text-slate-800">{report.referredBy}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
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
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#5B21B6] hover:bg-[#6D28D9] text-white rounded-xl font-bold text-xs shadow-md shadow-[#5B21B6]/20 transition-all"
                      >
                        <Download className="w-4 h-4" /> Download PDF
                      </button>
                    </>
                  ) : (
                    <div className="text-xs font-medium text-amber-700 bg-amber-50 px-4 py-2.5 rounded-xl border border-amber-200 w-full text-center">
                      Report usually available within 24 hours.
                    </div>
                  )}
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* --- VIEW RESULTS MODAL --- */}
      {selectedReport && selectedReport.status === 'available' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div>
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#5B21B6]" /> Diagnostic Results
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{selectedReport.testName}</p>
              </div>
              <button 
                onClick={() => setSelectedReport(null)}
                className="p-2 bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-full border border-slate-200 shadow-sm transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Meta Info */}
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

              {/* Summary Note */}
              {selectedReport.summaryNote && (
                <div className={`p-4 rounded-xl border flex gap-3 items-start ${
                  selectedReport.parameters?.some(p => p.isAbnormal) ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'
                }`}>
                  <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${
                    selectedReport.parameters?.some(p => p.isAbnormal) ? 'text-amber-600' : 'text-emerald-600'
                  }`} />
                  <div>
                    <h4 className={`text-sm font-bold ${selectedReport.parameters?.some(p => p.isAbnormal) ? 'text-amber-900' : 'text-emerald-900'}`}>
                      Report Summary
                    </h4>
                    <p className={`text-sm mt-1 font-medium ${selectedReport.parameters?.some(p => p.isAbnormal) ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {selectedReport.summaryNote}
                    </p>
                  </div>
                </div>
              )}

              {/* Parameters Table */}
              {selectedReport.parameters && selectedReport.parameters.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-900 mb-3 text-sm">Test Parameters Breakdown</h4>
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
                          <tr key={idx} className={param.isAbnormal ? 'bg-red-50/50' : 'bg-white'}>
                            <td className="p-3 sm:p-4 font-semibold text-slate-800">
                              {param.name}
                              {param.isAbnormal && <span className="sm:hidden block text-[10px] text-red-500 uppercase mt-0.5">Abnormal</span>}
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

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
              <button 
                onClick={() => setSelectedReport(null)}
                className="flex-1 py-3 bg-white hover:bg-slate-100 text-slate-700 rounded-xl font-bold border border-slate-200 text-sm transition-colors"
              >
                Close Preview
              </button>
              <button 
                onClick={() => alert(`Downloading full report for ${selectedReport.id}...`)}
                className="flex-1 py-3 bg-[#5B21B6] hover:bg-[#6D28D9] text-white rounded-xl font-bold shadow-md shadow-[#5B21B6]/20 text-sm transition-all flex items-center justify-center gap-2"
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