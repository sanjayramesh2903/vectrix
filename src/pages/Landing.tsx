import { Link } from "react-router-dom";
import {
  GitBranch,
  BarChart3,
  AlertTriangle,
  Zap,
  Lock,
  ArrowRight,
  Check,
  Terminal,
} from "lucide-react";

/* ── Data ──────────────────────────────────────────────── */

const features = [
  {
    icon: GitBranch,
    title: "Deep Dependency Mapping",
    description:
      "Recursively resolve your entire dependency tree — direct and transitive — across npm, PyPI, Maven, and Go modules.",
    accent: "from-cyan-glow/20 to-cyan-glow/0",
    iconColor: "text-cyan-glow",
  },
  {
    icon: AlertTriangle,
    title: "Anomaly Detection",
    description:
      "Flag suspicious patterns: sudden maintainer changes, obfuscated install scripts, typosquatting candidates, and unexpected binary payloads.",
    accent: "from-danger/20 to-danger/0",
    iconColor: "text-danger",
  },
  {
    icon: BarChart3,
    title: "Maintenance Health Scores",
    description:
      "Composite score based on commit frequency, issue response time, release cadence, and bus factor.",
    accent: "from-violet-glow/20 to-violet-glow/0",
    iconColor: "text-violet-glow",
  },
  {
    icon: Zap,
    title: "CI/CD Integration",
    description:
      "Drop a single step into GitHub Actions, GitLab CI, or Jenkins. Block merges when risk thresholds are exceeded.",
    accent: "from-warning/20 to-warning/0",
    iconColor: "text-warning",
  },
  {
    icon: Lock,
    title: "License Compliance Engine",
    description:
      "Audit transitive license obligations. Define policies per project and get alerts before incompatible licenses enter your graph.",
    accent: "from-success/20 to-success/0",
    iconColor: "text-success",
  },
  {
    icon: Terminal,
    title: "Remediation Playbooks",
    description:
      "Actionable upgrade paths, patch suggestions, and alternative package recommendations — not just CVE numbers.",
    accent: "from-cyan-glow/20 to-violet-glow/0",
    iconColor: "text-cyan-glow",
  },
];

const tiers = [
  {
    name: "Starter",
    price: "0",
    description: "For individual developers and small open-source projects.",
    features: [
      "Up to 3 repositories",
      "Weekly dependency scans",
      "Basic anomaly alerts",
      "Community support",
    ],
    cta: "Get started",
    highlight: false,
  },
  {
    name: "Team",
    price: "49",
    description: "For growing engineering teams shipping production software.",
    features: [
      "Unlimited repositories",
      "Real-time continuous scanning",
      "CI/CD pipeline integration",
      "License compliance engine",
      "Slack & Teams notifications",
      "Priority support",
    ],
    cta: "Start free trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organizations with strict compliance and audit requirements.",
    features: [
      "Everything in Team",
      "SSO / SAML authentication",
      "Dedicated tenant isolation",
      "Custom policy engine",
      "SLA-backed support",
      "Quarterly threat briefings",
    ],
    cta: "Contact sales",
    highlight: false,
  },
];

const stats = [
  { value: "2.4M+", label: "Packages indexed" },
  { value: "140ms", label: "Median scan time" },
  { value: "99.97%", label: "Uptime SLA" },
  { value: "6,200+", label: "Teams protected" },
];

/* ── Component ─────────────────────────────────────────── */

