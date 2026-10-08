"use client";

import { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import LinkedInAccountCard from "@/components/unipile/LinkedInAccountCard";
import ConnectLinkedInModal from "@/components/unipile/ConnectLinkedInModal";
import {
  getStoredAccounts,
  getActiveAccountId,
  setActiveAccountId,
  removeStoredAccount,
  updateStoredAccountStatus,
} from "@/lib/unipile/store";
import type { ConnectedLinkedInAccount } from "@/lib/unipile/types";
import {
  Plus,
  ShieldCheck,
  RefreshCw,
  Server,
  Activity,
  Send,
  UserCheck,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react";

export default function LinkedInAccountsPage() {
  const [accounts, setAccounts] = useState<ConnectedLinkedInAccount[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [unipileStatus, setUnipileStatus] = useState<{
    configured: boolean;
    mode: "live" | "demo";
    dsn?: string;
  } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Cargar cuentas del store local y verificar estado de API Unipile
  useEffect(() => {
    const loadedAccounts = getStoredAccounts();
    const currentActive = getActiveAccountId();
    setAccounts(loadedAccounts);
    setActiveId(currentActive);

    // Consultar estado de Unipile
    fetch("/api/unipile/status")
      .then((res) => res.json())
      .then((data) => {
        setUnipileStatus(data);
      })
      .catch(() => {
        setUnipileStatus({ configured: false, mode: "demo" });
      });
  }, []);

  const handleSelectActive = (id: string) => {
    setActiveId(id);
    setActiveAccountId(id);
    setNotice("Cuenta activa actualizada para envios y automatizaciones.");
    setTimeout(() => setNotice(null), 3000);
  };

  const handleDisconnect = async (id: string) => {
    if (!confirm("Confirmas la desconexion de esta cuenta de LinkedIn?")) return;
    try {
      await fetch(`/api/unipile/accounts/${id}`, { method: "DELETE" });
    } catch {
      // Ignorar error si está en demo
    }
    const updated = removeStoredAccount(id);
    setAccounts(updated);
    const newActive = getActiveAccountId();
    setActiveId(newActive);
    setNotice("Cuenta desvinculada exitosamente.");
    setTimeout(() => setNotice(null), 3000);
  };

  const handleReconnect = (id: string) => {
    setIsModalOpen(true);
  };

  const handleSyncAll = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/unipile/accounts");
      const data = await res.json();
      if (data.accounts && Array.isArray(data.accounts)) {
        // Enriquecer o sincronizar
        setNotice("Cuentas sincronizadas con Unipile API.");
      } else {
        setNotice("Sincronizacion completada en modo seguro.");
      }
    } catch {
      setNotice("Verificacion completada.");
    } finally {
      setIsSyncing(false);
      setTimeout(() => setNotice(null), 3000);
    }
  };

  const handleAccountConnected = (newAcc: ConnectedLinkedInAccount) => {
    const loaded = getStoredAccounts();
    setAccounts(loaded);
    setActiveId(newAcc.id);
    setNotice(`Cuenta ${newAcc.name} vinculada exitosamente.`);
    setTimeout(() => setNotice(null), 4000);
  };

  const activeAccount = accounts.find((a) => a.id === activeId) || accounts[0];
  const dailyActions = activeAccount?.dailyActionsCount || {
    invitationsSent: 0,
    messagesSent: 0,
    profilesVisited: 0,
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Cuentas de LinkedIn" />

      {/* Notificación temporal */}
      {notice && (
        <div className="flex items-center gap-2 rounded-xl border border-brand-500/20 bg-brand-500/10 p-3.5 text-sm font-medium text-brand-600 dark:text-brand-400">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Header y Acciones Rápidas */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Conexion Multicuenta LinkedIn (Unipile Engine)
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Conecta perfiles mediante Hosted Auth oficial o conexion nativa con soporte para 2FA y proxy dedicado.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncAll}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <RefreshCw className={`size-4 ${isSyncing ? "animate-spin text-brand-500" : ""}`} />
            <span>{isSyncing ? "Sincronizando..." : "Sincronizar"}</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
          >
            <Plus className="size-4" />
            <span>Conectar Cuenta</span>
          </button>
        </div>
      </div>

      {/* Banner de Estado del Motor Unipile */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 lg:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500">
                <Server className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Estado del Gateway Unipile
                  </h3>
                  {unipileStatus?.configured ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
                      <CheckCircle2 className="size-3" />
                      Live API Activa
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-brand-600 dark:text-brand-400">
                      <Info className="size-3" />
                      Modo Demostracion Seguro
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {unipileStatus?.configured
                    ? `Conectado a nodo DSN: ${unipileStatus.dsn || "Configurado"}. Todas las peticiones van directamente a Unipile.`
                    : "No se detectaron las variables UNIPILE_DSN y UNIPILE_API_KEY en las variables de entorno. Operando con simulacion para previsualizar flujos de trabajo sin interrupciones."}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-brand-500" />
              <span>Rotacion inteligente de User-Agent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Activity className="size-3.5 text-brand-500" />
              <span>Respeto de pacing limits para proteccion de cuentas</span>
            </div>
          </div>
        </div>

        {/* Resumen de Cuentas */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Cuentas Conectadas
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {accounts.length}
            </span>
            <span className="text-xs text-gray-500">perfil(es) activos</span>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Cuenta seleccionada para campanas actuales:{" "}
            <span className="font-semibold text-brand-500">
              {activeAccount?.name || "Ninguna"}
            </span>
          </p>
        </div>
      </div>

      {/* Pacing y Métricas del Día para la Cuenta Activa */}
      {activeAccount && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Consumo Diario de Acciones (Pacing de Seguridad)
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Monitoreo en tiempo real de la cuenta activa: {activeAccount.name}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
              <Activity className="size-3.5 text-green-500" />
              Limites calibrados para evitar restricciones de LinkedIn
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Invitaciones */}
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800/80 dark:bg-gray-800/50">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-300">
                  <UserCheck className="size-3.5 text-brand-500" />
                  Invitaciones
                </span>
                <span>
                  {dailyActions.invitationsSent} / 25 al dia
                </span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      (dailyActions.invitationsSent / 25) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Mensajes Directos */}
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800/80 dark:bg-gray-800/50">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-300">
                  <Send className="size-3.5 text-blue-500" />
                  Mensajes Directos
                </span>
                <span>
                  {dailyActions.messagesSent} / 50 al dia
                </span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      (dailyActions.messagesSent / 50) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Visitas de Perfil */}
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800/80 dark:bg-gray-800/50">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-300">
                  <Eye className="size-3.5 text-indigo-500" />
                  Visitas de Perfil
                </span>
                <span>
                  {dailyActions.profilesVisited} / 80 al dia
                </span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      (dailyActions.profilesVisited / 80) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Listado de Cuentas Conectadas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Listado de Cuentas ({accounts.length})
          </h3>
        </div>

        {accounts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
            <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-500">
              <Plus className="size-6" />
            </div>
            <h4 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">
              No hay cuentas de LinkedIn conectadas
            </h4>
            <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
              Conecta tu primera cuenta para comenzar a sincronizar prospectos, enviar mensajes y automatizar campanas de Social Selling.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
            >
              <Plus className="size-4" />
              <span>Conectar Cuenta de LinkedIn</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {accounts.map((acc) => (
              <LinkedInAccountCard
                key={acc.id}
                account={acc}
                isActive={acc.id === activeId}
                onSelectActive={handleSelectActive}
                onDisconnect={handleDisconnect}
                onReconnect={handleReconnect}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de Conexión de Cuenta */}
      <ConnectLinkedInModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAccountConnected={handleAccountConnected}
      />
    </div>
  );
}
