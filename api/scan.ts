import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createUserClient, getUserFromRequest } from "./lib/supabase-admin.js";
import { parseLockfile, type ParsedDependency } from "./lib/parsers.js";
import { checkVulnerabilities } from "./lib/osv.js";
import { scoreHealth } from "./lib/health.js";
import { detectAnomalies } from "./lib/anomaly.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authHeader = req.headers.authorization as string | null;
  const user = await getUserFromRequest(authHeader);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { project_id, filename, content, branch } = req.body;

  if (!project_id || !filename || !content) {
    return res.status(400).json({
      error: "project_id, filename, and content are required",
    });
  }

  const supabase = createUserClient(authHeader);

  // 1. Parse the lockfile
  let deps: ParsedDependency[];
  try {
    deps = parseLockfile(filename, content);
  } catch (err) {
    return res.status(400).json({
      error: `Failed to parse ${filename}: ${(err as Error).message}`,
    });
  }

  if (deps.length === 0) {
    return res.status(400).json({ error: "No dependencies found in file" });
  }

  // 2. Create scan record
  const { data: scan, error: scanError } = await supabase
    .from("scans")
    .insert({
      project_id,
      user_id: user.id,
      status: "running",
      branch: branch ?? "main",
      total_deps: deps.length,
    })
    .select()
    .single();

  if (scanError || !scan) {
    return res.status(500).json({ error: scanError?.message ?? "Failed to create scan" });
  }

  try {
    // 3. Run all analysis in parallel
    const [vulnFindings, healthData, anomalyFindings] = await Promise.all([
      checkVulnerabilities(deps),
      scoreHealth(deps),
      detectAnomalies(deps),
    ]);

    const allFindings = [...vulnFindings, ...healthData.findings, ...anomalyFindings];

    // 4. Count severities
    const criticalCount = allFindings.filter((f) => f.severity === "critical").length;
    const warningCount = allFindings.filter((f) => f.severity === "warning").length;
    const infoCount = allFindings.filter((f) => f.severity === "info").length;

    // 5. Insert dependencies
    const depRows = deps.map((dep) => {
      const health = healthData.results.find(
        (r) => r.packageName === dep.name && r.packageVersion === dep.version
      );
      return {
        scan_id: scan.id,
        package_name: dep.name,
        package_version: dep.version,
        ecosystem: dep.ecosystem,
        is_direct: dep.isDirect,
        health_score: health?.score ?? null,
        license: health?.license ?? null,
        metadata: health?.signals ?? {},
      };
    });

    // Insert in chunks to avoid payload size limits
    const DEP_CHUNK = 500;
    for (let i = 0; i < depRows.length; i += DEP_CHUNK) {
      await supabase.from("dependencies").insert(depRows.slice(i, i + DEP_CHUNK));
    }

    // 6. Insert findings
    if (allFindings.length > 0) {
      const findingRows = allFindings.map((f) => ({
        scan_id: scan.id,
        severity: f.severity,
        package_name: f.packageName,
        package_version: f.packageVersion,
        ecosystem: f.ecosystem,
        title: f.title,
        description: f.description,
        recommendation: f.recommendation,
        cve: f.cve ?? null,
        source: f.source,
      }));

      await supabase.from("findings").insert(findingRows);
    }

    // 7. Update scan as completed
    const cleanCount = deps.length - new Set(
      allFindings.map((f) => `${f.packageName}@${f.packageVersion}`)
    ).size;

    await supabase
      .from("scans")
      .update({
        status: "completed",
        critical_count: criticalCount,
        warning_count: warningCount,
        info_count: infoCount,
        clean_count: Math.max(0, cleanCount),
        completed_at: new Date().toISOString(),
      })
      .eq("id", scan.id);

    return res.json({
      scan_id: scan.id,
      status: "completed",
      total_deps: deps.length,
      critical: criticalCount,
      warnings: warningCount,
      info: infoCount,
      clean: Math.max(0, cleanCount),
      findings: allFindings,
    });
  } catch (err) {
    // Mark scan as failed
    await supabase
      .from("scans")
      .update({
        status: "failed",
        error_message: (err as Error).message,
        completed_at: new Date().toISOString(),
      })
      .eq("id", scan.id);

    return res.status(500).json({ error: (err as Error).message });
  }
}
