import React from 'react';
import {
  Users2,
  Megaphone,
} from 'lucide-react';
import { usePartner } from '../context/PartnerContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { PartnerSkeleton } from '../components/common/PartnerSkeleton';
import { PartnerEmptyState } from '../components/common/PartnerEmptyState';
import { Button } from '@/components/ui/button';

export const HospitalCheckInsPage: React.FC = () => {
  const { checkIns, isLoading, updateCheckIn } = usePartner();

  if (isLoading) {
    return <PartnerSkeleton rows={5} />;
  }

  const waitingPatients = checkIns.filter((c) => c.status === 'WAITING');
  const activeWithDoctor = checkIns.find((c) => c.status === 'WITH_DOCTOR');
  const nextInLine = waitingPatients[0];

  const handleCallNext = async () => {
    if (nextInLine) {
      await updateCheckIn(nextInLine.id, 'WITH_DOCTOR');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <Users2 className="h-6 w-6 text-indigo-600" />
            Hospital OPD Check-ins & Live Queue Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time patient flow, automated queue tokens, waiting room triage, and counter calling
          </p>
        </div>

        {nextInLine && (
          <Button
            onClick={handleCallNext}
            className="rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 text-white font-bold text-xs shadow-md"
            leftIcon={<Megaphone className="h-4 w-4 text-amber-300 animate-bounce" />}
          >
            Call Token #{nextInLine.tokenNumber} ({nextInLine.patient.name})
          </Button>
        )}
      </div>

      {/* Real-time OPD Token Display Board */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-2xl bg-indigo-900 text-white border border-indigo-800 shadow-md">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 block">
            Currently In Room With Doctor
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-white">
              {activeWithDoctor ? `Token #${activeWithDoctor.tokenNumber}` : 'None'}
            </span>
          </div>
          {activeWithDoctor && (
            <p className="text-xs text-indigo-200 mt-1">
              {activeWithDoctor.patient.name} • {activeWithDoctor.roomNumber}
            </p>
          )}
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Next Patient in Queue
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              {nextInLine ? `Token #${nextInLine.tokenNumber}` : 'Queue Empty'}
            </span>
          </div>
          {nextInLine && (
            <p className="text-xs text-slate-500 mt-1">
              {nextInLine.patient.name} • Wait ~{nextInLine.estimatedWaitMins} mins
            </p>
          )}
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Total Waiting in OPD Lounge
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-indigo-600">
              {waitingPatients.length}
            </span>
            <span className="text-xs font-semibold text-slate-500">patients waiting</span>
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            Average turnaround ~15 mins / patient
          </p>
        </div>

      </div>

      {/* Queue Table */}
      {checkIns.length === 0 ? (
        <PartnerEmptyState
          title="No patients currently checked in"
          description="Patients checking in via AarogyaGenie app upon arrival will be queued here."
        />
      ) : (
        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Token #</th>
                  <th className="py-3.5 px-4">Patient Information</th>
                  <th className="py-3.5 px-4">Department & Room</th>
                  <th className="py-3.5 px-4">Check-in Time</th>
                  <th className="py-3.5 px-4">Triage Priority</th>
                  <th className="py-3.5 px-4">Queue State</th>
                  <th className="py-3.5 px-4 text-right">Counter Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {checkIns.map((chk) => (
                  <tr key={chk.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Token */}
                    <td className="py-4 px-4">
                      <span className="font-mono font-extrabold text-sm px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 inline-block">
                        #{chk.tokenNumber}
                      </span>
                    </td>

                    {/* Patient */}
                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-900 block">{chk.patient.name}</span>
                      <span className="text-[10px] text-slate-500">{chk.patient.phone}</span>
                    </td>

                    {/* Department */}
                    <td className="py-4 px-4">
                      <span className="font-semibold text-slate-800 block">{chk.department}</span>
                      <span className="text-[11px] text-indigo-600 font-bold">{chk.roomNumber}</span>
                    </td>

                    {/* Time */}
                    <td className="py-4 px-4 text-slate-500">
                      <span className="block font-semibold text-slate-800">{chk.checkInTime}</span>
                      {chk.status === 'WAITING' && (
                        <span className="text-[10px] text-amber-600 font-medium">
                          ~{chk.estimatedWaitMins}m wait
                        </span>
                      )}
                    </td>

                    {/* Triage */}
                    <td className="py-4 px-4">
                      <StatusBadge status={chk.triageLevel} size="sm" />
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <StatusBadge status={chk.status} size="sm" />
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {chk.status === 'WAITING' && (
                          <button
                            onClick={() => updateCheckIn(chk.id, 'WITH_DOCTOR')}
                            className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors cursor-pointer"
                          >
                            Call in Room
                          </button>
                        )}

                        {chk.status === 'WITH_DOCTOR' && (
                          <button
                            onClick={() => updateCheckIn(chk.id, 'COMPLETED')}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer"
                          >
                            Mark Done
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default HospitalCheckInsPage;
