-- Genesolia · essai gratuit du Cercle, SANS carte (tant que le paiement n'est pas ouvert).
-- À lancer une fois dans Supabase (SQL Editor). Déjà appliqué par Claude le 19/10/2026.
--
-- cercle_essai() : appelée par essai.html quand la personne connectée clique « Ouvrir mon mois offert ».
--   - ouvre 30 jours d'accès au Cercle (acces_premium, offre 'cercle'), une seule fois par compte ;
--   - si l'accès est déjà ouvert : ne change rien (statut 'deja') ;
--   - si un essai a déjà été utilisé et est fini : ne rouvre rien (statut 'utilise') ;
--   - prépare le mail « Bienvenue dans Le Cercle » (table mails, envoyé par N8N dans les 10 minutes)
--     et une alerte pour Laura sur contact@genesolia.fr (l'inscription Systeme.io se fait seule : fonction inscription-formation).
-- Plus tard, le paiement Stripe passera la même ligne en 'abonnement' (stripe_enregistrer) en gardant cree_le :
-- les étapes continuent sans repartir de zéro.

create or replace function public.cercle_essai()
returns jsonb
language plpgsql
security definer
set search_path to ''
as $$
declare
  u uuid := auth.uid();
  usr record;
  a record;
  fin timestamptz;
  prenom text;
  c jsonb;
  mois text[] := array['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  fin_txt text;
begin
  if u is null then return jsonb_build_object('ok', false, 'statut', 'connexion'); end if;
  select id, lower(email) as email, email_confirmed_at, coalesce(raw_user_meta_data->>'full_name', '') as nom
    into usr from auth.users where id = u;
  if usr.email is null or usr.email_confirmed_at is null then return jsonb_build_object('ok', false, 'statut', 'confirmation'); end if;

  select * into a from public.acces_premium where user_id = u;
  if found and a.valide_jusqu > now() then
    return jsonb_build_object('ok', true, 'statut', 'deja', 'fin', a.valide_jusqu);
  end if;
  if found then
    return jsonb_build_object('ok', false, 'statut', 'utilise', 'fin', a.valide_jusqu);
  end if;

  fin := now() + interval '30 days';
  insert into public.acces_premium (user_id, offre, valide_jusqu, note)
  values (u, 'cercle', fin, 'Essai gratuit 30 jours (sans carte)');

  prenom := nullif(trim(split_part(usr.nom, ' ', 1)), '');
  c := public.n8n_enregistrer_contact(usr.email, prenom, jsonb_build_object('compte', true, 'user_id', u::text, 'interet_cercle', true));
  fin_txt := extract(day from (fin at time zone 'Europe/Paris'))::int || ' ' || mois[extract(month from (fin at time zone 'Europe/Paris'))::int] || ' ' || extract(year from (fin at time zone 'Europe/Paris'))::int;

  insert into public.mails (contact_id, email, prenom, type, objet, surtitre, titre, texte, bouton_texte, bouton_lien, image, encadre_titre, encadre_texte, ok_envoyer)
  values ((c->>'id')::uuid, usr.email, prenom, 'cercle_bienvenue',
    'Bienvenue dans Le Cercle : ton accès est ouvert',
    'Le Cercle',
    'Ton mois offert commence aujourd''hui',
    'Ton espace est prêt. Tout est réuni dans ton appli Le Cercle : Renaissance, ton carnet pour sortir du mode survie et vivre en accord avec toi, Libération, ton livret pour aimer plus grand, tes séances audio et ta formation « Sors de la boucle ».' || E'\n\n' ||
    'Pour bien commencer, une seule chose aujourd''hui : ton point de départ. Quinze minutes, et tout ton parcours s''oriente sur ce que tu vis.' || E'\n\n' ||
    'Ta formation « Sors de la boucle » a son propre espace, sur notre plateforme de formation Systeme.io. Dès que tu ouvres ton Cercle, tu reçois un second e-mail, envoyé par Systeme.io, pour créer ton mot de passe de formation : ton module 1 t''y attend. Ensuite, touche « Formation » dans ton appli et connecte-toi avec ton e-mail et ce mot de passe. Astuce : choisis le même mot de passe que pour Le Cercle.' || E'\n\n' ||
    'Ton mois offert dure jusqu''au ' || fin_txt || '. Aucune carte ne t''a été demandée. Avant la fin, on t''écrit pour te proposer de continuer, si tu le souhaites.',
    'Ouvrir mon Cercle', 'https://genesolia.fr/cercle.html', 'assets/partage/deux-cycles.jpg',
    'Garde Le Cercle sur ton téléphone',
    'Ouvre le bouton ci-dessus dans Safari (iPhone) ou Chrome (Android), puis choisis « Ajouter à l''écran d''accueil ». Tu te connectes avec ton e-mail et ton mot de passe.',
    true);

  c := public.n8n_enregistrer_contact('contact@genesolia.fr', 'Laura', '{}'::jsonb);
  insert into public.mails (contact_id, email, prenom, type, objet, surtitre, titre, texte, ok_envoyer)
  values ((c->>'id')::uuid, 'contact@genesolia.fr', 'Laura', 'cercle_alerte',
    'Nouvelle inscrite au Cercle : ' || coalesce(prenom, usr.email),
    'Le Cercle', 'Une nouvelle inscrite',
    coalesce(prenom, '(sans prénom)') || ' · ' || usr.email || E'\n\n' ||
    'Son mois offert court jusqu''au ' || fin_txt || '.' || E'\n\n' ||
    'Elle est inscrite automatiquement à la formation « Sors de la boucle » sur Systeme.io (tag « Le Cercle ») dès qu''elle ouvre son espace. Rien à faire.',
    true);

  return jsonb_build_object('ok', true, 'statut', 'ouvert', 'fin', fin);
end $$;

revoke all on function public.cercle_essai() from public, anon;
grant execute on function public.cercle_essai() to authenticated;
