/* Genesolia · la boutique (boutique.html) : posters, vêtements, mugs, coques et calendrier de la collection « Je suis celle qui ose ».
   Catalogue : boutique/catalogue.json (stockage public Supabase), copié depuis la boutique Gelato par la fonction boutique-catalogue.
   Panier : gardé sur cet appareil (localStorage « genesolia-panier »). Paiement : fonction boutique-paiement (Stripe),
   qui relit les prix dans le catalogue. Après paiement, stripe-webhook passe la commande chez Gelato en brouillon. */
(function () {
  'use strict';
  var SB = 'https://qsvzzkjtjsznfntahvvh.supabase.co', PUB = SB + '/storage/v1/object/public/boutique/';
  var CLE = 'genesolia-panier', CAT = null, filtre = 'tout', phraseF = '', ouvert = null;
  var z = document.getElementById('bq'), grille = document.getElementById('bq-grille');
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function eur(n) { return String(n).replace('.', ',') + ' €'; }
  function lire() { try { var p = JSON.parse(localStorage.getItem(CLE) || '[]'); return Array.isArray(p) ? p : []; } catch (e) { return []; } }
  function ecrire(p) { try { localStorage.setItem(CLE, JSON.stringify(p)); } catch (e) {} majCompteur(); }
  function norm(t) { return String(t || '').replace(/[’']/g, '’').replace(/\s+/g, ' ').trim(); }
  function nomType(p) { return /brillant/i.test(p.titre) ? 'Poster encadré brillant' : p.nomType; }
  function libOption(p) { return p.type === 'toile' ? 'Châssis' : p.type === 'encadre' ? 'Cadre' : p.type === 'baguettes' ? 'Baguettes' : p.famille === 'vetements' ? 'Couleur' : 'Option'; }
  /* Délais de livraison du transporteur, lus dans les devis Gelato du 01/11/2026 (France métropolitaine), après 2 à 5 jours ouvrés de fabrication */
  function livraison(p, v) {
    var c = v && v.cle, t = p.type;
    if (t === 'baguettes') return c === 'a4' ? [4, 8] : c === '30x40' ? [2, 8] : [2, 4];
    if (t === 'encadre') return c === 'a3' ? [4, 8] : [2, 4];
    return { poster: [2, 4], toile: [3, 5], calendrier: [3, 5], mug: [3, 5], capuche: [3, 5], tfemme: [3, 5], sweat: [4, 8], hoodie: [5, 10], tcourt: [5, 10], tshirt: [5, 9], coque: [9, 12] }[t] || null;
  }
  function delais(p, v) { var l = livraison(p, v); return '<p class="bq-delai"><b>Délai</b> : fabriqué et expédié sous 2 à 5 jours ouvrés' + (l ? ', puis livré en ' + l[0] + ' à ' + l[1] + ' jours ouvrés' : '') + ' (France métropolitaine).<br><b>Retour</b> : 14 jours après réception pour changer d’avis, frais de retour à ta charge ; un défaut ou un article abîmé est réimprimé ou remboursé. <a href="cgv.html#retractation">Conditions</a></p>'; }
  function libTaille(p) { return p.type === 'coque' ? 'Modèle' : 'Taille'; }
  /* la photo de la variante choisie : même taille et même couleur, sinon même taille, sinon même couleur, sinon la première */
  function photo(p, opt, cle) { var l = p.photos || [], x = null;
    if (cle) x = l.filter(function (f) { return f.cle === cle && (f.option || '') === (opt || ''); })[0] || l.filter(function (f) { return f.cle === cle; })[0];
    if (!x && opt) x = l.filter(function (f) { return f.option === opt; })[0];
    return url((x || l[0] || {}).src); }
  function url(s) { return /^assets\//.test(s || '') ? s : PUB + s; }
  /* la description, sans la fiche technique en anglais ajoutée par Gelato */
  /* Matières, d'après les modèles choisis sur Gelato */
  var LAV = ' Lavage à 30 °C sur l’envers, pas de sèche-linge, ne pas repasser sur l’impression.';
  var MATIERE = {
    tshirt: 'T-shirt unisexe col rond, tissu « performance » 100 % polyester, léger et respirant.' + LAV,
    tfemme: 'T-shirt femme Gildan Softstyle 64000L, 100 % coton filé, doux et léger, coupe ajustée.' + LAV,
    tcourt: 'T-shirt femme Champion T453W, 100 % coton, coupe courte.' + LAV,
    sweat: 'Sweat col rond Gildan Heavy Blend 18000, 50 % coton, 50 % polyester, intérieur molletonné.' + LAV,
    capuche: 'Sweat à capuche Gildan Heavy Blend 18500, 50 % coton, 50 % polyester, intérieur molletonné, poche kangourou.' + LAV,
    hoodie: 'Hoodie premium Lane Seven LS13001, 80 % coton, 20 % polyester, molleton épais et très doux, poche kangourou.' + LAV,
    mug: 'Mug en céramique, 325 ml, intérieur rose. Va au lave-vaisselle et au micro-ondes.',
    poster: 'Papier mat 200 g/m² (0,26 mm), surface lisse, sans reflet, certifié FSC. Livré sans cadre.',
    encadre: 'Papier semi-brillant 170 g/m² (0,19 mm). Cadre en pin massif avec plexiglas, prêt à accrocher (attache fournie). Cadre de 20 à 25 mm d’épaisseur et de 10 à 14 mm de large. Couleurs : bois naturel, bois foncé, noir ou blanc.',
    baguettes: 'Papier mat 200 g/m² (0,22 mm). Baguettes de suspension en pin massif, en haut et en bas. Couleurs : bois naturel, bois foncé, noir ou blanc.',
    calendrier: 'Calendrier mural 2027, format 14,8 × 40 cm, 13 pages (une couverture et un mois par page), papier couché satiné 250 g, reliure spirale avec crochet, prêt à accrocher.',
    coque: 'Coque souple et transparente sur les côtés, finition satinée, impression résistante aux rayures. Accès à tous les boutons et à la recharge.'
  };
  function descr(p) { return String(p.description || '').split(/\s(?:Paper Finishing|Ready-to-hang|Paper Weight|Frame Material|Sustainable Paper|Available Sizes|Product features|Size guide)\s?:/i)[0].replace(/\s*Genesolia\s*[–-]\s*genesolia\.fr\s*$/i, '').trim(); }
  /* Matière et détails des vêtements (modèles Gelato vérifiés le 01/11/2026 sur les fiches fabricants ; couleurs unies). T-shirt unisexe : matière non confirmée, rien d'affiché. */
  var MATIERE = {
    capuche: ['Gildan Heavy Blend 18500', '50 % coton, 50 % polyester, molleton d’environ 270 g/m²', 'Coupe classique, capuche doublée avec cordon assorti, poche kangourou, poignets et bas côtelés extensibles'],
    sweat: ['Gildan Heavy Blend 18000', '50 % coton, 50 % polyester, molleton d’environ 270 g/m²', 'Col, poignets et bas côtelés extensibles, coutures doubles'],
    hoodie: ['Lane Seven LS13001', '80 % coton peigné, 20 % polyester, French terry 250 g/m²', 'Capuche doublée en trois panneaux, finition demi-lune au dos du col'],
    tfemme: ['Gildan Softstyle 64000L', '100 % coton peigné, prérétréci, 153 g/m² (léger)', 'Coupe semi-ajustée, col côtelé'],
    tcourt: ['Champion T453W', '100 % coton, jersey épais d’environ 237 g/m²', 'Coupe courte, épaules tombantes, petit logo « C » Champion sur la manche gauche']
  };
  function matiere(p) { var m = MATIERE[p.type]; return m ? '<details class="bq-desc" open><summary>Matière et détails</summary><p><b>' + esc(m[1]) + '</b><br>' + esc(m[2]) + '.<br><small>Modèle : ' + esc(m[0]) + '. Imprimé à la demande.</small></p></details>' : ''; }
  function index() { var o = {}; (CAT.produits || []).forEach(function (p) { p.variantes.forEach(function (v) { o[v.id] = { p: p, v: v }; }); }); return o; }

  /* ───── La grille ───── */
  function cartes() {
    var l = CAT.produits.filter(function (p) { return (filtre === 'tout' || p.famille === filtre) && (!phraseF || norm(p.phrase) === phraseF); });
    var ordre = { posters: 0, vetements: 1, maison: 2 };
    l.sort(function (a, b) { return (ordre[a.famille] - ordre[b.famille]) || norm(a.phrase).localeCompare(norm(b.phrase)) || a.prixMin - b.prixMin; });
    /* Vêtements : un seul article par modèle, le motif se choisit dans la fiche (sauf si une phrase est filtrée) */
    if (!phraseF) { var vus = {}; l = l.filter(function (p) { if (p.famille !== 'vetements') return true; if (vus[p.type]) return false; vus[p.type] = 1; return true; })
      .map(function (p) { if (p.famille !== 'vetements') return p; var fr = freres(p), b = fr.filter(function (x) { return /^assets\//.test(((x.photos || [])[0] || {}).src || ''); })[0]; return b || p; }); }
    { var vp = {}; l = l.filter(function (p) { if (p.famille !== 'posters') return true; var k = norm(p.phrase) + '|' + (p.motif || ''); if (vp[k]) return false; vp[k] = 1; return true; }).map(function (p) { return p.famille === 'posters' ? vitrine(p) : p; }); }
    /* Vue « Tout » : on mélange (un poster, un vêtement, un objet…), et les articles avec une vraie photo d'abord, pour que la page soit variée dès l'arrivée */
    if (filtre === 'tout' && !phraseF) {
      var aPhoto = function (p) { return /^assets\//.test(((p.photos || [])[0] || {}).src || '') ? 0 : 1; };
      var tas = { posters: [], vetements: [], maison: [] };
      l.forEach(function (p) { (tas[p.famille] = tas[p.famille] || []).push(p); });
      Object.keys(tas).forEach(function (k) { tas[k].sort(function (a, b) { return aPhoto(a) - aPhoto(b); }); });
      /* les posters : on alterne aussi poster, encadré, baguettes */
      var pt = {}; tas.posters.forEach(function (p) { (pt[p.type] = pt[p.type] || []).push(p); }); var pk = Object.keys(pt), pm = [];
      for (var i = 0; pm.length < tas.posters.length; i++) pk.forEach(function (k) { if (pt[k][i]) pm.push(pt[k][i]); });
      tas.posters = pm; var m = [], f = ['vetements', 'posters', 'maison'].concat(Object.keys(tas).filter(function (k) { return ['vetements', 'posters', 'maison'].indexOf(k) < 0; }));
      for (var j = 0; m.length < l.length; j++) f.forEach(function (k) { if ((tas[k] || [])[j]) m.push(tas[k][j]); });
      l = m;
    }
    grille.innerHTML = l.length ? l.map(function (p) {
      if (p.famille === 'livres') return '<a class="bq-carte" href="' + esc(p.lien) + '" target="_blank" rel="noopener"><span class="bq-img"><img src="' + esc(p.photos[0].src) + '" alt="" loading="lazy" decoding="async"></span>' +
        '<span class="bq-type">Livre papier · Amazon</span><span class="bq-phrase">' + esc(p.phrase) + '</span><span class="bq-prix">' + (p.prixTexte ? esc(p.prixTexte) + ' · ' : '') + 'Acheter sur Amazon</span></a>';
      return '<button type="button" class="bq-carte" data-p="' + esc(p.id) + '"><span class="bq-img"><img src="' + esc(photo(p)) + '" alt="" loading="lazy" decoding="async"></span>' +
        '<span class="bq-type">' + (styles(p).length > 1 ? 'Affiche · ' + styles(p).map(nomStyle).join(', ') : esc(nomType(p)) + (p.motif ? ' · ' + esc(p.motif) : '')) + '</span><span class="bq-phrase">' + (p.famille === 'vetements' && !phraseF && freres(p).length > 1 ? freres(p).length + ' motifs au choix' : '« ' + esc(norm(p.phrase)) + ' »') + '</span><span class="bq-prix">' + ((p.variantes.length > 1 && p.variantes.some(function (v) { return v.prix !== p.prixMin; })) || styles(p).length > 1 ? 'dès ' : '') + eur(Math.min.apply(null, styles(p).map(function (x) { return x.prixMin; }))) + '</span><span class="bq-livr-c">Livraison offerte</span></button>';
    }).join('') : '<p class="bq-vide">Rien ici pour l’instant.</p>';
  }
  /* Posters : une seule carte par phrase, le style (poster, encadré, baguettes, toile) se choisit dans la fiche, comme le motif des vêtements */
  var ORDRE_S = { poster: 0, encadre: 1, baguettes: 2, toile: 3 };
  function styles(p) { if (p.famille !== 'posters') return [p]; return CAT.produits.filter(function (x) { return x.famille === 'posters' && norm(x.phrase) === norm(p.phrase) && (x.motif || '') === (p.motif || ''); })
    .sort(function (a, b) { return (ORDRE_S[a.type] - ORDRE_S[b.type]) || (/brillant/i.test(a.titre) ? 1 : 0) - (/brillant/i.test(b.titre) ? 1 : 0); }); }
  function vitrine(p) { var st = styles(p), b = st.filter(function (x) { return /^assets\//.test(((x.photos || [])[0] || {}).src || ''); })[0]; var bs = st.filter(function (x) { return /^assets\//.test(((x.photos || [])[0] || {}).src || ''); }); return bs.filter(function (x) { return x.type === 'encadre'; })[0] || bs[0] || st.filter(function (x) { return x.type === 'encadre'; })[0] || st[0]; }
  function nomStyle(x) { return { poster: 'Poster', encadre: 'Encadré', baguettes: 'Baguettes', toile: 'Toile' }[x.type] + (/brillant/i.test(x.titre) ? ' brillant' : ''); }
  /* les autres motifs du même vêtement */
  function freres(p) { return CAT.produits.filter(function (x) { return x.type === p.type && x.famille === 'vetements'; }).sort(function (a, b) { return norm(a.phrase).localeCompare(norm(b.phrase)); }); }
  function filtres() {
    var ph = []; CAT.produits.forEach(function (p) { var n = norm(p.phrase); if (p.famille !== 'livres' && !/^Calendrier/.test(n) && ph.indexOf(n) < 0) ph.push(n); }); ph.sort();
    document.getElementById('bq-phrases').innerHTML = '<option value="">Toutes les phrases</option>' + ph.map(function (t) { return '<option value="' + esc(t) + '">' + esc(t) + '</option>'; }).join('');
  }

  /* ───── La fiche d'un produit ───── */
  function fiche(id, garder) {
    var p = CAT.produits.filter(function (x) { return x.id === id; })[0]; if (!p) return;
    var tailles = [], options = []; p.variantes.forEach(function (v) { if (v.taille && tailles.indexOf(v.taille) < 0) tailles.push(v.taille); if (v.option && options.indexOf(v.option) < 0) options.push(v.option); });
    var o0 = ((p.photos || [])[0] || {}).option; /* la couleur de la première photo est choisie d'abord */
    var touche = false; /* la mise en scène de Laura reste en grand tant qu'on n'a pas choisi une taille ou une couleur */
    var choix = { t: tailles[0] || '', o: (o0 && options.indexOf(o0) >= 0 ? o0 : options[0]) || '', q: 1 };
    if (garder) { if (tailles.indexOf(garder.t) >= 0) choix.t = garder.t; if (options.indexOf(garder.o) >= 0) choix.o = garder.o; choix.q = garder.q || 1; }
    var d = document.getElementById('bq-fiche');
    function variante() { return p.variantes.filter(function (v) { return (v.taille || '') === choix.t && (v.option || '') === choix.o; })[0] || null; }
    function dispo(t, o) { return p.variantes.some(function (v) { return (v.taille || '') === t && (v.option || '') === o; }); }
    function rendre() {
      if (!variante()) { var v0 = p.variantes.filter(function (v) { return (v.taille || '') === choix.t; })[0] || p.variantes[0]; choix.t = v0.taille || ''; choix.o = v0.option || ''; }
      var v = variante(), f0 = (p.photos || [])[0] || {}, princ = !touche && /^assets\//.test(f0.src || '') && !f0.option && !f0.cle ? url(f0.src) : photo(p, choix.o, v && v.cle), ph = (p.photos || []).filter(function (f) { return !f.cle || !v || f.cle === v.cle; });
      d.querySelector('.bq-f-corps').innerHTML =
        '<div class="bq-f-photos"><img class="bq-f-grande" src="' + esc(princ) + '" alt="' + esc(nomType(p) + ' « ' + norm(p.phrase) + ' »') + '">' +
        (ph.length > 1 ? '<div class="bq-f-mini">' + ph.map(function (f) { return '<button type="button" data-ph="' + esc(url(f.src)) + '"><img src="' + esc(url(f.src)) + '" alt="" loading="lazy"></button>'; }).join('') + '</div>' : '') + '</div>' +
        '<div class="bq-f-info"><p class="bq-type">' + esc(nomType(p)) + (p.motif ? ' · ' + esc(p.motif) : '') + '</p><h2 id="bq-f-titre">« ' + esc(norm(p.phrase)) + ' »</h2>' +
        '<p class="bq-f-prix">' + (v ? eur(v.prix) : '') + ' <small>livraison offerte</small></p>' +
        (styles(p).length > 1 ? '<p class="bq-lab">Style</p><div class="bq-choix">' + styles(p).map(function (x) { return '<button type="button" data-style="' + esc(x.id) + '" aria-pressed="' + (x.id === p.id) + '">' + esc(nomStyle(x)) + '</button>'; }).join('') + '</div>' : '') +
        (p.famille === 'vetements' && freres(p).length > 1 ? '<p class="bq-lab">Motif</p><select class="bq-motif" data-motif aria-label="Motif">' + freres(p).map(function (x) { return '<option value="' + esc(x.id) + '"' + (x.id === p.id ? ' selected' : '') + '>' + esc(norm(x.phrase)) + '</option>'; }).join('') + '</select>' : '') +
        (tailles.length > 1 || (tailles.length === 1 && p.famille !== 'maison') ? '<p class="bq-lab">' + libTaille(p) + '</p><div class="bq-choix" data-c="t">' + tailles.map(function (t) { return '<button type="button" data-v="' + esc(t) + '" aria-pressed="' + (t === choix.t) + '"' + (dispo(t, choix.o) || !choix.o ? '' : ' class="bq-ind"') + '>' + esc(t) + '</button>'; }).join('') + '</div>' : '') +
        (options.length ? '<p class="bq-lab">' + libOption(p) + '</p><div class="bq-choix" data-c="o">' + options.map(function (o) { return '<button type="button" data-v="' + esc(o) + '" aria-pressed="' + (o === choix.o) + '"' + (dispo(choix.t, o) ? '' : ' class="bq-ind"') + '>' + esc(o) + '</button>'; }).join('') + '</div>' : '') +
        '<div class="bq-f-achat"><label class="bq-qte">Quantité <select data-q>' + [1, 2, 3, 4, 5].map(function (n) { return '<option' + (n === choix.q ? ' selected' : '') + '>' + n + '</option>'; }).join('') + '</select></label>' +
        '<button type="button" class="btn btn-plein" data-ajout' + (v ? '' : ' disabled') + '>Ajouter au panier</button></div><p class="bq-ok" role="status" aria-live="polite"></p>' +
        delais(p, v) +
        '<ul class="bq-f-plus"><li>Imprimé à la demande, rien n’est produit en trop</li><li>Livraison offerte en France métropolitaine</li><li>Un défaut ou un article abîmé : réimprimé ou remboursé</li></ul>' +
        matiere(p) + (descr(p) ? '<details class="bq-desc"><summary>Description</summary><p>' + esc(descr(p)) + '</p></details>' : '') +
        (MATIERE[p.type] ? '<details class="bq-desc" open><summary>Matière et entretien</summary><p>' + esc(MATIERE[p.type]) + '</p></details>' : '') + '</div>';
    }
    d.onclick = function (e) {
      if (e.target === d || e.target.closest('[data-f-fermer]')) { fermer(); return; }
      var m = e.target.closest('[data-ph]'); if (m) { d.querySelector('.bq-f-grande').src = m.getAttribute('data-ph'); return; }
      var sy = e.target.closest('[data-style]'); if (sy) { if (sy.getAttribute('data-style') !== p.id) fiche(sy.getAttribute('data-style'), choix); return; }
      var c = e.target.closest('.bq-choix button'); if (c) { choix[c.parentNode.getAttribute('data-c')] = c.getAttribute('data-v'); touche = true; rendre(); return; }
      if (e.target.closest('[data-ajout]')) {
        var v = variante(); if (!v) return; var pan = lire(), l = pan.filter(function (x) { return x.v === v.id; })[0];
        if (l) l.q = Math.min(10, l.q + choix.q); else pan.push({ v: v.id, q: choix.q }); ecrire(pan);
        /* retour visible : le bouton confirme, le bouton du panier s'anime */
        var ba = e.target.closest('[data-ajout]'); ba.textContent = 'Ajouté au panier ✓'; ba.classList.add('bq-ajoute');
        setTimeout(function () { ba.textContent = 'Ajouter au panier'; ba.classList.remove('bq-ajoute'); }, 2200);
        var pb = document.getElementById('bq-panier-bt'); if (pb) { pb.classList.remove('bq-pulse'); void pb.offsetWidth; pb.classList.add('bq-pulse'); }
        var ok = d.querySelector('.bq-ok'); ok.innerHTML = 'C’est dans ton panier. <button type="button" class="bq-lien" data-voir-panier>Voir mon panier</button>'; return;
      }
      if (e.target.closest('[data-voir-panier]')) { fermer(); panier(true); }
    };
    d.onchange = function (e) { if (e.target.matches('[data-q]')) choix.q = +e.target.value || 1; if (e.target.matches('[data-motif]')) fiche(e.target.value, choix); };
    rendre(); ouvert = p.id;
    if (d.showModal) { if (!d.open) d.showModal(); } else d.setAttribute('open', '');
    try { history.replaceState(null, '', '#' + p.slug); } catch (e) {}
  }
  function fermer() { var d = document.getElementById('bq-fiche'); if (d.close) d.close(); else d.removeAttribute('open'); ouvert = null; try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {} }

  /* ───── Le panier ───── */
  function majCompteur() { var n = lire().reduce(function (s, x) { return s + x.q; }, 0), b = document.getElementById('bq-panier-bt'); if (b) { b.querySelector('b').textContent = n; b.hidden = !n; } }
  function panier(ouvrir) {
    var p = document.getElementById('bq-panier'), I = index(), pan = lire().filter(function (x) { return I[x.v]; });
    var total = pan.reduce(function (s, x) { return s + I[x.v].v.prix * x.q; }, 0);
    p.querySelector('.bq-p-corps').innerHTML = pan.length ? '<ul class="bq-lignes">' + pan.map(function (x) { var t = I[x.v]; return '<li><img src="' + esc(photo(t.p, t.v.option)) + '" alt=""><div><b>' + esc(nomType(t.p)) + '</b><span>« ' + esc(norm(t.p.phrase)) + ' »</span><small>' + esc([t.v.taille, t.v.option].filter(Boolean).join(' · ')) + '</small>' +
        '<div class="bq-l-q"><button type="button" data-moins="' + esc(x.v) + '" aria-label="Un de moins">−</button><span>' + x.q + '</span><button type="button" data-plus="' + esc(x.v) + '" aria-label="Un de plus">+</button><button type="button" class="bq-lien" data-retirer="' + esc(x.v) + '">Retirer</button></div></div><p class="bq-l-prix">' + eur(t.v.prix * x.q) + '</p></li>'; }).join('') + '</ul>' +
      '<p class="bq-total"><span>Total</span><b>' + eur(total) + '</b></p><p class="bq-livr">Livraison offerte en France métropolitaine. Chaque article est imprimé à la demande, puis expédié sous 2 à 5 jours ouvrés (délai de livraison indiqué sur chaque fiche). Retour possible 14 jours après réception (<a href="cgv.html#retractation">conditions</a>). Plusieurs articles peuvent arriver dans des colis séparés.</p>' +
      '<button type="button" class="btn btn-plein bq-payer" data-payer-panier>Payer en toute sécurité</button><p class="bq-err" role="alert"></p><p class="bq-cgv">En payant, tu acceptes les <a href="cgv.html#boutique">conditions de vente</a>.</p>'
      : '<p class="bq-vide">Ton panier est vide.</p><button type="button" class="btn btn-trait" data-p-fermer>Continuer mes achats</button>';
    if (ouvrir) { p.hidden = false; document.body.classList.add('bq-fige'); requestAnimationFrame(function () { p.classList.add('ouvert'); }); }
  }
  function fermerPanier() { var p = document.getElementById('bq-panier'); p.classList.remove('ouvert'); document.body.classList.remove('bq-fige'); setTimeout(function () { p.hidden = true; }, 250); }
  function payer(bt) {
    var pan = lire(); if (!pan.length) return; bt.disabled = true; bt.textContent = 'Un instant…';
    var err = document.querySelector('.bq-err');
    fetch(SB + '/functions/v1/boutique-paiement', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ panier: pan }) })
      .then(function (r) { return r.json(); }).then(function (j) { if (j && j.url) { location.href = j.url; return; } throw new Error(j && j.erreur || 'erreur'); })
      .catch(function (e) { bt.disabled = false; bt.textContent = 'Payer en toute sécurité'; err.textContent = e && e.message && e.message !== 'erreur' && !/fetch/i.test(e.message) ? e.message : 'Le paiement n’a pas pu s’ouvrir. Réessaie dans un instant.'; });
  }

  /* ───── Les clics ───── */
  document.addEventListener('click', function (e) {
    var c = e.target.closest('[data-p]'); if (c) { fiche(c.getAttribute('data-p')); return; }
    var ia = e.target.closest('[data-aller-type]'); if (ia && CAT) { var pt = CAT.produits.filter(function (x) { return x.type === ia.getAttribute('data-aller-type'); })[0]; if (pt) fiche(pt.id); return; }
    var fa = e.target.closest('[data-aller-famille]'); if (fa) { var bt = document.querySelector('[data-famille="' + fa.getAttribute('data-aller-famille') + '"]'); if (bt) bt.click(); document.getElementById('bq-barre').scrollIntoView({ behavior: 'smooth' }); return; }
    var f = e.target.closest('[data-famille]'); if (f) { filtre = f.getAttribute('data-famille'); document.querySelectorAll('[data-famille]').forEach(function (b) { b.setAttribute('aria-pressed', b === f); }); cartes(); return; }
    if (e.target.closest('#bq-panier-bt')) { panier(true); return; }
    var p = document.getElementById('bq-panier');
    if (e.target === p || e.target.closest('[data-p-fermer]')) { fermerPanier(); return; }
    var pl = e.target.closest('[data-plus]'), mo = e.target.closest('[data-moins]'), re = e.target.closest('[data-retirer]');
    if (pl || mo || re) {
      var id = (pl || mo || re).getAttribute(pl ? 'data-plus' : mo ? 'data-moins' : 'data-retirer'), pan = lire();
      pan = pan.map(function (x) { if (x.v === id) x.q = re ? 0 : Math.max(0, Math.min(10, x.q + (pl ? 1 : -1))); return x; }).filter(function (x) { return x.q > 0; });
      ecrire(pan); panier(false); return;
    }
    var py = e.target.closest('[data-payer-panier]'); if (py) payer(py);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !document.getElementById('bq-panier').hidden) fermerPanier(); });
  document.getElementById('bq-phrases').addEventListener('change', function (e) { phraseF = e.target.value; cartes(); });

  /* ───── Le départ ───── */
  var merci = (location.search.match(/[?&]merci=([a-z0-9]{16})/) || [])[1];
  if (merci) { try { localStorage.removeItem(CLE); } catch (e) {} var m = document.getElementById('bq-merci'); if (m) m.hidden = false; }
  majCompteur();
  fetch(PUB + 'catalogue.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (c) {
    /* Mugs : seulement ceux qui ont une belle photo (mise en scène), à la place de celle de Gelato */
    var MUGS = { '4f5360f2-ae10-4df0-958e-ad300231760b': 'assets/boutique/mug-ancetres.webp', '3ac4634b-f06d-4d42-9e11-0f0a88eba3f7': 'assets/boutique/mug-entiere.webp', '19aa2d12-239a-4224-a937-29dfff0976e6': 'assets/boutique/mug-aimer.webp' };
    c.produits = (c.produits || []).filter(function (p) { if (p.type !== 'mug') return true; if (!MUGS[p.id]) return false; p.photos = [{ src: MUGS[p.id], option: '' }]; return true; });
    /* Photos portées, placées en premier (les photos Gelato restent après) */
    /* Photos de Laura, placées en premier (les photos Gelato restent après). [fichier, couleur] : la couleur remplace la photo Gelato de cette couleur */
    var PORTE = {
      '80c01b03-9cfd-4c05-90d7-1f3e9ff0027a': [['tshirt-ancetres', '']],                 // T-shirt classique · ancêtres
      'd3224375-7071-40b0-a452-f8472195bc20': [['capuche-entiere', 'Blanc'], ['capuche-entiere-2', '']],            // Sweat à capuche blanc · entière
      '8133217c-9628-48e4-a328-dff2e58789a7': [['tshirt-entiere', '']],                  // T-shirt classique · entière
      'b3fc1393-8799-4211-a316-4bb11a3b2db2': [['court-entiere', '']],                   // T-shirt court femme · entière
      'afa57379-cd46-4269-bc1b-aa19fbac1a54': [['capuche-excuse-rose', 'Rose clair']],   // Sweat à capuche rose clair · m'excuse
      '7b51a4ee-c89f-4fb7-84e9-ce07c12b0e47': [['sweat-excuse-rose', 'Rose clair']],     // Sweat col rond rose clair · m'excuse
      '29b62026-25e3-493a-b800-2321e6facb8b': [['court-excuse', '']],                    // T-shirt court femme · m'excuse
      '2320a9df-35e3-48d3-bd07-1a254ed31e9b': [['tshirt-excuse', '']],                   // T-shirt classique · m'excuse
      '89e92248-1cad-4a5b-9ea9-0fe2684a5f27': [['coque-celles', ''], ['coque-celles-2', '']], // Coque · ce qui s'arrête
      '8621d0ba-1782-4b6a-a37e-ae30ce229165': [['coque-aimer', '']],
      '19aa2d12-239a-4224-a937-29dfff0976e6': [['mug-aimer', ''], ['mug-aimer-2', '']],              // Mug · aimer sans m'oublier                     // Coque · aimer sans m'oublier
      '7f4e7d40-7898-4192-987d-8c3ca8de4327': [['calendrier', ''], ['calendrier-12', ''], ['calendrier-3', ''], ['calendrier-1', ''], ['calendrier-2', '']], // Calendrier 2027
      'bc031ac8-1c75-4368-9e4a-1d658debb3ac': [['baguettes-racines-50x70', 'Baguettes en bois naturel', '50x70']], // Poster avec baguettes · racines, 50 × 70 bois naturel
      'ace53bb4-8152-4725-b1e7-f6fccddf2307': [['tfemme-entiere', '']],                  // T-shirt femme · entière
      '0b9a43f9-be05-4b37-8b11-7d3e1a44209e': [['coque-repeter', '']],
      'ac58138b-a02c-4bba-a981-896179c59aac': [['court-meriter', '']],
      'f8d4cb8a-310d-49a8-97f9-ed8904ba5b18': [['capuche-celles', 'Blanc'], ['capuche-celles-2', ''], ['capuche-celles-3', '']], // Sweat à capuche blanc · ce qui s'arrête                    // T-shirt court femme · mériter ma place                    // Coque · née pour choisir,
      /* Posters « Mes racines sont ma force » et « Je porte mes racines sans m'y perdre » (01/11/2026) : la mise en scène encadrée en premier */
      '851a1751-c7d1-4fa5-9f67-7f94fcdd50a3': [['racines-force-mur', '']],
      '1db1be1e-d51a-4872-a001-91043fbcb500': [['racines-force-mur', '']],
      '1d453a81-6f13-4da0-9101-e53262611049': [['racines-force-mur', '']],
      'd36ef2bf-feea-47fc-8fd1-9f3d1371d08f': [['racines-force-mur', '']],
      '606ac06d-6330-4425-9a25-1c84c06e9dc7': [['racines-force-mur', '']],
      '3ff8f5c9-41b6-4994-914e-6254d0027a10': [['racines-force-mur', '']],
      '9b193ec9-7d89-4fab-93f5-13ad94f1af48': [['racines-porte-mur', '']],
      '28beb05f-82a9-4a35-9e28-8344c560ae12': [['racines-porte-mur', '']],
      'ffdfbf05-8abd-46a2-9d42-865cc14ba918': [['racines-porte-mur', '']],
      '63977132-f1fe-4bc4-951e-e4c8b5b32b08': [['racines-porte-mur', '']],
      '3dc3e95a-b06e-4f20-9bf8-d372ad4cc62f': [['racines-porte-mur', '']],
      '0b52f862-59f3-42c6-8ca7-20d2701e5241': [['racines-porte-mur', '']],
      '91aaa146-880e-4a64-a952-161e69586ed5': [['racines-porte-mur', '']],
      '10515158-058b-4d24-8497-7e8a2279bd0e': [['racines-porte-mur', '']],
      '46dd65b2-f6aa-43d0-97f9-eea2aec9f917': [['racines-porte-mur', '']]
    };
    c.produits.forEach(function (p) { var x = PORTE[p.id] || (p.ids || []).map(function (i) { return PORTE[i]; }).filter(Boolean)[0]; if (!x) return; var cs = x.filter(function (y) { return y[1] || y[2]; }).map(function (y) { return (y[2] || '') + '|' + y[1]; });
      p.photos = x.map(function (y) { return { src: 'assets/boutique/' + y[0] + '.webp', option: y[1], cle: y[2] || '' }; }).concat((p.photos || []).filter(function (f) { return cs.indexOf((f.cle || '') + '|' + (f.option || '')) < 0 && !(f.option && !f.cle && cs.indexOf('|' + f.option) >= 0); })); });
    /* Coques iPhone 16 : Gelato ne les livre pas encore en France, on ne les propose pas */
    c.produits.forEach(function (p) { if (p.type === 'coque') p.variantes = p.variantes.filter(function (v) { return !/iPhone 16/i.test(v.taille || ''); }); });
    c.produits = c.produits.filter(function (p) { return p.variantes.length; });
    /* Les livres : un lien direct vers Amazon (pas dans le panier) */
    var LV = window.GENESOLIA_LIVRES || {};
    ['racines', 'enquete'].forEach(function (k) { var b = LV[k]; if (b && b.amazon) c.produits.push({ id: 'livre-' + k, type: 'livre', famille: 'livres', nomType: 'Livre', phrase: b.titre, titre: b.titre, lien: b.amazon, prixTexte: b.prix || '', photos: [{ src: b.image, option: '', cle: '' }], variantes: [], prixMin: 0 }); });
    CAT = c; filtres(); cartes(); majCompteur(); z.classList.add('pret');
    var h = location.hash.replace('#', '');
    if (h === 'panier') panier(true);
    else if (h) { var p = CAT.produits.filter(function (x) { return x.slug === h; })[0]; if (p) fiche(p.id); }
  }).catch(function () { grille.innerHTML = '<p class="bq-vide">La boutique n’a pas pu se charger. Recharge la page dans un instant.</p>'; });
})();
