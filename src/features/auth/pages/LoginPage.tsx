import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  ArrowRight,
  UserCheck,
  Stethoscope,
  Shield,
  Truck,
  Building2,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import { AuthCard } from "../components/AuthCard";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../hooks/useAuth";
import { authApi } from "../api/auth.api";
import { ROUTES } from "@/constants/routes.constants";
import type { BackendUserType } from "@/types/auth.types";

const ROLE_OPTIONS: { userType: BackendUserType; label: string; icon: React.ElementType }[] = [
  { userType: "PATIENT", label: "Patient", icon: UserCheck },
  { userType: "DOCTOR", label: "Doctor", icon: Stethoscope },
  { userType: "ORG_MEMBER", label: "Partner", icon: Building2 },
  { userType: "DELIVERY_PARTNER", label: "Courier", icon: Truck },
  { userType: "PLATFORM_ADMIN", label: "Admin", icon: Shield },
];

export function LoginPage() {
  const { login, verifyMfaLogin, mfaPending, isLoading, error, clearError } = useAuth();

  const [selectedRole, setSelectedRole] = useState<BackendUserType>("PATIENT");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!emailOrPhone.trim()) {
      setValidationError("Please enter your email address.");
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
      });
    } catch (err: any) {
      let msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message;

      if (!msg) {
        if (err.code === "ECONNABORTED" || err?.message?.includes("timeout")) {
          msg = "The server took too long to respond (timeout). The backend may be waking up from idle on Render. Please wait a moment and try again.";
        } else if (err.message === "Network Error" || err.code === "ERR_NETWORK") {
          msg = "Unable to connect to the backend server. Please check your connection or backend service status.";
        } else {
          msg = err?.message || "Invalid email or password.";
        }
      }
      setValidationError(msg);
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!mfaPending?.challengeToken) {
      setValidationError("MFA session expired. Please sign in again.");
      return;
    }

    if (!mfaCode.trim()) {
      setValidationError("Please enter the verification code from your authenticator.");
      return;
    }

    try {
      await verifyMfaLogin({
        challengeToken: mfaPending.challengeToken,
        code: mfaCode.trim(),
      });
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "Invalid authenticator code. Please try again.";
      setValidationError(msg);
    }
  };

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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

      const accessToken = response.accessToken || response.AccessToken;
      const user = response.user;

      if (accessToken) {
        localStorage.setItem("AccessToken", accessToken);
      }

      const { getRoleDashboardPath } = await import("../hooks/useAuth");
      const path = getRoleDashboardPath(user?.userType ?? "PATIENT");
      window.location.href = path;
    } catch (err: any) {
      const serverMsg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err?.message;

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
      case "PLATFORM_ADMIN":
      case "SYSTEM_ADMIN":
      case "ADMIN":
        setEmailOrPhone("admin@arogyagenie.com");
        setPassword("Password@123");
        break;
      case "ORG_MEMBER":
      case "PHARMACY":
      case "LAB":
        setEmailOrPhone("partner@arogyagenie.com");
        setPassword("Password@123");
        break;
      case "DELIVERY_PARTNER":
        setEmailOrPhone("courier@arogyagenie.com");
        setPassword("Password@123");
        break;
    }
  };

  return (
    <AuthCard
      title={mfaPending?.required ? "Two-Factor Verification" : "Welcome Back"}
      subtitle={
        mfaPending?.required
          ? "Enter the code generated by your authenticator app"
          : "Sign in to your ArogyaGenie healthcare account"
      }
      badge={mfaPending?.required ? "2FA Security" : "Secure Portal"}
      footer={
        <p className="text-center text-xs text-slate-400">
          Don't have an account?{" "}
          <Link
            to={ROUTES.AUTH.REGISTER}
            className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1"
          >
            Sign up now <ArrowRight className="h-3 w-3" />
          </Link>
        </p>
      }
    >
      {/* Error Alert */}
      {(error || validationError) && (
        <div className="p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 flex items-start gap-2 text-red-200 text-xs animate-fadeIn">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
          <span className="flex-1 leading-snug">{error || validationError}</span>
        </div>
      )}

      {mfaPending?.required ? (
        /* MFA Challenge Form */
        <form onSubmit={handleMfaSubmit} className="space-y-3 animate-fadeIn">
          <div className="text-center py-1">
            <div className="h-10 w-10 rounded-full bg-indigo-500/15 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/30 mb-1.5">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <p className="text-xs text-slate-300">
              Your account is protected with Multi-Factor Authentication. Please enter your 6-digit verification code.
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              6-Digit Authenticator Code
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                autoFocus
                maxLength={8}
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                placeholder="123456"
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-white/15 bg-white/5 text-white placeholder-slate-500 text-xs sm:text-sm tracking-widest font-mono text-center focus:outline-hidden focus:border-indigo-400 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #6C63FF 0%, #4F46E5 100%)",
            }}
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying Code...
              </span>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                <span>Verify & Complete Sign In</span>
              </>
            )}
          </button>
        </form>
      ) : (
        /* Regular Login Form */
        <>
          {/* Quick Role Selector */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Select Portal Role
            </label>
            <div className="grid grid-cols-5 gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
              {ROLE_OPTIONS.map((item) => {
                const isSelected = selectedRole === item.userType;
                const Icon = item.icon;
                return (
                  <button
                    key={item.userType}
                    type="button"
                    onClick={() => handleQuickDemoFill(item.userType)}
                    className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 mb-0.5 shrink-0" />
                    <span className="truncate max-w-full text-[9px] sm:text-[10px]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2.5">
            {/* Email Input */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="e.g. user@arogyagenie.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-hidden focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">Password</label>
                <Link
                  to={ROUTES.AUTH.FORGOT_PASSWORD}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-9 py-2 rounded-xl border border-white/15 bg-white/5 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-hidden focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              style={{
                background: "linear-gradient(135deg, #6C63FF 0%, #4F46E5 100%)",
                boxShadow: "0 4px 16px rgba(108, 99, 255, 0.35)",
              }}
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>
                  <LogIn className="h-4 w-4 shrink-0" />
                  <span>Sign In as {ROLE_OPTIONS.find((r) => r.userType === selectedRole)?.label}</span>
                </>
              )}
            </button>
          </form>

          {/* Compact Divider */}
          <div className="flex items-center gap-2.5 my-1.5">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">Or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Google Sign In */}
          <div className="flex justify-center">
            {isGoogleLoading ? (
              <div className="flex items-center gap-2 text-xs text-slate-400 py-1">
                <span className="h-3.5 w-3.5 border-2 border-slate-400/30 border-t-slate-400 rounded-full animate-spin" />
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
                size="medium"
                width="320"
              />
            )}
          </div>
        </>
      )}
    </AuthCard>
  );
}

export default LoginPage;