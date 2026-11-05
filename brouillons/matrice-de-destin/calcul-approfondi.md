# Matrice de destin — logique de calcul

Brouillon interne, non publié. Deux niveaux : le niveau gratuit (grille à 8 points, calculée uniquement à partir de la date de naissance) et le niveau approfondi (prénom + lien transgénérationnel), réservé à Laura, non ajouté au Cercle.

## Niveau 1 — gratuit (date de naissance seule)

Grille en octogone, 8 points, chacun donnant un nombre entre 1 et 22, relié à un arcane (voir `arcanes-22.md`).

Règle de réduction utilisée partout : on additionne les chiffres ; si le total dépasse 22, on additionne à nouveau les chiffres du résultat, jusqu'à obtenir un nombre entre 1 et 22. Si un calcul donne 0, on prend 22.

À partir d'une date JJ/MM/AAAA :

- **A — Mission** : somme de tous les chiffres de la date (J+J+M+M+A+A+A+A), réduite entre 1 et 22.
- **B — Talents** : somme des chiffres de A (si A est déjà un seul chiffre, B = A).
- **C — Lignée paternelle** : somme des chiffres du mois et de l'année, réduite entre 1 et 22.
- **D — Lignée maternelle** : somme des chiffres du jour et de l'année, réduite entre 1 et 22.
- **E — Cœur** : somme des chiffres du jour et du mois, réduite entre 1 et 22.
- **F — Terrain concret** : somme des chiffres de l'année seule, réduite entre 1 et 22.
- **G — Défi** : valeur absolue de (A − B) ; si le résultat est 0, G = 22.
- **H — Équilibre (centre)** : somme des chiffres de (A+B+C+D+E+F+G), réduite entre 1 et 22.

### Exemple chiffré (date test : 14/03/1985)

| Point | Calcul | Résultat | Arcane |
| --- | --- | --- | --- |
| A — Mission | 1+4+0+3+1+9+8+5=31 → 3+1 | 4 | Arcane 4 — L'Empereur |
| B — Talents | A déjà à un chiffre | 4 | Arcane 4 — L'Empereur |
| C — Lignée paternelle | 0+3+1+9+8+5=26 → 2+6 | 8 | Arcane 8 — La Justice |
| D — Lignée maternelle | 1+4+1+9+8+5=28 → 2+8 | 10 | Arcane 10 — La Roue |
| E — Cœur | 1+4+0+3 | 8 | Arcane 8 — La Justice |
| F — Terrain concret | 1+9+8+5=23 → 2+3 | 5 | Arcane 5 — Le Guide |
| G — Défi | \|4−4\|=0 → 22 | 22 | Arcane 22 — Le Voyageur |
| H — Équilibre | 4+4+8+10+8+5+22=61 → 6+1 | 7 | Arcane 7 — Le Chariot |

Cette grille sert de base à la page de démonstration (`demo-matrice-de-destin.html`).

---

## Niveau 2 — approfondi (prénom + lien transgénérationnel)

Présenté comme une combinaison numérologie + psychogénéalogie. Jamais présenté comme une méthode inventée de nulle part : s'appuie sur la formation de Laura en psychogénéalogie (Genomm) et sur un calcul de numérologie par les lettres.

Important : le calcul détaillé ci-dessous (correspondance lettres → valeurs) reste entièrement en coulisse. À l'écran, seuls apparaissent : un nombre, un intitulé de domaine, une tendance et un texte d'interprétation. Aucune lettre, aucun mot, aucune référence à l'hébreu ou à une tradition religieuse n'est jamais affichée.

### 1. Le nombre du prénom

