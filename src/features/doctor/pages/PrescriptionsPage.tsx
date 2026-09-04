import { useState } from "react";
import { useListPrescriptions } from "@workspace/api-client-react";
import { DashboardLayout } from "@/features/doctor/component/DoctorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, Clock, Plus, User, Pill, Printer, Search, Stethoscope, Clipboard as ClipboardIcon } from "lucide-react";
import { PrescribeModal } from "../components/PrescribeModal";

export function DoctorPrescriptions() {
  const { data: prescriptions, isLoading } = useListPrescriptions();
  const [prescribeOpen, setPrescribeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRx, setSelectedRx] = useState<any | null>(null);

  const filteredList = prescriptions?.filter((rx) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (rx.patientName ?? "").toLowerCase().includes(q) ||
      (rx.diagnosis ?? "").toLowerCase().includes(q) ||
      (rx.medicines ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <DashboardLayout>
      <div className="space-y-5 sm:space-y-6 pb-12 font-sans min-w-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <ClipboardIcon className="h-6 w-6 sm:h-7 sm:w-7 text-violet-600 shrink-0" />
              <span>Issued Digital Prescriptions</span>
            </h1>
            <p className="text-slate-500 mt-1 text-xs sm:text-sm">
              Review, search, and print electronic prescriptions issued during in-person and telehealth consultations.
            </p>
          </div>
          <Button
            onClick={() => setPrescribeOpen(true)}
            className="bg-violet-600 hover:bg-violet-700 text-white font-bold gap-2 rounded-xl shadow-md h-10 px-4 text-xs sm:text-sm shrink-0 self-start sm:self-auto"
          >
            <Plus className="h-4 w-4 shrink-0" /> Issue New Prescription
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by patient, medicine, or diagnosis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-all shadow-xs"
          />
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-slate-400 font-medium space-y-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent mx-auto" />
            <p className="text-sm">Loading digital prescriptions...</p>
          </div>
        ) : filteredList?.length === 0 ? (
          <Card className="rounded-2xl border-slate-200/80">
            <CardContent className="flex flex-col items-center justify-center py-16 sm:py-20 text-slate-400 space-y-2 text-center p-4">
              <FileText className="h-12 w-12 text-slate-300 mb-2" />
              <p className="text-base font-bold text-slate-700">No prescriptions found</p>
              <p className="text-xs text-slate-400 max-w-sm">
                Digital prescriptions generated during consultations will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {filteredList?.map((rx) => (
              <Card
                key={rx.id}
                className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-violet-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <CardHeader className="bg-slate-50/60 border-b border-slate-100 p-4 sm:p-5 pb-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <CardTitle className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2 truncate">
                          <User className="h-4 w-4 text-violet-600 shrink-0" />
                          <span className="truncate">{rx.patientName || `Patient #${String(rx.patientId).slice(0, 6)}`}</span>
                        </CardTitle>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3 shrink-0" />
                          Prescribed: {new Date(rx.prescribedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold uppercase shrink-0 ${
                          rx.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {rx.status}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 sm:p-5 space-y-3.5">
                    {rx.diagnosis && (
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                          Clinical Diagnosis
                        </span>
                        <p className="text-xs font-bold text-slate-800 break-words">{rx.diagnosis}</p>
                      </div>
                    )}

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Prescribed Medicines
                      </span>
                      <div className="bg-slate-50 p-3 rounded-xl text-xs font-mono whitespace-pre-wrap break-words overflow-x-auto border border-slate-200/70 text-slate-800 leading-relaxed">
                        {rx.medicines}
                      </div>
                    </div>

                    {rx.instructions && (
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                          Doctor Instructions
                        </span>
                        <p className="text-xs text-slate-600 break-words leading-relaxed">{rx.instructions}</p>
                      </div>
                    )}
                  </CardContent>
                </div>

                <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 flex justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedRx(rx)}
                    className="w-full sm:w-auto text-xs font-bold text-violet-700 border-violet-200 hover:bg-violet-50 rounded-xl gap-1.5 h-8 mt-2"
                  >
                    <Printer className="h-3.5 w-3.5 shrink-0" /> View / Print Prescription
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Prescription View / Print Dialog */}
        <Dialog open={!!selectedRx} onOpenChange={(open) => !open && setSelectedRx(null)}>
          <DialogContent className="sm:max-w-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <DialogHeader className="border-b pb-3 sm:pb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold shrink-0">
                  <Stethoscope className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 truncate">ArogyaGenie e-Prescription</DialogTitle>
                  <p className="text-xs text-slate-500">Official Telehealth Medical Record</p>
                </div>
              </div>
            </DialogHeader>

            {selectedRx && (
              <div className="space-y-4 py-2 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Patient Name</span>
                    <strong className="text-slate-900 text-sm">{selectedRx.patientName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Date Issued</span>
                    <strong className="text-slate-900 text-sm">{selectedRx.prescribedDate}</strong>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block font-bold mb-1">Diagnosis</span>
                  <p className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 font-semibold text-slate-800 break-words">
                    {selectedRx.diagnosis}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500 block font-bold mb-1">Medications & Schedule</span>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 font-mono text-slate-900 whitespace-pre-wrap break-words overflow-x-auto">
                    {selectedRx.medicines}
                  </div>
                </div>

                {selectedRx.instructions && (
                  <div>
                    <span className="text-slate-500 block font-bold mb-1">Clinical Instructions</span>
                    <p className="text-slate-700 break-words">{selectedRx.instructions}</p>
                  </div>
                )}

                <div className="pt-3 border-t flex justify-end gap-2">
                  <Button
                    onClick={() => window.print()}
                    className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white font-bold gap-1.5 rounded-xl text-xs"
                  >
                    <Printer className="h-4 w-4 shrink-0" /> Print Document
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Prescribe Modal */}
        <PrescribeModal
          isOpen={prescribeOpen}
          onClose={() => setPrescribeOpen(false)}
        />
      </div>
    </DashboardLayout>
  );
}

export default DoctorPrescriptions;
