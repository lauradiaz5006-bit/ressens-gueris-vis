// Genesolia · fonction Supabase « stripe-webhook » : reçoit les paiements Stripe et ouvre les accès.
// Secrets à créer (Supabase > Edge Functions > Secrets) : STRIPE_SECRET_KEY (clé secrète, sk_live_…) et STRIPE_WEBHOOK_SECRET (whsec_…).
// Stripe > Développeurs > Webhooks > Ajouter une destination : https://qsvzzkjtjsznfntahvvh.supabase.co/functions/v1/stripe-webhook
// Événements : checkout.session.completed, checkout.session.async_payment_succeeded, invoice.paid, customer.subscription.deleted.
// Le site ajoute à chaque lien de paiement client_reference_id = <id du compte>__<clé du lien> (ex. …__passMois).
import Stripe from "npm:stripe@17.7.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const CLE_STRIPE = Deno.env.get("STRIPE_SECRET_KEY") ?? "", SECRET_WEBHOOK = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";
const stripe = new Stripe(CLE_STRIPE || "sk_test_absente", { httpClient: Stripe.createFetchHttpClient() });
const crypto = Stripe.createSubtleCryptoProvider();
const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

type Offre = { fam: "pass" | "cercle" | "praticien"; mois?: number; formule?: string };
const OFFRES: Record<string, Offre> = {
  passMois: { fam: "pass" }, pass3Mois: { fam: "pass", mois: 3 },
  cercleMois: { fam: "cercle" }, cercleFondatrice: { fam: "cercle" }, cercleAn: { fam: "cercle" }, cercleAnnee: { fam: "cercle", mois: 12 },
  praticienMois: { fam: "praticien", formule: "mois" }, praticienFondateur: { fam: "praticien", formule: "fondateur" },
  praticienAn: { fam: "praticien", formule: "annee", mois: 12 },
};
const MEMBRE = ["cercle", "offert", "admin", "abonnement"];
const JOUR = 864e5;

function finAbonnement(sub: any): Date {
  const s = sub.current_period_end ?? sub.items?.data?.[0]?.current_period_end;
  return new Date((s ? s * 1000 : Date.now() + 31 * JOUR) + 2 * JOUR);   // 2 jours de marge pour le prélèvement suivant
}
function plusMois(depuis: Date, n: number) { const d = new Date(depuis); d.setMonth(d.getMonth() + n); return d; }

async function ouvrir(uid: string, cle: string, fin: Date | null, nouvelAchat: boolean) {
  const o = OFFRES[cle]; if (!o) return;   // livrets, arbres imprimés : la ligne « achats » suffit
  if (o.fam === "praticien") {
    const { data: p } = await sb.from("praticiens").select("acces_jusqu,fondateur,formule").eq("user_id", uid).maybeSingle();
    const resteP = p && new Date(p.acces_jusqu) > new Date() ? new Date(p.acces_jusqu).getTime() - Date.now() : 0;
    if (!fin) fin = plusMois(new Date(), o.mois ?? 1);
    if (nouvelAchat && p?.formule === "essai" && resteP > 0) fin = new Date(fin.getTime() + resteP);   // abonnement pris pendant l'essai : les jours restants s'ajoutent
    if (!nouvelAchat && p && new Date(p.acces_jusqu) > fin) fin = new Date(p.acces_jusqu);            // un renouvellement ne raccourcit jamais l'accès
    const ligne = { acces_jusqu: fin.toISOString(), formule: o.formule, fondateur: !!(p?.fondateur || o.formule === "fondateur") };
    if (p) await sb.from("praticiens").update(ligne).eq("user_id", uid);
    else await sb.from("praticiens").insert({ user_id: uid, cabinet: "Mon cabinet", ...ligne });
    return;
  }
  const { data: a } = await sb.from("acces_premium").select("offre,valide_jusqu,note").eq("user_id", uid).maybeSingle();
  const actif = a && new Date(a.valide_jusqu) > new Date();
  const enEssai = !!(actif && /essai/i.test(a.note || ""));
  if (o.fam === "pass" && actif && MEMBRE.includes(a.offre) && !enEssai) return;   // déjà membre du Cercle : le Cercle contient le Pass
  if (!fin) fin = plusMois(actif && a.offre === o.fam && !enEssai ? new Date(a.valide_jusqu) : new Date(), o.mois ?? 1);
  if (nouvelAchat && enEssai) fin = new Date(fin.getTime() + (new Date(a.valide_jusqu).getTime() - Date.now()));   // pris pendant le mois offert : les jours restants s'ajoutent
  if (!nouvelAchat && actif && new Date(a.valide_jusqu) > fin) fin = new Date(a.valide_jusqu);                     // un renouvellement ne raccourcit jamais l'accès
  const { error } = await sb.from("acces_premium").upsert({ user_id: uid, offre: o.fam, valide_jusqu: fin.toISOString(), note: "Stripe " + cle }, { onConflict: "user_id" });
  if (error) throw error;
  if (o.fam === "cercle" && nouvelAchat) {   // passage du Pass au Cercle : on arrête l'abonnement au Pass pour ne pas payer deux fois
    const { data: anciens } = await sb.from("achats").select("stripe_abonnement").eq("user_id", uid).eq("produit", "passMois").not("stripe_abonnement", "is", null);
    for (const x of anciens ?? []) { try { await stripe.subscriptions.cancel(x.stripe_abonnement); } catch (_) { /* déjà arrêté */ } }
  }
}

