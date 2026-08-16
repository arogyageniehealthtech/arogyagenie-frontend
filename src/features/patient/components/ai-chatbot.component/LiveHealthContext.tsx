
import {HealthContextCard} from './HealthContextCard'

export const LiveHealthContext = () => (
  <div className="bg-[#06112B] p-5 rounded-3xl border border-white/5">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-sm font-bold">Live Health Context</h3>
      <button className="text-xs text-[#8B5CF6]">View All</button>
    </div>
    <div className="flex gap-3 overflow-x-auto">
      <HealthContextCard label="Heart" value="72" unit="bpm" />
      <HealthContextCard label="Temp" value="98.4" unit="°F" />
      <HealthContextCard label="Meds" value="3" unit="active" />
      <HealthContextCard label="BMI" value="22.9" unit="normal" />
    </div>
  </div>
);