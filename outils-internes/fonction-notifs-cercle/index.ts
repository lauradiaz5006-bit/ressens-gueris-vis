// Genesolia · fonction Supabase « notifs-cercle » : les notifications de l'appli Le Cercle.
// GET  : renvoie la clé publique (l'appli en a besoin pour s'abonner).
// POST : envoie les notifications du jour (table notifs_programme, case ok_envoyer cochée), une seule fois chacune.
//        Appelée chaque matin par pg_cron (voir outils-internes/supabase-notifications.sql).
// Pas de vérification de jeton (verify_jwt désactivé) : les clés publiables de Supabase ne sont pas des jetons, et l'appel est sans danger.
// GET ne donne que la clé publique ; POST n'envoie que les notifications validées du jour, une seule fois (envoye_le) : le rappeler ne fait rien.
// Secrets à créer par Laura dans Supabase (Edge Functions > Secrets) : VAPID_PUBLIC et VAPID_PRIVE
// (générés avec outils-internes/cles-notifications.html). Rien d'autre : SUPABASE_URL et la clé de service sont fournis par Supabase.
import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const PUB = Deno.env.get("VAPID_PUBLIC") ?? "";
const PRIV = Deno.env.get("VAPID_PRIVE") ?? "";
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};
const json = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });
const jourParis = (d: Date) => new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris" }).format(d);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method === "GET") return json({ cle: PUB || null });
  if (req.method !== "POST") return json({ erreur: "méthode" }, 405);
  if (!PUB || !PRIV) return json({ erreur: "Les secrets VAPID_PUBLIC et VAPID_PRIVE ne sont pas encore créés." }, 500);

  webpush.setVapidDetails("mailto:contact@genesolia.fr", PUB, PRIV);
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const auj = jourParis(new Date()), hier = jourParis(new Date(Date.now() - 86400000));

  // On « réserve » d'abord les notifications du jour : un deuxième appel n'enverra rien en double.
  const { data: dues, error: e1 } = await sb.from("notifs_programme")
    .update({ envoye_le: new Date().toISOString() })
    .eq("ok_envoyer", true).is("envoye_le", null).gte("jour", hier).lte("jour", auj)
    .select("id, titre, texte, url, jour");
  if (e1) return json({ erreur: e1.message }, 500);
  if (!dues || !dues.length) return json({ envoyees: 0 });

  // Tous les abonnements, par paquets de 1000
  const abos: { endpoint: string; p256dh: string; auth: string }[] = [];
  for (let de = 0; ; de += 1000) {
    const { data, error } = await sb.from("notifs_abonnements").select("endpoint, p256dh, auth").range(de, de + 999);
    if (error) return json({ erreur: error.message }, 500);
    abos.push(...(data ?? []));
    if (!data || data.length < 1000) break;
  }

  const morts = new Set<string>();
  const bilan: Record<string, number> = {};
  for (const n of dues) {
    const corps = JSON.stringify({ titre: n.titre, texte: n.texte, url: n.url || "/cercle.html", tag: "cercle-" + n.jour });
    let ok = 0;
    for (let i = 0; i < abos.length; i += 50) {
      const lot = abos.slice(i, i + 50);
      const r = await Promise.allSettled(lot.map((a) => webpush.sendNotification({ endpoint: a.endpoint, keys: { p256dh: a.p256dh, auth: a.auth } }, corps, { TTL: 43200 })));
      r.forEach((x, k) => {
        if (x.status === "fulfilled") ok++;
        else { const c = (x.reason as { statusCode?: number })?.statusCode; if (c === 404 || c === 410) morts.add(lot[k].endpoint); }
      });
    }
    bilan[n.jour + " " + n.titre] = ok;
    await sb.from("notifs_programme").update({ nb_envoyes: ok }).eq("id", n.id);
  }
  // Les abonnements expirés (application désinstallée, notifications coupées) sont retirés
  if (morts.size) await sb.from("notifs_abonnements").delete().in("endpoint", [...morts]);
  return json({ envoyees: bilan, retires: morts.size });
});
