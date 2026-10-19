// Genesolia · fonction Supabase « seance-offerte » : la première séance audio offerte, contre l'e-mail.
// POST { email, prenom?, seance: 'c1-10' | 'c2-10', accord: true } : enregistre le contact (table contacts),
//      prépare le mail « Ta séance offerte » (table mails, à valider par Laura : ok_envoyer = false),
//      et renvoie { url, jeton } : le lien d'écoute de la séance complète (dossier privé « seances », valable 6 heures).
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
  const S = OFFERTES[seance];
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
    // Un seul mail par séance et par personne
    const { data: deja } = await sb.from("mails").select("id").eq("contact_id", c.id).eq("type", "seance_offerte_" + seance).limit(1);
    if (!deja || !deja.length) {
      await sb.from("mails").insert({
        contact_id: c.id, email, prenom: prenom || null, type: "seance_offerte_" + seance, ok_envoyer: false,
        objet: "Ta séance offerte : " + S.titre, surtitre: S.cycle, titre: "Ta séance « " + S.titre + " »",
        texte: "La voici, en entier, à écouter autant de fois que tu veux.\n\nInstalle-toi au calme, avec un casque si tu peux, assise ou allongée. Laisse-toi guider : il n’y a rien à réussir, seulement à écouter.\n\nÉcoute-la au calme, jamais en conduisant.",
        bouton_texte: "Écouter ma séance", bouton_lien: "https://genesolia.fr/seance-offerte.html?s=" + seance + "&j=" + jeton,
        image: "assets/partage/deux-cycles.jpg",
        encadre_titre: "Cette séance fait partie du Cercle",
        encadre_texte: "24 séances dans l’année, tes deux livres Renaissance et Libération, la formation « Sors de la boucle » et ton appli. [Ton premier mois est offert, sans carte](https://genesolia.fr/abonnement.html).",
      });
    }
  }

  const { data: lien, error: e2 } = await sb.storage.from("seances").createSignedUrl(seance + ".mp3", 6 * 3600);
  if (e2 || !lien?.signedUrl) return json({ bientot: true, jeton });
  return json({ url: lien.signedUrl, jeton });
});
