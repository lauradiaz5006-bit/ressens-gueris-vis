// Genesolia · fonction Supabase « desinscription » : le lien « Me désinscrire » des e-mails, sans N8N.
// POST { c: id du contact, j: jeton } : coche desinscrit (et retire la newsletter) si le jeton correspond. Renvoie { ok }.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const json = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ ok: false }, 405);
  let c = "", j = "";
  try {
    const type = req.headers.get("content-type") ?? "";
    if (type.includes("application/json")) { const b = await req.json(); c = String(b.c ?? ""); j = String(b.j ?? ""); }
    else { const f = await req.formData(); c = String(f.get("c") ?? ""); j = String(f.get("j") ?? ""); }
  } catch { /* rien */ }
  if (!UUID.test(c) || !UUID.test(j)) return json({ ok: false });
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const { data, error } = await sb.rpc("n8n_desinscription", { p_id: c, p_jeton: j });
  return json({ ok: !error && !!(data as { ok?: boolean })?.ok });
});
