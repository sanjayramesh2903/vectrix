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
  "Threat Analysis": "bg-red-500/10 text-red-300",
  Engineering: "bg-indigo-500/10 text-indigo-300",
  Research: "bg-emerald-500/10 text-emerald-300",
  Tutorial: "bg-amber-500/10 text-amber-300",
};

export default function Blog() {
  return (
    <div className="min-h-screen bg-slate-925 pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Blog</h1>
          <p className="mt-3 text-slate-400">
            Threat research, engineering deep dives, and practical guides for
            securing your software supply chain.
          </p>
        </div>

        <div className="mt-12 space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group block rounded-xl border border-white/5 bg-white/[.02] p-6 transition hover:border-indigo-500/20 hover:bg-white/[.04]"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    categoryColors[post.category] ?? "bg-white/10 text-slate-300"
                  }`}
                >
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  {post.readTime}
                </span>
                <span className="text-xs text-slate-600">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <h2 className="mt-3 text-lg font-semibold text-white group-hover:text-indigo-300">
                {post.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {post.excerpt}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm text-indigo-400 group-hover:text-indigo-300">
                Read more <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
