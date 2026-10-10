// Genesolia · fonction Supabase « notifs-cercle » : les rappels de l'appli Le Cercle et du site.
// GET  : renvoie la clé publique (l'appli en a besoin pour s'abonner).
// POST { action: 'abonner', canal | canaux, abonnement, jeton? } : enregistre l'appareil et ses canaux ('cercle', 'site').
//        Le jeton (facultatif) relie l'abonnement au compte. Sans compte, seul le canal 'site' est possible.
// POST { action: 'retirer', canal, endpoint } : retire un canal ; l'appareil est oublié quand il n'en reste aucun.
// POST { action: 'phrase', endpoint, texte, heure } : « Ma phrase du jour », écrite par la personne (texte vide = arrêter).
// POST {} : appelée chaque heure par pg_cron. Envoie « Ma phrase du jour » à l'heure choisie, et les rappels du jour
//        (table notifs_programme, case ok_envoyer cochée) à partir de 9h, heure de Paris : une seule fois chacun,
//        et au plus un rappel du programme par appareil et par jour (le Cercle d'abord).
// Pas de vérification de jeton (verify_jwt désactivé) : les clés publiables de Supabase ne sont pas des jetons, et l'appel est sans danger.
// GET ne donne que la clé publique ; l'envoi ne concerne que les rappels validés du jour, une seule fois (envoye_le) : le rappeler ne fait rien.
// Secrets à créer par Laura dans Supabase (Edge Functions > Secrets) : VAPID_PUBLIC et VAPID_PRIVE
// (générés avec outils-internes/cles-notifications.html). Rien d'autre : SUPABASE_URL et la clé de service sont fournis par Supabase.
import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const PUB = Deno.env.get("VAPID_PUBLIC") ?? "";
const PRIV = Deno.env.get("VAPID_PRIVE") ?? "";
const CANAUX = ["cercle", "site"];
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};
const json = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });
const heureParis = (d: Date) => +new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", hour: "2-digit", hour12: false }).format(d);
const jourParis = (d: Date) => new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris" }).format(d);
const base = () => createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });

type Abo = { endpoint: string; p256dh: string; auth: string; canaux: string[] };

