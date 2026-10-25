// Genesolia · fonction Supabase « stripe-webhook » : reçoit les paiements Stripe et ouvre les accès.
// Secrets à créer (Supabase > Edge Functions > Secrets) : STRIPE_SECRET_KEY (clé secrète, sk_live_…) et STRIPE_WEBHOOK_SECRET (whsec_…).
// Stripe > Développeurs > Webhooks > Ajouter une destination : https://qsvzzkjtjsznfntahvvh.supabase.co/functions/v1/stripe-webhook
// Événements : checkout.session.completed, checkout.session.async_payment_succeeded, invoice.paid, customer.subscription.deleted.
// Le site ajoute à chaque lien de paiement client_reference_id = <id du compte>__<clé du lien> (ex. …__passMois).
// Arbre imprimé : client_reference_id = imp__<référence de la commande> (colonne details.ref de la table demandes).
//   Après paiement : la commande part chez Gelato en BROUILLON (rien n'est imprimé ni payé avant que Laura valide
//   dans son tableau de bord Gelato), puis un e-mail « à valider » part vers contact@genesolia.fr (table mails).
//   La cliente reçoit « Commande confirmée » (récapitulatif, adresse, délai, garanties) et sa relance « ton arbre t'attend » est annulée.
//   Expédition et livraison : fonction gelato-suivi (mails « en route » avec le suivi, puis « arrivé »).
//   Secret : GELATO_API_KEY (ou un secret dont le nom contient « gelato »). Produits : GELATO_PRODUITS ci-dessous.
//   Sans clé ou sans référence : pas d'envoi à Gelato, l'e-mail donne tout pour passer la commande à la main.
import Stripe from "npm:stripe@17.7.0";
import { createClient } from "npm:@supabase/supabase-js@2";

/* La clé secrète (sk_ ou rk_) : STRIPE_SECRET_KEY2 d'abord, sinon STRIPE_SECRET_KEY.
   Le secret du webhook (whsec_) : STRIPE_WEBHOOK_SECRET, et par sécurité tout autre secret Stripe qui commence par whsec_. */
const ENV = Deno.env.toObject();
const CLE_STRIPE = ["STRIPE_SECRET_KEY2", "STRIPE_SECRET_KEY"].map((n) => (ENV[n] ?? "").trim()).find((v) => /^(sk|rk)_/.test(v)) ?? "";
const SECRETS_WEBHOOK = [ENV.STRIPE_WEBHOOK_SECRET ?? ""].concat(Object.keys(ENV).filter((n) => /stripe/i.test(n)).map((n) => ENV[n]))
  .map((v) => (v ?? "").trim()).filter((v, i, a) => /^whsec_/.test(v) && a.indexOf(v) === i);
const SECRET_WEBHOOK = SECRETS_WEBHOOK[0] ?? "";
const stripe = new Stripe(CLE_STRIPE || "sk_test_absente", { httpClient: Stripe.createFetchHttpClient() });
const crypto = Stripe.createSubtleCryptoProvider();
const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

type Offre = { fam: "pass" | "cercle" | "praticien"; mois?: number; formule?: string };
const OFFRES: Record<string, Offre> = {
  passMois: { fam: "pass" }, pass3Mois: { fam: "pass", mois: 3 },
  cercleMois: { fam: "cercle" }, cercleFondatrice: { fam: "cercle" }, cercleAn: { fam: "cercle" }, cercleAnnee: { fam: "cercle", mois: 12 },
  praticienMois: { fam: "praticien", formule: "mois" }, praticienFondateur: { fam: "praticien", formule: "fondateur" },
  praticienAn: { fam: "praticien", formule: "annee", mois: 12 }, praticienFondateurAn: { fam: "praticien", formule: "annee", mois: 12 },
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
    const ligne = { acces_jusqu: fin.toISOString(), formule: o.formule, fondateur: !!(p?.fondateur || o.formule === "fondateur" || cle === "praticienFondateurAn") };
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
  const cad = /^cad__([a-z0-9]{20})$/.exec(ref);
  if (cad) { await carteCadeau(session, cad[1]); return; }
  const imp = /^imp__([a-z0-9]{6,40})$/.exec(ref);
  if (imp) { await impression(session, imp[1]); return; }
  const m = /^([0-9a-f-]{36})__([A-Za-z0-9]{1,40})$/.exec(ref);
  if (!m) { console.log("Paiement sans client_reference_id exploitable", session.id); return; }
  const [, uid, cle] = m;
  const { data: deja } = await sb.from("achats").select("id").eq("stripe_session", session.id).maybeSingle();
  if (deja) return;   // Stripe peut renvoyer le même événement
  const sub = typeof session.subscription === "string" ? session.subscription : session.subscription?.id ?? null;
  const { error } = await sb.from("achats").insert({ user_id: uid, produit: cle, montant_centimes: session.amount_total ?? null, stripe_session: session.id,
    stripe_client: typeof session.customer === "string" ? session.customer : session.customer?.id ?? null, stripe_abonnement: sub });
  if (error) throw error;
  // si Stripe ne répond pas (clé absente ou fausse), l'accès s'ouvre quand même pour un mois ; la facture suivante (invoice.paid) le prolonge
  let fin: Date | null = null;
  if (sub) { try { fin = finAbonnement(await stripe.subscriptions.retrieve(sub)); } catch (e) { console.error("abonnement illisible", e); } }
  await ouvrir(uid, cle, fin, true);
  try { await remercier(uid, cle, session); } catch (e) { console.error("remercier", e); }
}

