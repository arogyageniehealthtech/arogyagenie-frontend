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
    <div className="h-screen h-dvh max-h-screen max-h-dvh w-full flex flex-col items-center justify-center p-2 sm:p-4 bg-slate-950 text-slate-100 relative overflow-hidden select-none font-sans">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-violet-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-blue-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35vw] h-[35vw] rounded-full bg-indigo-500/10 blur-[140px] pointer-events-none" />

      {/* Main Container */}
      <div className={`w-full ${maxWidth} relative z-10 my-auto flex flex-col justify-center max-h-full`}>
        {/* Brand Header */}
        <div className="text-center mb-1.5 sm:mb-2.5 shrink-0">
          <Link to="/" className="inline-flex items-center gap-2 group focus:outline-hidden">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-white p-1.5 shadow-xl shadow-indigo-500/10 flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
              <img
                src="/LOGO.png"
                alt="ArogyaGenie"
                className="h-5 w-5 sm:h-6 sm:w-6 object-contain"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div className="text-left">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white block leading-tight">
                Arogya<span className="text-indigo-400">Genie</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-medium tracking-wider uppercase text-violet-300/70 block">
                Healthcare Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Card Box */}
        <div
          className="rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 md:p-6 shadow-2xl backdrop-blur-xl border border-white/10 shrink min-h-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(30, 22, 60, 0.85) 0%, rgba(18, 12, 45, 0.92) 100%)",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Header Title & Subtitle */}
          <div className="mb-2 sm:mb-2.5 flex items-center justify-between gap-2 flex-wrap shrink-0">
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white leading-tight">{title}</h1>
              {subtitle && <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 leading-snug">{subtitle}</p>}
            </div>
            {badge && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <ShieldCheck className="h-3 w-3" />
                {badge}
              </span>
            )}
          </div>

          {/* Body Content */}
          <div className="space-y-2 sm:space-y-2.5">{children}</div>

          {/* Card Footer */}
          {footer && <div className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-white/10 shrink-0">{footer}</div>}
        </div>

        {/* Security & Compliance Notice */}
        <div className="mt-1.5 text-center flex items-center justify-center gap-1.5 text-[10px] text-slate-500 shrink-0">
          <ShieldCheck className="h-3 w-3 text-indigo-400 shrink-0" />
          <span>256-Bit SSL Encrypted & HIPAA Compliant</span>
        </div>
      </div>
    </div>
  );
}

export default AuthCard;
