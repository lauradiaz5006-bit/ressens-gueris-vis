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
  var A = window.CARNET_ACCOMP || null;   /* accompagnement personnalisé : blessures, gestes, lecture de la roue (assets/carnet-accompagnement.js) */
  var SB_URL = 'https://qsvzzkjtjsznfntahvvh.supabase.co', SB_KEY = 'sb_publishable_6iEVxXmtB_u1hJ6mPS9fNg_CJhLjYkg';
  var SUIVI = C.type === 'suivi', MODULE = C.type === 'module', CARNET = !SUIVI && !MODULE, T2 = !SUIVI && !MODULE && C.trame === 2, COEUR = SUIVI && !!C.coeur, CLE = C.cle || C.mois, PAGE_URL = C.page || 'mon-carnet.html', membre = false;
  var CLE_LOCALE = 'genesolia-carnet-' + CLE;
  /* ───── Le suivi (cycle 2 « Mon arbre de vie ») et le carnet (cycle 1) par étapes ─────
     window.GENESOLIA_ETAPE vient de mon-suivi-mois.html ou de mon-carnet.html (assets/site.js, GenesoliaAcces.ouvrirParEtapes ; membre du Cercle, ou &apercu) : { n, enCours, debloquees, debut }.
     Le carnet et le suivi d'une même personne sont toujours à la même étape ; les liens de l'un à l'autre passent par ?etape=N (vers()).
     Le parcours suit le mois d'abonnement : étape 1 = le fichier 2026-10 … étape 12 = 2027-09. La clé des réponses reste celle du fichier (C.cle).
     Ce qui reste au calendrier (la saison, son geste, sa citation, l'autel) utilise le vrai mois : SAISON_REELLE.
     debut : les semaines partent du début de l'étape (sinon, comme avant, du 1er du mois du fichier). */
  var ET = (SUIVI || CARNET) && window.GENESOLIA_ETAPE && window.GENESOLIA_ETAPE.n ? window.GENESOLIA_ETAPE : null;
  var ARBRE_ETAPES = ['Qui sont les miens ?', 'Qu’est-ce que j’ai reçu ?', 'Quelle est ma place ?', 'Quelle peur je porte, et pour qui ?', 'Quel projet a-t-on posé sur moi ?', 'Quelles émotions avaient le droit d’exister ?',
    'Quelles phrases me guident ?', 'Comment ai-je appris à aimer ?', 'Ai-je le droit d’aller plus loin ?', 'Combien je m’autorise à recevoir ?', 'D’où venons-nous ?', 'Qu’est-ce que je transmets ?'];
  /* Les 12 étapes du carnet (cycle 1) : le titre de chaque fichier assets/carnets/2026-10.js … 2027-09.js */
  var CARNET_ETAPES = ['Mon point de départ', 'Mes forces, mes appuis', 'Ma place, mes limites', 'Mon intention, mes valeurs', 'M’aimer d’abord', 'Ma direction, ma confiance',
    'Dire vrai', 'La vie circule à travers moi', 'Oser agir', 'Ma valeur', 'Mon chez-moi, mon élan', 'Ma vocation'];
  /* Le lien vers le suivi ou le carnet de la même étape (ou du même mois, hors parcours par étapes) */
  function vers(page) { return page + (ET ? '?etape=' + ET.n : '?mois=' + C.mois); }
  function partieArbre(n) { return ['Racines', 'Tronc', 'Branches', 'Fruits'][Math.floor((n - 1) / 3)] || ''; }
  var DEBUT_ET = ET && /^\d{4}-\d\d-\d\d$/.test(ET.debut || '') ? new Date(+ET.debut.slice(0, 4), +ET.debut.slice(5, 7) - 1, +ET.debut.slice(8, 10)) : null;
  var SAISON_REELLE = !!ET && !new URLSearchParams(location.search).get('mois');
  var MOIS_SAISON = SAISON_REELLE ? new Date().getMonth() + 1 : +String(C.mois).split('-')[1];
  var MOIS_SAISON_ISO = SAISON_REELLE ? new Date().getFullYear() + '-' + ('0' + MOIS_SAISON).slice(-2) : C.mois;
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
  /* Des étapes : une phrase, une phrase avec sa petite liste ({ t, liste, fin }), ou un groupe titré ({ titre, etapes }) qui recommence la numérotation */
  function liEtape(e) { return typeof e === 'string' ? '<li>' + md(e) + '</li>' : '<li>' + md((e || {}).t || '') + (e && e.liste ? '<ul class="mc-liste">' + e.liste.map(function (x) { return '<li>' + md(x) + '</li>'; }).join('') + '</ul>' : '') + (e && e.fin ? '<span class="mc-etape-fin">' + md(e.fin) + '</span>' : '') + '</li>'; }
  function etapesHtml(l) {
    var h = '', ol = [];
    function ferme() { if (ol.length) { h += '<ol class="mc-etapes">' + ol.join('') + '</ol>'; ol = []; } }
    (l || []).forEach(function (e) {
      if (e && e.etapes) { ferme(); h += '<p class="mc-etapes-t">' + md(e.titre || '') + '</p>'; e.etapes.forEach(function (x) { ol.push(liEtape(x)); }); ferme(); }
      else ol.push(liEtape(e));
    });
    ferme(); return h;
  }
  /* Un tableau d'exemple : { titre, entetes: [...], lignes: [[...], ...] }. Sur téléphone, chaque ligne devient une petite fiche. */
  function tableauHtml(T) {
    if (!T || !T.lignes) return '';
    return '<div class="mc-tab-ex">' + (T.titre ? '<p class="mc-q">' + md(T.titre) + '</p>' : '') + '<table><thead><tr>' + T.entetes.map(function (x) { return '<th scope="col">' + esc(x) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      T.lignes.map(function (r) { return '<tr>' + r.map(function (c, j) { return '<td data-l="' + esc(T.entetes[j] || '') + '">' + md(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  }
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
  function roue(prefixe) { var o = {}; ROUE.forEach(function (d) { var v = D.v[prefixe + '-' + d[0]]; if (typeof v === 'number') o[d[0]] = v; }); if (T2 && prefixe === 'rd' && !Object.keys(o).length && typeof pdRoue === 'function') o = pdRoue(); return o; }
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

  /* ───── Ce que ta météo dit de ton mois (page 2, sous le point 1) ─────
     Une matrice de textes fixes, sans génération libre : énergie (basse 0-3, moyenne 4-6, haute 7-10) × famille du mois personnel
     (élan 1, 3, 5, 8 · réguliers 2, 4, 6 · ralentir 7, 9), puis des compléments selon les curseurs, la météo, Mercure et la vague maya.
     Les calculs viennent de Guide.calculer() (guide-mois.js) et de Maya.calculer() (maya.js). */
  var METEO_DIT = {
    base: {
      basse: [['decale', 'Ton mois invite à lancer et à oser, mais ton énergie demande d’abord du repos. Les deux peuvent aller ensemble : choisis un tout petit pas, un seul, et garde du temps pour toi cette semaine. L’élan viendra.'],
        ['coherent', 'Ton mois invite à avancer pas à pas, et ton énergie est basse : ça tombe plutôt bien. Pas besoin de grand effort, une petite régularité suffit. Commence par ce qui te demande le moins.'],
        ['coherent', 'Ton énergie basse rejoint ton mois, qui invite à ralentir et à laisser partir. C’est cohérent : accorde-toi du repos sans culpabiliser. Trier, ranger, dormir davantage, ce sont aussi des avancées.']],
      moyenne: [['coherent', 'Ton mois invite à avancer et ton énergie suit, sans excès. Avance d’un pas régulier : une action concrète par semaine suffit pour que le mouvement s’installe.'],
        ['coherent', 'Ton énergie et ton mois avancent au même rythme, posé et régulier. Choisis une habitude simple à tenir chaque jour, et observe ce qu’elle change en quatre semaines.'],
        ['coherent', 'Ton mois invite à prendre du recul, et ton énergie te le permet. Profites-en pour faire le point : qu’est-ce qui est fini, qu’est-ce qui continue ?']],
      haute: [['coherent', 'Tout va dans le même sens : ton mois invite à oser et ton énergie est là. C’est le bon moment pour lancer ce que tu repousses. Garde simplement une soirée pour souffler.'],
        ['leger', 'Ton énergie est haute dans un mois qui demande de la patience. Mets cet élan au service de ce qui dure : organiser, consolider, finir. Évite de tout commencer en même temps.'],
        ['decale', 'Ton énergie est haute alors que ton mois invite à ralentir. Profite de cet élan pour terminer ce qui est en cours plutôt que d’en ouvrir trop : finir, trier, transmettre.']]
    },
    etiquettes: { coherent: 'Ton énergie et ton mois vont dans le même sens', leger: 'Un léger décalage', decale: 'Un décalage' },
    confiance: 'Ta confiance est basse en ce moment. Note chaque soir une chose que tu as réussie, même minuscule : en fin de semaine, relis ta liste.',
    elan: 'Tu as l’impression de ne pas avancer. Regarde plutôt d’où tu pars : ton objectif du mois, découpé en tout petits pas, va t’aider à voir le chemin.',
    serenite: 'Ta sérénité est basse. Offre-toi chaque jour cinq minutes de calme : trois respirations lentes, une marche, un moment sans écran.',
    liens: 'Tu te sens peu entouré·e. Cette semaine, fais un pas vers une personne qui te fait du bien : un message, un appel, un café.',
    humeur: 'Ton humeur est basse ces jours-ci. Sois douce et doux avec toi : ce que tu ressens a le droit d’être là, et ça passera.',
    chargee: 'Ta météo intérieure est chargée. Comme dehors, ça ne dure pas : pour l’instant, évite les grandes décisions et laisse passer le gros du temps.',
    lumineuse: 'Ta météo intérieure est lumineuse. Remarque ce qui la rend ainsi, pour pouvoir y revenir les jours plus gris.',
    mercure: 'Mercure est rétrograde une partie du mois : un bon moment pour relire, vérifier, reprendre contact, plutôt que pour signer dans la précipitation.',
    porte: 'C’est une vague qui te porte.',
    detente: 'Pour te poser et relâcher ce qui pèse, prends vingt minutes pour ta séance de libération du mois.',
    avancer: 'Pour retrouver l’envie et te mettre en mouvement, prends vingt minutes pour ta séance de visualisation du mois.',
    soutien: 'Plusieurs de tes curseurs sont très bas en ce moment. Tu n’as pas à porter ça seul·e : parles-en à une personne de confiance, ou à un·e professionnel·le de l’accompagnement si tu en ressens le besoin.'
  };
  function familleMois(n) { n = n === 11 ? 2 : n === 22 ? 4 : n; return [1, 3, 5, 8].indexOf(n) >= 0 ? 0 : [7, 9].indexOf(n) >= 0 ? 2 : 1; }
  /* Le jour de référence : aujourd'hui s'il tombe dans le mois du carnet, sinon le 1er du mois */
  function jourRef() { var p = String(C.mois).split('-'), a = new Date(), d = new Date(a.getFullYear(), a.getMonth(), a.getDate()); return d.getFullYear() === +p[0] && d.getMonth() === +p[1] - 1 ? d : new Date(+p[0], +p[1] - 1, 1); }
  function majReperesIci() {
    var zr = racine.querySelector('[data-reperes-ici]'); if (!zr) return;
    if (lireProfil()) { if (zr.getAttribute('data-ouvert') === '1') { zr.setAttribute('data-ouvert', '0'); zr.innerHTML = '<p class="mc-retour">Tes infos de naissance sont enregistrées. Ta lecture t’attend à la fin de chaque semaine.</p>'; } return; }
    if (zr.getAttribute('data-ouvert') === '1') return;
    zr.setAttribute('data-ouvert', '1');
    var pr = lireProfil(true);
    if (pr && pr.aConfirmer) confirmerReperes(zr, pr); else formProfil(zr, { bouton: 'Valider mes infos' });
  }
  function majMeteoDit() {
    if (T2) majReperesIci();
    var z = racine.querySelector('[data-meteo-dit]'); if (!z) return;
    var e = echelles('md');
    if (Object.keys(e).length < ECHELLES.length) { z.hidden = true; z.innerHTML = ''; return; }
    var T = METEO_DIT, pr = lireProfil(), r = null, h = '', compl = [];
    if (pr && window.Guide) { try { var p = String(C.mois).split('-'), arbre = null; try { arbre = JSON.parse(localStorage.getItem('geno4') || 'null'); } catch (x) {} r = window.Guide.calculer(pr, +p[0], +p[1], arbre); } catch (x) { r = null; } }
    if (r && r.moisPerso) {
      var M = (window.GUIDE_TEXTES && window.GUIDE_TEXTES.MOIS[r.moisPerso]) || {}, niv = e.energie <= 3 ? 'basse' : e.energie <= 6 ? 'moyenne' : 'haute';
      var b = T.base[niv][familleMois(r.moisPerso)];
      h += '<p class="mc-md-mois">Ton mois personnel ' + r.moisPerso + (M.theme ? ' : ' + esc(M.theme.charAt(0).toLowerCase() + M.theme.slice(1)) : '') + '.</p>' +
        '<p class="mc-md-tag mc-md-' + b[0] + '">' + esc(T.etiquettes[b[0]]) + '</p><p>' + esc(b[1]) + '</p>';
    } else if (T2) {
      h += '<p class="mc-note">Pour croiser ta météo avec ta semaine (tes nombres, ton ciel, tes jours maya), indique tes infos de naissance juste en dessous.</p>';
    } else {
      var pTon = PAGES.map(function (x) { return x.id; }).indexOf('tonmois');
      h += '<p class="mc-note">Pour croiser ta météo avec les énergies de ton mois, indique ta date de naissance dans « Ton mois à toi ».' + (pTon >= 0 ? ' <button type="button" class="mc-lien" data-page="' + pTon + '">Indiquer mes repères</button>' : '') + '</p>';
    }
    ['confiance', 'elan', 'serenite', 'liens', 'humeur'].forEach(function (k) { if (e[k] <= 3) compl.push(T[k]); });
    var met = D.v['md-meteo'];
    if (['Pluie', 'Orage', 'Brouillard'].indexOf(met) >= 0) compl.push(T.chargee);
    if (['Grand soleil', 'Arc-en-ciel'].indexOf(met) >= 0) compl.push(T.lumineuse);
    if (r && r.mercure) compl.push(T.mercure);
    var MY = window.Maya, MS = window.MAYA_SEMAINES, MT = window.MAYA_TEXTES;
    if (pr && MY && MS && MT) {
      try {
        var j = jourRef(), rj = MY.calculer(isoJ(j)), dv = plusJ(j, -(rj.nombre - 1)), sv = MY.calculer(isoJ(dv)).signe, nat = MY.calculer(pr.date);
        var phrase = (String(MS.VAGUES[sv] || '').match(/^[^.]*\./) || [''])[0];
        if (phrase) compl.push('Cette semaine, ' + phrase.charAt(0).toLowerCase() + phrase.slice(1) + (nat && (sv === nat.signe || sv % 4 === nat.signe % 4) ? ' ' + T.porte : ''));
      } catch (x) {}
    }
    if (compl.length) h += '<ul class="mc-md-compl">' + compl.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul>';
    var aud = [];
    if (e.energie <= 3 || e.serenite <= 3) aud.push('<a href="mon-suivi-mois.html?mois=' + esc(C.mois) + '#meditation">' + esc(T.detente) + '</a>');
    if (e.confiance <= 3 || e.elan <= 3) aud.push('<a href="#seance">' + esc(T.avancer) + '</a>');
    if (aud.length) h += '<p class="mc-md-audio">' + aud.join('<br>') + '</p>';
    if ([e.energie, e.humeur, e.serenite].filter(function (v) { return v <= 2; }).length >= 2) h += '<p class="mc-md-soutien">' + esc(T.soutien) + '</p>';
    if (T2 && r) { var sc = Math.max(0, semaineEnCours()); h += '<p><button type="button" class="btn btn-trait" data-page="' + (sc + 1) + '" data-ancre="mc-lecture-' + (sc + 1) + '">Lire ma semaine</button></p>'; }
    z.innerHTML = '<p class="mc-encadre-t">' + (T2 ? 'Ce que tes infos disent de ta semaine' : 'Ce que ta météo dit de ton mois') + '</p>' + h;
    z.hidden = false;
  }

  /* ───── Les encouragements de la page 2 : une variante par mois, quand le point est rempli ───── */
  var BRAVOS = {
    1: ['Tu viens de t’écouter, vraiment. Savoir où tu en es, c’est déjà commencer.', 'Merci pour cette honnêteté avec toi-même. Ta météo n’est ni bonne ni mauvaise : c’est ton point de départ.', 'Tu as pris le temps de te sentir. C’est le premier geste de ce mois.'],
    2: ['Tu viens de regarder ta vie en face, avec honnêteté. C’est déjà un vrai pas.', 'Ta roue est posée. Chaque domaine que tu nourris, même un peu, la rend plus ronde.', 'Tu vois maintenant ta vie d’un seul regard. Ce que tu vois, tu peux le faire évoluer.'],
    3: ['Ton objectif est posé, en mots clairs. Ce qui est nommé commence déjà à exister.', 'Bravo : tu sais maintenant ce que tu veux, et par où commencer.', 'Une direction claire, un premier pas : ton mois a un cap.'],
    4: ['Tu as donné une image et une émotion à ton intention. Garde-les près de toi tout le mois.', 'Ce que tu viens de ressentir compte autant que ce que tu feras. Ton intention est vivante.', 'Tu as semé ton intention. Laisse-la pousser, à son rythme.'],
    5: ['Ta phrase t’accompagne maintenant. Redis-la le matin, et chaque fois que tu doutes.', 'Quelques mots à toi, pour tout le mois. Écris-les là où tu les verras chaque jour.', 'Ta phrase est choisie. C’est ta petite boussole de ce mois.']
  };
  function bravo(n) { return '<p class="mc-bravo" data-bravo="' + n + '" hidden></p>'; }
  function majBravos() {
    var vu = function (k) { return repondu(k); };
    var fait = {
      1: ECHELLES.every(function (x) { return typeof D.v['md-' + x[0]] === 'number'; }),
      2: ROUE.every(function (x) { return typeof D.v['rd-' + x[0]] === 'number'; }),
      3: vu('obj-quoi') && vu('obj-pas'),
      4: vu('proj-mois'),
      5: vu('phrase')
    };
    var i = (+String(C.mois).split('-')[1] || 1) % 3;
    racine.querySelectorAll('[data-bravo]').forEach(function (b) { var n = +b.getAttribute('data-bravo'); b.hidden = !fait[n]; b.textContent = fait[n] ? BRAVOS[n][i] : ''; });
  }
  /* Ma lettre du mois : l'ancien « ancrage ressource » reste lisible s'il avait été rempli */
  function majAncienAncrage() {
    var z = racine.querySelector('[data-ancien-ancrage]'); if (!z) return;
    var s = String(D.v['ancre-souvenir'] || '').trim(), m = String(D.v['ancre-mot'] || '').trim();
    z.hidden = !(s || m);
    z.innerHTML = s || m ? '<p class="mc-encadre-t">Ton ancrage ressource (ce que tu avais écrit)</p>' + (s ? '<p><b>Ton moment ressource :</b> ' + esc(s) + '</p>' : '') + (m ? '<p><b>Ton mot :</b> ' + esc(m) + '</p>' : '') : '';
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
  if (!SUIVI && !T2 && window.Guide && window.GUIDE_TEXTES) PAGES.push({ id: 'tonmois', nom: 'Ton mois à toi', g: function () {
    return gauche('tonmois', 'Avant tout · rien que pour toi', 'Ton mois à toi',
      '<p class="mc-intro">Chaque mois porte une couleur particulière pour toi : ton nombre personnel, le ciel qui passe sur ton thème de naissance, les jours de ton signe maya. Lis-les comme une météo du ciel, avant ta météo intérieure.</p>' +
      '<p>Ce n’est pas une prédiction : ce sont des repères pour savoir où mettre ton énergie, en amour, dans ton travail, dans tes décisions.</p>');
  }, d: function () { return '<div id="mc-tonmois"></div>' + (A ? '<section class="mc-pbl" id="mc-profil-bl" aria-live="polite"></section>' : '') + zone('tonmois-retiens', 'Qu’est-ce qui résonne pour toi dans cette lecture ? Qu’en retiens-tu pour ton mois ?', { lignes: 3, ph: 'Exemple : un mois pour oser commencer. Je retiens la nouvelle lune du 21 pour poser mon intention.' }); } });

  function lireProfil(brut) {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(CLE_PROFIL) || 'null'); } catch (e) {}
    /* Repères trouvés dans un autre outil de l'appareil (thème astral…) : peut-être ceux d'une amie. On ne s'en sert qu'après « Oui, c'est moi ». */
    if (!s) { try { var a = JSON.parse(localStorage.getItem('genesolia-astro') || 'null'); if (a && a.date) s = { prenom: a.prenom || '', date: a.date, heure: a.heure || '', lieu: a.lieu || '', lat: a.lat, lon: a.lon, tz: a.tz || 'Europe/Paris', aConfirmer: true }; } catch (e) {} }
    s = s && /^\d{4}-\d{2}-\d{2}$/.test(s.date || '') ? s : null;
    return s && s.aConfirmer && !brut ? null : s;
  }
  function confirmerReperes(z, pr) {
    z.innerHTML = '<div class="mc-proprio"><p class="mc-encadre-t">Avant de lire ton mois</p><p>Nous avons trouvé sur cet appareil des repères de naissance : <b>' + esc(pr.prenom || 'sans prénom') + ', né·e le ' + esc(pr.date.split('-').reverse().join('/')) + '</b>' + (pr.lieu ? ' à ' + esc(pr.lieu) : '') + '. Est-ce bien toi ? Une amie a peut-être utilisé le site sur cet appareil.</p>' +
      '<p class="mc-proprio-b"><button type="button" class="btn btn-plein" data-reperes="oui">Oui, c’est moi</button> <button type="button" class="btn btn-trait" data-reperes="non">Non, je saisis les miens</button></p></div>';
    z.querySelector('[data-reperes="oui"]').addEventListener('click', function () {
      var c = Object.assign({}, pr); delete c.aConfirmer;
      try { localStorage.setItem(CLE_PROFIL, JSON.stringify(c)); } catch (x) {}
      tonMois(); if (typeof majSemainesMaya === 'function') majSemainesMaya(); majMeteoDit(); perso();
    });
    z.querySelector('[data-reperes="non"]').addEventListener('click', function () { formProfil(z); });
  }
  function formProfil(z, opts) {
    opts = opts || {};
    /* Repères de naissance : la date, tous les prénoms et le nom de naissance (verrouillés une fois enregistrés dans l'espace), l'heure et le lieu (à compléter quand on veut) */
    var R = window.GenesoliaReperes, pr = lireProfil() || {}, verrou = !!(R && R.verrouille() && pr.verrou);
    var fixe = function (q, v) { return '<div class="mc-champ"><span class="mc-q">' + q + '</span><p class="mc-fixe">' + esc(v || '·') + '</p></div>'; };
    z.innerHTML = '<form class="mc-profil" novalidate><p class="mc-consigne">Pour lire ton mois, indique ta date de naissance et tes prénoms. L’heure et le lieu permettent de savoir dans quels domaines de ta vie tombe le ciel du mois : ajoute-les si tu les connais, maintenant ou plus tard.</p>' +
      (verrou
        ? fixe('Tes prénoms', pr.prenoms || pr.prenom) + (pr.nom ? fixe('Ton nom de naissance', pr.nom) : '') + fixe('Ta date de naissance', pr.date.split('-').reverse().join('/')) + '<p class="mc-note">' + R.NOTE + '</p>'
        : '<label class="mc-champ"><span class="mc-q">Tous tes prénoms</span><input type="text" name="prenoms" autocomplete="given-name" value="' + esc(pr.prenoms || pr.prenom || prenom) + '" placeholder="Par exemple : Léa Marie Jeanne"></label>' +
          '<label class="mc-champ"><span class="mc-q">Ton nom de naissance (ton nom de jeune fille)</span><input type="text" name="nom" autocomplete="family-name" required value="' + esc(pr.nom || '') + '"><small class="mc-aide">Le nom que tu portais à ta naissance : il compte dans tes nombres.</small></label>' +
          '<label class="mc-champ"><span class="mc-q">Ta date de naissance</span><input type="date" name="date" required value="' + esc(pr.date || '') + '"></label>' +
          (user && R ? '<p class="mc-note">' + R.AVANT + '</p>' : '')) +
      '<label class="mc-champ"><span class="mc-q">Ton heure de naissance (facultatif)</span><input type="time" name="heure" value="' + esc(pr.heure || '') + '"></label>' +
      '<div class="mc-champ mc-lieu"><label class="mc-q" for="mc-lieu">Ton lieu de naissance (facultatif)</label><input type="text" id="mc-lieu" autocomplete="off" spellcheck="false" placeholder="Commence à taper ta ville" value="' + esc(pr.lieu || '') + '"><ul class="mc-sugg" id="mc-sugg" role="listbox" hidden></ul><small class="mc-aide" id="mc-lieu-info"></small></div>' +
      '<button class="btn btn-plein" type="submit">' + esc(opts.bouton || 'Lire mon mois') + '</button><p class="mc-retour" role="alert"></p></form>';
    var f = z.querySelector('form'), lieu = window.LieuNaissance ? window.LieuNaissance.brancher({ input: document.getElementById('mc-lieu'), liste: document.getElementById('mc-sugg'), info: document.getElementById('mc-lieu-info') }) : null;
    if (lieu && pr.lieu && lieu.definir) lieu.definir({ nom: pr.lieu, lat: pr.lat, lon: pr.lon, tz: pr.tz });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = verrou ? pr.date : f.date.value;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || +d.slice(0, 4) < 1900) { f.querySelector('.mc-retour').textContent = 'Indique ta date de naissance complète.'; return; }
      var prenoms = verrou ? (pr.prenoms || pr.prenom || '') : f.prenoms.value.trim();
      if (!prenoms) { f.querySelector('.mc-retour').textContent = 'Indique tes prénoms.'; return; }
      if (!verrou && !f.nom.value.trim()) { f.querySelector('.mc-retour').textContent = 'Indique ton nom de naissance (ton nom de jeune fille).'; return; }
      (lieu && document.getElementById('mc-lieu').value.trim() ? lieu.resoudre() : Promise.resolve(null)).then(function (l) {
        var np = { prenom: prenoms.split(/\s+/)[0], prenoms: prenoms, nom: verrou ? (pr.nom || '') : f.nom.value.trim(), date: d, heure: f.heure.value || '', lieu: l ? l.nom : '', lat: l ? l.lat : null, lon: l ? l.lon : null, tz: l ? l.tz : 'Europe/Paris', verrou: verrou };
        try { localStorage.setItem(CLE_PROFIL, JSON.stringify(np)); } catch (x) {}
        var fini = function () { tonMois(); if (typeof majSemainesMaya === 'function') majSemainesMaya(); majMeteoDit(); perso(); if (opts.apres) opts.apres(); };
        if (user && sb && R) R.enregistrer(sb, user, np).then(fini, fini); else fini();
      });
    });
  }
  function tonMois() {
    var z = document.getElementById('mc-tonmois'); if (!z) return;
    var pr = lireProfil(true); if (!pr) { formProfil(z); return; }
    if (pr.aConfirmer) { confirmerReperes(z, pr); return; }
    var p = String(SAISON_REELLE ? MOIS_SAISON_ISO : C.mois).split('-'), an = +p[0], mo = +p[1], arbre = null, r = null;   /* par étapes : le vrai mois */
    try { arbre = JSON.parse(localStorage.getItem('geno4') || 'null'); } catch (e) {}
    /* Sans compte, l'arbre de l'appareil a pu être rempli par une autre personne : on demande avant de s'en servir */
    var arbreAConfirmer = !!(arbre && arbre.people && !user && localStorage.getItem('genesolia-arbre-moi') !== '1');
    if (arbreAConfirmer || localStorage.getItem('genesolia-arbre-moi') === '0') arbre = null;
    try { r = window.Guide.calculer(pr, an, mo, arbre); } catch (e) { r = null; }
    if (!r) { formProfil(z); return; }
    var T = window.GUIDE_TEXTES, G = window.Guide, M = T.MOIS[r.moisPerso] || {}, ML = window.Numerologie && window.Numerologie.MOIS_LONG ? window.Numerologie.MOIS_LONG[r.moisPerso] : null;
    var nm = MOIS_NOMS[mo - 1], signeMaya = r.maya && window.MAYA_TEXTES ? window.MAYA_TEXTES.SIGNES[r.maya.natal.signe] : null;
    var h = '<div class="mc-tm-tete"><p class="mc-sur">' + (pr.prenom ? 'Le mois de ' + esc(pr.prenom) : 'Ton mois') + '</p><p class="mc-tm-titre">' + esc(M.theme || '') + '</p>' +
      '<p class="mc-tm-puces"><span>Mois personnel ' + r.moisPerso + '</span><span>Année personnelle ' + r.anneePerso + '</span>' + (signeMaya ? '<span>Signe maya ' + r.maya.natal.nombre + ' ' + esc(signeMaya.kiche) + '</span>' : '') + '</p></div>';
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
      '<p class="mc-tm-liens"><button type="button" class="btn btn-trait" data-profil>' + (pr.verrou ? 'Compléter mon heure ou mon lieu' : 'Modifier mes repères de naissance') + '</button> <a class="btn btn-trait" href="mon-guide.html">Mon guide du mois complet</a></p>';
    if (arbreAConfirmer) h += '<div class="mc-proprio"><p>Un arbre familial est enregistré sur cet appareil. Est-ce bien le tien ? S’il l’est, ton mois tiendra compte des dates de ta famille.</p><p class="mc-proprio-b"><button type="button" class="btn btn-trait" data-arbre="1">Oui, c’est mon arbre</button> <button type="button" class="btn btn-trait" data-arbre="0">Non</button></p></div>';
    z.innerHTML = h;
    z.querySelector('[data-profil]').addEventListener('click', function () { formProfil(z); });
    z.querySelectorAll('[data-arbre]').forEach(function (b) { b.addEventListener('click', function () { try { localStorage.setItem('genesolia-arbre-moi', b.getAttribute('data-arbre')); } catch (x) {} tonMois(); }); });
  }

  PAGES.push({ id: 'ouverture', nom: 'Ma météo du début', g: function () {
    return gauche('ouverture', 'Pour commencer le mois · 10 minutes', 'Ma météo du début de mois',
      '<p class="mc-intro">Avant d’ouvrir le thème, prends le temps de te poser. Ces questions viennent de la PNL et de l’accompagnement : elles t’aident à savoir où tu en es, à donner une direction claire à ton mois, et à mesurer ensuite le chemin parcouru.</p>' +
      '<p>Il n’y a pas de bonne réponse, seulement la tienne, aujourd’hui. Si tu as cinq minutes, remplis la météo et ton objectif. Le reste peut attendre.</p>');
  }, d: function () {
    return '<section class="mc-etape"><h3><span>1</span> Là, maintenant, comment te sens-tu ?</h3><p class="mc-consigne">Place chaque curseur sans réfléchir longtemps : la première réponse est souvent la plus juste. 0, c’est au plus bas ; 10, au plus haut. Par exemple, si tu dors mal depuis une semaine, ton énergie est peut-être à 3, et c’est très bien de le voir.</p>' + blocEchelles('md') + pointBlessures() + '<div class="mc-meteo-dit" data-meteo-dit hidden aria-live="polite"></div>' + bravo(1) + '</section>' +
      '<section class="mc-etape"><h3><span>2</span> Ta roue de la vie</h3><p class="mc-consigne">Pour chaque domaine de ta vie, à quel point te sens-tu comblé·e aujourd’hui ? 0, pas du tout ; 10, pleinement. Ta roue se dessine à côté : plus elle est ronde, plus ta vie est équilibrée. Elle n’a pas besoin d’être grande partout, elle a besoin d’être juste pour toi.</p>' + blocRoue('rd') + '<p class="mc-pourquoi" data-roue-bas></p>' + (A ? '<div class="mc-roue-lecture" data-roue-lecture></div>' : '') + boutonsRoue('debut') + bravo(2) + '</section>' +
      '<section class="mc-etape"><h3><span>3</span> Ton objectif du mois, bien formulé</h3><p class="mc-consigne">Un objectif clair met ton énergie en mouvement. On le formule en positif (ce que tu veux, pas ce que tu ne veux plus), il dépend de toi, et tu sais à quoi tu reconnaîtras qu’il est atteint. Par exemple, « ne plus me laisser marcher dessus » devient « dire calmement ce dont j’ai besoin ».</p>' +
        choix('obj-domaine', 'Quel domaine de ta roue veux-tu nourrir ce mois-ci ?', ROUE.map(function (d) { return d[2]; })) +
        zone('obj-quoi', 'Qu’est-ce que tu veux pour toi ce mois-ci ? Commence ta phrase par « Je veux… »', { court: true, ph: 'Exemple : je veux dire ce dont j’ai besoin au moment où je le ressens', aide: 'Formule ce que tu veux à la place de ce que tu ne veux plus.' }) +
        zone('obj-pas', 'Quel est ton tout premier pas, à faire dans les 48 heures ?', { court: true, ph: 'Exemple : bloquer jeudi soir dans mon agenda, rien que pour moi' }) +
        curseur('obj-croyance', 'À quel point crois-tu pouvoir y arriver ?', 'pas du tout', 'complètement') +
        plus('objectif-plus', 'Affiner mon objectif (dépend de toi, avec tes sens, tes appuis…)',
        '<p class="mc-consigne">Si tu as quelques minutes de plus, ces questions rendent ton objectif plus clair et plus solide. Tu peux aussi y revenir pendant la semaine 1.</p>' +
        choix('obj-depend', 'Est-ce que cet objectif dépend de toi ?', ['Oui, entièrement', 'En partie', 'Pas vraiment']) +
        zone('obj-part', 'Quelle part de cet objectif dépend vraiment de toi ?', { court: true, ph: 'Exemple : je ne peux pas changer ma cheffe, mais je peux choisir ma réponse' }) +
        zone('obj-contexte', 'Où, quand et comment veux-tu que ça change ?', { court: true, ph: 'Exemple : au travail le lundi, en disant calmement ce dont j’ai besoin', aide: 'Imagine comment ce serait, concrètement, si ça changeait vraiment.' }) +
        '<div class="mc-trois"><p class="mc-q">À quoi sauras-tu que tu l’as atteint ? Imagine la scène avec tes sens.</p>' +
          zone('obj-voir', 'Qu’est-ce que tu verras ?', { lignes: 2, ph: 'Exemple : des soirées libres dans mon agenda' }) +
          zone('obj-entendre', 'Qu’est-ce que tu entendras, ou te diras ?', { lignes: 2, ph: 'Exemple : « Merci de m’avoir prévenu·e. »' }) +
          zone('obj-ressentir', 'Qu’est-ce que tu ressentiras dans ton corps ?', { lignes: 2, ph: 'Exemple : les épaules plus légères' }) + '</div>' +
        zone('obj-ecologie', 'Qu’est-ce que ça va changer pour toi et pour tes proches ? Y a-t-il quelque chose que tu risques de perdre ?', { lignes: 2, ph: 'Exemple : j’aurai plus de temps pour moi. Au début, je risque de décevoir un peu.' }) +
        zone('obj-ressources', 'Sur quoi peux-tu t’appuyer ? Ce que tu as déjà, qui peut t’aider, une fois où tu as réussi quelque chose de semblable.', { lignes: 3, ph: 'Exemple : mon amie Claire, ma patience, la fois où j’ai osé demander un congé.' }) +
        zone('obj-un-point', 'Qu’est-ce qui te ferait gagner un point de plus sur ce curseur ?', { court: true, ph: 'Exemple : en parler à une amie qui m’encouragera' })) + bravo(3) +
      '</section>' +
      '<section class="mc-etape"><h3><span>4</span> Ta phrase du mois</h3>' + zone('phrase', 'Quelle phrase veux-tu te redire tout le mois ?', { court: true, ph: 'Exemple : ' + C.citation }) + bravo(5) + '<div data-phrase-jour></div></section>' +
      plus('lettre', 'Ta lettre de dans un an',
        '<p class="mc-consigne">Écris à la personne que tu es aujourd’hui, comme si tu étais déjà un an plus tard. Raconte-lui ce qui a changé, ce que tu as compris, ce que tu veux lui dire pour l’encourager.</p>' +
        zone('proj-an', (DEBUT_ET ? 'Ta lettre, écrite depuis ' + MOIS_NOMS[DEBUT_ET.getMonth()] + ' ' + (DEBUT_ET.getFullYear() + 1) : ET ? 'Ta lettre, écrite dans un an' : 'Ta lettre, écrite depuis ' + C.nomMois.replace(/\d+/, function (a) { return +a + 1; })) + ', à la personne que tu es aujourd’hui', { lignes: 7, ph: 'Exemple : Je t’écris depuis l’an prochain. Je sais que tu doutes en ce moment…' }) +
        '<p class="mc-note">Si tu as un compte et que tu enregistres ta météo du début, ta lettre est gardée dans ton espace. Dans un an, elle t’y attendra.</p>' +
        '<p class="mc-guide-lien">Comment écrire cette lettre ? <a href="lettre-dans-un-an.html" target="_blank" rel="noopener">Lis le guide</a></p>' + prive()) +
      '<div class="mc-actions"><button type="button" class="btn btn-plein" data-meteo="debut">Enregistrer ma météo du début</button><p class="mc-retour" data-retour="debut" aria-live="polite"></p></div>';
  } });

  var MORCEAUX = {};
  function MORCEAU(o) { MORCEAUX[o.id] = o; }

  /* Morceaux déplacés dans la semaine 4 : l'intention qui prend vie et la lettre du mois (mêmes champs, mêmes réponses) */
  function intentionHtml(num) {
    return '<section class="mc-etape mc-intention"><h3><span>' + (num || 4) + '</span> Mon intention prend vie</h3><p class="mc-consigne">Ce que tu nourris de ton attention grandit. Ce mois-ci, tu vas donner à ton objectif une image, une émotion et une croyance qui le soutiennent, comme on prépare la terre avant de semer. Prends ton temps : c’est souvent la page qui change tout.</p>' +
        '<p class="mc-sur">Désirer</p>' + zone('int-desir', 'Au-delà de ton objectif, qu’est-ce que tu désires vraiment ressentir ? Qu’est-ce qu’il t’apportera au fond ?', { lignes: 2, ph: 'Exemple : me sentir libre, légère, respectée. Avoir enfin de l’espace pour moi.' }) +
        '<p class="mc-sur">Ressentir, comme si c’était déjà là</p><p class="mc-consigne">Ferme les yeux quelques secondes. Imagine-toi à la fin du mois, ton intention réalisée. Où es-tu ? Que vois-tu, qu’entends-tu ? Laisse monter l’émotion dans ton corps, la joie, le soulagement, la fierté. Puis écris au présent, comme si tu le vivais déjà.</p>' +
        zone('proj-mois', 'Raconte cette scène au présent : que vois-tu, qu’entends-tu, que ressens-tu ?', { lignes: 4, ph: 'Exemple : c’est mardi soir, je suis sur mon canapé, le téléphone éteint. Je souris, je me sens à ma place, mes épaules sont légères.' }) +
        '<p class="mc-sur">Croire</p>' +
        '<div class="mc-deux">' + zone('int-frein', 'Quelle petite voix te dit que ce n’est pas possible, ou pas pour toi ?', { lignes: 2, ph: 'Exemple : « Ce n’est pas pour les gens comme moi. »' }) +
          zone('int-croire', 'Que choisis-tu de croire à la place ? Une phrase douce et vraie pour toi.', { lignes: 2, ph: 'Exemple : « J’ai le droit d’avoir une vie qui me ressemble, et j’apprends chaque jour. »' }) + '</div>' +
        '<p class="mc-sur">Voir</p><p class="mc-consigne">Ton mini tableau de vision : trois mots ou trois images qui représentent ce que tu accueilles ce mois-ci. Tu peux aussi les découper dans un magazine et les coller près de ton lit, pour les voir chaque matin.</p>' +
        '<div class="mc-trois">' + zone('vision-1', 'Premier mot ou image', { court: true, ph: 'Exemple : un bain chaud' }) + zone('vision-2', 'Deuxième mot ou image', { court: true, ph: 'Exemple : le mot « oui »' }) + zone('vision-3', 'Troisième mot ou image', { court: true, ph: 'Exemple : la mer au lever du jour' }) + '</div>' +
        (window.GenesoliaFond ? '<p class="gf-bouton"><button type="button" class="btn btn-trait" data-fond-ouvrir>Créer mon fond d’écran avec mes mots</button></p><div data-fond></div>' : '') + bravo(4) +
      '</section>';
  }
  function lettreMoisHtml() {
    return plus('lettre-mois', 'Ma lettre du mois',
        '<p class="mc-consigne">Écris-toi une lettre merveilleuse, comme si tu parlais à ton enfant intérieur, ou à ta meilleure amie que tu aimes de tout ton cœur. Dis-lui ce que tu te pardonnes, ce que tu laisses partir, ce dont tu es fière, et ce que tu lui souhaites pour ce mois. Il n’y a pas de bonne façon de l’écrire : seulement la tienne.</p>' +
        '<div class="mc-amorces"><p class="mc-q">Pour t’aider à commencer, touche une amorce : elle s’ajoute à ta lettre.</p>' + ['Ce que je me pardonne…', 'Ce que je laisse partir…', 'Ce dont je suis fière…', 'Ce que je te souhaite pour ce mois…'].map(function (a) { return '<button type="button" data-amorce="' + esc(a) + '">' + esc(a) + '</button>'; }).join('') + '</div>' +
        zone('lettre-mois', 'Ma lettre du mois', { lignes: 10, ph: 'Exemple : Ce mois-ci, je voulais te dire…' }) +
        '<p class="mc-note">Tu peux l’écrire ici et l’enregistrer dans ton espace, ou l’écrire à la main, l’imprimer et la garder de côté. Elle est à toi.</p>' +
        '<p class="mc-guide-lien">Comment écrire ta lettre du mois ? <a href="lettre-du-mois.html" target="_blank" rel="noopener">Lis le guide</a></p>' + prive() +
        '<div class="mc-encadre mc-ancien" data-ancien-ancrage hidden></div>');
  }

  MORCEAU({ id: 'theme', nom: 'Le thème', g: function () {
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

  MORCEAU({ id: 'comprendre', nom: (C.noms || {}).comprendre || 'Comprendre', g: function () {
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

  MORCEAU({ id: 'exercices', nom: 'Les exercices', g: function () {
    return gauche('exercices', 'Les exercices du mois', C.exercicesTitre || 'Voir, entendre, essayer', C.exercicesIntro ? '<p class="mc-intro">' + md(C.exercicesIntro) + '</p>' : '',
      sommaire(A ? C.exercices.concat([{ k: 'gestes', titre: 'Mes gestes du mois' }]) : C.exercices));
  }, d: function () { return C.exercices.map(exercice).join('') + (A ? sectionGestes() : ''); } });
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
        }).join('') + [].concat(x.apres || []).map(function (c) { return zone(c.k, c.q, { lignes: 2, ph: c.ph, court: c.court }); }).join('');
      } else {
        /* Avec l'accompagnement, les idées de gestes deviennent « Mes gestes du mois », à cocher, en bas de la page */
        corps = (x.gestes && !A ? '<p class="mc-q">Des idées de gestes, pour t’inspirer :</p><ul class="mc-pastilles">' + x.gestes.map(function (g) { return '<li>' + esc(g) + '</li>'; }).join('') + '</ul>' : '') +
          zone(x.k, x.q || 'Ton geste', { lignes: 4, ph: x.ph || x.debut }) +
          (x.journal ? '<div class="mc-journal"><p class="mc-q">' + esc(x.journal.q) + '</p>' + Array.apply(null, { length: x.journal.n }).map(function (_, j) {
            return '<label class="mc-essai"><span>' + esc(x.journal.etiquette || 'Essai') + ' ' + (j + 1) + '</span><input type="text" data-k="' + x.journal.k + '-' + j + '"' + (j === 0 && x.journal.ph ? ' placeholder="' + esc(x.journal.ph) + '"' : '') + '></label>';
          }).join('') + '</div>' : '');
      }
      return '<section class="mc-exercice" id="mc-ex-' + esc(x.k) + '"><p class="mc-sur" data-num-ex>Exercice ' + (i + 1) + '</p><h3 class="mc-h">' + esc(x.titre) + '</h3><p class="mc-consigne">' + md(x.consigne) + '</p>' +
        (x.pourquoi ? '<p class="mc-pourquoi"><b>Pourquoi cet exercice ?</b> ' + md(x.pourquoi) + '</p>' : '') +
        (x.astuce ? '<p class="mc-pourquoi"><b>Une astuce :</b> ' + md(x.astuce) + '</p>' : '') + corps + '</section>';
  }

  MORCEAU({ id: 'rituel', nom: (C.noms || {}).rituel || 'Rituel et méditation', g: function () {
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
      ''; } });
  /* La méditation du mois (séance de visualisation) : à écouter quand on veut, rangée dans la semaine 1 */
  function seanceHtml() {
    var M = C.meditation;
    return '<section class="mc-seance" id="mc-seance"><div class="mc-separe">' + ORNEMENT + '</div>' +
      '<p class="mc-sur">Ta séance de visualisation du mois</p><h3 class="mc-h">' + esc(M.titre) + '</h3>' +
      lecteur(C.audio, 'Ta séance de visualisation du mois, plus de 20 minutes') + lecteur(C.audioCourt, 'La version courte') +
      '<p class="mc-note">Lis ce texte lentement, à voix basse ou dans ta tête, en t’arrêtant aux pauses. Tu peux aussi l’enregistrer avec ta propre voix et l’écouter les yeux fermés.</p>' +
      (M.conseil ? '<p class="mc-pourquoi">' + md(M.conseil) + '</p>' : '') +
      '<div class="mc-medit"' + (DECOR.meditation ? ' style="--fond:url(\'' + esc(fondUrl(DECOR.meditation)) + '\')"' : '') + '><div class="mc-medit-in">' + M.texte.map(function (x) { return /^\[/.test(x) ? '<p class="mc-pause">' + esc(x.slice(1, -1)) + '</p>' : '<p>' + md(x) + '</p>'; }).join('') + '</div></div>' +
      zone(M.note.k, M.note.q, { lignes: 3, ph: M.note.ph }) + '</section>';
  }
  function lecteur(src, titre) {
    if (!src) return '';
    return '<div class="mc-audio" data-audio hidden><p class="mc-q">' + esc(titre) + '</p><audio controls preload="metadata" src="' + esc(src) + '"></audio></div>';
  }
  function citation() {
    return '<blockquote class="mc-citation"' + (DECOR.citation ? ' style="--fond:url(\'' + esc(fondUrl(DECOR.citation)) + '\')"' : '') + '><span>' + esc(C.citation) + '</span></blockquote>';
  }

  MORCEAU({ id: 'semaines', nom: 'Mes 4 semaines', g: function () {
    var carte = (DECOR.cartes || {}).semaines;
    return gauche('semaines', 'Un pas par semaine', 'Mes quatre semaines',
      '<p class="mc-intro">Chaque semaine, une petite action, et trois questions pour voir ce qui avance. Les petites victoires comptent : ce sont elles qui, mises bout à bout, changent une vie.</p>',
      (carte ? '<figure class="mc-carte mc-carte-g"><img src="' + esc(carte[0]) + '" alt="' + esc(carte[1]) + '" width="270" height="338" loading="lazy"></figure>' : '') +
      '<p><button type="button" class="btn btn-trait mc-btn-ics" data-ics>Ajouter mes rappels à mon agenda</button></p><p class="mc-note">Un rappel chaque semaine et un pour ton bilan, dans ton propre agenda. Aucun e-mail ne t’est envoyé.</p>');
  }, d: function () { return C.semaines.map(function (s, i) { return blocSemaine(i); }).join(''); } });
  function blocSemaine(i) {
      var s = C.semaines[i], k = 'sem' + (i + 1); if (Array.isArray(s)) s = { titre: s[0], texte: s[1] };
      return '<section class="mc-semaine" id="mc-semaine-' + (i + 1) + '"><div class="mc-sem-tete"><span class="mc-sem-n">Semaine ' + (i + 1) + '</span><h3>' + esc(s.titre) + '</h3><label class="mc-fait"><input type="checkbox" data-k="' + k + '-fait"> C’est fait</label></div><p>' + md(s.texte) + '</p>' +
        (s.exemple ? '<p class="mc-pourquoi">' + md(s.exemple) + '</p>' : '') +
        (window.MAYA_SEMAINES && window.Maya ? '<div class="mc-maya" data-maya-sem="' + i + '"></div>' : '') +
        zone(k + '-notes', 'Qu’as-tu remarqué, essayé ou ressenti cette semaine ?', { lignes: 3, ph: s.ph }) +
        zone(k + '-victoire', 'Quelle est ta victoire de la semaine, même toute petite ?', { court: true, ph: 'Exemple : j’ai tenu mon rendez-vous avec moi samedi' }) +
        zone(k + '-appris', 'Qu’as-tu appris sur toi cette semaine ?', { court: true, ph: 'Exemple : quand je suis fatigué·e, je dis oui plus vite' }) +
        zone(k + '-signes', 'Qu’est-ce qui est venu vers toi cette semaine ? Un signe, une rencontre, une coïncidence, une bonne nouvelle, même minuscule.', { lignes: 2, ph: 'Exemple : une amie m’a proposé exactement la balade dont j’avais envie, sans que je lui en parle.' }) +
        curseur(k + '-elan', 'Quel a été ton élan cette semaine ?', 'à plat', 'plein élan') + '</section>';
  }

  /* ───── Les quatre semaines : chaque semaine est un chapitre complet ─────
     Tout reste ouvert ; la semaine en cours est mise en avant (onglet et bandeau en haut du carnet). */
  var ETAPES_SEM = [
    ['Observer', 'Cette semaine, tu regardes sans juger : ce qui te nourrit, ce qui te vide, ce qui se répète. Voir, c’est déjà commencer à changer.'],
    ['Nourrir', 'Cette semaine, tu prends soin de toi et de ce que tu as découvert. Tu t’appuies sur tes forces pour nourrir le domaine qui en a le plus besoin.'],
    ['Libérer', 'Cette semaine, tu laisses partir ce qui pèse : une habitude, une colère, une croyance. Tu fais de la place pour ce qui arrive.'],
    ['Récolter', 'Cette semaine, tu relis ton chemin, tu remercies, et tu donnes vie à ton intention. Chaque petit pas compte.']
  ];
  function bornesSem(i) { var d = dateSemaine(i), p = String(C.mois).split('-'), f = i < 3 ? plusJ(d, 6) : DEBUT_ET ? new Date(DEBUT_ET.getFullYear(), DEBUT_ET.getMonth() + 1, DEBUT_ET.getDate() - 1) : new Date(+p[0], +p[1], 0); return [d, f]; }
  function semaineEnCours() {
    var a = new Date(), p = String(C.mois).split('-');
    if (DEBUT_ET) { var j = Math.floor((new Date(a.getFullYear(), a.getMonth(), a.getDate()) - DEBUT_ET) / 864e5); return j < 0 || new Date(a.getFullYear(), a.getMonth(), a.getDate()) > bornesSem(3)[1] ? -1 : Math.min(3, Math.floor(j / 7)); }
    if (a.getFullYear() !== +p[0] || a.getMonth() + 1 !== +p[1]) return -1;
    return Math.min(3, Math.floor((a.getDate() - 1) / 7));
  }
  function dates(i) { var b = bornesSem(i); return 'du ' + jourCourt(b[0]) + ' au ' + jourCourt(b[1]); }
  function enteteSemaine(i) {
    return '<div class="mc-sem-badge"><span class="mc-sem-num">Semaine ' + (i + 1) + '</span><span class="mc-sem-etape">' + ETAPES_SEM[i][0] + '</span><span class="mc-sem-dates">' + dates(i) + '</span><span class="mc-sem-encours" data-encours="' + i + '" hidden>Ta semaine en cours</span></div>';
  }
  function introSemaine(i) {
    return '<div class="mc-sem-intro"><p class="mc-sem-titre">Semaine ' + (i + 1) + ' · ' + ETAPES_SEM[i][0] + '</p><p>' + ETAPES_SEM[i][1] + '</p></div>' +
      '<p class="mc-pont" data-pont="' + i + '" hidden></p>';
  }
  function rappelGestes() {
    return A ? '<p class="mc-pourquoi mc-rappel-gestes">Tes gestes du mois t’accompagnent toutes les semaines : <a href="#gestes">les voir et les cocher</a>.</p>' : '';
  }
  /* Les contenus ajoutés du mois (assets/plus/AAAA-MM.js) : un texte pour comprendre, le fil des 7 jours, un exercice de plus */
  var PLUS = window.GENESOLIA_PLUS || {};
  function plusSem(i) { return ((SUIVI ? PLUS.suivi : PLUS.carnet) || [])[i] || {}; }
  function textePlus(i) {
    var T = plusSem(i).comprendre; if (!T || !T.texte) return '';
    return '<section class="mc-comprendre-sem"><p class="mc-sur">Pour comprendre</p>' + (T.titre ? '<h3 class="mc-h">' + esc(T.titre) + '</h3>' : '') + paras([].concat(T.texte)) + '</section>';
  }
  /* Le corps (cycle 1) : la boucle de survie, le mode alerte, une séance corps. Contenu : assets/plus/AAAA-MM.js, carnet[i].corps */
  function corpsSem(i) {
    var K = plusSem(i).corps; if (!K) return '';
    return '<section class="mc-corps" id="mc-corps-' + (i + 1) + '"><div class="mc-separe">' + ORNEMENT + '</div><p class="mc-sur">' + esc(K.sur || 'Ton corps cette semaine') + '</p><h3 class="mc-h">' + esc(K.titre) + '</h3>' +
      (K.intro ? '<p class="mc-consigne">' + md(K.intro) + '</p>' : '') + paras(K.texte) +
      (K.etapes ? '<ol class="mc-etapes">' + K.etapes.map(function (e) { return '<li>' + md(e) + '</li>'; }).join('') + '</ol>' : '') +
      (K.conseil ? '<p class="mc-pourquoi">' + md(K.conseil) + '</p>' : '') +
      (K.choix ? choix(K.choix.k, K.choix.q, K.choix.options) : '') +
      (K.questions || []).map(function (c) { return zone(c.k, c.q, { lignes: c.lignes || 2, ph: c.ph }); }).join('') + '</section>';
  }
  function filJours(i) {
    var J = plusSem(i).jours; if (!J || !J.length) return '';
    var base = SUIVI ? C.semaines[i].cle : 'sem' + (i + 1), d0 = bornesSem(i)[0], auj = isoJ(new Date());
    return '<section class="mc-jours" id="mc-jours-' + (i + 1) + '"><div class="mc-separe">' + ORNEMENT + '</div><p class="mc-sur">Le fil des 7 jours</p><h3 class="mc-h">Un petit rendez-vous par jour</h3>' +
      '<p class="mc-consigne">Chaque jour, une consigne de deux minutes. Coche-la quand c’est fait : mis bout à bout, ces petits gestes changent une semaine.</p><ol class="mc-jours-l">' +
      J.map(function (t, j) { var d = plusJ(d0, j); return '<li' + (isoJ(d) === auj ? ' class="mc-auj"' : '') + '><label><input type="checkbox" data-k="' + base + '-j' + (j + 1) + '"><span class="mc-j-d">' + cap(JOURS_C[d.getDay()]) + ' ' + jourCourt(d) + (isoJ(d) === auj ? ' · aujourd’hui' : '') + '</span><span class="mc-j-t">' + md(t) + '</span></label></li>'; }).join('') + '</ol></section>';
  }
  function cap(t) { return t.charAt(0).toUpperCase() + t.slice(1); }
  /* Ma phrase du jour : la phrase du mois peut devenir une notification quotidienne (assets/notifs.js) */
  var phraseCanal = null;
  function majPhraseJour() {
    var z = racine.querySelector('.mc-livre [data-phrase-jour]'); if (!z || !window.GenesoliaNotifs || !window.GenesoliaNotifs.phraseDuJour) return;
    var canal = user ? 'cercle' : 'site'; if (phraseCanal === canal) return; phraseCanal = canal;
    window.GenesoliaNotifs.phraseDuJour(z, { canal: canal, sb: sb, suggestion: String(D.v.phrase || '').trim() });
  }
  function titreSemaine(i) { return '<div class="mc-separe">' + ORNEMENT + '</div><p class="mc-sur">Ta semaine ' + (i + 1) + ' · à remplir au fil des jours</p>'; }
  /* Le rituel de saison, rangé dans la semaine 4 (« Récolter ») : même contenu, mêmes champs */
  /* L'exercice du mois du cycle 1, à faire seul·e (C.exerciceDuMois) : rangé en semaine 1, après le thème.
     { titre, objectif, sousObjectif, duree, avant, temps: [{ titre, intro, etapes, tableau, apres }], geste: { titre, texte }, liens: [[page, titre]], ph } */
  function exerciceDuMoisHtml() {
    var X = C.exerciceDuMois; if (!X) return '';
    return '<section class="mc-proto mc-exmois" id="mc-p-exmois"><div class="mc-separe">' + ORNEMENT + '</div><p class="mc-sur">' + esc(X.sur || 'Ton exercice du mois, à faire seul·e') + '</p><h3 class="mc-h">' + esc(X.titre) + '</h3>' +
      '<p class="mc-consigne"><b>Objectif :</b> ' + md(X.objectif || '') + (X.sousObjectif ? '<br><b>Sous-objectif :</b> ' + md(X.sousObjectif) : '') + '</p>' +
      (X.duree ? '<p class="mc-pourquoi"><b>Ton temps :</b> ' + md(X.duree) + '</p>' : '') +
      (X.avant ? paras([].concat(X.avant)) : '') +
      (X.temps || []).map(function (t) {
        return '<div class="mc-exmois-temps"><p class="mc-etapes-t">' + md(t.titre || '') + '</p>' + (t.intro ? paras([].concat(t.intro)) : '') + etapesHtml(t.etapes) + tableauHtml(t.tableau) + (t.apres ? paras([].concat(t.apres)) : '') + '</div>';
      }).join('') +
      (X.geste ? encadre(X.geste.titre || 'Chaque jour', '<p>' + md(X.geste.texte) + '</p>', 'mc-encadre-or') : '') +
      (X.liens && X.liens.length ? encadre('Pour aller plus loin', '<ul class="mc-liste">' + X.liens.map(function (l) { return '<li><a href="' + esc(l[0]) + '">' + esc(l[1]) + '</a></li>'; }).join('') + '</ul>') : '') +
      zone('exmois-note', 'Ce que je retiens de mon exercice du mois', { lignes: 3, ph: X.ph }) +
      '<label class="mc-fait"><input type="checkbox" data-k="exmois-fait"> J’ai fait mon exercice du mois</label>' + boutonPdf('mc-p-exmois') + '</section>';
  }
  function rituelHtml() {
    var R = C.rituel;
    return '<section class="mc-rituel" id="mc-rituel"><div class="mc-separe">' + ORNEMENT + '</div><p class="mc-sur">' + esc((C.noms || {}).rituelSur || 'Le rituel de saison') + '</p><h3 class="mc-h">' + esc(R.titre) + '</h3><p>' + md(R.intro) + '</p>' + MORCEAUX.rituel.d() + '</section>';
  }
  /* Équilibre des quatre semaines (carnet et suivi, même trame) :
     S1 Observer : le thème, l'exercice 1 · S2 Nourrir : comprendre, l'exercice 2, les gestes du mois
     S3 Libérer : un texte, l'exercice 3, la lettre du mois · S4 Récolter : un texte, l'intention, le rituel de saison, la séance de visualisation
     Chaque semaine : le fil des 7 jours et le bilan de la semaine. Les textes ajoutés viennent de assets/plus/AAAA-MM.js. */
  if (!SUIVI) {
    PAGES.push({ id: 'semaine-1', nom: 'Semaine 1 · Observer', sem: 0, g: function () { return enteteSemaine(0) + MORCEAUX.theme.g(); },
      d: function () { return introSemaine(0) + textePlus(0) + MORCEAUX.theme.d() + exerciceDuMoisHtml() + exercice(C.exercices[0], 0) + corpsSem(0) + filJours(0) + titreSemaine(0) + blocSemaine(0); } });
    PAGES.push({ id: 'semaine-2', nom: 'Semaine 2 · Nourrir', sem: 1, g: function () { return enteteSemaine(1) + MORCEAUX.comprendre.g(); },
      d: function () { return introSemaine(1) + textePlus(1) + MORCEAUX.comprendre.d() + exercice(C.exercices[1], 1) + (A ? sectionGestes() : '') + corpsSem(1) + filJours(1) + titreSemaine(1) + blocSemaine(1); } });
    PAGES.push({ id: 'semaine-3', nom: 'Semaine 3 · Libérer', sem: 2, g: function () {
      var T = plusSem(2).comprendre;
      return enteteSemaine(2) + gauche('semaine-3', 'Semaine 3 · Libérer', T && T.titre ? T.titre : 'Faire de la place', '<p class="mc-intro">' + (T && T.chapeau ? md(T.chapeau) : 'Cette semaine, tu laisses partir ce qui pèse : une habitude, une colère, une croyance. Tu fais de la place pour ce qui arrive.') + '</p>');
    }, d: function () { return introSemaine(2) + textePlus(2) + C.exercices.slice(2).map(function (x, j) { return exercice(x, j + 2); }).join('') + corpsSem(2) + lettreMoisHtml() + rappelGestes() + filJours(2) + titreSemaine(2) + blocSemaine(2); } });
    PAGES.push({ id: 'semaine-4', nom: 'Semaine 4 · Récolter', sem: 3, g: function () {
      return enteteSemaine(3) + gauche('semaine-4', 'Semaine 4 · Récolter', 'Ton intention prend vie', '<p class="mc-intro">Dernière semaine du mois : tu relis ce que tu as vécu, tu remercies, et tu donnes une image, une émotion et une croyance à ce que tu veux voir grandir.</p>');
    }, d: function () { return introSemaine(3) + textePlus(3) + intentionHtml() + corpsSem(3) + rituelHtml() + seanceHtml() + '<div class="mc-victoires" data-victoires></div>' + rappelGestes() + filJours(3) + titreSemaine(3) + blocSemaine(3); } });
  }

  PAGES.push({ id: 'cloture', nom: 'Mon bilan du mois', g: function () {
    return gauche('cloture', 'Pour clore le mois · 10 minutes', 'Ma météo de fin de mois',
      '<p class="mc-intro">Prends ce temps à la fin du mois, même si tout n’a pas été fait. Tu vas comparer avec ton début de mois : c’est souvent là que l’on voit tout le chemin parcouru.</p><p>Un point gagné sur un curseur, c’est un vrai mouvement. Un point perdu, c’est une information, pas un échec : le mois a peut-être été chargé.</p>');
  }, d: function () {
    return '<section class="mc-etape"><h3><span>1</span> Là, maintenant, comment te sens-tu ?</h3>' + blocEchelles('mf') + '<div class="mc-graphes" id="mc-graphes"></div></section>' +
      '<section class="mc-etape"><h3><span>2</span> Ta roue de la vie, un mois plus tard</h3><p class="mc-consigne">Note à nouveau chaque domaine, sans regarder tes réponses du début. Les deux roues se superposent : regarde ce qui s’est arrondi.</p>' + blocRoue('rf') + boutonsRoue('fin') + '</section>' +
      '<section class="mc-etape"><h3><span>3</span> Ton objectif</h3><div class="mc-rappel" id="mc-rappel-obj"></div>' +
        '<div data-si-objectif>' + curseur('fin-obj', 'Où en es-tu de ton objectif ?', 'pas commencé', 'atteint') + '</div>' +
        zone('fin-preuves', 'Qu’as-tu vu, entendu ou ressenti qui te montre que tu as avancé ?', { lignes: 3, ph: 'Exemple : ma sœur m’a dit que j’avais l’air plus détendu·e.' }) +
      '</section>' +
      '<section class="mc-etape"><h3><span>4</span> ' + esc(C.bilanTitre || 'Ce que ce mois t’a apporté') + '</h3>' +
        (A ? '<div class="mc-bilan-gestes" data-bilan-gestes></div>' : '') +
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
    return '';   /* retiré : chaque livre reste propre, on passe de l'un à l'autre par la barre de l'appli */
    var autre = SUIVI ? { sur: 'Le carnet « J’avance »', texte: 'Ton côté pour avancer : ta roue de la vie, ton objectif du mois, tes petits pas et ton intention qui prend vie.', lien: vers('mon-carnet.html'), bouton: 'Ouvrir mon carnet du mois' }
      : { sur: 'Le suivi « Je me libère »', texte: 'Ton côté pour te libérer : voir ce qui se rejoue, remonter à la source, déposer ce qui ne t’appartient pas, poser un geste nouveau.', lien: vers('mon-suivi-mois.html'), bouton: 'Ouvrir mon suivi du mois' };
    return '<aside class="mc-autre"><p class="mc-sur">Ton autre livre du mois</p><h3 class="mc-h">' + autre.sur + '</h3><p>' + autre.texte + '</p><p><a class="btn btn-plein" href="' + autre.lien + '">' + autre.bouton + '</a></p></aside>';
  }
  /* « À lire ce mois-ci » : les articles du blog reliés au mois (champ aLire du carnet), en bas du carnet */
  /* Les avis : un encart sous chaque livre (carnet, suivi, module), pour demander un retour et donner l'adresse de contact */
  /* Avis, question ou idée : un formulaire rangé dans la table « demandes » de Supabase (formulaire « Avis du Cercle ») ; Laura les lit dans son tableau */
  function avisHtml() {
    var quoi = MODULE ? 'le module ' + C.module + ' de la formation' : SUIVI ? 'mon suivi « Je me libère »' : 'mon carnet « J’avance »';
    var mail = ''; try { var ses = JSON.parse(localStorage.getItem('sb-qsvzzkjtjsznfntahvvh-auth-token') || 'null'); mail = (ses && ses.user && ses.user.email) || ''; } catch (x) {}
    var types = [['avis', 'Un avis'], ['question', 'Une question'], ['idee', 'Une idée']];
    return '<aside class="mc-encadre mc-encadre-or mc-avis"><p class="mc-encadre-t">Envoie-nous ton avis, on en a besoin</p>' +
      '<p>Ce qui t’aide, ce qui manque, une question sur un exercice : chaque message est lu, et chaque avis aide à faire grandir Le Cercle.</p>' +
      '<form class="mc-avis-form" data-quoi="' + esc(quoi) + '" novalidate>' +
        '<div class="mc-avis-types" role="radiogroup" aria-label="Ton message est">' + types.map(function (x, i) {
          return '<label><input type="radio" name="type" value="' + x[0] + '"' + (i ? '' : ' checked') + '> <span>' + x[1] + '</span></label>'; }).join('') + '</div>' +
        '<label class="mc-avis-l">Ton message<textarea name="message" rows="4" maxlength="1500" required placeholder="Exemple : l’exercice de la semaine 2 m’a beaucoup aidée, mais je bloque sur…"></textarea></label>' +
        '<div class="mc-avis-ligne"><label class="mc-avis-l">Ton prénom <span>(facultatif)</span><input type="text" name="prenom" maxlength="60" autocomplete="given-name"></label>' +
        '<label class="mc-avis-l">Ton e-mail <span>(pour te répondre)</span><input type="email" name="email" maxlength="254" required autocomplete="email" value="' + esc(mail) + '"></label></div>' +
        '<input type="text" name="_gotcha" tabindex="-1" autocomplete="off" class="mc-avis-piege" aria-hidden="true">' +
        '<p class="mc-avis-actions"><button type="submit" class="btn btn-plein">Envoyer</button> <span class="mc-avis-etat" role="status"></span></p>' +
      '</form></aside>';
  }
  if (!window.__mcAvis) {
    window.__mcAvis = true;
    document.addEventListener('submit', function (ev) {
      var fm = ev.target; if (!fm || !fm.classList || !fm.classList.contains('mc-avis-form')) return;
      ev.preventDefault();
      var etat = fm.querySelector('.mc-avis-etat'), bt = fm.querySelector('button[type=submit]');
      var g = function (n) { var el = fm.elements[n]; return el ? String(el.value || '').trim() : ''; };
      var typ = (fm.querySelector('input[name=type]:checked') || {}).value || 'avis', msg = g('message'), mail = g('email');
      if (g('_gotcha')) return;
      if (msg.length < 3) { etat.textContent = 'Écris ton message avant d’envoyer.'; return; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) { etat.textContent = 'Ajoute ton e-mail, pour que l’on puisse te répondre.'; return; }
      bt.disabled = true; etat.textContent = 'Envoi…';
      fetch(SB_URL + '/rest/v1/demandes', { method: 'POST', headers: { apikey: SB_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ formulaire: 'Avis du Cercle', email: mail.slice(0, 254), prenom: g('prenom').slice(0, 60) || null, page: (location.pathname + location.search).slice(0, 120),
          details: { type: typ, livret: fm.getAttribute('data-quoi') || '', message: msg.slice(0, 1500) } }) })
        .then(function (r) { if (!r.ok) throw new Error('envoi'); })
        .then(function () {
          fm.innerHTML = '<p class="mc-avis-merci"><b>Merci, c’est bien reçu.</b> ' + (typ === 'question' ? 'Tu recevras une réponse par e-mail.' : 'Chaque message est lu avec attention.') + '</p>';
          if (window.umami) try { window.umami.track('avis-cercle', { type: typ }); } catch (x) {}
        }, function () {
          bt.disabled = false;
          etat.innerHTML = 'L’envoi n’a pas marché. Tu peux écrire directement à <a href="mailto:contact@genesolia.fr">contact@genesolia.fr</a>.';
        });
    });
  }
  function aLire() {
    var L = MODULE ? null : (C.lectures || C.aLire);
    return (L && L.length ? '<section class="mc-alire" id="mc-alire"><p class="mc-sur">Pour accompagner ton mois</p><h3 class="mc-h">À lire ce mois-ci</h3>' +
      '<div class="mc-alire-l">' + L.map(function (a) {
        return '<a class="mc-alire-c" href="' + esc(a.lien) + '"><b>' + esc(a.titre) + '</b><span>' + esc(a.resume) + '</span><em>Lire l’article</em></a>';
      }).join('') + '</div></section>' : '') + imageMois();
  }
  /* L'image du mois : une image citation carrée à enregistrer, et le lien vers Instagram */
  function imageMois() {
    if (MODULE || !('image' in C)) return '';
    if (!C.image) return APERCU ? '<section class="mc-image-mois"><p class="mc-sur">À garder ou à partager</p><h3 class="mc-h">L’image du mois</h3>' + aFournir('[IMAGE DU MOIS À FOURNIR : assets/images-mois/' + C.mois + '.jpg]') + '</section>' : '';
    return '<section class="mc-image-mois" data-image-mois><p class="mc-sur">À garder ou à partager</p><h3 class="mc-h">L’image du mois</h3>' +
      '<figure><img src="' + esc(C.image) + '" alt="L’image citation du mois" width="1080" height="1080" loading="lazy" data-image-mois-img></figure>' +
      '<p class="mc-image-actions"><a class="btn btn-plein" href="' + esc(C.image) + '" download>Enregistrer l’image</a> <a class="mc-insta" href="https://www.instagram.com/genesolia.officiel/" target="_blank" rel="noopener">Voir sur Instagram</a></p></section>';
  }
  function lienSuivi() {
    return '';   /* retiré : plus de lien d'un livre à l'autre dans les pages */
    if (!C.suivi) return '';
    return '<aside class="mc-encadre mc-encadre-rose mc-suivi"><p class="mc-encadre-t">' + (ET ? 'À cette étape' : 'Ce mois-ci') + ', dans ton suivi « Je me libère »</p><p><b>' + esc(C.suivi.titre) + '.</b> ' + md(C.suivi.texte) + '</p><p><a class="btn btn-trait" href="' + esc(vers('mon-suivi-mois.html')) + '">Ouvrir mon suivi</a></p></aside>';
  }
  function aVenir() {
    if (!C.aVenir || !C.aVenir.length) return '';
    return '<section class="mc-avenir"><div class="mc-separe">' + ORNEMENT + '</div><p class="mc-sur">Le Cercle continue</p><h3 class="mc-h">' + (ET ? 'Tes prochaines étapes' : 'Les prochains carnets') + '</h3>' +
      '<div class="mc-avenir-l">' + C.aVenir.map(function (a, i) {
        var lib = ET && !/^[ÉE]tape/.test(a.mois || '') ? 'Étape ' + (ET.n + i + 1) : a.mois;   /* par étapes : « Étape N » plutôt qu'un mois du calendrier */
        return '<article class="mc-av">' + (a.image ? '<img src="' + esc(a.image) + '" alt="" loading="lazy" width="120" height="120">' : '') + '<div><p class="mc-sem-n">' + esc(lib) + '</p><p class="mc-av-t">' + esc(a.titre) + '</p><p>' + esc(a.texte) + '</p></div></article>';
      }).join('') + '</div><p class="mc-av-lien"><a class="btn btn-trait" href="mon-mois.html">Mes carnets précédents</a></p></section>';
  }

  /* ───── Mon suivi « Je me libère » : le même livre, avec ses propres pages ─────
     La saison, le thème, quatre semaines (voir, source, libérer, remplacer), la méditation, le bilan.
     Essai : les semaines 1, 2 et 3 sont offertes ; la semaine 4, la méditation et le bilan sont réservés au Cercle. */
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
    var debut = dateSemaine(i), fin = bornesSem(i)[1];
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
    var vues = []; majLectures();
    racine.querySelectorAll('[data-maya-sem]').forEach(function (z) { z.innerHTML = semaineMaya(+z.getAttribute('data-maya-sem'), vues); });
  }
  window.addEventListener('beforeprint', function () { racine.querySelectorAll('.mc-maya details').forEach(function (d) { d.open = true; }); });
  function dateSemaine(k) { if (DEBUT_ET) return plusJ(DEBUT_ET, 7 * k); var p = String(C.mois).split('-'); return new Date(+p[0], +p[1] - 1, 1 + 7 * k); }
  function jourMois(d) { return (d.getDate() === 1 ? '1er' : d.getDate()) + ' ' + MOIS_NOMS_S[d.getMonth()]; }
  var MOIS_NOMS_S = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  /* Le fil rouge du cycle 2 : le mode d'emploi du suivi et l'affiche « Mon arbre de vie », visibles dès la première page */
  function arbreEncart() {
    return encadre('Mon arbre de vie, le fil rouge de ton année', '<p>Les exercices, les protocoles et les rituels proposés chaque mois t’aident à faire pousser ton arbre de vie. Comme un arbre, tu commences par les racines (ton histoire), puis le tronc (ce que tu portes), les branches (ce que tu changes) et les fruits (ce que tu choisis de vivre). Lis une fois le mode d’emploi pour savoir ce que contiennent les exercices, les protocoles et les rituels, puis imprime ton affiche et complète-la au fil des mois.</p>' +
      '<p class="mc-boutons-l"><a class="btn btn-trait" href="mode-emploi-suivi.html">Lire le mode d’emploi du suivi</a> <a class="btn btn-trait" href="arbre-de-vie-affiche.html">Imprimer mon affiche</a></p>', 'mc-encadre-or mc-arbre-encart');
  }
  function offreCercle() {
    return '<aside class="mc-encadre mc-encadre-or mc-verrou"><p class="mc-encadre-t">La suite de ton suivi fait partie du Cercle</p><p>Tes 3 premières semaines sont offertes. Avec Le Cercle, tu vis aussi la semaine 4 : ton geste nouveau et ton bilan, et toute la suite de ton année, en plus de ton carnet du mois, de ton guide et de tout le site.</p><p><a class="btn btn-plein" href="abonnement.html">Découvrir Le Cercle, 1 mois offert</a></p></aside>';
  }
  /* La séance audio du mois (mes-seances.html) : cycle 1 = induction + voyage, cycle 2 = induction + méditation audio.
     L'ancre #seance-cN-MM met en avant, dans « Mes séances », la séance qui correspond au fichier de l'étape (même mois que assets/seances.js). */
  function seanceUrl(cy) { return 'mes-seances.html#seance-c' + cy + '-' + String(C.mois).split('-')[1]; }
  function audioEncart() {
    return '<aside class="mc-encadre mc-audio-moment mc-audio-vif" id="mc-audio-moment"><p class="mc-encadre-t">Tes audios · c’est le moment de les écouter</p>' +
      '<p>Cette semaine, tu libères. C’est le meilleur moment pour écouter ta méditation audio du mois, avant ton protocole : au calme, assis·e ou allongé·e, quand personne ne te dérange. Tu pourras ensuite y revenir aussi souvent que tu veux.</p>' +
      '<p><a class="btn mc-btn-audio" href="' + seanceUrl(2) + '">Écouter mes séances audio</a></p></aside>';
  }
  function suiviPages() {
    var P = [], S = window.GENESOLIA_SAISONS, sa = S && S[MOIS_SAISON];
    P.push({ id: 'saison', nom: ET ? 'Ta saison' : 'La saison', g: function () {
      return gauche('saison', (sa ? sa.mois : NOM_MOIS) + ' · ' + (ET ? 'ta saison' : 'la saison'), sa ? sa.titre.charAt(0).toUpperCase() + sa.titre.slice(1) : C.titre,
        sa ? '<p class="mc-intro">' + esc(sa.texte) + '</p>' : '', sa ? '<p class="mc-permission"><b>Ce que ça veut dire pour toi :</b> ' + esc(sa.permission) + '</p>' : '');
    }, d: function () {
      var cit = sa ? '<blockquote class="mc-citation"' + (DECOR.citation ? ' style="--fond:url(\'' + esc(fondUrl(DECOR.citation)) + '\')"' : '') + '><span>' + esc(sa.citation) + '</span></blockquote>' : '';
      var debut = '<section class="mc-etape"><h3><span>1</span> Là, maintenant</h3><p class="mc-consigne">Avant de commencer, prends une photo de ton état intérieur. Tu la compareras à la fin du mois.</p>' +
          curseur('int-debut', C.intensiteQ || 'À quel point ce thème pèse-t-il dans ta vie aujourd’hui ?', 'presque pas', 'énormément') +
          zone('mot-debut', 'En un mot, comment te sens-tu face à ce thème ?', { court: true, ph: 'Exemple : fatigué·e, curieux·se, en colère, prêt·e…' }) +
          zone('liberer-souhait', 'Qu’aimerais-tu libérer ce mois-ci ?', { lignes: 2, ph: C.souhaitPh || 'Exemple : cette impression de devoir tout porter seul·e.' }) + '</section>';
      /* Par étapes : l'étape d'abord, puis tout ce qui suit le vrai mois, regroupé sous « Ta saison » */
      if (ET) return arbreEncart() + debut + '<section class="mc-ta-saison"><div class="mc-separe">' + ORNEMENT + '</div><p class="mc-sur">Ta saison' + (sa ? ' · ' + esc(sa.mois.toLowerCase()) : '') + '</p>' +
        (C.saisonLien && MOIS_SAISON === +String(C.mois).split('-')[1] ? '<p>' + md(C.saisonLien) + '</p>' : '') +
        (sa ? encadre('Un geste de saison', '<p>' + esc(sa.geste) + '</p>', 'mc-encadre-or') : '') + cit + '</section>';
      return (C.saisonLien ? '<p>' + md(C.saisonLien) + '</p>' : '') + arbreEncart() +
        (sa ? encadre('Un geste de saison', '<p>' + esc(sa.geste) + '</p>', 'mc-encadre-or') : '') + debut + cit;
    } });
    P.push({ id: 'theme', nom: 'Le thème', g: function () { return gauche('theme', ET ? 'Le thème de ton étape ' + ET.n : 'Le thème du mois', C.theme.titre, paras(C.theme.texte)); },
      d: MORCEAUX.theme.d });
    C.semaines.forEach(function (w, k) {
      P.push({ id: w.cle, nom: 'Semaine ' + (k + 1) + (w.nom ? ' · ' + w.nom : ''), sem: k, g: function () {
        return gauche(w.cle, 'Semaine ' + (k + 1) + ' · ' + (w.etape || ''), w.titre, '<p class="mc-intro">' + md(w.intro) + '</p>',
          '<p class="mc-quand">À vivre à partir du ' + jourMois(dateSemaine(k)) + '. Tu peux la lire avant, et y revenir quand tu veux.</p>' +
          (w.exercices && w.exercices.length > 1 ? sommaire(w.exercices) : ''));
      }, d: function () {
        if (k > 2 && !membre) return '<p class="mc-pont" data-pont="' + k + '" hidden></p>' + offreCercle();
        var R = w.rituel;
        var X = plusSem(k);
        return '<p class="mc-pont" data-pont="' + k + '" hidden></p>' + (k === 2 ? audioEncart() : '') + (w.texte ? paras([].concat(w.texte)) : '') + textePlus(k) + (w.exercices || []).concat(X.exercices || []).map(exercice).join('') +
          (k === 2 && C.protocole ? protocoleMoisHtml(C.protocole, { sur: 'Mon arbre de vie · le protocole du mois', sansAudio: true }) : '') +
          (k === 2 ? '<p class="mc-pourquoi mc-seance-lib"><b>Ta méditation du mois</b> accompagne cette semaine : <a href="#meditation">la lire</a>.</p>' : '') +
          filJours(k) +
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
      return gauche('meditation', 'La méditation du mois', M.titre, '<p class="mc-intro">' + md(M.intro || 'Une méditation guidée pour accompagner ce que tu libères ce mois-ci. Fais-la une fois au calme, puis reviens-y quand tu en as besoin.') + '</p>');
    }, d: function () {
      if (!membre) return offreCercle();
      var M = C.meditation;
      return '<p class="mc-note">Lis ce texte lentement, à voix basse ou dans ta tête, en t’arrêtant aux pauses. Si une émotion devient trop forte, reviens simplement à ton souffle et à tes pieds sur le sol.</p>' +
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
        (false && C.carnet ? '<aside class="mc-encadre mc-encadre-rose mc-suivi"><p class="mc-encadre-t">Avec ton carnet « J’avance »</p><p><b>' + esc(C.carnet.titre) + '.</b> ' + md(C.carnet.texte) + '</p><p><a class="btn btn-trait" href="mon-carnet.html?mois=' + esc(C.mois) + '">Ouvrir mon carnet du mois</a></p></aside>' : '') +
        aVenir() + '<p class="mc-note mc-mention">Ce suivi propose une démarche symbolique de réflexion et de développement personnel. Il ne remplace pas un accompagnement médical ou psychologique.</p>';
    } });
    return P;
  }
  function comparerIntensite() {
    var z = document.getElementById('mc-compare-int'); if (!z) return;
    var a = D.v['int-debut'], b = D.v['int-fin'], sh = (D.v['liberer-souhait'] || '').trim();
    racine.querySelectorAll('[data-rappel-souhait]').forEach(function (x) { x.hidden = !sh; x.innerHTML = sh ? '<p class="mc-q">' + (MODULE ? 'Au début du module, tu voulais voir autrement' : 'Au début du mois, tu voulais libérer') + '</p><p class="mc-cite">« ' + esc(sh) + ' »</p>' : ''; });
    if (typeof a !== 'number' || typeof b !== 'number') { z.innerHTML = typeof a === 'number' ? '<p class="mc-note">' + (MODULE ? 'Début du module' : 'Début du mois') + ' : ' + a + '/10. Place le curseur pour voir le chemin parcouru.</p>' : ''; return; }
    var d = b - a;
    z.innerHTML = '<p class="mc-int-phrase">' + (MODULE ? 'Début du module' : 'Début du mois') + ' : <b>' + a + '/10</b>, aujourd’hui : <b>' + b + '/10</b>' + (d ? ' (' + (d > 0 ? '+' + d : '−' + Math.abs(d)) + ')' : '') + '.</p>' +
      '<p class="mc-note">' + (d < 0 ? 'Ce thème pèse moins qu’au début' + (MODULE ? '' : ' du mois') + ' : c’est le fruit de ce que tu as osé regarder et changer.' : d === 0 ? 'Le poids est le même, et ce n’est pas un échec : tu le connais mieux, et tu le reconnais plus vite.' : 'Regarder un thème peut le rendre plus présent au début : c’est souvent le signe qu’il se met en mouvement.') + '</p>';
  }
  /* ───── Nouvelle trame du carnet (cycle 1 « Vivre en paix ») : C.trame === 2 ─────
     Le point de départ (point-de-depart.html) oriente le carnet : sa cible, son mode survie, son domaine fragile, sa roue.
     4 bases chaque mois : voir mes forces autrement, nourrir mon corps, grandir ma force, imaginer l'impossible.
     Fin de chaque semaine : ce que j'ai fait, mon bilan, ma lecture de la semaine (nombres, ciel, maya), le lien vers le suivi. */
  var PD = null;
  function pdV() { return PD && PD.v ? PD.v : {}; }
  function pdRoue() { var o = {}, v = pdV(); ROUE.forEach(function (d) { if (typeof v['roue-' + d[0]] === 'number') o[d[0]] = v['roue-' + d[0]]; }); return o; }
  function pdRes() { return pdV().resume || {}; }
  var OBJ_DOMAINES = { argent: 'Me sentir plus en sécurité avec l’argent', corps: 'Retrouver du calme et de l’énergie dans mon corps', lieu: 'Me sentir vraiment chez moi, en paix', relations: 'Oser être moi-même dans mes relations', travail: 'Prendre ma place et me sentir légitime au travail' };
  var OBJ_MODES = { lutter: 'Lâcher un peu de contrôle et accepter de l’aide', fuir: 'Rester face à ce que j’évite, un petit pas à la fois', figer: 'Remettre de l’élan dans mes journées', plaire: 'Dire ce dont j’ai besoin, sans m’effacer' };
  var CONSEILS_MODES = {
    lutter: ['Regarde si l’une de tes forces est née du besoin de tout tenir. Tu peux la garder sans tout porter.', 'Pendant la cohérence cardiaque, laisse tes épaules descendre à chaque expiration : pendant cinq minutes, tu n’as rien à contrôler.', 'Cette semaine, utilise ta force en laissant une petite place à l’aide d’une autre personne.', 'Imagine l’impossible sans chercher comment y arriver : ta part, c’est de choisir, le comment viendra.'],
    fuir: ['Si l’envie de passer à autre chose arrive pendant la rencontre, reste juste trois respirations de plus.', 'Avant de bouger, pose les pieds au sol et sens-les : ton corps peut rester là, en sécurité.', 'Choisis une petite situation que tu évites d’habitude, et utilises-y ta force cinq minutes.', 'Écris ton rêve même s’il te fait peur : le regarder, c’est déjà rester avec lui.'],
    figer: ['Fais la rencontre en douceur, une période par jour si c’est plus facile.', 'Commence par bouger les doigts et les épaules avant la cohérence cardiaque : le mouvement réveille l’élan.', 'Un tout petit geste avec ta force chaque jour suffit : le mouvement compte plus que la taille.', 'Imagine une seule scène, très précise : ton corps a besoin d’une image simple pour avancer.'],
    plaire: ['Regarde si l’une de tes forces servait surtout à faire plaisir. Tu peux maintenant l’offrir aussi à toi.', 'Pendant que tu parles à ton corps, demande-lui ce dont il a besoin, à lui.', 'Cette semaine, utilise ta force pour toi d’abord, avant de l’offrir aux autres.', 'Dans ton texte, écris ce que tu veux pour toi, sans penser à ce que les autres attendent.']
  };
  function W2(i) { return ((C.t2 || {}).semaines || [])[i] || {}; }
  function boutonPdf(id) { return '<p class="mc-pdf-zone"><button type="button" class="btn btn-trait mc-pdf" data-pdf="' + id + '">Télécharger cet exercice en PDF</button></p>'; }
  function grilleJours(base, moments) {
    return '<div class="mc-grille" role="group"><table><thead><tr><th scope="col">Jour</th>' + moments.map(function (m) { return '<th scope="col">' + esc(m) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      [1, 2, 3, 4, 5, 6, 7].map(function (j) { return '<tr><th scope="row">Jour ' + j + '</th>' + moments.map(function (m, n) { return '<td><input type="checkbox" data-k="' + base + '-j' + j + '-' + n + '" aria-label="Jour ' + j + ', ' + esc(m) + '"></td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  }
  function questionsHtml(l) { return (l || []).map(function (c) { return zone(c.k, c.q, { lignes: c.lignes || 2, ph: c.ph, court: c.court }); }).join(''); }
  function protoHtml(P) {
    if (!P) return '';
    var id = 'mc-p-' + P.id;
    return '<section class="mc-proto" id="' + id + '"><div class="mc-separe">' + ORNEMENT + '</div><p class="mc-sur" data-num-ex' + (P.pdf ? ' data-profond' : '') + '>' + (P.pdf ? 'Exercice en profondeur' : 'Exercice') + '</p><h3 class="mc-h">' + esc(P.titre) + '</h3>' +
      (P.intro ? '<p class="mc-consigne">' + md(P.intro) + '</p>' : '') + audioProtocole(P.id) +
      (P.materiel ? encadre('Ce qu’il te faut', '<p>' + md(P.materiel) + '</p>', 'mc-encadre-or') : '') +
      '<ol class="mc-etapes">' + (P.etapes || []).map(function (e) { return '<li>' + md(e) + '</li>'; }).join('') + '</ol>' +
      (P.ages ? P.ages.map(function (a, n) {
        return '<div class="mc-bloc"><p class="mc-rang-t"><span>' + (n + 1) + '</span>' + esc(a) + '</p>' + P.champs.map(function (c, j) { return zone(P.id + '-a' + (n + 1) + '-' + j, c.q, { lignes: 2, ph: ex(c.ph, n) }); }).join('') + '</div>';
      }).join('') : '') +
      (P.apres ? zone(P.apres.k, P.apres.q, { lignes: 3, ph: P.apres.ph }) : '') +
      (P.jours ? '<p class="mc-q">Coche chaque fois que tu l’as fait cette semaine</p>' + grilleJours(P.jours.k, P.jours.moments) : '') +
      questionsHtml(P.questions) + (P.pdf ? boutonPdf(id) : '') + '</section>';
  }
  function introT2(i) {
    var W = W2(i);
    return '<div class="mc-sem-intro"><p class="mc-sem-titre">Semaine ' + (i + 1) + ' · ' + esc(W.base || '') + '</p><p>' + md(W.intro || '') + '</p></div>' +
      '<div class="mc-rappel-cible" data-rappel-cible hidden></div><p class="mc-conseil-mode" data-conseil-mode="' + i + '" hidden></p>';
  }
  function cochesHtml(i) {
    var l = W2(i).coches || []; if (!l.length) return '';
    return '<section class="mc-coches"><div class="mc-separe">' + ORNEMENT + '</div><p class="mc-sur">Ma semaine en un coup d’œil</p><h3 class="mc-h">Ce que j’ai fait</h3><ul class="mc-coches-l">' +
      l.map(function (c, j) { var o = typeof c === 'string' ? { k: 'sem' + (i + 1) + '-c' + j, t: c } : c; return '<li><label><input type="checkbox" data-k="' + esc(o.k) + '"> ' + esc(o.t) + '</label></li>'; }).join('') + '</ul></section>';
  }
  function blocT2(i) {
    var k = 'sem' + (i + 1);
    return '<section class="mc-semaine" id="mc-semaine-' + (i + 1) + '"><div class="mc-sem-tete"><span class="mc-sem-n">Semaine ' + (i + 1) + '</span><h3>Mon bilan de la semaine</h3></div>' +
      zone(k + '-notes', 'Qu’as-tu remarqué, essayé ou ressenti cette semaine ?', { lignes: 3 }) +
      zone(k + '-victoire', 'Quelle est ta victoire de la semaine, même toute petite ?', { court: true, ph: 'Exemple : j’ai dit merci à un compliment, sans me justifier' }) +
      zone(k + '-appris', 'Qu’as-tu appris sur toi cette semaine ?', { court: true, ph: 'Exemple : ma force est plus légère quand je la choisis' }) +
      zone(k + '-signes', 'Qu’est-ce qui est venu vers toi cette semaine ? Un signe, une rencontre, une bonne nouvelle, même minuscule.', { lignes: 2 }) +
      curseur(k + '-roue', 'Où en est, cette semaine, le domaine de ta roue que tu fais grandir ce mois-ci ?', 'pas bougé', 'pleinement') +
      curseur(k + '-elan', 'Quel a été ton élan cette semaine ?', 'à plat', 'plein élan') + '</section>';
  }
  function lectureHtml(i) {
    return '<details class="mc-volet-plie mc-lecture" id="mc-lecture-' + (i + 1) + '"><summary><span class="mc-volet-sur">Pour clore ta semaine</span>Ta lecture de la semaine</summary><div class="mc-volet-corps">' +
      '<div data-lecture-sem="' + i + '"></div>' + (window.MAYA_SEMAINES && window.Maya ? '<details class="mc-lecture-maya"><summary>Ta semaine maya en détail</summary><div class="mc-maya" data-maya-sem="' + i + '"></div></details>' : '') + '</div></details>';
  }
  function majLectures() {
    if (!T2) return;
    var pr = lireProfil(), r = null;
    if (pr && window.Guide) { try { var p = String(C.mois).split('-'); r = window.Guide.calculer(pr, +p[0], +p[1], null); } catch (e) { r = null; } }
    racine.querySelectorAll('[data-lecture-sem]').forEach(function (z) {
      var i = +z.getAttribute('data-lecture-sem'), b = bornesSem(i);
      if (!pr || !r) { z.innerHTML = '<p class="mc-note">Pour lire ta semaine (tes nombres, ton ciel, tes jours maya), indique tes infos de naissance au début du carnet.</p><p><button type="button" class="btn btn-trait" data-page="0" data-ancre="mc-reperes">Indiquer mes infos de naissance</button></p>'; return; }
      var T = window.GUIDE_TEXTES || {}, M = (T.MOIS || {})[r.moisPerso] || {}, nm = MOIS_NOMS[+String(C.mois).split('-')[1] - 1];
      var lunes = (r.lunaisons || []).filter(function (l) { var d = new Date(l.jour + 'T12:00:00'); return d >= b[0] && d <= plusJ(b[1], 0.99); });
      var h = '<div class="mc-tm-cartes">' +
        '<div class="mc-tm-carte"><p class="mc-encadre-t">Tes nombres</p><p>Ton mois personnel ' + r.moisPerso + (M.theme ? ' : ' + esc(M.theme.charAt(0).toLowerCase() + M.theme.slice(1)) : '') + '.</p>' + (M.defi ? '<p>' + M.defi + '</p>' : '') + '</div>' +
        '<div class="mc-tm-carte"><p class="mc-encadre-t">Ton ciel</p>' + (lunes.length ? lunes.map(function (l) { return '<p><b>' + (l.type === 'nouvelle' ? 'Nouvelle lune' : 'Pleine lune') + ' du ' + (+l.jour.slice(8)) + ' ' + nm + '</b> : ' + (l.type === 'nouvelle' ? 'un bon moment pour poser une intention.' : 'un bon moment pour récolter et relâcher.') + '</p>'; }).join('') : '<p>Pas de nouvelle ni de pleine lune cette semaine : une semaine pour avancer sans à-coups.</p>') +
          (r.mercure ? '<p>Mercure est rétrograde ce mois-ci : relis avant d’envoyer, et prends le temps de revenir sur le passé.</p>' : '') + '</div></div>';
      z.innerHTML = h;
    });
  }
  function texteJeSuisHtml() {
    var X = W2(3).texte; if (!X) return '';
    return '<section class="mc-proto mc-jesuis" id="mc-p-jesuis"><div class="mc-separe">' + ORNEMENT + '</div><p class="mc-sur">Ta visualisation du mois</p><h3 class="mc-h">' + esc(X.titre) + '</h3><p class="mc-consigne">' + md(X.consigne) + '</p>' +
      '<div class="mc-trous">' + X.phrases.map(function (p) { return '<label class="mc-trou"><span>' + esc(p.avant) + '</span><input type="text" data-k="' + p.k + '" placeholder="' + esc(p.ph) + '"></label>'; }).join('') + '</div>' +
      '<div class="mc-jesuis-texte" data-jesuis hidden></div>' +
      '<label class="mc-fait"><input type="checkbox" data-k="' + X.relu.k + '"> ' + esc(X.relu.q) + '</label>' +
      zone(X.modif.k, X.modif.q, { lignes: 2, ph: X.modif.ph }) +
      '<p class="mc-q">' + esc(X.lecture.q) + '</p>' + grilleJours(X.lecture.k, ['Matin', 'Soir']) + (X.pdf ? boutonPdf('mc-p-jesuis') : '') + '</section>';
  }
  function majJeSuis() {
    var z = racine.querySelector('[data-jesuis]'), X = W2(3).texte; if (!z || !X) return;
    var l = X.phrases.filter(function (p) { return String(D.v[p.k] || '').trim(); }).map(function (p) { return esc(p.avant) + ' ' + esc(String(D.v[p.k]).trim().replace(/\.$/, '')) + '.'; });
    z.hidden = !l.length; z.innerHTML = l.length ? '<p class="mc-encadre-t">Ton texte, à lire à voix haute</p><p>' + l.join(' ') + '</p>' : '';
  }
  /* Le protocole audio du mois : un seul, posé sur l'exercice en profondeur de la semaine 1 (t2.protocole.audio, vide = pas de lecteur) */
  function audioProtocole(id) {
    var P = (C.t2 || {}).protocole; if (!T2 || !P || P.exercice !== id || !P.audio) return '';
    return lecteur(P.audio, 'Ton protocole audio du mois · ' + (P.titre || ''));
  }
  /* « Pour aller plus loin » : un volet replié par défaut ; le fichier du mois dit quels blocs y vont (t2.semaines[i].plusLoin) */
  function plusLoinHtml(blocs) {
    if (!blocs.length) return '';
    return '<details class="mc-volet-plie mc-plus-loin"><summary><span class="mc-volet-sur">Facultatif</span>Pour aller plus loin</summary><div class="mc-volet-corps">' + blocs.join('') + '</div></details>';
  }
  function contenuT2(i) {
    var W = W2(i), PL = W.plusLoin || [], vis = [], plus = [];
    function ajoute(id, html) { if (!html) return; (PL.indexOf(id) >= 0 ? plus : vis).push(html); }
    var ex0 = function (o) { return o && C.exercices[o.de] ? exercice(Object.assign({}, C.exercices[o.de], { titre: o.titre || C.exercices[o.de].titre, consigne: o.consigne || C.exercices[o.de].consigne }), o.de) : ''; };
    if (i === 0) {
      var T = C.theme, carte = (DECOR.cartes || {}).theme;
      ajoute('theme', '<h3 class="mc-h">' + esc(T.sousTitre) + '</h3>' + (carte ? '<figure class="mc-carte"><img src="' + esc(carte[0]) + '" alt="' + esc(carte[1]) + '" width="270" height="338" loading="lazy"></figure>' : '') + paras(T.texte2));
      ajoute('exemples', T.exemples ? encadre(T.exemplesTitre || 'Au quotidien', '<ul class="mc-liste">' + T.exemples.map(function (x) { return '<li>' + md(x) + '</li>'; }).join('') + '</ul>') : '');
      ajoute('spirale', T.exempleSpirale ? encadre(T.exempleSpiraleTitre || 'Et la spirale ?', '<p>' + md(T.exempleSpirale) + '</p>', 'mc-encadre-or') : '');
      ajoute('question', (T.question ? zone(T.question.k, T.question.q, { lignes: 2, ph: T.question.ph }) : '') + citation());
      ajoute('exmois', exerciceDuMoisHtml());
    }
    ajoute('ancrage', W.ancrage ? protoHtml({ id: 'ancrage', titre: W.ancrage.titre, intro: W.ancrage.intro, etapes: W.ancrage.etapes, questions: W.ancrage.questions }) : '');
    ajoute('exercice', ex0(W.exercice));
    if (i === 1) ajoute('appuis', exercice(C.exercices[1], 1));
    ajoute('protocole', protoHtml(W.protocole));
    ajoute('amplifier', W.amplifier ? '<section class="mc-proto"><p class="mc-sur" data-num-ex>Exercice</p><h3 class="mc-h">' + esc(W.amplifier.titre) + '</h3><p class="mc-consigne">' + md(W.amplifier.consigne) + '</p>' + questionsHtml(W.amplifier.questions) + '</section>' : '');
    ajoute('loupe', W.loupe ? ex0(W.loupe) + curseur(W.loupe.plaisir.k, W.loupe.plaisir.q, 'aucun', 'immense') + zone(W.loupe.corps.k, W.loupe.corps.q, { lignes: 2, ph: W.loupe.corps.ph }) : '');
    ajoute('comprendre', W.comprendre ? '<section class="mc-comprendre-sem"><p class="mc-sur">Pour comprendre</p><h3 class="mc-h">' + esc(W.comprendre.titre) + '</h3>' + paras(W.comprendre.texte) + questionsHtml(W.comprendre.questions) + '</section>' : '');
    (W.protocoles || []).forEach(function (P) { ajoute(P.id, protoHtml(P)); });
    ajoute('complement', W.complement ? '<section class="mc-proto" id="mc-p-complement"><div class="mc-separe">' + ORNEMENT + '</div><p class="mc-sur">Facultatif</p><h3 class="mc-h">' + esc(W.complement.titre) + '</h3><p class="mc-consigne">' + md(W.complement.consigne) + '</p>' +
        '<div class="mc-amorces"><p class="mc-q">Pour t’aider à commencer, touche une amorce : elle s’ajoute à ta lettre.</p>' + W.complement.amorces.map(function (a) { return '<button type="button" data-amorce="' + esc(a) + '" data-amorce-pour="' + W.complement.k + '">' + esc(a) + '</button>'; }).join('') + '</div>' +
        zone(W.complement.k, 'Ma lettre', { lignes: 9, ph: W.complement.ph }) + (W.complement.pdf ? boutonPdf('mc-p-complement') : '') + '</section>' : '');
    ajoute('impossible', W.impossible ? '<section class="mc-proto"><p class="mc-sur" data-num-ex>Exercice</p><h3 class="mc-h">' + esc(W.impossible.titre) + '</h3>' + questionsHtml(W.impossible.questions) + '</section>' : '');
    if (W.texte) ajoute('texte', texteJeSuisHtml());
    if (i === 3) { ajoute('rituel', rituelHtml()); vis.push('<div class="mc-victoires" data-victoires></div>'); }
    return vis.join('') + plusLoinHtml(plus);
  }
  /* Les exercices de chaque semaine sont numérotés dans l'ordre où ils apparaissent */
  function numeroterExercices() {
    if (!T2 && !COEUR) return;
    racine.querySelectorAll('.mc-page[id^="page-semaine-"]').forEach(function (pg) {
      var n = 0;
      pg.querySelectorAll('[data-num-ex]').forEach(function (el) { n++; el.textContent = 'Exercice ' + n + (/protocole/.test(el.parentNode.className) ? ' · le protocole du mois' : el.hasAttribute('data-profond') ? ' · en profondeur' : ''); });
    });
  }
  function semaineT2(i) {
    var W = W2(i);
    return { id: 'semaine-' + (i + 1), nom: 'Semaine ' + (i + 1) + ' · ' + (W.base || ''), sem: i, g: function () {
      return enteteSemaine(i) + (i === 0 ? MORCEAUX.theme.g() : gauche('semaine-' + (i + 1), 'Semaine ' + (i + 1) + ' · ' + (W.base || ''), W.titre || '', '<p class="mc-intro">' + md(W.intro || '') + '</p>'));
    }, d: function () { return introT2(i) + contenuT2(i) + filJours(i) + cochesHtml(i) + blocT2(i) + lectureHtml(i) + '<p class="mc-pont mc-pont-fin" data-pont="' + i + '" hidden></p>'; } };
  }
  function ouvertureT2() {
    return { id: 'ouverture', nom: 'Mon début de mois', g: function () {
      return gauche('ouverture', 'Pour commencer le mois · 10 minutes', 'Mon début de mois',
        '<p class="mc-intro">Ton carnet part de ton point de départ : ta cible, ta roue, ce que tu vis. Ces dix minutes posent la direction de ton mois.</p><p>Il n’y a pas de bonne réponse, seulement la tienne, aujourd’hui.</p>');
    }, d: function () {
      return '<section class="mc-etape"><h3><span>1</span> Ta cible du cycle 1</h3><div data-pd-cible></div></section>' +
        '<section class="mc-etape"><h3><span>2</span> Ta météo de la semaine</h3><p class="mc-consigne">Place chaque curseur sans réfléchir longtemps : la première réponse est souvent la plus juste. 0, c’est au plus bas ; 10, au plus haut.</p>' + blocEchelles('md') + pointBlessures() + '<div class="mc-meteo-dit" data-meteo-dit hidden aria-live="polite"></div><div class="mc-reperes" id="mc-reperes" data-reperes-ici></div>' + bravo(1) + '</section>' +
        '<section class="mc-etape"><h3><span>3</span> Ta roue de la vie</h3><div data-pd-roue></div><div data-roue-secours hidden>' + blocRoue('rd') + '</div>' +
          choix('obj-domaine', 'Quel domaine de ta roue veux-tu faire grandir ce mois-ci ?', ROUE.map(function (d) { return d[2]; })) +
          '<p class="mc-pourquoi">Chaque semaine, dans ton bilan, tu noteras où il en est : tu le verras monter, un cran après l’autre. À la fin du mois, tu referas toute ta roue.</p>' + bravo(2) + '</section>' +
        '<section class="mc-etape"><h3><span>4</span> Ton objectif du mois</h3><p class="mc-consigne">Ces propositions viennent de ton point de départ. Choisis celle qui te parle le plus, ou écris la tienne : formule ce que tu veux, en positif.</p><div data-obj-choix></div>' +
          zone('obj-quoi', 'Ton objectif du mois, avec tes mots. Commence par « Je veux… »', { court: true, ph: 'Exemple : je veux m’appuyer sur mon courage pour demander ce dont j’ai besoin', aide: 'Formule ce que tu veux à la place de ce que tu ne veux plus.' }) +
          zone('obj-pas', 'Quel est ton tout premier pas, à faire dans les 48 heures ?', { court: true, ph: 'Exemple : bloquer jeudi soir dans mon agenda, rien que pour moi' }) +
          curseur('obj-croyance', 'À quel point crois-tu pouvoir y arriver ?', 'pas du tout', 'complètement') + bravo(3) + '</section>' +
        '<section class="mc-etape"><h3><span>5</span> Ta phrase du mois</h3>' + zone('phrase', 'Quelle phrase veux-tu te redire tout le mois ?', { court: true, ph: 'Exemple : ' + C.citation }) + bravo(5) + '<div data-phrase-jour></div></section>' +
        '<section class="mc-etape"><h3><span>6</span> Ta lettre à la fin du mois</h3><p class="mc-consigne">Imagine-toi le dernier jour du mois. Écris à la personne que tu es aujourd’hui, au présent, en commençant tes phrases par « Je suis… ». Comment te sens-tu ? Qu’est-ce qui a changé ? Qu’est-ce que tu as osé ?</p>' +
          '<div class="mc-amorces"><p class="mc-q">Pour t’aider à commencer, touche une amorce :</p>' + ['Je suis…', 'Aujourd’hui, je me sens…', 'J’ai osé…', 'Je suis fière de…'].map(function (a) { return '<button type="button" data-amorce="' + esc(a) + '" data-amorce-pour="lettre-un-mois">' + esc(a) + '</button>'; }).join('') + '</div>' +
          zone('lettre-un-mois', 'Ma lettre, écrite depuis la fin du mois', { lignes: 7, ph: 'Exemple : Je suis le ' + (function () { var f = DEBUT_ET ? new Date(DEBUT_ET.getFullYear(), DEBUT_ET.getMonth() + 1, DEBUT_ET.getDate() - 1) : new Date(+String(C.mois).split('-')[0], +String(C.mois).split('-')[1], 0); return f.getDate() + ' ' + MOIS_NOMS[f.getMonth()]; })() + '. Je suis plus calme…' }) + prive() + '</section>' +
        intentionHtml(7) +
        '<div class="mc-actions"><button type="button" class="btn btn-plein" data-meteo="debut">Enregistrer mon début de mois</button><p class="mc-retour" data-retour="debut" aria-live="polite"></p></div>';
    } };
  }
  function cibleSuiteHtml() {
    return '<section class="mc-etape"><h3><span>5</span> Ta cible pour le mois prochain</h3><div data-pd-cible-fin></div>' +
      choix('cible-suite', 'Que fais-tu de ta cible ?', ['Je la garde, j’ai encore besoin d’elle', 'Je passe à la suivante de ma liste', 'J’en choisis une autre']) +
      zone('cible-nouvelle', 'Si tu en choisis une autre, écris-la ici', { court: true, ph: 'Exemple : me sentir à ma place dans ma famille' }) + '</section>';
  }
  /* Les zones qui dépendent du point de départ (chargé après l'ouverture du carnet) */
  function majPD() {
    if (!T2) return;
    var r = pdRes(), v = pdV(), c1 = String(v['c1-cible-1'] || r.cible1 || '').trim(), rv = pdRoue(), aRoue = Object.keys(rv).length;
    racine.querySelectorAll('[data-pd-cible]').forEach(function (z) {
      z.innerHTML = c1 ? '<p class="mc-cite">« ' + esc(c1) + ' »</p>' + (r.mode ? '<p class="mc-note">Ton mode survie : ' + esc(r.mode) + '. ' + (r.domaine ? 'Ton domaine le plus fragile : ' + esc(r.domaine.charAt(0).toLowerCase() + r.domaine.slice(1)) + '.' : '') + '</p>' : '') + '<p class="mc-note">Tout ton carnet du mois s’oriente vers elle. <a href="point-de-depart.html#etape-4">Revoir mes cibles</a></p>'
        : '<p class="mc-consigne">Ton carnet s’oriente sur ton point de départ : ta roue, ton mode survie, tes cibles. Fais-le d’abord, en quinze minutes, puis reviens ici.</p><p><a class="btn btn-plein" href="point-de-depart.html">C’est parti</a></p>';
    });
    racine.querySelectorAll('[data-pd-cible-fin]').forEach(function (z) { z.innerHTML = c1 ? '<p class="mc-q">Ta cible ce mois-ci</p><p class="mc-cite">« ' + esc(c1) + ' »</p>' : ''; });
    racine.querySelectorAll('[data-rappel-cible]').forEach(function (z) { z.hidden = !c1; z.innerHTML = c1 ? '<span>Ta cible du cycle 1</span>« ' + esc(c1) + ' »' : ''; });
    var m = (r.modes || [])[0];
    racine.querySelectorAll('[data-conseil-mode]').forEach(function (z) { var t = m && CONSEILS_MODES[m] ? CONSEILS_MODES[m][+z.getAttribute('data-conseil-mode')] : ''; z.hidden = !t; z.innerHTML = t ? '<b>Pour toi, ' + esc(r.mode.split(' et ')[0].replace(/^Celle/, 'celle')) + ' :</b> ' + esc(t) : ''; });
    racine.querySelectorAll('[data-pd-roue]').forEach(function (z) {
      if (!aRoue) { z.innerHTML = ''; return; }
      var tri = Object.keys(rv).sort(function (a, b) { return rv[a] - rv[b]; }), nom = function (k) { return ROUE.filter(function (d) { return d[0] === k; })[0][2].toLowerCase(); };
      z.innerHTML = '<p class="mc-consigne">Voici ta roue de ton point de départ. Tu n’as pas à la refaire : choisis seulement le domaine que tu veux faire grandir ce mois-ci.</p><figure class="mc-roue-fig">' + radar([{ v: rv, c: COUL_DEBUT }], 'Ta roue de la vie de ton point de départ') + '</figure>' +
        '<p class="mc-pourquoi">Ce qui demande le plus d’attention : <b>' + tri.slice(0, 2).map(nom).join(' et ') + '</b>.' + (r.domaine ? ' Ton domaine de sécurité le plus fragile : <b>' + esc(r.domaine.charAt(0).toLowerCase() + r.domaine.slice(1)) + '</b>. C’est souvent par là que ton cycle 1 commence.' : '') + '</p>';
    });
    racine.querySelectorAll('[data-roue-secours]').forEach(function (z) { z.hidden = !!aRoue; });
    var opts = [c1, OBJ_DOMAINES[r.domaineCle], OBJ_MODES[m], (C.t2 || {}).objectifTheme].filter(function (x, n, l) { return x && l.indexOf(x) === n; });
    racine.querySelectorAll('[data-obj-choix]').forEach(function (z) {
      z.innerHTML = opts.length ? choix('obj-choix', 'Les propositions pour toi', opts.concat(['Je l’écris moi-même'])) : '';
      z.querySelectorAll('[data-k]').forEach(function (el) { el.checked = D.v['obj-choix'] === el.value; });
    });
  }
  /* Ta cible pour le mois prochain : mise à jour de ton point de départ */
  function majCibleSuite() {
    if (!PD || !PD.v) return;
    var s = D.v['cible-suite'] || '', v = PD.v, nouvelle = '';
    if (/suivante/.test(s)) nouvelle = String(v['c1-cible-2'] || '').trim();
    if (/autre/.test(s)) nouvelle = String(D.v['cible-nouvelle'] || '').trim();
    if (!nouvelle || nouvelle === v['c1-cible-1']) return;
    var t = Date.now(); PD.t = PD.t || {};
    if (/suivante/.test(s)) { v['c1-cible-2'] = v['c1-cible-3'] || ''; v['c1-cible-3'] = ''; PD.t['c1-cible-2'] = t; PD.t['c1-cible-3'] = t; }
    v['c1-cible-1'] = nouvelle; PD.t['c1-cible-1'] = t; if (v.resume) v.resume.cible1 = nouvelle;
    try { localStorage.setItem('genesolia-carnet-point-de-depart', JSON.stringify(PD)); } catch (e) {}
    var CF = window.GenesoliaCoffre; if (user && sb && CF && CF.accord(user)) CF.ecrire(sb, user, 'point-de-depart', PD);
  }
  function chargerPD() {
    var local = null; try { local = JSON.parse(localStorage.getItem('genesolia-carnet-point-de-depart') || 'null'); } catch (e) {}
    var CF = window.GenesoliaCoffre;
    return (user && sb && CF && CF.accord(user) ? CF.lire(sb, user, 'point-de-depart').then(function (d) { if (!d && local && local.v && local.v.fait) CF.ecrire(sb, user, 'point-de-depart', local); return d || local; }, function () { return local; }) : Promise.resolve(local)).then(function (d) { PD = d; majPD(); majCoeur(); majRadars(); majDepart(); });
  }
  /* Un exercice en profondeur en PDF : on imprime cet exercice seul, avec la mention de droits */
  function imprimerExo(id) {
    var s = document.getElementById(id); if (!s) return;
    var c = copie(s); c.querySelectorAll('.mc-pdf-zone, .mc-amorces, .mc-separe').forEach(function (x) { x.remove(); });
    c.querySelectorAll('textarea, input[type=text]').forEach(function (el) { var d = document.createElement('div'); d.className = 'mc-imp'; d.textContent = el.value || ' '; el.parentNode.replaceChild(d, el); });
    var box = document.createElement('div'); box.className = 'mc-exo-print';
    box.innerHTML = '<p class="mc-exo-print-t">Genesolia · ' + (SUIVI ? 'Le suivi du cycle 2' : 'Le carnet du cycle 1') + ' · ' + esc(C.nomMois) + '</p>';
    box.appendChild(c);
    box.insertAdjacentHTML('beforeend', '<p class="mc-exo-print-droits">© Genesolia. Tous droits réservés. Reproduction et diffusion interdites sans autorisation écrite. Cet exercice propose une démarche symbolique de développement personnel : il ne remplace pas un accompagnement médical ou psychologique.</p>');
    document.body.appendChild(box);
    document.documentElement.classList.add('mc-imprime-exo');
    function fin() { document.documentElement.classList.remove('mc-imprime-exo'); box.remove(); window.removeEventListener('afterprint', fin); }
    window.addEventListener('afterprint', fin);
    if (window.umami) try { window.umami.track('carnet-pdf-exercice', { mois: C.mois, exo: id }); } catch (x) {}
    setTimeout(function () { window.print(); setTimeout(function () { if (document.documentElement.classList.contains('mc-imprime-exo') && !window.matchMedia('print').matches) fin(); }, 1500); }, 200);
  }
  if (T2) {
    var cloAncienne = PAGES.filter(function (p) { return p.id === 'cloture'; })[0];
    PAGES = [ouvertureT2(), semaineT2(0), semaineT2(1), semaineT2(2), semaineT2(3), { id: 'cloture', nom: cloAncienne.nom, g: cloAncienne.g, d: function () { return cloAncienne.d().replace('<div class="mc-actions">', cibleSuiteHtml() + '<div class="mc-actions">'); } }];
  }
  if (CARNET && ET) PAGES.splice(PAGES.map(function (p) { return p.id; }).indexOf('ouverture') + 1, 0, saisonCarnet());
  if (SUIVI) PAGES = suiviPages();
  /* ───── Le suivi du cycle 2, autour de la cible du cœur (C.coeur) ─────
     La saison et l'autel, le thème, S1 Voir ce qui vient, S2 Ta boucle sous tes yeux (+ D'où vient ta boucle, Mon personnage),
     S3 Libérer (+ Laisser partir mon personnage, le protocole du mois), S4 Mon geste différent (+ où en suis-je), la séance, le bilan.
     Tous les textes et toutes les clés d'avant sont gardés. Le mot du test et la cible sont préremplis depuis le point de départ. */
  var APERCU = /[?&]apercu\b/.test(location.search);
  var NOMS_BL_C = { rejet: 'le rejet', abandon: 'l’abandon', humiliation: 'l’humiliation', trahison: 'la trahison', injustice: 'l’injustice' };
  function rappelCoeur() { return '<div class="mc-rappel-cible" data-rappel-coeur hidden></div>'; }
  function aFournir(t) { return APERCU ? '<p class="mc-a-fournir">' + esc(t) + '</p>' : ''; }
  function corpsSemaine(w, k, sansFil) {
    var X = plusSem(k), R = w.rituel;
    var duMois = COEUR ? (C.coeur.exercicesDuMois || []).map(function (e) { return e.k; }) : [];
    return (w.texte ? paras([].concat(w.texte)) : '') + textePlus(k) + (w.exercices || []).concat(X.exercices || []).filter(function (x) { return duMois.indexOf(x.k) < 0; }).map(function (x) {
        if (x.k === 'ex1' && C.coeur.ex1Consigne) x = Object.assign({}, x, { consigne: C.coeur.ex1Consigne });
        return exercice(x, 0);
      }).join('') +
      (R ? '<div class="mc-separe">' + ORNEMENT + '</div><p class="mc-sur">Le rituel de la semaine</p><h3 class="mc-h">' + esc(R.titre) + '</h3><p>' + md(R.intro) + '</p>' +
        (R.materiel ? encadre('Ce qu’il te faut', '<p>' + md(R.materiel) + '</p>', 'mc-encadre-or') : '') +
        '<ol class="mc-etapes">' + R.etapes.map(function (e) { return '<li>' + md(e) + '</li>'; }).join('') + '</ol>' +
        (R.note ? zone(R.note.k, R.note.q, { lignes: 3, ph: R.note.ph }) : '') : '') +
      (w.conseil ? encadre('Pour t’aider cette semaine', '<p>' + md(w.conseil) + '</p>') : '') +
      '<label class="mc-fait mc-fait-sem"><input type="checkbox" data-k="' + w.cle + '-fait"> J’ai vécu cette partie</label>';
  }
  function traverseHtml() {
    var X = C.coeur.traverse; if (!X) return '';
    return '<section class="mc-proto" id="mc-p-traverse"><div class="mc-separe">' + ORNEMENT + '</div><p class="mc-sur" data-num-ex data-profond>Exercice en profondeur</p><h3 class="mc-h">' + esc(X.titre) + '</h3><p class="mc-consigne">' + md(X.intro) + '</p>' +
      zone(X.ressens.k, X.ressens.q, { lignes: 3, ph: X.ressens.ph }) +
      '<p class="mc-q">b. Remonter le fil</p>' + questionsHtml(X.fil) +
      choix(X.origine.k, X.origine.q, X.origine.options) +
      encadre('d. ' + X.intuition.titre, '<p>' + md(X.intuition.texte) + '</p>' + questionsHtml(X.intuition.questions), 'mc-encadre-rose') +
      zone(X.evenement.k, X.evenement.q, { lignes: 3, ph: X.evenement.ph }) +
      '<p class="mc-q">' + esc(X.demande.titre) + '</p><p>' + md(X.demande.texte) + '</p>' +
      '<div class="mc-journal">' + Array.apply(null, { length: X.demande.n }).map(function (_, j) { return '<label class="mc-essai"><span>Jour ' + (j + 1) + '</span><input type="text" data-k="' + X.demande.k + '-' + j + '"' + (j === 0 ? ' placeholder="' + esc(X.demande.ph) + '"' : '') + '></label>'; }).join('') + '</div>' +
      boutonPdf('mc-p-traverse') + '</section>';
  }
  function personnageHtml() {
    var X = C.coeur.personnage, A = C.coeur.personnageAngle; if (!X) return '';
    return '<section class="mc-proto" id="mc-p-personnage"><div class="mc-separe">' + ORNEMENT + '</div><p class="mc-sur" data-num-ex data-profond>Exercice en profondeur</p><h3 class="mc-h">' + esc(X.titre) + '</h3><p class="mc-consigne">' + md(X.intro) + '</p>' +
      (A ? encadre(A.titre, paras([].concat(A.texte)), 'mc-encadre-rose') : '') +
      encadre('Ce qu’il te faut', '<p>' + md(A && A.materiel || 'Une feuille, des crayons de couleur, un moment au calme.') + '</p>', 'mc-encadre-or') +
      '<ol class="mc-etapes">' + X.etapes.map(function (e) { return '<li>' + md(e) + '</li>'; }).join('') + '</ol>' +
      '<p class="mc-pourquoi">' + md(X.guides) + '</p>' + questionsHtml(X.questions) + choix(X.piste.k, X.piste.q, X.piste.options, true) + boutonPdf('mc-p-personnage') + '</section>';
  }
  function laisserHtml() {
    var X = C.coeur.laisser, P = C.coeur.protocole; if (!X) return '';
    return '<section class="mc-proto" id="mc-p-laisser"><div class="mc-separe">' + ORNEMENT + '</div><p class="mc-sur" data-num-ex data-profond>Exercice en profondeur</p><h3 class="mc-h">' + esc(X.titre) + '</h3><p class="mc-consigne">' + md(X.intro) + '</p>' +
      '<ol class="mc-etapes">' + X.etapes.map(function (e) { return '<li>' + md(e) + '</li>'; }).join('') + '</ol>' +
      questionsHtml(X.questions) + boutonPdf('mc-p-laisser') + '</section>';
  }
  /* La partie propre au mois, comme dans le carnet : le protocole et son audio (1 ou 2), puis 1 ou 2 exercices à faire seul·e */
  function protocoleMoisHtml(source, opts) {
    opts = opts || {};
    var L = [].concat((arguments.length ? source : C.coeur.protocole) || []).slice(0, 2);
    if (!L.length) return '<section class="mc-proto mc-protocole-mois" id="mc-p-protocole"><div class="mc-separe">' + ORNEMENT + '</div><p class="mc-sur" data-num-ex data-profond>Le protocole de libération du mois</p><h3 class="mc-h">Le protocole de libération du mois</h3>' +
      '<p>Lis ta méditation du mois : elle t’accompagne pour laisser partir ton personnage. <a href="#meditation">La lire</a>.</p>' + aFournir('[PROTOCOLE À FOURNIR PAR LAURA]') + '</section>';
    return L.map(function (P, n) {
      var id = 'mc-p-protocole' + (n ? '-' + (n + 1) : '');
      return '<section class="mc-proto mc-protocole-mois" id="' + id + '"><div class="mc-separe">' + ORNEMENT + '</div><p class="mc-sur" data-num-ex data-profond>' + esc(opts.sur || 'Le protocole de libération du mois') + '</p><h3 class="mc-h">' + esc(P.titre) + '</h3>' +
        [].concat(P.intro || []).map(function (x) { return '<p class="mc-consigne">' + md(x) + '</p>'; }).join('') +
        (P.materiel ? encadre('Ce qu’il te faut', '<p>' + md(P.materiel) + '</p>', 'mc-encadre-or') : '') +
        etapesHtml(P.etapes) +
        questionsHtml(P.questions) + boutonPdf(id) + '</section>';
    }).join('');
  }
  function exercicesMoisHtml(sem) {
    var L = (C.coeur.exercicesDuMois || []).filter(function (x) { return (x.semaine || 2) === sem; }).slice(0, 2);
    return L.map(function (x) {
      return '<div class="mc-separe">' + ORNEMENT + '</div><p class="mc-sur mc-sur-mois">Ton exercice du mois, à faire seul·e</p>' + exercice(x, 0).replace('</section>', boutonPdf('mc-ex-' + x.k) + '</section>');
    }).join('');
  }
  /* « Si tu as peu de temps cette semaine » : trois gestes essentiels, repliés en haut de chaque semaine */
  function peuDeTemps(i) {
    var L = (C.coeur.peuDeTemps || [])[i]; if (!L || !L.length) return '';
    return '<details class="mc-volet-plie mc-peu-temps"><summary><span class="mc-volet-sur">L’essentiel</span>Si tu as peu de temps cette semaine</summary><div class="mc-volet-corps"><ol class="mc-liste">' +
      L.map(function (g) { return '<li>' + md(g) + '</li>'; }).join('') + '</ol></div></details>';
  }
  function majCoeur() {
    if (!COEUR) return;
    var v = pdV(), r = pdRes(), s = D.v['coeur-suite'] || '', auto;
    var libre = String(D.v['coeur-nouvelle'] || '').trim();
    if (libre) auto = libre;
    else if (/sujet du mois/.test(s) && C.coeur.sujetCoeur) auto = C.coeur.sujetCoeur;
    else auto = String(v['c2-cible-1'] || r.cible2 || '').trim();
    var cur = String(D.v['coeur-cible'] || '').trim();
    if (auto && (!cur || cur === D.v._cibleAuto)) { D.v['coeur-cible'] = auto; D.v._cibleAuto = auto; D.t = D.t || {}; D.t['coeur-cible'] = D.t['coeur-cible'] || 0; cur = auto; var el = racine.querySelector('.mc-livre [data-k="coeur-cible"]'); if (el) el.value = auto; }
    var bl = (r.blessures || [])[0];
    if (bl && !String(D.v['coeur-mot'] || '').trim()) { D.v['coeur-mot'] = NOMS_BL_C[bl] || bl; var em = racine.querySelector('.mc-livre [data-k="coeur-mot"]'); if (em) em.value = D.v['coeur-mot']; }
    racine.querySelectorAll('[data-rappel-coeur]').forEach(function (z) { z.hidden = !cur; z.innerHTML = cur ? '<span>Mon besoin de libération</span>« ' + esc(cur) + ' »' : ''; });
    var h1 = racine.querySelector('.mc-tete h1'), st = racine.querySelector('.mc-tete h1 + p');
    if (ET) { /* par étapes, le titre et le sous-titre restent ceux de l'étape : le besoin de libération est dans l'encadré du point de départ, en haut */ }
    else {
      if (h1) h1.textContent = cur ? '« ' + cur + ' »' : C.titre;
      if (st) st.textContent = cur ? C.coeur.angle : C.sousTitre;
    }
    racine.querySelectorAll('[data-coeur-pd]').forEach(function (z) {
      z.innerHTML = (v['c2-cible-1'] || r.cible2) ? '<p class="mc-note">Tes besoins de libération du cycle 2, au point de départ : ' + ['c2-cible-1', 'c2-cible-2', 'c2-cible-3'].map(function (k) { return v[k]; }).filter(Boolean).map(function (x, n) { return (n + 1) + '. « ' + esc(x) + ' »'; }).join(' ') + '</p>'
        : '<p class="mc-note">Commence par ton <a href="point-de-depart.html">point de départ</a> : c’est là que tu poses ton besoin de libération, et tout ton suivi s’oriente dessus.</p>';
    });
  }
  function coeurPages() {
    var P = [], S = window.GENESOLIA_SAISONS, sa = S && S[MOIS_SAISON], W = {}, K = C.coeur;
    C.semaines.forEach(function (w, i) { W[w.cle] = { w: w, i: i }; });
    function semaine(n, nom, titre, intro, corps) {
      P.push({ id: 'semaine-' + n, nom: 'Semaine ' + n + ' · ' + nom, sem: n - 1, g: function () {
        return gauche('semaine-' + n, 'Semaine ' + n + ' · ' + nom, titre, '<p class="mc-intro">' + md(intro) + '</p>', '<p class="mc-quand">À vivre à partir du ' + jourMois(dateSemaine(n - 1)) + '. Tu peux la lire avant, et y revenir quand tu veux.</p>');
      }, d: function () { return (n > 3 && !membre) ? offreCercle() : rappelCoeur() + peuDeTemps(n - 1) + corps() + '<p class="mc-pont mc-pont-fin" data-pont="' + (n - 1) + '" hidden></p>'; } });
    }
    P.push({ id: 'saison', nom: ET ? 'Ta saison' : 'La saison', g: function () {
      return gauche('saison', (sa ? sa.mois : NOM_MOIS) + ' · ' + (ET ? 'ta saison' : 'la saison'), sa ? sa.titre.charAt(0).toUpperCase() + sa.titre.slice(1) : C.titre,
        sa ? '<p class="mc-intro">' + esc(sa.texte) + '</p>' : '', sa ? '<p class="mc-permission"><b>Ce que ça veut dire pour toi :</b> ' + esc(sa.permission) + '</p>' : '');
    }, d: function () {
      return (C.saisonLien && MOIS_SAISON === +String(C.mois).split('-')[1] ? '<p>' + md(C.saisonLien) + '</p>' : '') +
        (K.sansChoix ? '' : '<section class="mc-etape"><h3><span>1</span> Ton besoin de libération ce mois-ci</h3><div data-coeur-pd></div>' +
          choix('coeur-suite', 'Pour ce mois, tu choisis…', ['Je continue sur mon besoin de libération : il reste à libérer, je vais plus en profondeur', 'Je prends le sujet du mois']).replace('<span>Je prends le sujet du mois</span>', '<span>Je prends le sujet du mois' + (K.sujetCoeur ? ' : <b>« ' + esc(K.sujetCoeur) + ' »</b>' : '') + '</span>') +
          zone('coeur-nouvelle', 'Si tu en écris un autre : ton nouveau besoin de libération, en une phrase', { court: true, ph: 'Exemple : je veux oser dire ce dont j’ai besoin dans mon couple' }) + '</section>') +
        '<section class="mc-etape mc-autel-encart"><h3><span>' + (K.sansChoix ? 1 : 2) + '</span> Ton autel de saison</h3><p>Ce mois-ci, va te promener et ramasse ce que la nature t’offre : feuilles, branches, pierres, fruits secs. Avec quelques bougies et des couleurs qui s’accordent, crée-toi un petit autel. C’est un espace qui protège ton énergie intérieure, qui célèbre ta beauté et qui honore l’être de la création que tu es.</p>' +
          '<p><a class="btn btn-plein" href="autel-de-saison.html?mois=' + esc(MOIS_SAISON_ISO) + '">Créer mon autel du mois</a></p></section>' + arbreEncart() +
        (sa ? '<blockquote class="mc-citation"' + (DECOR.citation ? ' style="--fond:url(\'' + esc(fondUrl(DECOR.citation)) + '\')"' : '') + '><span>' + esc(sa.citation) + '</span></blockquote>' : '');
    } });
    P.push({ id: 'theme', nom: 'Le thème', g: function () { return gauche('theme', 'Ce mois-ci, ta lignée t’éclaire', C.theme.titre, paras(C.theme.texte)); }, d: MORCEAUX.theme.d });
    semaine(1, 'Voir ce qui vient', 'Voir ce qui vient', 'Cette semaine, tu poses ta question du cœur : ton mot, ton besoin de libération, ce que tu ressens, et d’où ça vient. Tu ne cherches pas encore à changer quoi que ce soit.', function () {
      return '<section class="mc-etape"><h3><span>1</span> Mon mot du test</h3>' + zone('coeur-mot', 'Le mot de ton résultat au test du cycle 2 (au point de départ)', { court: true, ph: 'Exemple : l’abandon' }) + '</section>' +
        '<section class="mc-etape"><h3><span>2</span> Mon besoin de libération</h3><p class="mc-consigne">Écris en une phrase ce que tu as besoin de libérer dans tes relations et ta façon d’aimer. Elle s’affichera en haut de chaque semaine.</p>' + zone('coeur-cible', 'Ton besoin de libération, en une phrase', { court: true, ph: 'Exemple : la peur d’être quittée quand l’autre prend du temps pour lui' }) + '</section>' +
        '<section class="mc-etape"><h3><span>3</span> Là, maintenant</h3><p class="mc-consigne">Une photo de ton état intérieur, sur ton besoin de libération. Tu la compareras à la fin du mois.</p>' +
          curseur('int-debut', K.intensiteQ || C.intensiteQ, 'presque pas', 'énormément') +
          zone('mot-debut', K.motQ || 'En un mot, comment te sens-tu face à ce thème ?', { court: true, ph: 'Exemple : inquiète, fatiguée, en colère, prête…' }) +
          zone('liberer-souhait', K.souhaitQ || 'Qu’aimerais-tu libérer ce mois-ci ?', { lignes: 2, ph: K.souhaitPh || C.souhaitPh }) + '</section>' +
        traverseHtml() + filJours(0) + '<label class="mc-fait mc-fait-sem"><input type="checkbox" data-k="vient-fait"> J’ai vécu cette semaine</label>';
    });
    var Vo = W.voir.w, So = W.source.w, Li = W.liberer.w, Re = W.remplacer.w;
    semaine(2, 'Ta boucle sous tes yeux', Vo.titre, Vo.intro, function () {
      return corpsSemaine(Vo, W.voir.i) + '<div class="mc-separe">' + ORNEMENT + '</div><p class="mc-sur">' + esc(So.etape || 'Remonter à la source') + '</p><h3 class="mc-h">' + esc(So.titre) + '</h3><p>' + md(So.intro) + '</p>' + corpsSemaine(So, W.source.i) + personnageHtml() + exercicesMoisHtml(2) + filJours(1);
    });
    semaine(3, 'Libérer', Li.titre, Li.intro, function () {
      return audioEncart() + corpsSemaine(Li, W.liberer.i).replace('<label class="mc-fait mc-fait-sem">', laisserHtml() + protocoleMoisHtml() + exercicesMoisHtml(3) + '<p class="mc-pourquoi mc-seance-lib"><b>Ta méditation du mois</b> accompagne cette semaine : <a href="#meditation">la lire</a>.</p><label class="mc-fait mc-fait-sem">') + filJours(2);
    });
    semaine(4, 'Mon geste différent', Re.titre, Re.intro, function () {
      var X = K.retour;
      return corpsSemaine(Re, W.remplacer.i) + (X ? '<section class="mc-proto"><div class="mc-separe">' + ORNEMENT + '</div><p class="mc-sur">Retour sur mon besoin de libération</p><h3 class="mc-h">' + esc(X.titre) + '</h3><div class="mc-rappel" data-rappel-souhait hidden></div>' + curseur(X.curseur.k, X.curseur.q, 'presque pas', 'énormément') + questionsHtml(X.questions) + '</section>' : '') + filJours(3);
    });
    var anc = suiviPages();
    var med = anc.filter(function (p) { return p.id === 'meditation'; })[0], bil = anc.filter(function (p) { return p.id === 'bilan'; })[0];
    P.push({ id: 'meditation', nom: med.nom, g: med.g, d: med.d });
    P.push(bil);
    return P;
  }
  if (COEUR) PAGES = coeurPages();
  /* ───── Le carnet d'un module de la formation (cycle 2) : le même livre, avec ses propres pages ─────
     Avant de commencer, comprendre, les exercices du cahier, l'outil et le fil des 7 jours, avancer, le bilan.
     Le contenu vient de assets/modules/module-N.js ; la vidéo et la séance restent dans l'espace de formation (Systeme.io). */
  var FORM = window.GENESOLIA_FORMATION || {};
  function espaceFormation() { return FORM.espace || 'formation.html'; }
  var VERROU = null;
  function offreFormation() {
    if (VERROU) return '<aside class="mc-encadre mc-encadre-or mc-verrou"><p class="mc-encadre-t">Ce module s’ouvre à ton étape ' + VERROU.etape + '</p><p>Ta formation avance au rythme de ton abonnement, en commençant toujours par le module 1. Celui-ci s’ouvrira le ' + esc(VERROU.date) + '. D’ici là, continue ton module en cours.</p><p><a class="btn btn-plein" href="cercle.html">Retour au Cercle</a></p></aside>';
    return '<aside class="mc-encadre mc-encadre-or mc-verrou"><p class="mc-encadre-t">Ce module fait partie de la formation « Sors de la boucle »</p><p>Il s’ouvre avec la formation, ou avec Le Cercle, qui l’inclut.</p><p><a class="btn btn-plein" href="formation.html">Découvrir la formation</a></p></aside>';
  }
  function modulePages() {
    var P = [], O = C.ouverture || {}, K = C.comprendre || {}, T = C.outil || {}, J = C.jours || {}, V = C.avancer || {};
    var sur = 'Module ' + C.module;
    P.push({ id: 'ouverture', nom: 'Avant de commencer', g: function () {
      return gauche('ouverture', sur + ' · avant de commencer', C.titre, '<p class="mc-intro">' + md(O.intro || '') + '</p>' +
        (C.objectifs ? '<aside class="mc-encadre mc-encadre-or mc-objectifs"><p class="mc-encadre-t">Ce que tu vas apprendre</p><p><b>Objectif principal :</b> ' + md(C.objectifs.principal) + '</p><p><b>Objectif spécifique :</b> ' + md(C.objectifs.specifique) + '</p>' + (C.objectifs.bonASavoir ? '<p><b>Bon à savoir :</b> ' + md(C.objectifs.bonASavoir) + '</p>' : '') + '</aside>' : ''),
        '<p class="mc-espace"><a class="btn btn-plein" href="' + esc(espaceFormation()) + '" target="_blank" rel="noopener">Regarder la vidéo du module</a></p>' +
        (C.seance ? '<p class="mc-note">La séance guidée du module : « ' + esc(C.seance) + ' », dans ton espace de formation.</p>' : ''));
    }, d: function () {
      if (!membre) return offreFormation();
      return '<section class="mc-etape"><h3><span>1</span> Là, maintenant</h3><p class="mc-consigne">Avant de commencer, prends une photo de ton état intérieur. Tu la compareras à la fin du module.</p>' +
          curseur('int-debut', O.intensiteQ || 'À quel point ce thème pèse-t-il dans ta vie aujourd’hui ?', 'presque pas', 'énormément') +
          zone('mot-debut', 'En un mot, comment te sens-tu en commençant ce module ?', { court: true, ph: 'Exemple : curieuse, fatiguée, en colère, prête…' }) +
          zone('liberer-souhait', O.souhaitQ || 'Qu’aimerais-tu voir autrement grâce à ce module ?', { lignes: 2, ph: O.souhaitPh }) + '</section>' +
        '<section class="mc-etape"><h3><span>2</span> Ta direction</h3><p class="mc-consigne">Regarder ce qui se répète ne suffit pas : on avance mieux vers une image claire. Formule ce que tu veux vivre à la place, en positif.</p>' +
          zone('obj-quoi', O.envieQ || 'Qu’aimerais-tu vivre à la place ? Commence par « J’aimerais… »', { court: true, ph: O.enviePh, aide: 'Formule ce que tu veux à la place de ce que tu ne veux plus.' }) +
          curseur('obj-croyance', 'À quel point crois-tu pouvoir y arriver ?', 'pas du tout', 'complètement') + '</section>' +
        '<section class="mc-etape"><h3><span>3</span> Ta phrase du module</h3>' + zone('phrase', 'Quelle phrase veux-tu te redire pendant tout le module ?', { court: true, ph: O.phrasePh || ('Exemple : ' + C.citation) }) + '<div data-phrase-jour></div></section>' +
        '<label class="mc-champ"><span class="mc-q">J’ai commencé ce module le</span><input type="date" data-k="debut"></label>';
    } });
    if (K.titre) P.push({ id: 'comprendre', nom: 'Comprendre', g: function () {
      return gauche('comprendre', sur + ' · comprendre', K.titre, '<p class="mc-intro">' + md(K.chapeau || '') + '</p>');
    }, d: function () {
      if (!membre) return offreFormation();
      return (K.histoire ? '<section class="mc-histoire"><p class="mc-sur">Pour commencer</p><h3 class="mc-h">' + esc(K.histoire.titre) + '</h3>' + paras(K.histoire.texte) + '</section>' : '') +
        paras(K.texte) +
        (K.signes ? encadre(K.signesTitre || 'Quatre signes qui ne trompent pas', '<ol class="mc-liste">' + K.signes.map(function (x) { return '<li>' + md(x) + '</li>'; }).join('') + '</ol>', 'mc-encadre-rose') : '') +
        (K.exemples ? encadre(K.exemplesTitre || 'Des boucles très courantes', '<ul class="mc-liste">' + K.exemples.map(function (x) { return '<li>' + md(x) + '</li>'; }).join('') + '</ul>') : '') +
        (K.question ? zone(K.question.k, K.question.q, { lignes: 2, ph: K.question.ph }) : '') +
        (K.retenir ? encadre('À retenir', '<ul class="mc-liste">' + K.retenir.map(function (x) { return '<li>' + md(x) + '</li>'; }).join('') + '</ul>', 'mc-encadre-or') : '') +
        citation();
    } });
    P.push({ id: 'exercices', nom: 'Les exercices', g: function () {
      return gauche('exercices', sur + ' · ton cahier', 'Les exercices du module', C.exercicesIntro ? '<p class="mc-intro">' + md(C.exercicesIntro) + '</p>' : '', sommaire(C.exercices));
    }, d: function () { return membre ? C.exercices.map(exercice).join('') : offreFormation(); } });
    P.push({ id: 'outil', nom: 'Ton outil et tes 7 jours', g: function () {
      return gauche('outil', sur + ' · ton outil', T.titre || 'Ton outil', '<p class="mc-intro">' + md(T.intro || '') + '</p>');
    }, d: function () {
      if (!membre) return offreFormation();
      return '<section class="mc-rituel" id="mc-outil"><p class="mc-sur">Ton outil du module</p><h3 class="mc-h">' + esc(T.titre || '') + '</h3>' +
          '<ol class="mc-etapes">' + (T.etapes || []).map(function (e) { return '<li>' + md(e) + '</li>'; }).join('') + '</ol>' +
          (T.note ? zone(T.note.k, T.note.q, { lignes: 3, ph: T.note.ph }) : '') + '</section>' +
        '<section class="mc-jours" id="mc-jours"><div class="mc-separe">' + ORNEMENT + '</div><p class="mc-sur">Le fil des 7 jours</p><h3 class="mc-h">' + esc(J.titre || 'Mon carnet de la semaine') + '</h3><p class="mc-consigne">' + md(J.consigne || '') + '</p>' +
          '<ol class="mc-jours-m">' + [1, 2, 3, 4, 5, 6, 7].map(function (j) {
            return '<li><label class="mc-champ"><span class="mc-q">Jour ' + j + ' <small data-jour-date="' + j + '"></small></span><textarea rows="2" data-k="j' + j + '"' + (j === 1 && J.ph ? ' placeholder="' + esc(J.ph) + '"' : '') + '></textarea></label></li>';
          }).join('') + '</ol>' +
          (J.fin ? zone(J.fin.k, J.fin.q, { lignes: 3, ph: J.fin.ph }) : '') + '</section>';
    } });
    P.push({ id: 'avancer', nom: 'Vers ce que je veux vivre', g: function () {
      return gauche('avancer', sur + ' · avancer', 'Vers ce que je veux vivre', '<p class="mc-intro">' + md(V.intro || '') + '</p>');
    }, d: function () {
      if (!membre) return offreFormation();
      return '<section class="mc-etape mc-intention"><h3><span>1</span> Ma vision</h3>' +
          (V.lieQ ? zone('av-vision', V.lieQ, { lignes: 3, ph: V.liePh }) : '') +
          '<p class="mc-sur">Désirer</p>' + zone('int-desir', 'Au fond, qu’est-ce que tu désires vraiment ressentir ?', { lignes: 2, ph: 'Exemple : me sentir libre, légère, respectée. Avoir enfin de l’espace pour moi.' }) +
          '<p class="mc-sur">Ressentir, comme si c’était déjà là</p><p class="mc-consigne">Ferme les yeux quelques secondes. Imagine-toi dans quelques mois, cette boucle devenue spirale. Où es-tu ? Que vois-tu, qu’entends-tu ? Laisse monter l’émotion dans ton corps, puis écris au présent, comme si tu le vivais déjà.</p>' +
          zone('proj-mois', 'Raconte cette scène au présent : que vois-tu, qu’entends-tu, que ressens-tu ?', { lignes: 4, ph: 'Exemple : c’est lundi matin, ma collègue me fait une remarque. Je respire, je réponds calmement, et je passe à autre chose. Je me sens solide.' }) +
          '<p class="mc-sur">Croire</p><div class="mc-deux">' + zone('int-frein', 'Quelle petite voix te dit que ce n’est pas possible, ou pas pour toi ?', { lignes: 2, ph: 'Exemple : « Dans la famille, on a toujours été comme ça. »' }) +
            zone('int-croire', 'Que choisis-tu de croire à la place ? Une phrase douce et vraie pour toi.', { lignes: 2, ph: 'Exemple : « Je peux faire un tour de spirale de plus, à mon rythme. »' }) + '</div></section>' +
        '<section class="mc-etape"><h3><span>2</span> Mon tableau de vision</h3><p class="mc-consigne">Trois mots ou trois images qui représentent ce que tu accueilles dans ta vie. Tu peux en faire ton fond d’écran, pour les voir chaque jour.</p>' +
          '<div class="mc-trois">' + zone('vision-1', 'Premier mot ou image', { court: true, ph: 'Exemple : une main ouverte' }) + zone('vision-2', 'Deuxième mot ou image', { court: true, ph: 'Exemple : le mot « libre »' }) + zone('vision-3', 'Troisième mot ou image', { court: true, ph: 'Exemple : un escalier en spirale' }) + '</div>' +
          (window.GenesoliaFond ? '<p class="gf-bouton"><button type="button" class="btn btn-trait" data-fond-ouvrir>Créer mon fond d’écran avec mes mots</button></p><div data-fond></div>' : '') + '</section>' +
        '<section class="mc-etape"><h3><span>3</span> Mon premier pas</h3>' + zone('obj-pas', 'Quel petit pas vers cette vision poses-tu dans les 48 heures ?', { court: true, ph: 'Exemple : demander de l’aide à ma collègue pour le dossier de vendredi' }) + '</section>' +
        ((C.allerPlusLoin || []).length ? '<section class="mc-avenir"><div class="mc-separe">' + ORNEMENT + '</div><p class="mc-sur">Pour aller plus loin · facultatif</p><h3 class="mc-h">Tes livres du Cercle, avec ce module</h3><div class="mc-avenir-l">' +
          C.allerPlusLoin.map(function (a) { return '<article class="mc-av"><div><p class="mc-av-t">' + esc(a.titre) + '</p><p>' + md(a.texte) + '</p><p><a class="btn btn-trait" href="' + esc(a.lien) + '">Ouvrir</a></p></div></article>'; }).join('') + '</div></section>' : '');
    } });
    P.push({ id: 'bilan', nom: 'Mon bilan', g: function () {
      return gauche('bilan', sur + ' · pour clore', 'Ce que ce module m’a appris', '<p class="mc-intro">Prends ce temps même si tout n’a pas été fait. Voir, c’est déjà ne plus être tout à fait dedans.</p>');
    }, d: function () {
      if (!membre) return offreFormation();
      return '<section class="mc-etape"><h3><span>1</span> Là, maintenant</h3><div class="mc-rappel" data-rappel-souhait hidden></div>' + curseur('int-fin', O.intensiteQ || 'À quel point ce thème pèse-t-il dans ta vie aujourd’hui ?', 'presque pas', 'énormément') + '<div class="mc-compare-int" id="mc-compare-int"></div></section>' +
        '<section class="mc-etape"><h3><span>2</span> Ce que je retiens</h3>' + (C.bilan || []).map(function (b) { return zone(b.k, b.q, { lignes: 3, ph: b.ph }); }).join('') +
          curseur('fin-obj', 'Où en es-tu de ce que tu voulais vivre à la place ?', 'pas commencé', 'déjà là') +
          zone('fin-merci', 'Pour quoi remercies-tu la personne que tu étais au début du module ?', { lignes: 2, ph: 'Exemple : pour avoir osé regarder, même quand c’était inconfortable.' }) + '</section>' +
        (C.suivant ? '<aside class="mc-encadre mc-encadre-rose mc-suivi"><p class="mc-encadre-t">La suite de ta formation</p><p><b>' + esc(C.suivant.titre) + '.</b> ' + md(C.suivant.texte) + '</p></aside>' : '') +
        '<p class="mc-note mc-mention">Cette formation propose une lecture symbolique et des exercices de développement personnel. Elle ne remplace pas un accompagnement médical ou psychologique.</p>';
    } });
    return P;
  }
  /* Les dates du fil des 7 jours suivent le jour où le module a commencé */
  function majDatesModule() {
    if (!MODULE) return;
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(D.v.debut || '');
    racine.querySelectorAll('[data-jour-date]').forEach(function (s) {
      var j = +s.getAttribute('data-jour-date');
      s.textContent = m ? '· ' + cap(JOURS_C[plusJ(new Date(+m[1], +m[2] - 1, +m[3]), j - 1).getDay()]) + ' ' + jourCourt(plusJ(new Date(+m[1], +m[2] - 1, +m[3]), j - 1)) : '';
    });
  }
  if (MODULE) PAGES = modulePages();


  /* ───── L'accompagnement personnalisé : profil des blessures, gestes du mois, lecture de la roue ─────
     Tout part de ce que la personne a rempli elle-même : sa roue, sa météo, son objectif, son point du mois
     et son profil des blessures (test fait par elle, pour elle). Rien n'est tiré au hasard.
     Textes : assets/carnet-accompagnement.js (window.CARNET_ACCOMP). */
  var PBL = null, PBL_TROUVE = null, pblMode = '', PREC = { rd: null, mois: '', gestes: {} }, accompCharge = false;
  var CLE_PBL = 'genesolia-profil-accompagnement', LIGNE_PBL = 'profil-accompagnement';
  var BL_CLES = ['rejet', 'abandon', 'humiliation', 'trahison', 'injustice'];
  function dateFr(iso) { var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || ''); return m ? (+m[3] === 1 ? '1er' : +m[3]) + ' ' + MOIS_NOMS[+m[2] - 1] + ' ' + m[1] : ''; }
  function isoDe(t) { var d = new Date(t); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function prive() { return A ? '<p class="mc-prive">' + esc(A.PRIVE) + '</p>' : ''; }
  function pointBlessures() {
    if (!A) return '';
    return '<div class="mc-blm"><p class="mc-q">Et ce mois-ci, t’es-tu senti·e… <small>(facultatif)</small></p><p class="mc-consigne">Ces quelques curseurs aident ton carnet à te proposer des gestes vraiment ajustés à ce que tu vis en ce moment.</p><div class="mc-echelles">' +
      A.BLESSURES.mois.map(function (x) { return curseur('blm-' + x[0], x[1], 'pas du tout', 'beaucoup'); }).join('') + '</div></div>';
  }
  function boutonsRoue(moment) {
    return '<p class="mc-roue-boutons"><a class="btn btn-trait" href="assets/roue-de-la-vie-vierge.pdf" download>Ma roue vierge à imprimer (PDF)</a> <button type="button" class="btn btn-trait" data-imprimer-roue="' + moment + '">Imprimer ma roue remplie</button></p>';
  }
  function majAccompagnement() { majVictoires(); if (!A) return; majProfilBl(); majGestes(); majBilanGestes(); majLectureRoue(); }
  function majVictoires() {
    var z = racine.querySelector('.mc-livre [data-victoires]'); if (!z) return;
    var l = [1, 2, 3].map(function (n) { var v = (D.v['sem' + n + '-victoire'] || '').trim(); return v ? '<li><b>Semaine ' + n + ' :</b> ' + esc(v) + '</li>' : ''; }).filter(Boolean);
    z.innerHTML = '<div class="mc-encadre mc-encadre-or"><p class="mc-encadre-t">Relis tes victoires du mois</p>' + (l.length ? '<ul class="mc-liste">' + l.join('') + '</ul><p>Prends un moment pour les relire et te remercier : ce sont elles qui, mises bout à bout, changent une vie.</p>' : '<p>Tes victoires des semaines 1 à 3 apparaîtront ici, pour que tu les relises avant de clore ton mois.</p>') + '</div>';
  }

  /* Les mois précédents (jusqu'à 3) : la roue du mois dernier, et les gestes déjà faits (pour repérer les nouveaux) */
  function moisAvant(n) { var p = String(C.mois).split('-'), d = new Date(+p[0], +p[1] - 1 - n, 1); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2); }
  function chargerPrecedents() {
    var CF = window.GenesoliaCoffre, enLigne = user && sb && CF && CF.accord(user);
    return Promise.all([1, 2, 3].map(function (n) {
      var cle = moisAvant(n), local = null;
      try { local = JSON.parse(localStorage.getItem('genesolia-carnet-' + cle) || 'null'); } catch (e) {}
      return (enLigne ? CF.lire(sb, user, cle).then(function (d) { return fusion(d, local); }, function () { return local; }) : Promise.resolve(local)).then(function (d) { return { cle: cle, d: d }; });
    })).then(function (l) {
      l.forEach(function (x, i) {
        var v = (x.d && x.d.v) || {};
        Object.keys(v).forEach(function (k) { if (/^g-/.test(k) && v[k]) PREC.gestes[k] = true; });
        if (i === 0) { var o = {}; ROUE.forEach(function (d) { if (typeof v['rd-' + d[0]] === 'number') o[d[0]] = v['rd-' + d[0]]; }); if (Object.keys(o).length) { PREC.rd = o; PREC.mois = x.cle; } }
      });
    });
  }
  function chargerAccompagnement() {
    if (!A || accompCharge) return; accompCharge = true;
    tonMois();
    var local = null; try { local = JSON.parse(localStorage.getItem(CLE_PBL) || 'null'); } catch (e) {}
    var CF = window.GenesoliaCoffre;
    var profil = user && sb && CF && CF.accord(user) ? CF.lire(sb, user, LIGNE_PBL).then(function (d) { return d && (d.scores || d.ignore) ? d : local; }, function () { return local; }) : Promise.resolve(local);
    Promise.all([profil, chargerPrecedents()]).then(function (r) { PBL = r[0] || null; majAccompagnement(); }, function () { majAccompagnement(); });
    if (user && sb) sb.from('resultats').select('donnees,cree_le').eq('outil', 'blessures').order('cree_le', { ascending: false }).limit(1).then(function (x) {
      var l = x && x.data && x.data[0]; PBL_TROUVE = l && l.donnees && l.donnees.scores ? { scores: l.donnees.scores, date: String(l.cree_le).slice(0, 10) } : null; majProfilBl();
    });
  }

  /* ───── La lecture de ta roue ───── */
  function nomDomaine(k) { var d = ROUE.filter(function (x) { return x[0] === k; })[0]; return d ? d[2].charAt(0).toLowerCase() + d[2].slice(1) : k; }
  function majLectureRoue() {
    var z = racine.querySelector('.mc-livre [data-roue-lecture]'); if (!z || !A) return;
    var r = roue('rd'), cles = Object.keys(r), ind = racine.querySelector('.mc-livre [data-roue-bas]');
    if (cles.length < ROUE.length) { z.innerHTML = ''; if (ind) ind.hidden = false; return; }
    if (ind) ind.hidden = true;
    var tri = cles.slice().sort(function (a, b) { return r[a] - r[b]; }), bas = tri.slice(0, 2), haut = tri[tri.length - 1];
    var h = '<p class="mc-encadre-t">Ce que dit ta roue</p>' +
      '<p><b>Tes deux domaines les plus bas :</b> ' + bas.map(function (k) { return esc(nomDomaine(k)) + ' (' + r[k] + '/10)'; }).join(' et ') + '.</p><ul class="mc-liste">' + bas.map(function (k) { return '<li>' + esc(A.ROUE[k].bas) + '</li>'; }).join('') + '</ul>' +
      '<p><b>Ta plus grande force :</b> ' + esc(nomDomaine(haut)) + ' (' + r[haut] + '/10). ' + esc(A.ROUE[haut].haut) + '</p>';
    if (PREC.rd) {
      var monte = [], baisse = [];
      cles.forEach(function (k) { if (typeof PREC.rd[k] !== 'number') return; var d = r[k] - PREC.rd[k]; if (d >= 2) monte.push([k, d]); else if (d <= -2) baisse.push([k, d]); });
      var nm = MOIS_NOMS[+PREC.mois.split('-')[1] - 1];
      h += '<p class="mc-encadre-t">Depuis ' + esc(nm) + '</p>' + (monte.length || baisse.length
        ? (monte.length ? '<p>' + esc(A.ROUE_EVOL.monte) + ' ' + monte.map(function (x) { return esc(nomDomaine(x[0])) + ' (+' + x[1] + ')'; }).join(', ') + '.</p>' : '') +
          (baisse.length ? '<p>' + esc(A.ROUE_EVOL.baisse) + ' ' + baisse.map(function (x) { return esc(nomDomaine(x[0])) + ' (' + x[1] + ')'; }).join(', ') + '.</p>' : '')
        : '<p>' + esc(A.ROUE_EVOL.stable) + '</p>');
    }
    z.innerHTML = h;
  }

  /* ───── Ton profil des blessures : un test fait par toi, pour toi ─────
     Réutilise les 20 phrases du test « Tes blessures ». Gardé chiffré dans ton espace (ligne « profil-accompagnement »
     de la table carnets, comme ton carnet) si tu as donné ton accord, sinon seulement dans ce navigateur.
     Un résultat trouvé ailleurs (appareil, Mon chemin) n'est utilisé qu'après « Oui, c'est moi ». */
  function idUser() { return user ? user.id : 'appareil'; }
  function sauverProfilBl(p) {
    PBL = p;
    try { if (p) localStorage.setItem(CLE_PBL, JSON.stringify(p)); else localStorage.removeItem(CLE_PBL); } catch (e) {}
    var CF = window.GenesoliaCoffre;
    if (user && sb && CF && CF.accord(user)) CF.ecrire(sb, user, LIGNE_PBL, p || { efface: new Date().toISOString() });
    pblMode = ''; majAccompagnement();
  }
  function profilValide() { return PBL && PBL.scores && PBL.moi === idUser() ? PBL : null; }
  function scoresBlessures() {
    var o = {}, p = profilValide(), auMoins = false;
    BL_CLES.forEach(function (k) {
      var t = p ? (p.scores[k] || 0) / 4 * 10 : null, m = typeof D.v['blm-' + k] === 'number' ? D.v['blm-' + k] : null;
      o[k] = t !== null && m !== null ? (t + m) / 2 : t !== null ? t : m !== null ? m : 0;
      if (t !== null || m !== null) auMoins = true;
    });
    return auMoins ? o : null;
  }
  function testBlessures() {
    var B = A.BLESSURES, items = [];
    for (var i = 0; i < 4; i++) BL_CLES.forEach(function (k) { items.push([k, B.phrases[k][i]]); });   /* les blessures sont mêlées, sans étiquette */
    return '<div class="mc-pbl-test"><p class="mc-consigne">Coche les phrases qui te ressemblent aujourd’hui. Réponds pour toi, sans chercher la bonne réponse : il n’y en a pas.</p><ul class="mc-pbl-liste">' +
      items.map(function (x) { return '<li><label><input type="checkbox" data-bl-phrase="' + x[0] + '"> ' + esc(x[1]) + '</label></li>'; }).join('') + '</ul>' +
      '<p class="mc-proprio-b"><button type="button" class="btn btn-plein" data-bl="valider">Voir mon profil</button> <button type="button" class="btn btn-trait" data-bl="annuler">Plus tard</button></p>' + prive() + '</div>';
  }
  function majProfilBl() {
    var z = document.getElementById('mc-profil-bl'); if (!z || !A) return;
    var B = A.BLESSURES, p = profilValide(), h = '<p class="mc-sur">Ton profil d’accompagnement</p><h3 class="mc-h">Tes blessures de l’âme</h3>';
    var aConfirmer = !p && PBL && PBL.scores && PBL.moi !== idUser() ? { scores: PBL.scores, date: PBL.date, ou: 'sur cet appareil' }
      : !p && PBL_TROUVE && !(PBL && PBL.ignore === PBL_TROUVE.date) ? { scores: PBL_TROUVE.scores, date: PBL_TROUVE.date, ou: 'dans ton espace' } : null;
    z._candidat = aConfirmer;
    if (pblMode === 'test') h += testBlessures();
    else if (aConfirmer) {
      h += '<div class="mc-proprio"><p>Nous avons trouvé un test des blessures fait le <b>' + esc(dateFr(aConfirmer.date)) + '</b> ' + aConfirmer.ou + '. Est-ce bien toi qui l’as rempli, pour toi ?</p>' +
        '<p class="mc-proprio-b"><button type="button" class="btn btn-plein" data-bl="oui">Oui, c’est moi</button> <button type="button" class="btn btn-trait" data-bl="autre">Non, c’était pour quelqu’un d’autre</button> <button type="button" class="btn btn-trait" data-bl="refaire">Je préfère le refaire</button></p></div>';
    } else if (p) {
      var tri = BL_CLES.slice().sort(function (a, b) { return (p.scores[b] || 0) - (p.scores[a] || 0); }), fort = tri.filter(function (k) { return p.scores[k] >= 2; }), leger = tri.filter(function (k) { return p.scores[k] === 1; });
      var vieux = (Date.now() - new Date(p.date).getTime()) > 182 * 864e5;
      h += (fort.length || leger.length ? '<p>' + (fort.length ? 'Ce qui te parle le plus en ce moment : <b>' + fort.map(function (k) { return '<a href="' + B.pages[k] + '" target="_blank" rel="noopener">' + esc(B.noms[k]) + '</a>'; }).join(', ') + '</b>' : '') + (leger.length ? (fort.length ? ', et un peu ' : 'Un peu : ') + leger.map(function (k) { return esc(B.noms[k]); }).join(', ') : '') + '.</p>' : '<p>Aucune phrase cochée : rien ne ressort pour l’instant, et c’est une information aussi.</p>') +
        '<ul class="mc-pbl-barres">' + BL_CLES.map(function (k) { var n = p.scores[k] || 0; return '<li><span>' + esc(B.noms[k].replace(/^(le |la |l’)/, '').replace(/^./, function (c) { return c.toUpperCase(); })) + '</span><i><b style="width:' + (n / 4 * 100) + '%"></b></i><small>' + (n >= 3 ? 'beaucoup' : n === 2 ? 'un peu' : n === 1 ? 'légèrement' : 'pas en ce moment') + '</small></li>'; }).join('') + '</ul>' +
        '<p class="mc-note">Ce n’est pas un diagnostic, c’est une boussole pour t’accompagner. Ton carnet s’en sert, avec ta roue et ta météo, pour choisir tes gestes du mois. Test fait le ' + esc(dateFr(p.date)) + '.</p>' +
        (vieux ? '<p class="mc-pourquoi">Ton test a plus de six mois : refais-le pour voir ce qui a bougé en toi.</p>' : '') +
        '<p class="mc-proprio-b"><button type="button" class="btn btn-trait" data-bl="refaire">Refaire ou modifier mon test</button> <button type="button" class="btn btn-trait" data-bl="effacer">Supprimer mon test</button></p>' + prive();
    } else {
      h += '<p>Pour que ton carnet t’accompagne vraiment, prends 10 minutes pour ce questionnaire. Tes gestes du mois seront choisis d’après tes réponses, ta roue et ta météo : rien n’est tiré au hasard.</p>' +
        '<p class="mc-proprio-b"><button type="button" class="btn btn-plein" data-bl="refaire">Faire mon test</button> <a class="btn btn-trait" href="blessures-de-l-ame.html" target="_blank" rel="noopener">Comprendre les cinq blessures</a></p>' +
        '<p class="mc-note">Facultatif. Ce n’est pas un diagnostic, c’est une boussole pour t’accompagner.</p>';
    }
    z.innerHTML = h;
  }
  function actionProfilBl(a) {
    var z = document.getElementById('mc-profil-bl'), c = z && z._candidat;
    if (a === 'refaire') { pblMode = 'test'; majProfilBl(); return; }
    if (a === 'annuler') { pblMode = ''; majProfilBl(); return; }
    if (a === 'oui' && c) { sauverProfilBl({ scores: c.scores, date: c.date, moi: idUser() }); return; }
    if (a === 'autre' && c) { sauverProfilBl(PBL_TROUVE && c.ou === 'dans ton espace' ? { ignore: PBL_TROUVE.date, moi: idUser() } : null); return; }
    if (a === 'effacer') { if (window.confirm('Supprimer ton test des blessures ? Tes gestes seront alors choisis d’après ta roue et ta météo.')) sauverProfilBl(PBL_TROUVE ? { ignore: PBL_TROUVE.date, moi: idUser() } : null); return; }
    if (a === 'valider') {
      var sc = {}; BL_CLES.forEach(function (k) { sc[k] = 0; });
      z.querySelectorAll('[data-bl-phrase]:checked').forEach(function (i) { sc[i.getAttribute('data-bl-phrase')]++; });
      sauverProfilBl({ scores: sc, date: isoDe(Date.now()), moi: idUser() });
    }
  }

  /* ───── Mes gestes du mois, à cocher ───── */
  function sectionGestes() {
    return '<section class="mc-exercice mc-gestes" id="mc-ex-gestes"><p class="mc-sur">Chaque jour, un petit geste</p><h3 class="mc-h">Mes gestes du mois</h3>' +
      '<p class="mc-consigne">Choisis ceux qui te parlent, même un seul compte. Coche-les quand tu les as faits : à la fin du mois, dans ton bilan, tu verras tout ce que tu as fait pour toi, même les plus petites choses.</p>' +
      '<div data-gestes></div>' +
      '<p class="mc-q">Mon propre geste</p><div class="mc-gestes-perso">' + [1, 2, 3].map(function (n) {
        return '<div class="mc-geste mc-geste-perso"><input type="checkbox" data-k="gp-' + n + '" aria-label="Fait"><input type="text" data-k="gp-' + n + '-t" placeholder="' + (n === 1 ? 'Exemple : appeler ma grand-mère dimanche' : 'Un geste à moi') + '"></div>';
      }).join('') + '</div>' + prive() + '</section>';
  }
  function hache(t) { var h = 0; for (var i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) | 0; return Math.abs(h); }
  function choixGestes() {
    var rd = roue('rd'), bas = Object.keys(rd).sort(function (a, b) { return rd[a] - rd[b]; }).slice(0, 2);
    var bl = scoresBlessures(), blHaut = bl ? BL_CLES.filter(function (k) { return bl[k] >= 3; }).sort(function (a, b) { return bl[b] - bl[a]; }).slice(0, 2) : [];
    var e = echelles('md'), niv = Object.keys(e).length ? ((e.energie != null ? e.energie : 5) + (e.serenite != null ? e.serenite : 5)) / 2 : null;
    var meteo = niv === null ? null : niv <= 4 ? 'bas' : niv >= 7 ? 'haut' : null;
    var objD = (ROUE.filter(function (d) { return d[2] === D.v['obj-domaine']; })[0] || [])[0];
    if (!bas.length && !blHaut.length && meteo === null && !objD) return { liste: [] };
    /* Chaque geste reçoit des points selon les réponses ; à égalité, l'ordre change d'un mois à l'autre */
    var notes = A.GESTES.filter(function (g) { return !g.base; }).map(function (g) {
      var s = 0, d = g.d || [], b = g.b || [], m = g.m || [];
      bas.forEach(function (k, i) { if (d.indexOf(k) >= 0) s += i ? 2 : 3; });
      if (objD && d.indexOf(objD) >= 0) s += 2;
      blHaut.forEach(function (k, i) { if (b.indexOf(k) >= 0) s += i ? 2 : 3; });
      if (meteo && m.indexOf(meteo) >= 0) s += 2;
      if (meteo === 'bas' && m.indexOf('haut') >= 0) s -= 2;
      return { g: g, s: s, t: hache(g.id + C.mois) };
    }).filter(function (x) { return x.s > 0; }).sort(function (a, b) { return b.s - a.s || a.t - b.t; });
    return { liste: notes.slice(0, 6).map(function (x) { return x.g; }) };
  }
  function ligneGeste(g) {
    var k = 'g-' + g.id;
    return '<label class="mc-geste"><input type="checkbox" data-k="' + k + '"' + (D.v[k] ? ' checked' : '') + '><span>' + esc(g.t) + '</span>' + (D.v[k] && D.t && D.t[k] ? '<small>fait le ' + esc(dateFr(isoDe(D.t[k])).replace(/ \d{4}$/, '')) + '</small>' : '') + '</label>';
  }
  function majGestes() {
    var z = racine.querySelector('.mc-livre [data-gestes]'); if (!z || !A) return;
    var base = A.GESTES.filter(function (g) { return g.base; }), ch = choixGestes(), ids = ch.liste.map(function (g) { return g.id; });
    /* Un geste déjà coché reste visible, même si les réponses ont changé depuis */
    A.GESTES.forEach(function (g) { if (!g.base && D.v['g-' + g.id] && ids.indexOf(g.id) < 0) { ch.liste.push(g); ids.push(g.id); } });
    z.innerHTML = '<p class="mc-encadre-t">Toujours là, pour chaque jour</p><div class="mc-gestes-l">' + base.map(ligneGeste).join('') + '</div>' +
      '<p class="mc-encadre-t">Pour toi, ce mois-ci</p>' +
      (ch.liste.length ? '<div class="mc-gestes-l">' + ch.liste.map(ligneGeste).join('') + '</div><p class="mc-note">Ces gestes sont choisis d’après tes réponses.</p>'
        : '<p class="mc-note">Remplis ta météo et ta roue dans « Ma météo du début » (page 2) : tes gestes du mois se choisiront d’après tes réponses.</p>');
  }
  function gestesFaits() {
    var l = [];
    A.GESTES.forEach(function (g) { var k = 'g-' + g.id; if (D.v[k]) l.push({ t: g.t, q: (D.t && D.t[k]) || 0, neuf: !PREC.gestes[k] }); });
    [1, 2, 3].forEach(function (n) { var t = (D.v['gp-' + n + '-t'] || '').trim(); if (D.v['gp-' + n] && t) l.push({ t: t, q: (D.t && D.t['gp-' + n]) || 0, neuf: false }); });
    return l.sort(function (a, b) { return a.q - b.q; });
  }
  function majBilanGestes() {
    var z = racine.querySelector('.mc-livre [data-bilan-gestes]'); if (!z || !A) return;
    var l = gestesFaits(), n = l.length, M = A.BILAN;
    z.innerHTML = '<div class="mc-encadre mc-encadre-or"><p class="mc-encadre-t">Tes gestes du mois</p>' +
      (n ? '<p class="mc-bilan-n">Ce mois-ci, tu as posé <b>' + n + ' geste' + (n > 1 ? 's' : '') + '</b> pour toi.</p><ul class="mc-liste">' + l.map(function (x) {
          return '<li>' + esc(x.t) + (x.q ? ' <small>(le ' + esc(dateFr(isoDe(x.q)).replace(/ \d{4}$/, '')) + ')</small>' : '') + (x.neuf ? ' <span class="mc-neuf">' + esc(M.nouveau) + '</span>' : '') + '</li>';
        }).join('') + '</ul><p>' + esc(n >= 10 ? M.beaucoup : n >= 2 ? M.quelques : M.un) + '</p>'
        : '<p>' + esc(M.zero) + ' <a href="#gestes">Voir mes gestes du mois</a></p>') + '</div>';
  }

  /* ───── Ma roue remplie, à imprimer ───── */
  function imprimerRoue(moment) {
    var a = roue('rd'), b = roue('rf'), series = [];
    if (Object.keys(a).length) series.push({ v: a, c: COUL_DEBUT });
    if (moment === 'fin' && Object.keys(b).length) series.push({ v: b, c: COUL_FIN });
    if (!series.length) { window.alert('Place d’abord les curseurs de ta roue : elle se dessinera, puis tu pourras l’imprimer.'); return; }
    var w = window.open('', '_blank'); if (!w) return;
    var lignes = ROUE.map(function (d) { return '<tr><td>' + esc(d[2]) + '</td><td>' + (typeof a[d[0]] === 'number' ? a[d[0]] : '') + '</td>' + (moment === 'fin' ? '<td>' + (typeof b[d[0]] === 'number' ? b[d[0]] : '') + '</td>' : '') + '</tr>'; }).join('');
    w.document.write('<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Ma roue de la vie · ' + esc(C.nomMois) + '</title><style>@page{size:A4;margin:20mm}body{font-family:Georgia,serif;color:#3B2433;max-width:720px;margin:1rem auto;padding:0 1rem}h1{color:#6B2F5B;font-weight:400;margin-bottom:.2rem}svg{width:100%;max-width:500px;display:block;margin:1rem auto}.mc-svg-lab{font:12px sans-serif;fill:#5A4752}table{width:100%;border-collapse:collapse;font-size:14px}td,th{border-bottom:1px solid #EBCFD5;padding:.4rem;text-align:left}.l span{margin-right:1.2rem}.l i{display:inline-block;width:12px;height:12px;border-radius:3px;margin-right:.3rem;vertical-align:-1px}p.n{font-size:12px;color:#7A6570}</style></head><body>' +
      '<h1>Ma roue de la vie</h1><p>' + esc(C.nomMois) + (prenom ? ' · ' + esc(prenom) : '') + '</p>' + radar(series, 'Ma roue de la vie') +
      (series.length > 1 ? '<p class="l"><span><i style="background:' + COUL_DEBUT + '"></i>Début du mois</span><span><i style="background:' + COUL_FIN + '"></i>Fin du mois</span></p>' : '') +
      '<table><tr><th>Domaine</th><th>Début</th>' + (moment === 'fin' ? '<th>Fin</th>' : '') + '</tr>' + lignes + '</table><p class="n">Genesolia · Le carnet du mois. Garde cette feuille près de toi, et compare-la le mois prochain.</p>' +
      '<script>window.onload=function(){window.print();}<\/script></body></html>');
    w.document.close();
  }

  /* ───── Le suivi par étapes : le titre et les 12 étapes de l'année ───── */
  function titreEtape() { return 'Étape ' + ET.n + ' · ' + (SUIVI ? partieArbre(ET.n) + ' · ' : '') + C.titre; }
  function navEtapes() {
    if (!ET) return '';
    return '<details class="mc-etapes-nav"><summary>Étape ' + ET.n + ' sur 12 · ton année en 12 étapes</summary><ol>' + (SUIVI ? ARBRE_ETAPES : CARNET_ETAPES).map(function (t, i) {
      var n = i + 1, ok = n <= ET.debloquees, ici = n === ET.n;
      var lab = '<span class="mc-et-n">Étape ' + n + '</span><span class="mc-et-t">' + (SUIVI ? esc(partieArbre(n)) + ' · ' : '') + esc(t) + '</span>';
      return '<li class="' + (ici ? 'mc-et-ici' : ok ? 'mc-et-ok' : 'mc-et-avenir') + '">' +
        (ici ? '<b aria-current="step">' + lab + '</b>' : ok ? '<a href="' + (SUIVI ? 'mon-suivi-mois.html' : 'mon-carnet.html') + '?etape=' + n + (APERCU ? '&amp;apercu' : '') + '">' + lab + '</a>' : '<span>' + lab + '<em>à venir</em></span>') + '</li>';
    }).join('') + '</ol></details>';
  }

  /* ───── Mon livre de lignée : une case par section d'écriture (suivi et carnet) ─────
     Chaque section (ou champ isolé) qui contient au moins un champ d'écriture reçoit une case « À mettre dans mon livre de lignée »,
     décochée par défaut (= personnel). Elle s'enregistre comme toutes les autres cases (D.v, même fichier, même clé de suivi) sous la clé
     « livre-<clé du premier champ d'écriture de la section> » : stable (les clés de champs ne changent jamais) et unique dans le mois.

     NOTE TECHNIQUE pour l'export de fin d'année (« mon carnet complet » et « mon livre de lignée », à venir) :
     - Les réponses d'une étape sont dans le coffre (GenesoliaCoffre.lire(sb, user, 'suivi-AAAA-MM')) ou, sans compte, dans
       localStorage['genesolia-carnet-suivi-AAAA-MM'] : { v: { clé: valeur }, t: { clé: horodatage } }.
       Étape n = fichier n de assets/site.js ETAPES_SUIVI (étape 1 = suivi-2026-10 … étape 12 = suivi-2027-09).
       Carnet (cycle 1) : même mécanisme, coffre 'carnet-AAAA-MM' ou localStorage['genesolia-carnet-AAAA-MM'] (clé du fichier, CLE_LOCALE).
     - Sections cochées d'une étape : Object.keys(D.v).filter(function (k) { return /^livre-/.test(k) && D.v[k] === true; }).
       Pour chacune, la clé du premier champ est k.slice(6). Pour retrouver tous les champs de la section, construire la page
       de l'étape (même moteur, sans l'afficher) puis lire les [data-k] du parent qui porte [data-livre="<k>"] (attribut posé ci-dessous).
     - « Mon carnet complet » = toutes les réponses ; « mon livre de lignée » = seulement les sections dont livre-… vaut true.
     Ces clés « livre-… » sont exclues du calcul d'avancement (clesDe). */
  var LIVRE_NOTE = 'Ce que tu écris reste à toi. Coche « À mettre dans mon livre de lignée » pour ce que tu souhaites transmettre : à la fin de ton année, tu pourras télécharger ton livre.';
  function casesLivre() {
    if (MODULE) return;
    var vus = [];
    racine.querySelectorAll('.mc-livre textarea[data-k], .mc-livre input[type=text][data-k]').forEach(function (el) {
      var bloc = el.closest('section') || el.closest('label');
      if (!bloc || vus.indexOf(bloc) >= 0 || bloc.querySelector('[data-livre]')) return;
      vus.push(bloc);
      var k = 'livre-' + el.getAttribute('data-k');
      if (racine.querySelector('[data-k="' + k + '"]')) return;
      var h = '<label class="mc-livre-case" data-livre="' + esc(k) + '"><input type="checkbox" data-k="' + esc(k) + '"> À mettre dans mon livre de lignée</label>';
      if (bloc.tagName === 'LABEL') bloc.insertAdjacentHTML('afterend', h);
      else { var pdf = bloc.querySelector(':scope > .mc-pdf-zone'); if (pdf) pdf.insertAdjacentHTML('beforebegin', h); else bloc.insertAdjacentHTML('beforeend', h); }
    });
  }

  /* ───── Le suivi : le point de départ en haut, indispensable, et le sommaire du mois ─────
     Le point de départ (point-de-depart.html, localStorage genesolia-carnet-point-de-depart ou coffre) porte le besoin de libération du cycle 2 (c2-cible-1). */
  function departPhrase() { var v = pdV(), r = pdRes(); return String(v['c2-cible-1'] || r.cible2 || '').trim(); }
  function departCorps() {
    var c = departPhrase();
    return c ? '<p class="mc-depart-phrase"><span>Ton besoin de libération</span>« ' + esc(c) + ' »</p><p class="mc-depart-mod"><a href="point-de-depart.html#etape-3">Modifier mon point de départ</a></p>'
      : '<p class="mc-depart-texte">Commence par ton point de départ : c’est là que tu poses ton besoin de libération, et tout ton suivi s’oriente dessus. Comme ton nom, ton prénom et ta date de naissance, il est indispensable.</p><p><a class="btn btn-plein" href="point-de-depart.html">C’est parti</a></p>';
  }
  function departHtml() {
    return '<aside class="mc-depart" data-depart><p class="mc-depart-t" data-depart-t>Avant tout : ton point de départ</p><p class="mc-depart-cycle">Ton cycle 2 parle de tes relations, de l’amour et de ta façon d’aimer.</p><div data-depart-corps>' + departCorps() + '</div></aside>';
  }
  function majDepart() {
    var z = racine.querySelector('[data-depart-corps]'); if (!z) return;
    var fait = !!departPhrase() || !!pdV().fait;
    z.innerHTML = departCorps();
    racine.querySelector('[data-depart]').classList.toggle('mc-depart-fait', fait);
    racine.querySelector('[data-depart]').hidden = fait;   /* fait : le bloc disparaît, pour ne pas disperser */
    racine.querySelector('[data-depart-t]').textContent = fait ? 'Ton point de départ' : 'Avant tout : ton point de départ';
  }
  /* Le carnet par étapes : « Ta saison » suit le vrai mois du calendrier (assets/saisons.js), l'étape suit le parcours */
  function saisonCarnet() {
    var S = window.GENESOLIA_SAISONS, sa = S && S[MOIS_SAISON];
    return { id: 'saison', nom: 'Ta saison', g: function () {
      return gauche('saison', (sa ? sa.mois : NOM_MOIS) + ' · ta saison', sa ? sa.titre.charAt(0).toUpperCase() + sa.titre.slice(1) : 'Ta saison',
        sa ? '<p class="mc-intro">' + esc(sa.texte) + '</p>' : '', sa ? '<p class="mc-permission"><b>Ce que ça veut dire pour toi :</b> ' + esc(sa.permission) + '</p>' : '');
    }, d: function () {
      return '<div class="mc-ta-saison"><p class="mc-consigne">Ton étape suit ton propre rythme, depuis ton arrivée dans Le Cercle. La saison, elle, suit le calendrier : voici ce que la nature t’offre en ce moment, pour accorder ton carnet au dehors.</p>' +
        (sa ? encadre('Un geste de saison', '<p>' + esc(sa.geste) + '</p>', 'mc-encadre-or') : '') +
        encadre('Ton autel de saison', '<p>Va te promener et ramasse ce que la nature t’offre en ce moment : feuilles, branches, pierres, fleurs ou fruits secs. Avec une bougie et des couleurs qui s’accordent, crée-toi un petit autel : un espace qui protège ton énergie et te rappelle ton intention.</p>' +
          '<p><a class="btn btn-plein" href="autel-de-saison.html?mois=' + esc(MOIS_SAISON_ISO) + '">Créer mon autel du mois</a></p>', 'mc-autel-encart') +
        (sa ? '<blockquote class="mc-citation"' + (DECOR.citation ? ' style="--fond:url(\'' + esc(fondUrl(DECOR.citation)) + '\')"' : '') + '><span>' + esc(sa.citation) + '</span></blockquote>' : '') + '</div>';
    } };
  }
  /* Relecture (&apercu) : tous les liens vers le suivi et le carnet gardent &apercu, pour ouvrir exactement l'étape ou le mois demandé */
  function garderApercu() {
    if (!APERCU) return;
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
      var h = a.getAttribute('href');
      if (!/^\/?(mon-suivi-mois|mon-carnet)\.html/.test(h) || /[?&]apercu\b/.test(h)) return;
      var i = h.indexOf('#'), base = i < 0 ? h : h.slice(0, i), ancre = i < 0 ? '' : h.slice(i);
      a.setAttribute('href', base + (base.indexOf('?') < 0 ? '?' : '&') + 'apercu' + ancre);
    }, true);
  }

  /* ───── Construction ───── */
  var courante = 0, enCours = false;
  var reduit = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function modeLivre() { return window.matchMedia('(min-width: 1200px)').matches; }
  /* Les trois livres se reconnaissent d'un coup d'œil : le carnet en clair (je m'aligne), le suivi en prune (je libère), le module aux couleurs de la formation */
  var THEME = SUIVI ? 'suivi' : MODULE ? 'module' : 'carnet';
  var RUBAN = SUIVI ? 'Ici, je libère' : MODULE ? 'Formation · Sors de la boucle' : 'Ici, je m’aligne';
  function construire() {
    racine.classList.add('mc-t-' + THEME);
    var fond = DECOR.couverture ? ' style="--fond:url(\'' + esc(fondUrl(DECOR.couverture)) + '\')"' : '';
    racine.innerHTML =
      '<header class="mc-tete"' + fond + '><p class="mc-ruban">' + RUBAN + '</p><p class="mc-sur">' + (ET ? (SUIVI ? 'Le Cercle · Ton suivi « Je me libère » · étape ' : 'Le Cercle · Ton carnet « J’avance » · étape ') + ET.n + ' sur 12' : MODULE ? 'Module ' + esc(C.module) + ' sur 8' : (COEUR ? 'Cycle 2 · Comment j’aime, et comment aimer plus grand · ' + esc(NOM_MOIS) + ' ' + esc(String(C.nomMois).split(' ')[1] || '') : 'Le Cercle · ' + (SUIVI ? 'Ton suivi « Je me libère » ' : T2 ? 'Cycle 1 · De la peur à la paix, en alignement avec soi · ' : 'Le carnet « J’avance » ') + (T2 ? esc(NOM_MOIS) : esc(de(NOM_MOIS))) + ' ' + esc(String(C.nomMois).split(' ')[1] || ''))) + '</p>' +
        '<p class="mc-perso" id="mc-perso" hidden></p><h1>' + esc(ET ? titreEtape() : C.titre) + '</h1><p>' + esc(C.sousTitre) + '</p>' + navEtapes() + (SUIVI ? departHtml() : '') +
        (SUIVI || CARNET ? '<p class="mc-livre-note">' + esc(LIVRE_NOTE) + '</p>' : '') +
        '<div class="mc-barre"><div class="mc-progres" aria-label="Avancement du carnet"><span id="mc-progres-barre"></span></div><span id="mc-progres-texte"></span><span class="mc-etat" id="mc-etat" aria-live="polite"></span></div>' +
        '<div class="mc-boutons"><div class="mc-imp-zone"><button type="button" class="btn btn-trait" id="mc-imprimer" aria-expanded="false" aria-controls="mc-imp-choix" aria-label="' + (SUIVI ? 'Imprimer mon suivi rempli' : MODULE ? 'Imprimer mon module rempli' : 'Imprimer mon carnet rempli') + '"><svg class="mc-ico-imp" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 8V3h10v5M7 17H4.5A1.5 1.5 0 0 1 3 15.5v-6A1.5 1.5 0 0 1 4.5 8h15A1.5 1.5 0 0 1 21 9.5v6a1.5 1.5 0 0 1-1.5 1.5H17"/><path d="M7 13h10v8H7z"/></svg><span>' + (SUIVI ? 'Imprimer mon suivi rempli' : MODULE ? 'Imprimer mon module rempli' : 'Imprimer mon carnet rempli') + '</span></button>' +
          '<div class="mc-imp-choix" id="mc-imp-choix" hidden><p>Quelle version veux-tu imprimer ?</p>' +
            '<button type="button" data-imprimer="simple"><b>Simple</b><span>Le texte et tes réponses, sans images : économe en encre.</span></button>' +
            '<button type="button" data-imprimer="decor"><b>Avec le décor</b><span>Les illustrations, les couleurs et les ornements.</span></button></div></div>' +
          (C.pdf ? '<a class="btn btn-trait" href="' + esc(C.pdf) + '" download>Version papier vierge (PDF)</a>' : '') +
          (MODULE ? '<a class="btn btn-trait" href="' + esc(espaceFormation()) + '" target="_blank" rel="noopener">Mon espace de formation</a><a class="btn btn-trait" href="mon-carnet.html">Mon carnet du mois</a>' :
            (SUIVI ? '<a class="btn btn-trait" href="' + esc(vers('mon-carnet.html')) + '">Mon carnet du mois</a>' : '<a class="btn btn-trait" href="' + esc(vers('mon-suivi-mois.html')) + '">Mon suivi du mois</a>') +
            '<a class="btn mc-btn-audio" href="' + seanceUrl(SUIVI ? 2 : 1) + '">Écouter mes séances audio</a>' +
            '<button type="button" class="btn btn-trait" data-ics>Ajouter mes rappels à mon agenda</button>') + '</div>' +
        '<div class="mc-compte" id="mc-compte" hidden></div></header>' +
      '<nav class="mc-onglets" aria-label="' + (MODULE ? 'Pages du module' : 'Pages du carnet') + '">' + PAGES.map(function (p, i) { return '<button type="button" data-page="' + i + '"' + (p.sem != null ? ' class="mc-onglet-sem"' : '') + '><span>' + (p.sem != null ? '✦' : '•') + '</span>' + esc(p.nom) + '</button>'; }).join('') + '</nav>' +
      '<div class="mc-livre" id="mc-livre">' + PAGES.map(function (p, i) {
        return '<article class="mc-page" id="page-' + p.id + '" data-p="' + i + '"' + (i ? ' hidden' : '') + ' aria-label="Page ' + (i + 1) + ' : ' + esc(p.nom) + '">' +
          '<p class="mc-ruban-page">' + RUBAN + '</p><p class="mc-pagenum">Page ' + (i + 1) + ' sur ' + PAGES.length + ' · ' + esc(p.nom) + '</p>' +
          '<div class="mc-g">' + p.g() + '<span class="mc-folio">' + (2 * i + 1) + '</span></div>' +
          '<div class="mc-d">' + p.d() +
            '<div class="mc-nav">' + (i ? '<button type="button" class="btn btn-trait" data-page="' + (i - 1) + '">Page précédente</button>' : '<span></span>') + (i < PAGES.length - 1 ? '<button type="button" class="btn btn-plein" data-page="' + (i + 1) + '">Page suivante</button>' : '') + '</div>' +
            '<span class="mc-folio">' + (2 * i + 2) + '</span></div></article>';
      }).join('') + '</div>' +
      '<p class="mc-aide-livre">Astuce : sur un grand écran, tourne les pages avec les flèches du clavier. Sur téléphone ou tablette, glisse du doigt vers la gauche ou la droite.</p>' +
      (MODULE ? '' : autreLivre()) + aLire() + avisHtml();
    casesLivre();
    garderApercu();

    racine.addEventListener('click', function (e) {
      var t = e.target;
      var imp = t.closest('[data-imprimer]'); if (imp) { imprimer(imp.getAttribute('data-imprimer')); return; }
      if (t.closest('#mc-imprimer')) { basculerChoix(); return; }
      if (!t.closest('.mc-imp-choix')) basculerChoix(false);
      var b = t.closest('[data-page]'); if (b) { var anc = b.getAttribute('data-ancre'); aller(+b.getAttribute('data-page'), anc ? { ancre: anc } : null); if (!anc) setTimeout(function () { defiler(document.getElementById('mc-livre'), true); }, 30); return; }
      var m = t.closest('[data-meteo]'); if (m) { enregistrerMeteo(m.getAttribute('data-meteo'), m); return; }
      var bl = t.closest('[data-bl]'); if (bl) { actionProfilBl(bl.getAttribute('data-bl')); return; }
      var ir = t.closest('[data-imprimer-roue]'); if (ir) { imprimerRoue(ir.getAttribute('data-imprimer-roue')); return; }
      if (t.closest('[data-ics]')) { telechargerRappels(); return; }
      var fo = t.closest('[data-fond-ouvrir]');
      if (fo) {
        var zf = fo.parentNode.nextElementSibling; fo.parentNode.hidden = true;
        window.GenesoliaFond.ouvrir(zf, { mois: NOM_MOIS, sur: MODULE ? 'Ma spirale · module ' + C.module : '', mots: ['vision-1', 'vision-2', 'vision-3'].map(function (k) { return String(D.v[k] || '').replace(/^Exemple\s*:\s*/i, ''); }), phrase: String(D.v.phrase || D.v['int-croire'] || '').replace(/^«\s*|\s*»$/g, '') });
        if (window.umami) try { window.umami.track('fond-ecran-ouvert'); } catch (x) {}
        return;
      }
      var am = t.closest('[data-amorce]'); if (am) { amorce(am.getAttribute('data-amorce'), am.getAttribute('data-amorce-pour')); return; }
      var pdf = t.closest('[data-pdf]'); if (pdf) { imprimerExo(pdf.getAttribute('data-pdf')); return; }
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
    marquerSemaine(); if (!MODULE) chargerPont(); numeroterExercices();
    var imgM = racine.querySelector('[data-image-mois-img]');
    if (imgM) imgM.addEventListener('error', function () { var z = imgM.closest('[data-image-mois]'); if (APERCU) imgM.parentNode.outerHTML = aFournir('[IMAGE DU MOIS À FOURNIR]'); else z.remove(); });
    var c = cible();
    aller(c.p, { initial: true, ancre: c.ancre });
  }
  function amorce(a, pour) {
    var ta = racine.querySelector('.mc-livre textarea[data-k="' + (pour || 'lettre-mois') + '"]'); if (!ta) return;
    var t = ta.value.replace(/\s+$/, '');
    ta.value = (t ? t + '\n\n' : '') + a + ' ';
    changement({ target: ta });
    ta.focus(); try { ta.setSelectionRange(ta.value.length, ta.value.length); } catch (e) {}
  }
  /* ───── Le pont entre les deux livres du mois : chaque semaine annonce la même semaine de l'autre livre ───── */
  function chargerPont() {
    return;   /* retiré : « Cette semaine dans ton autre livre » dispersait */
    var src = (SUIVI ? 'assets/carnets/' : 'assets/suivi/') + C.mois + '.js' + (window.GENESOLIA_V ? '?v=' + window.GENESOLIA_V : '');
    fetch(src).then(function (r) { return r.ok ? r.text() : ''; }).then(function (t) {
      if (!t) return;
      var w = {}; try { new Function('window', t)(w); } catch (e) { return; }
      var X = w.GENESOLIA_CARNET; if (!X || !X.semaines) return;
      racine.querySelectorAll('.mc-livre [data-pont]').forEach(function (z) {
        var k = +z.getAttribute('data-pont'), s = X.semaines[k]; if (!s) return;
        if (Array.isArray(s)) s = { titre: s[0] };
        var nom = SUIVI ? 'Semaine ' + (k + 1) + ' · ' + ETAPES_SEM[k][0] : 'Semaine ' + (k + 1) + (s.nom ? ' · ' + s.nom : '');
        var lien = SUIVI ? vers('mon-carnet.html') + '#semaine-' + (k + 1) : vers('mon-suivi-mois.html') + '#' + (s.cle || 'saison');
        z.innerHTML = '<span>' + (SUIVI ? 'Cette semaine dans ton carnet « J’avance »' : 'Cette semaine dans ton suivi « Je me libère »') + '</span><b>' + esc(nom) + '</b>' + (s.titre ? ' · ' + esc(s.titre) : '') + ' <a href="' + esc(lien) + '">Ouvrir</a>';
        z.hidden = false;
      });
    }).catch(function () {});
  }
  /* La semaine en cours : un bandeau en haut du carnet, et l'onglet mis en avant (tout reste ouvert) */
  function marquerSemaine() {
    var n = semaineEnCours(); if (n < 0) return;
    var idx = -1; PAGES.forEach(function (p, j) { if (p.sem === n) idx = j; }); if (idx < 0) return;
    var bt = racine.querySelector('.mc-onglets [data-page="' + idx + '"]'); if (bt) bt.classList.add('mc-encours');
    racine.querySelectorAll('[data-encours="' + n + '"]').forEach(function (x) { x.hidden = false; });
    var t = racine.querySelector('.mc-tete .mc-barre');
    if (t) t.insertAdjacentHTML('afterend', '<p class="mc-cette-semaine">Cette semaine : <b>' + esc(PAGES[idx].nom) + '</b> (' + dates(n) + ') <button type="button" class="btn btn-plein" data-page="' + idx + '">Ouvrir ma semaine</button></p>');
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
    /* Anciens liens (notifications, rappels d'agenda, accueil du Cercle) vers les pages d'avant le découpage en semaines */
    if (!SUIVI) {
      var ALIAS = { theme: ['semaine-1'], exercices: ['semaine-1'], gestes: ['semaine-2', 'mc-ex-gestes'], comprendre: ['semaine-2'], rituel: ['semaine-4', 'mc-rituel'], seance: ['semaine-4', 'mc-seance'], semaines: [PAGES[Math.max(0, semaineEnCours())] ? 'semaine-' + (Math.max(0, semaineEnCours()) + 1) : 'semaine-1'] };
      var ms = /^semaines-(\d)$/.exec(h); if (ms) ALIAS[h] = ['semaine-' + ms[1]];
      if (ALIAS[h] && ids.indexOf(ALIAS[h][0]) >= 0) return { p: ids.indexOf(ALIAS[h][0]), ancre: ALIAS[h][1] || null };
    }
    if (COEUR) { var AC = { voir: 'semaine-2', source: 'semaine-2', liberer: 'semaine-3', remplacer: 'semaine-4' }; if (AC[h]) return { p: ids.indexOf(AC[h]) }; }
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
      var cles = { lettre: ['proj-an'], 'objectif-plus': ['obj-depend', 'obj-part', 'obj-contexte', 'obj-voir', 'obj-entendre', 'obj-ressentir', 'obj-ecologie', 'obj-ressources', 'obj-un-point'] }[d.getAttribute('data-plus')] || ['lettre-mois', 'ancre-souvenir', 'ancre-mot'];
      if (cles.some(function (k) { return (D.v[k] || '').toString().trim(); })) d.open = true;
    });
    majPhraseJour(); majDatesModule(); majPD(); majJeSuis(); majCoeur();
    progres(); verifierObjectif(); perso(); majRadars(); comparerIntensite(); majMeteoDit(); majBravos(); majAncienAncrage(); majAccompagnement();
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
    if (k === 'debut') majDatesModule();
    if (COEUR && /^coeur-(suite|nouvelle)$/.test(k)) majCoeur();
    if (COEUR && k === 'coeur-cible') majCoeur();
    if (T2) {
      if (k === 'obj-choix' && !/moi-même/.test(nv) && (!String(D.v['obj-quoi'] || '').trim() || D.v['obj-quoi'] === D.v._objAuto)) { D.v['obj-quoi'] = nv; D.v._objAuto = nv; D.t['obj-quoi'] = Date.now(); var oq = racine.querySelector('.mc-livre [data-k="obj-quoi"]'); if (oq) oq.value = nv; verifierObjectif(); perso(); }
      if (/^vis-\d$/.test(k)) majJeSuis();
      if (k === 'cible-suite' || k === 'cible-nouvelle') majCibleSuite();
    }
    if (/^md-/.test(k)) majMeteoDit();
    if (A) {
      if (/^(md|blm|rd)-/.test(k) || k === 'obj-domaine') { majGestes(); majLectureRoue(); }
      if (/^g-/.test(k)) majGestes();
      if (/^(g|gp)-/.test(k)) majBilanGestes();
    }
    if (/^sem[123]-victoire$/.test(k)) majVictoires();
    majBravos();
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
  function clesDe(sel) { var l = []; racine.querySelectorAll(sel).forEach(function (el) { var k = el.getAttribute('data-k'); if (l.indexOf(k) < 0 && !/^livre-/.test(k)) l.push(k); }); return l; }
  function etapes() {
    var E = [];
    function ajoute(nom, page, cles) { E.push({ nom: nom, page: page, fait: cles.some(repondu) }); }
    if (MODULE || COEUR) {
      PAGES.forEach(function (pg) { ajoute(pg.nom, pg.id, clesDe('#page-' + pg.id + ' [data-k]')); });
    } else if (SUIVI) {
      ajoute('Point de départ', 'saison', clesDe('#page-saison [data-k]'));
      C.semaines.forEach(function (w, i) { ajoute('Semaine ' + (i + 1), w.cle, clesDe('#page-' + w.cle + ' [data-k]')); });
      ajoute('Méditation', 'meditation', clesDe('#page-meditation [data-k]'));
      ajoute('Bilan', 'bilan', clesDe('#page-bilan [data-k]'));
    } else if (T2) {
      ajoute('Météo', 'ouverture', clesDe('#page-ouverture [data-k^="md-"]'));
      ajoute('Roue', 'ouverture', ['obj-domaine']);
      ajoute('Objectif', 'ouverture', ['obj-quoi']);
      [0, 1, 2, 3].forEach(function (i) { ajoute('Semaine ' + (i + 1), 'semaine-' + (i + 1), clesDe('#page-semaine-' + (i + 1) + ' [data-k]')); });
      ajoute('Bilan', 'cloture', clesDe('#page-cloture [data-k]'));
    } else {
      ajoute('Météo', 'ouverture', clesDe('#page-ouverture [data-k^="md-"]'));
      ajoute('Roue', 'ouverture', clesDe('#page-ouverture [data-k^="rd-"]'));
      ajoute('Objectif', 'ouverture', ['obj-quoi']);
      C.semaines.forEach(function (s, i) { ajoute('Semaine ' + (i + 1), 'semaine-' + (i + 1), clesDe('#page-semaine-' + (i + 1) + ' [data-k^="sem' + (i + 1) + '-"]')); });
      ajoute('Bilan', 'cloture', clesDe('#page-cloture [data-k]'));
    }
    return E;
  }
  function progres() {
    /* Une seule numérotation : celle des onglets. Une page compte quand ses étapes sont faites (ou, sans étape, quand elle a une réponse). */
    var E0 = etapes(), E = PAGES.map(function (pg) {
      var ets = E0.filter(function (e) { return e.page === pg.id; });
      return { nom: pg.nom, page: pg.id, fait: ets.length ? ets.every(function (e) { return e.fait; }) : clesDe('#page-' + pg.id + ' [data-k]').some(repondu) };
    });
    var n = E.filter(function (e) { return e.fait; }).length, p = E.length ? Math.round(n / E.length * 100) : 0;
    var b = document.getElementById('mc-progres-barre'); if (b) b.style.width = p + '%';
    var t = document.getElementById('mc-progres-texte'); if (t) t.textContent = n + (n > 1 ? ' pages faites' : ' page faite') + ' sur ' + E.length;
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
    if (z) { z.hidden = !prenom; z.textContent = prenom ? (ET ? 'Ton étape ' + ET.n + ', ' + prenom : MODULE ? 'Ton module ' + C.module + ', ' + prenom : (SUIVI ? 'Ton suivi ' : 'Ton carnet ') + de(NOM_MOIS) + ', ' + prenom) : ''; }
    var lm = racine.querySelector('.mc-livre textarea[data-k="lettre-mois"]'), pn = prenom || premierMot((lireProfil() || {}).prenom || '');
    if (lm) lm.placeholder = pn ? 'Exemple : ' + pn + ', ce mois-ci, je voulais te dire…' : 'Exemple : Ce mois-ci, je voulais te dire…';
    var obj = (D.v['obj-quoi'] || '').trim();
    racine.querySelectorAll('.mc-livre [data-si-objectif]').forEach(function (x) { x.hidden = !obj; });
    racine.querySelectorAll('.mc-livre [data-rappel-obj]').forEach(function (r) {
      r.hidden = !obj;
      r.innerHTML = obj ? '<span>' + (MODULE ? 'Ce que tu veux vivre à la place' : 'Ton objectif du mois') + '</span>« ' + esc(obj) + ' »' : '';
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
    if (!sb) { D = local || D; appliquer(); invitation(); chargerAccompagnement(); if (T2 || SUIVI) chargerPD(); return; }
    sb.auth.getSession().then(function (r) {
      var s = r.data && r.data.session;
      if (!s) { D = local || D; appliquer(); invitation(); chargerAccompagnement(); if (T2 || SUIVI) chargerPD(); return; }
      user = s.user;
      prenom = premierMot((user.user_metadata && (user.user_metadata.full_name || user.user_metadata.prenom)) || '') || premierMot((lireProfil() || {}).prenom || '');
      perso();
      if (window.GenesoliaReperes && !SUIVI && !MODULE) window.GenesoliaReperes.lire(sb, user).then(function () { tonMois(); if (typeof majSemainesMaya === 'function') majSemainesMaya(); majMeteoDit(); perso(); });
      var CF = window.GenesoliaCoffre;
      (CF ? CF.lire(sb, user, CLE) : sb.from('carnets').select('data').eq('user_id', user.id).eq('mois', CLE).maybeSingle().then(function (x) { return x && x.data ? x.data.data : null; })).then(function (distant) {
        D = fusion(distant, local);
        appliquer(); chargerAccompagnement(); if (T2 || SUIVI) chargerPD();
        if (CF && !CF.accord(user)) { etat('Gardé sur cet appareil, en attente de ton accord'); CF.demander(document.getElementById('mc-compte'), sb, function () { user.user_metadata = Object.assign({}, user.user_metadata, { coffre_accord: new Date().toISOString() }); sauver(); }); }
        else { etat('Enregistré et chiffré dans ton espace'); if (local && Object.keys(local.v || {}).length) sauver(); }
      });
      sb.from('resultats').select('titre,donnees,cree_le').eq('outil', 'meteo').order('cree_le', { ascending: false }).limit(24).then(function (x) {
        historique = (x && x.data) || [];
        if (PAGES[courante].id === 'cloture') comparer();
      });
    }).catch(function () { D = local || D; appliquer(); invitation(); chargerAccompagnement(); if (T2 || SUIVI) chargerPD(); });
  }
  /* Sans compte : le texte décrit exactement la règle de site.js (window.GenesoliaDonnees) */
  function invitation() {
    var z = document.getElementById('mc-compte'); if (!z) return;
    etat('Gardé jusqu’à la fermeture du navigateur');
    z.hidden = false;
    z.innerHTML = '<p><b>Sans compte, tes réponses restent dans ce navigateur tant qu’il est ouvert. Quand tu le fermes, elles sont effacées, comme sur les autres sites.</b> Crée ton espace gratuit pour garder ' + (MODULE ? 'ton module et tes réponses' : 'ton carnet, ta météo et ta lettre de dans un an') + ', et les retrouver sur tous tes appareils.</p><a class="btn btn-plein" href="login.html?inscription&amp;retour=' + esc(PAGE_URL) + '">Créer mon espace</a> <a href="login.html?retour=' + esc(PAGE_URL) + '">J’ai déjà un compte</a>';
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
    var fin = DEBUT_ET ? bornesSem(3)[1] : new Date(an, mo + 1, 0), apresFin = plusJ(fin, 1);
    if (fin < demain) fin = demain;
    function d8(d) { return d.getFullYear() + ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2); }
    function txt(s) { return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n'); }
    function plier(l) { var r = [], s = l; while (s.length > 70) { r.push(s.slice(0, 70)); s = ' ' + s.slice(70); } r.push(s); return r.join('\r\n'); }
    function brut(s) { return String(s).replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); }
    var base = 'https://genesolia.fr/' + PAGE_URL + (DEBUT_ET ? '?etape=' + ET.n : '?mois=' + C.mois), stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    var ev = C.semaines.map(function (s, i) {
      if (Array.isArray(s)) s = { titre: s[0], texte: s[1] };
      var d = dateSemaine(i), suite = i + 1 < C.semaines.length ? dateSemaine(i + 1) : apresFin;
      if (suite <= demain) return null;
      if (d < demain) d = demain;
      if (d >= fin) return null;
      return { d: d, titre: (SUIVI ? 'Mon suivi' : 'Carnet du Cercle') + ' · Semaine ' + (i + 1) + ' : ' + s.titre, texte: brut(s.texte || s.intro || ''), url: base + (SUIVI ? '#' + s.cle : '#semaine-' + (i + 1)) };
    }).filter(Boolean);
    ev.push({ d: fin, titre: (SUIVI ? 'Mon suivi' : 'Carnet du Cercle') + (DEBUT_ET ? ' · Mon bilan de l’étape ' + ET.n : ' · Mon bilan ' + de(NOM_MOIS)), texte: 'Prends dix minutes pour ton bilan du mois.', url: base + (SUIVI ? '#bilan' : '#cloture') });
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
  /* ───── Rester dans son livre : les liens vers une autre page s'ouvrent dans un nouvel onglet ─────
     Restent dans l'onglet : les ancres de la page, la connexion (elle revient au livre) et le même livre (une autre étape). */
  racine.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]'); if (!a || a.hasAttribute('download')) return;
    /* dans l'appli installée, tout reste dans l'appli (un nouvel onglet ferait sortir vers le navigateur, sans retour) ; dans un navigateur, même dans « Mon Cercle », les autres pages s'ouvrent dans un nouvel onglet */
    var installee = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
    if (installee) { try { if (new URL(a.href, location.href).origin === location.origin) a.removeAttribute('target'); } catch (x) {} return; }
    if (a.target) return;
    var h = a.getAttribute('href') || '';
    if (!h || h.charAt(0) === '#' || /^(mailto:|tel:|javascript:)/i.test(h)) return;
    var u; try { u = new URL(h, location.href); } catch (x) { return; }
    if (u.origin === location.origin && (/\/login\.html$/.test(u.pathname) || u.pathname === location.pathname)) return;
    a.target = '_blank'; a.rel = 'noopener';
  }, true);
  /* ───── Avant d'écrire : où vont les réponses (une seule fois, « OK, j'ai compris ») ───── */
  var CLE_AVIS = 'genesolia-avis-ecriture';
  function avisVu() { try { return localStorage.getItem(CLE_AVIS) === '1'; } catch (x) { return false; } }
  function avisEcriture(champ) {
    if (avisVu() || document.getElementById('mc-avis-ecriture')) return;
    var f = document.createElement('div');
    f.className = 'appli-fenetre'; f.id = 'mc-avis-ecriture'; f.setAttribute('role', 'dialog'); f.setAttribute('aria-modal', 'true'); f.setAttribute('aria-labelledby', 'mc-avis-t');
    f.innerHTML = '<div class="appli-carte mc-avis-carte"><h2 id="mc-avis-t">Avant d’écrire</h2>' +
      '<p><b>Tes réponses s’enregistrent toutes seules</b>, au fil de ce que tu écris.</p>' +
      '<p>Si tu es connecté·e, elles sont gardées dans ton espace, chiffrées. <b>L’équipe Genesolia ne les lit jamais.</b> La première fois, on te demande ton accord pour les garder.</p>' +
      '<p>Sans compte, elles restent seulement sur cet appareil et s’effacent quand tu fermes la page.</p>' +
      '<p>Tu préfères le papier ? Tu peux aussi imprimer ton livre et écrire à la main.</p>' +
      '<p><button type="button" class="btn btn-plein" data-avis-ok>OK, j’ai compris</button></p></div>';
    document.body.appendChild(f);
    var ok = f.querySelector('[data-avis-ok]'); ok.focus();
    ok.addEventListener('click', function () { try { localStorage.setItem(CLE_AVIS, '1'); } catch (x) {} f.remove(); if (champ && champ.focus) champ.focus(); });
  }
  racine.addEventListener('focusin', function (e) {
    var t = e.target; if (!t || !t.matches || !t.matches('textarea, input[type=text], input:not([type])')) return;
    if (!avisVu()) avisEcriture(t);
  });
  window.GenesoliaCarnet = { aller: aller, preparerImpression: preparerImpression, finImpression: finImpression };

  function demarrer() { construire(); tonMois(); majSemainesMaya(); charger(); }
  /* Le suivi vérifie d'abord l'accès au Cercle (semaines 1 à 3 offertes, la semaine 4, la méditation et le bilan pour les membres) */
  /* Formation : les modules s'ouvrent au fil de l'abonnement (formation.js, champ mois : un module par mois, 1 à 8 ; un module ouvert le reste), en commençant toujours par le module 1 */
  function moduleOuvert(m) {
    var mo = ((FORM.modules || []).filter(function (x) { return x.n === C.module; })[0] || {}).mois || 1;
    if (!m || mo <= 1 || !window.GenesoliaAcces || !window.GenesoliaAcces.etape) return Promise.resolve(m);
    return window.GenesoliaAcces.etape().then(function (e) {
      if (!e || e.admin || e.mois >= mo) return m;
      var d = e.debut ? new Date(e.debut + 'T12:00:00') : new Date(); d.setMonth(d.getMonth() + mo - e.mois);
      VERROU = { etape: mo, date: d.getDate() + (d.getDate() === 1 ? 'er' : '') + ' ' + ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'][d.getMonth()] };
      return false;
    }, function () { return m; });
  }
  if (MODULE && C.offert) { membre = true; demarrer(); }
  else if (MODULE && window.GenesoliaAcces && window.GenesoliaAcces.membre) window.GenesoliaAcces.membre().then(moduleOuvert).then(function (m) { membre = !!m; demarrer(); }, demarrer);
  else if (SUIVI && window.GenesoliaAcces && window.GenesoliaAcces.membre) window.GenesoliaAcces.membre().then(function (m) { membre = !!m; demarrer(); }, demarrer);
  else { membre = true; demarrer(); }
})();
