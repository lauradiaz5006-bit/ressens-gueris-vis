// Genesolia · fonction Supabase « dates-cles » : tes dates clés de l'année, offertes contre l'e-mail.
// POST { email, prenom, accord: true, annee, ap, items: [{ k, d, f }], lien }
//   k : code d'une date (transit:jupiter-soleil-conj, eclipse:soleil, mercure, anniversaire, annee:4), d / f : début et fin (AAAA-MM-JJ).
//   Les textes ne viennent JAMAIS du navigateur : ils sont relus dans https://genesolia.fr/assets/dates-cles-textes.json (aucun texte libre dans les mails).
// Enregistre le contact (table contacts), puis prépare dans la table mails :
//   1. tout de suite : « Tes dates clés AAAA » (toutes les périodes, chacune avec son lien pour aller plus loin, et le bouton pour l'agenda) ;
//   2. un rappel 3 jours avant le début de chaque période encore à venir (type dates_cles_rappel).
// Un seul envoi par personne et par année. Les mails partent avec la fonction envoi-mails (désinscription respectée).
// verify_jwt désactivé, comme seance-offerte.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const SITE = "https://genesolia.fr";
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const json = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });
const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const SANS_ACCENT: Record<string, string> = { "février": "fevrier", "août": "aout", "décembre": "decembre" };
const JOUR = /^\d{4}-\d{2}-\d{2}$/;
type Txt = { t: string; p: string; l: string };
let TEXTES: any = null;

