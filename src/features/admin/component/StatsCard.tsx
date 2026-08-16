import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: string;
  trendUp?: boolean;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = "text-violet-600",
  iconBg = "bg-violet-50",
  trend,
  trendUp,
}: StatsCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-500">{title}</span>
          <div className={cn("p-2.5 rounded-xl flex items-center justify-center", iconBg)}>
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
        </div>

        <div className="mt-4">
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</p>
          {(description || trend) && (
            <div className="flex items-center gap-2 mt-1.5 text-xs">
              {trend && (
                <span
                  className={cn(
                    "font-bold",
                    trendUp ? "text-emerald-600" : "text-rose-600"
                  )}
                >
                  {trend}
                </span>
              )}
              {description && <span className="text-slate-500">{description}</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default StatsCard;
