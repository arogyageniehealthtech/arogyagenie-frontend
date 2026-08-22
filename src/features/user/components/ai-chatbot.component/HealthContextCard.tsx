// HealthContextCard.tsx
export const HealthContextCard = ({ label, value, unit}: any) => (
  <div className="bg-[#081633] p-4 rounded-2xl border border-white/5 flex-1 min-w-30">
    <p className="text-[10px] text-slate-400 uppercase tracking-wider">{label}</p>
    <p className="text-xl font-bold mt-1">{value} <span className="text-xs font-normal">{unit}</span></p>
    <div className="w-2 h-2 rounded-full bg-[#34D399] mt-2" />
  </div>
);