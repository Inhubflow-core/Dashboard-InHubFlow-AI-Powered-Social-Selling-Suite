import type { ConnectedLinkedInAccount } from "./types";
import type { SaaSUser } from "../saas/types";

const STORAGE_KEY = "inhubflow_linkedin_accounts";
const ACTIVE_ACCOUNT_KEY = "inhubflow_active_linkedin_account_id";

export const initialLinkedInAccounts: ConnectedLinkedInAccount[] = [
  // Cuenta del Super Admin (Roberto OrSe)
  {
    id: "acc-li-01",
    unipileAccountId: "up_acc_roberto_orse_main",
    name: "Roberto OrSe",
    email: "inhubflow@gmail.com",
    headline: "Founder & CEO en InHubFlow | Social Selling & Automatizacion B2B con IA",
    profilePictureUrl: "/images/user/owner.png",
    publicProfileUrl: "https://www.linkedin.com/in/roberto-orse",
    status: "OK",
    authMode: "hosted",
    connectedAt: "2026-10-01T10:00:00.000Z",
    lastSyncAt: "Hace 5 minutos",
    ownerId: "usr-super-admin-01",
    assignedUserId: "usr-super-admin-01",
    assignedUserName: "Roberto OrSe (Super Admin)",
    dailyActionsCount: {
      invitationsSent: 14,
      messagesSent: 26,
      profilesVisited: 48,
    },
  },
  // Cuenta de Cliente Starter (Carlos Mendoza - 1 Slot)
  {
    id: "acc-li-carlos",
    unipileAccountId: "up_acc_carlos_mendoza",
    name: "Carlos Mendoza",
    email: "carlos@consulting.es",
    headline: "Managing Partner en Mendoza Advisory | Estrategia Comercial",
    profilePictureUrl: "/images/user/user-02.png",
    publicProfileUrl: "https://www.linkedin.com/in/carlos-mendoza-b2b",
    status: "OK",
    authMode: "hosted",
    connectedAt: "2026-09-18T10:00:00.000Z",
    lastSyncAt: "Hace 12 minutos",
    ownerId: "usr-client-starter-02",
    assignedUserId: "usr-client-starter-02",
    assignedUserName: "Carlos Mendoza (Admin)",
    dailyActionsCount: {
      invitationsSent: 18,
      messagesSent: 22,
      profilesVisited: 35,
    },
  },
  // Cuentas de Cliente Growth (Elena Valenzuela - 5 Slots)
  // 1. Cuenta de la Admin Elena
  {
    id: "acc-li-elena",
    unipileAccountId: "up_acc_elena_valenzuela",
    name: "Elena Valenzuela",
    email: "elena@agenciagrowth.com",
    headline: "Head of Growth & Founder en Valenzuela Social Agency",
    profilePictureUrl: "/images/user/user-03.png",
    publicProfileUrl: "https://www.linkedin.com/in/elena-valenzuela",
    status: "OK",
    authMode: "hosted",
    connectedAt: "2026-09-22T09:30:00.000Z",
    lastSyncAt: "Hace 2 minutos",
    ownerId: "usr-client-growth-03",
    assignedUserId: "usr-client-growth-03",
    assignedUserName: "Elena Valenzuela (Admin)",
    dailyActionsCount: {
      invitationsSent: 20,
      messagesSent: 34,
      profilesVisited: 55,
    },
  },
  // 2. Cuenta del miembro Sofia Ramirez (SDR)
  {
    id: "acc-li-sofia",
    unipileAccountId: "up_acc_sofia_ramirez",
    name: "Sofia Ramirez",
    email: "sofia@agenciagrowth.com",
    headline: "Senior B2B SDR en Valenzuela Social Agency | Lead Gen Specialist",
    profilePictureUrl: "/images/user/user-05.png",
    publicProfileUrl: "https://www.linkedin.com/in/sofia-ramirez-sdr",
    status: "OK",
    authMode: "hosted",
    connectedAt: "2026-09-26T11:15:00.000Z",
    lastSyncAt: "Hace 8 minutos",
    ownerId: "usr-client-growth-03",
    assignedUserId: "usr-team-sofia-05",
    assignedUserName: "Sofia Ramirez (Operador SDR)",
    dailyActionsCount: {
      invitationsSent: 16,
      messagesSent: 28,
      profilesVisited: 42,
    },
  },
  // 3. Cuenta del miembro Lucas Gomez (SDR)
  {
    id: "acc-li-lucas",
    unipileAccountId: "up_acc_lucas_gomez",
    name: "Lucas Gomez",
    email: "lucas@agenciagrowth.com",
    headline: "Outbound Sales Representative en Valenzuela Social Agency",
    profilePictureUrl: "/images/user/user-06.png",
    publicProfileUrl: "https://www.linkedin.com/in/lucas-gomez-sales",
    status: "OK",
    authMode: "hosted",
    connectedAt: "2026-10-02T14:20:00.000Z",
    lastSyncAt: "Hace 15 minutos",
    ownerId: "usr-client-growth-03",
    assignedUserId: "tm-03",
    assignedUserName: "Lucas Gomez (Operador SDR)",
    dailyActionsCount: {
      invitationsSent: 12,
      messagesSent: 19,
      profilesVisited: 30,
    },
  },
  // Cuentas de Cliente Business (Marcos Silva - 10 Slots)
  // 1. Cuenta del Admin Marcos
  {
    id: "acc-li-marcos",
    unipileAccountId: "up_acc_marcos_silva",
    name: "Marcos Silva",
    email: "marcos@enterprisesales.io",
    headline: "CEO & Co-Founder en Enterprise Sales Hub | Demand Generation",
    profilePictureUrl: "/images/user/user-04.png",
    publicProfileUrl: "https://www.linkedin.com/in/marcos-silva-ceo",
    status: "OK",
    authMode: "hosted",
    connectedAt: "2026-09-29T10:00:00.000Z",
    lastSyncAt: "Hace 4 minutos",
    ownerId: "usr-client-business-04",
    assignedUserId: "usr-client-business-04",
    assignedUserName: "Marcos Silva (Admin)",
    dailyActionsCount: {
      invitationsSent: 22,
      messagesSent: 38,
      profilesVisited: 60,
    },
  },
  // 2. Cuenta del miembro Javier Fernandez (VP Sales)
  {
    id: "acc-li-javier",
    unipileAccountId: "up_acc_javier_fernandez",
    name: "Javier Fernandez",
    email: "javier@enterprisesales.io",
    headline: "VP of Enterprise Sales en Enterprise Sales Hub",
    profilePictureUrl: "/images/user/user-07.png",
    publicProfileUrl: "https://www.linkedin.com/in/javier-fernandez-sales",
    status: "OK",
    authMode: "hosted",
    connectedAt: "2026-10-03T16:45:00.000Z",
    lastSyncAt: "Hace 20 minutos",
    ownerId: "usr-client-business-04",
    assignedUserId: "tm-02",
    assignedUserName: "Javier Fernandez (Co-Admin)",
    dailyActionsCount: {
      invitationsSent: 19,
      messagesSent: 31,
      profilesVisited: 49,
    },
  },
];

