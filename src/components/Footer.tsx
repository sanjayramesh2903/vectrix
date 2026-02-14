import { Shield } from "lucide-react";

const footerLinks = {
  Product: ["Features", "Pricing", "Changelog", "Integrations"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Resources: ["Documentation", "API Reference", "Status", "Security"],
  Legal: ["Privacy", "Terms", "DPA"],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-925">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 text-white">
              <Shield className="h-6 w-6 text-indigo-400" />
              <span className="font-semibold">Vectrix</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              AI-powered dependency intelligence for secure software supply
              chains.
            </p>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-sm font-medium text-slate-300">{heading}</h4>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-slate-500 transition hover:text-slate-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-white/5 pt-6 text-center text-xs text-slate-600">
          &copy; {new Date().getFullYear()} Vectrix, Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
