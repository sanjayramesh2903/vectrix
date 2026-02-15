import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const inputClass =
  "mt-1.5 block w-full rounded-xl border border-white/8 bg-white/[.03] px-4 py-3 font-body text-sm text-text-primary placeholder-text-muted outline-none transition-all duration-200 focus:border-tide/40 focus:shadow-[0_0_20px_rgba(0,229,200,0.08)]";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    }
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-abyss px-4">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,229,200,0.06),transparent_50%)]" />

      {/* Ripple ring */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2">
        <div className="animate-ripple h-96 w-96 rounded-full border border-tide/10" />
      </div>

      <div className="relative w-full max-w-md animate-tide-rise">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-tide/20 bg-tide-wash">
            <div className="h-2.5 w-2.5 rounded-full bg-tide animate-bioluminescence" />
          </div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Sign in to your Ripptide account
          </p>
        </div>

        {error && (
          <div className="mb-4 animate-slide-in rounded-xl border border-coral/20 bg-coral-wash px-4 py-3 text-sm text-coral">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary">
              Password
            </label>
            <input
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
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-tide to-phosphor py-3 text-sm font-bold text-abyss transition-all hover:shadow-[0_0_24px_rgba(0,229,200,0.3)] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-tide hover:text-tide-dim">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
