import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import type {
  PartnerProvider,
  PartnerRequest,
  PartnerRequestStatus,
  PharmacyOrder,
  InventoryItem,
  LabBooking,
  LabReport,
  HospitalAppointment,
  HospitalCheckIn,
  PartnerPatient,
  PartnerServiceItem,
  PartnerNotification,
  PartnerActivityLog,
  PartnerDashboardStats,
  PartnerAnalytics,
  SampleStatus,
} from '@/types/partner.types';
import { partnerService } from '@/services/partnerService';

interface PartnerContextValue {
  providers: PartnerProvider[];
  activeProvider: PartnerProvider | null;
  activeProviderId: string;
  setActiveProviderId: (id: string) => void;
  stats: PartnerDashboardStats | null;
  requests: PartnerRequest[];
  orders: PharmacyOrder[];
  inventory: InventoryItem[];
  labBookings: LabBooking[];
  labReports: LabReport[];
  appointments: HospitalAppointment[];
  checkIns: HospitalCheckIn[];
  patients: PartnerPatient[];
  services: PartnerServiceItem[];
  notifications: PartnerNotification[];
  unreadNotifCount: number;
  activityLogs: PartnerActivityLog[];
  analytics: PartnerAnalytics | null;
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  refreshData: () => Promise<void>;

  // Workflow Actions
  acceptRequest: (id: string) => Promise<void>;
  rejectRequest: (id: string, reason: string) => Promise<void>;
  updateRequestStatus: (id: string, status: PartnerRequestStatus) => Promise<void>;
  simulateIncomingRequest: () => Promise<void>;
  updateOrderStatus: (id: string, status: PartnerRequestStatus) => Promise<void>;
  updateInventoryStock: (id: string, newStock: number) => Promise<void>;
  updateLabBooking: (id: string, status: PartnerRequestStatus, sampleStatus?: SampleStatus) => Promise<void>;
  uploadReport: (data: Omit<LabReport, 'id'>) => Promise<void>;
  updateReportStatus: (id: string, status: 'PENDING_VALIDATION' | 'VALIDATED' | 'RELEASED') => Promise<void>;
  updateAppointment: (id: string, status: PartnerRequestStatus) => Promise<void>;
  updateCheckIn: (id: string, status: 'WAITING' | 'WITH_DOCTOR' | 'COMPLETED' | 'CANCELLED') => Promise<void>;
  toggleService: (id: string, isAvailable: boolean) => Promise<void>;
  markNotifRead: (id: string) => Promise<void>;
  markAllNotifsRead: () => Promise<void>;
  updateSettings: (updates: Partial<PartnerProvider>) => Promise<void>;
}

const PartnerContext = createContext<PartnerContextValue | undefined>(undefined);

