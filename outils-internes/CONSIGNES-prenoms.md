# Fiches prénoms pour Genesolia (site anonyme : famille, numérologie, astrologie, rêves)

Écris un fichier JSON UTF-8 : une LISTE d'objets, un par prénom de ta liste, dans l'ordre alphabétique, avec EXACTEMENT ces clés :
{
  "prenom": "Léa",
  "variantes": ["Leah", "Lia"],          // 0 à 4 formes proches ou étrangères, réelles
  "genre": "f" | "m" | "mixte",
  "origine": "hébraïque | latine | grecque | germanique | celtique | arabe | française | anglaise | italienne | espagnole | slave | scandinave | incertaine ...",
  "sens": "1 phrase : le sens étymologique le plus admis, avec prudence si discuté (« on le rapproche de… », « sens discuté »)",
  "histoire": "2 à 3 phrases (40 à 70 mots) : une ou deux figures historiques, légendaires ou religieuses qui ont porté ce prénom (saints, reines, héros de la mythologie ou de la littérature ; JAMAIS de personne vivante), et, seulement si tu en es sûr·e, l'époque où il a été très donné en France (ex. « très donné en France dans les années 1950 et 1960 »)",
  "fete": "jour et mois de la fête au calendrier français usuel (ex. « 22 mars ») ou chaîne vide si tu n'es pas certain·e"
}
(Retire les commentaires //, JSON strict.)

## Exactitude
- N'écris que ce qui est solidement établi. En cas de doute sur une étymologie, une figure ou une date de fête, vérifie en ligne (WebSearch / WebFetch) ou reste général·e / laisse "fete" vide.
- Pas de « signification » ésotérique, pas de traits de caractère attribués au prénom : uniquement histoire et étymologie.

## Écriture
- Tutoiement inutile ici (texte descriptif). Pas d'emoji, pas de flèche « → », pas de tiret cadratin « — ».
- AUCUN vocabulaire de santé : santé, guérir, guérison, soigner, soin(s), maladie, malade, thérapie, médecin, médecine, médical, patient, symptôme, vibrer, vibration. Pour un saint guérisseur ou médecin (ex. saint Luc), dis « évangéliste », « patron des peintres »… sans ces mots.
- Ne parle pas de religion de façon militante : présente les saints et figures religieuses comme des repères historiques et culturels.

## Vérifications finales
python3 -c "import json;d=json.load(open('CHEMIN'));print(len(d));print([x['prenom'] for x in d if not x['sens'] or not x['histoire']])"
grep -ioP "\b(santé|guéri\w*|soign\w*|soins?|maladi\w*|malade\w*|thérap\w*|médic\w*|médecin\w*|patient\w*|symptôm\w*|vibr\w*)\b|→|—" CHEMIN   (doit ne rien renvoyer)
Réponds avec le nombre de fiches et les points vérifiés en ligne.
