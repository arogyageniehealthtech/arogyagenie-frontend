import { useGetAdminStats } from "../hooks/useAdminData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Stethoscope, Building, Pill, Calendar, FileText, Clock } from "lucide-react";
import { DashboardLayout } from "../component/AdminLayout";

export function AdminDashboard() {
  const { data: stats, isLoading } = useGetAdminStats();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center py-20 text-slate-500">
          Loading admin dashboard...
        </div>
      </DashboardLayout>
    );
  }

  if (!stats) return null;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Platform overview, user metrics, provider network, and operational statistics.</p>
        </div>

        {/* Platform Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total Users</CardTitle>
              <Users className="h-4 w-4 text-violet-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">{stats.activeUsers.toLocaleString()} active accounts</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Doctors</CardTitle>
              <Stethoscope className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.totalDoctors}</div>
              <p className="text-xs text-slate-500 mt-1">Verified providers</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Diagnostic Centers</CardTitle>
              <Building className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.totalDiagnosticCenters}</div>
              <p className="text-xs text-slate-500 mt-1">Partner labs</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Pharmacies</CardTitle>
              <Pill className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.totalPharmacies}</div>
              <p className="text-xs text-slate-500 mt-1">Partner pharmacies</p>
            </CardContent>
          </Card>
        </div>

        {/* Operational Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Total Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.totalAppointments.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">{stats.appointmentsThisMonth} this month</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Lab Reports</CardTitle>
              <FileText className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.totalLabReports.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">Uploaded & analyzed</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Pending Approvals</CardTitle>
              <Clock className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{stats.pendingApprovals}</div>
              <p className="text-xs text-slate-500 mt-1">Providers awaiting review</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Platform Patients</CardTitle>
              <Users className="h-4 w-4 text-rose-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stats.totalPatients.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">Registered patients</p>
            </CardContent>
          </Card>
        </div>

        {/* Appointment Breakdown */}
        {stats.appointmentsByStatus && (
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-900">Appointment Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <p className="text-2xl font-bold text-amber-800">{stats.appointmentsByStatus.pending}</p>
                  <p className="text-xs text-amber-600 font-semibold mt-1 uppercase tracking-wider">Pending</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-2xl font-bold text-blue-800">{stats.appointmentsByStatus.confirmed}</p>
                  <p className="text-xs text-blue-600 font-semibold mt-1 uppercase tracking-wider">Confirmed</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-2xl font-bold text-emerald-800">{stats.appointmentsByStatus.completed}</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-1 uppercase tracking-wider">Completed</p>
                </div>
                <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                  <p className="text-2xl font-bold text-rose-800">{stats.appointmentsByStatus.cancelled}</p>
                  <p className="text-xs text-rose-600 font-semibold mt-1 uppercase tracking-wider">Cancelled</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

export const AdminDashboardPage = AdminDashboard;
export default AdminDashboard;
