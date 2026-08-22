import React, { useState } from 'react';
import {
  FileCheck2,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  Eye,
  Send,
  Plus,
  Sparkles,
} from 'lucide-react';
import { usePartner } from '../context/PartnerContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { PartnerSkeleton } from '../components/common/PartnerSkeleton';
import { PartnerEmptyState } from '../components/common/PartnerEmptyState';
import { Button } from '@/components/ui/button';
import type { LabReport } from '@/types/partner.types';

export const LabReportsPage: React.FC = () => {
  const { labReports, activeProvider, isLoading, uploadReport, updateReportStatus } = usePartner();
  const [selectedReport, setSelectedReport] = useState<LabReport | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  // New report form state
  const [patientName, setPatientName] = useState('');
  const [testName, setTestName] = useState('Comprehensive Metabolic Panel');
  const [resultSummary, setResultSummary] = useState('');

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    await uploadReport({
      providerId: activeProvider?.id || 'provider-lab-1',
      bookingId: `lab-bk-${Date.now()}`,
      reportNumber: `REP-NABL-${Math.floor(1000 + Math.random() * 9000)}`,
      patient: {
        id: `pat-${Date.now()}`,
        name: patientName || 'Pooja Hegde',
        age: 31,
        gender: 'FEMALE',
        phone: '+91 98860 11992',
        bloodGroup: 'B_POS',
      },
      testName,
      completionDate: new Date().toISOString().split('T')[0],
      reportStatus: 'VALIDATED',
      resultSummary: resultSummary || 'All tested biomarkers within healthy physiological ranges.',
      normalRangeFlags: [
        { parameter: 'Hemoglobin', value: '13.8 g/dL', referenceRange: '12.0 - 15.5 g/dL', isAbnormal: false },
        { parameter: 'Total Leukocyte Count (TLC)', value: '7,400 /mcL', referenceRange: '4,000 - 11,000 /mcL', isAbnormal: false },
        { parameter: 'Fasting Blood Sugar', value: '92 mg/dL', referenceRange: '70 - 99 mg/dL', isAbnormal: false },
      ],
      verifiedByDoctor: 'Dr. Sunita Deshmukh, MD (Pathology)',
    });
    setIsUploadModalOpen(false);
    setPatientName('');
    setResultSummary('');
  };

  if (isLoading) {
    return <PartnerSkeleton rows={5} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <FileCheck2 className="h-6 w-6 text-teal-600" />
            Diagnostic Lab Reports & Pathology Sign-off
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pathologist verification, digital signatures, and automated release to AarogyaGenie Health Locker
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            size="sm"
            onClick={() => setIsUploadModalOpen(true)}
            className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold"
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Generate & Sign Report
          </Button>
        </div>
      </div>

      {labReports.length === 0 ? (
        <PartnerEmptyState
          title="No diagnostic reports available"
          description="Reports uploaded or generated will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Reports Table (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Report # & Date</th>
                      <th className="py-3.5 px-4">Patient & Test</th>
                      <th className="py-3.5 px-4">Verification</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {labReports.map((rep) => (
                      <tr
                        key={rep.id}
                        onClick={() => setSelectedReport(rep)}
                        className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                          selectedReport?.id === rep.id ? 'bg-teal-50/40' : ''
                        }`}
                      >
                        <td className="py-4 px-4">
                          <span className="font-mono font-bold text-teal-700 block">{rep.reportNumber}</span>
                          <span className="text-[10px] text-slate-400">{rep.completionDate}</span>
                        </td>

                        <td className="py-4 px-4">
                          <span className="font-bold text-slate-900 block">{rep.patient.name}</span>
                          <span className="text-[11px] text-slate-500">{rep.testName}</span>
                        </td>

                        <td className="py-4 px-4 text-[11px] text-slate-600">
                          {rep.verifiedByDoctor}
                        </td>

                        <td className="py-4 px-4">
                          <StatusBadge status={rep.reportStatus} size="sm" />
                        </td>

                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedReport(rep);
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Selected Report Preview (5 cols) */}
          <div className="lg:col-span-5">
            {selectedReport ? (
              <div className="sticky top-28 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-teal-700">{selectedReport.reportNumber}</span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedReport.testName}</h3>
                  </div>
                  <StatusBadge status={selectedReport.reportStatus} />
                </div>

                {/* Patient summary */}
                <div className="p-3.5 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-900">{selectedReport.patient.name}</span>
                    <span className="text-slate-500">{selectedReport.patient.age}y / {selectedReport.patient.gender}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Completed Date: {selectedReport.completionDate}</p>
                </div>

                {/* Findings summary */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Clinical Impression
                  </h4>
                  <div className="p-3 bg-teal-50/50 border border-teal-100 rounded-xl text-xs text-slate-800 leading-relaxed font-medium">
                    {selectedReport.resultSummary}
                  </div>
                </div>

                {/* Abnormal / Normal Parameters */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Biomarker Parameters
                  </h4>
                  <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 text-xs overflow-hidden">
                    {selectedReport.normalRangeFlags.map((param, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-900 block">{param.parameter}</span>
                          <span className="text-[10px] text-slate-400">Ref: {param.referenceRange}</span>
                        </div>
                        <div className="text-right">
                          <span
                            className={`font-extrabold ${
                              param.isAbnormal ? 'text-rose-600' : 'text-slate-900'
                            }`}
                          >
                            {param.value}
                          </span>
                          {param.isAbnormal && (
                            <span className="block text-[10px] font-bold text-rose-500 uppercase">
                              Abnormal
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Release Controls */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  {selectedReport.reportStatus !== 'RELEASED' ? (
                    <Button
                      variant="primary"
                      onClick={() => updateReportStatus(selectedReport.id, 'RELEASED')}
                      className="w-full rounded-xl bg-teal-600 hover:bg-teal-700 text-xs font-bold"
                      leftIcon={<Send className="h-4 w-4" />}
                    >
                      Release Report to Patient App
                    </Button>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-emerald-700 font-bold bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4" /> Released to AarogyaGenie
                      </span>
                      <span className="text-[10px] font-normal text-emerald-600">{selectedReport.releasedAt}</span>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => alert(`Downloading verified PDF for ${selectedReport.reportNumber}...`)}
                    className="w-full rounded-xl text-xs font-semibold"
                    leftIcon={<Download className="h-4 w-4" />}
                  >
                    Download Official PDF Report
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-400 bg-white">
                <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-medium">Select a lab report to inspect parameters & sign-off</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Generate Report Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsUploadModalOpen(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 z-10 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-teal-600" />
              Generate & Validate Diagnostic Report
            </h3>

            <form onSubmit={handleGenerateReport} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Patient Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pooja Hegde"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Test Name</label>
                <input
                  type="text"
                  required
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pathologist Impression</label>
                <textarea
                  rows={3}
                  placeholder="Enter medical findings..."
                  value={resultSummary}
                  onChange={(e) => setResultSummary(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" type="button" onClick={() => setIsUploadModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" className="bg-teal-600 hover:bg-teal-700">
                  Save & Validate Report
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default LabReportsPage;
