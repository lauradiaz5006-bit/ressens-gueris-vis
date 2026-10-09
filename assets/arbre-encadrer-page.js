/* Genesolia · page génosociogramme : bouton « Mon arbre à encadrer ».
   Aperçu à l'écran (filigrane « Aperçu » tant que le produit est payant et non acheté),
   téléchargement en image haute définition ou en PDF à imprimer. Réglage du prix : assets/site.js (arbreEncadrer). */
(function () {
  'use strict';
  var bt = document.getElementById('bt-encadrer'), fen = document.getElementById('fen-encadrer');
  if (!bt || !fen || !window.ArbreEncadrer || !window.GenoArbre) return;
  var corps = document.getElementById('fe-corps'), cache = {};
  var GEN = ['Une génération', 'Deux générations', 'Trois générations', 'Quatre générations'];

  function annee(d) { var m = String(d || '').match(/(\d{4})/); return m ? +m[1] : null; }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* L'arbre de la page devient une lignée : moi, mes parents, leurs parents, leurs parents */
  function lignee() {
    var S = window.GenoArbre.etat(), P = S.people || {}, rels = S.rels || [];
    var ids = Object.keys(P); if (!ids.length) return null;
    function parentsDe(id) { return rels.filter(function (r) { return r.type === 'parent' && r.to === id && P[r.from]; }).map(function (r) { return r.from; }); }
    function enfantsDe(id) { return rels.filter(function (r) { return r.type === 'parent' && r.from === id && P[r.to]; }).map(function (r) { return r.to; }); }
    var moi = ids.filter(function (id) { return P[id].role === 'moi'; })[0];
    if (!moi) { /* sans « c'est moi » : la personne la plus jeune qui a des parents */
      var avec = ids.filter(function (id) { return parentsDe(id).length; }).sort(function (a, b) { return (annee(P[b].naiss) || 0) - (annee(P[a].naiss) || 0); });
      moi = avec[0] || ids[0];
    }
    var plusVieux = null, gens = 0;
    function construire(id, g) {
      var p = P[id]; if (!p) return null;
      gens = Math.max(gens, g + 1);
      var n = annee(p.naiss); if (n && (!plusVieux || n < plusVieux)) plusVieux = n;
      var o = { prenom: p.prenom || '', nom: p.nom || '', sexe: p.sex === 'f' ? 'f' : 'm', naissance: n, deces: annee(p.deces) || (p.decede ? '?' : null) };
      if (g < 3) {
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
    var freres = Object.keys(fs).slice(0, 4).map(function (id) { var p = P[id]; return { prenom: p.prenom || '', nom: '', sexe: p.sex === 'f' ? 'f' : 'm', naissance: annee(p.naiss), deces: annee(p.deces) || (p.decede ? '?' : null) }; });
    var nomFamille = racine.nom || (racine.pere && racine.pere.nom) || '';
    return {
      titre: nomFamille ? 'La famille ' + nomFamille : 'Notre famille',
      sousTitre: GEN[Math.min(gens, 4) - 1] + (plusVieux ? ' · de ' + plusVieux + ' à aujourd’hui' : ''),
      moi: racine, freresSoeurs: freres, nb: gens
    };
  }

  /* Pour l'image, le décor et les polices doivent être inclus dans le SVG */
  function enDataUrl(url) {
    if (cache[url]) return cache[url];
    cache[url] = fetch(url).then(function (r) { return r.blob(); }).then(function (b) { return new Promise(function (ok) { var f = new FileReader(); f.onload = function () { ok(f.result); }; f.readAsDataURL(b); }); });
    return cache[url];
  }
  function svgAutonome(donnees, apercu) {
    return Promise.all([enDataUrl('assets/arbre/decor-a4.jpg'), enDataUrl('assets/polices/gilda-display-latin-400-normal.woff2'), enDataUrl('assets/polices/nunito-sans-latin-400-normal.woff2'), enDataUrl('assets/polices/nunito-sans-latin-600-normal.woff2')])
      .then(function (d) {
        var polices = '@font-face{font-family:"Gilda Display";src:url(' + d[1] + ') format("woff2")}@font-face{font-family:"Nunito Sans";font-weight:400;src:url(' + d[2] + ') format("woff2")}@font-face{font-family:"Nunito Sans";font-weight:600 800;src:url(' + d[3] + ') format("woff2")}';
        return window.ArbreEncadrer.svg(donnees, { decor: d[0], apercu: apercu }).replace('<style>', '<style>' + polices);
      });
  }
  function versPng(svg) {
    return new Promise(function (ok, ko) {
      var img = new Image(), url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
      img.onload = function () {
        var c = document.createElement('canvas'); c.width = 2480; c.height = 3508;
        c.getContext('2d').drawImage(img, 0, 0, 2480, 3508); URL.revokeObjectURL(url);
        c.toBlob(function (b) { b ? ok(b) : ko(new Error('image')); }, 'image/png');
      };
      img.onerror = function () { URL.revokeObjectURL(url); ko(new Error('image')); };
      img.src = url;
    });
  }
  function nomFichier(d) { return 'arbre-' + (d.titre || 'famille').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-genesolia'; }

  var donnees = null;
  function afficher() {
    donnees = lignee();
    if (!donnees || !donnees.moi || donnees.nb < 2) {
      corps.innerHTML = '<p class="rap-texte">Ajoute au moins tes parents à ton arbre pour obtenir ton arbre à encadrer. Plus il remonte loin, plus il est beau : jusqu’à tes arrière-grands-parents.</p>';
      return;
    }
    var payant = window.GenesoliaAcces && window.GenesoliaAcces.payant('arbreEncadrer'), P = window.GenesoliaAcces ? window.GenesoliaAcces.produit('arbreEncadrer') : null;
    corps.innerHTML = '<div class="fe-grille"><div class="fe-apercu" id="fe-apercu"><p class="rap-texte">Un instant…</p></div><div class="fe-reglages">' +
      '<label class="fe-champ">Titre<input type="text" id="fe-titre" maxlength="40" value="' + esc(donnees.titre) + '"></label>' +
      '<label class="fe-champ">Sous-titre<input type="text" id="fe-sous" maxlength="60" value="' + esc(donnees.sousTitre) + '"></label>' +
      '<p class="fe-aide">Format A4 en haute définition, prêt à imprimer ou à faire encadrer. Les branches suivent ta lignée jusqu’à tes arrière-grands-parents.</p>' +
      '<button class="bt plein rap-gros" type="button" id="fe-png" data-compte="ton arbre à encadrer" data-produit="arbreEncadrer">Télécharger l’image HD</button>' +
      '<button class="bt rap-gros" type="button" id="fe-pdf" data-compte="ton arbre à encadrer" data-produit="arbreEncadrer">Imprimer ou enregistrer en PDF</button>' +
      (payant && P ? '<p class="fe-aide">' + esc(P.prix) + ', ou compris dans Le Cercle.</p>' : '') +
      '<p class="fe-aide" id="fe-statut" aria-live="polite"></p></div></div>';
    dessiner();
    var t; ['fe-titre', 'fe-sous'].forEach(function (id) { document.getElementById(id).addEventListener('input', function () { clearTimeout(t); t = setTimeout(dessiner, 250); }); });
    document.getElementById('fe-png').addEventListener('click', telechargerPng);
    document.getElementById('fe-pdf').addEventListener('click', imprimer);
  }
  function lire() { donnees.titre = document.getElementById('fe-titre').value.trim() || donnees.titre; donnees.sousTitre = document.getElementById('fe-sous').value.trim(); return donnees; }
  function dessiner() {
    var z = document.getElementById('fe-apercu'); if (!z) return;
    var d = lire(), verif = window.GenesoliaAcces ? window.GenesoliaAcces.verifier('arbreEncadrer') : Promise.resolve(true);
    verif.then(function (ok) { z.innerHTML = window.ArbreEncadrer.svg(d, { apercu: !ok }); });
  }
  function statut(t) { var s = document.getElementById('fe-statut'); if (s) s.textContent = t; }
  function telechargerPng() {
    var d = lire(); statut('Préparation de ton image…');
    svgAutonome(d, false).then(versPng).then(function (b) {
      var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = nomFichier(d) + '.png';
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
      statut('Ton image est téléchargée.');
      if (window.umami) try { window.umami.track('arbre-encadrer-png'); } catch (e) {}
    }).catch(function () { statut('L’image n’a pas pu être créée. Essaie « Imprimer ou enregistrer en PDF ».'); });
  }
  function imprimer() {
    var d = lire(), w = window.open('', '_blank');
    if (!w) { statut('Autorise les fenêtres pour ce site, puis réessaie.'); return; }
    w.document.write('<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>' + esc(d.titre) + '</title><style>@page{size:A4;margin:0}html,body{margin:0}svg{display:block;width:210mm;height:297mm}.barre{position:fixed;top:0;left:0;right:0;padding:12px;background:#4A0F36;color:#fff;font:16px sans-serif;text-align:center}.barre button{margin-left:10px;padding:8px 16px;border-radius:99px;border:0;background:#E8C899;font-weight:700}@media print{.barre{display:none}}</style></head><body><div class="barre">Ton arbre est prêt<button onclick="print()">Enregistrer en PDF</button></div><p style="padding:80px 20px;font:16px sans-serif">Un instant…</p></body></html>');
    w.document.close();
    svgAutonome(d, false).then(function (svg) {
      w.document.body.innerHTML = '<div class="barre">Ton arbre est prêt<button onclick="print()">Enregistrer en PDF</button></div>' + svg;
      setTimeout(function () { try { w.focus(); w.print(); } catch (e) {} }, 700);
      if (window.umami) try { window.umami.track('arbre-encadrer-pdf'); } catch (e) {}
    });
  }
  bt.addEventListener('click', function () { afficher(); window.GenoArbre.ouvrir('fen-encadrer'); });
})();
