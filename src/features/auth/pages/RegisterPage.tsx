import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Stethoscope,
  Building2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { AuthCard } from "../components/AuthCard";
import { GoogleLoginButton } from "../components/GoogleLoginButton";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "@/constants/routes.constants";
import type { Gender, UserRole } from "@/types/auth.types";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();

  const [role, setRole] = useState<UserRole>("PATIENT");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState<Gender>("MALE");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [facilityName, setFacilityName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!firstName.trim() || !lastName.trim()) {
      setValidationError("Please provide both first and last name.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setValidationError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    if (role === "DOCTOR" && !licenseNumber.trim()) {
      setValidationError("Please provide your medical license number.");
      return;
    }

    if (!agreeTerms) {
      setValidationError("You must agree to the Terms of Service & Privacy Policy.");
      return;
    }

    try {
      await register({
        role,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        password,
        gender: role === "PATIENT" ? gender : undefined,
        licenseNumber: role === "DOCTOR" ? licenseNumber.trim() : undefined,
        facilityName: role === "HOSPITAL_ADMIN" || role === "LAB" || role === "PHARMACY" ? facilityName.trim() : undefined,
      });
    } catch {
      // Handled via auth hook state
    }
  };

  return (
    <AuthCard
      title="Create Account"
      subtitle="Join ArogyaGenie digital healthcare ecosystem"
      badge="Free Registration"
      footer={
        <p className="text-center text-sm text-slate-400">
          Already registered?{" "}
          <Link
            to={ROUTES.AUTH.LOGIN}
            className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1"
          >
            Sign in here <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </p>
      }
    >
      {/* Role Selection Tabs */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-slate-300 block mb-2">
          I am registering as:
        </label>
        <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-white/5 border border-white/10">
          {[
            { r: "PATIENT" as UserRole, label: "Patient", icon: UserCheck },
            { r: "DOCTOR" as UserRole, label: "Doctor", icon: Stethoscope },
            { r: "HOSPITAL_ADMIN" as UserRole, label: "Healthcare Facility", icon: Building2 },
          ].map((item) => {
            const isSelected = role === item.r;
            const Icon = item.icon;
            return (
              <button
                key={item.r}
                type="button"
                onClick={() => {
                  setRole(item.r);
                  clearError();
                  setValidationError(null);
                }}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="h-4 w-4 mb-1 shrink-0" />
                <span className="truncate max-w-full">{item.label}</span>
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
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">First Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-hidden focus:border-indigo-400"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-hidden focus:border-indigo-400"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-xs font-medium text-slate-300 block mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. name@example.com"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-hidden focus:border-indigo-400"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="text-xs font-medium text-slate-300 block mb-1">
            Mobile Phone <span className="text-slate-500 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-hidden focus:border-indigo-400"
            />
          </div>
        </div>

        {/* Doctor Specific: Medical License */}
        {role === "DOCTOR" && (
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Medical Registration / License Number
            </label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-indigo-400" />
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="e.g. MCI-2024-98432"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-indigo-500/40 bg-indigo-500/10 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-hidden focus:border-indigo-400"
              />
            </div>
          </div>
        )}

        {/* Facility Specific: Facility Name */}
        {role === "HOSPITAL_ADMIN" && (
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Hospital / Clinic / Center Name
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                placeholder="e.g. Apollo Super Specialty Hospital"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-hidden focus:border-indigo-400"
              />
            </div>
          </div>
        )}

        {/* Patient Specific: Gender */}
        {role === "PATIENT" && (
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Gender</label>
            <div className="grid grid-cols-3 gap-2">
              {(["MALE", "FEMALE", "OTHER"] as Gender[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-medium border cursor-pointer transition-colors ${
                    gender === g
                      ? "border-indigo-500 bg-indigo-500/20 text-white font-semibold"
                      : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  {g === "MALE" ? "Male" : g === "FEMALE" ? "Female" : "Other"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 chars"
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-white/15 bg-white/5 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-hidden focus:border-indigo-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-hidden focus:border-indigo-400"
            />
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2 pt-1">
          <input
            id="agreeTerms"
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="h-4 w-4 mt-0.5 rounded-sm border-white/20 bg-white/5 text-indigo-600 accent-indigo-600 cursor-pointer"
          />
          <label htmlFor="agreeTerms" className="text-xs text-slate-400 leading-relaxed cursor-pointer select-none">
            I agree to the{" "}
            <span className="text-indigo-400 underline">Terms of Service</span> and{" "}
            <span className="text-indigo-400 underline">Privacy Policy</span>.
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm text-white shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50 mt-2"
          style={{
            background: "linear-gradient(135deg, #6C63FF 0%, #4F46E5 100%)",
            boxShadow: "0 4px 20px rgba(108, 99, 255, 0.4)",
          }}
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating Account...
            </span>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs uppercase tracking-widest text-slate-500 font-medium">Or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      {/* Google Sign In */}
      <GoogleLoginButton
        text="Sign up with Google"
        onClick={() => {
          register({
            role,
            firstName: "Google",
            lastName: "User",
            email: "google.user@gmail.com",
          });
        }}
        isLoading={isLoading}
      />
    </AuthCard>
  );
}

export default RegisterPage;
