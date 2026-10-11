-- Genesolia · « Ma phrase du jour » : la personne écrit sa propre phrase et la reçoit chaque jour, à l'heure qu'elle choisit,
-- avec un deuxième rappel facultatif (par exemple le matin et le soir).
-- À lancer une fois dans Supabase : SQL Editor, coller, Run. On peut le relancer sans risque.
-- La phrase est gardée avec l'abonnement de l'appareil (table notifs_abonnements, jamais lisible depuis le site) ; elle s'efface quand la personne arrête.

alter table public.notifs_abonnements add column if not exists perso_texte text check (perso_texte is null or char_length(perso_texte) <= 140);
alter table public.notifs_abonnements add column if not exists perso_heure smallint;
alter table public.notifs_abonnements add column if not exists perso_envoye date;
alter table public.notifs_abonnements add column if not exists perso_heure2 smallint;
alter table public.notifs_abonnements add column if not exists perso_envoye2 date;

-- Heures possibles : de 6h à 22h (heure de Paris)
alter table public.notifs_abonnements drop constraint if exists notifs_abonnements_perso_heure_check;
alter table public.notifs_abonnements drop constraint if exists notifs_abonnements_perso_heure2_check;
alter table public.notifs_abonnements add constraint notifs_abonnements_perso_heure_check check (perso_heure is null or perso_heure between 6 and 22);
alter table public.notifs_abonnements add constraint notifs_abonnements_perso_heure2_check check (perso_heure2 is null or perso_heure2 between 6 and 22);

-- L'envoi passe à toutes les heures (les rappels du programme partent toujours une seule fois, à partir de 9h)
select cron.unschedule('notifs-cercle') where exists (select 1 from cron.job where jobname = 'notifs-cercle');
select cron.schedule('notifs-cercle', '2 * * * *',
  $$ select net.http_post(url := 'https://qsvzzkjtjsznfntahvvh.supabase.co/functions/v1/notifs-cercle', headers := '{"Content-Type": "application/json"}'::jsonb, body := '{}'::jsonb) $$);
