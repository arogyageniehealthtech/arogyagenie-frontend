import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  maxWidth?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({
  title,
  subtitle,
  badge,
  maxWidth = "max-w-md",
  children,
  footer,
}: AuthCardProps) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-3 sm:p-5 lg:p-6 bg-slate-950 text-slate-100 relative overflow-x-hidden select-none font-sans">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-violet-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-blue-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35vw] h-[35vw] rounded-full bg-indigo-500/10 blur-[140px] pointer-events-none" />

      {/* Main Container */}
      <div className={`w-full ${maxWidth} relative z-10 my-auto py-1 sm:py-2`}>
        {/* Brand Header */}
        <div className="text-center mb-3 sm:mb-4">
          <Link to="/" className="inline-flex items-center gap-2.5 group focus:outline-hidden">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-white p-2 shadow-xl shadow-indigo-500/10 flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
              <img
                src="/LOGO.png"
                alt="ArogyaGenie"
                className="h-6 w-6 sm:h-7 sm:w-7 object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div className="text-left">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white block leading-tight">
                Arogya<span className="text-indigo-400">Genie</span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium tracking-wider uppercase text-violet-300/70">
                Healthcare Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Card Box */}
        <div
          className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-7 shadow-2xl backdrop-blur-xl border border-white/10"
          style={{
            background:
              "linear-gradient(180deg, rgba(30, 22, 60, 0.8) 0%, rgba(18, 12, 45, 0.9) 100%)",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Header Title & Subtitle */}
          <div className="mb-3 sm:mb-4 flex items-center justify-between gap-2 flex-wrap">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{title}</h1>
              {subtitle && <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
            {badge && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <ShieldCheck className="h-3 w-3" />
                {badge}
              </span>
            )}
          </div>

          {/* Body Content */}
          <div className="space-y-3 sm:space-y-3.5">{children}</div>

          {/* Card Footer */}
          {footer && <div className="mt-3.5 sm:mt-4 pt-3 border-t border-white/10">{footer}</div>}
        </div>

        {/* Security & Compliance Notice */}
        <div className="mt-2.5 sm:mt-3 text-center flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
          <span>256-Bit SSL Encrypted & HIPAA Compliant</span>
        </div>
      </div>
    </div>
  );
}

export default AuthCard;
