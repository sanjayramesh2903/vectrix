import { Clock, ArrowRight } from "lucide-react";

const posts = [
  {
    slug: "anatomy-of-supply-chain-attack",
    title: "Anatomy of a Supply Chain Attack: Lessons from xz Utils",
    excerpt: "A deep dive into how a trusted maintainer account was compromised to inject a backdoor into critical infrastructure.",
    date: "2026-02-10",
    readTime: "8 min",
    category: "Threat Analysis",
    categoryColor: "border-coral/20 bg-coral-wash text-coral",
  },
  {
    slug: "health-scoring-explained",
    title: "How Ripptide Scores Dependency Health",
    excerpt: "Bus factor, release cadence, issue response time — the signals we combine into a single composite health score.",
    date: "2026-01-28",
    readTime: "5 min",
    category: "Engineering",
    categoryColor: "border-phosphor/20 bg-phosphor-wash text-phosphor",
  },
  {
    slug: "typosquatting-detection",
    title: "Catching Typosquatters Before They Catch You",
    excerpt: "How Levenshtein distance and registry metadata analysis help Ripptide flag suspicious package names.",
    date: "2026-01-15",
    readTime: "6 min",
    category: "Research",
    categoryColor: "border-seafoam/20 bg-seafoam-wash text-seafoam",
  },
  {
    slug: "github-actions-setup",
    title: "Setting Up Ripptide in Your CI/CD Pipeline",
    excerpt: "A step-by-step guide to adding automated dependency scanning to your GitHub Actions workflow.",
    date: "2026-01-05",
    readTime: "4 min",
    category: "Tutorial",
    categoryColor: "border-amber/20 bg-amber-wash text-amber",
  },
  {
    slug: "2025-dependency-threat-report",
    title: "2025 Dependency Threat Report",
    excerpt: "Key findings from analyzing 2.4 million packages: attack trends, most targeted ecosystems, and what's coming next.",
    date: "2025-12-20",
    readTime: "12 min",
    category: "Research",
    categoryColor: "border-seafoam/20 bg-seafoam-wash text-seafoam",
  },
];

export default function Blog() {
  return (
    <div className="relative min-h-screen bg-abyss pt-28 pb-24">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,229,200,0.05),transparent_50%)]" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-tide">Blog</span>
          <h1 className="mt-3 font-display text-3xl font-bold text-text-primary sm:text-5xl">Insights & research</h1>
          <p className="mt-4 text-text-secondary">Supply chain security research, engineering deep dives, and product updates.</p>
        </div>

        <div className="mt-14 space-y-5">
          {posts.map((post, i) => (
            <article key={post.slug} className={`group glass rounded-2xl p-6 animate-tide-rise delay-${(i + 1) * 100}`}>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${post.categoryColor}`}>{post.category}</span>
                <span className="flex items-center gap-1 text-xs text-text-muted"><Clock className="h-3 w-3" />{post.readTime}</span>
                <span className="text-xs text-text-muted">{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
              <h2 className="mt-3 font-display text-lg font-semibold text-text-primary group-hover:text-tide transition-colors">{post.title}</h2>
              <p className="mt-2 text-sm text-text-secondary">{post.excerpt}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-tide opacity-0 transition-all group-hover:opacity-100">
                Read more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
