// Genesolia · fonction Supabase « gelato-suivi » : reçoit les notifications de Gelato (webhooks) pour les arbres imprimés.
// À brancher une fois dans Gelato (Developers > Webhooks) : https://qsvzzkjtjsznfntahvvh.supabase.co/functions/v1/gelato-suivi
// Événements utiles : order_status_updated et order_item_tracking_code_updated.
// Expédié → la cliente reçoit « Ton arbre est en route » avec le lien de suivi.
// Livré → « Ton arbre est arrivé » (garanties, comment l'accrocher).
// Annulé ou refusé → alerte à contact@genesolia.fr.
// Sécurité : Gelato ne signe pas ses notifications. On ne croit donc que la commande relue chez Gelato avec la clé du compte,
// et seulement si elle correspond à une commande du site (details.gelato_id). Chaque mail ne part qu'une fois (details.mail_*).
import { createClient } from "npm:@supabase/supabase-js@2";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const GELATO_CLE = (() => {
  const env = Deno.env.toObject(); if (env.GELATO_API_KEY) return env.GELATO_API_KEY.trim();
  const k = Object.keys(env).find((n) => /gelato/i.test(n) && !/produit/i.test(n)); return k ? env[k].trim() : "";
})();
const SITE = "https://genesolia.fr", ALERTE = "contact@genesolia.fr";
const ok = (o: unknown = { recu: true }) => new Response(JSON.stringify(o), { headers: { "Content-Type": "application/json" } });
const prenomDe = (d: any) => String(d.prenom || "").trim().split(/\s+/)[0] || null;