Chaque son du prénom reçoit une valeur (table de correspondance interne, inspirée d'un système de calcul par lettres utilisé en numérologie traditionnelle). On fait la somme de toutes les valeurs, puis on réduit en additionnant les chiffres du résultat jusqu'à obtenir un nombre entre 1 et 10.

Ce nombre de 1 à 10 est ensuite associé à un domaine de vie, avec le même vocabulaire neutre déjà utilisé ailleurs sur le site (page sur l'arbre de vie) :

| Nombre | Domaine de vie |
| --- | --- |
| 1 | Le sens, ce qui met en mouvement |
| 2 | L'intuition, les idées qui jaillissent |
| 3 | La compréhension, la structure |
| 4 | La générosité, ce qui se donne |
| 5 | Les limites, la capacité à dire non |
| 6 | L'équilibre, le cœur |
| 7 | La persévérance, le désir |
| 8 | La pensée, les mots, la communication |
| 9 | Les émotions et les liens |
| 10 | La vie matérielle, l'ancrage, la place |

### 2. La période de vie actuelle

Trois grandes périodes, déterminées par l'âge, qui nuancent la lecture du nombre du prénom :

- **0 à 28 ans** : construire ses bases, trouver sa sécurité et sa place.
- **29 à 42 ans** : les choix de cœur, les relations, se construire par soi-même.
- **43 ans et plus** : la transmission, le sens, les bilans et un second élan.

### 3. La tendance de blessure

Parmi les cinq blessures reconnues en psychogénéalogie (rejet, abandon, trahison, humiliation, injustice), l'outil propose une tendance dominante, calculée à partir du reste de la division du nombre brut (avant réduction) du prénom par 5 :

| Reste | Tendance |
| --- | --- |
| 1 | Rejet |
| 2 | Abandon |
| 3 | Trahison |
| 4 | Humiliation |
| 0 (traité comme 5) | Injustice |

Présentée comme une piste de réflexion, jamais comme un diagnostic : « une tendance plus présente que les autres », pas « une blessure que vous avez ».

### 4. Le lien transgénérationnel

La personne ajoute jusqu'à trois ascendants (prénom, lien de parenté, date de naissance si connue — comme le fait déjà l'outil des prénoms de la famille). Pour chacun, le même calcul (domaine + tendance) est effectué. L'outil repère ensuite les échos :

- un domaine de vie qui se répète entre la personne et un ascendant ;
- une tendance de blessure qui se répète ;
- deux dates de naissance proches ou identiques (jour et mois), comme le fait déjà l'outil du syndrome d'anniversaire.

Le message de fond, répété dans le texte de résultat : *« Les nombres donnent une direction, pas une explication complète. Ce qui se répète dans une famille compte autant que ce que disent les chiffres. »*

---

### Exemples d'interprétation (5-6 textes, à valider)

**Exemple 1 — Domaine 9 (émotions et liens), tendance Rejet, période 29-42 ans**
> Le prénom oriente vers les émotions et les liens : une grande sensibilité à ce qui se vit en relation, et un besoin fort d'appartenance. La tendance au rejet, plus présente que les autres, peut se traduire par une vigilance excessive au regard des autres. Dans la période actuelle, celle des choix de cœur, cette combinaison invite à observer où l'appartenance est recherchée au prix de soi-même.

**Exemple 2 — Domaine 7 (persévérance), tendance Rejet, période 43 ans et plus**
> Le prénom porte une énergie de persévérance et de désir qui dure. Associée à une tendance au rejet, elle peut avoir pris la forme d'une vie passée à prouver sa valeur par l'effort. Dans la période de transmission, la question devient : qu'est-ce qui a été prouvé, et à qui ?

**Exemple 3 — Domaine 2 (intuition), tendance Rejet, période 29-42 ans**
> Le prénom met en avant l'intuition et les idées qui jaillissent. Avec une tendance au rejet, cette intuition a parfois été mise de côté par peur de déranger ou de ne pas être comprise. Se fier à ce qui jaillit, même sans pouvoir l'expliquer tout de suite, est une piste à explorer.

**Exemple 4 — Domaine 9 (émotions et liens), tendance Trahison, période 0-28 ans**
> Le prénom oriente aussi vers les émotions et les liens, mais la tendance dominante ici est la trahison : une attention particulière à la loyauté, et une difficulté possible à faire confiance pleinement. Dans cette période de construction des bases, apprendre à distinguer une vraie rupture de confiance d'une simple différence de points de vue est un apprentissage central.

**Exemple 5 — Écho transgénérationnel (à partir des exemples 1 et 2)**
> Deux générations de la même lignée portent la même tendance au rejet. Ce n'est pas une fatalité transmise : c'est un fil qui s'est répété, et qui peut maintenant être regardé consciemment, plutôt que rejoué sans le savoir.

**Exemple 6 — Écho de domaine sans écho de tendance**
> Le domaine des émotions et des liens revient chez la personne et chez l'un de ses ascendants, alors que leurs tendances de blessure diffèrent (rejet d'un côté, trahison de l'autre). Le fil commun porte ici sur la façon de vivre les attachements, pas sur la même histoire exacte.

---

### Données de démonstration utilisées dans la page HTML

Prénoms fictifs, pour l'exemple uniquement (aucune donnée réelle d'une cliente ou d'un membre de la famille de Laura). Valeurs vérifiées directement dans la page `demo-matrice-de-destin.html` (calcul exécuté, pas estimé à la main) :

- **Léa**, née le 14/03/1985 (41 ans, période 29-42 ans) → domaine 9 (émotions et liens) → tendance Injustice
- **Madeleine** (grand-mère maternelle, fictive) → domaine 7 (persévérance) → tendance Injustice
- **Hélène** (mère, fictive) → domaine 2 (intuition) → tendance Injustice
- **Antoine** (grand-père paternel, fictif) → domaine 9 (émotions et liens) → tendance Abandon

Ce jeu d'exemple illustre bien l'écho transgénérationnel recherché : trois générations du côté maternel (Léa, Hélène, Madeleine) partagent la même tendance (Injustice), tandis que la lignée paternelle (Antoine) diffère par la tendance (Abandon) mais partage le même domaine de vie (9, émotions et liens) que Léa. Les textes d'exemple du point précédent (« tendance Rejet », « tendance Trahison »...) sont des modèles de ton génériques, à associer au bon intitulé selon le calcul réel — ils ne sont pas tous alignés mot pour mot sur ce jeu de données précis.
