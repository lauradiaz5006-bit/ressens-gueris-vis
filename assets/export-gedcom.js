/* Export de l'arbre au format GEDCOM 5.5.1 (UTF-8), pour le reprendre dans Geneanet, Heredis, etc.
   L'état est lu (copie) avec window.GenoArbre.etat() défini dans genosociogramme.js ; rien n'est modifié. */
(function () {
  'use strict';
  var MOIS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  // 'AAAA-MM-JJ' → '12 MAR 1950', 'AAAA-MM' → 'MAR 1950', 'AAAA' → '1950'
  function dateGed(d) {
    d = String(d || '').trim();
    var m = d.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m && +m[2] >= 1 && +m[2] <= 12) return (+m[3]) + ' ' + MOIS[+m[2] - 1] + ' ' + m[1];
    m = d.match(/^(\d{4})-(\d{2})$/);
    if (m && +m[2] >= 1 && +m[2] <= 12) return MOIS[+m[2] - 1] + ' ' + m[1];
    return d;
  }
  // « Lyon (69) » → « Lyon, 69 » (forme habituelle des logiciels de généalogie)
  function lieuGed(l) {
    l = String(l || '').trim();
    var m = l.match(/^(.*\S)\s*\((\d{2,3}|2A|2B)\)$/);
    return m ? m[1] + ', ' + m[2] : l;
  }
  function propre(v) { return String(v == null ? '' : v).replace(/[\r\n\t]+/g, ' ').replace(/@/g, '@@').trim(); }

  function generer(etat, aujourdhui) {
    etat = etat || {};
    var people = etat.people || {}, rels = etat.rels || [], lib = etat.libelles || {};
    var L = [];
    function ligne(n, tag, val) { L.push(n + ' ' + tag + (val !== undefined && val !== '' ? ' ' + val : '')); }
    // Texte long ou sur plusieurs lignes : CONT pour chaque retour à la ligne, CONC au-delà de 200 caractères
    function texte(n, tag, t) {
      String(t).replace(/@/g, '@@').split(/\r\n|\r|\n/).forEach(function (l, i) {
        var morceaux = [];
        while (l.length > 200) {
          var c = 200;
          while (c > 1 && (l.charAt(c - 1) === ' ' || l.charAt(c) === ' ')) c--;   // ne pas couper sur une espace
          morceaux.push(l.slice(0, c)); l = l.slice(c);
        }
        morceaux.push(l);
        morceaux.forEach(function (m, j) {
          if (i === 0 && j === 0) ligne(n, tag, m);
          else ligne(n + 1, j === 0 ? 'CONT' : 'CONC', m);
        });
      });
    }

    var ids = Object.keys(people), xi = {};
    ids.forEach(function (id, i) { xi[id] = '@I' + (i + 1) + '@'; });

    // Familles : enfants regroupés par leurs parents connus, puis couples sans enfant
    var parents = {};
    rels.forEach(function (r) {
      if (r.type !== 'parent' || !xi[r.from] || !xi[r.to] || r.from === r.to) return;
      var l = parents[r.to] = parents[r.to] || [];
      if (l.indexOf(r.from) < 0) l.push(r.from);
    });
    function couple(a, b) { return rels.filter(function (r) { return r.type === 'couple' && ((r.from === a && r.to === b) || (r.from === b && r.to === a)); })[0] || null; }
    var fams = [], parCle = {};
    function famille(ps) {
      ps = ps.slice().sort();
      var k = ps.join('|');
      if (!parCle[k]) { parCle[k] = { parents: ps, enfants: [], rel: ps.length === 2 ? couple(ps[0], ps[1]) : null }; fams.push(parCle[k]); }
      return parCle[k];
    }
    ids.forEach(function (id) {
      var ps = parents[id]; if (!ps || !ps.length) return;
      var groupes = [];
      if (ps.length <= 2) groupes.push(ps);
      else {
        // Plus de deux parents : un couple d'abord s'il existe, chaque autre parent dans sa propre famille
        var reste = ps.slice(), paire = null;
        for (var i = 0; i < ps.length && !paire; i++) for (var j = i + 1; j < ps.length; j++) if (couple(ps[i], ps[j])) { paire = [ps[i], ps[j]]; break; }
        if (!paire) paire = [ps[0], ps[1]];
        groupes.push(paire);
        reste.filter(function (p) { return paire.indexOf(p) < 0; }).forEach(function (p) { groupes.push([p]); });
      }
      groupes.forEach(function (g) { famille(g).enfants.push(id); });
    });
    rels.forEach(function (r) { if (r.type === 'couple' && xi[r.from] && xi[r.to] && r.from !== r.to) famille([r.from, r.to]); });
    // Frères et sœurs sans parent connu : une famille sans parents qui les réunit
    var grp = {};
    function racine(x) { while (grp[x] !== x) x = grp[x] = grp[grp[x]]; return x; }
    rels.forEach(function (r) {
      if (r.type !== 'fratrie' || !xi[r.from] || !xi[r.to] || r.from === r.to) return;
      if ((parents[r.from] || []).length || (parents[r.to] || []).length) return;
      [r.from, r.to].forEach(function (x) { if (!grp[x]) grp[x] = x; });
      grp[racine(r.from)] = racine(r.to);
    });
    var fratries = {};
    Object.keys(grp).forEach(function (x) { (fratries[racine(x)] = fratries[racine(x)] || []).push(x); });
    Object.keys(fratries).forEach(function (k) { fams.push({ parents: [], enfants: fratries[k].sort(function (a, b) { return ids.indexOf(a) - ids.indexOf(b); }), rel: null }); });

    var famsDe = {}, famcDe = {};
    fams.forEach(function (f, i) {
      f.x = '@F' + (i + 1) + '@';
      f.parents.forEach(function (p) { (famsDe[p] = famsDe[p] || []).push(f.x); });
      f.enfants.forEach(function (c) { (famcDe[c] = famcDe[c] || []).push(f.x); });
    });

    var d = aujourdhui || new Date();
    ligne(0, 'HEAD');
    ligne(1, 'SOUR', 'GENESOLIA'); ligne(2, 'NAME', 'Genesolia');
    ligne(1, 'DEST', 'ANY');
    ligne(1, 'DATE', d.getDate() + ' ' + MOIS[d.getMonth()] + ' ' + d.getFullYear());
    ligne(1, 'SUBM', '@U1@');
    ligne(1, 'FILE', 'mon-arbre-genesolia.ged');
    ligne(1, 'GEDC'); ligne(2, 'VERS', '5.5.1'); ligne(2, 'FORM', 'LINEAGE-LINKED');
    ligne(1, 'CHAR', 'UTF-8');
    ligne(0, '@U1@ SUBM'); ligne(1, 'NAME', 'Genesolia');

    ids.forEach(function (id) {
      var p = people[id] || {}, prenom = propre(p.prenom), nom = propre(p.nom).replace(/\//g, ' ');
      ligne(0, xi[id] + ' INDI');
      ligne(1, 'NAME', (prenom + ' /' + nom + '/').trim());
      if (prenom) ligne(2, 'GIVN', prenom);
      if (nom) ligne(2, 'SURN', nom);
      ligne(1, 'SEX', p.sex === 'm' ? 'M' : p.sex === 'f' ? 'F' : 'U');
      if (p.naiss || p.lieu) {
        ligne(1, 'BIRT');
        if (p.naiss) ligne(2, 'DATE', propre(dateGed(p.naiss)));
        if (p.lieu) ligne(2, 'PLAC', propre(lieuGed(p.lieu)));
      }
      if (p.deces) { ligne(1, 'DEAT'); ligne(2, 'DATE', propre(dateGed(p.deces))); }
      else if (p.decede) ligne(1, 'DEAT', 'Y');
      if (p.metier) ligne(1, 'OCCU', propre(p.metier));
      (p.events || []).forEach(function (e) {
        if (!e || !e.type) return;
        ligne(1, 'EVEN');
        ligne(2, 'TYPE', propre(lib[e.type] || e.type));
        if (e.year && /^\d{4}$/.test(String(e.year))) ligne(2, 'DATE', String(e.year));
        var age = parseInt(e.age, 10);
        if (!isNaN(age) && age >= 0) ligne(2, 'AGE', age + 'y');
      });
      if (p.notes && String(p.notes).trim()) texte(1, 'NOTE', String(p.notes).trim());
      (famcDe[id] || []).forEach(function (x) { ligne(1, 'FAMC', x); });
      (famsDe[id] || []).forEach(function (x) { ligne(1, 'FAMS', x); });
    });

    fams.forEach(function (f) {
      ligne(0, f.x + ' FAM');
      // HUSB / WIFE selon le sexe ; sexe inconnu : la place restante
      var husb = [], wife = [], inconnus = [];
      f.parents.forEach(function (p) { var s = (people[p] || {}).sex; (s === 'm' ? husb : s === 'f' ? wife : inconnus).push(p); });
      inconnus.forEach(function (p) { (husb.length <= wife.length ? husb : wife).push(p); });
      husb.forEach(function (p) { ligne(1, 'HUSB', xi[p]); });
      wife.forEach(function (p) { ligne(1, 'WIFE', xi[p]); });
      f.enfants.forEach(function (c) { ligne(1, 'CHIL', xi[c]); });
      var st = f.rel ? (f.rel.statut || 'marie') : '';
      if (st === 'marie' || st === 'divorce') ligne(1, 'MARR', 'Y');
      if (st === 'divorce') ligne(1, 'DIV', 'Y');
    });
    ligne(0, 'TRLR');
    return '﻿' + L.join('\r\n') + '\r\n';
  }

  var Export = { generer: generer, dateGed: dateGed };
  if (typeof module !== 'undefined' && module.exports) { module.exports = Export; return; }

  /* ───────── Dans la page : bouton de la fenêtre « Sauvegardes » ───────── */
  var G = window.GenoArbre, bt = document.getElementById('bt-gedcom'), info = document.getElementById('bt-gedcom-info'), fen = document.getElementById('fen-sauve');
  if (!G || !G.etat || !bt) return;
  function raison() {
    if (G.exemple && G.exemple()) return 'L’export GEDCOM n’est pas disponible sur l’arbre d’exemple : crée ton propre arbre pour l’exporter.';
    if (!Object.keys(G.etat().people || {}).length) return 'Ajoute au moins une personne pour exporter ton arbre en GEDCOM.';
    return '';
  }
  function majBouton() {
    var r = raison();
    bt.disabled = !!r;
    if (info) { info.textContent = r; info.hidden = !r; }
  }
  // État du bouton mis à jour à l'ouverture de la fenêtre et après un import (qui se fait par-dessus)
  if (window.MutationObserver) [fen, document.getElementById('fen-import')].forEach(function (f) { if (f) new MutationObserver(majBouton).observe(f, { attributes: true, attributeFilter: ['class'] }); });
  majBouton();
  bt.addEventListener('click', function () {
    majBouton(); if (bt.disabled) return;
    var d = new Date(), j = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    var blob = new Blob([generer(G.etat(), d)], { type: 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = 'mon-arbre-genesolia-' + j + '.ged';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
  });
})();
