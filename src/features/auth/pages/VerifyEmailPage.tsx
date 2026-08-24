// src/pages/VerifyEmailPage.tsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { CheckCircle2, XCircle, Loader2, ArrowRight, Mail, RefreshCw } from "lucide-react";
import { ROUTES } from "@/constants/routes.constants";
import { getRoleDashboardPath } from "../../auth/hooks/useAuth";
import type { BackendUserType } from "@/types/auth.types";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  
  // State for resending verification email on 400 error
  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Invalid or missing verification token in the URL.");
      return;
    }

    const verifyToken = async () => {
      try {
        // Send request with token to backend
        const response = await axios.post("http://localhost:4000/api/v1/auth/verify-email", { token });
        
        setStatus("success");

        // Extract user role from backend response if available, then redirect automatically
        const userRole = response.data?.user?.role || response.data?.role as BackendUserType;
        const redirectPath = getRoleDashboardPath(userRole);

        // Short delay to show success icon before navigating
        setTimeout(() => {
          navigate(redirectPath, { replace: true });
        }, 1500);

      } catch (err: any) {
        setStatus("error");
        
        // Handle specific 400 errors or general fallback messages
        if (err.response?.status === 400) {
          setErrorMessage(err.response?.data?.message || "Verification link has expired or is invalid.");
        } else {
          setErrorMessage(err.response?.data?.message || "An unexpected error occurred during verification.");
        }
      }
    };

    verifyToken();
  }, [token, navigate]);

  const handleResendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsResending(true);
    setResendSuccess(false);
    setErrorMessage("");

    try {
      await axios.post("http://localhost:4000/api/v1/auth/resend-verification", { email });
      setResendSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Failed to resend verification email.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-white/10 rounded-2xl p-8 text-center space-y-4">
        
        {/* LOADING STATE */}
        {status === "loading" && (
          <>
            <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-white">Verifying your email...</h2>
            <p className="text-slate-400 text-sm">Please wait while we confirm your account token.</p>
          </>
        )}

        {/* SUCCESS STATE */}
        {status === "success" && (
          <>
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
            <h2 className="text-xl font-bold text-white">Email Verified!</h2>
            <p className="text-slate-400 text-sm">Redirecting you to your dashboard...</p>
          </>
        )}

        {/* ERROR STATE (e.g., 400 Bad Request / Expired Token) */}
        {status === "error" && (
          <div className="space-y-4 text-left">
            <div className="text-center space-y-2">
              <XCircle className="h-12 w-12 text-red-500 mx-auto" />
              <h2 className="text-xl font-bold text-white">Verification Failed</h2>
              <p className="text-red-400 text-sm text-center">{errorMessage}</p>
            </div>

            {/* RESEND FORM BOX */}
            <div className="mt-6 pt-6 border-t border-slate-800 space-y-3">
              <p className="text-xs text-slate-300 text-center">
                Your link may have expired. Enter your email address below to request a new verification link.
              </p>

              {resendSuccess ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs text-center">
                  New verification link sent! Please check your inbox.
                </div>
              ) : (
                <form onSubmit={handleResendEmail} className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-9 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isResending}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors disabled:opacity-50"
                  >
                    {isResending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    <span>Resend Verification Link</span>
                  </button>
                </form>
              )}
            </div>

            <div className="text-center pt-2">
              <Link
                to={ROUTES.AUTH.LOGIN}
                className="inline-block text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Back to Login
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}