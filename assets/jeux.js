/* Genesolia — les jeux pour se rapprocher (page jeux.html).
   Modes : amies, famille, soiree (tout public), couple (adultes).
   Pour ajouter une carte : ajouter une ligne dans la bonne liste. */
(function () {
  'use strict';
  var Q = { /* Les cartes qui rapprochent : [texte, modes] ; modes vide = tous */
    leger: [
      ['Quel souvenir d\'enfance te fait encore rire ?', ''],
      ['Si tu pouvais revivre une seule journée de ta vie, laquelle ?', ''],
      ['Quelle chanson te met de bonne humeur à coup sûr ?', ''],
      ['Quel petit plaisir te rend heureuse ou heureux, même un jour gris ?', ''],
      ['Quel surnom on t\'a donné un jour, et pourquoi ?', ''],
      ['Qu\'est-ce que tu faisais pendant des heures quand tu étais petit·e ?', ''],
      ['Quel est le meilleur conseil qu\'on t\'ait donné ?', ''],
      ['Si on se retrouvait dans dix ans, où aimerais-tu qu\'on soit ?', 'amies couple'],
      ['Quel est ton souvenir préféré avec la personne à ta gauche ?', 'amies soiree famille'],
      ['Quel est notre meilleur fou rire ensemble ?', 'amies couple'],
      ['Quelle tradition de famille tu aimes le plus ?', 'famille soiree'],
      ['Quel plat te ramène directement en enfance ?', ''],
      ['Qu\'est-ce que tu as remarqué chez moi la toute première fois ?', 'couple amies'],
      ['Quel pays rêves-tu de découvrir, et avec qui ?', '']
    ],
    profond: [
      ['Qu\'est-ce qui te fait te sentir aimé·e, vraiment ?', ''],
      ['De quoi es-tu fièr·e, même si tu n\'en parles jamais ?', ''],
      ['Qu\'est-ce que tu aimerais qu\'on comprenne mieux chez toi ?', ''],
      ['Quand est-ce que tu t\'es senti·e vraiment écouté·e pour la dernière fois ?', ''],
      ['Qu\'est-ce que tu n\'oses pas demander, alors que tu en aurais envie ?', ''],
      ['Quelle peur aimerais-tu laisser derrière toi cette année ?', ''],
      ['Qu\'est-ce qui te recharge quand tu es à plat ?', ''],
      ['Qu\'est-ce que je pourrais faire pour que tu te sentes mieux quand ça ne va pas ?', 'couple amies famille'],
      ['Qu\'est-ce que notre relation t\'a appris sur toi ?', 'couple amies'],
      ['Quel moment entre nous t\'a fait te sentir le plus proche de moi ?', 'couple amies'],
      ['Qu\'est-ce que tu aimerais qu\'on fasse plus souvent ensemble ?', 'couple amies famille'],
      ['Quelle qualité admires-tu chez quelqu\'un de cette pièce ?', 'soiree famille'],
      ['Qu\'est-ce qui t\'aide à faire confiance à quelqu\'un ?', ''],
      ['Quel rêve as-tu mis de côté, et pourquoi ?', '']
    ],
    famille: [
      ['Quelle phrase de ta famille veux-tu garder, et laquelle laisses-tu ?', ''],
      ['Qui, dans ta famille, te ressemble le plus ? En quoi ?', ''],
      ['Qu\'est-ce que tes grands-parents faisaient à ton âge ?', ''],
      ['Quel talent s\'est transmis dans ta famille ?', ''],
      ['Comment on se réconciliait chez toi après une dispute ?', ''],
      ['Quel sujet on n\'abordait jamais à table chez toi ?', ''],
      ['Qu\'est-ce que tu aimerais transmettre un jour ?', ''],
      ['Quelle histoire de famille as-tu entendue cent fois ?', ''],
      ['Quel métier revient souvent dans ta famille ?', ''],
      ['Qu\'est-ce que ta famille t\'a appris sur l\'amour ?', ''],
      ['Si tu pouvais poser une question à un·e ancêtre, laquelle ?', ''],
      ['Qu\'est-ce que tu fais exactement comme ta mère ou ton père, sans le vouloir ?', '']
    ]
  };
  var DIRE = [ /* Dis-le autrement : [phrase qui blesse, une idée pour le dire avec douceur] */
    ['Tu fais toujours ça.', 'Quand ça arrive, je me sens mis·e de côté. On peut en parler ?'],
    ['T\'es chiant·e.', 'Là, je suis à bout. J\'ai besoin d\'une petite pause.'],
    ['Tu ne m\'écoutes jamais.', 'J\'ai besoin que tu m\'écoutes deux minutes, sans ton téléphone.'],
    ['C\'est n\'importe quoi ce que tu dis.', 'Je ne vois pas les choses comme toi. Tu peux m\'expliquer ?'],
    ['Laisse tomber, t\'as rien compris.', 'Je crois que je me suis mal exprimé·e. Je réessaie.'],
    ['T\'es trop sensible.', 'Je vois que ça t\'a touché·e. Je ne voulais pas te blesser.'],
    ['Fais ce que tu veux, de toute façon.', 'Je ne suis pas d\'accord, mais je respecte ton choix.'],
    ['Tu ne penses qu\'à toi.', 'J\'aimerais qu\'on pense aussi à ce dont j\'ai besoin.'],
    ['Tu m\'as encore oublié·e.', 'J\'ai été déçu·e que tu ne m\'aies pas prévenu·e. Ça compte pour moi.'],
    ['Arrête de faire ta victime.', 'J\'ai l\'impression qu\'on ne se comprend pas. On recommence ?'],
    ['T\'es comme ta mère.', 'Là, cette réaction me fait mal. Je préfère qu\'on en parle calmement.'],
    ['Tu réponds jamais à mes messages.', 'Quand je n\'ai pas de réponse, je m\'inquiète. Un petit mot me suffit.'],
    ['C\'est ta faute.', 'On a tous les deux un rôle là-dedans. On cherche une solution ?'],
    ['Tu exagères.', 'Pour moi c\'est important. Tu veux bien essayer de voir de mon côté ?'],
    ['Je m\'en fiche.', 'Je n\'ai pas l\'énergie d\'en parler maintenant. On en reparle ce soir ?'],
    ['T\'es nul·le pour ça.', 'Tu veux qu\'on le fasse ensemble ? Je peux te montrer.']
  ];
  var VG = {
    verite: [
      ['Quelle est la chose la plus gentille qu\'on ait faite pour toi ?', ''],
      ['Quand as-tu eu du courage pour la dernière fois ?', ''],
      ['De quoi as-tu vraiment besoin en ce moment ?', ''],
      ['Qu\'est-ce que tu regrettes de ne pas avoir dit à quelqu\'un ?', ''],
      ['Quelle petite habitude aimerais-tu changer ?', ''],
      ['Qu\'est-ce que tu n\'as jamais osé avouer à ce groupe ?', 'soiree amies'],
      ['Qu\'est-ce que tu aimerais entendre plus souvent ?', ''],
      ['Quel compliment t\'a marqué·e pour toujours ?', ''],
      ['De quoi as-tu peur que les autres pensent de toi ?', ''],
      ['Quel moment de ta vie t\'a le plus fait grandir ?', '']
    ],
    gratitude: [
      ['Dis à quelqu\'un ici ce que tu admires chez elle ou lui.', ''],
      ['Remercie une personne ici pour un moment précis.', ''],
      ['Dis à la personne à ta droite ce qu\'elle t\'apporte.', 'soiree amies famille'],
      ['Raconte un souvenir où quelqu\'un ici t\'a aidé·e.', ''],
      ['Dis une qualité que tu as vue chez quelqu\'un ici et qu\'il ou elle ne voit pas.', ''],
      ['Dis merci à quelqu\'un qui n\'est pas là ce soir, comme s\'il ou elle t\'entendait.', ''],
      ['Dis à l\'autre ce que tu aimes dans votre relation.', 'couple amies'],
      ['Dis à quelqu\'un ici une chose qui te fait sourire chez lui ou elle.', ''],
      ['Fais un compliment à toi-même, à voix haute.', ''],
      ['Dis à quelqu\'un ici ce qu\'il ou elle t\'a appris.', '']
    ]
  };
  var JEUX = {
    rapprochent: { titre: 'Les cartes qui rapprochent', sur: 'Une question, et on se découvre' },
    dire: { titre: 'Dis-le autrement', sur: 'Transforme une phrase qui blesse' },
    gratitude: { titre: 'Vérité ou gratitude', sur: 'Un « action ou vérité » tout doux' }
  };
  var MODES = { amies: 'Entre amies', couple: 'En couple', famille: 'En famille', soiree: 'En soirée' };
  var NIV = { leger: 'Léger', profond: 'Profond', famille: 'Ma famille' };

  var $ = function (id) { return document.getElementById(id); };
  var zone = $('jeu'); if (!zone) return;
  var etat = { jeu: null, mode: 'amies', niveau: 'leger', pile: [], i: 0, choix: null };
  function melanger(t) { t = t.slice(); for (var i = t.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = t[i]; t[i] = t[j]; t[j] = x; } return t; }
  function pour(liste) { return liste.filter(function (c) { return !c[1] || c[1].split(' ').indexOf(etat.mode) >= 0; }); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function ecranChoix() {
    zone.innerHTML = '';
    document.querySelectorAll('[data-jeu]').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
  }
  function lancer(jeu) {
    etat.jeu = jeu;
    document.querySelectorAll('[data-jeu]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-jeu') === jeu ? 'true' : 'false'); });
    reglages();
    zone.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function puces(nom, objet, actuel, couple) {
    return '<div class="j-puces" role="group" aria-label="' + nom + '">' + Object.keys(objet).map(function (k) {
      return '<button type="button" data-' + nom + '="' + k + '" aria-pressed="' + (k === actuel) + '">' + objet[k] + (couple && k === 'couple' ? ' <small>18 ans et +</small>' : '') + '</button>';
    }).join('') + '</div>';
  }
  function reglages() {
    var j = JEUX[etat.jeu];
    zone.innerHTML = '<div class="j-reglage"><p class="j-sur">' + j.sur + '</p><h2>' + j.titre + '</h2>' +
      '<p class="j-label">Vous jouez…</p>' + puces('mode', MODES, etat.mode, true) +
      (etat.jeu === 'rapprochent' ? '<p class="j-label">Niveau</p>' + puces('niveau', NIV, etat.niveau) : '') +
      '<button type="button" class="btn btn-plein j-go" data-go>On commence</button></div>';
  }
  function demarrer() {
    if (etat.jeu === 'rapprochent') etat.pile = melanger(pour(Q[etat.niveau]));
    else if (etat.jeu === 'dire') etat.pile = melanger(DIRE);
    else etat.pile = null;
    etat.i = 0; etat.choix = null;
    carte();
  }
  function barre() { return '<div class="j-barre"><button type="button" class="j-lien" data-reglages>Changer les réglages</button><span>' + MODES[etat.mode] + '</span></div>'; }
  function carte() {
    var h = '';
    if (etat.jeu === 'gratitude') {
      if (!etat.choix) {
        h = '<div class="j-carte j-vg"><p class="j-consigne">À toi de choisir</p><div class="j-deux"><button type="button" class="j-gros v" data-vg="verite">Vérité</button><button type="button" class="j-gros g" data-vg="gratitude">Gratitude</button></div><p class="j-petit">Puis passe le téléphone à la personne suivante.</p></div>';
      } else {
        var l = pour(VG[etat.choix]), c = l[Math.floor(Math.random() * l.length)];
        h = '<div class="j-carte tourne ' + (etat.choix === 'verite' ? 'c-v' : 'c-g') + '"><p class="j-type">' + (etat.choix === 'verite' ? 'Vérité' : 'Gratitude') + '</p><p class="j-texte">' + esc(c[0]) + '</p></div>' +
          '<div class="j-actions"><button type="button" class="btn btn-plein" data-suivant>Au suivant</button></div>';
      }
    } else {
      if (etat.i >= etat.pile.length) {
        h = '<div class="j-carte j-fin"><p class="j-texte">Vous avez fait le tour des cartes.</p><p class="j-petit">Changez de niveau ou de jeu, ou recommencez : les questions ne donnent jamais deux fois la même soirée.</p></div><div class="j-actions"><button type="button" class="btn btn-plein" data-go>Recommencer</button></div>';
      } else {
        var c2 = etat.pile[etat.i];
        if (etat.jeu === 'rapprochent') {
          h = '<div class="j-carte tourne n-' + etat.niveau + '"><p class="j-type">' + NIV[etat.niveau] + ' · ' + (etat.i + 1) + '/' + etat.pile.length + '</p><p class="j-texte">' + esc(c2[0]) + '</p><p class="j-petit">Réponds, puis passe le téléphone.</p></div>';
        } else {
          h = '<div class="j-carte tourne c-dire"><p class="j-type">Phrase qui blesse · ' + (etat.i + 1) + '/' + etat.pile.length + '</p><p class="j-texte j-barre-texte">« ' + esc(c2[0]) + ' »</p><p class="j-petit">Chacun·e la redit avec douceur. Le groupe vote pour la plus belle version.</p>' +
            '<details class="j-idee"><summary>Voir une idée</summary><p>« ' + esc(c2[1]) + ' »</p></details></div>';
        }
        h += '<div class="j-actions"><button type="button" class="btn btn-plein" data-suivant>Carte suivante</button></div>';
      }
    }
    zone.innerHTML = barre() + h;
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('button'); if (!t) return;
    if (t.hasAttribute('data-jeu')) lancer(t.getAttribute('data-jeu'));
    else if (t.hasAttribute('data-mode')) { etat.mode = t.getAttribute('data-mode'); reglages(); }
    else if (t.hasAttribute('data-niveau')) { etat.niveau = t.getAttribute('data-niveau'); reglages(); }
    else if (t.hasAttribute('data-go')) demarrer();
    else if (t.hasAttribute('data-reglages')) reglages();
    else if (t.hasAttribute('data-vg')) { etat.choix = t.getAttribute('data-vg'); carte(); }
    else if (t.hasAttribute('data-suivant')) { if (etat.jeu === 'gratitude') etat.choix = null; else etat.i++; carte(); }
  });
  ecranChoix();
})();