export function getStoredAccounts(): ConnectedLinkedInAccount[] {
  if (typeof window === "undefined") return initialLinkedInAccounts;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialLinkedInAccounts));
      return initialLinkedInAccounts;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialLinkedInAccounts;
  } catch {
    return initialLinkedInAccounts;
  }
}

export function saveStoredAccounts(accounts: ConnectedLinkedInAccount[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  } catch {
    // ignore
  }
}

/**
 * Filtra las cuentas según el rol y permisos del usuario (exactamente como inhubflow-b2b):
 * 1. Super Admin: Ve TODAS las cuentas de toda la plataforma.
 * 2. Admin de Cuenta / Workspace Owner: Ve su propia cuenta y las de TODOS los miembros de su equipo.
 * 3. Miembro del Equipo (Operador SDR): SOLO puede ver su PROPIA cuenta asignada.
 */
export function getVisibleAccountsForUser(user: SaaSUser): ConnectedLinkedInAccount[] {
  const accounts = getStoredAccounts();

  // 1. Super Admin: Ve absolutamente todas las cuentas del ecosistema
  if (user.role === "super_admin" || user.email.toLowerCase() === "inhubflow@gmail.com") {
    return accounts;
  }

  // 2. Miembro del Equipo (Operador): Solo puede ver su propia cuenta asignada
  if (user.role === "member" || (user.ownerId && user.ownerId !== user.id)) {
    return accounts.filter((a) => {
      const matchesAssignedUser = a.assignedUserId === user.id;
      const matchesAssignedAccount = user.assignedAccountId && a.id === user.assignedAccountId;
      const matchesEmail = a.email && a.email.toLowerCase() === user.email.toLowerCase();
      return matchesAssignedUser || matchesAssignedAccount || matchesEmail;
    });
  }

  // 3. Admin de Cuenta (Workspace Owner):
  // Ve su propia cuenta y TODAS las cuentas vinculadas a su organización/workspace
  return accounts.filter((a) => {
    return a.ownerId === user.id || a.assignedUserId === user.id || !a.ownerId;
  });
}

