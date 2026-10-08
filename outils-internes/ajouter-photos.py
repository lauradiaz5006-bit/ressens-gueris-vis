#!/usr/bin/env python3
"""Genesolia · ajoute la photo en bandeau sous le titre des articles, et la photo des cartes du blog.

À relancer après chaque générateur d'articles (generer-*.js / .py), qui réécrivent les pages sans photo :
    python3 outils-internes/ajouter-photos.py

- Une page qui a déjà sa photo n'est pas modifiée.
- Les images sont dans assets/images/NOM-800.webp et NOM-1600.webp (et assets/partage/NOM.jpg pour le partage).
- blog.html : chaque carte reçoit la photo de son article (ou celle de CARTES_SEULES).
"""
import re, pathlib

RACINE = pathlib.Path(__file__).resolve().parent.parent

ALT = {
    'blog-reves': "Une chambre au clair de lune, des voilages qui flottent et de petites lueurs comme des étoiles",
    'blog-jung': "Un livre ancien ouvert près d'une bougie, un mandala doré dessiné à la main",
    'blog-ancetres-reve': "Une silhouette vue de dos sur le seuil d'une porte ouverte sur une brume dorée",
    'blog-peuples-autochtones': "Un attrape-rêves en plumes nacrées devant un désert sous la Voie lactée",
    'blog-reves-recurrents': "Un escalier en spirale dans les nuages, des photos de famille anciennes posées sur les marches",
    'blog-journal-reves': "Un carnet ouvert et une tasse sur une table de nuit, la lumière de l'aube derrière le voilage",
    'blog-nombres': "Un cadran doré gravé de cercles et de géométrie fine, entouré de cristaux et de fleurs",
    'blog-annee-personnelle': "Un calendrier en laiton entouré de neuf sphères lumineuses disposées en cercle",
    'blog-argent': "Une vieille boîte en métal ouverte, quelques pièces anciennes et une lettre jaunie sur une table en bois",
    'blog-deuil': "Une bougie allumée près de photos anciennes et de chrysanthèmes roses, devant une fenêtre embuée",
    'blog-ciel': "Un ciel étoilé avec un croissant de lune au-dessus d'une mer calme",
    'blog-antiquite': "Des colonnes antiques au coucher du soleil, une tablette d'argile et un vase ancien",
    'etat-interieur': "Une femme assise près d'une fenêtre, les mains posées sur le cœur",
    'relations': "Deux personnes assises face à un coucher de soleil, reliées par un fil doré",
    'genosociogramme-vierge': "Un génosociogramme vierge posé sur une table, un crayon doré",
    'arbre-de-vie': "Un arbre de lumière aux sphères dorées et roses",
}

# Article -> image (seulement pour les pages qui n'ont pas encore de photo)
PHOTOS = {
    'symbolique-des-reves': 'blog-reves',
    'grands-symboles-des-reves': 'blog-reves',
    'jung-reves-archetypes': 'blog-jung',
    'rever-des-morts-et-des-ancetres': 'blog-ancetres-reve',
    'rever-de-ses-grands-parents-decedes': 'blog-deuil',
    'reves-et-peuples-autochtones': 'blog-peuples-autochtones',
    'reves-recurrents-et-memoire-familiale': 'blog-reves-recurrents',
    'journal-de-reves': 'blog-journal-reves',
    'nombres-maitres': 'blog-nombres',
    'nombre-maitre-11': 'blog-nombres',
    'nombre-maitre-22': 'blog-nombres',
    'nombre-maitre-33': 'blog-nombres',
    'annee-personnelle-2027': 'blog-annee-personnelle',
    **{f'annee-personnelle-{n}-en-2027': 'blog-annee-personnelle' for n in range(1, 10)},
    'le-ciel-du-mois': 'blog-ciel',
    'mercure-retrograde-2027': 'blog-ciel',
    'peur-de-manquer-d-argent': 'blog-argent',
    'syndrome-du-gisant': 'blog-deuil',
    'enfant-de-remplacement': 'blog-reves-recurrents',
    'blessure-rejet-ou-abandon': 'etat-interieur',
    'blessure-de-rejet': 'etat-interieur',
    'blessure-d-humiliation': 'etat-interieur',
    'blessure-d-injustice': 'etat-interieur',
    'blessure-d-abandon': 'relations',
    'blessure-de-trahison': 'relations',
    'arbre-de-vie-arbre-genealogique-genosociogramme': 'arbre-de-vie',
    'informations-avant-genosociogramme': 'genosociogramme-vierge',
}
# Toutes les pages « ciel du mois » (ciel-octobre-2026.html, etc.)
for p in RACINE.glob('ciel-*-20*.html'):
    PHOTOS[p.stem] = 'blog-ciel'

# Cartes du blog dont l'article n'a pas (encore) de photo
CARTES_SEULES = {'reves-dans-l-antiquite': 'blog-reves'}


def figure(nom, alt, h):
    return (f'    <figure class="bandeau-photo"><img src="assets/images/{nom}-1600.webp" '
            f'srcset="assets/images/{nom}-800.webp 800w, assets/images/{nom}-1600.webp 1600w" '
            f'sizes="(max-width: 1140px) 100vw, 1100px" width="1600" height="{h}" alt="{alt}" '
            f'loading="lazy" decoding="async"></figure>\n')


def hauteur(nom):
    return 840 if nom.startswith('blog-') else 841


def ajouter_bandeaux():
    n = 0
    for slug, nom in PHOTOS.items():
        f = RACINE / f'{slug}.html'
        if not f.exists() or not (RACINE / f'assets/images/{nom}-1600.webp').exists():
            continue
        t = f.read_text(encoding='utf-8')
        if 'bandeau-photo' in t:
            continue
        i = t.find('<main')
        j = t.find('</section>', i)
        if i < 0 or j < 0:
            continue
        j += len('</section>\n')
        t = t[:j] + figure(nom, ALT.get(nom, ''), hauteur(nom)) + t[j:]
        if nom.startswith('blog-') and (RACINE / f'assets/partage/{nom}.jpg').exists():
            t = re.sub(r'(<meta property="og:image" content=")[^"]*(")',
                       rf'\g<1>https://genesolia.fr/assets/partage/{nom}.jpg\g<2>', t, count=1)
        f.write_text(t, encoding='utf-8')
        n += 1
    print(f'{n} bandeau(x) ajouté(s)')


def photo_article(slug):
    f = RACINE / f'{slug}.html'
    if f.exists():
        m = re.search(r'class="bandeau-photo"><img src="assets/images/([a-z0-9-]+)-1600\.webp"', f.read_text(encoding='utf-8'))
        if m:
            return m.group(1)
    return CARTES_SEULES.get(slug)


def cartes_blog():
    f = RACINE / 'blog.html'
    t = f.read_text(encoding='utf-8')
    t = re.sub(r'\s*<img class="carte-photo"[^>]*>', '', t)  # on repart de zéro

    def remplace(m):
        nom = photo_article(m.group(2))
        if not nom:
            return m.group(0)
        img = (f'\n          <img class="carte-photo" src="assets/images/{nom}-800.webp" width="800" '
               f'height="420" alt="" loading="lazy" decoding="async">')
        return m.group(0) + img

    t = re.sub(r'(<a class="article-carte" href="([a-z0-9-]+)\.html"[^>]*>)', remplace, t)
    f.write_text(t, encoding='utf-8')
    print('cartes du blog : ' + str(t.count('class="carte-photo"')) + ' photo(s)')


if __name__ == '__main__':
    ajouter_bandeaux()
    cartes_blog()
