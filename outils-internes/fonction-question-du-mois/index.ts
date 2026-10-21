// Genesolia · fonction Supabase « question-du-mois » : une membre du Cercle pose sa question, de façon anonyme.
// POST { texte, theme? } : rangée dans la table demandes (formulaire « Question du mois »), SANS nom ni e-mail.
// Laura lit les questions dans Supabase > Table Editor > demandes (filtre formulaire = Question du mois),
// puis ses réponses sont publiées dans question-du-mois.html (tableau REPONSES), sans prénom.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const json = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ erreur: "méthode" }, 405);
  let b: Record<string, unknown> = {};
  try { b = await req.json(); } catch { b = {}; }
  const texte = String(b.texte ?? "").trim().slice(0, 1000);
  const theme = String(b.theme ?? "").replace(/\s+/g, " ").trim().slice(0, 60) || null;
  if (texte.length < 10) return json({ erreur: "champs" }, 400);
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const mois = new Date().toISOString().slice(0, 7);
  const { error } = await sb.from("demandes").insert({ formulaire: "Question du mois", email: "anonyme", page: "question-du-mois", details: { texte, theme, mois } });
  if (error) return json({ erreur: "enregistrement" }, 500);
  return json({ ok: true });
});
