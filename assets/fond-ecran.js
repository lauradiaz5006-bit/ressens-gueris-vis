/* Genesolia · Mon tableau de vision en fond d'écran (semaine 4 du carnet, « Mon intention prend vie »)
   La personne choisit jusqu'à 3 images (galerie dans le style du site, ou ses propres photos), ses mots et sa phrase,
   et le site compose un fond d'écran de téléphone (1080 × 1920) aux couleurs de Genesolia, à télécharger.
   Tout se fait dans le navigateur : les photos personnelles ne sont jamais envoyées ni enregistrées.
   GenesoliaFond.ouvrir(zone, { mois: 'novembre 2026', mots: [...], phrase: '...' }) */
(function () {
  'use strict';
  /* Les images du site, sans personne dessus (chacune doit pouvoir s'y projeter) */
  var GALERIE = [
    ['assets/images/genesolia-800.webp', 'L’arbre doré'], ['assets/images/arbre-de-vie-800.webp', 'L’arbre de vie'], ['assets/images/deux-cycles-800.webp', 'Le cœur et les racines'],
    ['assets/formation/montagne.webp', 'L’aube'], ['assets/formation/spirale.webp', 'La lumière du soir'], ['assets/images/blog-ciel-800.webp', 'La lune sur la mer'],
    ['assets/images/blog-reves-800.webp', 'La nuit douce'], ['assets/images/blog-reves-recurrents-800.webp', 'Le chemin de lumière'], ['assets/images/blog-jung-800.webp', 'Le livre dans les nuages'],
    ['assets/images/blog-journal-reves-800.webp', 'Le matin à la fenêtre'], ['assets/images/blog-deuil-800.webp', 'Les fleurs au bord du lac'], ['assets/images/sephiroth-800.webp', 'Les perles de lumière'],
    ['assets/images/blog-nombres-800.webp', 'Le cercle doré'], ['assets/images/blog-peuples-autochtones-800.webp', 'Le désert au couchant'], ['assets/images/blog-annee-personnelle-800.webp', 'L’horloge des saisons'],
    ['assets/images/blog-secret-de-famille-800.webp', 'Le coffret de souvenirs']
  ];
  var STYLES = {
    nuit: { nom: 'Nuit prune', fond: ['#2E1338', '#6B2F5B'], halo: 'rgba(243,220,192,.22)', titre: '#F3DCC0', texte: '#FFF4F6', doux: 'rgba(255,244,246,.75)', anneau: '#D9B27C' },
    aube: { nom: 'Aube rose', fond: ['#FFF9F4', '#F6DCE4'], halo: 'rgba(185,138,85,.16)', titre: '#8A5A22', texte: '#4E2446', doux: 'rgba(78,36,70,.7)', anneau: '#B98A55' },
    or: { nom: 'Lumière dorée', fond: ['#FBF0E4', '#E9CDA2'], halo: 'rgba(255,255,255,.45)', titre: '#6B2F5B', texte: '#3B1747', doux: 'rgba(59,23,71,.7)', anneau: '#6B2F5B' }
  };
  var W = 1080, H = 1920;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function charger(src) { return new Promise(function (ok) { var i = new Image(); i.onload = function () { ok(i); }; i.onerror = function () { ok(null); }; i.src = src; }); }
  function cercle(ctx, img, x, y, r, anneau) {
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.closePath(); ctx.clip();
    if (img) { var s = Math.max(2 * r / img.width, 2 * r / img.height), w = img.width * s, h = img.height * s; ctx.drawImage(img, x - w / 2, y - h / 2, w, h); }
    else { ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.fill(); }
    ctx.restore();
    ctx.beginPath(); ctx.arc(x, y, r + 6, 0, Math.PI * 2); ctx.lineWidth = 6; ctx.strokeStyle = anneau; ctx.stroke();
  }
  function lignes(ctx, t, max) {
    var mots = String(t).split(/\s+/), out = [], l = '';
    mots.forEach(function (m) { var e = l ? l + ' ' + m : m; if (ctx.measureText(e).width > max && l) { out.push(l); l = m; } else l = e; });
    if (l) out.push(l);
    return out;
  }
  function dessiner(cv, o) {
    var ctx = cv.getContext('2d'), S = STYLES[o.style] || STYLES.nuit;
    var g = ctx.createLinearGradient(0, 0, W * .4, H); g.addColorStop(0, S.fond[0]); g.addColorStop(1, S.fond[1]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    var h = ctx.createRadialGradient(W / 2, 1050, 40, W / 2, 1050, 640); h.addColorStop(0, S.halo); h.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = h; ctx.fillRect(0, 0, W, H);
    /* petites étoiles dorées */
    ctx.fillStyle = S.anneau; [[150, 760, 4], [930, 720, 5], [940, 1420, 3], [140, 1440, 4], [540, 520, 3], [1000, 1010, 3], [80, 1060, 3]].forEach(function (e) { ctx.globalAlpha = .7; ctx.beginPath(); ctx.arc(e[0], e[1], e[2], 0, Math.PI * 2); ctx.fill(); });
    ctx.globalAlpha = 1;
    ctx.textAlign = 'center';
    ctx.fillStyle = S.titre; ctx.font = '600 34px "Nunito Sans", sans-serif';
    var sur = ('Mon mois de ' + (o.mois || '')).toUpperCase().split('').join(String.fromCharCode(8202));
    ctx.fillText(sur, W / 2, 600);
    ctx.fillStyle = S.texte; ctx.font = '400 74px "Gilda Display", Georgia, serif';
    ctx.fillText('Ce que j’accueille', W / 2, 690);
    var im = o.images;
    /* Le haut de l'écran reste libre pour l'heure du téléphone, le bas pour ses raccourcis */
    if (im.length === 1) cercle(ctx, im[0], W / 2, 1060, 250, S.anneau);
    else if (im.length === 2) { cercle(ctx, im[0], 400, 970, 195, S.anneau); cercle(ctx, im[1], 680, 1190, 195, S.anneau); }
    else { cercle(ctx, im[0], W / 2, 960, 205, S.anneau); cercle(ctx, im[1] || null, 330, 1255, 150, S.anneau); cercle(ctx, im[2] || null, 750, 1255, 150, S.anneau); }
    var mots = o.mots.filter(Boolean).map(function (m) { return m.trim(); }).filter(Boolean).slice(0, 3);
    ctx.fillStyle = S.texte; ctx.font = '400 60px "Gilda Display", Georgia, serif';
    var y = 1505;
    if (mots.length) {
      var l = mots.join('  ·  ');
      if (ctx.measureText(l).width > W - 140) { mots.forEach(function (m) { ctx.fillText(m, W / 2, y); y += 70; }); }
      else { ctx.fillText(l, W / 2, y); y += 78; }
    }
    if (o.phrase) {
      ctx.fillStyle = S.doux; ctx.font = 'italic 400 48px "Gilda Display", Georgia, serif';
      y += 20; lignes(ctx, '« ' + o.phrase.trim() + ' »', W - 200).slice(0, 3).forEach(function (t) { ctx.fillText(t, W / 2, y); y += 64; });
    }
    ctx.fillStyle = S.titre; ctx.globalAlpha = .8; ctx.font = '600 28px "Nunito Sans", sans-serif';
    ctx.fillText('GENESOLIA', W / 2, H - 120); ctx.globalAlpha = 1;
  }
  var STYLE_CSS = '.gf{margin:1rem 0;padding:1.1rem;border-radius:18px;background:#fff;border:1px solid var(--rose-fonce,#EBCFD5)}.gf h4{font:400 1.2rem/1.3 var(--display,Georgia);color:var(--prune,#6B2F5B);margin:0 0 .4rem}' +
    '.gf-galerie{display:grid;grid-template-columns:repeat(auto-fill,minmax(76px,1fr));gap:.5rem;margin:.6rem 0}.gf-galerie button{position:relative;padding:0;border:3px solid transparent;border-radius:50%;aspect-ratio:1;overflow:hidden;cursor:pointer;background:#F7EEF1}' +
    '.gf-galerie img{width:100%;height:100%;object-fit:cover;display:block}.gf-galerie button[aria-pressed=true]{border-color:#B98A55;box-shadow:0 0 0 2px #6B2F5B}.gf-galerie button span{position:absolute;top:2px;right:2px;display:none;width:1.4rem;height:1.4rem;border-radius:50%;background:#6B2F5B;color:#fff;font:700 .8rem/1.4rem sans-serif;text-align:center}' +
    '.gf-galerie button[aria-pressed=true] span{display:block}.gf-photo{display:inline-flex;align-items:center;gap:.4rem;margin:.2rem 0 .8rem;padding:.5rem 1rem;border-radius:99px;border:1.5px dashed #B98A55;cursor:pointer;font-weight:600;color:var(--prune,#6B2F5B)}.gf-photo input{position:absolute;opacity:0;width:1px;height:1px}' +
    '.gf-styles{display:flex;flex-wrap:wrap;gap:.4rem;margin:.4rem 0 .8rem}.gf-styles button{padding:.45rem .9rem;border-radius:99px;border:1.5px solid #EBCFD5;background:#fff;cursor:pointer;font:600 .9rem inherit;font-family:inherit;color:var(--prune,#6B2F5B)}.gf-styles button[aria-pressed=true]{background:#6B2F5B;color:#fff;border-color:#6B2F5B}' +
    '.gf-champs{display:grid;gap:.5rem;margin:.4rem 0 .8rem}.gf-champs input{font:inherit;padding:.55rem .75rem;border-radius:12px;border:1.5px solid #EBCFD5;background:#FFFCF8}.gf-apercu{display:block;width:min(100%,300px);height:auto;margin:.8rem auto;border-radius:22px;box-shadow:0 14px 34px rgba(46,19,56,.25)}' +
    '.gf-act{display:flex;flex-wrap:wrap;gap:.5rem;justify-content:center}.gf-note{font-size:.88rem;color:var(--encre-2,#5E3A56);text-align:center;margin:.6rem 0 0}@media print{.gf,.gf-bouton{display:none!important}}';
  function ouvrir(z, o) {
    if (!z) return; o = o || {};
    if (!document.getElementById('gf-style')) { var st = document.createElement('style'); st.id = 'gf-style'; st.textContent = STYLE_CSS; document.head.appendChild(st); }
    var choix = [], photos = [], style = 'nuit', cv = document.createElement('canvas'); cv.width = W; cv.height = H; cv.className = 'gf-apercu'; cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', 'Aperçu de ton fond d’écran');
    z.innerHTML = '<div class="gf"><h4>Mon tableau de vision en fond d’écran</h4><p>Choisis jusqu’à trois images qui représentent ce que tu accueilles ce mois-ci, tes mots et ta phrase. Ton fond d’écran se compose tout seul, à installer sur ton téléphone pour le voir chaque jour.</p>' +
      '<p class="mc-q">1. Tes images (jusqu’à trois)</p><div class="gf-galerie">' + GALERIE.map(function (g, i) { return '<button type="button" data-gf-img="' + i + '" aria-pressed="false" aria-label="' + esc(g[1]) + '"><img src="' + esc(g[0]) + '" alt="" loading="lazy"><span></span></button>'; }).join('') + '</div>' +
      '<label class="gf-photo">Ajouter ma photo<input type="file" accept="image/*" data-gf-photo></label><p class="gf-note" style="text-align:left;margin-top:0">Tes photos restent sur ton appareil : elles ne sont ni envoyées, ni enregistrées.</p>' +
      '<p class="mc-q">2. Tes mots et ta phrase</p><div class="gf-champs">' + [0, 1, 2].map(function (i) { return '<input type="text" maxlength="24" data-gf-mot="' + i + '" placeholder="Mot ' + (i + 1) + '" value="' + esc((o.mots || [])[i] || '') + '">'; }).join('') +
      '<input type="text" maxlength="110" data-gf-phrase placeholder="Ta phrase, par exemple : J’ai le droit de prendre ma place." value="' + esc(o.phrase || '') + '"></div>' +
      '<p class="mc-q">3. Ton ambiance</p><div class="gf-styles">' + Object.keys(STYLES).map(function (k) { return '<button type="button" data-gf-style="' + k + '" aria-pressed="' + (k === style) + '">' + STYLES[k].nom + '</button>'; }).join('') + '</div>' +
      '<div data-gf-apercu></div><div class="gf-act"><button type="button" class="btn btn-plein" data-gf-telecharger>Télécharger mon fond d’écran</button></div>' +
      '<p class="gf-note">Sur iPhone : ouvre l’image, touche Partager, puis « Utiliser comme fond d’écran ». Sur Android : ouvre l’image, puis « Définir comme fond d’écran ».</p></div>';
    z.querySelector('[data-gf-apercu]').appendChild(cv);
    var cache = {};
    function img(src) { if (!cache[src]) cache[src] = charger(src); return cache[src]; }
    function sources() { return choix.map(function (i) { return typeof i === 'number' ? GALERIE[i][0] : photos[i.p]; }); }
    function maj() {
      var src = sources();
      Promise.all(src.map(img)).then(function (ims) {
        (document.fonts && document.fonts.load ? Promise.all([document.fonts.load('74px "Gilda Display"'), document.fonts.load('600 34px "Nunito Sans"')]).catch(function () {}) : Promise.resolve()).then(function () {
          dessiner(cv, { style: style, mois: o.mois, images: ims.filter(Boolean), mots: [0, 1, 2].map(function (i) { return z.querySelector('[data-gf-mot="' + i + '"]').value; }), phrase: z.querySelector('[data-gf-phrase]').value });
        });
      });
      z.querySelectorAll('[data-gf-img]').forEach(function (b) { var k = choix.indexOf(+b.getAttribute('data-gf-img')); b.setAttribute('aria-pressed', k >= 0 ? 'true' : 'false'); b.querySelector('span').textContent = k >= 0 ? k + 1 : ''; });
    }
    z.addEventListener('click', function (e) {
      var b = e.target.closest('[data-gf-img]');
      if (b) { var i = +b.getAttribute('data-gf-img'), k = choix.indexOf(i); if (k >= 0) choix.splice(k, 1); else { if (choix.length >= 3) choix.shift(); choix.push(i); } maj(); return; }
      var s = e.target.closest('[data-gf-style]');
      if (s) { style = s.getAttribute('data-gf-style'); z.querySelectorAll('[data-gf-style]').forEach(function (x) { x.setAttribute('aria-pressed', x === s ? 'true' : 'false'); }); maj(); return; }
      if (e.target.closest('[data-gf-telecharger]')) {
        cv.toBlob(function (bl) {
          if (!bl) return;
          var nom = 'mon-fond-d-ecran-genesolia.png', f = typeof File === 'function' ? new File([bl], nom, { type: 'image/png' }) : null;
          if (f && navigator.canShare && navigator.canShare({ files: [f] }) && /iphone|ipad|android/i.test(navigator.userAgent)) { navigator.share({ files: [f], title: 'Mon fond d’écran' }).catch(function () {}); return; }
          var a = document.createElement('a'); a.href = URL.createObjectURL(bl); a.download = nom; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 800);
          if (window.umami) try { window.umami.track('fond-ecran'); } catch (x) {}
        }, 'image/png');
      }
    });
    z.addEventListener('input', function (e) { if (e.target.matches('[data-gf-mot],[data-gf-phrase]')) maj(); });
    z.querySelector('[data-gf-photo]').addEventListener('change', function () {
      var fi = this.files && this.files[0]; if (!fi) return;
      var r = new FileReader(); r.onload = function () { photos.push(r.result); if (choix.length >= 3) choix.shift(); choix.push({ p: photos.length - 1 }); maj(); }; r.readAsDataURL(fi); this.value = '';
    });
    choix = [0, 5, 3]; maj();
  }
  window.GenesoliaFond = { ouvrir: ouvrir, dessiner: dessiner };
})();
