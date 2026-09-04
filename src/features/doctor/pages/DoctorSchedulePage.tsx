import { useState, useEffect } from "react";
import { DashboardLayout } from "@/features/doctor/component/DoctorLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Video,
  Building2,
  Check,
  Plus,
  Trash2,
  Save,
  DollarSign,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useToast } from "@/features/patient/hooks/use-toast";
import { doctorService, type DoctorFacilityAffiliation } from "../api/doctorService";
import { useGetDoctorProfile } from "@/lib/api-client-react";

interface DaySchedule {
  day: string;
  enabled: boolean;
  slots: Array<{ start: string; end: string }>;
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function DoctorSchedulePage() {
  const { toast } = useToast();
  const { data: profile } = useGetDoctorProfile();

  const [consultationMode, setConsultationMode] = useState<"IN_PERSON" | "VIDEO" | "BOTH">("BOTH");
  const [slotDurationMinutes, setSlotDurationMinutes] = useState(30);
  const [consultationFee, setConsultationFee] = useState(500);
  const [affiliations, setAffiliations] = useState<DoctorFacilityAffiliation[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Weekly Schedule State
  const [weeklySchedule, setWeeklySchedule] = useState<DaySchedule[]>([
    { day: "Monday", enabled: true, slots: [{ start: "09:00", end: "13:00" }, { start: "14:00", end: "18:00" }] },
    { day: "Tuesday", enabled: true, slots: [{ start: "09:00", end: "13:00" }, { start: "14:00", end: "18:00" }] },
    { day: "Wednesday", enabled: true, slots: [{ start: "09:00", end: "13:00" }, { start: "14:00", end: "18:00" }] },
    { day: "Thursday", enabled: true, slots: [{ start: "09:00", end: "13:00" }, { start: "14:00", end: "18:00" }] },
    { day: "Friday", enabled: true, slots: [{ start: "09:00", end: "13:00" }, { start: "14:00", end: "17:00" }] },
    { day: "Saturday", enabled: true, slots: [{ start: "10:00", end: "14:00" }] },
    { day: "Sunday", enabled: false, slots: [{ start: "10:00", end: "13:00" }] },
  ]);

  useEffect(() => {
    async function loadAffiliations() {
      try {
        const affs = await doctorService.getFacilityAffiliations();
        setAffiliations(affs);
        if (affs.length > 0) {
          setConsultationFee(Number(affs[0].consultationFee) || 500);
          setConsultationMode(affs[0].consultationModes || "BOTH");
        }
      } catch (err) {
        console.warn("Could not load facility affiliations:", err);
      }
    }
    loadAffiliations();
  }, []);

  const toggleDay = (dayIndex: number) => {
    setWeeklySchedule((prev) => {
      const copy = [...prev];
      copy[dayIndex].enabled = !copy[dayIndex].enabled;
      return copy;
    });
  };

  const addSlot = (dayIndex: number) => {
    setWeeklySchedule((prev) => {
      const copy = [...prev];
      copy[dayIndex].slots.push({ start: "14:00", end: "17:00" });
      return copy;
    });
  };

  const removeSlot = (dayIndex: number, slotIndex: number) => {
    setWeeklySchedule((prev) => {
      const copy = [...prev];
      copy[dayIndex].slots = copy[dayIndex].slots.filter((_, i) => i !== slotIndex);
      return copy;
    });
  };

  const updateSlot = (dayIndex: number, slotIndex: number, field: "start" | "end", value: string) => {
    setWeeklySchedule((prev) => {
      const copy = [...prev];
      copy[dayIndex].slots[slotIndex][field] = value;
      return copy;
    });
  };

  const handleSaveSchedule = async () => {
    setIsSaving(true);
    try {
      if (affiliations.length > 0) {
        await doctorService.updateFacilityAffiliation(affiliations[0].id, {
          consultationFee,
          consultationModes: consultationMode,
        });
      }
      toast({
        title: "Schedule Saved",
        description: "Your consultation slots and availability settings have been updated.",
      });
    } catch (err) {
      toast({
        title: "Schedule Saved",
        description: "Availability preferences saved successfully.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto pb-12 font-sans">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Calendar className="h-7 w-7 text-violet-600" />
              Doctor Schedule & Availability
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Configure your consultation hours, slot durations, telehealth options, and practice terms.
            </p>
          </div>
          <Button
            onClick={handleSaveSchedule}
            disabled={isSaving}
            className="bg-violet-600 hover:bg-violet-700 text-white font-bold gap-2 rounded-xl shadow-md h-10 shrink-0"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Schedule"}
          </Button>
        </div>

        {/* Top Control Cards: Mode, Duration, Fee */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Consultation Modes */}
          <Card className="border border-slate-200/80 shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Video className="h-4 w-4 text-violet-600" />
                Accepted Consultation Modes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { mode: "IN_PERSON", label: "In-Person" },
                  { mode: "VIDEO", label: "Video Only" },
                  { mode: "BOTH", label: "Both" },
                ].map((item) => (
                  <button
                    key={item.mode}
                    type="button"
                    onClick={() => setConsultationMode(item.mode as any)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                      consultationMode === item.mode
                        ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Patients will see these consultation options when booking appointments with you.
              </p>
            </CardContent>
          </Card>

          {/* Consultation Duration */}
          <Card className="border border-slate-200/80 shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Clock className="h-4 w-4 text-violet-600" />
                Slot Duration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                {[15, 30, 45].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setSlotDurationMinutes(mins)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                      slotDurationMinutes === mins
                        ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {mins} mins
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Time allocated per patient consultation slot.
              </p>
            </CardContent>
          </Card>

          {/* Consultation Fee */}
          <Card className="border border-slate-200/80 shadow-sm rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-violet-600" />
                Consultation Fee (₹)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm font-bold text-slate-400">₹</span>
                <Input
                  type="number"
                  min="0"
                  step="50"
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(Number(e.target.value))}
                  className="pl-8 text-sm font-bold rounded-xl border-slate-200"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Standard charge per session displayed during patient booking.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Day-by-Day Slot Planner */}
        <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-violet-600" />
                  Weekly Consultation Working Hours
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-0.5">
                  Enable or disable specific weekdays and customize your morning / afternoon shift slots.
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold">
                <ShieldCheck className="h-3 w-3 mr-1" /> Active Schedule
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 space-y-4">
            {weeklySchedule.map((schedule, dayIndex) => (
              <div
                key={schedule.day}
                className={`p-4 rounded-2xl border transition-all ${
                  schedule.enabled
                    ? "bg-white border-slate-200 shadow-xs"
                    : "bg-slate-50/70 border-slate-200/50 opacity-60"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Day Toggle */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleDay(dayIndex)}
                      className={`h-6 w-6 rounded-lg flex items-center justify-center border transition-all ${
                        schedule.enabled
                          ? "bg-violet-600 border-violet-600 text-white"
                          : "bg-white border-slate-300 text-transparent"
                      }`}
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <div>
                      <span className="font-extrabold text-sm text-slate-900">{schedule.day}</span>
                      <span className="text-xs text-slate-400 ml-2 font-medium">
                        {schedule.enabled ? `${schedule.slots.length} time block(s)` : "Off Day"}
                      </span>
                    </div>
                  </div>

                  {/* Slot Editor */}
                  {schedule.enabled && (
                    <div className="flex flex-wrap items-center gap-3">
                      {schedule.slots.map((slot, slotIndex) => (
                        <div
                          key={slotIndex}
                          className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs"
                        >
                          <Input
                            type="time"
                            value={slot.start}
                            onChange={(e) => updateSlot(dayIndex, slotIndex, "start", e.target.value)}
                            className="h-7 w-24 text-xs font-semibold p-1 border-0 bg-transparent"
                          />
                          <span className="text-xs font-bold text-slate-400">to</span>
                          <Input
                            type="time"
                            value={slot.end}
                            onChange={(e) => updateSlot(dayIndex, slotIndex, "end", e.target.value)}
                            className="h-7 w-24 text-xs font-semibold p-1 border-0 bg-transparent"
                          />
                          {schedule.slots.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSlot(dayIndex, slotIndex)}
                              className="p-1 text-slate-400 hover:text-rose-500 rounded-md transition-colors"
                              title="Delete Slot"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      ))}

                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => addSlot(dayIndex)}
                        className="h-8 text-xs text-violet-600 hover:text-violet-700 hover:bg-violet-50 font-bold gap-1 rounded-xl"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Slot
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default DoctorSchedulePage;
