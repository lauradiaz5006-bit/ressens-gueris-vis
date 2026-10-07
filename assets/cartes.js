/* Genesolia — dessin des cartes à partager (format 1080 x 1350, réseaux sociaux).
   window.GenesoliaCarte.dessiner({ phrase, sur, style }) renvoie une promesse de <canvas>.
   Styles : 'rose' (par défaut), 'champagne', 'prune', 'corail'. */
(function () {
  var W = 1080, H = 1350;
  var STYLES = {
    rose:      { haut: '#FFFBF9', bas: '#F7E2E6', halo: 'rgba(248,214,200,.85)', encre: '#6B2F5B', doux: '#8E6383', accent: '#B98A55', petale: '#EBCFD5' },
    champagne: { haut: '#FFFAF2', bas: '#F5E3C8', halo: 'rgba(255,236,206,.95)', encre: '#5E3A2E', doux: '#8A6A55', accent: '#B98A55', petale: '#EED8B8' },
    prune:     { haut: '#6B2F5B', bas: '#3F1B36', halo: 'rgba(231,167,158,.35)', encre: '#FFF5F2', doux: '#F2DDEA', accent: '#F3DCC0', petale: 'rgba(243,220,192,.35)' },
    corail:    { haut: '#FFF6F2', bas: '#F9D9D0', halo: 'rgba(255,214,200,.9)', encre: '#7A2E3A', doux: '#9A5A60', accent: '#C9705F', petale: '#F2C4B8' }
  };

  function polices() {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    return Promise.all([
      document.fonts.load('64px "Gilda Display"'),
      document.fonts.load('600 30px "Nunito Sans"'),
      document.fonts.load('30px "Nunito Sans"')
    ]).catch(function () {});
  }

  function lignes(ctx, texte, largeur) {
    var mots = texte.split(/\s+/), res = [], cur = '';
    mots.forEach(function (m) {
      var essai = cur ? cur + ' ' + m : m;
      if (ctx.measureText(essai).width > largeur && cur) { res.push(cur); cur = m; }
      else cur = essai;
    });
    if (cur) res.push(cur);
    return res;
  }

  /* Une phrase par ligne quand c'est possible, et des lignes de longueur égale */
  function lignesEquilibrees(ctx, texte, largeur) {
    var phrases = texte.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [texte];
    var res = [];
    phrases.forEach(function (p) {
      p = p.trim(); if (!p) return;
      var base = lignes(ctx, p, largeur), n = base.length, lo = largeur * .45, hi = largeur;
      if (n > 1) {
        for (var i = 0; i < 18; i++) { var mid = (lo + hi) / 2; if (lignes(ctx, p, mid).length > n) lo = mid; else hi = mid; }
        base = lignes(ctx, p, hi);
      }
      res = res.concat(base);
    });
    return res;
  }

  function fleur(ctx, x, y, r, couleur, coeur) {
    ctx.save();
    ctx.fillStyle = couleur;
    for (var i = 0; i < 6; i++) {
      ctx.save();
      ctx.translate(x, y); ctx.rotate(i * Math.PI / 3);
      ctx.beginPath(); ctx.ellipse(0, -r * 1.25, r * .5, r * .8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = coeur;
    ctx.beginPath(); ctx.arc(x, y, r * .55, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function dessiner(o) {
    var s = STYLES[o.style] || STYLES.rose;
    return polices().then(function () {
      var c = document.createElement('canvas');
      c.width = W; c.height = H;
      var ctx = c.getContext('2d');

      // Fond
      var g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, s.haut); g.addColorStop(1, s.bas);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      var h = ctx.createRadialGradient(W * .78, H * .16, 10, W * .78, H * .16, 620);
      h.addColorStop(0, s.halo); h.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = h; ctx.fillRect(0, 0, W, H);

      // Petit arbre de vie en filigrane, en haut
      var pts = [[540, 150], [610, 190], [470, 190], [610, 255], [470, 255], [540, 290], [610, 350], [470, 350], [540, 385], [540, 440]];
      var ch = [[0,1],[0,2],[0,5],[1,2],[1,5],[1,3],[2,5],[2,4],[3,4],[3,5],[3,6],[4,5],[4,7],[5,6],[5,8],[5,7],[6,7],[6,8],[6,9],[7,8],[7,9],[8,9]];
      ctx.save();
      ctx.strokeStyle = s.accent; ctx.globalAlpha = .45; ctx.lineWidth = 2;
      ch.forEach(function (p) { ctx.beginPath(); ctx.moveTo(pts[p[0]][0], pts[p[0]][1]); ctx.lineTo(pts[p[1]][0], pts[p[1]][1]); ctx.stroke(); });
      ctx.globalAlpha = 1;
      pts.forEach(function (p, i) {
        ctx.beginPath(); ctx.arc(p[0], p[1], i === 9 ? 11 : 10, 0, Math.PI * 2);
        ctx.fillStyle = o.style === 'prune' ? 'rgba(255,255,255,.12)' : '#FFFFFF'; ctx.fill();
        ctx.lineWidth = 2.5; ctx.strokeStyle = s.accent; ctx.stroke();
      });
      ctx.restore();
      fleur(ctx, 540, 440, 16, s.petale, s.accent);

      // Surtitre
      ctx.textAlign = 'center';
      ctx.fillStyle = s.accent;
      ctx.font = '600 32px "Nunito Sans", system-ui, sans-serif';
      if (o.sur) ctx.fillText(String(o.sur).replace(/'/g, '\u2019'), W / 2, 560);

      // Phrase principale, taille adaptée à la longueur
      var phrase = String(o.phrase).replace(/'/g, '\u2019');
      var taille = phrase.length < 45 ? 88 : phrase.length < 80 ? 76 : phrase.length < 120 ? 64 : 54;
      var ls, essais = 0;
      do {
        ctx.font = taille + 'px "Gilda Display", Georgia, serif';
        ls = lignesEquilibrees(ctx, phrase, W - 220);
        if (ls.length * taille * 1.28 > 560) taille -= 4; else break;
      } while (++essais < 20);
      var lh = taille * 1.28, bloc = ls.length * lh;
      var y0 = 640 + (560 - bloc) / 2 + taille * .8;
      ctx.fillStyle = s.encre;
      ls.forEach(function (l, i) { ctx.fillText(l, W / 2, y0 + i * lh); });

      // Signature
      ctx.strokeStyle = s.accent; ctx.globalAlpha = .6; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(W / 2 - 60, H - 150); ctx.lineTo(W / 2 + 60, H - 150); ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = s.doux;
      ctx.font = '38px "Gilda Display", Georgia, serif';
      ctx.fillText('Genesolia', W / 2, H - 92);
      ctx.font = '26px "Nunito Sans", system-ui, sans-serif';
      ctx.fillText('genesolia.fr', W / 2, H - 52);
      return c;
    });
  }

  function versBlob(canvas) {
    return new Promise(function (ok) { canvas.toBlob(function (b) { ok(b); }, 'image/png'); });
  }

  /* Partage natif (téléphone) si possible, sinon téléchargement */
  function partager(canvas, nom, texte) {
    return versBlob(canvas).then(function (blob) {
      var fichier = null;
      try { fichier = new File([blob], nom, { type: 'image/png' }); } catch (e) {}
      if (fichier && navigator.canShare && navigator.canShare({ files: [fichier] })) {
        return navigator.share({ files: [fichier], text: texte || '' }).then(function () { return 'partage'; }, function () { return 'annule'; });
      }
      telechargerBlob(blob, nom);
      return 'telechargement';
    });
  }
  function telechargerBlob(blob, nom) {
    var url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = nom; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }
  function telecharger(canvas, nom) { return versBlob(canvas).then(function (b) { telechargerBlob(b, nom); }); }

  window.GenesoliaCarte = { dessiner: dessiner, partager: partager, telecharger: telecharger, styles: Object.keys(STYLES) };
})();
