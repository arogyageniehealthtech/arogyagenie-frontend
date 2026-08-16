import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import type { AdminUser } from "../data/mockAdminData";

export interface UserTableProps {
  users: AdminUser[];
  onUpdateStatus?: (id: number, status: "active" | "suspended" | "pending") => void;
  isLoading?: boolean;
}

export function UserTable({ users, onUpdateStatus, isLoading }: UserTableProps) {
  if (isLoading) {
    return <div className="py-12 text-center text-slate-500 text-sm">Loading users...</div>;
  }

  if (users.length === 0) {
    return <div className="py-12 text-center text-slate-500 text-sm">No users found.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <th className="py-3 px-4">User</th>
            <th className="py-3 px-4">Role</th>
            <th className="py-3 px-4">Contact</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Joined Date</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
              <td className="py-3.5 px-4 font-semibold text-slate-900">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-xs">
                    {u.firstName ? u.firstName[0] : u.email[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {u.firstName || u.lastName ? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() : u.email}
                    </p>
                    <p className="text-xs text-slate-500">{u.email}</p>
                  </div>
                </div>
              </td>
              <td className="py-3.5 px-4 text-slate-600">
                <Badge variant="outline" className="capitalize">
                  {u.role.replace("_", " ")}
                </Badge>
              </td>
              <td className="py-3.5 px-4 text-slate-600 text-xs">{u.phone || "—"}</td>
              <td className="py-3.5 px-4">
                <Badge
                  variant={
                    u.status === "active" ? "success" : u.status === "suspended" ? "destructive" : "warning"
                  }
                  className="uppercase text-[10px]"
                >
                  {u.status}
                </Badge>
              </td>
              <td className="py-3.5 px-4 text-slate-500 text-xs">
                {new Date(u.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3.5 px-4 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  {u.status !== "active" && onUpdateStatus && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-emerald-600 hover:text-emerald-700 h-8 gap-1"
                      onClick={() => onUpdateStatus(u.id, "active")}
                    >
                      <CheckCircle className="h-3.5 w-3.5" /> Activate
                    </Button>
                  )}
                  {u.status !== "suspended" && onUpdateStatus && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-rose-600 hover:text-rose-700 h-8 gap-1"
                      onClick={() => onUpdateStatus(u.id, "suspended")}
                    >
                      <XCircle className="h-3.5 w-3.5" /> Suspend
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
