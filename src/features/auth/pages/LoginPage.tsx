import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, ArrowRight, UserCheck, Stethoscope, Shield, Pill, Building2 } from "lucide-react";
import { AuthCard } from "../components/AuthCard";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../hooks/useAuth";
import { authApi } from "../api/auth.api";
import { ROUTES } from "@/constants/routes.constants";
import type { BackendUserType } from "@/types/auth.types";

const ROLE_OPTIONS: { userType: BackendUserType; label: string; icon: React.ElementType }[] = [
  { userType: "PATIENT", label: "Patient", icon: UserCheck },
  { userType: "DOCTOR", label: "Doctor", icon: Stethoscope },
  { userType: "SYSTEM_ADMIN", label: "Admin", icon: Shield },
  { userType: "PHARMACY", label: "Pharmacy", icon: Pill },
  { userType: "LAB", label: "Lab / Diagnostic", icon: Building2 },
];

export function LoginPage() {
  const { login, isLoading, error, clearError } = useAuth();

  const [selectedRole, setSelectedRole] = useState<BackendUserType>("PATIENT");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!emailOrPhone.trim()) {
      setValidationError("Please enter your email or phone number.");
      return;
    }

    if (!password) {
      setValidationError("Please enter your password.");
      return;
    }

    try {
      await login({
        email: emailOrPhone.trim(),
        password,
        userType: selectedRole,
        // rememberMe,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setValidationError(err.message);
      }
    }
  };

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Real Google OAuth flow — sends the Google id_token to the backend
  const handleGoogleCredential = async (idToken: string) => {
    try {
      setIsGoogleLoading(true);
      clearError();
      setValidationError(null);

      const response = await authApi.googleAuth(idToken);
      if (!response) {
        setValidationError("No response from server. Please try again.");
        return;
      }

      // Extract token from various possible response shapes
      const accessToken =
        (response as any).accessToken ||
        (response as any).AccessToken ||
        (response as any).data?.accessToken;
      const user = (response as any).user || (response as any).data?.user;

      if (accessToken) {
        localStorage.setItem("AccessToken", accessToken);
      }

      const { getRoleDashboardPath } = await import("../hooks/useAuth");
      const path = getRoleDashboardPath(user?.userType ?? "PATIENT");
      window.location.href = path;
    } catch (err: any) {
      const serverMsg = err?.response?.data?.message ?? err?.message;
      if (err?.response?.status === 409) {
        setValidationError(
          "An account with this Google email already exists. Please sign in with your password instead."
        );
      } else {
        setValidationError(serverMsg ?? "Google sign-in failed. Please try again.");
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // useGoogleLogin opens the Google account picker popup — kept for potential future use.

  const handleQuickDemoFill = (userType: BackendUserType) => {
    setSelectedRole(userType);
    clearError();
    setValidationError(null);
    switch (userType) {
      case "PATIENT":
        setEmailOrPhone("patient@arogyagenie.com");
        setPassword("Password@123");
        break;
      case "DOCTOR":
        setEmailOrPhone("doctor@arogyagenie.com");
        setPassword("Password@123");
        break;
      case "SYSTEM_ADMIN":
        setEmailOrPhone("admin@arogyagenie.com");
        setPassword("Password@123");
        break;
      case "PHARMACY":
        setEmailOrPhone("pharmacy@arogyagenie.com");
        setPassword("Password@123");
        break;
      case "LAB":
        setEmailOrPhone("lab@arogyagenie.com");
        setPassword("Password@123");
        break;
    }
  };

  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in to your ArogyaGenie healthcare account"
      badge="Secure Portal"
      footer={
        <p className="text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <Link
            to={ROUTES.AUTH.REGISTER}
            className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1"
          >
            Sign up now <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </p>
      }
    >
      {/* Quick Role Selector */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-slate-300 block mb-2">
          Select Portal Role:
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10">
          {ROLE_OPTIONS.map((item) => {
            const isSelected = selectedRole === item.userType;
            const Icon = item.icon;
            return (
              <button
                key={item.userType}
                type="button"
                onClick={() => handleQuickDemoFill(item.userType)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="h-4 w-4 mb-1 shrink-0" />
                <span className="truncate max-w-full text-[10px] sm:text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error Alert */}
      {(error || validationError) && (
        <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 flex items-start gap-2.5 text-red-200 text-xs">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
          <span className="flex-1">{error || validationError}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email or Phone Input */}
        <div>
          <label className="text-xs font-medium text-slate-300 block mb-1.5">
            Email Address or Phone
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="e.g. user@arogyagenie.com or 9876543210"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-slate-300">Password</label>
            <Link
              to={ROUTES.AUTH.FORGOT_PASSWORD}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-2">
          <input
            id="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded-sm border-white/20 bg-white/5 text-indigo-600 focus:ring-indigo-500/30 accent-indigo-600 cursor-pointer"
          />
          <label htmlFor="rememberMe" className="text-xs text-slate-400 select-none cursor-pointer">
            Remember this device for 30 days
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm text-white shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #6C63FF 0%, #4F46E5 100%)",
            boxShadow: "0 4px 20px rgba(108, 99, 255, 0.4)",
          }}
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Signing in...
            </span>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              <span>Sign In as {ROLE_OPTIONS.find((r) => r.userType === selectedRole)?.label}</span>
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-4">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs uppercase tracking-widest text-slate-500 font-medium">Or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      {/* Google Sign In — renders Google's native button */}
      {/* Note: Google OAuth only creates PATIENT accounts. Doctors/Admins must use email login. */}
      <div className="flex justify-center">
        {isGoogleLoading ? (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span className="h-4 w-4 border-2 border-slate-400/30 border-t-slate-400 rounded-full animate-spin" />
            Connecting to Google...
          </div>
        ) : (
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              if (credentialResponse.credential) {
                handleGoogleCredential(credentialResponse.credential);
              } else {
                setValidationError("Google sign-in failed: no credential received.");
              }
            }}
            onError={() => {
              setValidationError("Google sign-in failed. Please try again.");
            }}
            theme="filled_black"
            shape="pill"
            text="continue_with"
            size="large"
            width="100%"
          />
        )}
      </div>
      {selectedRole !== "PATIENT" && (
        <p className="text-center text-xs text-slate-500 mt-2">
          ⚠️ Google sign-in creates <strong>Patient</strong> accounts only. Use email login for {ROLE_OPTIONS.find(r => r.userType === selectedRole)?.label} access.
        </p>
      )}
    </AuthCard>
  );
}

export default LoginPage;