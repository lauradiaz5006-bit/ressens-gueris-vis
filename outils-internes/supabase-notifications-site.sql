-- Genesolia · rappels du site (en plus de ceux du Cercle)
-- À lancer une fois dans Supabase : SQL Editor, coller, Run. On peut le relancer sans risque.
-- Un appareil = un abonnement avec ses canaux : 'cercle' (membres) et 'site' (tout le monde, même sans compte).
-- Les abonnements passent par la fonction « notifs-cercle » : la table n'est plus accessible directement depuis le site.
-- Au plus un rappel par jour et par appareil (le Cercle d'abord). « sauf_cercle » : pas envoyé aux membres du Cercle.

create table if not exists public.notifs_abonnements (
  endpoint text primary key check (char_length(endpoint) <= 800 and endpoint ~ '^https://'),
  p256dh text not null check (char_length(p256dh) <= 200),
  auth text not null check (char_length(auth) <= 100),
  user_id uuid references auth.users(id) on delete cascade,
  cree_le timestamptz not null default now()
);
alter table public.notifs_abonnements add column if not exists canaux text[] not null default '{cercle}';
alter table public.notifs_abonnements enable row level security;
drop policy if exists "notifs : ajouter le sien" on public.notifs_abonnements;
drop policy if exists "notifs : voir le sien" on public.notifs_abonnements;
drop policy if exists "notifs : changer le sien" on public.notifs_abonnements;
drop policy if exists "notifs : retirer le sien" on public.notifs_abonnements;
revoke all on public.notifs_abonnements from anon, authenticated;

create table if not exists public.notifs_programme (
  id bigint generated always as identity primary key,
  jour date not null,
  titre text not null check (char_length(titre) <= 60),
  texte text not null check (char_length(texte) <= 180),
  url text not null default '/cercle.html',
  ok_envoyer boolean not null default true,
  envoye_le timestamptz,
  nb_envoyes integer
);
alter table public.notifs_programme add column if not exists canal text not null default 'cercle' check (canal in ('cercle', 'site'));
alter table public.notifs_programme add column if not exists sauf_cercle boolean not null default false;
alter table public.notifs_programme drop constraint if exists notifs_programme_jour_key;
create unique index if not exists notifs_programme_jour_canal on public.notifs_programme (jour, canal);
alter table public.notifs_programme enable row level security;
revoke all on public.notifs_programme from anon, authenticated;

-- Les pages déjà annoncées (nouveaux articles et nouveaux tests) : la tâche « Nouveautés du site » s'en sert
-- pour ne prévenir que des vraies nouveautés. On y met tout ce qui existe déjà aujourd'hui.
create table if not exists public.notifs_pages_annoncees (
  page text primary key,
  annoncee_le timestamptz not null default now()
);
alter table public.notifs_pages_annoncees enable row level security;
revoke all on public.notifs_pages_annoncees from anon, authenticated;
insert into public.notifs_pages_annoncees (page) values ('annee-personnelle-2027.html'),('arbre-de-vie-arbre-genealogique-genosociogramme.html'),('arbre-de-vie.html'),('argent-et-lignee.html'),('blessure-abandon-relation-amoureuse.html'),('blessure-rejet-ou-abandon.html'),('blessure-trahison-relation-amoureuse.html'),('blessures-de-l-ame.html'),('calcul-syndrome-anniversaire.html'),('comment-faire-son-genosociogramme.html'),('conflits-avec-ses-parents.html'),('deuil-non-fait-mort-jeune.html'),('devenir-parent-au-meme-age.html'),('enfant-de-remplacement.html'),('espace-praticien.html'),('exemple-genosociogramme.html'),('exercice-ressenti-ancetre.html'),('filles-garcons-fratrie.html'),('formation.html'),('genosociogramme-vierge.html'),('genosociogramme.html'),('grands-symboles-des-reves.html'),('guerre-et-memoire-familiale.html'),('heriter.html'),('histoires.html'),('implexe-mariage-entre-cousins.html'),('informations-avant-genosociogramme.html'),('journal-de-reves.html'),('jung-reves-archetypes.html'),('le-ciel-du-mois.html'),('les-10-sephiroth.html'),('loyaute-familiale-invisible.html'),('masques-des-5-blessures.html'),('memoire-transgenerationnelle.html'),('mercure-retrograde-2027.html'),('methode.html'),('metiers-transmis-genealogie.html'),('mon-guide.html'),('mon-mois.html'),('mon-suivi.html'),('nombres-maitres.html'),('parcours.html'),('peur-de-manquer-d-argent.html'),('place-dans-la-fratrie.html'),('prenom-transmis-psychogenealogie.html'),('projet-sens-conception-deuil.html'),('questions-a-poser-a-sa-famille.html'),('relation-floue.html'),('rever-de-ses-grands-parents-decedes.html'),('rever-des-morts-et-des-ancetres.html'),('reves-dans-l-antiquite.html'),('reves-et-peuples-autochtones.html'),('reves-recurrents-et-memoire-familiale.html'),('schemas-repetitifs-en-amour.html'),('se-sentir-seule.html'),('secret-de-famille.html'),('symboles-genosociogramme.html'),('symbolique-des-reves.html'),('syndrome-anniversaire.html'),('syndrome-du-gisant.html'),('tes-20-ans.html'),('theme-astral.html'),('theme-numerologique.html'),('ton-prenom.html'),('ton-signe-maya.html'),('toussaint-ancetres-et-deuils.html') on conflict do nothing;

-- L'envoi automatique chaque matin (déjà créé avec les rappels du Cercle, recréé ici au cas où)
create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;
select cron.unschedule('notifs-cercle') where exists (select 1 from cron.job where jobname = 'notifs-cercle');
select cron.schedule('notifs-cercle', '0 8 * * *',
  $$ select net.http_post(url := 'https://qsvzzkjtjsznfntahvvh.supabase.co/functions/v1/notifs-cercle', headers := '{"Content-Type": "application/json"}'::jsonb, body := '{}'::jsonb) $$);

-- Les rappels du site écrits à l'avance (ciel du mois, carnet du mois pour les non-membres, Mercure rétrograde, Toussaint, année personnelle)
insert into public.notifs_programme (jour, canal, titre, texte, url, sauf_cercle) values
  ('2026-10-24', 'site', 'Mercure rétrograde à partir de demain', 'Jusqu’au 13 novembre : le bon moment pour relire, vérifier, reprendre contact, plutôt que de signer dans la précipitation.', '/mercure-retrograde-2027.html', false),
  ('2026-10-31', 'site', 'Toussaint : honorer ses ancêtres', 'Un article pour vivre ce moment avec tes défunts, et comprendre ce que les deuils transmettent dans une famille.', '/toussaint-ancetres-et-deuils.html', false),
  ('2026-11-01', 'site', 'Le ciel de novembre est en ligne', 'Nouvelle lune le 9, pleine lune le 24 : les dates du mois et ce qu’elles invitent.', '/ciel-novembre-2026.html', false),
  ('2026-11-03', 'site', 'Le carnet de novembre est sorti', '« Mes forces, mes appuis » : deux livres pour avancer et te libérer ce mois-ci. Le premier mois du Cercle est offert.', '/abonnement.html', true),
  ('2026-12-01', 'site', 'Le ciel de décembre est en ligne', 'Nouvelle lune le 9, pleine lune le 24 : les dates du mois et ce qu’elles invitent.', '/ciel-decembre-2026.html', false),
  ('2026-12-03', 'site', 'Le carnet de décembre est sorti', '« Ma place, mes limites » : deux livres pour avancer et te libérer ce mois-ci. Le premier mois du Cercle est offert.', '/abonnement.html', true),
  ('2027-01-01', 'site', 'Le ciel de janvier est en ligne', 'Nouvelle lune le 7, pleine lune le 22 : les dates du mois et ce qu’elles invitent.', '/ciel-janvier-2027.html', false),
  ('2027-01-02', 'site', 'Ton année personnelle 2027', 'Quel nombre colore ton année ? Découvre-le avec ta date de naissance, et ce qu’il t’invite à vivre.', '/annee-personnelle-2027.html', false),
  ('2027-01-03', 'site', 'Le carnet de janvier est sorti', '« Mon intention, mes valeurs » : deux livres pour avancer et te libérer ce mois-ci. Le premier mois du Cercle est offert.', '/abonnement.html', true),
  ('2027-02-01', 'site', 'Le ciel de février est en ligne', 'Nouvelle lune le 6, pleine lune le 21 : les dates du mois et ce qu’elles invitent.', '/ciel-fevrier-2027.html', false),
  ('2027-02-03', 'site', 'Le carnet de février est sorti', '« M’aimer d’abord » : deux livres pour avancer et te libérer ce mois-ci. Le premier mois du Cercle est offert.', '/abonnement.html', true),
  ('2027-02-09', 'site', 'Mercure rétrograde à partir de demain', 'Jusqu’au 3 mars : le bon moment pour relire, vérifier, reprendre contact, plutôt que de signer dans la précipitation.', '/mercure-retrograde-2027.html', false),
  ('2027-03-01', 'site', 'Le ciel de mars est en ligne', 'Nouvelle lune le 8, pleine lune le 22 : les dates du mois et ce qu’elles invitent.', '/ciel-mars-2027.html', false),
  ('2027-03-03', 'site', 'Le carnet de mars est sorti', '« Ma voix, ma confiance » : deux livres pour avancer et te libérer ce mois-ci. Le premier mois du Cercle est offert.', '/abonnement.html', true),
  ('2027-04-01', 'site', 'Le ciel d’avril est en ligne', 'Nouvelle lune le 7, pleine lune le 21 : les dates du mois et ce qu’elles invitent.', '/ciel-avril-2027.html', false),
  ('2027-04-03', 'site', 'Le carnet d’avril est sorti', '« Dire vrai » : deux livres pour avancer et te libérer ce mois-ci. Le premier mois du Cercle est offert.', '/abonnement.html', true),
  ('2027-05-01', 'site', 'Le ciel de mai est en ligne', 'Nouvelle lune le 6, pleine lune le 20 : les dates du mois et ce qu’elles invitent.', '/ciel-mai-2027.html', false),
  ('2027-05-03', 'site', 'Le carnet de mai est sorti', '« Prendre soin de moi » : deux livres pour avancer et te libérer ce mois-ci. Le premier mois du Cercle est offert.', '/abonnement.html', true),
  ('2027-06-01', 'site', 'Le ciel de juin est en ligne', 'Nouvelle lune le 4, pleine lune le 19 : les dates du mois et ce qu’elles invitent.', '/ciel-juin-2027.html', false),
  ('2027-06-03', 'site', 'Le carnet de juin est sorti', '« Oser agir » : deux livres pour avancer et te libérer ce mois-ci. Le premier mois du Cercle est offert.', '/abonnement.html', true),
  ('2027-06-10', 'site', 'Mercure rétrograde à partir de demain', 'Jusqu’au 4 juillet : le bon moment pour relire, vérifier, reprendre contact, plutôt que de signer dans la précipitation.', '/mercure-retrograde-2027.html', false),
  ('2027-07-01', 'site', 'Le ciel de juillet est en ligne', 'Nouvelle lune le 4, pleine lune le 18 : les dates du mois et ce qu’elles invitent.', '/ciel-juillet-2027.html', false),
  ('2027-07-03', 'site', 'Le carnet de juillet est sorti', '« Ma valeur » : deux livres pour avancer et te libérer ce mois-ci. Le premier mois du Cercle est offert.', '/abonnement.html', true),
  ('2027-08-01', 'site', 'Le ciel d’août est en ligne', 'Nouvelle lune le 2, pleine lune le 17, nouvelle lune le 31 : les dates du mois et ce qu’elles invitent.', '/ciel-aout-2027.html', false),
  ('2027-08-03', 'site', 'Le carnet d’août est sorti', '« Mon chez-moi, mon élan » : deux livres pour avancer et te libérer ce mois-ci. Le premier mois du Cercle est offert.', '/abonnement.html', true),
  ('2027-09-01', 'site', 'Le ciel de septembre est en ligne', 'Pleine lune le 16, nouvelle lune le 30 : les dates du mois et ce qu’elles invitent.', '/ciel-septembre-2027.html', false),
  ('2027-09-03', 'site', 'Le carnet de septembre est sorti', '« Ma vocation » : deux livres pour avancer et te libérer ce mois-ci. Le premier mois du Cercle est offert.', '/abonnement.html', true),
  ('2027-10-07', 'site', 'Mercure rétrograde à partir de demain', 'Jusqu’au 28 octobre : le bon moment pour relire, vérifier, reprendre contact, plutôt que de signer dans la précipitation.', '/mercure-retrograde-2027.html', false)
on conflict (jour, canal) do nothing;
