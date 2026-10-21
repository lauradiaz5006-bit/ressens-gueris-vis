-- Genesolia · mails envoyés par Supabase (sans N8N) et avis des utilisatrices.
-- À coller UNE fois dans Supabase > SQL Editor > New query, puis « Run ».

-- 1. Les avis (formulaire genesolia.fr/avis.html). Rien n'est affiché tant que tu ne coches pas « publie ».
create table if not exists public.avis (
  id bigint generated always as identity primary key,
  prenom text not null,
  ville text,
  age int,
  texte text not null,
  email text,
  page text,
  accord_publication boolean not null default false,
  publie boolean not null default false,
  cree_le timestamptz not null default now()
);
comment on table public.avis is 'Avis laissés sur genesolia.fr/avis.html. Coche « publie » pour afficher un avis (seulement si accord_publication est coché). Le site montre le prénom, l''âge, la ville et le texte.';
alter table public.avis enable row level security;   -- aucune lecture ni écriture directe : tout passe par la fonction « avis »

-- 2. Les mails partent par la fonction Supabase « envoi-mails » toutes les 10 minutes, à la place du réveil de N8N.
--    Tant que les secrets SMTP ne sont pas créés, cette fonction réveille encore N8N : aucun mail n'est perdu.
select cron.unschedule('reveil-n8n-mails-genesolia') where exists (select 1 from cron.job where jobname = 'reveil-n8n-mails-genesolia');
select cron.unschedule('envoi-mails-genesolia') where exists (select 1 from cron.job where jobname = 'envoi-mails-genesolia');
select cron.schedule('envoi-mails-genesolia', '*/10 * * * *', $$
  select net.http_post(
    url := 'https://qsvzzkjtjsznfntahvvh.supabase.co/functions/v1/envoi-mails',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  )
  where exists (select 1 from public.mails m left join public.contacts c on c.id = m.contact_id
                where m.ok_envoyer and not m.envoye and m.erreur is null and m.a_envoyer_le <= now()
                  and coalesce(c.desinscrit, false) = false)
$$);
