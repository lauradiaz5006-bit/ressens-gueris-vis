// Genesolia · fonction Supabase « resultat-parcours » : le résultat détaillé du parcours guidé (« Trouver mon cycle »), contre l'e-mail.
// POST { email, prenom?, accord: true, theme, emotion?, niveau?, indices?: string[] }
//   enregistre le contact (table contacts), prépare dans la table mails « Ton résultat détaillé » (envoyé au prochain passage
//   de la fonction envoi-mails, dans les 10 minutes) et, une seule fois par personne, « Ton espace Le Cercle t'attend » 2 jours après.
//   Un seul mail de résultat par personne et par jour. Aucun compte demandé. verify_jwt désactivé : rien de privé n'est exposé.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const json = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });

type Theme = { titre: string; cycle: 1 | 2; lecture: string; gestes: [string, string, string] };
const RACINE = "Cycle 1 · La racine : te sentir en sécurité";
const COEUR = "Cycle 2 · Le cœur : aimer et être aimé·e";
const THEMES: Record<string, Theme> = {
  relations: { titre: "Les relations", cycle: 2,
    lecture: "Les liens peuvent devenir une scène où se rejouent d’anciens attachements, des peurs de perte ou des places familiales. Ce qui revient dans tes relations parle souvent de ta façon d’aimer, apprise très tôt, et de ce qu’on t’a transmis sur l’amour.",
    gestes: ["Note la dernière scène qui s’est répétée : avec qui, à quel moment, ce que tu as ressenti juste avant.", "Cherche dans ta famille une histoire de lien qui lui ressemble : un départ, une rupture, une place tenue par quelqu’un d’autre.", "La prochaine fois que la scène commence, prends trois respirations et demande-toi : « Qu’est-ce que j’ai peur de perdre, là, maintenant ? »"] },
  confiance: { titre: "La confiance", cycle: 2,
    lecture: "Le manque de confiance peut venir d’une ancienne interdiction intérieure : ne pas se montrer, ne pas prendre trop de place. Il touche souvent à la façon dont tu as appris à être aimé·e : en faisant plaisir, en t’effaçant, en étant parfait·e.",
    gestes: ["Note une situation de la semaine où tu t’es fait·e petit·e, et la phrase qui t’est venue à ce moment-là.", "Demande-toi qui, dans ta famille, n’avait pas le droit de se montrer ou de réussir.", "Cette semaine, donne ton avis une fois en premier, dans une situation sans enjeu."] },
  argent: { titre: "L’argent", cycle: 1,
    lecture: "L’argent peut porter des mémoires de manque, de dette, de culpabilité, de mérite ou de danger. Il touche au cycle de la racine : la sécurité, le droit de recevoir et de garder.",
    gestes: ["Écris trois phrases sur l’argent que tu entendais enfant, telles qu’elles te reviennent.", "Repère dans ta lignée une perte, une faillite, une période de manque, même racontée à demi-mot.", "Chaque soir de cette semaine, note une chose qui a suffi aujourd’hui."] },
  energie: { titre: "La charge", cycle: 1,
    lecture: "Porter trop peut venir d’une place prise très tôt dans la famille : celle de la personne qui tient tout. Cette place touche au cycle de la racine, là où l’on apprend que la sécurité passe par le contrôle.",
    gestes: ["Fais la liste de ce que tu portes pour les autres cette semaine, sans rien juger.", "Demande-toi qui, dans ta famille, tenait déjà tout, et ce que cette personne n’a jamais pu déposer.", "Choisis une seule chose de ta liste à déposer cette semaine, et observe ce qui se passe."] },
  famille: { titre: "La famille", cycle: 1,
    lecture: "La famille peut transmettre des places, des silences, des loyautés invisibles et des répétitions. Regarder ton histoire familiale, c’est d’abord retrouver tes racines et ta place parmi les tiens.",
    gestes: ["Dessine trois générations avec les dates que tu connais : naissances, unions, départs, décès.", "Note à côté ce dont on ne parle pas dans ta famille, même si tu n’en connais que l’ombre.", "Pose une question simple à une personne de ta famille : « Comment c’était, chez toi, quand tu avais mon âge ? »"] },
  corps: { titre: "La sécurité", cycle: 1,
    lecture: "La sécurité touche au cycle de la racine : la peur de manquer ou de perdre sa place vient souvent de plus loin que soi. Elle peut revenir même quand tout va bien, comme un écho.",
    gestes: ["Note les moments où la peur de manquer revient, et ce qui venait de se passer juste avant.", "Cherche dans ta lignée un départ forcé, une maison perdue, une guerre, une période où il fallait tenir.", "Chaque matin, nomme trois choses qui sont là, solides, autour de toi."] },
};
const AVANTAGES = "deux nouvelles séances guidées à chaque étape, ton carnet Renaissance pour sortir de la peur et du mode survie, ton livret Libération pour comprendre comment tu aimes, la formation « Sors de la boucle » en 8 modules à écouter en podcast, et ton appli avec ton point du jour";
const court = (s: unknown, n: number) => String(s ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, n);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ erreur: "méthode" }, 405);
  let b: Record<string, unknown> = {};
  try { b = await req.json(); } catch { b = {}; }
  const email = String(b.email ?? "").trim().toLowerCase(), prenom = court(b.prenom, 60);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200) return json({ erreur: "email" }, 400);
  if (b.accord !== true) return json({ erreur: "accord" }, 400);
  const cle = String(b.theme ?? ""), T = THEMES[cle];
  if (!T) return json({ erreur: "theme" }, 400);
  const emotion = court(b.emotion, 40), niveau = Math.max(0, Math.min(10, Math.round(Number(b.niveau) || 0)));
  const indices = (Array.isArray(b.indices) ? b.indices : []).map((x) => court(x, 80)).filter(Boolean).slice(0, 12);

  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const { data: c, error } = await sb.rpc("n8n_enregistrer_contact", { p_email: email, p_prenom: prenom || null, p_champs: { newsletter: true, interet_cercle: true, boucles: T.titre } });
  if (error || !c?.id) return json({ erreur: "contact" }, 500);

  const { data: deja } = await sb.from("mails").select("id").eq("contact_id", c.id).eq("type", "parcours_resultat").gte("cree_le", new Date(Date.now() - 864e5).toISOString()).limit(1);
  if (deja && deja.length) return json({ ok: true, deja: true });

  const cycle = T.cycle === 1 ? RACINE : COEUR;
  const ressenti = emotion ? `Ton ressenti principal : ${emotion.toLowerCase()}${niveau ? ", à " + niveau + " sur 10" : ""}.` : "";
  const reperes = indices.length ? `Ce que tu as repéré : ${indices.join(", ")}.` : "";
  const texte = [
    `Ta porte d’entrée : ${T.titre.toLowerCase()}. ${ressenti}`.trim(),
    `Ton cycle : ${cycle}.`,
    T.lecture,
    reperes,
    `Tes 3 premiers gestes pour cette semaine :\n1. ${T.gestes[0]}\n2. ${T.gestes[1]}\n3. ${T.gestes[2]}`,
    "Cette lecture n’enferme rien : c’est une première carte, à compléter avec ton histoire. Prends ce qui te parle, laisse le reste.",
  ].filter(Boolean).join("\n\n");

  const envois: Record<string, unknown>[] = [{
    contact_id: c.id, email, prenom: prenom || null, type: "parcours_resultat", ok_envoyer: true,
    objet: "Ton résultat détaillé : " + T.titre.toLowerCase(), surtitre: T.cycle === 1 ? "Cycle 1 · La racine" : "Cycle 2 · Le cœur",
    titre: "Ton résultat et tes 3 premiers gestes", texte,
    bouton_texte: "Dessiner mon arbre familial", bouton_lien: "https://genesolia.fr/genosociogramme.html",
    image: "assets/partage/deux-cycles.jpg",
    encadre_titre: "Aller plus loin avec Le Cercle",
    encadre_texte: "Chaque mois, une étape guidée pour ton cycle : " + AVANTAGES + ". [Ouvre ton mois offert, sans carte](https://genesolia.fr/essai.html).",
  }];
  const { data: suite } = await sb.from("mails").select("id").eq("contact_id", c.id).in("type", ["seance_offerte_suite", "offert_suite"]).limit(1);
  if (!suite || !suite.length) envois.push({
    contact_id: c.id, email, prenom: prenom || null, type: "offert_suite", ok_envoyer: true,
    a_envoyer_le: new Date(Date.now() + 2 * 864e5).toISOString(),
    objet: "Ton espace Le Cercle t’attend", surtitre: "Le Cercle", titre: "Télécharge ton espace Le Cercle",
    texte: "Tu as reçu ton résultat. Imagine ce rendez-vous avec toi-même à chaque étape, pendant un an, sans rien avoir à organiser.\n\nDans ton espace Le Cercle, tu as " + AVANTAGES + ".\n\nQuinze minutes par semaine, sur ton téléphone ou ton ordinateur. Ton premier mois est offert, sans carte et sans engagement. Ensuite 29 € par mois, et 24,90 € par mois pour les 100 premières.",
    bouton_texte: "Ouvrir mon mois offert", bouton_lien: "https://genesolia.fr/essai.html",
    image: "assets/partage/deux-cycles.jpg",
    encadre_titre: "Tu as déjà fait ton point de départ ?",
    encadre_texte: "Il est repris tel quel dans ton Cercle : tu n’as rien à refaire. Sinon, [fais-le en 15 minutes](https://genesolia.fr/point-de-depart.html), il oriente tout ton parcours.",
  });
  const { error: e2 } = await sb.from("mails").insert(envois);
  if (e2) return json({ erreur: "mail" }, 500);
  return json({ ok: true });
});
