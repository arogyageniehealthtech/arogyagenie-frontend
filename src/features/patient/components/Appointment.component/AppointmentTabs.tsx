import type { TabValue } from "../../types/appointment.types";
import { TAB_OPTIONS } from "../../../../constants/appointment.constants";

interface Props {
  activeTab: TabValue;
  onTabChange: (tab: TabValue) => void;
}

export function AppointmentTabs({ activeTab, onTabChange }: Props) {
  return (
    <div className="flex w-full bg-slate-50/50 p-1 rounded-full border border-slate-200" role="tablist">
      {TAB_OPTIONS.map((tab) => {
        const isActive = activeTab === tab.value;
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.value as TabValue)}
            className={`flex-1 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
              isActive
                ? "bg-purple-700 text-white shadow-sm"
                : "text-slate-500 hover:text-[#14152B]"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}