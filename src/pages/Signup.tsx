import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const { error: err } = await signUp(email, password);
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
          <h1 className="mt-6 text-2xl font-bold text-white">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Start your 14-day free trial — no credit card required
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
              Work email
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
              placeholder="Min. 8 characters"
            />
          </div>

          <div>
            <label htmlFor="confirm" className="block text-sm font-medium text-slate-300">
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="Repeat password"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
          >
            {submitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
