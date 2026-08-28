import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { AuthUser } from "../../../../types/auth.types";

interface ProfileHeaderProps {
  profile: AuthUser & {
    firstName?: string;
    lastName?: string;
    memberships?: string | string[] | number;
  };
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  // Determine display name safely across variations of AuthUser
  const fullName =
    profile.name ||
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
    "User";

  // Safely format membership display value
  const membershipText = Array.isArray(profile.memberships)
    ? `${profile.memberships.length} Active`
    : profile.memberships ?? "Standard Member";

  return (
    <Link
      to="/profile/personal-information"
      className="block w-full bg-linear-to-r from-[#5B21B6] to-[#7C3AED] rounded-b-3xl p-6 md:p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B21B6] focus-visible:ring-offset-2 active:opacity-95 transition-opacity"
      aria-label="View personal information"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {profile.profilePicture ? (
            <img
              src={profile.profilePicture}
              alt={fullName}
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm">
              {fullName.slice(0, 2).toUpperCase()}
            </div>
          )}

          <div className="flex flex-col text-white">
            <h1 className="text-xl font-semibold">{fullName}</h1>
            <p className="text-sm text-purple-100 mb-1">{profile.email}</p>
            <span className="inline-block bg-white/20 text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full backdrop-blur-sm w-fit">
              {membershipText}
            </span>
          </div>
        </div>
        <ChevronRight className="w-6 h-6 text-white/80" aria-hidden="true" />
      </div>
    </Link>
  );
}