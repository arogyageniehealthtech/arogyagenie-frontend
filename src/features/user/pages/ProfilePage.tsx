import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, AlertCircle, ChevronRight, User, Shield, Bell, Settings, HelpCircle, Heart } from 'lucide-react';
import { useProfile } from "../hooks/useProfile";
import { ProfileHeader } from "../components/Profile.component/ProfileHeader";
import { ProfileMenu } from "../components/Profile.component/ProfileMenu";
import { LogoutButton } from "../components/Profile.component/LogoutButton";
import { ProfileSkeleton } from "../components/Profile.component/ProfileSkeleton";

export default function ProfilePage() {
  const { data: profile, isLoading, isError, refetch } = useProfile();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pb-24 md:pb-12 px-4 sm:px-6">
        <main className="w-full max-w-xl mx-auto pt-6 space-y-6">
          <ProfileSkeleton />
        </main>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 text-center pb-24">
        <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm max-w-md w-full flex flex-col items-center">
          <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">
            Unable to load profile
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Something went wrong while loading your profile data.
          </p>
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors text-sm"
            >
              Go Back
            </button>
            <button
              onClick={() => refetch()}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-28 md:pb-16 px-4 sm:px-6">
      <main className="w-full max-w-xl mx-auto flex flex-col gap-5 pt-4 md:pt-8">
        
        {/* --- MINIMALIST TOP HEADER & BACK BUTTON --- */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200/80 shadow-sm transition-all active:scale-95"
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="text-xs font-bold tracking-wide">Back</span>
          </button>
          
          <h1 className="text-sm font-bold text-slate-800 tracking-tight">My Profile</h1>
          
          <div className="w-16" /> {/* Balance spacer */}
        </div>

        {/* --- CLEAN MINIMALIST PROFILE CARD CONTAINER --- */}
        <div className="space-y-4">
          
          {/* Profile Header Box */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6">
            <ProfileHeader profile={profile} />
          </div>

          {/* Profile Menu Box */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <ProfileMenu />
          </div>

          {/* Logout Box */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4">
            <LogoutButton />
          </div>

        </div>

      </main>
    </div>
  );
}