-- Genesolia · Deux correctifs de base, constatés le 13/11/2026
--
-- 1. La suppression d'un compte échoue. La clé étrangère arbres.user_id n'a pas de
--    « on delete cascade », contrairement à carnets, arbres_supp et acces_premium.
--    Supprimer une cliente renvoie une erreur de contrainte : son compte reste, et son
--    arbre avec. C'est un problème concret pour le bouton « supprimer mon compte », et
--    pour le droit à l'effacement.
--
-- 2. Le rôle « anon » (visiteur non connecté, clé publique présente dans le JavaScript
--    du site) possède tous les droits sur acces_premium, arbres, arbres_supp et carnets,
--    y compris TRUNCATE. Les politiques RLS bloquent bien la lecture et l'écriture, mais
--    elles ne s'appliquent PAS à TRUNCATE. Ce n'est pas exploitable par l'API REST de
--    Supabase, qui n'émet jamais de TRUNCATE : rien n'est ouvert aujourd'hui. Mais il ne
--    reste aucune marge de sécurité, et retirer ces droits ne coûte rien.
--
-- À coller dans Supabase › SQL Editor.

\echo '--- 1. Clés étrangères vers auth.users sans effacement en cascade ---'
select conrelid::regclass as table_concernee, conname as contrainte
from pg_constraint
where contype = 'f' and confrelid = 'auth.users'::regclass
  and connamespace = 'public'::regnamespace and confdeltype = 'a'
order by 1;

do $$
declare r record; v_col text;
begin
  for r in
    select c.oid, c.conrelid::regclass::text as tbl, c.conname
    from pg_constraint c
    where c.contype = 'f' and c.confrelid = 'auth.users'::regclass
      and c.connamespace = 'public'::regnamespace and c.confdeltype = 'a'
  loop
    select string_agg(quote_ident(a.attname), ', ' order by k.ord)
      into v_col
    from pg_constraint c2
         cross join lateral unnest(c2.conkey) with ordinality as k(attnum, ord)
         join pg_attribute a on a.attrelid = c2.conrelid and a.attnum = k.attnum
    where c2.oid = r.oid;
    execute format('alter table %s drop constraint %I', r.tbl, r.conname);
    execute format('alter table %s add constraint %I foreign key (%s) references auth.users(id) on delete cascade',
                   r.tbl, r.conname, v_col);
    raise notice 'cascade ajoutée : %.%', r.tbl, r.conname;
  end loop;
end $$;

\echo '--- 2. Droits retirés au visiteur non connecté ---'
-- Table par table, pour qu'une table absente n'interrompe pas le reste
do $$
declare t text;
begin
  foreach t in array array['acces_premium', 'arbres', 'arbres_supp', 'carnets'] loop
    if to_regclass('public.' || t) is null then
      raise notice 'table absente, ignorée : %', t; continue;
    end if;
    execute format('revoke all on public.%I from anon', t);
    -- TRUNCATE échappe aux politiques RLS : personne d'autre que le service n'en a besoin
    execute format('revoke truncate, references, trigger on public.%I from authenticated', t);
    raise notice 'droits resserrés : %', t;
  end loop;
end $$;

\echo '--- 3. Vérification : il ne doit plus rien rester ci-dessous pour anon ---'
select table_name, grantee, string_agg(privilege_type, ', ' order by privilege_type) as droits
from information_schema.role_table_grants
where table_schema = 'public' and grantee in ('anon', 'authenticated')
  and table_name in ('acces_premium', 'arbres', 'arbres_supp', 'carnets')
group by table_name, grantee order by table_name, grantee;

select conrelid::regclass as encore_sans_cascade, conname
from pg_constraint
where contype = 'f' and confrelid = 'auth.users'::regclass
  and connamespace = 'public'::regnamespace and confdeltype = 'a';

\echo '--- 4. Question ouverte : l''offre « cycle1 » ---'
-- La contrainte de acces_premium autorise « cycle1 », mais aucun code du site ne lit
-- cette valeur : ni membre du Cercle, ni Pass. Si des lignes existent, ces clientes
-- n'ont accès à rien. Lecture seule.
select offre, count(*) as lignes,
       count(*) filter (where valide_jusqu > now()) as encore_valides
from public.acces_premium group by offre order by offre;
