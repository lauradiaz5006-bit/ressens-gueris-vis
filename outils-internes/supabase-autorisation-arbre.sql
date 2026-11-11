-- Accès du·de la praticien·ne à l'arbre que sa cliente construit elle-même, en toute autonomie
-- (table arbres, compte personnel normal). La cliente génère un code depuis son espace (login.html),
-- le donne à son·sa praticien·ne qui le saisit dans l'Espace praticien pour relier l'accès.
-- Lecture seule, uniquement l'arbre (jamais les autres données du compte) ; la cliente révoque
-- l'accès à tout moment. Rien d'autre ne change : la discussion entre les deux reste hors de l'appli
-- (téléphone, visio…) ; l'Espace praticien garde par ailleurs ses propres dossiers (arbres_supp).
create table if not exists public.autorisations_arbre (
  id uuid primary key default gen_random_uuid(),
  code text unique,
  client_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  praticien_id uuid references auth.users(id) on delete cascade,
  prenom_client text,
  cabinet_praticien text,
  cree_le timestamptz not null default now(),
  expire_le timestamptz not null default (now() + interval '7 days'),
  relie_le timestamptz,
  revoque_le timestamptz
);
create index if not exists autorisations_arbre_client on public.autorisations_arbre (client_id);
create index if not exists autorisations_arbre_praticien on public.autorisations_arbre (praticien_id);
alter table public.autorisations_arbre enable row level security;

create policy "cliente gere ses autorisations" on public.autorisations_arbre
  for all to authenticated
  using ((select auth.uid()) = client_id)
  with check ((select auth.uid()) = client_id);
create policy "praticien voit ses liens" on public.autorisations_arbre
  for select to authenticated
  using ((select auth.uid()) = praticien_id);

-- La cliente génère un code (7 jours pour être utilisé). Les codes non réclamés précédents sont nettoyés.
create or replace function public.arbre_client_generer_code()
returns jsonb language plpgsql volatile security definer set search_path to '' as $$
declare v_code text; v_prenom text; v_i int := 0;
begin
  delete from public.autorisations_arbre where client_id = auth.uid() and relie_le is null;
  select (t.data #>> '{people,toi,prenom}') into v_prenom from public.arbres t where t.user_id = auth.uid();
  loop
    v_code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
    begin
      insert into public.autorisations_arbre (code, client_id, prenom_client) values (v_code, auth.uid(), v_prenom);
      exit;
    exception when unique_violation then
      v_i := v_i + 1; if v_i > 10 then return jsonb_build_object('erreur', 'reessaie'); end if;
    end;
  end loop;
  return jsonb_build_object('code', v_code);
end $$;

-- Le·la praticien·ne saisit le code reçu pour relier l'accès à son propre compte.
create or replace function public.arbre_client_relier(p_code text)
returns jsonb language plpgsql volatile security definer set search_path to '' as $$
declare a public.autorisations_arbre; v_cab text;
begin
  select * into a from public.autorisations_arbre where code = upper(trim(coalesce(p_code, ''))) for update;
  if not found or a.revoque_le is not null or (a.relie_le is null and a.expire_le < now()) then
    return jsonb_build_object('erreur', 'code');
  end if;
  if a.relie_le is not null and a.praticien_id <> auth.uid() then return jsonb_build_object('erreur', 'deja-relie'); end if;
  select cabinet into v_cab from public.praticiens where user_id = auth.uid();
  update public.autorisations_arbre
    set praticien_id = auth.uid(), cabinet_praticien = coalesce(v_cab, ''), relie_le = coalesce(a.relie_le, now())
    where id = a.id;
  return jsonb_build_object('ok', true, 'prenom', a.prenom_client);
end $$;

-- Lecture de l'arbre d'une cliente qui a relié son accès à ce·tte praticien·ne : rien d'autre que l'arbre.
create or replace function public.arbre_client_lire(p_client_id uuid)
returns jsonb language plpgsql stable security definer set search_path to '' as $$
declare t public.arbres;
begin
  if not exists (
    select 1 from public.autorisations_arbre
    where client_id = p_client_id and praticien_id = auth.uid() and revoque_le is null and relie_le is not null
  ) then
    return jsonb_build_object('erreur', 'acces');
  end if;
  select * into t from public.arbres where user_id = p_client_id;
  if not found then return jsonb_build_object('erreur', 'vide'); end if;
  return jsonb_build_object('data', t.data, 'maj', t.updated_at);
end $$;

revoke all on function public.arbre_client_generer_code() from public;
revoke all on function public.arbre_client_relier(text) from public;
revoke all on function public.arbre_client_lire(uuid) from public;
grant execute on function public.arbre_client_generer_code() to authenticated;
grant execute on function public.arbre_client_relier(text) to authenticated;
grant execute on function public.arbre_client_lire(uuid) to authenticated;
