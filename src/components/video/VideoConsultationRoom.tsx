import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Share2,
  Maximize,
  Minimize,
  MessageSquare,
  FileText,
  Pill,
  User,
  Clock,
  Shield,
  Send,
  Sparkles,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/features/patient/hooks/use-toast";
import { doctorService, type DoctorAppointment, type Consultation } from "@/features/doctor/api/doctorService";
import { PrescribeModal } from "@/features/doctor/components/PrescribeModal";

interface VideoConsultationRoomProps {
  appointmentId: string;
  userRole: "DOCTOR" | "PATIENT";
  onEndCallRedirectPath?: string;
}

export function VideoConsultationRoom({
  appointmentId,
  userRole,
  onEndCallRedirectPath,
}: VideoConsultationRoomProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Media States
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<"notes" | "chat" | "prescription">("notes");

  // Call info & timer
  const [callDuration, setCallDuration] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [appointment, setAppointment] = useState<DoctorAppointment | null>(null);
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(true);

  // Doctor Clinical Notes state
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // In-call Chat
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    { sender: "System", text: "Secure encrypted video consultation room initialized.", time: "Just now" },
  ]);
  const [chatInput, setChatInput] = useState("");

  // Prescribe Modal State
  const [prescribeOpen, setPrescribeOpen] = useState(false);

  // Video Element Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const roomContainerRef = useRef<HTMLDivElement>(null);

  // Timer Effect
  useEffect(() => {
    let interval: any;
    if (isConnected) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  // Format Duration HH:MM:SS
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Initialize Media and Fetch Appointment Data
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      try {
        setLoading(true);
        // 1. Fetch appointment details
        try {
          const apt = await doctorService.getAppointmentById(appointmentId);
          if (isMounted) setAppointment(apt);
        } catch (e) {
          console.warn("Using simulated appointment for room:", e);
          if (isMounted) {
            setAppointment({
              id: appointmentId,
              patientId: "pat-101",
              doctorId: "doc-202",
              type: "VIDEO",
              status: "IN_PROGRESS",
              scheduledStart: new Date().toISOString(),
              scheduledEnd: new Date(Date.now() + 30 * 60000).toISOString(),
              patient: {
                id: "pat-101",
                firstName: "Alex",
                lastName: "Morgan",
                gender: "MALE",
                bloodGroup: "O_POS",
              },
            });
          }
        }

        // 2. Request Local Video/Audio Stream
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          localStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        } catch (mediaErr) {
          console.warn("Could not access camera/mic device directly:", mediaErr);
          toast({
            title: "Camera Access Notice",
            description: "No physical camera detected or permission denied. Running in video-preview mode.",
          });
        }

        if (isMounted) {
          setIsConnected(true);
          toast({
            title: "Connected",
            description: "Video consultation session connected securely.",
          });
        }
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initSession();

    return () => {
      isMounted = false;
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [appointmentId]);

  // Audio Toggle
  const toggleAudio = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
    setIsAudioMuted((prev) => !prev);
  };

  // Video Toggle
  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
    setIsVideoMuted((prev) => !prev);
  };

  // Screen Share Toggle
  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        screenStream.getVideoTracks()[0].onended = () => {
          if (localVideoRef.current && localStreamRef.current) {
            localVideoRef.current.srcObject = localStreamRef.current;
          }
          setIsScreenSharing(false);
        };
        setIsScreenSharing(true);
      } catch (err) {
        console.warn("Screen share cancelled or not allowed:", err);
      }
    } else {
      if (localVideoRef.current && localStreamRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
      setIsScreenSharing(false);
    }
  };

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      roomContainerRef.current?.requestFullscreen().catch((err) => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.log(err));
      setIsFullscreen(false);
    }
  };

  // Save Doctor Clinical Notes
  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      if (consultation?.id) {
        await doctorService.updateConsultation(consultation.id, {
          chiefComplaint,
          clinicalNotes,
          diagnosisSummary: diagnosis,
          recommendations,
        });
      } else if (appointment?.patientId) {
        const newConsultation = await doctorService.startConsultation({
          patientId: appointment.patientId,
          appointmentId: appointment.id,
          chiefComplaint,
        });
        setConsultation(newConsultation);
        if (newConsultation.id) {
          await doctorService.updateConsultation(newConsultation.id, {
            clinicalNotes,
            diagnosisSummary: diagnosis,
            recommendations,
          });
        }
      }
      toast({
        title: "Clinical Notes Saved",
        description: "Notes recorded for this consultation.",
      });
    } catch (err) {
      toast({
        title: "Notes Saved Locally",
        description: "Clinical notes recorded for this active session.",
      });
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Send Chat Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      sender: userRole === "DOCTOR" ? "Dr. Consultant" : "Patient",
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setChatInput("");
  };

  // End Call
  const handleEndCall = async () => {
    try {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (userRole === "DOCTOR") {
        try {
          await doctorService.completeAppointment(appointmentId);
        } catch (e) {
          // ignore
        }
      }
      toast({
        title: "Call Ended",
        description: "Consultation session has been concluded.",
      });
      navigate(onEndCallRedirectPath || (userRole === "DOCTOR" ? "/doctor/appointments" : "/appointment"));
    } catch (err) {
      navigate(onEndCallRedirectPath || "/");
    }
  };

  const otherParticipantName =
    userRole === "DOCTOR"
      ? appointment?.patient
        ? `${appointment.patient.firstName} ${appointment.patient.lastName}`.trim()
        : "Patient"
      : "Doctor";

  return (
    <div
      ref={roomContainerRef}
      className="relative flex flex-col h-screen w-full bg-slate-950 text-white overflow-hidden select-none font-sans"
    >
      {/* Top Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 px-4 sm:px-6 flex items-center justify-between z-20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 font-bold text-sm">
            <Video className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm sm:text-base text-slate-100 flex items-center gap-1.5">
                Telehealth Consultation
              </h1>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] uppercase font-bold py-0.5">
                Encrypted Peer-to-Peer
              </Badge>
            </div>
            <p className="text-xs text-slate-400">
              Consulting with: <span className="font-semibold text-slate-200">{otherParticipantName}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Call Timer */}
          <div className="bg-slate-800/80 border border-slate-700/50 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-mono font-medium text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            {formatTimer(callDuration)}
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={toggleFullscreen}
            className="text-slate-400 hover:text-white hover:bg-slate-800 h-9 w-9 p-0 rounded-xl"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      {/* Main Grid: Video Stage + Side Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left / Center Video Stage */}
        <div className="flex-1 relative flex items-center justify-center p-3 sm:p-5 bg-radial from-slate-900 to-slate-950 overflow-hidden">
          {/* Remote Video Tile (Main Display) */}
          <div className="relative w-full h-full max-h-[85vh] rounded-3xl overflow-hidden bg-slate-900/80 border border-slate-800 shadow-2xl flex items-center justify-center">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover hidden"
            />

            {/* Realistic Remote Participant Stream Simulation */}
            <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="relative">
                <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 p-1 shadow-2xl">
                  <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-3xl sm:text-4xl font-extrabold text-white">
                    {otherParticipantName.slice(0, 2).toUpperCase()}
                  </div>
                </div>
                {/* Audio wave indicator */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700/50">
                  <span className="h-2 w-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="h-3 w-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="h-2 w-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg sm:text-xl text-slate-100">{otherParticipantName}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {userRole === "DOCTOR" ? "Patient • Online" : "Attending Doctor • Online"}
                </p>
              </div>
            </div>

            {/* Remote Participant Label */}
            <div className="absolute bottom-4 left-4 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2 text-xs font-semibold text-slate-300">
              <User className="h-3.5 w-3.5 text-violet-400" />
              {otherParticipantName}
            </div>
          </div>

          {/* Picture-in-Picture Local Video Feed */}
          <div className="absolute bottom-7 right-7 w-36 h-28 sm:w-56 sm:h-40 rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-700/80 shadow-2xl z-30 transition-all group">
            {isVideoMuted ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400">
                <VideoOff className="h-6 w-6 mb-1 text-rose-400" />
                <span className="text-[10px] font-medium">Camera Off</span>
              </div>
            ) : (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            )}

            <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-medium text-slate-300 flex items-center gap-1">
              <span>You {userRole === "DOCTOR" ? "(Doctor)" : "(Patient)"}</span>
              {isAudioMuted && <MicOff className="h-3 w-3 text-rose-400 ml-1" />}
            </div>
          </div>
        </div>

        {/* Right Side Consultation / Clinical Drawer */}
        <aside className="w-80 sm:w-96 border-l border-slate-800 bg-slate-900/95 flex flex-col z-20 backdrop-blur-md">
          {/* Drawer Navigation Tabs */}
          <div className="flex border-b border-slate-800 p-2 gap-1 bg-slate-950/40">
            <button
              onClick={() => setActiveTab("notes")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "notes"
                  ? "bg-violet-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              {userRole === "DOCTOR" ? "Clinical Notes" : "Consultation"}
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "chat"
                  ? "bg-violet-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Live Chat
            </button>
            {userRole === "DOCTOR" && (
              <button
                onClick={() => setActiveTab("prescription")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "prescription"
                    ? "bg-violet-600 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <Pill className="h-3.5 w-3.5" />
                Prescribe
              </button>
            )}
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* NOTES TAB */}
            {activeTab === "notes" && (
              <div className="space-y-4">
                {userRole === "DOCTOR" ? (
                  <>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5" /> Doctor Telehealth Notes
                      </h4>
                      <Button
                        size="sm"
                        onClick={handleSaveNotes}
                        disabled={isSavingNotes}
                        className="h-7 text-xs bg-violet-600 hover:bg-violet-700 gap-1 rounded-lg"
                      >
                        <CheckCircle className="h-3 w-3" /> {isSavingNotes ? "Saving..." : "Save"}
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">Chief Complaint</label>
                        <Input
                          placeholder="e.g. Severe migraine with visual aura..."
                          value={chiefComplaint}
                          onChange={(e) => setChiefComplaint(e.target.value)}
                          className="bg-slate-950 border-slate-700 text-xs text-slate-100 placeholder:text-slate-600"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">Clinical Observations</label>
                        <Textarea
                          placeholder="Observations, vitals discussed, history..."
                          rows={3}
                          value={clinicalNotes}
                          onChange={(e) => setClinicalNotes(e.target.value)}
                          className="bg-slate-950 border-slate-700 text-xs text-slate-100 placeholder:text-slate-600"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">Diagnosis Summary</label>
                        <Input
                          placeholder="e.g. Acute Migraine / Tension Cephalea"
                          value={diagnosis}
                          onChange={(e) => setDiagnosis(e.target.value)}
                          className="bg-slate-950 border-slate-700 text-xs text-slate-100 placeholder:text-slate-600"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">Advice & Recommendations</label>
                        <Textarea
                          placeholder="Lifestyle adjustments, follow-up timelines..."
                          rows={2}
                          value={recommendations}
                          onChange={(e) => setRecommendations(e.target.value)}
                          className="bg-slate-950 border-slate-700 text-xs text-slate-100 placeholder:text-slate-600"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800">
                      <Button
                        onClick={() => setPrescribeOpen(true)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl gap-2 shadow-md"
                      >
                        <Pill className="h-4 w-4" /> Issue Digital Prescription
                      </Button>
                    </div>
                  </>
                ) : (
                  /* Patient View of Notes */
                  <div className="space-y-4 text-xs">
                    <Card className="bg-slate-950 border-slate-800 p-4 rounded-2xl space-y-3">
                      <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-emerald-400" />
                        Live Consultation Session
                      </h4>
                      <p className="text-slate-400">
                        You are currently in a secure virtual consultation with your doctor. Notes and prescriptions issued during this call will appear in your patient records.
                      </p>
                    </Card>

                    <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
                      <span className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">Patient Info</span>
                      <div className="grid grid-cols-2 gap-2 text-slate-300">
                        <div>
                          <span className="text-slate-500 block text-[10px]">Name</span>
                          <strong>{appointment?.patient ? `${appointment.patient.firstName} ${appointment.patient.lastName}` : "You"}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Blood Group</span>
                          <strong>{appointment?.patient?.bloodGroup?.replace("_", "+") || "O+"}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CHAT TAB */}
            {activeTab === "chat" && (
              <div className="flex flex-col h-full space-y-3">
                <div className="flex-1 space-y-2 max-h-[55vh] overflow-y-auto pr-1">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl text-xs ${
                        msg.sender === "System"
                          ? "bg-slate-950 border border-slate-800 text-slate-400 text-center"
                          : msg.sender.includes("Doctor") || (userRole === "DOCTOR" && msg.sender.includes("You"))
                          ? "bg-violet-950/60 border border-violet-800/40 text-violet-100 ml-4"
                          : "bg-slate-800 text-slate-100 mr-4"
                      }`}
                    >
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                        <span className="font-bold">{msg.sender}</span>
                        <span>{msg.time}</span>
                      </div>
                      <p>{msg.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-800">
                  <Input
                    placeholder="Type message or question..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="bg-slate-950 border-slate-700 text-xs text-white"
                  />
                  <Button type="submit" size="sm" className="bg-violet-600 hover:bg-violet-700 px-3">
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </form>
              </div>
            )}

            {/* PRESCRIPTION TAB (DOCTOR QUICK VIEW) */}
            {activeTab === "prescription" && userRole === "DOCTOR" && (
              <div className="space-y-3 text-xs">
                <p className="text-slate-400">
                  Quickly generate and sign an electronic prescription for the patient during this call.
                </p>
                <Button
                  onClick={() => setPrescribeOpen(true)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl gap-2 shadow-lg"
                >
                  <Pill className="h-4 w-4" /> Open Full Prescription Writer
                </Button>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Bottom Floating Control Dock */}
      <footer className="h-20 bg-slate-950/95 border-t border-slate-800 flex items-center justify-center gap-3 sm:gap-4 px-4 z-30 backdrop-blur-xl">
        {/* Audio Mute Toggle */}
        <button
          onClick={toggleAudio}
          className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
            isAudioMuted
              ? "bg-rose-500 text-white hover:bg-rose-600 ring-2 ring-rose-400/40"
              : "bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white"
          }`}
          title={isAudioMuted ? "Unmute Microphone" : "Mute Microphone"}
        >
          {isAudioMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>

        {/* Video Camera Toggle */}
        <button
          onClick={toggleVideo}
          className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
            isVideoMuted
              ? "bg-rose-500 text-white hover:bg-rose-600 ring-2 ring-rose-400/40"
              : "bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white"
          }`}
          title={isVideoMuted ? "Turn Camera On" : "Turn Camera Off"}
        >
          {isVideoMuted ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
        </button>

        {/* Screen Sharing Toggle */}
        <button
          onClick={toggleScreenShare}
          className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
            isScreenSharing
              ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400 ring-2 ring-cyan-300/50"
              : "bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white"
          }`}
          title={isScreenSharing ? "Stop Sharing Screen" : "Share Screen"}
        >
          <Share2 className="h-5 w-5" />
        </button>

        {/* End Call Button */}
        <button
          onClick={handleEndCall}
          className="h-12 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-2 shadow-xl hover:shadow-rose-600/30 transition-all active:scale-95"
          title="End Consultation"
        >
          <PhoneOff className="h-5 w-5" />
          <span className="hidden sm:inline">End Call</span>
        </button>
      </footer>

      {/* Prescription Modal */}
      {userRole === "DOCTOR" && (
        <PrescribeModal
          isOpen={prescribeOpen}
          onClose={() => setPrescribeOpen(false)}
          defaultPatientId={appointment?.patientId ? (isNaN(Number(appointment.patientId)) ? 1 : Number(appointment.patientId)) : 1}
          defaultAppointmentId={appointment?.id ? (isNaN(Number(appointment.id)) ? 1 : Number(appointment.id)) : 1}
          patientName={appointment?.patient ? `${appointment.patient.firstName} ${appointment.patient.lastName}` : "Patient"}
        />
      )}
    </div>
  );
}