/* ───────── Carte cadeau du Cercle (fonction carte-cadeau) : client_reference_id = cad__<ref> ─────────
   Payée : on lui donne son code (CERCLE-XXXX-XXXX), puis les mails : l'acheteuse (tout de suite), la personne qui la reçoit
   (seulement si l'acheteuse l'a choisi, à la date choisie, 8 h), et l'alerte de vente à Laura. */
async function carteCadeau(session: any, ref: string) {
  const { data: x } = await sb.from("cartes_cadeaux").select("*").eq("ref", ref).maybeSingle();
  if (!x) { await alerter("Carte cadeau payée : introuvable", "Une carte cadeau a été payée, mais elle est introuvable", `Paiement Stripe ${session.id}, ${(session.amount_total ?? 0) / 100} €, ${session.customer_details?.email ?? ""}. Référence : ${ref}.`, undefined, undefined, "vente_alerte"); return; }
  if (x.statut !== "attente") return;   // Stripe peut renvoyer le même événement
  const A = "ABCDEFGHJKMNPQRSTUVWXYZ23456789", tire = () => Array.from(globalThis.crypto.getRandomValues(new Uint8Array(8)), (b) => A[b % A.length]).join("");
  let code = "";
  for (let i = 0; i < 5 && !code; i++) {
    const c = tire(), essai = "CERCLE-" + c.slice(0, 4) + "-" + c.slice(4);
    const { data: ok } = await sb.from("cartes_cadeaux").update({ code: essai, statut: "payee", stripe_session: session.id, paye_le: new Date().toISOString(), montant_centimes: session.amount_total ?? x.montant_centimes })
      .eq("id", x.id).eq("statut", "attente").select("id");
    if (ok?.length) code = essai; else { const { data: y } = await sb.from("cartes_cadeaux").select("statut").eq("id", x.id).maybeSingle(); if (y?.statut !== "attente") return; }
  }
  if (!code) throw new Error("code de carte cadeau impossible à créer");
  const pour = x.pour_prenom || "la personne à qui tu l'offres", de = x.de_prenom || "Quelqu'un qui tient à toi";
  const dateTxt = x.envoyer_le ? new Date(x.envoyer_le + "T12:00:00Z").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }) : "";
  const page = `${SITE}/carte-cadeau.html?ref=${ref}`, pageCode = `${SITE}/carte-cadeau.html?code=${code}`;
  await sb.from("mails").insert({
    email: x.email_acheteuse, prenom: x.de_prenom, type: "carte_cadeau_achat",
    objet: "Ta carte cadeau du Cercle est prête", surtitre: "Carte cadeau · Le Cercle", titre: "Merci, ta carte est prête",
    texte: `Ton paiement de ${euros(session.amount_total ?? x.montant_centimes)} est bien reçu : ta carte cadeau de **${x.mois} mois du Cercle** pour ${pour} est prête.\n\nSon code : **${code}**\n\n` +
      (x.envoi === "mail" ? `Comme tu l'as choisi, elle partira par e-mail à ${x.email_destinataire} le ${dateTxt}, à 8 h, avec ton petit mot. Tu peux aussi l'imprimer pour la glisser sous le sapin.`
        : `Tu peux l'imprimer, la glisser sous le sapin ou la transférer : tout est sur la page de ta carte.`) +
      `\n\nPour l'activer, il suffit d'aller sur ${SITE}/carte-cadeau.html et d'entrer le code, quand on le souhaite dans l'année : Le Cercle s'ouvre alors pour ${x.mois} mois, une étape chaque mois. Pas d'abonnement, rien n'est prélevé ensuite.`,
    bouton_texte: "Voir et imprimer la carte", bouton_lien: page,
  });
  if (x.envoi === "mail" && x.email_destinataire) {
    await sb.from("mails").insert({
      email: x.email_destinataire, prenom: x.pour_prenom, type: "carte_cadeau_recue", a_envoyer_le: new Date(x.envoyer_le + "T07:00:00Z").toISOString(),
      objet: `${x.de_prenom ? x.de_prenom + " t'offre" : "On t'offre"} ${x.mois} mois du Cercle`, surtitre: "Une carte cadeau pour toi", titre: x.pour_prenom ? `${x.pour_prenom}, un cadeau t'attend` : "Un cadeau t'attend",
      texte: `${de} t'offre **${x.mois} mois du Cercle** de Genesolia : un parcours guidé, mois par mois, pour comprendre ce qui se répète dans ta vie et dans ta lignée, avec un carnet chaque mois, deux séances audio guidées par mois et la formation « Sors de la boucle ».` +
        (x.message ? `\n\nSon petit mot :\n« ${x.message} »` : "") + `\n\nTon code : **${code}**\n\nTu l'actives quand tu veux dans l'année qui vient, en quelques secondes : Le Cercle s'ouvre alors pour ${x.mois} mois, une étape chaque mois. Pas d'abonnement, rien ne sera prélevé.`,
      bouton_texte: "Découvrir ma carte", bouton_lien: pageCode,
    });
  }
  await alerter(`Nouvelle vente : carte cadeau Le Cercle ${x.mois} mois (${euros(session.amount_total ?? x.montant_centimes)})`, "Une carte cadeau vendue",
    `${x.email_acheteuse}\n\nCarte : Le Cercle, ${x.mois} mois\nCode : ${code}\nPour : ${x.pour_prenom ?? "(sans prénom)"}${x.envoi === "mail" ? `\nEnvoi par mail à ${x.email_destinataire} le ${dateTxt}` : "\nRemise par l'acheteuse"}`,
    "https://dashboard.stripe.com/payments", "Ouvrir Stripe", "vente_alerte");
}

