import React, { useState, createContext, useContext, type ReactNode } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { Menu, ShieldCheck, Stethoscope } from "lucide-react";
import { DoctorSidebar } from "./DoctorSidebar";
import { useAuth } from "@/features/auth/hooks/useAuth";

const DoctorLayoutContext = createContext<boolean>(false);

export interface DoctorLayoutProps {
  children?: ReactNode;
}

function getInitials(name?: string | null, email?: string | null): string {
  if (name && name.trim()) {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "DR";
}

export function DoctorLayout({ children }: DoctorLayoutProps) {
  const isInsideDoctorLayout = useContext(DoctorLayoutContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  // If already wrapped by parent DoctorLayout, just render content without re-wrapping
  if (isInsideDoctorLayout) {
    return <>{children || <Outlet />}</>;
  }

  const displayName = user
    ? user.firstName
      ? `Dr. ${user.firstName} ${user.lastName || ""}`.trim()
      : user.email?.split("@")[0] || "Doctor"
    : "Doctor";

  const initials = getInitials(
    user?.firstName ? `${user.firstName} ${user.lastName || ""}` : undefined,
    user?.email
  );

  // Derive current page title for top bar
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/appointments")) return "Consultations & Appointments";
    if (path.includes("/schedule")) return "Schedule & Availability";
    if (path.includes("/patients")) return "Patient Registry";
    if (path.includes("/prescriptions")) return "Digital Prescriptions";
    if (path.includes("/profile")) return "Profile & Credentials";
    return "Doctor Dashboard";
  };

  return (
    <DoctorLayoutContext.Provider value={true}>
      <div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans">
        {/* Desktop Sidebar (visible on lg: >= 1024px) */}
        <div className="hidden lg:flex lg:shrink-0 h-full">
          <DoctorSidebar />
        </div>

        {/* Mobile / Tablet Drawer Overlay & Sidebar (visible on < lg) */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            {/* Drawer */}
            <div className="relative z-50 flex flex-col max-w-xs w-full h-full shadow-2xl animate-in slide-in-from-left duration-200">
              <DoctorSidebar isMobile onClose={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
          {/* Top Navbar */}
          <header className="h-16 shrink-0 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between z-10 shadow-2xs">
            {/* Left: Mobile hamburger toggle & Brand/Page info */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 min-w-0">
                <div className="lg:hidden flex items-center gap-2 mr-2">
                  <div className="h-8 w-8 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold shrink-0">
                    <Stethoscope className="h-4 w-4" />
                  </div>
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                    {getPageTitle()}
                  </h2>
                  <p className="text-[11px] text-slate-400 font-medium hidden sm:block truncate">
                    ArogyaGenie Clinical Telehealth Portal
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Verified Badge & Doctor Avatar */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Verified Doctor</span>
              </div>

              <Link
                to="/doctor/profile"
                className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                title="View Profile"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                  {initials}
                </div>
                <div className="hidden md:block text-left min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate max-w-[130px]">
                    {displayName}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">Online</p>
                </div>
              </Link>
            </div>
          </header>

          {/* Scrollable Page Canvas */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50/60">
            <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 min-w-0">
              {children || <Outlet />}
            </div>
          </main>
        </div>
      </div>
    </DoctorLayoutContext.Provider>
  );
}

export const DashboardLayout = DoctorLayout;
export default DoctorLayout;
