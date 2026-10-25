// Genesolia · fonction Supabase « carte-cadeau » : les cartes cadeaux du Cercle (3 mois, 6 mois).
// Publique (verify_jwt false) : chaque action vérifie elle-même ce qu'il faut.
//   POST { action: "acheter", offre, de, pour, message, email, envoi: "moi"|"mail", email_dest, date }
//        → crée la carte (statut « attente ») et une page de paiement Stripe (paiement unique), renvoie { url }.
//          Le paiement arrive sur le compte Stripe de Genesolia (clé STRIPE_SECRET_KEY, la même que stripe-webhook).
//          client_reference_id = cad__<ref> : c'est stripe-webhook qui, une fois payé, donne le code et envoie les mails.
//   POST { action: "voir", ref } ou { action: "voir", code } → la carte à afficher (sans adresses e-mail).
//        Le code n'est renvoyé qu'avec la ref (l'acheteuse) ; avec le code, on sait déjà le code.
//   POST { action: "utiliser", code } + Authorization: Bearer <jeton de la personne connectée>
//        → ouvre Le Cercle pour 3 ou 6 mois (table acces_premium) et marque la carte utilisée.
import Stripe from "npm:stripe@17.7.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "sk_test_absente", { httpClient: Stripe.createFetchHttpClient() });
const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const SITE = "https://genesolia.fr";

/* Les cartes en vente : changer un prix ici suffit (en centimes) */
export const CARTES: Record<string, { mois: number; prix: number; nom: string }> = {
  cercle3: { mois: 3, prix: 7900, nom: "Carte cadeau Le Cercle · 3 mois" },
  cercle6: { mois: 6, prix: 14900, nom: "Carte cadeau Le Cercle · 6 mois" },
};
const MEMBRE = ["cercle", "offert", "admin", "abonnement"];
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, content-type, apikey, x-client-info", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const rep = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });
const txt = (v: unknown, n: number) => String(v ?? "").replace(/[\u0000-\u001f<>]/g, " ").trim().slice(0, n);
const mailOk = (e: string) => /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,}$/i.test(e);
const hasard = (n: number) => Array.from(crypto.getRandomValues(new Uint8Array(n)), (b) => "abcdefghijkmnpqrstuvwxyz23456789"[b % 32]).join("");

async function acheter(b: any) {
  const c = CARTES[b.offre]; if (!c) return rep({ erreur: "Choisis une carte." }, 400);
  const email = txt(b.email, 200).toLowerCase(); if (!mailOk(email)) return rep({ erreur: "Ton adresse e-mail semble incomplète." }, 400);
  const envoi = b.envoi === "mail" ? "mail" : "moi";
  const dest = txt(b.email_dest, 200).toLowerCase();
  if (envoi === "mail" && !mailOk(dest)) return rep({ erreur: "L’adresse e-mail de la personne qui reçoit la carte semble incomplète." }, 400);
  let date: string | null = null;
  if (envoi === "mail") {
    date = /^\d{4}-\d{2}-\d{2}$/.test(String(b.date)) ? String(b.date) : new Date().toISOString().slice(0, 10);
    const d = new Date(date + "T12:00:00Z"), max = Date.now() + 366 * 864e5;
    if (isNaN(+d) || +d > max) return rep({ erreur: "Choisis une date d’envoi dans l’année qui vient." }, 400);
    if (+d < Date.now() - 864e5) date = new Date().toISOString().slice(0, 10);
  }
  const ref = hasard(20);
  const ligne = { ref, offre: b.offre, mois: c.mois, montant_centimes: c.prix, de_prenom: txt(b.de, 40) || null, pour_prenom: txt(b.pour, 40) || null,
    message: txt(b.message, 400) || null, email_acheteuse: email, envoi, email_destinataire: envoi === "mail" ? dest : null, envoyer_le: date };
  const { error } = await sb.from("cartes_cadeaux").insert(ligne);
  if (error) { console.error(error); return rep({ erreur: "La carte n’a pas pu être préparée. Réessaie dans un instant." }, 500); }
  const s = await stripe.checkout.sessions.create({
    mode: "payment", locale: "fr", customer_email: email, client_reference_id: "cad__" + ref,
    line_items: [{ quantity: 1, price_data: { currency: "eur", unit_amount: c.prix, product_data: { name: c.nom,
      description: `${c.mois} mois du Cercle à offrir, à activer quand la personne le souhaite. Sans abonnement : rien n’est prélevé ensuite.` } } }],
    success_url: `${SITE}/carte-cadeau.html?ref=${ref}`, cancel_url: `${SITE}/offrir.html#carte-cadeau`,
    metadata: { carte_cadeau: ref }, payment_intent_data: { description: c.nom, metadata: { carte_cadeau: ref } },
  });
  return rep({ url: s.url });
}

