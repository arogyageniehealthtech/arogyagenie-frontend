import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Stethoscope, Phone, MapPin } from "lucide-react";
import type { AdminUser } from "../data/mockAdminData";

export interface DoctorTableProps {
  doctors: AdminUser[];
  onUpdateStatus?: (id: number, status: "active" | "suspended" | "pending") => void;
  isLoading?: boolean;
}

export function DoctorTable({ doctors, onUpdateStatus, isLoading }: DoctorTableProps) {
  if (isLoading) {
    return <div className="py-12 text-center text-slate-500 text-sm">Loading doctors...</div>;
  }

  if (doctors.length === 0) {
    return <div className="py-12 text-center text-slate-500 text-sm">No doctors found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {doctors.map((d) => (
        <div key={d.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">
                  Dr. {d.firstName || d.lastName ? `${d.firstName ?? ""} ${d.lastName ?? ""}`.trim() : d.email}
                </h3>
                <p className="text-xs text-blue-700 font-semibold">{d.specialty || "General Medicine"}</p>
              </div>
            </div>
            <Badge
              variant={d.status === "active" ? "success" : d.status === "suspended" ? "destructive" : "warning"}
              className="uppercase text-[10px]"
            >
              {d.status}
            </Badge>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
            <p className="text-slate-500">{d.email}</p>
            {d.phone && (
              <p className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>{d.phone}</span>
              </p>
            )}
            {d.address && (
              <p className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span>{d.address}</span>
              </p>
            )}
          </div>

          {onUpdateStatus && (
            <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
              {d.status !== "active" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-emerald-600 hover:text-emerald-700 h-8 gap-1 flex-1"
                  onClick={() => onUpdateStatus(d.id, "active")}
                >
                  <CheckCircle className="h-3.5 w-3.5" /> Activate
                </Button>
              )}
              {d.status !== "suspended" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-rose-600 hover:text-rose-700 h-8 gap-1 flex-1"
                  onClick={() => onUpdateStatus(d.id, "suspended")}
                >
                  <XCircle className="h-3.5 w-3.5" /> Suspend
                </Button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default DoctorTable;
