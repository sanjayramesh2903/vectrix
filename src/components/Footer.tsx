import { Link } from "react-router-dom";

const footerLinks = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Changelog", href: "/changelog" },
    { label: "Status", href: "/status" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  Resources: [
    { label: "Documentation", href: "https://docs.vectrix.dev", external: true },
    { label: "API Reference", href: "https://docs.vectrix.dev/api", external: true },
    { label: "Security", href: "/about" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[.04] bg-void">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-glow/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-cyan-glow animate-glow-pulse" />
              <span className="font-display text-base font-bold text-text-primary">
                Vectrix
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-text-muted">
              AI-powered dependency intelligence for secure software supply
              chains.
            </p>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-display text-xs font-semibold uppercase tracking-widest text-text-secondary">
                {heading}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-text-muted transition-colors duration-200 hover:text-cyan-glow"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-sm text-text-muted transition-colors duration-200 hover:text-cyan-glow"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[.04] pt-6 sm:flex-row">
          <span className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Vectrix, Inc. All rights reserved.
          </span>
          <div className="flex items-center gap-1 text-xs text-text-muted">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
