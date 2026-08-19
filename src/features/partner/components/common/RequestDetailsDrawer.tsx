import React from 'react';
import {
  X,
  User,
  Phone,
  MapPin,
  Calendar,
  Clock,
  FileText,
  Pill,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Check,
  Ban,
  Download,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/components/ui/button';
import type { PartnerRequest } from '@/types/partner.types';

interface RequestDetailsDrawerProps {
  request: PartnerRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onAccept?: (id: string) => Promise<void>;
  onReject?: (id: string) => void;
  onMarkCompleted?: (id: string) => Promise<void>;
}

export const RequestDetailsDrawer: React.FC<RequestDetailsDrawerProps> = ({
  request,
  isOpen,
  onClose,
  onAccept,
  onReject,
  onMarkCompleted,
}) => {
  if (!isOpen || !request) return null;

  const isPending = request.status === 'PENDING';
  const isInProgress = request.status === 'IN_PROGRESS' || request.status === 'ACCEPTED';
  const isCompleted = request.status === 'COMPLETED';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
          
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {request.requestNumber}
                </span>
                <StatusBadge status={request.status} />
                {request.priority === 'EMERGENCY' && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-red-600 text-white animate-pulse">
                    EMERGENCY
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-slate-900">{request.serviceType}</h2>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            
            {/* Patient Demographics Card */}
            <div className="rounded-2xl border border-slate-200/80 p-4 bg-slate-50/40 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                <div className="flex items-center gap-3">
                  {request.patient.avatar ? (
                    <img
                      src={request.patient.avatar}
                      alt={request.patient.name}
                      className="h-11 w-11 rounded-full object-cover border-2 border-white shadow-xs"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-slate-900">{request.patient.name}</h4>
                    <p className="text-xs text-slate-500">
                      {request.patient.age} yrs • {request.patient.gender} • Blood Group: {request.patient.bloodGroup || 'O+'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Aarogya ID
                  </span>
                  <p className="text-xs font-mono font-bold text-slate-700">{request.patient.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{request.patient.phone}</span>
                </div>
                {request.patient.address && (
                  <div className="flex items-start gap-2 sm:col-span-2">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{request.patient.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Request Meta & Pricing */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-medium text-slate-500 block">Requested Date</span>
                <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-1">
                  <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                  {request.requestedDate}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[11px] font-medium text-slate-500 block">Requested Time</span>
                <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-1">
                  <Clock className="h-3.5 w-3.5 text-indigo-500" />
                  {request.requestedTime}
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
                <span className="text-[11px] font-medium text-slate-500 block">Estimated Bill</span>
                <span className="text-sm font-bold text-emerald-700 flex items-center gap-1 mt-1">
                  <IndianRupee className="h-3.5 w-3.5" />
                  {request.estimatedAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Notes if any */}
            {request.notes && (
              <div className="p-3.5 bg-amber-50/70 border border-amber-200/70 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-1">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  Clinical & Patient Notes
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">{request.notes}</p>
              </div>
            )}

            {/* Medicines List if applicable */}
            {request.medicines && request.medicines.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Pill className="h-4 w-4 text-indigo-600" />
                  Prescribed Medicines ({request.medicines.length})
                </h4>
                <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                  {request.medicines.map((med, idx) => (
                    <div key={idx} className="p-3 bg-white flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900 block">{med.name}</span>
                        <span className="text-slate-500">{med.dosage}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-slate-700">Qty: {med.quantity}</span>
                        <span className="text-slate-500 block">₹{med.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Test Items if applicable */}
            {request.testItems && request.testItems.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-indigo-600" />
                  Requested Diagnostic Tests ({request.testItems.length})
                </h4>
                <ul className="rounded-xl border border-slate-200 bg-white p-3 space-y-2 text-xs text-slate-800">
                  {request.testItems.map((test, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{test}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Prescription Preview if attached */}
            {request.prescriptionUrl && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-indigo-600" />
                  Digital Prescription Attachment
                </h4>
                <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-slate-900 group">
                  <img
                    src={request.prescriptionUrl}
                    alt="Prescription"
                    className="w-full h-48 object-cover opacity-90 transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-4">
                    <span className="text-xs font-semibold text-white">Verified by AarogyaGenie OCR</span>
                    <a
                      href={request.prescriptionUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 bg-white/90 text-slate-900 text-xs font-bold rounded-lg shadow-sm hover:bg-white transition-all flex items-center gap-1.5"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Full View
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Rejection Reason if any */}
            {request.rejectionReason && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                <span className="text-xs font-bold text-rose-800">Declined by Provider</span>
                <p className="text-xs text-rose-700">{request.rejectionReason}</p>
              </div>
            )}

            {/* Request Progress Timeline */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Service Progress Pipeline
              </h4>
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {request.timeline.map((step, idx) => (
                  <div key={idx} className="relative">
                    <div
                      className={`absolute -left-6 top-1 h-4 w-4 rounded-full border-2 border-white ${
                        step.completed
                          ? 'bg-emerald-500 ring-2 ring-emerald-200'
                          : step.current
                          ? 'bg-indigo-600 ring-2 ring-indigo-200 animate-pulse'
                          : 'bg-slate-300'
                      }`}
                    />
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{step.title}</span>
                        <span className="text-[10px] font-medium text-slate-400">{step.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Drawer Footer / Action Buttons */}
          <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-end gap-3">
            <Button variant="outline" onClick={onClose} className="rounded-xl">
              Close
            </Button>

            {isPending && (
              <>
                {onReject && (
                  <Button
                    variant="destructive"
                    onClick={() => onReject(request.id)}
                    leftIcon={<Ban className="h-4 w-4" />}
                    className="rounded-xl bg-rose-600 hover:bg-rose-700"
                  >
                    Decline
                  </Button>
                )}
                {onAccept && (
                  <Button
                    variant="primary"
                    onClick={() => onAccept(request.id)}
                    leftIcon={<Check className="h-4 w-4" />}
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-700"
                  >
                    Accept Request
                  </Button>
                )}
              </>
            )}

            {isInProgress && onMarkCompleted && (
              <Button
                variant="primary"
                onClick={() => onMarkCompleted(request.id)}
                leftIcon={<CheckCircle2 className="h-4 w-4" />}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700"
              >
                Mark as Completed
              </Button>
            )}

            {isCompleted && (
              <Button
                variant="outline"
                onClick={() => alert(`Invoice generated for Request #${request.requestNumber}`)}
                leftIcon={<Download className="h-4 w-4" />}
                className="rounded-xl"
              >
                Print Invoice
              </Button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
