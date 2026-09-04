import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, KeyRound, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { AuthCard } from "../components/AuthCard";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "@/constants/routes.constants";

export function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetPassword, isLoading, error, clearError } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const tokenParam = queryParams.get("token") || "";

  const [tokenOrOtp, setTokenOrOtp] = useState(tokenParam);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 10) return "New password must be at least 10 characters long.";
    if (!/[a-z]/.test(pwd)) return "New password must contain at least one lowercase letter.";
    if (!/[A-Z]/.test(pwd)) return "New password must contain at least one uppercase letter.";
    if (!/[0-9]/.test(pwd)) return "New password must contain at least one digit.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!tokenOrOtp.trim()) {
      setValidationError("Please enter the recovery code/token received.");
      return;
    }

    const pwdError = validatePassword(newPassword);
    if (pwdError) {
      setValidationError(pwdError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    try {
      await resetPassword({
        token: tokenOrOtp.trim(),
        newPassword,
      });
      setIsSuccess(true);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "Password reset failed. Please check your token.";
      setValidationError(msg);
    }
  };

  return (
    <AuthCard
      title="Create New Password"
      subtitle="Set a secure password for your ArogyaGenie account"
      badge="Password Reset"
      footer={
        <p className="text-center text-sm text-slate-400">
          Remember your password?{" "}
          <Link
            to={ROUTES.AUTH.LOGIN}
            className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Sign in
          </Link>
        </p>
      }
    >
      {/* Error Banner */}
      {(error || validationError) && (
        <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 flex items-start gap-2.5 text-red-200 text-xs">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
          <span className="flex-1">{error || validationError}</span>
        </div>
      )}

      {/* Success State */}
      {isSuccess ? (
        <div className="space-y-4 text-center py-4">
          <div className="h-12 w-12 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Password Updated Successfully</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Your account password has been updated. You can now login with your new credentials.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(ROUTES.AUTH.LOGIN)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm text-white shadow-lg transition-all cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #6C63FF 0%, #4F46E5 100%)",
            }}
          >
            <span>Proceed to Login</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        /* Form */
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Reset Token / Code
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                required
                value={tokenOrOtp}
                onChange={(e) => setTokenOrOtp(e.target.value)}
                placeholder="Enter password reset token"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-hidden focus:border-indigo-400"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-slate-300">New Password</label>
              <span className="text-[10px] text-slate-400">Min 10 chars (A-Z, a-z, 0-9)</span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 10 characters"
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
            <label className="text-xs font-medium text-slate-300 block mb-1">Confirm New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-hidden focus:border-indigo-400"
            />
          </div>

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
                Updating Password...
              </span>
            ) : (
              <span>Save & Update Password</span>
            )}
          </button>
        </form>
      )}
    </AuthCard>
  );
}

export default ResetPasswordPage;

