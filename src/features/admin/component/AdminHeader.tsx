import { Bell, Search, Shield } from "lucide-react";
import { useGetMe } from "../hooks/useAdminData";

export interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
  onSearch?: (query: string) => void;
}

export function AdminHeader({ title = "Admin Portal", subtitle, onSearch }: AdminHeaderProps) {
  const { data: user } = useGetMe();

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 mb-8">
      <div>
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-violet-600" />
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
        </div>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {onSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => onSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 w-48 md:w-64 shadow-2xs"
            />
          </div>
        )}

        <button
          type="button"
          aria-label="Notifications"
          className="relative p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-violet-600" />
        </button>

        {user && (
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="h-8 w-8 rounded-full bg-violet-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              AD
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-none">{user.displayName || "Admin"}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">System Admin</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default AdminHeader;