export const PartnerProviderContext: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [providers, setProviders] = useState<PartnerProvider[]>([]);
  const [activeProviderId, setActiveProviderIdState] = useState<string>('provider-pharmacy-1');
  const [activeProvider, setActiveProvider] = useState<PartnerProvider | null>(null);
  const [stats, setStats] = useState<PartnerDashboardStats | null>(null);
  const [requests, setRequests] = useState<PartnerRequest[]>([]);
  const [orders, setOrders] = useState<PharmacyOrder[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [labBookings, setLabBookings] = useState<LabBooking[]>([]);
  const [labReports, setLabReports] = useState<LabReport[]>([]);
  const [appointments, setAppointments] = useState<HospitalAppointment[]>([]);
  const [checkIns, setCheckIns] = useState<HospitalCheckIn[]>([]);
  const [patients, setPatients] = useState<PartnerPatient[]>([]);
  const [services, setServices] = useState<PartnerServiceItem[]>([]);
  const [notifications, setNotifications] = useState<PartnerNotification[]>([]);
  const [activityLogs, setActivityLogs] = useState<PartnerActivityLog[]>([]);
  const [analytics, setAnalytics] = useState<PartnerAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Load all providers on mount
  useEffect(() => {
    partnerService.getProviders().then((list) => {
      setProviders(list);
      if (list.length > 0) {
        const found = list.find((p) => p.id === activeProviderId) || list[0];
        setActiveProvider(found);
      }
    });
  }, []);

  // Fetch scoped data for active provider
  const fetchProviderData = useCallback(async (providerId: string) => {
    setIsLoading(true);
    try {
      const [
        pInfo,
        sData,
        reqs,
        ords,
        inv,
        bks,
        reps,
        apts,
        chks,
        pats,
        srvs,
        notifs,
        acts,
        ana,
      ] = await Promise.all([
        partnerService.getProviderById(providerId),
        partnerService.getDashboardStats(providerId),
        partnerService.getRequests(providerId),
        partnerService.getOrders(providerId),
        partnerService.getInventory(providerId),
        partnerService.getLabBookings(providerId),
        partnerService.getLabReports(providerId),
        partnerService.getAppointments(providerId),
        partnerService.getCheckIns(providerId),
        partnerService.getPatients(providerId),
        partnerService.getServices(providerId),
        partnerService.getNotifications(providerId),
        partnerService.getActivityLogs(providerId),
        partnerService.getAnalytics(providerId),
      ]);

      if (pInfo) setActiveProvider(pInfo);
      setStats(sData);
      setRequests(reqs);
      setOrders(ords);
      setInventory(inv);
      setLabBookings(bks);
      setLabReports(reps);
      setAppointments(apts);
      setCheckIns(chks);
      setPatients(pats);
      setServices(srvs);
      setNotifications(notifs);
      setActivityLogs(acts);
      setAnalytics(ana);
    } catch (err) {
      console.error('Error fetching partner provider data:', err);
      toast.error('Failed to load partner dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Switch provider handler
  const setActiveProviderId = (id: string) => {
    setActiveProviderIdState(id);
    const p = providers.find((item) => item.id === id);
    if (p) {
      setActiveProvider(p);
      toast.success(`Switched to ${p.name} (${p.type})`, {
        icon: '🏥',
      });
    }
    fetchProviderData(id);
  };

  useEffect(() => {
    if (activeProviderId) {
      fetchProviderData(activeProviderId);
    }
  }, [activeProviderId, fetchProviderData]);

  const refreshData = async () => {
    await fetchProviderData(activeProviderId);
  };

  // --- ACTIONS ---

  const acceptRequest = async (id: string) => {
    try {
      const updated = await partnerService.acceptRequest(id);
      setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
      toast.success(`Request #${updated.requestNumber} accepted & processing started!`, {
        icon: '✅',
      });
      // Re-fetch stats & activity
      const [newStats, newActs] = await Promise.all([
        partnerService.getDashboardStats(activeProviderId),
        partnerService.getActivityLogs(activeProviderId),
      ]);
      setStats(newStats);
      setActivityLogs(newActs);
    } catch (err) {
      toast.error('Failed to accept request');
    }
  };

  const rejectRequest = async (id: string, reason: string) => {
    try {
      const updated = await partnerService.rejectRequest(id, reason);
      setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
      toast.error(`Request #${updated.requestNumber} declined. Re-routing on AarogyaGenie.`, {
        icon: '❌',
      });
      const [newStats, newActs] = await Promise.all([
        partnerService.getDashboardStats(activeProviderId),
        partnerService.getActivityLogs(activeProviderId),
      ]);
      setStats(newStats);
      setActivityLogs(newActs);
    } catch (err) {
      toast.error('Failed to decline request');
    }
  };

  const updateRequestStatus = async (id: string, status: PartnerRequestStatus) => {
    try {
      const updated = await partnerService.updateRequestStatus(id, status);
      setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
      toast.success(`Request status updated to ${status}`);
      const newStats = await partnerService.getDashboardStats(activeProviderId);
      setStats(newStats);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const simulateIncomingRequest = async () => {
    try {
      const newReq = await partnerService.simulateIncomingRequest(activeProviderId);
      setRequests((prev) => [newReq, ...prev]);
      toast(`⚡ New AarogyaGenie Request from ${newReq.patient.name}!`, {
        icon: '🔔',
        duration: 5000,
        style: {
          border: '2px solid #6366F1',
          background: '#EEF2FF',
          color: '#1E1B4B',
          fontWeight: '600',
        },
      });
      const [newStats, newNotifs, newActs] = await Promise.all([
        partnerService.getDashboardStats(activeProviderId),
        partnerService.getNotifications(activeProviderId),
        partnerService.getActivityLogs(activeProviderId),
      ]);
      setStats(newStats);
      setNotifications(newNotifs);
      setActivityLogs(newActs);
    } catch (err) {
      toast.error('Simulation failed');
    }
  };

  const updateOrderStatus = async (id: string, status: PartnerRequestStatus) => {
    try {
      const updated = await partnerService.updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => (o.id === id ? updated : rStatus(o, status))));
      toast.success(`Order #${updated.orderNumber} updated to ${status}`);
      const newActs = await partnerService.getActivityLogs(activeProviderId);
      setActivityLogs(newActs);
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  const rStatus = (order: PharmacyOrder, status: PartnerRequestStatus): PharmacyOrder => {
    return { ...order, orderStatus: status };
  };

  const updateInventoryStock = async (id: string, newStock: number) => {
    try {
      const updated = await partnerService.updateInventoryStock(id, newStock);
      setInventory((prev) => prev.map((i) => (i.id === id ? updated : i)));
      toast.success(`Stock updated for ${updated.name} (${newStock} ${updated.unit})`);
    } catch (err) {
      toast.error('Failed to adjust stock');
    }
  };

  const updateLabBooking = async (
    id: string,
    status: PartnerRequestStatus,
    sampleStatus?: SampleStatus
  ) => {
    try {
      const updated = await partnerService.updateLabBookingStatus(id, status, sampleStatus);
      setLabBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
      toast.success(`Lab Booking #${updated.bookingNumber} updated`);
    } catch (err) {
      toast.error('Failed to update lab booking');
    }
  };

  const uploadReport = async (data: Omit<LabReport, 'id'>) => {
    try {
      const newRep = await partnerService.uploadReport(data);
      setLabReports((prev) => [newRep, ...prev]);
      toast.success(`Lab Report #${newRep.reportNumber} generated and signed!`);
    } catch (err) {
      toast.error('Failed to upload report');
    }
  };

  const updateReportStatus = async (
    id: string,
    status: 'PENDING_VALIDATION' | 'VALIDATED' | 'RELEASED'
  ) => {
    try {
      const updated = await partnerService.updateReportStatus(id, status);
      setLabReports((prev) => prev.map((r) => (r.id === id ? updated : r)));
      toast.success(`Report #${updated.reportNumber} released to AarogyaGenie Patient!`);
    } catch (err) {
      toast.error('Failed to update report status');
    }
  };

  const updateAppointment = async (id: string, status: PartnerRequestStatus) => {
    try {
      const updated = await partnerService.updateAppointmentStatus(id, status);
      setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
      toast.success(`Appointment #${updated.appointmentNumber} updated to ${status}`);
    } catch (err) {
      toast.error('Failed to update appointment');
    }
  };

  const updateCheckIn = async (
    id: string,
    status: 'WAITING' | 'WITH_DOCTOR' | 'COMPLETED' | 'CANCELLED'
  ) => {
    try {
      const updated = await partnerService.updateCheckInStatus(id, status);
      setCheckIns((prev) => prev.map((c) => (c.id === id ? updated : c)));
      toast.success(`Queue Token #${updated.tokenNumber} status: ${status}`);
    } catch (err) {
      toast.error('Failed to update check-in');
    }
  };

  const toggleService = async (id: string, isAvailable: boolean) => {
    try {
      const updated = await partnerService.toggleServiceAvailability(id, isAvailable);
      setServices((prev) => prev.map((s) => (s.id === id ? updated : s)));
      toast.success(
        `Service "${updated.name}" is now ${isAvailable ? 'Active on AarogyaGenie' : 'Temporarily Paused'}`
      );
    } catch (err) {
      toast.error('Failed to toggle service');
    }
  };

  const markNotifRead = async (id: string) => {
    await partnerService.markNotificationRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotifsRead = async () => {
    await partnerService.markAllNotificationsRead(activeProviderId);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success('All notifications marked as read');
  };

  const updateSettings = async (updates: Partial<PartnerProvider>) => {
    try {
      const updated = await partnerService.updateProviderSettings(activeProviderId, updates);
      setActiveProvider(updated);
      setProviders((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      toast.success('Provider organization profile saved successfully!');
    } catch (err) {
      toast.error('Failed to update settings');
    }
  };

  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  return (
    <PartnerContext.Provider
      value={{
        providers,
        activeProvider,
        activeProviderId,
        setActiveProviderId,
        stats,
        requests,
        orders,
        inventory,
        labBookings,
        labReports,
        appointments,
        checkIns,
        patients,
        services,
        notifications,
        unreadNotifCount,
        activityLogs,
        analytics,
        isLoading,
        searchQuery,
        setSearchQuery,
        refreshData,
        acceptRequest,
        rejectRequest,
        updateRequestStatus,
        simulateIncomingRequest,
        updateOrderStatus,
        updateInventoryStock,
        updateLabBooking,
        uploadReport,
        updateReportStatus,
        updateAppointment,
        updateCheckIn,
        toggleService,
        markNotifRead,
        markAllNotifsRead,
        updateSettings,
      }}
    >
      {children}
    </PartnerContext.Provider>
  );
};

export const usePartner = (): PartnerContextValue => {
  const context = useContext(PartnerContext);
  if (!context) {
    throw new Error('usePartner must be used within a PartnerProviderContext');
  }
  return context;
};
