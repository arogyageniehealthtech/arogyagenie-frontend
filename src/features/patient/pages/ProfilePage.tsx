import { useProfile } from "../hooks/useProfile";
import { ProfileHeader } from "../components/Profile.component/ProfileHeader";
import { ProfileMenu } from "../components/Profile.component/ProfileMenu";
import { LogoutButton } from "../components/Profile.component/LogoutButton";
import { ProfileSkeleton } from "../components/Profile.component/ProfileSkeleton";

export default function ProfilePage() {
  const { data: profile, isLoading, isError, refetch } = useProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pb-24 md:pb-8">
        <ProfileSkeleton />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-lg font-semibold text-[#14152B] mb-2">
          Unable to load profile
        </h2>
        <p className="text-sm text-[#64748B] mb-6">
          Something went wrong while loading your profile.
        </p>
        <button
          onClick={() => refetch()}
          className="px-6 py-2.5 bg-[#5B21B6] hover:bg-[#6D28D9] text-white rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B21B6] focus-visible:ring-offset-2"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 md:pb-8">
      {/* Desktop Centering Container */}
      <main className="w-full max-w-175 mx-auto flex flex-col gap-6 pt-0 md:pt-6">
        <ProfileHeader profile={profile} />
        <ProfileMenu />
        <LogoutButton />
      </main>
    </div>
  );
}