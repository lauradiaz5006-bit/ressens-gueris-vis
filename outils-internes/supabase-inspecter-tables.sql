-- Genesolia · Photographie des tables qui ne sont décrites nulle part dans le dépôt
--
-- acces_premium, arbres, arbres_supp, carnets et mails ont été créées directement dans
-- le tableau de bord Supabase. Leurs colonnes, leurs contraintes et surtout leurs
-- politiques RLS n'existent donc qu'à un seul endroit : la base elle-même. Si elle est
-- perdue, ou si une politique saute par mégarde, rien ne permet de la reconstruire ni
-- même de savoir ce qu'elle disait.
--
-- À coller dans Supabase › SQL Editor. Lecture seule : cette requête ne modifie rien.
-- Renvoie le détail de chaque table, puis signale en majuscules les anomalies :
-- RLS désactivée, absence totale de politique, droits accordés au rôle anonyme.
with cible as (
  select unnest(array['acces_premium','arbres','arbres_supp','carnets','mails']) as t
)
select ligne from (
  -- 1. existence et RLS
  select 1 as s, c.t as g, 0 as o,
         c.t || ' : ' || case when cl.oid is null then 'TABLE ABSENTE'
              else 'existe, RLS ' || case when cl.relrowsecurity then 'ACTIVÉE' else '*** DÉSACTIVÉE ***' end
              || case when cl.relforcerowsecurity then ' (forcée)' else '' end end as ligne
  from cible c left join pg_class cl on cl.relname = c.t
       and cl.relnamespace = 'public'::regnamespace and cl.relkind = 'r'
  union all
  -- 2. colonnes
  select 2, c.t, a.attnum,
         '   colonne  ' || a.attname || ' ' || format_type(a.atttypid, a.atttypmod)
         || case when a.attnotnull then ' NOT NULL' else '' end
         || coalesce(' DEFAULT ' || pg_get_expr(d.adbin, d.adrelid), '')
  from cible c
  join pg_class cl on cl.relname = c.t and cl.relnamespace = 'public'::regnamespace
  join pg_attribute a on a.attrelid = cl.oid and a.attnum > 0 and not a.attisdropped
  left join pg_attrdef d on d.adrelid = cl.oid and d.adnum = a.attnum
  union all
  -- 3. contraintes
  select 3, c.t, 0, '   contrainte ' || con.conname || ' : ' || pg_get_constraintdef(con.oid)
  from cible c
  join pg_class cl on cl.relname = c.t and cl.relnamespace = 'public'::regnamespace
  join pg_constraint con on con.conrelid = cl.oid
  union all
  -- 4. index
  select 4, c.t, 0, '   index     ' || i.indexname || ' : ' || i.indexdef
  from cible c join pg_indexes i on i.tablename = c.t and i.schemaname = 'public'
  union all
  -- 5. politiques RLS
  select 5, c.t, 0,
         '   POLITIQUE ' || p.policyname || ' [' || p.cmd || ', ' || coalesce(array_to_string(p.roles, '+'), '?')
         || ', ' || case when p.permissive = 'PERMISSIVE' then 'permissive' else 'RESTRICTIVE' end || ']'
         || E'\n        using      : ' || coalesce(p.qual, '(aucun)')
         || E'\n        with check : ' || coalesce(p.with_check, '(aucun)')
  from cible c join pg_policies p on p.tablename = c.t and p.schemaname = 'public'
  union all
  -- 6. déclencheurs
  select 6, c.t, 0, '   trigger   ' || tg.tgname || ' : ' || pg_get_triggerdef(tg.oid)
  from cible c
  join pg_class cl on cl.relname = c.t and cl.relnamespace = 'public'::regnamespace
  join pg_trigger tg on tg.tgrelid = cl.oid and not tg.tgisinternal
  union all
  -- 7. aucune politique du tout ?
  select 7, c.t, 0, '   *** AUCUNE POLITIQUE RLS SUR CETTE TABLE ***'
  from cible c
  join pg_class cl on cl.relname = c.t and cl.relnamespace = 'public'::regnamespace
  where not exists (select 1 from pg_policies p where p.tablename = c.t and p.schemaname = 'public')
  union all
  -- 8. droits accordés aux rôles web
  select 8, c.t, 0, '   droits    ' || g.grantee || ' : ' || string_agg(g.privilege_type, ', ' order by g.privilege_type)
  from cible c
  join information_schema.role_table_grants g on g.table_name = c.t and g.table_schema = 'public'
  where g.grantee in ('anon', 'authenticated')
  group by c.t, g.grantee
) x order by g, s, o;
