/* Genesolia · outils du cabinet, partagés entre « Mon cabinet » (praticien.html) et le dossier ouvert (genosociogramme.html) :
   - notes de séance chiffrées (ligne « seances-<dossier> » du coffre), en fenêtre ou en tiroir à côté de l'arbre ;
   - lien de partage en lecture : choix de ce que voit le·la client·e, liste des liens actifs, désactivation avant les 14 jours. */
window.GenesoliaPratique = (function () {
  'use strict';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { styles();
  return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function date(d) { return d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''; }
  function marquer(k) { try { localStorage.setItem('pr-fait-' + k, '1'); } catch (e) {} }

  var CSS = '.pr-fond{position:fixed;inset:0;z-index:3000;background:rgba(74,33,66,.45);display:flex;align-items:flex-end;justify-content:center}' +
    '@media (min-width:700px){.pr-fond{align-items:center;padding:16px}}' +
    '.pr-fenetre{background:var(--blanc,#fff);color:var(--prune,#4A2142);width:100%;max-width:40rem;max-height:92vh;overflow-y:auto;border-radius:22px 22px 0 0;padding:1.4rem 1.3rem calc(1.4rem + env(safe-area-inset-bottom));box-sizing:border-box}' +
    '@media (min-width:700px){.pr-fenetre{border-radius:22px}}' +
    '.pr-fenetre h2{font-size:1.4rem;margin:0 0 .4rem}.pr-fenetre h3{font-size:1.05rem;margin:1.2rem 0 .5rem}' +
    '.pr-tiroir{position:fixed;top:0;right:0;bottom:0;z-index:3000;width:min(26rem,100vw);background:var(--blanc,#fff);color:var(--prune,#4A2142);box-shadow:-18px 0 40px rgba(74,33,66,.22);overflow-y:auto;padding:1.2rem 1.1rem calc(1.2rem + env(safe-area-inset-bottom));box-sizing:border-box}' +
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
    '.pr-o-desact{color:#A3324B!important}' +
    '.pr-chargeur{display:flex;align-items:center;gap:.55rem}.pr-chargeur i{width:17px;height:17px;flex:none;border-radius:50%;border:2.5px solid #E5C6CF;border-top-color:#9A3A68;animation:pr-tour .8s linear infinite}@keyframes pr-tour{to{transform:rotate(1turn)}}';
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
    var bf = fond.querySelector('[data-fermer]'); if (bf) setTimeout(function () { try { bf.focus({ preventScroll: true }); } catch (x) {} }, 30);
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
      doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.text(cabinet || 'Mon Espace praticien', m, y); y += 9;
      doc.setFontSize(17); doc.text('Notes de séance', m, y); y += 7;
      doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.text((nomDossier ? 'Dossier : ' + nomDossier + ' · ' : '') + 'exporté le ' + date(new Date()), m, y); y += 10;
      liste.slice().sort(function (a, b) { return a.jour < b.jour ? -1 : 1; }).forEach(function (s) {
        var lignes = doc.splitTextToSize(String(s.texte || ''), lw);
        place(12); doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.text((date(s.jour) || 'Sans date') + (s.theme ? ' · ' + s.theme : ''), m, y); y += 6;
        doc.setFont('helvetica', 'normal'); doc.setFontSize(10.5);
        lignes.forEach(function (l) { place(5.4); doc.text(l, m, y); y += 5.4; });
        y += 5;
      });
      var n = doc.getNumberOfPages();
      for (var i = 1; i <= n; i++) { doc.setPage(i); doc.setFontSize(8); doc.setTextColor(150, 120, 140); doc.text('Document personnel de ' + (cabinet || 'votre Espace praticien') + ' · page ' + i + ' sur ' + n, m, ph - 8); }
      doc.save('notes-' + String(nomDossier || 'dossier').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.pdf');
    });
  }
  /* o : { sb, user, id, nom, cabinet, tiroir } */
  function theme(s) { return (s && String(s.theme || '').trim()) || ''; }
  function notes(o) {
    var CF = window.GenesoliaCoffre, cle = 'seances-' + o.id, liste = [], filtre = '', chargee = false;
    var clePerso = 'pr-dernier-theme-' + o.id;
    var f = fenetre('<h2>Notes de séance · ' + esc(o.nom || '') + '</h2><p class="pr-o-aide">Chiffrées dans votre Espace praticien. Par défaut, elles ne sont jamais montrées à votre client·e. Cochez « visible » sur une note précise si vous voulez la lui faire lire pendant une séance en ligne. Donnez un thème à vos séances (ex. « Relation à la mère », « Argent ») pour vous y retrouver facilement si vous travaillez plusieurs sujets avec la même personne au fil du temps.</p>' +
      '<form class="pr-o-form" data-note-form><label>Thème de cette séance<input type="text" name="theme" maxlength="80" placeholder="Ex. Relation à la mère, Argent, Couple…"></label><label>Date de la séance<input type="date" name="jour" value="' + new Date().toISOString().slice(0, 10) + '"></label><label>Ce que vous observez<textarea name="texte" maxlength="5000" placeholder="Ce qui est apparu, les pistes à explorer, la prochaine étape…"></textarea></label><label class="pr-o-case"><input type="checkbox" name="visible"> <span>Visible par mon·ma client·e</span></label><p class="pr-o-msg" data-note-msg role="status"></p><div class="pr-o-boutons"><button class="btn btn-plein bt plein" type="submit">Ajouter cette note</button><button class="btn btn-trait bt" type="button" data-export-notes>Exporter en PDF</button></div></form>' +
      '<div data-themes-filtre style="margin-top:1rem"></div>' +
      '<div data-seances><p class="pr-o-aide pr-chargeur"><i></i>Chargement…</p></div>', o.tiroir);
    try { var dt = localStorage.getItem(clePerso); if (dt) f.querySelector('[name=theme]').value = dt; } catch (e) {}
    function themesDistincts() {
      var vus = {}, out = [];
      liste.forEach(function (s) { var th = theme(s); if (th && !vus[th]) { vus[th] = 1; out.push(th); } });
      return out.sort(function (a, b) { return a.localeCompare(b, 'fr'); });
    }
    function dessinerFiltre() {
      var zf = f.querySelector('[data-themes-filtre]'), ths = themesDistincts();
      if (!ths.length) { zf.innerHTML = ''; return; }
      zf.innerHTML = '<label style="display:grid;gap:.35rem;font-weight:600;font-size:.92rem">Filtrer par thème<select data-note-filtre style="font:inherit;font-weight:400;padding:.5rem .7rem;border:1px solid #E5C6CF;border-radius:12px;color:inherit"><option value="">Tous les thèmes (' + liste.length + ')</option>' +
        ths.map(function (th) { var n = liste.filter(function (s) { return theme(s) === th; }).length; return '<option value="' + esc(th) + '"' + (filtre === th ? ' selected' : '') + '>' + esc(th) + ' (' + n + ')</option>'; }).join('') +
        (liste.some(function (s) { return !theme(s); }) ? '<option value="\u0000sans"' + (filtre === '\u0000sans' ? ' selected' : '') + '>Sans thème</option>' : '') +
        '</select></label>';
    }
    function unSeance(s) {
      return '<div class="pr-o-seance"><small>' + date(s.jour) + (s.visible ? ' · <b style="color:#6B2F5B">visible par le·la client·e</b>' : '') + '</small><p>' + esc(s.texte) + '</p><label class="pr-o-case" style="font-size:.85rem;margin:.3rem 0"><input type="checkbox" data-note-visible="' + esc(s.id) + '"' + (s.visible ? ' checked' : '') + '> <span>Visible par mon·ma client·e</span></label><button class="pr-o-lien" type="button" data-suppr-note="' + esc(s.id) + '">Supprimer</button></div>';
    }
    function dessiner() {
      dessinerFiltre();
      var zs = f.querySelector('[data-seances]');
      var visee = filtre ? liste.filter(function (s) { return filtre === '\u0000sans' ? !theme(s) : theme(s) === filtre; }) : liste;
      if (!visee.length) { zs.innerHTML = '<p class="pr-o-aide">' + (liste.length ? 'Aucune note pour ce thème.' : 'Aucune note pour ce dossier.') + '</p>'; return; }
      if (filtre) { zs.innerHTML = visee.slice().sort(function (a, b) { return b.jour < a.jour ? -1 : 1; }).map(unSeance).join(''); return; }
      /* Sans filtre : groupées par thème, le thème le plus récemment utilisé en premier ; les notes sans thème en dernier */
      var groupes = [], vus = {};
      liste.slice().sort(function (a, b) { return b.jour < a.jour ? -1 : 1; }).forEach(function (s) {
        var th = theme(s);
        if (!vus[th || '\u0000sans']) { vus[th || '\u0000sans'] = { theme: th, items: [] }; groupes.push(vus[th || '\u0000sans']); }
        vus[th || '\u0000sans'].items.push(s);
      });
      groupes.sort(function (a, b) { return (!!a.theme === !!b.theme) ? 0 : a.theme ? -1 : 1; });
      zs.innerHTML = groupes.map(function (g) {
        return (g.theme ? '<h3 style="margin-top:1.1rem">' + esc(g.theme) + '</h3>' : groupes.length > 1 ? '<h3 style="margin-top:1.1rem;color:var(--prune-doux,#7A5570)">Sans thème</h3>' : '') +
          g.items.map(unSeance).join('');
      }).join('');
    }
    /* Garde-fou : tant que les notes existantes n'ont pas été relues, on n'enregistre rien.
       Sans ça, un coffre qui ne répond pas donne une liste vide, et le premier enregistrement
       remplacerait toutes les notes déjà prises pour ce dossier. */
    function sauver() {
      if (!chargee) return Promise.reject(new Error('notes-non-chargees'));
      return CF.ecrire(o.sb, o.user, cle, { seances: liste }).then(function (r) { if (r && r.error) throw r.error; });
    }
    if (!CF) { f.querySelector('[data-seances]').innerHTML = '<p class="pr-o-aide">Les notes ne sont pas disponibles ici.</p>'; return f; }
    CF.lire(o.sb, o.user, cle).then(function (x) { liste = (x && x.seances) || []; chargee = true; dessiner(); }, function () { f.querySelector('[data-seances]').innerHTML = '<p class="pr-o-aide">Les notes n’ont pas pu être chargées. Rechargez la page avant d’en ajouter une : vos notes sont intactes.</p>'; });
    var form = f.querySelector('[data-note-form]'), m = f.querySelector('[data-note-msg]');
    form.addEventListener('submit', function (e) {
      e.preventDefault(); var t = form.texte.value.trim(); if (!t) { m.textContent = 'Écrivez votre note.'; return; }
      var th = form.theme.value.trim();
      liste.push({ id: 's' + Date.now(), jour: form.jour.value || new Date().toISOString().slice(0, 10), texte: t, visible: !!form.visible.checked, theme: th });
      sauver().then(function () {
        form.texte.value = ''; form.visible.checked = false; m.textContent = 'Note ajoutée, chiffrée.';
        try { if (th) localStorage.setItem(clePerso, th); } catch (e) {}
        dessiner();
      }, function () { liste.pop(); m.textContent = 'La note n’a pas pu être enregistrée. Réessayez.'; });
    });
    f.querySelector('[data-export-notes]').addEventListener('click', function () {
      var bt = this; if (!liste.length) { m.textContent = 'Aucune note à exporter pour ce dossier.'; return; }
      bt.disabled = true;
      exporterNotes(o.cabinet, o.nom, liste).then(function () { bt.disabled = false; }, function () { bt.disabled = false; m.textContent = 'Le PDF n’a pas pu être créé. Réessayez.'; });
    });
    f.addEventListener('click', function (e) { var b = e.target.closest('[data-suppr-note]'); if (!b || !confirm('Supprimer cette note ?')) return; var avant = liste; liste = liste.filter(function (s) { return s.id !== b.getAttribute('data-suppr-note'); }); sauver().then(dessiner, function () { liste = avant; dessiner(); }); });
    f.addEventListener('change', function (e) {
      var c = e.target.closest && e.target.closest('[data-note-visible]');
      if (c) {
        var s2 = liste.filter(function (s) { return s.id === c.getAttribute('data-note-visible'); })[0]; if (!s2) return;
        var avant = s2.visible; s2.visible = c.checked;
        sauver().catch(function () { s2.visible = avant; dessiner(); });
        return;
      }
      if (e.target.closest && e.target.closest('[data-note-filtre]')) { filtre = e.target.value; dessiner(); }
    });
    return f;
  }

  /* ───────── Lien de partage ───────── */
  function url(j) { return 'https://genesolia.fr/genosociogramme.html?partage=' + j; }
  function copier(texte, msg) {
    var ok = function () { if (msg) msg.textContent = 'Lien copié. Vous pouvez le coller dans votre message.'; marquer('partage'); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(texte).then(ok, function () { try { document.execCommand('copy'); ok(); } catch (e) {} });
    else { try { document.execCommand('copy'); ok(); } catch (e) {} }
  }
  function resumeOptions(op) {
    op = op || {};
    if (op.supervision) return 'Supervision : dossier anonymisé' + (op.reps === false ? ', sans « Ce qui se répète »' : '');
    if (op.reps === false) return 'L’arbre seul, sans « Ce qui se répète »';
    return op.delicat ? 'L’arbre et les répétitions, sans les pistes délicates' : 'L’arbre et toutes les répétitions';
  }
  /* o : { sb, user, id, nom, actif, remise } */
  function partager(o) {
    var f = fenetre('<h2>Partager l’arbre de ' + esc(o.nom || 'votre client·e') + '</h2>' +
      '<p class="pr-o-aide">Le lien montre l’arbre en lecture, <b>sans vos notes</b>. ' + (o.remise ? 'Le travail est marqué terminé : votre client·e pourra télécharger et garder son arbre.' : 'Tant que « Travail terminé » n’est pas coché dans votre Espace praticien, rien ne peut être téléchargé ni imprimé depuis ce lien.') + '</p>' +
      '<div data-actifs><p class="pr-o-aide pr-chargeur"><i></i>Chargement des liens…</p></div>' +
      (o.actif ? '<h3>Nouveau lien</h3><form class="pr-o-form" data-nouveau-lien>' +
        '<label class="pr-o-case"><input type="checkbox" name="reps" checked> <span>Montrer « Ce qui se répète »</span></label>' +
        '<label class="pr-o-case"><input type="checkbox" name="delicat"> <span>Cacher les pistes délicates : deuils, pertes de grossesse, IVG, départs précoces</span></label>' +
        '<p class="pr-o-aide" style="margin:0">Les pistes que vous avez marquées « Pas pour moi » dans le dossier ne sont jamais montrées.</p>' +
        '<label class="pr-o-case"><input type="checkbox" name="supervision"> <span><b>Lien de supervision</b> : pour votre superviseure ou votre formatrice. Le dossier est anonymisé avant de quitter la base : ni prénoms, ni noms, ni lieux, ni dates exactes (les années restent), ni notes. Chacun·e apparaît par sa place (mère, grand-père…). Jamais téléchargeable.</span></label>' +
        '<div><button class="btn btn-plein bt plein" type="submit">Créer le lien (valable 14 jours)</button></div><div data-nouveau></div></form>'
        : '<p class="pr-o-aide">Pour créer un nouveau lien, il faut l’abonnement. Vous pouvez toujours désactiver les liens déjà envoyés.</p>'));
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
        o.sb.from('partages_arbre').update({ expire_le: new Date().toISOString() }).eq('jeton', b.getAttribute('data-desactiver')).then(function (r) { if (r && r.error) { b.disabled = false; alert('Le lien n’a pas pu être désactivé. Réessayez.'); return; } liens(); });
      }
    });
    var fn = f.querySelector('[data-nouveau-lien]');
    if (fn) fn.addEventListener('submit', function (e) {
      e.preventDefault();
      var op = { reps: fn.reps.checked, delicat: fn.reps.checked && fn.delicat.checked, supervision: fn.supervision.checked }, exp = new Date(Date.now() + 14 * 864e5).toISOString();
      var rap = 'Créer ce lien ? Il montrera l’arbre' + (op.supervision ? ' anonymisé (sans prénoms ni dates exactes)' : '') + (op.delicat ? ', sans les pistes délicates' : '') + (!op.reps ? ', sans « Ce qui se répète »' : '') + '.\n\nVos notes de séance ne sont JAMAIS incluses dans ce lien, quelle que soit l’option choisie.\n\nRappel : toute personne qui reçoit ce lien peut le transmettre à son tour, et il reste valable 14 jours.';
      if (!confirm(rap)) return;
      var bt = fn.querySelector('button[type=submit]');
      bt.disabled = true;
      o.sb.from('partages_arbre').insert({ user_id: o.user.id, arbre_id: o.id, expire_le: exp, options: op }).select('jeton').single().then(function (r) {
        bt.disabled = false;
        if (r.error) { fn.querySelector('[data-nouveau]').innerHTML = '<p class="pr-o-msg">Le lien n’a pas pu être créé. Réessayez dans un instant.</p>'; return; }
        fn.querySelector('[data-nouveau]').innerHTML = '<p class="pr-o-aide" style="margin:.4rem 0 0">Votre lien est prêt, en haut de la liste. Copiez-le pour l’envoyer.</p>';
        marquer('partage');   /* « Envoyer un lien de partage » est fait dès que le lien existe */
        liens();
      });
    });
    return f;
  }

  /* ───────── Questionnaire avant séance : un lien que le·la client·e remplit chez lui·elle, sans compte ───────── */
  function urlQ(j) { return 'https://genesolia.fr/questionnaire.html?q=' + j; }
  var LIB_G = { repete: 'Ce qui lui semble se répéter', attente: 'Ce qui l’amène', silences: 'Ce dont on ne parle pas' };
  /* o : { sb, user, id, nom, actif, dansArbre } */
  function questionnaire(o) {
    var f = fenetre('<h2>Questionnaire avant séance' + (o.nom ? ' · ' + esc(o.nom) : '') + '</h2>' +
      '<p class="pr-o-aide">Envoyez ce lien à votre client·e : il·elle remplit chez lui·elle, sans compte, sa famille proche, les dates, les moments marquants et ce qu’il·elle en ressent. Ses réponses arrivent ici, et s’ajoutent automatiquement à son arbre dès que vous ouvrez le dossier. Les personnes déjà présentes sont seulement complétées : rien n’est effacé.</p>' +
      '<h3 style="margin-top:1rem">Vos questions personnalisées</h3><p class="pr-o-aide" style="margin:0 0 .5rem">Affichées à la fin du questionnaire, en plus de l’arbre familial. Elles s’appliquent à tous les liens envoyés ensuite, pas seulement à ce dossier.</p>' +
      '<form class="pr-o-form" data-q-perso-form><div data-q-perso-liste><p class="pr-o-aide pr-chargeur"><i></i>Chargement…</p></div><button class="btn btn-trait bt" type="button" data-q-perso-ajouter style="margin:.2rem 0">+ Ajouter une question</button><button class="btn btn-trait bt" type="button" data-q-apercu style="margin:.2rem 0 .2rem .5rem">Voir le questionnaire complet (aperçu)</button><p class="pr-o-msg" data-q-perso-msg role="status"></p><div><button class="btn btn-trait bt" type="submit">Enregistrer ces questions</button></div></form>' +
      '<div data-q-liste style="margin-top:1rem"><p class="pr-o-aide pr-chargeur"><i></i>Chargement…</p></div>' +
      (o.actif ? '<div class="pr-o-boutons" style="margin-top:.6rem"><button class="btn btn-plein bt plein" type="button" data-q-creer>Créer un lien (valable 21 jours)</button></div><p class="pr-o-msg" data-q-msg role="status"></p>'
        : '<p class="pr-o-aide">Pour envoyer un nouveau questionnaire, il faut l’abonnement. Les réponses déjà reçues restent ici.</p>'));
    var zq = f.querySelector('[data-q-perso-liste]'), qPerso = [], cabNom = '';
    function rendreQPerso() {
      zq.innerHTML = qPerso.length ? qPerso.map(function (q, i) {
        return '<div style="display:flex;gap:.5rem;margin:0 0 .5rem;align-items:flex-start"><input type="text" maxlength="200" value="' + esc(q) + '" style="flex:1" placeholder="Votre question" data-q-perso-texte aria-label="Question ' + (i + 1) + '"><button class="btn btn-trait bt" type="button" data-q-perso-suppr="' + i + '" style="padding:.3rem .7rem;font-size:.85rem;flex:none">Supprimer</button></div>';
      }).join('') : '<p class="pr-o-aide">Aucune question pour l’instant.</p>';
    }
    o.sb.from('praticiens').select('cabinet,questions_perso').eq('user_id', o.user.id).maybeSingle().then(function (r) {
      cabNom = (r && r.data && r.data.cabinet) || '';
      qPerso = (r && r.data && r.data.questions_perso) || []; rendreQPerso();
    });
    f.addEventListener('click', function (e) {
      if (e.target.closest('[data-q-perso-ajouter]')) {
        if (qPerso.length >= 12) return;
        qPerso = qPerso.concat(['']); rendreQPerso();
        var ins = zq.querySelectorAll('input[data-q-perso-texte]'); if (ins.length) ins[ins.length - 1].focus();
        return;
      }
      var bs = e.target.closest('[data-q-perso-suppr]');
      if (bs) { qPerso = qPerso.slice(); qPerso.splice(+bs.getAttribute('data-q-perso-suppr'), 1); rendreQPerso(); return; }
      if (e.target.closest('[data-q-apercu]')) {
        var vals = [].map.call(zq.querySelectorAll('input[data-q-perso-texte]'), function (i) { return i.value.trim(); }).filter(Boolean).slice(0, 12);
        var u = 'questionnaire.html?apercu=1&perso=' + encodeURIComponent(JSON.stringify(vals)) + (cabNom ? '&cabinet=' + encodeURIComponent(cabNom) : '');
        window.open(u, '_blank');
      }
    });
    var fq = f.querySelector('[data-q-perso-form]');
    fq.addEventListener('submit', function (e) {
      e.preventDefault();
      var vals = [].map.call(zq.querySelectorAll('input[data-q-perso-texte]'), function (i) { return i.value.trim(); }).filter(Boolean).slice(0, 12);
      var m = f.querySelector('[data-q-perso-msg]'), bt = fq.querySelector('button[type=submit]');
      bt.disabled = true;
      o.sb.from('praticiens').update({ questions_perso: vals }).eq('user_id', o.user.id).then(function (r) {
        bt.disabled = false;
        if (r.error) { m.textContent = 'Pas enregistré. Réessayez.'; return; }
        qPerso = vals; rendreQPerso(); m.textContent = 'Enregistré.';
      });
    });
    var zl = f.querySelector('[data-q-liste]'), liste = [];
    function charger() {
      o.sb.from('questionnaires_client').select('jeton,expire_le,cree_le,rempli_le,importe_le').eq('arbre_id', o.id).order('cree_le', { ascending: false }).then(function (r) {
        if (r.error) { zl.innerHTML = '<p class="pr-o-aide">Les questionnaires n’ont pas pu être chargés.</p>'; return; }
        liste = (r.data || []).filter(function (q) { return q.rempli_le || new Date(q.expire_le) > new Date(); });
        zl.innerHTML = liste.length ? '<p class="pr-o-aide">Déchiffrement…</p>' : '<p class="pr-o-aide">Aucun questionnaire en cours pour ce dossier.</p>';
        if (!liste.length) return;
        Promise.all(liste.map(function (q) {
          if (!q.rempli_le) return Promise.resolve(null);
          return o.sb.rpc('questionnaire_reponses_lire', { p_jeton: q.jeton }).then(function (rr) { return (rr && rr.data) || null; }, function () { return null; });
        })).then(function (reps) {
          zl.innerHTML = liste.map(function (q, i) {
            if (q.rempli_le) {
              var rep = reps[i], g = (rep && rep.general) || {}, n = rep && rep.people ? Object.keys(rep.people).length : 0;
              return '<div class="pr-o-actif"><div><b>Réponses reçues le ' + date(q.rempli_le) + '</b> · ' + n + ' personne' + (n > 1 ? 's' : '') + '<br><small>' + (q.importe_le ? 'Ajoutées à l’arbre le ' + date(q.importe_le) : 'Pas encore ajoutées à l’arbre') + '</small></div>' +
                Object.keys(LIB_G).filter(function (k) { return g[k]; }).map(function (k) { return '<div><small>' + LIB_G[k] + '</small><p style="margin:.15rem 0 0;white-space:pre-wrap">' + esc(g[k]) + '</p></div>'; }).join('') +
                ((rep && rep.perso) || []).map(function (x) { return '<div><small>' + esc(x.q) + '</small><p style="margin:.15rem 0 0;white-space:pre-wrap">' + esc(x.a) + '</p></div>'; }).join('') +
                '<div class="pr-o-boutons">' + (q.importe_le ? '' : '<a class="btn btn-trait bt" href="genosociogramme.html?arbre=' + encodeURIComponent(o.id) + '&amp;questionnaire=' + esc(q.jeton) + '">Ouvrir le dossier (ajout automatique)</a>') +
                '<button class="pr-o-lien pr-o-desact" type="button" data-q-suppr="' + esc(q.jeton) + '">Supprimer ces réponses</button></div></div>';
            }
            return '<div class="pr-o-actif"><div><b>Créé le ' + date(q.cree_le) + '</b> · en attente des réponses<br><small>Lien valable jusqu’au ' + date(q.expire_le) + '</small></div>' +
              '<input class="pr-o-url" type="text" readonly value="' + esc(urlQ(q.jeton)) + '" aria-label="Adresse du questionnaire">' +
              '<div class="pr-o-boutons"><button class="btn btn-trait bt" type="button" data-q-copier="' + esc(q.jeton) + '">Copier le lien</button><button class="pr-o-lien pr-o-desact" type="button" data-q-suppr="' + esc(q.jeton) + '">Désactiver ce lien</button></div><p class="pr-o-msg" data-q-copie="' + esc(q.jeton) + '"></p></div>';
          }).join('');
        });
      });
    }
    charger();
    f.addEventListener('click', function (e) {
      var b;
      if ((b = e.target.closest('[data-q-creer]'))) {
        b.disabled = true;
        var exp = new Date(Date.now() + 21 * 864e5).toISOString();
        o.sb.from('questionnaires_client').insert({ user_id: o.user.id, arbre_id: o.id, expire_le: exp }).select('jeton').single().then(function (r) {
          b.disabled = false;
          var m = f.querySelector('[data-q-msg]');
          if (r.error) { m.textContent = 'Le lien n’a pas pu être créé. Réessayez dans un instant.'; return; }
          m.textContent = 'Votre lien est prêt, en haut de la liste. Copiez-le pour l’envoyer.';
          charger();
        });
      } else if ((b = e.target.closest('[data-q-copier]'))) {
        var j = b.getAttribute('data-q-copier'), i = b.closest('.pr-o-actif').querySelector('input'); i.select();
        var msg = f.querySelector('[data-q-copie="' + j + '"]'), ok = function () { msg.textContent = 'Lien copié. Vous pouvez le coller dans votre message.'; };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(urlQ(j)).then(ok, function () { try { document.execCommand('copy'); ok(); } catch (x) {} });
        else { try { document.execCommand('copy'); ok(); } catch (x) {} }
      } else if ((b = e.target.closest('[data-q-suppr]'))) {
        var q = liste.filter(function (x) { return x.jeton === b.getAttribute('data-q-suppr'); })[0];
        if (!confirm(q && q.rempli_le ? 'Supprimer ces réponses ? Ce qui est déjà dans l’arbre y reste.' : 'Désactiver ce lien ? Votre client·e ne pourra plus remplir le questionnaire.')) return;
        b.disabled = true;
        o.sb.from('questionnaires_client').delete().eq('jeton', b.getAttribute('data-q-suppr')).then(function (r) { if (r.error) { b.disabled = false; alert('Ça n’a pas abouti. Réessayez.'); return; } charger(); });
      }
    });
    return f;
  }

  /* ───────── Document de déontologie : à envoyer avant de démarrer une séance ───────── */
  function urlD(j) { return 'https://genesolia.fr/deontologie.html?d=' + j; }
  /* o : { sb, user, id, nom } */
  function deontologie(o) {
    var f = fenetre('<h2>Déontologie · ' + esc(o.nom || '') + '</h2><p class="pr-o-aide">Un document de cadre à envoyer à votre client·e avant de démarrer une séance. Le texte de base est le même pour tous vos dossiers ; ajoutez ci-dessous ce qui est propre à votre pratique ou à cette personne. C’est un modèle de départ : relisez-le et adaptez-le à votre façon de travailler.</p>' +
      '<div data-corps><p class="pr-o-aide pr-chargeur"><i></i>Chargement…</p></div>', o.tiroir);
    var courant = null;
    function statutTexte(d) {
      if (!d) return '';
      var bits = [];
      bits.push(d.signe_praticien_le ? 'Votre engagement est enregistré depuis le ' + date(d.signe_praticien_le) + '.' : '');
      bits.push(d.signe_client_le ? '<b style="color:#6B2F5B">Validé par ' + esc(d.client_nom || 'votre client·e') + ' le ' + date(d.signe_client_le) + '.</b>' : 'En attente de la validation de votre client·e.');
      return bits.filter(Boolean).join(' ');
    }
    function dessinerForm(d) {
      var zc = f.querySelector('[data-corps]'), verrouille = !!(d && d.signe_client_le);
      zc.innerHTML = (d ? '<p class="pr-o-aide">' + statutTexte(d) + '</p>' : '') +
        (d ? '<input class="pr-o-url" style="margin:.3rem 0 .8rem" type="text" readonly value="' + esc(urlD(d.jeton)) + '" aria-label="Lien du document">' : '') +
        '<form class="pr-o-form" data-d-form>' +
        '<label>Votre section personnalisée (facultatif)<textarea name="perso" maxlength="4000" placeholder="Ce qui est propre à votre pratique, à ce dossier, ou toute précision utile avant de commencer."' + (verrouille ? ' disabled' : '') + '>' + esc((d && d.texte_perso) || '') + '</textarea></label>' +
        '<p class="pr-o-msg" data-d-msg role="status"></p>' +
        '<div class="pr-o-boutons">' +
        (verrouille ? '' : '<button class="btn btn-plein bt plein" type="submit">' + (d ? 'Enregistrer et confirmer mon engagement' : 'Créer ce document et confirmer mon engagement') + '</button>') +
        (verrouille ? '' : '<button class="btn btn-trait bt" type="button" data-d-apercu>Voir le document (aperçu)</button>') +
        (d ? '<button class="btn btn-trait bt" type="button" data-d-copier>Copier le lien</button>' : '') +
        (verrouille ? '<button class="btn btn-trait bt" type="button" data-d-nouveau>Nouveau document (pour une prochaine séance)</button>' : '') +
        '</div></form>';
      var fd = zc.querySelector('[data-d-form]');
      if (fd) fd.addEventListener('submit', function (e) {
        e.preventDefault();
        var texte = fd.perso.value.trim(), m = zc.querySelector('[data-d-msg]'), bt = fd.querySelector('button[type=submit]');
        bt.disabled = true;
        (d ? Promise.resolve(d.jeton) : o.sb.from('deontologies_client').insert({ user_id: o.user.id, arbre_id: o.id }).select('jeton').single().then(function (r) { if (r.error) throw r.error; return r.data.jeton; }))
          .then(function (jeton) { return o.sb.rpc('deontologie_signer_praticien', { p_jeton: jeton, p_texte_perso: texte || null }).then(function (r) { if (r.error || (r.data && r.data.erreur)) throw (r.error || r.data.erreur); return jeton; }); })
          .then(function () { m.textContent = 'Enregistré. Votre engagement est confirmé.'; charger(); }, function () { bt.disabled = false; m.textContent = 'Ça n’a pas abouti. Réessayez.'; });
      });
      var ba = zc.querySelector('[data-d-apercu]');
      if (ba) ba.addEventListener('click', function () {
        var u = 'deontologie.html?apercu=1&perso=' + encodeURIComponent(fd.perso.value.trim()) + (o.cabinet ? '&cabinet=' + encodeURIComponent(o.cabinet) : '');
        window.open(u, '_blank');
      });
      var bc = zc.querySelector('[data-d-copier]');
      if (bc) bc.addEventListener('click', function () { copier(urlD(d.jeton), zc.querySelector('[data-d-msg]')); });
      var bn = zc.querySelector('[data-d-nouveau]');
      if (bn) bn.addEventListener('click', function () {
        if (!confirm('Créer un nouveau document pour une prochaine séance ? Le document déjà validé reste conservé tel quel.')) return;
        courant = null; dessinerForm(null);
      });
    }
    function charger() {
      o.sb.from('deontologies_client').select('jeton,texte_perso,expire_le,cree_le,signe_praticien_le,signe_client_le,client_nom').eq('arbre_id', o.id).gt('expire_le', new Date().toISOString()).order('cree_le', { ascending: false }).limit(1).then(function (r) {
        if (r.error) { f.querySelector('[data-corps]').innerHTML = '<p class="pr-o-aide">Le document n’a pas pu être chargé.</p>'; return; }
        courant = (r.data && r.data[0]) || null; dessinerForm(courant);
      });
    }
    charger();
    return f;
  }

  /* ───────── Bilan de suivi : une page dédiée (bilan.html) pour la fin d'accompagnement — toujours l'arbre, en option la photo
     de la constellation (capturée depuis le plateau), et les notes cochées une à une ici même ───────── */
  function urlBilan(j) { return 'https://genesolia.fr/bilan.html?b=' + j; }
  /* o : { sb, user, id, nom, cabinet } */
  function bilan(o) {
    var CF = window.GenesoliaCoffre, cle = 'seances-' + o.id, liste = [], jeton = null, bilanActuel = null, nbPions = 0, chargee = false;
    var f = fenetre('<h2>Bilan de suivi · ' + esc(o.nom || '') + '</h2>' +
      '<p class="pr-o-aide">Une page dédiée pour la fin de l’accompagnement, différente du lien « Partager l’arbre ». L’arbre y est toujours inclus ; cochez en plus la constellation et les notes que vous voulez y faire figurer.</p>' +
      '<div class="pr-o-actif" style="background:#FFFBFC"><b>✓ Son arbre</b><br><small>Toujours inclus sur la page du bilan.</small></div>' +
      '<h3>Sa constellation</h3><p class="pr-o-aide pr-chargeur" data-bilan-plateau><i></i>Chargement…</p>' +
      '<h3>Notes à inclure</h3><p class="pr-o-aide" style="margin:0 0 .5rem">Cochez celles que vous voulez montrer à votre client·e sur cette page.</p>' +
      '<div data-bilan-notes><p class="pr-o-aide pr-chargeur"><i></i>Chargement…</p></div>' +
      '<div class="pr-o-boutons" style="margin-top:1rem"><button class="btn btn-plein bt plein" type="button" data-bilan-publier>Créer / mettre à jour le bilan</button></div>' +
      '<p class="pr-o-msg" data-bilan-msg role="status"></p>' +
      '<div data-bilan-lien></div>');
    var zp = f.querySelector('[data-bilan-plateau]'), zn = f.querySelector('[data-bilan-notes]'), zl = f.querySelector('[data-bilan-lien]'), msg = f.querySelector('[data-bilan-msg]');
    function dessinerNotes() {
      zn.innerHTML = liste.length ? liste.slice().sort(function (a, b) { return b.jour < a.jour ? -1 : 1; }).map(function (s) {
        return '<label class="pr-o-case" style="border:1px solid var(--rose,#F2D6DE);border-radius:12px;padding:.6rem .7rem;margin:0 0 .5rem"><input type="checkbox" data-bilan-note="' + esc(s.id) + '"' + (s.visible ? ' checked' : '') + '><span><b>' + date(s.jour) + '</b><br>' + esc(s.texte) + '</span></label>';
      }).join('') : '<p class="pr-o-aide">Aucune note de séance pour ce dossier pour l’instant.</p>';
    }
    function dessinerLien() {
      if (!jeton) { zl.innerHTML = ''; return; }
      zl.innerHTML = '<h3>Page à envoyer</h3><input class="pr-o-url" type="text" readonly value="' + esc(urlBilan(jeton)) + '" aria-label="Adresse de la page du bilan">' +
        '<div class="pr-o-boutons"><button class="btn btn-trait bt" type="button" data-bilan-copier>Copier le lien</button></div>' +
        '<p class="pr-o-aide" style="margin:.4rem 0 0">Votre client·e peut tout télécharger en PDF depuis cette page (avec les liens, même si elle l’imprime), et continuer son arbre dans son propre espace Genesolia gratuit.</p>';
    }
    function chargerPartage() {
      return o.sb.from('partages_arbre').select('jeton,bilan').eq('arbre_id', o.id).gt('expire_le', new Date().toISOString()).order('cree_le', { ascending: false }).limit(1).then(function (r) {
        var ligne = r && r.data && r.data[0];
        jeton = ligne ? ligne.jeton : null; bilanActuel = ligne ? ligne.bilan : null;
        dessinerLien();
      }, function () { zl.innerHTML = '<p class="pr-o-aide">Le lien n’a pas pu être vérifié.</p>'; });
    }
    chargerPartage();
    o.sb.from('arbres_supp').select('data').eq('id', o.id).maybeSingle().then(function (r) {
      nbPions = (r && r.data && r.data.data && r.data.data.plateau && Array.isArray(r.data.data.plateau.pions)) ? r.data.data.plateau.pions.length : 0;
      if (!nbPions) { zp.textContent = 'Aucun plateau pour ce dossier pour l’instant : posez des pions dans « Constellation », puis revenez ici.'; return; }
      zp.innerHTML = 'Vous avez un plateau de ' + nbPions + ' pion' + (nbPions > 1 ? 's' : '') + '. ' + ((bilanActuel && bilanActuel.constellation) ? 'Une photo est déjà incluse dans le bilan' + (bilanActuel.maj ? ' (mise à jour le ' + date(bilanActuel.maj) + ')' : '') + '.' : 'Aucune photo incluse pour l’instant.') +
        ' <a href="plateau-visio.html?arbre=' + esc(o.id) + '" target="_blank" rel="noopener">Ouvrir le plateau pour ' + ((bilanActuel && bilanActuel.constellation) ? 'la mettre à jour' : 'en prendre une photo') + '</a>.';
    }, function () { zp.textContent = 'Le plateau n’a pas pu être vérifié.'; });
    if (!CF) { zn.innerHTML = '<p class="pr-o-aide">Les notes ne sont pas disponibles ici.</p>'; }
    else CF.lire(o.sb, o.user, cle).then(function (x) { liste = (x && x.seances) || []; chargee = true; dessinerNotes(); }, function () { zn.innerHTML = '<p class="pr-o-aide">Les notes n’ont pas pu être chargées. Rechargez la page avant de publier le bilan : vos notes sont intactes.</p>'; });
    function sauverVisible(id, v) {
      if (!chargee) return Promise.resolve();
      var s = liste.filter(function (x) { return x.id === id; })[0]; if (!s) return Promise.resolve();
      var avant = s.visible; s.visible = v;
      return CF.ecrire(o.sb, o.user, cle, { seances: liste }).then(function (r) { if (r && r.error) throw r.error; }, function () { s.visible = avant; dessinerNotes(); });
    }
    f.addEventListener('change', function (e) {
      var c = e.target.closest && e.target.closest('[data-bilan-note]'); if (!c) return;
      sauverVisible(c.getAttribute('data-bilan-note'), c.checked);
    });
    f.addEventListener('click', function (e) {
      if (e.target.closest('[data-bilan-copier]')) { var i = zl.querySelector('input'); if (i) i.select(); copier(urlBilan(jeton), msg); return; }
      if (e.target.closest('[data-bilan-publier]')) {
        var bt = f.querySelector('[data-bilan-publier]');
        /* Les notes n'ont pas pu être relues : publier maintenant retirerait du bilan
           toutes celles que la praticienne y avait mises. */
        if (!chargee) { msg.textContent = 'Les notes de séance n’ont pas pu être relues. Rechargez la page avant de publier, sinon le bilan partirait sans elles.'; return; }
        bt.disabled = true; msg.textContent = '';
        var notesArr = liste.filter(function (s) { return s.visible; }).map(function (s) { return { jour: s.jour, texte: s.texte }; });
        var nouveauBilan = Object.assign({}, bilanActuel || {}, { maj: new Date().toISOString(), notes: notesArr });
        var suite = jeton
          ? o.sb.from('partages_arbre').update({ bilan: nouveauBilan }).eq('jeton', jeton)
          : o.sb.from('partages_arbre').insert({ user_id: o.user.id, arbre_id: o.id, expire_le: new Date(Date.now() + 14 * 864e5).toISOString(), options: { reps: true }, bilan: nouveauBilan }).select('jeton').single();
        suite.then(function (r) {
          bt.disabled = false;
          if (r && r.error) { msg.textContent = 'Le bilan n’a pas pu être mis à jour. Réessayez.'; return; }
          if (!jeton) jeton = r.data.jeton;
          bilanActuel = nouveauBilan;
          msg.textContent = 'Bilan à jour.'; dessinerLien();
        });
      }
    });
    return f;
  }

  return { fenetre: fenetre, notes: notes, partager: partager, bilan: bilan, questionnaire: questionnaire, deontologie: deontologie, esc: esc, date: date };
})();
