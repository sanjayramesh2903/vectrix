import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
}

const posts: Post[] = [
  {
    slug: "xz-utils-backdoor-explained",
    title: "The xz Utils Backdoor: What It Means for Software Supply Chain Security",
    excerpt:
      "A walkthrough of the xz Utils compromise — how a trusted maintainer account was used to inject a backdoor into a core Linux utility, and what it reveals about open-source trust models.",
    date: "2026-02-10",
    readTime: "8 min read",
    category: "Threat Analysis",
  },
  {
    slug: "dependency-health-scoring",
    title: "Beyond CVEs: Why Maintenance Health Matters More Than You Think",
    excerpt:
      "Most vulnerability scanners stop at CVE matching. We built a composite health scoring system that factors in commit frequency, bus factor, and release cadence to predict which dependencies will cause problems.",
    date: "2026-02-03",
    readTime: "6 min read",
    category: "Engineering",
  },
  {
    slug: "typosquatting-npm-2025",
    title: "We Found 47 Typosquatting Packages on npm This Month",
    excerpt:
      "Our anomaly detection engine flagged a cluster of packages mimicking popular libraries like axios, chalk, and lodash. Here's how the attacks work and how to protect your team.",
    date: "2026-01-28",
    readTime: "5 min read",
    category: "Research",
  },
  {
    slug: "secure-ci-pipeline-guide",
    title: "A Practical Guide to Securing Your CI/CD Pipeline Against Supply Chain Attacks",
    excerpt:
      "Step-by-step instructions for adding dependency scanning, artifact verification, and lockfile integrity checks to your GitHub Actions, GitLab CI, and Jenkins pipelines.",
    date: "2026-01-20",
    readTime: "10 min read",
    category: "Tutorial",
  },
  {
    slug: "open-source-bus-factor",
    title: "The Bus Factor Problem: 17% of Critical npm Packages Have a Single Maintainer",
    excerpt:
      "We analyzed the maintainer distribution across the top 10,000 npm packages. The results highlight a systemic risk in the open-source ecosystem that most teams ignore.",
    date: "2026-01-14",
    readTime: "7 min read",
    category: "Research",
  },
];

const categoryColors: Record<string, string> = {
  "Threat Analysis": "bg-danger-wash text-danger border-danger/15",
  Engineering: "bg-violet-wash text-violet-glow border-violet-glow/15",
  Research: "bg-success-wash text-success border-success/15",
  Tutorial: "bg-warning-wash text-warning border-warning/15",
};

export default function Blog() {
  return (
    <div className="relative min-h-screen bg-void pt-28 pb-24">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,.05),transparent_50%)]" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-cyan-glow">
            Insights
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold text-text-primary sm:text-5xl">
            Blog
          </h1>
          <p className="mt-4 text-text-secondary">
            Threat research, engineering deep dives, and practical guides for
            securing your software supply chain.
          </p>
        </div>

        <div className="mt-14 space-y-5">
          {posts.map((post, i) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className={`group glass block overflow-hidden rounded-2xl p-7 animate-float-up delay-${(i + 1) * 100}`}
            >
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full border px-3 py-0.5 text-xs font-medium ${
                    categoryColors[post.category] ?? "bg-white/5 text-text-secondary border-white/10"
                  }`}
                >
                  {post.category}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-text-muted">
                  <Clock className="h-3 w-3" />
                  {post.readTime}
                </span>
                <span className="text-xs text-text-muted">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <h2 className="mt-4 font-display text-lg font-semibold text-text-primary transition-colors group-hover:text-cyan-glow">
                {post.title}
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-text-secondary">
                {post.excerpt}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-glow transition-all group-hover:gap-2.5">
                Read more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
