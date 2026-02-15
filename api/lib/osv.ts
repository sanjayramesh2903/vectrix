/**
 * OSV (Open Source Vulnerabilities) database client.
 * Uses the free OSV.dev API maintained by Google.
 * https://osv.dev/docs/
 */

import type { ParsedDependency } from "./parsers.js";

const OSV_API = "https://api.osv.dev/v1";

interface OsvVulnerability {
  id: string;
  summary: string;
  details: string;
  aliases: string[];
  severity: Array<{
    type: string;
    score: string;
  }>;
  affected: Array<{
    package: {
      ecosystem: string;
      name: string;
    };
    ranges: Array<{
      type: string;
      events: Array<{ introduced?: string; fixed?: string }>;
    }>;
  }>;
  references: Array<{ type: string; url: string }>;
}

interface OsvQueryResponse {
  vulns?: OsvVulnerability[];
}

export interface VulnFinding {
  id: string;
  severity: "critical" | "warning" | "info";
  packageName: string;
  packageVersion: string;
  ecosystem: string;
  title: string;
  description: string;
  recommendation: string;
  cve: string | null;
  source: "osv";
}

const ECOSYSTEM_MAP: Record<string, string> = {
  npm: "npm",
  pypi: "PyPI",
  go: "Go",
  "crates.io": "crates.io",
};

function classifySeverity(vuln: OsvVulnerability): "critical" | "warning" | "info" {
  // Check CVSS score if available
  for (const sev of vuln.severity ?? []) {
    const score = parseFloat(sev.score);
    if (!isNaN(score)) {
      if (score >= 9.0) return "critical";
      if (score >= 7.0) return "warning";
      return "info";
    }
  }

  // Fallback: check aliases for known critical patterns
  const summary = (vuln.summary ?? "").toLowerCase();
  if (
    summary.includes("remote code execution") ||
    summary.includes("arbitrary code") ||
    summary.includes("malicious")
  ) {
    return "critical";
  }

  return "warning";
}

function extractCve(vuln: OsvVulnerability): string | null {
  for (const alias of vuln.aliases ?? []) {
    if (alias.startsWith("CVE-")) return alias;
  }
  return null;
}

function buildRecommendation(vuln: OsvVulnerability): string {
  // Try to find a fixed version
  for (const affected of vuln.affected ?? []) {
    for (const range of affected.ranges ?? []) {
      for (const event of range.events ?? []) {
        if (event.fixed) {
          return `Upgrade to version ${event.fixed} or later.`;
        }
      }
    }
  }
  return "No fixed version available. Consider finding an alternative package.";
}

/**
 * Query OSV for vulnerabilities affecting a single package.
 */
async function queryPackage(
  name: string,
  version: string,
  ecosystem: string
): Promise<OsvVulnerability[]> {
  const osvEcosystem = ECOSYSTEM_MAP[ecosystem] ?? ecosystem;

  const res = await fetch(`${OSV_API}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      version,
      package: { name, ecosystem: osvEcosystem },
    }),
  });

  if (!res.ok) return [];

  const data: OsvQueryResponse = await res.json();
  return data.vulns ?? [];
}

/**
 * Batch query OSV for a list of dependencies.
 * OSV supports batch queries for up to 1000 packages at a time.
 */
export async function checkVulnerabilities(
  deps: ParsedDependency[]
): Promise<VulnFinding[]> {
  const findings: VulnFinding[] = [];

  // OSV batch endpoint
  const queries = deps.map((dep) => ({
    version: dep.version,
    package: {
      name: dep.name,
      ecosystem: ECOSYSTEM_MAP[dep.ecosystem] ?? dep.ecosystem,
    },
  }));

  // Process in chunks of 1000 (OSV batch limit)
  const CHUNK_SIZE = 1000;
  for (let i = 0; i < queries.length; i += CHUNK_SIZE) {
    const chunk = queries.slice(i, i + CHUNK_SIZE);
    const chunkDeps = deps.slice(i, i + CHUNK_SIZE);

    try {
      const res = await fetch(`${OSV_API}/querybatch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queries: chunk }),
      });

      if (!res.ok) {
        // Fallback to individual queries
        for (const dep of chunkDeps) {
          const vulns = await queryPackage(dep.name, dep.version, dep.ecosystem);
          for (const vuln of vulns) {
            findings.push({
              id: vuln.id,
              severity: classifySeverity(vuln),
              packageName: dep.name,
              packageVersion: dep.version,
              ecosystem: dep.ecosystem,
              title: vuln.summary || vuln.id,
              description: vuln.details || vuln.summary || "No details available.",
              recommendation: buildRecommendation(vuln),
              cve: extractCve(vuln),
              source: "osv",
            });
          }
        }
        continue;
      }

      const data: { results: Array<{ vulns?: OsvVulnerability[] }> } =
        await res.json();

      for (let j = 0; j < data.results.length; j++) {
        const vulns = data.results[j].vulns ?? [];
        const dep = chunkDeps[j];

        for (const vuln of vulns) {
          findings.push({
            id: vuln.id,
            severity: classifySeverity(vuln),
            packageName: dep.name,
            packageVersion: dep.version,
            ecosystem: dep.ecosystem,
            title: vuln.summary || vuln.id,
            description: vuln.details || vuln.summary || "No details available.",
            recommendation: buildRecommendation(vuln),
            cve: extractCve(vuln),
            source: "osv",
          });
        }
      }
    } catch {
      // If batch fails entirely, skip this chunk
      console.error(`OSV batch query failed for chunk starting at index ${i}`);
    }
  }

  return findings;
}
