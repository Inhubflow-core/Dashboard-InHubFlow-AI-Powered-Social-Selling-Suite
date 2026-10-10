"use client";

import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { getStoredViralTemplates, setSelectedTemplateForModeling } from "@/lib/viral-posts/store";
import type { PostFormat, ViralPostTemplate } from "@/lib/viral-posts/types";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function ViralRadarPage() {
  const router = useRouter();
  const templates = useMemo(() => getStoredViralTemplates(), []);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFormat, setSelectedFormat] = useState<"all" | PostFormat>("all");
  const [selectedPostForModal, setSelectedPostForModal] = useState<ViralPostTemplate | null>(null);

  const filteredPosts = useMemo(() => {
    return templates.filter((post) => {
      const matchesSearch =
        post.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.hook.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.fullContent.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFormat = selectedFormat === "all" || post.format === selectedFormat;

      return matchesSearch && matchesFormat;
    });
  }, [templates, searchTerm, selectedFormat]);

  const handleModelWithAi = (post: ViralPostTemplate) => {
    setSelectedTemplateForModeling(post);
    router.push("/viral-posts/create");
  };

  const getFormatLabel = (fmt: PostFormat) => {
    switch (fmt) {
      case "text":
        return "Solo Texto";
      case "image":
        return "Texto + Imagen";
      case "carousel":
        return "Carrusel PDF";
    }
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Radar Viral (Top Posts de LinkedIn)" />

      <ComponentCard
        title="Buscador Inteligente de Tendencias"
        desc="Descubre las 12 publicaciones con mayor traccion en LinkedIn para modelar ganchos, estructuras y llamados a la accion probados."
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por tema, palabra clave, gancho o autor (ej. Social Selling, Lead Magnet, IA)..."
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="rounded-lg border border-gray-300 px-3 py-2.5 text-xs text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
              >
                Limpiar
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-100 dark:border-gray-800">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mr-2">
              Filtrar por Formato:
            </span>
            {[
              { id: "all", label: "Todos (12)" },
              { id: "text", label: "Solo Texto" },
              { id: "image", label: "Texto + Imagen" },
              { id: "carousel", label: "Carrusel PDF" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedFormat(f.id as "all" | PostFormat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  selectedFormat === f.id
                    ? "bg-brand-500 text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </ComponentCard>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
            Top Publicaciones Virales ({filteredPosts.length} disponibles)
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Indexadas y ordenadas por Ratio de Interaccion
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs hover:border-brand-500/60 transition dark:border-gray-800 dark:bg-gray-900/60"
            >
              <div>
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="pr-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {post.author}
                    </h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">
                      {post.authorHeadline}
                    </p>
                    <span className="text-[10px] text-gray-400 block mt-0.5">
                      {post.publishedDate} • {post.topic}
                    </span>
                  </div>
                  <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-600 dark:bg-brand-950 dark:text-brand-300 shrink-0">
                    {getFormatLabel(post.format)}
                  </span>
                </div>

                <div className="mb-4 rounded-xl bg-gray-50 p-3 text-xs text-gray-700 dark:bg-white/3 dark:text-gray-300">
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">
                    Gancho Principal (Hook):
                  </p>
                  <p className="italic leading-relaxed">{post.hook}</p>
                </div>

                <div className="mb-5 grid grid-cols-3 gap-2 border-y border-gray-100 py-2.5 text-center dark:border-gray-800">
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase">Likes</span>
                    <span className="text-xs font-bold text-gray-800 dark:text-white">
                      {post.likes.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase">Comentarios</span>
                    <span className="text-xs font-bold text-gray-800 dark:text-white">
                      {post.comments.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase">Ratio</span>
                    <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                      {post.engagementRatio}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setSelectedPostForModal(post)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
                >
                  Lectura Completa
                </button>
                <button
                  type="button"
                  onClick={() => handleModelWithAi(post)}
                  className="flex-1 rounded-lg bg-brand-500 py-2 text-center text-xs font-semibold text-white hover:bg-brand-600 transition"
                >
                  Modelar con IA
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Lectura Completa */}
      {selectedPostForModal && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-theme-xl dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <div className="flex items-start justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
              <div>
                <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-600 dark:bg-brand-950 dark:text-brand-300">
                  {getFormatLabel(selectedPostForModal.format)}
                </span>
                <h3 className="mt-2 text-lg font-bold text-gray-900 dark:text-white">
                  {selectedPostForModal.author}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedPostForModal.authorHeadline} • {selectedPostForModal.publishedDate}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPostForModal(null)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-bold"
              >
                Cerrar
              </button>
            </div>

            <div className="my-5 space-y-4">
              <div className="rounded-xl bg-gray-50 p-4 text-xs font-mono text-gray-800 leading-relaxed whitespace-pre-wrap dark:bg-gray-800/50 dark:text-gray-200">
                {selectedPostForModal.fullContent}
              </div>

              {selectedPostForModal.format === "carousel" && selectedPostForModal.carouselSlides && (
                <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2">
                    Estructura de Diapositivas ({selectedPostForModal.carouselSlides.length} slides):
                  </h4>
                  <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                    {selectedPostForModal.carouselSlides.map((s) => (
                      <div key={s.slideNumber} className="flex gap-2">
                        <span className="font-semibold text-gray-900 dark:text-white shrink-0">
                          Slide {s.slideNumber}:
                        </span>
                        <span>{s.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedPostForModal.format === "image" && selectedPostForModal.imagePrompt && (
                <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
                    Prompt Visual para IA:
                  </h4>
                  <p className="text-xs font-mono text-gray-700 dark:text-gray-300">
                    {selectedPostForModal.imagePrompt}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setSelectedPostForModal(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
              >
                Regresar
              </button>
              <button
                type="button"
                onClick={() => {
                  handleModelWithAi(selectedPostForModal);
                }}
                className="rounded-lg bg-brand-500 px-5 py-2 text-xs font-semibold text-white hover:bg-brand-600 transition"
              >
                Modelar esta Publicacion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
