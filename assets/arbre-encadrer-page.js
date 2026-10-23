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
  var capA4 = 4, capA3 = 5;
  function paysage(st) { return !!(window.ArbreEncadrer.paysage && window.ArbreEncadrer.paysage(st || choix.style)); }
  function motif() { return choix.style === 'medaillons' ? 'medaillons' : ''; }
  function remplis(p, g, max) { return !p || g >= max ? 0 : 1 + remplis(p.pere, g + 1, max) + remplis(p.mere, g + 1, max); }
  /* « avec mes enfants » : pour le Grand arbre et les styles à l'horizontale */
  function avecEnfantsPossible() { return choix.style === 'grand' || paysage(); }
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
    if (lc) { lc.hidden = !donnees.aConjoint || !(avecEnfantsPossible() || desc()) || famille(); var tc = document.getElementById('fe-conjoint-t'), c0 = desc() ? descendants(choix.depart, 1) : lignee(choix.depart, 1); if (tc && c0 && c0.conjoint) tc.textContent = (donnees.departEstMoi ? 'Avec mon conjoint · ' : 'Avec son conjoint · ') + (c0.conjoint.prenom + ' ' + c0.conjoint.nom).trim(); }
    var fa = document.getElementById('fe-famille-aide'); if (fa) fa.hidden = !(famille() && donnees.sansCouple);
    if (ac) { ac.hidden = !(donnees.conjointRefus && (avecEnfantsPossible() || desc())) || famille(); ac.textContent = donnees.conjointRefus ? donnees.conjointRefus + ' n’est pas l’autre parent de tous les enfants : pour ne rien laisser croire de faux, il n’est pas ajouté à côté de toi.' : ''; }
    var t = document.getElementById('fe-enfants-t'); if (t) t.textContent = (donnees.departEstMoi ? 'Avec mes enfants' : 'Avec ses enfants') + ' (' + donnees.nbEnfants + '), au pied de l’arbre';
  }
  function grand() { return choix.style === 'grand'; }
  /* Périodes de cadeaux : le bon modèle est proposé d'office et mis en avant (dates du calendrier français, à peu près) */
  var SAISONS = [
    { du: '11-01', au: '12-24', nom: 'Noël', badge: 'Idée Noël', style: 'famille', texte: 'Pour Noël, offre « Notre famille » : votre couple, vos deux lignées et vos enfants réunis. Commande avant le 14 décembre pour le recevoir à temps.',
      autre: { style: 'descendants', texte: 'Pour Noël, offre « Descendants » à tes parents ou grands-parents : toute la famille qu’ils ont fondée. Commande avant le 14 décembre pour le recevoir à temps.' } },
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
    if (x.style === 'descendants') { var d = descendants('', 3); return !!(d && d.nb >= 3); }
    return true;
  }
  function famille(st) { return (st || choix.style) === 'famille'; }   /* « Notre famille » : le couple, ses deux lignées, leurs enfants */
  function desc(st) { return (st || choix.style) === 'descendants'; }   /* « Descendants » : une personne (ou un couple), ses enfants, petits-enfants… */   /* « Grand arbre » : l'arbre peint, 5 générations, en A3 seulement */
  function formatChoisi() { var c = document.querySelector('#fe-imp-form input[name=format]:checked'); return c && !c.disabled ? c.value : (grand() ? 'a3cadre' : 'a4cadre'); }
  function a4Max() { return grand() ? 0 : paysage() ? capA4 : 4; }

  function annee(d) { var m = String(d || '').match(/(\d{4})/); return m ? +m[1] : null; }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* L'arbre de la page devient une lignée : moi, mes parents, leurs parents, leurs parents */
  /* Personnes proposées comme point de départ : celles qui ont au moins un parent, de la plus jeune à la plus âgée */
  function departs() {
    var S = window.GenoArbre.etat(), P = S.people || {}, rels = S.rels || [];
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
    var defaut = null;
    if (moi) parentsDe(moi).sort(function (a, b) { return (P[b].sex === 'f') - (P[a].sex === 'f'); }).forEach(function (x) { if (!defaut && enfantsDe(x).some(function (e) { return enfantsDe(e).length; })) defaut = x; });
    if (!defaut && moi && enfantsDe(moi).length) defaut = moi;
    var racineId = depart && P[depart] && enfantsDe(depart).length ? depart : defaut || ids.sort(function (a, b) { return (annee(P[a].naiss) || 9999) - (annee(P[b].naiss) || 9999); })[0];
    var maxG = nbGen || 4, plusVieux = null, gens = 0, vus = {};
    function fiche(p) { return { prenom: p.prenom || '', nom: p.nom || '', sexe: p.sex === 'f' ? 'f' : 'm', naissance: annee(p.naiss), deces: annee(p.deces) || (p.decede ? '?' : null) }; }
    function construire(id, g) {
      if (vus[id]) return null; vus[id] = 1;
      var p = P[id], o = fiche(p); gens = Math.max(gens, g + 1);
      if (o.naissance && (!plusVieux || o.naissance < plusVieux)) plusVieux = o.naissance;
      o.enf = g < maxG - 1 ? enfantsDe(id).sort(function (a, b) { return (annee(P[a].naiss) || 9999) - (annee(P[b].naiss) || 9999); }).map(function (e) { return construire(e, g + 1); }).filter(Boolean) : [];
      return o;
    }
    var racine = construire(racineId, 0);
    var unions = rels.filter(function (r) { return r.type === 'couple' && (r.from === racineId || r.to === racineId); }).map(function (r) { return { id: r.from === racineId ? r.to : r.from, fini: r.statut === 'separe' || r.statut === 'divorce' }; }).filter(function (u) { return P[u.id]; });
    unions.sort(function (a, b) { return a.fini - b.fini; });
    var cj = unions[0] ? unions[0].id : null, conjoint = null, conjointRefus = '';
    if (cj) {
      if (enfantsDe(racineId).every(function (e) { return parentsDe(e).indexOf(cj) >= 0; })) { conjoint = fiche(P[cj]); conjoint.separe = unions[0].fini; }
      else conjointRefus = P[cj].prenom || 'Son conjoint';
    } else {   /* pas d'union notée : l'autre parent commun de tous les enfants */
      var e0 = enfantsDe(racineId), autres = e0.length ? parentsDe(e0[0]).filter(function (x) { return x !== racineId; }) : [];
      if (autres[0] && e0.every(function (e) { return parentsDe(e).indexOf(autres[0]) >= 0; })) conjoint = fiche(P[autres[0]]);
    }
    var pr = String(racine.prenom || '').trim().split(/\s+/)[0], nomF = String(racine.nom || '').trim().toLowerCase().replace(/(^|[\s\-'’])(\S)/g, function (m, a, b) { return a + b.toUpperCase(); });
    var titre = pr ? 'La famille ' + (/^[aeiouyéèêàâîïôûh]/i.test(pr) ? 'd’' : 'de ') + pr : (nomF ? 'La famille ' + nomF : 'Notre famille');
    return {
      titre: titre, sousTitre: GEN[Math.min(gens, GEN.length) - 1] + (plusVieux ? ' · depuis ' + plusVieux : ''),
      moi: racine, freresSoeurs: [], enfants: [], conjoint: conjoint, conjointRefus: conjointRefus, nb: gens, nbGen: gens, depart: racineId, departEstMoi: P[racineId].role === 'moi', descendants: true
    };
  }
  /* « Notre famille » : toi et ton conjoint côte à côte, chacun avec ses ancêtres, et vos enfants communs au pied */
  function couple(depart, nbGen) {
    var S = window.GenoArbre.etat(), P = S.people || {}, rels = S.rels || [];
    var L1 = lignee(depart, Math.max(1, (nbGen || 10) - 1)); if (!L1) return null;
    var moi = L1.depart;
    var unions = rels.filter(function (r) { return r.type === 'couple' && (r.from === moi || r.to === moi); }).map(function (r) { return { id: r.from === moi ? r.to : r.from, fini: r.statut === 'separe' || r.statut === 'divorce' }; }).filter(function (u) { return P[u.id]; });
    unions.sort(function (a, b) { return a.fini - b.fini; });
    if (!unions[0]) return null;
    var cj = unions[0].id, L2 = lignee(cj, Math.max(1, (nbGen || 10) - 1));
    function enfantsDe(id) { return rels.filter(function (r) { return r.type === 'parent' && r.from === id && P[r.to]; }).map(function (r) { return r.to; }); }
    var deCj = enfantsDe(cj), communs = enfantsDe(moi).filter(function (e, i, t) { return t.indexOf(e) === i && deCj.indexOf(e) >= 0; })
      .map(function (id) { var p = P[id]; return { prenom: p.prenom || '', nom: p.nom || '', sexe: p.sex === 'f' ? 'f' : 'm', naissance: annee(p.naiss), deces: annee(p.deces) || (p.decede ? '?' : null) }; })
      .sort(function (a, b) { return (a.naissance || 9999) - (b.naissance || 9999); }).slice(0, 6);
    var p1 = String(L1.moi.prenom || '').split(/\s+/)[0], p2 = String(L2.moi.prenom || '').split(/\s+/)[0], n = Math.max(L1.nb, L2.nb) + 1;
    var ans = []; (function a(q) { if (!q) return; if (q.naissance) ans.push(q.naissance); a(q.pere); a(q.mere); })(L1.moi); (function a(q) { if (!q) return; if (q.naissance) ans.push(q.naissance); a(q.pere); a(q.mere); })(L2.moi);
    return {
      titre: 'Notre famille', sousTitre: (p1 && p2 ? p1 + ' & ' + p2 : 'Nos deux lignées') + (ans.length ? ' · depuis ' + Math.min.apply(null, ans) : ''),
      moi: { couple: true, prenom: '', nom: '', pere: L1.moi, mere: L2.moi }, freresSoeurs: [], enfants: communs, conjoint: null, conjointRefus: '', nb: n, nbGen: n,
      depart: moi, departEstMoi: L1.departEstMoi, couple: true
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
      var o = { prenom: p.prenom || '', nom: p.nom || '', sexe: p.sex === 'f' ? 'f' : 'm', naissance: n, deces: annee(p.deces) || (p.decede ? '?' : null) };
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
    var freres = Object.keys(fs).slice(0, 4).map(function (id) { var p = P[id]; return { prenom: p.prenom || '', nom: p.nom || '', sexe: p.sex === 'f' ? 'f' : 'm', naissance: annee(p.naiss), deces: annee(p.deces) || (p.decede ? '?' : null) }; });
    freres.forEach(function (f) { if (f.naissance && f.naissance > (plusJeune || 0)) plusJeune = f.naissance; if (!f.deces && f.naissance && f.naissance > new Date().getFullYear() - 105) vivant = true; });
    /* ses enfants, du plus âgé au plus jeune (option « avec mes enfants », au pied de l'arbre) */
    var enfants = enfantsDe(moi).filter(function (id, i, t) { return t.indexOf(id) === i; }).map(function (id) { var p = P[id]; return { prenom: p.prenom || '', nom: p.nom || '', sexe: p.sex === 'f' ? 'f' : 'm', naissance: annee(p.naiss), deces: annee(p.deces) || (p.decede ? '?' : null) }; })
      .sort(function (a, b) { return (a.naissance || 9999) - (b.naissance || 9999); }).slice(0, 6);
    /* son ou sa conjoint·e : l'union en cours en priorité. Affiché seulement s'il est l'autre parent de TOUS ses enfants
       (sinon il laisserait croire qu'il est le parent de tous) */
    var unions = rels.filter(function (r) { return r.type === 'couple' && (r.from === moi || r.to === moi); }).map(function (r) { return { id: r.from === moi ? r.to : r.from, fini: r.statut === 'separe' || r.statut === 'divorce' }; }).filter(function (u) { return P[u.id]; });
    unions.sort(function (a, b) { return a.fini - b.fini; });
    var cj = unions[0] ? unions[0].id : null, enfantsIds = enfantsDe(moi), conjoint = null, conjointRefus = '';
    if (cj) {
      var tousDeLui = enfantsIds.every(function (e) { return parentsDe(e).indexOf(cj) >= 0; });
      if (tousDeLui) { var pc = P[cj]; conjoint = { prenom: pc.prenom || '', nom: pc.nom || '', sexe: pc.sex === 'f' ? 'f' : 'm', naissance: annee(pc.naiss), deces: annee(pc.deces) || (pc.decede ? '?' : null), separe: unions[0].fini }; }
      else conjointRefus = (P[cj].prenom || 'Ton conjoint');
    }
    var nomFamille = racine.nom || (racine.pere && racine.pere.nom) || '';
    /* Majuscule au nom de famille : « charron » donne « Charron » */
    nomFamille = String(nomFamille).trim().toLowerCase().replace(/(^|[\s\-'’])(\S)/g, function (m, a, b) { return a + b.toUpperCase(); }).replace(/ (De|Du|Des|La|Le|D’|D') /g, function (m) { return m.toLowerCase(); });
    return {
      titre: nomFamille ? 'La famille ' + nomFamille : 'Notre famille',
      /* « à aujourd'hui » seulement si quelqu'un de l'arbre est en vie ; sinon jusqu'à la naissance la plus récente */
      sousTitre: GEN[Math.min(gens, GEN.length) - 1] + (plusVieux ? ' · de ' + plusVieux + ' à ' + (vivant || !plusJeune || plusJeune === plusVieux ? 'aujourd’hui' : plusJeune) : ''),
      moi: racine, freresSoeurs: freres, enfants: enfants, conjoint: conjoint, conjointRefus: conjointRefus, nb: gens, nbGen: gens, depart: moi, departEstMoi: P[moi].role === 'moi'
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
    var fig = donnees.style === 'figuier', pay = paysage(donnees.style), gr = donnees.style === 'grand', med = donnees.style === 'medaillons' || (gr && ((donnees.enfants || []).length > 0 || !!donnees.conjoint));
    return Promise.all([gr ? enDataUrl(opt.hd ? 'assets/arbre/grand-arbre.jpg' : 'assets/arbre/grand-arbre-ecran.jpg') : pay ? '' : enDataUrl(fig ? (opt.hd ? 'assets/arbre/figuier.jpg' : 'assets/arbre/figuier-ecran.jpg') : (opt.hd ? 'assets/arbre/decor-hd.jpg' : 'assets/arbre/decor-a4.jpg')), enDataUrl('assets/polices/gilda-display-latin-400-normal.woff2'), enDataUrl('assets/polices/nunito-sans-latin-400-normal.woff2'), enDataUrl('assets/polices/nunito-sans-latin-600-normal.woff2'),
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
      var tout4 = descendants(choix.depart, 4), D = window.ArbreDescendants;
      dispo = tout4 ? tout4.nb : 0;
      if (tout4 && !choix.conjoint) tout4.conjoint = null;
      capA4 = tout4 ? D.capacite(tout4, false) : 2; capA3 = tout4 ? Math.max(capA4, D.capacite(tout4, true)) : 2;
      nb = Math.min(choix.nbGen || (/^a3/.test(formatChoisi()) ? capA3 : capA4), capA3, dispo);
      donnees = descendants(choix.depart, nb);
    } else if (grand()) {
      dispo = (lignee(choix.depart, 5) || { nb: 0 }).nb; capA4 = 0; capA3 = 5;
      nb = Math.min(choix.nbGen || 5, dispo);
    } else if (paysage() && window.ArbreLignee) {
      var tout = (famille() && couple(choix.depart, 10)) || lignee(choix.depart, 10);
      dispo = tout ? tout.nb : 0;
      if (tout && !choix.enfants) tout.enfants = [];   /* la rangée des enfants prend un peu de hauteur */
      capA4 = tout ? window.ArbreLignee.capacite(tout, false, true, motif()) : 2;
      capA3 = tout ? Math.max(capA4, window.ArbreLignee.capacite(tout, true, true, motif())) : 2;
      nb = Math.min(choix.nbGen || (/^a3/.test(formatChoisi()) ? capA3 : capA4), capA3, dispo);
    } else {
      dispo = (lignee(choix.depart, 5) || { nb: 0 }).nb;
      nb = Math.min(choix.nbGen || Math.min(dispo, 4), dispo);
    }
    if (!desc()) donnees = (famille() && couple(choix.depart, nb)) || lignee(choix.depart, nb);
    if (donnees && famille() && !donnees.couple) donnees.sansCouple = true;   /* pas de conjoint noté : on montre la Lignée, avec un mot d'explication */
    if (donnees && titre != null && choix.titreModifie) donnees.titre = titre || donnees.titre;   /* sinon le titre suit la personne choisie (« La famille Epinette ») */
    if (donnees && sous != null && choix.sousModifie) donnees.sousTitre = sous;
    if (donnees) { donnees.style = choix.style; donnees.nbFreres = donnees.freresSoeurs.length; if (!choix.freres) donnees.freresSoeurs = []; donnees.nbEnfants = donnees.enfants.length; if (!choix.enfants || !avecEnfantsPossible()) donnees.enfants = []; donnees.aConjoint = !!donnees.conjoint; if (!choix.conjoint || !(avecEnfantsPossible() || desc())) donnees.conjoint = null; }
  }
  function afficher() {
    var premier = !choix.choisi;
    choix = { depart: '', nbGen: 0, sousModifie: false, style: choix.style || 'figuier', vue: 'cadre', freres: true, enfants: true, conjoint: true, choisi: choix.choisi };
    /* le Grand arbre d'office quand au moins la moitié de ses 31 médaillons sera remplie ; sinon le Figuier, qui n'a pas de place vide */
    if (premier) { choix.style = 'grand'; donnees = null; recalculer(); if (!donnees || donnees.nb < 3 || remplis(donnees.moi, 0, 5) < 16) choix.style = 'figuier'; }
    var SA = saison(); if (SA && !saisonPossible(SA)) SA = SA.autre && saisonPossible(SA.autre) ? Object.assign({}, SA, SA.autre) : null;
    if (premier && SA) choix.style = SA.style;   /* en période de fête : le modèle cadeau d'office */
    donnees = null; recalculer();
    if (!donnees || !donnees.moi || donnees.nb < 2) {
      corps.innerHTML = '<p class="rap-texte">Ajoute au moins tes parents à ton arbre pour obtenir ton arbre à encadrer. Plus il remonte loin, plus il est beau : jusqu’à tes arrière-grands-parents.</p>';
      return;
    }
    var payant = window.GenesoliaAcces && window.GenesoliaAcces.payant('arbreEncadrer'), P = window.GenesoliaAcces ? window.GenesoliaAcces.produit('arbreEncadrer') : null;
    corps.innerHTML = '<div class="fe-grille"><div><div class="fe-vues" id="fe-vues" role="tablist"><button type="button" role="tab" data-vue="cadre" aria-selected="true">Dans son cadre</button><button type="button" role="tab" data-vue="affiche" aria-selected="false">L’affiche</button><button type="button" role="tab" data-vue="scene" aria-selected="false">Mise en scène</button></div><div class="fe-apercu-z"><div class="fe-apercu" id="fe-apercu" title="Cliquer pour agrandir"><p class="rap-texte">Un instant…</p></div><button type="button" class="fe-loupe" id="fe-loupe" aria-label="Agrandir l’aperçu"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M15.5 15.5L21 21M10.5 7.5v6M7.5 10.5h6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>Agrandir</button></div><p class="fe-legende" id="fe-legende"></p><p class="fe-coupes" id="fe-coupes" hidden></p></div><div class="fe-reglages">' +
      (SA ? '<div class="fe-saison"><span class="fe-saison-t">' + esc(SA.badge) + '</span> ' + esc(SA.texte) + (choix.style !== SA.style ? ' <button type="button" class="fe-saison-bt" data-saison="' + SA.style + '">Voir ce modèle</button>' : '') + '</div>' : '') +
      '<div class="fe-champ">Style<div class="fe-styles" role="radiogroup">' + window.ArbreEncadrer.styles.map(function (x) { return '<label><input type="radio" name="fe-style" value="' + x[0] + '"' + (x[0] === choix.style ? ' checked' : '') + '><span>' + esc(x[1]) + (x[0] === 'grand' ? ' <small class="fe-badge">Le plus complet</small>' : '') + '</span></label>'; }).join('') + '</div></div>' +
      '<label class="fe-champ"><span id="fe-depart-t">' + (desc() ? 'Les descendants de qui ?' : 'À partir de qui ?') + '</span><select id="fe-depart">' + departs().map(function (x) { return '<option value="' + esc(x.id) + '"' + (x.id === donnees.depart ? ' selected' : '') + '>' + esc(x.nom) + (x.an ? ' (' + x.an + ')' : '') + (x.moi ? ' · moi' : '') + '</option>'; }).join('') + '</select></label>' +
      '<label class="fe-champ">Générations<select id="fe-gens"></select></label><p class="fe-aide" id="fe-gens-aide"></p>' +
      '<label class="fe-case" id="fe-freres-l"' + (donnees.nbFreres ? '' : ' hidden') + '><input type="checkbox" id="fe-freres"' + (choix.freres ? ' checked' : '') + '> Inclure les frères et sœurs</label>' +
      '<label class="fe-case" id="fe-conjoint-l" hidden><input type="checkbox" id="fe-conjoint"' + (choix.conjoint ? ' checked' : '') + '> <span id="fe-conjoint-t">Avec mon conjoint</span></label><p class="fe-aide" id="fe-conjoint-aide" hidden></p>' +
      '<p class="fe-aide" id="fe-famille-aide" hidden>« Notre famille » réunit ton couple et vos deux lignées. Ajoute ton conjoint dans l’arbre (lien « couple ») et ses parents : ils apparaîtront ici à côté de toi.</p>' +
      '<label class="fe-case" id="fe-enfants-l" hidden><input type="checkbox" id="fe-enfants"' + (choix.enfants ? ' checked' : '') + '> <span id="fe-enfants-t">Avec mes enfants, au pied de l’arbre</span></label>' +
      '<label class="fe-champ">Titre<input type="text" id="fe-titre" maxlength="40" value="' + esc(donnees.titre) + '"></label>' +
      '<div class="fe-titres" id="fe-titres" aria-label="Titres proposés"></div>' +
      '<label class="fe-champ">Sous-titre<input type="text" id="fe-sous" maxlength="60" value="' + esc(donnees.sousTitre) + '"></label>' +
      blocImpression() +
      '<p class="fe-sous-t">Ou le télécharger pour l’imprimer toi-même</p>' +
      '<p class="fe-aide">Image haute définition, prête à imprimer ou à faire encadrer. Les branches suivent la lignée de la personne choisie.</p>' +
      '<button class="bt plein rap-gros" type="button" id="fe-png" data-compte="ton arbre à encadrer" data-produit="arbreEncadrer">Télécharger l’image HD</button>' +
      '<button class="bt rap-gros" type="button" id="fe-pdf" data-compte="ton arbre à encadrer" data-produit="arbreEncadrer">Imprimer ou enregistrer en PDF</button>' +
      '<a class="fe-vierge" href="assets/modeles/arbre-vierge-5-generations-genesolia.pdf" download data-compte="ton arbre vierge à remplir"><img src="assets/modeles/arbre-vierge-apercu.webp" width="120" height="85" alt="" loading="lazy"><span><b>La version vierge, à remplir à la main</b><span>Le même arbre doré, 31 médaillons vides sur 5 générations. PDF gratuit, A4 paysage.</span><u>Télécharger le modèle vierge</u></span></a>' +
      (payant && P ? '<p class="fe-aide">' + esc(P.prix) + ', ou compris dans Le Cercle.</p>' : '') +
      '<p class="fe-aide" id="fe-statut" aria-live="polite"></p></div></div>';
    majGens(); majEnfants(); dessiner();
    var t; ['fe-titre', 'fe-sous'].forEach(function (id) { document.getElementById(id).addEventListener('input', function () { if (id === 'fe-sous') choix.sousModifie = true; else choix.titreModifie = true; clearTimeout(t); t = setTimeout(dessiner, 250); }); });
    /* passer à « Descendants » (ou en revenir) : la liste « À partir de qui ? » change, le titre suit */
    function changerMode() {
      choix.depart = ''; choix.nbGen = 0; recalculer();
      var sel = document.getElementById('fe-depart'), lab = document.getElementById('fe-depart-t');
      if (lab) lab.textContent = desc() ? 'Les descendants de qui ?' : 'À partir de qui ?';
      if (sel && donnees) sel.innerHTML = departs().map(function (x) { return '<option value="' + esc(x.id) + '"' + (x.id === donnees.depart ? ' selected' : '') + '>' + esc(x.nom) + (x.an ? ' (' + x.an + ')' : '') + (x.moi ? ' · moi' : '') + '</option>'; }).join('');
      if (!choix.titreModifie && donnees) document.getElementById('fe-titre').value = donnees.titre;
      if (!choix.sousModifie && donnees) document.getElementById('fe-sous').value = donnees.sousTitre;
    }
    document.getElementById('fe-depart').addEventListener('change', function (e) { choix.depart = e.target.value; choix.nbGen = 0; recalculer(); if (!choix.titreModifie) document.getElementById('fe-titre').value = donnees.titre; if (!choix.sousModifie) document.getElementById('fe-sous').value = donnees.sousTitre; majGens(); document.getElementById('fe-freres-l').hidden = !donnees.nbFreres; majEnfants(); dessiner(); });
    document.getElementById('fe-conjoint').addEventListener('change', function (e) { choix.conjoint = e.target.checked; recalculer(); dessiner(); });
    document.getElementById('fe-enfants').addEventListener('change', function (e) { choix.enfants = e.target.checked; if (paysage() && !grand()) choix.nbGen = 0; recalculer(); majGens(); dessiner(); });
    document.getElementById('fe-freres').addEventListener('change', function (e) { choix.freres = e.target.checked; recalculer(); dessiner(); });
    document.getElementById('fe-gens').addEventListener('change', function (e) { choix.nbGen = +e.target.value; recalculer(); majGens(); dessiner(); });
    document.getElementById('fe-titres').addEventListener('click', function (e) {
      var b = e.target.closest('[data-titre]'); if (!b) return;
      document.getElementById('fe-titre').value = b.getAttribute('data-titre'); choix.titreModifie = true; majTitres(); dessiner();
    });
    document.getElementById('fe-titre').addEventListener('input', function () { var z = document.getElementById('fe-titres'); if (z) z.querySelectorAll('[data-titre]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-titre') === document.getElementById('fe-titre').value.trim())); }); });
    var bs = corps.querySelector('[data-saison]');
    if (bs) bs.addEventListener('click', function () { var r = corps.querySelector('input[name=fe-style][value="' + bs.getAttribute('data-saison') + '"]'); if (r) { r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); } bs.remove(); });
    document.querySelectorAll('input[name=fe-style]').forEach(function (r) { r.addEventListener('change', function () { var avant = paysage(), avantD = desc(); choix.style = r.value; if (avantD !== desc()) changerMode(); choix.choisi = true; if (r.value !== 'figuier' && choix.vue === 'scene') choix.vue = 'cadre'; if (avant !== paysage() || paysage()) choix.nbGen = 0; recalculer(); if (!choix.titreModifie && donnees) document.getElementById('fe-titre').value = donnees.titre; majGens(); majEnfants(); dessiner(); }); });
    document.getElementById('fe-vues').addEventListener('click', function (e) { var b = e.target.closest('[data-vue]'); if (!b) return; choix.vue = b.getAttribute('data-vue'); dessiner(); });
    document.getElementById('fe-png').addEventListener('click', telechargerPng);
    document.getElementById('fe-loupe').addEventListener('click', loupe);
    document.getElementById('fe-apercu').addEventListener('click', loupe);
    document.getElementById('fe-pdf').addEventListener('click', imprimer);
    brancherImpression();
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
      return '<div class="fe-imp"><p class="fe-imp-titre">Bientôt : le recevoir imprimé, prêt à encadrer</p><p class="fe-aide">À partir du ' + quand + ', tu pourras recevoir ton arbre imprimé sur un beau papier épais, en A4 ou en A3, avec ou sans cadre, livré chez toi ou chez la personne à qui tu l’offres.</p>' +
        '<form class="fe-imp-prevenir" id="fe-imp-prevenir" novalidate><div class="fe-deux"><input name="email" type="email" autocomplete="email" placeholder="Ton e-mail" aria-label="Ton e-mail" required><button class="bt rap-gros" type="submit">Me prévenir</button></div><p class="fe-aide" id="fe-prev-statut" aria-live="polite"></p></form></div>';
    }
    return '<div class="fe-imp"><p class="fe-imp-titre">Le recevoir imprimé, prêt à encadrer</p><p class="fe-aide">Imprimé sur un beau papier mat épais et envoyé chez toi (ou chez la personne à qui tu l’offres). ' + esc(IMP.livraison || '') + '.</p>' +
      '<button class="bt plein rap-gros fe-commander" type="button" id="fe-imp-ouvrir">Commander mon arbre encadré · dès ' + esc(prixMin()) + '</button>' +
      '<form class="fe-imp-form" id="fe-imp-form" hidden novalidate>' +
        RECU + '<fieldset class="fe-formats"><legend>Format</legend>' + IMP.formats.map(function (f, i) { return '<label class="fe-format"><input type="radio" name="format" value="' + esc(f.id) + '"' + (f.id === 'a4cadre' ? ' checked' : '') + '><span>' + esc(f.nom) + '</span><b>' + esc(f.prix) + '</b></label>'; }).join('') + '</fieldset>' +
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
  function fichierImprimeur(d, fmt) {
    var pay = paysage(d.style), mm0 = fmt.mm || [218, 305], mm = pay ? [mm0[1], mm0[0]] : mm0, larg = pay ? Math.round(mm[0] / 25.4 * 300) : fmt.largeur;
    var nom = nomFichier(d) + '-' + fmt.id + (pay ? '-horizontal' : '');
    d.a3 = /^a3/.test(fmt.id);
    return svgAutonome(d, false, { hd: true, fondPerdu: true }).then(function (svg) { return versPng(svg, larg, true); }).then(function (jpeg) {
      var enJpeg = function () { return deposer(jpeg, nom, 'jpg', 'image/jpeg'); };
      return Promise.all([chargerJsPdf(), jpeg.arrayBuffer()]).then(function (x) {
        var doc = new x[0]({ orientation: pay ? 'landscape' : 'portrait', unit: 'mm', format: mm0, compress: true, putOnlyUsedFonts: true });
        doc.setProperties({ title: d.titre + ' · Genesolia', creator: 'Genesolia' });
        doc.addImage(new Uint8Array(x[1]), 'JPEG', 0, 0, mm[0], mm[1], undefined, 'NONE');
        return deposer(doc.output('blob'), nom, 'pdf', 'application/pdf');
      }).then(function (chemin) { return chemin || enJpeg(); }, enJpeg);
    }).catch(function () { return ''; });
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
    f.addEventListener('change', function (e) { if (e.target.name === 'format') { choix.vue = 'cadre'; if (paysage() && !choix.nbGen) { recalculer(); majGens(); } dessiner(); } });
    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var st = document.getElementById('fe-imp-statut'), bt = f.querySelector('button[type=submit]');
      if (f._gotcha.value) return;
      var manque = ['prenom', 'nom_complet', 'adresse', 'code_postal', 'ville'].filter(function (k) { return !f[k].value.trim(); });
      if (manque.length || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim())) { st.textContent = 'Complète ton prénom, ton e-mail et l’adresse de livraison.'; return; }
      if (!/^\d{5}$/.test(f.code_postal.value.trim())) { st.textContent = 'Vérifie le code postal (5 chiffres, France métropolitaine).'; return; }
      if (!f.accord.checked) { st.textContent = 'Coche la case pour confirmer l’aperçu.'; return; }
      var fmt = IMP.formats.filter(function (x2) { return x2.id === (f.querySelector('input[name=format]:checked') || {}).value; })[0] || IMP.formats[0];
      if (donnees.nbGen > a4Max() && /^a4/.test(fmt.id)) { st.textContent = 'Avec autant de générations, choisis un format A3.'; return; }
      var d = lire(), lien = (window.GENESOLIA_STRIPE || {})[fmt.stripe] || '';
      /* référence de la commande : relie le paiement Stripe à cette commande (et donc à l'envoi chez l'imprimeur) */
      var ref = Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
      var lienPaiement = lien ? lien + (lien.indexOf('?') < 0 ? '?' : '&') + 'prefilled_email=' + encodeURIComponent(f.email.value.trim()) + '&client_reference_id=' + encodeURIComponent('imp__' + ref) : '';
      bt.disabled = true; st.textContent = 'Préparation de ton arbre en haute définition…';
      fichierImprimeur(d, fmt).then(function (chemin) {
        var fd = new FormData(f); fd.delete('accord'); fd.delete('format');
        fd.append('format', fmt.id); fd.append('format_nom', fmt.nom); fd.append('prix', fmt.prix); fd.append('titre', d.titre); fd.append('sous_titre', d.sousTitre || '');
        fd.append('fichier', chemin || 'à régénérer depuis l’arbre de la cliente'); fd.append('pays', 'France'); fd.append('paiement', lien ? 'stripe' : 'a-envoyer');
        fd.append('arbre', JSON.stringify(d.moi).slice(0, 3000)); fd.append('ref', ref); fd.append('style', d.style || ''); fd.append('generations', String(d.nbGen || '')); fd.append('enfants', String((d.enfants || []).length)); fd.append('conjoint', d.conjoint ? 'oui' : 'non'); fd.append('orientation', paysage(d.style) ? 'paysage' : 'portrait');
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
    var maxN = Math.min(dispo, grand() ? 5 : paysage() ? capA3 : 5);
    for (var n = 2; n <= maxN; n++) opts.push('<option value="' + n + '"' + (n === donnees.nbGen ? ' selected' : '') + '>' + (GEN[n - 1] || n + ' générations') + (n > a4Max() && !grand() ? ' (A3 seulement)' : '') + '</option>');
    sel.innerHTML = opts.join('');
    var aide = document.getElementById('fe-gens-aide');
    var vides = grand() ? (Math.pow(2, donnees.nbGen) - 1 - remplis(donnees.moi, 0, donnees.nbGen)) + (31 - (Math.pow(2, donnees.nbGen) - 1)) : 0;
    if (aide) aide.textContent = grand() ? 'Le Grand arbre porte 5 générations (31 médaillons) et s’imprime en A3, pour que chaque nom reste bien lisible.' + (vides ? ' ' + vides + ' médaillon' + (vides > 1 ? 's resteront vides' : ' restera vide') + ' (ancêtres inconnus) : tu pourras les compléter à la main, ou choisir un autre style.' : ' Tous les médaillons seront remplis.') : paysage()
      ? (donnees.nbGen > capA4 ? 'Lisible en A3 seulement avec autant de générations : l’A4 est désactivé.' : (Math.min(dispo, capA3) > donnees.nbGen ? 'Ton arbre va plus loin : jusqu’à ' + Math.min(dispo, capA3) + ' générations en A3.' : ''))
      : (dispo < 5 && dispo < 4 ? '' : donnees.nbGen === 5 ? 'Cinq générations : lisible en A3 seulement. L’A4 est désactivé.' : (dispo >= 5 ? 'Ton arbre va plus loin : choisis « Cinq générations » pour l’A3.' : ''));
    if (!choix.sousModifie && document.getElementById('fe-sous')) document.getElementById('fe-sous').value = donnees.sousTitre;
    /* formats d'impression : l'A4 n'est pas proposé avec cinq générations */
    document.querySelectorAll('#fe-imp-form input[name=format]').forEach(function (r) {
      var f = (IMP.formats || []).filter(function (x) { return x.id === r.value; })[0] || {}, a4 = /^a4/.test(f.id || '');
      r.disabled = a4 && (grand() || (donnees.nbGen > a4Max() && !(paysage() && !choix.nbGen)));   /* styles à l'horizontale en réglage automatique : l'A4 reste proposé, avec ses générations */ r.closest('label').classList.toggle('fe-off', r.disabled);
      if (r.disabled && r.checked) { var a3 = document.querySelector('#fe-imp-form input[name=format][value="' + (/cadre/.test(r.value) ? 'a3cadre' : 'a3') + '"]') || document.querySelector('#fe-imp-form input[name=format]:not(:disabled)'); if (a3) a3.checked = true; }
    });
  }
  /* Ce que la cliente reçoit (fiches Gelato « prêt à accrocher », papier premium mat 200 g) */
  var INFOS = {
    a4cadre: 'Cadre en bois naturel, environ 23,4 × 32,1 cm, livré monté et prêt à accrocher',
    a3cadre: 'Cadre en bois naturel, environ 32,1 × 44,4 cm, livré monté et prêt à accrocher',
    a4: 'Poster seul 21 × 29,7 cm, sur papier mat épais', a3: 'Poster seul 29,7 × 42 cm, sur papier mat épais'
  };
  var RECU = '<details class="fe-recu"><summary>Ce que tu reçois</summary><ul>' +
    '<li><b>Ton arbre imprimé</b> sur un papier mat épais de 200 g, aux couleurs douces, sans reflet.</li>' +
    '<li><b>Encadré</b> : cadre en bois naturel, baguette fine de 1,2 cm, 2,2 cm d’épaisseur, protégé par un plexiglas incassable. Il arrive <b>déjà monté, prêt à accrocher</b>, avec des attaches au dos pour le mettre en hauteur (vis ou clous non fournis).</li>' +
    '<li><b>Dimensions</b> : A4 encadré environ 23,4 × 32,1 cm, A3 encadré environ 32,1 × 44,4 cm. Le cadre recouvre environ 3 mm de l’affiche sur chaque bord : rien d’important n’y est placé.</li>' +
    '<li><b>Livré chez toi en 3 à 7 jours ouvrés</b> après ta commande, fabrication comprise : il est imprimé pour toi, à la commande, puis expédié dans un emballage protégé, en France métropolitaine. Livraison comprise.</li>' +
    '<li><b>Tranquillité</b> : s’il arrive abîmé ou s’il y a une erreur d’impression, envoie-nous une photo dans les 14 jours, il est réimprimé ou remboursé. Un colis perdu est renvoyé. Comme c’est un objet personnalisé, il ne peut pas être repris pour un changement d’avis. Les couleurs peuvent varier légèrement entre l’écran et le papier.</li>' +
    '</ul><p><a href="cgv.html#arbre-imprime" target="_blank">Conditions de vente de l’arbre imprimé</a></p></details>';
  /* à l'horizontale, les dimensions s'écrivent largeur × hauteur : « 23,4 × 32,1 cm » devient « 32,1 × 23,4 cm » */
  function dimensions(t) { return paysage() ? String(t).replace(/(\d+(?:,\d+)?) × (\d+(?:,\d+)?) cm/, '$2 × $1 cm') + ', à l’horizontale' : t; }
  function lire() { donnees.titre = document.getElementById('fe-titre').value.trim() || donnees.titre; donnees.sousTitre = document.getElementById('fe-sous').value.trim(); donnees.dedicace = choix.mot || ''; return donnees; }
  function dessiner() {
    var z = document.getElementById('fe-apercu'); if (!z) return;
    var d = lire(), verif = window.GenesoliaAcces ? window.GenesoliaAcces.verifier('arbreEncadrer') : Promise.resolve(true);
    var vue = choix.vue === 'scene' && d.style !== 'figuier' ? 'cadre' : choix.vue, vues = document.getElementById('fe-vues');
    if (vues) vues.querySelectorAll('[data-vue]').forEach(function (b) { var v = b.getAttribute('data-vue'); b.hidden = v === 'scene' && d.style !== 'figuier'; b.setAttribute('aria-selected', String(v === vue)); });
    /* le format montré : celui coché dans la commande, sinon l'A4 encadré (l'A3 encadré en cinq générations) */
    var coche = document.querySelector('#fe-imp-form input[name=format]:checked'), fid = coche && !coche.disabled ? coche.value : (d.nbGen > a4Max() ? 'a3cadre' : 'a4cadre');
    var f = ((window.GENESOLIA_IMPRESSION || {}).formats || []).filter(function (x) { return x.id === fid; })[0];
    var format = /^a3/.test(fid) ? 'a3' : 'a4', cadre = /cadre/.test(fid) ? 'bois' : '';
    d.a3 = format === 'a3';   /* styles à l'horizontale : tailles de texte prévues pour le format */
    var leg = document.getElementById('fe-legende');
    if (leg) leg.innerHTML = vue === 'cadre' ? esc((f ? f.nom : (format === 'a3' ? 'A3' : 'A4') + ' encadré') + (f ? ' · ' + f.prix : '')) + '<br>' + esc(dimensions(INFOS[format + (cadre ? 'cadre' : '')] || '') + (ouvert() ? ' · livré en 3 à 7 jours ouvrés' : ' · à commander à partir du ' + quandOuverture())) :
      vue === 'scene' ? 'Mise en scène pour l’inspiration : tu reçois l’affiche seule ou dans son cadre, sans les fleurs.' : 'L’affiche telle qu’elle sera imprimée (le cadre recouvre environ 3 mm sur chaque bord).';
    verif.then(function (ok) { z.innerHTML = window.ArbreEncadrer.svg(d, vue === 'cadre' ? { apercu: !ok, cadre: cadre, format: format } : { apercu: !ok, scene: vue === 'scene' }); nomsCoupes(z.querySelector('svg'), d); });
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
    var coupes = gens.filter(function (q) { var pr = n(q.prenom), no = n(q.nom); return (pr && texte.indexOf(pr) < 0) || (no && texte.indexOf(no) < 0); })
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
    var k = 1, x = 0, y = 0;
    function poser() { img.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + k + ')'; }
    function zoom(f, cx, cy) {
      var r = vue.getBoundingClientRect(); cx = cx == null ? r.width / 2 : cx - r.left; cy = cy == null ? r.height / 2 : cy - r.top;
      var nk = Math.max(1, Math.min(6, k * f)); x = cx - (cx - x) * nk / k; y = cy - (cy - y) * nk / k; k = nk; if (k === 1) { x = 0; y = 0; } poser();
    }
    function fermer() { o.remove(); document.removeEventListener('keydown', touche); }
    function touche(e) { if (e.key === 'Escape') fermer(); else if (e.key === '+' || e.key === '=') zoom(1.4); else if (e.key === '-') zoom(1 / 1.4); }
    o.querySelector('.fe-zoom-barre').addEventListener('click', function (e) { var b = e.target.closest('[data-z]'); if (!b) return; var z = b.getAttribute('data-z'); if (z === 'x') fermer(); else if (z === '1') { k = 1; x = 0; y = 0; poser(); } else zoom(z === '+' ? 1.4 : 1 / 1.4); });
    vue.addEventListener('wheel', function (e) { e.preventDefault(); zoom(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX, e.clientY); }, { passive: false });
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
    document.body.appendChild(o); zoom(1);
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
})();
