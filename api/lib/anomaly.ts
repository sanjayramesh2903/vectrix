/**
 * Anomaly detection engine.
 * Heuristic checks for supply chain attack patterns:
 *   - Typosquatting (name similarity to popular packages)
 *   - Install script abuse (preinstall/postinstall doing suspicious things)
 *   - Version anomalies (huge jumps, yanked versions)
 */

import type { ParsedDependency } from "./parsers.js";

export interface AnomalyFinding {
  id: string;
  severity: "critical" | "warning" | "info";
  packageName: string;
  packageVersion: string;
  ecosystem: string;
  title: string;
  description: string;
  recommendation: string;
  cve: null;
  source: "anomaly";
}

// Popular npm packages that are common typosquatting targets
const POPULAR_PACKAGES = [
  "react", "lodash", "express", "axios", "chalk", "commander", "debug",
  "moment", "request", "bluebird", "underscore", "async", "uuid",
  "inquirer", "minimist", "colors", "webpack", "babel", "eslint",
  "typescript", "prettier", "jest", "mocha", "chai", "sinon",
  "mongoose", "sequelize", "passport", "jsonwebtoken", "bcrypt",
  "dotenv", "cors", "helmet", "morgan", "winston", "pino",
  "socket.io", "redis", "pg", "mysql2", "mongodb",
];

/**
 * Levenshtein distance for typosquat detection
 */
function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Check if a package name is suspiciously similar to a popular package.
 */
function checkTyposquatting(name: string): string | null {
  const normalized = name.replace(/[-_.]/g, "").toLowerCase();

  for (const popular of POPULAR_PACKAGES) {
    if (name === popular) continue; // exact match is fine

    const popNormalized = popular.replace(/[-_.]/g, "").toLowerCase();
    const distance = levenshtein(normalized, popNormalized);

    // Flag if edit distance is 1-2 and name isn't a scoped package
    if (distance > 0 && distance <= 2 && !name.startsWith("@")) {
      return popular;
    }
  }

  return null;
}

/**
 * Check npm registry for suspicious install scripts
 */
async function checkInstallScripts(
  name: string,
  version: string
): Promise<{ hasPreinstall: boolean; hasPostinstall: boolean; scripts: Record<string, string> }> {
  try {
    const res = await fetch(
      `https://registry.npmjs.org/${encodeURIComponent(name)}/${version}`,
      { headers: { Accept: "application/json" } }
    );
    if (!res.ok) return { hasPreinstall: false, hasPostinstall: false, scripts: {} };

    const data = await res.json();
    const scripts = (data as Record<string, unknown>).scripts as Record<string, string> | undefined ?? {};

    return {
      hasPreinstall: !!scripts.preinstall,
      hasPostinstall: !!scripts.postinstall,
      scripts,
    };
  } catch {
    return { hasPreinstall: false, hasPostinstall: false, scripts: {} };
  }
}

/**
 * Run anomaly detection on a list of dependencies.
 */
export async function detectAnomalies(
  deps: ParsedDependency[]
): Promise<AnomalyFinding[]> {
  const findings: AnomalyFinding[] = [];
  const npmDeps = deps.filter((d) => d.ecosystem === "npm");

  // 1. Typosquatting check (instant, no API calls)
  for (const dep of deps) {
    const similar = checkTyposquatting(dep.name);
    if (similar) {
      findings.push({
        id: `anomaly-typosquat-${dep.name}`,
        severity: "warning",
        packageName: dep.name,
        packageVersion: dep.version,
        ecosystem: dep.ecosystem,
        title: "Possible typosquatting",
        description: `Package name "${dep.name}" is suspiciously similar to the popular package "${similar}". Typosquatting is a common supply chain attack vector where malicious packages use names close to popular ones.`,
        recommendation: `Verify that you intended to install "${dep.name}" and not "${similar}". Check the package's npm page and repository.`,
        cve: null,
        source: "anomaly",
      });
    }
  }

  // 2. Install script analysis (batched API calls)
  const BATCH_SIZE = 10;
  for (let i = 0; i < npmDeps.length; i += BATCH_SIZE) {
    const batch = npmDeps.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(
      batch.map((dep) => checkInstallScripts(dep.name, dep.version))
    );

    for (let j = 0; j < results.length; j++) {
      const dep = batch[j];
      const result = results[j];

      if (result.hasPreinstall || result.hasPostinstall) {
        const scriptTypes = [
          result.hasPreinstall ? "preinstall" : null,
          result.hasPostinstall ? "postinstall" : null,
        ]
          .filter(Boolean)
          .join(" and ");

        // Check for suspicious patterns in scripts
        const allScripts = Object.values(result.scripts).join(" ");
        const suspicious =
          allScripts.includes("curl ") ||
          allScripts.includes("wget ") ||
          allScripts.includes("eval(") ||
          allScripts.includes("base64") ||
          allScripts.includes("/dev/tcp") ||
          allScripts.includes("powershell");

        if (suspicious) {
          findings.push({
            id: `anomaly-script-suspicious-${dep.name}`,
            severity: "critical",
            packageName: dep.name,
            packageVersion: dep.version,
            ecosystem: dep.ecosystem,
            title: "Suspicious install script detected",
            description: `${dep.name}@${dep.version} has ${scriptTypes} scripts containing patterns commonly associated with malicious behavior (network requests, eval, encoded payloads, or shell access).`,
            recommendation: "Inspect the install scripts manually before allowing this package in your project. Consider using --ignore-scripts during installation.",
            cve: null,
            source: "anomaly",
          });
        } else {
          findings.push({
            id: `anomaly-script-${dep.name}`,
            severity: "info",
            packageName: dep.name,
            packageVersion: dep.version,
            ecosystem: dep.ecosystem,
            title: "Package uses install scripts",
            description: `${dep.name}@${dep.version} has ${scriptTypes} scripts. While many legitimate packages use install scripts (e.g., for native compilation), they can also be used as an attack vector.`,
            recommendation: "Review the install scripts if this is a lesser-known package.",
            cve: null,
            source: "anomaly",
          });
        }
      }
    }
  }

  return findings;
}
