// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {  Calendar, Heart, ArrowRight } from "lucide-react";
// import { AuthCard } from "../components/AuthCard";
// import { useAuth, getRoleDashboardPath } from "../hooks/useAuth";
// import type { BloodGroup, Gender } from "@/types/auth.types";

// export function ProfileSetupPage() {
//   const navigate = useNavigate();
//   const { user, updateUser } = useAuth();

//   const [gender, setGender] = useState<Gender>("MALE");
//   const [bloodGroup, setBloodGroup] = useState<BloodGroup>("O_POS");
//   const [dob, setDob] = useState("1998-01-01");
//   const [phone, setPhone] = useState(user?.phone || "");
//   const [emergencyPhone, setEmergencyPhone] = useState("");

//   const handleComplete = (e: React.FormEvent) => {
//     e.preventDefault();
//     updateUser({
//       phone: phone || undefined,
//       patient: {
//         id: user?.patient?.id || "pat-1",
//         firstName: user?.firstName || "Arogya",
//         lastName: user?.lastName || "User",
//         gender,
//         bloodGroup,
//         dateOfBirth: dob,
//       },
//     });

//     const target = getRoleDashboardPath(user?.role);
//     navigate(target, { replace: true });
//   };

//   return (
//     <AuthCard
//       title="Complete Your Profile"
//       subtitle="Help us personalize your medical records and care"
//       badge="Onboarding"
//     >
//       <form onSubmit={handleComplete} className="space-y-4">
//         {/* Gender Selection */}
//         <div>
//           <label className="text-xs font-medium text-slate-300 block mb-1.5">Gender</label>
//           <div className="grid grid-cols-3 gap-2">
//             {(["MALE", "FEMALE", "OTHER"] as Gender[]).map((g) => (
//               <button
//                 key={g}
//                 type="button"
//                 onClick={() => setGender(g)}
//                 className={`py-2 px-3 rounded-xl text-xs font-medium border cursor-pointer transition-colors ${
//                   gender === g
//                     ? "border-indigo-500 bg-indigo-500/20 text-white font-semibold shadow-sm"
//                     : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
//                 }`}
//               >
//                 {g === "MALE" ? "Male" : g === "FEMALE" ? "Female" : "Other"}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Blood Group */}
//         <div>
//           <label className="text-xs font-medium text-slate-300 block mb-1.5">Blood Group</label>
//           <div className="grid grid-cols-4 gap-1.5">
//             {(["A_POS", "B_POS", "AB_POS", "O_POS", "A_NEG", "B_NEG", "AB_NEG", "O_NEG"] as BloodGroup[]).map(
//               (bg) => (
//                 <button
//                   key={bg}
//                   type="button"
//                   onClick={() => setBloodGroup(bg)}
//                   className={`py-1.5 px-2 rounded-xl text-xs font-medium border cursor-pointer transition-colors ${
//                     bloodGroup === bg
//                       ? "border-indigo-500 bg-indigo-500/20 text-white font-semibold"
//                       : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
//                   }`}
//                 >
//                   {bg.replace("_POS", "+").replace("_NEG", "-")}
//                 </button>
//               )
//             )}
//           </div>
//         </div>

//         {/* Date of Birth */}
//         <div>
//           <label className="text-xs font-medium text-slate-300 block mb-1.5">Date of Birth</label>
//           <div className="relative">
//             <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//             <input
//               type="date"
//               value={dob}
//               onChange={(e) => setDob(e.target.value)}
//               className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white text-sm focus:outline-hidden focus:border-indigo-400"
//             />
//           </div>
//         </div>

//         {/* Emergency Contact */}
//         <div>
//           <label className="text-xs font-medium text-slate-300 block mb-1.5">
//             Emergency Contact Phone
//           </label>
//           <div className="relative">
//             <Heart className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-rose-400" />
//             <input
//               type="tel"
//               value={emergencyPhone}
//               onChange={(e) => setEmergencyPhone(e.target.value)}
//               placeholder="+91 98765 00000"
//               className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:border-indigo-400"
//             />
//           </div>
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm text-white shadow-lg transition-all duration-200 cursor-pointer mt-2"
//           style={{
//             background: "linear-gradient(135deg, #6C63FF 0%, #4F46E5 100%)",
//             boxShadow: "0 4px 20px rgba(108, 99, 255, 0.4)",
//           }}
//         >
//           <span>Complete & Go to Dashboard</span>
//           <ArrowRight className="h-4 w-4" />
//         </button>
//       </form>
//     </AuthCard>
//   );
// }

// export default ProfileSetupPage;
