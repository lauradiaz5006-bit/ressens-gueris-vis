-- Genesolia · clés autorisées dans le coffre chiffré (table carnets, colonne mois). Appliqué le 21/10/2026.
-- Avant : seuls « AAAA-MM », « suivi-AAAA-MM » et « profil-accompagnement » passaient : les carnets des modules
-- de la formation, le point de départ, le fil d'or et les notes de séance des praticien·nes étaient refusés.
alter table public.carnets drop constraint if exists carnets_mois_check;
alter table public.carnets add constraint carnets_mois_check check (
  mois ~ '^(suivi-)?\d{4}-\d{2}$'
  or mois ~ '^module-[1-8]$'
  or mois in ('profil-accompagnement', 'point-de-depart', 'fil-d-or')
  or mois ~ '^seances-[0-9a-f-]{36}$'
);
