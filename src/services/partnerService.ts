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
} from '../types/partner.types';

import { MOCK_PROVIDERS } from '../mock/partner/providers.mock';
import { MOCK_REQUESTS } from '../mock/partner/requests.mock';
import { MOCK_ORDERS } from '../mock/partner/orders.mock';
import { MOCK_INVENTORY } from '../mock/partner/inventory.mock';
import { MOCK_LAB_BOOKINGS } from '../mock/partner/labBookings.mock';
import { MOCK_LAB_REPORTS } from '../mock/partner/labReports.mock';
import { MOCK_APPOINTMENTS } from '../mock/partner/appointments.mock';
import { MOCK_CHECKINS } from '../mock/partner/checkIns.mock';
import { MOCK_PATIENTS } from '../mock/partner/patients.mock';
import { MOCK_SERVICES } from '../mock/partner/services.mock';
import { MOCK_NOTIFICATIONS } from '../mock/partner/notifications.mock';
import { MOCK_ANALYTICS } from '../mock/partner/analytics.mock';

// =============================================================================
// STATEFUL IN-MEMORY REPOSITORY (Simulates Live Backend Platform)
// =============================================================================

class PartnerRepository {
  private providers: PartnerProvider[] = JSON.parse(JSON.stringify(MOCK_PROVIDERS));
  private requests: PartnerRequest[] = JSON.parse(JSON.stringify(MOCK_REQUESTS));
  private orders: PharmacyOrder[] = JSON.parse(JSON.stringify(MOCK_ORDERS));
  private inventory: InventoryItem[] = JSON.parse(JSON.stringify(MOCK_INVENTORY));
  private labBookings: LabBooking[] = JSON.parse(JSON.stringify(MOCK_LAB_BOOKINGS));
  private labReports: LabReport[] = JSON.parse(JSON.stringify(MOCK_LAB_REPORTS));
  private appointments: HospitalAppointment[] = JSON.parse(JSON.stringify(MOCK_APPOINTMENTS));
  private checkIns: HospitalCheckIn[] = JSON.parse(JSON.stringify(MOCK_CHECKINS));
  private patients: PartnerPatient[] = JSON.parse(JSON.stringify(MOCK_PATIENTS));
  private services: PartnerServiceItem[] = JSON.parse(JSON.stringify(MOCK_SERVICES));
  private notifications: PartnerNotification[] = JSON.parse(JSON.stringify(MOCK_NOTIFICATIONS));
  private activityLogs: PartnerActivityLog[] = [
    {
      id: 'act-1',
      providerId: 'provider-pharmacy-1',
      action: 'ORDER_PREPARED',
      title: 'Prescription Packaged',
      description: 'Order #ORD-PH-9022 sealed and prepared for express pickup.',
      timestamp: '10:15 AM',
      type: 'ORDER',
    },
    {
      id: 'act-2',
      providerId: 'provider-lab-1',
      action: 'SAMPLE_RECEIVED',
      title: 'Sample Received',
      description: 'Venous blood sample for Vikram Nair checked into biochemistry station.',
      timestamp: '10:35 AM',
      type: 'BOOKING',
    },
    {
      id: 'act-3',
      providerId: 'provider-hospital-1',
      action: 'TRIAGE_ALERT',
      title: 'Emergency Triage Checked In',
      description: 'Patient Manish Chawla assigned priority level EMERGENCY in Bay 3.',
      timestamp: '09:40 AM',
      type: 'CHECKIN',
    },
  ];

  // Helper delay to mimic microsecond network latency if desired
  private async delay(ms: number = 50): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // --- Providers -------------------------------------------------------------
  async getProviders(): Promise<PartnerProvider[]> {
    await this.delay();
    return [...this.providers];
  }

  async getProviderById(providerId: string): Promise<PartnerProvider | null> {
    await this.delay();
    const found = this.providers.find((p) => p.id === providerId);
    return found ? { ...found } : null;
  }

  async updateProviderSettings(
    providerId: string,
    updates: Partial<PartnerProvider>
  ): Promise<PartnerProvider> {
    await this.delay();
    const index = this.providers.findIndex((p) => p.id === providerId);
    if (index === -1) throw new Error(`Provider ${providerId} not found`);
    this.providers[index] = { ...this.providers[index], ...updates };
    return { ...this.providers[index] };
  }

