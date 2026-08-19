import React, { useState } from 'react';
import {
  FlaskConical,
  Home,
  Building,
  Barcode,
  CheckCircle2,
  Clock,
  UserCheck,
  AlertCircle,
  Eye,
  Check,
  Phone,
} from 'lucide-react';
import { usePartner } from '../context/PartnerContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { PartnerEmptyState } from '../components/common/PartnerEmptyState';
import { PartnerSkeleton } from '../components/common/PartnerSkeleton';
import { Button } from '@/components/ui/button';
import type { LabBooking } from '@/types/partner.types';

export const LabBookingsPage: React.FC = () => {
  const { labBookings, isLoading, updateLabBooking } = usePartner();
  const [selectedBooking, setSelectedBooking] = useState<LabBooking | null>(null);

  if (isLoading) {
    return <PartnerSkeleton rows={5} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <FlaskConical className="h-6 w-6 text-indigo-600" />
            Diagnostic Lab Bookings & Phlebotomy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Sample collection schedules, barcode allocations, home visits, and analyzer queues
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
            Total Bookings: {labBookings.length}
          </span>
        </div>
      </div>

      {labBookings.length === 0 ? (
        <PartnerEmptyState
          title="No diagnostic bookings found"
          description="Lab appointments scheduled on the AarogyaGenie platform will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Bookings List (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {labBookings.map((booking) => {
              const isSelected = selectedBooking?.id === booking.id;

              return (
                <div
                  key={booking.id}
                  onClick={() => setSelectedBooking(booking)}
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
                          {booking.bookingNumber}
                        </span>
                        <StatusBadge status={booking.status} size="sm" />
                        {booking.fastingRequired && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                            Fasting Required
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{booking.testName}</h3>
                      <p className="text-xs text-slate-500">
                        Patient: <strong>{booking.patient.name}</strong> ({booking.patient.age}y / {booking.patient.gender})
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-extrabold text-slate-900 block">
                        ₹{booking.totalAmount.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500">
                        {booking.scheduledTime}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-medium text-slate-700">
                      {booking.collectionMode === 'HOME_COLLECTION' ? (
                        <span className="inline-flex items-center gap-1 text-indigo-700 font-semibold">
                          <Home className="h-3.5 w-3.5" /> Home Collection
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-600 font-semibold">
                          <Building className="h-3.5 w-3.5" /> Walk-in Center
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-500">
                        {booking.sampleBarcode || 'Barcode Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Booking Inspector (5 cols) */}
          <div className="lg:col-span-5">
            {selectedBooking ? (
              <div className="sticky top-28 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-indigo-600">
                      {selectedBooking.bookingNumber}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      {selectedBooking.testName}
                    </h3>
                  </div>
                  <StatusBadge status={selectedBooking.status} />
                </div>

                {/* Patient Information */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <div className="font-bold text-slate-900">Patient Details</div>
                  <p className="text-slate-700 font-semibold">{selectedBooking.patient.name}</p>
                  <p className="text-slate-500">{selectedBooking.patient.phone} • {selectedBooking.patient.address}</p>
                </div>

                {/* Sample Collection Logistics */}
                <div className="space-y-3 text-xs">
                  <h4 className="font-bold uppercase tracking-wider text-slate-400">
                    Sample Collection & Phlebotomy
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Mode</span>
                      <span className="font-bold text-slate-900">{selectedBooking.collectionMode.replace('_', ' ')}</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Specimen Type</span>
                      <span className="font-bold text-slate-900">{selectedBooking.sampleType}</span>
                    </div>
                  </div>

                  {selectedBooking.phlebotomistName && (
                    <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-indigo-500 block">Assigned Phlebotomist</span>
                        <span className="font-bold text-indigo-950">{selectedBooking.phlebotomistName}</span>
                      </div>
                      <span className="text-xs text-indigo-700 font-medium">{selectedBooking.phlebotomistPhone}</span>
                    </div>
                  )}
                </div>

                {/* Status Progression Controls */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Sample Pipeline Action
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateLabBooking(selectedBooking.id, 'IN_PROGRESS', 'COLLECTED')}
                      className="rounded-xl text-xs font-bold"
                    >
                      Sample Drawn
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => updateLabBooking(selectedBooking.id, 'COMPLETED', 'COMPLETED')}
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold"
                    >
                      Analysis Complete
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-400 bg-white">
                <FlaskConical className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-medium">Select a test booking on the left to review sample details</p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};

export default LabBookingsPage;
