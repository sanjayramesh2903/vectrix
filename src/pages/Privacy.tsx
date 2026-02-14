export default function Privacy() {
  return (
    <div className="relative min-h-screen bg-void pt-28 pb-24">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-cyan-glow">
            Legal
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold text-text-primary sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-text-muted">Last updated: February 14, 2026</p>
        </div>

        <div className="mt-12 space-y-8 text-sm leading-relaxed text-text-secondary">
          <section>
            <h2 className="font-display text-lg font-semibold text-text-primary">1. Information We Collect</h2>
            <p className="mt-3">
              We collect information you provide directly — such as your email address and organization name when you create an account. We also collect dependency manifest data (lockfiles) that you upload for scanning. We do not collect or store your source code.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-text-primary">2. How We Use Your Information</h2>
            <p className="mt-3">
              We use your information to provide and improve the Vectrix service, including vulnerability scanning, health scoring, and anomaly detection. We may use aggregated, anonymized data to improve our detection algorithms and publish industry research.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-text-primary">3. Data Retention</h2>
            <p className="mt-3">
              Scan results and dependency data are retained for the duration of your account. You can delete your data at any time from the dashboard settings. When you delete your account, all associated data is permanently removed within 30 days.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-text-primary">4. Data Security</h2>
            <p className="mt-3">
              We use industry-standard encryption (TLS 1.3 in transit, AES-256 at rest) and follow security best practices. Our infrastructure is hosted on SOC 2 compliant providers. We conduct regular security audits and penetration tests.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-text-primary">5. Third-Party Services</h2>
            <p className="mt-3">
              We query the OSV database and package registries (npm, PyPI, Go modules) to provide vulnerability and health data. These queries contain only package names and versions — never your source code or proprietary information.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-text-primary">6. Contact</h2>
            <p className="mt-3">
              For privacy-related questions, contact us at privacy@vectrix.dev.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
