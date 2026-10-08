# Outils internes (non publiés dans le menu)

## Ajouter des prénoms
1. Écrire les nouvelles fiches dans un fichier JSON (liste d'objets) en suivant `CONSIGNES-prenoms.md`.
2. `python3 outils-internes/ajouter-prenoms.py nouvelles-fiches.json` : contrôle (clés, mots interdits, doublons), ajoute à `assets/prenoms.js`, retire de la file `prenoms-a-venir.json`.
3. `node outils-internes/generer-prenoms.js` : régénère `prenoms/*.html`, `prenoms.html` et les entrées prénoms de `sitemap.xml`.

`prenoms-a-venir.json` contient la file des prochains prénoms (f et m), dans l'ordre de traitement.

## Photos des articles

Après avoir relancé un générateur d'articles, lancer `python3 outils-internes/ajouter-photos.py` : il remet la photo en bandeau sous le titre et les photos des cartes de blog.html. Pour une nouvelle image, la convertir dans assets/images/NOM-800.webp et NOM-1600.webp, puis l'ajouter dans PHOTOS.
