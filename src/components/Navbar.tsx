import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

function Logo() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer water-drop silhouette */}
      <path
        d="M16 2C16 2 6 14 6 20a10 10 0 0 0 20 0C26 14 16 2 16 2Z"
        fill="url(#drop-fill)"
        fillOpacity="0.12"
        stroke="url(#drop-stroke)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      {/* Inner wave crest */}
      <path
        d="M8 20c2-3 4-1 6-3s4 0 6 2s3-1 4 1"
        stroke="url(#drop-stroke)"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Lower wave */}
      <path
        d="M9 23c2-2 3 0 5-1s3 1 5 0 3-1 4 0"
        stroke="url(#drop-stroke)"
        strokeWidth="0.9"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      {/* Bioluminescent dot */}
      <circle cx="16" cy="16" r="1.6" fill="url(#drop-stroke)" opacity="0.9" />
      <defs>
        <linearGradient
          id="drop-stroke"
          x1="6"
          y1="2"
          x2="26"
          y2="30"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00e5c8" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
        <linearGradient
          id="drop-fill"
          x1="6"
          y1="2"
          x2="26"
          y2="30"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00e5c8" />
          <stop offset="1" stopColor="#a78bfa" />
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
    "text-sm text-white/50 transition-colors duration-200 hover:text-[#00e5c8]";

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-[#00e5c8]/10 bg-[#030b18]/90 shadow-[0_1px_20px_rgba(0,229,200,0.06)] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5">
          <Logo />
          <span className="font-display text-lg font-bold tracking-tight text-white">
            Ripptide
          </span>
        </Link>

        {/* Desktop nav */}
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
          <Link to="/docs" className={navLinkClass}>
            Docs
          </Link>

          <div className="ml-1 h-4 w-px bg-white/10" />

          {user ? (
            <>
              <Link to="/dashboard" className={navLinkClass}>
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="rounded-lg border border-white/[.08] bg-white/[.03] px-4 py-1.5 text-sm text-white/50 transition hover:border-white/15 hover:text-white"
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
                className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-[#00e5c8] to-[#a78bfa] px-5 py-1.5 text-sm font-semibold text-[#030b18] transition-shadow hover:shadow-[0_0_24px_rgba(0,229,200,0.35)]"
              >
                <span className="relative z-10">Start free trial</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white/50 md:hidden"
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
        <div className="animate-fade-in border-t border-white/5 bg-[#030b18]/95 px-4 pb-5 pt-3 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-4">
            <Link
              to="/#features"
              className={navLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              Features
            </Link>
            <Link
              to="/#pricing"
              className={navLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="/blog"
              className={navLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/docs"
              className={navLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              Docs
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={navLinkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-left text-sm text-white/50"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={navLinkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="mt-1 rounded-lg bg-gradient-to-r from-[#00e5c8] to-[#a78bfa] px-5 py-2 text-center text-sm font-semibold text-[#030b18]"
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
