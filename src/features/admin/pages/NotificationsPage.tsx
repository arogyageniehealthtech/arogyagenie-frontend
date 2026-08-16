import { DashboardLayout } from "../component/AdminLayout";
import { Card } from "@/components/ui/card";
import { Check, Clock, Info, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: "application",
      title: "New Doctor Application Received",
      desc: "Dr. Vikram Reddy submitted medical license credentials for review.",
      time: "10 minutes ago",
      icon: Clock,
      color: "text-amber-600 bg-amber-50",
    },
    {
      id: 2,
      type: "alert",
      title: "Emergency Triage Escalation",
      desc: "Patient requested urgent SOS assistance in Whitefield zone.",
      time: "1 hour ago",
      icon: ShieldAlert,
      color: "text-rose-600 bg-rose-50",
    },
    {
      id: 3,
      type: "system",
      title: "AI Inference Engine Update",
      desc: "Llama 3 8B model cache refreshed successfully.",
      time: "5 hours ago",
      icon: Info,
      color: "text-blue-600 bg-blue-50",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin System Notifications</h1>
            <p className="text-slate-500 mt-1">Platform alerts, application events, and security logs.</p>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Check className="h-4 w-4" /> Mark all read
          </Button>
        </div>

        <div className="space-y-3">
          {notifications.map((n) => (
            <Card key={n.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl ${n.color}`}>
                  <n.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-slate-900 text-base">{n.title}</h4>
                    <span className="text-xs text-slate-400 shrink-0">{n.time}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{n.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default NotificationsPage;
