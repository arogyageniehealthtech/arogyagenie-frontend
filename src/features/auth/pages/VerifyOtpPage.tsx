import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { KeyRound, AlertCircle, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react";
import { AuthCard } from "../components/AuthCard";
import { OtpInput } from "../components/OtpInput";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "@/constants/routes.constants";

export function VerifyOtpPage() {
  const location = useLocation();
  const { verifyOtp, resendOtp, mfaPending, isLoading, error, clearError } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const emailParam = queryParams.get("email") || mfaPending?.emailOrPhone || "user@arogyagenie.com";

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async (codeToSubmit = otp) => {
    setValidationError(null);
    clearError();

    if (codeToSubmit.length < 6) {
      setValidationError("Please enter the complete 6-digit verification code.");
      return;
    }

    try {
      await verifyOtp({
        emailOrPhone: emailParam,
        otp: codeToSubmit,
        tempToken: mfaPending?.tempToken,
      });
    } catch {
      // Handled via auth hook state
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    try {
      const res = await resendOtp(emailParam);
      setResendStatus(res.message || "New OTP sent successfully.");
      setTimer(60);
      setTimeout(() => setResendStatus(null), 4000);
    } catch {
      setValidationError("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <AuthCard
      title="Two-Step Verification"
      subtitle={`Enter the 6-digit verification code sent to ${emailParam}`}
      badge="Security Check"
      footer={
        <div className="flex items-center justify-between text-xs text-slate-400">
          <Link
            to={ROUTES.AUTH.LOGIN}
            className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
          </Link>
          <span>Need help? Contact support</span>
        </div>
      }
    >
      {/* Error Banner */}
      {(error || validationError) && (
        <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 flex items-start gap-2.5 text-red-200 text-xs">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
          <span className="flex-1">{error || validationError}</span>
        </div>
      )}

      {/* Success Notification */}
      {resendStatus && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-2.5 text-emerald-200 text-xs">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{resendStatus}</span>
        </div>
      )}

      {/* OTP Input Fields */}
      <div className="py-2">
        <OtpInput
          length={6}
          value={otp}
          onChange={(val) => {
            setOtp(val);
            setValidationError(null);
            clearError();
          }}
          onComplete={(code) => handleVerify(code)}
          hasError={!!error || !!validationError}
          disabled={isLoading}
        />
      </div>

      {/* Resend Timer Block */}
      <div className="text-center text-xs text-slate-400 my-2">
        {timer > 0 ? (
          <p>
            Resend available in <span className="font-mono text-indigo-300 font-semibold">{timer}s</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="inline-flex items-center gap-1.5 font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Resend verification code
          </button>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={() => handleVerify()}
        disabled={isLoading || otp.length < 6}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm text-white shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: "linear-gradient(135deg, #6C63FF 0%, #4F46E5 100%)",
          boxShadow: "0 4px 20px rgba(108, 99, 255, 0.4)",
        }}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Verifying Code...
          </span>
        ) : (
          <>
            <KeyRound className="h-4 w-4" />
            <span>Verify & Authenticate</span>
          </>
        )}
      </button>
    </AuthCard>
  );
}

export default VerifyOtpPage;
