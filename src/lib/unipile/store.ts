import type { ConnectedLinkedInAccount } from "./types";

const STORAGE_KEY = "inhubflow_linkedin_accounts";
const ACTIVE_ACCOUNT_KEY = "inhubflow_active_linkedin_account_id";

export const initialLinkedInAccounts: ConnectedLinkedInAccount[] = [
  {
    id: "acc-li-01",
    unipileAccountId: "up_acc_roberto_orse_main",
    name: "Roberto OrSe",
    headline: "Founder & CEO en InHubFlow | Social Selling & Automatizacion B2B con IA",
    profilePictureUrl: "/images/user/user-01.jpg",
    publicProfileUrl: "https://www.linkedin.com/in/roberto-orse",
    status: "OK",
    authMode: "hosted",
    connectedAt: "2026-10-01T10:00:00.000Z",
    lastSyncAt: "Hace 5 minutos",
    dailyActionsCount: {
      invitationsSent: 14,
      messagesSent: 26,
      profilesVisited: 48,
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
