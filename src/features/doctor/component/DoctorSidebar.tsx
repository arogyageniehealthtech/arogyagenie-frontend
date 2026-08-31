import type React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LogOut,
  Home,
  User,
  Calendar,
  Clipboard,
  Users,
  Clock,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "@/constants/routes.constants";
import { useAuth } from "@/features/auth/hooks/useAuth";

function getInitials(name?: string | null, email?: string | null): string {
  if (name && name.trim()) {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "DR";
}

function getRoleLabel(role?: string | null): string {
  if (!role) return "Doctor";
  return role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function DoctorSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems: NavItem[] = [
    { href: ROUTES.DOCTOR.DASHBOARD, label: "Dashboard", icon: Home },
    { href: "/doctor/appointments", label: "Appointments", icon: Calendar },
    { href: "/doctor/schedule", label: "Schedule", icon: Clock },
    { href: "/doctor/patients", label: "My Patients", icon: Users },
    { href: "/doctor/prescriptions", label: "Prescriptions", icon: Clipboard },
    { href: "/doctor/profile", label: "Profile", icon: User },
  ];

  const displayName = user
    ? user.firstName
      ? `${user.firstName} ${user.lastName || ""}`.trim()
      : user.email?.split("@")[0] || "Doctor"
    : "Doctor";

  const role = user?.userType || "DOCTOR";
  const initials = getInitials(displayName, user?.email);

  const handleSignOut = async () => {
    await logout();
  };

  return (
    <aside
      className="w-64 flex flex-col h-full shrink-0 overflow-hidden select-none"
      style={{
        background: "linear-gradient(180deg, #18103A 0%, #120A2D 50%, #0E0724 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo Area */}
      <div className="px-5 py-5 flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 shadow-md bg-white p-2">
          <img
            src="/LOGO.png"
            alt="ArogyaGenie"
            className="h-6 w-6 object-contain"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
        <div>
          <span
            className="font-extrabold text-lg tracking-tight"
            style={{ color: "rgba(255,255,255,0.97)" }}
          >
            ArogyaGenie
          </span>
          <p className="text-[10px] font-semibold tracking-widest uppercase text-violet-300/60">
            Doctor Portal
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 mb-3" style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

      {/* Nav label */}
      <p className="px-5 mb-2 text-[10px] font-semibold tracking-widest uppercase text-violet-200/40">
        Navigation
      </p>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1 pb-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
              style={
                isActive
                  ? {
                      background: "linear-gradient(135deg, #6C63FF 0%, #5247E6 100%)",
                      color: "#FFFFFF",
                      boxShadow: "0 4px 14px rgba(108, 99, 255, 0.4)",
                    }
                  : {
                      color: "rgba(255,255,255,0.65)",
                      background: "transparent",
                    }
              }
              onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.95)";
                }
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,255,255,0.65)";
                }
              }}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
              {isActive && <div className="ml-auto h-2 w-2 rounded-full bg-white shadow-xs" />}
            </Link>
          );
        })}
      </div>

      {/* Bottom: User Info + Logout */}
      <div className="mt-auto">
        {/* Divider */}
        <div className="mx-4 mb-3" style={{ height: "1px", background: "rgba(255,255,255,0.07)" }} />

        {/* User Card */}
        <div
          className="mx-3 mb-2 px-3 py-3 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{
                background: "linear-gradient(135deg, hsl(238,65%,58%), hsl(207,90%,58%))",
                color: "white",
              }}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p
                className="text-sm font-semibold truncate"
                style={{ color: "rgba(255,255,255,0.92)" }}
              >
                {displayName}
              </p>
              <p
                className="text-[10px] font-medium tracking-wide"
                style={{ color: "rgba(255,255,255,0.38)" }}
              >
                {getRoleLabel(role)}
              </p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="px-3 pb-4">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center justify-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all duration-200 cursor-pointer"
            style={{ background: "#EF4444", color: "#FFFFFF" }}
            onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
              e.currentTarget.style.background = "#DC2626";
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
              e.currentTarget.style.background = "#EF4444";
            }}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export const Sidebar = DoctorSidebar;
export default DoctorSidebar;
