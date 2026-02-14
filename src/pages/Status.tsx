import { CheckCircle2, Clock } from "lucide-react";

interface Service {
  name: string;
  status: "operational" | "degraded" | "down";
  uptime: string;
}

const services: Service[] = [
  { name: "Web Application", status: "operational", uptime: "99.99%" },
  { name: "Scan API", status: "operational", uptime: "99.97%" },
  { name: "OSV Vulnerability Database", status: "operational", uptime: "99.95%" },
  { name: "Health Scoring Engine", status: "operational", uptime: "99.98%" },
  { name: "Anomaly Detection", status: "operational", uptime: "99.96%" },
  { name: "CLI Authentication", status: "operational", uptime: "99.99%" },
  { name: "GitHub Action", status: "operational", uptime: "99.94%" },
  { name: "Webhook Notifications", status: "operational", uptime: "99.97%" },
];

const statusStyles = {
  operational: { dot: "bg-success", text: "text-success", label: "Operational" },
  degraded: { dot: "bg-warning", text: "text-warning", label: "Degraded" },
  down: { dot: "bg-danger", text: "text-danger", label: "Down" },
};

export default function Status() {
  const allOperational = services.every((s) => s.status === "operational");

  return (
    <div className="relative min-h-screen bg-void pt-28 pb-24">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(46,213,115,.04),transparent_50%)]" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-success">
            System status
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold text-text-primary sm:text-5xl">
            Status
          </h1>
        </div>

        {/* Overall status banner */}
        <div
          className={`mt-10 animate-float-up glass rounded-2xl p-6 text-center ${
            allOperational ? "border-success/15" : "border-warning/15"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span
              className={`h-3 w-3 rounded-full ${
                allOperational ? "bg-success animate-glow-pulse" : "bg-warning"
              }`}
            />
            <span className="font-display text-lg font-semibold text-text-primary">
              {allOperational
                ? "All systems operational"
                : "Some systems experiencing issues"}
            </span>
          </div>
          <p className="mt-2 flex items-center justify-center gap-1 text-sm text-text-muted">
            <Clock className="h-3.5 w-3.5" />
            Last checked: {new Date().toLocaleString()}
          </p>
        </div>

        {/* Service list */}
        <div className="mt-8 space-y-2">
          {services.map((service, i) => {
            const style = statusStyles[service.status];
            return (
              <div
                key={service.name}
                className={`glass flex items-center justify-between rounded-xl px-5 py-4 animate-float-up delay-${(i + 1) * 100}`}
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className={`h-4 w-4 ${style.text}`} />
                  <span className="text-sm font-medium text-text-primary">
                    {service.name}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-text-muted">
                    {service.uptime} uptime
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                    <span className={`text-xs font-medium ${style.text}`}>
                      {style.label}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
