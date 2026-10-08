"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useSignalRadar } from "@/lib/signals/store";
import type { Level3GlobalMonitor, SignalLeadItem } from "@/lib/signals/types";
import { useState } from "react";

export default function GlobalSignalsPage() {
  const { l3Monitors, leads, isLoaded, addLevel3Monitor, toggleLevel3Status } = useSignalRadar();

  const [isAddingRule, setIsAddingRule] = useState(false);
  const [selectedRuleForLeads, setSelectedRuleForLeads] = useState<Level3GlobalMonitor | null>(null);

  // Form states
  const [searchQuery, setSearchQuery] = useState("Prospeccion en frio B2B OR Falta de pipeline");
  const [icpTitlesInput, setIcpTitlesInput] = useState(
    "CEO, Founder, VP Sales, Head of Growth, Director Comercial"
  );
  const [locationsInput, setLocationsInput] = useState("España, Mexico, Colombia, Chile");
  const [minReactions, setMinReactions] = useState(30);

  const totalGlobalLeads = l3Monitors.reduce((acc, m) => acc + m.leadsIdentifiedCount, 0);

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const titles = icpTitlesInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const locs = locationsInput
      .split(",")
      .map((l) => l.trim())
      .filter(Boolean);

    const newMonitor: Level3GlobalMonitor = {
      id: `mon-l3-${Date.now()}`,
      searchQuery,
      icpTitles: titles.length > 0 ? titles : ["CEO", "Founder"],
      locations: locs.length > 0 ? locs : ["España"],
      minPostReactions: Number(minReactions) || 30,
      status: "active",
      leadsIdentifiedCount: 0,
      lastScanAt: "Recien configurado",
      createdAt: new Date().toISOString(),
    };

    addLevel3Monitor(newMonitor);
    setIsAddingRule(false);
  };

  const getRuleLeads = (monitorId: string): SignalLeadItem[] => {
    return leads.filter((l) => l.monitorId === monitorId);
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Signal Radar - Nivel 03: LinkedIn Global (Tendencias & Palabras Clave)" />

      {/* Métricas del Nivel 3 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Reglas de Tendencias Activas
          </span>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {l3Monitors.length} Monitores Globales
          </p>
          <span className="text-xs text-brand-600 font-semibold dark:text-brand-400">
            Escaneo de toda la red de LinkedIn
          </span>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Decisores ICP Pre-Calificados
          </span>
          <p className="mt-2 text-2xl font-bold text-brand-600 dark:text-brand-400">
            {totalGlobalLeads} Prospectos
          </p>
          <span className="text-xs text-blue-600 font-semibold dark:text-blue-400">
            Filtro de Cargo y Geografía Aplicado
          </span>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Estrategia de Acercamiento
          </span>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            Visita + Soft Connect
          </p>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Genera notificaciones de visita antes de conectar
          </span>
        </div>
      </div>

      {/* Explicación de la Estrategia */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl border border-blue-200 bg-blue-25/40 dark:border-blue-900 dark:bg-blue-950/20">
        <div>
          <h4 className="text-sm font-bold text-blue-900 dark:text-blue-200">
            Mecanica de Escaneo Global de LinkedIn (Nivel 3)
          </h4>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-1 max-w-2xl">
            Detecta debates virales y publicaciones con alta traccion en la red sobre tematicas donde tu solucion aporta valor. Filtra a los comentaristas segun tu ICP exacto (cargo y pais) para iniciar un acercamiento de baja friccion.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddingRule(!isAddingRule)}
          className="rounded-lg bg-brand-500 px-4 py-2.5 text-xs font-semibold text-white hover:bg-brand-600 transition"
        >
          {isAddingRule ? "Cerrar Configurador" : "+ Nueva Regla Global"}
        </button>
      </div>

      {/* Formulario para Agregar Regla Global */}
      {isAddingRule && (
        <ComponentCard
          title="Configurador de Regla Global en LinkedIn"
          desc="Especifica terminos de busqueda, cargos ICP y geografias para monitorear posts relevantes en toda la red."
        >
          <form onSubmit={handleAddRule} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                  Terminos de Busqueda (Keywords con operadores booleanos)
                </label>
                <input
                  type="text"
                  required
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ej. Prospeccion B2B OR Social Selling"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-800 focus:border-brand-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                  Umbral Minimo de Reacciones en el Post
                </label>
                <input
                  type="number"
                  min="10"
                  max="1000"
                  value={minReactions}
                  onChange={(e) => setMinReactions(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-800 focus:border-brand-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                  Cargos Objetivo ICP (Separados por coma)
                </label>
                <input
                  type="text"
                  value={icpTitlesInput}
                  onChange={(e) => setIcpTitlesInput(e.target.value)}
                  placeholder="CEO, Founder, VP Sales..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-800 focus:border-brand-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                  Paises y Ubicaciones (Separados por coma)
                </label>
                <input
                  type="text"
                  value={locationsInput}
                  onChange={(e) => setLocationsInput(e.target.value)}
                  placeholder="España, Mexico, Colombia, Chile..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-800 focus:border-brand-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingRule(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-lg bg-brand-500 px-5 py-2 text-xs font-semibold text-white hover:bg-brand-600 transition"
              >
                Guardar Regla Global
              </button>
            </div>
          </form>
        </ComponentCard>
      )}

      {/* Tabla de Reglas Globales Activas */}
      <ComponentCard title={`Monitores Globales Activos (${l3Monitors.length})`}>
        {!isLoaded ? (
          <p className="text-xs text-gray-400 py-4">Cargando reglas...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 text-xs font-semibold uppercase text-gray-400 dark:border-gray-800">
                <tr>
                  <th className="pb-3">Terminos de Busqueda</th>
                  <th className="pb-3">Cargos ICP Filtrados</th>
                  <th className="pb-3">Geografia</th>
                  <th className="pb-3">Leads Extraidos</th>
                  <th className="pb-3">Ultimo Escaneo</th>
                  <th className="pb-3">Estado</th>
                  <th className="pb-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs dark:divide-gray-800">
                {l3Monitors.map((rule) => (
                  <tr key={rule.id} className="hover:bg-gray-50/50 dark:hover:bg-white/2 transition">
                    <td className="py-4">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {rule.searchQuery}
                      </p>
                      <span className="text-[10px] text-gray-400">
                        Umbral: Min {rule.minPostReactions} reacciones
                      </span>
                    </td>

                    <td className="py-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {rule.icpTitles.map((t, i) => (
                          <span
                            key={i}
                            className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 text-gray-600 dark:text-gray-400 text-xs">
                      {rule.locations.join(", ")}
                    </td>

                    <td className="py-4 font-bold text-brand-600 dark:text-brand-400">
                      {rule.leadsIdentifiedCount} leads
                    </td>

                    <td className="py-4 text-gray-500 dark:text-gray-400">
                      {rule.lastScanAt}
                    </td>

                    <td className="py-4">
                      <button
                        type="button"
                        onClick={() => toggleLevel3Status(rule.id)}
                        className={`rounded-full px-2.5 py-0.5 font-semibold text-[11px] transition ${
                          rule.status === "active"
                            ? "bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-950/40 dark:text-green-400"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {rule.status === "active" ? "Activo" : "Pausado"}
                      </button>
                    </td>

                    <td className="py-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => setSelectedRuleForLeads(rule)}
                        className="rounded-md border border-brand-500 px-2.5 py-1 text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-950/20 font-medium"
                      >
                        Ver Leads ({getRuleLeads(rule.id).length})
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ComponentCard>

      {/* Modal para Visualizar Leads Extraídos Globalmente */}
      {selectedRuleForLeads && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-theme-xl dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <div className="flex items-start justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
              <div>
                <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  LinkedIn Global: {selectedRuleForLeads.searchQuery}
                </span>
                <h3 className="mt-2 text-base font-bold text-gray-900 dark:text-white">
                  Prospectos ICP Extraidos de Debates Globales
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Decisores que participaron en publicaciones populares sobre esta problematica.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRuleForLeads(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 font-bold"
              >
                Cerrar
              </button>
            </div>

            <div className="my-4 divide-y divide-gray-100 dark:divide-gray-800">
              {getRuleLeads(selectedRuleForLeads.id).length === 0 ? (
                <p className="text-xs text-gray-500 py-6 text-center">
                  Aun no hay prospectos extraidos para esta regla global.
                </p>
              ) : (
                getRuleLeads(selectedRuleForLeads.id).map((lead) => (
                  <div key={lead.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                          {lead.fullName}
                        </h4>
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                          Grado {lead.connectionDegree}
                        </span>
                        <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                          Intencion Media (Debate Activo)
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        {lead.headline} • {lead.location}
                      </p>
                      <p className="text-xs text-blue-800 italic dark:text-blue-300 font-medium">
                        {lead.signalSnippet}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href="/campaigns"
                        className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600 transition"
                      >
                        Enviar a Secuencia
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setSelectedRuleForLeads(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