export default function Landing() {
  return (
    <div className="bg-void text-text-primary">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-32 pb-24 sm:pt-44 sm:pb-32">
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,.08),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(124,92,252,.06),transparent_50%)]" />

        {/* Radar rings */}
        <div className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2">
          <div className="animate-radar h-64 w-64 rounded-full border border-cyan-glow/20" />
          <div className="animate-radar delay-1000 absolute inset-0 h-64 w-64 rounded-full border border-cyan-glow/15" />
          <div className="animate-radar delay-200 absolute inset-0 h-64 w-64 rounded-full border border-violet-glow/10" />
        </div>

        {/* Floating orbs */}
        <div className="pointer-events-none absolute left-[15%] top-[20%] h-48 w-48 animate-drift rounded-full bg-cyan-glow/[.03] blur-3xl" />
        <div className="pointer-events-none absolute right-[10%] top-[30%] h-64 w-64 animate-drift delay-400 rounded-full bg-violet-glow/[.03] blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
          {/* Badge */}
          <div className="animate-float-up mb-6 inline-flex items-center gap-2.5 rounded-full border border-cyan-glow/15 bg-cyan-wash px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-glow animate-glow-pulse" />
            <span className="font-mono text-xs font-medium text-cyan-glow">
              Now scanning Go modules &amp; Cargo crates
            </span>
          </div>

          {/* Heading */}
          <h1 className="animate-float-up delay-100 font-display text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-7xl">
            Know what's in your
            <br />
            <span className="bg-gradient-to-r from-cyan-glow via-cyan-glow to-violet-glow bg-clip-text text-transparent text-glow-cyan">
              software supply chain
            </span>
          </h1>

          {/* Subheading */}
          <p className="animate-float-up delay-200 mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-text-secondary">
            Vectrix uses AI to continuously analyze your dependency graph —
            surfacing security risks, license conflicts, and maintenance red
            flags before they reach production.
          </p>

          {/* CTAs */}
          <div className="animate-float-up delay-300 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/signup"
              className="group inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-glow to-violet-glow px-7 py-3.5 text-sm font-bold text-void transition-all hover:shadow-[0_0_32px_rgba(0,212,255,0.35)]"
            >
              Start free trial
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="https://docs.vectrix.dev"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-white/[.03] px-7 py-3.5 text-sm font-medium text-text-secondary transition-all hover:border-cyan-glow/20 hover:text-text-primary"
            >
              Read the docs
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="relative border-y border-white/[.04]">
        <div className="absolute inset-0 animate-shimmer" />
        <div className="relative mx-auto grid max-w-5xl grid-cols-2 gap-6 px-4 py-12 sm:grid-cols-4 sm:px-6">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`animate-float-up text-center delay-${(i + 1) * 100}`}
            >
              <div className="font-display text-3xl font-extrabold text-text-primary sm:text-4xl">
                {s.value}
              </div>
              <div className="mt-1.5 text-sm text-text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="relative py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,92,252,.04),transparent_70%)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="font-mono text-xs font-medium uppercase tracking-widest text-cyan-glow">
              Capabilities
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-5xl">
              Built for the way you ship software
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
              From the first dependency you install to the container you deploy,
              Vectrix provides continuous visibility into your supply chain risk.
            </p>
          </div>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`group glass relative overflow-hidden rounded-2xl p-6 animate-float-up delay-${(i + 1) * 100}`}
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${f.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                />

                <div className="relative">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl border border-white/8 bg-white/[.03] ${f.iconColor}`}>
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold text-text-primary">
                    {f.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-text-secondary">
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TERMINAL PREVIEW ── */}
      <section className="relative border-y border-white/[.04] py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="font-mono text-xs font-medium uppercase tracking-widest text-cyan-glow">
                Developer experience
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                One command to scan
              </h2>
              <p className="mt-4 text-text-secondary">
                Install the CLI, authenticate, and run your first scan in under
                a minute. Results stream to your dashboard in real time.
              </p>
              <div className="mt-7 space-y-3.5">
                {[
                  "Works with monorepos and multi-language projects",
                  "Runs locally or in CI — no code leaves your network",
                  "Diff-aware scanning on pull requests",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/10">
                      <Check className="h-3 w-3 text-success" />
                    </div>
                    <span className="text-sm text-text-secondary">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass glow-cyan overflow-hidden rounded-2xl">
              <div className="flex items-center gap-2 border-b border-white/[.04] px-5 py-3.5">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-danger/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
                </div>
                <span className="ml-2 font-mono text-xs text-text-muted">
                  ~/acme/payments-service
                </span>
              </div>
              <pre className="overflow-x-auto px-5 py-5 font-mono text-[13px] leading-relaxed text-text-secondary">
                <code>
                  <span className="text-text-muted">$</span>{" "}
                  <span className="text-cyan-glow">npx vectrix scan</span>
                  {`

  `}<span className="text-text-muted">Resolving dependency graph...</span>{" "}<span className="text-success">done</span>{` (1,247 packages)
  `}<span className="text-text-muted">Running anomaly detection...</span>{" "}<span className="text-success">done</span>{`

  ┌─────────────────────────────────────────┐
  │ `}<span className="text-danger font-semibold">3 critical</span>{"   "}<span className="text-warning font-semibold">12 warning</span>{"   "}<span className="text-success font-semibold">1,232 ok</span>{` │
  └─────────────────────────────────────────┘

  `}<span className="font-semibold text-danger">CRITICAL</span>{`  colors@1.4.1
    → Maintainer pushed malicious payload
    → `}<span className="text-text-muted">Recommendation: pin to 1.4.0</span>{`

  `}<span className="font-semibold text-danger">CRITICAL</span>{`  event-stream@3.3.6
    → Obfuscated crypto-mining payload
    → `}<span className="text-text-muted">Recommendation: upgrade to 4.0.1</span>{`

  `}<span className="font-semibold text-warning">WARNING</span>{`   lodash@4.17.19
    → 2 unpatched prototype pollution CVEs
    → `}<span className="text-text-muted">Recommendation: upgrade to 4.17.21</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="relative py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,212,255,.04),transparent_60%)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="font-mono text-xs font-medium uppercase tracking-widest text-cyan-glow">
              Pricing
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-5xl">
              Simple, transparent pricing
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-text-secondary">
              Start free, scale as your team grows. All plans include core
              scanning and anomaly detection.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl p-7 transition-all duration-300 ${
                  tier.highlight
                    ? "glass glow-cyan-strong animate-border-glow"
                    : "glass"
                }`}
              >
                {tier.highlight && (
                  <span className="absolute -top-3 left-5 rounded-full bg-gradient-to-r from-cyan-glow to-violet-glow px-4 py-0.5 text-xs font-bold text-void">
                    Most popular
                  </span>
                )}
                <h3 className="font-display text-lg font-semibold">{tier.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  {tier.price === "Custom" ? (
                    <span className="font-display text-4xl font-extrabold">Custom</span>
                  ) : (
                    <>
                      <span className="font-display text-4xl font-extrabold">${tier.price}</span>
                      <span className="text-sm text-text-muted">/mo</span>
                    </>
                  )}
                </div>
                <p className="mt-3 text-sm text-text-secondary">{tier.description}</p>
                <ul className="mt-6 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cyan-glow/10">
                        <Check className="h-2.5 w-2.5 text-cyan-glow" />
                      </div>
                      <span className="text-text-secondary">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={tier.name === "Enterprise" ? "#" : "/signup"}
                  className={`mt-7 block rounded-xl py-3 text-center text-sm font-semibold transition-all ${
                    tier.highlight
                      ? "bg-gradient-to-r from-cyan-glow to-violet-glow text-void hover:shadow-[0_0_24px_rgba(0,212,255,0.3)]"
                      : "border border-white/8 bg-white/[.03] text-text-secondary hover:border-cyan-glow/20 hover:text-text-primary"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative border-t border-white/[.04] py-24 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,.06),transparent_50%)]" />

        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="animate-radar h-48 w-48 rounded-full border border-cyan-glow/10" />
        </div>

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-glow/20 bg-cyan-wash">
            <div className="h-3 w-3 rounded-full bg-cyan-glow animate-glow-pulse" />
          </div>
          <h2 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-5xl">
            Stop shipping blind
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-text-secondary">
            Join thousands of engineering teams using Vectrix to secure their
            software supply chain. Set up in under five minutes.
          </p>
          <Link
            to="/signup"
            className="group mt-8 inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-glow to-violet-glow px-8 py-3.5 text-sm font-bold text-void transition-all hover:shadow-[0_0_32px_rgba(0,212,255,0.35)]"
          >
            Start your free trial
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
