-- « Ta vie en réel » : votes anonymes « Ça t'est déjà arrivé ? »
-- À coller dans Supabase > SQL Editor > New query, puis Run. Sans risque pour l'existant : crée une table et une fonction.
-- Une ligne par situation et par navigateur (identifiant au hasard gardé dans le navigateur). Ni compte, ni e-mail, ni adresse IP.
-- Tout le monde peut voter (insertion seulement) ; personne ne peut lire les votes un par un ; seule la fonction donne les totaux.

create table if not exists public.votes_situations (
  id bigint generated always as identity primary key,
  situation text not null check (situation ~ '^[a-z0-9-]{2,60}$'),
  reponse text not null check (reponse in ('oui', 'plusieurs', 'ma-vie')),
  navigateur uuid not null,
  cree_le timestamptz not null default now(),
  unique (situation, navigateur)
);
alter table public.votes_situations enable row level security;
drop policy if exists votes_situations_inserer on public.votes_situations;
create policy votes_situations_inserer on public.votes_situations for insert to anon, authenticated with check (true);
revoke all on public.votes_situations from anon, authenticated;
grant insert (situation, reponse, navigateur) on public.votes_situations to anon, authenticated;

create or replace function public.situation_totaux(p_ids text[])
returns table (situation text, oui bigint, plusieurs bigint, ma_vie bigint)
language sql stable security definer set search_path to '' as $function$
  select v.situation,
         count(*) filter (where v.reponse = 'oui'),
         count(*) filter (where v.reponse = 'plusieurs'),
         count(*) filter (where v.reponse = 'ma-vie')
  from public.votes_situations v
  where v.situation = any (p_ids[1:200])
  group by v.situation;
$function$;
revoke all on function public.situation_totaux(text[]) from public;
grant execute on function public.situation_totaux(text[]) to anon, authenticated;

-- Phase 2 (plus tard, ne pas coller maintenant) : table recits_situations (texte, theme, publier boolean default false, cree_le),
-- insertion anonyme seulement, aucune lecture publique ; Laura coche « publier » elle-même dans le Table Editor.
