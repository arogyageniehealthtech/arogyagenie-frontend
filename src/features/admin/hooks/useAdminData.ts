import { useState, useMemo, useCallback } from "react";
import {
  MOCK_ADMIN_STATS,
  MOCK_ADMIN_USERS,
  MOCK_ADMIN_APPOINTMENTS,
  MOCK_PROVIDER_APPLICATIONS,
  type AdminStats,
  type AdminUser,
  type ProviderApplication,
} from "../data/mockAdminData";

// Shared reactive state across components in this session
let globalUsers: AdminUser[] = [...MOCK_ADMIN_USERS];
let globalApplications: ProviderApplication[] = [...MOCK_PROVIDER_APPLICATIONS];
let globalStats: AdminStats = { ...MOCK_ADMIN_STATS };

const userListeners = new Set<() => void>();
const appListeners = new Set<() => void>();
const statsListeners = new Set<() => void>();

function notifyUsers() {
  userListeners.forEach((fn) => fn());
}
function notifyApps() {
  appListeners.forEach((fn) => fn());
}
function notifyStats() {
  statsListeners.forEach((fn) => fn());
}

export function getListAdminUsersQueryKey(params?: { role?: string; search?: string }) {
  return ["admin-users", params];
}

export function useGetAdminStats() {
  const [, setTick] = useState(0);

  useMemo(() => {
    const listener = () => setTick((t) => t + 1);
    statsListeners.add(listener);
    return () => {
      statsListeners.delete(listener);
    };
  }, []);

  return {
    data: globalStats,
    isLoading: false,
    error: null,
  };
}

export function useListAdminUsers(params?: { role?: string; search?: string }) {
  const [, setTick] = useState(0);

  useMemo(() => {
    const listener = () => setTick((t) => t + 1);
    userListeners.add(listener);
    return () => {
      userListeners.delete(listener);
    };
  }, []);

  const users = useMemo(() => {
    let list = globalUsers;
    if (params?.role && params.role !== "all") {
      list = list.filter((u) => u.role === params.role);
    }
    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (u) =>
          u.email.toLowerCase().includes(q) ||
          (u.firstName && u.firstName.toLowerCase().includes(q)) ||
          (u.lastName && u.lastName.toLowerCase().includes(q)) ||
          (u.name && u.name.toLowerCase().includes(q)) ||
          (u.phone && u.phone.includes(q))
      );
    }
    return list;
  }, [params?.role, params?.search]);

  return {
    data: users,
    isLoading: false,
    error: null,
  };
}

export function useUpdateUserStatus() {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    (
      variables: { id: number; data: { status: "active" | "suspended" | "pending" } },
      options?: {
        onSuccess?: () => void;
        onError?: (err: Error) => void;
      }
    ) => {
      setIsPending(true);
      setTimeout(() => {
        const idx = globalUsers.findIndex((u) => u.id === variables.id);
        if (idx !== -1) {
          globalUsers[idx] = {
            ...globalUsers[idx],
            status: variables.data.status,
          };
          notifyUsers();
          options?.onSuccess?.();
        } else {
          options?.onError?.(new Error("User not found"));
        }
        setIsPending(false);
      }, 200);
    },
    []
  );

  return {
    mutate,
    isPending,
  };
}

export function useListAdminAppointments(params?: { status?: string }) {
  const appointments = useMemo(() => {
    if (params?.status && params.status !== "all") {
      return MOCK_ADMIN_APPOINTMENTS.filter((a) => a.status === params.status);
    }
    return MOCK_ADMIN_APPOINTMENTS;
  }, [params?.status]);

  return {
    data: appointments,
    isLoading: false,
    error: null,
  };
}

export function useProviderApplications() {
  const [, setTick] = useState(0);

  useMemo(() => {
    const listener = () => setTick((t) => t + 1);
    appListeners.add(listener);
    return () => {
      appListeners.delete(listener);
    };
  }, []);

  return {
    data: globalApplications,
    isLoading: false,
    error: null,
  };
}

export function useApproveApplication() {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    (id: number, options?: { onSuccess?: (data?: unknown) => void; onError?: (err: Error) => void }) => {
      setIsPending(true);
      setTimeout(() => {
        const app = globalApplications.find((a) => a.id === id);
        if (app) {
          app.status = "APPROVED";
          app.reviewedAt = new Date().toISOString();
          app.reviewedBy = 10;

          // Also activate or add provider to user list
          const existingUser = globalUsers.find((u) => u.email === app.email);
          if (existingUser) {
            existingUser.status = "active";
          }

          globalStats = {
            ...globalStats,
            pendingApprovals: Math.max(0, globalStats.pendingApprovals - 1),
            activeUsers: globalStats.activeUsers + 1,
          };

          notifyApps();
          notifyUsers();
          notifyStats();
          options?.onSuccess?.(app);
        } else {
          options?.onError?.(new Error("Application not found"));
        }
        setIsPending(false);
      }, 200);
    },
    []
  );

  return {
    mutate,
    isPending,
  };
}

export function useRejectApplication() {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    (
      variables: { id: number; reason: string },
      options?: { onSuccess?: () => void; onError?: (err: Error) => void }
    ) => {
      setIsPending(true);
      setTimeout(() => {
        const app = globalApplications.find((a) => a.id === variables.id);
        if (app) {
          app.status = "REJECTED";
          app.rejectionReason = variables.reason;
          app.reviewedAt = new Date().toISOString();
          app.reviewedBy = 10;

          globalStats = {
            ...globalStats,
            pendingApprovals: Math.max(0, globalStats.pendingApprovals - 1),
          };

          notifyApps();
          notifyStats();
          options?.onSuccess?.();
        } else {
          options?.onError?.(new Error("Application not found"));
        }
        setIsPending(false);
      }, 200);
    },
    []
  );

  return {
    mutate,
    isPending,
  };
}

export function useGetMe() {
  const adminUser: AdminUser = {
    id: 10,
    firstName: "System",
    lastName: "Admin",
    displayName: "Platform Admin",
    name: "System Admin",
    email: "admin@arogyagenie.com",
    role: "admin",
    status: "active",
    createdAt: "2024-01-01T00:00:00.000Z",
  };

  return {
    data: adminUser,
    isLoading: false,
    error: null,
  };
}
