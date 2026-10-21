// Genesolia · fonction Supabase « avis » : déposer un avis, et lire les avis publiés.
// POST { prenom, texte, ville?, age?, email?, accord: boolean, page? } : enregistre l'avis dans la table avis (jamais publié tout seul).
//      Si la table avis n'existe pas encore, l'avis part dans la table demandes (formulaire « Avis ») pour ne rien perdre.
// GET : renvoie au plus 9 avis publiés (prénom, âge, ville, texte), les plus récents d'abord.
// Laura publie un avis en cochant « publie » dans la table avis (Supabase > Table Editor), seulement si accord_publication est coché.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, apikey, content-type", "Access-Control-Allow-Methods": "GET, POST, OPTIONS" };
const json = (o: unknown, s = 200, cache = "no-store") => new Response(JSON.stringify(o), { status: s, headers: { ...CORS, "Content-Type": "application/json", "Cache-Control": cache } });
const court = (s: unknown, n: number) => String(s ?? "").replace(/\s+/g, " ").trim().slice(0, n);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  if (req.method === "GET") {
    const { data, error } = await sb.from("avis").select("prenom, age, ville, texte, cree_le").eq("publie", true).eq("accord_publication", true).order("cree_le", { ascending: false }).limit(9);
    return json({ avis: error ? [] : data ?? [] }, 200, "public, max-age=600");
  }
  if (req.method !== "POST") return json({ erreur: "méthode" }, 405);
  let b: Record<string, unknown> = {};
  try { b = await req.json(); } catch { b = {}; }
  const prenom = court(b.prenom, 40), texte = String(b.texte ?? "").trim().slice(0, 600), ville = court(b.ville, 60) || null;
  const age = Number.isInteger(Number(b.age)) && Number(b.age) >= 16 && Number(b.age) <= 110 ? Number(b.age) : null;
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(b.email ?? "").trim()) ? String(b.email).trim().toLowerCase().slice(0, 200) : null;
  const page = court(b.page, 80) || null, accord = b.accord === true;
  if (!prenom || texte.length < 10) return json({ erreur: "champs" }, 400);
  const { error } = await sb.from("avis").insert({ prenom, texte, ville, age, email, page, accord_publication: accord });
  if (error) {
    const { error: e2 } = await sb.from("demandes").insert({ formulaire: "Avis", prenom, email, page, details: { texte, ville, age, accord_publication: accord } });
    if (e2) return json({ erreur: "enregistrement" }, 500);
  }
  return json({ ok: true });
});