/* ───────── Arbre imprimé → Gelato (brouillon) ───────── */
/* La clé : secret GELATO_API_KEY, ou à défaut le premier secret dont le nom contient « gelato » (ex. « Gelato genesolia ») */
const GELATO_CLE = (() => {
  const env = Deno.env.toObject(); if (env.GELATO_API_KEY) return env.GELATO_API_KEY.trim();
  const k = Object.keys(env).find((n) => /gelato/i.test(n) && !/produit/i.test(n)); return k ? env[k].trim() : "";
})();
/* Produits Gelato (catalogue « Mounted Framed Poster » = livré monté, prêt à accrocher ; papier premium mat 200 g ; portrait).
   Lus dans le catalogue Gelato le 23/10/2026. */
const GELATO_PRODUITS: Record<string, string> = Object.assign({
  a4: "flat_product_pf_a4_pt_200-gsm-uncoated_cl_4-0_ct_none_prt_none_sft_none_set_none_ver",
  a3: "flat_product_pf_a3_pt_200-gsm-uncoated_cl_4-0_ct_none_prt_none_sft_none_set_none_ver",
  a4cadre: "frame_and_poster_mounted_product_frs_210x297mm_frc_natural-wood_frm_wood_frp_w12xt22-mm_gt_plexiglass__pf_a4_pt_200-gsm-uncoated_cl_4-0_ct_none_prt_none_ver",
  a3cadre: "frame_and_poster_mounted_product_frs_a3_frc_natural-wood_frm_wood_frp_w12xt22-mm_gt_plexiglass__pf_a3_pt_200-gsm-uncoated_cl_4-0_ct_none_prt_none_ver",
  a4cadreBlanc: "frame_and_poster_mounted_product_frs_210x297mm_frc_white_frm_wood_frp_w12xt22-mm_gt_plexiglass__pf_a4_pt_200-gsm-uncoated_cl_4-0_ct_none_prt_none_ver",
  a3cadreBlanc: "frame_and_poster_mounted_product_frs_a3_frc_white_frm_wood_frp_w12xt22-mm_gt_plexiglass__pf_a3_pt_200-gsm-uncoated_cl_4-0_ct_none_prt_none_ver",
  // grands formats (catalogue Gelato vérifié le 23/10/2026)
  g50: "flat_product_pf_500x700-mm_pt_200-gsm-uncoated_cl_4-0_ct_none_prt_none_sft_none_set_none_ver",
  g70: "flat_product_pf_700x1000-mm_pt_200-gsm-uncoated_cl_4-0_ct_none_prt_none_sft_none_set_none_ver",
  g50cadre: "frame_and_poster_mounted_product_frs_500x700-mm_frc_natural-wood_frm_wood_frp_w12xt22-mm_gt_plexiglass__pf_500x700-mm_pt_200-gsm-uncoated_cl_4-0_ct_none_prt_none_ver",
  g70cadre: "frame_and_poster_mounted_product_frs_700x1000-mm_frc_natural-wood_frm_wood_frp_w12xt22-mm_gt_plexiglass__pf_700x1000-mm_pt_200-gsm-uncoated_cl_4-0_ct_none_prt_none_ver",
}, (() => { try { return JSON.parse(Deno.env.get("GELATO_PRODUITS") ?? "{}"); } catch { return {}; } })());
const ALERTE = "contact@genesolia.fr";