const jour = (s: string) => { const [y, m, d] = s.split("-").map(Number); return new Date(Date.UTC(y, m - 1, d, 12)); };
const joli = (s: string) => { const d = jour(s), n = d.getUTCDate(); return (n === 1 ? "1er" : String(n)) + " " + MOIS[d.getUTCMonth()]; };
const plage = (d: string, f: string) => d === f ? "Le " + joli(d) : "Du " + joli(d) + " au " + joli(f);
function ciel(s: string) {
  const d = jour(s), m = d.getUTCMonth() + 1, y = d.getUTCFullYear(), nom = MOIS[m - 1];
  return (y === 2026 && m >= 10) || (y === 2027 && m <= 9) ? `ciel-${SANS_ACCENT[nom] ?? nom}-${y}.html` : "theme-astral.html";
}
function texte(k: string, d: string): Txt | null {
  const [type, code] = k.split(":"), T = TEXTES;
  let x: Txt | undefined;
  if (type === "transit") x = T.transits[code];
  else if (type === "eclipse") x = T.eclipses[code];
  else if (type === "annee" && T.annee[code]) { const a = T.annee[code]; x = { t: "Ton année " + code + " : " + a[0].charAt(0).toLowerCase() + a[0].slice(1), p: a[1], l: `annee-personnelle-${code}-en-${d.slice(0, 4)}.html` }; }
  else if (type === "mercure" || type === "anniversaire") x = T[type];
  if (!x) return null;
  return { t: x.t, p: x.p, l: x.l === "ciel" ? ciel(d) : x.l };
}
const nomLien = (l: string) => TEXTES.liens?.[l] ?? (l.startsWith("ciel-") ? "Le ciel du mois" : l.startsWith("annee-personnelle") ? "Ton année personnelle" : "Sur Genesolia");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ erreur: "méthode" }, 405);
  let b: Record<string, any> = {};
  try { b = await req.json(); } catch { b = {}; }
  const email = String(b.email ?? "").trim().toLowerCase(), prenom = String(b.prenom ?? "").trim().slice(0, 60);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200) return json({ erreur: "email" }, 400);
  if (b.accord !== true) return json({ erreur: "accord" }, 400);
  const annee = Number(b.annee);
  if (!(annee >= 2026 && annee <= 2035)) return json({ erreur: "annee" }, 400);
  if (!TEXTES) { const r = await fetch(SITE + "/assets/dates-cles-textes.json"); if (!r.ok) return json({ erreur: "textes" }, 500); TEXTES = await r.json(); }
  const items = (Array.isArray(b.items) ? b.items : []).slice(0, 30)
    .filter((i: any) => typeof i?.k === "string" && JOUR.test(i?.d ?? "") && JOUR.test(i?.f ?? "") && i.d.startsWith(String(annee)) && i.d <= i.f)
    .map((i: any) => ({ ...i, x: texte(i.k, i.d) })).filter((i: any) => i.x);
  if (!items.length) return json({ erreur: "items" }, 400);
  // lien de l'agenda : seulement vers genesolia.fr/dates-cles.html
  const lien = typeof b.lien === "string" && b.lien.startsWith(SITE + "/dates-cles.html#") && b.lien.length < 600 ? b.lien : SITE + "/offert.html";

  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const { data: c, error } = await sb.rpc("n8n_enregistrer_contact", { p_email: email, p_prenom: prenom || null, p_champs: { newsletter: true, interet_cercle: true } });
  if (error || !c?.id) return json({ erreur: "contact" }, 500);
  const type = "dates_cles_" + annee;
  const { data: deja } = await sb.from("mails").select("id").eq("contact_id", c.id).eq("type", type).limit(1);
  if (deja && deja.length) return json({ ok: true, deja: true });

  const blocs = items.map((i: any) => `${plage(i.d, i.f)} · ${i.x.t}\n${i.x.p}\n[Pour aller plus loin : ${nomLien(i.x.l)}](${SITE}/${i.x.l})`).join("\n\n");
  const cercle = "Pour vivre ces périodes pas à pas, Le Cercle t’accompagne toute l’année : un parcours en 12 étapes, des séances audio, la formation et ton appli. [Ton premier mois est offert, sans carte](" + SITE + "/essai.html).";
  const base = { contact_id: c.id, email, prenom: prenom || null, ok_envoyer: true, image: "assets/images/dates-cles-1200.webp", encadre_titre: "Et pour avancer toute l’année ?", encadre_texte: cercle };
  const envois: Record<string, unknown>[] = [{
    ...base, type, a_envoyer_le: new Date().toISOString(),
    objet: (prenom ? prenom + ", tes" : "Tes") + " dates clés " + annee, surtitre: "Offert · ton année " + annee, titre: "Tes dates clés " + annee,
    texte: "Les voici, calculées pour toi. Chaque période a sa phrase clé, et un lien pour aller plus loin.\n\n" + blocs +
      "\n\nTu peux les ajouter à ton agenda en un clic avec le bouton ci-dessous. Et juste avant chaque période, on t’écrit un petit mot pour la vivre pleinement.",
    bouton_texte: "Ajouter mes dates à mon agenda", bouton_lien: lien,
  }];
  const maintenant = Date.now();
  for (const i of items) {
    if (i.k.startsWith("annee")) continue;
    const quand = jour(i.d).getTime() - 3 * 864e5 - 4 * 3600e3;   // 3 jours avant, vers 8 h
    if (quand < maintenant + 864e5) continue;
    envois.push({
      ...base, type: "dates_cles_rappel", a_envoyer_le: new Date(quand).toISOString(),
      objet: "Dans 3 jours : " + i.x.t.charAt(0).toLowerCase() + i.x.t.slice(1), surtitre: "Tes dates clés " + annee, titre: i.x.t,
      texte: plage(i.d, i.f) + "\n\n" + i.x.p + "\n\nNote-le dans un coin de ta tête, ou mieux, dans ton carnet : qu’est-ce que tu voudrais vivre pendant cette période ?",
      bouton_texte: "Pour aller plus loin : " + nomLien(i.x.l), bouton_lien: SITE + "/" + i.x.l,
    });
  }
  // toutes les lignes ont les mêmes colonnes (sinon l'insertion est refusée)
  const { error: eM } = await sb.from("mails").insert(envois);
  if (eM) { console.error("mails", eM.message); return json({ erreur: "mails" }, 500); }
  return json({ ok: true, mails: envois.length });
});
