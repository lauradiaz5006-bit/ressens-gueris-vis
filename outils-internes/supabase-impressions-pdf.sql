-- Genesolia · arbre imprimé : autoriser les PDF dans le dossier Storage « impressions »
-- (le fichier envoyé à l'imprimeur devient un PDF avec fond perdu, aux normes Gelato).
-- À coller une fois dans Supabase : SQL Editor, puis Run. Sans risque : n'ajoute qu'un type de fichier.
update storage.buckets
set allowed_mime_types = array['image/jpeg', 'image/png', 'application/pdf']
where id = 'impressions';
