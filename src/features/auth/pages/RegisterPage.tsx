import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Stethoscope,
  Building2,
  Truck,
  AlertCircle,
  ArrowRight,
  Check,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { AuthCard } from "../components/AuthCard";
import { GoogleLoginButton } from "../components/GoogleLoginButton";
import { useAuth, getRoleDashboardPath } from "../hooks/useAuth";
import { ROUTES } from "@/constants/routes.constants";
import type { BackendUserType } from "@/types/auth.types";

const ROLES: { type: BackendUserType; label: string; description: string; icon: React.ElementType }[] = [
  {
    type: "PATIENT",
    label: "Patient",
    description: "Personal health hub",
    icon: UserCheck,
  },
  {
    type: "DOCTOR",
    label: "Doctor",
    description: "Clinical management",
    icon: Stethoscope,
  },
  {
    type: "ORG_MEMBER",
    label: "Partner / Staff",
    description: "Hospital, Pharmacy & Lab",
    icon: Building2,
  },
  {
    type: "DELIVERY_PARTNER",
    label: "Courier",
    description: "Medicine logistics",
    icon: Truck,
  },
];

export default function RegisterPage() {
  const { register, isLoading, error, clearError } = useAuth();

  const [userType, setUserType] = useState<BackendUserType>("PATIENT");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [registrationSuccessMessage, setRegistrationSuccessMessage] = useState<string | null>(null);

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 10) return "Password must be at least 10 characters long.";
    if (!/[a-z]/.test(pwd)) return "Password must contain at least one lowercase letter.";
    if (!/[A-Z]/.test(pwd)) return "Password must contain at least one uppercase letter.";
    if (!/[0-9]/.test(pwd)) return "Password must contain at least one digit.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!email.trim() || !email.includes("@")) {
      setValidationError("Please enter a valid email address.");
      return;
    }

    const pwdError = validatePassword(password);
    if (pwdError) {
      setValidationError(pwdError);
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      setValidationError("You must agree to the Terms of Service & Privacy Policy.");
      return;
    }

    try {
      const response = await register({
        userType,
        email: email.trim(),
        password,
      });
      console.log(response)
      setRegistrationSuccessMessage(
        response?.message || "Registration successful! A verification link has been sent to your email."
      );
    } catch (err: any) {
      console.error("Registration error:", err);
      let msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed. Please try again.";
      if (err.code === "ECONNABORTED" || err?.message?.includes("timeout")) {
        msg = "The server took too long to respond (timeout). If the backend is waking up from idle or processing, please wait a moment and try again.";
      }
      setValidationError(msg);
    }
  };

  const handleGoogleSignup = async () => {
    // In production, Google Sign-in flow passes idToken to POST /auth/oauth/google
    setValidationError("Please use the Google Sign-in button on the login page for automated account linking.");
  };

  return (
    <AuthCard
      title="Create Account"
      subtitle="Join ArogyaGenie digital healthcare ecosystem"
      badge="Quick Signup"
      footer={
        <p className="text-center text-xs sm:text-sm text-slate-400">
          Already registered?{" "}
          <Link
            to={ROUTES.AUTH.LOGIN}
            className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1"
          >
            Sign in here <ArrowRight className="h-3 w-3" />
          </Link>
        </p>
      }
    >
      <div className="space-y-4 w-full max-w-md mx-auto px-1 sm:px-0">
        {/* Success State */}
        {registrationSuccessMessage ? (
          <div className="space-y-4 text-center py-4 animate-fadeIn">
            <div className="h-12 w-12 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Check Your Email</h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                {registrationSuccessMessage}
              </p>
            </div>
            <Link
              to={ROUTES.AUTH.LOGIN}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white shadow-lg bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 transition-all"
            >
              <span>Return to Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* Role Selector Cards */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2 tracking-wide uppercase">
                Select Account Type
              </label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {ROLES.map(({ type, label, description, icon: Icon }) => {
                  const isSelected = userType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setUserType(type);
                        clearError();
                        setValidationError(null);
                      }}
                      className={`relative flex flex-col items-center justify-between p-2.5 sm:p-3 rounded-xl text-left border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-600/15 text-white shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/50"
                          : "border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20"
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-1.5 right-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                          <Check className="h-2.5 w-2.5 stroke-3" />
                        </span>
                      )}
                      <Icon className={`h-5 w-5 sm:h-6 sm:w-6 mb-1.5 ${isSelected ? "text-indigo-400" : "text-slate-400"}`} />
                      <div className="text-center w-full">
                        <div className="text-xs sm:text-sm font-semibold truncate leading-tight">{label}</div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5 block">
                          {description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Alert */}
            {(error || validationError) && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2 text-red-300 text-xs sm:text-sm animate-fadeIn">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
                <span className="flex-1 leading-snug wrap-break-word">{error || validationError}</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
              {/* Email Input */}
              <div>
                <label className="text-xs sm:text-sm font-medium text-slate-300 block mb-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3 py-2.5 sm:py-3 rounded-xl border border-white/10 bg-slate-900/40 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs sm:text-sm font-medium text-slate-300">Password</label>
                  <span className="text-[10px] text-slate-400">Min 10 chars (A-Z, a-z, 0-9)</span>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 10 characters"
                    className="w-full pl-9 pr-9 py-2.5 sm:py-3 rounded-xl border border-white/10 bg-slate-900/40 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="text-xs sm:text-sm font-medium text-slate-300 block mb-1">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className={`w-full pl-9 pr-3 py-2.5 sm:py-3 rounded-xl border bg-slate-900/40 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none transition-all ${
                      confirmPassword && confirmPassword === password
                        ? "border-emerald-500/50 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        : "border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    }`}
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  id="agreeTerms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="h-4 w-4 mt-0.5 shrink-0 rounded border-white/20 bg-slate-900/60 text-indigo-600 accent-indigo-600 cursor-pointer focus:ring-0"
                />
                <label htmlFor="agreeTerms" className="text-xs sm:text-sm text-slate-400 leading-relaxed cursor-pointer select-none">
                  I accept the{" "}
                  <span className="text-indigo-400 hover:underline">Terms of Service</span> and{" "}
                  <span className="text-indigo-400 hover:underline">Privacy Policy</span>.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white shadow-lg shadow-indigo-600/30 bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 active:scale-[0.99] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2 text-center">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                    <span className="truncate">Creating Account...</span>
                  </span>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 shrink-0" />
                    <span>Create Account</span>
                    <ArrowRight className="h-4 w-4 ml-auto shrink-0" />
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </AuthCard>
  );
}
