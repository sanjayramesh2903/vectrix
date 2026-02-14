import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

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
    <div className="flex min-h-screen items-center justify-center bg-slate-925 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-white">
            <Shield className="h-8 w-8 text-indigo-400" />
            <span className="text-xl font-semibold">Vectrix</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-400">
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-indigo-400 hover:text-indigo-300">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
