/**
 * Anomaly detection engine.
 * Heuristic checks for supply chain attack patterns:
 *   - Typosquatting (name similarity to popular packages)
 *   - Install script abuse (preinstall/postinstall doing suspicious things)
 *   - Version anomalies (huge jumps, yanked versions)
 *   - Suspicious publish patterns (new package with immediate high version)
 *   - License risk detection (no license, copyleft in proprietary contexts)
 *   - Missing source repository
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
  "next", "nuxt", "vite", "esbuild", "rollup", "parcel",
  "tailwindcss", "postcss", "autoprefixer", "sass",
  "react-dom", "react-router", "react-query", "redux",
  "vue", "angular", "svelte", "solid-js",
  "fastify", "koa", "hapi", "nest", "prisma",
  "zod", "yup", "joi", "ajv",
  "dayjs", "date-fns", "luxon",
  "sharp", "jimp", "canvas",
  "puppeteer", "playwright", "cypress", "selenium-webdriver",
];

// Popular Python packages for typosquat detection
const POPULAR_PYTHON_PACKAGES = [
  "requests", "flask", "django", "numpy", "pandas", "scipy",
  "matplotlib", "pillow", "beautifulsoup4", "scrapy", "celery",
  "sqlalchemy", "fastapi", "uvicorn", "gunicorn", "boto3",
  "pyyaml", "cryptography", "paramiko", "fabric", "ansible",
  "tensorflow", "torch", "transformers", "scikit-learn",
  "pytest", "black", "flake8", "mypy", "ruff",
];

// Copyleft licenses that may pose legal risk
const COPYLEFT_LICENSES = [
  "GPL-2.0", "GPL-3.0", "AGPL-3.0", "LGPL-2.1", "LGPL-3.0",
  "GPL-2.0-only", "GPL-3.0-only", "AGPL-3.0-only",
  "GPL-2.0-or-later", "GPL-3.0-or-later", "AGPL-3.0-or-later",
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
function checkTyposquatting(name: string, ecosystem: string): string | null {
  const normalized = name.replace(/[-_.]/g, "").toLowerCase();

  const targets = ecosystem === "pypi"
    ? [...POPULAR_PYTHON_PACKAGES, ...POPULAR_PACKAGES]
    : POPULAR_PACKAGES;

  for (const popular of targets) {
    if (name === popular) continue; // exact match is fine

    const popNormalized = popular.replace(/[-_.]/g, "").toLowerCase();
    const distance = levenshtein(normalized, popNormalized);

    // Flag if edit distance is 1-2 and name isn't a scoped package
    if (distance > 0 && distance <= 2 && !name.startsWith("@")) {
      return popular;
    }
  }

  // Check for common typosquatting patterns
  const patterns = [
    /^(.+)-js$/,   // lodash-js → lodash
    /^js-(.+)$/,   // js-lodash → lodash
    /^node-(.+)$/, // node-express → express
    /^(.+)-node$/,
    /^(.+)-cli$/,
  ];

  for (const regex of patterns) {
    const match = name.match(regex);
    if (match) {
      const base = match[1];
      if (targets.includes(base)) {
        return base;
      }
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
 * Check npm registry for version and publish anomalies
 */
