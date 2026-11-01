/* Genesolia — espace « Tes 20 ans » : outil « Je suis dans la situation… »,
   exercice des phrases transmises et questions du mini-arbre.
   Tout reste dans le navigateur (localStorage), aucun envoi. */
(function () {
  'use strict';

  /* ---------- Stockage local, toujours protégé ---------- */
  function lire(cle, defaut) {
    try {
      var v = localStorage.getItem(cle);
      return v ? JSON.parse(v) : defaut;
    } catch (e) { return defaut; }
  }
  function ecrire(cle, valeur) {
    try { localStorage.setItem(cle, JSON.stringify(valeur)); } catch (e) {}
  }
  function effacerCle(cle) {
    try { localStorage.removeItem(cle); } catch (e) {}
  }
  /* Échappe le texte et pose les espaces insécables de la typographie française */
  function esc(t) {
    return String(t).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    }).replace(/ ([:;?!»])/g, '\u00a0$1').replace(/« /g, '«\u00a0');
  }

  var ICONES = {
    fleche: '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    coche: '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    retour: '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    copier: '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="5" y="5" width="8.5" height="8.5" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M10.5 3.2V3a1.5 1.5 0 0 0-1.5-1.5H3.5A1.5 1.5 0 0 0 2 3v5.5A1.5 1.5 0 0 0 3.5 10h.3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>'
  };

  /* ---------- Copier : presse-papiers, avec repli ---------- */
  function copierTexte(texte) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(texte).catch(function () { return repli(texte); });
    }
    return repli(texte);
  }
  function repli(texte) {
    return new Promise(function (ok, ko) {
      var zone = document.createElement('textarea');
      zone.value = texte;
      zone.setAttribute('readonly', '');
      zone.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0';
      document.body.appendChild(zone);
      zone.select();
      try { zone.setSelectionRange(0, texte.length); } catch (e) {}
      var reussi = false;
      try { reussi = document.execCommand('copy'); } catch (e) {}
      zone.remove();
      reussi ? ok() : ko();
    });
  }
  function brancherCopie(racine) {
    racine.querySelectorAll('[data-copier]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cible = document.getElementById(btn.getAttribute('data-copier'));
        var texte = cible ? (cible.getAttribute('data-texte') || cible.textContent).replace(/\u00a0/g, ' ').trim() : '';
        var libelle = btn.querySelector('span');
        copierTexte(texte).then(function () {
          btn.classList.add('ok');
          libelle.textContent = 'Copié';
        }, function () {
          libelle.textContent = 'Sélectionne le texte pour le copier';
          if (cible && window.getSelection) {
            var r = document.createRange(); r.selectNodeContents(cible);
            var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
          }
        });
        clearTimeout(btn._minuteur);
        btn._minuteur = setTimeout(function () {
          btn.classList.remove('ok');
          libelle.textContent = btn.getAttribute('data-libelle') || 'Copier';
        }, 2400);
      });
    });
  }
  function boutonCopier(id, libelle) {
    libelle = libelle || 'Copier';
    return '<button class="copier" type="button" data-copier="' + id + '" data-libelle="' + esc(libelle) + '">' +
      ICONES.copier + '<span aria-live="polite">' + esc(libelle) + '</span></button>';
  }

  /* ---------- Les liens « Aller plus loin » ---------- */
  var LIENS = {
    methode: ['methode.html', 'La méthode des deux cycles', 'Comprendre la racine et le cœur, et où tu en es.'],
    arbre: ['arbre-de-vie.html', "Le test de l'arbre de vie", 'Cinq minutes pour voir où ça se rejoue aujourd\'hui.'],
    geno: ['genosociogramme.html', 'Ton arbre familial en ligne', 'Dessiner ta famille et repérer ce qui revient.'],
    amour: ['schemas-repetitifs-en-amour.html', 'Ce qui se rejoue en amour', 'Pourquoi on retombe sur les mêmes histoires.'],
    conflit: ['#conflit', 'Le guide pour régler un conflit', 'Cinq étapes, et les mots pour chacune.'],
    famille: ['questions-a-poser-a-sa-famille.html', 'Les questions à poser à ta famille', 'Pour oser demander, sans brusquer personne.']
  };

  var AVANT = [
    "Qu'est-ce que j'espère qu'il ou elle me réponde ?",
    'Est-ce que je l\'enverrais pareil demain matin ?',
    "Qu'est-ce que je ressens, là, juste avant d'écrire ?"
  ];

  /* ---------- Les situations du premier lot : elles vivent dans assets/vie-en-reel/situations.js (une seule source avec « Ta vie en réel ») ---------- */
  var SITUATIONS = (window.GENESOLIA_SITUATIONS || []).filter(function (s) { return s.jeunes; });

  var ORDRE = ['silence','pas-ensemble','meme-genre','conflit-couple','conflit-famille','dire-non','amies-eloignent','etudes','partir','parents-separes','ma-mere','retard','ma-place','sais-pas','argent','seule','semblant','honte-origines'];
  SITUATIONS.sort(function (a, b) { return ORDRE.indexOf(a.id) - ORDRE.indexOf(b.id); });

  /* ---------- L'outil (seulement si la page l'affiche) ---------- */
  if (document.getElementById('grille-vt')) (function () {
  /* ---------- L'outil ---------- */
  var CLE_VUES = 'vingt-ans-vues';
  var grille = document.getElementById('grille-vt');
  var ecranGrille = document.getElementById('ecran-grille');
  var ecranReponse = document.getElementById('ecran-reponse');
  var outil = document.getElementById('outil');
  var vues = lire(CLE_VUES, []);
  if (!Array.isArray(vues)) vues = [];
  var derniere = null;

  var filtre = 'tout';
  function dessinerGrille() {
    grille.innerHTML = SITUATIONS.filter(function (s) { return filtre === 'tout' || s.groupe === filtre; }).map(function (s) {
      var vue = vues.indexOf(s.id) !== -1;
      return '<li><button class="carte-vt' + (vue ? ' vue' : '') + '" type="button" data-id="' + s.id + '">' +
        '<span class="theme">' + esc(s.theme) + '</span>' +
        '<span class="phrase">« ' + esc(s.titre) + ' »</span>' +
        '<span class="fleche"><span class="va">' + ICONES.fleche + '</span><span class="coche">' + ICONES.coche + '</span></span>' +
        (vue ? '<span class="visuel-cache"> (déjà consultée)</span>' : '') +
        '</button></li>';
    }).join('');
  }

  function lienHTML(cle) {
    var l = LIENS[cle];
    return '<a href="' + l[0] + '"><strong>' + esc(l[1]) + '</strong><span>' + esc(l[2]) + '</span>' + ICONES.fleche + '</a>';
  }

  function nomCycle(c) { return c === 'racine' ? 'Cycle de la racine' : 'Cycle du cœur'; }

  function afficher(id) {
    var s = SITUATIONS.filter(function (x) { return x.id === id; })[0];
    if (!s) return;
    derniere = id;
    if (vues.indexOf(id) === -1) { vues.push(id); ecrire(CLE_VUES, vues); }

    ecranReponse.innerHTML =
      '<div class="apparait">' +
        '<div class="rep-haut">' +
          '<button class="retour" type="button" data-retour>' + ICONES.retour + 'Choisir une autre situation</button>' +
        '</div>' +
        '<span class="cycle-tag ' + s.cycle + '">' + nomCycle(s.cycle) + '</span>' +
        '<h2 class="rep-titre" id="rep-titre" tabindex="-1" style="margin-top:.8rem">« ' + esc(s.titre) + ' »</h2>' +
        '<div class="rep-bloc"><h3>Ce qui se joue</h3><p>' + esc(s.joue) + '</p></div>' +
        '<div class="rep-bloc question"><h3>La question à te poser</h3><p>' + esc(s.question) + '</p></div>' +
        '<div class="rep-bloc geste"><h3>Ce que tu peux faire aujourd\'hui</h3><p>' + esc(s.geste) + '</p><span class="duree">Moins de 15 minutes</span></div>' +
        '<div class="rep-bloc possible"><h3>Ce qui devient possible</h3><p>' + esc(s.possible) + '</p></div>' +
        '<div class="carte-partage" id="carte-partage"><h3>Ta carte à partager</h3><p class="petit">Cette phrase, rien que pour toi, ou pour quelqu\'un qui en a besoin.</p><div class="carte-apercu" aria-hidden="true"></div><div class="carte-actions"><button class="btn btn-plein" type="button" data-carte="partager">Partager ma carte</button><button class="btn btn-trait" type="button" data-carte="telecharger" data-compte="ta carte">Télécharger l\'image</button></div><p class="petit carte-statut" aria-live="polite"></p></div>' +
        (s.avant
          ? '<div class="avant"><h3>Avant d\'envoyer ce message</h3><ol>' +
              AVANT.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') +
            '</ol><p class="alerte">Si cette personne te fait peur, te surveille ou te menace, ce n\'est pas un schéma à comprendre : protège-toi et parles-en. En France, le <a href="tel:3919">3919</a> (gratuit, anonyme) ; au Québec, SOS violence conjugale au <a href="tel:18003639010">1 800 363-9010</a>.</p></div>'
          : '') +
        '<div class="rep-bloc"><h3>Les mots pour le dire</h3><p class="a-copier" id="mots-' + s.id + '">' + esc(s.mots) + '</p>' + boutonCopier('mots-' + s.id) + '</div>' +
        '<div class="rep-bloc"><h3>Et dans ta famille ?</h3><p class="a-copier" id="famille-' + s.id + '">' + esc(s.famille) + '</p>' + boutonCopier('famille-' + s.id) +
          '<p class="petit">À envoyer à ta mère, ton père ou ta grand-mère, en changeant les mots si besoin. Seulement si tu te sens en sécurité pour le faire.</p></div>' +
        '<div class="plus-loin"><h3>Aller plus loin</h3>' + s.liens.map(lienHTML).join('') + '</div>' +
        '<div class="rep-bas"><button class="btn btn-trait" type="button" data-retour>Choisir une autre situation</button></div>' +
      '</div>';

    ecranGrille.hidden = true;
    ecranReponse.hidden = false;
    brancherCopie(ecranReponse);
    preparerCarte(s);
    ecranReponse.querySelectorAll('[data-retour]').forEach(function (b) { b.addEventListener('click', retour); });
    outil.scrollIntoView({ block: 'start' });
    var titre = document.getElementById('rep-titre');
    titre.focus({ preventScroll: true });
  }

  function preparerCarte(s) {
    var zone = document.getElementById('carte-partage');
    if (!zone || !window.GenesoliaCarte) { if (zone) zone.hidden = true; return; }
    var nom = 'genesolia-' + s.id + '.png', canvasPret = null;
    var statut = zone.querySelector('.carte-statut');
    window.GenesoliaCarte.dessiner({ phrase: s.possible, sur: 'Ce qui devient possible', style: s.cycle === 'racine' ? 'champagne' : 'rose' }).then(function (c) {
      canvasPret = c;
      var img = new Image(); img.src = c.toDataURL('image/png'); img.alt = '';
      zone.querySelector('.carte-apercu').appendChild(img);
    });
    zone.addEventListener('click', function (e) {
      var b = e.target.closest('[data-carte]');
      if (!b || !canvasPret) return;
      if (b.getAttribute('data-carte') === 'partager') {
        window.GenesoliaCarte.partager(canvasPret, nom, 'Trouvé sur genesolia.fr').then(function (r) {
          statut.textContent = r === 'telechargement' ? 'Ton téléphone ne permet pas le partage direct : l\'image a été téléchargée.' : r === 'partage' ? 'Merci de faire circuler la douceur.' : '';
        });
      } else {
        window.GenesoliaCarte.telecharger(canvasPret, nom).then(function () { statut.textContent = 'Image téléchargée.'; });
      }
    });
  }

  function retour() {
    ecranReponse.hidden = true;
    ecranReponse.innerHTML = '';
    ecranGrille.hidden = false;
    dessinerGrille();
    var carte = grille.querySelector('[data-id="' + derniere + '"]');
    if (!carte && filtres) { filtres.querySelector('[data-filtre="tout"]').click(); carte = grille.querySelector('[data-id="' + derniere + '"]'); }
    if (carte) {
      carte.scrollIntoView({ block: 'center' });
      carte.focus({ preventScroll: true });
    }
  }

  var filtres = document.getElementById('filtres-vt');
  if (filtres) filtres.addEventListener('click', function (e) {
    var b = e.target.closest('[data-filtre]');
    if (!b) return;
    filtre = b.getAttribute('data-filtre');
    filtres.querySelectorAll('[data-filtre]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    dessinerGrille();
  });

  grille.addEventListener('click', function (e) {
    var b = e.target.closest('.carte-vt');
    if (b) afficher(b.getAttribute('data-id'));
  });
  dessinerGrille();
  })();

  /* ---------- Les phrases transmises ---------- */
  var PHRASES = [
    'Il ne faut compter que sur soi.',
    "L'argent ne fait pas le bonheur.",
    'Les hommes partent toujours.',
    'Sois sage et ne fais pas de vagues.',
    'Il faut souffrir pour réussir.',
    'Une fille bien ne se fait pas remarquer.',
    "On ne parle pas d'argent.",
    'Le travail d\'abord, le reste après.',
    'Ce qui se passe à la maison reste à la maison.',
    "Il ne faut pas trop en demander."
  ];
  var CLE_PHRASES = 'vingt-ans-phrases';
  var etat = lire(CLE_PHRASES, null);
  if (!etat || typeof etat !== 'object') etat = {};
  if (!etat.choix || typeof etat.choix !== 'object') etat.choix = {};
  if (typeof etat.nouvelle !== 'string') etat.nouvelle = '';

  var liste = document.getElementById('phrases-vt');
  var recap = document.getElementById('recap');
  var champ = document.getElementById('ma-phrase');
  var statut = document.getElementById('phrases-statut');

  function choixDe(i) { return etat.choix[i] || {}; }
  function sauver() { ecrire(CLE_PHRASES, etat); }

  function dessinerPhrases() {
    liste.innerHTML = PHRASES.map(function (p, i) {
      var c = choixDe(i);
      var cls = c.sort === 'garde' ? ' garde' : c.sort === 'laisse' ? ' laisse' : '';
      return '<li class="phrase-vt' + cls + '" data-i="' + i + '">' +
        '<p class="texte" id="ph-' + i + '">« ' + esc(p) + ' »</p>' +
        '<div class="choix" role="group" aria-labelledby="ph-' + i + '">' +
          '<button type="button" class="b-entendue" data-action="entendue" aria-pressed="' + (c.entendue ? 'true' : 'false') + '">Je l\'ai entendue</button>' +
          '<button type="button" class="b-garde" data-action="garde" aria-pressed="' + (c.sort === 'garde' ? 'true' : 'false') + '">Je la garde</button>' +
          '<button type="button" class="b-laisse" data-action="laisse" aria-pressed="' + (c.sort === 'laisse' ? 'true' : 'false') + '">Je la laisse</button>' +
        '</div></li>';
    }).join('');
  }

  function dessinerRecap() {
    var garde = [], laisse = [], entendues = 0;
    PHRASES.forEach(function (p, i) {
      var c = choixDe(i);
      if (c.entendue) entendues++;
      if (c.sort === 'garde') garde.push(p);
      if (c.sort === 'laisse') laisse.push(p);
    });
    function lst(t, vide) {
      return t.length ? '<ul>' + t.map(function (p) { return '<li>« ' + esc(p) + ' »</li>'; }).join('') + '</ul>' : '<p class="vide">' + vide + '</p>';
    }
    recap.innerHTML =
      '<p class="recap-compte">' + (entendues
        ? 'Tu as reconnu ' + entendues + (entendues > 1 ? ' phrases' : ' phrase') + ' sur ' + PHRASES.length + '.'
        : 'Ton récapitulatif se remplit au fil de tes choix.') + '</p>' +
      '<div class="r-garde"><h3>Ce que tu choisis de garder</h3>' + lst(garde, 'Rien pour l\'instant.') + '</div>' +
      '<div class="r-laisse"><h3>Ce que tu choisis de laisser</h3>' + lst(laisse, 'Rien pour l\'instant.') + '</div>';
  }

  liste.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-action]');
    if (!b) return;
    var li = b.closest('.phrase-vt');
    var i = li.getAttribute('data-i');
    var c = etat.choix[i] || {};
    var a = b.getAttribute('data-action');
    if (a === 'entendue') c.entendue = !c.entendue;
    else c.sort = c.sort === a ? null : a;
    etat.choix[i] = c;
    sauver();
    /* Mise à jour sur place, pour garder le focus sur le bouton */
    li.className = 'phrase-vt' + (c.sort === 'garde' ? ' garde' : c.sort === 'laisse' ? ' laisse' : '');
    li.querySelector('[data-action="entendue"]').setAttribute('aria-pressed', c.entendue ? 'true' : 'false');
    li.querySelector('[data-action="garde"]').setAttribute('aria-pressed', c.sort === 'garde' ? 'true' : 'false');
    li.querySelector('[data-action="laisse"]').setAttribute('aria-pressed', c.sort === 'laisse' ? 'true' : 'false');
    dessinerRecap();
  });

  champ.value = etat.nouvelle;
  champ.addEventListener('input', function () { etat.nouvelle = champ.value; sauver(); });

  document.getElementById('effacer').addEventListener('click', function () {
    etat = { choix: {}, nouvelle: '' };
    effacerCle(CLE_PHRASES);
    champ.value = '';
    dessinerPhrases();
    dessinerRecap();
    statut.textContent = 'Tout est effacé.';
    setTimeout(function () { statut.textContent = ''; }, 3000);
  });

  dessinerPhrases();
  dessinerRecap();

  /* ---------- Les trois questions du mini-arbre ---------- */
  var QS = [
    ['Tu peux me dire les prénoms de tes parents et de tes grands-parents, et d\'où ils venaient ?', 'Pour placer les noms sur ton arbre.'],
    ["Qu'est-ce que tu faisais à mon âge ? Tu vivais où, avec qui ?", 'Pour comparer vos vies au même âge.'],
    ["Quelle histoire de la famille tu aimerais que je connaisse ?", 'Pour laisser la personne choisir ce qu\'elle raconte.']
  ];
  var ol = document.getElementById('qs');
  ol.innerHTML = QS.map(function (q, i) {
    return '<li><p class="q" id="mq-' + i + '">« ' + esc(q[0]) + ' »</p><p class="pour">' + esc(q[1]) + '</p>' + boutonCopier('mq-' + i, 'Copier la question') + '</li>';
  }).join('');
  /* On copie la question sans les guillemets */
  ol.querySelectorAll('.q').forEach(function (p, i) { p.setAttribute('data-texte', QS[i][0]); });
  brancherCopie(ol);
})();

