-- Document de déontologie (envoyé par le·la praticien·ne à sa cliente avant une séance)
-- La praticienne rédige une section personnalisée, s'engage elle-même (case cochée + horodatage),
-- puis envoie un lien (deontologie.html?d=<jeton>) que sa cliente valide par des cases à cocher,
-- avec son prénom/nom. Chaque partie garde une trace horodatée de son acceptation.
-- Volontairement non réservé à l'abonnement : c'est un document de cadre et de consentement,
-- pas un avantage premium.
create table if not exists public.deontologies_client (
  jeton uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  arbre_id uuid not null references public.arbres_supp(id) on delete cascade,
  texte_perso text,
  expire_le timestamptz not null default (now() + interval '60 days'),
  cree_le timestamptz not null default now(),
  signe_praticien_le timestamptz,
  signe_praticien_nom text,
  signe_client_le timestamptz,
  client_nom text,
  client_accords jsonb
);
create index if not exists deontologies_client_arbre on public.deontologies_client (arbre_id);
create index if not exists deontologies_client_user on public.deontologies_client (user_id);
alter table public.deontologies_client enable row level security;

create policy "deontologie de la praticienne" on public.deontologies_client
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.arbres_supp s where s.id = arbre_id and s.user_id = (select auth.uid()))
  );

-- La praticienne s'engage elle-même au moment où elle (re)génère le document : horodatage + nom de cabinet.
create or replace function public.deontologie_signer_praticien(p_jeton uuid, p_texte_perso text)
returns jsonb language plpgsql volatile security definer set search_path to '' as $$
declare d public.deontologies_client; cab text;
begin
  select * into d from public.deontologies_client where jeton = p_jeton and user_id = auth.uid() for update;
  if not found then return jsonb_build_object('erreur', 'lien'); end if;
  select cabinet into cab from public.praticiens where user_id = auth.uid();
  update public.deontologies_client
    set texte_perso = p_texte_perso, signe_praticien_le = now(), signe_praticien_nom = coalesce(cab, '')
    where jeton = p_jeton;
  return jsonb_build_object('ok', true);
end $$;

-- Lecture par la cliente (sans compte), via le jeton seul : jamais l'arbre_id ni le user_id.
create or replace function public.deontologie_ouvrir(p_jeton uuid)
returns jsonb language plpgsql stable security definer set search_path to '' as $$
declare d public.deontologies_client; cab text;
begin
  select * into d from public.deontologies_client where jeton = p_jeton;
  if not found or d.expire_le < now() then return jsonb_build_object('erreur', 'lien'); end if;
  select cabinet into cab from public.praticiens where user_id = d.user_id;
  return jsonb_build_object(
    'cabinet', cab, 'texte_perso', d.texte_perso,
    'signe_praticien', d.signe_praticien_le is not null, 'signe_praticien_le', d.signe_praticien_le,
    'signe_client', d.signe_client_le is not null, 'signe_client_le', d.signe_client_le, 'client_nom', d.client_nom
  );
end $$;

-- Acceptation par la cliente : son prénom/nom et le détail des cases cochées, horodatés, une seule fois.
create or replace function public.deontologie_signer_client(p_jeton uuid, p_nom text, p_accords jsonb)
returns jsonb language plpgsql volatile security definer set search_path to '' as $$
declare d public.deontologies_client;
begin
  if p_nom is null or length(trim(p_nom)) < 1 then return jsonb_build_object('erreur', 'nom'); end if;
  if p_accords is null or jsonb_typeof(p_accords) <> 'array' then return jsonb_build_object('erreur', 'vide'); end if;
  select * into d from public.deontologies_client where jeton = p_jeton for update;
  if not found or d.expire_le < now() then return jsonb_build_object('erreur', 'lien'); end if;
  if d.signe_praticien_le is null then return jsonb_build_object('erreur', 'pas-pret'); end if;
  if d.signe_client_le is not null then return jsonb_build_object('erreur', 'deja'); end if;
  update public.deontologies_client
    set signe_client_le = now(), client_nom = left(trim(p_nom), 120), client_accords = p_accords
    where jeton = p_jeton;
  return jsonb_build_object('ok', true);
end $$;

revoke all on function public.deontologie_signer_praticien(uuid, text) from public;
revoke all on function public.deontologie_ouvrir(uuid) from public;
revoke all on function public.deontologie_signer_client(uuid, text, jsonb) from public;
grant execute on function public.deontologie_signer_praticien(uuid, text) to authenticated;
grant execute on function public.deontologie_ouvrir(uuid) to anon, authenticated;
grant execute on function public.deontologie_signer_client(uuid, text, jsonb) to anon, authenticated;