async function checkPublishAnomalies(
  name: string,
): Promise<{
  versionCount: number;
  packageAge: number;
  recentPublishCount: number;
  hasGitRepo: boolean;
  license: string | null;
}> {
  try {
    const res = await fetch(
      `https://registry.npmjs.org/${encodeURIComponent(name)}`,
      { headers: { Accept: "application/json" } }
    );
    if (!res.ok) return { versionCount: 0, packageAge: 0, recentPublishCount: 0, hasGitRepo: false, license: null };

    const data = await res.json() as Record<string, unknown>;
    const time = data.time as Record<string, string> | undefined;
    const versions = Object.keys(time ?? {}).filter(k => k !== "created" && k !== "modified");
    const repository = data.repository as Record<string, string> | undefined;
    const license = (data.license as string) ?? null;

    // Calculate package age in days
    const created = time?.created ? new Date(time.created) : new Date();
    const packageAge = Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24));

    // Count publishes in last 7 days
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    let recentPublishCount = 0;
    for (const v of versions) {
      if (time?.[v] && new Date(time[v]).getTime() > oneWeekAgo) {
        recentPublishCount++;
      }
    }

    return {
      versionCount: versions.length,
      packageAge,
      recentPublishCount,
      hasGitRepo: !!repository?.url,
      license,
    };
  } catch {
    return { versionCount: 0, packageAge: 0, recentPublishCount: 0, hasGitRepo: false, license: null };
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

  // 1. Typosquatting check (instant, no API calls) — all ecosystems
  for (const dep of deps) {
    const similar = checkTyposquatting(dep.name, dep.ecosystem);
    if (similar) {
      findings.push({
        id: `anomaly-typosquat-${dep.name}`,
        severity: "warning",
        packageName: dep.name,
        packageVersion: dep.version,
        ecosystem: dep.ecosystem,
        title: "Possible typosquatting",
        description: `Package name "${dep.name}" is suspiciously similar to the popular package "${similar}". Typosquatting is a common supply chain attack vector where malicious packages use names close to popular ones.`,
        recommendation: `Verify that you intended to install "${dep.name}" and not "${similar}". Check the package's registry page and repository.`,
        cve: null,
        source: "anomaly",
      });
    }
  }

  // 2. Install script analysis + publish anomalies (batched API calls, npm only)
  const BATCH_SIZE = 10;
  for (let i = 0; i < npmDeps.length; i += BATCH_SIZE) {
    const batch = npmDeps.slice(i, i + BATCH_SIZE);
    const [scriptResults, anomalyResults] = await Promise.all([
      Promise.all(batch.map((dep) => checkInstallScripts(dep.name, dep.version))),
      Promise.all(batch.map((dep) => checkPublishAnomalies(dep.name))),
    ]);

    for (let j = 0; j < batch.length; j++) {
      const dep = batch[j];
      const scriptResult = scriptResults[j];
      const anomalyResult = anomalyResults[j];

      // 2a. Install script checks
      if (scriptResult.hasPreinstall || scriptResult.hasPostinstall) {
        const scriptTypes = [
          scriptResult.hasPreinstall ? "preinstall" : null,
          scriptResult.hasPostinstall ? "postinstall" : null,
        ]
          .filter(Boolean)
          .join(" and ");

        const allScripts = Object.values(scriptResult.scripts).join(" ");
        const suspicious =
          allScripts.includes("curl ") ||
          allScripts.includes("wget ") ||
          allScripts.includes("eval(") ||
          allScripts.includes("base64") ||
          allScripts.includes("/dev/tcp") ||
          allScripts.includes("powershell") ||
          allScripts.includes("nc ") ||
          allScripts.includes("ncat ") ||
          allScripts.includes(".exe") ||
          allScripts.includes("child_process") ||
          allScripts.includes("XMLHttpRequest") ||
          allScripts.includes("fetch(");

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

      // 2b. New package with high version number (potential version squatting)
      if (anomalyResult.packageAge < 30 && anomalyResult.versionCount <= 3) {
        const majorVersion = parseInt(dep.version.split(".")[0] ?? "0", 10);
        if (majorVersion >= 2) {
          findings.push({
            id: `anomaly-version-squat-${dep.name}`,
            severity: "warning",
            packageName: dep.name,
            packageVersion: dep.version,
            ecosystem: dep.ecosystem,
            title: "New package with unusually high version",
            description: `${dep.name} was published ${anomalyResult.packageAge} days ago with only ${anomalyResult.versionCount} releases, but starts at version ${dep.version}. This pattern can indicate version squatting or an attempt to appear established.`,
            recommendation: "Verify this is a legitimate package. Check the maintainer's profile and repository for authenticity.",
            cve: null,
            source: "anomaly",
          });
        }
      }

      // 2c. Rapid publish pattern (many versions in short time)
      if (anomalyResult.recentPublishCount > 5) {
        findings.push({
          id: `anomaly-rapid-publish-${dep.name}`,
          severity: "info",
          packageName: dep.name,
          packageVersion: dep.version,
          ecosystem: dep.ecosystem,
          title: "Rapid publish activity detected",
          description: `${dep.name} has published ${anomalyResult.recentPublishCount} versions in the last 7 days. While this can be normal for active projects, it may also indicate automated malicious publishing.`,
          recommendation: "Monitor this package for unexpected changes. Pin to a specific version until the publishing pattern stabilizes.",
          cve: null,
          source: "anomaly",
        });
      }

      // 2d. No source repository
      if (!anomalyResult.hasGitRepo && anomalyResult.versionCount > 0) {
        findings.push({
          id: `anomaly-no-repo-${dep.name}`,
          severity: "info",
          packageName: dep.name,
          packageVersion: dep.version,
          ecosystem: dep.ecosystem,
          title: "No source repository linked",
          description: `${dep.name} does not have a linked source code repository. This makes it harder to audit the package code and verify its integrity.`,
          recommendation: "Prefer packages with public source repositories. If this package is critical, audit the published code directly.",
          cve: null,
          source: "anomaly",
        });
      }

      // 2e. License risk detection
      if (anomalyResult.license) {
        if (COPYLEFT_LICENSES.some(l => anomalyResult.license!.includes(l))) {
          findings.push({
            id: `anomaly-license-copyleft-${dep.name}`,
            severity: "info",
            packageName: dep.name,
            packageVersion: dep.version,
            ecosystem: dep.ecosystem,
            title: "Copyleft license detected",
            description: `${dep.name} is licensed under ${anomalyResult.license}, a copyleft license that may require you to release your source code under the same license if you distribute your software.`,
            recommendation: "Review your project's licensing requirements. Consult with legal counsel if using this package in proprietary software.",
            cve: null,
            source: "anomaly",
          });
        }
      } else if (anomalyResult.versionCount > 0) {
        findings.push({
          id: `anomaly-no-license-${dep.name}`,
          severity: "info",
          packageName: dep.name,
          packageVersion: dep.version,
          ecosystem: dep.ecosystem,
          title: "No license specified",
          description: `${dep.name} does not specify a license. Without an explicit license, the default copyright law applies, meaning you may not have permission to use, modify, or distribute this package.`,
          recommendation: "Contact the package maintainer to clarify the licensing. Consider alternatives with clear licenses.",
          cve: null,
          source: "anomaly",
        });
      }
    }
  }

  return findings;
}