/* ---------- Le guide « Régler un conflit » ---------- */
(function () {
  var zone = document.getElementById('conflit-etapes');
  var choix = document.getElementById('conflit-avec');
  if (!zone || !choix) return;
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var AVEC = {
    couple: {
      calme: "J'ai besoin qu'on en reparle, mais pas à chaud. Ce soir, ça te va ?",
      je: "Quand tu as annulé à la dernière minute, je me suis senti·e mis·e de côté. J'ai besoin de compter pour toi.",
      ecoute: "Si je comprends bien, toi tu t'es senti·e sous pression. C'est ça ?",
      accord: "La prochaine fois que l'un de nous ne peut pas, on se prévient avant. Ça te va ?"
    },
    parent: {
      calme: "Je n'ai pas envie qu'on se dispute. On peut en reparler demain, au calme ?",
      je: "Quand tu critiques mes choix devant tout le monde, je me sens petit·e, et j'ai envie de me fermer.",
      ecoute: "Si je comprends bien, tu as peur que je me trompe et que je galère. C'est ça ?",
      accord: "Tu peux me dire tes inquiétudes, et moi je te tiens au courant de mes projets. On essaie comme ça ?"
    },
    amie: {
      calme: "Je tiens à toi, et je n'ai pas aimé comment ça s'est passé. On s'appelle demain ?",
      je: "Quand j'ai vu que vous étiez sorties sans moi, je me suis senti·e laissé·e de côté.",
      ecoute: "Si je comprends bien, tu pensais que je n'étais pas dispo. C'est ça ?",
      accord: "La prochaine fois, on se pose la question franchement, même si l'une de nous dit non."
    },
    fratrie: {
      calme: "On s'est énervés tous les deux. On en reparle quand on sera calmés ?",
      je: "Quand tu prends mes affaires sans demander, j'ai l'impression que rien n'est à moi.",
      ecoute: "Si je comprends bien, tu as l'impression que les parents te passent moins de choses qu'à moi. C'est ça ?",
      accord: "On se demande avant de prendre quelque chose à l'autre, et on arrête de se comparer devant les parents."
    }
  };
  function copier(btn) {
    var p = document.getElementById(btn.getAttribute('data-cible'));
    var txt = p ? p.textContent.replace(/ | /g, ' ') : '';
    var fin = function () { btn.classList.add('ok'); btn.lastChild.textContent = 'Copié'; setTimeout(function () { btn.classList.remove('ok'); btn.lastChild.textContent = 'Copier'; }, 1800); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(txt).then(fin, function () { repli(txt); fin(); });
    else { repli(txt); fin(); }
  }
  function repli(txt) {
    var ta = document.createElement('textarea'); ta.value = txt; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) {} ta.remove();
  }
  function phrase(id, txt) {
    return '<p class="a-copier" id="' + id + '">' + esc(txt) + '</p><button class="copier" type="button" data-cible="' + id + '"><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="5" y="5" width="8" height="9" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M3 11V4a2 2 0 0 1 2-2h5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg><span>Copier</span></button>';
  }
  function dessiner(qui) {
    var d = AVEC[qui];
    zone.innerHTML =
      '<li><h3>Laisse retomber la température</h3><p>Ne règle rien à chaud, ni par un long message. Attends quelques heures et propose un moment pour en parler, de vive voix si possible.</p>' + phrase('c-calme', d.calme) + '</li>' +
      '<li><h3>Trouve ce qui t\'a vraiment touché·e</h3><p>Sépare ce qui s\'est passé de ce que ça a réveillé en toi. Est-ce que ça touche ta place et ta sécurité (la racine) ? Ou le fait de te sentir aimé·e et compris·e (le cœur) ? Souvent, c\'est là que se trouve le vrai sujet.</p></li>' +
      '<li><h3>Parle en « je »</h3><p>Dis ce que tu as ressenti plutôt que ce que l\'autre a fait de mal. Un « je me suis senti·e » s\'entend beaucoup mieux qu\'un « tu ne penses qu\'à toi ».</p>' + phrase('c-je', d.je) + '</li>' +
      '<li><h3>Écoute pour comprendre</h3><p>Laisse l\'autre parler jusqu\'au bout, sans préparer ta réponse. Puis redis avec tes mots ce que tu as compris. C\'est souvent là que le malentendu se dénoue.</p>' + phrase('c-ecoute', d.ecoute) + '</li>' +
      '<li><h3>Cherchez un petit accord</h3><p>Pas besoin de tout régler d\'un coup. Mettez-vous d\'accord sur une seule chose pour la prochaine fois, et revoyez-la ensemble dans quelques semaines.</p>' + phrase('c-accord', d.accord) + '</li>';
    zone.querySelectorAll('.copier').forEach(function (b) { b.addEventListener('click', function () { copier(b); }); });
  }
  choix.addEventListener('click', function (e) {
    var b = e.target.closest('[data-avec]');
    if (!b) return;
    choix.querySelectorAll('[data-avec]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    dessiner(b.getAttribute('data-avec'));
  });
  dessiner('couple');
})();
