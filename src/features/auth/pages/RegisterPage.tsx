import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { AuthCard } from "../components/AuthCard";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "@/constants/routes.constants";
import type { BackendUserType } from "@/types/auth.types";

const ROLES: { type: BackendUserType; label: string; description: string }[] = [
  {
    type: "PATIENT",
    label: "Patient",
    description: "Personal health hub",
  },
  {
    type: "DOCTOR",
    label: "Doctor",
    description: "Clinical management",
  },
  {
    type: "ORG_MEMBER",
    label: "Partner / Staff",
    description: "Hospital, Pharmacy & Lab",
  },
  {
    type: "DELIVERY_PARTNER",
    label: "Organization Member",
    description: "Medicine logistics",
  },
];

export default function RegisterPage() {
  const { register, isLoading, error, clearError } = useAuth();

  const [userType, setUserType] = useState<BackendUserType>("PATIENT");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [registrationSuccessMessage, setRegistrationSuccessMessage] = useState<string | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedRole = ROLES.find((r) => r.type === userType) || ROLES[0];

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

    try {
      const response = await register({
        userType,
        email: email.trim(),
        password,
      });
      setRegistrationSuccessMessage(
        response?.message || "Registration successful! A verification link has been sent to your email."
      );
    } catch (err: any) {
      console.error("Registration error:", err);
      let msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message;

      if (!msg) {
        if (err.code === "ECONNABORTED" || err?.message?.includes("timeout")) {
          msg = "The server took too long to respond (timeout). Please wait a moment and try again.";
        } else if (err.message === "Network Error" || err.code === "ERR_NETWORK") {
          msg = "Unable to connect to the backend server. Please check your internet connection.";
        } else {
          msg = err?.message || "Registration failed. Please try again.";
        }
      }
      setValidationError(msg);
    }
  };

  return (
    <AuthCard
      title="Create Account"
      subtitle="Join ArogyaGenie digital healthcare ecosystem"
      badge="Quick Signup"
      maxWidth="w-full max-w-[280px] sm:max-w-xl md:max-w-2xl mx-auto"
      footer={
        <p className="text-center text-[10px] sm:text-xs text-slate-400">
          Already registered?{" "}
          <Link
            to={ROUTES.AUTH.LOGIN}
            className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1"
          >
            Sign in here
          </Link>
        </p>
      }
    >
      <div className="w-full space-y-2 sm:space-y-2.5">
        {/* Success State */}
        {registrationSuccessMessage ? (
          <div className="space-y-2 sm:space-y-2.5 text-center py-1 sm:py-2 animate-fadeIn">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white">Check Your Email</h3>
              <p className="text-[10px] sm:text-xs text-slate-300 mt-1 leading-relaxed break-words">
                {registrationSuccessMessage}
              </p>
            </div>
            <Link
              to={ROUTES.AUTH.LOGIN}
              className="w-full inline-flex items-center justify-center gap-2 py-1.5 sm:py-2.5 px-4 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm text-white shadow-lg bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 transition-all text-center"
            >
              <span>Return to Sign In</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Role Selector */}
            <div>
              <label className="text-[9px] sm:text-[11px] font-semibold text-slate-300 block mb-1 tracking-wide uppercase">
                Select Account Type
              </label>

              {/* Mobile Role-Only Dropdown */}
              <div className="block sm:hidden relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  aria-haspopup="listbox"
                  aria-expanded={isDropdownOpen}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border bg-slate-900/60 backdrop-blur-md transition-all text-left ${
                    isDropdownOpen
                      ? "border-indigo-500 ring-2 ring-indigo-500/20"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <span className="text-xs font-medium text-white truncate">
                    {selectedRole.label}
                  </span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180 text-indigo-400" : ""
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-30 left-0 right-0 mt-1 py-1 rounded-lg border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-xl shadow-black/50 space-y-0.5">
                    {ROLES.map(({ type, label }) => {
                      const isSelected = userType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            setUserType(type);
                            setIsDropdownOpen(false);
                            clearError();
                            setValidationError(null);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs transition-colors rounded-md ${
                            isSelected
                              ? "bg-indigo-600/20 text-indigo-400 font-semibold"
                              : "text-slate-300 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <span className="truncate">{label}</span>
                          {isSelected && (
                            <Check className="h-3 w-3 text-indigo-400 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Desktop & Tablet grid */}
              <div className="hidden sm:grid grid-cols-4 gap-2">
                {ROLES.map(({ type, label, description }) => {
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
                      className={`relative flex flex-col items-center justify-center py-2 px-2 rounded-xl text-center border transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-600/20 text-white shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/50"
                          : "border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20"
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-1 right-1 h-3 w-3 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                          <Check className="h-2 w-2 stroke-[3]" />
                        </span>
                      )}
                      <div className="text-xs font-semibold truncate leading-tight w-full text-center">
                        {label}
                      </div>
                      <div className="text-[9px] text-slate-400 truncate w-full mt-0.5 text-center">
                        {description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Alert */}
            {(error || validationError) && (
              <div className="p-1 sm:p-2 rounded-md sm:rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-1.5 text-red-300 text-[10px] sm:text-xs animate-fadeIn">
                <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 mt-0.5 text-red-400" />
                <span className="flex-1 leading-tight sm:leading-snug break-words">
                  {error || validationError}
                </span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-1.5 sm:space-y-2.5">
              {/* Email Input */}
              <div className="space-y-0.5">
                <label className="text-[9px] sm:text-xs font-medium text-slate-300 block">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-2 py-1 sm:px-3 sm:py-2 rounded-md sm:rounded-xl border border-white/10 bg-slate-900/40 text-white placeholder-slate-500 text-[11px] sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all box-border"
                />
              </div>

              {/* Passwords: Stacked on Mobile, 2-Column on Desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2.5">
                {/* Password Input */}
                <div className="space-y-0.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] sm:text-xs font-medium text-slate-300">
                      Password
                    </label>
                    <span className="text-[8px] sm:text-[9px] text-slate-400">
                      Min 10 chars
                    </span>
                  </div>
                  <div className="relative w-full">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••"
                      className="w-full pl-2 pr-6 py-1 sm:pl-3 sm:pr-8 sm:py-2 rounded-md sm:rounded-xl border border-white/10 bg-slate-900/40 text-white placeholder-slate-500 text-[11px] sm:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all box-border"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-1.5 sm:right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                      ) : (
                        <Eye className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-0.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] sm:text-xs font-medium text-slate-300">
                      Confirm Password
                    </label>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••"
                    className={`w-full px-2 py-1 sm:px-3 sm:py-2 rounded-md sm:rounded-xl border bg-slate-900/40 text-white placeholder-slate-500 text-[11px] sm:text-sm focus:outline-none transition-all box-border ${
                      confirmPassword && confirmPassword === password
                        ? "border-emerald-500/50 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        : "border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    }`}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center py-1.5 sm:py-2.5 px-3 sm:px-4 rounded-md sm:rounded-xl font-semibold text-xs sm:text-sm text-white shadow-md shadow-indigo-600/30 bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 active:scale-[0.99] transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-1 text-center"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                    <span>Creating...</span>
                  </span>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </AuthCard>
  );
}