  // --- Dashboard Stats -------------------------------------------------------
  async getDashboardStats(providerId: string): Promise<PartnerDashboardStats> {
    await this.delay();
    const providerRequests = this.requests.filter((r) => r.providerId === providerId);
    const newRequestsCount = providerRequests.filter((r) => r.status === 'PENDING').length;
    const pendingActionsCount = providerRequests.filter(
      (r) => r.status === 'PENDING' || r.status === 'IN_PROGRESS' || r.status === 'ACCEPTED'
    ).length;
    const completedCount = providerRequests.filter((r) => r.status === 'COMPLETED').length;
    const todayOperationsCount = providerRequests.length;

    // Calculate revenue based on provider requests
    const revenueTotal = providerRequests
      .filter((r) => r.status !== 'CANCELLED' && r.status !== 'REJECTED')
      .reduce((sum, r) => sum + (r.estimatedAmount || 0), 0);

    return {
      newRequestsCount,
      todayOperationsCount,
      pendingActionsCount,
      completedCount,
      revenueTotal: revenueTotal || 45200,
      revenueChangePercent: 12.8,
      operationalSatisfactionScore: 4.9,
      averageTurnaroundTime:
        providerId.includes('pharmacy')
          ? '24 mins'
          : providerId.includes('lab')
          ? '4.2 hrs'
          : '14 mins',
    };
  }

  // --- Requests --------------------------------------------------------------
  async getRequests(
    providerId: string,
    filters?: { status?: PartnerRequestStatus | 'ALL'; search?: string }
  ): Promise<PartnerRequest[]> {
    await this.delay();
    let list = this.requests.filter((r) => r.providerId === providerId);

    if (filters?.status && filters.status !== 'ALL') {
      list = list.filter((r) => r.status === filters.status);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (r) =>
          r.requestNumber.toLowerCase().includes(q) ||
          r.patient.name.toLowerCase().includes(q) ||
          r.serviceType.toLowerCase().includes(q)
      );
    }

