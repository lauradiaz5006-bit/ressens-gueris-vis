-- Genesolia · Le Cercle · accès « relecture » de la propriétaire (offre 'admin').
-- À exécuter une fois dans Supabase (SQL Editor). Sans danger si on le relance.
--
-- Pourquoi : la colonne acces_premium.offre n'accepte aujourd'hui que 'rapport', 'abonnement', 'offert', 'cercle', 'pro'.
-- Ce script ajoute 'admin' à la liste. Ensuite, dans le Table Editor, mettre offre = 'admin' sur la ligne de la propriétaire
-- (valide_jusqu doit rester dans le futur).
--
-- Effet (assets/site.js) : ce compte reste membre du Cercle comme avec 'offert', et toutes les étapes du suivi sont débloquées
-- (mon-suivi-mois.html?etape=N et ?mois=AAAA-MM, sans &apercu). Les séances (ouvrir_seance, seance-audio) traitent 'admin'
-- comme le Cercle complet. Chaque compte ne lit que sa propre ligne (règle « lire son acces ») et personne ne peut écrire
-- dans acces_premium depuis le site : 'admin' ne s'ouvre donc pour aucun autre compte.

alter table public.acces_premium drop constraint if exists acces_premium_offre_check;
alter table public.acces_premium add constraint acces_premium_offre_check
  check (offre = any (array['rapport', 'abonnement', 'offert', 'cercle', 'pro', 'admin']));
