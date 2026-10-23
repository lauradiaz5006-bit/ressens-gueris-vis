-- Genesolia · relance « Ton arbre t'attend » : 3 heures après une commande d'arbre imprimé,
-- si le paiement Stripe n'a pas abouti. Annulée par la fonction stripe-webhook dès que le paiement arrive.
-- À exécuter une fois dans Supabase > SQL Editor.
create or replace function public.demandes_relance_arbre()
returns trigger language plpgsql security definer set search_path to '' as $$
declare
  x jsonb := coalesce(new.details, '{}'::jsonb);
  lien text := coalesce(nullif(x->>'lien_paiement', ''), 'https://genesolia.fr/genosociogramme.html');
begin
  if new.formulaire = 'Commande impression' and coalesce(new.email, '') <> '' and x->>'paiement' = 'stripe' then
    update public.mails set ok_envoyer = false where type = 'commande-attente' and not envoye and email = new.email;
    insert into public.mails (email, prenom, type, objet, surtitre, titre, texte, bouton_texte, bouton_lien, encadre_titre, encadre_texte, a_envoyer_le)
    values (new.email, nullif(split_part(coalesce(new.prenom, ''), ' ', 1), ''), 'commande-attente',
      'Ton arbre « ' || coalesce(x->>'titre', 'Ton arbre') || ' » t''attend',
      'Ta commande',
      'Ton arbre t''attend',
      'Tu as préparé ton arbre « ' || coalesce(x->>'titre', '') || ' » (' || coalesce(x->>'format_nom', '') || ', ' || coalesce(x->>'prix', '') || '), mais le paiement n''est pas allé jusqu''au bout.' || E'\n\n' ||
      'Rien n''a été prélevé et rien n''est imprimé tant que le paiement n''est pas validé. Si tu as eu un souci au moment de payer, tu peux reprendre ta commande ici : tout est déjà prêt, ton arbre et ton adresse aussi.',
      'Finaliser ma commande', lien,
      'Une question avant de commander ?',
      'Réponds simplement à ce mail : on te répond personnellement. Si tu as déjà payé entre-temps, ne tiens pas compte de ce message.',
      now() + interval '3 hours');
  end if;
  return new;
end;
$$;

drop trigger if exists demandes_relance_arbre on public.demandes;
create trigger demandes_relance_arbre after insert on public.demandes for each row execute function public.demandes_relance_arbre();