async function lireCommande(id: string) {
  if (!GELATO_CLE) return null;
  const r = await fetch("https://order.gelatoapis.com/v4/orders/" + encodeURIComponent(id), { headers: { "X-API-KEY": GELATO_CLE } });
  return r.ok ? await r.json().catch(() => null) : null;
}
/* Le suivi : dans la notification, sinon dans la commande relue */
function suiviDe(ev: any, cmd: any) {
  const liste: any[] = [];
  if (ev?.trackingUrl || ev?.trackingCode) liste.push(ev);
  for (const src of [ev, cmd]) for (const it of src?.items ?? []) for (const f of it?.fulfillments ?? []) liste.push(f);
  for (const p of cmd?.shipment?.packages ?? []) liste.push(p);
  const f = liste.find((x) => x?.trackingUrl) ?? liste.find((x) => x?.trackingCode) ?? {};
  return { url: String(f.trackingUrl ?? ""), code: String(f.trackingCode ?? ""), transporteur: String(f.shipmentMethodName ?? cmd?.shipment?.shipmentMethodName ?? "") };
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("ok");
  let ev: any; try { ev = await req.json(); } catch { return ok({ ignore: "corps illisible" }); }
  const orderId = String(ev?.orderId ?? ""), refCmd = String(ev?.orderReferenceId ?? "");
  const m = /^genesolia-(\d+)$/.exec(refCmd);
  if (!orderId || !m) return ok({ ignore: "pas une commande du site" });

  const { data: d } = await sb.from("demandes").select("id,email,prenom,details").eq("id", Number(m[1])).maybeSingle();
  const x: any = d?.details ?? {};
  if (!d || x.gelato_id !== orderId) return ok({ ignore: "commande inconnue" });

  const cmd = await lireCommande(orderId);
  if (!cmd) return new Response("Commande illisible chez Gelato", { status: 502 });   // Gelato réessaiera
  const statut = String(cmd.fulfillmentStatus ?? "").toLowerCase();
  const suivi = suiviDe(ev, cmd);
  const maj: any = { ...x, gelato_statut: statut || x.gelato_statut };
  if (suivi.url) maj.suivi_url = suivi.url;
  if (suivi.code) maj.suivi_code = suivi.code;
  const titre = x.titre || "Ton arbre";

  const expedie = ["shipped", "in_transit", "delivered"].includes(statut) || (!!(suivi.url || suivi.code) && !["canceled", "cancelled", "rejected"].includes(statut));
  if (expedie && !x.mail_expedie && d.email) {
    maj.mail_expedie = new Date().toISOString();
    await sb.from("mails").insert({
      email: d.email, prenom: prenomDe(d), type: "commande-expediee",
      objet: `Ton arbre « ${titre} » est en route`, surtitre: `Commande n° G-${d.id}`, titre: "Ton arbre est en route",
      texte: `Bonne nouvelle : ton arbre « ${titre} » est imprimé et vient de partir. Il est bien emballé pour voyager sans se plier ni s'abîmer.\n\n` +
        (suivi.code ? `Numéro de suivi : ${suivi.code}${suivi.transporteur ? " (" + suivi.transporteur + ")" : ""}\n\n` : "") +
        `Il arrive en général sous quelques jours ouvrés. Le suivi peut mettre quelques heures à s'afficher chez le transporteur : si rien n'apparaît tout de suite, réessaie un peu plus tard.\n\n` +
        `Pense à prévoir quelqu'un pour le recevoir, ou à vérifier ta boîte aux lettres et ton avis de passage.`,
      bouton_texte: suivi.url ? "Suivre mon colis" : null, bouton_lien: suivi.url || null,
      encadre_titre: "Un souci avec la livraison ?",
      encadre_texte: "Réponds simplement à ce mail : on s'en occupe avec toi. Un colis perdu est renvoyé gratuitement.",
    });
  }

  if (statut === "delivered" && !x.mail_livre && d.email) {
    maj.mail_livre = new Date().toISOString();
    await sb.from("mails").insert({
      email: d.email, prenom: prenomDe(d), type: "commande-livree",
      objet: `Ton arbre « ${titre} » est arrivé`, surtitre: `Commande n° G-${d.id}`, titre: "Ton arbre est arrivé",
      texte: `Ton arbre « ${titre} » a été livré. On espère qu'il te plaît autant qu'à nous, et qu'il trouvera une belle place chez toi.\n\n` +
        (/cadre/.test(x.format ?? "") ? "Il est livré monté, prêt à accrocher : les attaches sont au dos (vis ou clous non fournis). Retire le film de protection du plexiglas s'il y en a un, et évite le plein soleil pour garder ses couleurs.\n\n"
          : "Pour le garder longtemps beau, choisis un cadre au format de ton affiche et évite le plein soleil.\n\n") +
        `Ton arbre continue de vivre dans ton espace Genesolia : tu peux le compléter, ajouter des dates, et voir ce qui se répète dans ta lignée.`,
      bouton_texte: "Retrouver mon arbre", bouton_lien: SITE + "/genosociogramme.html",
      encadre_titre: "Un défaut, un coin abîmé ?",
      encadre_texte: `Réponds à ce mail avec une photo dans les 14 jours : ton arbre est réimprimé et renvoyé gratuitement, ou remboursé. [Les conditions](${SITE}/cgv.html#arbre-imprime)`,
    });
  }

  if (["canceled", "cancelled", "rejected"].includes(statut) && !x.alerte_annule) {
    maj.alerte_annule = new Date().toISOString();
    await sb.from("mails").insert({ email: ALERTE, prenom: "Laura", type: "alerte-impression",
      objet: `Arbre imprimé : commande G-${d.id} annulée chez Gelato`, titre: "Une commande Gelato est annulée ou refusée",
      texte: `La commande G-${d.id} (« ${titre} », ${x.format_nom ?? x.format}, ${d.email}) est passée au statut « ${statut} » chez Gelato. Vérifie dans Gelato et préviens la cliente (remboursement Stripe si besoin).`,
      bouton_texte: "Ouvrir Gelato", bouton_lien: "https://dashboard.gelato.com/orders" });
  }

  await sb.from("demandes").update({ details: maj }).eq("id", d.id);
  return ok({ statut });
});
