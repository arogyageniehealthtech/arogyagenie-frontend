import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Phone,
  Mail,
  Calendar,
  ShieldAlert,
  HeartPulse,
  UserCheck,
} from 'lucide-react';
import { usePartner } from '../context/PartnerContext';
import { PartnerSkeleton } from '../components/common/PartnerSkeleton';
import { PartnerEmptyState } from '../components/common/PartnerEmptyState';
import { Button } from '@/components/ui/button';
import type { PartnerPatient } from '@/types/partner.types';

export const PartnerPatientsPage: React.FC = () => {
  const { patients, isLoading } = usePartner();
  const [search, setSearch] = useState<string>('');
  const [selectedPatient, setSelectedPatient] = useState<PartnerPatient | null>(null);

  const filteredPatients = useMemo(() => {
    if (!search.trim()) return patients;
    const q = search.toLowerCase();
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.lastService.toLowerCase().includes(q)
    );
  }, [patients, search]);

  if (isLoading) {
    return <PartnerSkeleton rows={5} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-indigo-600" />
            Partner Patients Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Directory of AarogyaGenie patients who have received services or prescriptions from your facility
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
            Registered Patients: {patients.length}
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by patient name, phone, or medical history..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {filteredPatients.length === 0 ? (
        <PartnerEmptyState
          title="No patients found"
          description="Patients served will be recorded automatically into this directory."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              onClick={() => setSelectedPatient(patient)}
              className="p-5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-2xl bg-linear-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {patient.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{patient.name}</h3>
                    <p className="text-xs text-slate-500">
                      {patient.age} yrs • {patient.gender} • Blood: {patient.bloodGroup}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {patient.totalVisits} visit{patient.totalVisits > 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>{patient.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>Last Visit: {patient.lastInteraction}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100/80 text-[11px] text-slate-700">
                <span className="font-semibold text-slate-900 block">Recent Service:</span>
                <span className="text-slate-600 truncate block">{patient.lastService}</span>
              </div>

              {(patient.allergies || patient.chronicConditions) && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {patient.allergies?.map((a, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200"
                    >
                      Allergy: {a}
                    </span>
                  ))}
                  {patient.chronicConditions?.map((c, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-medium border border-indigo-200"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setSelectedPatient(null)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 z-10 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="h-12 w-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                {selectedPatient.name[0]}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedPatient.name}</h3>
                <p className="text-xs text-slate-500">
                  {selectedPatient.age} yrs • {selectedPatient.gender} • Blood Group {selectedPatient.bloodGroup}
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Aarogya Patient ID</span>
                <span className="font-mono font-bold text-slate-900">{selectedPatient.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Contact Phone</span>
                <span className="font-bold text-slate-900">{selectedPatient.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Total Engagements</span>
                <span className="font-bold text-indigo-600">{selectedPatient.totalVisits} visits</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Last Interaction</span>
                <span className="font-bold text-slate-900">{selectedPatient.lastInteraction}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPatient(null)}
                className="rounded-xl"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PartnerPatientsPage;
