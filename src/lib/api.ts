/**
 * Frontend API client for calling Vectrix serverless endpoints.
 */

import { supabase } from "./supabase";

async function getAuthHeaders(): Promise<Record<string, string>> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) return {};
  return { Authorization: `Bearer ${session.access_token}` };
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = {
    "Content-Type": "application/json",
    ...(await getAuthHeaders()),
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(`/api${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((body as Record<string, string>).error ?? "Request failed");
  }

  return res.json();
}

// ── Projects ──────────────────────────────────────────────

export interface Project {
  id: string;
  name: string;
  repo_url: string | null;
  ecosystem: string;
  created_at: string;
}

export function listProjects() {
  return apiFetch<{ projects: Project[] }>("/projects");
}

export function createProject(body: {
  name: string;
  repo_url?: string;
  ecosystem?: string;
}) {
  return apiFetch<{ project: Project }>("/projects", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// ── Scans ─────────────────────────────────────────────────

export interface ScanSummary {
  id: string;
  project_id: string;
  status: string;
  branch: string;
  total_deps: number;
  critical_count: number;
  warning_count: number;
  info_count: number;
  clean_count: number;
  started_at: string;
  completed_at: string | null;
  projects: { name: string; repo_url: string | null };
}

export interface Finding {
  id: string;
  severity: "critical" | "warning" | "info";
  package_name: string;
  package_version: string;
  ecosystem: string;
  title: string;
  description: string;
  recommendation: string;
  cve: string | null;
  source: string;
}

export function listScans() {
  return apiFetch<{ scans: ScanSummary[] }>("/scans");
}

export function getScan(id: string) {
  return apiFetch<{ scan: ScanSummary; findings: Finding[] }>(
    `/scans?id=${id}`
  );
}

// ── Trigger scan ──────────────────────────────────────────

export interface ScanResult {
  scan_id: string;
  status: string;
  total_deps: number;
  critical: number;
  warnings: number;
  info: number;
  clean: number;
  findings: Finding[];
}

export function triggerScan(body: {
  project_id: string;
  filename: string;
  content: string;
  branch?: string;
}) {
  return apiFetch<ScanResult>("/scan", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
