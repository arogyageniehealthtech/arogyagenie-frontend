import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, ArrowRight, AlertCircle, CheckCircle2, KeyRound } from "lucide-react";
import { AuthCard } from "../components/AuthCard";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "@/constants/routes.constants";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { forgotPassword, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!email.trim() || !email.includes("@")) {
      setValidationError("Please enter your registered email address.");
      return;
    }

    try {
      const res = await forgotPassword({ email: email.trim().toLowerCase() });
      setSuccessMessage(res.message || "Reset instructions sent.");
      setIsSubmitted(true);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to send reset link.";
      setValidationError(msg);
    }
  };

  return (
    <AuthCard
      title="Reset Your Password"
      subtitle="Enter your account email to receive a recovery code"
      badge="Account Recovery"
      footer={
        <div className="text-center text-xs text-slate-400">
          <Link
            to={ROUTES.AUTH.LOGIN}
            className="inline-flex items-center gap-1.5 font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Return to Sign In
          </Link>
        </div>
      }
    >
      {/* Error Alert */}
      {(error || validationError) && (
        <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 flex items-start gap-2.5 text-red-200 text-xs">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
          <span className="flex-1">{error || validationError}</span>
        </div>
      )}

      {/* Success State */}
      {isSubmitted ? (
        <div className="space-y-4 text-center py-2">
          <div className="h-12 w-12 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Recovery Instructions Sent</h3>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              {successMessage || `We have sent password reset instructions to ${email}.`}
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              navigate(`${ROUTES.AUTH.RESET_PASSWORD}?email=${encodeURIComponent(email)}`)
            }
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white shadow-lg transition-all cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #6C63FF 0%, #4F46E5 100%)",
            }}
          >
            <KeyRound className="h-4 w-4" />
            <span>Enter Reset Token Now</span>
          </button>
        </div>
      ) : (
        /* Input Form */
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1.5">
              Registered Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. user@arogyagenie.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-indigo-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm text-white shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #6C63FF 0%, #4F46E5 100%)",
              boxShadow: "0 4px 20px rgba(108, 99, 255, 0.4)",
            }}
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending Recovery Email...
              </span>
            ) : (
              <>
                <span>Send Reset Link</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      )}
    </AuthCard>
  );
}

export default ForgotPasswordPage;

