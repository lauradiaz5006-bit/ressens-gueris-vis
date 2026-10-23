/* Genesolia · l'arbre familial sur téléphone (genosociogramme.html, body.mobile-arbre).
   Comme les applis de généalogie : jamais tout l'arbre, une personne au centre avec ses parents au-dessus,
   son conjoint à côté, ses frères et sœurs et ses enfants en dessous. On touche quelqu'un, il passe au centre.
   Démarrage : un questionnaire guidé (une question par écran) au lieu du tutoriel.
   Tout passe par window.GenoArbre (même arbre, même sauvegarde que sur ordinateur). Rien ne change sur ordinateur. */
(function () {
  'use strict';
  if (!document.body.classList.contains('mobile-arbre')) return;
  var G = window.GenoArbre; if (!G || !G.importer || !G.etat) return;

  var CLE_CENTRE = 'geno-mobile-centre';
  var racine = document.createElement('section');
  racine.id = 'mt'; racine.setAttribute('aria-label', 'Ton arbre familial');
  var hd = document.querySelector('header[data-entete]');
  if (hd) hd.after(racine); else document.body.prepend(racine);
  document.body.classList.add('mt-pret');

  var onglet = 'arbre', centre = null, questionnaire = null, passerelle = false;
  try { centre = sessionStorage.getItem(CLE_CENTRE); } catch (e) {}

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function E() { return G.etat(); }
  function annee(d) { var m = String(d || '').match(/(\d{4})/); return m ? +m[1] : null; }
  function dates(p) { var b = annee(p.naiss), d = annee(p.deces); if (b && d) return b + ' – ' + d; if (b && p.decede) return b + ' – ?'; if (b) return (p.sex === 'f' ? 'née en ' : p.sex === 'm' ? 'né en ' : 'naissance ') + b; if (d) return '† ' + d; return ''; }
  function nom(p) { return ((p.prenom || '') + ' ' + (p.nom || '')).trim() || 'Sans prénom'; }
  /* 14/03/1985, 14 03 1985, 1985 → 1985-03-14 ou 1985 ; vide → '' ; illisible → null */
  function lireDate(v) {
    v = String(v || '').trim(); if (!v) return '';
    var m, max = new Date().getFullYear() + 1;
    if ((m = v.match(/^(\d{1,2})[\/.\- ](\d{1,2})[\/.\- ](\d{4})$/))) { var t = new Date(+m[3], +m[2] - 1, +m[1]); return (+m[3] >= 1500 && +m[3] <= max && t.getMonth() === +m[2] - 1 && t.getDate() === +m[1]) ? m[3] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[1]).slice(-2) : null; }
    if ((m = v.match(/^(?:vers\s+)?(\d{4})$/i))) return (+m[1] >= 1500 && +m[1] <= max) ? m[1] : null;
    return null;
  }
  function moiId(e) { return Object.keys(e.people).find(function (id) { return e.people[id].role === 'moi'; }) || null; }
  function parentsDe(e, id) { return e.rels.filter(function (r) { return r.type === 'parent' && r.to === id && e.people[r.from]; }).map(function (r) { return r.from; }); }
  function enfantsDe(e, id) { return e.rels.filter(function (r) { return r.type === 'parent' && r.from === id && e.people[r.to]; }).map(function (r) { return r.to; }); }
  function conjoints(e, id) { return e.rels.filter(function (r) { return r.type === 'couple' && (r.from === id || r.to === id); }).map(function (r) { return r.from === id ? r.to : r.from; }).filter(function (x) { return e.people[x]; }); }
  function fratrie(e, id) {
    var res = {};
    parentsDe(e, id).forEach(function (p) { enfantsDe(e, p).forEach(function (c) { if (c !== id) res[c] = 1; }); });
    e.rels.forEach(function (r) { if (r.type === 'fratrie') { if (r.from === id && e.people[r.to]) res[r.to] = 1; if (r.to === id && e.people[r.from]) res[r.from] = 1; } });
    return Object.keys(res);
  }
  /* Dossier client·e du cabinet : la praticienne lit « sa mère », « son père », pas « ta mère » */
  function CLI() { return !!(G.dossierClient && G.dossierClient()); }
  function lien(e, id) { var l = lienBrut(e, id); if (!CLI() || !l) return l; return l === 'Toi' ? 'Client·e' : l.replace(/^Ta /, 'Sa ').replace(/^Ton /, 'Son '); }
  /* Le lien avec « toi », en mots simples */
  function lienBrut(e, id) {
    var m = moiId(e); if (!m) return ''; if (id === m) return 'Toi';
    var p = e.people[id], f = p.sex === 'f', ps = parentsDe(e, m);
    if (ps.indexOf(id) >= 0) return f ? 'Ta mère' : p.sex === 'm' ? 'Ton père' : 'Ton parent';
    for (var i = 0; i < ps.length; i++) if (parentsDe(e, ps[i]).indexOf(id) >= 0) { var cote = e.people[ps[i]].sex === 'f' ? ' maternel' : e.people[ps[i]].sex === 'm' ? ' paternel' : ''; return (f ? 'Ta grand-mère' : p.sex === 'm' ? 'Ton grand-père' : 'Ton grand-parent') + (cote ? (f ? cote + 'le' : cote) : ''); }
    for (var j = 0; j < ps.length; j++) { var gps = parentsDe(e, ps[j]); for (var k = 0; k < gps.length; k++) if (parentsDe(e, gps[k]).indexOf(id) >= 0) return f ? 'Ton arrière-grand-mère' : 'Ton arrière-grand-père'; }
    if (conjoints(e, m).indexOf(id) >= 0) return f ? 'Ta conjointe' : 'Ton conjoint';
    if (enfantsDe(e, m).indexOf(id) >= 0) return f ? 'Ta fille' : p.sex === 'm' ? 'Ton fils' : 'Ton enfant';
    if (fratrie(e, m).indexOf(id) >= 0) return f ? 'Ta sœur' : p.sex === 'm' ? 'Ton frère' : 'Ta fratrie';
    for (var n = 0; n < ps.length; n++) if (fratrie(e, ps[n]).indexOf(id) >= 0) return f ? 'Ta tante' : p.sex === 'm' ? 'Ton oncle' : '';
    return '';
  }
  function symbole(p, petit) { var c = p.sex === 'f' ? 'mt-f' : p.sex === 'm' ? 'mt-m' : 'mt-u'; return '<span class="mt-sym ' + c + (p.role === 'moi' ? ' mt-moi' : '') + (p.deces || p.decede ? ' mt-dcd' : '') + (petit ? ' mt-petit' : '') + '" aria-hidden="true"></span>'; }
  function carte(e, id, cls) {
    var p = e.people[id], l = lien(e, id);
    return '<button type="button" class="mt-carte ' + (cls || '') + '" data-centre="' + esc(id) + '">' + symbole(p, cls !== 'mt-centre') +
      '<span class="mt-txt"><b>' + esc(nom(p)) + '</b>' + (l && l !== 'Toi' ? '<small>' + esc(l) + '</small>' : '') + (dates(p) ? '<small>' + esc(dates(p)) + '</small>' : '') + '</span></button>';
  }
  function vide(type, texte) { return '<button type="button" class="mt-carte mt-vide" data-ajout="' + type + '"><span class="mt-plus" aria-hidden="true">+</span><span class="mt-txt"><b>' + esc(texte) + '</b></span></button>'; }

  /* ───────── Questionnaire guidé (arbre vide) ───────── */
  var Q = [
    { cle: 'toi', titre: 'Commençons <em>par toi</em>', aide: 'Ton prénom suffit pour démarrer. Tout se modifie ensuite.', champs: [['prenom', 'Ton prénom', 'text', true], ['sexe', '', 'sexe'], ['naiss', 'Ta date de naissance (ou l’année)', 'date']] },
    { cle: 'mere', titre: 'Ta <em>mère</em>', aide: 'Tu ne sais pas ? Passe : les cases vides sont aussi une information.', champs: [['prenom', 'Son prénom', 'text'], ['naiss', 'Née en… (l’année suffit)', 'date'], ['decede', 'Elle est décédée', 'case']] },
    { cle: 'pere', titre: 'Ton <em>père</em>', aide: 'Même s’il n’a pas été présent, il fait partie de ton histoire.', champs: [['prenom', 'Son prénom', 'text'], ['naiss', 'Né en… (l’année suffit)', 'date'], ['decede', 'Il est décédé', 'case']] },
    { cle: 'gpm', titre: 'Les parents de <em>ta mère</em>', aide: 'Tes grands-parents du côté de ta mère.', champs: [['gm', 'Prénom de ta grand-mère', 'text'], ['gp', 'Prénom de ton grand-père', 'text']], si: 'mere' },
    { cle: 'gpp', titre: 'Les parents de <em>ton père</em>', aide: 'Tes grands-parents du côté de ton père.', champs: [['gm', 'Prénom de ta grand-mère', 'text'], ['gp', 'Prénom de ton grand-père', 'text']], si: 'pere' }
  ];
  var QC = [
    { cle: 'toi', titre: 'Commençons <em>par ton·ta client·e</em>', aide: 'Son prénom suffit pour démarrer. Tout se modifie ensuite.', champs: [['prenom', 'Son prénom', 'text', true], ['sexe', '', 'sexe'], ['naiss', 'Sa date de naissance (ou l’année)', 'date']] },
    { cle: 'mere', titre: 'Sa <em>mère</em>', aide: 'Ton·ta client·e ne sait pas ? Passe : les cases vides sont aussi une information.', champs: [['prenom', 'Son prénom', 'text'], ['naiss', 'Née en… (l’année suffit)', 'date'], ['decede', 'Elle est décédée', 'case']] },
    { cle: 'pere', titre: 'Son <em>père</em>', aide: 'Même s’il n’a pas été présent, il fait partie de son histoire.', champs: [['prenom', 'Son prénom', 'text'], ['naiss', 'Né en… (l’année suffit)', 'date'], ['decede', 'Il est décédé', 'case']] },
    { cle: 'gpm', titre: 'Les parents de <em>sa mère</em>', aide: 'Ses grands-parents du côté de sa mère.', champs: [['gm', 'Prénom de sa grand-mère', 'text'], ['gp', 'Prénom de son grand-père', 'text']], si: 'mere' },
    { cle: 'gpp', titre: 'Les parents de <em>son père</em>', aide: 'Ses grands-parents du côté de son père.', champs: [['gm', 'Prénom de sa grand-mère', 'text'], ['gp', 'Prénom de son grand-père', 'text']], si: 'pere' }
  ];
  function etapesActives() { return (CLI() ? QC : Q).filter(function (q) { var r = questionnaire.rep[q.si]; return !q.si || r === undefined || !!(r && r.prenom); }); }
  /* Premier écran : une porte principale (les prénoms, 2 min) et le fil d'or en lien secondaire ; ?porte=fil-d-or inverse l'ordre (liens publiés sur les blessures, l'amour…) */
  var FIL = new URLSearchParams(location.search).get('porte') === 'fil-d-or';
  function afficherAccueil() {
    if (CLI()) {
      racine.innerHTML = '<div class="mt-q mt-accueil"><span class="mt-etiq">Dossier client·e</span><h1>L’arbre de ton·ta client·e <em>commence ici</em></h1>' +
        '<p class="mt-aide">Ton·ta client·e, ses parents, ses grands-parents : quelques prénoms suffisent, une question à la fois.</p>' +
        '<div class="mt-portes"><button type="button" class="btn btn-plein mt-porte" data-q="commencer">Commencer l’arbre · 2 min</button></div>' +
        '<p class="mt-discret"><a href="praticien.html">Revenir à mon cabinet</a> · <a href="genosociogramme.html?dessin">Je préfère le dessin complet</a></p></div>';
      racine.querySelector('[data-q="commencer"]').addEventListener('click', function () { questionnaire.i = 0; afficherQuestion(); });
      return;
    }
    var prenoms = '<button type="button" class="btn ' + (FIL ? 'btn-trait' : 'btn-plein') + ' mt-porte" data-q="commencer">Commencer mon arbre · 2 min</button>';
    var fil = FIL ? '<a class="btn btn-plein mt-porte" href="fil-d-or.html">Commencer par ce que je ressens · le fil d’or</a>' : '<a class="mt-lien-fil" href="fil-d-or.html">Ou commence par ce que tu ressens : <b>le fil d’or</b></a>';
    racine.innerHTML = '<div class="mt-q mt-accueil"><span class="mt-etiq">Ton arbre familial · gratuit</span><h1>Ce qui se répète dans ta famille <em>commence ici</em></h1>' +
      '<p class="mt-aide">' + (FIL ? 'Pars des moments qui t’ont marquée et de ce que ta lignée a ressenti : ton arbre se dessine à partir de là.' : 'Toi, tes parents, tes grands-parents : quelques prénoms suffisent, une question à la fois.') + '</p>' +
      '<div class="mt-portes">' + (FIL ? fil + prenoms : prenoms + fil) + '</div>' +
      '<p class="mt-discret">Sans inscription pour commencer. <a href="genosociogramme.html?dessin">Je préfère le dessin complet</a></p></div>';
    racine.querySelector('[data-q="commencer"]').addEventListener('click', function () { questionnaire.i = 0; afficherQuestion(); });
  }
  function afficherQuestion() {
    if (questionnaire.i < 0) { afficherAccueil(); return; }
    var liste = etapesActives(), q = liste[questionnaire.i], r = questionnaire.rep[q.cle] || {};
    var h = '<div class="mt-q"><div class="mt-q-haut"><span class="mt-etiq">' + (CLI() ? 'Dossier client·e' : 'Ton arbre') + ' · question ' + (questionnaire.i + 1) + '</span>' +
      '<div class="mt-barre" aria-hidden="true"><i style="width:' + Math.round((questionnaire.i + 1) / liste.length * 100) + '%"></i></div></div>' +
      '<h1>' + q.titre + '</h1><p class="mt-aide">' + esc(q.aide) + '</p><form class="mt-form" novalidate>';
    q.champs.forEach(function (c) {
      var v = r[c[0]] || '';
      if (c[2] === 'sexe') h += '<div class="mt-choix" role="group" aria-label="' + (CLI() ? 'Ton·ta client·e est' : 'Tu es') + '"><button type="button" data-sexe="f" aria-pressed="' + (v === 'f') + '">Une femme</button><button type="button" data-sexe="m" aria-pressed="' + (v === 'm') + '">Un homme</button></div>';
      else if (c[2] === 'case') h += '<label class="mt-case"><input type="checkbox" name="' + c[0] + '"' + (v ? ' checked' : '') + '> ' + esc(c[1]) + '</label>';
      else h += '<label>' + esc(c[1]) + '<input name="' + c[0] + '" ' + (c[2] === 'date' ? 'class="date-saisie" inputmode="numeric" placeholder="14/03/1985 ou 1985"' : 'autocomplete="off" autocapitalize="words"') + ' value="' + esc(c[2] === 'date' && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v.split('-').reverse().join('/') : v) + '"></label>';
    });
    h += '<p class="mt-err" role="alert"></p><div class="mt-q-actions">' +
      '<button type="button" class="btn btn-trait" data-q="retour">Retour</button>' +
      (q.cle !== 'toi' ? '<button type="button" class="btn btn-trait" data-q="passer">Je ne sais pas</button>' : '') +
      '<button type="submit" class="btn btn-plein">' + (questionnaire.i === liste.length - 1 ? (CLI() ? 'Voir l’arbre' : 'Voir mon arbre') : 'Suivant') + '</button></div></form>' +
      (questionnaire.i === 0 ? '<p class="mt-discret">' + (CLI() ? 'L’arbre se garde dans ton cabinet.' : (G.connecte && G.connecte() ? 'Ton arbre se garde dans ton espace.' : 'Sans compte, ton arbre reste dans ce navigateur jusqu’à sa fermeture.')) + '</p>' : '') + '</div>';
    racine.innerHTML = h;
    var f = racine.querySelector('form'), sexe = r.sexe || '';
    racine.querySelectorAll('[data-sexe]').forEach(function (b) { b.addEventListener('click', function () { sexe = b.getAttribute('data-sexe'); racine.querySelectorAll('[data-sexe]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); }); });
    var premier = f.querySelector('input:not([type=checkbox])'); if (premier) setTimeout(function () { premier.focus(); }, 60);
    racine.querySelectorAll('[data-q]').forEach(function (b) { b.addEventListener('click', function () {
      if (b.getAttribute('data-q') === 'retour') { questionnaire.i--; afficherQuestion(); return; }
      questionnaire.rep[q.cle] = {}; avancer();
    }); });
    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var out = {}, err = f.querySelector('.mt-err'), ok = true;
      q.champs.forEach(function (c) {
        if (c[2] === 'sexe') { out.sexe = sexe; return; }
        var el = f.elements[c[0]]; if (!el) return;
        if (c[2] === 'case') { out[c[0]] = el.checked; return; }
        var v = el.value.trim();
        if (c[2] === 'date') { var d = lireDate(v); if (d === null) { err.textContent = 'Écris la date comme 14/03/1985, ou seulement l’année.'; el.focus(); ok = false; return; } v = d; }
        out[c[0]] = v;
      });
      if (!ok) return;
      if (q.cle === 'toi' && !out.prenom) { err.textContent = 'Écris ton prénom pour commencer.'; f.elements.prenom.focus(); return; }
      questionnaire.rep[q.cle] = out; avancer();
    });
  }
  function avancer() {
    var liste = etapesActives();
    if (questionnaire.i < liste.length - 1) { questionnaire.i++; afficherQuestion(); return; }
    construireDepuisQuestionnaire();
  }
  function construireDepuisQuestionnaire() {
    var R = questionnaire.rep, people = {}, rels = [];
    function pers(k, o) { people[k] = o; }
    pers('toi', { prenom: R.toi.prenom, sex: R.toi.sexe || 'u', naiss: R.toi.naiss || '' });
    [['mere', 'f'], ['pere', 'm']].forEach(function (x) {
      var r = R[x[0]]; if (!r || !r.prenom) return;
      pers(x[0], { prenom: r.prenom, sex: x[1], naiss: r.naiss || '', decede: !!r.decede });
      rels.push({ from: x[0], to: 'toi', type: 'parent' });
    });
    if (people.mere && people.pere) rels.push({ from: 'pere', to: 'mere', type: 'couple', statut: 'marie' });
    [['gpm', 'mere'], ['gpp', 'pere']].forEach(function (x) {
      var r = R[x[0]]; if (!r || !people[x[1]]) return;
      if (r.gm) { pers(x[0] + 'f', { prenom: r.gm, sex: 'f' }); rels.push({ from: x[0] + 'f', to: x[1], type: 'parent' }); }
      if (r.gp) { pers(x[0] + 'm', { prenom: r.gp, sex: 'm' }); rels.push({ from: x[0] + 'm', to: x[1], type: 'parent' }); }
      if (r.gm && r.gp) rels.push({ from: x[0] + 'm', to: x[0] + 'f', type: 'couple', statut: 'marie' });
    });
    questionnaire = null;
    G.importer({ people: people, rels: rels }, { moi: 'toi' });
    var e = E(); centre = moiId(e); garderCentre();
    passerelle = true; onglet = 'arbre'; rendre(); window.scrollTo(0, 0);
  }

  /* ───────── Vue centrée sur une personne ───────── */
  function garderCentre() { try { sessionStorage.setItem(CLE_CENTRE, centre || ''); } catch (e) {} }
  function vueArbre(e) {
    var ids = Object.keys(e.people);
    if (!centre || !e.people[centre]) centre = moiId(e) || ids[0];
    var c = e.people[centre], m = moiId(e), estMoi = centre === m, toi = estMoi && !CLI(), ton = toi ? 'ta' : 'sa', ton2 = toi ? 'ton' : 'son';
    var ps = parentsDe(e, centre), mere = ps.find(function (x) { return e.people[x].sex === 'f'; }), pere = ps.find(function (x) { return e.people[x].sex === 'm'; });
    ps.forEach(function (x) { if (x !== mere && x !== pere) { if (!mere) mere = x; else if (!pere) pere = x; } });
    var h = '';
    /* l'arbre de ce téléphone mis de côté à la connexion (ton espace avait déjà un arbre) : on peut le récupérer */
    var deCote = null; try { deCote = localStorage.getItem('geno4-avant-connexion'); } catch (x) {}
    var bAnn = document.getElementById('bt-annuler');
    if (deCote && bAnn && !bAnn.disabled) h += '<div class="mt-info"><p>Ton espace avait déjà un arbre : c’est lui qui s’affiche. L’arbre commencé sur ce téléphone a été mis de côté.</p><button type="button" class="btn btn-trait" data-recuperer>Reprendre l’arbre de ce téléphone</button></div>';
    if (!(G.connecte && G.connecte())) {
      var essaiOn = (window.GENESOLIA_ESSAI || {}).actif;
      h += '<div class="mt-info"><p><b>Garde ton arbre.</b> Sans compte, il reste seulement dans ce navigateur, jusqu’à sa fermeture. Crée ton espace gratuit pour le retrouver partout' + (essaiOn ? ', avec <b>30 jours d’analyses offerts</b>' : '') + '.</p><a class="btn btn-plein" href="login.html?inscription&amp;retour=genosociogramme.html">Créer mon espace gratuit</a></div>';
    }
    if (passerelle && !CLI()) h += '<div class="mt-passerelle"><p class="mt-etiq">Ton arbre a ' + (ids.length >= 5 ? '3 générations' : ids.length + ' personne' + (ids.length > 1 ? 's' : '')) + ' ✦</p><p>Maintenant, ajoute ce que ta lignée a vécu et ressenti.</p><a class="btn btn-plein" href="fil-d-or.html">Continuer avec le fil d’or</a><button type="button" class="mt-plus-details" data-passerelle>Plus tard</button></div>';
    if (!estMoi && m) h += '<button type="button" class="mt-retour" data-centre="' + esc(m) + '">← Revenir à ' + (CLI() ? 'ton·ta client·e' : 'toi') + '</button>';
    h += '<div class="mt-rang"><p class="mt-rang-t">' + (toi ? 'Tes parents' : 'Ses parents') + '</p><div class="mt-duo">' +
      (mere ? carte(e, mere) : vide('mere', 'Ajouter ' + ton + ' mère')) + (pere ? carte(e, pere) : vide('pere', 'Ajouter ' + ton2 + ' père')) + '</div></div>';
    h += '<div class="mt-lien" aria-hidden="true"></div>';
    h += '<div class="mt-coeur">' + carte(e, centre, 'mt-centre') +
      '<button type="button" class="btn btn-plein mt-fiche" data-fiche="' + esc(centre) + '">Compléter ' + (toi ? 'ma' : 'sa') + ' fiche</button></div>';
    /* l'arbre à encadrer, bien visible dès que l'arbre a trois personnes */
    if (!CLI() && ids.length >= 3 && document.getElementById('bt-encadrer')) h += '<div class="mt-encadre"><img src="assets/modeles/arbre-vierge-apercu.webp" width="84" height="59" alt="" loading="lazy"><div><p><b>Ton arbre encadré</b>Ta lignée sur un bel arbre doré, imprimée et livrée chez toi, ou à télécharger.</p><button type="button" class="btn btn-plein" data-clic="bt-encadrer">Voir mon arbre encadré' + (venteOuverte() ? ' · dès 45 €' : '') + '</button></div></div>';
    var cj = conjoints(e, centre);
    h += '<div class="mt-rang"><p class="mt-rang-t">' + (toi ? 'Ton couple' : 'Son couple') + '</p><div class="mt-ligne">' + cj.map(function (x) { return carte(e, x); }).join('') + vide('conjoint', cj.length ? 'Ajouter une autre union' : 'Ajouter ' + (toi ? 'ton' : 'son') + ' conjoint') + '</div></div>';
    var fr = fratrie(e, centre);
    h += '<div class="mt-rang"><p class="mt-rang-t">' + (toi ? 'Tes frères et sœurs' : 'Ses frères et sœurs') + '</p><div class="mt-ligne">' + fr.map(function (x) { return carte(e, x); }).join('') + vide('fratrie', 'Ajouter un frère ou une sœur') + '</div></div>';
    var en = enfantsDe(e, centre);
    h += '<div class="mt-rang"><p class="mt-rang-t">' + (toi ? 'Tes enfants' : 'Ses enfants') + '</p><div class="mt-ligne">' + en.map(function (x) { return carte(e, x); }).join('') + vide('enfant', 'Ajouter un enfant') + '</div></div>';
    h += '<p class="mt-discret">' + ids.length + ' personne' + (ids.length > 1 ? 's' : '') + ' dans ' + (CLI() ? 'cet arbre' : 'ton arbre') + ' · touche quelqu’un pour le mettre au centre.</p>';
    return h;
  }
  function vueReps() {
    var r = (G.repetitions && G.repetitions()) || [];
    if (!r.length) return '<div class="mt-vide-reps"><h2>Ce qui se répète</h2><p>Rien n’apparaît encore. Les répétitions se révèlent quand tu ajoutes des <b>dates de naissance et de décès</b>, des <b>métiers</b> et des <b>événements</b> (deuils, départs, secrets…) dans les fiches.</p><button type="button" class="btn btn-plein" data-aller="arbre">Compléter mon arbre</button></div>';
    return '<h2 class="mt-h2">Ce qui se répète <span>' + r.length + '</span></h2>' + r.map(function (x) { return '<article class="mt-rep' + (x.fort ? ' mt-fort' : '') + '"><h3>' + esc(x.label) + '</h3><p>' + esc(x.desc) + '</p></article>'; }).join('') +
      (G.imprimerReps ? '<button type="button" class="btn btn-trait mt-reps-pdf" data-reps-pdf data-compte="la liste de ce qui se répète">Enregistrer la liste en PDF</button>' : '') + '<p class="mt-discret">Ce sont des pistes de lecture, pas des vérités sur ta famille.</p>';
  }
  function vueRapport(e) {
    var n = Object.keys(e.people).length;
    return '<div class="mt-vide-reps"><h2>' + (CLI() ? 'Le rapport' : 'Mon rapport') + '</h2><p>' + (CLI() ? 'L’arbre de ton·ta client·e et ses chiffres clés, chaque répétition expliquée, et les questions à poser à sa famille. ' : 'Ton arbre et tes chiffres clés, chaque répétition expliquée, et les questions à poser à ta famille. ') + (n < 3 ? 'Ajoute encore quelques personnes pour qu’il soit parlant.' : '') + '</p><button type="button" class="btn btn-plein" data-clic="bt-rapport">' + (CLI() ? 'Ouvrir le rapport' : 'Ouvrir mon rapport') + '</button></div>';
  }
  function rendre(focusCentre) {
    if (questionnaire) { if (questionnaire.i < 0 && questionnaire.cli !== CLI()) { questionnaire.cli = CLI(); afficherAccueil(); } return; }
    var e = E();
    if (!Object.keys(e.people).length) { questionnaire = { i: -1, rep: {} }; afficherQuestion(); return; }
    var nbR = ((G.repetitions && G.repetitions()) || []).length;
    var corps = onglet === 'reps' ? vueReps() : onglet === 'rapport' ? vueRapport(e) : vueArbre(e);
    racine.innerHTML = '<div class="mt-haut"><h1 class="mt-titre">' + (CLI() ? 'Dossier client·e' : 'Mon arbre familial') + '</h1><button type="button" class="mt-menu-bt" aria-haspopup="true" aria-expanded="false" aria-label="Plus d’options">•••</button></div>' +
      '<div class="mt-corps">' + corps + '</div>' +
      '<nav class="mt-nav" aria-label="Ton arbre"><button type="button" data-aller="arbre" aria-current="' + (onglet === 'arbre') + '">' + (CLI() ? 'L’arbre' : 'Mon arbre') + '</button><button type="button" data-aller="reps" aria-current="' + (onglet === 'reps') + '">Ce qui se répète' + (nbR ? ' <i>' + nbR + '</i>' : '') + '</button><button type="button" data-aller="rapport" aria-current="' + (onglet === 'rapport') + '">' + (CLI() ? 'Le rapport' : 'Mon rapport') + '</button></nav>';
    if (focusCentre) { var cc = racine.querySelector('.mt-centre'); if (cc) cc.scrollIntoView({ block: 'center' }); }
  }

  /* ───────── Ajouter une personne (fiche courte, ouverte par le bas) ───────── */
  var FEUILLE = { mere: ['Sa mère', 'f'], pere: ['Son père', 'm'], conjoint: ['Son conjoint ou sa conjointe', ''], fratrie: ['Un frère ou une sœur', ''], enfant: ['Un enfant', ''] };
  function feuilleAjout(type) {
    var e = E(), estMoi = centre === moiId(e), f = FEUILLE[type], titre = f[0];
    if (estMoi && !CLI()) titre = { mere: 'Ta mère', pere: 'Ton père', conjoint: 'Ton conjoint ou ta conjointe', fratrie: 'Ton frère ou ta sœur', enfant: 'Ton enfant' }[type];
    else titre += ' · ' + nom(e.people[centre]);
    var fond = document.createElement('div'); fond.className = 'mt-fond'; fond.setAttribute('role', 'dialog'); fond.setAttribute('aria-modal', 'true'); fond.setAttribute('aria-label', titre);
    fond.innerHTML = '<form class="mt-feuille" novalidate><span class="mt-poignee" aria-hidden="true"></span><h2>' + esc(titre) + '</h2>' +
      '<label>Prénom<input name="prenom" autocomplete="off" autocapitalize="words"></label>' +
      (f[1] ? '' : '<div class="mt-choix" role="group" aria-label="Sexe"><button type="button" data-sexe="f" aria-pressed="false">Femme</button><button type="button" data-sexe="m" aria-pressed="false">Homme</button></div>') +
      '<label>Naissance <small>(la date ou l’année)</small><input name="naiss" class="date-saisie" inputmode="numeric" placeholder="14/03/1985 ou 1985"></label>' +
      '<label class="mt-case"><input type="checkbox" name="decede"> Décédé·e</label>' +
      '<label class="mt-deces" hidden>Décès <small>(la date ou l’année)</small><input name="deces" class="date-saisie" inputmode="numeric" placeholder="02/11/2010 ou 2010"></label>' +
      '<p class="mt-err" role="alert"></p>' +
      '<div class="mt-q-actions"><button type="button" class="btn btn-trait" data-fermer>Annuler</button><button type="submit" class="btn btn-plein">Ajouter</button></div>' +
      '<button type="button" class="mt-plus-details" data-details>Ajouter et compléter tous les détails</button></form>';
    document.body.appendChild(fond); document.body.classList.add('mt-feuille-ouverte');
    var form = fond.querySelector('form'), sexe = f[1];
    setTimeout(function () { form.elements.prenom.focus(); }, 80);
    fond.querySelectorAll('[data-sexe]').forEach(function (b) { b.addEventListener('click', function () { sexe = b.getAttribute('data-sexe'); fond.querySelectorAll('[data-sexe]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); }); });
    form.elements.decede.addEventListener('change', function () { fond.querySelector('.mt-deces').hidden = !form.elements.decede.checked; });
    function fermer() { fond.remove(); document.body.classList.remove('mt-feuille-ouverte'); }
    fond.addEventListener('click', function (ev) { if (ev.target === fond || ev.target.closest('[data-fermer]')) fermer(); });
    document.addEventListener('keydown', function esc2(ev) { if (ev.key === 'Escape') { fermer(); document.removeEventListener('keydown', esc2); } });
    function valider(details) {
      var err = form.querySelector('.mt-err'), pr = form.elements.prenom.value.trim(), n = lireDate(form.elements.naiss.value), d = lireDate(form.elements.deces.value);
      if (n === null) { err.textContent = 'Écris la naissance comme 14/03/1985, ou seulement l’année.'; return; }
      if (d === null) { err.textContent = 'Écris le décès comme 02/11/2010, ou seulement l’année.'; return; }
      if (!pr && !details) { err.textContent = 'Écris au moins un prénom (ou « Inconnu »).'; return; }
      var avant = Object.keys(E().people), people = { c: {}, n: { prenom: pr, sex: sexe || 'u', naiss: n || '', deces: d || '', decede: form.elements.decede.checked } }, rels = [], memes = { c: centre };
      var e2 = E();
      if (type === 'mere' || type === 'pere') {
        rels.push({ from: 'n', to: 'c', type: 'parent' });
        var autre = parentsDe(e2, centre)[0];
        if (autre) { people.a = {}; memes.a = autre; rels.push({ from: 'a', to: 'n', type: 'couple', statut: 'marie' }); }
      } else if (type === 'conjoint') rels.push({ from: 'c', to: 'n', type: 'couple', statut: 'marie' });
      else if (type === 'enfant') {
        rels.push({ from: 'c', to: 'n', type: 'parent' });
        var cj = conjoints(e2, centre); if (cj.length === 1) { people.a = {}; memes.a = cj[0]; rels.push({ from: 'a', to: 'n', type: 'parent' }); }
      } else if (type === 'fratrie') {
        var ps = parentsDe(e2, centre);
        if (ps.length) ps.forEach(function (p, i) { people['p' + i] = {}; memes['p' + i] = p; rels.push({ from: 'p' + i, to: 'n', type: 'parent' }); });
        else rels.push({ from: 'c', to: 'n', type: 'fratrie' });
      }
      G.importer({ people: people, rels: rels }, { memes: memes });
      fermer();
      var nouveau = Object.keys(E().people).filter(function (k) { return avant.indexOf(k) < 0; })[0];
      rendre();
      if (details && nouveau) G.fiche(nouveau);
    }
    form.addEventListener('submit', function (ev) { ev.preventDefault(); valider(false); });
    fond.querySelector('[data-details]').addEventListener('click', function () { valider(true); });
  }

  function venteOuverte() { var I = window.GENESOLIA_IMPRESSION || {}; return !I.ouverture || new Date() >= new Date(I.ouverture + 'T00:00:00') || /test-impression/.test(location.search); }
  /* ───────── Menu « ••• » : les outils de l'ordinateur, rangés ───────── */
  var MENU = [['bt-numero', 'Numérologie de ma famille'], ['bt-astro', 'Astrologie de ma famille'], ['dessin', 'Voir tout l’arbre'], ['bt-image', 'Télécharger l’image'], ['bt-imprimer', 'Imprimer'], ['bt-importer-barre', 'Importer un arbre (PDF ou GEDCOM)'], ['bt-sauve', 'Sauvegardes'], ['bt-encadrer', 'Mon arbre encadré'], ['bt-tuto', 'Comment ça marche ?']];
  function ouvrirMenu(bt) {
    var ex = document.querySelector('.mt-menu'); if (ex) { ex.remove(); bt.setAttribute('aria-expanded', 'false'); return; }
    var m = document.createElement('div'); m.className = 'mt-menu'; m.setAttribute('role', 'menu');
    m.innerHTML = MENU.filter(function (x) { return x[0] === 'dessin' || document.getElementById(x[0]); }).map(function (x) { return '<button type="button" role="menuitem" data-m="' + x[0] + '">' + esc(x[1]) + '</button>'; }).join('');
    racine.appendChild(m); bt.setAttribute('aria-expanded', 'true');
    m.addEventListener('click', function (ev) {
      var b = ev.target.closest('[data-m]'); if (!b) return; m.remove(); bt.setAttribute('aria-expanded', 'false');
      var k = b.getAttribute('data-m');
      if (k === 'dessin') { voirDessin(); return; }
      var cible = document.getElementById(k); if (cible) cible.click();
    });
  }
  function voirDessin() {
    document.body.classList.add('mt-dessin');
    var r = document.createElement('button'); r.type = 'button'; r.className = 'mt-revenir btn btn-plein'; r.textContent = '← Revenir à ma vue';
    document.body.appendChild(r);
    var c = document.getElementById('bt-centrer'); if (c) setTimeout(function () { c.click(); }, 60);
    r.addEventListener('click', function () { document.body.classList.remove('mt-dessin'); r.remove(); rendre(); });
  }

  /* ───────── Événements ───────── */
  racine.addEventListener('click', function (ev) {
    var t;
    if ((t = ev.target.closest('[data-centre]'))) { var id = t.getAttribute('data-centre'); if (id === centre) { G.fiche(id); return; } centre = id; garderCentre(); rendre(); window.scrollTo(0, 0); return; }
    if ((t = ev.target.closest('[data-ajout]'))) { feuilleAjout(t.getAttribute('data-ajout')); return; }
    if ((t = ev.target.closest('[data-reps-pdf]'))) { G.imprimerReps(t); return; }
    if ((t = ev.target.closest('[data-fiche]'))) { G.fiche(t.getAttribute('data-fiche')); return; }
    if ((t = ev.target.closest('[data-aller]'))) { onglet = t.getAttribute('data-aller'); rendre(); window.scrollTo(0, 0); return; }
    if ((t = ev.target.closest('[data-clic]'))) { var b = document.getElementById(t.getAttribute('data-clic')); if (b) b.click(); return; }
    if ((t = ev.target.closest('.mt-menu-bt'))) { ouvrirMenu(t); return; }
    if ((t = ev.target.closest('[data-passerelle]'))) { passerelle = false; rendre(); return; }
    if ((t = ev.target.closest('[data-recuperer]'))) { var ba = document.getElementById('bt-annuler'); if (ba) ba.click(); try { localStorage.removeItem('geno4-avant-connexion'); } catch (x) {} rendre(); return; }
  });
  document.addEventListener('geno-change', function () {
    /* arbre arrivé depuis ton espace pendant la 1re question : on montre l'arbre */
    if (questionnaire && questionnaire.i <= 0 && Object.keys(E().people).length) questionnaire = null;
    if (!document.body.classList.contains('mt-dessin') && !document.querySelector('.mt-fond')) rendre(); });
  rendre();
})();
