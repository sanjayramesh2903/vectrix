#!/usr/bin/env node

import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { resolve, basename } from "node:path";
import { homedir } from "node:os";

// ── Config ────────────────────────────────────────────────

const CONFIG_PATH = resolve(homedir(), ".ripptide", "config.json");
const API_BASE = process.env.RIPPTIDE_API_URL ?? "https://ripptide.vercel.app/api";

interface Config {
  token: string;
  project_id?: string;
}

function loadConfig(): Config | null {
  if (!existsSync(CONFIG_PATH)) return null;
  try {
    return JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
  } catch {
    return null;
  }
}

function saveConfig(config: Config): void {
  const dir = resolve(homedir(), ".ripptide");
  if (!existsSync(dir)) {
    const { mkdirSync } = await_import_fs();
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

function await_import_fs() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("node:fs") as typeof import("node:fs");
}

// ── Formatting helpers ────────────────────────────────────

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const CYAN = "\x1b[36m";
const DIM = "\x1b[2m";

function severityColor(severity: string): string {
  if (severity === "critical") return RED;
  if (severity === "warning") return YELLOW;
  return CYAN;
}

// ── Lockfile detection ────────────────────────────────────

const LOCKFILES = [
  "package-lock.json",
  "package.json",
  "requirements.txt",
  "go.sum",
  "Cargo.lock",
];

function detectLockfile(dir: string): { path: string; name: string } | null {
  for (const name of LOCKFILES) {
    const full = resolve(dir, name);
    if (existsSync(full)) return { path: full, name };
  }
  return null;
}

// ── API calls ─────────────────────────────────────────────

interface ScanResponse {
  scan_id: string;
  status: string;
  total_deps: number;
  critical: number;
  warnings: number;
  info: number;
  clean: number;
  findings: Array<{
    severity: string;
    package_name: string;
    package_version: string;
    title: string;
    recommendation: string;
    cve: string | null;
  }>;
}

async function apiScan(
  token: string,
  projectId: string,
  filename: string,
  content: string
): Promise<ScanResponse> {
  const res = await fetch(`${API_BASE}/scan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      project_id: projectId,
      filename,
      content,
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((body as Record<string, string>).error ?? `HTTP ${res.status}`);
  }

  return res.json();
}

// ── Commands ──────────────────────────────────────────────

function printHelp(): void {
  console.log(`
${BOLD}ripptide${RESET} — AI-powered supply chain security

${BOLD}USAGE${RESET}
  ripptide <command> [options]

${BOLD}COMMANDS${RESET}
  scan              Scan dependencies in the current directory
  login <token>     Authenticate with your Ripptide API token
  set-project <id>  Set the default project ID for scans
  help              Show this help message

${BOLD}OPTIONS${RESET}
  --file <path>     Path to a specific lockfile (auto-detected by default)
  --project <id>    Override the default project ID
  --json            Output results as JSON

${BOLD}ENVIRONMENT${RESET}
  RIPPTIDE_TOKEN     API token (alternative to 'ripptide login')
  RIPPTIDE_PROJECT   Project ID (alternative to 'ripptide set-project')
  RIPPTIDE_API_URL   Custom API endpoint

${BOLD}EXAMPLES${RESET}
  ripptide scan
  ripptide scan --file ./package-lock.json
  ripptide scan --json | jq '.findings[] | select(.severity == "critical")'
`);
}

async function cmdLogin(token: string): Promise<void> {
  const config = loadConfig() ?? { token: "" };
  config.token = token;
  saveConfig(config);
  console.log(`${GREEN}✓${RESET} Token saved to ${DIM}${CONFIG_PATH}${RESET}`);
}

function cmdSetProject(projectId: string): void {
  const config = loadConfig() ?? { token: "" };
  config.project_id = projectId;
  saveConfig(config);
  console.log(`${GREEN}✓${RESET} Default project set to ${BOLD}${projectId}${RESET}`);
}

async function cmdScan(args: string[]): Promise<void> {
  // Parse flags
  let filePath: string | null = null;
  let projectId: string | null = null;
  let jsonOutput = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--file" && args[i + 1]) {
      filePath = args[++i];
    } else if (args[i] === "--project" && args[i + 1]) {
      projectId = args[++i];
    } else if (args[i] === "--json") {
      jsonOutput = true;
    }
  }

  // Resolve token
  const config = loadConfig();
  const token = process.env.RIPPTIDE_TOKEN ?? config?.token;
  if (!token) {
    console.error(
      `${RED}Error:${RESET} Not authenticated. Run ${BOLD}ripptide login <token>${RESET} or set RIPPTIDE_TOKEN.`
    );
    process.exit(1);
  }

  // Resolve project
  projectId =
    projectId ?? process.env.RIPPTIDE_PROJECT ?? config?.project_id ?? null;
  if (!projectId) {
    console.error(
      `${RED}Error:${RESET} No project ID. Run ${BOLD}ripptide set-project <id>${RESET} or use --project.`
    );
    process.exit(1);
  }

  // Find lockfile
  const cwd = process.cwd();
  let lockfile: { path: string; name: string };

  if (filePath) {
    const full = resolve(cwd, filePath);
    if (!existsSync(full)) {
      console.error(`${RED}Error:${RESET} File not found: ${filePath}`);
      process.exit(1);
    }
    lockfile = { path: full, name: basename(full) };
  } else {
    const detected = detectLockfile(cwd);
    if (!detected) {
      console.error(
        `${RED}Error:${RESET} No lockfile found in ${cwd}. Supported: ${LOCKFILES.join(", ")}`
      );
      process.exit(1);
    }
    lockfile = detected;
  }

  if (!jsonOutput) {
    console.log(
      `\n  ${DIM}Scanning ${lockfile.name}...${RESET}`
    );
  }

  // Read and send
  const content = readFileSync(lockfile.path, "utf-8");

  try {
    const result = await apiScan(token, projectId, lockfile.name, content);

    if (jsonOutput) {
      console.log(JSON.stringify(result, null, 2));
      process.exit(result.critical > 0 ? 1 : 0);
    }

    // Pretty print
    console.log(`  Resolving dependency graph... ${GREEN}done${RESET} (${result.total_deps} packages)`);
    console.log(`  Running analysis... ${GREEN}done${RESET}\n`);

    console.log(`  ┌─────────────────────────────────────────┐`);
    console.log(
      `  │ ${RED}${result.critical} critical${RESET}   ${YELLOW}${result.warnings} warning${RESET}   ${GREEN}${result.clean} ok${RESET}   │`
    );
    console.log(`  └─────────────────────────────────────────┘\n`);

    // Show findings grouped by severity
    const criticals = result.findings.filter((f) => f.severity === "critical");
    const warnings = result.findings.filter((f) => f.severity === "warning");
    const infos = result.findings.filter((f) => f.severity === "info");

    for (const finding of [...criticals, ...warnings, ...infos]) {
      const color = severityColor(finding.severity);
      const label = finding.severity.toUpperCase().padEnd(8);
      console.log(
        `  ${color}${BOLD}${label}${RESET} ${finding.package_name}@${finding.package_version}`
      );
      console.log(`    → ${finding.title}`);
      if (finding.cve) {
        console.log(`    → ${DIM}${finding.cve}${RESET}`);
      }
      console.log(
        `    → ${DIM}Recommendation: ${finding.recommendation}${RESET}\n`
      );
    }

    console.log(
      `  ${DIM}Full report → ${API_BASE.replace("/api", "")}/dashboard${RESET}\n`
    );

    // Exit with code 1 if critical findings
    process.exit(result.critical > 0 ? 1 : 0);
  } catch (err) {
    console.error(`\n  ${RED}Error:${RESET} ${(err as Error).message}\n`);
    process.exit(1);
  }
}

// ── Main ──────────────────────────────────────────────────

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case "scan":
      await cmdScan(args.slice(1));
      break;
    case "login":
      if (!args[1]) {
        console.error(`${RED}Usage:${RESET} ripptide login <token>`);
        process.exit(1);
      }
      await cmdLogin(args[1]);
      break;
    case "set-project":
      if (!args[1]) {
        console.error(`${RED}Usage:${RESET} ripptide set-project <project-id>`);
        process.exit(1);
      }
      cmdSetProject(args[1]);
      break;
    case "help":
    case "--help":
    case "-h":
    case undefined:
      printHelp();
      break;
    default:
      console.error(`${RED}Unknown command:${RESET} ${command}\n`);
      printHelp();
      process.exit(1);
  }
}

main();
