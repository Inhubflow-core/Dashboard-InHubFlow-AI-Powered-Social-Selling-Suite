"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useSignalRadar } from "@/lib/signals/store";
import type { Level1Monitor, SignalLeadItem } from "@/lib/signals/types";
import { useState } from "react";

export default function MyPostsSignalRadarPage() {
  const { l1Monitors, leads, isLoaded, addLevel1Monitor, toggleLevel1Status } = useSignalRadar();

  const [isCreatingMonitor, setIsCreatingMonitor] = useState(false);
  const [selectedMonitorForLeads, setSelectedMonitorForLeads] = useState<Level1Monitor | null>(null);

  // Form states
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostUrl, setNewPostUrl] = useState("");
  const [newKeyword, setNewKeyword] = useState("SISTEMA");
  const [newAutoLike, setNewAutoLike] = useState(true);
  const [newPublicReply, setNewPublicReply] = useState(
    "Te lo acabo de enviar por privado, revisa tus mensajes"
  );
  const [newConnectionNote, setNewConnectionNote] = useState(
    "Hola {{first_name}}, vi que comentaste en mi post. Te envio la invitacion para entregarte el recurso por privado."
  );
  const [newAttachedPdf, setNewAttachedPdf] = useState("Guia_Oficial_Social_Selling.pdf");

  // Métricas agregadas
  const totalComments = l1Monitors.reduce((acc, m) => acc + m.scannedCommentsCount, 0);
  const totalLeadsCaptured = l1Monitors.reduce((acc, m) => acc + m.leadsCapturedCount, 0);
  const activeMonitorsCount = l1Monitors.filter((m) => m.status === "active").length;

  const handleCreateMonitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim()) return;

    const newMonitor: Level1Monitor = {
      id: `mon-l1-${Date.now()}`,
      postTitle: newPostTitle,
      postUrl: newPostUrl || "https://www.linkedin.com/feed/update/urn:li:activity:custom",
      keyword: newKeyword.toUpperCase(),
      status: "active",
      autoLikeComment: newAutoLike,
      publicReplyTemplate: newPublicReply,
      nonConnectedNoteTemplate: newConnectionNote,
      attachedPdfName: newAttachedPdf,
      scannedCommentsCount: 0,
      leadsCapturedCount: 0,
      lastScanAt: "Recien creado",
      createdAt: new Date().toISOString(),
    };

    addLevel1Monitor(newMonitor);
    setIsCreatingMonitor(false);
    setNewPostTitle("");
    setNewPostUrl("");
  };

  const getMonitorLeads = (monitorId: string): SignalLeadItem[] => {
    return leads.filter((l) => l.monitorId === monitorId);
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Signal Radar - Nivel 01: Mis Posts (Lead Magnet / ManyChat)" />

      {/* Métricas del Nivel 1 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Monitores Nivel 1 Activos
          </span>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {activeMonitorsCount} Publicaciones
          </p>
          <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
            Escaneando comentarios cada 5 min
          </span>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Comentarios Analizados
          </span>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {totalComments} Comentarios
          </p>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Filtrados por palabra clave activadora
          </span>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Leads Captados & DMs Enviados
          </span>
          <p className="mt-2 text-2xl font-bold text-brand-600 dark:text-brand-400">
            {totalLeadsCaptured} Prospectos
          </p>
          <span className="text-xs font-semibold text-green-600 dark:text-green-400">
            Intención Muy Alta (Lead Magnet)
          </span>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Tasa de Conversion de Post
          </span>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {totalComments > 0 ? ((totalLeadsCaptured / totalComments) * 100).toFixed(1) : 0}%
          </p>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            De comentario a conversacion directa
          </span>
        </div>
      </div>

      {/* Botón de Creación y Explicación del Mecanismo */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl border border-brand-200 bg-brand-25/40 dark:border-brand-900 dark:bg-brand-950/20">
        <div>
          <h4 className="text-sm font-bold text-brand-900 dark:text-brand-200">
            Mecanica de Automatizacion ManyChat en LinkedIn (Nivel 1)
          </h4>
          <p className="text-xs text-brand-700 dark:text-brand-300 mt-1 max-w-2xl">
            Al detectar la palabra clave en tu post: (1) Da Like al comentario, (2) Responde un mensaje publico de confirmacion, y (3) Valida conexion para enviar el PDF adjunto de forma instantanea por mensaje privado.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreatingMonitor(!isCreatingMonitor)}
          className="rounded-lg bg-brand-500 px-4 py-2.5 text-xs font-semibold text-white hover:bg-brand-600 transition"
        >
          {isCreatingMonitor ? "Cerrar Configurador" : "+ Conectar Nuevo Post"}
        </button>
      </div>

      {/* Formulario de Creación de Monitor */}
      {isCreatingMonitor && (
        <ComponentCard
          title="Configurador de Monitor Nivel 1"
          desc="Ingresa los datos de tu publicacion de LinkedIn para activar la escucha de comentarios y auto-respuesta."
        >
          <form onSubmit={handleCreateMonitor} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                  Titulo Descriptivo del Post
                </label>
                <input
                  type="text"
                  required
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="Ej. Carrusel sobre Prospeccion B2B con IA..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-800 focus:border-brand-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                  URL o URN del Post en LinkedIn
                </label>
                <input
                  type="url"
                  value={newPostUrl}
                  onChange={(e) => setNewPostUrl(e.target.value)}
                  placeholder="https://www.linkedin.com/feed/update/urn:li:activity:..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-800 focus:border-brand-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                  Palabra Clave Activadora
                </label>
                <input
                  type="text"
                  required
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value.toUpperCase())}
                  placeholder="SISTEMA, GUIA, PLANTILLA..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-mono font-bold text-brand-600 focus:border-brand-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-brand-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                  Recurso Adjunto (PDF Lead Magnet)
                </label>
                <input
                  type="text"
                  value={newAttachedPdf}
                  onChange={(e) => setNewAttachedPdf(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-800 focus:border-brand-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={newAutoLike}
                    onChange={(e) => setNewAutoLike(e.target.checked)}
                    className="rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                  />
                  <span>Dar Like automatico al comentario del lead</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                  Paso A: Respuesta Publica en el Post
                </label>
                <input
                  type="text"
                  value={newPublicReply}
                  onChange={(e) => setNewPublicReply(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-800 focus:border-brand-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                  Paso B: Nota de Invitacion si no estan conectados
                </label>
                <input
                  type="text"
                  value={newConnectionNote}
                  onChange={(e) => setNewConnectionNote(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-800 focus:border-brand-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingMonitor(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-lg bg-brand-500 px-5 py-2 text-xs font-semibold text-white hover:bg-brand-600 transition"
              >
                Activar Monitor en LinkedIn
              </button>
            </div>
          </form>
        </ComponentCard>
      )}

      {/* Listado de Monitores Activos */}
      <ComponentCard title={`Monitores de Publicaciones Propias (${l1Monitors.length})`}>
        {!isLoaded ? (
          <p className="text-xs text-gray-400 py-4">Cargando monitores...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 text-xs font-semibold uppercase text-gray-400 dark:border-gray-800">
                <tr>
                  <th className="pb-3">Publicacion / Lead Magnet</th>
                  <th className="pb-3">Palabra Clave</th>
                  <th className="pb-3">Comentarios</th>
                  <th className="pb-3">Leads Captados</th>
                  <th className="pb-3">Ultima Deteccion</th>
                  <th className="pb-3">Estado</th>
                  <th className="pb-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs dark:divide-gray-800">
                {l1Monitors.map((mon) => (
                  <tr key={mon.id} className="hover:bg-gray-50/50 dark:hover:bg-white/2 transition">
                    <td className="py-4 max-w-xs">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">
                        {mon.postTitle}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate">
                        Adjunto: {mon.attachedPdfName}
                      </p>
                    </td>

                    <td className="py-4">
                      <span className="rounded bg-brand-50 px-2.5 py-1 font-mono font-bold text-xs text-brand-600 dark:bg-brand-950 dark:text-brand-300">
                        {mon.keyword}
                      </span>
                    </td>

                    <td className="py-4 text-gray-700 dark:text-gray-300 font-medium">
                      {mon.scannedCommentsCount}
                    </td>

                    <td className="py-4 font-bold text-brand-600 dark:text-brand-400">
                      {mon.leadsCapturedCount} leads
                    </td>

                    <td className="py-4 text-gray-500 dark:text-gray-400">
                      {mon.lastScanAt}
                    </td>

                    <td className="py-4">
                      <button
                        type="button"
                        onClick={() => toggleLevel1Status(mon.id)}
                        className={`rounded-full px-2.5 py-0.5 font-semibold text-[11px] transition ${
                          mon.status === "active"
                            ? "bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-950/40 dark:text-green-400"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {mon.status === "active" ? "Activo (Escuchando)" : "Pausado"}
                      </button>
                    </td>

                    <td className="py-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => setSelectedMonitorForLeads(mon)}
                        className="rounded-md border border-brand-500 px-2.5 py-1 text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-950/20 font-medium"
                      >
                        Ver Leads ({getMonitorLeads(mon.id).length})
                      </button>
                      <a
                        href="/campaigns"
                        className="rounded-md border border-gray-200 px-2.5 py-1 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
                      >
                        Ver Secuencia
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ComponentCard>

      {/* Modal para Visualizar Leads Captados por un Monitor Específico */}
      {selectedMonitorForLeads && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-theme-xl dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <div className="flex items-start justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
              <div>
                <span className="rounded bg-brand-50 px-2 py-0.5 text-xs font-mono font-bold text-brand-600 dark:bg-brand-950 dark:text-brand-300">
                  Palabra: {selectedMonitorForLeads.keyword}
                </span>
                <h3 className="mt-2 text-base font-bold text-gray-900 dark:text-white">
                  Leads Captados: {selectedMonitorForLeads.postTitle}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Prospectos que comentaron la palabra clave y activaron la secuencia automatica.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMonitorForLeads(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 font-bold"
              >
                Cerrar
              </button>
            </div>

            <div className="my-4 divide-y divide-gray-100 dark:divide-gray-800">
              {getMonitorLeads(selectedMonitorForLeads.id).length === 0 ? (
                <p className="text-xs text-gray-500 py-6 text-center">
                  Aun no hay interacciones registradas en este monitor.
                </p>
              ) : (
                getMonitorLeads(selectedMonitorForLeads.id).map((lead) => (
                  <div key={lead.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                          {lead.fullName}
                        </h4>
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                          Grado {lead.connectionDegree}
                        </span>
                        <span className="rounded bg-green-50 px-1.5 py-0.5 text-[10px] font-bold text-green-700 dark:bg-green-950 dark:text-green-400">
                          Intencion Muy Alta
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        {lead.headline} • {lead.location}
                      </p>
                      <p className="text-xs text-brand-700 italic dark:text-brand-300 font-medium">
                        {lead.signalSnippet}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        {lead.status === "dm_sent"
                          ? "DM Entregado con PDF"
                          : lead.status === "connected"
                          ? "Conectado"
                          : "Invitacion Enviada"}
                      </span>
                      <a
                        href="/inbox"
                        className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600 transition"
                      >
                        Abrir Chat
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setSelectedMonitorForLeads(null)}
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
