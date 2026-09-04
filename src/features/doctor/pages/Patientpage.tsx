import { useState } from "react";
import { useListDoctorPatients, type PatientSummary } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Users,
  Search,
  ClipboardList as Clipboard,
  User,
  Calendar,
  Mail,
  Phone,
  Sparkles,
  Stethoscope,
  HeartPulse,
} from "lucide-react";
import { DashboardLayout } from "@/features/doctor/component/DoctorLayout";
import { PrescribeModal } from "../components/PrescribeModal";
import { DoctorPatientBriefingCard } from "../components/DoctorPatientBriefingCard";

export function DoctorPatients() {
  const { data: patients, isLoading } = useListDoctorPatients();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<PatientSummary | null>(null);

  // Prescribe modal state
  const [prescribeOpen, setPrescribeOpen] = useState(false);
  const [targetPatientId, setTargetPatientId] = useState<string | number | undefined>(undefined);
  const [targetPatientName, setTargetPatientName] = useState<string | null>(null);

  const handleOpenPrescribe = (patientId: string | number, patientName?: string | null) => {
    setTargetPatientId(patientId);
    setTargetPatientName(patientName ?? null);
    setPrescribeOpen(true);
  };

  const filteredPatients = patients?.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
    return fullName.includes(q) || p.email.toLowerCase().includes(q) || String(p.id).includes(q);
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Users className="h-7 w-7 text-violet-600" />
              Patient Registry & Clinical Histories
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              View active patients, access longitudinal AI briefing summaries, and issue new prescriptions.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search patient by name, email, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs sm:text-sm rounded-xl border-slate-200"
          />
        </div>

        {/* Patients Grid */}
        {isLoading ? (
          <div className="py-20 text-center text-slate-400 font-medium space-y-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent mx-auto" />
            <p>Loading patient directory...</p>
          </div>
        ) : filteredPatients?.length === 0 ? (
          <Card className="rounded-2xl border-slate-200/80">
            <CardContent className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-2">
              <Users className="h-12 w-12 text-slate-300 mb-2" />
              <p className="text-base font-bold text-slate-700">No patients recorded yet</p>
              <p className="text-xs text-slate-400 max-w-sm text-center">
                Patients who book consultations with you will automatically be registered here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPatients?.map((patient) => (
              <Card
                key={patient.id}
                className="rounded-2xl border-slate-200 shadow-xs hover:shadow-md hover:border-violet-300 transition-all overflow-hidden flex flex-col justify-between"
              >
                <CardContent className="p-5 space-y-4">
                  {/* Avatar & Name */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                        {patient.firstName ? patient.firstName[0] : <User className="h-6 w-6" />}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-slate-900">
                          {patient.firstName} {patient.lastName}
                        </h3>
                        <p className="text-[11px] text-slate-400">ID: #{String(patient.id).slice(0, 8)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{patient.email}</span>
                    </div>
                    {patient.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{patient.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>
                        Total Visits: <strong className="text-slate-800">{patient.totalVisits}</strong>
                      </span>
                    </div>
                    {patient.lastVisit && (
                      <div className="flex items-center gap-2">
                        <HeartPulse className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span>Last Consultation: {patient.lastVisit}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedPatient(patient)}
                      className="flex-1 text-xs font-bold text-violet-700 border-violet-200 hover:bg-violet-50 rounded-xl gap-1 h-8"
                    >
                      <Sparkles className="h-3.5 w-3.5" /> AI Summary
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleOpenPrescribe(patient.id, `${patient.firstName} ${patient.lastName}`)}
                      className="flex-1 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl gap-1 h-8"
                    >
                      <Clipboard className="h-3.5 w-3.5" /> Prescribe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Patient AI Briefing Dialog */}
        <Dialog open={!!selectedPatient} onOpenChange={(open) => !open && setSelectedPatient(null)}>
          <DialogContent className="sm:max-w-xl rounded-3xl p-6">
            <DialogHeader className="border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-bold text-slate-900">
                    {selectedPatient?.firstName} {selectedPatient?.lastName}
                  </DialogTitle>
                  <p className="text-xs text-slate-500">Longitudinal Clinical Health Records</p>
                </div>
              </div>
            </DialogHeader>

            {selectedPatient && (
              <div className="space-y-4 py-2">
                <DoctorPatientBriefingCard patientId={selectedPatient.id ? (isNaN(Number(selectedPatient.id)) ? 1 : Number(selectedPatient.id)) : 1} />

                <div className="pt-3 border-t flex justify-end gap-2">
                  <Button
                    onClick={() => {
                      const p = selectedPatient;
                      setSelectedPatient(null);
                      handleOpenPrescribe(p.id, `${p.firstName} ${p.lastName}`);
                    }}
                    className="bg-violet-600 hover:bg-violet-700 text-white font-bold gap-1.5 rounded-xl text-xs"
                  >
                    <Clipboard className="h-4 w-4" /> Issue Prescription for Patient
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
          defaultPatientId={targetPatientId ? (isNaN(Number(targetPatientId)) ? 1 : Number(targetPatientId)) : 1}
          patientName={targetPatientName}
        />
      </div>
    </DashboardLayout>
  );
}

export default DoctorPatients;
