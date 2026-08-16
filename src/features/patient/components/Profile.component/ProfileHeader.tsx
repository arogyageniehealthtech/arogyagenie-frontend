import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { UserProfile } from "../../types/profile.types";

interface ProfileHeaderProps {
  profile: UserProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <Link
      to="/profile/personal-information"
      className="block w-full bg-linear-to-r from-[#5B21B6] to-[#7C3AED] rounded-b-3xl p-6 md:p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B21B6] focus-visible:ring-offset-2 active:opacity-95 transition-opacity"
      aria-label="View personal information"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={profile.avatarUrl}
            alt={`${profile.firstName} ${profile.lastName}`}
            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
          />
          <div className="flex flex-col text-white">
            <h1 className="text-xl font-semibold">
              {profile.firstName} {profile.lastName}
            </h1>
            <p className="text-sm text-purple-100 mb-1">{profile.email}</p>
            <span className="inline-block bg-white/20 text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full backdrop-blur-sm w-fit">
              {profile.membership}
            </span>
          </div>
        </div>
        <ChevronRight className="w-6 h-6 text-white/80" aria-hidden="true" />
      </div>
    </Link>
  );
}