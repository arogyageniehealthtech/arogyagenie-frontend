import { useState, useEffect } from "react";
import { useGetPatientDashboard, customFetch } from "@workspace/api-client-react";
import {
  Calendar,
  FileText,
  Pill,
  Clipboard,
  ArrowRight,
  Clock,
  Stethoscope,
  TestTube,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes.constants";
import { HealthSummaryCard } from "../../../components/health/HealthSummaryCard";
import { HealthEpisodeTracker } from "../../../components/health/HealthEpisodeTracker";
import { LabTrendVisualizer } from "../../../components/health/LabTrendVisualizer";
import { OneClickDeliveryCard, type MedicineOrderItem } from "@/components/delivery/OneClickDeliveryCard";

// ─── Skeleton Loading Shimmer ────────────────────────────────────────────────
function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-xl skeleton-shimmer bg-slate-200/70 animate-pulse ${className}`}
      style={{ minHeight: "1rem" }}
    />
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-4.5">
      <div className="rounded-2xl p-3.5 md:p-5 lg:p-5.5 space-y-2.5" style={{ background: "rgba(59,63,191,0.08)" }}>
        <SkeletonBlock className="h-6 md:h-7 w-36 md:w-48" />
        <SkeletonBlock className="h-3.5 md:h-4 w-44 md:w-64" />
      </div>
      <div className="grid grid-cols-4 gap-1.5 md:gap-3 lg:gap-3.5">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-lg md:rounded-2xl p-2.5 md:p-4 bg-white shadow-xs border border-slate-100 flex flex-col justify-between min-h-[64px] sm:min-h-[72px] md:min-h-[96px]"
          >
            <SkeletonBlock className="h-4 md:h-7 w-6 md:w-12 mb-1" />
            <SkeletonBlock className="h-2.5 md:h-3.5 w-10 md:w-20" />
          </div>
        ))}
      </div>
      <SkeletonBlock className="h-32 md:h-40 w-full" />
      <SkeletonBlock className="h-44 md:h-56 w-full" />
    </div>
  );
}

// ─── Stat Card (Increased Height, Balanced Vertical Spacing) ─────────────────
interface StatCardProps {
  label: string;
  value: number | string;
  gradient: string;
  href: string;
}

function StatCard({ label, value, gradient, href }: StatCardProps) {
  return (
    <Link to={href} className="w-full">
      <div
        className="card-hover relative bg-white rounded-lg md:rounded-2xl p-2 sm:p-2.5 md:p-4 lg:p-5 cursor-pointer group overflow-hidden border border-slate-100 shadow-xs h-full min-h-[64px] sm:min-h-[72px] md:min-h-[96px] lg:min-h-[106px] flex flex-col justify-between"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-0.5 md:h-1 rounded-t-lg md:rounded-t-2xl"
          style={{ background: gradient }}
        />

        {/* Mobile View (< md): Taller card with centered vertical rhythm */}
        <div className="flex md:hidden flex-col items-center justify-center text-center h-full my-auto py-0.5 min-w-0">
          <div className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 leading-none mb-1">
            {value}
          </div>
          <div className="text-[7.5px] sm:text-[8.5px] font-medium text-slate-700 leading-[1.15] w-full text-center px-0.5 break-words line-clamp-2">
            {label}
          </div>
        </div>

        {/* Tablet, Laptop & Desktop View (>= md): Generous vertical breathing room */}
        <div className="hidden md:flex md:flex-col md:justify-between h-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] lg:text-xs font-semibold text-slate-700">
              {label}
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-0.5" />
          </div>

          <div className="text-2xl lg:text-[26px] font-extrabold tracking-tight text-slate-900 leading-tight">
            {value}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Section Heading ──────────────────────────────────────────────────────────
function SectionHeading({
  title,
  subtitle,
  actionLabel,
  actionHref,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex items-center md:items-end justify-between mb-1.5 md:mb-2.5 lg:mb-3">
      <div>
        <h2 className="text-xs md:text-sm lg:text-base font-bold text-slate-900 tracking-tight">{title}</h2>
        {subtitle && <p className="text-[10px] md:text-xs text-slate-500 hidden md:block mt-0.5">{subtitle}</p>}
      </div>
      {actionLabel && actionHref && (
        <Link to={actionHref}>
          <span
            className="text-[10px] md:text-xs font-semibold flex items-center gap-0.5 md:gap-1 transition-colors hover:opacity-80"
            style={{ color: "hsl(238,53%,49%)" }}
          >
            {actionLabel} <ArrowRight className="h-2.5 w-2.5 md:h-3 md:w-3" />
          </span>
        </Link>
      )}
    </div>
  );
}

// ─── Quick Action Button ──────────────────────────────────────────────────────
function QuickAction({ label, icon: Icon, href }: { label: string; icon: React.ElementType; href: string }) {
  return (
    <Link to={href}>
      <div
        className="flex items-center justify-center gap-1 md:gap-1.5 px-2 md:px-3 lg:px-3.5 py-1 md:py-1.5 rounded-lg md:rounded-xl text-[9px] md:text-xs font-semibold transition-all duration-150 cursor-pointer hover:opacity-90 active:scale-95 text-center shrink-0"
        style={{
          background: "rgba(255,255,255,0.18)",
          color: "white",
          border: "1px solid rgba(255,255,255,0.22)",
          backdropFilter: "blur(4px)",
        }}
      >
        <Icon className="h-2.5 w-2.5 md:h-3.5 md:w-3.5 shrink-0" />
        <span className="truncate">{label}</span>
      </div>
    </Link>
  );
}

// ─── Main Dashboard Component ─────────────────────────────────────────────────
export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: dashboard, isLoading } = useGetPatientDashboard();
  const [orders, setOrders] = useState<MedicineOrderItem[]>([]);

  const fetchOrders = async () => {
    try {
      const data = await customFetch<MedicineOrderItem[]>("/medicine-orders");
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to fetch medicine orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 8000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <DashboardSkeleton />;
  if (!dashboard) return null;

  const firstName = dashboard.firstName?.trim() || dashboard.userName?.trim().split(" ")[0] || "Patient";
  const today = new Date();
  const fullDateStr = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const shortDateStr = today.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const activeOrAcceptedOrders = (orders || []).filter((o) =>
    ["accepted", "delivery_confirmed", "packing", "out_for_delivery"].includes(o?.status)
  );

  const recentAppointments = Array.isArray(dashboard.recentAppointments) ? dashboard.recentAppointments : [];
  const activeMedicineReminders = Array.isArray(dashboard.activeMedicineReminders) ? dashboard.activeMedicineReminders : [];

  const statCards: StatCardProps[] = [
    {
      label: "Appointments",
      value: dashboard.upcomingAppointments ?? 0,
      gradient: "linear-gradient(135deg, hsl(238,60%,56%), hsl(238,50%,48%))",
      href: "/patient/appointments",
    },
    {
      label: "Prescriptions",
      value: dashboard.totalPrescriptions ?? 0,
      gradient: "linear-gradient(135deg, hsl(158,60%,38%), hsl(158,55%,32%))",
      href: "/patient/prescriptions",
    },
    {
      label: "Lab Reports",
      value: dashboard.totalLabReports ?? 0,
      gradient: "linear-gradient(135deg, hsl(260,60%,56%), hsl(260,50%,48%))",
      href: "/patient/lab-reports",
    },
    {
      label: "Order Medicine",
      value: dashboard.totalPrescriptions ?? 0,
      gradient: "linear-gradient(135deg, hsl(26,80%,52%), hsl(26,75%,44%))",
      href: "/patient/prescriptions",
    },
  ];

  return (
    <div className="space-y-2.5 md:space-y-4 lg:space-y-5">

      {/* ── Welcome Hero & Health Score Banner ─────────────────────────────── */}
      <div
        className="relative rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden p-3 md:p-5 lg:p-6 text-white"
        style={{
          background: "linear-gradient(135deg, #18103A 0%, #20144F 50%, #2A1768 100%)",
          boxShadow: "0 8px 24px rgba(24, 16, 58, 0.35)",
        }}
      >
        <div
          className="absolute top-0 right-0 h-40 md:h-52 lg:h-60 w-40 md:w-52 lg:w-60 rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, #6C63FF 0%, transparent 70%)" }}
        />

        <div className="relative md:grid md:grid-cols-12 md:gap-4 lg:gap-6 items-center">
          
          {/* Greeting Info & Actions */}
          <div className="md:col-span-7 lg:col-span-8 space-y-1.5 md:space-y-2 lg:space-y-2.5">
            <div className="flex items-center justify-between md:justify-start gap-2">
              <p className="text-[9px] md:text-xs font-semibold tracking-wider uppercase text-violet-300/70">
                <span className="md:hidden">{shortDateStr}</span>
                <span className="hidden md:inline">{fullDateStr}</span>
              </p>

              {/* Mobile-only inline health score */}
              <div className="md:hidden flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/10 border border-white/15">
                <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] font-bold text-white">85</span>
                <span className="text-[8px] text-emerald-300 font-medium">Health</span>
              </div>
            </div>

            <h1 className="text-base md:text-2xl lg:text-[28px] font-extrabold tracking-tight text-white leading-tight">
              Good Morning, {firstName}
            </h1>
            <p className="text-[10px] md:text-xs lg:text-[13px] text-violet-200/80 leading-tight md:leading-snug max-w-xl">
              <span className="md:hidden">Overview, vitals, and health insights.</span>
              <span className="hidden md:inline">Here is your health overview, live vitals tracking, and longitudinal health insights.</span>
            </p>

            <div className="grid grid-cols-3 md:flex md:flex-wrap gap-1 md:gap-2 pt-0.5 md:pt-1">
              <QuickAction label="Book Visit" icon={Calendar} href="/patient/appointments" />
              <QuickAction label="Find Doctor" icon={Stethoscope} href="/patient/doctors" />
              <QuickAction label="Book Test" icon={TestTube} href="/patient/diagnostic-bookings" />
            </div>
          </div>

          {/* Health Score Gauge */}
          <div className="hidden md:flex md:col-span-5 lg:col-span-4 justify-end w-full">
            <div className="bg-white/10 backdrop-blur-md rounded-xl lg:rounded-2xl p-3 lg:p-3.5 border border-white/15 flex items-center gap-3 shadow-md w-full max-w-[260px] lg:max-w-xs">
              <div className="relative h-14 w-14 lg:h-16 lg:w-16 shrink-0 flex items-center justify-center">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-white/10"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-400"
                    strokeDasharray="85, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-base lg:text-lg font-black text-white leading-none">85</span>
                  <span className="text-[8px] text-emerald-300 font-semibold leading-none mt-0.5">/100</span>
                </div>
              </div>

              <div className="min-w-0">
                <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30 mb-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Good Health
                </div>
                <h4 className="text-xs lg:text-sm font-bold text-white leading-tight">Health Score</h4>
                <p className="text-[10px] text-violet-200/70 truncate mt-0.5">Normal clinical range</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── AarogyaGenie AI Banner ── */}
        <div
          className="mt-2 md:mt-3.5 lg:mt-4 p-2 md:p-3 lg:p-3.5 rounded-lg md:rounded-xl lg:rounded-2xl border border-indigo-400/25 backdrop-blur-md relative overflow-hidden group transition-all duration-300 cursor-pointer md:cursor-default"
          onClick={() => {
            if (window.innerWidth < 768) {
              navigate(ROUTES.PATIENT.ASSISTANT);
            }
          }}
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(99, 102, 241, 0.14) 50%, rgba(6, 182, 212, 0.08) 100%)",
            boxShadow: "0 4px 18px rgba(15, 10, 45, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
          }}
        >
          <div className="relative flex items-center justify-between gap-2 md:gap-3.5">
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <div
                className="relative h-6 w-6 md:h-9 md:w-9 lg:h-10 lg:w-10 rounded-md md:rounded-xl flex items-center justify-center shrink-0 border border-white/30 shadow-md overflow-hidden"
                style={{
                  background: "radial-gradient(circle at 35% 30%, #38bdf8 0%, #6366f1 55%, #312e81 100%)",
                  boxShadow: "0 0 14px rgba(56, 189, 248, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.5)",
                }}
              >
                <Sparkles className="h-3 w-3 md:h-4.5 md:w-4.5 text-white animate-pulse" />
                <div className="absolute top-0.5 inset-x-1 h-1 rounded-full bg-white/40 blur-[0.5px] pointer-events-none" />
              </div>

              <div className="space-y-0.5 min-w-0">
                <h3 className="text-[10px] md:text-sm font-bold text-white tracking-tight flex items-center gap-1 truncate">
                  <span>✨</span>
                  <span className="md:hidden">AarogyaGenie AI</span>
                  <span className="hidden md:inline">Meet your new health companion</span>
                </h3>
                <p className="text-[8px] md:text-xs text-violet-200/80 leading-none md:leading-snug truncate md:line-clamp-1">
                  <span className="md:hidden">Ask about symptoms, prescriptions, and timeline.</span>
                  <span className="hidden md:inline">Ask AarogyaGenie AI about symptoms, health, wellness, and medical data.</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate(ROUTES.PATIENT.ASSISTANT)}
              className="md:hidden inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[9px] font-bold text-white shrink-0 cursor-pointer shadow-xs"
              style={{
                background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 50%, #06B6D4 100%)",
                border: "1px solid rgba(255, 255, 255, 0.35)",
              }}
            >
              <span>Ask AI</span>
              <ArrowRight className="h-2 w-2 text-white" />
            </button>

            <button
              type="button"
              id="explore-arogyagenie-ai-btn"
              onClick={(e) => {
                e.stopPropagation();
                window.dispatchEvent(new CustomEvent("open-ai-assistant"));
              }}
              className="hidden md:inline-flex group/btn relative items-center justify-center gap-1.5 px-3 py-1.5 lg:px-3.5 lg:py-2 rounded-lg md:rounded-xl text-xs font-bold text-white shrink-0 cursor-pointer overflow-hidden transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-md"
              style={{
                background: "linear-gradient(135deg, #6366F1 0%, #4F46E5 50%, #06B6D4 100%)",
                border: "1px solid rgba(255, 255, 255, 0.35)",
              }}
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-200 group-hover/btn:rotate-12 transition-transform duration-200" />
              <span>Explore AI</span>
              <ArrowRight className="h-3.5 w-3.5 text-white group-hover/btn:translate-x-0.5 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Active 1-Click Medicine Deliveries ── */}
      {activeOrAcceptedOrders.length > 0 && (
        <div className="space-y-2 md:space-y-3">
          {activeOrAcceptedOrders.map((order) => (
            <OneClickDeliveryCard key={order.id} order={order} onOrderUpdated={fetchOrders} />
          ))}
        </div>
      )}

      {/* ── Stat Cards (4 columns, taller cards with balanced height) ── */}
      <div>
        <SectionHeading title="Health Overview" subtitle="Your key health metrics at a glance" />
        <div className="grid grid-cols-4 gap-1.5 md:gap-3 lg:gap-3.5">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>
      </div>

      {/* ── Longitudinal AI Health Summary ── */}
      <div>
        <SectionHeading
          title="AI Health Summary"
          subtitle="Synthesized from your verified medical timeline"
        />
        <HealthSummaryCard />
      </div>

      {/* ── Health Episodes + Lab Trends ── */}
      <div className="space-y-2 md:space-y-3 lg:space-y-3.5">
        <HealthEpisodeTracker />
        <LabTrendVisualizer />
      </div>

      {/* ── Recent Appointments + Medicine Reminders ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3.5">
        
        {/* Recent Appointments */}
        <div
          className="bg-white rounded-xl md:rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)" }}
        >
          <div className="px-3 md:px-4 py-2 md:py-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-xs md:text-sm">Recent Appointments</h3>
              <p className="text-[10px] md:text-xs text-slate-500 mt-0.5 hidden md:block">Latest scheduled consultations</p>
            </div>
            <Link to="/patient/appointments">
              <span
                className="text-[10px] md:text-xs font-semibold flex items-center gap-0.5 md:gap-1 hover:opacity-80 transition-opacity"
                style={{ color: "hsl(238,53%,49%)" }}
              >
                View all <ArrowRight className="h-2.5 w-2.5 md:h-3 md:w-3" />
              </span>
            </Link>
          </div>
          <div className="p-2 md:p-3 space-y-1.5 md:space-y-2 lg:space-y-2.5">
            {recentAppointments.length === 0 ? (
              <div className="text-center py-4 md:py-6">
                <Calendar className="h-5 w-5 md:h-7 md:w-7 mx-auto mb-1 text-slate-300" />
                <p className="text-[11px] md:text-xs text-slate-400">No recent appointments.</p>
              </div>
            ) : (
              recentAppointments.slice(0, 3).map((apt: any) => {
                const initials = apt.doctorName
                  ? apt.doctorName
                      .split(" ")
                      .map((n: string) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()
                  : "DR";
                const apptDate = new Date(apt.appointmentDate);
                const formattedDate = apptDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
                const isUpcoming = apptDate >= today;
                return (
                  <div
                    key={apt.id}
                    className="flex items-center gap-2 md:gap-2.5 p-1.5 md:p-2 lg:p-2.5 rounded-lg md:rounded-xl transition-colors hover:bg-slate-50 border border-slate-100"
                  >
                    <div
                      className="h-6 w-6 md:h-8 md:w-8 lg:h-9 lg:w-9 rounded-md md:rounded-xl flex items-center justify-center text-[8px] md:text-xs font-bold shrink-0 text-white"
                      style={{ background: "linear-gradient(135deg, hsl(238,60%,56%), hsl(207,90%,56%))" }}
                    >
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-[11px] md:text-xs lg:text-sm truncate leading-tight">Dr. {apt.doctorName}</p>
                      <p className="text-[9px] md:text-[11px] text-slate-500 truncate leading-none mt-0.5">{apt.doctorSpecialty}</p>
                    </div>
                    <div className="text-right shrink-0 space-y-0.5">
                      <div
                        className="text-[8px] md:text-[10px] lg:text-xs font-semibold px-1.5 md:px-2 py-0.5 rounded-full leading-none"
                        style={
                          isUpcoming
                            ? { background: "rgba(59,63,191,0.1)", color: "hsl(238,53%,49%)" }
                            : { background: "rgba(100,116,139,0.1)", color: "#64748b" }
                        }
                      >
                        {formattedDate}
                      </div>
                      <p className="text-[8px] md:text-[10px] text-slate-400 leading-none">{apt.appointmentTime}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Medicine Reminders */}
        <div
          className="bg-white rounded-xl md:rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)" }}
        >
          <div className="px-3 md:px-4 py-2 md:py-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-xs md:text-sm">Medicine Reminders</h3>
              <p className="text-[10px] md:text-xs text-slate-500 mt-0.5 hidden md:block">Active prescriptions & schedules</p>
            </div>
            <Link to="/patient/medical-history">
              <span
                className="text-[10px] md:text-xs font-semibold flex items-center gap-0.5 md:gap-1 hover:opacity-80 transition-opacity"
                style={{ color: "hsl(238,53%,49%)" }}
              >
                View all <ArrowRight className="h-2.5 w-2.5 md:h-3 md:w-3" />
              </span>
            </Link>
          </div>
          <div className="p-2 md:p-3 space-y-1.5 md:space-y-2 lg:space-y-2.5">
            {activeMedicineReminders.length === 0 ? (
              <div className="text-center py-4 md:py-6">
                <Pill className="h-5 w-5 md:h-7 md:w-7 mx-auto mb-1 text-slate-300" />
                <p className="text-[11px] md:text-xs text-slate-400">No active reminders.</p>
              </div>
            ) : (
              activeMedicineReminders.slice(0, 3).map((med: any) => (
                <div
                  key={med.id}
                  className="flex items-center gap-2 md:gap-2.5 p-1.5 md:p-2 lg:p-2.5 rounded-lg md:rounded-xl transition-colors hover:bg-emerald-50/40 border border-emerald-500/15"
                  style={{ background: "rgba(16,185,129,0.04)" }}
                >
                  <div
                    className="h-6 w-6 md:h-8 md:w-8 lg:h-9 lg:w-9 rounded-md md:rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "linear-gradient(135deg, hsl(158,55%,40%), hsl(158,50%,34%))" }}
                  >
                    <Pill className="h-3 w-3 md:h-4 md:w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-[11px] md:text-xs lg:text-sm truncate leading-tight">{med.medicineName}</p>
                    <p className="text-[9px] md:text-[11px] text-slate-500 truncate leading-none mt-0.5">
                      {med.dosage} · {med.frequency.replace(/_/g, " ")}
                    </p>
                  </div>
                  <div
                    className="flex items-center gap-1 md:gap-1.5 px-1.5 md:px-2 py-0.5 md:py-1 rounded md:rounded-lg shrink-0"
                    style={{
                      background: "white",
                      border: "1px solid rgba(16,185,129,0.2)",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                    }}
                  >
                    <Clock className="h-2 w-2 md:h-2.5 md:w-2.5 lg:h-3 lg:w-3" style={{ color: "hsl(158,55%,38%)" }} />
                    <span className="text-[9px] md:text-[10px] lg:text-xs font-semibold" style={{ color: "hsl(158,55%,35%)" }}>
                      {med.times}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}