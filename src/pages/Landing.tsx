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
import { useEffect, useRef } from "react";

/* ── Data ──────────────────────────────────────────────── */

const features = [
  {
    icon: GitBranch,
    title: "Deep Dependency Mapping",
    description:
      "Recursively resolve your entire dependency tree — direct and transitive — across npm, PyPI, Maven, Cargo crates, and Go modules.",
    accent: "from-tide/20 to-tide/0",
    iconColor: "text-tide",
  },
  {
    icon: AlertTriangle,
    title: "Anomaly Detection",
    description:
      "Flag suspicious patterns: sudden maintainer changes, obfuscated install scripts, typosquatting candidates, and unexpected binary payloads.",
    accent: "from-coral/20 to-coral/0",
    iconColor: "text-coral",
  },
  {
    icon: BarChart3,
    title: "Maintenance Health Scores",
    description:
      "Composite score based on commit frequency, issue response time, release cadence, and bus factor.",
    accent: "from-phosphor/20 to-phosphor/0",
    iconColor: "text-phosphor",
  },
  {
    icon: Zap,
    title: "CI/CD Integration",
    description:
      "Drop a single step into GitHub Actions, GitLab CI, or Jenkins. Block merges when risk thresholds are exceeded.",
    accent: "from-amber/20 to-amber/0",
    iconColor: "text-amber",
  },
  {
    icon: Lock,
    title: "License Compliance Engine",
    description:
      "Audit transitive license obligations. Define policies per project and get alerts before incompatible licenses enter your graph.",
    accent: "from-seafoam/20 to-seafoam/0",
    iconColor: "text-seafoam",
  },
  {
    icon: Terminal,
    title: "Remediation Playbooks",
    description:
      "Actionable upgrade paths, patch suggestions, and alternative package recommendations — not just CVE numbers.",
    accent: "from-tide/20 to-phosphor/0",
    iconColor: "text-tide",
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
    ctaLink: "/signup",
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
    ctaLink: "/signup",
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
    ctaLink: "/contact",
    highlight: false,
  },
];

const stats = [
  { value: "2.4M+", label: "Packages indexed" },
  { value: "140ms", label: "Median scan time" },
  { value: "99.97%", label: "Uptime SLA" },
  { value: "6,200+", label: "Teams protected" },
];

/* ── Ripple Card Mouse Tracker ─────────────────────────── */

function useRippleCards(containerRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const cards = container.querySelectorAll<HTMLElement>(".ripple-card");
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty("--mouse-x", `${x}%`);
        card.style.setProperty("--mouse-y", `${y}%`);
      });
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [containerRef]);
}

/* ── Component ─────────────────────────────────────────── */

