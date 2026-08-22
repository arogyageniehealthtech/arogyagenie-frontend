import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Inbox,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  FlaskConical,
  CalendarCheck,
  PackageSearch,
  Eye,
  Check,
  Ban,
  Activity,
  Zap,
} from 'lucide-react';
import { usePartner } from '../context/PartnerContext';
import { StatCard } from '../components/common/StatCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { RequestDetailsDrawer } from '../components/common/RequestDetailsDrawer';
import { RejectRequestModal } from '../components/common/RejectRequestModal';
import { PartnerEmptyState } from '../components/common/PartnerEmptyState';
import { PartnerSkeleton } from '../components/common/PartnerSkeleton';
import { Button } from '@/components/ui/button';
import type { PartnerRequest } from '@/types/partner.types';

export const PartnerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    activeProvider,
    stats,
    requests,
    activityLogs,
    isLoading,
    acceptRequest,
    rejectRequest,
    updateRequestStatus,
    simulateIncomingRequest,
  } = usePartner();

  const [selectedRequest, setSelectedRequest] = useState<PartnerRequest | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [rejectingRequest, setRejectingRequest] = useState<PartnerRequest | null>(null);

  if (isLoading && !stats) {
    return <PartnerSkeleton type="dashboard" />;
  }

  const pendingRequests = requests.filter((r) => r.status === 'PENDING');
  const inProgressRequests = requests.filter(
    (r) => r.status === 'IN_PROGRESS' || r.status === 'ACCEPTED'
  );
  const providerType = activeProvider?.type || 'PHARMACY';

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

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Top Facility Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#18103A] via-[#1F144D] to-[#2B1B69] p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Node • AarogyaGenie Integration Ready
              </span>
              <span className="text-xs font-semibold text-violet-300/80">
                {activeProvider?.city}, {activeProvider?.state}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {activeProvider?.name}
            </h1>
            <p className="text-sm text-violet-200/80 leading-relaxed">
              {activeProvider?.tagline || 'Receiving real-time requests from AarogyaGenie patients'}
            </p>
          </div>

          {/* Quick Action Simulator CTA */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              onClick={simulateIncomingRequest}
              className="rounded-xl bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-md border-0"
              leftIcon={<Sparkles className="h-4 w-4" />}
            >
              Simulate AarogyaGenie Request
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/partner/requests')}
              className="rounded-xl bg-white/10 text-white hover:bg-white/20 border-white/20 text-xs font-bold"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              View Pipeline
            </Button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -top-10 h-40 w-40 rounded-full bg-violet-400/10 blur-2xl pointer-events-none" />
      </div>

      {/* Dynamic Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="New Requests"
          value={stats?.newRequestsCount ?? 0}
          subtitle="Waiting provider review"
          changePercent={18.4}
          icon={Inbox}
          colorScheme="amber"
          highlightBadge={stats?.newRequestsCount ? `${stats.newRequestsCount} Urgent` : undefined}
          onClick={() => navigate('/partner/requests')}
        />

        <StatCard
          title={
            providerType === 'PHARMACY'
              ? "Today's Orders"
              : providerType === 'LAB'
              ? "Today's Lab Tests"
              : "Today's OPD / Visits"
          }
          value={stats?.todayOperationsCount ?? 0}
          subtitle="AarogyaGenie workload"
          changePercent={12.5}
          icon={
            providerType === 'PHARMACY'
              ? ShoppingBag
              : providerType === 'LAB'
              ? FlaskConical
              : CalendarCheck
          }
          colorScheme="indigo"
          onClick={() => {
            if (providerType === 'PHARMACY') navigate('/partner/orders');
            else if (providerType === 'LAB') navigate('/partner/test-bookings');
            else navigate('/partner/appointments');
          }}
        />

        <StatCard
          title="Pending Actions"
          value={stats?.pendingActionsCount ?? 0}
          subtitle="In-progress fulfillment"
          changePercent={-4.2}
          icon={Clock}
          colorScheme="blue"
          onClick={() => navigate('/partner/requests')}
        />

        <StatCard
          title="Completed"
          value={stats?.completedCount ?? 0}
          subtitle="Closed operations"
          changePercent={24.0}
          icon={CheckCircle2}
          colorScheme="emerald"
        />
      </div>

      {/* Urgent Incoming Action Notification Strip (if pending requests exist) */}
      {pendingRequests.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200/80 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
              <Zap className="h-5 w-5 animate-bounce" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                {pendingRequests.length} incoming AarogyaGenie request{pendingRequests.length > 1 ? 's' : ''} require immediate response!
              </h4>
              <p className="text-xs text-amber-700">
                Latest: <strong>{pendingRequests[0].serviceType}</strong> for <strong>{pendingRequests[0].patient.name}</strong> ({pendingRequests[0].requestedTime})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => handleOpenDetails(pendingRequests[0])}
              className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
            >
              Review & Accept
            </Button>
          </div>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Left Column: Live Requests Table (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Activity className="h-5 w-5 text-indigo-600" />
                Live Request Stream
              </h3>
              <p className="text-xs text-slate-500">
                Patient orders and bookings originating from AarogyaGenie
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/partner/requests')}
              className="rounded-xl text-xs"
            >
              All Requests ({requests.length})
            </Button>
          </div>

          {requests.length === 0 ? (
            <PartnerEmptyState
              title="No requests yet"
              description="Click the simulate button above to test a live incoming AarogyaGenie booking."
              actionLabel="Simulate Request"
              onAction={simulateIncomingRequest}
            />
          ) : (
            <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Patient & Aarogya ID</th>
                      <th className="py-3 px-4">Requested Service</th>
                      <th className="py-3 px-4">Timing</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {requests.slice(0, 5).map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            {req.patient.avatar ? (
                              <img
                                src={req.patient.avatar}
                                alt={req.patient.name}
                                className="h-8 w-8 rounded-full object-cover border border-slate-200 shrink-0"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                                {req.patient.name[0]}
                              </div>
                            )}
                            <div className="min-w-0">
                              <span className="font-bold text-slate-900 block truncate">
                                {req.patient.name}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                #{req.requestNumber}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-slate-900 block truncate max-w-xs">
                            {req.serviceType}
                          </span>
                          <span className="text-[11px] text-emerald-600 font-bold">
                            ₹{req.estimatedAmount.toLocaleString()}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-slate-500">
                          <span className="block font-semibold text-slate-700">{req.requestedDate}</span>
                          <span className="text-[10px]">{req.requestedTime}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <StatusBadge status={req.status} size="sm" />
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenDetails(req)}
                              title="View Full Details"
                              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            {req.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => handleAccept(req.id)}
                                  title="Accept Request"
                                  className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleRejectPrompt(req.id)}
                                  title="Decline"
                                  className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                                >
                                  <Ban className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {requests.length > 5 && (
                <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-center">
                  <button
                    onClick={() => navigate('/partner/requests')}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    View remaining {requests.length - 5} requests →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Provider Specific Quick Launch Modules */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Facility Modules
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {providerType === 'PHARMACY' && (
                <>
                  <div
                    onClick={() => navigate('/partner/orders')}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                        <ShoppingBag className="h-5 w-5" />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-slate-900">Orders Manager</h5>
                        <p className="text-xs text-slate-500">Prescription orders & express delivery</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 group-hover:text-indigo-600 transition-all" />
                  </div>

                  <div
                    onClick={() => navigate('/partner/inventory')}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                        <PackageSearch className="h-5 w-5" />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-slate-900">Medicine Inventory</h5>
                        <p className="text-xs text-slate-500">Stock counts & batch thresholds</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition-all" />
                  </div>
                </>
              )}

              {providerType === 'LAB' && (
                <>
                  <div
                    onClick={() => navigate('/partner/test-bookings')}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                        <FlaskConical className="h-5 w-5" />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-slate-900">Test Bookings & Phlebotomy</h5>
                        <p className="text-xs text-slate-500">Sample collection routes & barcodes</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-all" />
                  </div>

                  <div
                    onClick={() => navigate('/partner/lab-reports')}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-slate-900">Reports Generation & Sign-off</h5>
                        <p className="text-xs text-slate-500">Pathologist verification & release</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </>
              )}

              {providerType === 'HOSPITAL' && (
                <>
                  <div
                    onClick={() => navigate('/partner/appointments')}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                        <CalendarCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-slate-900">Doctor Appointments</h5>
                        <p className="text-xs text-slate-500">Specialist OPD & emergency slots</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-all" />
                  </div>

                  <div
                    onClick={() => navigate('/partner/check-ins')}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-slate-900">Live OPD Queue & Check-ins</h5>
                        <p className="text-xs text-slate-500">Virtual token calling & triage</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Operational Activity Feed & Health Score (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Operational Quality Score Card */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">Platform SLA & Score</h4>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                Grade A+
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>AarogyaGenie SLA Fulfillment</span>
                  <span className="text-indigo-600 font-bold">98.4%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-linear-to-r from-indigo-500 to-emerald-500 w-[98.4%]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Avg Turnaround</span>
                  <span className="text-sm font-bold text-slate-900">{stats?.averageTurnaroundTime}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Satisfaction</span>
                  <span className="text-sm font-bold text-emerald-700">⭐ {stats?.operationalSatisfactionScore} / 5.0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Activity Timeline Feed */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">Recent Partner Activity</h4>
              <span className="text-[11px] font-medium text-slate-400">Live updates</span>
            </div>

            <div className="space-y-4">
              {activityLogs.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No recent activity recorded.</p>
              ) : (
                activityLogs.slice(0, 6).map((act) => (
                  <div key={act.id} className="flex items-start gap-3 text-xs">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 shrink-0 font-bold mt-0.5">
                      <Zap className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 truncate">{act.title}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">{act.timestamp}</span>
                      </div>
                      <p className="text-slate-500 mt-0.5 leading-snug">{act.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Request Details Slide-out Drawer */}
      <RequestDetailsDrawer
        request={selectedRequest}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onAccept={handleAccept}
        onReject={handleRejectPrompt}
        onMarkCompleted={(id) => updateRequestStatus(id, 'COMPLETED')}
      />

      {/* Reject Request Confirmation Modal */}
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

export default PartnerDashboardPage;
