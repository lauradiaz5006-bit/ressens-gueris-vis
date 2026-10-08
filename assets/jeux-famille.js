/* Genesolia — jeux en famille avec les enfants (page jeux-en-famille.html).
   Chaque jeu est aussi expliqué en texte dans la page : ce fichier ajoute seulement la version à jouer sur le téléphone. */
(function () {
  'use strict';
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function melanger(t) { t = t.slice(); for (var i = t.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = t[i]; t[i] = t[j]; t[j] = x; } return t; }

  /* ---------- 1. Le bâton de parole ---------- */
  var QB = [
    'Ce qui m\'a fait sourire aujourd\'hui.', 'Un moment où j\'ai été fièr·e de moi cette semaine.', 'Quelque chose qui m\'a embêté·e, et ce dont j\'aurais eu besoin.',
    'Ce que j\'aimerais qu\'on fasse ensemble ce week-end.', 'Une chose que j\'ai apprise cette semaine.', 'Quelqu\'un qui a été gentil avec moi.',
    'Ce qui me rend heureux ou heureuse à la maison.', 'Une chose que j\'aimerais changer à la maison.', 'Mon moment préféré de la journée.', 'Un merci que j\'ai envie de dire.'
  ];
  var b = document.getElementById('jf-baton');
  if (b) {
    var noms = [], tour = 0, q = '';
    function bEcran() {
      if (!noms.length) {
        b.innerHTML = '<div class="jf-carte"><p class="jf-label">Qui joue ?</p><p class="jf-petit">Écris les prénoms, séparés par une virgule. Tu peux aussi laisser vide.</p>' +
          '<input class="jf-champ" id="jf-noms" type="text" placeholder="Léa, Tom, Maman, Papa" autocomplete="off">' +
          '<button type="button" class="btn btn-plein" data-b="go">Commencer le tour</button></div>';
        return;
      }
      var n = noms[tour % noms.length];
      b.innerHTML = '<div class="jf-carte jf-baton-carte tourne"><svg class="jf-baton-svg" viewBox="0 0 220 40" aria-hidden="true"><rect x="8" y="14" width="204" height="12" rx="6" fill="#B98A55"/><circle cx="18" cy="20" r="11" fill="#E7A79E"/><circle cx="202" cy="20" r="11" fill="#6B2F5B"/><path d="M60 14v12M100 14v12M140 14v12" stroke="#FFF6EC" stroke-width="3"/></svg>' +
        '<p class="jf-label">Le bâton est à</p><p class="jf-grand">' + esc(n) + '</p><p class="jf-q">« ' + esc(q) + ' »</p>' +
        '<p class="jf-petit">Les autres écoutent sans couper. Quand tu as fini, passe le bâton.</p></div>' +
        '<div class="jf-actions"><button type="button" class="btn btn-plein" data-b="passe">Je passe le bâton</button><button type="button" class="j-lien" data-b="question">Autre question</button><button type="button" class="j-lien" data-b="noms">Changer les joueurs</button></div>';
    }
    b.addEventListener('click', function (e) {
      var t = e.target.closest('[data-b]'); if (!t) return;
      var a = t.getAttribute('data-b');
      if (a === 'go') {
        noms = (document.getElementById('jf-noms').value || '').split(',').map(function (x) { return x.trim(); }).filter(Boolean);
        if (!noms.length) noms = ['Joueur 1', 'Joueur 2', 'Joueur 3'];
        tour = 0; q = QB[Math.floor(Math.random() * QB.length)];
      } else if (a === 'passe') { tour++; if (tour % noms.length === 0) q = QB[Math.floor(Math.random() * QB.length)]; }
      else if (a === 'question') q = QB[Math.floor(Math.random() * QB.length)];
      else if (a === 'noms') noms = [];
      bEcran();
    });
    bEcran();
  }

  /* ---------- 2. La météo du cœur ---------- */
  var METEO = {
    soleil: { nom: 'Soleil', dit: 'Je me sens bien, joyeux ou joyeuse.', q: 'Qu\'est-ce qui a mis du soleil dans ta journée ?', parent: 'Partage sa joie : « Raconte-moi, j\'ai envie de savoir. »', c: '#F3C969' },
    nuage: { nom: 'Nuageux', dit: 'Je me sens un peu bof, entre les deux.', q: 'Il y a un petit nuage. Tu veux me dire d\'où il vient ?', parent: 'Pas besoin de régler : « D\'accord, merci de me le dire. »', c: '#B7B3C9' },
    pluie: { nom: 'Pluie', dit: 'Je me sens triste.', q: 'De quoi aurais-tu besoin, là, maintenant ?', parent: 'Un câlin, une présence : « Je suis là. Tu as le droit d\'être triste. »', c: '#8FA7C9' },
    orage: { nom: 'Orage', dit: 'Je suis en colère.', q: 'Qu\'est-ce qui t\'a mis en colère ? Qu\'est-ce qui était injuste ?', parent: 'Accueille sans juger : « Ta colère dit que quelque chose compte pour toi. »', c: '#6B5B8C' },
    brouillard: { nom: 'Brouillard', dit: 'Je ne sais pas trop ce que je ressens.', q: 'Si ton émotion avait une couleur, ce serait laquelle ?', parent: 'Laisse du temps : « On peut chercher ensemble, ou plus tard. »', c: '#C9C4BE' },
    arc: { nom: 'Arc-en-ciel', dit: 'Ça allait mal, et maintenant ça va mieux.', q: 'Qu\'est-ce qui t\'a aidé·e à aller mieux ?', parent: 'Souligne sa force : « Tu as trouvé ce qui t\'aide, c\'est précieux. »', c: '#E7A79E' }
  };
  var ICO = {
    soleil: '<circle cx="32" cy="32" r="12" fill="#F3C969"/><g stroke="#F3C969" stroke-width="4" stroke-linecap="round"><path d="M32 6v8M32 50v8M6 32h8M50 32h8M13 13l6 6M45 45l6 6M13 51l6-6M45 19l6-6"/></g>',
    nuage: '<path d="M18 46h28a10 10 0 0 0 0-20 14 14 0 0 0-27-2A11 11 0 0 0 18 46z" fill="#B7B3C9"/>',
    pluie: '<path d="M18 38h28a10 10 0 0 0 0-20 14 14 0 0 0-27-2A11 11 0 0 0 18 38z" fill="#8FA7C9"/><g stroke="#8FA7C9" stroke-width="4" stroke-linecap="round"><path d="M22 46l-3 8M34 46l-3 8M46 46l-3 8"/></g>',
    orage: '<path d="M18 36h28a10 10 0 0 0 0-20 14 14 0 0 0-27-2A11 11 0 0 0 18 36z" fill="#6B5B8C"/><path d="M34 38l-8 12h8l-4 10 12-15h-8l4-7z" fill="#F3C969"/>',
    brouillard: '<g stroke="#B5AFA8" stroke-width="5" stroke-linecap="round"><path d="M12 22h40M8 32h48M14 42h36M20 52h24"/></g>',
    arc: '<g fill="none" stroke-width="5"><path d="M10 48a22 22 0 0 1 44 0" stroke="#E7A79E"/><path d="M17 48a15 15 0 0 1 30 0" stroke="#F3C969"/><path d="M24 48a8 8 0 0 1 16 0" stroke="#8FA7C9"/></g>'
  };
  var m = document.getElementById('jf-meteo');
  if (m) {
    m.innerHTML = '<div class="jf-meteo-choix" role="group" aria-label="Choisis ta météo">' + Object.keys(METEO).map(function (k) {
      return '<button type="button" data-m="' + k + '" aria-pressed="false"><svg viewBox="0 0 64 64" aria-hidden="true">' + ICO[k] + '</svg><span>' + METEO[k].nom + '</span></button>';
    }).join('') + '</div><div id="jf-meteo-rep" aria-live="polite"></div>';
    m.addEventListener('click', function (e) {
      var t = e.target.closest('[data-m]'); if (!t) return;
      var k = t.getAttribute('data-m'), d = METEO[k];
      m.querySelectorAll('[data-m]').forEach(function (x) { x.setAttribute('aria-pressed', x === t ? 'true' : 'false'); });
      document.getElementById('jf-meteo-rep').innerHTML = '<div class="jf-carte tourne" style="border-top:6px solid ' + d.c + '"><p class="jf-grand">' + d.nom + '</p><p class="jf-q">« ' + d.dit + ' »</p>' +
        '<p class="jf-label">La question à poser</p><p>' + d.q + '</p><p class="jf-label">Pour le parent</p><p>' + d.parent + '</p></div>';
    });
  }

  /* ---------- 3. Le conseil de famille ---------- */
  var ETAPES = [
    ['Les mercis', 'Chacun·e dit un merci à quelqu\'un de la famille pour quelque chose de précis cette semaine.', '5 min'],
    ['Ce qui a bien marché', 'Une chose qui s\'est bien passée à la maison. On la garde.', '5 min'],
    ['Ce qui coince', 'Une chose qui a été difficile. On décrit, sans accuser : « Quand…, je me suis senti·e… »', '10 min'],
    ['On cherche ensemble', 'Chacun·e propose une idée, même les plus petits. On en choisit une à tester toute la semaine.', '5 min'],
    ['Le moment ensemble', 'On décide d\'un moment à partager cette semaine : un jeu, une balade, un repas préparé à plusieurs.', '5 min']
  ];
  var c = document.getElementById('jf-conseil');
  if (c) {
    var i = 0;
    function cEcran() {
      var e = ETAPES[i];
      c.innerHTML = '<div class="jf-etapes" aria-hidden="true">' + ETAPES.map(function (x, k) { return '<span class="' + (k <= i ? 'fait' : '') + '"></span>'; }).join('') + '</div>' +
        '<div class="jf-carte tourne"><p class="jf-label">Étape ' + (i + 1) + ' sur 5 · ' + e[2] + '</p><p class="jf-grand">' + e[0] + '</p><p>' + e[1] + '</p></div>' +
        '<div class="jf-actions">' + (i > 0 ? '<button type="button" class="j-lien" data-c="moins">Étape précédente</button>' : '') +
        (i < ETAPES.length - 1 ? '<button type="button" class="btn btn-plein" data-c="plus">Étape suivante</button>' : '<button type="button" class="btn btn-plein" data-c="fin">Conseil terminé</button>') + '</div>';
    }
    c.addEventListener('click', function (ev) {
      var t = ev.target.closest('[data-c]'); if (!t) return;
      var a = t.getAttribute('data-c');
      if (a === 'zero') i = 0; else if (a === 'plus') i++; else if (a === 'moins') i--; else { c.innerHTML = '<div class="jf-carte tourne"><p class="jf-grand">Bravo à toute la famille</p><p>Rendez-vous la semaine prochaine, même jour, même heure. Le plus important, c\'est de revenir.</p></div><div class="jf-actions"><button type="button" class="btn btn-trait" data-c="zero">Recommencer</button></div>'; return; }
      cEcran();
    });
    cEcran();
  }

  /* ---------- 4, 5, 6. Paquets de cartes ---------- */
  var PAQUETS = {
    soir: { titre: 'Questions du soir', ages: {
      petits: ['Qu\'est-ce qui t\'a fait rire aujourd\'hui ?', 'Avec qui as-tu joué à la récré ?', 'Si ta journée était un animal, ce serait lequel ?', 'Qu\'est-ce que tu as mangé de bon à la cantine ?', 'Qui a été gentil avec toi ?', 'Quelle a été la meilleure minute de ta journée ?', 'Qu\'est-ce que tu aimerais faire demain ?', 'Tu as aidé quelqu\'un aujourd\'hui ?', 'Raconte-moi un rêve que tu aimerais faire cette nuit.', 'Qu\'est-ce qui était difficile aujourd\'hui ?'],
      grands: ['Qu\'est-ce que tu as appris qui t\'a surpris·e ?', 'Si tu étais la maîtresse ou le prof demain, que changerais-tu ?', 'Quel moment de la journée tu aimerais revivre ?', 'Est-ce que quelqu\'un était seul à la récré ?', 'De quoi es-tu fièr·e aujourd\'hui ?', 'Qu\'est-ce qui t\'a énervé·e, et comment tu as fait ?', 'Avec qui aimerais-tu passer plus de temps ?', 'Qu\'est-ce que tu as envie de savoir faire ?', 'Une chose que tu n\'as pas osé dire aujourd\'hui ?', 'Note ta journée sur 10. Qu\'est-ce qui aurait donné un point de plus ?'],
      ados: ['Le moment le plus drôle de ta journée ?', 'Une chose qui t\'a fait réfléchir aujourd\'hui ?', 'Qu\'est-ce que les adultes ne comprennent pas sur ta génération ?', 'Une personne que tu admires en ce moment, et pourquoi ?', 'Qu\'est-ce qui te prend de l\'énergie en ce moment ?', 'Qu\'est-ce qui t\'en donne ?', 'Si tu pouvais changer une règle à la maison, laquelle ?', 'Une chanson qui résume ta semaine ?', 'Comment je peux t\'aider cette semaine ?', 'Quelque chose que tu as envie d\'essayer ?']
    } },
    compliments: { titre: 'Le pot à compliments', ages: { tous: [
      'Ce que j\'aime chez toi, c\'est…', 'Tu m\'as rendu heureux ou heureuse quand…', 'Tu es doué·e pour…', 'Merci d\'avoir…', 'J\'admire quand tu…', 'Avec toi, je me sens…', 'Un souvenir avec toi que j\'adore :', 'Tu me fais rire quand…', 'Je suis fièr·e de toi parce que…', 'Si tu étais un super-héros, ton pouvoir serait…', 'Une chose que tu fais mieux que tout le monde :', 'Ta plus belle qualité, c\'est…'
    ] } },
    raconte: { titre: 'Raconte-moi quand tu étais petit·e', ages: { tous: [
      'C\'était quoi, ton jeu préféré quand tu avais mon âge ?', 'Comment s\'appelait ton meilleur ami ou ta meilleure amie ?', 'Quelle bêtise as-tu faite que tes parents n\'ont jamais sue ?', 'Comment était ta chambre ?', 'Qu\'est-ce que tu voulais faire comme métier ?', 'Comment tes parents se sont rencontrés ?', 'Quel était ton plat préféré chez ta grand-mère ?', 'Quelle musique tu écoutais ?', 'Tu avais un animal ?', 'Quelle fête de famille tu aimais le plus ?', 'Qu\'est-ce qu\'il n\'y avait pas, quand tu étais petit·e, et qu\'on a maintenant ?', 'Qui, dans la famille, me ressemble le plus ?'
    ] } }
  };
  var AGES = { petits: '4-7 ans', grands: '8-12 ans', ados: 'Ados' };
  document.querySelectorAll('[data-paquet]').forEach(function (z) {
    var nom = z.getAttribute('data-paquet'), P = PAQUETS[nom], age = Object.keys(P.ages)[0], pile = [], k = 0;
    function tirer() { pile = melanger(P.ages[age]); k = 0; }
    function ecran() {
      var choixAge = Object.keys(P.ages).length > 1 ? '<div class="j-puces" role="group" aria-label="Âge">' + Object.keys(P.ages).map(function (a) { return '<button type="button" data-age="' + a + '" aria-pressed="' + (a === age) + '">' + AGES[a] + '</button>'; }).join('') + '</div>' : '';
      z.innerHTML = choixAge + '<div class="jf-carte tourne jf-' + nom + '"><p class="jf-label">' + P.titre + ' · ' + (k + 1) + '/' + pile.length + '</p><p class="jf-q">' + esc(pile[k]) + '</p></div>' +
        '<div class="jf-actions"><button type="button" class="btn btn-plein" data-suiv>Carte suivante</button></div>';
    }
    z.addEventListener('click', function (e) {
      var t = e.target.closest('button'); if (!t) return;
      if (t.hasAttribute('data-age')) { age = t.getAttribute('data-age'); tirer(); }
      else if (t.hasAttribute('data-suiv')) { k++; if (k >= pile.length) tirer(); }
      ecran();
    });
    tirer(); ecran();
  });
})();