/* ───────── Mails à la cliente (table mails, envoyés par la fonction envoi-mails) ───────── */
const SITE = "https://genesolia.fr";
const FORMATS: Record<string, string> = {
  a4: "Poster A4, 21 × 29,7 cm, sur papier mat 200 g",
  a3: "Poster A3, 29,7 × 42 cm, sur papier mat 200 g",
  a4cadre: "A4 encadré : cadre en bois naturel et plexiglas, environ 23,4 × 32,1 cm, livré monté, prêt à accrocher",
  a3cadre: "A3 encadré : cadre en bois naturel et plexiglas, environ 32,1 × 44,4 cm, livré monté, prêt à accrocher",
  g50: "Grand poster 50 × 70 cm, sur papier mat 200 g",
  g70: "Très grand poster 70 × 100 cm, sur papier mat 200 g",
  g50cadre: "50 × 70 cm encadré : cadre en bois naturel et plexiglas, environ 52,4 × 72,4 cm, livré monté, prêt à accrocher",
  g70cadre: "70 × 100 cm encadré : cadre en bois naturel et plexiglas, environ 72,4 × 102,4 cm, livré monté, prêt à accrocher",
};
const STYLES: Record<string, string> = { grand: "Grand arbre", figuier: "Figuier peint", dore: "Arbre doré", lignee: "Lignée", medaillons: "Médaillons", famille: "Notre famille", descendants: "Descendants", eventail: "Éventail" };
const prenomDe = (d: any) => String(d.prenom || "").trim().split(/\s+/)[0] || null;
const adresseDe = (x: any) => [x.nom_complet, (x.adresse ?? "") + (x.complement ? ", " + x.complement : ""), (x.code_postal ?? "") + " " + (x.ville ?? ""), "France"].filter((l) => String(l ?? "").trim()).join("\n");