async function paiement(session: any) {
  const ref = String(session.client_reference_id || "");
  const m = /^([0-9a-f-]{36})__([A-Za-z0-9]{1,40})$/.exec(ref);
  if (!m) { console.log("Paiement sans client_reference_id exploitable", session.id); return; }
  const [, uid, cle] = m;
  const { data: deja } = await sb.from("achats").select("id").eq("stripe_session", session.id).maybeSingle();
  if (deja) return;   // Stripe peut renvoyer le même événement
  const sub = typeof session.subscription === "string" ? session.subscription : session.subscription?.id ?? null;
  const { error } = await sb.from("achats").insert({ user_id: uid, produit: cle, montant_centimes: session.amount_total ?? null, stripe_session: session.id,
    stripe_client: typeof session.customer === "string" ? session.customer : session.customer?.id ?? null, stripe_abonnement: sub });
  if (error) throw error;
  const fin = sub ? finAbonnement(await stripe.subscriptions.retrieve(sub)) : null;
  await ouvrir(uid, cle, fin, true);
}

async function achatDeLAbonnement(sub: string) {
  const { data } = await sb.from("achats").select("user_id,produit").eq("stripe_abonnement", sub).order("cree_le", { ascending: false }).limit(1).maybeSingle();
  return data;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("ok");
  if (!CLE_STRIPE || !SECRET_WEBHOOK) return new Response("Secrets Stripe manquants", { status: 503 });
  const corps = await req.text();
  let ev: any;
  try { ev = await stripe.webhooks.constructEventAsync(corps, req.headers.get("stripe-signature") ?? "", SECRET_WEBHOOK, undefined, crypto); }
  catch (e) { return new Response("Signature invalide", { status: 400 }); }
  try {
    const o = ev.data.object;
    if (ev.type === "checkout.session.completed" || ev.type === "checkout.session.async_payment_succeeded") {
      if (o.payment_status === "paid" || o.payment_status === "no_payment_required") await paiement(o);
    } else if (ev.type === "invoice.paid") {
      const sub = o.subscription ?? o.parent?.subscription_details?.subscription;
      if (sub && o.billing_reason !== "subscription_create") {
        const a = await achatDeLAbonnement(sub);
        const fin = o.lines?.data?.[0]?.period?.end;
        if (a && fin) await ouvrir(a.user_id, a.produit, new Date(fin * 1000 + 2 * JOUR), false);
      }
    } else if (ev.type === "customer.subscription.deleted") {
      const a = await achatDeLAbonnement(o.id), off = a && OFFRES[a.produit];
      if (a && off) {
        const fin = new Date((o.ended_at ?? Math.floor(Date.now() / 1000)) * 1000).toISOString();
        if (off.fam === "praticien") await sb.from("praticiens").update({ acces_jusqu: fin }).eq("user_id", a.user_id);
        else await sb.from("acces_premium").update({ valide_jusqu: fin }).eq("user_id", a.user_id).eq("offre", off.fam);
      }
    }
    return new Response(JSON.stringify({ recu: true }), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    console.error("stripe-webhook", ev?.type, e);
    return new Response("Erreur", { status: 500 });   // Stripe réessaiera
  }
});
