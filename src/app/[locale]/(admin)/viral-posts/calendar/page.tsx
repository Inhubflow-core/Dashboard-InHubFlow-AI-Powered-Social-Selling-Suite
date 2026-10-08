"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useCreatedPosts } from "@/lib/viral-posts/store";
import type { CreatedPost } from "@/lib/viral-posts/types";
import { useMemo, useState } from "react";

const daysOfWeek = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];

export default function EditorialCalendarPage() {
  const { posts, updatePost } = useCreatedPosts();
  const [viewMode, setViewMode] = useState<"month" | "week">("week");
  const [draggedPostId, setDraggedPostId] = useState<string | null>(null);

  // Días de la semana actual simulada (Octubre 2026)
  const currentWeekDays = useMemo(() => {
    return [
      { dayNumber: 12, name: "Lunes", dateKey: "2026-10-12", isPeak: false },
      { dayNumber: 13, name: "Martes", dateKey: "2026-10-13", isPeak: true, peakTime: "08:30 - 10:30" },
      { dayNumber: 14, name: "Miercoles", dateKey: "2026-10-14", isPeak: true, peakTime: "08:30 - 10:30" },
      { dayNumber: 15, name: "Jueves", dateKey: "2026-10-15", isPeak: true, peakTime: "08:30 - 10:30" },
      { dayNumber: 16, name: "Viernes", dateKey: "2026-10-16", isPeak: false },
      { dayNumber: 17, name: "Sabado", dateKey: "2026-10-17", isPeak: false },
      { dayNumber: 18, name: "Domingo", dateKey: "2026-10-18", isPeak: false },
    ];
  }, []);

  const scheduledPosts = useMemo(() => {
    return posts.filter((p) => p.status === "scheduled" || p.status === "published");
  }, [posts]);

  const handleDragStart = (postId: string) => {
    setDraggedPostId(postId);
  };

  const handleDropOnDay = (dateKey: string) => {
    if (!draggedPostId) return;
    const newScheduledDate = `${dateKey}T09:30:00.000Z`;
    updatePost(draggedPostId, {
      scheduledAt: newScheduledDate,
      status: "scheduled",
    });
    setDraggedPostId(null);
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Calendario Editorial Drag & Drop" />

      <ComponentCard
        title="Planificacion Editorial & Horarios Optimos"
        desc="Arrastra cualquier publicacion entre dias de la semana para ajustar su horario de emision automatica."
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-brand-500"></span>
                <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                  Franja Optima B2B (Mar - Jue 08:30 a 10:30 AM)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-green-500"></span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Publicado</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewMode("week")}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  viewMode === "week"
                    ? "bg-brand-500 text-white"
                    : "border border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-300"
                }`}
              >
                Semana
              </button>
              <button
                type="button"
                onClick={() => setViewMode("month")}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  viewMode === "month"
                    ? "bg-brand-500 text-white"
                    : "border border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-300"
                }`}
              >
                Mes
              </button>
              <a
                href="/viral-posts/create"
                className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-white dark:text-gray-900"
              >
                + Programar Post
              </a>
            </div>
          </div>

          {/* Cuadrícula de la Semana con Drag & Drop */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {currentWeekDays.map((day) => {
              // Posts asignados a este día
              const dayPosts = scheduledPosts.filter((p) => {
                if (!p.scheduledAt) return false;
                return p.scheduledAt.startsWith(day.dateKey);
              });

              return (
                <div
                  key={day.dateKey}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDropOnDay(day.dateKey)}
                  className={`flex flex-col min-h-[360px] rounded-2xl border p-3 transition ${
                    day.isPeak
                      ? "border-brand-300 bg-brand-25/40 dark:border-brand-900 dark:bg-brand-950/20"
                      : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                    <div>
                      <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase">
                        {day.name}
                      </p>
                      <h4 className="text-base font-bold text-gray-900 dark:text-white">
                        {day.dayNumber} Oct
                      </h4>
                    </div>
                    {day.isPeak && (
                      <span className="rounded bg-brand-500 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                        Pico B2B
                      </span>
                    )}
                  </div>

                  {day.isPeak && (
                    <div className="my-2 rounded-lg bg-white/80 p-1.5 text-center text-[10px] text-brand-700 font-semibold border border-brand-100 dark:bg-gray-800 dark:text-brand-300 dark:border-brand-900">
                      Horario: {day.peakTime}
                    </div>
                  )}

                  <div className="flex-1 space-y-2.5 pt-2">
                    {dayPosts.map((post: CreatedPost) => (
                      <div
                        key={post.id}
                        draggable
                        onDragStart={() => handleDragStart(post.id)}
                        className="cursor-grab active:cursor-grabbing rounded-xl border border-gray-200 bg-white p-3 shadow-theme-xs hover:border-brand-500 dark:border-gray-700 dark:bg-gray-800"
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                              post.format === "carousel"
                                ? "bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300"
                                : post.format === "image"
                                ? "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                                : "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                            }`}
                          >
                            {post.format}
                          </span>
                          <span
                            className={`h-2 w-2 rounded-full ${
                              post.status === "published" ? "bg-green-500" : "bg-brand-500"
                            }`}
                          ></span>
                        </div>

                        <p className="text-xs font-semibold text-gray-800 dark:text-white line-clamp-2">
                          {post.title}
                        </p>

                        <div className="mt-2 flex items-center justify-between text-[10px] text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-1.5">
                          <span>
                            {post.scheduledAt
                              ? new Date(post.scheduledAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "09:30 AM"}
                          </span>
                          {post.leadMagnetKeyword && (
                            <span className="font-mono text-brand-600 dark:text-brand-400 font-semibold">
                              {post.leadMagnetKeyword}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                    {dayPosts.length === 0 && (
                      <div className="h-full min-h-[140px] flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-3 text-center text-[11px] text-gray-400 dark:border-gray-800">
                        <span>Arrastra un post aqui</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}
