// src/pages/VerifyEmailPage.tsx
import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, Mail, RefreshCw, ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants/routes.constants";
import { authApi } from "../api/auth.api";

export default function VerifyEmailPage() {
  const { token: paramToken } = useParams<{ token?: string }>();
  const [searchParams] = useSearchParams();
  const queryToken = searchParams.get("token") || "";
  const token = paramToken || queryToken;

  const navigate = useNavigate();

  // Prevent double execution in React 18 StrictMode
  const isMountedRef = useRef(false);

  const [status, setStatus] = useState<"loading" | "success" | "error">(token ? "loading" : "error");
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (isMountedRef.current) return;
    isMountedRef.current = true;

    if (!token) {
      setStatus("error");
      setErrorMessage("No verification token found in link.");
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await authApi.verifyEmail(token);

        if (response.success) {
          setStatus("success");
          setTimeout(() => {
            navigate(ROUTES.AUTH.LOGIN, { replace: true });
          }, 2500);
        } else {
          setStatus("error");
          setErrorMessage(response.message || "Email verification failed.");
        }
      } catch (err: any) {
        setStatus("error");
        setErrorMessage(
          err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          "Verification link has expired or is invalid."
        );
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
      const response = await authApi.resendEmail(email);
      if (response.success) {
        setResendSuccess(true);
      } else {
        setErrorMessage(response.message || "Failed to resend verification email.");
      }
    } catch (err: any) {
      setErrorMessage(
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        "Failed to resend verification email."
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-white/10 rounded-2xl p-8 text-center space-y-4">
        {status === "loading" && (
          <>
            <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-white">Verifying your email...</h2>
            <p className="text-slate-400 text-sm">Please wait while we confirm your account token.</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
            <h2 className="text-xl font-bold text-white">Email Verified Successfully!</h2>
            <p className="text-slate-400 text-sm">Your email has been verified. Redirecting to sign in...</p>
            <div className="pt-2">
              <Link
                to={ROUTES.AUTH.LOGIN}
                className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                <span>Click here if not redirected automatically</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </>
        )}

        {status === "error" && (
          <div className="space-y-4 text-left">
            <div className="text-center space-y-2">
              <XCircle className="h-12 w-12 text-red-500 mx-auto" />
              <h2 className="text-xl font-bold text-white">Verification Link Expired / Invalid</h2>
              <p className="text-red-400 text-sm text-center">{errorMessage}</p>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-800 space-y-3">
              <p className="text-xs text-slate-300 text-center">
                Enter your email address below to request a fresh verification link.
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