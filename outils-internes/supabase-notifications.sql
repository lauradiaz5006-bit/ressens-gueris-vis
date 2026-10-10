-- Genesolia · notifications de l'appli Le Cercle
-- À lancer une fois dans Supabase : SQL Editor, coller, Run. On peut le relancer sans risque.
-- 1. notifs_abonnements : un téléphone ou un ordinateur qui a accepté les notifications (rien d'autre).
-- 2. notifs_programme : les notifications écrites à l'avance, une par jour au plus. Décoche « ok_envoyer » pour en bloquer une,
--    modifie le titre ou le texte, ou ajoute une ligne : tout se fait dans Table Editor.
-- 3. Chaque matin vers 9h (heure de Paris en hiver, 10h en été), pg_cron appelle la fonction « notifs-cercle »,
--    qui envoie la notification du jour une seule fois.

create table if not exists public.notifs_abonnements (
  endpoint text primary key check (char_length(endpoint) <= 800 and endpoint ~ '^https://'),
  p256dh text not null check (char_length(p256dh) <= 200),
  auth text not null check (char_length(auth) <= 100),
  user_id uuid references auth.users(id) on delete cascade,
  cree_le timestamptz not null default now()
);
alter table public.notifs_abonnements add column if not exists canaux text[] not null default '{cercle}';
alter table public.notifs_abonnements enable row level security;
-- Les abonnements passent par la fonction « notifs-cercle » (voir supabase-notifications-site.sql) : pas d'accès direct depuis le site.
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

-- L'envoi automatique chaque matin
create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;
select cron.unschedule('notifs-cercle') where exists (select 1 from cron.job where jobname = 'notifs-cercle');
select cron.schedule('notifs-cercle', '0 8 * * *',
  $$ select net.http_post(url := 'https://qsvzzkjtjsznfntahvvh.supabase.co/functions/v1/notifs-cercle', headers := '{"Content-Type": "application/json"}'::jsonb, body := '{}'::jsonb) $$);

-- Les notifications écrites à l'avance, d'octobre 2026 à octobre 2027
insert into public.notifs_programme (jour, titre, texte, url) values
  ('2026-10-15', 'Ta semaine 3 commence', '« Un rendez-vous avec moi ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2026-10#semaines-3'),
  ('2026-10-22', 'Ta semaine 4 commence', '« Refaire ma roue ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2026-10#semaines-4'),
  ('2026-10-26', 'Pleine lune aujourd’hui', 'Un moment pour remarquer ce qui a avancé depuis le début du mois, et ce que tu peux laisser partir.', '/cercle.html'),
  ('2026-10-29', 'Ta météo de fin de mois', 'Dix minutes pour ton bilan : tu verras tout le chemin parcouru depuis le début du mois.', '/mon-carnet.html?mois=2026-10#cloture'),
  ('2026-11-01', 'Ton carnet de novembre est arrivé', '« Mes forces, mes appuis ». Commence par ta météo du début : dix minutes pour poser ton mois.', '/mon-carnet.html?mois=2026-11#ouverture'),
  ('2026-11-08', 'Ta semaine 2 commence', '« Demander à trois proches ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2026-11#semaines-2'),
  ('2026-11-09', 'Nouvelle lune aujourd’hui', 'Un bon moment pour poser ou relire ton intention du mois, et choisir ton prochain petit pas.', '/mon-carnet.html?mois=2026-11#ouverture'),
  ('2026-11-15', 'Ta semaine 3 commence', '« Mon heure ressource ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2026-11#semaines-3'),
  ('2026-11-22', 'Ta semaine 4 commence', '« Faire vivre un héritage ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2026-11#semaines-4'),
  ('2026-11-24', 'Pleine lune aujourd’hui', 'Un moment pour remarquer ce qui a avancé depuis le début du mois, et ce que tu peux laisser partir.', '/cercle.html'),
  ('2026-11-28', 'Ta météo de fin de mois', 'Dix minutes pour ton bilan : tu verras tout le chemin parcouru depuis le début du mois.', '/mon-carnet.html?mois=2026-11#cloture'),
  ('2026-12-01', 'Ton carnet de décembre est arrivé', '« Ma place, mes limites ». Commence par ta météo du début : dix minutes pour poser ton mois.', '/mon-carnet.html?mois=2026-12#ouverture'),
  ('2026-12-08', 'Ta semaine 2 commence', '« Un non doux ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2026-12#semaines-2'),
  ('2026-12-09', 'Nouvelle lune aujourd’hui', 'Un bon moment pour poser ou relire ton intention du mois, et choisir ton prochain petit pas.', '/mon-carnet.html?mois=2026-12#ouverture'),
  ('2026-12-15', 'Ta semaine 3 commence', '« Mes pauses des fêtes ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2026-12#semaines-3'),
  ('2026-12-22', 'Ta semaine 4 commence', '« Ma juste place ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2026-12#semaines-4'),
  ('2026-12-24', 'Pleine lune aujourd’hui', 'Un moment pour remarquer ce qui a avancé depuis le début du mois, et ce que tu peux laisser partir.', '/cercle.html'),
  ('2026-12-29', 'Ta météo de fin de mois', 'Dix minutes pour ton bilan : tu verras tout le chemin parcouru depuis le début du mois.', '/mon-carnet.html?mois=2026-12#cloture'),
  ('2027-01-01', 'Ton carnet de janvier est arrivé', '« Mon intention, mes valeurs ». Commence par ta météo du début : dix minutes pour poser ton mois.', '/mon-carnet.html?mois=2027-01#ouverture'),
  ('2027-01-07', 'Nouvelle lune aujourd’hui', 'Un bon moment pour poser ou relire ton intention du mois, et choisir ton prochain petit pas.', '/mon-carnet.html?mois=2027-01#ouverture'),
  ('2027-01-08', 'Ta semaine 2 commence', '« Un choix aligné par jour ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2027-01#semaines-2'),
  ('2027-01-15', 'Ta semaine 3 commence', '« Faire de la place ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2027-01#semaines-3'),
  ('2027-01-22', 'Ta semaine 4 commence', '« Ma lettre d’intention signée ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2027-01#semaines-4'),
  ('2027-01-29', 'Ta météo de fin de mois', 'Dix minutes pour ton bilan : tu verras tout le chemin parcouru depuis le début du mois.', '/mon-carnet.html?mois=2027-01#cloture'),
  ('2027-02-01', 'Ton carnet de février est arrivé', '« M’aimer d’abord ». Commence par ta météo du début : dix minutes pour poser ton mois.', '/mon-carnet.html?mois=2027-02#ouverture'),
  ('2027-02-06', 'Nouvelle lune aujourd’hui', 'Un bon moment pour poser ou relire ton intention du mois, et choisir ton prochain petit pas.', '/mon-carnet.html?mois=2027-02#ouverture'),
  ('2027-02-08', 'Ta semaine 2 commence', '« Un besoin honoré par jour ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2027-02#semaines-2'),
  ('2027-02-15', 'Ta semaine 3 commence', '« Un rendez-vous tendresse ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2027-02#semaines-3'),
  ('2027-02-21', 'Pleine lune aujourd’hui', 'Un moment pour remarquer ce qui a avancé depuis le début du mois, et ce que tu peux laisser partir.', '/cercle.html'),
  ('2027-02-22', 'Ta semaine 4 commence', '« Ma liste de qualités ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2027-02#semaines-4'),
  ('2027-02-26', 'Ta météo de fin de mois', 'Dix minutes pour ton bilan : tu verras tout le chemin parcouru depuis le début du mois.', '/mon-carnet.html?mois=2027-02#cloture'),
  ('2027-03-01', 'Ton carnet de mars est arrivé', '« Ma voix, ma confiance ». Commence par ta météo du début : dix minutes pour poser ton mois.', '/mon-carnet.html?mois=2027-03#ouverture'),
  ('2027-03-08', 'Ta semaine 2 commence', '« Mon avis, une fois par jour ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2027-03#semaines-2'),
  ('2027-03-15', 'Ta semaine 3 commence', '« Une demande sans excuse ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2027-03#semaines-3'),
  ('2027-03-22', 'Ta semaine 4 commence', '« Célébrer mes victoires ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2027-03#semaines-4'),
  ('2027-03-29', 'Ta météo de fin de mois', 'Dix minutes pour ton bilan : tu verras tout le chemin parcouru depuis le début du mois.', '/mon-carnet.html?mois=2027-03#cloture'),
  ('2027-04-01', 'Ton carnet d’avril est arrivé', '« Dire vrai ». Commence par ta météo du début : dix minutes pour poser ton mois.', '/mon-carnet.html?mois=2027-04#ouverture'),
  ('2027-04-07', 'Nouvelle lune aujourd’hui', 'Un bon moment pour poser ou relire ton intention du mois, et choisir ton prochain petit pas.', '/mon-carnet.html?mois=2027-04#ouverture'),
  ('2027-04-08', 'Ta semaine 2 commence', '« Écouter vraiment ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2027-04#semaines-2'),
  ('2027-04-15', 'Ta semaine 3 commence', '« Le message vrai ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2027-04#semaines-3'),
  ('2027-04-21', 'Pleine lune aujourd’hui', 'Un moment pour remarquer ce qui a avancé depuis le début du mois, et ce que tu peux laisser partir.', '/cercle.html'),
  ('2027-04-22', 'Ta semaine 4 commence', '« Un vrai oui, un vrai non ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2027-04#semaines-4'),
  ('2027-04-28', 'Ta météo de fin de mois', 'Dix minutes pour ton bilan : tu verras tout le chemin parcouru depuis le début du mois.', '/mon-carnet.html?mois=2027-04#cloture'),
  ('2027-05-01', 'Ton carnet de mai est arrivé', '« Prendre soin de moi ». Commence par ta météo du début : dix minutes pour poser ton mois.', '/mon-carnet.html?mois=2027-05#ouverture'),
  ('2027-05-06', 'Nouvelle lune aujourd’hui', 'Un bon moment pour poser ou relire ton intention du mois, et choisir ton prochain petit pas.', '/mon-carnet.html?mois=2027-05#ouverture'),
  ('2027-05-08', 'Ta semaine 2 commence', '« Trois douceurs par jour ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2027-05#semaines-2'),
  ('2027-05-15', 'Ta semaine 3 commence', '« Un non pour un oui à moi ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2027-05#semaines-3'),
  ('2027-05-20', 'Pleine lune aujourd’hui', 'Un moment pour remarquer ce qui a avancé depuis le début du mois, et ce que tu peux laisser partir.', '/cercle.html'),
  ('2027-05-22', 'Ta semaine 4 commence', '« Refaire ma roue ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2027-05#semaines-4'),
  ('2027-05-29', 'Ta météo de fin de mois', 'Dix minutes pour ton bilan : tu verras tout le chemin parcouru depuis le début du mois.', '/mon-carnet.html?mois=2027-05#cloture'),
  ('2027-06-01', 'Ton carnet de juin est arrivé', '« Oser agir ». Commence par ta météo du début : dix minutes pour poser ton mois.', '/mon-carnet.html?mois=2027-06#ouverture'),
  ('2027-06-04', 'Nouvelle lune aujourd’hui', 'Un bon moment pour poser ou relire ton intention du mois, et choisir ton prochain petit pas.', '/mon-carnet.html?mois=2027-06#ouverture'),
  ('2027-06-08', 'Ta semaine 2 commence', '« Ma première heure d’action ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2027-06#semaines-2'),
  ('2027-06-15', 'Ta semaine 3 commence', '« Tenir ma parole envers moi ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2027-06#semaines-3'),
  ('2027-06-19', 'Pleine lune aujourd’hui', 'Un moment pour remarquer ce qui a avancé depuis le début du mois, et ce que tu peux laisser partir.', '/cercle.html'),
  ('2027-06-22', 'Ta semaine 4 commence', '« Célébrer et refaire ma roue ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2027-06#semaines-4'),
  ('2027-06-28', 'Ta météo de fin de mois', 'Dix minutes pour ton bilan : tu verras tout le chemin parcouru depuis le début du mois.', '/mon-carnet.html?mois=2027-06#cloture'),
  ('2027-07-01', 'Ton carnet de juillet est arrivé', '« Ma valeur ». Commence par ta météo du début : dix minutes pour poser ton mois.', '/mon-carnet.html?mois=2027-07#ouverture'),
  ('2027-07-04', 'Nouvelle lune aujourd’hui', 'Un bon moment pour poser ou relire ton intention du mois, et choisir ton prochain petit pas.', '/mon-carnet.html?mois=2027-07#ouverture'),
  ('2027-07-08', 'Ta semaine 2 commence', '« Une demande par jour ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2027-07#semaines-2'),
  ('2027-07-15', 'Ta semaine 3 commence', '« Mon carnet d’abondance ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2027-07#semaines-3'),
  ('2027-07-18', 'Pleine lune aujourd’hui', 'Un moment pour remarquer ce qui a avancé depuis le début du mois, et ce que tu peux laisser partir.', '/cercle.html'),
  ('2027-07-22', 'Ta semaine 4 commence', '« Oser ma demande et refaire ma roue ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2027-07#semaines-4'),
  ('2027-07-29', 'Ta météo de fin de mois', 'Dix minutes pour ton bilan : tu verras tout le chemin parcouru depuis le début du mois.', '/mon-carnet.html?mois=2027-07#cloture'),
  ('2027-08-01', 'Ton carnet d’août est arrivé', '« Mon chez-moi, mon élan ». Commence par ta météo du début : dix minutes pour poser ton mois.', '/mon-carnet.html?mois=2027-08#ouverture'),
  ('2027-08-02', 'Nouvelle lune aujourd’hui', 'Un bon moment pour poser ou relire ton intention du mois, et choisir ton prochain petit pas.', '/mon-carnet.html?mois=2027-08#ouverture'),
  ('2027-08-08', 'Ta semaine 2 commence', '« Bouger chaque jour ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2027-08#semaines-2'),
  ('2027-08-15', 'Ta semaine 3 commence', '« Explorer un lieu nouveau ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2027-08#semaines-3'),
  ('2027-08-17', 'Pleine lune aujourd’hui', 'Un moment pour remarquer ce qui a avancé depuis le début du mois, et ce que tu peux laisser partir.', '/cercle.html'),
  ('2027-08-22', 'Ta semaine 4 commence', '« Refaire ma roue ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2027-08#semaines-4'),
  ('2027-08-29', 'Ta météo de fin de mois', 'Dix minutes pour ton bilan : tu verras tout le chemin parcouru depuis le début du mois.', '/mon-carnet.html?mois=2027-08#cloture'),
  ('2027-08-31', 'Nouvelle lune aujourd’hui', 'Un bon moment pour poser ou relire ton intention du mois, et choisir ton prochain petit pas.', '/mon-carnet.html?mois=2027-08#ouverture'),
  ('2027-09-01', 'Ton carnet de septembre est arrivé', '« Ma vocation ». Commence par ta météo du début : dix minutes pour poser ton mois.', '/mon-carnet.html?mois=2027-09#ouverture'),
  ('2027-09-08', 'Ta semaine 2 commence', '« Demander à trois personnes ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2027-09#semaines-2'),
  ('2027-09-15', 'Ta semaine 3 commence', '« Tester une petite chose ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2027-09#semaines-3'),
  ('2027-09-16', 'Pleine lune aujourd’hui', 'Un moment pour remarquer ce qui a avancé depuis le début du mois, et ce que tu peux laisser partir.', '/cercle.html'),
  ('2027-09-22', 'Ta semaine 4 commence', '« Refaire ma roue ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2027-09#semaines-4'),
  ('2027-09-28', 'Ta météo de fin de mois', 'Dix minutes pour ton bilan : tu verras tout le chemin parcouru depuis le début du mois.', '/mon-carnet.html?mois=2027-09#cloture'),
  ('2027-09-30', 'Nouvelle lune aujourd’hui', 'Un bon moment pour poser ou relire ton intention du mois, et choisir ton prochain petit pas.', '/mon-carnet.html?mois=2027-09#ouverture'),
  ('2027-10-01', 'Ton carnet d’octobre est arrivé', '« Mon bilan de l’année ». Commence par ta météo du début : dix minutes pour poser ton mois.', '/mon-carnet.html?mois=2027-10#ouverture'),
  ('2027-10-08', 'Ta semaine 2 commence', '« Célébrer une victoire ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2027-10#semaines-2'),
  ('2027-10-15', 'Ta semaine 3 commence', '« Remercier ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2027-10#semaines-3'),
  ('2027-10-22', 'Ta semaine 4 commence', '« Refaire ma roue et choisir la suite ». Ton petit pas de la semaine t’attend dans ton carnet.', '/mon-carnet.html?mois=2027-10#semaines-4'),
  ('2027-10-29', 'Ta météo de fin de mois', 'Dix minutes pour ton bilan : tu verras tout le chemin parcouru depuis le début du mois.', '/mon-carnet.html?mois=2027-10#cloture')
on conflict (jour, canal) do nothing;
