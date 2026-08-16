import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./AdminSidebar";

export interface DashboardLayoutProps {
  children?: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-slate-50/50">
        <div className="mx-auto px-6 py-8 max-w-7xl">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}

export const AdminLayout = DashboardLayout;
export default DashboardLayout;
