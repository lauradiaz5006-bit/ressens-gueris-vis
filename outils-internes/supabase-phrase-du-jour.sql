-- Genesolia · « Ma phrase du jour » : la personne écrit sa propre phrase et la reçoit chaque jour à l'heure choisie (8h, 12h ou 20h).
-- À lancer une fois dans Supabase : SQL Editor, coller, Run. On peut le relancer sans risque.
-- La phrase est gardée avec l'abonnement de l'appareil (table notifs_abonnements, jamais lisible depuis le site) ; elle s'efface quand la personne arrête.

alter table public.notifs_abonnements add column if not exists perso_texte text check (perso_texte is null or char_length(perso_texte) <= 140);
alter table public.notifs_abonnements add column if not exists perso_heure smallint check (perso_heure is null or perso_heure in (8, 12, 20));
alter table public.notifs_abonnements add column if not exists perso_envoye date;

-- L'envoi passe à toutes les heures (les rappels du programme partent toujours une seule fois, à partir de 9h)
select cron.unschedule('notifs-cercle') where exists (select 1 from cron.job where jobname = 'notifs-cercle');
select cron.schedule('notifs-cercle', '2 * * * *',
  $$ select net.http_post(url := 'https://qsvzzkjtjsznfntahvvh.supabase.co/functions/v1/notifs-cercle', headers := '{"Content-Type": "application/json"}'::jsonb, body := '{}'::jsonb) $$);
