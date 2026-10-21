// Genesolia · fonction Supabase « question-du-mois » : une membre du Cercle pose sa question.
// POST { texte, theme? } avec l'en-tête Authorization: Bearer <jeton de la membre connectée> (sans jeton : « sans compte »).
// La question est rangée dans la table demandes (formulaire « Question du mois ») AVEC son prénom et son e-mail,
// pour que Laura sache qui l'a écrite et puisse lui répondre. Les réponses publiées dans question-du-mois.html
// (tableau REPONSES) ne montrent jamais de prénom.
// Laura lit les questions dans Supabase > Table Editor > demandes (filtre formulaire = Question du mois).
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const json = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ erreur: "méthode" }, 405);
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const jeton = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
  const { data: qui } = jeton ? await sb.auth.getUser(jeton) : { data: null };
  const user = qui?.user;
  let b: Record<string, unknown> = {};
  try { b = await req.json(); } catch { b = {}; }
  const texte = String(b.texte ?? "").trim().slice(0, 1000);
  const theme = String(b.theme ?? "").replace(/\s+/g, " ").trim().slice(0, 60) || null;
  if (texte.length < 10) return json({ erreur: "champs" }, 400);
  const prenom = user ? String((user.user_metadata as Record<string, unknown>)?.full_name ?? "").trim().slice(0, 60) || null : null;
  const mois = new Date().toISOString().slice(0, 7);
  const { error } = await sb.from("demandes").insert({ formulaire: "Question du mois", email: user?.email ?? "sans compte", prenom, page: "question-du-mois", details: { texte, theme, mois, user_id: user?.id ?? null } });
  if (error) return json({ erreur: "enregistrement" }, 500);
  return json({ ok: true });
});
