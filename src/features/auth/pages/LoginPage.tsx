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
  const [rememberMe, setRememberMe] = useState(true);
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
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "Invalid email or password.";
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
      {/* Error Alert */}
      {(error || validationError) && (
        <div className="p-3 mb-4 rounded-xl bg-red-500/15 border border-red-500/30 flex items-start gap-2.5 text-red-200 text-xs">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
          <span className="flex-1">{error || validationError}</span>
        </div>
      )}

      {mfaPending?.required ? (
        /* MFA Challenge Form */
        <form onSubmit={handleMfaSubmit} className="space-y-4 animate-fadeIn">
          <div className="text-center py-2">
            <div className="h-12 w-12 rounded-full bg-indigo-500/15 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/30 mb-2">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <p className="text-xs text-slate-300">
              Your account is protected with Multi-Factor Authentication. Please enter your 6-digit verification code.
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white placeholder-slate-500 text-sm tracking-widest font-mono text-center focus:outline-hidden focus:border-indigo-400 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm text-white shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #6C63FF 0%, #4F46E5 100%)",
            }}
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
          <div className="mb-4">
            <label className="text-xs font-semibold text-slate-300 block mb-2">
              Select Portal Role:
            </label>
            <div className="grid grid-cols-5 gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10">
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="e.g. user@arogyagenie.com"
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
                  required
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

          {/* Google Sign In */}
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
        </>
      )}
    </AuthCard>
  );
}

export default LoginPage;