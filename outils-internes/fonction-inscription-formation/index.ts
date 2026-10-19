// Genesolia · fonction Supabase « inscription-formation » : inscrit une membre du Cercle à la formation « Sors de la boucle » sur Systeme.io.
// POST {} avec le jeton de la personne connectée (Authorization: Bearer …), appelée par bienvenue.html et cercle.html.
// Vérifie un accès actif au Cercle, puis sur Systeme.io : retrouve ou crée le contact (e-mail + prénom) et lui pose le tag « Le Cercle ».
// La règle Systeme.io « Tag ajouté Le Cercle → Inscrire à Sors de la boucle, module 1 » fait le reste (accès + mail).
// Une seule fois par compte : la table formation_inscrites garde la trace.
// POST { verifier: true } sans connexion : dit seulement si la clé fonctionne et si le tag existe (aucune donnée personnelle).
// Secret nécessaire : SYSTEMEIO_CLE (clé API publique Systeme.io). verify_jwt désactivé : le jeton est vérifié ici.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });
const API = "https://api.systeme.io/api";
const TAG = "Le Cercle";

async function sio(cle: string, method: string, chemin: string, body?: unknown) {
  const h: Record<string, string> = { "X-API-Key": cle, Accept: "application/json" };
  if (body) h["Content-Type"] = "application/json";
  const r = await fetch(API + chemin, { method, headers: h, body: body ? JSON.stringify(body) : undefined });
  let d: any = null;
  try { d = r.status === 204 ? {} : await r.json(); } catch { d = null; }
  return { ok: r.ok, status: r.status, d };
}

async function idTag(cle: string) {
  const r = await sio(cle, "GET", "/tags?query=" + encodeURIComponent(TAG) + "&limit=100");
  if (!r.ok) return { erreur: "cle", status: r.status };
  const t = (r.d?.items ?? []).find((x: any) => String(x.name).trim().toLowerCase() === TAG.toLowerCase());
  return t ? { id: t.id as number } : { erreur: "tag" };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ erreur: "méthode" }, 405);
  const cle = Deno.env.get("SYSTEMEIO_CLE") ?? "";
  if (!cle) return json({ erreur: "cle_absente" }, 500);
  let b: Record<string, unknown> = {};
  try { b = await req.json(); } catch { b = {}; }

  if (b.verifier) {
    const t = await idTag(cle);
    return json("id" in t ? { ok: true, tag: true } : { ok: false, ...t });
  }

  const jeton = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const { data: u } = await sb.auth.getUser(jeton);
  const user = u?.user;
  if (!user?.id || !user.email) return json({ erreur: "connexion" }, 401);

  const { data: deja } = await sb.from("formation_inscrites").select("user_id").eq("user_id", user.id).maybeSingle();
  if (deja) return json({ ok: true, statut: "deja" });

  const { data: acces } = await sb.from("acces_premium").select("offre")
    .eq("user_id", user.id).gt("valide_jusqu", new Date().toISOString()).limit(1).maybeSingle();
  if (!acces || acces.offre === "rapport") return json({ erreur: "abonnement" }, 403);

  const t = await idTag(cle);
  if (!("id" in t)) return json({ erreur: t.erreur }, 502);

  const email = user.email.toLowerCase();
  const prenom = String(user.user_metadata?.full_name ?? "").trim().split(/\s+/)[0]?.replace(/[.,;:!?]+$/, "") ?? "";
  let contactId: number | null = null;
  const cherche = await sio(cle, "GET", "/contacts?email=" + encodeURIComponent(email) + "&limit=10");
  const trouve = (cherche.d?.items ?? []).find((c: any) => String(c.email).toLowerCase() === email);
  if (trouve) contactId = trouve.id;
  else {
    const fields = prenom ? [{ slug: "first_name", value: prenom }] : [];
    const cree = await sio(cle, "POST", "/contacts", { email, locale: "fr", fields });
    if (!cree.ok) return json({ erreur: "contact", status: cree.status }, 502);
    contactId = cree.d?.id ?? null;
  }
  if (!contactId) return json({ erreur: "contact" }, 502);

  const pose = await sio(cle, "POST", "/contacts/" + contactId + "/tags", { tagId: t.id });
  if (!pose.ok && pose.status !== 422) return json({ erreur: "tag_pose", status: pose.status }, 502);

  await sb.from("formation_inscrites").upsert({ user_id: user.id, systemeio_id: contactId });
  return json({ ok: true, statut: "inscrite" });
});
