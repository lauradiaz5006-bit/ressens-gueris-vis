// Genesolia · fonction Supabase « envoi-mails » : envoie les mails de la table mails, SANS N8N.
// Appelée toutes les 10 minutes par pg_cron (tâche « envoi-mails-genesolia »). Ne fait rien s'il n'y a aucun mail prêt.
// Un mail part quand : ok_envoyer coché, pas encore envoyé, sans erreur, a_envoyer_le atteint, contact non désinscrit
// (même règle que n8n_mails_prets). Décoche ok_envoyer dans la table mails pour bloquer un mail.
// Envoi par le SMTP d'IONOS. Secrets à créer par Laura dans Supabase (Edge Functions > Secrets) :
//   SMTP_HOTE (smtp.ionos.fr), SMTP_PORT (465), SMTP_UTILISATEUR (l'adresse de la boîte), SMTP_MOT_DE_PASSE,
//   MAIL_EXPEDITEUR (ex. « Genesolia <contact@genesolia.fr> », facultatif : sinon SMTP_UTILISATEUR).
// Tant que ces secrets n'existent pas, la fonction réveille l'ancien flux N8N comme avant (aucun mail n'est perdu).
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import nodemailer from "npm:nodemailer@6.9.16";

const SITE = "https://genesolia.fr";
const N8N_SECOURS = "https://strakara.app.n8n.cloud/webhook/25776f30-1dae-4008-a6ae-3f2b7e935d22";
const env = (k: string) => (Deno.env.get(k) ?? "").trim();
const json = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "Content-Type": "application/json" } });

const esc = (s: string) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
// [texte](lien) devient un lien ; le reste est échappé
const liens = (s: string) => esc(s).replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" style="color:#6B2F5B;font-weight:600">$1</a>');
const paragraphes = (s: string, style: string) => String(s ?? "").split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
  .map((p) => `<p style="${style}">${liens(p).replace(/\n/g, "<br>")}</p>`).join("");
const sansLiens = (s: string) => String(s ?? "").replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, "$1 ($2)");
const absolu = (u: string) => !u ? "" : /^https?:\/\//.test(u) ? u : SITE + "/" + u.replace(/^\/+/, "");

type Mail = { id: number; contact_id: string | null; jeton: string | null; email: string; prenom: string | null; type: string; objet: string;
  surtitre: string | null; titre: string | null; texte: string | null; bouton_texte: string | null; bouton_lien: string | null; image: string | null;
  encadre_titre: string | null; encadre_texte: string | null };