async function voir(b: any) {
  const parRef = /^[a-z0-9]{20}$/.test(String(b.ref || "")), code = String(b.code || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!parRef && code.length < 8) return rep({ erreur: "Code incomplet." }, 400);
  const q = sb.from("cartes_cadeaux").select("code,offre,mois,statut,de_prenom,pour_prenom,message,envoi,envoyer_le,email_destinataire");
  const { data: x } = parRef ? await q.eq("ref", b.ref).maybeSingle() : await q.eq("code", fmt(code)).maybeSingle();
  if (!x) return rep({ erreur: "Cette carte est introuvable. Vérifie le code." }, 404);
  return rep({ carte: { code: parRef ? x.code : fmt(code), offre: x.offre, mois: x.mois, statut: x.statut, de: x.de_prenom, pour: x.pour_prenom, message: x.message,
    envoi: parRef ? x.envoi : undefined, envoyer_le: parRef ? x.envoyer_le : undefined, dest: parRef && x.email_destinataire ? x.email_destinataire.replace(/^(.).*(@.*)$/, "$1…$2") : undefined } });
}
/* CERCLE-XXXX-XXXX : on l'écrit toujours sous cette forme, quel que soit ce qu'elle a tapé */
function fmt(c: string) { c = c.replace(/^CERCLE/, ""); return "CERCLE-" + c.slice(0, 4) + "-" + c.slice(4, 8); }

async function utiliser(b: any, req: Request) {
  const jeton = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  const { data: u } = await sb.auth.getUser(jeton);
  const uid = u?.user?.id; if (!uid) return rep({ erreur: "connexion" }, 401);
  const code = fmt(String(b.code || "").toUpperCase().replace(/[^A-Z0-9]/g, ""));
  const { data: x } = await sb.from("cartes_cadeaux").select("id,mois,statut,utilise_par").eq("code", code).maybeSingle();
  if (!x) return rep({ erreur: "Ce code est introuvable. Vérifie les lettres et les chiffres." }, 404);
  if (x.statut === "utilisee") return rep(x.utilise_par === uid ? { ok: true, deja: true } : { erreur: "Cette carte a déjà été activée." }, x.utilise_par === uid ? 200 : 409);
  if (x.statut !== "payee") return rep({ erreur: "Cette carte n’est pas encore active." }, 409);
  // on la prend d'abord (une seule personne peut l'activer), puis on ouvre l'accès
  const { data: pris } = await sb.from("cartes_cadeaux").update({ statut: "utilisee", utilise_par: uid, utilise_le: new Date().toISOString() }).eq("id", x.id).eq("statut", "payee").select("id");
  if (!pris?.length) return rep({ erreur: "Cette carte a déjà été activée." }, 409);
  const { data: a } = await sb.from("acces_premium").select("offre,valide_jusqu").eq("user_id", uid).maybeSingle();
  const actif = a && new Date(a.valide_jusqu) > new Date() && MEMBRE.includes(a.offre);
  const depart = actif ? new Date(a.valide_jusqu) : new Date();   // déjà dans Le Cercle : les mois s'ajoutent à la suite
  const fin = new Date(depart); fin.setMonth(fin.getMonth() + x.mois);
  const { error } = await sb.from("acces_premium").upsert({ user_id: uid, offre: a?.offre === "admin" ? "admin" : "cercle", valide_jusqu: fin.toISOString(), note: `Carte cadeau ${x.mois} mois ${code}` }, { onConflict: "user_id" });
  if (error) { console.error(error); await sb.from("cartes_cadeaux").update({ statut: "payee", utilise_par: null, utilise_le: null }).eq("id", x.id); return rep({ erreur: "L’activation n’a pas abouti. Réessaie dans un instant." }, 500); }
  await sb.from("achats").insert({ user_id: uid, produit: "carteCercle" + x.mois, montant_centimes: 0 });
  return rep({ ok: true, mois: x.mois, fin: fin.toISOString() });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return rep({ erreur: "POST" }, 405);
  let b: any = {}; try { b = await req.json(); } catch { return rep({ erreur: "Requête illisible." }, 400); }
  try {
    if (b.action === "acheter") return await acheter(b);
    if (b.action === "voir") return await voir(b);
    if (b.action === "utiliser") return await utiliser(b, req);
    return rep({ erreur: "Action inconnue." }, 400);
  } catch (e) { console.error("carte-cadeau", e); return rep({ erreur: "Un souci technique. Réessaie dans un instant." }, 500); }
});
