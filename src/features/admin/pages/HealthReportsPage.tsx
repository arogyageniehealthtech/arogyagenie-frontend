import { DashboardLayout } from "../component/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { ReportTable } from "../component/ReportTable";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HealthReportsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Platform Lab & Health Reports</h1>
            <p className="text-slate-500 mt-1">Audit uploaded patient diagnostic test reports and medical records across network labs.</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export All (CSV)
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <ReportTable />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default HealthReportsPage;
