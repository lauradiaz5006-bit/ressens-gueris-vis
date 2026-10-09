/* Genesolia · Le carnet du mois, version interactive
   - Contenu : window.GENESOLIA_CARNET (assets/carnets/AAAA-MM.js).
   - Ouverture et clôture du mois : « Ma météo intérieure » (échelles, objectif bien formulé, projection, ancrage),
     enregistrée dans Mon chemin (table resultats, outil « meteo ») pour comparer mois après mois.
   - Réponses : enregistrées dans l'espace (table carnets) si la personne est connectée,
     sinon dans le navigateur jusqu'à sa fermeture.
   - « Imprimer mon carnet rempli » : toutes les pages, avec les réponses. */
(function () {
  'use strict';
  var C = window.GENESOLIA_CARNET; if (!C) return;
  var SB_URL = 'https://qsvzzkjtjsznfntahvvh.supabase.co', SB_KEY = 'sb_publishable_6iEVxXmtB_u1hJ6mPS9fNg_CJhLjYkg';
  var CLE_LOCALE = 'genesolia-carnet-' + C.mois;
  var sb = null, user = null, D = { v: {} }, minuteur = null;
  try { sb = window.supabase.createClient(SB_URL, SB_KEY); } catch (e) {}
  var racine = document.getElementById('carnet');

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function md(t) {
    return esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\[([^\]]+)\]\(([a-z0-9\-]+\.html(?:#[a-z\-]+)?)\)/g, '<a href="$2">$1</a>');
  }
  function paras(l) { return (l || []).map(function (x) { return '<p>' + md(x) + '</p>'; }).join(''); }

  /* ───── Champs ───── */
  function zone(k, q, opts) {
    opts = opts || {};
    return '<label class="mc-champ"><span class="mc-q">' + esc(q) + '</span>' +
      (opts.court ? '<input type="text" data-k="' + k + '"' + (opts.ph ? ' placeholder="' + esc(opts.ph) + '"' : '') + '>'
                  : '<textarea data-k="' + k + '" rows="' + (opts.lignes || 3) + '"' + (opts.ph ? ' placeholder="' + esc(opts.ph) + '"' : '') + '></textarea>') +
      (opts.aide ? '<small class="mc-aide" data-aide="' + k + '">' + esc(opts.aide) + '</small>' : '') + '</label>';
  }
  function curseur(k, q, bas, haut) {
    return '<div class="mc-curseur"><span class="mc-q">' + esc(q) + '</span><div class="mc-ligne"><span class="mc-min">' + esc(bas || '0') + '</span>' +
      '<input type="range" min="0" max="10" step="1" value="5" data-k="' + k + '" aria-label="' + esc(q) + '"><span class="mc-max">' + esc(haut || '10') + '</span><b class="mc-val" data-val="' + k + '">–</b></div></div>';
  }
  function choix(k, q, options, multiple) {
    return '<fieldset class="mc-choix"><legend class="mc-q">' + esc(q) + '</legend>' + options.map(function (o, i) {
      return '<label><input type="' + (multiple ? 'checkbox' : 'radio') + '" name="' + k + '" value="' + esc(o) + '" data-k="' + k + (multiple ? '-' + i : '') + '"' + (multiple ? '' : ' data-radio') + '><span>' + esc(o) + '</span></label>';
    }).join('') + '</fieldset>';
  }

  /* ───── Ma météo intérieure ───── */
  var ECHELLES = [['energie', 'Mon énergie'], ['humeur', 'Mon humeur'], ['confiance', 'Ma confiance en moi'], ['serenite', 'Ma sérénité'], ['liens', 'Je me sens entouré·e'], ['elan', 'J’avance dans ma vie']];
  var METEOS = ['Grand soleil', 'Éclaircies', 'Nuageux', 'Brouillard', 'Pluie', 'Orage', 'Arc-en-ciel'];
  function blocEchelles(prefixe) {
    return '<div class="mc-echelles">' + ECHELLES.map(function (e) { return curseur(prefixe + '-' + e[0], e[1], 'au plus bas', 'au plus haut'); }).join('') + '</div>' +
      choix(prefixe + '-meteo', 'Si mon état intérieur était une météo, ce serait…', METEOS) +
      zone(prefixe + '-mot', 'En un mot, je me sens…', { court: true });
  }

  var PAGES = [];
  PAGES.push({ id: 'ouverture', nom: 'Ma météo du début', html: function () {
    return '<p class="mc-sur">Pour commencer le mois · 10 minutes</p><h2>Ma météo du début de mois</h2>' +
      '<p class="mc-intro">Avant d’ouvrir le thème, prends le temps de te poser. Ces questions viennent de l’autocoaching et de la PNL : elles t’aident à savoir où tu en es, à donner une direction claire à ton mois, et à mesurer ensuite le chemin parcouru. Il n’y a pas de bonne réponse, seulement la tienne, aujourd’hui.</p>' +
      '<section class="mc-etape"><h3><span>1</span> Là, maintenant, comment je me sens ?</h3><p class="mc-consigne">Place chaque curseur sans réfléchir longtemps : la première réponse est souvent la plus juste.</p>' + blocEchelles('md') + '</section>' +
      '<section class="mc-etape"><h3><span>2</span> Mon objectif du mois, bien formulé</h3><p class="mc-consigne">Un objectif clair met ton énergie en mouvement. On le formule en positif (ce que tu veux, pas ce que tu ne veux plus), il dépend de toi, et tu sais à quoi tu reconnaîtras qu’il est atteint.</p>' +
        zone('obj-quoi', 'Ce mois-ci, je veux…', { court: true, ph: 'Par exemple : dire ce dont j’ai besoin au moment où je le ressens', aide: 'Formule ce que tu veux à la place de ce que tu ne veux plus.' }) +
        choix('obj-depend', 'Est-ce que ça dépend de moi ?', ['Oui, entièrement', 'En partie', 'Pas vraiment']) +
        zone('obj-part', 'La part qui dépend de moi, c’est…', { court: true }) +
        zone('obj-contexte', 'Où, quand, avec qui ?', { court: true, ph: 'Au travail, avec ma sœur, le soir…' }) +
        '<div class="mc-trois"><p class="mc-q">Comment je saurai que je l’ai atteint ?</p>' + zone('obj-voir', 'Ce que je verrai', { lignes: 2 }) + zone('obj-entendre', 'Ce que j’entendrai (ou me dirai)', { lignes: 2 }) + zone('obj-ressentir', 'Ce que je ressentirai', { lignes: 2 }) + '</div>' +
        zone('obj-ecologie', 'Qu’est-ce que ça va changer pour moi et mes proches ? Y a-t-il quelque chose que je risque de perdre ?', { lignes: 2 }) +
        zone('obj-ressources', 'Mes ressources : ce que j’ai déjà, qui peut m’aider, une fois où j’ai réussi quelque chose de semblable', { lignes: 3 }) +
        zone('obj-pas', 'Mon tout premier pas, dans les 48 heures', { court: true }) +
        curseur('obj-croyance', 'À quel point je crois pouvoir y arriver', 'pas du tout', 'complètement') +
        zone('obj-un-point', 'Qu’est-ce qui me ferait gagner un point de plus ?', { court: true }) +
      '</section>' +
      '<section class="mc-etape"><h3><span>3</span> Me projeter</h3><p class="mc-consigne">Ferme les yeux quelques secondes et imagine-toi à la fin du mois, ton objectif atteint. Où es-tu ? Qu’est-ce que tu vois, qu’est-ce que tu entends, comment te sens-tu dans ton corps ? Puis écris.</p>' +
        zone('proj-mois', 'À la fin du mois, je me vois…', { lignes: 4 }) +
        zone('proj-an', 'Ma lettre de dans un an : écris-toi, comme si tu étais déjà en ' + C.nomMois.replace(/\d+/, function (a) { return +a + 1; }) + ', à la personne que tu es aujourd’hui', { lignes: 7, ph: 'À moi d’aujourd’hui…' }) +
        '<p class="mc-note">Ta lettre est gardée dans ton espace. Dans un an, elle t’y attendra.</p>' +
      '</section>' +
      '<section class="mc-etape"><h3><span>4</span> Mon ancrage ressource</h3><p class="mc-consigne">Repense à un moment où tu t’es senti·e fort·e, calme ou fier·e de toi. Revis-le : ce que tu voyais, ce que tu entendais, ce que tu ressentais. Quand la sensation est au plus fort, presse doucement ton pouce contre ton index pendant quelques secondes. Refais-le trois fois. Ce geste devient ton ancre : tu pourras la retrouver quand ta boucle démarre.</p>' +
        zone('ancre-souvenir', 'Mon moment ressource', { lignes: 2 }) + zone('ancre-mot', 'Le mot qui le résume', { court: true }) +
      '</section>' +
      '<section class="mc-etape"><h3><span>5</span> Ma phrase du mois</h3>' + zone('phrase', 'La phrase que je veux me redire tout le mois', { court: true, ph: C.citation }) + '</section>' +
      '<div class="mc-actions"><button type="button" class="btn btn-plein" data-meteo="debut">Enregistrer ma météo du début</button><p class="mc-retour" data-retour="debut" aria-live="polite"></p></div>';
  } });

  PAGES.push({ id: 'theme', nom: 'Le thème', html: function () {
    return '<p class="mc-sur">Le thème du mois</p><h2>' + esc(C.theme.titre) + '</h2>' + paras(C.theme.texte) + '<h3>' + esc(C.theme.sousTitre) + '</h3>' + paras(C.theme.texte2) + '<blockquote class="mc-citation">' + esc(C.citation) + '</blockquote>';
  } });

  PAGES.push({ id: 'comprendre', nom: 'Comprendre', html: function () {
    var K = C.comprendre;
    return '<p class="mc-sur">Comprendre</p><h2>' + esc(K.titre) + '</h2>' + paras(K.texte) + choix(K.choix.k, K.choix.q, K.choix.options) +
      '<div class="mc-encadre"><b>Dans ton arbre, regarde</b>' + K.regarder.map(function (r) { return zone(r[0], r[1], { lignes: 2 }); }).join('') + '</div>' +
      '<div class="mc-outils">' + K.outils.map(function (o) { return '<a class="mc-outil" href="' + o[0] + '" target="_blank" rel="noopener"><b>' + esc(o[1]) + '</b><span>' + esc(o[2]) + '</span></a>'; }).join('') + '</div>';
  } });

  PAGES.push({ id: 'exercices', nom: 'Les exercices', html: function () {
    return C.exercices.map(function (ex, i) {
      var corps = '';
      if (ex.type === 'tableau') {
        corps = '<div class="mc-tableau">' + Array.apply(null, { length: ex.rangs }).map(function (_, r) {
          return '<div class="mc-rang"><span class="mc-num">' + (r + 1) + '</span>' + ex.colonnes.map(function (c, j) { return zone(ex.k + '-' + r + '-' + j, c, { lignes: 2 }); }).join('') + '</div>';
        }).join('') + '</div>' + (ex.apres ? zone(ex.apres.k, ex.apres.q, { lignes: 2 }) : '');
      } else if (ex.type === 'blocs') {
        corps = Array.apply(null, { length: ex.nb }).map(function (_, b) { return '<div class="mc-bloc">' + ex.champs.map(function (c, j) { return zone(ex.k + '-' + b + '-' + j, c, { court: true }); }).join('') + '</div>'; }).join('');
      } else {
        corps = zone(ex.k, 'Mon geste', { lignes: 4, ph: ex.debut }) + (ex.journal ? '<div class="mc-journal"><p class="mc-q">' + esc(ex.journal.q) + '</p>' + Array.apply(null, { length: ex.journal.n }).map(function (_, j) { return '<input type="text" data-k="' + ex.journal.k + '-' + j + '" aria-label="Essai ' + (j + 1) + '">'; }).join('') + '</div>' : '');
      }
      return '<section class="mc-exercice"><p class="mc-sur">Exercice ' + (i + 1) + '</p><h2>' + esc(ex.titre) + '</h2><p class="mc-consigne">' + md(ex.consigne) + '</p>' + corps + '</section>';
    }).join('');
  } });

  PAGES.push({ id: 'rituel', nom: 'Rituel et méditation', html: function () {
    var R = C.rituel, M = C.meditation;
    return '<p class="mc-sur">Le rituel du mois</p><h2>' + esc(R.titre) + '</h2><p>' + md(R.intro) + '</p><ol class="mc-etapes">' + R.etapes.map(function (e) { return '<li>' + md(e) + '</li>'; }).join('') + '</ol>' + zone(R.note.k, R.note.q, { lignes: 3 }) +
      '<p class="mc-sur" style="margin-top:2.5rem">La méditation à lire</p><h2>' + esc(M.titre) + '</h2><p class="mc-note">Lis ce texte lentement, en t’arrêtant aux pauses. Tu peux aussi l’enregistrer avec ta propre voix et l’écouter les yeux fermés.</p>' +
      '<div class="mc-medit">' + M.texte.map(function (x) { return /^\[/.test(x) ? '<p class="mc-pause">' + esc(x.slice(1, -1)) + '</p>' : '<p>' + md(x) + '</p>'; }).join('') + '</div>' + zone(M.note.k, M.note.q, { lignes: 3 });
  } });

  PAGES.push({ id: 'semaines', nom: 'Mes 4 semaines', html: function () {
    return '<p class="mc-sur">Un pas par semaine</p><h2>Mes quatre semaines</h2><p class="mc-intro">Chaque semaine, une petite action, et trois questions d’autocoaching pour voir ce qui avance. Les petites victoires comptent : ce sont elles qui transforment une boucle en spirale.</p>' +
      C.semaines.map(function (s, i) {
        var k = 'sem' + (i + 1);
        return '<section class="mc-semaine"><div class="mc-sem-tete"><span class="mc-sem-n">Semaine ' + (i + 1) + '</span><h3>' + esc(s[0]) + '</h3><label class="mc-fait"><input type="checkbox" data-k="' + k + '-fait"> Fait</label></div><p>' + md(s[1]) + '</p>' +
          zone(k + '-notes', 'Mes notes de la semaine', { lignes: 3 }) +
          zone(k + '-victoire', 'Ma victoire de la semaine, même petite', { court: true }) +
          zone(k + '-appris', 'Ce que j’ai appris sur moi', { court: true }) +
          curseur(k + '-elan', 'Mon élan cette semaine', 'à plat', 'plein élan') + '</section>';
      }).join('');
  } });

  PAGES.push({ id: 'cloture', nom: 'Mon bilan du mois', html: function () {
    return '<p class="mc-sur">Pour clore le mois · 10 minutes</p><h2>Ma météo de fin de mois</h2><p class="mc-intro">Prends ce temps à la fin du mois, même si tout n’a pas été fait. Tu vas comparer avec ton début de mois : c’est souvent là que l’on voit tout le chemin parcouru.</p>' +
      '<section class="mc-etape"><h3><span>1</span> Là, maintenant, comment je me sens ?</h3>' + blocEchelles('mf') + '<div class="mc-compare" id="mc-compare"></div></section>' +
      '<section class="mc-etape"><h3><span>2</span> Mon objectif</h3><div class="mc-rappel" id="mc-rappel-obj"></div>' +
        curseur('fin-obj', 'Où j’en suis de mon objectif', 'pas commencé', 'atteint') +
        zone('fin-preuves', 'Ce que j’ai vu, entendu ou ressenti qui me montre que j’ai avancé', { lignes: 3 }) +
      '</section>' +
      '<section class="mc-etape"><h3><span>3</span> Ce que ce mois m’a apporté</h3>' +
        zone('fin-fiertes', 'Trois choses dont je suis fier·e ce mois-ci', { lignes: 3 }) +
        zone('fin-boucle', 'La boucle que j’ai repérée, et ce que j’ai compris de son origine', { lignes: 3 }) +
        zone('fin-geste', 'Le geste différent que j’ai osé, et ce qu’il a changé', { lignes: 3 }) +
        zone('fin-recadrage', 'Une difficulté du mois, et ce qu’elle m’a appris', { lignes: 3 }) +
        '<div class="mc-deux">' + zone('fin-garder', 'Ce que je garde', { lignes: 2 }) + zone('fin-laisser', 'Ce que je laisse', { lignes: 2 }) + '</div>' +
        zone('fin-merci', 'Je me remercie pour…', { lignes: 2 }) +
        zone('fin-intention', 'Mon intention pour ' + (C.moisSuivant || 'le mois prochain'), { court: true }) +
      '</section>' +
      '<div class="mc-actions"><button type="button" class="btn btn-plein" data-meteo="fin">Enregistrer mon bilan du mois</button><p class="mc-retour" data-retour="fin" aria-live="polite"></p></div>' +
      '<p class="mc-note">Ce carnet propose une démarche symbolique de réflexion et de développement personnel. Il ne remplace pas un accompagnement médical ou psychologique.</p>';
  } });

  /* ───── Affichage ───── */
  var courante = 0;
  function construire() {
    racine.innerHTML =
      '<header class="mc-tete"><p class="mc-sur">Le Cercle · Le carnet de ' + esc(C.nomMois) + '</p><h1>' + esc(C.titre) + '</h1><p>' + esc(C.sousTitre) + '</p>' +
        '<div class="mc-barre"><div class="mc-progres" aria-label="Avancement du carnet"><span id="mc-progres-barre"></span></div><span id="mc-progres-texte"></span><span class="mc-etat" id="mc-etat" aria-live="polite"></span></div>' +
        '<div class="mc-boutons"><button type="button" class="btn btn-trait" id="mc-imprimer">Imprimer mon carnet rempli</button><a class="btn btn-trait" href="' + esc(C.pdf) + '" download>Version papier (PDF)</a></div>' +
        '<div class="mc-compte" id="mc-compte" hidden></div></header>' +
      '<nav class="mc-onglets" aria-label="Pages du carnet">' + PAGES.map(function (p, i) { return '<button type="button" data-page="' + i + '"><span>' + (i + 1) + '</span>' + esc(p.nom) + '</button>'; }).join('') + '</nav>' +
      PAGES.map(function (p, i) { return '<article class="mc-page" id="page-' + p.id + '" data-p="' + i + '"' + (i ? ' hidden' : '') + '>' + p.html() +
        '<div class="mc-nav">' + (i ? '<button type="button" class="btn btn-trait" data-page="' + (i - 1) + '">Page précédente</button>' : '<span></span>') + (i < PAGES.length - 1 ? '<button type="button" class="btn btn-plein" data-page="' + (i + 1) + '">Page suivante</button>' : '') + '</div></article>'; }).join('');
    racine.addEventListener('click', function (e) {
      var b = e.target.closest('[data-page]'); if (b) { aller(+b.getAttribute('data-page')); return; }
      var m = e.target.closest('[data-meteo]'); if (m) { enregistrerMeteo(m.getAttribute('data-meteo'), m); return; }
      if (e.target.id === 'mc-imprimer') imprimer();
    });
    racine.addEventListener('input', changement);
    racine.addEventListener('change', changement);
    var h = (location.hash || '').replace('#', ''), idx = PAGES.map(function (p) { return p.id; }).indexOf(h);
    aller(idx >= 0 ? idx : 0, true);
  }
  function aller(i, sansDefiler) {
    courante = i;
    racine.querySelectorAll('.mc-page').forEach(function (p) { p.hidden = +p.getAttribute('data-p') !== i; });
    racine.querySelectorAll('.mc-onglets [data-page]').forEach(function (b) { b.classList.toggle('actif', +b.getAttribute('data-page') === i); });
    try { history.replaceState(null, '', '#' + PAGES[i].id); } catch (e) {}
    if (PAGES[i].id === 'cloture') comparer();
    var en = document.querySelector('.entete'); racine.style.setProperty('--haut', (en && getComputedStyle(en).position === 'sticky' ? en.offsetHeight : 0) + 'px');
    var ong = racine.querySelector('.mc-onglets'), act = ong.querySelector('.actif');
    if (act) ong.scrollLeft = act.offsetLeft - (ong.clientWidth - act.offsetWidth) / 2;
    if (!sansDefiler) { var pg = racine.querySelector('.mc-page[data-p="' + i + '"]'); pg.style.scrollMarginTop = ((en && getComputedStyle(en).position === 'sticky' ? en.offsetHeight : 0) + ong.offsetHeight + 16) + 'px'; pg.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  }

  /* ───── Valeurs ───── */
  function valeurDe(el) { return el.type === 'checkbox' ? el.checked : el.hasAttribute('data-radio') ? (el.checked ? el.value : undefined) : el.value; }
  function appliquer() {
    racine.querySelectorAll('[data-k]').forEach(function (el) {
      var k = el.getAttribute('data-k'), v = D.v[k];
      if (v === undefined) return;
      if (el.type === 'checkbox') el.checked = !!v;
      else if (el.hasAttribute('data-radio')) el.checked = el.value === v;
      else el.value = v;
      if (el.type === 'range') afficherVal(el);
    });
    progres(); verifierObjectif();
  }
  function afficherVal(el) { var b = racine.querySelector('[data-val="' + el.getAttribute('data-k') + '"]'); if (b) b.textContent = D.v[el.getAttribute('data-k')] === undefined ? '–' : el.value; }
  function changement(e) {
    var el = e.target; if (!el.hasAttribute || !el.hasAttribute('data-k')) return;
    var v = valeurDe(el); if (v === undefined) return;
    D.v[el.getAttribute('data-k')] = el.type === 'range' ? +v : v;
    if (el.type === 'range') afficherVal(el);
    if (el.getAttribute('data-k') === 'obj-quoi') verifierObjectif();
    progres(); sauver();
  }
  function verifierObjectif() {
    var a = racine.querySelector('[data-aide="obj-quoi"]'); if (!a) return;
    var t = (D.v['obj-quoi'] || '').toLowerCase();
    var negatif = /\bne\s+\S+\s+(pas|plus|jamais)\b|\bn['’]\S+\s+(pas|plus|jamais)\b|\barr[êe]ter\b|\bmoins\b|\béviter\b|\bne plus\b/.test(t);
    a.classList.toggle('mc-alerte', negatif);
    a.textContent = negatif ? 'Ton objectif parle de ce que tu ne veux plus. Qu’est-ce que tu veux à la place ? Le cerveau avance mieux vers une image positive.' : 'Formule ce que tu veux à la place de ce que tu ne veux plus.';
  }
  function progres() {
    var champs = racine.querySelectorAll('textarea[data-k], input[type=text][data-k]'), n = 0;
    champs.forEach(function (c) { if ((D.v[c.getAttribute('data-k')] || '').toString().trim()) n++; });
    var p = champs.length ? Math.round(n / champs.length * 100) : 0;
    var b = document.getElementById('mc-progres-barre'); if (b) b.style.width = p + '%';
    var t = document.getElementById('mc-progres-texte'); if (t) t.textContent = p + ' % rempli';
  }

  /* ───── Enregistrement ───── */
  function etat(t) { var e = document.getElementById('mc-etat'); if (e) e.textContent = t; }
  function sauver() {
    try { localStorage.setItem(CLE_LOCALE, JSON.stringify(D)); } catch (e) {}
    clearTimeout(minuteur);
    if (!user || !sb) { etat('Gardé sur cet appareil'); return; }
    etat('Enregistrement…');
    minuteur = setTimeout(function () {
      sb.from('carnets').upsert({ user_id: user.id, mois: C.mois, data: D, maj: new Date().toISOString() }, { onConflict: 'user_id,mois' })
        .then(function (r) { etat(r.error ? 'Pas enregistré, réessaie plus tard' : 'Enregistré dans ton espace'); }, function () { etat('Pas enregistré, réessaie plus tard'); });
    }, 900);
  }
  function fusion(a, b) { var r = { v: {} }; [a, b].forEach(function (x) { if (x && x.v) Object.keys(x.v).forEach(function (k) { r.v[k] = x.v[k]; }); }); return r; }
  function charger() {
    var local = null; try { local = JSON.parse(localStorage.getItem(CLE_LOCALE) || 'null'); } catch (e) {}
    if (!sb) { D = local || D; appliquer(); invitation(); return; }
    sb.auth.getSession().then(function (r) {
      var s = r.data && r.data.session;
      if (!s) { D = local || D; appliquer(); invitation(); return; }
      user = s.user;
      sb.from('carnets').select('data').eq('user_id', user.id).eq('mois', C.mois).maybeSingle().then(function (x) {
        D = fusion(x && x.data, local);
        appliquer(); etat('Enregistré dans ton espace');
        if (local && Object.keys(local.v || {}).length) sauver();
      });
      sb.from('resultats').select('donnees,cree_le').eq('outil', 'meteo').order('cree_le', { ascending: false }).limit(24).then(function (x) { historique = (x && x.data) || []; });
    }).catch(function () { D = local || D; appliquer(); });
  }
  var historique = [];
  function invitation() {
    var z = document.getElementById('mc-compte'); if (!z) return;
    z.hidden = false;
    z.innerHTML = '<p><b>Sans compte, ton carnet est gardé jusqu’à la fermeture de ton navigateur.</b> Crée ton espace gratuit pour retrouver tes réponses, ta météo et ta lettre de dans un an, sur tous tes appareils.</p><a class="btn btn-plein" href="login.html?inscription&amp;retour=mon-carnet.html">Créer mon espace</a> <a href="login.html?retour=mon-carnet.html">J’ai déjà un compte</a>';
  }

  /* ───── Météo : enregistrée dans Mon chemin ───── */
  function echelles(prefixe) { var o = {}; ECHELLES.forEach(function (e) { var v = D.v[prefixe + '-' + e[0]]; if (typeof v === 'number') o[e[0]] = v; }); return o; }
  function moyenne(o) { var k = Object.keys(o); return k.length ? Math.round(k.reduce(function (s, x) { return s + o[x]; }, 0) / k.length * 10) / 10 : null; }
  function enregistrerMeteo(moment, bouton) {
    var p = moment === 'debut' ? 'md' : 'mf', e = echelles(p), ret = racine.querySelector('[data-retour="' + moment + '"]');
    if (Object.keys(e).length < ECHELLES.length) { ret.textContent = 'Place les six curseurs avant d’enregistrer.'; return; }
    var donnees = { moment: moment, mois: C.mois, echelles: e, moyenne: moyenne(e), meteo: D.v[p + '-meteo'] || '', mot: D.v[p + '-mot'] || '' };
    if (moment === 'debut') { donnees.objectif = D.v['obj-quoi'] || ''; donnees.croyance = D.v['obj-croyance']; donnees.lettre = D.v['proj-an'] || ''; donnees.phrase = D.v.phrase || ''; }
    else { donnees.objectif_avance = D.v['fin-obj']; donnees.intention = D.v['fin-intention'] || ''; }
    var resume = ECHELLES.map(function (x) { return x[1].replace(/^(Mon |Ma |Je me sens |J’)/, '') + ' ' + e[x[0]]; }).join(' · ');
    var titre = (moment === 'debut' ? 'Début ' : 'Fin ') + C.nomMois + (donnees.meteo ? ' · ' + donnees.meteo : '');
    bouton.disabled = true;
    var fait = window.GenesoliaChemin ? window.GenesoliaChemin.enregistrer({ outil: 'meteo', titre: titre, resume: resume, donnees: donnees }) : Promise.resolve(false);
    fait.then(function (ok) {
      bouton.disabled = false;
      ret.textContent = ok ? 'C’est enregistré dans ton espace, avec la date. Tu pourras comparer mois après mois.' : (user ? 'L’enregistrement n’a pas fonctionné, réessaie.' : 'Crée ton espace pour garder ta météo et la comparer chaque mois.');
      if (ok && window.umami) try { window.umami.track('carnet-meteo-' + moment, { mois: C.mois }); } catch (x) {}
    });
  }
  function comparer() {
    var z = document.getElementById('mc-compare'), r = document.getElementById('mc-rappel-obj');
    if (r) r.innerHTML = D.v['obj-quoi'] ? '<p class="mc-q">Mon objectif du début de mois</p><p class="mc-cite">' + esc(D.v['obj-quoi']) + '</p>' + (D.v['obj-voir'] || D.v['obj-ressentir'] ? '<p class="mc-note">Je saurai que je l’ai atteint quand : ' + esc([D.v['obj-voir'], D.v['obj-entendre'], D.v['obj-ressentir']].filter(Boolean).join(' · ')) + '</p>' : '') : '<p class="mc-note">Tu n’as pas noté d’objectif en début de mois : tu peux le faire le mois prochain.</p>';
    if (!z) return;
    var a = echelles('md'), b = echelles('mf');
    if (!Object.keys(a).length) { z.innerHTML = '<p class="mc-note">Remplis aussi ta météo du début de mois pour voir l’écart ici.</p>'; return; }
    z.innerHTML = '<p class="mc-q">Depuis le début du mois</p><ul>' + ECHELLES.map(function (x) {
      var d = (b[x[0]] !== undefined && a[x[0]] !== undefined) ? b[x[0]] - a[x[0]] : null;
      return '<li><span>' + esc(x[1]) + '</span><b>' + (a[x[0]] !== undefined ? a[x[0]] : '–') + ' puis ' + (b[x[0]] !== undefined ? b[x[0]] : '–') + '</b>' + (d === null ? '' : '<em class="' + (d > 0 ? 'plus' : d < 0 ? 'moins' : '') + '">' + (d > 0 ? '+' + d : d < 0 ? '−' + Math.abs(d) : '=') + '</em>') + '</li>';
    }).join('') + '</ul>' + (historique.length > 1 ? '<p class="mc-note">Toute ton évolution, mois après mois, est dans <a href="login.html#mon-chemin">ton espace</a>.</p>' : '');
  }

  /* ───── Impression du carnet rempli ───── */
  function imprimer() {
    racine.querySelectorAll('.mc-imp').forEach(function (x) { x.remove(); });
    racine.querySelectorAll('textarea[data-k], input[type=text][data-k]').forEach(function (el) {
      var d = document.createElement('div'); d.className = 'mc-imp'; d.textContent = el.value || ' '; el.parentNode.insertBefore(d, el.nextSibling);
    });
    racine.querySelectorAll('input[type=range][data-k]').forEach(function (el) {
      var d = document.createElement('div'); d.className = 'mc-imp mc-imp-court'; d.textContent = D.v[el.getAttribute('data-k')] === undefined ? '…/10' : el.value + '/10'; el.closest('.mc-curseur').querySelector('.mc-q').appendChild(d);
    });
    comparer();
    racine.classList.add('mc-impression');
    setTimeout(function () { window.print(); }, 150);
  }
  window.addEventListener('afterprint', function () { racine.classList.remove('mc-impression'); racine.querySelectorAll('.mc-imp').forEach(function (x) { x.remove(); }); });

  construire();
  charger();
})();
