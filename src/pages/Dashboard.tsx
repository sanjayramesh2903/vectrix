import { useState, useEffect, useCallback, useRef } from "react";
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
  Upload,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  listProjects,
  listScans,
  getScan,
  createProject,
  triggerScan,
  type Project,
  type ScanSummary,
  type Finding,
} from "../lib/api";

// ── Severity styling ──────────────────────────────────────

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

// ── Finding row ───────────────────────────────────────────

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
              {finding.package_name}@{finding.package_version}
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

// ── Scan card ─────────────────────────────────────────────

function ScanCard({ scan }: { scan: ScanSummary }) {
  const [expanded, setExpanded] = useState(false);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loadingFindings, setLoadingFindings] = useState(false);
  const ts = new Date(scan.started_at);

  const loadFindings = async () => {
    if (findings.length > 0 || loadingFindings) return;
    setLoadingFindings(true);
    try {
      const data = await getScan(scan.id);
      setFindings(data.findings);
    } catch {
      // silently fail
    }
    setLoadingFindings(false);
  };

  const handleToggle = () => {
    if (!expanded) loadFindings();
    setExpanded(!expanded);
  };

  const totalFindings = scan.critical_count + scan.warning_count + scan.info_count;
  const projectName = scan.projects?.name ?? "Unknown project";

  return (
    <div className="rounded-xl border border-white/5 bg-white/[.02]">
      <button
        onClick={handleToggle}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">
              {projectName}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-xs text-slate-400">
              <GitBranch className="h-3 w-3" />
              {scan.branch}
            </span>
            {scan.status === "running" && (
              <span className="flex items-center gap-1 rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs text-indigo-300">
                <Loader2 className="h-3 w-3 animate-spin" />
                Scanning
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Package className="h-3 w-3" />
              {scan.total_deps} deps
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {ts.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {scan.critical_count > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-red-500/20 px-2.5 py-1 text-xs font-medium text-red-300">
              <AlertCircle className="h-3 w-3" />
              {scan.critical_count}
            </span>
          )}
          {scan.warning_count > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-1 text-xs font-medium text-amber-300">
              <AlertTriangle className="h-3 w-3" />
              {scan.warning_count}
            </span>
          )}
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-300">
            <CheckCircle2 className="h-3 w-3" />
            {scan.clean_count}
          </span>
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-slate-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-slate-500" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-white/5 px-5 py-4">
          {loadingFindings && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
            </div>
          )}
          {!loadingFindings && findings.length > 0 && (
            <>
              <div className="space-y-2">
                {findings.map((f) => (
                  <FindingRow key={f.id} finding={f} />
                ))}
              </div>
              <a
                href="#"
                className="mt-3 inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
              >
                View full report <ExternalLink className="h-3 w-3" />
              </a>
            </>
          )}
          {!loadingFindings && totalFindings === 0 && (
            <div className="py-4 text-center text-sm text-slate-500">
              No findings for this scan. All dependencies passed checks.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── New scan modal ────────────────────────────────────────

function NewScanModal({
  projects,
  onClose,
  onScanComplete,
}: {
  projects: Project[];
  onClose: () => void;
  onScanComplete: () => void;
}) {
  const [step, setStep] = useState<"select" | "upload" | "scanning" | "done">(
    projects.length > 0 ? "select" : "upload"
  );
  const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
  const [newProjectName, setNewProjectName] = useState("");
  const [creatingProject, setCreatingProject] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    total_deps: number;
    critical: number;
    warnings: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    setCreatingProject(true);
    try {
      const { project } = await createProject({ name: newProjectName.trim() });
      setProjectId(project.id);
      setStep("select");
    } catch (err) {
      setScanError((err as Error).message);
    }
    setCreatingProject(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !projectId) return;

    const supportedFiles = [
      "package-lock.json",
      "package.json",
      "requirements.txt",
      "go.sum",
    ];
    if (!supportedFiles.includes(file.name)) {
      setScanError(
        `Unsupported file: ${file.name}. Supported: ${supportedFiles.join(", ")}`
      );
      return;
    }

    setScanning(true);
    setScanError(null);
    setStep("scanning");

    try {
      const content = await file.text();
      const data = await triggerScan({
        project_id: projectId,
        filename: file.name,
        content,
      });
      setResult({
        total_deps: data.total_deps,
        critical: data.critical,
        warnings: data.warnings,
      });
      setStep("done");
    } catch (err) {
      setScanError((err as Error).message);
      setStep("select");
    }
    setScanning(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-xl border border-white/10 bg-slate-900 p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-500 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-lg font-semibold text-white">New scan</h2>

        {scanError && (
          <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {scanError}
          </div>
        )}

        {/* Step: select or create project */}
        {(step === "select" || step === "upload") && (
          <div className="mt-4 space-y-4">
            {projects.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-300">
                  Project
                </label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-indigo-500"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-300">
                  {projects.length > 0 ? "Or create new project" : "Project name"}
                </label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="my-app"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                />
              </div>
              <button
                onClick={handleCreateProject}
                disabled={!newProjectName.trim() || creatingProject}
                className="rounded-lg bg-white/5 px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/10 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">
                Upload lockfile
              </label>
              <p className="mt-1 text-xs text-slate-500">
                Supported: package-lock.json, package.json, requirements.txt, go.sum
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.txt,.sum"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={!projectId || scanning}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/10 bg-white/[.02] px-4 py-8 text-sm text-slate-400 transition hover:border-indigo-500/30 hover:bg-white/[.04] disabled:opacity-50"
              >
                <Upload className="h-5 w-5" />
                Choose file or drag & drop
              </button>
            </div>
          </div>
        )}

        {/* Step: scanning */}
        {step === "scanning" && (
          <div className="mt-6 flex flex-col items-center gap-3 py-8">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
            <p className="text-sm text-slate-400">
              Analyzing dependencies, checking vulnerabilities, scoring health...
            </p>
          </div>
        )}

        {/* Step: done */}
        {step === "done" && result && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Scan complete</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-white/5 p-3">
                <div className="text-xl font-bold text-white">{result.total_deps}</div>
                <div className="text-xs text-slate-500">Dependencies</div>
              </div>
              <div className="rounded-lg bg-red-500/10 p-3">
                <div className="text-xl font-bold text-red-400">{result.critical}</div>
                <div className="text-xs text-slate-500">Critical</div>
              </div>
              <div className="rounded-lg bg-amber-500/10 p-3">
                <div className="text-xl font-bold text-amber-400">{result.warnings}</div>
                <div className="text-xs text-slate-500">Warnings</div>
              </div>
            </div>
            <button
              onClick={() => {
                onScanComplete();
                onClose();
              }}
              className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
            >
              View results
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main dashboard ────────────────────────────────────────

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [filterText, setFilterText] = useState("");
  const [scans, setScans] = useState<ScanSummary[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showNewScan, setShowNewScan] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [scansData, projectsData] = await Promise.all([
        listScans(),
        listProjects(),
      ]);
      setScans(scansData.scans);
      setProjects(projectsData.projects);
    } catch {
      // API not set up yet — that's fine, show empty state
    }
    setLoadingData(false);
  }, []);

  useEffect(() => {
    if (user) fetchData();
  }, [user, fetchData]);

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

  const totalCritical = scans.reduce((s, r) => s + r.critical_count, 0);
  const totalWarnings = scans.reduce((s, r) => s + r.warning_count, 0);
  const totalDeps = scans.reduce((s, r) => s + r.total_deps, 0);

  const filtered = scans.filter((s) => {
    const name = s.projects?.name ?? "";
    return name.toLowerCase().includes(filterText.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-slate-925 pt-16">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-400">
              {scans.length > 0
                ? `Supply chain overview across ${projects.length} monitored project${projects.length !== 1 ? "s" : ""}.`
                : "Upload a lockfile to run your first dependency scan."}
            </p>
          </div>
          <button
            onClick={() => setShowNewScan(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
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
              label: "Projects",
              value: projects.length,
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
        {scans.length > 0 && (
          <div className="mt-8 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Filter projects..."
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
        )}

        {/* Loading */}
        {loadingData && (
          <div className="mt-12 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-slate-500" />
          </div>
        )}

        {/* Empty state */}
        {!loadingData && scans.length === 0 && (
          <div className="mt-12 rounded-xl border border-dashed border-white/10 bg-white/[.02] py-16 text-center">
            <Upload className="mx-auto h-10 w-10 text-slate-600" />
            <h3 className="mt-4 text-lg font-medium text-white">
              No scans yet
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
              Upload a package-lock.json, requirements.txt, or go.sum file to
              scan your dependencies for vulnerabilities, health issues, and
              supply chain anomalies.
            </p>
            <button
              onClick={() => setShowNewScan(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
            >
              <Plus className="h-4 w-4" />
              Run your first scan
            </button>
          </div>
        )}

        {/* Scan list */}
        {!loadingData && scans.length > 0 && (
          <div className="mt-4 space-y-3">
            {filtered.map((scan) => (
              <ScanCard key={scan.id} scan={scan} />
            ))}
            {filtered.length === 0 && (
              <div className="rounded-xl border border-white/5 bg-white/[.02] py-12 text-center text-sm text-slate-500">
                No projects match your filter.
              </div>
            )}
          </div>
        )}
      </div>

      {/* New scan modal */}
      {showNewScan && (
        <NewScanModal
          projects={projects}
          onClose={() => setShowNewScan(false)}
          onScanComplete={fetchData}
        />
      )}
    </div>
  );
}