export default function Landing() {
  const featuresRef = useRef<HTMLDivElement>(null);
  useRippleCards(featuresRef);

  return (
    <div className="bg-abyss text-text-primary">
      {/* ━━━━━━━━━━ HERO ━━━━━━━━━━ */}
      <section className="relative overflow-hidden pt-32 pb-24 sm:pt-44 sm:pb-32">
        {/* Background grid + ocean gradients */}
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,229,200,0.12),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_70%,rgba(167,139,250,0.07),transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_600px_at_20%_40%,rgba(0,229,200,0.04),transparent_60%)]" />

        {/* Ripple rings -- concentric circles expanding outward */}
        <div className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2">
          <div className="animate-ripple h-[28rem] w-[28rem] rounded-full border border-tide/[0.12]" />
          <div className="animate-ripple delay-400 absolute inset-0 h-[28rem] w-[28rem] rounded-full border border-tide/[0.09]" />
          <div className="animate-ripple delay-800 absolute inset-0 h-[28rem] w-[28rem] rounded-full border border-phosphor/[0.06]" />
        </div>

        {/* Floating bioluminescent orbs */}
        <div className="pointer-events-none absolute left-[10%] top-[18%] h-56 w-56 animate-current rounded-full bg-tide/[0.03] blur-3xl" />
        <div className="pointer-events-none absolute right-[8%] top-[25%] h-72 w-72 animate-current delay-300 rounded-full bg-phosphor/[0.04] blur-3xl" />
        <div className="pointer-events-none absolute left-[55%] bottom-[10%] h-40 w-40 animate-current delay-700 rounded-full bg-tide/[0.025] blur-2xl" />
        <div className="pointer-events-none absolute left-[30%] top-[60%] h-24 w-24 animate-current delay-1000 rounded-full bg-phosphor/[0.03] blur-xl" />
        <div className="pointer-events-none absolute right-[25%] top-[15%] h-32 w-32 animate-current delay-500 rounded-full bg-tide/[0.02] blur-2xl" />

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
          {/* Badge */}
          <div className="animate-tide-rise mb-6 inline-flex items-center gap-2.5 rounded-full border border-tide/15 bg-tide-wash px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-tide animate-bioluminescence" />
            <span className="font-mono text-xs font-medium text-tide">
              Now scanning Cargo crates &amp; Go modules
            </span>
          </div>

          {/* Heading */}
          <h1 className="animate-tide-rise delay-100 font-display text-5xl font-extrabold leading-[1.08] tracking-tight sm:text-7xl">
            Know what lurks in your
            <br />
            <span className="bg-gradient-to-r from-tide via-tide to-phosphor bg-clip-text text-transparent text-glow-tide">
              software supply chain
            </span>
          </h1>

          {/* Subheading */}
          <p className="animate-tide-rise delay-200 mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-text-secondary">
            Ripptide uses AI to continuously analyze your dependency graph —
            surfacing security risks, license conflicts, and maintenance red
            flags before they reach production.
          </p>

          {/* CTAs */}
          <div className="animate-tide-rise delay-300 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/signup"
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r from-tide to-phosphor px-7 py-3.5 text-sm font-bold text-abyss transition-all hover:shadow-[0_0_40px_rgba(0,229,200,0.4),0_0_80px_rgba(167,139,250,0.15)]"
            >
              <span className="relative z-10 flex items-center gap-2.5">
                Start free trial
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
            <Link
              to="/docs"
              className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-7 py-3.5 text-sm font-medium text-text-secondary transition-all hover:border-tide/20 hover:text-text-primary hover:bg-white/[0.05]"
            >
              Read the docs
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ STATS BAR ━━━━━━━━━━ */}
      <section className="relative border-y border-white/[0.04]">
        <div className="absolute inset-0 animate-shimmer" />
        <div className="relative mx-auto grid max-w-5xl grid-cols-2 gap-6 px-4 py-12 sm:grid-cols-4 sm:px-6">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`animate-tide-rise text-center delay-${(i + 1) * 100}`}
            >
              <div className="font-display text-3xl font-extrabold text-text-primary sm:text-4xl">
                {s.value}
              </div>
              <div className="mt-1.5 text-sm text-text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━━━━━━━━ FEATURES ━━━━━━━━━━ */}
      <section id="features" className="relative py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(167,139,250,0.04),transparent_70%)]" />

        <div ref={featuresRef} className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="font-mono text-xs font-medium uppercase tracking-widest text-tide">
              Capabilities
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-5xl">
              Built for the way you ship software
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
              From the first dependency you install to the container you deploy,
              Ripptide provides continuous visibility into your supply chain risk.
            </p>
          </div>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`group glass ripple-card relative overflow-hidden rounded-2xl p-6 animate-tide-rise delay-${(i + 1) * 100}`}
              >
                {/* Hover gradient overlay */}
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${f.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                />

                <div className="relative">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border border-white/8 bg-white/[0.03] ${f.iconColor}`}
                  >
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

      {/* ━━━━━━━━━━ TERMINAL PREVIEW ━━━━━━━━━━ */}
      <section className="relative border-y border-white/[0.04] py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_right,rgba(0,229,200,0.04),transparent_50%)]" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left -- description + bullet points */}
            <div>
              <span className="font-mono text-xs font-medium uppercase tracking-widest text-tide">
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
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-seafoam/10">
                      <Check className="h-3 w-3 text-seafoam" />
                    </div>
                    <span className="text-sm text-text-secondary">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right -- terminal */}
            <div className="glass glow-tide overflow-hidden rounded-2xl">
              {/* Title bar */}
              <div className="flex items-center gap-2 border-b border-white/[0.04] px-5 py-3.5">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-coral/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-seafoam/60" />
                </div>
                <span className="ml-2 font-mono text-xs text-text-muted">
                  ~/acme/payments-service
                </span>
              </div>
              {/* Terminal content */}
              <pre className="overflow-x-auto px-5 py-5 font-mono text-[13px] leading-relaxed text-text-secondary">
                <code>
                  <span className="text-text-muted">$</span>{" "}
                  <span className="text-tide">npx ripptide scan</span>
                  {`

  `}<span className="text-text-muted">Resolving dependency graph...</span>{" "}<span className="text-seafoam">done</span>{` (1,247 packages)
  `}<span className="text-text-muted">Running anomaly detection...</span>{" "}<span className="text-seafoam">done</span>{`

  `}<span className="text-tide">{"┌─────────────────────────────────────────┐"}</span>{`
  `}<span className="text-tide">{"│"}</span>{" "}<span className="text-coral font-semibold">3 critical</span>{"   "}<span className="text-amber font-semibold">12 warning</span>{"   "}<span className="text-seafoam font-semibold">1,232 ok</span>{" "}<span className="text-tide">{"│"}</span>{`
  `}<span className="text-tide">{"└─────────────────────────────────────────┘"}</span>{`

  `}<span className="font-semibold text-coral">CRITICAL</span>{`  colors@1.4.1
    `}<span className="text-text-secondary">{"→"} Maintainer pushed malicious payload</span>{`
    `}<span className="text-text-muted">{"→"} Recommendation: pin to 1.4.0</span>{`

  `}<span className="font-semibold text-coral">CRITICAL</span>{`  event-stream@3.3.6
    `}<span className="text-text-secondary">{"→"} Obfuscated crypto-mining payload</span>{`
    `}<span className="text-text-muted">{"→"} Recommendation: upgrade to 4.0.1</span>{`

  `}<span className="font-semibold text-amber">WARNING</span>{`   lodash@4.17.19
    `}<span className="text-text-secondary">{"→"} 2 unpatched prototype pollution CVEs</span>{`
    `}<span className="text-text-muted">{"→"} Recommendation: upgrade to 4.17.21</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ PRICING ━━━━━━━━━━ */}
      <section id="pricing" className="relative py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,229,200,0.04),transparent_60%)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="font-mono text-xs font-medium uppercase tracking-widest text-tide">
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
                    ? "glass glow-tide-strong animate-border-pulse"
                    : "glass"
                }`}
              >
                {tier.highlight && (
                  <span className="absolute -top-3 left-5 rounded-full bg-gradient-to-r from-tide to-phosphor px-4 py-0.5 text-xs font-bold text-abyss">
                    Most popular
                  </span>
                )}
                <h3 className="font-display text-lg font-semibold">
                  {tier.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  {tier.price === "Custom" ? (
                    <span className="font-display text-4xl font-extrabold">
                      Custom
                    </span>
                  ) : (
                    <>
                      <span className="font-display text-4xl font-extrabold">
                        ${tier.price}
                      </span>
                      <span className="text-sm text-text-muted">/mo</span>
                    </>
                  )}
                </div>
                <p className="mt-3 text-sm text-text-secondary">
                  {tier.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-tide/10">
                        <Check className="h-2.5 w-2.5 text-tide" />
                      </div>
                      <span className="text-text-secondary">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={tier.ctaLink}
                  className={`mt-7 block rounded-xl py-3 text-center text-sm font-semibold transition-all ${
                    tier.highlight
                      ? "bg-gradient-to-r from-tide to-phosphor text-abyss hover:shadow-[0_0_32px_rgba(0,229,200,0.35)]"
                      : "border border-white/8 bg-white/[0.03] text-text-secondary hover:border-tide/20 hover:text-text-primary"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━ CTA ━━━━━━━━━━ */}
      <section className="relative border-t border-white/[0.04] py-24 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,229,200,0.06),transparent_50%)]" />

        {/* Ripple animation in background */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="animate-ripple h-56 w-56 rounded-full border border-tide/10" />
          <div className="animate-ripple delay-500 absolute inset-0 h-56 w-56 rounded-full border border-tide/[0.06]" />
          <div className="animate-ripple delay-1000 absolute inset-0 h-56 w-56 rounded-full border border-phosphor/[0.04]" />
        </div>

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          {/* Bioluminescent dot */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-tide/20 bg-tide-wash">
            <div className="h-3 w-3 rounded-full bg-tide animate-bioluminescence" />
          </div>

          <h2 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-5xl">
            Stop shipping blind
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-text-secondary">
            Join thousands of engineering teams using Ripptide to secure their
            software supply chain. Set up in under five minutes.
          </p>
          <Link
            to="/signup"
            className="group mt-8 inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-tide to-phosphor px-8 py-3.5 text-sm font-bold text-abyss transition-all hover:shadow-[0_0_40px_rgba(0,229,200,0.4),0_0_80px_rgba(167,139,250,0.15)]"
          >
            Start your free trial
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
