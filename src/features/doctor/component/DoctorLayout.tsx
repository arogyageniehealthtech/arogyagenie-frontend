import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { DoctorSidebar } from "./DoctorSidebar";

export interface DoctorLayoutProps {
  children?: ReactNode;
}

export function DoctorLayout({ children }: DoctorLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      <DoctorSidebar />
      <main className="flex-1 overflow-y-auto bg-slate-50/50">
        <div className="mx-auto px-6 py-8 max-w-7xl">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}

export const DashboardLayout = DoctorLayout;
export default DoctorLayout;
