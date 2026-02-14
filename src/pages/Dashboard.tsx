import { useState } from "react";
import { Navigate } from "react-router-dom";
import {
  Shield,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Package,
  GitBranch,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface Finding {
  id: string;
  severity: "critical" | "warning" | "info";
  package: string;
  version: string;
  ecosystem: string;
  title: string;
  description: string;
  recommendation: string;
  cve?: string;
}

interface ScanResult {
  id: string;
  repo: string;
  branch: string;
  timestamp: string;
  totalDeps: number;
  critical: number;
  warnings: number;
  clean: number;
  findings: Finding[];
}

const MOCK_SCANS: ScanResult[] = [
  {
    id: "scan-a7f3e9",
    repo: "acme/payments-service",
    branch: "main",
    timestamp: "2026-02-14T09:42:00Z",
    totalDeps: 1247,
    critical: 3,
    warnings: 12,
    clean: 1232,
    findings: [
      {
        id: "f1",
        severity: "critical",
        package: "colors",
        version: "1.4.1",
        ecosystem: "npm",
        title: "Malicious payload in release",
        description:
          "Maintainer intentionally introduced an infinite loop and ANSI gibberish output in v1.4.1. This version was published as a protest and can cause denial-of-service in Node.js applications.",
        recommendation: "Pin to colors@1.4.0 or migrate to picocolors@1.0.0.",
      },
      {
        id: "f2",
        severity: "critical",
        package: "event-stream",
        version: "3.3.6",
        ecosystem: "npm",
        title: "Supply chain compromise via flatmap-stream",
        description:
          "Transitive dependency flatmap-stream@0.1.1 contains obfuscated code targeting cryptocurrency wallet applications. The package was injected after a maintainer transfer.",
        recommendation: "Upgrade to event-stream@4.0.1 which removes the compromised transitive dependency.",
        cve: "CVE-2018-16487",
      },
      {
        id: "f3",
        severity: "critical",
        package: "node-ipc",
        version: "10.1.1",
        ecosystem: "npm",
        title: "Protestware — file system destructive payload",
        description:
          "Versions 10.1.1 and 10.1.2 contain code that overwrites file contents with heart emojis on systems with Russian or Belarusian locales.",
        recommendation: "Downgrade to node-ipc@9.2.1 or find an alternative IPC library.",
        cve: "CVE-2022-23812",
      },
      {
        id: "f4",
        severity: "warning",
        package: "lodash",
        version: "4.17.19",
        ecosystem: "npm",
        title: "Unpatched prototype pollution",
        description:
          "Two known prototype pollution vectors exist in versions prior to 4.17.21. These can lead to property injection in downstream applications.",
        recommendation: "Upgrade to lodash@4.17.21.",
        cve: "CVE-2020-28500",
      },
      {
        id: "f5",
        severity: "warning",
        package: "minimist",
        version: "1.2.5",
        ecosystem: "npm",
        title: "Prototype pollution via constructor",
        description:
          "Versions before 1.2.6 are vulnerable to prototype pollution when handling specially crafted argument strings.",
        recommendation: "Upgrade to minimist@1.2.8.",
        cve: "CVE-2021-44906",
      },
      {
        id: "f6",
        severity: "info",
        package: "moment",
        version: "2.29.4",
        ecosystem: "npm",
        title: "Unmaintained — consider alternatives",
        description:
          "Moment.js is in maintenance mode with no new features planned. Large bundle size (67kB min+gzip) impacts client performance.",
        recommendation: "Migrate to date-fns or Temporal API for new code.",
      },
    ],
  },
  {
    id: "scan-b2c8d1",
    repo: "acme/web-dashboard",
    branch: "main",
    timestamp: "2026-02-14T08:15:00Z",
    totalDeps: 842,
    critical: 0,
    warnings: 4,
    clean: 838,
    findings: [
      {
        id: "f7",
        severity: "warning",
        package: "postcss",
        version: "8.4.14",
        ecosystem: "npm",
        title: "ReDoS vulnerability in line parsing",
        description:
          "A crafted CSS input can cause catastrophic backtracking in the line/column parser, leading to denial-of-service.",
        recommendation: "Upgrade to postcss@8.4.31.",
        cve: "CVE-2023-44270",
      },
    ],
  },
  {
    id: "scan-c5a7f2",
    repo: "acme/auth-gateway",
    branch: "release/2.4",
    timestamp: "2026-02-13T22:03:00Z",
    totalDeps: 389,
    critical: 0,
    warnings: 1,
    clean: 388,
    findings: [],
  },
];

const severityConfig = {
  critical: {
    icon: AlertCircle,
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/20",
    badge: "bg-red-500/20 text-red-300",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
    badge: "bg-amber-500/20 text-amber-300",
  },
  info: {
    icon: CheckCircle2,
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
    badge: "bg-blue-500/20 text-blue-300",
  },
};

function FindingRow({ finding }: { finding: Finding }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = severityConfig[finding.severity];
  const Icon = cfg.icon;

  return (
    <div className={`rounded-lg border ${cfg.border} ${cfg.bg}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <Icon className={`h-4 w-4 shrink-0 ${cfg.text}`} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">
              {finding.package}@{finding.version}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${cfg.badge}`}
            >
              {finding.severity}
            </span>
            {finding.cve && (
              <span className="text-xs text-slate-500">{finding.cve}</span>
            )}
          </div>
          <p className="mt-0.5 truncate text-sm text-slate-400">
            {finding.title}
          </p>
        </div>
        {expanded ? (
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-white/5 px-4 py-3 text-sm">
          <p className="text-slate-300">{finding.description}</p>
          <div className="mt-3 rounded-md bg-black/20 px-3 py-2">
            <span className="text-xs font-medium text-slate-500">
              RECOMMENDATION
            </span>
            <p className="mt-1 text-slate-300">{finding.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ScanCard({ scan }: { scan: ScanResult }) {
  const [expanded, setExpanded] = useState(false);
  const ts = new Date(scan.timestamp);

  return (
    <div className="rounded-xl border border-white/5 bg-white/[.02]">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">{scan.repo}</span>
            <span className="flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-xs text-slate-400">
              <GitBranch className="h-3 w-3" />
              {scan.branch}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Package className="h-3 w-3" />
              {scan.totalDeps} deps
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {ts.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {scan.critical > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-red-500/20 px-2.5 py-1 text-xs font-medium text-red-300">
              <AlertCircle className="h-3 w-3" />
              {scan.critical}
            </span>
          )}
          {scan.warnings > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-1 text-xs font-medium text-amber-300">
              <AlertTriangle className="h-3 w-3" />
              {scan.warnings}
            </span>
          )}
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-300">
            <CheckCircle2 className="h-3 w-3" />
            {scan.clean}
          </span>
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-slate-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-slate-500" />
          )}
        </div>
      </button>

      {expanded && scan.findings.length > 0 && (
        <div className="border-t border-white/5 px-5 py-4">
          <div className="space-y-2">
            {scan.findings.map((f) => (
              <FindingRow key={f.id} finding={f} />
            ))}
          </div>
          <a
            href="#"
            className="mt-3 inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
          >
            View full report <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}

      {expanded && scan.findings.length === 0 && (
        <div className="border-t border-white/5 px-5 py-6 text-center text-sm text-slate-500">
          No findings for this scan. All dependencies passed checks.
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [filterText, setFilterText] = useState("");

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-925">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const totalCritical = MOCK_SCANS.reduce((s, r) => s + r.critical, 0);
  const totalWarnings = MOCK_SCANS.reduce((s, r) => s + r.warnings, 0);
  const totalDeps = MOCK_SCANS.reduce((s, r) => s + r.totalDeps, 0);

  const filtered = MOCK_SCANS.filter((s) =>
    s.repo.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-925 pt-16">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-400">
              Supply chain overview across {MOCK_SCANS.length} monitored
              repositories.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500">
            <Shield className="h-4 w-4" />
            New scan
          </button>
        </div>

        {/* Stat cards */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              label: "Total dependencies",
              value: totalDeps.toLocaleString(),
              icon: Package,
              color: "text-slate-300",
            },
            {
              label: "Critical findings",
              value: totalCritical,
              icon: AlertCircle,
              color: "text-red-400",
            },
            {
              label: "Warnings",
              value: totalWarnings,
              icon: AlertTriangle,
              color: "text-amber-400",
            },
            {
              label: "Repositories",
              value: MOCK_SCANS.length,
              icon: GitBranch,
              color: "text-indigo-400",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/5 bg-white/[.02] p-4"
            >
              <div className="flex items-center gap-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <span className="text-xs text-slate-500">{stat.label}</span>
              </div>
              <div className={`mt-2 text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div className="mt-8 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Filter repositories..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500"
            />
          </div>
          <button className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/10">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>

        {/* Scan list */}
        <div className="mt-4 space-y-3">
          {filtered.map((scan) => (
            <ScanCard key={scan.id} scan={scan} />
          ))}
          {filtered.length === 0 && (
            <div className="rounded-xl border border-white/5 bg-white/[.02] py-12 text-center text-sm text-slate-500">
              No repositories match your filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
