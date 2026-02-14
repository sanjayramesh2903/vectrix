import { useState, type FormEvent } from "react";
import { Mail, MessageSquare, Building } from "lucide-react";

const inputClass =
  "mt-1.5 block w-full rounded-xl border border-white/8 bg-white/[.03] px-4 py-3 font-body text-sm text-text-primary placeholder-text-muted outline-none transition-all duration-200 focus:border-cyan-glow/40 focus:shadow-[0_0_20px_rgba(0,212,255,0.08)]";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen bg-void pt-28 pb-24">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,212,255,.05),transparent_50%)]" />

      <div className="relative mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-cyan-glow">
            Get in touch
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold text-text-primary sm:text-5xl">
            Contact us
          </h1>
          <p className="mt-4 text-text-secondary">
            Questions about Vectrix? Need help with your integration? We'd love
            to hear from you.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Mail, label: "Email", value: "hello@vectrix.dev" },
            { icon: MessageSquare, label: "Support", value: "support@vectrix.dev" },
            { icon: Building, label: "Enterprise", value: "sales@vectrix.dev" },
          ].map((c, i) => (
            <div
              key={c.label}
              className={`glass rounded-xl p-4 text-center animate-float-up delay-${(i + 1) * 100}`}
            >
              <c.icon className="mx-auto h-5 w-5 text-cyan-glow" />
              <p className="mt-2 text-xs text-text-muted">{c.label}</p>
              <p className="mt-1 text-sm font-medium text-text-primary">{c.value}</p>
            </div>
          ))}
        </div>

        {submitted ? (
          <div className="mt-12 animate-float-up glass rounded-2xl p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success-wash">
              <MessageSquare className="h-6 w-6 text-success" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-text-primary">
              Message sent
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              We'll get back to you within one business day.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-12 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-text-secondary">
                  Name
                </label>
                <input
                  type="text"
                  required
                  className={inputClass}
                  placeholder="Jane Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className={inputClass}
                  placeholder="jane@company.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary">
                Subject
              </label>
              <input
                type="text"
                required
                className={inputClass}
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary">
                Message
              </label>
              <textarea
                required
                rows={5}
                className={inputClass + " resize-none"}
                placeholder="Tell us more..."
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-cyan-glow to-violet-glow py-3 text-sm font-bold text-void transition-all hover:shadow-[0_0_24px_rgba(0,212,255,0.3)]"
            >
              Send message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