async function confirmerCliente(d: any, x: any) {
  if (!d.email) return;
  // la relance « ton arbre t'attend » n'a plus lieu d'être
  await sb.from("mails").update({ ok_envoyer: false }).eq("type", "commande-attente").eq("envoye", false).eq("email", d.email);
  const titre = x.titre || "Ton arbre";
  const pay = x.orientation === "paysage", fmt0 = String(FORMATS[x.format] ?? x.format_nom ?? x.format);
  const fmtTexte = pay ? fmt0.replace(/(\d+(?:,\d+)?) × (\d+(?:,\d+)?) cm/, "$2 × $1 cm") + ", à l'horizontale" : fmt0;
  const recap = [
    `Ton arbre : « ${titre} »${x.sous_titre ? ", " + x.sous_titre : ""}`,
    x.style ? `Style : ${STYLES[x.style] ?? x.style}` : "",
    `Format : ${fmtTexte}`,
    x.cadeau === "oui" ? `Cadeau${x.mot ? `, avec le petit mot imprimé : « ${x.mot} »` : ""}` : "",
    `Prix payé : ${x.montant_paye} €, livraison comprise`,
  ].filter(Boolean).join("\n");
  await sb.from("mails").insert({
    email: d.email, prenom: prenomDe(d), type: "commande-confirmee",
    objet: `Commande confirmée : « ${titre} »`,
    surtitre: `Commande n° G-${d.id}`,
    titre: "Ta commande est confirmée",
    texte: `Merci pour ta commande ! Ton paiement de ${x.montant_paye} € est bien reçu.\n\n${recap}\n\nLivraison à :\n${adresseDe(x)}\n\n` +
      `Ton arbre est imprimé pour toi, à la commande, puis expédié dans un emballage protégé. Il arrive chez toi en ${/^g/.test(String(x.format)) ? "6 à 11" : "3 à 7"} jours ouvrés (un peu plus pendant les fêtes de fin d'année). Tu reçois un e-mail avec le numéro de suivi dès qu'il part.\n\n` +
      `Une faute dans l'adresse, un prénom ou une date ? Réponds à ce mail le plus vite possible, idéalement dans la journée : on peut encore corriger avant l'impression.`,
    encadre_titre: "À la réception",
    encadre_texte: `Si ton arbre arrive abîmé, présente un défaut d'impression ou ne correspond pas à ta commande, réponds à ce mail avec une photo dans les 14 jours : il est réimprimé et renvoyé gratuitement, ou remboursé. C'est un objet personnalisé : il ne peut pas être retourné pour un changement d'avis. [Les conditions complètes](${SITE}/cgv.html#arbre-imprime)`,
    bouton_texte: "Retrouver mon arbre", bouton_lien: SITE + "/genosociogramme.html",
  });
}

async function alerter(objet: string, titre: string, texte: string, lien?: string, bouton?: string, type = "alerte-impression") {
  await sb.from("mails").insert({ email: ALERTE, prenom: "Laura", type, objet, titre, texte,
    bouton_texte: lien ? (bouton ?? "Ouvrir") : null, bouton_lien: lien ?? null });
}

