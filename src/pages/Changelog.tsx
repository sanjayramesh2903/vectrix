import { Tag } from "lucide-react";

interface Release {
  version: string;
  date: string;
  tag: "feature" | "improvement" | "fix";
  items: string[];
}

const releases: Release[] = [
  {
    version: "1.4.0",
    date: "2026-02-10",
    tag: "feature",
    items: [
      "Added Go module (go.sum) support for dependency scanning",
      "New anomaly detection engine for typosquatting packages",
      "Dashboard redesigned with real-time scan status",
    ],
  },
  {
    version: "1.3.2",
    date: "2026-01-28",
    tag: "fix",
    items: [
      "Fixed health score calculation for scoped npm packages",
      "Improved error handling in CLI authentication flow",
      "Resolved timeout issues on large lockfile scans (>2000 deps)",
    ],
  },
  {
    version: "1.3.0",
    date: "2026-01-20",
    tag: "feature",
    items: [
      "GitHub Action for CI/CD pipeline integration",
      "CLI tool with JSON output for automation",
      "Batch scanning support for monorepos",
    ],
  },
  {
    version: "1.2.0",
    date: "2026-01-06",
    tag: "improvement",
    items: [
      "Composite health scoring with bus factor analysis",
      "Expanded OSV vulnerability coverage",
      "API rate limiting increased to 100 requests/min on Team plan",
    ],
  },
  {
    version: "1.1.0",
    date: "2025-12-15",
    tag: "feature",
    items: [
      "Requirements.txt (Python) parsing support",
      "Vulnerability severity breakdown in scan results",
      "Email notifications for critical findings",
    ],
  },
];

const tagStyles = {
  feature: "bg-cyan-wash text-cyan-glow border-cyan-glow/15",
  improvement: "bg-violet-wash text-violet-glow border-violet-glow/15",
  fix: "bg-warning-wash text-warning border-warning/15",
};

export default function Changelog() {
  return (
    <div className="relative min-h-screen bg-void pt-28 pb-24">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,.05),transparent_50%)]" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-cyan-glow">
            What's new
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold text-text-primary sm:text-5xl">
            Changelog
          </h1>
          <p className="mt-4 text-text-secondary">
            New features, improvements, and fixes shipped to the Vectrix
            platform.
          </p>
        </div>

        <div className="mt-14 space-y-8">
          {releases.map((release, i) => (
            <div
              key={release.version}
              className={`glass rounded-2xl p-6 animate-float-up delay-${(i + 1) * 100}`}
            >
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-text-muted" />
                  <span className="font-mono text-sm font-semibold text-text-primary">
                    v{release.version}
                  </span>
                </div>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${tagStyles[release.tag]}`}
                >
                  {release.tag}
                </span>
                <span className="text-xs text-text-muted">
                  {new Date(release.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <ul className="mt-4 space-y-2">
                {release.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-text-secondary"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-glow/40" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
