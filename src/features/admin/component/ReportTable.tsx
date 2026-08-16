import { Badge } from "@/components/ui/badge";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface MockReport {
  id: number;
  title: string;
  patientName: string;
  labName: string;
  date: string;
  status: "completed" | "processing" | "flagged";
}

const MOCK_REPORTS: MockReport[] = [
  {
    id: 501,
    title: "Complete Blood Count (CBC) & Lipid Profile",
    patientName: "Arun Sharma",
    labName: "Apex Diagnostic & Imaging Center",
    date: "2026-08-16",
    status: "completed",
  },
  {
    id: 502,
    title: "HbA1c & Fasting Blood Sugar",
    patientName: "Deepa Menon",
    labName: "Metropolis PathLab Diagnostics",
    date: "2026-08-15",
    status: "completed",
  },
  {
    id: 503,
    title: "Liver Function Test (LFT)",
    patientName: "Rahul Verma",
    labName: "Apex Diagnostic & Imaging Center",
    date: "2026-08-14",
    status: "flagged",
  },
];

export function ReportTable({ reports = MOCK_REPORTS }: { reports?: MockReport[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <th className="py-3 px-4">Report Details</th>
            <th className="py-3 px-4">Patient</th>
            <th className="py-3 px-4">Diagnostic Lab</th>
            <th className="py-3 px-4">Date</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {reports.map((r) => (
            <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
              <td className="py-3.5 px-4 font-semibold text-slate-900">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-teal-600" />
                  <span>{r.title}</span>
                </div>
              </td>
              <td className="py-3.5 px-4 text-slate-700">{r.patientName}</td>
              <td className="py-3.5 px-4 text-slate-600">{r.labName}</td>
              <td className="py-3.5 px-4 text-slate-500 text-xs">{r.date}</td>
              <td className="py-3.5 px-4">
                <Badge
                  variant={
                    r.status === "completed" ? "success" : r.status === "flagged" ? "destructive" : "warning"
                  }
                  className="uppercase text-[10px]"
                >
                  {r.status}
                </Badge>
              </td>
              <td className="py-3.5 px-4 text-right">
                <Button size="sm" variant="outline" className="h-8 gap-1">
                  <Download className="h-3.5 w-3.5" /> PDF
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportTable;
