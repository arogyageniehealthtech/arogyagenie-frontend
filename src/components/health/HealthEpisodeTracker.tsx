import { useListHealthEpisodes } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers, Calendar, ChevronRight } from "lucide-react";

export function HealthEpisodeTracker() {
  const { data: episodes, isLoading } = useListHealthEpisodes();

  if (isLoading || !episodes || episodes.length === 0) return null;

  return (
    <Card className="border-slate-200/80 shadow-xs rounded-xl sm:rounded-2xl overflow-hidden">
      {/* Header */}
      <CardHeader className="p-3 sm:p-4 pb-2.5 sm:pb-3 border-b border-slate-100 flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-indigo-50 text-indigo-600 shrink-0">
            <Layers className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight leading-none">
              Health Episodes
            </CardTitle>
            <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 truncate hidden sm:block">
              Connected symptom, doctor, and lab journeys
            </p>
          </div>
        </div>

        {/* Mobile Episode Count Badge */}
        <span className="sm:hidden text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full shrink-0">
          {episodes.length} active
        </span>
      </CardHeader>

      <CardContent className="p-0 sm:p-4">
        {/* Mobile View: Compact Interactive Timeline Feed */}
        <div className="sm:hidden divide-y divide-slate-100">
          {episodes.map((ep) => (
            <div
              key={ep.id}
              className="p-3 active:bg-slate-50 transition-colors flex items-start gap-2.5 cursor-pointer relative"
            >
              {/* Timeline Indicator Pill */}
              <div
                className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                  ep.status === "confirmed"
                    ? "bg-indigo-600"
                    : ep.status === "resolved"
                    ? "bg-emerald-500"
                    : "bg-amber-500"
                }`}
              />

              {/* Episode Details */}
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h4 className="font-bold text-slate-900 text-xs truncate leading-tight">
                    {ep.title}
                  </h4>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
                    {ep.status}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-1">
                  <Calendar className="h-2.5 w-2.5 shrink-0" />
                  <span>Started {ep.startDate}</span>
                </div>

                {ep.summary && (
                  <p className="text-[11px] text-slate-600 leading-snug line-clamp-1">
                    {ep.summary}
                  </p>
                )}
              </div>

              <ChevronRight className="h-3.5 w-3.5 text-slate-300 shrink-0 self-center" />
            </div>
          ))}
        </div>

        {/* Desktop / Tablet View: 2-Column Grid Cards */}
        <div className="hidden sm:grid sm:grid-cols-2 gap-3">
          {episodes.map((ep) => (
            <div
              key={ep.id}
              className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-1.5"
            >
              <div className="flex items-start justify-between gap-1.5">
                <h4 className="font-bold text-slate-900 text-sm leading-snug truncate">
                  {ep.title}
                </h4>
                <Badge
                  variant={
                    ep.status === "confirmed"
                      ? "default"
                      : ep.status === "resolved"
                      ? "secondary"
                      : "outline"
                  }
                  className="capitalize text-[10px] px-1.5 py-0 shrink-0"
                >
                  {ep.status}
                </Badge>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Calendar className="h-3 w-3 shrink-0" />
                <span>Started {ep.startDate}</span>
              </div>

              {ep.summary && (
                <p className="text-xs text-slate-600 leading-snug line-clamp-2 pt-0.5">
                  {ep.summary}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}