    return [...list];
  }

  async getRequestById(id: string): Promise<PartnerRequest | null> {
    await this.delay();
    const req = this.requests.find((r) => r.id === id);
    return req ? { ...req } : null;
  }

  async acceptRequest(id: string): Promise<PartnerRequest> {
    await this.delay();
    const index = this.requests.findIndex((r) => r.id === id);
    if (index === -1) throw new Error(`Request ${id} not found`);

    const req = this.requests[index];
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updatedTimeline = req.timeline.map((t) => {
      if (t.current) return { ...t, completed: true, current: false };
      return t;
    });

    updatedTimeline.push({
      title: 'Accepted by Partner Provider',
      description: 'Order confirmed and allocated for processing on AarogyaGenie network',
      timestamp: nowStr,
      completed: true,
      current: true,
    });

    const updated: PartnerRequest = {
      ...req,
      status: 'IN_PROGRESS',
      timeline: updatedTimeline,
      updatedAt: new Date().toISOString(),
    };

    this.requests[index] = updated;

    // Synchronize corresponding order/booking/appointment
    if (req.providerId === 'provider-pharmacy-1') {
      const ordIndex = this.orders.findIndex((o) => o.patient.id === req.patient.id);
      if (ordIndex !== -1) {
        this.orders[ordIndex].orderStatus = 'IN_PROGRESS';
      }
    } else if (req.providerId === 'provider-lab-1') {
      const labIndex = this.labBookings.findIndex((b) => b.patient.id === req.patient.id);
      if (labIndex !== -1) {
        this.labBookings[labIndex].status = 'IN_PROGRESS';
      }
    } else if (req.providerId === 'provider-hospital-1') {
      const aptIndex = this.appointments.findIndex((a) => a.patient.id === req.patient.id);
      if (aptIndex !== -1) {
        this.appointments[aptIndex].status = 'IN_PROGRESS';
      }
    }

    // Add activity log
    this.activityLogs.unshift({
      id: `act-${Date.now()}`,
      providerId: req.providerId,
      action: 'REQUEST_ACCEPTED',
      title: 'Request Accepted',
      description: `${req.serviceType} for ${req.patient.name} was accepted and moved to in-progress.`,
      timestamp: nowStr,
      type: 'REQUEST',
    });

    return { ...updated };
  }

  async rejectRequest(id: string, reason: string): Promise<PartnerRequest> {
    await this.delay();
    const index = this.requests.findIndex((r) => r.id === id);
    if (index === -1) throw new Error(`Request ${id} not found`);

    const req = this.requests[index];
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updatedTimeline = [...req.timeline];
    updatedTimeline.push({
      title: 'Request Declined by Partner',
      description: `Reason: ${reason}. AarogyaGenie automatically re-routing to alternative provider.`,
      timestamp: nowStr,
      completed: true,
    });

    const updated: PartnerRequest = {
      ...req,
      status: 'REJECTED',
      rejectionReason: reason,
      timeline: updatedTimeline,
      updatedAt: new Date().toISOString(),
    };

    this.requests[index] = updated;

    this.activityLogs.unshift({
      id: `act-${Date.now()}`,
      providerId: req.providerId,
      action: 'REQUEST_REJECTED',
      title: 'Request Declined',
      description: `Request #${req.requestNumber} declined (${reason}).`,
      timestamp: nowStr,
      type: 'REQUEST',
    });

    return { ...updated };
  }

  async updateRequestStatus(id: string, status: PartnerRequestStatus): Promise<PartnerRequest> {
    await this.delay();
    const index = this.requests.findIndex((r) => r.id === id);
    if (index === -1) throw new Error(`Request ${id} not found`);

    const req = this.requests[index];
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updatedTimeline = [...req.timeline];
    if (status === 'COMPLETED') {
      updatedTimeline.forEach((t) => (t.completed = true));
      updatedTimeline.push({
        title: 'Service Completed & Closed',
        description: 'Completed successfully. Digital invoice & records synced to patient.',
        timestamp: nowStr,
        completed: true,
      });
    }

    const updated: PartnerRequest = {
      ...req,
      status,
      timeline: updatedTimeline,
      updatedAt: new Date().toISOString(),
    };

    this.requests[index] = updated;
    return { ...updated };
  }

  // --- Live Demo Simulation (Patient submits request on AarogyaGenie) ---------
  async simulateIncomingRequest(providerId: string): Promise<PartnerRequest> {
    await this.delay();
    const now = new Date();
    const nowTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const randomNum = Math.floor(1000 + Math.random() * 9000);

    let newReq: PartnerRequest;

    if (providerId === 'provider-pharmacy-1') {
      newReq = {
        id: `req-ph-sim-${Date.now()}`,
        providerId: 'provider-pharmacy-1',
        requestNumber: `AG-PH-${randomNum}`,
        patient: {
          id: `pat-sim-${Date.now()}`,
          name: 'Pooja Hegde',
          age: 31,
          gender: 'FEMALE',
          phone: '+91 98860 11992',
          email: 'pooja.hegde@example.com',
          address: 'B-201, Green Heights, Sarjapur Road, Bengaluru',
          bloodGroup: 'B_POS',
        },
        serviceType: 'Urgent Antibiotic & Nebulizer Order',
        category: 'MEDICINE',
        status: 'PENDING',
        priority: 'EMERGENCY',
        requestedDate: 'Today',
        requestedTime: nowTimeStr,
        estimatedAmount: 1180,
        notes: 'AarogyaGenie App Urgent Request: Doctor prescription attached. Patient in acute wheezing.',
        medicines: [
          { name: 'Budecort 0.5mg Respules', dosage: 'Pack of 5', quantity: 2, price: 340 },
          { name: 'Duolin Inhaler', dosage: '200 MDI doses', quantity: 1, price: 380 },
          { name: 'Montek LC Tablet', dosage: '10mg/5mg (10 tabs)', quantity: 1, price: 120 },
        ],
        timeline: [
          {
            title: 'Patient Booked on AarogyaGenie',
            description: 'Prescription upload approved via automated AI triage check',
            timestamp: nowTimeStr,
            completed: true,
            current: true,
          },
        ],
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };
    } else if (providerId === 'provider-lab-1') {
      newReq = {
        id: `req-lab-sim-${Date.now()}`,
        providerId: 'provider-lab-1',
        requestNumber: `AG-LAB-${randomNum}`,
        patient: {
          id: `pat-sim-${Date.now()}`,
          name: 'Nitin Kamath',
          age: 44,
          gender: 'MALE',
          phone: '+91 98450 77112',
          email: 'nitin.k@example.com',
          address: '34, 12th Main, HAL 2nd Stage, Indiranagar',
          bloodGroup: 'A_POS',
        },
        serviceType: 'Executive Full Body Health Screening',
        category: 'LAB_TEST',
        status: 'PENDING',
        priority: 'HIGH',
        requestedDate: 'Today',
        requestedTime: nowTimeStr,
        estimatedAmount: 3200,
        notes: 'Home collection requested. Patient fasting for 12 hours.',
        testItems: ['HbA1c', 'Lipid Profile', 'Liver Function Test', 'Serum Creatinine', 'Vitamin D3 & B12'],
        timeline: [
          {
            title: 'Booking Created on AarogyaGenie',
            description: 'Home sample pickup selected for HAL 2nd Stage',
            timestamp: nowTimeStr,
            completed: true,
            current: true,
          },
        ],
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };
    } else {
      newReq = {
        id: `req-hosp-sim-${Date.now()}`,
        providerId: 'provider-hospital-1',
        requestNumber: `AG-HOSP-${randomNum}`,
        patient: {
          id: `pat-sim-${Date.now()}`,
          name: 'Dr. Ramesh Kulkarni',
          age: 58,
          gender: 'MALE',
          phone: '+91 97410 44991',
          email: 'ramesh.k@example.com',
          bloodGroup: 'O_POS',
        },
        serviceType: 'Emergency OPD Consult — Chest Pain Triage',
        category: 'EMERGENCY',
        status: 'PENDING',
        priority: 'EMERGENCY',
        requestedDate: 'Today',
        requestedTime: nowTimeStr,
        estimatedAmount: 2000,
        notes: 'Patient arriving by private transport. Wheelchair & ECG bay preparation requested.',
        timeline: [
          {
            title: 'Emergency Alert from AarogyaGenie',
            description: 'Patient tapped Emergency Care in AarogyaGenie app',
            timestamp: nowTimeStr,
            completed: true,
            current: true,
          },
        ],
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };
    }

    this.requests.unshift(newReq);

    // Push notification
    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      providerId,
      title: `⚡ Live AarogyaGenie Request: ${newReq.patient.name}`,
      message: `${newReq.serviceType} (Estimated ₹${newReq.estimatedAmount})`,
      type: 'NEW_REQUEST',
      timestamp: nowTimeStr,
      isRead: false,
      link: '/partner/requests',
      priority: 'HIGH',
    });

    // Add activity
    this.activityLogs.unshift({
      id: `act-${Date.now()}`,
      providerId,
      action: 'SIMULATED_REQUEST',
      title: 'New AarogyaGenie Request',
      description: `Incoming ${newReq.serviceType} for ${newReq.patient.name}.`,
      timestamp: nowTimeStr,
      type: 'REQUEST',
    });

    return { ...newReq };
  }

  // --- Pharmacy Orders -------------------------------------------------------
  async getOrders(
    providerId: string,
    filters?: { status?: PartnerRequestStatus | 'ALL'; search?: string }
  ): Promise<PharmacyOrder[]> {
    await this.delay();
    let list = this.orders.filter((o) => o.providerId === providerId);
    if (filters?.status && filters.status !== 'ALL') {
      list = list.filter((o) => o.orderStatus === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (o) => o.orderNumber.toLowerCase().includes(q) || o.patient.name.toLowerCase().includes(q)
      );
    }
    return [...list];
  }

  async updateOrderStatus(id: string, status: PartnerRequestStatus): Promise<PharmacyOrder> {
    await this.delay();
    const index = this.orders.findIndex((o) => o.id === id);
    if (index === -1) throw new Error(`Order ${id} not found`);

    const order = this.orders[index];
    order.orderStatus = status;

    this.activityLogs.unshift({
      id: `act-${Date.now()}`,
      providerId: order.providerId,
      action: 'ORDER_STATUS_CHANGED',
      title: 'Order Status Updated',
      description: `Order #${order.orderNumber} status changed to ${status}.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'ORDER',
    });

    return { ...order };
  }

  // --- Pharmacy Inventory ----------------------------------------------------
  async getInventory(providerId: string, search?: string): Promise<InventoryItem[]> {
    await this.delay();
    let list = this.inventory.filter((i) => i.providerId === providerId);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.genericName.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
      );
    }
    return [...list];
  }

  async updateInventoryStock(id: string, newStock: number): Promise<InventoryItem> {
    await this.delay();
    const index = this.inventory.findIndex((i) => i.id === id);
    if (index === -1) throw new Error(`Item ${id} not found`);

    const item = this.inventory[index];
    item.stock = newStock;
    if (newStock === 0) item.status = 'OUT_OF_STOCK';
    else if (newStock <= item.minThreshold) item.status = 'LOW_STOCK';
    else item.status = 'IN_STOCK';

    return { ...item };
  }

  // --- Lab Bookings & Reports ------------------------------------------------
  async getLabBookings(providerId: string): Promise<LabBooking[]> {
    await this.delay();
    return this.labBookings.filter((b) => b.providerId === providerId);
  }

  async updateLabBookingStatus(
    id: string,
    status: PartnerRequestStatus,
    sampleStatus?: SampleStatus
  ): Promise<LabBooking> {
    await this.delay();
    const index = this.labBookings.findIndex((b) => b.id === id);
    if (index === -1) throw new Error(`Booking ${id} not found`);

    const booking = this.labBookings[index];
    booking.status = status;
    if (sampleStatus) booking.sampleStatus = sampleStatus;

    return { ...booking };
  }

  async getLabReports(providerId: string): Promise<LabReport[]> {
    await this.delay();
    return this.labReports.filter((r) => r.providerId === providerId);
  }

  async uploadReport(reportData: Omit<LabReport, 'id'>): Promise<LabReport> {
    await this.delay();
    const newReport: LabReport = {
      ...reportData,
      id: `rep-${Date.now()}`,
    };
    this.labReports.unshift(newReport);
    return { ...newReport };
  }

  async updateReportStatus(
    id: string,
    reportStatus: 'PENDING_VALIDATION' | 'VALIDATED' | 'RELEASED'
  ): Promise<LabReport> {
    await this.delay();
    const index = this.labReports.findIndex((r) => r.id === id);
    if (index === -1) throw new Error(`Report ${id} not found`);

    const report = this.labReports[index];
    report.reportStatus = reportStatus;
    if (reportStatus === 'RELEASED') {
      report.releasedAt = new Date().toLocaleString();
    }
    return { ...report };
  }

  // --- Hospital Appointments & Check-ins -------------------------------------
  async getAppointments(providerId: string): Promise<HospitalAppointment[]> {
    await this.delay();
    return this.appointments.filter((a) => a.providerId === providerId);
  }

  async updateAppointmentStatus(id: string, status: PartnerRequestStatus): Promise<HospitalAppointment> {
    await this.delay();
    const index = this.appointments.findIndex((a) => a.id === id);
    if (index === -1) throw new Error(`Appointment ${id} not found`);

    const apt = this.appointments[index];
    apt.status = status;
    return { ...apt };
  }

  async getCheckIns(providerId: string): Promise<HospitalCheckIn[]> {
    await this.delay();
    return this.checkIns.filter((c) => c.providerId === providerId);
  }

  async updateCheckInStatus(
    id: string,
    status: 'WAITING' | 'WITH_DOCTOR' | 'COMPLETED' | 'CANCELLED'
  ): Promise<HospitalCheckIn> {
    await this.delay();
    const index = this.checkIns.findIndex((c) => c.id === id);
    if (index === -1) throw new Error(`CheckIn ${id} not found`);

    const checkIn = this.checkIns[index];
    checkIn.status = status;
    return { ...checkIn };
  }

  // --- Patients --------------------------------------------------------------
  async getPatients(providerId: string, search?: string): Promise<PartnerPatient[]> {
    await this.delay();
    let list = this.patients.filter((p) => p.providerId === providerId);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.phone.includes(q) ||
          p.lastService.toLowerCase().includes(q)
      );
    }
    return [...list];
  }

  // --- Services --------------------------------------------------------------
  async getServices(providerId: string): Promise<PartnerServiceItem[]> {
    await this.delay();
    return this.services.filter((s) => s.providerId === providerId);
  }

  async toggleServiceAvailability(id: string, isAvailable: boolean): Promise<PartnerServiceItem> {
    await this.delay();
    const index = this.services.findIndex((s) => s.id === id);
    if (index === -1) throw new Error(`Service ${id} not found`);

    const srv = this.services[index];
    srv.isAvailable = isAvailable;
    return { ...srv };
  }

  // --- Notifications ---------------------------------------------------------
  async getNotifications(providerId: string): Promise<PartnerNotification[]> {
    await this.delay();
    return this.notifications.filter((n) => n.providerId === providerId);
  }

  async markNotificationRead(id: string): Promise<void> {
    await this.delay();
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) notif.isRead = true;
  }

  async markAllNotificationsRead(providerId: string): Promise<void> {
    await this.delay();
    this.notifications
      .filter((n) => n.providerId === providerId)
      .forEach((n) => (n.isRead = true));
  }

  // --- Activity Logs ---------------------------------------------------------
  async getActivityLogs(providerId: string): Promise<PartnerActivityLog[]> {
    await this.delay();
    return this.activityLogs.filter((a) => a.providerId === providerId);
  }

  // --- Analytics -------------------------------------------------------------
  async getAnalytics(providerId: string): Promise<PartnerAnalytics> {
    await this.delay();
    return (
      MOCK_ANALYTICS[providerId] ||
      MOCK_ANALYTICS['provider-pharmacy-1']
    );
  }
}

// Singleton repository instance for the application session
export const partnerService = new PartnerRepository();