async function abonner(sb: ReturnType<typeof base>, b: Record<string, unknown>) {
  const a = (b.abonnement ?? {}) as { endpoint?: string; keys?: { p256dh?: string; auth?: string } };
  const ep = String(a.endpoint ?? ""), p = String(a.keys?.p256dh ?? ""), au = String(a.keys?.auth ?? "");
  if (!/^https:\/\//.test(ep) || ep.length > 800 || !p || p.length > 200 || !au || au.length > 100) return json({ erreur: "abonnement" }, 400);
  let userId: string | null = null;
  if (typeof b.jeton === "string" && b.jeton) {
    const { data } = await sb.auth.getUser(b.jeton);
    userId = data?.user?.id ?? null;
  }
  const demandes = (Array.isArray(b.canaux) ? b.canaux : [b.canal]).map(String).filter((c) => CANAUX.includes(c));
  const voulus = demandes.filter((c) => c !== "cercle" || userId);   // le canal Cercle demande un compte
  if (!voulus.length) return json({ erreur: "canal" }, 400);
  const { data: ex } = await sb.from("notifs_abonnements").select("canaux, user_id").eq("endpoint", ep).maybeSingle();
  const canaux = Array.from(new Set([...(ex?.canaux ?? []).filter((c: string) => c !== "cercle" || userId), ...voulus]));
  const { error } = await sb.from("notifs_abonnements").upsert({ endpoint: ep, p256dh: p, auth: au, user_id: userId ?? ex?.user_id ?? null, canaux }, { onConflict: "endpoint" });
  if (error) return json({ erreur: error.message }, 500);
  return json({ canaux });
}

async function retirer(sb: ReturnType<typeof base>, b: Record<string, unknown>) {
  const ep = String(b.endpoint ?? ""), canal = String(b.canal ?? "");
  const { data: ex } = await sb.from("notifs_abonnements").select("canaux").eq("endpoint", ep).maybeSingle();
  if (!ex) return json({ canaux: [] });
  const canaux = (ex.canaux ?? []).filter((c: string) => c !== canal);
  if (canaux.length) await sb.from("notifs_abonnements").update({ canaux }).eq("endpoint", ep);
  else await sb.from("notifs_abonnements").delete().eq("endpoint", ep);
  return json({ canaux });
}

async function phrase(sb: ReturnType<typeof base>, b: Record<string, unknown>) {
  const ep = String(b.endpoint ?? ""), texte = String(b.texte ?? "").trim().slice(0, 140), heure = Number(b.heure);
  const { data: ex } = await sb.from("notifs_abonnements").select("endpoint").eq("endpoint", ep).maybeSingle();
  if (!ex) return json({ ok: false, erreur: "abonnement inconnu" }, 404);
  const maj = texte && [8, 12, 20].includes(heure) ? { perso_texte: texte, perso_heure: heure } : { perso_texte: null, perso_heure: null, perso_envoye: null };
  const { error } = await sb.from("notifs_abonnements").update(maj).eq("endpoint", ep);
  return error ? json({ ok: false, erreur: error.message }, 500) : json({ ok: true });
}

/* « Ma phrase du jour » : à l'heure choisie, une fois par jour */
async function phrasesDuJour(sb: ReturnType<typeof base>, auj: string, h: number, morts: Set<string>) {
  const { data } = await sb.from("notifs_abonnements").select("endpoint, p256dh, auth, perso_texte, canaux")
    .eq("perso_heure", h).not("perso_texte", "is", null).or("perso_envoye.is.null,perso_envoye.lt." + auj).limit(5000);
  let ok = 0;
  for (const a of data ?? []) {
    const corps = JSON.stringify({ titre: "Ta phrase du jour", texte: a.perso_texte, url: (a.canaux ?? []).includes("cercle") ? "/cercle.html" : "/appli.html", tag: "phrase-" + auj });
    try { await webpush.sendNotification({ endpoint: a.endpoint, keys: { p256dh: a.p256dh, auth: a.auth } }, corps, { TTL: 7200 }); ok++; }
    catch (x) { const c = (x as { statusCode?: number })?.statusCode; if (c === 404 || c === 410) morts.add(a.endpoint); }
    await sb.from("notifs_abonnements").update({ perso_envoye: auj }).eq("endpoint", a.endpoint);
  }
  return ok;
}

async function envoyer(sb: ReturnType<typeof base>) {
  if (!PUB || !PRIV) return json({ erreur: "Les secrets VAPID_PUBLIC et VAPID_PRIVE ne sont pas encore créés." }, 500);
  webpush.setVapidDetails("mailto:contact@genesolia.fr", PUB, PRIV);
  const auj = jourParis(new Date()), hier = jourParis(new Date(Date.now() - 86400000)), h = heureParis(new Date());
  const morts = new Set<string>();
  const phrases = await phrasesDuJour(sb, auj, h, morts);
  if (h < 9) { if (morts.size) await sb.from("notifs_abonnements").delete().in("endpoint", [...morts]); return json({ envoyees: 0, phrases }); }

  // On « réserve » d'abord les rappels du jour : un deuxième appel n'enverra rien en double.
  const { data: dues, error: e1 } = await sb.from("notifs_programme")
    .update({ envoye_le: new Date().toISOString() })
    .eq("ok_envoyer", true).is("envoye_le", null).gte("jour", hier).lte("jour", auj)
    .select("id, titre, texte, url, jour, canal, sauf_cercle");
  if (e1) return json({ erreur: e1.message }, 500);
  if (!dues || !dues.length) { if (morts.size) await sb.from("notifs_abonnements").delete().in("endpoint", [...morts]); return json({ envoyees: 0, phrases }); }
  dues.sort((a, b) => (a.canal === b.canal ? 0 : a.canal === "cercle" ? -1 : 1));

  const abos: Abo[] = [];
  for (let de = 0; ; de += 1000) {
    const { data, error } = await sb.from("notifs_abonnements").select("endpoint, p256dh, auth, canaux").range(de, de + 999);
    if (error) return json({ erreur: error.message }, 500);
    abos.push(...((data ?? []) as Abo[]));
    if (!data || data.length < 1000) break;
  }

  // Un seul rappel par appareil : le premier qui le concerne (le Cercle d'abord)
  const pour = new Map<number, Abo[]>();
  for (const a of abos) {
    const c = a.canaux ?? [];
    const n = dues.find((d) => c.includes(d.canal) && !(d.sauf_cercle && c.includes("cercle")));
    if (n) pour.set(n.id, [...(pour.get(n.id) ?? []), a]);
  }

  const bilan: Record<string, number> = {};
  for (const n of dues) {
    const liste = pour.get(n.id) ?? [];
    const corps = JSON.stringify({ titre: n.titre, texte: n.texte, url: n.url || "/", tag: n.canal + "-" + n.jour });
    let ok = 0;
    for (let i = 0; i < liste.length; i += 50) {
      const lot = liste.slice(i, i + 50);
      const r = await Promise.allSettled(lot.map((a) => webpush.sendNotification({ endpoint: a.endpoint, keys: { p256dh: a.p256dh, auth: a.auth } }, corps, { TTL: 43200 })));
      r.forEach((x, k) => {
        if (x.status === "fulfilled") ok++;
        else { const c = (x.reason as { statusCode?: number })?.statusCode; if (c === 404 || c === 410) morts.add(lot[k].endpoint); }
      });
    }
    bilan[n.jour + " " + n.canal + " " + n.titre] = ok;
    await sb.from("notifs_programme").update({ nb_envoyes: ok }).eq("id", n.id);
  }
  // Les abonnements expirés (application désinstallée, notifications coupées) sont retirés
  if (morts.size) await sb.from("notifs_abonnements").delete().in("endpoint", [...morts]);
  return json({ envoyees: bilan, phrases, retires: morts.size });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method === "GET") return json({ cle: PUB || null });
  if (req.method !== "POST") return json({ erreur: "méthode" }, 405);
  let b: Record<string, unknown> = {};
  try { b = await req.json(); } catch { b = {}; }
  const sb = base();
  if (b.action === "abonner") return abonner(sb, b);
  if (b.action === "retirer") return retirer(sb, b);
  if (b.action === "phrase") return phrase(sb, b);
  return envoyer(sb);
});
