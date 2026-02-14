import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createUserClient, getUserFromRequest } from "./lib/supabase-admin.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const authHeader = req.headers.authorization as string | null;
  const user = await getUserFromRequest(authHeader);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const supabase = createUserClient(authHeader);

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ projects: data });
  }

  if (req.method === "POST") {
    const { name, repo_url, ecosystem } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Project name is required" });
    }

    const { data, error } = await supabase
      .from("projects")
      .insert({
        user_id: user.id,
        name,
        repo_url: repo_url ?? null,
        ecosystem: ecosystem ?? "npm",
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ project: data });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