export function getActiveAccountId(): string {
  if (typeof window === "undefined") return initialLinkedInAccounts[0]?.id || "";
  try {
    const saved = localStorage.getItem(ACTIVE_ACCOUNT_KEY);
    if (saved) return saved;
    const accounts = getStoredAccounts();
    const firstId = accounts[0]?.id || "";
    if (firstId) localStorage.setItem(ACTIVE_ACCOUNT_KEY, firstId);
    return firstId;
  } catch {
    return initialLinkedInAccounts[0]?.id || "";
  }
}

export function setActiveAccountId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACTIVE_ACCOUNT_KEY, id);
  } catch {
    // ignore
  }
}

export function addStoredAccount(newAccount: ConnectedLinkedInAccount): ConnectedLinkedInAccount[] {
  const accounts = getStoredAccounts();
  const exists = accounts.find((a) => a.unipileAccountId === newAccount.unipileAccountId || a.id === newAccount.id);
  const updated = exists
    ? accounts.map((a) => (a.id === exists.id ? { ...a, ...newAccount } : a))
    : [newAccount, ...accounts];
  saveStoredAccounts(updated);
  setActiveAccountId(newAccount.id);
  return updated;
}

export function removeStoredAccount(id: string): ConnectedLinkedInAccount[] {
  const accounts = getStoredAccounts();
  const filtered = accounts.filter((a) => a.id !== id && a.unipileAccountId !== id);
  saveStoredAccounts(filtered);
  const currentActive = getActiveAccountId();
  if (currentActive === id && filtered.length > 0) {
    setActiveAccountId(filtered[0].id);
  }
  return filtered;
}

export function updateStoredAccountStatus(id: string, status: ConnectedLinkedInAccount['status']): ConnectedLinkedInAccount[] {
  const accounts = getStoredAccounts();
  const updated = accounts.map((a) => (a.id === id || a.unipileAccountId === id ? { ...a, status, lastSyncAt: "Recien sincronizado" } : a));
  saveStoredAccounts(updated);
  return updated;
}

export function assignAccountToMember(accountId: string, memberId: string, memberName: string): ConnectedLinkedInAccount[] {
  const accounts = getStoredAccounts();
  const updated = accounts.map((a) => {
    if (a.id === accountId) {
      return {
        ...a,
        assignedUserId: memberId,
        assignedUserName: memberName,
      };
    }
    return a;
  });
  saveStoredAccounts(updated);
  return updated;
}
