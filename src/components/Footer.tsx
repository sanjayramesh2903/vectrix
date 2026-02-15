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
    { label: "Documentation", href: "/docs" },
    { label: "API Reference", href: "/docs/api" },
    { label: "Security", href: "/about" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[.04] bg-[#030b18]">
      {/* Subtle tide glow line at top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00e5c8]/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#00e5c8] shadow-[0_0_8px_rgba(0,229,200,0.6)] animate-bioluminescence" />
              <span className="font-display text-base font-bold text-white">
                Ripptide
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/35">
              AI-powered dependency intelligence for secure software supply
              chains.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-display text-xs font-semibold uppercase tracking-widest text-white/50">
                {heading}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-white/35 transition-colors duration-200 hover:text-[#00e5c8]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[.04] pt-6 sm:flex-row">
          <span className="text-xs text-white/35">
            &copy; {new Date().getFullYear()} Ripptide, Inc. All rights
            reserved.
          </span>
          <div className="flex items-center gap-1.5 text-xs text-white/35">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#34d399] shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
