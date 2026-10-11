// Genesolia · fonction Supabase « seance-audio » : le lien d'écoute d'une séance de « Mes séances ».
// POST { seance: 'c1-10' } avec le jeton de la personne connectée (Authorization: Bearer …).
// Vérifie : abonnement actif, cycle autorisé par l'offre, séance déjà ouverte par la personne.
// Renvoie { url } : un lien vers le fichier du dossier privé « seances », valable 1 heure.
// Si le fichier n'est pas encore déposé : { bientot: true }.
// verify_jwt désactivé : le jeton est vérifié ici (même règle que notifs-cercle).
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ erreur: "méthode" }, 405);
  const jeton = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  let b: Record<string, unknown> = {};
  try { b = await req.json(); } catch { b = {}; }
  const seance = String(b.seance ?? "");
  if (!/^c[12]-(0[1-9]|1[0-2])$/.test(seance)) return json({ erreur: "seance" }, 400);

  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const { data: u } = await sb.auth.getUser(jeton);
  const uid = u?.user?.id;
  if (!uid) return json({ erreur: "connexion" }, 401);

  const { data: acces } = await sb.from("acces_premium").select("offre, valide_jusqu")
    .eq("user_id", uid).gt("valide_jusqu", new Date().toISOString()).order("valide_jusqu", { ascending: false }).limit(1).maybeSingle();
  if (!acces) return json({ erreur: "abonnement" }, 403);
  if (seance.startsWith("c2") && acces.offre === "cycle1") return json({ erreur: "offre" }, 403);

  const { data: ouverte } = await sb.from("seances_ouvertes").select("seance").eq("user_id", uid).eq("seance", seance).maybeSingle();
  if (!ouverte) return json({ erreur: "fermee" }, 403);

  const { data: lien, error } = await sb.storage.from("seances").createSignedUrl(seance + ".mp3", 3600);
  if (error || !lien?.signedUrl) return json({ bientot: true });
  return json({ url: lien.signedUrl });
});
