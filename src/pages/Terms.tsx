export default function Terms() {
  return (
    <div className="relative min-h-screen bg-void pt-28 pb-24">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-cyan-glow">
            Legal
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold text-text-primary sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-sm text-text-muted">Last updated: February 14, 2026</p>
        </div>

        <div className="mt-12 space-y-8 text-sm leading-relaxed text-text-secondary">
          <section>
            <h2 className="font-display text-lg font-semibold text-text-primary">1. Acceptance of Terms</h2>
            <p className="mt-3">
              By accessing or using the Vectrix platform, you agree to be bound by these Terms of Service. If you are using Vectrix on behalf of an organization, you represent that you have authority to bind that organization to these terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-text-primary">2. Service Description</h2>
            <p className="mt-3">
              Vectrix provides AI-powered dependency intelligence and supply chain security analysis. This includes vulnerability scanning, health scoring, typosquatting detection, and anomaly analysis for software dependencies.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-text-primary">3. Account Responsibilities</h2>
            <p className="mt-3">
              You are responsible for maintaining the security of your account credentials and for all activity that occurs under your account. You must notify us immediately of any unauthorized use.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-text-primary">4. Acceptable Use</h2>
            <p className="mt-3">
              You may not use Vectrix to scan dependencies you do not have rights to analyze, attempt to reverse-engineer our detection algorithms, or resell scan results without authorization.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-text-primary">5. Limitation of Liability</h2>
            <p className="mt-3">
              Vectrix provides security intelligence on a best-effort basis. We do not guarantee detection of all vulnerabilities or supply chain threats. Our service supplements — but does not replace — your own security practices and due diligence.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-text-primary">6. Subscription & Billing</h2>
            <p className="mt-3">
              Paid plans are billed monthly or annually as selected. You may cancel at any time; access continues through the end of the billing period. Refunds are provided on a case-by-case basis for annual plans.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-text-primary">7. Contact</h2>
            <p className="mt-3">
              For questions about these terms, contact us at legal@vectrix.dev.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
