import { type ReactNode, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Book, Terminal, GitBranch, Shield, AlertTriangle, BarChart3, Zap, ChevronRight } from "lucide-react";

const sections = [
  { id: "getting-started", label: "Getting Started", icon: Book },
  { id: "cli", label: "CLI Reference", icon: Terminal },
  { id: "scanning", label: "Scanning", icon: Shield },
  { id: "vulnerabilities", label: "Vulnerability Checks", icon: AlertTriangle },
  { id: "health-scoring", label: "Health Scoring", icon: BarChart3 },
  { id: "ci-cd", label: "CI/CD Integration", icon: GitBranch },
  { id: "api", label: "API Reference", icon: Zap },
];

const docs: Record<string, { title: string; content: ReactNode }> = {
  "getting-started": {
    title: "Getting Started",
    content: (
      <div className="space-y-6">
        <p>Ripptide analyzes your software supply chain for vulnerabilities, health risks, typosquatting, and anomalous behavior. Get started in under 5 minutes.</p>
        <h3 className="font-display text-base font-semibold text-text-primary">1. Create an account</h3>
        <p>Sign up at <Link to="/signup" className="text-tide hover:underline">/signup</Link> with your email. You'll get access to the dashboard immediately.</p>
        <h3 className="font-display text-base font-semibold text-text-primary">2. Create a project</h3>
        <p>From the dashboard, click <span className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs">New scan</span> and create a project. Projects group scans by repository.</p>
        <h3 className="font-display text-base font-semibold text-text-primary">3. Upload a lockfile</h3>
        <p>Upload your <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs">package-lock.json</code>, <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs">requirements.txt</code>, <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs">go.sum</code>, or <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs">Cargo.lock</code>. Ripptide will parse it, resolve the full dependency tree, and run all checks.</p>
        <h3 className="font-display text-base font-semibold text-text-primary">4. Review findings</h3>
        <p>Findings are categorized as <span className="text-coral font-medium">critical</span>, <span className="text-amber font-medium">warning</span>, or <span className="text-tide font-medium">info</span>. Each includes actionable recommendations.</p>
        <h3 className="font-display text-base font-semibold text-text-primary">Supported ecosystems</h3>
        <div className="grid grid-cols-2 gap-3">
          {["npm / Node.js", "Python / PyPI", "Go modules", "Rust / Cargo"].map((eco) => (
            <div key={eco} className="flex items-center gap-2 rounded-lg border border-white/[.06] bg-white/[.02] px-3 py-2 text-sm text-text-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-tide" />{eco}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  cli: {
    title: "CLI Reference",
    content: (
      <div className="space-y-6">
        <p>The Ripptide CLI lets you scan dependencies from your terminal or CI pipeline.</p>
        <h3 className="font-display text-base font-semibold text-text-primary">Installation</h3>
        <pre className="overflow-x-auto rounded-xl border border-white/[.06] bg-abyss p-4 font-mono text-sm text-text-secondary"><code>npx ripptide scan</code></pre>
        <p>Or install globally:</p>
        <pre className="overflow-x-auto rounded-xl border border-white/[.06] bg-abyss p-4 font-mono text-sm text-text-secondary"><code>npm install -g ripptide</code></pre>
        <h3 className="font-display text-base font-semibold text-text-primary">Authentication</h3>
        <pre className="overflow-x-auto rounded-xl border border-white/[.06] bg-abyss p-4 font-mono text-sm text-text-secondary"><code>ripptide login &lt;your-api-token&gt;</code></pre>
        <p>Get your API token from <strong>Dashboard → Settings → API tokens</strong>.</p>
        <h3 className="font-display text-base font-semibold text-text-primary">Commands</h3>
        <div className="space-y-3">
          {[
            { cmd: "ripptide scan", desc: "Scan the current directory. Auto-detects lockfiles." },
            { cmd: "ripptide scan --file ./path/to/lockfile", desc: "Scan a specific lockfile." },
            { cmd: "ripptide scan --json", desc: "Output results as JSON for piping." },
            { cmd: "ripptide set-project <id>", desc: "Set the default project for scans." },
            { cmd: "ripptide help", desc: "Show all available commands." },
          ].map((c) => (
            <div key={c.cmd} className="rounded-lg border border-white/[.06] bg-white/[.02] p-3">
              <code className="font-mono text-sm text-tide">{c.cmd}</code>
              <p className="mt-1 text-sm text-text-muted">{c.desc}</p>
            </div>
          ))}
        </div>
        <h3 className="font-display text-base font-semibold text-text-primary">Environment variables</h3>
        <div className="space-y-2">
          {[
            { key: "RIPPTIDE_TOKEN", desc: "API token (alternative to `ripptide login`)" },
            { key: "RIPPTIDE_PROJECT", desc: "Default project ID" },
            { key: "RIPPTIDE_API_URL", desc: "Custom API endpoint for self-hosted" },
          ].map((v) => (
            <div key={v.key} className="flex items-start gap-3 text-sm"><code className="shrink-0 font-mono text-phosphor">{v.key}</code><span className="text-text-muted">{v.desc}</span></div>
          ))}
        </div>
      </div>
    ),
  },
  scanning: {
    title: "Scanning",
    content: (
      <div className="space-y-6">
        <p>When you trigger a scan — via the dashboard, CLI, or CI — Ripptide performs these steps in parallel:</p>
        <div className="space-y-4">
          {[
            { step: "1. Dependency resolution", desc: "Parse the lockfile and resolve the full transitive dependency tree, including version ranges and peer dependencies." },
            { step: "2. Vulnerability check", desc: "Query the OSV database for every package+version combination. Match against CVEs, GHSAs, and ecosystem-specific advisories." },
            { step: "3. Health scoring", desc: "Query package registries for maintenance signals: last publish date, download count, maintainer count, repository presence, deprecation status." },
            { step: "4. Anomaly detection", desc: "Run typosquatting analysis (Levenshtein distance against 100+ popular packages), install script analysis, and publish pattern analysis." },
            { step: "5. License audit", desc: "Extract license metadata and flag incompatible or missing licenses based on your project's policy." },
          ].map((s) => (
            <div key={s.step} className="rounded-lg border border-white/[.06] bg-white/[.02] p-4">
              <h4 className="font-display text-sm font-semibold text-text-primary">{s.step}</h4>
              <p className="mt-1 text-sm text-text-secondary">{s.desc}</p>
            </div>
          ))}
        </div>
        <p>All checks run in parallel — median scan time is <strong className="text-tide">140ms</strong> for typical lockfiles under 1000 dependencies.</p>
      </div>
    ),
  },
  vulnerabilities: {
    title: "Vulnerability Checks",
    content: (
      <div className="space-y-6">
        <p>Ripptide uses the <strong>Google OSV database</strong> as its primary vulnerability source, covering CVEs, GHSAs, and ecosystem-specific advisories across all supported package managers.</p>
        <h3 className="font-display text-base font-semibold text-text-primary">Data sources</h3>
        <ul className="list-inside space-y-1 text-sm text-text-secondary">
          <li>• <strong>OSV</strong> — Open Source Vulnerabilities database (Google)</li>
          <li>• <strong>NVD</strong> — National Vulnerability Database (NIST)</li>
          <li>• <strong>GHSA</strong> — GitHub Security Advisories</li>
          <li>• <strong>npm audit</strong> — npm ecosystem advisories</li>
          <li>• <strong>PyPI advisories</strong> — Python-specific advisories</li>
          <li>• <strong>RustSec</strong> — Rust advisory database</li>
        </ul>
        <h3 className="font-display text-base font-semibold text-text-primary">Severity classification</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3 rounded-lg border border-coral/20 bg-coral-wash p-3"><span className="font-mono text-sm font-bold text-coral">CRITICAL</span><span className="text-sm text-text-secondary">CVSS 9.0+, known exploits, malicious packages, active supply chain attacks</span></div>
          <div className="flex items-center gap-3 rounded-lg border border-amber/20 bg-amber-wash p-3"><span className="font-mono text-sm font-bold text-amber">WARNING</span><span className="text-sm text-text-secondary">CVSS 4.0–8.9, potential exploits, health concerns, suspicious patterns</span></div>
          <div className="flex items-center gap-3 rounded-lg border border-tide/20 bg-tide-wash p-3"><span className="font-mono text-sm font-bold text-tide">INFO</span><span className="text-sm text-text-secondary">CVSS below 4.0, informational advisories, minor maintenance flags</span></div>
        </div>
        <h3 className="font-display text-base font-semibold text-text-primary">Anomaly detection checks</h3>
        <ul className="list-inside space-y-1 text-sm text-text-secondary">
          <li>• <strong>Typosquatting</strong> — Levenshtein distance analysis against 100+ popular packages</li>
          <li>• <strong>Install scripts</strong> — Detection of curl/wget, eval, base64 decode, PowerShell, and obfuscated payloads</li>
          <li>• <strong>Maintainer changes</strong> — Flag sudden ownership transfers on critical packages</li>
          <li>• <strong>Publish pattern</strong> — Flag packages with no source repo or unusual publish cadence</li>
          <li>• <strong>Binary payloads</strong> — Detect unexpected native binaries or compiled artifacts</li>
        </ul>
      </div>
    ),
  },
  "health-scoring": {
    title: "Health Scoring",
    content: (
      <div className="space-y-6">
        <p>Every dependency receives a <strong>health score from 0–100</strong> based on multiple maintenance and community signals.</p>
        <h3 className="font-display text-base font-semibold text-text-primary">Scoring signals</h3>
        <div className="space-y-3">
          {[
            { signal: "Last publish recency", weight: "25%", desc: "How recently the package was published. Packages not updated in 2+ years score lower." },
            { signal: "Download volume", weight: "20%", desc: "Weekly downloads relative to ecosystem median. High adoption indicates community trust." },
            { signal: "Maintainer count", weight: "20%", desc: "Number of active maintainers. Single-maintainer packages have higher bus factor risk." },
            { signal: "Repository presence", weight: "15%", desc: "Whether the package links to a public source repository." },
            { signal: "Deprecation status", weight: "10%", desc: "Explicitly deprecated packages receive a significant penalty." },
            { signal: "Issue response time", weight: "10%", desc: "Median time to first response on issues (when data is available)." },
          ].map((s) => (
            <div key={s.signal} className="flex items-start gap-4 rounded-lg border border-white/[.06] bg-white/[.02] p-3">
              <span className="shrink-0 rounded bg-phosphor-wash px-2 py-0.5 font-mono text-xs text-phosphor">{s.weight}</span>
              <div><span className="text-sm font-medium text-text-primary">{s.signal}</span><p className="mt-0.5 text-sm text-text-muted">{s.desc}</p></div>
            </div>
          ))}
        </div>
        <h3 className="font-display text-base font-semibold text-text-primary">Score ranges</h3>
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div className="rounded-lg border border-seafoam/20 bg-seafoam-wash p-3"><div className="font-bold text-seafoam">80–100</div><div className="text-text-muted">Healthy</div></div>
          <div className="rounded-lg border border-amber/20 bg-amber-wash p-3"><div className="font-bold text-amber">40–79</div><div className="text-text-muted">Moderate risk</div></div>
          <div className="rounded-lg border border-coral/20 bg-coral-wash p-3"><div className="font-bold text-coral">0–39</div><div className="text-text-muted">High risk</div></div>
        </div>
      </div>
    ),
  },
  "ci-cd": {
    title: "CI/CD Integration",
    content: (
      <div className="space-y-6">
        <p>Add Ripptide to your CI pipeline to automatically scan every pull request.</p>
        <h3 className="font-display text-base font-semibold text-text-primary">GitHub Actions</h3>
        <pre className="overflow-x-auto rounded-xl border border-white/[.06] bg-abyss p-4 font-mono text-sm text-text-secondary"><code>{`name: Ripptide Scan
on: [push, pull_request]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Ripptide scan
        uses: ripptide/scan-action@v1
        with:
          token: \${{ secrets.RIPPTIDE_TOKEN }}
          project-id: \${{ secrets.RIPPTIDE_PROJECT }}
          fail-on-critical: "true"`}</code></pre>
        <h3 className="font-display text-base font-semibold text-text-primary">Action inputs</h3>
        <div className="space-y-2">
          {[
            { input: "token", desc: "Required. Your Ripptide API token.", req: true },
            { input: "project-id", desc: "Required. Project ID to associate the scan with.", req: true },
            { input: "file", desc: "Optional. Path to lockfile (auto-detected if not set).", req: false },
            { input: "fail-on-critical", desc: 'Optional. Fail the job on critical findings. Default: "true".', req: false },
          ].map((inp) => (
            <div key={inp.input} className="flex items-start gap-3 rounded-lg border border-white/[.06] bg-white/[.02] p-3 text-sm">
              <code className="shrink-0 font-mono text-tide">{inp.input}</code>
              <span className="text-text-muted">{inp.desc}</span>
              {inp.req && <span className="shrink-0 rounded bg-coral-wash px-1.5 py-0.5 text-xs text-coral">required</span>}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  api: {
    title: "API Reference",
    content: (
      <div className="space-y-6">
        <p>All API endpoints require a Bearer token in the Authorization header.</p>
        <pre className="overflow-x-auto rounded-xl border border-white/[.06] bg-abyss p-4 font-mono text-sm text-text-secondary"><code>Authorization: Bearer &lt;your-api-token&gt;</code></pre>
        <h3 className="font-display text-base font-semibold text-text-primary">Endpoints</h3>
        <div className="space-y-4">
          {[
            { method: "POST", path: "/api/scan", desc: "Trigger a new scan", body: "project_id, filename, content, branch?" },
            { method: "GET", path: "/api/scans", desc: "List all scans for the authenticated user", body: "—" },
            { method: "GET", path: "/api/scans?id=<id>", desc: "Get scan details with findings", body: "—" },
            { method: "GET", path: "/api/projects", desc: "List all projects", body: "—" },
            { method: "POST", path: "/api/projects", desc: "Create a new project", body: "name, repo_url?, ecosystem?" },
          ].map((ep) => (
            <div key={ep.path} className="rounded-lg border border-white/[.06] bg-white/[.02] p-4">
              <div className="flex items-center gap-2">
                <span className={`rounded px-1.5 py-0.5 font-mono text-xs font-bold ${ep.method === "POST" ? "bg-tide-wash text-tide" : "bg-phosphor-wash text-phosphor"}`}>{ep.method}</span>
                <code className="font-mono text-sm text-text-primary">{ep.path}</code>
              </div>
              <p className="mt-1 text-sm text-text-muted">{ep.desc}</p>
              {ep.body !== "—" && <p className="mt-1 text-xs text-text-muted">Body: <code className="text-text-secondary">{ep.body}</code></p>}
            </div>
          ))}
        </div>
        <h3 className="font-display text-base font-semibold text-text-primary">Rate limits</h3>
        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div className="rounded-lg border border-white/[.06] bg-white/[.02] p-3"><div className="font-bold text-text-primary">30/min</div><div className="text-text-muted">Starter</div></div>
          <div className="rounded-lg border border-white/[.06] bg-white/[.02] p-3"><div className="font-bold text-text-primary">100/min</div><div className="text-text-muted">Team</div></div>
          <div className="rounded-lg border border-white/[.06] bg-white/[.02] p-3"><div className="font-bold text-text-primary">Custom</div><div className="text-text-muted">Enterprise</div></div>
        </div>
      </div>
    ),
  },
};

export default function Docs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSection = searchParams.get("section") || "getting-started";
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const activeDoc = docs[activeSection] || docs["getting-started"];

  return (
    <div className="relative min-h-screen bg-abyss pt-20 pb-24">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-10" />

      <div className="relative mx-auto flex max-w-7xl gap-8 px-4 sm:px-6 lg:px-8">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24">
            <h3 className="font-display text-xs font-semibold uppercase tracking-widest text-text-muted">Documentation</h3>
            <nav className="mt-4 space-y-1">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSearchParams({ section: s.id })}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all ${
                    activeSection === s.id
                      ? "bg-tide-wash text-tide border border-tide/15"
                      : "text-text-secondary hover:text-text-primary hover:bg-white/[.03]"
                  }`}
                >
                  <s.icon className="h-4 w-4" />
                  {s.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile nav toggle */}
        <div className="lg:hidden">
          <button onClick={() => setMobileNavOpen(!mobileNavOpen)} className="mb-4 flex items-center gap-2 rounded-lg border border-white/8 bg-white/[.03] px-3 py-2 text-sm text-text-secondary">
            <ChevronRight className={`h-4 w-4 transition-transform ${mobileNavOpen ? "rotate-90" : ""}`} />
            {activeDoc.title}
          </button>
          {mobileNavOpen && (
            <nav className="mb-6 space-y-1 animate-tide-rise">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setSearchParams({ section: s.id }); setMobileNavOpen(false); }}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm ${activeSection === s.id ? "bg-tide-wash text-tide" : "text-text-secondary"}`}
                >
                  <s.icon className="h-4 w-4" />{s.label}
                </button>
              ))}
            </nav>
          )}
        </div>

        {/* Content */}
        <main className="min-w-0 flex-1">
          <div className="animate-tide-rise">
            <span className="font-mono text-xs font-medium uppercase tracking-widest text-tide">Docs</span>
            <h1 className="mt-2 font-display text-3xl font-bold text-text-primary">{activeDoc.title}</h1>
          </div>
          <div className="mt-8 text-text-secondary leading-relaxed">
            {activeDoc.content}
          </div>
        </main>
      </div>
    </div>
  );
}