async function impression(session: any, ref: string) {
  const { data: d } = await sb.from("demandes").select("id,email,prenom,details").eq("formulaire", "Commande impression").eq("details->>ref", ref).order("cree_le", { ascending: false }).limit(1).maybeSingle();
  if (!d) {
    await alerter("Arbre imprimé payé : commande introuvable", "Un arbre imprimé a été payé, mais sa commande est introuvable",
      `Paiement Stripe ${session.id}, ${(session.amount_total ?? 0) / 100} €, ${session.customer_details?.email ?? ""}. Référence : ${ref}. Retrouve la commande dans Supabase (table demandes) et passe-la à la main sur Gelato.`);
    return;
  }
  const x = d.details ?? {};
  if (x.paiement_statut === "payé") return;   // Stripe peut renvoyer le même événement
  const maj: Record<string, unknown> = { ...x, paiement_statut: "payé", stripe_session: session.id, montant_paye: (session.amount_total ?? 0) / 100, paye_le: new Date().toISOString() };
  // payé tout de suite (un nouvel essai de Stripe ne renverra pas les mails), puis confirmation à la cliente
  await sb.from("demandes").update({ details: maj }).eq("id", d.id);
  try { await confirmerCliente(d, maj); } catch (e) { console.error("confirmation cliente", e); }
  let lienFichier = "";
  if (x.fichier && !/régénérer/.test(x.fichier)) {
    const { data: s } = await sb.storage.from("impressions").createSignedUrl(x.fichier, 60 * 24 * 3600);   // 60 jours : le temps de valider et d'imprimer
    lienFichier = s?.signedUrl ?? "";
  }
  /* arbre à l'horizontale (styles Lignée, Médaillons) : même produit Gelato, en orientation horizontale */
  const produit = (GELATO_PRODUITS[x.format] ?? "").replace(/_ver$/, x.orientation === "paysage" ? "_hor" : "_ver");
  const nom = String(x.nom_complet ?? "").trim().split(/\s+/), prenomL = nom.shift() || d.prenom || "", nomL = nom.join(" ") || prenomL;
  const resume = `${x.format_nom ?? x.format}${x.orientation === "paysage" ? " (horizontal)" : ""} · ${x.prix ?? ""} payé (${maj.montant_paye} €)\n${x.nom_complet}\n${x.adresse}${x.complement ? ", " + x.complement : ""}\n${x.code_postal} ${x.ville}${x.telephone ? "\nTél. " + x.telephone : ""}\nE-mail : ${d.email}${x.cadeau === "oui" ? "\nCadeau" + (x.mot ? " · mot : « " + x.mot + " »" : "") : ""}`;
  if (GELATO_CLE && produit && lienFichier) {
    const r = await fetch("https://order.gelatoapis.com/v4/orders", { method: "POST", headers: { "X-API-KEY": GELATO_CLE, "Content-Type": "application/json" },
      body: JSON.stringify({ orderType: "draft", orderReferenceId: "genesolia-" + d.id, customerReferenceId: String(d.email || "client").slice(0, 100), currency: "EUR",
        items: [{ itemReferenceId: "arbre-" + d.id, productUid: produit, files: [{ type: "default", url: lienFichier }], quantity: 1 }],
        shippingAddress: { firstName: prenomL, lastName: nomL, addressLine1: x.adresse ?? "", addressLine2: x.complement ?? "", city: x.ville ?? "", postCode: x.code_postal ?? "",
          country: "FR", email: d.email ?? "", phone: x.telephone ?? "" } }) });
    const j = await r.json().catch(() => ({}));
    if (r.ok && j.id) {
      maj.gelato_id = j.id; maj.gelato_statut = "brouillon";
      await sb.from("demandes").update({ details: maj }).eq("id", d.id);
      await alerter("Arbre imprimé à valider sur Gelato", "Nouvelle commande à valider sur Gelato",
        `${resume}\n\nLa commande est dans ton tableau de bord Gelato en brouillon (n° ${j.id}). Vérifie l'aperçu et l'adresse, puis clique sur « Valider » : rien n'est imprimé ni payé avant.`,
        "https://dashboard.gelato.com/orders", "Ouvrir Gelato");
      return;
    }
    maj.gelato_erreur = String(r.status) + " " + JSON.stringify(j).slice(0, 400);
  } else maj.gelato_erreur = !GELATO_CLE ? "clé Gelato absente" : !produit ? "référence produit Gelato manquante pour " + x.format : "fichier introuvable";
  await sb.from("demandes").update({ details: maj }).eq("id", d.id);
  await alerter("Arbre imprimé payé : à passer sur Gelato", "Un arbre imprimé a été payé",
    `${resume}\n\nLa commande n'a pas pu partir toute seule chez Gelato (${maj.gelato_erreur}). Passe-la à la main dans Gelato avec le fichier ci-dessous (lien valable 60 jours).`,
    lienFichier || undefined, "Télécharger le fichier");
}

/* ───────── Achat confirmé : mail de remerciement à la cliente + alerte à Laura (table mails) ───────── */
const NOMS: Record<string, string> = {
  passMois: "Le Pass, 10 € par mois", pass3Mois: "Le Pass, 3 mois",
  cercleMois: "Le Cercle, 29 € par mois", cercleFondatrice: "Le Cercle, prix fondatrice à 24,90 € par mois", cercleAn: "Le Cercle, 24 € par mois sur 12 mois", cercleAnnee: "Le Cercle, à l'année",
  praticienMois: "l'Espace praticien, 24 € par mois", praticienFondateur: "l'Espace praticien, tarif fondateur à 19 € par mois",
  praticienAn: "l'Espace praticien, 240 € l'année", praticienFondateurAn: "l'Espace praticien, tarif fondateur à 190 € l'année",
  carnet: "ton carnet du mois", rapport: "le rapport de ton arbre", numerologie: "ton livret de numérologie", saisons: "Les 12 saisons",
  astral: "ton livret du thème astral", arbreDeVie: "ton livret de l'arbre de vie", mayaDuo: "votre analyse maya à deux", arbreEncadrer: "ton arbre à encadrer",
};
const GESTION = "https://billing.stripe.com/p/login/7sY28k3773S1cix9qD43S00";
const euros = (c: number) => (c / 100).toFixed(2).replace(".", ",").replace(",00", "") + " €";

