import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2L28 8V24L16 30L4 24V8L16 2Z" stroke="url(#logo-grad)" strokeWidth="1.5" fill="none" />
      <path d="M16 8L22 11V21L16 24L10 21V11L16 8Z" fill="url(#logo-grad)" fillOpacity="0.15" stroke="url(#logo-grad)" strokeWidth="1" />
      <circle cx="16" cy="16" r="3" fill="url(#logo-grad)" />
      <defs>
        <linearGradient id="logo-grad" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00d4ff" />
          <stop offset="1" stopColor="#7c5cfc" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navLinkClass =
    "text-sm text-text-secondary transition-colors duration-200 hover:text-cyan-glow";

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-cyan-glow/10 bg-void/90 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <Logo />
          <span className="font-display text-lg font-bold tracking-tight text-text-primary">
            Vectrix
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-7 md:flex">
          <Link to="/#features" className={navLinkClass}>
            Features
          </Link>
          <Link to="/#pricing" className={navLinkClass}>
            Pricing
          </Link>
          <Link to="/blog" className={navLinkClass}>
            Blog
          </Link>
          <a
            href="https://docs.vectrix.dev"
            className={navLinkClass}
            target="_blank"
            rel="noreferrer"
          >
            Docs
          </a>

          <div className="ml-1 h-4 w-px bg-white/10" />

          {user ? (
            <>
              <Link to="/dashboard" className={navLinkClass}>
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="rounded-lg border border-white/8 bg-white/[.03] px-4 py-1.5 text-sm text-text-secondary transition hover:border-white/15 hover:text-text-primary"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={navLinkClass}>
                Log in
              </Link>
              <Link
                to="/signup"
                className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-cyan-glow to-violet-glow px-5 py-1.5 text-sm font-semibold text-void transition-shadow hover:shadow-[0_0_24px_rgba(0,212,255,0.3)]"
              >
                <span className="relative z-10">Start free trial</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-text-secondary md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="animate-fade-in border-t border-white/5 bg-void/95 px-4 pb-5 pt-3 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-4">
            <Link to="/#features" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              Features
            </Link>
            <Link to="/#pricing" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              Pricing
            </Link>
            <Link to="/blog" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              Blog
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                  Dashboard
                </Link>
                <button onClick={handleSignOut} className="text-left text-sm text-text-secondary">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={navLinkClass} onClick={() => setMobileOpen(false)}>
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="mt-1 rounded-lg bg-gradient-to-r from-cyan-glow to-violet-glow px-5 py-2 text-center text-sm font-semibold text-void"
                  onClick={() => setMobileOpen(false)}
                >
                  Start free trial
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
