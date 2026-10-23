/* Genesolia · page génosociogramme : bouton « Mon arbre à encadrer ».
   Aperçu à l'écran (filigrane « Aperçu » tant que le produit est payant et non acheté),
   téléchargement en image haute définition ou en PDF à imprimer. Réglage du prix : assets/site.js (arbreEncadrer). */
(function () {
  'use strict';
  var bt = document.getElementById('bt-encadrer'), fen = document.getElementById('fen-encadrer');
  if (!bt || !fen || !window.ArbreEncadrer || !window.GenoArbre) return;
  var corps = document.getElementById('fe-corps'), cache = {};
  var GEN = ['Une génération', 'Deux générations', 'Trois générations', 'Quatre générations', 'Cinq générations'];
  var choix = { depart: '', nbGen: 0, sousModifie: false, style: 'figuier', vue: 'affiche', freres: true };   /* réglages de la cliente dans la fenêtre */

  function annee(d) { var m = String(d || '').match(/(\d{4})/); return m ? +m[1] : null; }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* L'arbre de la page devient une lignée : moi, mes parents, leurs parents, leurs parents */
  /* Personnes proposées comme point de départ : celles qui ont au moins un parent, de la plus jeune à la plus âgée */
  function departs() {
    var S = window.GenoArbre.etat(), P = S.people || {}, rels = S.rels || [];
    return Object.keys(P).filter(function (id) { return rels.some(function (r) { return r.type === 'parent' && r.to === id && P[r.from]; }); })
      .sort(function (a, b) { return (P[b].role === 'moi') - (P[a].role === 'moi') || (annee(P[b].naiss) || 0) - (annee(P[a].naiss) || 0); })
      .map(function (id) { var p = P[id]; return { id: id, nom: ((p.prenom || '') + ' ' + (p.nom || '')).trim() || 'Sans prénom', an: annee(p.naiss), moi: p.role === 'moi' }; });
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
    var nomFamille = racine.nom || (racine.pere && racine.pere.nom) || '';
    /* Majuscule au nom de famille : « charron » donne « Charron » */
    nomFamille = String(nomFamille).trim().toLowerCase().replace(/(^|[\s\-'’])(\S)/g, function (m, a, b) { return a + b.toUpperCase(); }).replace(/ (De|Du|Des|La|Le|D’|D') /g, function (m) { return m.toLowerCase(); });
    return {
      titre: nomFamille ? 'La famille ' + nomFamille : 'Notre famille',
      /* « à aujourd'hui » seulement si quelqu'un de l'arbre est en vie ; sinon jusqu'à la naissance la plus récente */
      sousTitre: GEN[Math.min(gens, 5) - 1] + (plusVieux ? ' · de ' + plusVieux + ' à ' + (vivant || !plusJeune || plusJeune === plusVieux ? 'aujourd’hui' : plusJeune) : ''),
      moi: racine, freresSoeurs: freres, nb: gens, nbGen: gens, depart: moi
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
    var fig = donnees.style === 'figuier';
    return Promise.all([enDataUrl(fig ? (opt.hd ? 'assets/arbre/figuier.jpg' : 'assets/arbre/figuier-ecran.jpg') : (opt.hd ? 'assets/arbre/decor-hd.jpg' : 'assets/arbre/decor-a4.jpg')), enDataUrl('assets/polices/gilda-display-latin-400-normal.woff2'), enDataUrl('assets/polices/nunito-sans-latin-400-normal.woff2'), enDataUrl('assets/polices/nunito-sans-latin-600-normal.woff2')])
      .then(function (d) {
        var polices = '@font-face{font-family:"Gilda Display";src:url(' + d[1] + ') format("woff2")}@font-face{font-family:"Nunito Sans";font-weight:400;src:url(' + d[2] + ') format("woff2")}@font-face{font-family:"Nunito Sans";font-weight:600 800;src:url(' + d[3] + ') format("woff2")}';
        return window.ArbreEncadrer.svg(donnees, { decor: d[0], apercu: apercu, fondPerdu: !!opt.fondPerdu }).replace('<style>', '<style>' + polices);
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
    dispo = (lignee(choix.depart, 5) || { nb: 0 }).nb;
    var nb = Math.min(choix.nbGen || Math.min(dispo, 4), dispo);
    donnees = lignee(choix.depart, nb);
    if (donnees && titre != null) donnees.titre = titre || donnees.titre;
    if (donnees && sous != null && choix.sousModifie) donnees.sousTitre = sous;
    if (donnees) { donnees.style = choix.style; donnees.nbFreres = donnees.freresSoeurs.length; if (!choix.freres) donnees.freresSoeurs = []; }
  }
  function afficher() {
    choix = { depart: '', nbGen: 0, sousModifie: false, style: choix.style || 'figuier', vue: 'cadre', freres: true };
    donnees = null; recalculer();
    if (!donnees || !donnees.moi || donnees.nb < 2) {
      corps.innerHTML = '<p class="rap-texte">Ajoute au moins tes parents à ton arbre pour obtenir ton arbre à encadrer. Plus il remonte loin, plus il est beau : jusqu’à tes arrière-grands-parents.</p>';
      return;
    }
    var payant = window.GenesoliaAcces && window.GenesoliaAcces.payant('arbreEncadrer'), P = window.GenesoliaAcces ? window.GenesoliaAcces.produit('arbreEncadrer') : null;
    corps.innerHTML = '<div class="fe-grille"><div><div class="fe-vues" id="fe-vues" role="tablist"><button type="button" role="tab" data-vue="cadre" aria-selected="true">Dans son cadre</button><button type="button" role="tab" data-vue="affiche" aria-selected="false">L’affiche</button><button type="button" role="tab" data-vue="scene" aria-selected="false">Mise en scène</button></div><div class="fe-apercu" id="fe-apercu"><p class="rap-texte">Un instant…</p></div><p class="fe-legende" id="fe-legende"></p></div><div class="fe-reglages">' +
      '<div class="fe-champ">Style<div class="fe-styles" role="radiogroup">' + window.ArbreEncadrer.styles.map(function (x) { return '<label><input type="radio" name="fe-style" value="' + x[0] + '"' + (x[0] === choix.style ? ' checked' : '') + '><span>' + esc(x[1]) + '</span></label>'; }).join('') + '</div></div>' +
      '<label class="fe-champ">À partir de qui ?<select id="fe-depart">' + departs().map(function (x) { return '<option value="' + esc(x.id) + '"' + (x.id === donnees.depart ? ' selected' : '') + '>' + esc(x.nom) + (x.an ? ' (' + x.an + ')' : '') + (x.moi ? ' · moi' : '') + '</option>'; }).join('') + '</select></label>' +
      '<label class="fe-champ">Générations<select id="fe-gens"></select></label><p class="fe-aide" id="fe-gens-aide"></p>' +
      '<label class="fe-case" id="fe-freres-l"' + (donnees.nbFreres ? '' : ' hidden') + '><input type="checkbox" id="fe-freres"' + (choix.freres ? ' checked' : '') + '> Inclure les frères et sœurs</label>' +
      '<label class="fe-champ">Titre<input type="text" id="fe-titre" maxlength="40" value="' + esc(donnees.titre) + '"></label>' +
      '<label class="fe-champ">Sous-titre<input type="text" id="fe-sous" maxlength="60" value="' + esc(donnees.sousTitre) + '"></label>' +
      '<p class="fe-aide">Image haute définition, prête à imprimer ou à faire encadrer. Les branches suivent la lignée de la personne choisie.</p>' +
      '<button class="bt plein rap-gros" type="button" id="fe-png" data-compte="ton arbre à encadrer" data-produit="arbreEncadrer">Télécharger l’image HD</button>' +
      '<button class="bt rap-gros" type="button" id="fe-pdf" data-compte="ton arbre à encadrer" data-produit="arbreEncadrer">Imprimer ou enregistrer en PDF</button>' +
      (payant && P ? '<p class="fe-aide">' + esc(P.prix) + ', ou compris dans Le Cercle.</p>' : '') +
      '<p class="fe-aide" id="fe-statut" aria-live="polite"></p>' + blocImpression() + '</div></div>';
    majGens(); dessiner();
    var t; ['fe-titre', 'fe-sous'].forEach(function (id) { document.getElementById(id).addEventListener('input', function () { if (id === 'fe-sous') choix.sousModifie = true; clearTimeout(t); t = setTimeout(dessiner, 250); }); });
    document.getElementById('fe-depart').addEventListener('change', function (e) { choix.depart = e.target.value; choix.nbGen = 0; recalculer(); majGens(); document.getElementById('fe-freres-l').hidden = !donnees.nbFreres; dessiner(); });
    document.getElementById('fe-freres').addEventListener('change', function (e) { choix.freres = e.target.checked; recalculer(); dessiner(); });
    document.getElementById('fe-gens').addEventListener('change', function (e) { choix.nbGen = +e.target.value; recalculer(); majGens(); dessiner(); });
    document.querySelectorAll('input[name=fe-style]').forEach(function (r) { r.addEventListener('change', function () { choix.style = r.value; if (r.value !== 'figuier' && choix.vue === 'scene') choix.vue = 'cadre'; recalculer(); dessiner(); }); });
    document.getElementById('fe-vues').addEventListener('click', function (e) { var b = e.target.closest('[data-vue]'); if (!b) return; choix.vue = b.getAttribute('data-vue'); dessiner(); });
    document.getElementById('fe-png').addEventListener('click', telechargerPng);
    document.getElementById('fe-pdf').addEventListener('click', imprimer);
    brancherImpression();
  }

  /* ===== Le recevoir imprimé : la commande part dans la table demandes, le fichier HD dans Storage (impressions), puis Stripe ===== */
  var IMP = window.GENESOLIA_IMPRESSION || {};
  function ouvert() { return !IMP.ouverture || new Date() >= new Date(IMP.ouverture + 'T00:00:00') || /test-impression/.test(location.search + location.hash); }
  function blocImpression() {
    if (!IMP.actif || !IMP.formats || !IMP.formats.length) return '';
    if (!ouvert()) {
      var j = new Date(IMP.ouverture + 'T00:00:00'), quand = (j.getDate() === 1 ? '1er' : j.getDate()) + ' ' + ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'][j.getMonth()];
      return '<div class="fe-imp"><p class="fe-imp-titre">Bientôt : le recevoir imprimé, prêt à encadrer</p><p class="fe-aide">À partir du ' + quand + ', tu pourras recevoir ton arbre imprimé sur un beau papier épais, en A4 ou en A3, avec ou sans cadre, livré chez toi ou chez la personne à qui tu l’offres.</p>' +
        '<form class="fe-imp-prevenir" id="fe-imp-prevenir" novalidate><div class="fe-deux"><input name="email" type="email" autocomplete="email" placeholder="Ton e-mail" aria-label="Ton e-mail" required><button class="bt rap-gros" type="submit">Me prévenir</button></div><p class="fe-aide" id="fe-prev-statut" aria-live="polite"></p></form></div>';
    }
    return '<div class="fe-imp"><p class="fe-imp-titre">Le recevoir imprimé, prêt à encadrer</p><p class="fe-aide">Imprimé sur un beau papier mat épais et envoyé chez toi (ou chez la personne à qui tu l’offres). ' + esc(IMP.livraison || '') + '.</p>' +
      '<button class="bt rap-gros" type="button" id="fe-imp-ouvrir">Je le reçois imprimé</button>' +
      '<form class="fe-imp-form" id="fe-imp-form" hidden novalidate>' +
        RECU + '<fieldset class="fe-formats"><legend>Format</legend>' + IMP.formats.map(function (f, i) { return '<label class="fe-format"><input type="radio" name="format" value="' + esc(f.id) + '"' + (f.id === 'a4cadre' ? ' checked' : '') + '><span>' + esc(f.nom) + '</span><b>' + esc(f.prix) + '</b></label>'; }).join('') + '</fieldset>' +
        '<div class="fe-deux"><label class="fe-champ">Ton prénom<input name="prenom" autocomplete="given-name" required></label><label class="fe-champ">Ton e-mail<input name="email" type="email" autocomplete="email" required></label></div>' +
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
    var nom = nomFichier(d) + '-' + fmt.id, mm = fmt.mm || [218, 305];
    return svgAutonome(d, false, { hd: true, fondPerdu: true }).then(function (svg) { return versPng(svg, fmt.largeur, true); }).then(function (jpeg) {
      var enJpeg = function () { return deposer(jpeg, nom, 'jpg', 'image/jpeg'); };
      return Promise.all([chargerJsPdf(), jpeg.arrayBuffer()]).then(function (x) {
        var doc = new x[0]({ orientation: 'portrait', unit: 'mm', format: mm, compress: true, putOnlyUsedFonts: true });
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
    f.addEventListener('change', function (e) { if (e.target.name === 'format') { choix.vue = 'cadre'; dessiner(); } });
    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var st = document.getElementById('fe-imp-statut'), bt = f.querySelector('button[type=submit]');
      if (f._gotcha.value) return;
      var manque = ['prenom', 'nom_complet', 'adresse', 'code_postal', 'ville'].filter(function (k) { return !f[k].value.trim(); });
      if (manque.length || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim())) { st.textContent = 'Complète ton prénom, ton e-mail et l’adresse de livraison.'; return; }
      if (!/^\d{5}$/.test(f.code_postal.value.trim())) { st.textContent = 'Vérifie le code postal (5 chiffres, France métropolitaine).'; return; }
      if (!f.accord.checked) { st.textContent = 'Coche la case pour confirmer l’aperçu.'; return; }
      var fmt = IMP.formats.filter(function (x2) { return x2.id === (f.querySelector('input[name=format]:checked') || {}).value; })[0] || IMP.formats[0];
      if (donnees.nbGen === 5 && /^a4/.test(fmt.id)) { st.textContent = 'Avec cinq générations, choisis un format A3.'; return; }
      var d = lire(), lien = (window.GENESOLIA_STRIPE || {})[fmt.stripe] || '';
      /* référence de la commande : relie le paiement Stripe à cette commande (et donc à l'envoi chez l'imprimeur) */
      var ref = Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
      bt.disabled = true; st.textContent = 'Préparation de ton arbre en haute définition…';
      fichierImprimeur(d, fmt).then(function (chemin) {
        var fd = new FormData(f); fd.delete('accord'); fd.delete('format');
        fd.append('format', fmt.id); fd.append('format_nom', fmt.nom); fd.append('prix', fmt.prix); fd.append('titre', d.titre); fd.append('sous_titre', d.sousTitre || '');
        fd.append('fichier', chemin || 'à régénérer depuis l’arbre de la cliente'); fd.append('pays', 'France'); fd.append('paiement', lien ? 'stripe' : 'a-envoyer');
        fd.append('arbre', JSON.stringify(d.moi).slice(0, 3000)); fd.append('ref', ref); fd.append('style', d.style || ''); fd.append('generations', String(d.nbGen || ''));
        return window.GenesoliaEnvoyer('Commande impression', fd, 'genesolia-commande');
      }).then(function () {
        if (window.umami) try { window.umami.track('commande-impression-' + fmt.id); } catch (e) {}
        if (lien) {
          st.textContent = 'Commande enregistrée. Direction le paiement sécurisé…';
          location.href = lien + (lien.indexOf('?') < 0 ? '?' : '&') + 'prefilled_email=' + encodeURIComponent(f.email.value.trim()) + '&client_reference_id=' + encodeURIComponent('imp__' + ref);
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
    for (var n = 2; n <= Math.min(dispo, 5); n++) opts.push('<option value="' + n + '"' + (n === donnees.nbGen ? ' selected' : '') + '>' + GEN[n - 1] + (n === 5 ? ' (A3 seulement)' : '') + '</option>');
    sel.innerHTML = opts.join('');
    var aide = document.getElementById('fe-gens-aide');
    if (aide) aide.textContent = dispo < 5 && dispo < 4 ? '' : donnees.nbGen === 5 ? 'Cinq générations : lisible en A3 seulement. L’A4 est désactivé.' : (dispo >= 5 ? 'Ton arbre va plus loin : choisis « Cinq générations » pour l’A3.' : '');
    if (!choix.sousModifie && document.getElementById('fe-sous')) document.getElementById('fe-sous').value = donnees.sousTitre;
    /* formats d'impression : l'A4 n'est pas proposé avec cinq générations */
    document.querySelectorAll('#fe-imp-form input[name=format]').forEach(function (r) {
      var f = (IMP.formats || []).filter(function (x) { return x.id === r.value; })[0] || {}, a4 = /^a4/.test(f.id || '');
      r.disabled = donnees.nbGen === 5 && a4; r.closest('label').classList.toggle('fe-off', r.disabled);
      if (r.disabled && r.checked) { var a3 = document.querySelector('#fe-imp-form input[name=format]:not(:disabled)'); if (a3) a3.checked = true; }
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
    '<li><b>Fabriqué pour toi</b>, à la commande, puis expédié sous 3 à 7 jours ouvrés dans un emballage protégé, en France métropolitaine. Livraison comprise.</li>' +
    '<li><b>Tranquillité</b> : s’il arrive abîmé ou s’il y a une erreur d’impression, envoie-nous une photo dans les 14 jours, il est réimprimé ou remboursé. Un colis perdu est renvoyé. Comme c’est un objet personnalisé, il ne peut pas être repris pour un changement d’avis. Les couleurs peuvent varier légèrement entre l’écran et le papier.</li>' +
    '</ul><p><a href="cgv.html#arbre-imprime" target="_blank">Conditions de vente de l’arbre imprimé</a></p></details>';
  function lire() { donnees.titre = document.getElementById('fe-titre').value.trim() || donnees.titre; donnees.sousTitre = document.getElementById('fe-sous').value.trim(); return donnees; }
  function dessiner() {
    var z = document.getElementById('fe-apercu'); if (!z) return;
    var d = lire(), verif = window.GenesoliaAcces ? window.GenesoliaAcces.verifier('arbreEncadrer') : Promise.resolve(true);
    var vue = choix.vue === 'scene' && d.style !== 'figuier' ? 'cadre' : choix.vue, vues = document.getElementById('fe-vues');
    if (vues) vues.querySelectorAll('[data-vue]').forEach(function (b) { var v = b.getAttribute('data-vue'); b.hidden = v === 'scene' && d.style !== 'figuier'; b.setAttribute('aria-selected', String(v === vue)); });
    /* le format montré : celui coché dans la commande, sinon l'A4 encadré (l'A3 encadré en cinq générations) */
    var coche = document.querySelector('#fe-imp-form input[name=format]:checked'), fid = coche && !coche.disabled ? coche.value : (d.nbGen === 5 ? 'a3cadre' : 'a4cadre');
    var f = ((window.GENESOLIA_IMPRESSION || {}).formats || []).filter(function (x) { return x.id === fid; })[0];
    var format = /^a3/.test(fid) ? 'a3' : 'a4', cadre = /cadre/.test(fid) ? 'bois' : '';
    var leg = document.getElementById('fe-legende');
    if (leg) leg.innerHTML = vue === 'cadre' ? esc((f ? f.nom : (format === 'a3' ? 'A3' : 'A4') + ' encadré') + (f ? ' · ' + f.prix : '')) + '<br>' + esc(INFOS[format + (cadre ? 'cadre' : '')] || '') :
      vue === 'scene' ? 'Mise en scène pour l’inspiration : tu reçois l’affiche seule ou dans son cadre, sans les fleurs.' : 'L’affiche telle qu’elle sera imprimée (le cadre recouvre environ 3 mm sur chaque bord).';
    verif.then(function (ok) { z.innerHTML = window.ArbreEncadrer.svg(d, vue === 'cadre' ? { apercu: !ok, cadre: cadre, format: format } : { apercu: !ok, scene: vue === 'scene' }); });
  }
  function statut(t) { var s = document.getElementById('fe-statut'); if (s) s.textContent = t; }
  /* Par mail d'abord : la page de l'arbre (à enregistrer en PDF ou imprimer), avec un lien de secours */
  var direct = false;
  function parMail(secours) {
    var d = lire();
    window.GenesoliaParMail.envoyer({ quoi: 'ton arbre à encadrer', secours: function () { direct = true; try { secours(); } finally { direct = false; } },
      html: svgAutonome(d, false).then(function (svg) {
        return '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>' + esc(d.titre) + ' · Genesolia</title><style>@page{size:A4;margin:0}html,body{margin:0;background:#fff}svg{display:block;width:210mm;max-width:100%;height:auto;margin:0 auto}.barre{position:sticky;top:0;padding:12px;background:#4A0F36;color:#fff;font:16px sans-serif;text-align:center}.barre button{margin-left:10px;padding:8px 16px;border-radius:99px;border:0;background:#E8C899;font-weight:700}@media print{.barre{display:none}svg{width:210mm;height:297mm}}</style></head><body><div class="barre">Ton arbre Genesolia<button onclick="print()">Enregistrer en PDF</button></div>' + svg + '</body></html>';
      }) });
  }
  function telechargerPng() {
    if (!direct && window.GenesoliaParMail) return parMail(telechargerPng);
    var d = lire(); statut('Préparation de ton image…');
    svgAutonome(d, false, { hd: true }).then(function (svg) { return versPng(svg); }).then(function (b) {
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
    w.document.write('<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>' + esc(d.titre) + '</title><style>@page{size:A4;margin:0}html,body{margin:0}svg{display:block;width:210mm;height:297mm}.barre{position:fixed;top:0;left:0;right:0;padding:12px;background:#4A0F36;color:#fff;font:16px sans-serif;text-align:center}.barre button{margin-left:10px;padding:8px 16px;border-radius:99px;border:0;background:#E8C899;font-weight:700}@media print{.barre{display:none}}</style></head><body><div class="barre">Ton arbre est prêt<button onclick="print()">Enregistrer en PDF</button></div><p style="padding:80px 20px;font:16px sans-serif">Un instant…</p></body></html>');
    w.document.close();
    svgAutonome(d, false, { hd: true }).then(function (svg) {
      w.document.body.innerHTML = '<div class="barre">Ton arbre est prêt<button onclick="print()">Enregistrer en PDF</button></div>' + svg;
      setTimeout(function () { try { w.focus(); w.print(); } catch (e) {} }, 700);
      if (window.umami) try { window.umami.track('arbre-encadrer-pdf'); } catch (e) {}
    });
  }
  bt.addEventListener('click', function () { afficher(); window.GenoArbre.ouvrir('fen-encadrer'); });
})();
