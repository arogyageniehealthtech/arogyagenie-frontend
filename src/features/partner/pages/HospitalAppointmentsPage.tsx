import React, { useState } from 'react';
import {
  CalendarCheck,
  Stethoscope,
  Clock,
  User,
  HeartPulse,
  CheckCircle2,
  AlertCircle,
  Eye,
  Check,
  Ban,
  Activity,
} from 'lucide-react';
import { usePartner } from '../context/PartnerContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { PartnerEmptyState } from '../components/common/PartnerEmptyState';
import { PartnerSkeleton } from '../components/common/PartnerSkeleton';
import { Button } from '@/components/ui/button';
import type { HospitalAppointment } from '@/types/partner.types';

export const HospitalAppointmentsPage: React.FC = () => {
  const { appointments, isLoading, updateAppointment } = usePartner();
  const [selectedApt, setSelectedApt] = useState<HospitalAppointment | null>(null);

  if (isLoading) {
    return <PartnerSkeleton rows={5} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <CalendarCheck className="h-6 w-6 text-indigo-600" />
            Hospital & Specialist Doctor Appointments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Specialist OPD rosters, consultation tokens, patient triage, and digital record synchronization
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
            Total Slots: {appointments.length}
          </span>
        </div>
      </div>

      {appointments.length === 0 ? (
        <PartnerEmptyState
          title="No hospital appointments found"
          description="Doctor consultations booked via AarogyaGenie will display here."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Appointments List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {appointments.map((apt) => {
              const isSelected = selectedApt?.id === apt.id;

              return (
                <div
                  key={apt.id}
                  onClick={() => setSelectedApt(apt)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
                    isSelected
                      ? 'border-indigo-500 shadow-md ring-2 ring-indigo-500/10'
                      : 'border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                          Token #{apt.tokenNumber}
                        </span>
                        <StatusBadge status={apt.status} size="sm" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{apt.doctorName}</h3>
                      <p className="text-xs text-slate-500 font-medium">{apt.department}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-indigo-600 block">{apt.timeSlot}</span>
                      <span className="text-[11px] text-slate-400">{apt.date}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <div className="flex items-center gap-2 font-medium">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      <span>Patient: <strong>{apt.patient.name}</strong> ({apt.patient.age}y / {apt.patient.gender})</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {apt.appointmentType.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Appointment Inspector (5 cols) */}
          <div className="lg:col-span-5">
            {selectedApt ? (
              <div className="sticky top-28 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-indigo-600">
                      Token #{selectedApt.tokenNumber} • {selectedApt.appointmentNumber}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      {selectedApt.doctorName}
                    </h3>
                    <p className="text-xs text-slate-500">{selectedApt.department}</p>
                  </div>
                  <StatusBadge status={selectedApt.status} />
                </div>

                {/* Patient summary */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <div className="font-bold text-slate-900">Patient Demographic Data</div>
                  <p className="text-slate-700 font-semibold">{selectedApt.patient.name} ({selectedApt.patient.age} yrs)</p>
                  <p className="text-slate-500">Contact: {selectedApt.patient.phone} • Blood: {selectedApt.patient.bloodGroup || 'N/A'}</p>
                </div>

                {/* Symptoms & Vitals */}
                <div className="space-y-3 text-xs">
                  <div>
                    <h4 className="font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Reported Symptoms
                    </h4>
                    <ul className="space-y-1">
                      {selectedApt.symptoms.map((s, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-slate-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedApt.vitals && (
                    <div>
                      <h4 className="font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Recorded Vitals
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                          <span className="text-slate-400 block">Blood Pressure</span>
                          <span className="font-bold text-slate-900">{selectedApt.vitals.bp || 'N/A'}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                          <span className="text-slate-400 block">Pulse Rate</span>
                          <span className="font-bold text-slate-900">{selectedApt.vitals.pulse || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action controls */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    OPD Consultation Stage
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateAppointment(selectedApt.id, 'IN_PROGRESS')}
                      className="rounded-xl text-xs font-bold"
                    >
                      In Examination
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => updateAppointment(selectedApt.id, 'COMPLETED')}
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold"
                    >
                      Consult Complete
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-400 bg-white">
                <CalendarCheck className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-medium">Select an appointment on the left to review vitals and call patient</p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};

export default HospitalAppointmentsPage;
