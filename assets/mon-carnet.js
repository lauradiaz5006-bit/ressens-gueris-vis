/* Genesolia · Le carnet du mois, version interactive (le moteur, commun à tous les mois)
   - Contenu : window.GENESOLIA_CARNET (assets/carnets/AAAA-MM.js). Tout ce qui est propre au mois est là-bas.
   - Format livre : sur ordinateur, un livre ouvert dont on tourne les pages (flèches du clavier) ;
     sur téléphone, une page à la fois, en glissant du doigt. Les onglets mènent directement à une page.
   - Ouverture et clôture du mois : « Ma météo intérieure », enregistrée dans Mon chemin (table resultats, outil « meteo »).
   - Réponses : dans l'espace (table carnets) si la personne est connectée ; sinon dans le navigateur,
     effacées à sa fermeture (règle commune du site : window.GenesoliaDonnees dans site.js).
   - Impression au choix : « Simple » (texte et réponses) ou « Avec le décor ». Chaque page sur une nouvelle feuille.
   - Rappels : un fichier .ics (4 rappels hebdomadaires et le bilan), sans aucun e-mail automatique. */
(function () {
  'use strict';
  var C = window.GENESOLIA_CARNET; if (!C) return;
  var SB_URL = 'https://qsvzzkjtjsznfntahvvh.supabase.co', SB_KEY = 'sb_publishable_6iEVxXmtB_u1hJ6mPS9fNg_CJhLjYkg';
  var SUIVI = C.type === 'suivi', CLE = C.cle || C.mois, PAGE_URL = C.page || 'mon-carnet.html', membre = false;
  var CLE_LOCALE = 'genesolia-carnet-' + CLE;
  var sb = null, user = null, prenom = '', D = { v: {} }, minuteur = null, historique = [];
  try { sb = window.supabase.createClient(SB_URL, SB_KEY); } catch (e) {}
  var racine = document.getElementById('carnet');
  var DECOR = C.decor || {}, IMG = DECOR.pages || {}, MOTS = C.mots || {};
  var NOM_MOIS = String(C.nomMois || '').split(' ')[0];
  var ORNEMENT = '<svg class="mc-orn" viewBox="0 0 120 12" aria-hidden="true"><path d="M2 6h46M72 6h46" stroke="currentColor" stroke-width="1"/><circle cx="60" cy="6" r="3.2" fill="none" stroke="currentColor"/><circle cx="52" cy="6" r="1.3" fill="currentColor"/><circle cx="68" cy="6" r="1.3" fill="currentColor"/></svg>';

  function fondUrl(p) { try { return new URL(p, location.href).href; } catch (e) { return p; } }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function md(t) {
    return esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\[([^\]]+)\]\(([a-z0-9\-]+\.html(?:#[a-z\-]+)?)\)/g, '<a href="$2">$1</a>');
  }
  function paras(l) { return (l || []).map(function (x) { return '<p>' + md(x) + '</p>'; }).join(''); }
  function de(mot) { return /^[aeiouyhéèêâîôû]/i.test(mot) ? 'd’' + mot : 'de ' + mot; }
  function q(x) { return typeof x === 'string' ? { q: x } : (x || {}); }
  function ex(ph, i) { return Array.isArray(ph) ? ph[i || 0] : ph; }

  /* ───── Champs : chaque consigne est une phrase complète, avec un exemple dans le champ ───── */
  function zone(k, question, opts) {
    opts = opts || {};
    var ph = opts.ph ? ' placeholder="' + esc(opts.ph) + '"' : '';
    return '<label class="mc-champ"><span class="mc-q">' + esc(question) + '</span>' +
      (opts.court ? '<input type="text" data-k="' + k + '"' + ph + '>' : '<textarea data-k="' + k + '" rows="' + (opts.lignes || 3) + '"' + ph + '></textarea>') +
      (opts.aide ? '<small class="mc-aide" data-aide="' + k + '">' + esc(opts.aide) + '</small>' : '') + '</label>';
  }
  function curseur(k, question, bas, haut) {
    return '<div class="mc-curseur mc-vide" data-curseur="' + k + '"><span class="mc-q">' + esc(question) + '</span><div class="mc-ligne"><span class="mc-min">' + esc(bas || '0') + '</span>' +
      '<input type="range" min="0" max="10" step="1" value="0" data-k="' + k + '" aria-label="' + esc(question) + '"><span class="mc-max">' + esc(haut || '10') + '</span></div>' +
      '<b class="mc-val" data-val="' + k + '" aria-live="polite">Place le curseur</b></div>';
  }
  function choix(k, question, options, multiple) {
    return '<fieldset class="mc-choix"><legend class="mc-q">' + esc(question) + '</legend>' + options.map(function (o, i) {
      return '<label><input type="' + (multiple ? 'checkbox' : 'radio') + '" name="' + k + '" value="' + esc(o) + '" data-k="' + k + (multiple ? '-' + i : '') + '"' + (multiple ? '' : ' data-radio') + '><span>' + esc(o) + '</span></label>';
    }).join('') + '</fieldset>';
  }
  function sommaire(liste) {
    return '<ol class="mc-sommaire">' + liste.map(function (x, i) { return '<li><button type="button" data-vers="mc-ex-' + esc(x.k) + '"><span>' + (i + 1) + '</span>' + esc(x.titre) + '</button></li>'; }).join('') + '</ol>';
  }
  function encadre(titre, corps, classe) { return '<aside class="mc-encadre ' + (classe || '') + '">' + (titre ? '<p class="mc-encadre-t">' + esc(titre) + '</p>' : '') + corps + '</aside>'; }
  function plus(id, titre, corps) {
    return '<details class="mc-plus" data-plus="' + id + '"><summary><span class="mc-plus-sur">Pour aller plus loin · facultatif</span>' + esc(titre) + '</summary><div class="mc-plus-corps">' + corps + '</div></details>';
  }

  /* ───── Ma météo intérieure ───── */
  var ECHELLES = [
    ['energie', 'Énergie', 'Quel est ton niveau d’énergie en ce moment ?'],
    ['humeur', 'Humeur', 'Comment est ton humeur, ces jours-ci ?'],
    ['confiance', 'Confiance', 'Quelle confiance as-tu en toi ?'],
    ['serenite', 'Sérénité', 'À quel point te sens-tu serein·e, apaisé·e ?'],
    ['liens', 'Entourage', 'À quel point te sens-tu entouré·e, soutenu·e ?'],
    ['elan', 'Élan', 'À quel point sens-tu que tu avances dans ta vie ?']
  ];
  /* Ma roue de la vie : dix domaines notés de 0 à 10, au début et à la fin du mois */
  var ROUE = [
    ['energie', 'Énergie', 'Mon énergie au quotidien'], ['amour', 'Amour', 'L’amour, ma vie de couple ou mon cœur'], ['famille', 'Famille', 'Mes liens avec ma famille'],
    ['amis', 'Amitiés', 'Mes amitiés, mon entourage'], ['travail', 'Travail', 'Mon travail, mes projets'], ['argent', 'Argent', 'L’argent, ma sécurité matérielle'],
    ['chezmoi', 'Chez-moi', 'Mon chez-moi, mon cadre de vie'], ['joie', 'Joie', 'La joie, les loisirs, le plaisir'], ['evolution', 'Évolution', 'Mon évolution personnelle'],
    ['connexion', 'Connexion', 'Ma connexion à moi, ma spiritualité']
  ];
  function blocRoue(prefixe) {
    return '<div class="mc-roue"><div class="mc-roue-curseurs">' + ROUE.map(function (d) { return curseur(prefixe + '-' + d[0], d[2], 'pas du tout', 'pleinement'); }).join('') + '</div>' +
      '<figure class="mc-roue-fig" data-radar="' + prefixe + '"></figure></div>';
  }
  function roue(prefixe) { var o = {}; ROUE.forEach(function (d) { var v = D.v[prefixe + '-' + d[0]]; if (typeof v === 'number') o[d[0]] = v; }); return o; }
  function radar(series, aria) {
    var W = 360, c = 180, R = 118, n = ROUE.length;
    function pt(i, v) { var a = -Math.PI / 2 + i * 2 * Math.PI / n; return [c + Math.cos(a) * R * v / 10, c + Math.sin(a) * R * v / 10]; }
    var s = '<svg class="mc-svg mc-radar" viewBox="0 0 ' + W + ' ' + W + '" role="img" aria-label="' + esc(aria) + '">';
    [2.5, 5, 7.5, 10].forEach(function (t) { s += '<polygon fill="none" stroke="#EBCFD5" points="' + ROUE.map(function (_, i) { return pt(i, t).join(','); }).join(' ') + '"/>'; });
    ROUE.forEach(function (d, i) { var e = pt(i, 10), l = pt(i, 11.7); s += '<line x1="' + c + '" y1="' + c + '" x2="' + e[0] + '" y2="' + e[1] + '" stroke="#F1DDE2"/><text x="' + l[0] + '" y="' + (l[1] + 4) + '" text-anchor="middle" class="mc-svg-lab">' + esc(d[1]) + '</text>'; });
    series.forEach(function (x) {
      var vals = ROUE.map(function (d) { return typeof x.v[d[0]] === 'number' ? x.v[d[0]] : 0; });
      s += '<polygon points="' + vals.map(function (v, i) { return pt(i, v).join(','); }).join(' ') + '" fill="' + x.c + '" fill-opacity=".18" stroke="' + x.c + '" stroke-width="2"/>';
      vals.forEach(function (v, i) { var p = pt(i, v); s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.5" fill="' + x.c + '"><title>' + esc(ROUE[i][1]) + ' : ' + v + ' sur 10</title></circle>'; });
    });
    return s + '</svg>';
  }
  function majRadars() {
    racine.querySelectorAll('.mc-livre [data-radar]').forEach(function (f) {
      var p = f.getAttribute('data-radar'), a = roue('rd'), b = roue('rf'), series = [];
      if (p === 'rd' && Object.keys(a).length) series.push({ v: a, c: COUL_DEBUT });
      if (p === 'rf') { if (Object.keys(a).length) series.push({ v: a, c: COUL_DEBUT }); if (Object.keys(b).length) series.push({ v: b, c: COUL_FIN }); }
      f.innerHTML = series.length ? radar(series, p === 'rd' ? 'Ta roue de la vie au début du mois' : 'Ta roue de la vie, début et fin du mois') +
        (p === 'rf' && series.length > 1 ? '<figcaption class="mc-legende"><span><i style="background:' + COUL_DEBUT + '"></i>Début du mois</span><span><i style="background:' + COUL_FIN + '"></i>Fin du mois</span></figcaption>' : '')
        : '<p class="mc-note">Place les curseurs : ta roue se dessine ici.</p>';
    });
    var plusBas = Object.keys(roue('rd')).sort(function (x, y) { return roue('rd')[x] - roue('rd')[y]; })[0];
    var ind = racine.querySelector('[data-roue-bas]');
    if (ind) ind.textContent = plusBas ? 'Le domaine le plus bas de ta roue : ' + ROUE.filter(function (d) { return d[0] === plusBas; })[0][2].toLowerCase() + '. C’est souvent là qu’un petit pas change le plus de choses.' : '';
  }
  var METEOS = ['Grand soleil', 'Éclaircies', 'Nuageux', 'Brouillard', 'Pluie', 'Orage', 'Arc-en-ciel'];
  var COUL_DEBUT = '#7E3A6E', COUL_FIN = '#B7833F';
  function blocEchelles(prefixe) {
    return '<div class="mc-echelles">' + ECHELLES.map(function (e) { return curseur(prefixe + '-' + e[0], e[2], 'au plus bas', 'au plus haut'); }).join('') + '</div>' +
      choix(prefixe + '-meteo', 'Si ton état intérieur était une météo, ce serait…', METEOS) +
      zone(prefixe + '-mot', 'En un mot, comment te sens-tu ?', { court: true, ph: 'Exemple : fatigué·e, curieux·se, impatient·e…' });
  }

  /* ───── La page de gauche : illustration, titre, petit mot, rappel de l'objectif ───── */
  function gauche(id, sur, titre, intro, extra) {
    var img = IMG[id];
    return '<div class="mc-g-in">' +
      (img ? '<img class="mc-illu" src="' + esc(img) + '" alt="" width="320" height="320" loading="lazy">' : '') +
      '<p class="mc-sur">' + esc(sur) + '</p><h2>' + esc(titre) + '</h2>' + ORNEMENT +
      (intro || '') +
      (MOTS[id] ? '<p class="mc-mot"><span>Un mot pour toi</span>' + md(MOTS[id]) + '</p>' : '') +
      (id !== 'ouverture' ? '<div class="mc-rappel-obj" data-rappel-obj hidden></div>' : '') +
      (extra || '') + '</div>';
  }

  var PAGES = [];
  /* ───── Ton mois à toi : ta numérologie, ton ciel et ton calendrier maya du mois (moteur du guide du mois) ───── */
  var CLE_PROFIL = 'genesolia-guide';
  var MOIS_NOMS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  if (!SUIVI && window.Guide && window.GUIDE_TEXTES) PAGES.push({ id: 'tonmois', nom: 'Ton mois à toi', g: function () {
    return gauche('tonmois', 'Avant tout · rien que pour toi', 'Ton mois à toi',
      '<p class="mc-intro">Chaque mois porte une couleur particulière pour toi : ton nombre personnel, le ciel qui passe sur ton thème de naissance, les jours de ton signe maya. Lis-les comme une météo du ciel, avant ta météo intérieure.</p>' +
      '<p>Ce n’est pas une prédiction : ce sont des repères pour savoir où mettre ton énergie, en amour, dans ton travail, dans tes décisions.</p>');
  }, d: function () { return '<div id="mc-tonmois"></div>' + zone('tonmois-retiens', 'Qu’est-ce qui résonne pour toi dans cette lecture ? Qu’en retiens-tu pour ton mois ?', { lignes: 3, ph: 'Exemple : un mois pour oser commencer. Je retiens la nouvelle lune du 21 pour poser mon intention.' }); } });

  function lireProfil() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(CLE_PROFIL) || 'null'); } catch (e) {}
    if (!s) { try { var a = JSON.parse(localStorage.getItem('genesolia-astro') || 'null'); if (a && a.date) s = { prenom: a.prenom || '', date: a.date, heure: a.heure || '', lieu: a.lieu || '', lat: a.lat, lon: a.lon, tz: a.tz || 'Europe/Paris' }; } catch (e) {} }
    return s && /^\d{4}-\d{2}-\d{2}$/.test(s.date || '') ? s : null;
  }
  function formProfil(z) {
    z.innerHTML = '<form class="mc-profil" novalidate><p class="mc-consigne">Pour lire ton mois, indique ta date de naissance. L’heure et le lieu permettent de savoir dans quels domaines de ta vie tombe le ciel du mois : ajoute-les si tu les connais.</p>' +
      '<label class="mc-champ"><span class="mc-q">Ton prénom</span><input type="text" name="prenom" autocomplete="given-name" value="' + esc(prenom) + '"></label>' +
      '<label class="mc-champ"><span class="mc-q">Ta date de naissance</span><input type="date" name="date" required></label>' +
      '<label class="mc-champ"><span class="mc-q">Ton heure de naissance (facultatif)</span><input type="time" name="heure"></label>' +
      '<div class="mc-champ mc-lieu"><label class="mc-q" for="mc-lieu">Ton lieu de naissance (facultatif)</label><input type="text" id="mc-lieu" autocomplete="off" spellcheck="false" placeholder="Commence à taper ta ville"><ul class="mc-sugg" id="mc-sugg" role="listbox" hidden></ul><small class="mc-aide" id="mc-lieu-info"></small></div>' +
      '<button class="btn btn-plein" type="submit">Lire mon mois</button><p class="mc-retour" role="alert"></p></form>';
    var f = z.querySelector('form'), lieu = window.LieuNaissance ? window.LieuNaissance.brancher({ input: document.getElementById('mc-lieu'), liste: document.getElementById('mc-sugg'), info: document.getElementById('mc-lieu-info') }) : null;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = f.date.value; if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || +d.slice(0, 4) < 1900) { f.querySelector('.mc-retour').textContent = 'Indique ta date de naissance complète.'; return; }
      (lieu && document.getElementById('mc-lieu').value.trim() ? lieu.resoudre() : Promise.resolve(null)).then(function (l) {
        var pr = { prenom: f.prenom.value.trim(), date: d, heure: l ? f.heure.value : '', lieu: l ? l.nom : '', lat: l ? l.lat : null, lon: l ? l.lon : null, tz: l ? l.tz : 'Europe/Paris' };
        try { localStorage.setItem(CLE_PROFIL, JSON.stringify(pr)); } catch (x) {}
        tonMois(); majSemainesMaya();
      });
    });
  }
  function tonMois() {
    var z = document.getElementById('mc-tonmois'); if (!z) return;
    var pr = lireProfil(); if (!pr) { formProfil(z); return; }
    var p = String(C.mois).split('-'), an = +p[0], mo = +p[1], arbre = null, r = null;
    try { arbre = JSON.parse(localStorage.getItem('geno4') || 'null'); } catch (e) {}
    try { r = window.Guide.calculer(pr, an, mo, arbre); } catch (e) { r = null; }
    if (!r) { formProfil(z); return; }
    var T = window.GUIDE_TEXTES, G = window.Guide, M = T.MOIS[r.moisPerso] || {}, ML = window.Numerologie && window.Numerologie.MOIS_LONG ? window.Numerologie.MOIS_LONG[r.moisPerso] : null;
    var nm = MOIS_NOMS[mo - 1], signeMaya = r.maya && window.MAYA_TEXTES ? window.MAYA_TEXTES.SIGNES[r.maya.natal.signe] : null;
    var h = '<div class="mc-tm-tete"><p class="mc-sur">' + (pr.prenom ? 'Le mois de ' + esc(pr.prenom) : 'Ton mois') + '</p><p class="mc-tm-titre">' + esc(M.theme || '') + '</p>' +
      '<p class="mc-tm-puces"><span>Mois personnel ' + r.moisPerso + '</span><span>Année personnelle ' + r.anneePerso + '</span>' + (signeMaya ? '<span>Signe maya ' + esc(signeMaya.kiche) + '</span>' : '') + '</p></div>';
    if (ML) h += '<p>' + ML.texte + '</p>';
    h += '<div class="mc-tm-cartes">' +
      '<div class="mc-tm-carte"><p class="mc-encadre-t">En amour</p><p>' + M.amour + '</p></div>' +
      '<div class="mc-tm-carte"><p class="mc-encadre-t">Travail, argent et décisions</p><p>' + M.travail + '</p></div>' +
      '<div class="mc-tm-carte"><p class="mc-encadre-t">En famille</p><p>' + M.famille + '</p></div>' +
      '<div class="mc-tm-carte mc-tm-defi"><p class="mc-encadre-t">Ton défi du mois</p><p>' + M.defi + '</p></div></div>';
    var c = '';
    r.lunaisons.forEach(function (l) {
      var txt = l.maison ? (l.type === 'nouvelle' ? T.NOUVELLE_LUNE_MAISON : T.PLEINE_LUNE_MAISON)[l.maison] : (l.type === 'nouvelle' ? T.NOUVELLE_LUNE_SIGNE : T.PLEINE_LUNE_SIGNE)[l.signe];
      c += '<li><b>' + (l.type === 'nouvelle' ? 'Nouvelle lune' : 'Pleine lune') + ' du ' + (+l.jour.slice(8)) + ' ' + nm + ', en ' + esc(G.nomSigne(l.signe)) + '</b><span>' + txt + '</span></li>';
    });
    if (r.maisons) c += '<li><b>Jupiter dans ta maison ' + r.jupiter.maison + ' · ' + esc(T.MAISONS_NOMS[r.jupiter.maison]) + '</b><span>' + T.JUPITER_MAISON[r.jupiter.maison] + '</span></li>';
    if (r.mercure) c += '<li><b>Mercure rétrograde</b><span>' + T.MERCURE_RETRO + '</span></li>';
    if (r.maya && r.maya.jours.length) c += '<li><b>Les jours de ton signe maya : ' + r.maya.jours.map(function (x) { return 'le ' + (+x.jour.slice(8)) + ' ' + nm; }).join(' et ') + '</b><span>' + T.MAYA_JOUR_SIGNE + '</span></li>';
    h += '<p class="mc-encadre-t mc-tm-ciel-t">Ton ciel du mois</p><ul class="mc-tm-ciel">' + c + '</ul>' +
      (r.maisons ? '' : '<p class="mc-note">Ajoute ton heure et ton lieu de naissance pour savoir dans quels domaines de ta vie tombe le ciel du mois.</p>') +
      '<p class="mc-tm-liens"><button type="button" class="btn btn-trait" data-profil>Modifier mes repères de naissance</button> <a class="btn btn-trait" href="mon-guide.html">Mon guide du mois complet</a></p>';
    z.innerHTML = h;
    z.querySelector('[data-profil]').addEventListener('click', function () { formProfil(z); });
  }

  PAGES.push({ id: 'ouverture', nom: 'Ma météo du début', g: function () {
    return gauche('ouverture', 'Pour commencer le mois · 10 minutes', 'Ma météo du début de mois',
      '<p class="mc-intro">Avant d’ouvrir le thème, prends le temps de te poser. Ces questions viennent de la PNL et de l’accompagnement : elles t’aident à savoir où tu en es, à donner une direction claire à ton mois, et à mesurer ensuite le chemin parcouru.</p>' +
      '<p>Il n’y a pas de bonne réponse, seulement la tienne, aujourd’hui. Si tu as cinq minutes, remplis la météo et ton objectif. Le reste peut attendre.</p>');
  }, d: function () {
    return '<section class="mc-etape"><h3><span>1</span> Là, maintenant, comment te sens-tu ?</h3><p class="mc-consigne">Place chaque curseur sans réfléchir longtemps : la première réponse est souvent la plus juste. 0, c’est au plus bas ; 10, au plus haut. Par exemple, si tu dors mal depuis une semaine, ton énergie est peut-être à 3, et c’est très bien de le voir.</p>' + blocEchelles('md') + '</section>' +
      '<section class="mc-etape"><h3><span>2</span> Ta roue de la vie</h3><p class="mc-consigne">Pour chaque domaine de ta vie, à quel point te sens-tu comblé·e aujourd’hui ? 0, pas du tout ; 10, pleinement. Ta roue se dessine à côté : plus elle est ronde, plus ta vie est équilibrée. Elle n’a pas besoin d’être grande partout, elle a besoin d’être juste pour toi.</p>' + blocRoue('rd') + '<p class="mc-pourquoi" data-roue-bas></p></section>' +
      '<section class="mc-etape"><h3><span>3</span> Ton objectif du mois, bien formulé</h3><p class="mc-consigne">Un objectif clair met ton énergie en mouvement. On le formule en positif (ce que tu veux, pas ce que tu ne veux plus), il dépend de toi, et tu sais à quoi tu reconnaîtras qu’il est atteint. Par exemple, « ne plus me laisser marcher dessus » devient « dire calmement ce dont j’ai besoin ».</p>' +
        choix('obj-domaine', 'Quel domaine de ta roue veux-tu nourrir ce mois-ci ?', ROUE.map(function (d) { return d[2]; })) +
        zone('obj-quoi', 'Qu’est-ce que tu veux pour toi ce mois-ci ? Commence ta phrase par « Je veux… »', { court: true, ph: 'Exemple : je veux dire ce dont j’ai besoin au moment où je le ressens', aide: 'Formule ce que tu veux à la place de ce que tu ne veux plus.' }) +
        choix('obj-depend', 'Est-ce que cet objectif dépend de toi ?', ['Oui, entièrement', 'En partie', 'Pas vraiment']) +
        zone('obj-part', 'Quelle part de cet objectif dépend vraiment de toi ?', { court: true, ph: 'Exemple : je ne peux pas changer ma cheffe, mais je peux choisir ma réponse' }) +
        zone('obj-contexte', 'Où, quand et avec qui veux-tu que ça change ?', { court: true, ph: 'Exemple : au travail le lundi, et le soir au téléphone avec ma sœur' }) +
        '<div class="mc-trois"><p class="mc-q">À quoi sauras-tu que tu l’as atteint ? Imagine la scène avec tes sens.</p>' +
          zone('obj-voir', 'Qu’est-ce que tu verras ?', { lignes: 2, ph: 'Exemple : des soirées libres dans mon agenda' }) +
          zone('obj-entendre', 'Qu’est-ce que tu entendras, ou te diras ?', { lignes: 2, ph: 'Exemple : « Merci de m’avoir prévenu·e. »' }) +
          zone('obj-ressentir', 'Qu’est-ce que tu ressentiras dans ton corps ?', { lignes: 2, ph: 'Exemple : les épaules plus légères' }) + '</div>' +
        zone('obj-ecologie', 'Qu’est-ce que ça va changer pour toi et pour tes proches ? Y a-t-il quelque chose que tu risques de perdre ?', { lignes: 2, ph: 'Exemple : j’aurai plus de temps pour moi. Au début, je risque de décevoir un peu.' }) +
        zone('obj-ressources', 'Sur quoi peux-tu t’appuyer ? Ce que tu as déjà, qui peut t’aider, une fois où tu as réussi quelque chose de semblable.', { lignes: 3, ph: 'Exemple : mon amie Claire, ma patience, la fois où j’ai osé demander un congé.' }) +
        zone('obj-pas', 'Quel est ton tout premier pas, à faire dans les 48 heures ?', { court: true, ph: 'Exemple : bloquer jeudi soir dans mon agenda, rien que pour moi' }) +
        curseur('obj-croyance', 'À quel point crois-tu pouvoir y arriver ?', 'pas du tout', 'complètement') +
        zone('obj-un-point', 'Qu’est-ce qui te ferait gagner un point de plus sur ce curseur ?', { court: true, ph: 'Exemple : en parler à une amie qui m’encouragera' }) +
      '</section>' +
      '<section class="mc-etape mc-intention"><h3><span>4</span> Mon intention prend vie</h3><p class="mc-consigne">Ce que tu nourris de ton attention grandit. Ce mois-ci, tu vas donner à ton objectif une image, une émotion et une croyance qui le soutiennent, comme on prépare la terre avant de semer. Prends ton temps : c’est souvent la page qui change tout.</p>' +
        '<p class="mc-sur">Désirer</p>' + zone('int-desir', 'Au-delà de ton objectif, qu’est-ce que tu désires vraiment ressentir ? Qu’est-ce qu’il t’apportera au fond ?', { lignes: 2, ph: 'Exemple : me sentir libre, légère, respectée. Avoir enfin de l’espace pour moi.' }) +
        '<p class="mc-sur">Ressentir, comme si c’était déjà là</p><p class="mc-consigne">Ferme les yeux quelques secondes. Imagine-toi à la fin du mois, ton intention réalisée. Où es-tu ? Que vois-tu, qu’entends-tu ? Laisse monter l’émotion dans ton corps, la joie, le soulagement, la fierté. Puis écris au présent, comme si tu le vivais déjà.</p>' +
        zone('proj-mois', 'Raconte cette scène au présent : que vois-tu, qu’entends-tu, que ressens-tu ?', { lignes: 4, ph: 'Exemple : c’est mardi soir, je suis sur mon canapé, le téléphone éteint. Je souris, je me sens à ma place, mes épaules sont légères.' }) +
        '<p class="mc-sur">Croire</p>' +
        '<div class="mc-deux">' + zone('int-frein', 'Quelle petite voix te dit que ce n’est pas possible, ou pas pour toi ?', { lignes: 2, ph: 'Exemple : « Ce n’est pas pour les gens comme moi. »' }) +
          zone('int-croire', 'Que choisis-tu de croire à la place ? Une phrase douce et vraie pour toi.', { lignes: 2, ph: 'Exemple : « J’ai le droit d’avoir une vie qui me ressemble, et j’apprends chaque jour. »' }) + '</div>' +
        '<p class="mc-sur">Voir</p><p class="mc-consigne">Ton mini tableau de vision : trois mots ou trois images qui représentent ce que tu accueilles ce mois-ci. Tu peux aussi les découper dans un magazine et les coller près de ton lit, pour les voir chaque matin.</p>' +
        '<div class="mc-trois">' + zone('vision-1', 'Premier mot ou image', { court: true, ph: 'Exemple : un bain chaud' }) + zone('vision-2', 'Deuxième mot ou image', { court: true, ph: 'Exemple : le mot « oui »' }) + zone('vision-3', 'Troisième mot ou image', { court: true, ph: 'Exemple : la mer au lever du jour' }) + '</div>' +
      '</section>' +
      '<section class="mc-etape"><h3><span>5</span> Ta phrase du mois</h3>' + zone('phrase', 'Quelle phrase veux-tu te redire tout le mois ?', { court: true, ph: 'Exemple : ' + C.citation }) + '</section>' +
      plus('lettre', 'Ta lettre de dans un an',
        '<p class="mc-consigne">Écris à la personne que tu es aujourd’hui, comme si tu étais déjà un an plus tard. Raconte-lui ce qui a changé, ce que tu as compris, ce que tu veux lui dire pour l’encourager.</p>' +
        zone('proj-an', 'Ta lettre, écrite depuis ' + C.nomMois.replace(/\d+/, function (a) { return +a + 1; }) + ', à la personne que tu es aujourd’hui', { lignes: 7, ph: 'Exemple : Je t’écris depuis l’an prochain. Je sais que tu doutes en ce moment…' }) +
        '<p class="mc-note">Si tu as un compte et que tu enregistres ta météo du début, ta lettre est gardée dans ton espace. Dans un an, elle t’y attendra.</p>') +
      plus('ancrage', 'Ton ancrage ressource',
        '<p class="mc-consigne">Repense à un moment où tu t’es senti·e fort·e, calme ou fier·e de toi. Revis-le : ce que tu voyais, ce que tu entendais, ce que tu ressentais. Quand la sensation est au plus fort, presse doucement ton pouce contre ton index pendant quelques secondes. Refais-le trois fois. Ce geste devient ton ancre : tu pourras la retrouver chaque fois que tu en as besoin, par exemple juste avant un rendez-vous difficile.</p>' +
        zone('ancre-souvenir', 'Quel moment ressource choisis-tu ? Raconte-le en quelques mots.', { lignes: 2, ph: 'Exemple : le jour où j’ai fini ma première course de 10 km, sous la pluie, en riant.' }) +
        zone('ancre-mot', 'Quel mot résume ce moment ?', { court: true, ph: 'Exemple : vivant·e' })) +
      '<div class="mc-actions"><button type="button" class="btn btn-plein" data-meteo="debut">Enregistrer ma météo du début</button><p class="mc-retour" data-retour="debut" aria-live="polite"></p></div>';
  } });

  PAGES.push({ id: 'theme', nom: 'Le thème', g: function () {
    var T = C.theme;
    return gauche('theme', 'Le thème du mois', T.titre, paras(T.texte));
  }, d: function () {
    var T = C.theme, carte = (DECOR.cartes || {}).theme;
    return '<h3 class="mc-h">' + esc(T.sousTitre) + '</h3>' +
      (carte ? '<figure class="mc-carte"><img src="' + esc(carte[0]) + '" alt="' + esc(carte[1]) + '" width="270" height="338" loading="lazy"></figure>' : '') +
      paras(T.texte2) +
      (T.exemples ? encadre(T.exemplesTitre || 'Au quotidien', '<ul class="mc-liste">' + T.exemples.map(function (x) { return '<li>' + md(x) + '</li>'; }).join('') + '</ul>') : '') +
      (T.exempleSpirale ? encadre(T.exempleSpiraleTitre || 'Et la spirale ?', '<p>' + md(T.exempleSpirale) + '</p>', 'mc-encadre-or') : '') +
      (T.question ? zone(T.question.k, T.question.q, { lignes: 2, ph: T.question.ph }) : '') +
      citation();
  } });

  PAGES.push({ id: 'comprendre', nom: (C.noms || {}).comprendre || 'Comprendre', g: function () {
    var K = C.comprendre;
    return gauche('comprendre', 'Comprendre', K.titre, paras(K.texte.slice(0, 1)));
  }, d: function () {
    var K = C.comprendre;
    return paras(K.texte.slice(1)) +
      (K.reperes ? '<div class="mc-reperes">' + K.reperes.map(function (r) { return '<div><p class="mc-encadre-t">' + esc(r.titre) + '</p><ul class="mc-liste">' + r.points.map(function (p) { return '<li>' + md(p) + '</li>'; }).join('') + '</ul></div>'; }).join('') + '</div>' : '') +
      (K.choix ? choix(K.choix.k, K.choix.q, K.choix.options) : '') +
      (K.regarder ? encadre(K.regarderTitre || 'Dans ton arbre, regarde', (K.regarderIntro ? '<p>' + md(K.regarderIntro) + '</p>' : '') + K.regarder.map(function (r) {
        r = Array.isArray(r) ? { k: r[0], q: r[1] } : r; return zone(r.k, r.q, { lignes: 2, ph: r.ph });
      }).join(''), 'mc-encadre-rose') : '') +
      (K.enLigne ? encadre(K.enLigneTitre || 'Dans ton arbre en ligne', '<p>' + md(K.enLigne) + '</p>') : '') +
      '<div class="mc-outils">' + (K.outils || []).map(function (o) { return '<a class="mc-outil" href="' + o[0] + '" target="_blank" rel="noopener"><b>' + esc(o[1]) + '</b><span>' + esc(o[2]) + '</span></a>'; }).join('') + '</div>';
  } });

  PAGES.push({ id: 'exercices', nom: 'Les exercices', g: function () {
    return gauche('exercices', 'Les exercices du mois', C.exercicesTitre || 'Voir, entendre, essayer', C.exercicesIntro ? '<p class="mc-intro">' + md(C.exercicesIntro) + '</p>' : '',
      sommaire(C.exercices));
  }, d: function () { return C.exercices.map(exercice).join(''); } });
  function exercice(x, i) {
      var corps = '';
      if (x.type === 'tableau') {
        corps = '<div class="mc-tableau">' + Array.apply(null, { length: x.rangs }).map(function (_, r) {
          return '<div class="mc-rang"><p class="mc-rang-t"><span>' + (r + 1) + '</span>' + esc((x.etiquettes || [])[r] || ('Fois ' + (r + 1))) + '</p>' +
            x.colonnes.map(function (c, j) { c = q(c); return zone(x.k + '-' + r + '-' + j, c.q, { lignes: 2, ph: ex(c.ph, r) }); }).join('') + '</div>';
        }).join('') + '</div>' + (x.apres ? zone(x.apres.k, x.apres.q, { lignes: 2, ph: x.apres.ph }) : '');
      } else if (x.type === 'questions') {
        corps = (x.choix ? choix(x.choix.k, x.choix.q, x.choix.options) : '') + x.questions.map(function (c) { return zone(c.k, c.q, { lignes: c.lignes || 2, ph: c.ph, court: c.court }); }).join('');
      } else if (x.type === 'blocs') {
        corps = Array.apply(null, { length: x.nb }).map(function (_, b) {
          return '<div class="mc-bloc"><p class="mc-rang-t"><span>' + (b + 1) + '</span>' + esc((x.etiquettes || [])[b] || ('Phrase ' + (b + 1))) + '</p>' + x.champs.map(function (c, j) { c = q(c); return zone(x.k + '-' + b + '-' + j, c.q, { court: true, ph: ex(c.ph, b) }); }).join('') + '</div>';
        }).join('');
      } else {
        corps = (x.gestes ? '<p class="mc-q">Des idées de gestes, pour t’inspirer :</p><ul class="mc-pastilles">' + x.gestes.map(function (g) { return '<li>' + esc(g) + '</li>'; }).join('') + '</ul>' : '') +
          zone(x.k, x.q || 'Ton geste', { lignes: 4, ph: x.ph || x.debut }) +
          (x.journal ? '<div class="mc-journal"><p class="mc-q">' + esc(x.journal.q) + '</p>' + Array.apply(null, { length: x.journal.n }).map(function (_, j) {
            return '<label class="mc-essai"><span>' + esc(x.journal.etiquette || 'Essai') + ' ' + (j + 1) + '</span><input type="text" data-k="' + x.journal.k + '-' + j + '"' + (j === 0 && x.journal.ph ? ' placeholder="' + esc(x.journal.ph) + '"' : '') + '></label>';
          }).join('') + '</div>' : '');
      }
      return '<section class="mc-exercice" id="mc-ex-' + esc(x.k) + '"><p class="mc-sur">Exercice ' + (i + 1) + '</p><h3 class="mc-h">' + esc(x.titre) + '</h3><p class="mc-consigne">' + md(x.consigne) + '</p>' +
        (x.pourquoi ? '<p class="mc-pourquoi"><b>Pourquoi cet exercice ?</b> ' + md(x.pourquoi) + '</p>' : '') +
        (x.astuce ? '<p class="mc-pourquoi"><b>Une astuce :</b> ' + md(x.astuce) + '</p>' : '') + corps + '</section>';
  }

  PAGES.push({ id: 'rituel', nom: (C.noms || {}).rituel || 'Rituel et méditation', g: function () {
    var R = C.rituel;
    return gauche('rituel', (C.noms || {}).rituelSur || 'Le rituel du mois', R.titre, '<p class="mc-intro">' + md(R.intro) + '</p>');
  }, d: function () {
    var R = C.rituel, M = C.meditation;
    return (R.materiel ? encadre('Ce qu’il te faut', '<p>' + md(R.materiel) + '</p>', 'mc-encadre-or') : '') +
      '<ol class="mc-etapes">' + R.etapes.map(function (e) { return '<li>' + md(e) + '</li>'; }).join('') + '</ol>' +
      (R.quand ? encadre('Quand t’en servir', '<p>' + md(R.quand) + '</p>') : '') +
      zone(R.note.k, R.note.q, { lignes: 3, ph: R.note.ph }) +
      encadre('Lâcher prise et faire confiance', '<p>Une fois ton intention posée, tu n’as pas besoin de la surveiller ni de tout contrôler. Fais ta part, les petits pas, et laisse la vie faire la sienne, parfois d’une manière que tu n’avais pas imaginée.</p>' +
        zone('confiance', 'Qu’est-ce que tu confies à la vie ce mois-ci, ce que tu acceptes de ne pas tout contrôler ?', { lignes: 2, ph: 'Exemple : le moment où ma sœur sera prête à en parler. Je fais ma part, je laisse venir le reste.' }), 'mc-encadre-rose') +
      '<div class="mc-separe">' + ORNEMENT + '</div>' +
      '<p class="mc-sur">La méditation du mois</p><h3 class="mc-h">' + esc(M.titre) + '</h3>' +
      lecteur(C.audio, 'Ta séance de visualisation du mois, plus de 20 minutes') + lecteur(C.audioCourt, 'La version courte') +
      '<p class="mc-note">Lis ce texte lentement, à voix basse ou dans ta tête, en t’arrêtant aux pauses. Tu peux aussi l’enregistrer avec ta propre voix et l’écouter les yeux fermés.</p>' +
      (M.conseil ? '<p class="mc-pourquoi">' + md(M.conseil) + '</p>' : '') +
      '<div class="mc-medit"' + (DECOR.meditation ? ' style="--fond:url(\'' + esc(fondUrl(DECOR.meditation)) + '\')"' : '') + '><div class="mc-medit-in">' + M.texte.map(function (x) { return /^\[/.test(x) ? '<p class="mc-pause">' + esc(x.slice(1, -1)) + '</p>' : '<p>' + md(x) + '</p>'; }).join('') + '</div></div>' +
      zone(M.note.k, M.note.q, { lignes: 3, ph: M.note.ph });
  } });
  function lecteur(src, titre) {
    if (!src) return '';
    return '<div class="mc-audio" data-audio hidden><p class="mc-q">' + esc(titre) + '</p><audio controls preload="metadata" src="' + esc(src) + '"></audio></div>';
  }
  function citation() {
    return '<blockquote class="mc-citation"' + (DECOR.citation ? ' style="--fond:url(\'' + esc(fondUrl(DECOR.citation)) + '\')"' : '') + '><span>' + esc(C.citation) + '</span></blockquote>';
  }

  PAGES.push({ id: 'semaines', nom: 'Mes 4 semaines', g: function () {
    var carte = (DECOR.cartes || {}).semaines;
    return gauche('semaines', 'Un pas par semaine', 'Mes quatre semaines',
      '<p class="mc-intro">Chaque semaine, une petite action, et trois questions pour voir ce qui avance. Les petites victoires comptent : ce sont elles qui, mises bout à bout, changent une vie.</p>',
      (carte ? '<figure class="mc-carte mc-carte-g"><img src="' + esc(carte[0]) + '" alt="' + esc(carte[1]) + '" width="270" height="338" loading="lazy"></figure>' : '') +
      '<p><button type="button" class="btn btn-trait mc-btn-ics" data-ics>Ajouter mes rappels à mon agenda</button></p><p class="mc-note">Un rappel chaque semaine et un pour ton bilan, dans ton propre agenda. Aucun e-mail ne t’est envoyé.</p>');
  }, d: function () {
    return C.semaines.map(function (s, i) {
      var k = 'sem' + (i + 1); if (Array.isArray(s)) s = { titre: s[0], texte: s[1] };
      return '<section class="mc-semaine" id="mc-semaine-' + (i + 1) + '"><div class="mc-sem-tete"><span class="mc-sem-n">Semaine ' + (i + 1) + '</span><h3>' + esc(s.titre) + '</h3><label class="mc-fait"><input type="checkbox" data-k="' + k + '-fait"> C’est fait</label></div><p>' + md(s.texte) + '</p>' +
        (s.exemple ? '<p class="mc-pourquoi">' + md(s.exemple) + '</p>' : '') +
        (window.MAYA_SEMAINES && window.Maya ? '<div class="mc-maya" data-maya-sem="' + i + '"></div>' : '') +
        zone(k + '-notes', 'Qu’as-tu remarqué, essayé ou ressenti cette semaine ?', { lignes: 3, ph: s.ph }) +
        zone(k + '-victoire', 'Quelle est ta victoire de la semaine, même toute petite ?', { court: true, ph: 'Exemple : j’ai tenu mon rendez-vous avec moi samedi' }) +
        zone(k + '-appris', 'Qu’as-tu appris sur toi cette semaine ?', { court: true, ph: 'Exemple : quand je suis fatigué·e, je dis oui plus vite' }) +
        zone(k + '-signes', 'Qu’est-ce qui est venu vers toi cette semaine ? Un signe, une rencontre, une coïncidence, une bonne nouvelle, même minuscule.', { lignes: 2, ph: 'Exemple : une amie m’a proposé exactement la balade dont j’avais envie, sans que je lui en parle.' }) +
        curseur(k + '-elan', 'Quel a été ton élan cette semaine ?', 'à plat', 'plein élan') + '</section>';
    }).join('');
  } });

  PAGES.push({ id: 'cloture', nom: 'Mon bilan du mois', g: function () {
    return gauche('cloture', 'Pour clore le mois · 10 minutes', 'Ma météo de fin de mois',
      '<p class="mc-intro">Prends ce temps à la fin du mois, même si tout n’a pas été fait. Tu vas comparer avec ton début de mois : c’est souvent là que l’on voit tout le chemin parcouru.</p><p>Un point gagné sur un curseur, c’est un vrai mouvement. Un point perdu, c’est une information, pas un échec : le mois a peut-être été chargé.</p>');
  }, d: function () {
    return '<section class="mc-etape"><h3><span>1</span> Là, maintenant, comment te sens-tu ?</h3>' + blocEchelles('mf') + '<div class="mc-graphes" id="mc-graphes"></div></section>' +
      '<section class="mc-etape"><h3><span>2</span> Ta roue de la vie, un mois plus tard</h3><p class="mc-consigne">Note à nouveau chaque domaine, sans regarder tes réponses du début. Les deux roues se superposent : regarde ce qui s’est arrondi.</p>' + blocRoue('rf') + '</section>' +
      '<section class="mc-etape"><h3><span>3</span> Ton objectif</h3><div class="mc-rappel" id="mc-rappel-obj"></div>' +
        '<div data-si-objectif>' + curseur('fin-obj', 'Où en es-tu de ton objectif ?', 'pas commencé', 'atteint') + '</div>' +
        zone('fin-preuves', 'Qu’as-tu vu, entendu ou ressenti qui te montre que tu as avancé ?', { lignes: 3, ph: 'Exemple : ma sœur m’a dit que j’avais l’air plus détendu·e.' }) +
      '</section>' +
      '<section class="mc-etape"><h3><span>4</span> ' + esc(C.bilanTitre || 'Ce que ce mois t’a apporté') + '</h3>' +
        (C.bilan || []).map(function (b) { return zone(b.k, b.q, { lignes: b.court ? 0 : 3, court: b.court, ph: b.ph }); }).join('') +
        zone('fin-fiertes', 'Quelles sont les trois choses dont tu es fier·e ce mois-ci ?', { lignes: 3, ph: 'Exemple : avoir dit non une fois, avoir appelé ma tante, avoir ouvert ce carnet chaque semaine.' }) +
        zone('fin-recadrage', 'Quelle difficulté as-tu rencontrée, et qu’est-ce qu’elle t’a appris ?', { lignes: 3, ph: 'Exemple : j’ai cédé deux fois. J’ai compris que la fatigue me fait retomber dans mes vieilles habitudes.' }) +
        '<div class="mc-deux">' + zone('fin-garder', 'Qu’est-ce que tu gardes de ce mois ?', { lignes: 2, ph: 'Exemple : la main suspendue' }) + zone('fin-laisser', 'Qu’est-ce que tu laisses derrière toi ?', { lignes: 2, ph: 'Exemple : l’idée que je dois tout porter' }) + '</div>' +
        zone('fin-recu', 'Qu’est-ce qui est arrivé ce mois-ci, peut-être autrement que tu l’imaginais ?', { lignes: 3, ph: 'Exemple : je n’ai pas eu de grande conversation avec ma mère, mais elle m’a appelée d’elle-même pour mon anniversaire.' }) +
        zone('fin-merci', 'Pour quoi dis-tu merci, à toi et à la vie ?', { lignes: 2, ph: 'Exemple : pour avoir essayé, même quand j’avais peur, et pour les mains tendues que je n’attendais pas.' }) +
      '</section>' +
      '<div class="mc-actions"><button type="button" class="btn btn-plein" data-meteo="fin">Enregistrer mon bilan du mois</button><p class="mc-retour" data-retour="fin" aria-live="polite"></p></div>' +
      lienSuivi() + aVenir() +
      '<p class="mc-note mc-mention">Ce carnet propose une démarche symbolique de réflexion et de développement personnel. Il ne remplace pas un accompagnement médical ou psychologique.</p>';
  } });
  function autreLivre() {
    var autre = SUIVI ? { sur: 'Le carnet « J’avance »', texte: 'Ton côté pour avancer : ta roue de la vie, ton objectif du mois, tes petits pas et ton intention qui prend vie.', lien: 'mon-carnet.html?mois=' + C.mois, bouton: 'Ouvrir mon carnet du mois' }
      : { sur: 'Le suivi « Je me libère »', texte: 'Ton côté pour te libérer : voir ce qui se rejoue, remonter à la source, déposer ce qui ne t’appartient pas, poser un geste nouveau.', lien: 'mon-suivi-mois.html?mois=' + C.mois, bouton: 'Ouvrir mon suivi du mois' };
    return '<aside class="mc-autre"><p class="mc-sur">Ton autre livre du mois</p><h3 class="mc-h">' + autre.sur + '</h3><p>' + autre.texte + '</p><p><a class="btn btn-plein" href="' + autre.lien + '">' + autre.bouton + '</a></p></aside>';
  }
  function lienSuivi() {
    if (!C.suivi) return '';
    return '<aside class="mc-encadre mc-encadre-rose mc-suivi"><p class="mc-encadre-t">Ce mois-ci, dans ton suivi « Je me libère »</p><p><b>' + esc(C.suivi.titre) + '.</b> ' + md(C.suivi.texte) + '</p><p><a class="btn btn-trait" href="mon-suivi-mois.html?mois=' + esc(C.mois) + '">Ouvrir mon suivi</a></p></aside>';
  }
  function aVenir() {
    if (!C.aVenir || !C.aVenir.length) return '';
    return '<section class="mc-avenir"><div class="mc-separe">' + ORNEMENT + '</div><p class="mc-sur">Le Cercle continue</p><h3 class="mc-h">Les prochains carnets</h3>' +
      '<div class="mc-avenir-l">' + C.aVenir.map(function (a) {
        return '<article class="mc-av">' + (a.image ? '<img src="' + esc(a.image) + '" alt="" loading="lazy" width="120" height="120">' : '') + '<div><p class="mc-sem-n">' + esc(a.mois) + '</p><p class="mc-av-t">' + esc(a.titre) + '</p><p>' + esc(a.texte) + '</p></div></article>';
      }).join('') + '</div><p class="mc-av-lien"><a class="btn btn-trait" href="mon-mois.html">Mes carnets précédents</a></p></section>';
  }

  /* ───── Mon suivi « Je me libère » : le même livre, avec ses propres pages ─────
     La saison, le thème, quatre semaines (voir, source, libérer, remplacer), la méditation, le bilan.
     Les semaines 2 et suivantes sont réservées au Cercle (la semaine 1 est offerte). */
  /* ───── Ta semaine maya (page « Mes 4 semaines ») ─────
     Compte traditionnel k'iche' : on réutilise Maya.calculer() (maya.js) ; textes dans maya-semaines.js.
     Semaines du 1er, 8, 15 et 22 ; la 4e va jusqu'au dernier jour du mois. Calculé à partir des repères de naissance. */
  var JOURS_C = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
  function isoJ(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function plusJ(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
  function jourCourt(d) { return (d.getDate() === 1 ? '1er' : d.getDate()) + ' ' + MOIS_NOMS_S[d.getMonth()]; }
  function semaineMaya(i, vuesAvant) {
    var MS = window.MAYA_SEMAINES, MT = window.MAYA_TEXTES, MY = window.Maya, pr = lireProfil();
    if (!MS || !MT || !MY) return '';
    var titre = '<p class="mc-maya-sur">Ta semaine maya</p>';
    if (!pr) {
      var pTon = PAGES.map(function (p) { return p.id; }).indexOf('tonmois');
      return titre + '<p class="mc-consigne">Pour voir ta semaine maya, indique d’abord ta date de naissance dans « Ton mois à toi ».</p>' + (pTon >= 0 ? '<p><button type="button" class="btn btn-trait" data-page="' + pTon + '">Indiquer mes repères de naissance</button></p>' : '');
    }
    var nat = MY.calculer(pr.date); if (!nat) return '';
    var p = String(C.mois).split('-'), an = +p[0], mo = +p[1] - 1;
    var debut = dateSemaine(i), fin = i < 3 ? plusJ(debut, 6) : new Date(an, mo + 1, 0);
    var S = MT.SIGNES, jours = [], vagues = [];
    for (var d = debut; d <= fin; d = plusJ(d, 1)) {
      var r = MY.calculer(isoJ(d)), dv = plusJ(d, -(r.nombre - 1));
      jours.push({ d: d, r: r });
      if (!vagues.some(function (v) { return v.cle === isoJ(dv); })) vagues.push({ cle: isoJ(dv), d: dv, signe: MY.calculer(isoJ(dv)).signe, n: 0 });
      vagues.forEach(function (v) { if (v.cle === isoJ(dv)) v.n++; });
    }
    function porte(sg) { return sg === nat.signe || sg % 4 === nat.signe % 4; }
    var types = {};
    /* les vagues de la semaine */
    var h = titre + '<h4 class="mc-maya-titre">Du ' + jourCourt(debut) + ' au ' + jourCourt(fin) + '</h4>';
    vagues.forEach(function (v) {
      var sg = S[v.signe], fv = plusJ(v.d, 12), fam = MS.FAMILLES[v.signe % 4];
      var deja = vuesAvant.indexOf(v.cle) >= 0; vuesAvant.push(v.cle);
      var tagV = porte(v.signe) ? ' <span class="mc-maya-tag">' + esc(MS.JOURS_PERSO.vague.nom) + '</span>' : '';
      if (porte(v.signe)) types.vague = 1;
      h += '<details class="mc-maya-vague"' + (deja ? '' : ' open') + '><summary><b>Vague de ' + esc(sg.kiche) + '</b> · du ' + jourCourt(v.d) + ' au ' + jourCourt(fv) + tagV + '</summary>';
      if (deja) h += '<p class="mc-note">La suite de la vague commencée plus tôt dans le mois : son descriptif complet est dans la semaine précédente.</p>';
      else {
        var batz = null; for (var k2 = 0; k2 < 13; k2++) { var rr = MY.calculer(isoJ(plusJ(v.d, k2))); if (rr.nombre === 8 && rr.signe === 10) batz = plusJ(v.d, k2); }
        h += '<p class="mc-maya-t">Le signe qui ouvre la vague</p><p><b>' + esc(sg.kiche) + ', ' + esc(sg.image) + '.</b> ' + esc(sg.symbole) + '</p>' +
          '<p class="mc-maya-t">Le déroulé</p><ul class="mc-maya-deroule">' +
            '<li><b>Du ' + jourCourt(v.d) + ' au ' + jourCourt(plusJ(v.d, 5)) + '</b> · ' + esc(MS.DEROULE.debut) + '</li>' +
            '<li><b>Le ' + jourCourt(plusJ(v.d, 6)) + '</b> · ' + esc(MS.DEROULE.milieu) + '</li>' +
            '<li><b>Du ' + jourCourt(plusJ(v.d, 7)) + ' au ' + jourCourt(fv) + '</b> · ' + esc(MS.DEROULE.fin) + '</li></ul>' +
          '<p>Cette vague appartient ' + esc(fam.nom) + '. ' + esc(fam.texte) + '</p>' +
          (batz ? '<p class="mc-maya-remarquable"><b>Le ' + jourCourt(batz) + '</b> · ' + esc(MS.REMARQUABLES.batz) + '</p>' : '') +
          '<p class="mc-maya-t">Ce qu’elle invite</p><p>' + esc(MS.VAGUES[v.signe]) + '</p>';
      }
      h += '</details>';
    });
    /* l'invitation de la semaine : celle de la vague qui couvre le plus de jours */
    var vp = vagues.reduce(function (a, v) { return v.n >= a.n ? v : a; }, vagues[0]), inv = MS.INVITATIONS[vp.signe];
    h += '<p class="mc-maya-t">Ton invitation de la semaine · vague de ' + esc(S[vp.signe].kiche) + '</p><ul class="mc-maya-invit"><li><b>En amour</b> · ' + esc(inv.amour) + '</li><li><b>Au travail</b> · ' + esc(inv.travail) + '</li><li><b>En famille et lignée</b> · ' + esc(inv.famille) + '</li></ul>';
    /* les jours */
    h += '<p class="mc-maya-t">Tes jours</p><ul class="mc-maya-jours">' + jours.map(function (j) {
      var r = j.r, sg = S[r.signe], tags = [], plus = '';
      if (r.kin === nat.kin) { tags.push('ton anniversaire maya'); plus += '<span>' + esc(MS.REMARQUABLES.anniversaire) + '</span>'; }
      if (r.signe === nat.signe) { tags.push(MS.JOURS_PERSO.signe.nom); types.signe = 1; }
      else if (r.signe % 4 === nat.signe % 4) { tags.push(MS.JOURS_PERSO.famille.nom); types.famille = 1; }
      if (r.nombre === nat.nombre) { tags.push(MS.JOURS_PERSO.nombre.nom); types.nombre = 1; }
      if (r.nombre === 8 && r.signe === 10) tags.push('8 B’atz’');
      var perso = tags.length > 0;
      if (perso) { var SS = MS.SIGNES[r.signe]; plus += '<span>' + esc(SS.sens) + '</span><span><b>En amour</b> · ' + esc(SS.amour) + ' <b>Au travail</b> · ' + esc(SS.travail) + ' <b>En famille</b> · ' + esc(SS.famille) + '</span>'; }
      if ([1, 6, 11, 16].indexOf(r.signe) >= 0) tags.push('porteur de l’année');
      return '<li class="' + (perso ? 'perso' : '') + '"><b>' + JOURS_C[j.d.getDay()] + ' ' + j.d.getDate() + '</b><div><span class="mc-maya-jour">' + r.nombre + ' ' + esc(sg.kiche) + '</span> · ' + esc(sg.image) + ' · <i>' + esc(String(MS.NOMBRES[r.nombre]).split(' :')[0]) + '</i>' +
        (tags.length ? ' ' + tags.map(function (t) { return '<span class="mc-maya-tag">' + esc(t) + '</span>'; }).join(' ') : '') + (plus ? '<div class="mc-maya-plus">' + plus + '</div>' : '') + '</div></li>';
    }).join('') + '</ul>';
    var leg = Object.keys(MS.JOURS_PERSO).filter(function (t) { return types[t]; }).map(function (t) { return '<li><b>' + esc(MS.JOURS_PERSO[t].nom) + '</b> · ' + esc(MS.JOURS_PERSO[t].texte) + '</li>'; });
    if (jours.some(function (j) { return [1, 6, 11, 16].indexOf(j.r.signe) >= 0; })) leg.push('<li><b>porteur de l’année</b> · ' + esc(MS.REMARQUABLES.porteur) + '</li>');
    if (leg.length) h += '<ul class="mc-maya-legende">' + leg.join('') + '</ul>';
    h += '<p class="mc-maya-cadre">Ton signe de naissance : <b>' + nat.nombre + ' ' + esc(S[nat.signe].kiche) + '</b>. ' + esc(MS.CADRE) + '</p>';
    return h;
  }
  function majSemainesMaya() {
    var vues = [];
    racine.querySelectorAll('[data-maya-sem]').forEach(function (z) { z.innerHTML = semaineMaya(+z.getAttribute('data-maya-sem'), vues); });
  }
  window.addEventListener('beforeprint', function () { racine.querySelectorAll('.mc-maya details').forEach(function (d) { d.open = true; }); });
  function dateSemaine(k) { var p = String(C.mois).split('-'); return new Date(+p[0], +p[1] - 1, 1 + 7 * k); }
  function jourMois(d) { return (d.getDate() === 1 ? '1er' : d.getDate()) + ' ' + MOIS_NOMS_S[d.getMonth()]; }
  var MOIS_NOMS_S = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  function offreCercle() {
    return '<aside class="mc-encadre mc-encadre-or mc-verrou"><p class="mc-encadre-t">La suite de ton suivi fait partie du Cercle</p><p>Ta semaine 1 est offerte. Avec Le Cercle, tu vis tout le mois : remonter à la source, te libérer, poser un geste nouveau, et ton bilan. En plus de ton carnet du mois, de ton guide et de tout le site.</p><p><a class="btn btn-plein" href="abonnement.html">Découvrir Le Cercle, 1 mois offert</a></p></aside>';
  }
  function suiviPages() {
    var P = [], S = window.GENESOLIA_SAISONS, sa = S && S[+String(C.mois).split('-')[1]];
    P.push({ id: 'saison', nom: 'La saison', g: function () {
      return gauche('saison', (sa ? sa.mois : NOM_MOIS) + ' · la saison', sa ? sa.titre.charAt(0).toUpperCase() + sa.titre.slice(1) : C.titre,
        sa ? '<p class="mc-intro">' + esc(sa.texte) + '</p>' : '', sa ? '<p class="mc-permission"><b>Ce que ça veut dire pour toi :</b> ' + esc(sa.permission) + '</p>' : '');
    }, d: function () {
      return (C.saisonLien ? '<p>' + md(C.saisonLien) + '</p>' : '') +
        (sa ? encadre('Un geste de saison', '<p>' + esc(sa.geste) + '</p>', 'mc-encadre-or') : '') +
        '<section class="mc-etape"><h3><span>1</span> Là, maintenant</h3><p class="mc-consigne">Avant de commencer, prends une photo de ton état intérieur. Tu la compareras à la fin du mois.</p>' +
          curseur('int-debut', C.intensiteQ || 'À quel point ce thème pèse-t-il dans ta vie aujourd’hui ?', 'presque pas', 'énormément') +
          zone('mot-debut', 'En un mot, comment te sens-tu face à ce thème ?', { court: true, ph: 'Exemple : fatigué·e, curieux·se, en colère, prêt·e…' }) +
          zone('liberer-souhait', 'Qu’aimerais-tu libérer ce mois-ci ?', { lignes: 2, ph: C.souhaitPh || 'Exemple : cette impression de devoir tout porter seul·e.' }) + '</section>' +
        (sa ? '<blockquote class="mc-citation"' + (DECOR.citation ? ' style="--fond:url(\'' + esc(fondUrl(DECOR.citation)) + '\')"' : '') + '><span>' + esc(sa.citation) + '</span></blockquote>' : '');
    } });
    P.push({ id: 'theme', nom: 'Le thème', g: function () { return gauche('theme', 'Le thème du mois', C.theme.titre, paras(C.theme.texte)); },
      d: PAGES.filter(function (x) { return x.id === 'theme'; })[0].d });
    C.semaines.forEach(function (w, k) {
      P.push({ id: w.cle, nom: w.nom || ('Semaine ' + (k + 1)), g: function () {
        return gauche(w.cle, 'Semaine ' + (k + 1) + ' · ' + (w.etape || ''), w.titre, '<p class="mc-intro">' + md(w.intro) + '</p>',
          '<p class="mc-quand">À vivre à partir du ' + jourMois(dateSemaine(k)) + '. Tu peux la lire avant, et y revenir quand tu veux.</p>' +
          (w.exercices && w.exercices.length > 1 ? sommaire(w.exercices) : ''));
      }, d: function () {
        if (k > 0 && !membre) return offreCercle();
        var R = w.rituel;
        return (w.texte ? paras([].concat(w.texte)) : '') + (w.exercices || []).map(exercice).join('') +
          (R ? '<div class="mc-separe">' + ORNEMENT + '</div><p class="mc-sur">Le rituel de la semaine</p><h3 class="mc-h">' + esc(R.titre) + '</h3><p>' + md(R.intro) + '</p>' +
            (R.materiel ? encadre('Ce qu’il te faut', '<p>' + md(R.materiel) + '</p>', 'mc-encadre-or') : '') +
            '<ol class="mc-etapes">' + R.etapes.map(function (e) { return '<li>' + md(e) + '</li>'; }).join('') + '</ol>' +
            (R.note ? zone(R.note.k, R.note.q, { lignes: 3, ph: R.note.ph }) : '') : '') +
          (w.conseil ? encadre('Pour t’aider cette semaine', '<p>' + md(w.conseil) + '</p>') : '') +
          '<label class="mc-fait mc-fait-sem"><input type="checkbox" data-k="' + w.cle + '-fait"> J’ai vécu cette semaine</label>';
      } });
    });
    P.push({ id: 'meditation', nom: 'La méditation', g: function () {
      var M = C.meditation;
      return gauche('meditation', 'La séance du mois', M.titre, '<p class="mc-intro">' + md(M.intro || 'Une méditation guidée pour accompagner ce que tu libères ce mois-ci. Fais-la une fois au calme, puis reviens-y quand tu en as besoin.') + '</p>');
    }, d: function () {
      if (!membre) return offreCercle();
      var M = C.meditation;
      return lecteur(C.audio, 'Ta séance de libération du mois, plus de 20 minutes') + lecteur(C.audioCourt, 'La version courte') +
        '<p class="mc-note">Lis ce texte lentement, à voix basse ou dans ta tête, en t’arrêtant aux pauses. Si une émotion devient trop forte, reviens simplement à ton souffle et à tes pieds sur le sol.</p>' +
        (M.conseil ? '<p class="mc-pourquoi">' + md(M.conseil) + '</p>' : '') +
        '<div class="mc-medit"' + (DECOR.meditation ? ' style="--fond:url(\'' + esc(fondUrl(DECOR.meditation)) + '\')"' : '') + '><div class="mc-medit-in">' + M.texte.map(function (x) { return /^\[/.test(x) ? '<p class="mc-pause">' + esc(x.slice(1, -1)) + '</p>' : '<p>' + md(x) + '</p>'; }).join('') + '</div></div>' +
        zone(M.note.k, M.note.q, { lignes: 3, ph: M.note.ph });
    } });
    P.push({ id: 'bilan', nom: 'Mon bilan', g: function () {
      return gauche('bilan', 'Pour clore le mois · 10 minutes', 'Ce qui s’est libéré', '<p class="mc-intro">Prends ce temps même si tout n’a pas été fait. Libérer, ce n’est pas effacer : c’est porter plus léger, et reconnaître plus vite. Chaque mois, tu montes d’un cran sur la spirale.</p>');
    }, d: function () {
      if (!membre) return offreCercle();
      return '<section class="mc-etape"><h3><span>1</span> Là, maintenant</h3><div class="mc-rappel" data-rappel-souhait hidden></div>' + curseur('int-fin', C.intensiteQ || 'À quel point ce thème pèse-t-il dans ta vie aujourd’hui ?', 'presque pas', 'énormément') + '<div class="mc-compare-int" id="mc-compare-int"></div></section>' +
        '<section class="mc-etape"><h3><span>2</span> ' + esc(C.bilanTitre || 'Ce que ce mois t’a apporté') + '</h3>' + (C.bilan || []).map(function (b) { return zone(b.k, b.q, { lignes: 3, ph: b.ph }); }).join('') +
          zone('fin-merci', 'Pour quoi remercies-tu la personne que tu étais au début du mois ?', { lignes: 2, ph: 'Exemple : pour avoir osé regarder, même quand c’était inconfortable.' }) + '</section>' +
        (C.carnet ? '<aside class="mc-encadre mc-encadre-rose mc-suivi"><p class="mc-encadre-t">Avec ton carnet « J’avance »</p><p><b>' + esc(C.carnet.titre) + '.</b> ' + md(C.carnet.texte) + '</p><p><a class="btn btn-trait" href="mon-carnet.html?mois=' + esc(C.mois) + '">Ouvrir mon carnet du mois</a></p></aside>' : '') +
        aVenir() + '<p class="mc-note mc-mention">Ce suivi propose une démarche symbolique de réflexion et de développement personnel. Il ne remplace pas un accompagnement médical ou psychologique.</p>';
    } });
    return P;
  }
  function comparerIntensite() {
    var z = document.getElementById('mc-compare-int'); if (!z) return;
    var a = D.v['int-debut'], b = D.v['int-fin'], sh = (D.v['liberer-souhait'] || '').trim();
    racine.querySelectorAll('[data-rappel-souhait]').forEach(function (x) { x.hidden = !sh; x.innerHTML = sh ? '<p class="mc-q">Au début du mois, tu voulais libérer</p><p class="mc-cite">« ' + esc(sh) + ' »</p>' : ''; });
    if (typeof a !== 'number' || typeof b !== 'number') { z.innerHTML = typeof a === 'number' ? '<p class="mc-note">Début du mois : ' + a + '/10. Place le curseur pour voir le chemin parcouru.</p>' : ''; return; }
    var d = b - a;
    z.innerHTML = '<p class="mc-int-phrase">Début du mois : <b>' + a + '/10</b>, aujourd’hui : <b>' + b + '/10</b>' + (d ? ' (' + (d > 0 ? '+' + d : '−' + Math.abs(d)) + ')' : '') + '.</p>' +
      '<p class="mc-note">' + (d < 0 ? 'Ce thème pèse moins qu’au début du mois : c’est le fruit de ce que tu as osé regarder et changer.' : d === 0 ? 'Le poids est le même, et ce n’est pas un échec : tu le connais mieux, et tu le reconnais plus vite.' : 'Regarder un thème peut le rendre plus présent au début : c’est souvent le signe qu’il se met en mouvement.') + '</p>';
  }
  if (SUIVI) PAGES = suiviPages();

  /* ───── Construction ───── */
  var courante = 0, enCours = false;
  var reduit = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function modeLivre() { return window.matchMedia('(min-width: 1200px)').matches; }
  function construire() {
    var fond = DECOR.couverture ? ' style="--fond:url(\'' + esc(fondUrl(DECOR.couverture)) + '\')"' : '';
    racine.innerHTML =
      '<header class="mc-tete"' + fond + '><p class="mc-sur">Le Cercle · ' + (SUIVI ? 'Ton suivi « Je me libère » ' : 'Le carnet « J’avance » ') + esc(de(NOM_MOIS)) + ' ' + esc(String(C.nomMois).split(' ')[1] || '') + '</p>' +
        '<p class="mc-perso" id="mc-perso" hidden></p><h1>' + esc(C.titre) + '</h1><p>' + esc(C.sousTitre) + '</p>' +
        '<div class="mc-barre"><div class="mc-progres" aria-label="Avancement du carnet"><span id="mc-progres-barre"></span></div><span id="mc-progres-texte"></span><span class="mc-etat" id="mc-etat" aria-live="polite"></span></div>' +
        '<div class="mc-boutons"><div class="mc-imp-zone"><button type="button" class="btn btn-trait" id="mc-imprimer" aria-expanded="false" aria-controls="mc-imp-choix">' + (SUIVI ? 'Imprimer mon suivi rempli' : 'Imprimer mon carnet rempli') + '</button>' +
          '<div class="mc-imp-choix" id="mc-imp-choix" hidden><p>Quelle version veux-tu imprimer ?</p>' +
            '<button type="button" data-imprimer="simple"><b>Simple</b><span>Le texte et tes réponses, sans images : économe en encre.</span></button>' +
            '<button type="button" data-imprimer="decor"><b>Avec le décor</b><span>Les illustrations, les couleurs et les ornements.</span></button></div></div>' +
          (C.pdf ? '<a class="btn btn-trait" href="' + esc(C.pdf) + '" download>Version papier vierge (PDF)</a>' : '') +
          (SUIVI ? '<a class="btn btn-trait" href="mon-carnet.html?mois=' + esc(C.mois) + '">Mon carnet du mois</a>' : '<a class="btn btn-trait" href="mon-suivi-mois.html?mois=' + esc(C.mois) + '">Mon suivi du mois</a>') +
          '<button type="button" class="btn btn-trait" data-ics>Ajouter mes rappels à mon agenda</button></div>' +
        '<div class="mc-compte" id="mc-compte" hidden></div></header>' +
      '<nav class="mc-onglets" aria-label="Pages du carnet">' + PAGES.map(function (p, i) { return '<button type="button" data-page="' + i + '"><span>' + (i + 1) + '</span>' + esc(p.nom) + '</button>'; }).join('') + '</nav>' +
      '<div class="mc-livre" id="mc-livre">' + PAGES.map(function (p, i) {
        return '<article class="mc-page" id="page-' + p.id + '" data-p="' + i + '"' + (i ? ' hidden' : '') + ' aria-label="Page ' + (i + 1) + ' : ' + esc(p.nom) + '">' +
          '<p class="mc-pagenum">Page ' + (i + 1) + ' sur ' + PAGES.length + '</p>' +
          '<div class="mc-g">' + p.g() + '<span class="mc-folio">' + (2 * i + 1) + '</span></div>' +
          '<div class="mc-d">' + p.d() +
            '<div class="mc-nav">' + (i ? '<button type="button" class="btn btn-trait" data-page="' + (i - 1) + '">Page précédente</button>' : '<span></span>') + (i < PAGES.length - 1 ? '<button type="button" class="btn btn-plein" data-page="' + (i + 1) + '">Page suivante</button>' : '') + '</div>' +
            '<span class="mc-folio">' + (2 * i + 2) + '</span></div></article>';
      }).join('') + '</div>' +
      '<p class="mc-aide-livre">Astuce : sur un grand écran, tourne les pages avec les flèches du clavier. Sur téléphone ou tablette, glisse du doigt vers la gauche ou la droite.</p>' +
      autreLivre();

    racine.addEventListener('click', function (e) {
      var t = e.target;
      var imp = t.closest('[data-imprimer]'); if (imp) { imprimer(imp.getAttribute('data-imprimer')); return; }
      if (t.closest('#mc-imprimer')) { basculerChoix(); return; }
      if (!t.closest('.mc-imp-choix')) basculerChoix(false);
      var b = t.closest('[data-page]'); if (b) { aller(+b.getAttribute('data-page')); setTimeout(function () { defiler(document.getElementById('mc-livre'), true); }, 30); return; }
      var m = t.closest('[data-meteo]'); if (m) { enregistrerMeteo(m.getAttribute('data-meteo'), m); return; }
      if (t.closest('[data-ics]')) { telechargerRappels(); return; }
      var v = t.closest('[data-vers]'); if (v) { var cibleEx = document.getElementById(v.getAttribute('data-vers')); if (cibleEx) defiler(cibleEx, true); return; }
    });
    racine.addEventListener('input', changement);
    racine.addEventListener('change', changement);
    /* Un curseur touché sans le bouger (clic sur sa position) compte aussi comme une réponse */
    racine.addEventListener('pointerup', function (e) { if (e.target.type === 'range') changement({ target: e.target }); });
    racine.addEventListener('keyup', function (e) { if (e.target.type === 'range' && /^(Arrow|Home|End|Page)/.test(e.key)) changement({ target: e.target }); });
    document.addEventListener('keydown', clavier);
    glisser();
    racine.querySelectorAll('[data-audio] audio').forEach(function (a) {
      a.addEventListener('loadedmetadata', function () { a.parentNode.hidden = false; });
      a.addEventListener('error', function () { a.parentNode.remove(); });
    });
    window.addEventListener('resize', collant);
    window.addEventListener('hashchange', function () { var c = cible(); if (c.p !== courante) aller(c.p, { ancre: c.ancre }); });
    var c = cible();
    aller(c.p, { initial: true, ancre: c.ancre });
  }
  function basculerChoix(ouvrir) {
    var z = document.getElementById('mc-imp-choix'), b = document.getElementById('mc-imprimer'); if (!z) return;
    var o = ouvrir === undefined ? z.hidden : ouvrir;
    z.hidden = !o; b.setAttribute('aria-expanded', o ? 'true' : 'false');
  }
  /* #semaines-2 ouvre la page des semaines sur la semaine 2 (liens des rappels d'agenda) */
  function cible() {
    var h = (location.hash || '').replace('#', ''), ids = PAGES.map(function (p) { return p.id; });
    var i = ids.indexOf(h); if (i >= 0) return { p: i };
    var m = /^([a-z]+)-(\d)$/.exec(h);
    if (m && ids.indexOf(m[1]) >= 0) return { p: ids.indexOf(m[1]), ancre: m[1] === 'semaines' ? 'mc-semaine-' + m[2] : null };
    return { p: 0 };
  }
  function hautFixe() {
    var en = document.querySelector('.entete'), ong = racine.querySelector('.mc-onglets');
    var h = en && getComputedStyle(en).position === 'sticky' ? en.offsetHeight : 0;
    racine.style.setProperty('--haut', h + 'px');
    racine.style.setProperty('--haut-livre', (h + (ong ? ong.offsetHeight : 0) + 12) + 'px');
    return h + (ong ? ong.offsetHeight : 0);
  }
  function defiler(el, instant) {
    var y = Math.max(0, el.getBoundingClientRect().top + window.pageYOffset - hautFixe() - 8);
    if (Math.abs(window.pageYOffset - y) > 4) window.scrollTo({ top: y, behavior: instant || reduit ? 'auto' : 'smooth' });
  }
  function montrer(i) {
    courante = i;
    racine.querySelectorAll('.mc-page').forEach(function (p) { p.hidden = +p.getAttribute('data-p') !== i; });
    racine.querySelectorAll('.mc-onglets [data-page]').forEach(function (b) { var a = +b.getAttribute('data-page') === i; b.classList.toggle('actif', a); if (a) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    try { history.replaceState(null, '', '#' + PAGES[i].id); } catch (e) {}
    if (PAGES[i].id === 'cloture') comparer();
    var ong = racine.querySelector('.mc-onglets'), act = ong.querySelector('.actif');
    if (act) ong.scrollLeft = act.offsetLeft - (ong.clientWidth - act.offsetWidth) / 2;
    collant();
  }
  function aller(i, o) {
    o = o || {};
    if (i < 0 || i >= PAGES.length || enCours) return;
    var avant = courante, livre = document.getElementById('mc-livre');
    hautFixe();
    if (o.initial || i === avant || reduit) {
      montrer(i);
      if (!o.initial) defiler(livre, true);
    } else if (modeLivre()) {
      defiler(livre, true);
      tourner(avant, i);
    } else {
      defiler(livre, true);
      montrer(i);
      var pg = racine.querySelector('.mc-page[data-p="' + i + '"]');
      pg.classList.remove('mc-glisse-g', 'mc-glisse-d'); void pg.offsetWidth;
      pg.classList.add(i > avant ? 'mc-glisse-g' : 'mc-glisse-d');
    }
    if (o.ancre) setTimeout(function () { var a = document.getElementById(o.ancre); if (a) defiler(a, true); }, o.initial ? 300 : 750);
  }

  /* ───── La page qui tourne (ordinateur) ─────
     On photographie les deux pages actuelles (copies inertes), on affiche la nouvelle page dessous,
     puis une feuille tourne autour de la reliure : recto = ancienne page, verso = nouvelle page. */
  function copie(el) {
    var c = el.cloneNode(true);
    var src = el.querySelectorAll('textarea, input'), dst = c.querySelectorAll('textarea, input');
    for (var n = 0; n < src.length; n++) { if (src[n].type === 'checkbox' || src[n].type === 'radio') dst[n].checked = src[n].checked; else dst[n].value = src[n].value; }
    c.querySelectorAll('[id]').forEach(function (x) { x.removeAttribute('id'); });
    c.querySelectorAll('[name]').forEach(function (x) { x.removeAttribute('name'); });
    c.querySelectorAll('[data-k]').forEach(function (x) { x.removeAttribute('data-k'); });
    c.querySelectorAll('[data-val],[data-page],[data-meteo],[data-ics],[data-rappel-obj],[data-curseur]').forEach(function (x) { ['data-val', 'data-page', 'data-meteo', 'data-ics', 'data-rappel-obj', 'data-curseur'].forEach(function (a) { x.removeAttribute(a); }); });
    c.querySelectorAll('audio').forEach(function (x) { x.remove(); });
    c.removeAttribute('id');
    return c;
  }
  function volet(cote, contenu, hauteur) {
    var v = document.createElement('div');
    v.className = 'mc-volet mc-volet-' + cote; v.style.height = hauteur + 'px';
    v.setAttribute('aria-hidden', 'true'); v.setAttribute('inert', '');
    if (contenu) v.appendChild(contenu);
    return v;
  }
  function tourner(avant, apres) {
    var livre = document.getElementById('mc-livre');
    var vieux = racine.querySelector('.mc-page[data-p="' + avant + '"]'), neuf = racine.querySelector('.mc-page[data-p="' + apres + '"]');
    var vg = copie(vieux.querySelector('.mc-g')), vd = copie(vieux.querySelector('.mc-d'));
    enCours = true;
    montrer(apres);
    var ng = copie(neuf.querySelector('.mc-g')), nd = copie(neuf.querySelector('.mc-d'));
    var r = livre.getBoundingClientRect();
    var h = Math.max(320, Math.min(livre.offsetHeight, window.innerHeight - Math.max(0, r.top)));
    var suivant = apres > avant;
    var fixe = volet(suivant ? 'g' : 'd', suivant ? vg : vd, h);
    var feuille = document.createElement('div');
    feuille.className = 'mc-feuille mc-feuille-' + (suivant ? 'suiv' : 'prec'); feuille.style.height = h + 'px';
    feuille.setAttribute('aria-hidden', 'true');
    var recto = volet(suivant ? 'd' : 'g', suivant ? vd : vg, h), verso = volet(suivant ? 'g' : 'd', suivant ? ng : nd, h);
    recto.classList.add('mc-recto'); verso.classList.add('mc-verso');
    feuille.appendChild(recto); feuille.appendChild(verso);
    livre.appendChild(fixe); livre.appendChild(feuille);
    requestAnimationFrame(function () { requestAnimationFrame(function () { feuille.classList.add('mc-tourne'); }); });
    var fini = false;
    function finir() { if (fini) return; fini = true; fixe.remove(); feuille.remove(); enCours = false; collant(); }
    feuille.addEventListener('transitionend', finir);
    setTimeout(finir, 1100);
  }

  function clavier(e) {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var t = e.target, tag = t && t.tagName;
    if (tag === 'TEXTAREA' || tag === 'SELECT' || (tag === 'INPUT' && t.type !== 'checkbox' && t.type !== 'radio') || (t && t.isContentEditable)) return;
    if (tag === 'INPUT') return; /* les boutons radio utilisent déjà les flèches */
    e.preventDefault();
    aller(courante + (e.key === 'ArrowRight' ? 1 : -1));
  }
  function glisser() {
    var livre = document.getElementById('mc-livre'), x0 = null, y0 = 0, t0 = 0;
    livre.addEventListener('touchstart', function (e) {
      if (modeLivre() || e.touches.length !== 1 || e.target.closest('input, textarea, select, audio, .mc-onglets')) { x0 = null; return; }
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; t0 = Date.now();
    }, { passive: true });
    livre.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
      if (Math.abs(dx) > 70 && Math.abs(dx) > 2 * Math.abs(dy) && Date.now() - t0 < 900) aller(courante + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }
  /* La page de gauche reste visible pendant qu'on remplit la droite, si elle tient dans l'écran */
  function collant() {
    var pg = racine.querySelector('.mc-page[data-p="' + courante + '"]'); if (!pg) return;
    var g = pg.querySelector('.mc-g-in'); if (!g) return;
    var dispo = window.innerHeight - hautFixe() - 24;
    g.classList.toggle('mc-collant', modeLivre() && g.offsetHeight < dispo);
  }

  /* ───── Valeurs ───── */
  function valeurDe(el) { return el.type === 'checkbox' ? el.checked : el.hasAttribute('data-radio') ? (el.checked ? el.value : undefined) : el.value; }
  function appliquer() {
    racine.querySelectorAll('.mc-livre [data-k]').forEach(function (el) {
      var k = el.getAttribute('data-k'), v = D.v[k];
      if (v === undefined) { if (el.type === 'range') afficherVal(el); return; }
      if (el.type === 'checkbox') el.checked = !!v;
      else if (el.hasAttribute('data-radio')) el.checked = el.value === v;
      else el.value = v;
      if (el.type === 'range') afficherVal(el);
    });
    racine.querySelectorAll('details[data-plus]').forEach(function (d) {
      var cles = d.getAttribute('data-plus') === 'lettre' ? ['proj-an'] : ['ancre-souvenir', 'ancre-mot'];
      if (cles.some(function (k) { return (D.v[k] || '').toString().trim(); })) d.open = true;
    });
    progres(); verifierObjectif(); perso(); majRadars(); comparerIntensite();
  }
  function afficherVal(el) {
    var k = el.getAttribute('data-k'), b = racine.querySelector('[data-val="' + k + '"]'), c = racine.querySelector('[data-curseur="' + k + '"]');
    var touche = typeof D.v[k] === 'number';
    if (!touche) el.value = 0;
    if (c) c.classList.toggle('mc-vide', !touche);
    if (b) b.textContent = touche ? el.value + ' sur 10' : 'Place le curseur';
    el.style.setProperty('--pc', (el.value * 10) + '%');
  }
  function changement(e) {
    var el = e.target; if (!el.hasAttribute || !el.hasAttribute('data-k')) return;
    var v = valeurDe(el); if (v === undefined) return;
    var k = el.getAttribute('data-k'), nv = el.type === 'range' ? +v : v;
    if (D.v[k] === nv && el.type === 'range' && e.type === undefined && !racine.querySelector('[data-curseur="' + k + '"].mc-vide')) return;
    D.v[k] = nv; D.t = D.t || {}; D.t[k] = Date.now();
    if (el.type === 'range') afficherVal(el);
    if (k === 'obj-quoi') { verifierObjectif(); perso(); }
    if (/^(md|mf|sem\d)-/.test(k) && PAGES[courante].id === 'cloture') comparer();
    if (/^(rd|rf)-/.test(k)) majRadars();
    if (/^int-/.test(k)) comparerIntensite();
    progres(); sauver();
  }
  function verifierObjectif() {
    var a = racine.querySelector('[data-aide="obj-quoi"]'); if (!a) return;
    var t = (D.v['obj-quoi'] || '').toLowerCase();
    var negatif = /\bne\s+\S+\s+(pas|plus|jamais)\b|\bn['’]\S+\s+(pas|plus|jamais)\b|\barr[êe]ter\b|\bmoins\b|\béviter\b|\bne plus\b/.test(t);
    a.classList.toggle('mc-alerte', negatif);
    a.textContent = negatif ? 'Ton objectif parle de ce que tu ne veux plus. Qu’est-ce que tu veux à la place ? On avance mieux vers une image positive.' : 'Formule ce que tu veux à la place de ce que tu ne veux plus.';
  }
  /* Progression par étapes : une étape compte dès qu'elle a une réponse.
     Carnet : météo, roue, objectif, exercices, 4 semaines, bilan. Suivi : point de départ, chaque semaine, méditation, bilan. */
  function repondu(k) { var v = D.v[k]; return typeof v === 'number' || v === true || (typeof v === 'string' && v.trim() !== ''); }
  function clesDe(sel) { var l = []; racine.querySelectorAll(sel).forEach(function (el) { var k = el.getAttribute('data-k'); if (l.indexOf(k) < 0) l.push(k); }); return l; }
  function etapes() {
    var E = [];
    function ajoute(nom, page, cles) { E.push({ nom: nom, page: page, fait: cles.some(repondu) }); }
    if (SUIVI) {
      ajoute('Point de départ', 'saison', clesDe('#page-saison [data-k]'));
      C.semaines.forEach(function (w, i) { ajoute('Semaine ' + (i + 1), w.cle, clesDe('#page-' + w.cle + ' [data-k]')); });
      ajoute('Méditation', 'meditation', clesDe('#page-meditation [data-k]'));
      ajoute('Bilan', 'bilan', clesDe('#page-bilan [data-k]'));
    } else {
      ajoute('Météo', 'ouverture', clesDe('#page-ouverture [data-k^="md-"]'));
      ajoute('Roue', 'ouverture', clesDe('#page-ouverture [data-k^="rd-"]'));
      ajoute('Objectif', 'ouverture', ['obj-quoi']);
      ajoute('Exercices', 'exercices', clesDe('#page-exercices [data-k]'));
      C.semaines.forEach(function (s, i) { ajoute('Semaine ' + (i + 1), 'semaines', clesDe('#page-semaines [data-k^="sem' + (i + 1) + '-"]')); });
      ajoute('Bilan', 'cloture', clesDe('#page-cloture [data-k]'));
    }
    return E;
  }
  function progres() {
    var E = etapes(), n = E.filter(function (e) { return e.fait; }).length, p = E.length ? Math.round(n / E.length * 100) : 0;
    var b = document.getElementById('mc-progres-barre'); if (b) b.style.width = p + '%';
    var t = document.getElementById('mc-progres-texte'); if (t) t.textContent = n + (n > 1 ? ' étapes' : ' étape') + ' sur ' + E.length;
    /* Pour l'accueil de l'appli Le Cercle : où tu en es (sur cet appareil), et la prochaine étape à ouvrir */
    var suite = E.filter(function (e) { return !e.fait; })[0];
    try { localStorage.setItem('genesolia-avancee-' + CLE, JSON.stringify({ n: n, total: E.length, suite: suite ? { nom: suite.nom, page: suite.page } : null })); } catch (e) {}
    PAGES.forEach(function (pg, i) {
      var ets = E.filter(function (e) { return e.page === pg.id; }), ok = ets.length && ets.every(function (e) { return e.fait; });
      var bt = racine.querySelector('.mc-onglets [data-page="' + i + '"]');
      if (bt) { bt.classList.toggle('mc-ok', !!ok); bt.setAttribute('aria-label', pg.nom + (ok ? ', terminé' : '')); }
    });
  }
  function premierMot(t) { var m = String(t || '').trim().split(/\s+/)[0] || ''; return m ? (m.charAt(0).toUpperCase() + m.slice(1)).slice(0, 30) : ''; }
  /* Prénom (si connectée) et rappel de l'objectif en haut des pages suivantes */
  function perso() {
    var z = document.getElementById('mc-perso');
    if (z) { z.hidden = !prenom; z.textContent = prenom ? (SUIVI ? 'Ton suivi ' : 'Ton carnet ') + de(NOM_MOIS) + ', ' + prenom : ''; }
    var obj = (D.v['obj-quoi'] || '').trim();
    racine.querySelectorAll('.mc-livre [data-si-objectif]').forEach(function (x) { x.hidden = !obj; });
    racine.querySelectorAll('.mc-livre [data-rappel-obj]').forEach(function (r) {
      r.hidden = !obj;
      r.innerHTML = obj ? '<span>Ton objectif du mois</span>« ' + esc(obj) + ' »' : '';
    });
  }

  /* ───── Enregistrement ───── */
  function etat(t) { var e = document.getElementById('mc-etat'); if (e) e.textContent = t; }
  function sauver() {
    try { localStorage.setItem(CLE_LOCALE, JSON.stringify(D)); } catch (e) {}
    clearTimeout(minuteur);
    if (!user || !sb) { etat('Gardé jusqu’à la fermeture du navigateur'); return; }
    var CF = window.GenesoliaCoffre;
    if (CF && !CF.accord(user)) { etat('Gardé sur cet appareil, en attente de ton accord'); return; }
    etat('Enregistrement…');
    minuteur = setTimeout(function () {
      (CF ? CF.ecrire(sb, user, CLE, D) : sb.from('carnets').upsert({ user_id: user.id, mois: CLE, data: D, maj: new Date().toISOString() }, { onConflict: 'user_id,mois' }))
        .then(function (r) { etat(r && r.error ? 'Pas enregistré, réessaie plus tard' : 'Enregistré et chiffré dans ton espace'); }, function () { etat('Pas enregistré, réessaie plus tard'); });
    }, 900);
  }
  /* Fusion champ par champ : la réponse la plus récente gagne (D.t garde l'heure de chaque réponse) */
  function fusion(a, b) {
    var r = { v: {}, t: {} };
    [a, b].forEach(function (x) {
      if (!x || !x.v) return;
      Object.keys(x.v).forEach(function (k) {
        var tk = (x.t && x.t[k]) || 0;
        if (!(k in r.v) || tk >= (r.t[k] || 0)) { r.v[k] = x.v[k]; r.t[k] = tk; }
      });
    });
    return r;
  }
  /* Un autre onglet a modifié le même carnet : on reprend ses réponses plus récentes */
  window.addEventListener('storage', function (e) {
    if (e.key !== CLE_LOCALE || !e.newValue) return;
    try { var autre = JSON.parse(e.newValue); } catch (x) { return; }
    var actif = document.activeElement && document.activeElement.getAttribute && document.activeElement.getAttribute('data-k');
    var garde = actif ? D.v[actif] : undefined;
    D = fusion(D, autre);
    if (actif && garde !== undefined) D.v[actif] = garde;
    appliquer();
  });
  function charger() {
    var local = null; try { local = JSON.parse(localStorage.getItem(CLE_LOCALE) || 'null'); } catch (e) {}
    if (!sb) { D = local || D; appliquer(); invitation(); return; }
    sb.auth.getSession().then(function (r) {
      var s = r.data && r.data.session;
      if (!s) { D = local || D; appliquer(); invitation(); return; }
      user = s.user;
      prenom = premierMot((user.user_metadata && (user.user_metadata.full_name || user.user_metadata.prenom)) || '') || premierMot((lireProfil() || {}).prenom || '');
      perso();
      var CF = window.GenesoliaCoffre;
      (CF ? CF.lire(sb, user, CLE) : sb.from('carnets').select('data').eq('user_id', user.id).eq('mois', CLE).maybeSingle().then(function (x) { return x && x.data ? x.data.data : null; })).then(function (distant) {
        D = fusion(distant, local);
        appliquer();
        if (CF && !CF.accord(user)) { etat('Gardé sur cet appareil, en attente de ton accord'); CF.demander(document.getElementById('mc-compte'), sb, function () { user.user_metadata = Object.assign({}, user.user_metadata, { coffre_accord: new Date().toISOString() }); sauver(); }); }
        else { etat('Enregistré et chiffré dans ton espace'); if (local && Object.keys(local.v || {}).length) sauver(); }
      });
      sb.from('resultats').select('titre,donnees,cree_le').eq('outil', 'meteo').order('cree_le', { ascending: false }).limit(24).then(function (x) {
        historique = (x && x.data) || [];
        if (PAGES[courante].id === 'cloture') comparer();
      });
    }).catch(function () { D = local || D; appliquer(); invitation(); });
  }
  /* Sans compte : le texte décrit exactement la règle de site.js (window.GenesoliaDonnees) */
  function invitation() {
    var z = document.getElementById('mc-compte'); if (!z) return;
    etat('Gardé jusqu’à la fermeture du navigateur');
    z.hidden = false;
    z.innerHTML = '<p><b>Sans compte, tes réponses restent dans ce navigateur tant qu’il est ouvert. Quand tu le fermes, elles sont effacées, comme sur les autres sites.</b> Crée ton espace gratuit pour garder ton carnet, ta météo et ta lettre de dans un an, et les retrouver sur tous tes appareils.</p><a class="btn btn-plein" href="login.html?inscription&amp;retour=mon-carnet.html">Créer mon espace</a> <a href="login.html?retour=mon-carnet.html">J’ai déjà un compte</a>';
  }

  /* ───── Météo : enregistrée dans Mon chemin ───── */
  function echelles(prefixe) { var o = {}; ECHELLES.forEach(function (e) { var v = D.v[prefixe + '-' + e[0]]; if (typeof v === 'number') o[e[0]] = v; }); return o; }
  function moyenne(o) { var k = Object.keys(o); return k.length ? Math.round(k.reduce(function (s, x) { return s + o[x]; }, 0) / k.length * 10) / 10 : null; }
  function enregistrerMeteo(moment, bouton) {
    var p = moment === 'debut' ? 'md' : 'mf', e = echelles(p), ret = racine.querySelector('[data-retour="' + moment + '"]');
    if (Object.keys(e).length < ECHELLES.length) { ret.textContent = 'Place les six curseurs avant d’enregistrer.'; return; }
    /* Seuls des chiffres partent dans Mon chemin (table resultats, non chiffrée). Les textes restent dans le carnet chiffré.
       La lettre de dans un an est seulement signalée (lettre_coffre) : Mon espace la relit dans le carnet chiffré. */
    var CF = window.GenesoliaCoffre;
    if (!user || (CF && !CF.accord(user))) {
      ret.textContent = user ? 'Enregistré sur cet appareil. Donne ton accord en haut du carnet pour le garder dans ton espace.' : 'Enregistré sur cet appareil. Crée ton espace pour comparer ta météo mois après mois.';
      if (user && CF) CF.demander(document.getElementById('mc-compte'), sb, function () { user.user_metadata = Object.assign({}, user.user_metadata, { coffre_accord: new Date().toISOString() }); sauver(); });
      return;
    }
    var donnees = { moment: moment, mois: C.mois, echelles: e, moyenne: moyenne(e), roue: roue(moment === 'debut' ? 'rd' : 'rf') };
    if (moment === 'debut') { if (typeof D.v['obj-croyance'] === 'number') donnees.croyance = D.v['obj-croyance']; if ((D.v['proj-an'] || '').trim()) donnees.lettre_coffre = true; }
    else if (typeof D.v['fin-obj'] === 'number') donnees.objectif_avance = D.v['fin-obj'];
    var resume = ECHELLES.map(function (x) { return x[1] + ' ' + e[x[0]]; }).join(' · ');
    var titre = (moment === 'debut' ? 'Début ' : 'Fin ') + C.nomMois;
    bouton.disabled = true;
    var fait = window.GenesoliaChemin ? window.GenesoliaChemin.enregistrer({ outil: 'meteo', titre: titre, resume: resume, donnees: donnees }) : Promise.resolve(false);
    fait.then(function (ok) {
      bouton.disabled = false;
      ret.textContent = ok ? 'C’est enregistré dans ton espace, avec la date. Tu pourras comparer mois après mois.' : (user ? 'L’enregistrement n’a pas fonctionné, réessaie.' : 'Crée ton espace pour garder ta météo et la comparer chaque mois.');
      if (ok) { historique.unshift({ titre: titre, donnees: donnees, cree_le: new Date().toISOString() }); if (moment === 'fin') comparer(); }
      if (ok && window.umami) try { window.umami.track('carnet-meteo-' + moment, { mois: C.mois }); } catch (x) {}
    });
  }

  /* ───── Graphiques : avant / après, l'élan des 4 semaines, et mois après mois ───── */
  function barres(a, b) {
    var W = 600, H = 240, g = 36, base = H - 46, haut = 22, n = ECHELLES.length, larg = (W - 2 * g) / n, bw = Math.min(26, larg / 3);
    var y = function (v) { return base - v / 10 * (base - haut); };
    var s = '<svg class="mc-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Ta météo du début et de la fin du mois, curseur par curseur">';
    [0, 5, 10].forEach(function (t) { s += '<line x1="' + g + '" x2="' + (W - 8) + '" y1="' + y(t) + '" y2="' + y(t) + '" stroke="#EBCFD5"' + (t ? ' stroke-dasharray="3 4"' : '') + '/><text x="' + (g - 8) + '" y="' + (y(t) + 4) + '" text-anchor="end" class="mc-svg-ax">' + t + '</text>'; });
    ECHELLES.forEach(function (e, i) {
      var cx = g + larg * i + larg / 2;
      [[a[e[0]], COUL_DEBUT, -1, 'Début'], [b[e[0]], COUL_FIN, 1, 'Fin']].forEach(function (v) {
        if (typeof v[0] !== 'number') return;
        var x = cx + (v[2] < 0 ? -bw - 1 : 1), yy = y(v[0]), hh = Math.max(2, base - yy);
        s += '<g><title>' + esc(e[1]) + ', ' + v[3].toLowerCase() + ' du mois : ' + v[0] + ' sur 10</title><path d="M' + x + ' ' + base + 'V' + (yy + 4) + 'q0 -4 4 -4h' + (bw - 8) + 'q4 0 4 4V' + base + 'Z" fill="' + v[1] + '"/>' +
          '<text x="' + (x + bw / 2) + '" y="' + (yy - 6) + '" text-anchor="middle" class="mc-svg-val">' + v[0] + '</text></g>';
        void hh;
      });
      s += '<text x="' + cx + '" y="' + (base + 20) + '" text-anchor="middle" class="mc-svg-lab">' + esc(e[1]) + '</text>';
    });
    return s + '</svg>';
  }
  function courbe(points, aria, couleur) {
    var W = 600, H = 170, g = 36, d = 30, base = H - 36, haut = 20, n = points.length;
    var x = function (i) { return n === 1 ? W / 2 : g + d + i * (W - 2 * g - 2 * d) / (n - 1); }, y = function (v) { return base - v / 10 * (base - haut); };
    var s = '<svg class="mc-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(aria) + '">';
    [0, 5, 10].forEach(function (t) { s += '<line x1="' + g + '" x2="' + (W - 8) + '" y1="' + y(t) + '" y2="' + y(t) + '" stroke="#EBCFD5"' + (t ? ' stroke-dasharray="3 4"' : '') + '/><text x="' + (g - 8) + '" y="' + (y(t) + 4) + '" text-anchor="end" class="mc-svg-ax">' + t + '</text>'; });
    var pleins = points.map(function (p, i) { return typeof p.v === 'number' ? [x(i), y(p.v)] : null; }).filter(Boolean);
    if (pleins.length > 1) s += '<polyline fill="none" stroke="' + couleur + '" stroke-width="2" stroke-linejoin="round" points="' + pleins.map(function (p) { return p.join(','); }).join(' ') + '"/>';
    points.forEach(function (p, i) {
      if (typeof p.v === 'number') s += '<g><title>' + esc(p.titre || p.l) + ' : ' + p.v + ' sur 10</title><circle cx="' + x(i) + '" cy="' + y(p.v) + '" r="5" fill="' + (p.c || couleur) + '" stroke="#fff" stroke-width="2"/><text x="' + x(i) + '" y="' + (y(p.v) - 10) + '" text-anchor="middle" class="mc-svg-val">' + String(p.v).replace('.', ',') + '</text></g>';
      s += '<text x="' + x(i) + '" y="' + (base + 20) + '" text-anchor="middle" class="mc-svg-lab">' + esc(p.l) + '</text>';
    });
    return s + '</svg>';
  }
  function comparer() {
    var z = document.getElementById('mc-graphes'), r = document.getElementById('mc-rappel-obj');
    if (r) r.innerHTML = D.v['obj-quoi'] ? '<p class="mc-q">Ton objectif du début de mois</p><p class="mc-cite">' + esc(D.v['obj-quoi']) + '</p>' + (D.v['obj-voir'] || D.v['obj-ressentir'] ? '<p class="mc-note">Tu sauras que tu l’as atteint quand : ' + esc([D.v['obj-voir'], D.v['obj-entendre'], D.v['obj-ressentir']].filter(Boolean).join(' · ')) + '</p>' : '') : '<p class="mc-note">Tu n’as pas noté d’objectif en début de mois : tu peux le faire le mois prochain.</p>';
    if (!z) return;
    var a = echelles('md'), b = echelles('mf'), h = '';
    h += '<div class="mc-graphe"><p class="mc-graphe-t">Ta météo, avant et après</p>';
    if (!Object.keys(a).length && !Object.keys(b).length) h += '<p class="mc-note">Place tes curseurs ici et dans ta météo du début de mois : les deux apparaîtront côte à côte.</p>';
    else {
      h += '<p class="mc-legende"><span><i style="background:' + COUL_DEBUT + '"></i>Début du mois</span><span><i style="background:' + COUL_FIN + '"></i>Fin du mois</span></p>' + barres(a, b);
      if (!Object.keys(a).length) h += '<p class="mc-note">Remplis aussi ta météo du début de mois pour voir l’écart.</p>';
      h += '<details class="mc-tableau-chiffres"><summary>Voir les chiffres</summary><table><thead><tr><th scope="col">Curseur</th><th scope="col">Début</th><th scope="col">Fin</th><th scope="col">Écart</th></tr></thead><tbody>' + ECHELLES.map(function (x) {
        var d = (b[x[0]] !== undefined && a[x[0]] !== undefined) ? b[x[0]] - a[x[0]] : null;
        return '<tr><th scope="row">' + esc(x[1]) + '</th><td>' + (a[x[0]] !== undefined ? a[x[0]] : 'à remplir') + '</td><td>' + (b[x[0]] !== undefined ? b[x[0]] : 'à remplir') + '</td><td>' + (d === null ? '' : d > 0 ? '+' + d : d < 0 ? '−' + Math.abs(d) : '=') + '</td></tr>';
      }).join('') + '</tbody></table></details>';
    }
    h += '</div>';
    var elan = C.semaines.map(function (s, i) { var v = D.v['sem' + (i + 1) + '-elan']; return { l: 'Semaine ' + (i + 1), v: typeof v === 'number' ? v : null }; });
    h += '<div class="mc-graphe"><p class="mc-graphe-t">Ton élan, semaine après semaine</p>' + (elan.some(function (p) { return p.v !== null; }) ? courbe(elan, 'Ton élan sur les quatre semaines', COUL_DEBUT) : '<p class="mc-note">Place le curseur « élan » à la fin de chaque semaine : ta courbe se dessinera ici.</p>') + '</div>';
    if (user) {
      var pts = historique.filter(function (x) { return x.donnees && typeof x.donnees.moyenne === 'number'; }).slice(0, 12).reverse();
      h += '<div class="mc-graphe"><p class="mc-graphe-t">Ta météo, mois après mois</p>' + (pts.length ? '<p class="mc-legende"><span><i style="background:' + COUL_DEBUT + '"></i>Début de mois</span><span><i style="background:' + COUL_FIN + '"></i>Fin de mois</span></p>' +
        courbe(pts.map(function (x) { var m = String(x.donnees.mois || '').split('-'); var nom = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'][+m[1] - 1] || ''; return { l: (x.donnees.moment === 'fin' ? 'fin ' : 'début ') + nom, v: x.donnees.moyenne, c: x.donnees.moment === 'fin' ? COUL_FIN : COUL_DEBUT, titre: x.titre }; }), 'Ta météo intérieure mois après mois', '#C9A9C0') +
        '<p class="mc-note">Chaque point est la moyenne de tes six curseurs, enregistrée avec le bouton « Enregistrer ». Tout l’historique est dans <a href="login.html#mon-chemin">Mon chemin</a>.</p>'
        : '<p class="mc-note">Enregistre ta météo du début et de la fin du mois : ta courbe se construira ici, mois après mois.</p>') + '</div>';
    }
    z.innerHTML = h;
  }

  /* ───── Rappels dans l'agenda (.ics) : 4 semaines + le bilan ───── */
  function telechargerRappels() {
    var p = String(C.mois).split('-'), an = +p[0], mo = +p[1] - 1;
    /* Mêmes dates que les pages (« À vivre à partir du… ») : semaines le 1er, 8, 15 et 22 du mois, bilan le dernier jour.
       Une semaine déjà finie n'a pas de rappel ; la semaine en cours et un bilan déjà passé sont rappelés demain. */
    var auj = new Date(); auj.setHours(0, 0, 0, 0);
    var demain = new Date(auj.getTime() + 864e5);
    var fin = new Date(an, mo + 1, 0);
    if (fin < demain) fin = demain;
    function d8(d) { return d.getFullYear() + ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2); }
    function txt(s) { return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n'); }
    function plier(l) { var r = [], s = l; while (s.length > 70) { r.push(s.slice(0, 70)); s = ' ' + s.slice(70); } r.push(s); return r.join('\r\n'); }
    function brut(s) { return String(s).replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); }
    var base = 'https://genesolia.fr/' + PAGE_URL + '?mois=' + C.mois, stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    var ev = C.semaines.map(function (s, i) {
      if (Array.isArray(s)) s = { titre: s[0], texte: s[1] };
      var d = dateSemaine(i), suite = i + 1 < C.semaines.length ? dateSemaine(i + 1) : new Date(an, mo + 1, 1);
      if (suite <= demain) return null;
      if (d < demain) d = demain;
      if (d >= fin) return null;
      return { d: d, titre: (SUIVI ? 'Mon suivi' : 'Carnet du Cercle') + ' · Semaine ' + (i + 1) + ' : ' + s.titre, texte: brut(s.texte || s.intro || ''), url: base + (SUIVI ? '#' + s.cle : '#semaines-' + (i + 1)) };
    }).filter(Boolean);
    ev.push({ d: fin, titre: (SUIVI ? 'Mon suivi' : 'Carnet du Cercle') + ' · Mon bilan ' + de(NOM_MOIS), texte: 'Prends dix minutes pour ton bilan du mois.', url: base + (SUIVI ? '#bilan' : '#cloture') });
    var l = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Genesolia//Carnet du Cercle//FR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:Mon carnet du Cercle'];
    ev.forEach(function (e, i) {
      l.push('BEGIN:VEVENT', 'UID:carnet-' + C.mois + '-' + (i + 1) + '-' + stamp + '@genesolia.fr', 'DTSTAMP:' + stamp, 'DTSTART:' + d8(e.d) + 'T190000', 'DURATION:PT15M',
        plier('SUMMARY:' + txt(e.titre)), plier('DESCRIPTION:' + txt(e.texte + '\nOuvrir mon carnet : ' + e.url)), plier('URL:' + e.url),
        'BEGIN:VALARM', 'ACTION:DISPLAY', plier('DESCRIPTION:' + txt(e.titre)), 'TRIGGER:PT0M', 'END:VALARM', 'END:VEVENT');
    });
    l.push('END:VCALENDAR');
    var blob = new Blob([l.join('\r\n') + '\r\n'], { type: 'text/calendar;charset=utf-8' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'rappels-carnet-' + C.mois + '.ics';
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    if (window.umami) try { window.umami.track('carnet-rappels', { mois: C.mois }); } catch (x) {}
  }

  /* ───── Impression : « Simple » ou « Avec le décor » ───── */
  var ouverts = [];
  function preparerImpression(mode) {
    finImpression();
    basculerChoix(false);
    racine.querySelectorAll('textarea[data-k], input[type=text][data-k]').forEach(function (el) {
      var d = document.createElement('div'); d.className = 'mc-imp'; d.textContent = el.value || ' '; el.parentNode.insertBefore(d, el.nextSibling);
    });
    racine.querySelectorAll('input[type=range][data-k]').forEach(function (el) {
      var d = document.createElement('span'); d.className = 'mc-imp mc-imp-court'; d.textContent = typeof D.v[el.getAttribute('data-k')] === 'number' ? el.value + ' sur 10' : 'à remplir'; el.closest('.mc-curseur').querySelector('.mc-q').appendChild(d);
    });
    ouverts = [];
    racine.querySelectorAll('details').forEach(function (d) { if (!d.open) { ouverts.push(d); d.open = true; } });
    comparer();
    document.documentElement.classList.add('mc-imprime', 'mc-imprime-' + (mode === 'decor' ? 'decor' : 'simple'));
    racine.classList.add('mc-impression');
  }
  function finImpression() {
    document.documentElement.classList.remove('mc-imprime', 'mc-imprime-simple', 'mc-imprime-decor');
    racine.classList.remove('mc-impression');
    racine.querySelectorAll('.mc-imp').forEach(function (x) { x.remove(); });
    ouverts.forEach(function (d) { d.open = false; }); ouverts = [];
  }
  function imprimer(mode) {
    preparerImpression(mode);
    if (window.umami) try { window.umami.track('carnet-imprimer', { mois: C.mois, version: mode }); } catch (x) {}
    setTimeout(function () { window.print(); }, 250);
  }
  window.addEventListener('afterprint', finImpression);
  window.GenesoliaCarnet = { aller: aller, preparerImpression: preparerImpression, finImpression: finImpression };

  function demarrer() { construire(); tonMois(); majSemainesMaya(); charger(); }
  /* Le suivi vérifie d'abord l'accès au Cercle (semaine 1 offerte, la suite pour les membres) */
  if (SUIVI && window.GenesoliaAcces && window.GenesoliaAcces.membre) window.GenesoliaAcces.membre().then(function (m) { membre = !!m; demarrer(); }, demarrer);
  else { membre = true; demarrer(); }
})();
