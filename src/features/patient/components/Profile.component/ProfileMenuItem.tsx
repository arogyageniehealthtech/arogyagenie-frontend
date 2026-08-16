import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { ProfileMenuItemConfig } from "../../types/profile.types";

type ProfileMenuItemProps = ProfileMenuItemConfig;

export function ProfileMenuItem({ icon: Icon, label, href }: ProfileMenuItemProps) {
  return (
    < Link
      to={href}
      className="flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#5B21B6]"
    >
      <div className="flex items-center gap-4">
        <Icon className="w-5 h-5 text-[#64748B]" aria-hidden="true" />
        <span className="text-sm font-medium text-[#14152B]">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-[#64748B]" aria-hidden="true" />
    </Link>
  );
}