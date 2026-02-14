import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const inputClass =
  "mt-1.5 block w-full rounded-xl border border-white/8 bg-white/[.03] px-4 py-3 font-body text-sm text-text-primary placeholder-text-muted outline-none transition-all duration-200 focus:border-cyan-glow/40 focus:shadow-[0_0_20px_rgba(0,212,255,0.08)]";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error: err } = await signIn(email, password);
    if (err) {
      setError(err.message);
      setSubmitting(false);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-void px-4">
      {/* Atmospheric background */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,255,.06),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(124,92,252,.05),transparent_50%)]" />

      {/* Radar ring */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="animate-radar h-96 w-96 rounded-full border border-cyan-glow/[.06]" />
      </div>

      <div className="animate-float-up relative w-full max-w-sm">
        {/* Logo */}
        <div className="mb-10 text-center">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-glow/20 bg-cyan-wash">
              <div className="h-2.5 w-2.5 rounded-full bg-cyan-glow animate-glow-pulse" />
            </div>
            <span className="font-display text-xl font-bold text-text-primary">
              Vectrix
            </span>
          </Link>
          <h1 className="mt-8 font-display text-2xl font-bold text-text-primary">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Sign in to your account to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="animate-slide-in rounded-xl border border-danger/20 bg-danger-wash px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-glow to-violet-glow py-3 text-sm font-bold text-void transition-all hover:shadow-[0_0_24px_rgba(0,212,255,0.3)] disabled:opacity-50"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-text-muted">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-cyan-glow transition-colors hover:text-cyan-glow/80"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
