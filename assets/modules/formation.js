/* Genesolia · Cycle 2 · La formation « Sors de la boucle » dans l'appli
   Un réglage, utilisé par la page des modules (mon-module.html) et par la carte « Ta formation » de l'appli Le Cercle.
   - espace : le lien de connexion à ton espace de formation sur Systeme.io (vidéos et séances). Vide = la page formation.html.
   - mois : le mois de l'abonnement où chaque module s'ouvre (1 = le premier mois).
   - pret : true quand le carnet du module est écrit (assets/modules/module-N.js). */
window.GENESOLIA_FORMATION = {
  espace: '',
  modules: [
    { n: 1, titre: 'La boucle et la spirale', texte: 'Repérer ta boucle principale, celle qui revient partout.', mois: 1, pret: true },
    { n: 2, titre: 'Remonter à la source', texte: 'Ce qui s’est transmis dans ta famille, les âges et les dates qui se répondent.', mois: 2, pret: false },
    { n: 3, titre: 'Les programmes invisibles', texte: 'Croyances héritées, loyautés familiales, phrases qui décident à ta place.', mois: 3, pret: false },
    { n: 4, titre: 'Ce qui pèse', texte: 'Trois lettres et un rituel pour déposer ce que tu portes depuis trop longtemps.', mois: 5, pret: false },
    { n: 5, titre: 'Libérer la mémoire', texte: 'Un protocole en cinq étapes, au moment précis où la boucle se déclenche.', mois: 6, pret: false },
    { n: 6, titre: 'Stopper les répétitions', texte: 'Quand ça revient malgré tout : descendre jusqu’à la racine.', mois: 8, pret: false },
    { n: 7, titre: 'Remplacer la mémoire', texte: 'Choisir ce que tu veux vivre à la place, et commencer à le vivre.', mois: 9, pret: false },
    { n: 8, titre: 'Ta montagne', texte: 'Relier tout le chemin, écrire ta lettre d’intention, faire durer le changement.', mois: 11, pret: false }
  ]
};
