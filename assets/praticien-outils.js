/* Genesolia · outils du cabinet, partagés entre « Mon cabinet » (praticien.html) et le dossier ouvert (genosociogramme.html) :
   - notes de séance chiffrées (ligne « seances-<dossier> » du coffre), en fenêtre ou en tiroir à côté de l'arbre ;
   - lien de partage en lecture : choix de ce que voit le·la client·e, liste des liens actifs, désactivation avant les 14 jours. */
window.GenesoliaPratique = (function () {
  'use strict';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function date(d) { return d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''; }
  function marquer(k) { try { localStorage.setItem('pr-fait-' + k, '1'); } catch (e) {} }

  var CSS = '.pr-fond{position:fixed;inset:0;z-index:200;background:rgba(74,33,66,.45);display:flex;align-items:flex-end;justify-content:center}' +
    '@media (min-width:700px){.pr-fond{align-items:center;padding:16px}}' +
    '.pr-fenetre{background:var(--blanc,#fff);color:var(--prune,#4A2142);width:100%;max-width:40rem;max-height:92vh;overflow-y:auto;border-radius:22px 22px 0 0;padding:1.4rem 1.3rem calc(1.4rem + env(safe-area-inset-bottom));box-sizing:border-box}' +
    '@media (min-width:700px){.pr-fenetre{border-radius:22px}}' +
    '.pr-fenetre h2{font-size:1.4rem;margin:0 0 .4rem}.pr-fenetre h3{font-size:1.05rem;margin:1.2rem 0 .5rem}' +
    '.pr-tiroir{position:fixed;top:0;right:0;bottom:0;z-index:210;width:min(26rem,100vw);background:var(--blanc,#fff);color:var(--prune,#4A2142);box-shadow:-18px 0 40px rgba(74,33,66,.22);overflow-y:auto;padding:1.2rem 1.1rem calc(1.2rem + env(safe-area-inset-bottom));box-sizing:border-box}' +
    '.pr-tiroir h2{font-size:1.25rem;margin:0 0 .4rem}' +
    '.pr-o-aide{color:var(--prune-doux,#7A5570);font-size:.9rem;margin:0 0 .9rem;line-height:1.45}' +
    '.pr-o-form{display:grid;gap:.8rem}.pr-o-form label{display:grid;gap:.35rem;font-weight:600;font-size:.92rem}' +
    '.pr-o-form textarea{width:100%;box-sizing:border-box;min-height:7rem;font:inherit;font-weight:400;padding:.75rem .9rem;border:1px solid #E5C6CF;border-radius:12px;color:inherit}' +
    '.pr-o-form input[type=date]{font:inherit;font-weight:400;padding:.6rem .8rem;border:1px solid #E5C6CF;border-radius:12px;color:inherit}' +
    '.pr-o-case{display:flex!important;gap:.6rem;align-items:flex-start;font-weight:400!important;line-height:1.4}.pr-o-case input{width:20px;height:20px;flex:none;margin:.1rem 0 0;accent-color:#6B2F5B}' +
    '.pr-o-msg{font-size:.88rem;min-height:1.1em;margin:0;color:var(--prune-doux,#7A5570)}' +
    '.pr-o-seance{border-top:1px solid var(--rose,#F2D6DE);padding:.8rem 0}.pr-o-seance p{margin:.3rem 0 0;white-space:pre-wrap}.pr-o-seance small{color:var(--prune-doux,#7A5570)}' +
    '.pr-o-lien{background:none;border:0;color:var(--prune-doux,#7A5570);text-decoration:underline;font:500 .88rem inherit;cursor:pointer;padding:.4rem}' +
    '.pr-o-boutons{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center}' +
    '.pr-o-actif{display:grid;gap:.4rem;border:1px solid var(--rose,#F2D6DE);border-radius:14px;padding:.7rem .8rem;margin:0 0 .5rem;background:#FFFBFC;font-size:.9rem}' +
    '.pr-o-actif small{color:var(--prune-doux,#7A5570)}' +
    '.pr-o-url{width:100%;box-sizing:border-box;font:inherit;font-size:.86rem;padding:.6rem .7rem;border:1px solid #E5C6CF;border-radius:10px;color:inherit;background:#fff}' +
    '.pr-o-desact{color:#A3324B!important}';
  function styles() { if (document.getElementById('pr-outils-css')) return; var s = document.createElement('style'); s.id = 'pr-outils-css'; s.textContent = CSS; document.head.appendChild(s); }

  function fenetre(html, tiroir) {
    styles();
    if (tiroir) {
      var vieux = document.querySelector('.pr-tiroir'); if (vieux) vieux.remove();
      var t = document.createElement('aside'); t.className = 'pr-tiroir'; t.setAttribute('role', 'dialog'); t.setAttribute('aria-modal', 'false');
      t.innerHTML = '<div style="text-align:right"><button class="pr-o-lien" type="button" data-fermer>Fermer</button></div>' + html;
      document.body.appendChild(t);
      t.addEventListener('click', function (e) { if (e.target.closest('[data-fermer]')) t.remove(); });
      return t;
    }
    var fond = document.createElement('div'); fond.className = 'pr-fond'; fond.setAttribute('role', 'dialog'); fond.setAttribute('aria-modal', 'true');
    fond.innerHTML = '<div class="pr-fenetre"><div style="text-align:right"><button class="pr-o-lien" type="button" data-fermer>Fermer</button></div>' + html + '</div>';
    document.body.appendChild(fond);
    fond.addEventListener('click', function (e) { if (e.target === fond || e.target.closest('[data-fermer]')) fond.remove(); });
    return fond;
  }

  /* ───────── Notes de séance (chiffrées) ───────── */
  function jsPDFcharger() {
    if (window.jspdf) return Promise.resolve(window.jspdf.jsPDF);
    return new Promise(function (ok, ko) { var s = document.createElement('script'); s.src = 'assets/jspdf.umd.min.js'; s.onload = function () { ok(window.jspdf.jsPDF); }; s.onerror = ko; document.head.appendChild(s); });
  }
  function exporterNotes(cabinet, nomDossier, liste) {
    return jsPDFcharger().then(function (J) {
      var doc = new J({ unit: 'mm', format: 'a4' }), pw = doc.internal.pageSize.getWidth(), ph = doc.internal.pageSize.getHeight(), m = 18, y = m, lw = pw - 2 * m;
      function place(h) { if (y + h > ph - m) { doc.addPage(); y = m; } }
      doc.setTextColor(107, 47, 91);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.text(cabinet || 'Mon cabinet', m, y); y += 9;
      doc.setFontSize(17); doc.text('Notes de séance', m, y); y += 7;
      doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.text((nomDossier ? 'Dossier : ' + nomDossier + ' · ' : '') + 'exporté le ' + date(new Date()), m, y); y += 10;
      liste.slice().sort(function (a, b) { return a.jour < b.jour ? -1 : 1; }).forEach(function (s) {
        var lignes = doc.splitTextToSize(String(s.texte || ''), lw);
        place(12); doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.text(date(s.jour) || 'Sans date', m, y); y += 6;
        doc.setFont('helvetica', 'normal'); doc.setFontSize(10.5);
        lignes.forEach(function (l) { place(5.4); doc.text(l, m, y); y += 5.4; });
        y += 5;
      });
      var n = doc.getNumberOfPages();
      for (var i = 1; i <= n; i++) { doc.setPage(i); doc.setFontSize(8); doc.setTextColor(150, 120, 140); doc.text('Document personnel de ' + (cabinet || 'ton cabinet') + ' · page ' + i + ' sur ' + n, m, ph - 8); }
      doc.save('notes-' + String(nomDossier || 'dossier').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.pdf');
    });
  }
  /* o : { sb, user, id, nom, cabinet, tiroir } */
  function notes(o) {
    var CF = window.GenesoliaCoffre, cle = 'seances-' + o.id, liste = [];
    var f = fenetre('<h2>Notes de séance · ' + esc(o.nom || '') + '</h2><p class="pr-o-aide">Chiffrées dans ton cabinet. Elles ne sont jamais montrées sur le lien de partage ni copiées dans l’espace de ton·ta client·e.</p>' +
      '<form class="pr-o-form" data-note-form><label>Date de la séance<input type="date" name="jour" value="' + new Date().toISOString().slice(0, 10) + '"></label><label>Ce que tu observes<textarea name="texte" maxlength="5000" placeholder="Ce qui est apparu, les pistes à explorer, la prochaine étape…"></textarea></label><p class="pr-o-msg" data-note-msg role="status"></p><div class="pr-o-boutons"><button class="btn btn-plein bt plein" type="submit">Ajouter cette note</button><button class="btn btn-trait bt" type="button" data-export-notes>Exporter en PDF</button></div></form>' +
      '<div data-seances><p class="pr-o-aide">Chargement…</p></div>', o.tiroir);
    function dessiner() {
      var zs = f.querySelector('[data-seances]');
      zs.innerHTML = liste.length ? liste.slice().sort(function (a, b) { return b.jour < a.jour ? -1 : 1; }).map(function (s) { return '<div class="pr-o-seance"><small>' + date(s.jour) + '</small><p>' + esc(s.texte) + '</p><button class="pr-o-lien" type="button" data-suppr-note="' + esc(s.id) + '">Supprimer</button></div>'; }).join('') : '<p class="pr-o-aide">Aucune note pour ce dossier.</p>';
    }
    function sauver() { return CF.ecrire(o.sb, o.user, cle, { seances: liste }).then(function (r) { if (r && r.error) throw r.error; }); }
    if (!CF) { f.querySelector('[data-seances]').innerHTML = '<p class="pr-o-aide">Les notes ne sont pas disponibles ici.</p>'; return f; }
    CF.lire(o.sb, o.user, cle).then(function (x) { liste = (x && x.seances) || []; dessiner(); }, function () { f.querySelector('[data-seances]').innerHTML = '<p class="pr-o-aide">Les notes n’ont pas pu être chargées.</p>'; });
    var form = f.querySelector('[data-note-form]'), m = f.querySelector('[data-note-msg]');
    form.addEventListener('submit', function (e) {
      e.preventDefault(); var t = form.texte.value.trim(); if (!t) { m.textContent = 'Écris ta note.'; return; }
      liste.push({ id: 's' + Date.now(), jour: form.jour.value || new Date().toISOString().slice(0, 10), texte: t });
      sauver().then(function () { form.texte.value = ''; m.textContent = 'Note ajoutée, chiffrée.'; dessiner(); }, function () { liste.pop(); m.textContent = 'La note n’a pas pu être enregistrée. Réessaie.'; });
    });
    f.querySelector('[data-export-notes]').addEventListener('click', function () {
      var bt = this; if (!liste.length) { m.textContent = 'Aucune note à exporter pour ce dossier.'; return; }
      bt.disabled = true;
      exporterNotes(o.cabinet, o.nom, liste).then(function () { bt.disabled = false; }, function () { bt.disabled = false; m.textContent = 'Le PDF n’a pas pu être créé. Réessaie.'; });
    });
    f.addEventListener('click', function (e) { var b = e.target.closest('[data-suppr-note]'); if (!b || !confirm('Supprimer cette note ?')) return; var avant = liste; liste = liste.filter(function (s) { return s.id !== b.getAttribute('data-suppr-note'); }); sauver().then(dessiner, function () { liste = avant; dessiner(); }); });
    return f;
  }

  /* ───────── Lien de partage ───────── */
  function url(j) { return 'https://genesolia.fr/genosociogramme.html?partage=' + j; }
  function copier(texte, msg) {
    var ok = function () { if (msg) msg.textContent = 'Lien copié. Tu peux le coller dans ton message.'; marquer('partage'); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(texte).then(ok, function () { try { document.execCommand('copy'); ok(); } catch (e) {} });
    else { try { document.execCommand('copy'); ok(); } catch (e) {} }
  }
  function resumeOptions(op) {
    op = op || {};
    if (op.reps === false) return 'L’arbre seul, sans « Ce qui se répète »';
    return op.delicat ? 'L’arbre et les répétitions, sans les pistes délicates' : 'L’arbre et toutes les répétitions';
  }
  /* o : { sb, user, id, nom, actif, remise } */
  function partager(o) {
    var f = fenetre('<h2>Partager l’arbre de ' + esc(o.nom || 'ton·ta client·e') + '</h2>' +
      '<p class="pr-o-aide">Le lien montre l’arbre en lecture, <b>sans tes notes</b>. ' + (o.remise ? 'Le travail est marqué terminé : ton·ta client·e pourra télécharger et garder son arbre.' : 'Tant que « Travail terminé » n’est pas coché dans ton cabinet, rien ne peut être téléchargé ni imprimé depuis ce lien.') + '</p>' +
      '<div data-actifs><p class="pr-o-aide">Chargement des liens…</p></div>' +
      (o.actif ? '<h3>Nouveau lien</h3><form class="pr-o-form" data-nouveau-lien>' +
        '<label class="pr-o-case"><input type="checkbox" name="reps" checked> <span>Montrer « Ce qui se répète »</span></label>' +
        '<label class="pr-o-case"><input type="checkbox" name="delicat"> <span>Cacher les pistes délicates : deuils, pertes de grossesse, IVG, départs précoces</span></label>' +
        '<p class="pr-o-aide" style="margin:0">Les pistes que tu as marquées « Pas pour moi » dans le dossier ne sont jamais montrées.</p>' +
        '<div><button class="btn btn-plein bt plein" type="submit">Créer le lien (valable 14 jours)</button></div><div data-nouveau></div></form>'
        : '<p class="pr-o-aide">Pour créer un nouveau lien, il faut l’abonnement. Tu peux toujours désactiver les liens déjà envoyés.</p>'));
    var za = f.querySelector('[data-actifs]');
    function liens() {
      o.sb.from('partages_arbre').select('jeton,expire_le,cree_le,options').eq('arbre_id', o.id).gt('expire_le', new Date().toISOString()).order('cree_le', { ascending: false }).then(function (r) {
        var l = (r && r.data) || [];
        if (r && r.error) { za.innerHTML = '<p class="pr-o-aide">Les liens envoyés n’ont pas pu être chargés.</p>'; return; }
        za.innerHTML = l.length ? '<h3>Liens actifs (' + l.length + ')</h3>' + l.map(function (x) {
          return '<div class="pr-o-actif"><div><b>Créé le ' + date(x.cree_le) + '</b> · valable jusqu’au ' + date(x.expire_le) + '<br><small>' + esc(resumeOptions(x.options)) + '</small></div>' +
            '<input class="pr-o-url" type="text" readonly value="' + esc(url(x.jeton)) + '" aria-label="Adresse du lien">' +
            '<div class="pr-o-boutons"><button class="btn btn-trait bt" type="button" data-copier="' + esc(x.jeton) + '">Copier le lien</button><button class="pr-o-lien pr-o-desact" type="button" data-desactiver="' + esc(x.jeton) + '">Désactiver ce lien</button><span class="pr-o-msg" data-msg="' + esc(x.jeton) + '"></span></div></div>';
        }).join('') : '<p class="pr-o-aide">Aucun lien actif pour ce dossier.</p>';
      });
    }
    liens();
    f.addEventListener('click', function (e) {
      var b;
      if ((b = e.target.closest('[data-copier]'))) { var j = b.getAttribute('data-copier'), i = b.closest('.pr-o-actif').querySelector('input'); i.select(); copier(url(j), f.querySelector('[data-msg="' + j + '"]')); }
      else if ((b = e.target.closest('[data-desactiver]'))) {
        if (!confirm('Désactiver ce lien ? La personne qui l’ouvrira verra qu’il n’est plus valable.')) return;
        b.disabled = true;
        o.sb.from('partages_arbre').update({ expire_le: new Date().toISOString() }).eq('jeton', b.getAttribute('data-desactiver')).then(function (r) { if (r && r.error) { b.disabled = false; alert('Le lien n’a pas pu être désactivé. Réessaie.'); return; } liens(); });
      }
    });
    var fn = f.querySelector('[data-nouveau-lien]');
    if (fn) fn.addEventListener('submit', function (e) {
      e.preventDefault();
      var bt = fn.querySelector('button[type=submit]'), op = { reps: fn.reps.checked, delicat: fn.reps.checked && fn.delicat.checked }, exp = new Date(Date.now() + 14 * 864e5).toISOString();
      bt.disabled = true;
      o.sb.from('partages_arbre').insert({ user_id: o.user.id, arbre_id: o.id, expire_le: exp, options: op }).select('jeton').single().then(function (r) {
        bt.disabled = false;
        if (r.error) { fn.querySelector('[data-nouveau]').innerHTML = '<p class="pr-o-msg">Le lien n’a pas pu être créé. Réessaie dans un instant.</p>'; return; }
        fn.querySelector('[data-nouveau]').innerHTML = '<p class="pr-o-aide" style="margin:.4rem 0 0">Ton lien est prêt, en haut de la liste. Copie-le pour l’envoyer.</p>';
        liens();
      });
    });
    return f;
  }

  return { fenetre: fenetre, notes: notes, partager: partager, esc: esc, date: date };
})();
