/* Genesolia · page génosociogramme : bouton « Mon arbre à encadrer ».
   Aperçu à l'écran (filigrane « Aperçu » tant que le produit est payant et non acheté),
   téléchargement en image haute définition ou en PDF à imprimer. Réglage du prix : assets/site.js (arbreEncadrer). */
(function () {
  'use strict';
  var bt = document.getElementById('bt-encadrer'), fen = document.getElementById('fen-encadrer');
  if (!bt || !fen || !window.ArbreEncadrer || !window.GenoArbre) return;
  var corps = document.getElementById('fe-corps'), cache = {};
  var GEN = ['Une génération', 'Deux générations', 'Trois générations', 'Quatre générations', 'Cinq générations', 'Six générations', 'Sept générations', 'Huit générations', 'Neuf générations', 'Dix générations'];
  var choix = { depart: '', nbGen: 0, sousModifie: false, style: 'figuier', vue: 'affiche', freres: true };   /* réglages de la cliente dans la fenêtre */
  /* Styles à l'horizontale (Lignée, Médaillons) : autant de générations que la feuille en porte lisiblement (8 points au moins) */
  var capA4 = 4, capA3 = 5, CAP = { a4: 4, a3: 5, g50: 5, g70: 5 };
  /* Formats : A4, A3, puis les grands formats 50 × 70 et 70 × 100 cm (Lignée, Médaillons, Notre famille, Descendants, Éventail).
     classe(id) : a4 | a3 | g50 | g70 ; ECH : la taille du papier par rapport à l'A4 (le texte peut être plus petit en pixels, il reste à 8 points). */
  var ECH = { a4: false, a3: true, g50: 500 / 210, g70: 700 / 210 }, CLASSES = ['a4', 'a3', 'g50', 'g70'];
  function classe(id) { return /^g70/.test(id) ? 'g70' : /^g50/.test(id) ? 'g50' : /^a3/.test(id) ? 'a3' : 'a4'; }
  function grandsFormats() { return (lig() || desc()) && !grand(); }
  function ev(st) { return (st || choix.style) === 'eventail'; }   /* « Éventail » : les ancêtres en demi-cercle, toi au centre */
  /* Trois sortes d'arbres, chacune avec ses styles (l'identifiant du style dit aussi la sorte : desc_…, famille_…) */
  var TYPES = {
    ancetres: [['grand', 'Grand arbre'], ['figuier', 'Figuier'], ['dore', 'Arbre doré'], ['medaillons', 'Médaillons'], ['lignee', 'Lignée'], ['eventail', 'Éventail']],
    descendants: [['descendants', 'Lignée'], ['desc_medaillons', 'Médaillons'], ['desc_dore', 'Arbre doré'], ['desc_eventail', 'Éventail']],
    famille: [['famille', 'Lignée'], ['famille_medaillons', 'Médaillons'], ['famille_eventail', 'Éventail'], ['famille_lumiere', 'En lumière']],
    lumiere: [['lumiere', 'Sphères de lumière']]
  };
  function lumiere(st) { return /lumiere$/.test(st || choix.style); }   /* « Ma lignée en lumière » : à télécharger (pas encore chez l'imprimeur) */
  function typeDe(st) { st = st || choix.style; return st === 'lumiere' ? 'lumiere' : /^desc/.test(st) ? 'descendants' : /^famille/.test(st) ? 'famille' : 'ancetres'; }
  function themeD(st) { st = st || choix.style; return st === 'desc_medaillons' ? 'medaillons' : st === 'desc_dore' ? 'dore' : ''; }
  function capDesc(t, e) { return choix.style === 'desc_eventail' && window.ArbreEventailDesc ? window.ArbreEventailDesc.capacite(t, e) : window.ArbreDescendants.capacite(t, e, themeD()); }
  function capMax() { return grandsFormats() ? CAP.g70 : grand() ? 5 : capA3; }
  function classeMin(n) { for (var i = 0; i < CLASSES.length; i++) if (CAP[CLASSES[i]] >= n && (i < 2 || grandsFormats())) return CLASSES[i]; return 'g70'; }
  /* lig() : les styles dessinés par la Lignée (et le Grand arbre, Descendants) ; paysage() : l'affiche est vraiment à l'horizontale.
     Lignée, Médaillons, Notre famille passent en portrait quand l'arbre est plus haut que large : il remplit mieux la feuille. */
  function lig(st) { return !!(window.ArbreEncadrer.paysage && window.ArbreEncadrer.paysage(st || choix.style)); }
  function paysage(st) { return lig(st) && !(typeof donnees !== 'undefined' && donnees && donnees.portrait && donnees.style === (st || choix.style)); }
  function motif() { return /medaillons$/.test(choix.style) ? 'medaillons' : ''; }
  function remplis(p, g, max) { return !p || g >= max ? 0 : 1 + remplis(p.pere, g + 1, max) + remplis(p.mere, g + 1, max); }
  /* « avec mes enfants » : pour le Grand arbre et les styles à l'horizontale */
  function avecEnfantsPossible() { return !desc() && !ev() && choix.style !== 'lumiere'; }   /* tous les modèles, sauf Descendants (où les enfants sont déjà l'arbre) */
  /* Titres proposés, quel que soit le modèle : « La famille X », « Notre famille »… ; le champ reste libre */
  function majTitres() {
    var z = document.getElementById('fe-titres'), champ = document.getElementById('fe-titre'); if (!z || !champ || !donnees) return;
    var l = [], L = lignee(choix.depart, 1), D = desc() ? descendants(choix.depart, 1) : null;
    function ajoute(t) { if (t && l.indexOf(t) < 0) l.push(t); }
    if (D) ajoute(D.titre);
    if (L && !desc()) ajoute(L.titre);
    if (D && D.moi && D.moi.nom) ajoute('La famille ' + String(D.moi.nom).trim().toLowerCase().replace(/(^|[\s\-'’])(\S)/g, function (m, a, b) { return a + b.toUpperCase(); }));
    if (famille() && L && L.titre !== 'Notre famille') ajoute(L.titre);
    ajoute('Notre famille'); ajoute('Notre arbre');
    z.innerHTML = l.map(function (t) { return '<button type="button" class="fe-titre-bt" data-titre="' + esc(t) + '" aria-pressed="' + (champ.value.trim() === t) + '">' + esc(t) + '</button>'; }).join('') + '<span class="fe-titres-aide">ou écris le tien</span>';
  }
  function majEnfants() {
    var l = document.getElementById('fe-enfants-l'); if (!l || !donnees) return;
    majTitres();
    l.hidden = !donnees.nbEnfants || !avecEnfantsPossible();
    var lc = document.getElementById('fe-conjoint-l'), ac = document.getElementById('fe-conjoint-aide');
    if (desc()) l.hidden = true;
    var lf = document.getElementById('fe-freres-l'); if (lf) lf.hidden = !donnees.nbFreres || ev() || choix.style === 'famille_eventail' || lumiere();
    var da = document.getElementById('fe-demis-aide'); if (da) { var peint = grand() || choix.style === 'figuier' || choix.style === 'dore' || ev(); da.hidden = !(donnees.nbDemis && peint && typeDe() === 'ancetres'); }   /* l'éventail : les ancêtres seulement */
    if (lc) { lc.hidden = !(donnees.aConjoint || donnees.aUnions) || !(avecEnfantsPossible() || desc()) || famille() || lumiere(); var tc = document.getElementById('fe-conjoint-t'), c0 = desc() ? descendants(choix.depart, 1) : lignee(choix.depart, 1);
      if (tc && c0 && c0.conjoint) tc.textContent = (donnees.departEstMoi ? 'Avec mon conjoint · ' : 'Avec son conjoint · ') + (c0.conjoint.prenom + ' ' + c0.conjoint.nom).trim();
      else if (tc && c0 && c0.unions) { var hs = c0.unions.every(function (u) { return u.sexe === 'm'; }), fs0 = c0.unions.every(function (u) { return u.sexe === 'f'; }), qui = hs ? 'les pères' : fs0 ? 'les mères' : 'l’autre parent';
        tc.textContent = (donnees.departEstMoi ? 'Avec ' + qui + ' de mes enfants' : 'Avec ' + qui + ' de ses enfants') + (c0.unions.length > 1 ? ' (' + c0.unions.length + ')' : '') + ' · ' + c0.unions.map(function (u) { return u.prenom; }).filter(Boolean).join(', ');
        if (!lig() || grand()) tc.textContent += ' — visibles sur Lignée et Médaillons'; } }
    var fa = document.getElementById('fe-famille-aide');
    if (fa) {
      var hc = famille() && donnees.couple && donnees.horsCouple && donnees.horsCouple.length;
      fa.hidden = !(famille() && (donnees.sansCouple || hc));
      fa.textContent = famille() && donnees.raisonFamille ? donnees.raisonFamille + ' n’est pas l’autre parent de tous tes enfants : « Notre famille » montre ta lignée et tous tes enfants, sans lui. (Pour l’ajouter, il faut qu’il soit noté comme parent de chacun.)' : hc ? (donnees.horsCouple.length > 1 ? donnees.horsCouple.slice(0, -1).join(', ') + ' et ' + donnees.horsCouple.slice(-1) + ' ne sont pas notés comme enfants de vous deux' : donnees.horsCouple[0] + ' n’est pas noté·e comme enfant de vous deux') + ' : « Notre famille » ne montre sous le couple que vos enfants communs. Pour tous tes enfants, choisis le Grand arbre, la Lignée ou les Médaillons.'
        : '« Notre famille » réunit ton couple et vos deux lignées. Ajoute ton conjoint dans l’arbre (lien « couple ») et ses parents : ils apparaîtront ici à côté de toi.';
    }
    if (ac) { ac.hidden = !(donnees.conjointRefus && (avecEnfantsPossible() || desc())) || famille(); ac.textContent = donnees.conjointRefus ? donnees.conjointRefus + ' n’est pas l’autre parent de tous les enfants : pour ne rien laisser croire de faux, il n’est pas ajouté à côté de toi.' : ''; }
    var t = document.getElementById('fe-enfants-t'); if (t) t.textContent = (famille() ? (donnees.departEstMoi ? 'Avec nos enfants' : 'Avec leurs enfants') : donnees.departEstMoi ? 'Avec mes enfants' : 'Avec ses enfants') + ' (' + donnees.nbEnfants + '), ' + (choix.style === 'famille_eventail' ? 'au centre' : 'au pied de l’arbre');
  }
  function grand() { return choix.style === 'grand'; }
  /* Périodes de cadeaux : le bon modèle est proposé d'office et mis en avant (dates du calendrier français, à peu près) */
  var SAISONS = [
    { du: '11-01', au: '12-24', nom: 'Noël', badge: 'Idée Noël', style: 'famille', texte: 'Pour Noël, offre « Notre famille » : votre couple, vos deux lignées et vos enfants réunis. Commande avant le 14 décembre pour le recevoir à temps (avant le 7 décembre en grand format).',
      autre: { style: 'descendants', texte: 'Pour Noël, offre « Descendants » à tes parents ou grands-parents : toute la famille qu’ils ont fondée. Commande avant le 14 décembre pour le recevoir à temps (avant le 7 décembre en grand format).' } },
    { du: '01-15', au: '02-14', nom: 'Saint-Valentin', badge: 'Saint-Valentin', style: 'famille', texte: 'Pour la Saint-Valentin : « Notre famille », vos deux histoires réunies sur un seul arbre.' },
    { du: '02-10', au: '03-08', nom: 'fête des grands-mères', badge: 'Fête des grands-mères', style: 'descendants', texte: 'Pour la fête des grands-mères : « Descendants », ses enfants et ses petits-enfants autour d’elle.' },
    { du: '05-01', au: '06-01', nom: 'fête des mères', badge: 'Fête des mères', style: 'descendants', texte: 'Pour la fête des mères : « Descendants », la famille qu’elle a fondée, ou « Notre famille ».' },
    { du: '06-02', au: '06-21', nom: 'fête des pères', badge: 'Fête des pères', style: 'descendants', texte: 'Pour la fête des pères : « Descendants », la famille qu’il a fondée.' }
  ];
  function saison() {
    var t = /saison=([\d-]+)/.exec(location.search), d = t ? t[1] : ('0' + (new Date().getMonth() + 1)).slice(-2) + '-' + ('0' + new Date().getDate()).slice(-2);   /* ?saison=12-01 pour essayer */
    return SAISONS.filter(function (x) { return d >= x.du && d <= x.au; })[0] || null;
  }
  /* le modèle de la saison n'est proposé que s'il a de quoi être beau : un couple noté (Notre famille), des petits-enfants (Descendants) */
  function saisonPossible(x) {
    if (!x) return false;
    if (x.style === 'famille') { var c = couple('', 4); return !!c; }
    if (x.style === 'descendants') {   /* une grand-mère (ou un grand-père) : la mère ou le père de « moi », s'il a des petits-enfants */
      var S0 = window.GenoArbre.etat(), P0 = S0.people || {}, r0 = S0.rels || [], m0 = Object.keys(P0).filter(function (id) { return P0[id].role === 'moi'; })[0];
      var par = m0 ? r0.filter(function (r) { return r.type === 'parent' && r.to === m0 && P0[r.from]; }).map(function (r) { return r.from; }).sort(function (a, b) { return (P0[b].sex === 'f') - (P0[a].sex === 'f'); }) : [];
      for (var i = 0; i < par.length; i++) { var d = descendants(par[i], 3); if (d && d.nb >= 3) { x.racine = par[i]; return true; } }
      var d2 = descendants('', 3); return !!(d2 && d2.nb >= 3);
    }
    return true;
  }
  /* une phrase par style, sous les boutons : ce que montre l'affiche */
  var DESCR = {
    famille: 'Ton couple, vos deux lignées côte à côte, et vos enfants au pied.',
    grand: 'Le grand arbre peint : toi au tronc, 5 générations d’ancêtres dans des médaillons dorés. En A3.',
    figuier: 'Un figuier peint à la main, tes ancêtres dans ses branches.',
    medaillons: 'Tes ancêtres dans des médaillons dorés, rangée par rangée.',
    lignee: 'L’arbre le plus complet : toutes tes générations, jusqu’aux plus anciennes.',
    dore: 'Un arbre doré dessiné sur papier crème, tes ancêtres sur ses branches.',
    eventail: 'L’arbre en éventail : toi au centre, la lignée de ton père à gauche, celle de ta mère à droite. Superbe en grand format, jusqu’à 9 générations.',
    descendants: 'Des étiquettes crème reliées par des traits dorés : la personne en haut, ses enfants, petits-enfants et arrière-petits-enfants en dessous.',
    desc_medaillons: 'Chaque descendant dans un médaillon doré, génération après génération.',
    desc_dore: 'Un arbre doré qui pousse : la personne au pied du tronc, ses enfants et petits-enfants dans les branches.',
    desc_eventail: 'L’éventail : la personne au centre, chaque branche de la famille dans sa couleur, jusqu’aux arrière-petits-enfants.',
    famille_medaillons: 'Votre couple et vos deux lignées dans des médaillons dorés, vos enfants au pied.',
    famille_eventail: 'L’éventail du couple : ta lignée à gauche, celle de ton conjoint à droite, vos enfants au centre.',
    famille_lumiere: 'Votre couple au-dessus de la Terre, un cœur de lumière entre vous, vos enfants dans la lumière de la Terre, et vos deux lignées qui s’élèvent vers le soleil, chacun dans sa sphère de lumière. Choisis le nombre de générations : juste vos parents, ou jusqu’aux plus anciens.',
    lumiere: 'Une colonne de lumière entre la Terre et le soleil : toi au-dessus de la Terre, chaque personne de ta lignée dans sa sphère de lumière, à sa place (les défunts dans une sphère nacrée, avec un halo de protection). Une image qui protège et met ta lignée en lumière, à télécharger.'
  };
  /* la sorte d'arbre : une phrase sous chaque choix */
  function typesPour(id) {
    var S = window.GenoArbre.etat(), P = S.people || {}, rels = S.rels || [], moi = P[id] && P[id].role === 'moi';
    var aParents = rels.some(function (r) { return r.type === 'parent' && r.to === id && P[r.from]; });
    var aEnfants = rels.some(function (r) { return r.type === 'parent' && r.from === id && P[r.to]; });
    var aCouple = rels.some(function (r) { return r.type === 'couple' && (r.from === id || r.to === id) && P[r.from === id ? r.to : r.from]; });
    return [
      { id: 'ancetres', nom: moi ? 'Mes ancêtres' : 'Ses ancêtres', aide: moi ? 'Toi, tes parents, tes grands-parents… en remontant' : 'Ses parents, ses grands-parents… en remontant', ok: aParents, non: 'Ajoute ses parents dans l’arbre' },
      { id: 'descendants', nom: moi ? 'Mes descendants' : 'Ses descendants', aide: 'Ses enfants, petits-enfants, arrière-petits-enfants', ok: aEnfants, non: 'Aucun enfant noté' },
      { id: 'famille', nom: moi ? 'Notre famille' : 'Son couple', aide: 'Le couple, ses deux lignées et leurs enfants', ok: aCouple, non: 'Aucun conjoint noté' },
      { id: 'lumiere', nom: moi ? 'Ma lignée en lumière' : 'Sa lignée en lumière', aide: 'Les ancêtres dans des sphères de lumière, entre terre et ciel', ok: aParents, non: 'Ajoute ses parents dans l’arbre' }
    ];
  }
  function famille(st) { return /^famille/.test(st || choix.style); }   /* « Notre famille » : le couple, ses deux lignées, leurs enfants */
  function desc(st) { return /^desc/.test(st || choix.style); }   /* « Descendants » : une personne (ou un couple), ses enfants, petits-enfants… */   /* « Grand arbre » : l'arbre peint, 5 générations, en A3 seulement */
  function formatChoisi() { var c = document.querySelector('#fe-imp-form input[name=format]:checked'); return c && !c.disabled ? c.value : (grand() ? 'a3' : 'a4'); }
  function a4Max() { return grand() ? 0 : lig() ? capA4 : 4; }

  function annee(d) { var m = String(d || '').match(/(\d{4})/); return m ? +m[1] : null; }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* L'arbre de la page devient une lignée : moi, mes parents, leurs parents, leurs parents */
  /* Personnes proposées comme point de départ : celles qui ont au moins un parent, de la plus jeune à la plus âgée */
  function departs() {
    var S = window.GenoArbre.etat(), P = S.people || {}, rels = S.rels || [];
    if (true) /* tout le monde qui a des parents ou des enfants : toi d'abord, puis du plus jeune au plus âgé */
      return Object.keys(P).filter(function (id) { return rels.some(function (r) { return r.type === 'parent' && (r.from === id || r.to === id) && P[r.from] && P[r.to]; }); })
        .sort(function (a, b) { return (P[b].role === 'moi') - (P[a].role === 'moi') || (annee(P[b].naiss) || 0) - (annee(P[a].naiss) || 0); })
        .map(function (id) { var p = P[id]; return { id: id, nom: ((p.prenom || '') + ' ' + (p.nom || '')).trim() || 'Sans prénom', an: annee(p.naiss), moi: p.role === 'moi' }; });
    if (desc()) /* descendants : celles qui ont des enfants, de la plus âgée à la plus jeune */
      return Object.keys(P).filter(function (id) { return rels.some(function (r) { return r.type === 'parent' && r.from === id && P[r.to]; }); })
        .sort(function (a, b) { return (annee(P[b].naiss) || 0) - (annee(P[a].naiss) || 0); })   /* les plus proches d'abord : toi, tes parents, tes grands-parents… */
        .map(function (id) { var p = P[id]; return { id: id, nom: ((p.prenom || '') + ' ' + (p.nom || '')).trim() || 'Sans prénom', an: annee(p.naiss), moi: p.role === 'moi' }; });
    return Object.keys(P).filter(function (id) { return rels.some(function (r) { return r.type === 'parent' && r.to === id && P[r.from]; }); })
      .sort(function (a, b) { return (P[b].role === 'moi') - (P[a].role === 'moi') || (annee(P[b].naiss) || 0) - (annee(P[a].naiss) || 0); })
      .map(function (id) { var p = P[id]; return { id: id, nom: ((p.prenom || '') + ' ' + (p.nom || '')).trim() || 'Sans prénom', an: annee(p.naiss), moi: p.role === 'moi' }; });
  }
  /* L'arbre qui descend : la personne choisie, ses enfants, ses petits-enfants (jusqu'à 4 générations) */
  function descendants(depart, nbGen) {
    var S = window.GenoArbre.etat(), P = S.people || {}, rels = S.rels || [];
    function enfantsDe(id) { return rels.filter(function (r) { return r.type === 'parent' && r.from === id && P[r.to]; }).map(function (r) { return r.to; }).filter(function (x, i, t) { return t.indexOf(x) === i; }); }
    function parentsDe(id) { return rels.filter(function (r) { return r.type === 'parent' && r.to === id && P[r.from]; }).map(function (r) { return r.from; }); }
    var ids = Object.keys(P).filter(function (id) { return enfantsDe(id).length; }); if (!ids.length) return null;
    var moi = Object.keys(P).filter(function (id) { return P[id].role === 'moi'; })[0];
    /* par défaut : la mère (ou le père) de « moi » si elle a des petits-enfants, sinon moi, sinon la personne la plus âgée qui a des enfants */
    var defaut = moi && enfantsDe(moi).length ? moi : null;   /* toi d'abord, si tu as des enfants ; sinon ta mère ou ton père, s'ils ont des petits-enfants */
    if (!defaut && moi) parentsDe(moi).sort(function (a, b) { return (P[b].sex === 'f') - (P[a].sex === 'f'); }).forEach(function (x) { if (!defaut && enfantsDe(x).some(function (e) { return enfantsDe(e).length; })) defaut = x; });
    var racineId = depart && P[depart] && enfantsDe(depart).length ? depart : defaut || ids.sort(function (a, b) { return (annee(P[a].naiss) || 9999) - (annee(P[b].naiss) || 9999); })[0];
    var maxG = nbGen || 4, plusVieux = null, gens = 0, vus = {};
    function fiche(p) { return { prenom: p.prenom || '', nom: p.nom || '', sexe: p.sex === 'f' ? 'f' : 'm', naissance: annee(p.naiss), deces: annee(p.deces) || null }; }
    function sans(t) { return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim(); }
    /* Les unions d'une personne, exactement comme dans l'arbre : chaque autre parent de ses enfants, puis ses conjoints sans enfant noté.
       Un enfant dont l'autre parent n'est pas noté est rattaché au conjoint dont il porte le nom, seulement s'il n'y en a qu'un (sinon il reste rattaché à la personne seule). */
    function unionsDe(id) {
      var ens = enfantsDe(id).sort(function (a, b) { return (annee(P[a].naiss) || 9999) - (annee(P[b].naiss) || 9999); }), liste = [], de = {};
      ens.forEach(function (e) { var ap = parentsDe(e).filter(function (x) { return x !== id; })[0]; if (ap) { if (liste.indexOf(ap) < 0) liste.push(ap); de[e] = liste.indexOf(ap); } });
      var cps = rels.filter(function (r) { return r.type === 'couple' && (r.from === id || r.to === id) && P[r.from === id ? r.to : r.from]; });
      cps.forEach(function (r) { var x = r.from === id ? r.to : r.from; if (liste.indexOf(x) < 0) liste.push(x); });
      ens.forEach(function (e) {
        if (de[e] != null) return;
        var nomE = ' ' + sans((P[e].prenom || '') + ' ' + (P[e].nom || '')).replace(/[-’']/g, ' ') + ' ';
        var cand = liste.filter(function (x) { var n = sans(P[x].nom); return n && n !== sans(P[id].nom) && nomE.indexOf(' ' + n + ' ') >= 0; });
        if (cand.length === 1) de[e] = liste.indexOf(cand[0]);
      });
      var fiches = liste.map(function (x) { var r = cps.filter(function (c) { return c.from === x || c.to === x; })[0], f = fiche(P[x]); f._id = x; f.separe = !!(r && (r.statut === 'separe' || r.statut === 'divorce')); return f; });
      return { liste: liste, fiches: fiches, de: de, ens: ens };
    }
    function construire(id, g) {
      if (vus[id]) return null; vus[id] = 1;
      var p = P[id], o = fiche(p); o._id = id; gens = Math.max(gens, g + 1);
      if (o.naissance && (!plusVieux || o.naissance < plusVieux)) plusVieux = o.naissance;
      var U = unionsDe(id);
      if (g > 0 && U.fiches.length) {   /* ses conjoints (les autres parents de ses enfants, puis ses unions) : écrits sous son nom */
        o.cj = U.fiches[0]; if (U.fiches[1]) o.cj2 = U.fiches[1];
        if (U.fiches.length > 1) o.unions = U.fiches.slice(0, 3);
      }
      o.enf = g < maxG - 1 ? U.ens.map(function (e) { var c = construire(e, g + 1); if (c) c._u = U.de[e] != null ? U.de[e] : -1; return c; }).filter(Boolean) : [];
      if (g > 0 && o.unions) o.enf = o.enf.map(function (c, i) { return [c, i]; }).sort(function (a, b) { return (a[0]._u < 0 ? 99 : a[0]._u) - (b[0]._u < 0 ? 99 : b[0]._u) || a[1] - b[1]; }).map(function (x) { return x[0]; });   /* les enfants groupés par union */
      return o;
    }
    var racine = construire(racineId, 0), U0 = unionsDe(racineId), conjoint = null, conjointRefus = '', unionsD = null;
    var tousDeLui = U0.liste.length && U0.ens.every(function (e) { return U0.de[e] === 0; });
    if (U0.liste.length === 1 && (tousDeLui || !U0.ens.some(function (e) { return U0.de[e] == null || U0.de[e] < 0; }))) { conjoint = U0.fiches[0]; }
    else if (U0.liste.length) {
      /* plusieurs unions (une grand-mère remariée…), ou des enfants d'un autre parent : chaque conjoint à côté d'elle, ses enfants sous leur union */
      unionsD = U0.fiches.slice(0, 2);
      (racine.enf || []).forEach(function (c) { if (c._u > 1) c._u = -1; });
      var rangU = function (c) { return c._u === 1 ? 0 : c._u === 0 ? 2 : 1; };   /* la 2e union à gauche, un parent inconnu au milieu, la 1re à droite */
      racine.enf = (racine.enf || []).map(function (c, i) { return [c, i]; }).sort(function (a, b) { return rangU(a[0]) - rangU(b[0]) || a[1] - b[1]; }).map(function (x) { return x[0]; });
    }
    var pr = String(racine.prenom || '').trim().split(/\s+/)[0], nomF = String(racine.nom || '').trim().toLowerCase().replace(/(^|[\s\-'’])(\S)/g, function (m, a, b) { return a + b.toUpperCase(); });
    var titre = pr ? 'La famille ' + (/^[aeiouyéèêàâîïôûh]/i.test(pr) ? 'd’' : 'de ') + pr : (nomF ? 'La famille ' + nomF : 'Notre famille');
    return {
      titre: titre, sousTitre: GEN[Math.min(gens, GEN.length) - 1] + (plusVieux ? ' · depuis ' + plusVieux : ''),
      moi: racine, freresSoeurs: [], enfants: [], conjoint: conjoint, conjointRefus: conjointRefus, unions: unionsD, nb: gens, nbGen: gens, depart: racineId, departEstMoi: P[racineId].role === 'moi', descendants: true
    };
  }
  /* « Notre famille » : toi et ton conjoint côte à côte, chacun avec ses ancêtres, et vos enfants communs au pied */
  var raisonFamille = '';
  function couple(depart, nbGen) {
    raisonFamille = '';
    var S = window.GenoArbre.etat(), P = S.people || {}, rels = S.rels || [];
    var L1 = lignee(depart, Math.max(1, (nbGen || 10) - 1)); if (!L1) return null;
    var moi = L1.depart;
    var unions = rels.filter(function (r) { return r.type === 'couple' && (r.from === moi || r.to === moi); }).map(function (r) { return { id: r.from === moi ? r.to : r.from, fini: r.statut === 'separe' || r.statut === 'divorce' }; }).filter(function (u) { return P[u.id]; });
    unions.sort(function (a, b) { return a.fini - b.fini; });
    if (!unions[0]) return null;
    var cj = unions[0].id, L2 = lignee(cj, Math.max(1, (nbGen || 10) - 1));
    function enfantsDe(id) { return rels.filter(function (r) { return r.type === 'parent' && r.from === id && P[r.to]; }).map(function (r) { return r.to; }); }
    var deCj = enfantsDe(cj);
    /* une mère (ou un père) dont les enfants ne sont pas tous de ce conjoint : « Notre famille » devient sa lignée avec TOUS ses enfants */
    var mesEnf = enfantsDe(moi);
    if (mesEnf.length && !mesEnf.every(function (e) { return deCj.indexOf(e) >= 0; }) && choix.style !== 'famille_lumiere') { raisonFamille = String(P[cj].prenom || 'Ton conjoint').split(/\s+/)[0]; return null; }
    var communs = enfantsDe(moi).filter(function (e, i, t) { return t.indexOf(e) === i && deCj.indexOf(e) >= 0; })
      .map(function (id) { var p = P[id]; return { prenom: p.prenom || '', nom: p.nom || '', sexe: p.sex === 'f' ? 'f' : 'm', naissance: annee(p.naiss), deces: annee(p.deces) || null }; })
      .sort(function (a, b) { return (a.naissance || 9999) - (b.naissance || 9999); }).slice(0, 6);
    var hors = enfantsDe(moi).concat(deCj).filter(function (e, i, t) { return t.indexOf(e) === i && !communs.some(function (c) { return c._id === e; }) && !(enfantsDe(moi).indexOf(e) >= 0 && deCj.indexOf(e) >= 0); }).map(function (e) { return P[e].prenom || ''; }).filter(Boolean);
    var p1 = String(L1.moi.prenom || '').split(/\s+/)[0], p2 = String(L2.moi.prenom || '').split(/\s+/)[0], n = Math.max(L1.nb, L2.nb) + 1;
    var ans = []; (function a(q) { if (!q) return; if (q.naissance) ans.push(q.naissance); a(q.pere); a(q.mere); })(L1.moi); (function a(q) { if (!q) return; if (q.naissance) ans.push(q.naissance); a(q.pere); a(q.mere); })(L2.moi);
    return {
      titre: 'Notre famille', sousTitre: (p1 && p2 ? p1 + ' & ' + p2 : 'Nos deux lignées') + (ans.length ? ' · depuis ' + Math.min.apply(null, ans) : ''),
      moi: { couple: true, prenom: '', nom: '', pere: L1.moi, mere: L2.moi }, freresSoeurs: [], enfants: communs, conjoint: null, conjointRefus: '', nb: n, nbGen: n,
      depart: moi, departEstMoi: L1.departEstMoi, couple: true, horsCouple: hors, prenomCj: p2
    };
  }
  function lignee(depart, nbGen) {
    var S = window.GenoArbre.etat(), P = S.people || {}, rels = S.rels || [];
    var ids = Object.keys(P); if (!ids.length) return null;
    function parentsDe(id) { return rels.filter(function (r) { return r.type === 'parent' && r.to === id && P[r.from]; }).map(function (r) { return r.from; }); }
    function enfantsDe(id) { return rels.filter(function (r) { return r.type === 'parent' && r.from === id && P[r.to]; }).map(function (r) { return r.to; }); }
    var moi = depart && P[depart] ? depart : ids.filter(function (id) { return P[id].role === 'moi'; })[0];
    if (!moi) { /* sans « c'est moi » : la personne la plus jeune qui a des parents */
      var avec = ids.filter(function (id) { return parentsDe(id).length; }).sort(function (a, b) { return (annee(P[b].naiss) || 0) - (annee(P[a].naiss) || 0); });
      moi = avec[0] || ids[0];
    }
    var maxG = nbGen || 5, plusVieux = null, plusJeune = null, vivant = false, gens = 0;
    function construire(id, g) {
      var p = P[id]; if (!p) return null;
      gens = Math.max(gens, g + 1);
      var n = annee(p.naiss); if (n && (!plusVieux || n < plusVieux)) plusVieux = n;
      if (n && (!plusJeune || n > plusJeune)) plusJeune = n;
      if (!p.deces && !p.decede && n && n > new Date().getFullYear() - 105) vivant = true;   /* sans date de naissance, on ne suppose pas la personne en vie */
      var o = { prenom: p.prenom || '', nom: p.nom || '', sexe: p.sex === 'f' ? 'f' : 'm', naissance: n, deces: annee(p.deces) || null, decede: !!p.decede };
      if (g < maxG - 1) {
        var ps = parentsDe(id), pere = null, mere = null;
        ps.forEach(function (x) { if (P[x].sex === 'f' && !mere) mere = x; else if (P[x].sex === 'm' && !pere) pere = x; });
        ps.forEach(function (x) { if (x !== pere && x !== mere) { if (!pere) pere = x; else if (!mere) mere = x; } });
        o.pere = pere ? construire(pere, g + 1) : null; o.mere = mere ? construire(mere, g + 1) : null;
      }
      return o;
    }
    var racine = construire(moi, 0), fs = {};
    parentsDe(moi).forEach(function (par) { enfantsDe(par).forEach(function (e) { if (e !== moi) fs[e] = 1; }); });
    rels.forEach(function (r) { if (r.type === 'fratrie') { if (r.from === moi && P[r.to]) fs[r.to] = 1; if (r.to === moi && P[r.from]) fs[r.from] = 1; } });
    /* demi-frère ou demi-sœur : un seul parent en commun (noté), pour ne pas laisser croire aux mêmes deux parents */
    var pm = parentsDe(moi);
    var freres = Object.keys(fs).slice(0, 4).map(function (id) {
      var p = P[id], pf = parentsDe(id), com = pf.filter(function (x) { return pm.indexOf(x) >= 0; }), demi = pm.length === 2 && com.length === 1;
      /* demi-frère, demi-sœur : du côté du parent en commun (la mère ou le père), pour qu'il ne passe pas pour l'enfant de tes deux parents */
      var autre = pm.filter(function (x) { return x !== com[0]; })[0], cote = !demi ? '' : (P[com[0]].sex === 'f' || (P[com[0]].sex !== 'm' && P[autre] && P[autre].sex === 'm')) ? 'mere' : 'pere';
      /* l'autre parent d'un demi-frère ou d'une demi-sœur (le 2e mari de ta mère, par exemple) : dessiné à côté du parent en commun */
      var ap = demi ? pf.filter(function (x) { return pm.indexOf(x) < 0; })[0] : null;
      /* autre parent non noté : le conjoint du parent en commun dont le demi-frère porte le nom, s'il n'y en a qu'un */
      if (demi && !ap) {
        var sansA = function (t) { return String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim(); }, nomF = ' ' + sansA((p.prenom || '') + ' ' + (p.nom || '')).replace(/[-’']/g, ' ') + ' ';
        var cands = rels.filter(function (r) { return r.type === 'couple' && (r.from === com[0] || r.to === com[0]); }).map(function (r) { return r.from === com[0] ? r.to : r.from; })
          .filter(function (x) { var n = sansA(P[x] && P[x].nom); return P[x] && pm.indexOf(x) < 0 && n && n !== sansA(P[com[0]].nom) && nomF.indexOf(' ' + n + ' ') >= 0; });
        if (cands.length === 1) ap = cands[0];
      }
      var un = ap ? rels.filter(function (r) { return r.type === 'couple' && ((r.from === ap && r.to === com[0]) || (r.to === ap && r.from === com[0])); })[0] : null;
      var autre = ap && P[ap] ? { _id: ap, prenom: P[ap].prenom || '', nom: P[ap].nom || '', sexe: P[ap].sex === 'f' ? 'f' : 'm', naissance: annee(P[ap].naiss), deces: annee(P[ap].deces) || null, separe: !!(un && (un.statut === 'separe' || un.statut === 'divorce')) } : null;
      return { prenom: p.prenom || '', nom: p.nom || '', sexe: p.sex === 'f' ? 'f' : 'm', naissance: annee(p.naiss), deces: annee(p.deces) || null, demi: demi, cote: cote, autre: autre };
    }).sort(function (a, b) { return (a.demi ? 1 : 0) - (b.demi ? 1 : 0); });
    freres.forEach(function (f) { if (f.naissance && f.naissance > (plusJeune || 0)) plusJeune = f.naissance; if (!f.deces && f.naissance && f.naissance > new Date().getFullYear() - 105) vivant = true; });
    /* ses enfants, du plus âgé au plus jeune (option « avec mes enfants », au pied de l'arbre) */
    var enfants = enfantsDe(moi).filter(function (id, i, t) { return t.indexOf(id) === i; }).map(function (id) { var p = P[id]; return { _id: id, prenom: p.prenom || '', nom: p.nom || '', sexe: p.sex === 'f' ? 'f' : 'm', naissance: annee(p.naiss), deces: annee(p.deces) || null }; })
      .sort(function (a, b) { return (a.naissance || 9999) - (b.naissance || 9999); }).slice(0, 6);
    /* son ou sa conjoint·e : l'union en cours en priorité. Affiché seulement s'il est l'autre parent de TOUS ses enfants
       (sinon il laisserait croire qu'il est le parent de tous) */
    var unions = rels.filter(function (r) { return r.type === 'couple' && (r.from === moi || r.to === moi); }).map(function (r) { return { id: r.from === moi ? r.to : r.from, fini: r.statut === 'separe' || r.statut === 'divorce' }; }).filter(function (u) { return P[u.id]; });
    unions.sort(function (a, b) { return a.fini - b.fini; });
    var cj = unions[0] ? unions[0].id : null, enfantsIds = enfantsDe(moi), conjoint = null, conjointRefus = '';
    if (cj) {
      var tousDeLui = enfantsIds.every(function (e) { return parentsDe(e).indexOf(cj) >= 0; });
      if (tousDeLui) { var pc = P[cj]; conjoint = { prenom: pc.prenom || '', nom: pc.nom || '', sexe: pc.sex === 'f' ? 'f' : 'm', naissance: annee(pc.naiss), deces: annee(pc.deces) || null, separe: unions[0].fini }; }
      else conjointRefus = (P[cj].prenom || 'Ton conjoint');
    }
    /* Les autres parents de ses enfants (unions passées ou actuelles) : chacun à côté d'elle, ses enfants sous leur union.
       Sert quand le conjoint n'est pas le parent de tous (familles recomposées) ou qu'il y a plusieurs unions. */
    var partenaires = [];
    function fiche(id) { var q = P[id]; return { prenom: q.prenom || '', nom: q.nom || '', sexe: q.sex === 'f' ? 'f' : 'm', naissance: annee(q.naiss), deces: annee(q.deces) || null }; }
    function partenaire(id) {
      var k = partenaires.map(function (x) { return x.id; }).indexOf(id); if (k >= 0) return k;
      var u = unions.filter(function (x) { return x.id === id; })[0];
      partenaires.push({ id: id, p: fiche(id), separe: u ? u.fini : true }); return partenaires.length - 1;
    }
    enfants.forEach(function (c) { var autre = parentsDe(c._id).filter(function (x) { return x !== moi; })[0]; c._u = autre ? partenaire(autre) : -1; });
    unions.forEach(function (u) { partenaire(u.id); });   /* une union sans enfant noté apparaît aussi */
    partenaires = partenaires.slice(0, 3); enfants.forEach(function (c) { if (c._u > 2) c._u = -1; });
    var avecUnions = !conjoint && partenaires.length > 0;
    var nomFamille = racine.nom || (racine.pere && racine.pere.nom) || '';
    /* Majuscule au nom de famille : « charron » donne « Charron » */
    nomFamille = String(nomFamille).trim().toLowerCase().replace(/(^|[\s\-'’])(\S)/g, function (m, a, b) { return a + b.toUpperCase(); }).replace(/ (De|Du|Des|La|Le|D’|D') /g, function (m) { return m.toLowerCase(); });
    return {
      titre: nomFamille ? 'La famille ' + nomFamille : 'Notre famille',
      /* « à aujourd'hui » seulement si quelqu'un de l'arbre est en vie ; sinon jusqu'à la naissance la plus récente */
      sousTitre: GEN[Math.min(gens, GEN.length) - 1] + (plusVieux ? ' · de ' + plusVieux + ' à ' + (vivant || !plusJeune || plusJeune === plusVieux ? 'aujourd’hui' : plusJeune) : ''),
      moi: racine, freresSoeurs: freres, enfants: enfants, conjoint: conjoint, conjointRefus: avecUnions ? '' : conjointRefus,
      unions: avecUnions ? partenaires.map(function (x) { var o = x.p; o.separe = x.separe; return o; }) : null, nb: gens, nbGen: gens, depart: moi, departEstMoi: P[moi].role === 'moi'
    };
  }

  /* Pour l'image, le décor et les polices doivent être inclus dans le SVG */
  function enDataUrl(url) {
    if (cache[url]) return cache[url];
    cache[url] = fetch(url).then(function (r) { return r.blob(); }).then(function (b) { return new Promise(function (ok) { var f = new FileReader(); f.onload = function () { ok(f.result); }; f.readAsDataURL(b); }); });
    return cache[url];
  }
  /* opt.hd : décor haute définition (téléchargement, impression) ; opt.fondPerdu : 4 mm en plus pour l'imprimeur */
  function svgAutonome(donnees, apercu, opt) {
    opt = opt || {};
    var fig = donnees.style === 'figuier', pay = paysage(donnees.style), gr = donnees.style === 'grand', med = /medaillons$/.test(donnees.style) || (gr && ((donnees.enfants || []).length > 0 || !!donnees.conjoint));
    var doreD = donnees.style === 'desc_dore', lum = /lumiere$/.test(donnees.style);   /* l'arbre doré des descendants : à l'horizontale, sur le papier texturé */
    return Promise.all([gr ? enDataUrl('assets/arbre/grand-arbre' + ((donnees.nbGen || 5) < 5 ? '-4' : '') + (opt.hd ? '.jpg' : '-ecran.jpg')) : doreD ? enDataUrl(opt.hd ? 'assets/arbre/papier-dore-hd.jpg' : 'assets/arbre/papier-dore.jpg') : lum ? enDataUrl(opt.hd ? 'assets/arbre/lumiere-fond.jpg' : 'assets/arbre/lumiere-fond-ecran.jpg') : pay ? '' : enDataUrl(fig ? (opt.hd ? 'assets/arbre/figuier.jpg' : 'assets/arbre/figuier-ecran.jpg') : (opt.hd ? 'assets/arbre/papier-dore-hd.jpg' : 'assets/arbre/papier-dore.jpg')), enDataUrl('assets/polices/gilda-display-latin-400-normal.woff2'), enDataUrl('assets/polices/nunito-sans-latin-400-normal.woff2'), enDataUrl('assets/polices/nunito-sans-latin-600-normal.woff2'),
      med ? enDataUrl('assets/arbre/medaillon-or.png') : '', med ? enDataUrl('assets/arbre/racine-or.png') : ''])
      .then(function (d) {
        var polices = '@font-face{font-family:"Gilda Display";src:url(' + d[1] + ') format("woff2")}@font-face{font-family:"Nunito Sans";font-weight:400;src:url(' + d[2] + ') format("woff2")}@font-face{font-family:"Nunito Sans";font-weight:600 800;src:url(' + d[3] + ') format("woff2")}';
        return window.ArbreEncadrer.svg(donnees, { decor: d[0], apercu: apercu, fondPerdu: !!opt.fondPerdu, sprites: med ? { medaillon: d[4], racine: d[5] } : undefined }).replace('<style>', '<style>' + polices);
      });
  }
  function versPng(svg, largeur, jpeg) {
    var t = svg.match(/width="(\d+)" height="(\d+)"/), lw = largeur || 2480, lh = Math.round(lw * (t ? t[2] / t[1] : 3508 / 2480));
    return new Promise(function (ok, ko) {
      var img = new Image(), url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
      img.onload = function () {
        var c = document.createElement('canvas'); c.width = lw; c.height = lh;
        c.getContext('2d').drawImage(img, 0, 0, lw, lh); URL.revokeObjectURL(url);
        var ctx = c.getContext('2d'); c.toBlob(function (b) { b ? ok(b) : ko(new Error('image')); }, jpeg ? 'image/jpeg' : 'image/png', jpeg ? .93 : undefined);
      };
      img.onerror = function () { URL.revokeObjectURL(url); ko(new Error('image')); };
      img.src = url;
    });
  }
  function nomFichier(d) { return 'arbre-' + (d.titre || 'famille').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-genesolia'; }

  var donnees = null, dispo = 0;
  function recalculer() {
    var titre = donnees && document.getElementById('fe-titre') ? document.getElementById('fe-titre').value : null;
    var sous = donnees && document.getElementById('fe-sous') ? document.getElementById('fe-sous').value : null;
    var nb;
    if (desc() && window.ArbreDescendants) {
      var tout4 = descendants(choix.depart, 7), D = window.ArbreDescendants;
      dispo = tout4 ? tout4.nb : 0;
      if (tout4 && !choix.conjoint) tout4.conjoint = null;
      capA4 = tout4 ? capDesc(tout4, false) : 2; capA3 = tout4 ? Math.max(capA4, capDesc(tout4, true)) : 2;
      CAP = { a4: capA4, a3: capA3, g50: tout4 ? Math.max(capA3, capDesc(tout4, ECH.g50)) : 2, g70: 0 }; CAP.g70 = tout4 ? Math.max(CAP.g50, capDesc(tout4, ECH.g70)) : 2;
      nb = Math.min(choix.nbGen || CAP[classe(formatChoisi())], capMax(), dispo);
      donnees = descendants(choix.depart, nb);
    } else if ((ev() || choix.style === 'famille_eventail') && window.ArbreEventail) {
      var toutE = (famille() && couple(choix.depart, 14)) || lignee(choix.depart, 14), E = window.ArbreEventail;
      dispo = toutE ? toutE.nb : 0;
      capA4 = toutE ? E.capacite(toutE, false) : 2; capA3 = toutE ? Math.max(capA4, E.capacite(toutE, true)) : 2;
      CAP = { a4: capA4, a3: capA3, g50: toutE ? Math.max(capA3, E.capacite(toutE, ECH.g50)) : 2, g70: 0 }; CAP.g70 = toutE ? Math.max(CAP.g50, E.capacite(toutE, ECH.g70)) : 2;
      nb = Math.min(choix.nbGen || CAP[classe(formatChoisi())], capMax(), dispo);
    } else if (grand()) {
      /* Grand arbre : 4 ou 5 générations, sur le dessin qui a exactement ce nombre de rangées (aucun médaillon peint en trop).
         Par défaut, la 5e rangée seulement si au moins la moitié des seize ancêtres est connue. */
      var tg = lignee(choix.depart, 5); dispo = (tg || { nb: 0 }).nb; capA4 = 0; capA3 = 5; CAP = { a4: 0, a3: 5, g50: 5, g70: 5 };
      var r5 = tg && tg.moi ? remplis(tg.moi, 0, 5) - remplis(tg.moi, 0, 4) : 0;
      nb = Math.max(4, Math.min(choix.nbGen || (dispo >= 5 && r5 >= 8 ? 5 : 4), dispo, 5));
    } else if (lig() && window.ArbreLignee) {
      var tout = (famille() && couple(choix.depart, 14)) || lignee(choix.depart, 14);
      dispo = tout ? tout.nb : 0;
      if (tout && !choix.enfants) tout.enfants = [];   /* la rangée des enfants prend un peu de hauteur */
      /* jusqu'où l'arbre reste lisible : à l'horizontale, ou en portrait (plus haut : plus de générations) ; Notre famille reste à l'horizontale */
      var AL = window.ArbreLignee, port = !(famille() && tout && tout.couple);
      capA4 = tout ? Math.max(AL.capacite(tout, false, true, motif()), port ? AL.capacite(tout, false, false, motif()) : 0) : 2;
      capA3 = tout ? Math.max(capA4, AL.capacite(tout, true, true, motif()), port ? AL.capacite(tout, true, false, motif()) : 0) : 2;
      /* grands formats : bien plus de générations lisibles (le texte reste à 8 points imprimés) */
      var capF = function (e) { return tout ? Math.max(AL.capacite(tout, e, true, motif()), port ? AL.capacite(tout, e, false, motif()) : 0) : 2; };
      CAP = { a4: capA4, a3: capA3, g50: Math.max(capA3, capF(ECH.g50)), g70: 0 }; CAP.g70 = Math.max(CAP.g50, capF(ECH.g70));
      if (famille() && tout && tout.couple) { capA4 = Math.min(capA4, 5); capA3 = Math.min(capA3, 6); CAP.a4 = capA4; CAP.a3 = capA3; CAP.g50 = Math.min(CAP.g50, 7); CAP.g70 = Math.min(CAP.g70, 8); }   /* deux lignées côte à côte : on s'arrête aux arrière-grands-parents en A4, pour garder un texte confortable */
      nb = Math.min(choix.nbGen || CAP[classe(formatChoisi())], capMax(), dispo);
    } else {
      dispo = (lignee(choix.depart, 5) || { nb: 0 }).nb; capA4 = 4; capA3 = 5; CAP = { a4: 4, a3: 5, g50: 0, g70: 0 };   /* Figuier, Arbre doré : 4 générations en A4, 5 en A3 */
      nb = Math.min(choix.nbGen || Math.min(dispo, 4), dispo);
    }
    if (!desc()) donnees = (famille() && couple(choix.depart, nb)) || lignee(choix.depart, nb);
    if (donnees && famille() && !donnees.couple) { donnees.sansCouple = true; donnees.raisonFamille = raisonFamille; if (!choix.titreModifie) donnees.titre = 'Notre famille'; }   /* pas de conjoint noté : on montre la Lignée, avec un mot d'explication */
    if (donnees && lumiere()) { donnees.titre = choix.titreModifie && titre != null ? titre.trim() : ''; if (!choix.sousModifie) donnees.sousTitre = ''; }   /* en lumière : pas de titre imposé, la personne écrit le sien (ou rien) */
    else if (donnees && titre != null && choix.titreModifie) donnees.titre = titre || donnees.titre;   /* sinon le titre suit la personne choisie (« La famille Epinette ») */
    if (donnees && sous != null && choix.sousModifie) donnees.sousTitre = sous;
    if (donnees) { donnees.style = choix.style; donnees.nbFreres = donnees.freresSoeurs.length; donnees.nbDemis = donnees.freresSoeurs.filter(function (f) { return f.demi; }).length;
      if (!choix.freres || ev() || choix.style === 'famille_eventail' || grand()) donnees.freresSoeurs = [];   /* l'éventail et le Grand arbre ne montrent pas les frères et sœurs */
      else if (lumiere()) donnees.freresSoeurs = [];
      else if (choix.style === 'figuier' || choix.style === 'dore') donnees.freresSoeurs = donnees.freresSoeurs.filter(function (f) { return !f.demi; });   /* arbres peints : la lignée directe, sans les demi-frères et demi-sœurs (leur autre parent n'y aurait pas de place) */ donnees.nbEnfants = donnees.enfants.length; if (!choix.enfants || !avecEnfantsPossible()) donnees.enfants = []; donnees.aConjoint = !!donnees.conjoint; donnees.aUnions = !!(donnees.unions && donnees.unions.length); if (!choix.conjoint) donnees.unions = null; if (!choix.conjoint || !(avecEnfantsPossible() || desc())) donnees.conjoint = null; }
    /* portrait ou paysage : la Lignée (et Médaillons, Notre famille) prend le sens où son texte est le plus grand */
    if (donnees && lig() && !grand() && !desc() && !ev() && window.ArbreLignee && window.ArbreLignee.taille) {
      var a3o = ECH[classe(formatChoisi())], fzL = window.ArbreLignee.taille(donnees, a3o, true, motif(), donnees.nbGen), fzP = window.ArbreLignee.taille(donnees, a3o, false, motif(), donnees.nbGen);
      donnees.portrait = !(famille() && donnees.couple) && fzP > fzL * 1.15;
    }
    /* le sous-titre compte les rangées imprimées : les enfants au pied de l'arbre font une génération de plus */
    if (donnees && !choix.sousModifie && /^\S+ générations?/.test(donnees.sousTitre || '')) {
      var nR = desc() ? donnees.nb : (donnees.couple ? donnees.nbGen - 1 : donnees.nbGen) + (donnees.enfants && donnees.enfants.length ? 1 : 0);
      donnees.sousTitre = donnees.sousTitre.replace(/^\S+ générations?/, GEN[Math.max(1, Math.min(nR, GEN.length)) - 1]);
    }
  }
  function afficher() {
    var premier = !choix.choisi;
    choix = { depart: '', nbGen: 0, sousModifie: false, style: choix.style || 'figuier', vue: 'affiche', freres: true, enfants: true, conjoint: true, choisi: choix.choisi, dernier: choix.dernier || {} };
    /* le Grand arbre d'office quand au moins la moitié de ses 31 médaillons sera remplie ; sinon le Figuier, qui n'a pas de place vide */
    if (premier) { choix.style = 'grand'; donnees = null; recalculer(); if (!donnees || donnees.nb < 3 || remplis(donnees.moi, 0, 5) < 16) choix.style = 'figuier'; }
    var SA = saison(); if (SA && !saisonPossible(SA)) SA = SA.autre && saisonPossible(SA.autre) ? Object.assign({}, SA, SA.autre) : null;
    if (premier && SA) { choix.style = SA.style; if (SA.style === 'descendants' && SA.racine) choix.depart = SA.racine; }   /* en période de fête : le modèle cadeau d'office */
    donnees = null; recalculer();
    if (!donnees || !donnees.moi || (donnees.nb < 2 && !desc())) {
      corps.innerHTML = '<p class="rap-texte">Ajoute au moins tes parents (ou tes enfants) à ton arbre pour en faire un poster. Plus il va loin, plus il est beau.</p>';
      return;
    }
    if (!choix.depart) choix.depart = donnees.depart;
    var payant = window.GenesoliaAcces && window.GenesoliaAcces.payant('arbreEncadrer'), P = window.GenesoliaAcces ? window.GenesoliaAcces.produit('arbreEncadrer') : null;
    function etape(n, t) { return '<p class="fe-etape-t"><span>' + n + '</span>' + t + '</p>'; }
    corps.innerHTML = '<div class="fe-grille"><div class="fe-gauche"><div class="fe-vues" id="fe-vues" role="tablist"><button type="button" role="tab" data-vue="affiche" aria-selected="true">Le poster</button><button type="button" role="tab" data-vue="scene" aria-selected="false">Mis en scène</button></div><div class="fe-apercu-z"><div class="fe-apercu" id="fe-apercu" title="Cliquer pour agrandir"><p class="rap-texte">Un instant…</p></div><button type="button" class="fe-loupe" id="fe-loupe" aria-label="Agrandir l’aperçu"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M15.5 15.5L21 21M10.5 7.5v6M7.5 10.5h6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>Agrandir</button></div><p class="fe-legende" id="fe-legende"></p><p class="fe-coupes" id="fe-coupes" hidden></p></div><div class="fe-reglages">' +
      '<p class="fe-suite">Personnalise ton poster juste en dessous : pour qui, le style, le nombre de générations, le titre et le format.</p>' +
      (SA ? '<div class="fe-saison"><span class="fe-saison-t">' + esc(SA.badge) + '</span> ' + esc(SA.texte) + (choix.style !== SA.style ? ' <button type="button" class="fe-saison-bt" data-saison="' + SA.style + '">Voir ce modèle</button>' : '') + '</div>' : '') +
      '<div class="fe-etape">' + etape(1, 'Pour qui ?') + '<label class="fe-champ"><span class="fe-cache">La personne</span><select id="fe-depart">' + departs().map(function (x) { return '<option value="' + esc(x.id) + '"' + (x.id === choix.depart ? ' selected' : '') + '>' + esc(x.nom) + (x.an ? ' (' + x.an + ')' : '') + (x.moi ? ' · moi' : '') + '</option>'; }).join('') + '</select></label></div>' +
      '<div class="fe-etape">' + etape(2, 'Quel arbre ?') + '<div class="fe-types" id="fe-types" role="radiogroup" aria-label="Quel arbre"></div></div>' +
      '<div class="fe-etape">' + etape(3, 'Le style') + '<div class="fe-styles" id="fe-styles" role="radiogroup" aria-label="Le style"></div><p class="fe-aide fe-style-aide" id="fe-style-aide"></p></div>' +
      '<div class="fe-etape">' + etape(4, 'Combien de générations ?') + '<div class="fe-gens" id="fe-gens" role="radiogroup" aria-label="Nombre de générations"></div><p class="fe-aide" id="fe-gens-aide"></p></div>' +
      '<div class="fe-etape">' + etape(5, 'Les détails') +
      '<label class="fe-case" id="fe-freres-l"' + (donnees.nbFreres ? '' : ' hidden') + '><input type="checkbox" id="fe-freres"' + (choix.freres ? ' checked' : '') + '> Inclure les frères et sœurs</label>' +
      '<label class="fe-case" id="fe-conjoint-l" hidden><input type="checkbox" id="fe-conjoint"' + (choix.conjoint ? ' checked' : '') + '> <span id="fe-conjoint-t">Avec mon conjoint</span></label><p class="fe-aide" id="fe-conjoint-aide" hidden></p>' +
      '<p class="fe-aide" id="fe-demis-aide" hidden>Ce style montre ta lignée directe. Pour voir aussi tes demi-frères et demi-sœurs, avec leur autre parent à côté du tien, choisis le style Lignée ou Médaillons.</p>' +
      '<p class="fe-aide" id="fe-famille-aide" hidden></p>' +
      '<label class="fe-case" id="fe-enfants-l" hidden><input type="checkbox" id="fe-enfants"' + (choix.enfants ? ' checked' : '') + '> <span id="fe-enfants-t">Avec mes enfants, au pied de l’arbre</span></label>' +
      '<label class="fe-champ">Titre<input type="text" id="fe-titre" maxlength="40" value="' + esc(donnees.titre) + '"></label>' +
      '<div class="fe-titres" id="fe-titres" aria-label="Titres proposés"></div>' +
      '<label class="fe-champ">Sous-titre<input type="text" id="fe-sous" maxlength="60" value="' + esc(donnees.sousTitre) + '"></label></div>' +
      '<div class="fe-etape">' + etape(6, '<b id="fe-etape5" style="font-weight:inherit">Ton poster</b>') + blocImpression() + '<p class="fe-aide fe-lum-note" id="fe-lum-note" hidden>Ta lignée en lumière se télécharge pour l’instant : en image haute définition ou en PDF, juste en dessous, à imprimer où tu veux ou à garder près de toi.</p></div>' +
      '<p class="fe-sous-t">Ou le télécharger pour l’imprimer toi-même</p>' +
      '<p class="fe-aide">Image haute définition, prête à imprimer.</p>' +
      '<button class="bt plein rap-gros" type="button" id="fe-png" data-compte="ton arbre en poster" data-produit="arbreEncadrer">Télécharger l’image HD</button>' +
      '<button class="bt rap-gros" type="button" id="fe-pdf" data-compte="ton arbre en poster" data-produit="arbreEncadrer">Imprimer ou enregistrer en PDF</button>' +
      '<a class="fe-vierge" href="assets/modeles/arbre-vierge-5-generations-genesolia.pdf" download data-compte="ton arbre vierge à remplir"><img src="assets/modeles/arbre-vierge-apercu.webp" width="120" height="85" alt="" loading="lazy"><span><b>La version vierge, à remplir à la main</b><span>Le même arbre doré, 31 médaillons vides sur 5 générations. PDF gratuit, A4 paysage.</span><u>Télécharger le modèle vierge</u></span></a>' +
      (payant && P ? '<p class="fe-aide">' + esc(P.prix) + ', ou compris dans Le Cercle.</p>' : '') +
      '<p class="fe-aide" id="fe-statut" aria-live="polite"></p></div></div>';
    if (donnees) choix.nbGen = donnees.nbGen;   /* fixé dès l'ouverture : changer de format ne change plus le nombre de générations */
    majTypes(); majStyles(); majGens(); majEnfants(); dessiner(); vignettes();
    var t; ['fe-titre', 'fe-sous'].forEach(function (id) { document.getElementById(id).addEventListener('input', function () { if (id === 'fe-sous') choix.sousModifie = true; else choix.titreModifie = true; clearTimeout(t); t = setTimeout(dessiner, 250); }); });
    /* après un changement de personne, d'arbre ou de style : tout suit (générations, titre, cases, aperçu) */
    function appliquer() {
      var garder = choix.gensManuel ? choix.nbGen : 0;
      choix.nbGen = garder; recalculer(); if (donnees) choix.nbGen = donnees.nbGen;   /* le nombre de générations reste celui qu'elle a choisi ; il ne change plus avec le format */
      if (!choix.titreModifie && donnees) document.getElementById('fe-titre').value = donnees.titre;
      var ti = document.getElementById('fe-titre'), so = document.getElementById('fe-sous'); if (ti) ti.placeholder = lumiere() ? 'Ton titre, si tu veux (facultatif)' : ''; if (so) { so.placeholder = lumiere() ? 'Facultatif' : ''; if (lumiere() && !choix.sousModifie) so.value = ''; }
      if (!choix.sousModifie && donnees) document.getElementById('fe-sous').value = donnees.sousTitre;
      var sa = document.getElementById('fe-style-aide'); if (sa) sa.textContent = DESCR[choix.style] || '';
      majGens(); majEnfants(); dessiner();
    }
    function choisirStyle(st) { choix.style = st; choix.choisi = true; choix.dernier[typeDe(st)] = st; appliquer(); majStyles(); }
    function choisirType(ty) {
      var l = TYPES[ty], st = choix.dernier[ty] || l[0][0];
      if (st === 'grand' && (lignee(choix.depart, 5) || { nb: 0 }).nb < 4) st = 'figuier';   /* le Grand arbre demande les arrière-grands-parents */
      choix.style = st; choix.choisi = true; appliquer(); majTypes(); majStyles(); vignettes();
    }
    document.getElementById('fe-depart').addEventListener('change', function (e) {
      choix.depart = e.target.value;
      var ok = typesPour(choix.depart), ici = ok.filter(function (x) { return x.id === typeDe(); })[0];
      if (!ici || !ici.ok) { var autre = ok.filter(function (x) { return x.ok; })[0]; if (autre) { choisirType(autre.id); return; } }
      appliquer(); majTypes(); majStyles(); vignettes();
    });
    document.getElementById('fe-types').addEventListener('change', function (e) { if (e.target.name === 'fe-type') choisirType(e.target.value); });
    document.getElementById('fe-styles').addEventListener('change', function (e) { if (e.target.name === 'fe-style') choisirStyle(e.target.value); });
    document.getElementById('fe-conjoint').addEventListener('change', function (e) { choix.conjoint = e.target.checked; recalculer(); dessiner(); });
    document.getElementById('fe-enfants').addEventListener('change', function (e) { choix.enfants = e.target.checked; recalculer(); majGens(); dessiner(); });
    document.getElementById('fe-freres').addEventListener('change', function (e) { choix.freres = e.target.checked; recalculer(); dessiner(); });
    document.getElementById('fe-gens').addEventListener('change', function (e) { if (e.target.name !== 'fe-gen') return; choix.nbGen = +e.target.value; choix.gensManuel = true; recalculer(); majGens(); dessiner(); });
    document.getElementById('fe-titres').addEventListener('click', function (e) {
      var b = e.target.closest('[data-titre]'); if (!b) return;
      document.getElementById('fe-titre').value = b.getAttribute('data-titre'); choix.titreModifie = true; majTitres(); dessiner();
    });
    document.getElementById('fe-titre').addEventListener('input', function () { var z = document.getElementById('fe-titres'); if (z) z.querySelectorAll('[data-titre]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-titre') === document.getElementById('fe-titre').value.trim())); }); });
    var bs = corps.querySelector('[data-saison]');
    if (bs) bs.addEventListener('click', function () {
      var st = bs.getAttribute('data-saison'); if (st === 'descendants' && SA.racine) choix.depart = SA.racine;
      var sel = document.getElementById('fe-depart'); if (sel) sel.value = choix.depart;
      choix.dernier[typeDe(st)] = st; choisirType(typeDe(st)); bs.remove();
    });
    document.getElementById('fe-vues').addEventListener('click', function (e) { var b = e.target.closest('[data-vue]'); if (!b) return; choix.vue = b.getAttribute('data-vue'); dessiner(); });
    document.getElementById('fe-png').addEventListener('click', telechargerPng);
    document.getElementById('fe-loupe').addEventListener('click', loupe);
    /* téléphone : pincer l'aperçu ouvre la loupe (qui sait zoomer et dézoomer) au lieu d'agrandir toute la page, dont on ne savait plus ressortir */
    document.getElementById('fe-apercu').addEventListener('touchstart', function (e) { if (e.touches.length > 1) { e.preventDefault(); if (!document.querySelector('.fe-zoom')) loupe(); } }, { passive: false });
    document.getElementById('fe-apercu').addEventListener('click', loupe);
    document.getElementById('fe-pdf').addEventListener('click', imprimer);
    brancherImpression();
  }
  /* 2. Quel arbre ? Les trois sortes, celles qui ne sont pas possibles pour cette personne restent visibles mais grisées */
  function majTypes() {
    var z = document.getElementById('fe-types'); if (!z) return;
    var ty = typeDe();
    z.innerHTML = typesPour(choix.depart).map(function (x) {
      return '<label class="fe-type' + (x.ok ? '' : ' fe-off') + '"><input type="radio" name="fe-type" value="' + x.id + '"' + (x.id === ty ? ' checked' : '') + (x.ok ? '' : ' disabled') + '>' +
        '<span class="fe-type-ic" aria-hidden="true">' + ICONES[x.id] + '</span><span class="fe-type-t"><b>' + esc(x.nom) + '</b><small>' + esc(x.ok ? x.aide : x.non) + '</small></span></label>';
    }).join('');
  }
  var ICONES = {
    ancetres: '<svg viewBox="0 0 40 40"><circle cx="20" cy="33" r="4"/><circle cx="10" cy="19" r="3.4"/><circle cx="30" cy="19" r="3.4"/><circle cx="5" cy="6" r="2.8"/><circle cx="15" cy="6" r="2.8"/><circle cx="25" cy="6" r="2.8"/><circle cx="35" cy="6" r="2.8"/><path d="M20 29V24M20 24H10V22.4M20 24H30V22.4M10 15.6V11H5V8.8M10 11H15V8.8M30 15.6V11H25V8.8M30 11H35V8.8" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
    descendants: '<svg viewBox="0 0 40 40"><circle cx="20" cy="6" r="4"/><circle cx="10" cy="20" r="3.4"/><circle cx="30" cy="20" r="3.4"/><circle cx="5" cy="34" r="2.8"/><circle cx="15" cy="34" r="2.8"/><circle cx="25" cy="34" r="2.8"/><circle cx="35" cy="34" r="2.8"/><path d="M20 10V15H10V16.6M20 15H30V16.6M10 23.4V28H5V31.2M10 28H15V31.2M30 23.4V28H25V31.2M30 28H35V31.2" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
    lumiere: '<svg viewBox="0 0 40 40"><circle cx="20" cy="21" r="6"/><circle cx="9" cy="14" r="3"/><circle cx="31" cy="14" r="3"/><circle cx="14" cy="5" r="2.4"/><circle cx="26" cy="5" r="2.4"/><ellipse cx="20" cy="21" rx="17" ry="7" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M20 1V39" stroke="currentColor" stroke-width="1.2" opacity=".6"/></svg>',
    famille: '<svg viewBox="0 0 40 40"><circle cx="14" cy="22" r="3.6"/><circle cx="26" cy="22" r="3.6"/><circle cx="7" cy="8" r="2.8"/><circle cx="16" cy="8" r="2.8"/><circle cx="24" cy="8" r="2.8"/><circle cx="33" cy="8" r="2.8"/><circle cx="15" cy="35" r="2.8"/><circle cx="25" cy="35" r="2.8"/><path d="M14 18.4V14H7V10.8M14 14H16V10.8M26 18.4V14H24V10.8M26 14H33V10.8M17.6 22H22.4M20 22V28H15V32.2M20 28H25V32.2" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>'
  };
  /* 3. Le style : une petite vignette de chaque style, dessinée avec l'arbre de la personne */
  function majStyles() {
    var z = document.getElementById('fe-styles'); if (!z) return;
    var dG = (lignee(choix.depart, 5) || { nb: 0 }).nb;
    z.innerHTML = TYPES[typeDe()].map(function (x) {
      var off = x[0] === 'grand' && dG < 4;
      return '<label class="fe-style-c' + (off ? ' fe-off' : '') + '"' + (off ? ' title="Le Grand arbre demande au moins 4 générations (jusqu’aux arrière-grands-parents)."' : '') + '><input type="radio" name="fe-style" value="' + x[0] + '"' + (x[0] === choix.style ? ' checked' : '') + (off ? ' disabled' : '') + '>' +
        '<span class="fe-vign" data-vign="' + x[0] + '"></span><b>' + esc(x[1]) + (x[0] === 'grand' ? ' <small class="fe-badge">Le plus complet</small>' : '') + '</b></label>';
    }).join('');
    var sa = document.getElementById('fe-style-aide'); if (sa) sa.textContent = DESCR[choix.style] || '';
    var cache = vignettes.cache || {}; z.querySelectorAll('[data-vign]').forEach(function (v) { var k = vignettes.cle + '|' + v.getAttribute('data-vign'); if (cache[k]) v.innerHTML = cache[k]; });
  }
  /* les vignettes se dessinent une par une, après l'aperçu, pour ne pas ralentir la fenêtre */
  function vignettes() {
    var cle = choix.depart + '|' + typeDe(), l = TYPES[typeDe()].map(function (x) { return x[0]; }), n = 0;
    vignettes.cle = cle; vignettes.cache = vignettes.cache || {}; clearTimeout(vignettes.t);
    function suivante() {
      if (vignettes.cle !== cle || n >= l.length) return;
      var st = l[n++], k = cle + '|' + st, z = document.querySelector('#fe-styles [data-vign="' + st + '"]');
      if (!vignettes.cache[k]) {
        var garde = Object.assign({}, choix), dGarde = donnees, cGarde = [CAP, capA4, capA3, dispo];
        try {
          choix.style = st; choix.nbGen = 0; recalculer();
          if (donnees && (st !== 'grand' || donnees.nb >= 4)) {
            var svg = window.ArbreEncadrer.svg(donnees, { apercu: false }), i = n;
            vignettes.cache[k] = svg.replace(/ id="([^"]+)"/g, ' id="$1-v' + i + '"').replace(/url\(#([^)]+)\)/g, 'url(#$1-v' + i + ')').replace(/ width="\d+" height="\d+"/, '');
          } else vignettes.cache[k] = '';
        } catch (e) { vignettes.cache[k] = ''; }
        choix = garde; donnees = dGarde; CAP = cGarde[0]; capA4 = cGarde[1]; capA3 = cGarde[2]; dispo = cGarde[3];
      }
      if (z && vignettes.cache[k]) z.innerHTML = vignettes.cache[k];
      vignettes.t = setTimeout(suivante, 30);
    }
    vignettes.t = setTimeout(suivante, 120);
  }

  /* ===== Le recevoir imprimé : la commande part dans la table demandes, le fichier HD dans Storage (impressions), puis Stripe ===== */
  var IMP = window.GENESOLIA_IMPRESSION || {};
  function quandOuverture() { var j = new Date(IMP.ouverture + 'T00:00:00'); return (j.getDate() === 1 ? '1er' : j.getDate()) + ' ' + ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'][j.getMonth()]; }
  /* avant l'ouverture de la vente : pas de prix ni de délai annoncés comme si l'on pouvait commander */
  (function () {
    var b = document.querySelector('#bt-encadrer small'), sa = saison();
    if (ouvert() && sa && b) { b.textContent = sa.badge; return; }   /* en période de fête : « Idée Noël », « Fête des mères »… */
    if (ouvert() || !IMP.actif) return;
    if (b) b.textContent = 'Nouveau';
  })();
  function ouvert() { return !IMP.ouverture || new Date() >= new Date(IMP.ouverture + 'T00:00:00') || /test-impression/.test(location.search + location.hash); }
  function prixMin() { var p = (IMP.formats || []).map(function (f) { return parseFloat(String(f.prix).replace(',', '.')); }).filter(function (n) { return !isNaN(n); }); return p.length ? String(Math.min.apply(null, p)).replace('.', ',') + ' €' : ''; }
  function blocImpression() {
    if (!IMP.actif || !IMP.formats || !IMP.formats.length) return '';
    if (!ouvert()) {
      var j = new Date(IMP.ouverture + 'T00:00:00'), quand = (j.getDate() === 1 ? '1er' : j.getDate()) + ' ' + ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'][j.getMonth()];
      return '<div class="fe-imp"><p class="fe-imp-titre">Bientôt : le recevoir en poster</p><p class="fe-aide">À partir du ' + quand + ', tu pourras recevoir ton arbre en poster, imprimé sur un ' + PAPIER + ', en A4, en A3 ou en grand format jusqu’à 70 × 100 cm, livré chez toi ou chez la personne à qui tu l’offres.</p>' +
        '<form class="fe-imp-prevenir" id="fe-imp-prevenir" novalidate><div class="fe-deux"><input name="email" type="email" autocomplete="email" placeholder="Ton e-mail" aria-label="Ton e-mail" required><button class="bt rap-gros" type="submit">Me prévenir</button></div><p class="fe-aide" id="fe-prev-statut" aria-live="polite"></p></form></div>';
    }
    return '<div class="fe-imp"><p class="fe-imp-titre">Le recevoir en poster</p><p class="fe-aide">Imprimé sur un ' + PAPIER + ' (épais, doux au toucher, sans reflet) et envoyé chez toi ou chez la personne à qui tu l’offres. ' + esc(IMP.livraison || '') + '.</p>' +
      '<button class="bt plein rap-gros fe-commander" type="button" id="fe-imp-ouvrir">Commander mon poster · dès ' + esc(prixMin()) + '</button>' +
      '<form class="fe-imp-form" id="fe-imp-form" hidden novalidate>' +
        RECU + '<fieldset class="fe-formats"><legend>Format</legend>' + IMP.formats.map(function (f, i) { return '<label class="fe-format"><input type="radio" name="format" value="' + esc(f.id) + '"' + (f.id === 'a4' ? ' checked' : '') + '><span>' + esc(f.nom) + '</span><b>' + esc(f.prix) + '</b></label>'; }).join('') + (IMP.formats.some(function (f) { return f.grand; }) ? '<p class="fe-aide fe-grands-aide">Grands formats 50 × 70 et 70 × 100 cm : livrés en 6 à 11 jours ouvrés.</p>' : '') + '</fieldset>' +
        '<div class="fe-deux"><label class="fe-champ">Ton prénom<input name="prenom" autocomplete="given-name" required></label><label class="fe-champ">Ton e-mail<input name="email" type="email" autocomplete="email" required></label></div>' +
        '<label class="fe-case fe-cadeau"><input type="checkbox" name="cadeau" value="oui" id="fe-cadeau"> <span>C’est un cadeau</span></label>' +
        '<div class="fe-cadeau-z" id="fe-cadeau-z" hidden><label class="fe-champ">Un petit mot, imprimé en bas de l’affiche (facultatif)<input name="mot" id="fe-mot" maxlength="80" placeholder="Pour mamie, avec tout notre amour · Noël 2026"></label>' +
        '<p class="fe-aide">Tu le vois tout de suite sur l’aperçu. Indique ci-dessous le nom et l’adresse de la personne : le colis part directement chez elle.</p></div>' +
        '<label class="fe-champ">Nom et prénom du destinataire<input name="nom_complet" autocomplete="name" required></label>' +
        '<label class="fe-champ">Adresse<input name="adresse" autocomplete="address-line1" required></label>' +
        '<label class="fe-champ">Complément (bâtiment, étage…)<input name="complement" autocomplete="address-line2"></label>' +
        '<div class="fe-deux"><label class="fe-champ">Code postal<input name="code_postal" autocomplete="postal-code" inputmode="numeric" required></label><label class="fe-champ">Ville<input name="ville" autocomplete="address-level2" required></label></div>' +
        '<label class="fe-champ">Téléphone (pour le livreur, facultatif)<input name="telephone" type="tel" autocomplete="tel"></label>' +
        '<input type="text" name="_gotcha" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true">' +
        '<label class="fe-accord"><input type="checkbox" name="accord" required> <span>J’ai vérifié l’aperçu (prénoms, dates, titre). C’est un objet personnalisé, fabriqué pour moi : il ne peut pas être repris ni échangé, sauf défaut d’impression. <a href="confidentialite.html" target="_blank">Mes données</a></span></label>' +
        '<button class="bt plein rap-gros" type="submit">Commander</button><p class="fe-aide" id="fe-imp-statut" aria-live="polite"></p>' +
      '</form></div>';
  }
  function session() { try { var x = JSON.parse(localStorage.getItem('sb-qsvzzkjtjsznfntahvvh-auth-token') || 'null'); return x && x.access_token ? x : null; } catch (e) { return null; } }
  function deposer(blob, nom, ext, type) {
    var x = session(), d = new Date(), chemin = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7) + '-' + nom + '.' + (ext || 'jpg');
    var hd = { apikey: 'sb_publishable_6iEVxXmtB_u1hJ6mPS9fNg_CJhLjYkg', 'Content-Type': type || 'image/jpeg', 'x-upsert': 'false' };
    if (x && x.expires_at * 1000 > Date.now()) hd.Authorization = 'Bearer ' + x.access_token;
    return fetch('https://qsvzzkjtjsznfntahvvh.supabase.co/storage/v1/object/impressions/' + chemin, { method: 'POST', headers: hd, body: blob })
      .then(function (r) { return r.ok ? chemin : ''; }).catch(function () { return ''; });
  }
  /* Fichier pour l'imprimeur (normes Gelato) : PDF à la taille du format + 4 mm de fond perdu, décor HD, une image aplatie.
     Si le PDF ne peut pas être déposé, on dépose la même image en JPEG (accepté aussi par Gelato). Renvoie le chemin dans Storage, ou ''. */
  function chargerJsPdf() {
    return window.jspdf ? Promise.resolve(window.jspdf.jsPDF) : new Promise(function (ok, ko) { var sc = document.createElement('script'); sc.src = 'assets/jspdf.umd.min.js'; sc.onload = function () { ok(window.jspdf.jsPDF); }; sc.onerror = ko; document.head.appendChild(sc); });
  }
  /* Grands formats : l'image est dessinée en bandes horizontales (chaque bande reste sous la limite du navigateur, iPhone compris),
     pour atteindre 300 dpi sur ordinateur (200 sur iPhone) sur toute l'affiche (Gelato conseille 150 dpi au moins, 300 idéal). Les bandes se recouvrent de 2 pixels : aucun liseré blanc. */
  function versBandes(svg, lw, maxPx) {
    var t = svg.match(/width="(\d+)" height="(\d+)"/), lh = Math.round(lw * (t ? t[2] / t[1] : 1.414)), hb = Math.max(256, Math.floor(maxPx / lw));
    return new Promise(function (ok, ko) {
      var img = new Image(), url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' })), bandes = [], y = 0;
      img.onload = function () {
        (function suivante() {
          if (y >= lh) { URL.revokeObjectURL(url); ok({ bandes: bandes, lh: lh }); return; }
          var h = Math.min(hb, lh - y), hd = Math.min(h + 2, lh - y), c = document.createElement('canvas'); c.width = lw; c.height = hd;
          var ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, lw, hd); ctx.drawImage(img, 0, -y, lw, lh);
          c.toBlob(function (b) { c.width = c.height = 1; if (!b) { URL.revokeObjectURL(url); ko(new Error('bande')); return; } bandes.push({ b: b, y: y, h: hd }); y += h; setTimeout(suivante, 0); }, 'image/jpeg', .9);
        })();
      };
      img.onerror = function () { URL.revokeObjectURL(url); ko(new Error('image')); };
      img.src = url;
    });
  }
  function fichierImprimeur(d, fmt) {
    var pay = paysage(d.style), mm0 = fmt.mm || [218, 305], mm = pay ? [mm0[1], mm0[0]] : mm0, larg = pay ? Math.round(mm[0] / 25.4 * 300) : fmt.largeur;
    var grandF = classe(fmt.id) === 'g50' || classe(fmt.id) === 'g70', ios = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    var nom = nomFichier(d) + '-' + fmt.id + (pay ? '-horizontal' : '');
    d.a3 = ECH[classe(fmt.id)];
    function enPdf(Pdf, parts, lh) {
      var doc = new Pdf({ orientation: pay ? 'landscape' : 'portrait', unit: 'mm', format: mm0, compress: true, putOnlyUsedFonts: true });
      doc.setProperties({ title: d.titre + ' · Genesolia', creator: 'Genesolia' });
      parts.forEach(function (x) { doc.addImage(x.u8, 'JPEG', 0, x.y / lh * mm[1], mm[0], x.h / lh * mm[1], undefined, 'NONE'); });
      return deposer(doc.output('blob'), nom, 'pdf', 'application/pdf');
    }
    /* une seule image (A4, A3 à 300 dpi ; et en secours pour les grands formats) */
    function simple(lw) {
      return svgAutonome(d, false, { hd: true, fondPerdu: true }).then(function (svg) { return versPng(svg, lw, true); }).then(function (jpeg) {
        var enJpeg = function () { return deposer(jpeg, nom, 'jpg', 'image/jpeg'); };
        return Promise.all([chargerJsPdf(), jpeg.arrayBuffer()]).then(function (x) {
          var t = Math.round(lw * mm[1] / mm[0]);
          return enPdf(x[0], [{ u8: new Uint8Array(x[1]), y: 0, h: t }], t);
        }).then(function (chemin) { return chemin || enJpeg(); }, enJpeg);
      });
    }
    var repli = function () { return simple(Math.round(Math.min(mm[0] / 25.4 * 300, Math.sqrt((ios ? 16e6 : 40e6) * mm[0] / mm[1])))); };
    if (!grandF) return simple(larg).catch(function () { return ''; });
    var lw200 = Math.round(mm[0] / 25.4 * (ios ? 200 : 300));   /* 300 dpi sur ordinateur ; 200 dpi sur iPhone et iPad (au-delà, Safari ne sait plus dessiner l'image) */
    return svgAutonome(d, false, { hd: true, fondPerdu: true }).then(function (svg) { return versBandes(svg, lw200, ios ? 12e6 : 30e6); }).then(function (r) {
      return Promise.all([chargerJsPdf()].concat(r.bandes.map(function (x) { return x.b.arrayBuffer(); }))).then(function (x) {
        return enPdf(x[0], r.bandes.map(function (bd, i) { return { u8: new Uint8Array(x[i + 1]), y: bd.y, h: bd.h }; }), r.lh);
      });
    }).then(function (chemin) { return chemin || repli(); }, repli).catch(function () { return ''; });
  }
  function brancherImpression() {
    var pv = document.getElementById('fe-imp-prevenir');
    if (pv) {
      var xs = session(); if (xs && xs.user && xs.user.email) pv.email.value = xs.user.email;
      pv.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var st = document.getElementById('fe-prev-statut'), e = pv.email.value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) { st.textContent = 'Indique une adresse e-mail valide.'; return; }
        pv.querySelector('button').disabled = true;
        window.GenesoliaEnvoyer('Arbre imprimé : me prévenir', { email: e, ouverture: IMP.ouverture })
          .then(function () { pv.outerHTML = '<p class="fe-merci">C’est noté : tu seras prévenue dès l’ouverture.</p>'; })
          .catch(function () { pv.querySelector('button').disabled = false; st.textContent = 'L’envoi n’a pas fonctionné. Réessaie dans un instant.'; });
      });
      return;
    }
    var o = document.getElementById('fe-imp-ouvrir'), f = document.getElementById('fe-imp-form'); if (!o || !f) return;
    var x = session(); if (x && x.user && x.user.email) f.email.value = x.user.email;
    o.addEventListener('click', function () { f.hidden = false; o.hidden = true; majGens(); dessiner(); f.prenom.focus(); });
    /* option cadeau : le petit mot s'imprime en bas de l'affiche, à la place de la signature Genesolia */
    var tm = null;
    function majMot() { var c = document.getElementById('fe-cadeau'), m = document.getElementById('fe-mot'); document.getElementById('fe-cadeau-z').hidden = !c.checked; choix.mot = c.checked ? m.value.replace(/\s+/g, ' ').trim() : ''; clearTimeout(tm); tm = setTimeout(dessiner, 250); }
    document.getElementById('fe-cadeau').addEventListener('change', majMot);
    document.getElementById('fe-mot').addEventListener('input', majMot);
    f.addEventListener('change', function (e) { if (e.target.name === 'format') { choix.formatManuel = true; if (lig() && !choix.nbGen) { recalculer(); majGens(); } dessiner(); } });
    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var st = document.getElementById('fe-imp-statut'), bt = f.querySelector('button[type=submit]');
      if (f._gotcha.value) return;
      var manque = ['prenom', 'nom_complet', 'adresse', 'code_postal', 'ville'].filter(function (k) { return !f[k].value.trim(); });
      if (manque.length || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim())) { st.textContent = 'Complète ton prénom, ton e-mail et l’adresse de livraison.'; return; }
      if (!/^\d{5}$/.test(f.code_postal.value.trim())) { st.textContent = 'Vérifie le code postal (5 chiffres, France métropolitaine).'; return; }
      if (!f.accord.checked) { st.textContent = 'Coche la case pour confirmer l’aperçu.'; return; }
      var fmt = IMP.formats.filter(function (x2) { return x2.id === (f.querySelector('input[name=format]:checked') || {}).value; })[0] || IMP.formats[0];
      if (donnees.nbGen > (CAP[classe(fmt.id)] || 0) && !grand()) { st.textContent = 'Avec autant de générations, choisis un format plus grand.'; return; }
      var d = lire(), lien = (window.GENESOLIA_STRIPE || {})[fmt.stripe] || '';
      /* référence de la commande : relie le paiement Stripe à cette commande (et donc à l'envoi chez l'imprimeur) */
      var ref = Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
      var lienPaiement = lien ? lien + (lien.indexOf('?') < 0 ? '?' : '&') + 'prefilled_email=' + encodeURIComponent(f.email.value.trim()) + '&client_reference_id=' + encodeURIComponent('imp__' + ref) : '';
      bt.disabled = true; st.textContent = 'Préparation de ton arbre en haute définition…';
      fichierImprimeur(d, fmt).then(function (chemin) {
        var fd = new FormData(f); fd.delete('accord'); fd.delete('format');
        fd.append('format', fmt.id); fd.append('format_nom', fmt.nom); fd.append('prix', fmt.prix); fd.append('titre', d.titre); fd.append('sous_titre', d.sousTitre || '');
        fd.append('fichier', chemin || 'à régénérer depuis l’arbre de la cliente'); fd.append('pays', 'France'); fd.append('paiement', lien ? 'stripe' : 'a-envoyer');
        fd.append('arbre', JSON.stringify(d.moi, function (k, v) { return k.charAt(0) === '_' && k !== '_id' && k !== '_u' ? undefined : v; }).slice(0, 3000));   /* sans les repères de dessin (_enfant renvoie vers l'enfant : boucle) */ fd.append('ref', ref); fd.append('style', d.style || ''); fd.append('generations', String(d.nbGen || '')); fd.append('enfants', String((d.enfants || []).length)); fd.append('conjoint', d.conjoint ? 'oui' : 'non'); fd.append('orientation', paysage(d.style) ? 'paysage' : 'portrait');
        if (lienPaiement) fd.append('lien_paiement', lienPaiement);   /* pour la relance « ton arbre t'attend » si le paiement n'aboutit pas */
        /* pas de mail avant le paiement : la confirmation part quand Stripe a validé le paiement (fonction stripe-webhook) */
        return window.GenesoliaEnvoyer('Commande impression', fd, lien ? '' : 'genesolia-commande');
      }).then(function () {
        if (window.umami) try { window.umami.track('commande-impression-' + fmt.id); } catch (e) {}
        if (lien) {
          st.textContent = 'Commande enregistrée. Direction le paiement sécurisé…';
          location.href = lienPaiement;
          return;
        }
        f.outerHTML = '<p class="fe-merci">Merci ! Ta commande est bien reçue : <b>' + esc(fmt.nom) + '</b>, ' + esc(fmt.prix) + '. Tu reçois une confirmation par e-mail, puis le lien de paiement sécurisé. Ton arbre part à l’impression dès le paiement reçu.</p>';
      }).catch(function () { bt.disabled = false; st.textContent = 'L’envoi n’a pas fonctionné. Vérifie ta connexion et réessaie.'; });
    });
  }
  /* Nombre de générations : 3 ou 4 en A4 ; 5 seulement en A3 (en A4, les dates feraient moins de 8 points) */
  function majGens() {
    var sel = document.getElementById('fe-gens'); if (!sel || !donnees) return;
    var opts = [];
    var maxN = Math.min(dispo, capMax());
    var plus = desc() ? 0 : (donnees.couple ? -1 : 0) + (donnees.enfants && donnees.enfants.length ? 1 : 0);   /* comme le sous-titre : les rangées imprimées (enfants compris) */
    /* le Grand arbre n'existe qu'en 4 ou 5 générations ; il demande au moins les arrière-grands-parents */
    var gR = document.querySelector('input[name=fe-style][value=grand]'), dG = (lignee(choix.depart, 5) || { nb: 0 }).nb;
    if (gR) { gR.disabled = dG < 4; gR.closest('label').title = dG < 4 ? 'Le Grand arbre demande au moins 4 générations (jusqu’à tes arrière-grands-parents).' : ''; }
    for (var n = grand() ? 4 : 2; n <= maxN; n++) opts.push('<label class="fe-gen-c"><input type="radio" name="fe-gen" value="' + n + '"' + (n === donnees.nbGen ? ' checked' : '') + '><span><b>' + (n + plus) + '</b> génération' + (n + plus > 1 ? 's' : '') + '<small>' + (grand() ? 'en A3' : { a4: 'dès l’A4', a3: n > 5 || lig() ? 'dès l’A3' : 'en A3', g50: 'dès 50 × 70 cm', g70: 'en 70 × 100 cm' }[classeMin(n)]) + '</small></span></label>');
    sel.innerHTML = opts.join('');
    var aide = document.getElementById('fe-gens-aide');
    var vides = grand() ? Math.pow(2, donnees.nbGen) - 1 - remplis(donnees.moi, 0, donnees.nbGen) : 0;   /* le dessin a exactement les rangées choisies */
    /* les textes d'aide parlent comme le menu : en rangées imprimées, enfants compris */
    function lab(n) { var t = GEN[Math.max(1, Math.min(n + plus, GEN.length)) - 1] || (n + plus) + ' générations'; return '« ' + t + ' »'; }
    var loin = grand() || !lig() ? ((lignee(choix.depart, 10) || { nb: 0 }).nb) : dispo;
    if (aide) aide.textContent = grand() ? 'Le Grand arbre porte 4 ou 5 générations (15 ou 31 médaillons) et s’imprime en A3, pour que chaque nom reste bien lisible.' + (vides ? ' ' + vides + ' médaillon' + (vides > 1 ? 's resteront vides' : ' restera vide') + ' (ancêtres inconnus) : complète ton arbre' + (donnees.nbGen > 4 ? ', ou choisis 4 générations.' : ' pour un poster complet.') : ' Tous les médaillons seront remplis.') + (loin > 5 ? ' Ton arbre remonte plus loin : le style « Lignée » peut montrer toutes tes générations.' : '')
      : lig()
      ? (donnees.nbGen > capA3 ? 'Avec autant de générations, ton arbre s’imprime en grand format (' + (donnees.nbGen > CAP.g50 ? '70 × 100 cm' : '50 × 70 ou 70 × 100 cm') + ') : chaque nom reste lisible.'
        : donnees.nbGen > capA4 ? 'Lisible à partir de l’A3 avec autant de générations : l’A4 est désactivé.'
        : (Math.min(dispo, CAP.g70) > donnees.nbGen ? 'Ton arbre va plus loin : jusqu’à ' + lab(Math.min(dispo, capA3)) + ' en A3' + (Math.min(dispo, CAP.g70) > Math.min(dispo, capA3) ? ', et ' + lab(Math.min(dispo, CAP.g70)) + ' en grand format 70 × 100 cm.' : '.') : ''))
      : (donnees.nbGen === 5 ? lab(5) + ' : lisible en A3 seulement. L’A4 est désactivé.' + (loin > 5 ? ' Ton arbre remonte plus loin : le style « Lignée » peut tout montrer.' : '') : (dispo >= 5 ? 'Ton arbre va plus loin : choisis ' + lab(5) + ' pour l’A3.' : ''));
    if (!choix.sousModifie && document.getElementById('fe-sous')) document.getElementById('fe-sous').value = donnees.sousTitre;
    /* formats d'impression : l'A4 n'est pas proposé avec cinq générations */
    document.querySelectorAll('#fe-imp-form input[name=format]').forEach(function (r) {
      var f = (IMP.formats || []).filter(function (x) { return x.id === r.value; })[0] || {}, a4 = /^a4/.test(f.id || '');
      var cl = classe(f.id || ''), big = cl === 'g50' || cl === 'g70';
      r.disabled = (big && !grandsFormats()) || (a4 && grand()) || (!grand() && donnees.nbGen > (CAP[cl] || 0) && !(lig() && !choix.nbGen));   /* réglage automatique : chaque format garde ses propres générations */
      r.closest('label').hidden = big && !grandsFormats();   /* styles à l'horizontale en réglage automatique : l'A4 reste proposé, avec ses générations */ r.closest('label').classList.toggle('fe-off', r.disabled);
      if (r.disabled && r.checked) r.__aRemplacer = true;
    });
    var gA = document.querySelector('#fe-imp-form .fe-grands-aide'); if (gA) gA.hidden = !grandsFormats();   /* grands formats masqués : leur délai aussi */
    /* tant que la cliente n'a pas choisi elle-même : le plus petit format où tout reste lisible */
    if (!choix.formatManuel) { var p0 = [].filter.call(document.querySelectorAll('#fe-imp-form input[name=format]'), function (x) { return !x.disabled && (!donnees || !(donnees.nbGen > (CAP[classe(x.value)] || 0)) || grand()); })[0]; if (p0) p0.checked = true; }
    /* format coché devenu impossible : le plus petit format possible */
    [].forEach.call(document.querySelectorAll('#fe-imp-form input[name=format]'), function (r) {
      if (!r.__aRemplacer) return; r.__aRemplacer = false;
      var cad = /cadre/.test(r.value), tous = [].filter.call(document.querySelectorAll('#fe-imp-form input[name=format]'), function (x) { return !x.disabled; });
      var nv = tous.filter(function (x) { return /cadre/.test(x.value) === cad; })[0] || tous[0]; if (nv) nv.checked = true;
    });
    /* le bouton « Commander » annonce le prix le plus bas parmi les formats possibles (Grand arbre : A3 seulement) */
    var ok = [].filter.call(document.querySelectorAll('#fe-imp-form input[name=format]'), function (r) { return !r.disabled; }).map(function (r) { var f = (IMP.formats || []).filter(function (x) { return x.id === r.value; })[0]; return f ? parseFloat(String(f.prix).replace(',', '.')) : NaN; }).filter(function (n) { return !isNaN(n); });
    var bo = document.getElementById('fe-imp-ouvrir'); if (bo && ok.length) bo.textContent = 'Commander mon poster · dès ' + String(Math.min.apply(null, ok)).replace('.', ',') + ' €';
  }
  /* Ce que la cliente reçoit (fiches Gelato « prêt à accrocher », papier premium mat 200 g) */
  var PAPIER = 'papier d’art mat 200 g/m², non couché';
  var INFOS = {
    a4: '21 × 29,7 cm, ' + PAPIER, a3: '29,7 × 42 cm, ' + PAPIER,
    g50: '50 × 70 cm, ' + PAPIER, g70: '70 × 100 cm, ' + PAPIER
  };
  var RECU = '<details class="fe-recu"><summary>Ce que tu reçois</summary><ul>' +
    '<li><b>Le papier</b> : un papier d’art mat de 200 g/m², non couché. Épais et rigide, au toucher doux et naturel, sans aucun reflet : les dorés et les couleurs restent douces, comme sur une illustration.</li>' +
    '<li><b>Les formats</b> : A4 (21 × 29,7 cm), A3 (29,7 × 42 cm), 50 × 70 cm et 70 × 100 cm. Des formats standards : tu trouves facilement un cadre à sa taille, si tu veux l’encadrer.</li>' +
    '<li><b>Bien protégé</b> : expédié dans un emballage rigide, sans pli.</li>' +
    '<li><b>Livré chez toi en 3 à 7 jours ouvrés</b> après ta commande, fabrication comprise : il est imprimé pour toi, à la commande, puis expédié dans un emballage protégé, en France métropolitaine. Livraison comprise.</li>' +
    '<li><b>Tranquillité</b> : s’il arrive abîmé ou s’il y a une erreur d’impression, envoie-nous une photo dans les 14 jours, il est réimprimé ou remboursé. Un colis perdu est renvoyé. Comme c’est un objet personnalisé, il ne peut pas être repris pour un changement d’avis. Les couleurs peuvent varier légèrement entre l’écran et le papier.</li>' +
    '</ul><p><a href="cgv.html#arbre-imprime" target="_blank">Conditions de vente de l’arbre imprimé</a></p></details>';
  /* à l'horizontale, les dimensions s'écrivent largeur × hauteur : « 23,4 × 32,1 cm » devient « 32,1 × 23,4 cm » */
  function dimensions(t) { return paysage() ? String(t).replace(/(\d+(?:,\d+)?) × (\d+(?:,\d+)?) cm/, '$2 × $1 cm') + ', à l’horizontale' : t; }
  function lire() { var tv = document.getElementById('fe-titre').value.trim(); donnees.titre = lumiere() ? tv : tv || donnees.titre; donnees.sousTitre = document.getElementById('fe-sous').value.trim(); donnees.dedicace = choix.mot || ''; return donnees; }
  function dessiner() {
    var z = document.getElementById('fe-apercu'); if (!z) return;
    var d = lire(), verif = window.GenesoliaAcces ? window.GenesoliaAcces.verifier('arbreEncadrer') : Promise.resolve(true);
    var sc = window.ArbreEncadrer.sceneOk ? window.ArbreEncadrer.sceneOk(d) : d.style === 'figuier', vue = choix.vue === 'scene' && sc ? 'scene' : 'affiche', vues = document.getElementById('fe-vues');
    if (vues) { vues.hidden = !sc; vues.querySelectorAll('[data-vue]').forEach(function (b) { b.setAttribute('aria-selected', String(b.getAttribute('data-vue') === vue)); }); }
    /* le format montré : celui coché dans la commande, sinon le plus petit qui garde le texte lisible */
    var coche = document.querySelector('#fe-imp-form input[name=format]:checked'), fid = coche && !coche.disabled ? coche.value : (d.nbGen > a4Max() ? (d.nbGen > capA3 && grandsFormats() ? (d.nbGen > CAP.g50 ? 'g70' : 'g50') : 'a3') : 'a4');
    var f = ((window.GENESOLIA_IMPRESSION || {}).formats || []).filter(function (x) { return x.id === fid; })[0];
    var cl = classe(fid), grandF = cl === 'g50' || cl === 'g70';
    d.a3 = ECH[cl];   /* styles à l'horizontale : tailles de texte prévues pour le format */
    var imp = corps.querySelector('.fe-imp'), ln = document.getElementById('fe-lum-note'), e5 = document.getElementById('fe-etape5');
    if (imp) imp.style.display = lumiere() ? 'none' : ''; if (ln) ln.hidden = !lumiere(); if (e5) e5.textContent = lumiere() ? 'À télécharger' : 'Ton poster';
    var leg = document.getElementById('fe-legende');
    if (leg && lumiere()) { leg.innerHTML = 'À télécharger : image haute définition (300 dpi) ou PDF à imprimer'; }
    else if (leg) leg.innerHTML = vue === 'scene' ? 'Mise en scène pour l’inspiration : tu reçois le poster seul, sans les fleurs.' :
      esc(f ? f.nom + ' · ' + f.prix : 'Poster A4') + '<br>' + esc(dimensions(INFOS[cl] || '') + (ouvert() ? (grandF ? ' · livré en 6 à 11 jours ouvrés' : ' · livré en 3 à 7 jours ouvrés') : ' · à commander à partir du ' + quandOuverture()));
    verif.then(function (ok) { z.innerHTML = window.ArbreEncadrer.svg(d, { apercu: !ok, scene: vue === 'scene' }); nomsCoupes(z.querySelector('svg'), d); });
  }
  /* Alerte « nom raccourci » : un prénom ou un nom qu'on ne retrouve pas en entier sur l'affiche (trop long pour sa place) */
  function nomsCoupes(svg, d) {
    var p = document.getElementById('fe-coupes'); if (!p) return;
    if (!svg) { p.hidden = true; return; }
    function n(t) { return String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, ''); }
    var texte = n([].map.call(svg.querySelectorAll('text'), function (t) { return t.textContent; }).join(' '));
    var gens = [], vus = {};
    (function aller(q) { if (q && q.couple) { aller(q.pere); aller(q.mere); return; } if (!q || vus[q.id || (q.prenom + q.nom + q.naissance)]) return; vus[q.id || (q.prenom + q.nom + q.naissance)] = 1; gens.push(q); aller(q.pere); aller(q.mere); (q.enf || []).forEach(aller); })(d.moi);
    (d.freresSoeurs || []).concat(d.enfants || [], d.conjoint ? [d.conjoint] : []).forEach(function (q) { if (q) gens.push(q); });
    /* une personne absente de ce style (conjoint, frères et sœurs non dessinés) n'est pas « raccourcie » : on ne signale que celles dont on voit une partie du nom */
    var coupes = gens.filter(function (q) { var pr = n(q.prenom), no = n(q.nom), p1 = n(String(q.prenom || '').trim().split(/[\s-]+/)[0]); if (p1 && texte.indexOf(p1) < 0) return false; return (pr && texte.indexOf(pr) < 0) || (no && texte.indexOf(no) < 0); })
      .map(function (q) { return [q.prenom, q.nom].filter(Boolean).join(' ').trim(); }).filter(Boolean);
    p.hidden = !coupes.length;
    if (coupes.length) p.innerHTML = '<b>Vérifie ' + (coupes.length > 1 ? 'ces noms' : 'ce nom') + ' :</b> ' + coupes.slice(0, 6).map(esc).join(', ') + (coupes.length > 6 ? '…' : '') + ' ' + (coupes.length > 1 ? 'sont trop longs' : 'est trop long') + ' pour sa place et ' + (coupes.length > 1 ? 'apparaissent' : 'apparaît') + ' raccourci' + (coupes.length > 1 ? 's' : '') + ' sur l’affiche. Si tu préfères, garde un seul prénom dans sa fiche.';
  }
  /* Loupe : l'aperçu en grand, avec zoom (boutons, molette, pincement) et déplacement à la souris ou au doigt */
  function loupe() {
    var src = document.getElementById('fe-apercu'), svg = src && src.querySelector('svg'); if (!svg) return;
    var o = document.createElement('div'); o.className = 'fe-zoom'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-label', 'Aperçu agrandi');
    o.innerHTML = '<div class="fe-zoom-barre"><button type="button" data-z="-" aria-label="Dézoomer">−</button><button type="button" data-z="1">Ajuster</button><button type="button" data-z="+" aria-label="Zoomer">+</button><button type="button" data-z="x" class="fe-zoom-x" aria-label="Fermer">Fermer ✕</button></div><div class="fe-zoom-vue"><div class="fe-zoom-img"></div></div>';
    var img = o.querySelector('.fe-zoom-img'), vue = o.querySelector('.fe-zoom-vue'); img.innerHTML = svg.outerHTML;
    /* l'affiche entière d'abord (portrait ou paysage), centrée ; « Ajuster » y revient ; la molette fait défiler, Ctrl + molette (ou pincer) zoome */
    var k = 1, x = 0, y = 0, vb = (svg.getAttribute('viewBox') || '0 0 2480 3508').split(/[\s,]+/).map(Number), ratio = vb[2] / vb[3];
    function ajuster() {
      var r = vue.getBoundingClientRect(), w = Math.min(r.width - 24, (r.height - 24) * ratio);
      img.style.width = w + 'px'; k = 1; x = (r.width - w) / 2; y = (r.height - w / ratio) / 2; poser();
    }
    function poser() { img.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + k + ')'; }
    function zoom(f, cx, cy) {
      var r = vue.getBoundingClientRect(); cx = cx == null ? r.width / 2 : cx - r.left; cy = cy == null ? r.height / 2 : cy - r.top;
      var nk = Math.max(1, Math.min(6, k * f)); if (nk === 1) { ajuster(); return; } x = cx - (cx - x) * nk / k; y = cy - (cy - y) * nk / k; k = nk; poser();
    }
    function fermer() { o.remove(); document.removeEventListener('keydown', touche); }
    function touche(e) { if (e.key === 'Escape') fermer(); else if (e.key === '+' || e.key === '=') zoom(1.4); else if (e.key === '-') zoom(1 / 1.4); }
    o.querySelector('.fe-zoom-barre').addEventListener('click', function (e) { var b = e.target.closest('[data-z]'); if (!b) return; var z = b.getAttribute('data-z'); if (z === 'x') fermer(); else if (z === '1') ajuster(); else zoom(z === '+' ? 1.4 : 1 / 1.4); });
    vue.addEventListener('wheel', function (e) { e.preventDefault(); if (e.ctrlKey || e.metaKey) zoom(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX, e.clientY); else { x -= e.deltaX; y -= e.deltaY; poser(); } }, { passive: false });
    window.addEventListener('resize', function () { if (document.body.contains(o)) ajuster(); });
    vue.addEventListener('dblclick', function (e) { zoom(k > 2.5 ? 1 / k : 2, e.clientX, e.clientY); });
    var pts = {}, depart = null;
    vue.addEventListener('pointerdown', function (e) { vue.setPointerCapture(e.pointerId); pts[e.pointerId] = [e.clientX, e.clientY]; depart = null; });
    vue.addEventListener('pointermove', function (e) {
      if (!pts[e.pointerId]) return;
      var ids = Object.keys(pts), av = pts[e.pointerId]; pts[e.pointerId] = [e.clientX, e.clientY];
      if (ids.length === 1) { x += e.clientX - av[0]; y += e.clientY - av[1]; poser(); }
      else if (ids.length === 2) {
        var a = pts[ids[0]], b = pts[ids[1]], d = Math.hypot(a[0] - b[0], a[1] - b[1]);
        if (depart) zoom(d / depart, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); depart = d;
      }
    });
    ['pointerup', 'pointercancel'].forEach(function (t) { vue.addEventListener(t, function (e) { delete pts[e.pointerId]; depart = null; }); });
    document.addEventListener('keydown', touche);
    document.body.appendChild(o); ajuster();
  }
  function statut(t) { var s = document.getElementById('fe-statut'); if (s) s.textContent = t; }
  /* Par mail d'abord : la page de l'arbre (à enregistrer en PDF ou imprimer), avec un lien de secours */
  var direct = false;
  function parMail(secours) {
    var d = lire();
    window.GenesoliaParMail.envoyer({ quoi: 'ton arbre à encadrer', secours: function () { direct = true; try { secours(); } finally { direct = false; } },
      html: svgAutonome(d, false).then(function (svg) {
        return '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>' + esc(d.titre) + ' · Genesolia</title><style>@page{size:A4' + (paysage(d.style) ? ' landscape' : '') + ';margin:0}html,body{margin:0;background:#fff}svg{display:block;width:' + (paysage(d.style) ? '297mm' : '210mm') + ';max-width:100%;height:auto;margin:0 auto}.barre{position:sticky;top:0;padding:12px;background:#4A0F36;color:#fff;font:16px sans-serif;text-align:center}.barre button{margin-left:10px;padding:8px 16px;border-radius:99px;border:0;background:#E8C899;font-weight:700}@media print{.barre{display:none}svg{width:' + (paysage(d.style) ? '297mm;height:210mm' : '210mm;height:297mm') + '}}</style></head><body><div class="barre">Ton arbre Genesolia<button onclick="print()">Enregistrer en PDF</button></div>' + svg + '</body></html>';
      }) });
  }
  function telechargerPng() {
    if (!direct && window.GenesoliaParMail) return parMail(telechargerPng);
    var d = lire(); statut('Préparation de ton image…');
    svgAutonome(d, false, { hd: true }).then(function (svg) { return versPng(svg, paysage(d.style) ? 3508 : 2480); }).then(function (b) {
      var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = nomFichier(d) + '.png';
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
      statut('Ton image est téléchargée.');
      if (window.umami) try { window.umami.track('arbre-encadrer-png'); } catch (e) {}
    }).catch(function () { statut('L’image n’a pas pu être créée. Essaie « Imprimer ou enregistrer en PDF ».'); });
  }
  function imprimer() {
    if (!direct && window.GenesoliaParMail) return parMail(imprimer);
    var d = lire(), w = window.open('', '_blank');
    if (!w) { statut('Autorise les fenêtres pour ce site, puis réessaie.'); return; }
    w.document.write('<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>' + esc(d.titre) + '</title><style>@page{size:A4' + (paysage(d.style) ? ' landscape' : '') + ';margin:0}html,body{margin:0}svg{display:block;width:' + (paysage(d.style) ? '297mm;height:210mm' : '210mm;height:297mm') + '}.barre{position:fixed;top:0;left:0;right:0;padding:12px;background:#4A0F36;color:#fff;font:16px sans-serif;text-align:center}.barre button{margin-left:10px;padding:8px 16px;border-radius:99px;border:0;background:#E8C899;font-weight:700}@media print{.barre{display:none}}</style></head><body><div class="barre">Ton arbre est prêt<button onclick="print()">Enregistrer en PDF</button></div><p style="padding:80px 20px;font:16px sans-serif">Un instant…</p></body></html>');
    w.document.close();
    svgAutonome(d, false, { hd: true }).then(function (svg) {
      w.document.body.innerHTML = '<div class="barre">Ton arbre est prêt<button onclick="print()">Enregistrer en PDF</button></div>' + svg;
      setTimeout(function () { try { w.focus(); w.print(); } catch (e) {} }, 700);
      if (window.umami) try { window.umami.track('arbre-encadrer-pdf'); } catch (e) {}
    });
  }
  bt.addEventListener('click', function () { afficher(); window.GenoArbre.ouvrir('fen-encadrer'); });
  /* genosociogramme.html#encadrer ouvre la fenêtre du poster ; #lumiere l'ouvre sur « Ma lignée en lumière » (liens de la page Offrir et de l'appli du Pass) */
  function ouvrirParLien() {
    var h = location.hash; if (h !== '#encadrer' && h !== '#lumiere') return;
    setTimeout(function () {
      if (h === '#lumiere') { choix.style = 'lumiere'; choix.choisi = true; }
      afficher(); window.GenoArbre.ouvrir('fen-encadrer');
      try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    }, 900);
  }
  if (document.readyState === 'complete') ouvrirParLien(); else window.addEventListener('load', ouvrirParLien);
})();
