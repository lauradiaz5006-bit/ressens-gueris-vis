# Image de l'article de décembre

`autel-decembre-1536.webp` et `-768.webp` : l'image **entière**, format 3:2, aucun recadrage.
À afficher avec `.bandeau-carre` adapté en `aspect-ratio:3/2`, pas avec `.bandeau-photo`
(qui impose 1600/841 et couperait le haut : le cadre au mur et les branches disparaîtraient).

`../partage/autel-decembre.jpg` : 1200x630 pour `og:image`. Jamais de WebP en og:image.

## Le cadre au mur
L'affiche encadrée au fond porte « Je porte mes racines sans m'y perdre. » et la signature
GENESOLIA. Sous l'image, mettre une légende cliquable vers la boutique :

    <figcaption>… <a href="boutique.html">L'affiche au mur vient de la boutique</a>.</figcaption>

La boutique est `boutique.html`. Vérifier que l'affiche y figure bien avant de poser le lien ;
si elle n'y est pas encore, pointer vers la page boutique sans la nommer précisément.
