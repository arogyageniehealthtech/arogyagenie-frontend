import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Sparkles,
  X,
  Badge,
  Activity,
  Bot,
  Send,
  User,
  BookOpen,
  ChevronDown,
  ChevronUp,
  FileText,
  CheckCircle2,
  MessageSquareText,
  Lightbulb,
  HeartPulse,
  Phone,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Building2,
  Paperclip,
  Mic,
  MicOff,
  UploadCloud,
  CheckCheck,
  Plus,
  MoreVertical,
  Stethoscope,
  Trash2,
} from "lucide-react";
import { useToast } from "@/features/patient/hooks/use-toast";
import { useLocation } from "wouter";

// ── Types ─────────────────────────────────────────────────────────────
interface ChatMessage {
  id: string;
  sender: "patient" | "assistant";
  text: string;
  usedRag?: boolean;
  sources?: Array<{
    documentId?: string;
    title?: string;
    source?: string;
    publisher?: string;
    section?: string;
    page?: string;
  }>;
  retrieval?: {
    topK: number;
    resultsUsed: number;
  };
  disclaimer?: string;
  timestamp: string;
  attachmentName?: string;
}

// ── Particle Data for Background Atmosphere ───────────────────────────
const HEALTH_FALLING_ELEMENTS = [
  { id: "pill-1", type: "pill", left: "6%", delay: 0, duration: 12, colorA: "#38bdf8", colorB: "#a855f7" },
  { id: "cross-1", type: "cross", left: "20%", delay: 2, duration: 14, color: "#818cf8" },
  { id: "sparkle-1", type: "sparkle", left: "34%", delay: 0.5, duration: 9, color: "#c084fc" },
  { id: "dna-1", type: "dna", left: "48%", delay: 3.5, duration: 15, color: "#34d399" },
  { id: "pulse-1", type: "pulse", left: "65%", delay: 1.2, duration: 11, color: "#f43f5e" },
  { id: "pill-2", type: "pill", left: "78%", delay: 4.5, duration: 10, colorA: "#c084fc", colorB: "#38bdf8" },
  { id: "sparkle-2", type: "sparkle", left: "14%", delay: 5.5, duration: 13, color: "#38bdf8" },
  { id: "cross-2", type: "cross", left: "42%", delay: 6.8, duration: 13, color: "#34d399" },
  { id: "sparkle-3", type: "sparkle", left: "58%", delay: 3.0, duration: 8, color: "#fbbf24" },
  { id: "pill-3", type: "pill", left: "26%", delay: 7.5, duration: 14, colorA: "#34d399", colorB: "#818cf8" },
  { id: "cross-3", type: "cross", left: "84%", delay: 2.8, duration: 12, color: "#38bdf8" },
  { id: "dna-2", type: "dna", left: "3%", delay: 6.0, duration: 16, color: "#a855f7" },
  { id: "sparkle-4", type: "sparkle", left: "92%", delay: 1.5, duration: 10, color: "#ffffff" },
];

function CyberMedicalChatBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
      <style>{`
        @keyframes healthFloatAnim {
          0% { transform: translateY(-30px) translateX(0px) rotate(0deg); opacity: 0.15; }
          20% { opacity: 0.85; }
          50% { transform: translateY(340px) translateX(14px) rotate(180deg); opacity: 0.95; }
          80% { opacity: 0.75; }
          100% { transform: translateY(700px) translateX(-8px) rotate(360deg); opacity: 0.1; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(1.08); }
        }
        @keyframes ekgMove {
          0% { stroke-dashoffset: 1000; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>

      <div
        className="absolute -top-12 -right-12 w-[320px] sm:w-[520px] h-[320px] sm:h-[520px] rounded-full blur-[90px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(168,85,247,0.22) 0%, rgba(99,102,241,0.15) 50%, transparent 75%)",
          animation: "pulseGlow 8s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -bottom-16 -left-12 w-[300px] sm:w-[480px] h-[300px] sm:h-[480px] rounded-full blur-[80px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(56,189,248,0.20) 0%, rgba(147,51,234,0.12) 50%, transparent 75%)",
          animation: "pulseGlow 10s ease-in-out infinite reverse",
        }}
      />

      {HEALTH_FALLING_ELEMENTS.map((el) => (
        <div
          key={el.id}
          style={{
            position: "absolute",
            left: el.left,
            top: 0,
            animation: `healthFloatAnim ${el.duration}s linear infinite`,
            animationDelay: `${el.delay}s`,
            willChange: "transform, opacity",
          }}
        >
          {el.type === "pill" && (
            <svg viewBox="0 0 24 12" className="w-5 h-2.5 drop-shadow-[0_0_10px_rgba(56,189,248,1)]">
              <rect x="1" y="1" width="11" height="10" rx="5" fill={el.colorA} />
              <rect x="12" y="1" width="11" height="10" rx="5" fill={el.colorB} />
              <line x1="12" y1="1" x2="12" y2="11" stroke="#050716" strokeWidth="1" />
            </svg>
          )}
          {el.type === "cross" && (
            <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 drop-shadow-[0_0_10px_rgba(129,140,248,1)]">
              <path d="M 7 2 L 13 2 L 13 7 L 18 7 L 18 13 L 13 13 L 13 18 L 7 18 L 7 13 L 2 13 L 2 7 L 7 7 Z" fill={el.color} />
            </svg>
          )}
          {el.type === "sparkle" && (
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 drop-shadow-[0_0_12px_rgba(192,132,252,1)]">
              <path d="M 12 0 Q 12 12 24 12 Q 12 12 12 24 Q 12 12 0 12 Q 12 12 12 0 Z" fill={el.color} />
            </svg>
          )}
          {el.type === "dna" && (
            <svg viewBox="0 0 24 24" className="w-4 h-4 drop-shadow-[0_0_10px_rgba(52,211,153,1)]">
              <circle cx="6" cy="6" r="3" fill="#34d399" />
              <circle cx="18" cy="18" r="3" fill="#38bdf8" />
              <line x1="6" y1="6" x2="18" y2="18" stroke="#818cf8" strokeWidth="2" strokeDasharray="3 3" />
            </svg>
          )}
          {el.type === "pulse" && (
            <svg viewBox="0 0 28 14" className="w-6 h-3 drop-shadow-[0_0_10px_rgba(244,63,94,1)]">
              <path d="M 1 7 L 7 7 L 10 2 L 14 12 L 18 4 L 21 8 L 27 7" fill="none" stroke={el.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

function GlowingBotAvatar({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dim = size === "sm" ? "w-7 h-7" : size === "lg" ? "w-11 h-11" : "w-8 h-8";
  return (
    <div className={`relative ${dim} rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-[1.5px] shrink-0 shadow-[0_0_15px_rgba(56,189,248,0.6)]`}>
      <div className="w-full h-full rounded-[14px] bg-[#090b22] flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 48 48" className="w-5 h-5 drop-shadow-[0_0_6px_rgba(56,189,248,0.9)]">
          <rect x="8" y="10" width="32" height="28" rx="12" fill="#15193d" stroke="#818cf8" strokeWidth="1.5" />
          <rect x="4" y="18" width="4" height="12" rx="2" fill="#38bdf8" />
          <rect x="40" y="18" width="4" height="12" rx="2" fill="#38bdf8" />
          <rect x="12" y="15" width="24" height="16" rx="7" fill="#060817" stroke="#38bdf8" strokeWidth="1.2" />
          <circle cx="18" cy="23" r="2.8" fill="#38bdf8" />
          <circle cx="30" cy="23" r="2.8" fill="#38bdf8" />
          <ellipse cx="24" cy="13" rx="8" ry="2" fill="rgba(255,255,255,0.4)" />
          <path d="M 21 27 Q 24 29 27 27" fill="none" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

const SYMPTOM_CHECK_QUERY = "I'd like to evaluate some symptoms I've been experiencing. Can you ask me guiding questions to assess them?";
const INITIAL_WELCOME_TEXT = `Hello! 👋\nI'm Arogyagenie AI, your health assistant.\nYou can ask me about symptoms, medications, treatments, reports or any health related doubts.\nHow can I help you today?`;

export interface HealthAssistantChatProps {
  className?: string;
  onClose?: () => void;
}

export function HealthAssistantChat({ className = "", onClose }: HealthAssistantChatProps = {}) {
  const [activeNavTab, setActiveNavTab] = useState<"chat" | "symptoms" | "health_tips" | "emergency">("chat");
  const [inputQuery, setInputQuery] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isPending, setIsPending] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: INITIAL_WELCOME_TEXT,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPending]);

  const handleNewChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "assistant",
        text: INITIAL_WELCOME_TEXT,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setInputQuery("");
    setAttachedFile(null);
    toast({ title: "New Conversation Started", description: "Ask any health, symptom, or medication question." });
  };

  const handleSend = (queryText?: string, specificAttachmentName?: string) => {
    let textToSend = queryText || inputQuery;
    if (!textToSend.trim() && !attachedFile) return;

    if (attachedFile && !queryText) {
      textToSend = `[Attached Document: ${attachedFile.name}]\n${textToSend || "Please analyze and explain this medical document."}`;
    }

    if (activeNavTab !== "chat") setActiveNavTab("chat");

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "patient",
      text: textToSend,
      attachmentName: specificAttachmentName || attachedFile?.name,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInputQuery("");
    setIsPending(true);

    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "assistant",
        text: `I have received your query regarding: "${textToSend.slice(0, 40)}...". Based on general clinical health guidelines, it is recommended to monitor your parameters and consult a specialist if discomfort persists.`,
        usedRag: true,
        sources: [{ title: "General Clinical Health Guidelines", publisher: "Arogya AI Protocol", section: "Symptom Review" }],
        disclaimer: "Arogyagenie AI provides health guidance, not a formal medical diagnosis.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsPending(false);
    }, 1000);
  };

  return (
    <div className={`relative w-full h-full flex flex-col overflow-hidden select-none ${className}`} style={{ background: "radial-gradient(circle at 50% 20%, #0d1033 0%, #080a21 45%, #040510 100%)", color: "#ffffff" }}>
      <CyberMedicalChatBackground />

      {/* Header */}
      <header className="relative z-20 px-3 sm:px-6 py-2.5 sm:py-3 border-b border-indigo-950/70 flex items-center justify-between bg-[#07091d]/90 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <GlowingBotAvatar size="md" />
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-cyan-200 bg-clip-text text-transparent">Arogyagenie AI</h2>
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Your Smart Health Companion</p>
          </div>
        </div>

        <div className="hidden md:flex items-center">
          <Badge className="bg-[#0b142b]/90 text-emerald-300 border border-emerald-500/50 text-xs px-3 py-1 font-semibold flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.2)] rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Clinical AI • Evidence Guided
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Tablet Bottom Navigation / Quick Switch tabs */}
          <div className="flex lg:hidden bg-[#0c102c] p-0.5 sm:p-1 rounded-xl border border-indigo-500/30">
            <button onClick={() => setActiveNavTab("chat")} className={`p-1.5 sm:px-2.5 rounded-lg text-xs font-medium ${activeNavTab === "chat" ? "bg-purple-700 text-white" : "text-slate-400"}`} title="Chat">
              <MessageSquareText className="h-4 w-4" />
            </button>
            <button onClick={() => setActiveNavTab("symptoms")} className={`p-1.5 sm:px-2.5 rounded-lg text-xs font-medium ${activeNavTab === "symptoms" ? "bg-purple-700 text-white" : "text-slate-400"}`} title="Symptoms">
              <Activity className="h-4 w-4" />
            </button>
            <button onClick={() => setActiveNavTab("emergency")} className={`p-1.5 sm:px-2.5 rounded-lg text-xs font-medium ${activeNavTab === "emergency" ? "bg-red-700 text-white" : "text-red-400"}`} title="Emergency">
              <HeartPulse className="h-4 w-4" />
            </button>
          </div>

          <button type="button" onClick={handleNewChat} className="h-7 sm:h-8 px-2.5 sm:px-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold text-xs shadow-md border border-purple-400/40 flex items-center gap-1">
            <span className="hidden sm:inline">New Chat</span> <Plus className="h-3.5 w-3.5" />
          </button>
          {onClose && (
            <button type="button" onClick={onClose} className="h-8 w-8 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </header>

      {/* Body Area */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative z-10">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col items-center justify-start w-64 xl:w-72 shrink-0 p-5 border-r border-indigo-950/60 bg-[#06081a]/50 backdrop-blur-md relative overflow-hidden">
          <div className="text-center space-y-1 mb-6">
            <h3 className="text-base font-extrabold tracking-tight bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-300 bg-clip-text text-transparent">Arogyagenie AI</h3>
            <p className="text-xs text-slate-400 font-medium">Always here to help you 💜</p>
          </div>
          <div className="w-full space-y-1.5">
            <button onClick={() => setActiveNavTab("chat")} className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 cursor-pointer ${activeNavTab === "chat" ? "bg-purple-950/70 border border-purple-500/50 text-purple-200" : "text-slate-400 hover:text-white"}`}>
              <MessageSquareText className="h-4 w-4 text-purple-400" /> AI Chat Assistant
            </button>
            <button onClick={() => setActiveNavTab("symptoms")} className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 cursor-pointer ${activeNavTab === "symptoms" ? "bg-purple-950/70 border border-purple-500/50 text-purple-200" : "text-slate-400 hover:text-white"}`}>
              <Activity className="h-4 w-4 text-cyan-400" /> Symptom Checker
            </button>
            <button onClick={() => setActiveNavTab("health_tips")} className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 cursor-pointer ${activeNavTab === "health_tips" ? "bg-purple-950/70 border border-purple-500/50 text-purple-200" : "text-slate-400 hover:text-white"}`}>
              <Lightbulb className="h-4 w-4 text-amber-400" /> Health Insights
            </button>
            <button onClick={() => setActiveNavTab("emergency")} className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 cursor-pointer ${activeNavTab === "emergency" ? "bg-red-950/70 border border-red-500/50 text-red-200" : "text-red-400 hover:text-red-300"}`}>
              <HeartPulse className="h-4 w-4 text-red-400 animate-pulse" /> Emergency (SOS)
            </button>
          </div>
        </aside>

        {/* Main Content Viewer */}
        <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
          {activeNavTab === "chat" && (
            <div className="flex-1 flex flex-col min-h-0 relative">
              <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4">
                <div className="flex gap-3 max-w-[96%] sm:max-w-[85%]">
                  <GlowingBotAvatar size="md" />
                  <div className="space-y-1 flex-1">
                    <div className="p-3.5 sm:p-5 rounded-3xl rounded-tl-sm bg-[#0d1030]/90 border border-indigo-500/35 text-slate-100 shadow-xl space-y-3 sm:space-y-4">
                      <div className="space-y-2 text-sm sm:text-[15px] leading-relaxed">
                        <p className="font-bold text-white text-base">Hello! 👋</p>
                        <p>I'm <strong className="text-white font-bold">Arogyagenie AI</strong>, your health assistant.</p>
                        <p className="text-slate-300">You can ask me about symptoms, medications, treatments, reports or any health related doubts.</p>
                        <p className="text-purple-300 font-bold pt-1">How can I help you today?</p>
                      </div>
                      <button onClick={() => handleSend(SYMPTOM_CHECK_QUERY)} className="w-full p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-purple-950/70 via-indigo-950/60 to-[#0e1338]/90 hover:from-purple-900 border border-purple-500/40 text-white flex items-center justify-between gap-3 transition-all cursor-pointer text-left">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-600/25 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0">
                            <Stethoscope className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="font-bold text-sm sm:text-base text-white">Check Symptoms</span>
                            <p className="text-xs text-slate-300">Describe your symptoms and get AI clinical insights</p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-purple-300 shrink-0" />
                      </button>
                    </div>
                  </div>
                </div>

                {messages.slice(1).map((msg) => (
                  <div key={msg.id} className={`flex gap-2 sm:gap-3 max-w-[90%] sm:max-w-[80%] ${msg.sender === "patient" ? "ml-auto flex-row-reverse" : "mr-auto flex-row"}`}>
                    {msg.sender === "patient" ? (
                      <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0">
                        <User className="h-4 w-4" />
                      </div>
                    ) : (
                      <GlowingBotAvatar size="sm" />
                    )}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className={`p-3.5 sm:p-4 rounded-3xl text-sm leading-relaxed ${msg.sender === "patient" ? "bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-tr-sm shadow-lg font-medium" : "bg-[#0d1030]/95 border border-indigo-500/30 text-slate-100 rounded-tl-sm shadow-md backdrop-blur-md"}`}>
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Composer */}
              <div className="p-2.5 sm:p-5 border-t border-indigo-950/70 bg-[#06081c]/90 relative z-20">
                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="bg-[#0b0e2b]/95 border border-indigo-500/40 rounded-3xl p-2.5 sm:p-4 space-y-2 shadow-2xl">
                  <textarea
                    rows={1}
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    placeholder="Type your health question..."
                    className="w-full bg-transparent border-0 text-white placeholder:text-slate-500 focus:outline-none text-xs sm:text-sm resize-none"
                  />
                  <div className="flex items-center justify-between pt-1 border-t border-indigo-950/60">
                    <div className="flex items-center gap-1.5">
                      <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && setAttachedFile(e.target.files[0])} className="hidden" />
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="px-2.5 py-1.5 rounded-xl bg-[#11163b] text-slate-300 text-xs flex items-center gap-1.5 border border-indigo-500/25 cursor-pointer">
                        <Paperclip className="h-3.5 w-3.5 text-purple-400" /> <span className="hidden sm:inline">Attach File</span>
                      </button>
                    </div>
                    <button type="submit" disabled={!inputQuery.trim() && !attachedFile} className="h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-700 text-white flex items-center justify-center shadow-lg disabled:opacity-30 cursor-pointer">
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeNavTab === "symptoms" && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <h3 className="font-bold text-base sm:text-lg text-white">AI Symptom Intelligence</h3>
              <p className="text-xs sm:text-sm text-slate-300">Select common symptoms for guided triage assessment.</p>
            </div>
          )}
          {activeNavTab === "health_tips" && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <h3 className="font-bold text-base sm:text-lg text-white">Daily Health & Wellness Insights</h3>
            </div>
          )}
          {activeNavTab === "emergency" && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <h3 className="font-bold text-base sm:text-lg text-red-300">Emergency Medical Assistance</h3>
              <a href="tel:108" className="p-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 text-white flex items-center justify-between shadow-lg">
                <div><span className="text-[10px] uppercase font-bold">Ambulance</span><span className="text-2xl font-black block">108</span></div>
                <Phone className="h-6 w-6" />
              </a>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
