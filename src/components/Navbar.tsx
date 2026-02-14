import { Link, useNavigate } from "react-router-dom";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-925/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-white">
          <Shield className="h-7 w-7 text-indigo-400" />
          <span className="text-lg font-semibold tracking-tight">Vectrix</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            to="/#features"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            Features
          </Link>
          <Link
            to="/#pricing"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            Pricing
          </Link>
          <a
            href="https://docs.vectrix.dev"
            className="text-sm text-slate-400 transition hover:text-white"
            target="_blank"
            rel="noreferrer"
          >
            Docs
          </a>

          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm text-slate-400 transition hover:text-white"
              >
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="rounded-lg bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-slate-400 transition hover:text-white"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
              >
                Start free trial
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-slate-400 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/5 bg-slate-925 px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-3">
            <Link
              to="/#features"
              className="text-sm text-slate-400"
              onClick={() => setMobileOpen(false)}
            >
              Features
            </Link>
            <Link
              to="/#pricing"
              className="text-sm text-slate-400"
              onClick={() => setMobileOpen(false)}
            >
              Pricing
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm text-slate-400"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-left text-sm text-slate-400"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-slate-400"
                  onClick={() => setMobileOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="mt-1 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white"
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
