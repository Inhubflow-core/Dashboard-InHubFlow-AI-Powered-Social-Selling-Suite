"use client";

import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import {
  FileCode,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  Layers,
  Webhook,
  Code2,
} from "lucide-react";

export default function ApiDocsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const curlExample = `curl -X GET "https://api.inhubflow.com/v1/leads?status=qualified" \\
  -H "Authorization: Bearer ihf_live_sk_YOUR_SECRET_KEY" \\
  -H "Content-Type: application/json"`;

  const webhookPayload = `{
  "event": "lead.signal_detected",
  "workspace_id": "ws_valenzuela_growth",
  "account_id": "acc-elena-main",
  "lead": {
    "name": "Carlos Arriaga",
    "title": "Head of Commercial Sales",
    "company": "LatamTech Solutions",
    "signal_level": 1,
    "source_post_id": "urn:li:activity:7123456789",
    "keyword": "SISTEMA"
  },
  "created_at": "2026-10-09T12:00:00Z"
}`;

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Documentación Técnica & APIs" />

      {/* Introducción */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4 dark:border-gray-800">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#0099ff]/10 text-[#0099ff]">
            <Code2 className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              InHubFlow Developer API v1
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Conecta de forma programática tus bases de leads, automatizaciones en n8n/Make y eventos en tiempo real.
            </p>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-600 dark:text-gray-300">
          <p>
            Todas las peticiones a la API requieren autenticación mediante <strong className="text-gray-900 dark:text-white">Bearer Token</strong> en la cabecera HTTP utilizando la clave de API generada en tu panel de <span className="text-[#0099ff]">Configuración &gt; API Keys & Seguridad</span>.
          </p>
        </div>
      </div>

      {/* Endpoint: Obtener Leads */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 font-mono text-xs font-bold text-emerald-600">
              GET
            </span>
            <span className="font-mono text-xs font-semibold text-gray-900 dark:text-white">
              /api/v1/leads
            </span>
          </div>
          <span className="text-xs text-gray-400">Listado de prospectos del CRM</span>
        </div>

        <div className="mt-3 relative rounded-xl bg-gray-950 p-4 font-mono text-xs text-gray-200">
          <pre className="overflow-x-auto">{curlExample}</pre>
          <button
            onClick={() => handleCopy(curlExample, "curl")}
            className="absolute top-3 right-3 rounded-lg bg-gray-800 p-1.5 text-gray-400 hover:text-white"
          >
            {copiedCode === "curl" ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
          </button>
        </div>
      </div>

      {/* Webhook Payload Example */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3 dark:border-gray-800">
          <Webhook className="size-4 text-[#0099ff]" />
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">
            Estructura de Evento de Webhook Saliente (`lead.signal_detected`)
          </h4>
        </div>

        <p className="mt-2 text-xs text-gray-500">
          Cuerpo JSON enviado a tu URL de webhook configurada cuando el Signal Radar capta una interacción:
        </p>

        <div className="mt-3 relative rounded-xl bg-gray-950 p-4 font-mono text-xs text-emerald-400">
          <pre className="overflow-x-auto">{webhookPayload}</pre>
          <button
            onClick={() => handleCopy(webhookPayload, "webhook")}
            className="absolute top-3 right-3 rounded-lg bg-gray-800 p-1.5 text-gray-400 hover:text-white"
          >
            {copiedCode === "webhook" ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
