/**
 * Package maintenance health scorer.
 * Queries the npm registry (or PyPI JSON API) to compute a composite
 * health score for each dependency based on real signals.
 */

import type { ParsedDependency } from "./parsers.js";

export interface HealthResult {
  packageName: string;
  packageVersion: string;
  ecosystem: string;
  score: number; // 0-100
  license: string | null;
  signals: {
    lastPublishDaysAgo: number | null;
    weeklyDownloads: number | null;
    maintainerCount: number | null;
    hasRepository: boolean;
    deprecated: boolean;
  };
}

export interface HealthFinding {
  id: string;
  severity: "critical" | "warning" | "info";
  packageName: string;
  packageVersion: string;
  ecosystem: string;
  title: string;
  description: string;
  recommendation: string;
  cve: null;
  source: "health";
}

async function fetchNpmMetadata(name: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(`https://registry.npmjs.org/${encodeURIComponent(name)}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchNpmDownloads(name: string): Promise<number | null> {
  try {
    const res = await fetch(
      `https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(name)}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return (data as Record<string, unknown>).downloads as number ?? null;
  } catch {
    return null;
  }
}

async function scoreNpmPackage(name: string, version: string): Promise<HealthResult> {
  const [meta, downloads] = await Promise.all([
    fetchNpmMetadata(name),
    fetchNpmDownloads(name),
  ]);

  const result: HealthResult = {
    packageName: name,
    packageVersion: version,
    ecosystem: "npm",
    score: 50, // default neutral
    license: null,
    signals: {
      lastPublishDaysAgo: null,
      weeklyDownloads: downloads,
      maintainerCount: null,
      hasRepository: false,
      deprecated: false,
    },
  };

  if (!meta) return result;

  // Extract signals
  const time = meta.time as Record<string, string> | undefined;
  if (time) {
    const versions = Object.keys(time).filter((k) => k !== "created" && k !== "modified");
    const latest = versions[versions.length - 1];
    if (latest && time[latest]) {
      const lastPublish = new Date(time[latest]);
      result.signals.lastPublishDaysAgo = Math.floor(
        (Date.now() - lastPublish.getTime()) / (1000 * 60 * 60 * 24)
      );
    }
  }

  const maintainers = meta.maintainers as Array<unknown> | undefined;
  result.signals.maintainerCount = maintainers?.length ?? null;

  const repository = meta.repository as Record<string, string> | undefined;
  result.signals.hasRepository = !!repository?.url;

  // Check if the specific version is deprecated
  const versions = meta.versions as Record<string, Record<string, unknown>> | undefined;
  if (versions?.[version]) {
    result.signals.deprecated = !!versions[version].deprecated;
    result.license = (versions[version].license as string) ?? null;
  }

  // Fall back to top-level license
  if (!result.license) {
    result.license = (meta.license as string) ?? null;
  }

  // Compute composite score (0-100)
  let score = 50;

  // Recency: +20 if published within 180 days, -20 if >2 years
  if (result.signals.lastPublishDaysAgo !== null) {
    if (result.signals.lastPublishDaysAgo < 180) score += 20;
    else if (result.signals.lastPublishDaysAgo < 365) score += 10;
    else if (result.signals.lastPublishDaysAgo > 730) score -= 20;
    else score -= 10;
  }

  // Downloads: +15 if >100k/week, -10 if <1k/week
  if (downloads !== null) {
    if (downloads > 100_000) score += 15;
    else if (downloads > 10_000) score += 10;
    else if (downloads < 1_000) score -= 10;
  }

  // Maintainers: -15 if bus factor is 1
  if (result.signals.maintainerCount === 1) score -= 15;
  else if ((result.signals.maintainerCount ?? 0) >= 3) score += 10;

  // Repository: +5 if present
  if (result.signals.hasRepository) score += 5;
  else score -= 10;

  // Deprecated: -30
  if (result.signals.deprecated) score -= 30;

  result.score = Math.max(0, Math.min(100, score));
  return result;
}

/**
 * Score health for a list of dependencies.
 * Processes in parallel with concurrency limit to avoid rate limits.
 */
export async function scoreHealth(
  deps: ParsedDependency[]
): Promise<{ results: HealthResult[]; findings: HealthFinding[] }> {
  const results: HealthResult[] = [];
  const findings: HealthFinding[] = [];

  // Only score npm for now — PyPI and Go support can be added later
  const npmDeps = deps.filter((d) => d.ecosystem === "npm");
  const otherDeps = deps.filter((d) => d.ecosystem !== "npm");

  // Process in batches of 10 to respect rate limits
  const BATCH_SIZE = 10;
  for (let i = 0; i < npmDeps.length; i += BATCH_SIZE) {
    const batch = npmDeps.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map((dep) => scoreNpmPackage(dep.name, dep.version))
    );
    results.push(...batchResults);
  }

  // Give non-npm deps a neutral score
  for (const dep of otherDeps) {
    results.push({
      packageName: dep.name,
      packageVersion: dep.version,
      ecosystem: dep.ecosystem,
      score: 50,
      license: null,
      signals: {
        lastPublishDaysAgo: null,
        weeklyDownloads: null,
        maintainerCount: null,
        hasRepository: false,
        deprecated: false,
      },
    });
  }

  // Generate findings from health scores
  for (const r of results) {
    if (r.signals.deprecated) {
      findings.push({
        id: `health-deprecated-${r.packageName}`,
        severity: "warning",
        packageName: r.packageName,
        packageVersion: r.packageVersion,
        ecosystem: r.ecosystem,
        title: "Package is deprecated",
        description: `${r.packageName}@${r.packageVersion} is marked as deprecated by its maintainer.`,
        recommendation: "Find an alternative package or check the deprecation notice for migration guidance.",
        cve: null,
        source: "health",
      });
    }

    if (r.score < 25) {
      findings.push({
        id: `health-low-${r.packageName}`,
        severity: "warning",
        packageName: r.packageName,
        packageVersion: r.packageVersion,
        ecosystem: r.ecosystem,
        title: "Low maintenance health score",
        description: `${r.packageName} scored ${r.score}/100 on maintenance health. Signals: ${
          r.signals.lastPublishDaysAgo !== null
            ? `last published ${r.signals.lastPublishDaysAgo} days ago`
            : "unknown publish date"
        }, ${r.signals.maintainerCount ?? "unknown"} maintainer(s), ${
          r.signals.weeklyDownloads?.toLocaleString() ?? "unknown"
        } weekly downloads.`,
        recommendation: "Evaluate whether this dependency is actively maintained. Consider alternatives if the project appears abandoned.",
        cve: null,
        source: "health",
      });
    }

    if (r.signals.maintainerCount === 1 && (r.signals.weeklyDownloads ?? 0) > 50_000) {
      findings.push({
        id: `health-busfactor-${r.packageName}`,
        severity: "info",
        packageName: r.packageName,
        packageVersion: r.packageVersion,
        ecosystem: r.ecosystem,
        title: "Single maintainer on high-traffic package",
        description: `${r.packageName} has ${r.signals.weeklyDownloads?.toLocaleString()} weekly downloads but only 1 maintainer. This is a supply chain risk — a single compromised account could affect all downstream users.`,
        recommendation: "Monitor this package closely for unusual releases or maintainer changes.",
        cve: null,
        source: "health",
      });
    }
  }

  return { results, findings };
}
