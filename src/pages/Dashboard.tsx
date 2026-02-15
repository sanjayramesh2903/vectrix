import { useState, useEffect, useCallback, useRef } from "react";
import { Navigate } from "react-router-dom";
import {
  Shield, AlertTriangle, AlertCircle, CheckCircle2, Package,
  GitBranch, Clock, ChevronDown, ChevronRight, Search, Filter,
  Upload, Plus, X, Loader2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  listProjects, listScans, getScan, createProject, triggerScan,
  type Project, type ScanSummary, type Finding,
} from "../lib/api";

const severityConfig = {
  critical: { icon: AlertCircle, bg: "bg-coral-wash", text: "text-coral", border: "border-coral/20", badge: "bg-coral-wash text-coral border border-coral/15" },
  warning: { icon: AlertTriangle, bg: "bg-amber-wash", text: "text-amber", border: "border-amber/20", badge: "bg-amber-wash text-amber border border-amber/15" },
  info: { icon: CheckCircle2, bg: "bg-tide-wash", text: "text-tide", border: "border-tide/20", badge: "bg-tide-wash text-tide border border-tide/15" },
};

function FindingRow({ finding }: { finding: Finding }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = severityConfig[finding.severity];
  const Icon = cfg.icon;
  return (
    <div className={`rounded-lg border ${cfg.border} ${cfg.bg}`}>
      <button onClick={() => setExpanded(!expanded)} className="flex w-full items-center gap-3 px-4 py-3 text-left">
        <Icon className={`h-4 w-4 shrink-0 ${cfg.text}`} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-primary">{finding.package_name}@{finding.package_version}</span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${cfg.badge}`}>{finding.severity}</span>
            {finding.cve && <span className="text-xs text-text-muted">{finding.cve}</span>}
          </div>
          <p className="mt-0.5 truncate text-sm text-text-secondary">{finding.title}</p>
        </div>
        {expanded ? <ChevronDown className="h-4 w-4 shrink-0 text-text-muted" /> : <ChevronRight className="h-4 w-4 shrink-0 text-text-muted" />}
      </button>
      {expanded && (
        <div className="border-t border-white/5 px-4 py-3 text-sm">
          <p className="text-text-secondary">{finding.description}</p>
          <div className="mt-3 rounded-md bg-abyss/60 px-3 py-2">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-text-muted">Recommendation</span>
            <p className="mt-1 text-text-secondary">{finding.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ScanCard({ scan }: { scan: ScanSummary }) {
  const [expanded, setExpanded] = useState(false);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loadingFindings, setLoadingFindings] = useState(false);
  const ts = new Date(scan.started_at);
  const loadFindings = async () => { if (findings.length > 0 || loadingFindings) return; setLoadingFindings(true); try { const data = await getScan(scan.id); setFindings(data.findings); } catch {} setLoadingFindings(false); };
  const handleToggle = () => { if (!expanded) loadFindings(); setExpanded(!expanded); };
  const totalFindings = scan.critical_count + scan.warning_count + scan.info_count;
  const projectName = scan.projects?.name ?? "Unknown project";

  return (
    <div className="glass rounded-xl">
      <button onClick={handleToggle} className="flex w-full items-center gap-4 px-5 py-4 text-left">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-text-primary">{projectName}</span>
            <span className="flex items-center gap-1 rounded-full border border-white/8 bg-white/[.04] px-2 py-0.5 text-xs text-text-secondary"><GitBranch className="h-3 w-3" />{scan.branch}</span>
            {scan.status === "running" && <span className="flex items-center gap-1 rounded-full bg-phosphor-wash px-2 py-0.5 text-xs text-phosphor border border-phosphor/15"><Loader2 className="h-3 w-3 animate-spin" />Scanning</span>}
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-text-muted">
            <span className="flex items-center gap-1"><Package className="h-3 w-3" />{scan.total_deps} deps</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{ts.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {scan.critical_count > 0 && <span className="flex items-center gap-1 rounded-full bg-coral-wash px-2.5 py-1 text-xs font-medium text-coral"><AlertCircle className="h-3 w-3" />{scan.critical_count}</span>}
          {scan.warning_count > 0 && <span className="flex items-center gap-1 rounded-full bg-amber-wash px-2.5 py-1 text-xs font-medium text-amber"><AlertTriangle className="h-3 w-3" />{scan.warning_count}</span>}
          <span className="flex items-center gap-1 rounded-full bg-seafoam-wash px-2.5 py-1 text-xs font-medium text-seafoam"><CheckCircle2 className="h-3 w-3" />{scan.clean_count}</span>
          {expanded ? <ChevronDown className="h-4 w-4 text-text-muted" /> : <ChevronRight className="h-4 w-4 text-text-muted" />}
        </div>
      </button>
      {expanded && (
        <div className="border-t border-white/[.06] px-5 py-4">
          {loadingFindings && <div className="flex items-center justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-text-muted" /></div>}
          {!loadingFindings && findings.length > 0 && <div className="space-y-2">{findings.map((f) => <FindingRow key={f.id} finding={f} />)}</div>}
          {!loadingFindings && totalFindings === 0 && <div className="py-4 text-center text-sm text-text-muted">No findings for this scan. All dependencies passed checks.</div>}
        </div>
      )}
    </div>
  );
}

const modalInputClass = "mt-1 w-full rounded-xl border border-white/8 bg-white/[.03] px-4 py-2.5 text-sm text-text-primary placeholder-text-muted outline-none transition-all duration-200 focus:border-tide/40 focus:shadow-[0_0_20px_rgba(0,229,200,0.08)]";

function NewScanModal({ projects, onClose, onScanComplete }: { projects: Project[]; onClose: () => void; onScanComplete: () => void }) {
  const [step, setStep] = useState<"select" | "upload" | "scanning" | "done">(projects.length > 0 ? "select" : "upload");
  const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
  const [newProjectName, setNewProjectName] = useState("");
  const [creatingProject, setCreatingProject] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [result, setResult] = useState<{ total_deps: number; critical: number; warnings: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    setCreatingProject(true);
    try { const { project } = await createProject({ name: newProjectName.trim() }); setProjectId(project.id); setStep("select"); } catch (err) { setScanError((err as Error).message); }
    setCreatingProject(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !projectId) return;
    const supported = ["package-lock.json", "package.json", "requirements.txt", "go.sum", "Cargo.lock"];
    if (!supported.includes(file.name)) { setScanError(`Unsupported file: ${file.name}. Supported: ${supported.join(", ")}`); return; }
    setScanning(true); setScanError(null); setStep("scanning");
    try { const content = await file.text(); const data = await triggerScan({ project_id: projectId, filename: file.name, content }); setResult({ total_deps: data.total_deps, critical: data.critical, warnings: data.warnings }); setStep("done"); } catch (err) { setScanError((err as Error).message); setStep("select"); }
    setScanning(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="animate-tide-rise relative w-full max-w-md rounded-2xl border border-white/[.06] bg-deep p-6 shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-text-muted transition hover:text-text-primary"><X className="h-5 w-5" /></button>
        <h2 className="font-display text-lg font-semibold text-text-primary">New scan</h2>
        {scanError && <div className="mt-3 animate-slide-in rounded-xl border border-coral/20 bg-coral-wash px-3 py-2 text-sm text-coral">{scanError}</div>}

        {(step === "select" || step === "upload") && (
          <div className="mt-4 space-y-4">
            {projects.length > 0 && <div><label className="block text-sm font-medium text-text-secondary">Project</label><select value={projectId} onChange={(e) => setProjectId(e.target.value)} className={modalInputClass}>{projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>}
            <div className="flex items-end gap-2">
              <div className="flex-1"><label className="block text-sm font-medium text-text-secondary">{projects.length > 0 ? "Or create new project" : "Project name"}</label><input type="text" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} placeholder="my-app" className={modalInputClass} /></div>
              <button onClick={handleCreateProject} disabled={!newProjectName.trim() || creatingProject} className="rounded-xl border border-white/8 bg-white/[.04] px-3 py-2.5 text-text-secondary transition hover:border-tide/20 hover:text-text-primary disabled:opacity-50"><Plus className="h-4 w-4" /></button>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary">Upload lockfile</label>
              <p className="mt-1 text-xs text-text-muted">Supported: package-lock.json, package.json, requirements.txt, go.sum, Cargo.lock</p>
              <input ref={fileInputRef} type="file" accept=".json,.txt,.sum,.lock" onChange={handleFileUpload} className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} disabled={!projectId || scanning} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 bg-white/[.02] px-4 py-8 text-sm text-text-muted transition hover:border-tide/30 hover:bg-white/[.04] disabled:opacity-50"><Upload className="h-5 w-5" />Choose file or drag & drop</button>
            </div>
          </div>
        )}
        {step === "scanning" && (
          <div className="mt-6 flex flex-col items-center gap-3 py-8">
            <div className="relative"><div className="animate-ripple h-16 w-16 rounded-full border border-tide/20" /><Loader2 className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 animate-spin text-tide" /></div>
            <p className="mt-2 text-sm text-text-secondary">Analyzing dependencies, checking vulnerabilities, scoring health...</p>
          </div>
        )}
        {step === "done" && result && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2 text-seafoam"><CheckCircle2 className="h-5 w-5" /><span className="font-display font-medium">Scan complete</span></div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl border border-white/[.06] bg-white/[.03] p-3"><div className="text-xl font-bold text-text-primary">{result.total_deps}</div><div className="text-xs text-text-muted">Dependencies</div></div>
              <div className="rounded-xl border border-coral/15 bg-coral-wash p-3"><div className="text-xl font-bold text-coral">{result.critical}</div><div className="text-xs text-text-muted">Critical</div></div>
              <div className="rounded-xl border border-amber/15 bg-amber-wash p-3"><div className="text-xl font-bold text-amber">{result.warnings}</div><div className="text-xs text-text-muted">Warnings</div></div>
            </div>
            <button onClick={() => { onScanComplete(); onClose(); }} className="w-full rounded-xl bg-gradient-to-r from-tide to-phosphor py-2.5 text-sm font-bold text-abyss transition-all hover:shadow-[0_0_24px_rgba(0,229,200,0.3)]">View results</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [filterText, setFilterText] = useState("");
  const [scans, setScans] = useState<ScanSummary[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showNewScan, setShowNewScan] = useState(false);

  const fetchData = useCallback(async () => {
    try { const [s, p] = await Promise.all([listScans(), listProjects()]); setScans(s.scans); setProjects(p.projects); } catch {}
    setLoadingData(false);
  }, []);

  useEffect(() => { if (user) fetchData(); }, [user, fetchData]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-abyss">
      <div className="relative"><div className="animate-ripple h-20 w-20 rounded-full border border-tide/20" /><div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-tide animate-bioluminescence" /></div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;

  const totalCritical = scans.reduce((s, r) => s + r.critical_count, 0);
  const totalWarnings = scans.reduce((s, r) => s + r.warning_count, 0);
  const totalDeps = scans.reduce((s, r) => s + r.total_deps, 0);
  const filtered = scans.filter((s) => (s.projects?.name ?? "").toLowerCase().includes(filterText.toLowerCase()));

  return (
    <div className="relative min-h-screen bg-abyss pt-16">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-10" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,229,200,0.04),transparent_50%)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="animate-tide-rise">
            <h1 className="font-display text-2xl font-bold text-text-primary">Dashboard</h1>
            <p className="mt-1 text-sm text-text-secondary">{scans.length > 0 ? `Supply chain overview across ${projects.length} monitored project${projects.length !== 1 ? "s" : ""}.` : "Upload a lockfile to run your first dependency scan."}</p>
          </div>
          <button onClick={() => setShowNewScan(true)} className="animate-tide-rise inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-tide to-phosphor px-5 py-2.5 text-sm font-bold text-abyss transition-all hover:shadow-[0_0_24px_rgba(0,229,200,0.3)]"><Shield className="h-4 w-4" />New scan</button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total dependencies", value: totalDeps.toLocaleString(), icon: Package, color: "text-text-primary", glow: "" },
            { label: "Critical findings", value: totalCritical, icon: AlertCircle, color: "text-coral", glow: totalCritical > 0 ? "border-coral/20 bg-coral-wash" : "" },
            { label: "Warnings", value: totalWarnings, icon: AlertTriangle, color: "text-amber", glow: totalWarnings > 0 ? "border-amber/20 bg-amber-wash" : "" },
            { label: "Projects", value: projects.length, icon: GitBranch, color: "text-phosphor", glow: "" },
          ].map((stat, i) => (
            <div key={stat.label} className={`animate-tide-rise rounded-xl border border-white/[.06] bg-white/[.02] p-4 delay-${(i + 1) * 100} ${stat.glow}`}>
              <div className="flex items-center gap-2"><stat.icon className={`h-4 w-4 ${stat.color}`} /><span className="text-xs text-text-muted">{stat.label}</span></div>
              <div className={`mt-2 font-display text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        {scans.length > 0 && (
          <div className="mt-8 flex items-center gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" /><input type="text" placeholder="Filter projects..." value={filterText} onChange={(e) => setFilterText(e.target.value)} className="w-full rounded-xl border border-white/8 bg-white/[.03] py-2.5 pl-10 pr-3 text-sm text-text-primary placeholder-text-muted outline-none transition-all duration-200 focus:border-tide/40 focus:shadow-[0_0_20px_rgba(0,229,200,0.08)]" /></div>
            <button className="flex items-center gap-1.5 rounded-xl border border-white/8 bg-white/[.03] px-3 py-2.5 text-sm text-text-secondary transition hover:border-tide/20 hover:text-text-primary"><Filter className="h-4 w-4" />Filter</button>
          </div>
        )}

        {loadingData && <div className="mt-12 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-tide" /></div>}

        {!loadingData && scans.length === 0 && (
          <div className="mt-12 animate-tide-rise rounded-2xl border border-dashed border-white/10 bg-white/[.02] py-16 text-center">
            <div className="relative mx-auto h-16 w-16"><div className="animate-ripple absolute inset-0 rounded-full border border-tide/10" /><Upload className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-text-muted" /></div>
            <h3 className="mt-6 font-display text-lg font-semibold text-text-primary">No scans yet</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-text-secondary">Upload a lockfile to scan your dependencies for vulnerabilities, health issues, and supply chain anomalies.</p>
            <button onClick={() => setShowNewScan(true)} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-tide to-phosphor px-5 py-2.5 text-sm font-bold text-abyss transition-all hover:shadow-[0_0_24px_rgba(0,229,200,0.3)]"><Plus className="h-4 w-4" />Run your first scan</button>
          </div>
        )}

        {!loadingData && scans.length > 0 && (
          <div className="mt-4 space-y-3">
            {filtered.map((scan) => <ScanCard key={scan.id} scan={scan} />)}
            {filtered.length === 0 && <div className="glass rounded-xl py-12 text-center text-sm text-text-muted">No projects match your filter.</div>}
          </div>
        )}
      </div>
      {showNewScan && <NewScanModal projects={projects} onClose={() => setShowNewScan(false)} onScanComplete={fetchData} />}
    </div>
  );
}
