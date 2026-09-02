import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGetDoctorDashboard, useUpdateAppointment, getGetDoctorDashboardQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  Clock,
  Clipboard,
  CheckCircle,
  Plus,
  Video,
  ArrowRight,
  Stethoscope,
  Sparkles,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { DashboardLayout } from "@/features/doctor/component/DoctorLayout";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/features/patient/hooks/use-toast";
import { PrescribeModal } from "../components/PrescribeModal";

export function DoctorDashboard() {
  const navigate = useNavigate();
  const { data: dashboard, isLoading } = useGetDoctorDashboard();
  const updateAppointment = useUpdateAppointment();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Prescribe modal state
  const [prescribeOpen, setPrescribeOpen] = useState(false);
  const [targetPatientId, setTargetPatientId] = useState<string | number | undefined>(undefined);
  const [targetAppointmentId, setTargetAppointmentId] = useState<string | number | undefined>(undefined);
  const [targetPatientName, setTargetPatientName] = useState<string | null>(null);

  const handleOpenPrescribe = (patientId: string | number, appointmentId?: string | number, patientName?: string | null) => {
    setTargetPatientId(patientId);
    setTargetAppointmentId(appointmentId);
    setTargetPatientName(patientName ?? null);
    setPrescribeOpen(true);
  };

  const handleUpdateStatus = (id: string | number, status: "confirmed" | "completed" | "cancelled" | "check-in") => {
    updateAppointment.mutate(
      { id, action: status as any, data: { status } },
      {
        onSuccess: () => {
          toast({
            title: "Appointment Updated",
            description: `Appointment marked as ${status}.`,
          });
          queryClient.invalidateQueries({ queryKey: getGetDoctorDashboardQueryKey() });
        },
        onError: (err) => {
          toast({
            title: "Update Failed",
            description: err instanceof Error ? err.message : "Failed to update status",
            variant: "destructive",
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center py-20 sm:py-28 text-slate-500 font-medium">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
            <p className="text-sm">Loading Doctor Dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const firstName = dashboard?.firstName?.trim() || dashboard?.userName?.trim().split(" ")[0] || "Doctor";
  const upcomingList = dashboard?.upcomingAppointments || [];

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 pb-12 font-sans min-w-0">
        {/* Top Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#18103A] via-[#2A1B5E] to-[#432A9A] p-4 sm:p-6 md:p-8 text-white shadow-xl min-w-0">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-2 min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-violet-200 border border-white/10">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>Verified Clinical Portal</span>
              </div>
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight truncate">
                Welcome, Dr. {firstName}
              </h1>
              <p className="text-violet-200 text-xs sm:text-sm max-w-xl leading-relaxed">
                Review your daily consultations, manage telehealth sessions, and issue digital prescriptions securely.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
              <Button
                onClick={() => handleOpenPrescribe(1)}
                className="flex-1 sm:flex-initial bg-violet-500 hover:bg-violet-600 text-white font-bold gap-2 rounded-xl shadow-lg h-10 sm:h-11 px-4 sm:px-5 text-xs sm:text-sm"
              >
                <Plus className="h-4 w-4 shrink-0" /> Issue Prescription
              </Button>
              <Link to="/doctor/schedule" className="flex-1 sm:flex-initial">
                <Button variant="outline" className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold rounded-xl h-10 sm:h-11 px-3.5 sm:px-4 text-xs sm:text-sm">
                  <Calendar className="h-4 w-4 shrink-0" /> Schedule
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="rounded-2xl border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-5">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Today's Schedule</CardTitle>
              <div className="h-8 w-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                <Calendar className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 pt-0 sm:pt-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{dashboard?.todayAppointments ?? 0}</div>
              <p className="text-xs text-slate-400 mt-1">Booked for today</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-5">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Actions</CardTitle>
              <div className="h-8 w-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Clock className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 pt-0 sm:pt-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{dashboard?.pendingAppointments ?? 0}</div>
              <p className="text-xs text-slate-400 mt-1">Awaiting confirmation</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-5">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Patients</CardTitle>
              <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Users className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 pt-0 sm:pt-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{dashboard?.totalPatients ?? 0}</div>
              <p className="text-xs text-slate-400 mt-1">Registered under care</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-5">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Prescriptions Issued</CardTitle>
              <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Clipboard className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 pt-0 sm:pt-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{dashboard?.totalPrescriptions ?? 0}</div>
              <p className="text-xs text-slate-400 mt-1">Digital e-prescriptions</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid: Consultations & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Appointments List */}
          <Card className="lg:col-span-2 rounded-2xl border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100 flex flex-row items-center justify-between p-4 sm:p-6">
              <div className="min-w-0">
                <CardTitle className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2 truncate">
                  <Stethoscope className="h-5 w-5 text-violet-600 shrink-0" />
                  <span>Today's Consultations</span>
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5 truncate">Live consultations queue and patient check-ins.</p>
              </div>
              <Link to="/doctor/appointments" className="text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1 shrink-0 ml-2">
                <span>View All</span> <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>

            <CardContent className="p-3 sm:p-6">
              {upcomingList.length === 0 ? (
                <div className="text-center py-12 sm:py-16 text-slate-400 space-y-2">
                  <Calendar className="h-10 w-10 mx-auto text-slate-300" />
                  <p className="font-semibold text-slate-600 text-sm">No scheduled appointments for today.</p>
                  <p className="text-xs">Upcoming patient bookings will appear here in real-time.</p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {upcomingList.map((apt) => {
                    const isVideo = apt.type.toUpperCase().includes("VIDEO");
                    const isScheduled = apt.status === "SCHEDULED" || apt.status === "pending";
                    const isConfirmed = apt.status === "CONFIRMED" || apt.status === "confirmed";

                    return (
                      <div
                        key={apt.id}
                        className="p-3.5 sm:p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-violet-300 hover:shadow-md transition-all space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-sm sm:text-base text-slate-900 truncate">
                                {apt.patientName || `Patient #${String(apt.patientId).slice(0, 6)}`}
                              </h3>
                              <Badge
                                variant="outline"
                                className={`text-[10px] uppercase font-bold py-0.5 ${
                                  isConfirmed
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : apt.status === "COMPLETED" || apt.status === "completed"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : apt.status === "CANCELLED" || apt.status === "cancelled"
                                    ? "bg-rose-50 text-rose-700 border-rose-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                }`}
                              >
                                {apt.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-slate-700">{apt.appointmentDate} at {apt.appointmentTime}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1 font-medium text-slate-600">
                                {isVideo ? <Video className="h-3.5 w-3.5 text-violet-600 shrink-0" /> : <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />}
                                {isVideo ? "Video Consultation" : "In-Person Visit"}
                              </span>
                            </p>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap pt-1 sm:pt-0">
                            {/* If Video Consultation -> Launch Video Call */}
                            {isVideo && apt.status !== "CANCELLED" && apt.status !== "cancelled" && (
                              <Button
                                size="sm"
                                onClick={() => navigate(`/doctor/video-call/${apt.id}`)}
                                className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold gap-1.5 rounded-xl shadow-sm h-8 px-3"
                              >
                                <Video className="h-3.5 w-3.5 shrink-0" /> Start Call
                              </Button>
                            )}

                            {isScheduled && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateStatus(apt.id, "confirmed")}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs font-bold gap-1 rounded-xl h-8 px-2.5"
                              >
                                <CheckCircle className="h-3.5 w-3.5 shrink-0" /> Confirm
                              </Button>
                            )}

                            {apt.status !== "COMPLETED" && apt.status !== "completed" && apt.status !== "CANCELLED" && apt.status !== "cancelled" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUpdateStatus(apt.id, "completed")}
                                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-xs font-bold gap-1 rounded-xl h-8 px-2.5"
                              >
                                <CheckCircle className="h-3.5 w-3.5 shrink-0" /> Complete
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleOpenPrescribe(apt.patientId, apt.id, apt.patientName)}
                              className="text-slate-700 hover:bg-slate-100 text-xs font-bold gap-1 rounded-xl h-8 px-2.5"
                            >
                              <Clipboard className="h-3.5 w-3.5 shrink-0" /> Prescribe
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Doctor Tools & AI Features */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="rounded-2xl border-slate-200 shadow-sm p-4 sm:p-5 space-y-3.5">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">AI Clinical Assistant</h4>
                  <p className="text-xs text-slate-500">Auto-briefing & OCR transcription</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Use AI OCR inside the prescription modal to scan handwritten prescriptions or auto-generate clinical insights during patient consultations.
              </p>
              <Button
                onClick={() => handleOpenPrescribe(1)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl gap-2 shadow-sm"
              >
                <Plus className="h-3.5 w-3.5 shrink-0" /> New Digital Prescription
              </Button>
            </Card>

            <Card className="rounded-2xl border-slate-200 shadow-sm p-4 sm:p-5 space-y-3">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-violet-600 shrink-0" /> Availability & Hours
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Keep your working days, consultation fees, and facility affiliations up to date.
              </p>
              <Link to="/doctor/schedule" className="block pt-1">
                <Button variant="outline" className="w-full text-xs font-bold text-violet-700 border-violet-200 hover:bg-violet-50 rounded-xl">
                  Manage Availability Slots
                </Button>
              </Link>
            </Card>
          </div>
        </div>

        {/* Prescription Modal */}
        <PrescribeModal
          isOpen={prescribeOpen}
          onClose={() => setPrescribeOpen(false)}
          defaultPatientId={targetPatientId ? (isNaN(Number(targetPatientId)) ? 1 : Number(targetPatientId)) : 1}
          defaultAppointmentId={targetAppointmentId ? (isNaN(Number(targetAppointmentId)) ? 1 : Number(targetAppointmentId)) : 1}
          patientName={targetPatientName}
        />
      </div>
    </DashboardLayout>
  );
}

export default DoctorDashboard;