async function remercier(uid: string, cle: string, session: any) {
  const { data: u } = await sb.auth.admin.getUserById(uid);
  const email = String(u?.user?.email ?? session.customer_details?.email ?? "").toLowerCase();
  if (!email) return;
  const prenom = String(u?.user?.user_metadata?.full_name ?? session.customer_details?.name ?? "").trim().split(/\s+/)[0] || null;
  const o = OFFRES[cle], nom = NOMS[cle] ?? cle, montant = session.amount_total ?? 0, abo = !!session.subscription;
  const fam = o?.fam;
  const lien = fam === "cercle" ? SITE + "/cercle.html" : fam === "pass" ? SITE + "/pass.html" : fam === "praticien" ? SITE + "/praticien.html" : SITE + "/login.html";
  const bouton = fam === "cercle" ? "Ouvrir mon Cercle" : fam === "pass" ? "Ouvrir Ma spirale" : fam === "praticien" ? "Ouvrir mon Espace praticien" : "Ouvrir mon espace";
  const surtitre = fam === "cercle" ? "Le Cercle" : fam === "pass" ? "Ma spirale" : fam === "praticien" ? "Espace praticien" : "Genesolia";
  const { data: c } = await sb.rpc("n8n_enregistrer_contact", { p_email: email, p_prenom: prenom, p_champs: { compte: true, user_id: uid } });
  await sb.from("mails").insert({
    contact_id: c?.id ?? null, email, prenom, type: "achat_merci",
    objet: "Merci ! Ton achat est confirmé", surtitre, titre: "Merci pour ta confiance",
    texte: `Ton achat est confirmé : **${nom}**.` + (montant > 0 ? ` Ton paiement de ${euros(montant)} est bien reçu.` : " Rien n'est prélevé aujourd'hui.") + "\n\n" +
      (o ? "Ton accès est ouvert dès maintenant. Tu retrouves tout dans ton espace, avec ton e-mail et ton mot de passe." : "Tu le retrouves dans ton espace, avec ton e-mail et ton mot de passe.") + "\n\n" +
      "Une question ? Réponds simplement à ce mail : on te répond personnellement.",
    bouton_texte: bouton, bouton_lien: lien,
    encadre_titre: abo ? "Ton abonnement" : null,
    encadre_texte: abo ? `Tu peux le gérer ou l'arrêter à tout moment, sans frais, depuis [ton espace de paiement](${GESTION}).` : null,
  });
  await alerter(`Nouvelle vente : ${nom}` + (montant > 0 ? ` (${euros(montant)})` : ""), "Une nouvelle vente",
    `${prenom ?? "(sans prénom)"} · ${email}\n\nAchat : ${nom}\nMontant : ${montant > 0 ? euros(montant) : "0 € aujourd'hui (essai ou paiement différé)"}` + (abo ? "\nAbonnement Stripe : " + session.subscription : ""),
    "https://dashboard.stripe.com/payments", "Ouvrir Stripe", "vente_alerte");
}

async function achatDeLAbonnement(sub: string) {
  const { data } = await sb.from("achats").select("user_id,produit").eq("stripe_abonnement", sub).order("cree_le", { ascending: false }).limit(1).maybeSingle();
  return data;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("ok");
  if (!SECRET_WEBHOOK) return new Response("Secret du webhook Stripe manquant", { status: 503 });   // sans clé secrète, les paiements sont quand même enregistrés et les accès ouverts
  const corps = await req.text();
  let ev: any;
  for (const s of SECRETS_WEBHOOK) { try { ev = await stripe.webhooks.constructEventAsync(corps, req.headers.get("stripe-signature") ?? "", s, undefined, crypto); break; } catch (_) { /* secret suivant */ } }
  if (!ev) return new Response("Signature invalide", { status: 400 });
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
        try {
          const { data: u } = await sb.auth.admin.getUserById(a.user_id);
          await alerter(`Abonnement arrêté : ${NOMS[a.produit] ?? a.produit}`, "Un abonnement s'est arrêté",
            `${u?.user?.email ?? a.user_id}\n\nAbonnement : ${NOMS[a.produit] ?? a.produit}\nAccès jusqu'au : ${new Date(fin).toLocaleDateString("fr-FR")}`, undefined, undefined, "vente_alerte");
        } catch (e) { console.error("alerte arrêt", e); }
      }
    }
    return new Response(JSON.stringify({ recu: true }), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    console.error("stripe-webhook", ev?.type, e);
    return new Response("Erreur", { status: 500 });   // Stripe réessaiera
  }
});
