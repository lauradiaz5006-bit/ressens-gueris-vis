-- Genesolia · les mails partaient avec « {prenom} » au lieu du prénom.
-- À coller UNE fois dans Supabase > SQL Editor > New query, puis « Run ». Sans danger si on le relance.
--
-- Le problème : trois fonctions écrivent « {prenom} » dans la table mails
--   - envoi_vers_mail            (type « telechargement »)
--   - demandes_mail_carnet       (carnet des deux cycles)
--   - preparer_mails_fin_essai   (fin d'essai du Cercle et de l'Espace praticien)
-- et rien, nulle part, ne remplace ce marqueur avant l'envoi. Résultat : « Bienvenue {prenom} »,
-- « Qu'en penses-tu, {prenom} ? », « Plus que 7 jours, {prenom} » sont partis tels quels.
--
-- La correction se met ici, sur la table, et non dans chaque fonction : elle répare les trois d'un
-- seul coup, et tout nouveau gabarit écrit plus tard en profitera sans qu'on ait à y penser.
-- Le prénom est déjà dans la ligne (colonne « prenom ») : il n'y a rien à aller chercher.

create or replace function public.mails_sans_prenom(t text)
returns text
language plpgsql
immutable
set search_path to ''
as $$
declare
  d boolean;
begin
  if t is null or position('{prenom}' in t) = 0 then return t; end if;
  d := left(t, 8) = '{prenom}';
  t := regexp_replace(t, ',\s*\{prenom\}', '', 'g');     -- « Encore 15 jours, {prenom} »
  t := regexp_replace(t, '\{prenom\},\s*', '', 'g');     -- « {prenom}, voici ton carnet »
  t := regexp_replace(t, '\s*\{prenom\}\s*', ' ', 'g');  -- « Bienvenue {prenom} »
  t := regexp_replace(t, '\s+([,.])', '\1', 'g');        -- pas d'espace avant virgule ni point
  t := regexp_replace(t, '\s+([?!:;])', ' \1', 'g');     -- un seul espace avant ? ! : ; (usage français)
  t := btrim(t);
  if d and t <> '' then t := upper(left(t, 1)) || substr(t, 2); end if;
  return t;
end
$$;

create or replace function public.mails_remplir_prenom()
returns trigger
language plpgsql
set search_path to ''
as $$
declare
  p text := nullif(btrim(coalesce(new.prenom, '')), '');
begin
  if p is not null then
    new.objet         := replace(coalesce(new.objet, ''), '{prenom}', p);
    new.surtitre      := replace(coalesce(new.surtitre, ''), '{prenom}', p);
    new.titre         := replace(coalesce(new.titre, ''), '{prenom}', p);
    new.texte         := replace(coalesce(new.texte, ''), '{prenom}', p);
    new.bouton_texte  := replace(coalesce(new.bouton_texte, ''), '{prenom}', p);
    new.encadre_titre := replace(coalesce(new.encadre_titre, ''), '{prenom}', p);
    new.encadre_texte := replace(coalesce(new.encadre_texte, ''), '{prenom}', p);
    return new;
  end if;

  -- Sans prénom, on retire le marqueur proprement plutôt que de laisser une virgule orpheline :
  -- « Bienvenue {prenom} » donne « Bienvenue », « {prenom}, voici ton carnet » donne « Voici ton
  -- carnet », « Qu'en penses-tu, {prenom} ? » donne « Qu'en penses-tu ? ».
  new.objet         := public.mails_sans_prenom(new.objet);
  new.surtitre      := public.mails_sans_prenom(new.surtitre);
  new.titre         := public.mails_sans_prenom(new.titre);
  new.texte         := public.mails_sans_prenom(new.texte);
  new.bouton_texte  := public.mails_sans_prenom(new.bouton_texte);
  new.encadre_titre := public.mails_sans_prenom(new.encadre_titre);
  new.encadre_texte := public.mails_sans_prenom(new.encadre_texte);
  return new;
end
$$;

drop trigger if exists mails_prenom on public.mails;
create trigger mails_prenom
  before insert or update of prenom, titre, objet, texte on public.mails
  for each row execute function public.mails_remplir_prenom();

-- ─── Vérification, à lancer juste après ───
-- Plus aucune ligne ne doit sortir d'ici une fois que de nouveaux mails auront été créés :
--   select id, type, titre, prenom, cree_le from public.mails
--    where titre like '%{prenom}%' or texte like '%{prenom}%'
--    order by cree_le desc limit 20;
--
-- Pour réparer les lignes déjà créées mais pas encore parties (ne touche pas à celles qui sont
-- déjà envoyées), au choix, après avoir regardé ce que la requête ci-dessus renvoie :
--   update public.mails set prenom = prenom where titre like '%{prenom}%' and ok_envoyer = false;
-- (le trigger se déclenche à la mise à jour et remplit les textes)
