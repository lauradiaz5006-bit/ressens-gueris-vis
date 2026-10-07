# Outils internes (non publiés dans le menu)

## Ajouter des prénoms
1. Écrire les nouvelles fiches dans un fichier JSON (liste d'objets) en suivant `CONSIGNES-prenoms.md`.
2. `python3 outils-internes/ajouter-prenoms.py nouvelles-fiches.json` : contrôle (clés, mots interdits, doublons), ajoute à `assets/prenoms.js`, retire de la file `prenoms-a-venir.json`.
3. `node outils-internes/generer-prenoms.js` : régénère `prenoms/*.html`, `prenoms.html` et les entrées prénoms de `sitemap.xml`.

`prenoms-a-venir.json` contient la file des prochains prénoms (f et m), dans l'ordre de traitement.
