import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const inputClass =
  "mt-1.5 block w-full rounded-xl border border-white/8 bg-white/[.03] px-4 py-3 font-body text-sm text-text-primary placeholder-text-muted outline-none transition-all duration-200 focus:border-tide/40 focus:shadow-[0_0_20px_rgba(0,229,200,0.08)]";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      await signUp(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    }
    setLoading(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-abyss px-4">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(167,139,250,0.06),transparent_50%)]" />

      <div className="pointer-events-none absolute right-1/3 top-1/4 -translate-y-1/2">
        <div className="animate-ripple h-80 w-80 rounded-full border border-phosphor/10" />
      </div>

      <div className="relative w-full max-w-md animate-tide-rise">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-phosphor/20 bg-phosphor-wash">
            <div className="h-2.5 w-2.5 rounded-full bg-phosphor animate-bioluminescence" />
          </div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Start securing your supply chain with Ripptide
          </p>
        </div>

        {error && (
          <div className="mb-4 animate-slide-in rounded-xl border border-coral/20 bg-coral-wash px-4 py-3 text-sm text-coral">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="you@company.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="Min. 8 characters" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary">Confirm password</label>
            <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputClass} placeholder="Repeat password" />
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-tide to-phosphor py-3 text-sm font-bold text-abyss transition-all hover:shadow-[0_0_24px_rgba(0,229,200,0.3)] disabled:opacity-50">
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-tide hover:text-tide-dim">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
