import { DashboardLayout } from "../component/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cpu, ShieldCheck } from "lucide-react";

export function AdminSettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Platform Settings & Configuration</h1>
          <p className="text-slate-500 mt-1">Review AI Gateway status, authentication provider configuration, and security settings.</p>
        </div>

        {/* AI Gateway Settings */}
        <Card>
          <CardHeader className="bg-slate-50/50 pb-4 border-b border-slate-100">
            <CardTitle className="text-lg flex items-center gap-2">
              <Cpu className="h-5 w-5 text-violet-600" />
              Ollama AI Gateway Status
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-3 text-sm text-slate-700">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500">Primary Provider:</span>
              <span className="font-semibold text-slate-900">Local Ollama REST API (llama3:8b)</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500">Timeout Limit:</span>
              <span className="font-mono text-slate-900">15,000 ms</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500">Emergency Redirection Bypasses:</span>
              <Badge variant="default" className="bg-emerald-600">Active</Badge>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-500">Heuristic Engine Fallback:</span>
              <Badge variant="default" className="bg-blue-600">Enabled</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Auth & DB Settings */}
        <Card>
          <CardHeader className="bg-slate-50/50 pb-4 border-b border-slate-100">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-violet-600" />
              Authentication & Database Engine
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-3 text-sm text-slate-700">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500">Authentication Provider:</span>
              <span className="font-semibold text-slate-900">Frontend Auth Session</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500">Database Engine:</span>
              <span className="font-semibold text-slate-900">PostgreSQL (Drizzle ORM)</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-500">API Standard:</span>
              <span className="font-semibold text-slate-900">OpenAPI 3.0 + Zod + REST</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export const SettingsPage = AdminSettingsPage;
export default AdminSettingsPage;
