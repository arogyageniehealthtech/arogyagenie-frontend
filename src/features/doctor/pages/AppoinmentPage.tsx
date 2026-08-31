import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useListDoctorAppointments, useUpdateAppointment, getListDoctorAppointmentsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  ClipboardList as Clipboard,
  Filter,
  Plus,
  Search,
  Video,
  Clock,
  MapPin,
  Stethoscope,
  AlertCircle,
} from "lucide-react";
import { DashboardLayout } from "@/features/doctor/component/DoctorLayout";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/features/patient/hooks/use-toast";
import { PrescribeModal } from "../components/PrescribeModal";

export function DoctorAppointments() {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Cancel Dialog state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [targetCancelId, setTargetCancelId] = useState<string | number | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  // Prescribe modal state
  const [prescribeOpen, setPrescribeOpen] = useState(false);
  const [targetPatientId, setTargetPatientId] = useState<string | number | undefined>(undefined);
  const [targetAppointmentId, setTargetAppointmentId] = useState<string | number | undefined>(undefined);
  const [targetPatientName, setTargetPatientName] = useState<string | null>(null);

  const queryParams = {
    status: selectedStatus === "all" ? undefined : selectedStatus,
    type: selectedType === "all" ? undefined : selectedType,
    date: selectedDate ? selectedDate : undefined,
  };

  const { data: appointments, isLoading } = useListDoctorAppointments(queryParams);
  const updateAppointment = useUpdateAppointment();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleOpenPrescribe = (patientId: string | number, appointmentId?: string | number, patientName?: string | null) => {
    setTargetPatientId(patientId);
    setTargetAppointmentId(appointmentId);
    setTargetPatientName(patientName ?? null);
    setPrescribeOpen(true);
  };

  const handleAction = (id: string | number, action: "confirm" | "complete" | "check-in" | "cancel") => {
    if (action === "cancel") {
      setTargetCancelId(id);
      setCancelReason("");
      setCancelModalOpen(true);
      return;
    }

    updateAppointment.mutate(
      { id, action, data: { status: action } },
      {
        onSuccess: () => {
          toast({
            title: "Appointment Updated",
            description: `Appointment marked as ${action}.`,
          });
          queryClient.invalidateQueries({ queryKey: getListDoctorAppointmentsQueryKey() });
        },
        onError: (err) => {
          toast({
            title: "Action Failed",
            description: err instanceof Error ? err.message : "Error executing action",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleConfirmCancel = () => {
    if (!targetCancelId) return;

    updateAppointment.mutate(
      {
        id: targetCancelId,
        action: "cancel",
        data: { status: "cancelled", cancelReason: cancelReason || "Doctor cancelled schedule" },
      },
      {
        onSuccess: () => {
          toast({
            title: "Appointment Cancelled",
            description: "The appointment was cancelled.",
          });
          setCancelModalOpen(false);
          queryClient.invalidateQueries({ queryKey: getListDoctorAppointmentsQueryKey() });
        },
        onError: (err) => {
          toast({
            title: "Cancellation Failed",
            description: err instanceof Error ? err.message : "Error cancelling appointment",
            variant: "destructive",
          });
        },
      }
    );
  };

  const filteredAppointments = appointments?.filter((apt) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const pName = (apt.patientName ?? "").toLowerCase();
    const symptoms = (apt.symptoms ?? "").toLowerCase();
    return pName.includes(q) || symptoms.includes(q) || String(apt.patientId).includes(q);
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Stethoscope className="h-7 w-7 text-violet-600" />
              Doctor Consultations & Appointments
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Review booked visits, launch video telehealth rooms, confirm slots, and write digital prescriptions.
            </p>
          </div>
          <Button
            onClick={() => handleOpenPrescribe(1)}
            className="bg-violet-600 hover:bg-violet-700 text-white font-bold gap-2 rounded-xl shadow-md h-10 shrink-0"
          >
            <Plus className="h-4 w-4" /> Issue Prescription
          </Button>
        </div>

        {/* Filter Controls Bar */}
        <Card className="rounded-2xl border-slate-200/80 shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search patient name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-xs sm:text-sm rounded-xl border-slate-200"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
                {/* Status */}
                <div className="flex items-center gap-1.5">
                  <Filter className="h-4 w-4 text-slate-400 shrink-0" />
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[140px] text-xs rounded-xl">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                      <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                      <SelectItem value="CHECKED_IN">Checked-In</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Consultation Type */}
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[130px] text-xs rounded-xl">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="VIDEO">Video Call</SelectItem>
                    <SelectItem value="IN_PERSON">In-Person</SelectItem>
                  </SelectContent>
                </Select>

                {/* Date Picker */}
                <div className="flex items-center gap-1.5">
                  <CalendarIcon className="h-4 w-4 text-slate-400 shrink-0" />
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-[150px] text-xs rounded-xl border-slate-200"
                  />
                  {selectedDate && (
                    <Button variant="ghost" size="sm" onClick={() => setSelectedDate("")} className="text-xs h-8 px-2">
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        {isLoading ? (
          <div className="py-20 text-center text-slate-400 font-medium space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent mx-auto" />
            <p>Loading appointments from server...</p>
          </div>
        ) : filteredAppointments?.length === 0 ? (
          <Card className="rounded-2xl border-slate-200/80">
            <CardContent className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-2">
              <CalendarIcon className="h-12 w-12 text-slate-300 mb-2" />
              <p className="text-base font-bold text-slate-700">No appointments found</p>
              <p className="text-xs text-slate-400 max-w-sm text-center">
                There are no consultation bookings matching your current filter criteria.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAppointments?.map((apt) => {
              const isVideo = apt.type.toUpperCase().includes("VIDEO");
              const isScheduled = apt.status === "SCHEDULED" || apt.status === "pending";
              const isConfirmed = apt.status === "CONFIRMED" || apt.status === "confirmed";
              const isCompleted = apt.status === "COMPLETED" || apt.status === "completed";
              const isCancelled = apt.status === "CANCELLED" || apt.status === "cancelled";

              return (
                <Card
                  key={apt.id}
                  className="rounded-2xl border-slate-200 shadow-xs hover:shadow-md hover:border-violet-300 transition-all overflow-hidden"
                >
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Top Row: Patient Info + Status + Fee */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-extrabold text-lg text-slate-900">
                            {apt.patientName ? apt.patientName : `Patient #${String(apt.patientId).slice(0, 6)}`}
                          </h3>
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-bold uppercase tracking-wider py-0.5 px-2.5 rounded-full ${
                              isConfirmed
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : isCompleted
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : isCancelled
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {apt.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                          <span className="font-semibold text-slate-800">
                            {apt.appointmentDate} at {apt.appointmentTime}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-medium text-slate-600">
                            {isVideo ? <Video className="h-3.5 w-3.5 text-violet-600" /> : <MapPin className="h-3.5 w-3.5 text-slate-400" />}
                            {isVideo ? "Video Telehealth" : "In-Person Clinic Visit"}
                          </span>
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-xs text-slate-400 block font-medium">Consultation Fee</span>
                        <span className="text-sm font-extrabold text-slate-900">₹{apt.consultationFee ?? 500}</span>
                      </div>
                    </div>

                    {/* Symptoms / Notes */}
                    {apt.symptoms && (
                      <div className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-700">
                        <strong className="text-slate-900 font-bold mr-1">Reported Symptoms:</strong>
                        {apt.symptoms}
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      {/* Video Room Button */}
                      {isVideo && !isCancelled && (
                        <Button
                          size="sm"
                          onClick={() => navigate(`/doctor/video-call/${apt.id}`)}
                          className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs gap-1.5 rounded-xl shadow-md h-8 px-3.5"
                        >
                          <Video className="h-3.5 w-3.5" /> Join Video Call
                        </Button>
                      )}

                      {/* Confirm Appointment */}
                      {isScheduled && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction(apt.id, "confirm")}
                          disabled={updateAppointment.isPending}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 text-xs font-bold gap-1 rounded-xl h-8"
                        >
                          <CheckCircle className="h-3.5 w-3.5" /> Confirm
                        </Button>
                      )}

                      {/* Check in */}
                      {isConfirmed && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction(apt.id, "check-in")}
                          disabled={updateAppointment.isPending}
                          className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border-indigo-200 text-xs font-bold gap-1 rounded-xl h-8"
                        >
                          <Clock className="h-3.5 w-3.5" /> Check-In
                        </Button>
                      )}

                      {/* Complete */}
                      {!isCompleted && !isCancelled && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction(apt.id, "complete")}
                          disabled={updateAppointment.isPending}
                          className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200 text-xs font-bold gap-1 rounded-xl h-8"
                        >
                          <CheckCircle className="h-3.5 w-3.5" /> Mark Completed
                        </Button>
                      )}

                      {/* Cancel */}
                      {!isCancelled && !isCompleted && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction(apt.id, "cancel")}
                          disabled={updateAppointment.isPending}
                          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 text-xs font-bold gap-1 rounded-xl h-8"
                        >
                          <XCircle className="h-3.5 w-3.5" /> Cancel
                        </Button>
                      )}

                      {/* Prescription */}
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleOpenPrescribe(apt.patientId, apt.id, apt.patientName)}
                        className="ml-auto text-slate-800 bg-slate-100 hover:bg-slate-200 text-xs font-bold gap-1.5 rounded-xl h-8"
                      >
                        <Clipboard className="h-3.5 w-3.5 text-violet-600" /> Issue Prescription
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Cancellation Reason Modal */}
        <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
          <DialogContent className="sm:max-w-md rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-rose-500" /> Cancel Appointment
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2 text-xs">
              <p className="text-slate-600">
                Please enter the reason for cancelling this patient consultation:
              </p>
              <Input
                placeholder="e.g. Doctor emergency leave / Reschedule needed"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setCancelModalOpen(false)} className="rounded-xl">
                Keep Appointment
              </Button>
              <Button onClick={handleConfirmCancel} className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl">
                Confirm Cancellation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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

export default DoctorAppointments;
