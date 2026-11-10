// Genesolia · fonction Supabase « seance-offerte » : la première séance audio offerte, contre l'e-mail.
// POST { email, prenom?, seance: 'c1-10' | 'c2-10', accord: true } : enregistre le contact (table contacts),
//      prépare le mail « Ta séance offerte » (envoyé tout de suite) et « Télécharge ton espace Le Cercle » (2 jours après),
//      et renvoie { url, jeton } : le lien d'écoute de la séance complète (dossier privé « seances », valable 6 heures).
// POST { email, prenom?, seance: 'point-de-depart', accord: true } : même chose pour le point de départ offert (mail avec son lien), renvoie { ok, jeton }.
// POST { jeton, seance } : pour réécouter (lien du mail, ou retour sur la page) : renvoie un nouveau lien.
// Seules les deux premières séances (une par cycle) sont offertes. verify_jwt désactivé : rien de privé n'est exposé.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const json = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });
const OFFERTES: Record<string, { titre: string; cycle: string; libere: string }> = {
  "c1-10": { titre: "Sortir de l’alerte", cycle: "Cycle 1 · De la peur à la paix", libere: "l’état d’alerte permanent" },
  "c2-10": { titre: "L’arbre des liens", cycle: "Cycle 2 · Comment j’aime", libere: "ce qui pèse dans ta façon d’aimer" },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ erreur: "méthode" }, 405);
  let b: Record<string, unknown> = {};
  try { b = await req.json(); } catch { b = {}; }
  const seance = String(b.seance ?? "");
  const PD = seance === "point-de-depart";   // l'autre offert du site : le point de départ (même demande d'e-mail)
  const S = PD ? { titre: "Ton point de départ", cycle: "Le Cercle · offert", libere: "" } : OFFERTES[seance];
  if (!S) return json({ erreur: "seance" }, 400);
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  let jeton = "";

  if (typeof b.jeton === "string" && /^[0-9a-f-]{36}$/i.test(b.jeton)) {
    const { data: c } = await sb.from("contacts").select("jeton").eq("jeton", b.jeton).maybeSingle();
    if (!c) return json({ erreur: "jeton" }, 404);
    jeton = c.jeton;
  } else {
    const email = String(b.email ?? "").trim().toLowerCase(), prenom = String(b.prenom ?? "").trim().slice(0, 60);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200) return json({ erreur: "email" }, 400);
    if (b.accord !== true) return json({ erreur: "accord" }, 400);
    const { data: c, error } = await sb.rpc("n8n_enregistrer_contact", { p_email: email, p_prenom: prenom || null, p_champs: { newsletter: true, interet_cercle: true } });
    if (error || !c?.id) return json({ erreur: "contact" }, 500);
    jeton = c.jeton;
    // Un seul envoi par séance et par personne : le mail de la séance tout de suite, puis l'invitation au Cercle 2 jours après
    const { data: deja } = await sb.from("mails").select("id").eq("contact_id", c.id).eq("type", "seance_offerte_" + seance).limit(1);
    if (!deja || !deja.length) {
      const avantages = "deux nouvelles séances guidées à chaque étape, ton carnet Renaissance pour sortir de la peur et du mode survie, ton livret Libération pour comprendre comment tu aimes et aimer plus grand, la formation « Sors de la boucle » en 8 modules à écouter en podcast, et ton appli avec ton point du jour et ton mois personnel";
      const { data: suite } = await sb.from("mails").select("id").eq("contact_id", c.id).in("type", ["seance_offerte_suite", "offert_suite"]).limit(1);
      const envois: Record<string, unknown>[] = [PD ? {
        contact_id: c.id, email, prenom: prenom || null, type: "seance_offerte_" + seance, ok_envoyer: true, a_envoyer_le: new Date().toISOString(),
        objet: "Ton point de départ t’attend", surtitre: "Le Cercle · offert", titre: "Ton point de départ, en 15 minutes",
        texte: "Ta roue de la vie, ton mode survie, tes blessures du cœur et tes cibles : en quinze minutes, tu vois d’où tu pars et ce qui se rejoue pour toi.\n\nPrends un moment au calme. Il n’y a rien de juste ou de faux, seulement tes réponses, avec tes mots.\n\nTes résultats sont gardés, et repris tels quels si tu ouvres ton mois offert du Cercle.",
        bouton_texte: "Faire mon point de départ", bouton_lien: "https://genesolia.fr/point-de-depart.html",
        image: "assets/partage/deux-cycles.jpg",
        encadre_titre: "Ton mois offert dans Le Cercle",
        encadre_texte: "Après ton point de départ, Le Cercle t’accompagne : " + avantages + ". [Ouvre ton mois offert, sans carte](https://genesolia.fr/essai.html).",
      } : {
        contact_id: c.id, email, prenom: prenom || null, type: "seance_offerte_" + seance, ok_envoyer: true, a_envoyer_le: new Date().toISOString(),
        objet: "Ta séance offerte : " + S.titre, surtitre: S.cycle, titre: "Ta séance « " + S.titre + " »",
        texte: "La voici, en entier, à écouter autant de fois que tu veux.\n\nInstalle-toi au calme, avec un casque si tu peux, assise ou allongée. Laisse-toi guider : il n’y a rien à réussir, seulement à écouter.\n\nÉcoute-la au calme, jamais en conduisant.",
        bouton_texte: "Écouter ma séance", bouton_lien: "https://genesolia.fr/seance-offerte.html?s=" + seance + "&j=" + jeton,
        image: "assets/partage/deux-cycles.jpg",
        encadre_titre: "Et si tu continuais avec Le Cercle ?",
        encadre_texte: "Cette séance fait partie du Cercle. Dans ton espace, tu as " + avantages + ". [Télécharge ton espace Le Cercle : ton premier mois est offert, sans carte](https://genesolia.fr/essai.html).",
      }];
      if (!suite || !suite.length) envois.push({
        contact_id: c.id, email, prenom: prenom || null, type: "offert_suite", ok_envoyer: true,
        a_envoyer_le: new Date(Date.now() + 2 * 864e5).toISOString(),
        objet: "Ton espace Le Cercle t’attend", surtitre: "Le Cercle", titre: "Télécharge ton espace Le Cercle",
        texte: (PD ? "Tu as reçu ton point de départ." : "Tu as reçu ta séance « " + S.titre + " ».") + " Imagine ce rendez-vous avec toi-même à chaque étape, pendant un an, sans rien avoir à organiser.\n\nDans ton espace Le Cercle, tu as " + avantages + ".\n\nQuinze minutes par semaine, sur ton téléphone ou ton ordinateur. Ton premier mois est offert, sans carte et sans engagement. Ensuite 29 € par mois, et 24,90 € par mois pour les 100 premières.",
        bouton_texte: "Ouvrir mon mois offert", bouton_lien: "https://genesolia.fr/essai.html",
        image: "assets/partage/deux-cycles.jpg",
        encadre_titre: "Tu as déjà fait ton point de départ ?",
        encadre_texte: "Il est repris tel quel dans ton Cercle : tu n’as rien à refaire. Sinon, [fais-le en 15 minutes](https://genesolia.fr/point-de-depart.html), il oriente tout ton parcours.",
      });
      // toutes les lignes ont les mêmes colonnes : sinon a_envoyer_le part vide et l’insertion entière est refusée
      const { error: eM } = await sb.from("mails").insert(envois);
      if (eM) console.error("mails", eM.message);
    }
  }

  if (PD) return json({ ok: true, jeton });
  const { data: lien, error: e2 } = await sb.storage.from("seances").createSignedUrl(seance + ".mp3", 6 * 3600);
  if (e2 || !lien?.signedUrl) return json({ bientot: true, jeton });
  return json({ url: lien.signedUrl, jeton });
});
