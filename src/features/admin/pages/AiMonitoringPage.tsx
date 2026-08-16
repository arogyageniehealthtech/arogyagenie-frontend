import { DashboardLayout } from "../component/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Cpu, CheckCircle2, AlertTriangle, ShieldCheck, Zap } from "lucide-react";

export function AiMonitoringPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI Gateway & Health Assistant Monitoring</h1>
          <p className="text-slate-500 mt-1">Real-time status, latency metrics, inference telemetry, and safety heuristic bypass logs.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Inference Status</CardTitle>
              <Cpu className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-2xl font-bold text-slate-900">Operational</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Local Ollama LLM (llama3:8b)</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Avg Response Time</CardTitle>
              <Zap className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">420 ms</div>
              <p className="text-xs text-emerald-600 font-semibold mt-1">Fast (-35ms vs avg)</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">24h Chat Queries</CardTitle>
              <Activity className="h-4 w-4 text-violet-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">1,842</div>
              <p className="text-xs text-slate-500 mt-1">Patient symptom checks</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Safety Bypasses</CardTitle>
              <ShieldCheck className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">28</div>
              <p className="text-xs text-slate-500 mt-1">Emergency triage triggers</p>
            </CardContent>
          </Card>
        </div>

        {/* Triage & Heuristics Log */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">Recent AI Triage Events</CardTitle>
            <CardDescription>Audited patient symptom inquiries evaluated by ArogyaGenie AI assistant.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Symptoms Evaluated</th>
                    <th className="py-3 px-4">Triage Classification</th>
                    <th className="py-3 px-4">Action Taken</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-xs text-slate-500">Today, 02:45 AM</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Mild fever, headache & cough (2 days)</td>
                    <td className="py-3.5 px-4 text-slate-700">Non-Urgent / General Practice</td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs">Recommended Doctor Consultation & Hydration</td>
                    <td className="py-3.5 px-4">
                      <Badge variant="success" className="text-[10px] gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Resolved
                      </Badge>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-xs text-slate-500">Today, 01:12 AM</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Severe crushing chest pain radiating to left arm</td>
                    <td className="py-3.5 px-4 text-rose-600 font-bold">EMERGENCY (Critical)</td>
                    <td className="py-3.5 px-4 text-rose-700 font-semibold text-xs">Triggered Emergency SOS & Ambulance Hotline</td>
                    <td className="py-3.5 px-4">
                      <Badge variant="destructive" className="text-[10px] gap-1">
                        <AlertTriangle className="h-3 w-3" /> Escalated
                      </Badge>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-xs text-slate-500">Yesterday, 10:20 PM</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Skin rash on forearm after antibiotic dose</td>
                    <td className="py-3.5 px-4 text-amber-700 font-medium">Moderate / Dermatology</td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs">Doctor booking link provided</td>
                    <td className="py-3.5 px-4">
                      <Badge variant="success" className="text-[10px] gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Resolved
                      </Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default AiMonitoringPage;
