import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Inbox,
  Eye,
  Check,
  Ban,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowUpDown,
  Download,
} from 'lucide-react';
import { usePartner } from '../context/PartnerContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { RequestDetailsDrawer } from '../components/common/RequestDetailsDrawer';
import { RejectRequestModal } from '../components/common/RejectRequestModal';
import { PartnerEmptyState } from '../components/common/PartnerEmptyState';
import { PartnerSkeleton } from '../components/common/PartnerSkeleton';
import { Button } from '@/components/ui/button';
import type { PartnerRequest, PartnerRequestStatus } from '@/types/partner.types';

export const PartnerRequestsPage: React.FC = () => {
  const {
    requests,
    isLoading,
    acceptRequest,
    rejectRequest,
    updateRequestStatus,
    simulateIncomingRequest,
  } = usePartner();

  const [activeTab, setActiveTab] = useState<PartnerRequestStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [selectedRequest, setSelectedRequest] = useState<PartnerRequest | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [rejectingRequest, setRejectingRequest] = useState<PartnerRequest | null>(null);

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // Tab filter
      if (activeTab !== 'ALL') {
        if (activeTab === 'IN_PROGRESS' && (req.status === 'IN_PROGRESS' || req.status === 'ACCEPTED')) {
          // match
        } else if (req.status !== activeTab) {
          return false;
        }
      }

      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchNumber = req.requestNumber.toLowerCase().includes(q);
        const matchPatient = req.patient.name.toLowerCase().includes(q);
        const matchService = req.serviceType.toLowerCase().includes(q);
        if (!matchNumber && !matchPatient && !matchService) return false;
      }

      // Category filter
      if (categoryFilter !== 'ALL' && req.category !== categoryFilter) {
        return false;
      }

      // Priority filter
      if (priorityFilter !== 'ALL' && req.priority !== priorityFilter) {
        return false;
      }

      return true;
    });
  }, [requests, activeTab, search, categoryFilter, priorityFilter]);

  const handleOpenDetails = (req: PartnerRequest) => {
    setSelectedRequest(req);
    setIsDrawerOpen(true);
  };

  const handleAccept = async (id: string) => {
    await acceptRequest(id);
    if (selectedRequest?.id === id) {
      setSelectedRequest((prev) => (prev ? { ...prev, status: 'IN_PROGRESS' } : null));
    }
  };

  const handleRejectPrompt = (id: string) => {
    const req = requests.find((r) => r.id === id);
    if (req) {
      setIsDrawerOpen(false);
      setRejectingRequest(req);
    }
  };

  const handleConfirmReject = async (reason: string) => {
    if (rejectingRequest) {
      await rejectRequest(rejectingRequest.id, reason);
      setRejectingRequest(null);
    }
  };

  const counts = useMemo(() => {
    return {
      all: requests.length,
      pending: requests.filter((r) => r.status === 'PENDING').length,
      inProgress: requests.filter((r) => r.status === 'IN_PROGRESS' || r.status === 'ACCEPTED').length,
      completed: requests.filter((r) => r.status === 'COMPLETED').length,
      rejected: requests.filter((r) => r.status === 'REJECTED' || r.status === 'CANCELLED').length,
    };
  }, [requests]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Incoming Platform Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage, verify, accept, and track requests originating from AarogyaGenie patients
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            onClick={simulateIncomingRequest}
            size="sm"
            className="rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 text-white font-bold shadow-sm"
            leftIcon={<Sparkles className="h-4 w-4 text-amber-300" />}
          >
            Simulate New Request
          </Button>
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/90 pb-2">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'ALL'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Requests ({counts.all})
        </button>

        <button
          onClick={() => setActiveTab('PENDING')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'PENDING'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-amber-700 bg-amber-50 hover:bg-amber-100/70'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          Pending Action ({counts.pending})
        </button>

        <button
          onClick={() => setActiveTab('IN_PROGRESS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'IN_PROGRESS'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100/70'
          }`}
        >
          In Progress ({counts.inProgress})
        </button>

        <button
          onClick={() => setActiveTab('COMPLETED')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'COMPLETED'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100/70'
          }`}
        >
          Completed ({counts.completed})
        </button>

        <button
          onClick={() => setActiveTab('REJECTED')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'REJECTED'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-rose-700 bg-rose-50 hover:bg-rose-100/70'
          }`}
        >
          Declined ({counts.rejected})
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="relative sm:col-span-6 lg:col-span-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by patient name, Aarogya request #, or service type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="sm:col-span-3 lg:col-span-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="MEDICINE">Prescription Medicine</option>
            <option value="LAB_TEST">Diagnostic Lab Test</option>
            <option value="DOCTOR_CONSULT">Doctor Consultation</option>
            <option value="EMERGENCY">Emergency Triage</option>
          </select>
        </div>

        <div className="sm:col-span-3 lg:col-span-3">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="NORMAL">Normal Priority</option>
            <option value="HIGH">High Priority</option>
            <option value="EMERGENCY">Emergency (Urgent)</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      {isLoading ? (
        <PartnerSkeleton rows={6} />
      ) : filteredRequests.length === 0 ? (
        <PartnerEmptyState
          title="No requests matching current filters"
          description="Try clearing your search query or switching tabs."
          actionLabel="Clear Filters"
          onAction={() => {
            setActiveTab('ALL');
            setSearch('');
            setCategoryFilter('ALL');
            setPriorityFilter('ALL');
          }}
        />
      ) : (
        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Request # & Date</th>
                  <th className="py-3.5 px-4">Patient Profile</th>
                  <th className="py-3.5 px-4">Requested Service & Category</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Bill Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Request # */}
                    <td className="py-4 px-4">
                      <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 inline-block mb-1">
                        {req.requestNumber}
                      </span>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span>{req.requestedDate}, {req.requestedTime}</span>
                      </div>
                    </td>

                    {/* Patient */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        {req.patient.avatar ? (
                          <img
                            src={req.patient.avatar}
                            alt={req.patient.name}
                            className="h-9 w-9 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                            {req.patient.name[0]}
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-slate-900 block">{req.patient.name}</span>
                          <span className="text-[10px] text-slate-500">
                            {req.patient.age}y • {req.patient.gender} • {req.patient.phone}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Service */}
                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-900 block max-w-xs truncate">
                        {req.serviceType}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        {req.category.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="py-4 px-4">
                      {req.priority === 'EMERGENCY' ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-red-100 text-red-700 border border-red-200 animate-pulse">
                          EMERGENCY
                        </span>
                      ) : req.priority === 'HIGH' ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                          High
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-slate-100 text-slate-600">
                          Normal
                        </span>
                      )}
                    </td>

                    {/* Bill */}
                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-900">
                        ₹{req.estimatedAmount.toLocaleString()}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <StatusBadge status={req.status} size="sm" />
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenDetails(req)}
                          title="Inspect Details"
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 font-semibold text-xs flex items-center gap-1 transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5 text-slate-500" />
                          View
                        </button>

                        {req.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleAccept(req.id)}
                              title="Accept Request"
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                            >
                              <Check className="h-3.5 w-3.5" />
                              Accept
                            </button>
                            <button
                              onClick={() => handleRejectPrompt(req.id)}
                              title="Decline"
                              className="px-2 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors cursor-pointer"
                            >
                              <Ban className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}

                        {(req.status === 'IN_PROGRESS' || req.status === 'ACCEPTED') && (
                          <button
                            onClick={() => updateRequestStatus(req.id, 'COMPLETED')}
                            title="Mark as Completed"
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center gap-1 transition-colors"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Complete
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

      {/* Details Drawer */}
      <RequestDetailsDrawer
        request={selectedRequest}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onAccept={handleAccept}
        onReject={handleRejectPrompt}
        onMarkCompleted={(id) => updateRequestStatus(id, 'COMPLETED')}
      />

      {/* Reject Modal */}
      {rejectingRequest && (
        <RejectRequestModal
          isOpen={!!rejectingRequest}
          onClose={() => setRejectingRequest(null)}
          onConfirm={handleConfirmReject}
          requestNumber={rejectingRequest.requestNumber}
          patientName={rejectingRequest.patient.name}
        />
      )}

    </div>
  );
};

export default PartnerRequestsPage;
