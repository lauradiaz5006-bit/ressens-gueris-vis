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
  function libOption(p) { return p.type === 'encadre' ? 'Cadre' : p.type === 'baguettes' ? 'Baguettes' : p.famille === 'vetements' ? 'Couleur' : 'Option'; }
  function libTaille(p) { return p.type === 'coque' ? 'Modèle' : 'Taille'; }
  function photo(p, opt) { var l = p.photos || []; var x = opt ? l.filter(function (f) { return f.option === opt; })[0] : null; return url((x || l[0] || {}).src); }
  function url(s) { return /^assets\//.test(s || '') ? s : PUB + s; }
  /* la description, sans la fiche technique en anglais ajoutée par Gelato */
  function descr(p) { return String(p.description || '').split(/\s(?:Paper Finishing|Ready-to-hang|Paper Weight|Frame Material|Sustainable Paper|Available Sizes|Product features|Size guide)\s?:/i)[0].replace(/\s*Genesolia\s*[–-]\s*genesolia\.fr\s*$/i, '').trim(); }
  function index() { var o = {}; (CAT.produits || []).forEach(function (p) { p.variantes.forEach(function (v) { o[v.id] = { p: p, v: v }; }); }); return o; }

  /* ───── La grille ───── */
  function cartes() {
    var l = CAT.produits.filter(function (p) { return (filtre === 'tout' || p.famille === filtre) && (!phraseF || norm(p.phrase) === phraseF); });
    var ordre = { posters: 0, vetements: 1, maison: 2 };
    l.sort(function (a, b) { return (ordre[a.famille] - ordre[b.famille]) || norm(a.phrase).localeCompare(norm(b.phrase)) || a.prixMin - b.prixMin; });
    grille.innerHTML = l.length ? l.map(function (p) {
      return '<button type="button" class="bq-carte" data-p="' + esc(p.id) + '"><span class="bq-img"><img src="' + esc(photo(p)) + '" alt="" loading="lazy" decoding="async"></span>' +
        '<span class="bq-type">' + esc(nomType(p)) + (p.motif ? ' · ' + esc(p.motif) : '') + '</span><span class="bq-phrase">« ' + esc(norm(p.phrase)) + ' »</span><span class="bq-prix">' + (p.variantes.length > 1 && p.variantes.some(function (v) { return v.prix !== p.prixMin; }) ? 'dès ' : '') + eur(p.prixMin) + '</span></button>';
    }).join('') : '<p class="bq-vide">Rien ici pour l’instant.</p>';
  }
  function filtres() {
    var ph = []; CAT.produits.forEach(function (p) { var n = norm(p.phrase); if (!/^Calendrier/.test(n) && ph.indexOf(n) < 0) ph.push(n); }); ph.sort();
    document.getElementById('bq-phrases').innerHTML = '<option value="">Toutes les phrases</option>' + ph.map(function (t) { return '<option value="' + esc(t) + '">' + esc(t) + '</option>'; }).join('');
  }

  /* ───── La fiche d'un produit ───── */
  function fiche(id) {
    var p = CAT.produits.filter(function (x) { return x.id === id; })[0]; if (!p) return;
    var tailles = [], options = []; p.variantes.forEach(function (v) { if (v.taille && tailles.indexOf(v.taille) < 0) tailles.push(v.taille); if (v.option && options.indexOf(v.option) < 0) options.push(v.option); });
    var choix = { t: tailles[0] || '', o: options[0] || '', q: 1 };
    var d = document.getElementById('bq-fiche');
    function variante() { return p.variantes.filter(function (v) { return (v.taille || '') === choix.t && (v.option || '') === choix.o; })[0] || null; }
    function dispo(t, o) { return p.variantes.some(function (v) { return (v.taille || '') === t && (v.option || '') === o; }); }
    function rendre() {
      if (!variante()) { var v0 = p.variantes.filter(function (v) { return (v.taille || '') === choix.t; })[0] || p.variantes[0]; choix.t = v0.taille || ''; choix.o = v0.option || ''; }
      var v = variante(), ph = p.photos || [], princ = photo(p, choix.o);
      d.querySelector('.bq-f-corps').innerHTML =
        '<div class="bq-f-photos"><img class="bq-f-grande" src="' + esc(princ) + '" alt="' + esc(nomType(p) + ' « ' + norm(p.phrase) + ' »') + '">' +
        (ph.length > 1 ? '<div class="bq-f-mini">' + ph.map(function (f) { return '<button type="button" data-ph="' + esc(url(f.src)) + '"><img src="' + esc(url(f.src)) + '" alt="" loading="lazy"></button>'; }).join('') + '</div>' : '') + '</div>' +
        '<div class="bq-f-info"><p class="bq-type">' + esc(nomType(p)) + (p.motif ? ' · ' + esc(p.motif) : '') + '</p><h2 id="bq-f-titre">« ' + esc(norm(p.phrase)) + ' »</h2>' +
        '<p class="bq-f-prix">' + (v ? eur(v.prix) : '') + ' <small>livraison offerte</small></p>' +
        (tailles.length > 1 || (tailles.length === 1 && p.famille !== 'maison') ? '<p class="bq-lab">' + libTaille(p) + '</p><div class="bq-choix" data-c="t">' + tailles.map(function (t) { return '<button type="button" data-v="' + esc(t) + '" aria-pressed="' + (t === choix.t) + '"' + (dispo(t, choix.o) || !choix.o ? '' : ' class="bq-ind"') + '>' + esc(t) + '</button>'; }).join('') + '</div>' : '') +
        (options.length ? '<p class="bq-lab">' + libOption(p) + '</p><div class="bq-choix" data-c="o">' + options.map(function (o) { return '<button type="button" data-v="' + esc(o) + '" aria-pressed="' + (o === choix.o) + '"' + (dispo(choix.t, o) ? '' : ' class="bq-ind"') + '>' + esc(o) + '</button>'; }).join('') + '</div>' : '') +
        '<div class="bq-f-achat"><label class="bq-qte">Quantité <select data-q>' + [1, 2, 3, 4, 5].map(function (n) { return '<option' + (n === choix.q ? ' selected' : '') + '>' + n + '</option>'; }).join('') + '</select></label>' +
        '<button type="button" class="btn btn-plein" data-ajout' + (v ? '' : ' disabled') + '>Ajouter au panier</button></div><p class="bq-ok" role="status" aria-live="polite"></p>' +
        '<ul class="bq-f-plus"><li>Imprimé à la demande, rien n’est produit en trop</li><li>Livraison offerte en France métropolitaine</li><li>Un défaut ou un article abîmé : réimprimé ou remboursé</li></ul>' +
        (descr(p) ? '<details class="bq-desc"><summary>Description</summary><p>' + esc(descr(p)) + '</p></details>' : '') + '</div>';
    }
    d.onclick = function (e) {
      if (e.target === d || e.target.closest('[data-f-fermer]')) { fermer(); return; }
      var m = e.target.closest('[data-ph]'); if (m) { d.querySelector('.bq-f-grande').src = m.getAttribute('data-ph'); return; }
      var c = e.target.closest('.bq-choix button'); if (c) { choix[c.parentNode.getAttribute('data-c')] = c.getAttribute('data-v'); rendre(); return; }
      if (e.target.closest('[data-ajout]')) {
        var v = variante(); if (!v) return; var pan = lire(), l = pan.filter(function (x) { return x.v === v.id; })[0];
        if (l) l.q = Math.min(10, l.q + choix.q); else pan.push({ v: v.id, q: choix.q }); ecrire(pan);
        var ok = d.querySelector('.bq-ok'); ok.innerHTML = 'C’est dans ton panier. <button type="button" class="bq-lien" data-voir-panier>Voir mon panier</button>'; return;
      }
      if (e.target.closest('[data-voir-panier]')) { fermer(); panier(true); }
    };
    d.onchange = function (e) { if (e.target.matches('[data-q]')) choix.q = +e.target.value || 1; };
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
      '<p class="bq-total"><span>Total</span><b>' + eur(total) + '</b></p><p class="bq-livr">Livraison offerte en France métropolitaine. Chaque article est imprimé à la demande, puis expédié sous 2 à 5 jours ouvrés. Plusieurs articles peuvent arriver dans des colis séparés.</p>' +
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
    var MUGS = { '4f5360f2-ae10-4df0-958e-ad300231760b': 'assets/boutique/mug-ancetres.webp', '3ac4634b-f06d-4d42-9e11-0f0a88eba3f7': 'assets/boutique/mug-entiere.webp' };
    c.produits = (c.produits || []).filter(function (p) { if (p.type !== 'mug') return true; if (!MUGS[p.id]) return false; p.photos = [{ src: MUGS[p.id], option: '' }]; return true; });
    /* Photos portées, placées en premier (les photos Gelato restent après) */
    var PORTE = { '80c01b03-9cfd-4c05-90d7-1f3e9ff0027a': ['assets/boutique/tshirt-ancetres.webp', ''],
      'd3224375-7071-40b0-a452-f8472195bc20': ['assets/boutique/capuche-entiere.webp', 'Blanc'], 'dd7d9872-7234-4db9-99a6-d2c6a607bb1c': ['assets/boutique/capuche-entiere.webp', ''],
      '89e92248-1cad-4a5b-9ea9-0fe2684a5f27': ['assets/boutique/coque-celles.webp', ''] };
    c.produits.forEach(function (p) { var x = PORTE[p.id]; if (x) p.photos = [{ src: x[0], option: x[1] }].concat((p.photos || []).filter(function (f) { return !(x[1] && f.option === x[1]); })); });
    CAT = c; filtres(); cartes(); majCompteur(); z.classList.add('pret');
    var h = location.hash.replace('#', '');
    if (h === 'panier') panier(true);
    else if (h) { var p = CAT.produits.filter(function (x) { return x.slug === h; })[0]; if (p) fiche(p.id); }
  }).catch(function () { grille.innerHTML = '<p class="bq-vide">La boutique n’a pas pu se charger. Recharge la page dans un instant.</p>'; });
})();