function html(m: Mail, lienDesinscription: string) {
  const P = "margin:0 0 16px;font:400 16px/1.65 Helvetica,Arial,sans-serif;color:#4A2B42";
  const img = m.image ? `<tr><td><img src="${esc(absolu(m.image))}" width="600" alt="" style="display:block;width:100%;max-width:600px;height:auto;border:0;border-radius:18px 18px 0 0"></td></tr>` : "";
  const bouton = m.bouton_texte && m.bouton_lien ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px"><tr><td style="border-radius:999px;background:#6B2F5B"><a href="${esc(m.bouton_lien)}" style="display:inline-block;padding:14px 28px;font:600 16px Helvetica,Arial,sans-serif;color:#ffffff;text-decoration:none;border-radius:999px">${esc(m.bouton_texte)}</a></td></tr></table>` : "";
  const encadre = m.encadre_titre || m.encadre_texte ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 8px"><tr><td style="background:#FBF1EE;border-left:3px solid #B98A55;border-radius:12px;padding:18px 20px">${m.encadre_titre ? `<p style="margin:0 0 8px;font:600 16px Georgia,serif;color:#6B2F5B">${esc(m.encadre_titre)}</p>` : ""}${paragraphes(m.encadre_texte ?? "", "margin:0 0 8px;font:400 15px/1.6 Helvetica,Arial,sans-serif;color:#5B3A52")}</td></tr></table>` : "";
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(m.objet)}</title></head>
<body style="margin:0;padding:0;background:#FFF9F7">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFF9F7"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px">
<tr><td align="center" style="padding:0 0 18px;font:400 26px Georgia,'Times New Roman',serif;color:#6B2F5B;letter-spacing:.02em"><a href="${SITE}" style="color:#6B2F5B;text-decoration:none">Genesolia</a></td></tr>
<tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #EBCFD5;border-radius:18px">
${img}
<tr><td style="padding:28px 28px 12px">
${m.surtitre ? `<p style="margin:0 0 10px;font:600 12px Helvetica,Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#B98A55">${esc(m.surtitre)}</p>` : ""}
${m.titre ? `<h1 style="margin:0 0 18px;font:400 28px/1.2 Georgia,'Times New Roman',serif;color:#6B2F5B">${esc(m.titre)}</h1>` : ""}
${m.prenom ? `<p style="${P}">Bonjour ${esc(m.prenom)},</p>` : `<p style="${P}">Bonjour,</p>`}
${paragraphes(m.texte ?? "", P)}
${bouton}
${encadre}
</td></tr></table></td></tr>
<tr><td style="padding:22px 18px;font:400 12px/1.6 Helvetica,Arial,sans-serif;color:#8C6F82;text-align:center">
Genesolia · <a href="${SITE}" style="color:#8C6F82">genesolia.fr</a><br>
Tu reçois cet e-mail car tu l'as demandé sur genesolia.fr. ${lienDesinscription ? `<a href="${esc(lienDesinscription)}" style="color:#8C6F82">Me désinscrire</a>` : ""}
</td></tr></table></td></tr></table></body></html>`;
}

function texteBrut(m: Mail, lienDesinscription: string) {
  return [m.surtitre, m.titre, "", m.prenom ? "Bonjour " + m.prenom + "," : "Bonjour,", "", sansLiens(m.texte ?? ""), "",
    m.bouton_texte && m.bouton_lien ? m.bouton_texte + " : " + m.bouton_lien : "", "",
    m.encadre_titre ?? "", sansLiens(m.encadre_texte ?? ""), "", "Genesolia · genesolia.fr",
    lienDesinscription ? "Me désinscrire : " + lienDesinscription : ""].filter((x) => x !== null).join("\n").replace(/\n{3,}/g, "\n\n");
}

Deno.serve(async () => {
  const sb = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), { auth: { persistSession: false } });
  const { data: prets, error } = await sb.rpc("n8n_mails_prets", { p_limite: 40 });
  if (error) return json({ erreur: error.message }, 500);
  const liste = (prets ?? []) as Mail[];
  if (!liste.length) return json({ envoyes: 0 });

  const hote = env("SMTP_HOTE"), util = env("SMTP_UTILISATEUR"), mdp = env("SMTP_MOT_DE_PASSE");
  if (!hote || !util || !mdp) {
    // Pas encore de SMTP dans Supabase : on réveille l'ancien flux N8N, comme avant
    try { await fetch(N8N_SECOURS, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ source: "supabase" }) }); } catch { /* rien */ }
    return json({ envoyes: 0, secours: "n8n", prets: liste.length });
  }
  const port = Number(env("SMTP_PORT") || "465");
  const transport = nodemailer.createTransport({ host: hote, port, secure: port === 465, auth: { user: util, pass: mdp } });
  const de = env("MAIL_EXPEDITEUR") || ("Genesolia <" + util + ">");

  let ok = 0; const echecs: string[] = [];
  for (const m of liste) {
    // On réserve le mail avant l'envoi : un deuxième passage (ou N8N) ne l'enverra pas en double
    const { data: pris } = await sb.from("mails").update({ envoye: true, envoye_le: new Date().toISOString() }).eq("id", m.id).eq("envoye", false).select("id");
    if (!pris || !pris.length) continue;
    const desinscr = m.contact_id && m.jeton ? `${SITE}/desinscription.html?c=${m.contact_id}&j=${m.jeton}` : "";
    try {
      await transport.sendMail({
        from: de, to: m.email, subject: m.objet || m.titre || "Genesolia",
        html: html(m, desinscr), text: texteBrut(m, desinscr),
        headers: desinscr ? { "List-Unsubscribe": `<${desinscr}>` } : undefined,
      });
      ok++;
    } catch (x) {
      const msg = String((x as Error)?.message ?? x).slice(0, 300);
      echecs.push(m.id + " : " + msg);
      await sb.from("mails").update({ envoye: false, envoye_le: null, erreur: msg }).eq("id", m.id);
    }
  }
  return json({ envoyes: ok, echecs });
});
