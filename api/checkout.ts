import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getUserFromRequest } from "./lib/supabase-admin.js";

/**
 * Creates a Stripe Checkout session for the selected plan.
 *
 * To activate:
 *   1. Create products/prices in Stripe Dashboard
 *   2. Add STRIPE_SECRET_KEY and price IDs to Vercel env vars
 *   3. Uncomment the Stripe code below
 */

const PRICE_MAP: Record<string, string> = {
  starter: "", // free tier — no checkout needed
  team: process.env.STRIPE_PRICE_TEAM ?? "",
  enterprise: "", // custom — handled via sales
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = await getUserFromRequest(req.headers.authorization as string | null);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { plan } = req.body;

  if (!plan || !PRICE_MAP[plan as string]) {
    return res.status(400).json({ error: "Invalid plan" });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return res.status(503).json({
      error: "Stripe is not configured. Add STRIPE_SECRET_KEY to your environment variables.",
    });
  }

  // Create Stripe Checkout session via the API directly (no SDK needed)
  const params = new URLSearchParams();
  params.append("mode", "subscription");
  params.append("success_url", `${req.headers.origin}/dashboard?checkout=success`);
  params.append("cancel_url", `${req.headers.origin}/#pricing`);
  params.append("customer_email", user.email);
  params.append("line_items[0][price]", PRICE_MAP[plan as string]);
  params.append("line_items[0][quantity]", "1");
  params.append("metadata[user_id]", user.id);
  params.append("metadata[plan]", plan as string);

  const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const session = await stripeRes.json();

  if (!stripeRes.ok) {
    return res.status(500).json({
      error: (session as Record<string, Record<string, string>>).error?.message ?? "Stripe error",
    });
  }

  return res.json({ url: (session as Record<string, string>).url });
}
