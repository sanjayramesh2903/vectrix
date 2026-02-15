export default function Terms() {
  return (
    <div className="relative min-h-screen bg-abyss pt-28 pb-24">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-tide">Legal</span>
          <h1 className="mt-3 font-display text-3xl font-bold text-text-primary sm:text-5xl">Terms of Service</h1>
          <p className="mt-4 text-sm text-text-muted">Last updated: February 14, 2026</p>
        </div>
        <div className="mt-12 space-y-8 text-sm leading-relaxed text-text-secondary">
          <section><h2 className="font-display text-lg font-semibold text-text-primary">1. Acceptance of Terms</h2><p className="mt-3">By accessing or using the Ripptide platform, you agree to be bound by these Terms of Service.</p></section>
          <section><h2 className="font-display text-lg font-semibold text-text-primary">2. Service Description</h2><p className="mt-3">Ripptide provides AI-powered dependency intelligence and supply chain security analysis including vulnerability scanning, health scoring, typosquatting detection, and anomaly analysis.</p></section>
          <section><h2 className="font-display text-lg font-semibold text-text-primary">3. Account Responsibilities</h2><p className="mt-3">You are responsible for maintaining the security of your account credentials and for all activity that occurs under your account.</p></section>
          <section><h2 className="font-display text-lg font-semibold text-text-primary">4. Acceptable Use</h2><p className="mt-3">You may not use Ripptide to scan dependencies you do not have rights to analyze, attempt to reverse-engineer our detection algorithms, or resell scan results without authorization.</p></section>
          <section><h2 className="font-display text-lg font-semibold text-text-primary">5. Limitation of Liability</h2><p className="mt-3">Ripptide provides security intelligence on a best-effort basis. We do not guarantee detection of all vulnerabilities or supply chain threats.</p></section>
          <section><h2 className="font-display text-lg font-semibold text-text-primary">6. Contact</h2><p className="mt-3">For questions about these terms, contact us at legal@ripptide.dev.</p></section>
        </div>
      </div>
    </div>
  );
}
