import { Link } from "react-router-dom";
import {
  Shield,
  GitBranch,
  BarChart3,
  AlertTriangle,
  Zap,
  Lock,
  ArrowRight,
  Check,
  Terminal,
} from "lucide-react";

const features = [
  {
    icon: GitBranch,
    title: "Deep Dependency Mapping",
    description:
      "Recursively resolve your entire dependency tree — direct and transitive — across npm, PyPI, Maven, and Go modules. Surface hidden relationships other scanners miss.",
  },
  {
    icon: AlertTriangle,
    title: "Anomaly Detection",
    description:
      "Our models flag suspicious patterns: sudden maintainer changes, obfuscated install scripts, typosquatting candidates, and unexpected binary payloads in packages.",
  },
  {
    icon: BarChart3,
    title: "Maintenance Health Scores",
    description:
      "Each dependency gets a composite score based on commit frequency, issue response time, release cadence, and bus factor — so you know what's actually maintained.",
  },
  {
    icon: Zap,
    title: "CI/CD Integration",
    description:
      "Drop a single step into GitHub Actions, GitLab CI, or Jenkins. Scans run on every PR and block merges when risk thresholds are exceeded.",
  },
  {
    icon: Lock,
    title: "License Compliance Engine",
    description:
      "Automatically audit transitive license obligations. Define policies per project and get alerts before incompatible licenses enter your dependency graph.",
  },
  {
    icon: Terminal,
    title: "Remediation Playbooks",
    description:
      "Get actionable upgrade paths, patch suggestions, and alternative package recommendations — not just CVE numbers and severity labels.",
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

export default function Landing() {
  return (
    <div className="bg-slate-925 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,.15),transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            Now scanning Go modules &amp; Cargo crates
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Know what's in your
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              software supply chain
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
            Vectrix uses AI to continuously analyze your dependency graph —
            surfacing security risks, license conflicts, and maintenance red
            flags before they reach production.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-indigo-500"
            >
              Start free trial
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://docs.vectrix.dev"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-6 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5"
            >
              Read the docs
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/5 bg-white/[.02]">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4 sm:px-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold text-white sm:text-3xl">
                {s.value}
              </div>
              <div className="mt-1 text-sm text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Built for the way you ship software
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-400">
              From the first dependency you install to the container you deploy,
              Vectrix provides continuous visibility into your supply chain risk.
            </p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-white/5 bg-white/[.02] p-6 transition hover:border-indigo-500/20 hover:bg-white/[.04]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                  <f.icon className="h-5 w-5 text-indigo-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code preview */}
      <section className="border-y border-white/5 bg-white/[.02] py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                One command to scan
              </h2>
              <p className="mt-4 text-slate-400">
                Install the CLI, authenticate, and run your first scan in under
                a minute. Results stream to your dashboard in real time.
              </p>
              <div className="mt-6 space-y-3 text-sm text-slate-300">
                {[
                  "Works with monorepos and multi-language projects",
                  "Runs locally or in CI — no code leaves your network",
                  "Diff-aware scanning on pull requests",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-900 font-mono text-sm">
              <div className="flex items-center gap-1.5 border-b border-white/5 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                <span className="ml-2 text-xs text-slate-500">terminal</span>
              </div>
              <pre className="overflow-x-auto px-4 py-4 leading-relaxed text-slate-300">
                <code>{`$ npx vectrix scan

  Resolving dependency graph... done (1,247 packages)
  Running anomaly detection... done

  ┌─────────────────────────────────────┐
  │ 3 critical   12 warning   1,232 ok │
  └─────────────────────────────────────┘

  CRITICAL  colors@1.4.1
    → Maintainer pushed malicious payload in v1.4.1
    → Recommendation: pin to 1.4.0 or migrate to picocolors

  CRITICAL  event-stream@3.3.6
    → Transitive dependency flatmap-stream contains
      obfuscated crypto-mining payload
    → Recommendation: upgrade to event-stream@4.0.1

  WARNING   lodash@4.17.19
    → 2 unpatched prototype pollution CVEs
    → Recommendation: upgrade to 4.17.21

  Full report → https://app.vectrix.dev/scans/a7f3e9`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              Start free, scale as your team grows. All plans include core
              scanning and anomaly detection.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-xl border p-6 ${
                  tier.highlight
                    ? "border-indigo-500/40 bg-indigo-500/[.05]"
                    : "border-white/5 bg-white/[.02]"
                }`}
              >
                {tier.highlight && (
                  <span className="absolute -top-3 left-4 rounded-full bg-indigo-600 px-3 py-0.5 text-xs font-medium text-white">
                    Most popular
                  </span>
                )}
                <h3 className="text-lg font-semibold">{tier.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  {tier.price === "Custom" ? (
                    <span className="text-3xl font-bold">Custom</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold">${tier.price}</span>
                      <span className="text-sm text-slate-500">/mo</span>
                    </>
                  )}
                </div>
                <p className="mt-3 text-sm text-slate-400">{tier.description}</p>
                <ul className="mt-5 space-y-2.5">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-slate-300"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to={tier.name === "Enterprise" ? "#" : "/signup"}
                  className={`mt-6 block rounded-lg py-2.5 text-center text-sm font-medium transition ${
                    tier.highlight
                      ? "bg-indigo-600 text-white hover:bg-indigo-500"
                      : "bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5 bg-white/[.02] py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Shield className="mx-auto h-10 w-10 text-indigo-400" />
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Stop shipping blind
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Join thousands of engineering teams using Vectrix to secure their
            software supply chain. Set up in under five minutes.
          </p>
          <Link
            to="/signup"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            Start your free trial
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
