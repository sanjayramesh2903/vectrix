import { Shield, Eye, Zap, Users } from "lucide-react";

const values = [
  { icon: Shield, title: "Security first", description: "We believe every engineering team deserves enterprise-grade supply chain security — regardless of size or budget." },
  { icon: Eye, title: "Radical transparency", description: "Our detection logic, scoring algorithms, and data sources are documented in the open. No black boxes." },
  { icon: Zap, title: "Developer experience", description: "Security tools that slow teams down don't get used. We integrate into the workflows developers already have." },
  { icon: Users, title: "Community driven", description: "We contribute findings back to the OSV database and work with maintainers to fix issues upstream." },
];

export default function About() {
  return (
    <div className="relative min-h-screen bg-abyss pt-28 pb-24">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(167,139,250,0.05),transparent_50%)]" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-phosphor">Our mission</span>
          <h1 className="mt-3 font-display text-3xl font-bold text-text-primary sm:text-5xl">About Ripptide</h1>
          <p className="mt-4 text-lg text-text-secondary">We're building the intelligence layer that helps engineering teams understand and trust the open-source software they depend on.</p>
        </div>

        <div className="mt-12 space-y-6 text-text-secondary leading-relaxed">
          <p>Modern applications rely on hundreds — sometimes thousands — of open-source dependencies. Each one is a potential vector for vulnerabilities, supply chain attacks, and maintenance risk.</p>
          <p>Ripptide was founded by a team of security engineers and open-source contributors who saw firsthand how incidents like the xz Utils backdoor could compromise critical infrastructure through trusted software.</p>
          <p>We combine real-time vulnerability data from the OSV database with proprietary health scoring, typosquatting detection, and anomaly analysis to give teams a complete picture of their dependency risk — not just a list of CVEs.</p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {values.map((v, i) => (
            <div key={v.title} className={`glass rounded-2xl p-6 animate-tide-rise delay-${(i + 1) * 100}`}>
              <v.icon className="h-6 w-6 text-tide" />
              <h3 className="mt-3 font-display text-base font-semibold text-text-primary">{v.title}</h3>
              <p className="mt-2 text-sm text-text-secondary">{v.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
