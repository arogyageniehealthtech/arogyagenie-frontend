import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./AdminSidebar";
import { Menu, X } from "lucide-react";

export interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-[70] transform lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/50 min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-[#120A2D] text-white shrink-0 z-50">
          <div className="flex items-center gap-2">
            <img src="/LOGO.png" alt="Logo" className="h-6 w-6 object-contain" />
            <span className="font-extrabold text-lg tracking-tight">Admin Portal</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-1 hover:bg-white/10 rounded">
            <Menu size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
            {children || <Outlet />}
          </div>
        </div>
      </main>
    </div>
  );
}

export const AdminLayout = DashboardLayout;
export default DashboardLayout;
