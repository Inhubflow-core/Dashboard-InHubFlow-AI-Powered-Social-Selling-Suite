"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import type { SaaSUser, UserCapacity, PlanTier } from "@/lib/saas/types";
import {
  getCurrentUser,
  setCurrentUserId,
  getUserCapacity,
  getStoredUsers,
  updateSubscriber,
  subscribeToSaaSStore,
  canAddAccountForUser,
} from "@/lib/saas/store";
import { getPlanConfig } from "@/lib/saas/plans";

interface AuthContextType {
  currentUser: SaaSUser;
  isSuperAdmin: boolean;
  isClientAdmin: boolean;
  capacity: UserCapacity;
  allUsers: SaaSUser[];
  canConnectAccount: boolean;
  switchUser: (userId: string) => void;
  updateUserPlan: (planTier: PlanTier, customSlots?: number) => void;
  refreshUserData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setUser] = useState<SaaSUser>(() => getCurrentUser());
  const [allUsers, setAllUsers] = useState<SaaSUser[]>(() => getStoredUsers());
  const [capacity, setCapacity] = useState<UserCapacity>(() => getUserCapacity());

  const syncState = () => {
    const user = getCurrentUser();
    setUser(user);
    setAllUsers(getStoredUsers());
    setCapacity(getUserCapacity(user.id));
  };

  useEffect(() => {
    syncState();
    const unsubscribe = subscribeToSaaSStore(syncState);
    return () => unsubscribe();
  }, []);

  const isSuperAdmin = useMemo(() => {
    return (
      currentUser.role === "super_admin" ||
      currentUser.email.trim().toLowerCase() === "inhubflow@gmail.com"
    );
  }, [currentUser]);

  const isClientAdmin = useMemo(() => {
    return currentUser.role === "client_admin" || isSuperAdmin;
  }, [currentUser, isSuperAdmin]);

  const canConnectAccount = useMemo(() => {
    return canAddAccountForUser(currentUser.id);
  }, [currentUser, capacity]);

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
  };

  const updateUserPlan = (planTier: PlanTier, customSlots?: number) => {
    const plan = getPlanConfig(planTier);
    const slots = customSlots || plan.slots;
    updateSubscriber(currentUser.id, {
      planTier,
      slotsLimit: slots,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isSuperAdmin,
        isClientAdmin,
        capacity,
        allUsers,
        canConnectAccount,
        switchUser,
        updateUserPlan,
        refreshUserData: syncState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  }
  return context;
};
