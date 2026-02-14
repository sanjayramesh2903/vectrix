import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createUserClient, getUserFromRequest } from "./lib/supabase-admin.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authHeader = req.headers.authorization as string | null;
  const user = await getUserFromRequest(authHeader);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const supabase = createUserClient(authHeader);
  const scanId = req.query.id as string | undefined;

  // Single scan with findings
  if (scanId) {
    const [scanResult, findingsResult] = await Promise.all([
      supabase.from("scans").select("*, projects(name, repo_url)").eq("id", scanId).single(),
      supabase
        .from("findings")
        .select("*")
        .eq("scan_id", scanId)
        .order("severity", { ascending: true }),
    ]);

    if (scanResult.error) {
      return res.status(404).json({ error: "Scan not found" });
    }

    return res.json({
      scan: scanResult.data,
      findings: findingsResult.data ?? [],
    });
  }

  // List all scans for the user
  const { data, error } = await supabase
    .from("scans")
    .select("*, projects(name, repo_url)")
    .order("started_at", { ascending: false })
    .limit(50);

  if (error) return res.status(500).json({ error: error.message });
  return res.json({ scans: data });
}
