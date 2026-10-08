"use client";

import { defaultCampaignEdges, defaultCampaignNodes } from "./templates";
import type { CampaignWorkflow } from "./types";

const WORKFLOW_KEY = "inhubflow_active_campaign";

export const initialWorkflow: CampaignWorkflow = {
  id: "wf-01",
  name: "Secuencia Lead Magnet ManyChat (Nivel 1 - SISTEMA)",
  description: "Captura de leads por comentarios en post propio, entrega de PDF y follow-up multietapa.",
  status: "active",
  dailyInvitationLimit: 25,
  dailyDmLimit: 40,
  jitterMinMinutes: 3,
  jitterMaxMinutes: 12,
  stopOnReply: true,
  nodesJson: JSON.stringify(defaultCampaignNodes),
  edgesJson: JSON.stringify(defaultCampaignEdges),
  createdAt: "2026-10-06T10:00:00.000Z",
  updatedAt: "2026-10-07T12:00:00.000Z",
};

export function getStoredWorkflow(): CampaignWorkflow {
  if (typeof window === "undefined") return initialWorkflow;
  try {
    const raw = localStorage.getItem(WORKFLOW_KEY);
    if (!raw) {
      localStorage.setItem(WORKFLOW_KEY, JSON.stringify(initialWorkflow));
      return initialWorkflow;
    }
    return JSON.parse(raw);
  } catch {
    return initialWorkflow;
  }
}

export function saveStoredWorkflow(wf: CampaignWorkflow): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(WORKFLOW_KEY, JSON.stringify(wf));
}
