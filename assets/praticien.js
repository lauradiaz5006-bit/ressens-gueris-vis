/* Genesolia · Mon cabinet (praticien.html) : l'Espace praticien.
   - Sans compte : créer son espace, puis revenir ici.
   - Connecté·e, pas encore praticien·ne : nom du cabinet + conditions + accord pour les notes chiffrées, puis essai de 30 jours
     (fonction praticien_commencer, outils-internes/supabase-praticien.sql).
   - Praticien·ne : dossiers clients illimités (table arbres_supp), notes par séance CHIFFRÉES (coffre, ligne « seances-<dossier> »),
     lien de partage en lecture pour le client (table partages_arbre), nom du cabinet.
   Après l'essai sans abonnement : les dossiers restent consultables, on ne peut plus en créer ni partager. */
(function () {
  'use strict';
  var SB_URL = 'https://qsvzzkjtjsznfntahvvh.supabase.co', SB_KEY = 'sb_publishable_6iEVxXmtB_u1hJ6mPS9fNg_CJhLjYkg';
  var z = document.getElementById('pr'), CF = window.GenesoliaCoffre, sb = null, user = null, prat = null, dossiers = [];
  try { sb = window.supabase.createClient(SB_URL, SB_KEY); } catch (e) {}
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function date(d) { return d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''; }
  function actif() { return prat && new Date(prat.acces_jusqu) > new Date(); }
  /* Tarif fondateur : tout cabinet ouvert jusqu’au 31 mars 2027 garde 19 € par mois */
  function fondateur() { return !!(prat && (prat.fondateur || (prat.cree_le && new Date(prat.cree_le) < new Date('2027-04-01T00:00:00+02:00')))); }
  function fait(k) { try { return localStorage.getItem('pr-fait-' + k) === '1'; } catch (e) { return false; } }
  function marquer(k) { try { localStorage.setItem('pr-fait-' + k, '1'); } catch (e) {} }
  function joursRestants() { return prat ? Math.max(0, Math.ceil((new Date(prat.acces_jusqu) - Date.now()) / 864e5)) : 0; }
  function indispo() { z.innerHTML = '<div class="pr-carte"><h2>L’Espace praticien ouvre très bientôt</h2><p class="pr-aide">Il est en cours de mise en place. Reviens dans quelques jours.</p><a class="btn btn-plein" href="espace-praticien.html">Découvrir l’Espace praticien</a></div>'; }

  /* ───────── Sans compte ───────── */
  function porte() {
    z.innerHTML = '<p class="pr-etiq">Espace praticien</p><h1 style="font-size:clamp(1.8rem,4vw,2.4rem)">Ton cabinet en ligne</h1>' +
      '<div class="pr-carte"><p class="pr-aide">Crée ton espace (ou connecte-toi), puis ouvre ton cabinet : <b>30 jours d’essai, sans carte</b>. Autant de dossiers client·es que tu veux, des notes par séance chiffrées, et un lien pour montrer son arbre à ton·ta client·e.</p>' +
      '<div class="pr-nouveau"><a class="btn btn-plein" href="login.html?inscription&amp;retour=praticien.html">Créer mon espace</a><a class="btn btn-trait" href="login.html?retour=praticien.html">J’ai déjà un espace</a></div></div>';
  }

  /* ───────── Ouvrir son cabinet (essai de 30 jours) ───────── */
  function inscription() {
    z.innerHTML = '<p class="pr-etiq">Espace praticien · 30 jours d’essai</p><h1 style="font-size:clamp(1.8rem,4vw,2.4rem)">Ouvre ton cabinet</h1>' +
      '<div class="pr-carte"><form class="pr-form" id="pr-ins" novalidate>' +
      '<label>Le nom de ton cabinet<input type="text" name="cabinet" maxlength="80" autocomplete="organization" placeholder="Cabinet Claire Martin, psychogénéalogie"></label>' +
      '<div class="pr-deux"><label>Ta pratique <small>(facultatif)</small><select name="pratique"><option value="">Choisis…</option><option>Psychogénéalogiste</option><option>Thérapeute</option><option>Coach</option><option>Sophrologue</option><option>Hypnothérapeute</option><option>Astrologue ou numérologue</option><option>Autre</option></select></label>' +
      '<label>Ta ville <small>(facultatif)</small><input type="text" name="ville" maxlength="80" autocomplete="address-level2"></label></div>' +
      '<label class="pr-case"><input type="checkbox" name="cgu"> <span>Je l’utilise dans le cadre de mon activité d’accompagnement. J’informe mes client·es et je recueille leur accord avant de créer leur dossier. Je n’y note pas d’informations médicales (diagnostics, traitements).</span></label>' +
      '<label class="pr-case"><input type="checkbox" name="coffre"' + (CF && CF.accord(user) ? ' checked disabled' : '') + '> <span>J’accepte que mes notes de séance soient gardées dans mon espace, <b>chiffrées</b> : l’équipe Genesolia ne les lit pas.</span></label>' +
      '<p class="pr-err" id="pr-err" role="alert"></p><div><button class="btn btn-plein" type="submit">Commencer mes 30 jours</button></div>' +
      '<p class="pr-aide" style="margin:0">Sans carte bancaire. Ensuite : 24 € par mois sans engagement, ou 240 € l’année. Cabinet ouvert jusqu’au 31 mars 2027 : <b>tarif fondateur, 19 € par mois</b>, garanti tant que ton abonnement continue.</p></form></div>';
    var f = document.getElementById('pr-ins'), err = document.getElementById('pr-err');
    f.addEventListener('submit', function (e) {
      e.preventDefault(); err.textContent = '';
      var cab = f.cabinet.value.trim();
      if (!cab) { err.textContent = 'Indique le nom de ton cabinet.'; f.cabinet.focus(); return; }
      if (!f.cgu.checked) { err.textContent = 'Coche la case sur l’usage de l’Espace praticien.'; return; }
      if (!f.coffre.checked) { err.textContent = 'Coche la case pour garder tes notes de séance, chiffrées.'; return; }
      var bt = f.querySelector('button'); bt.disabled = true; bt.textContent = 'Un instant…';
      var meta = {}; if (f.pratique.value) meta.pratique = f.pratique.value; if (f.ville.value.trim()) meta.ville = f.ville.value.trim().slice(0, 80);   /* pour l'annuaire, plus tard */
      if (!(CF && CF.accord(user))) meta.coffre_accord = new Date().toISOString();
      var accord = !Object.keys(meta).length ? Promise.resolve() : sb.auth.updateUser({ data: meta }).then(function (r) { if (r && r.data && r.data.user) user = r.data.user; });
      accord.then(function () { return sb.rpc('praticien_commencer', { p_cabinet: cab }); }).then(function (r) {
        if (r.error) { if (/function|does not exist|schema cache|PGRST20/i.test(r.error.message || '')) { indispo(); return; } throw r.error; }
        prat = r.data; cabinet();
      }).catch(function () { bt.disabled = false; bt.textContent = 'Commencer mes 30 jours'; err.textContent = 'L’ouverture n’a pas abouti. Réessaie dans un instant.'; });
    });
  }

  /* ───────── Le cabinet ───────── */
  function etat() {
    if (!actif()) return '<span class="pr-etat fini">' + (prat.formule === 'essai' ? 'Ton essai est terminé' : 'Ton abonnement est arrêté') + ' · tes dossiers restent consultables</span>';
    if (prat.formule === 'essai') return '<span class="pr-etat">Essai · encore <b>' + joursRestants() + ' jour' + (joursRestants() > 1 ? 's' : '') + '</b></span>';
    return '<span class="pr-etat">Abonnement actif jusqu’au ' + date(prat.acces_jusqu) + '</span>';
  }
  function cabinet() {
    z.innerHTML = '<div class="pr-tete"><div><p class="pr-etiq">Espace praticien</p><h1>' + esc(prat.cabinet) + '</h1></div>' + etat() + '</div>' +
      (!actif() ? '<div class="pr-carte"><h2>Continuer avec l’Espace praticien</h2><p class="pr-aide">24 € par mois sans engagement, ou 240 € l’année' + (fondateur() ? ' (ton tarif fondateur : 19 € par mois)' : '') + '. Tu retrouves la création de dossiers, les partages et les rapports à ton nom.</p><button class="btn btn-plein" type="button" data-payer="' + (fondateur() ? 'praticienFondateur' : 'praticienMois') + '" data-bientot-texte="Bientôt disponible. Tes dossiers restent consultables en attendant.">M’abonner au mois</button> <button class="btn btn-trait" type="button" data-payer="praticienAn" data-bientot-texte="Bientôt disponible. Tes dossiers restent consultables en attendant.">240 € l’année</button><p class="pr-aide" data-bientot-msg style="margin-top:.6rem"></p></div>' : '') +
      (actif() && prat.formule === 'essai' ? '<div class="pr-carte' + (joursRestants() <= 5 ? ' pr-fin-essai' : '') + '"><h2>' + (joursRestants() <= 5 ? 'Plus que ' : 'Ton essai : encore ') + joursRestants() + ' jour' + (joursRestants() > 1 ? 's' : '') + (joursRestants() <= 5 ? ' d’essai' : '') + '</h2><p class="pr-aide">Pour garder la création de dossiers, les partages et les rapports à ton nom : ' + (fondateur() ? '<b>ton tarif fondateur, 19 € par mois</b> au lieu de 24 €, garanti tant que ton abonnement continue' : '24 € par mois sans engagement, ou 240 € l’année') + '. Tes dossiers restent à toi dans tous les cas.</p><button class="btn btn-plein" type="button" data-payer="' + (fondateur() ? 'praticienFondateur' : 'praticienMois') + '" data-bientot-texte="Bientôt disponible. Tes dossiers restent consultables en attendant.">M’abonner au mois</button> <button class="btn btn-trait" type="button" data-payer="praticienAn" data-bientot-texte="Bientôt disponible. Tes dossiers restent consultables en attendant.">240 € l’année</button><p class="pr-aide" data-bientot-msg style="margin-top:.6rem"></p></div>' : '') +
      '<div class="pr-grille"><section class="pr-carte" aria-labelledby="pr-dos-t"><h2 id="pr-dos-t">Mes dossiers client·es</h2>' +
      (actif() ? '<form class="pr-nouveau" id="pr-nouv"><input type="text" name="nom" maxlength="60" placeholder="Prénom ou initiales du·de la client·e" aria-label="Prénom ou initiales du client"><button class="btn btn-plein" type="submit">Nouveau dossier</button></form>' : '') +
      '<p class="pr-aide">Un dossier = un arbre. Pour la confidentialité, préfère le prénom ou les initiales.</p><div class="pr-liste" id="pr-liste"><p class="pr-vide">Chargement…</p></div><div id="pr-perso" style="margin-top:1rem"></div></section>' +
      '<aside><div id="pr-debut"></div><section class="pr-carte"><h2>Mon cabinet</h2><form class="pr-form" id="pr-cab"><label>Nom du cabinet<input type="text" name="cabinet" maxlength="80" value="' + esc(prat.cabinet) + '"></label><p class="pr-err" id="pr-cab-msg" role="status"></p><div><button class="btn btn-trait" type="submit">Enregistrer</button></div></form></section>' +
      '<section class="pr-carte"><h2>Bon à savoir</h2><p class="pr-aide">Tes notes de séance sont chiffrées dans ton espace : l’équipe Genesolia ne les lit pas. Le lien de partage montre l’arbre à ton·ta client·e, <b>sans tes notes</b>. Il reste valable 14 jours et se renouvelle en un clic.</p><p class="pr-aide">Tes notes de séance t’appartiennent : elles ne sont jamais copiées dans l’espace de ta cliente. Si elle te demande ce que tu as noté sur elle, tu peux les exporter depuis « Notes de séance », en PDF.</p><p class="pr-aide" style="margin:0">Pas d’informations médicales dans les dossiers. Un·e client·e te demande d’effacer son dossier ? Supprime-le ici.</p></section></aside></div>';
    chargerDossiers();
  }
  function chargerDossiers() {
    sb.from('arbres_supp').select('id,nom,data,maj,remise_autorisee').eq('user_id', user.id).order('maj', { ascending: false }).then(function (r) {
      var l = document.getElementById('pr-liste'); if (!l) return;
      if (r.error) { l.innerHTML = '<p class="pr-vide">Tes dossiers n’ont pas pu être chargés. Recharge la page dans un instant.</p>'; return; }
      var tous = r.data || [];
      dossiers = tous.filter(function (d) { return d.data && d.data.dossier === 'client'; });
      var perso = tous.filter(function (d) { return !(d.data && d.data.dossier === 'client'); });
      var zp = document.getElementById('pr-perso');
      if (zp) zp.innerHTML = perso.length ? '<details><summary>Mes arbres personnels (' + perso.length + ')</summary><p class="pr-aide">Ils ne sont pas comptés comme dossiers client·es. Si l’un d’eux est en fait le dossier d’un·e client·e, déplace-le ici.</p>' + perso.map(function (d) { return '<div class="pr-dossier"><div><b>' + esc(d.nom || 'Sans nom') + '</b></div><div class="pr-actions"><a class="btn btn-trait" href="genosociogramme.html?arbre=' + esc(d.id) + '">Ouvrir</a><button class="pr-lien" type="button" data-vers-client="' + esc(d.id) + '">C’est un dossier client·e</button></div></div>'; }).join('') + '</details>' : '';
      zp && (window.__persoPr = perso);
      debut();
      if (!dossiers.length) { l.innerHTML = '<p class="pr-vide">Aucun dossier pour l’instant. Crée le premier avec le prénom ou les initiales de ton·ta client·e.</p>' + (actif() ? '<div class="pr-exemple"><p><b>Envie d’essayer d’abord ?</b> Ouvre un dossier exemple déjà rempli, avec une famille fictive : tu verras les répétitions ressortir tout de suite.</p><button class="btn btn-trait" type="button" data-exemple>Ouvrir un dossier exemple</button></div>' : ''); return; }
      l.innerHTML = dossiers.map(function (d) {
        var n = d.data && d.data.people ? Object.keys(d.data.people).length : 0;
        return '<div class="pr-dossier"><div><b>' + esc(d.nom || 'Sans nom') + '</b><small>' + n + ' personne' + (n > 1 ? 's' : '') + (d.maj ? ' · modifié le ' + date(d.maj) : '') + '</small></div><div class="pr-actions">' +
          '<a class="btn btn-plein" href="genosociogramme.html?arbre=' + esc(d.id) + '">Ouvrir</a>' +
          '<button class="btn btn-trait" type="button" data-notes="' + esc(d.id) + '">Notes de séance</button>' +
          (actif() ? '<button class="btn btn-trait" type="button" data-partager="' + esc(d.id) + '">Partager</button>' : '') +
          '<button class="pr-lien" type="button" data-renommer="' + esc(d.id) + '">Renommer</button><button class="pr-lien" type="button" data-supprimer="' + esc(d.id) + '">Supprimer</button></div>' +
          '<div class="pr-remise"><label><input type="checkbox" data-remise="' + esc(d.id) + '"' + (d.remise_autorisee ? ' checked' : '') + '> <span>Travail terminé : ma cliente peut télécharger et garder son arbre</span></label>' +
          '<p class="pr-aide">Une fois cochée, ta cliente pourra télécharger son arbre et le garder dans son propre espace. Tes notes de séance ne sont jamais partagées.</p><p class="pr-aide" data-remise-msg="' + esc(d.id) + '" role="status"></p></div></div>';
      }).join('');
    });
  }
  /* « Pour bien commencer » : 4 étapes, cochées au fil de l'usage (rien n'est envoyé, tout reste sur cet appareil) */
  function debut() {
    var zd = document.getElementById('pr-debut'); if (!zd) return;
    var et = [['Créer un premier dossier', dossiers.length > 0], ['Ouvrir le mode séance', fait('seance')], ['Générer un rapport', fait('rapport')], ['Envoyer un lien de partage', fait('partage')]];
    var n = et.filter(function (x) { return x[1]; }).length;
    if (n === et.length || fait('debut-masque')) { zd.innerHTML = ''; return; }
    zd.innerHTML = '<section class="pr-carte pr-debut"><h2>Pour bien commencer <small>' + n + ' sur ' + et.length + '</small></h2><ol>' + et.map(function (x) { return '<li' + (x[1] ? ' class="ok"' : '') + '><span aria-hidden="true"></span>' + x[0] + (x[1] ? '<span class="sr"> (fait)</span>' : '') + '</li>'; }).join('') + '</ol>' +
      '<p class="pr-aide" style="margin:0">Le mode séance et le rapport se trouvent dans le menu ••• d’un dossier ouvert. <button class="pr-lien" type="button" data-debut-masquer>Masquer</button></p></section>';
  }
  function dossierExemple(bt) {
    bt.disabled = true; bt.textContent = 'Un instant…';
    fetch('assets/exemple-genosociogramme.json').then(function (r) { return r.json(); }).then(function (ex) {
      ex.dossier = 'client';
      return sb.from('arbres_supp').insert({ user_id: user.id, nom: 'Exemple · famille de Léa (fictive)', data: ex }).select('id').single();
    }).then(function (r) {
      if (r.error) throw r.error;
      location.href = 'genosociogramme.html?arbre=' + encodeURIComponent(r.data.id);
    }).catch(function () { bt.disabled = false; bt.textContent = 'Ouvrir un dossier exemple'; alert('Le dossier exemple n’a pas pu être créé. Réessaie dans un instant.'); });
  }
  function dossier(id) { return dossiers.filter(function (d) { return d.id === id; })[0]; }

  /* ───────── Notes par séance (chiffrées) ───────── */
  function notes(id) {
    var d = dossier(id), cle = 'seances-' + id, liste = [];
    var f = fenetre('<h2>Notes de séance · ' + esc(d ? d.nom : '') + '</h2><p class="pr-aide">Chiffrées dans ton espace : l’équipe Genesolia ne les lit pas.</p><div class="pr-nouveau" style="margin:0 0 .9rem"><button class="btn btn-trait" type="button" data-export-notes>Exporter les notes (PDF)</button></div><p class="pr-aide" id="pr-export-msg" role="status"></p>' +
      '<form class="pr-form" id="pr-note" style="max-width:none"><label>Date de la séance<input type="date" name="jour" value="' + new Date().toISOString().slice(0, 10) + '"></label><label>Ce que tu observes<textarea name="texte" maxlength="5000" placeholder="Ce qui est apparu, les pistes à explorer, la prochaine étape…"></textarea></label><p class="pr-err" id="pr-note-msg" role="status"></p><div><button class="btn btn-plein" type="submit">Ajouter cette note</button></div></form><div id="pr-seances"><p class="pr-vide">Chargement…</p></div>');
    function dessiner() {
      var zs = f.querySelector('#pr-seances');
      zs.innerHTML = liste.length ? liste.slice().sort(function (a, b) { return b.jour < a.jour ? -1 : 1; }).map(function (s, i) { return '<div class="pr-seance"><small>' + date(s.jour) + '</small><p>' + esc(s.texte) + '</p><button class="pr-lien" type="button" data-suppr-note="' + esc(s.id) + '">Supprimer</button></div>'; }).join('') : '<p class="pr-vide">Aucune note pour ce dossier.</p>';
    }
    function sauver() { return CF.ecrire(sb, user, cle, { seances: liste }).then(function (r) { if (r && r.error) throw r.error; }); }
    CF.lire(sb, user, cle).then(function (x) { liste = (x && x.seances) || []; dessiner(); }, function () { f.querySelector('#pr-seances').innerHTML = '<p class="pr-vide">Les notes n’ont pas pu être chargées.</p>'; });
    f.querySelector('#pr-note').addEventListener('submit', function (e) {
      e.preventDefault(); var t = this.texte.value.trim(), m = f.querySelector('#pr-note-msg'); if (!t) { m.textContent = 'Écris ta note.'; return; }
      liste.push({ id: 's' + Date.now(), jour: this.jour.value || new Date().toISOString().slice(0, 10), texte: t });
      var form = this; sauver().then(function () { form.texte.value = ''; m.textContent = 'Note ajoutée, chiffrée.'; dessiner(); }, function () { liste.pop(); m.textContent = 'La note n’a pas pu être enregistrée. Réessaie.'; });
    });
    f.querySelector('[data-export-notes]').addEventListener('click', function () {
      var m = f.querySelector('#pr-export-msg'), bt = this;
      if (!liste.length) { m.textContent = 'Aucune note à exporter pour ce dossier.'; return; }
      bt.disabled = true;
      exporterNotes(d ? d.nom : '', liste).then(function () { bt.disabled = false; m.textContent = ''; }, function () { bt.disabled = false; m.textContent = 'Le PDF n’a pas pu être créé. Réessaie.'; });
    });
    f.addEventListener('click', function (e) { var b = e.target.closest('[data-suppr-note]'); if (!b || !confirm('Supprimer cette note ?')) return; var avant = liste; liste = liste.filter(function (s) { return s.id !== b.getAttribute('data-suppr-note'); }); sauver().then(dessiner, function () { liste = avant; }); });
  }

  /* Export PDF des notes d'un dossier, au nom du cabinet, fabriqué sur l'appareil (rien n'est envoyé) */
  function jsPDFcharger() {
    if (window.jspdf) return Promise.resolve(window.jspdf.jsPDF);
    return new Promise(function (ok, ko) { var s = document.createElement('script'); s.src = 'assets/jspdf.umd.min.js'; s.onload = function () { ok(window.jspdf.jsPDF); }; s.onerror = ko; document.head.appendChild(s); });
  }
  function exporterNotes(nomDossier, liste) {
    return jsPDFcharger().then(function (J) {
      var doc = new J({ unit: 'mm', format: 'a4' }), pw = doc.internal.pageSize.getWidth(), ph = doc.internal.pageSize.getHeight(), m = 18, y = m, lw = pw - 2 * m;
      function place(h) { if (y + h > ph - m) { doc.addPage(); y = m; } }
      doc.setTextColor(107, 47, 91);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.text((prat && prat.cabinet) || 'Mon cabinet', m, y); y += 9;
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
      for (var i = 1; i <= n; i++) { doc.setPage(i); doc.setFontSize(8); doc.setTextColor(150, 120, 140); doc.text('Document personnel de ' + ((prat && prat.cabinet) || 'ton cabinet') + ' · page ' + i + ' sur ' + n, m, ph - 8); }
      doc.save('notes-' + String(nomDossier || 'dossier').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.pdf');
    });
  }

  /* ───────── Partage en lecture ───────── */
  function partager(id) {
    var d = dossier(id), exp = new Date(Date.now() + 14 * 864e5).toISOString();
    sb.from('partages_arbre').insert({ user_id: user.id, arbre_id: id, expire_le: exp }).select('jeton').single().then(function (r) {
      if (r.error) { alert('Le lien n’a pas pu être créé. Réessaie dans un instant.'); return; }
      var url = 'https://genesolia.fr/genosociogramme.html?partage=' + r.data.jeton; marquer('partage'); debut();
      var f = fenetre('<h2>Lien pour ' + esc(d ? d.nom : 'ton·ta client·e') + '</h2><p class="pr-aide">Ce lien montre l’arbre en lecture, <b>sans tes notes</b>. Il expire le ' + date(exp) + '.</p><input type="text" readonly value="' + esc(url) + '" style="width:100%;box-sizing:border-box;font:inherit;padding:.7rem;border:1px solid #E5C6CF;border-radius:12px"><div class="pr-nouveau" style="margin-top:.8rem"><button class="btn btn-plein" type="button" data-copier>Copier le lien</button></div><p class="pr-aide" data-copie-msg></p>');
      f.querySelector('[data-copier]').onclick = function () { var i = f.querySelector('input'); i.select(); (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(function () { f.querySelector('[data-copie-msg]').textContent = 'Lien copié.'; }, function () { document.execCommand && document.execCommand('copy'); }); };
    });
  }

  function fenetre(html) {
    var fond = document.createElement('div'); fond.className = 'pr-fond'; fond.setAttribute('role', 'dialog'); fond.setAttribute('aria-modal', 'true');
    fond.innerHTML = '<div class="pr-fenetre"><div style="text-align:right"><button class="pr-lien" type="button" data-fermer>Fermer</button></div>' + html + '</div>';
    document.body.appendChild(fond);
    fond.addEventListener('click', function (e) { if (e.target === fond || e.target.closest('[data-fermer]')) fond.remove(); });
    return fond;
  }

  /* ───────── Remise de l'arbre à la cliente (case par dossier) ───────── */
  document.addEventListener('change', function (e) {
    var c = e.target.closest && e.target.closest('[data-remise]'); if (!c) return;
    var id = c.getAttribute('data-remise'), v = c.checked, m = z.querySelector('[data-remise-msg="' + id + '"]');
    c.disabled = true;
    sb.from('arbres_supp').update({ remise_autorisee: v }).eq('id', id).then(function (r) {
      c.disabled = false;
      if (r.error) { c.checked = !v; if (m) m.textContent = 'Pas enregistré. Réessaie.'; return; }
      var d = dossier(id); if (d) d.remise_autorisee = v;
      if (m) m.textContent = v ? 'Enregistré. Envoie-lui un lien de partage : elle y trouvera les boutons pour télécharger et garder son arbre.' : 'Enregistré. Ce que ta cliente a déjà gardé reste dans son espace.';
    });
  });

  /* ───────── Événements ───────── */
  document.addEventListener('submit', function (e) {
    if (e.target.id === 'pr-nouv') {
      e.preventDefault(); var nom = e.target.nom.value.trim(); if (!nom) { e.target.nom.focus(); return; }
      var bt = e.target.querySelector('button'); bt.disabled = true;
      sb.from('arbres_supp').insert({ user_id: user.id, nom: nom.slice(0, 60), data: { people: {}, rels: [], nid: 1, v: 2, dossier: 'client' } }).select('id').single().then(function (r) {
        bt.disabled = false;
        if (r.error) { alert('Le dossier n’a pas pu être créé. Réessaie dans un instant.'); return; }
        location.href = 'genosociogramme.html?arbre=' + r.data.id;
      });
    }
    if (e.target.id === 'pr-cab') {
      e.preventDefault(); var c = e.target.cabinet.value.trim(), m = document.getElementById('pr-cab-msg'); if (!c) return;
      sb.from('praticiens').update({ cabinet: c.slice(0, 80) }).eq('user_id', user.id).then(function (r) { if (r.error) { m.textContent = 'Pas enregistré. Réessaie.'; return; } prat.cabinet = c; m.textContent = 'Enregistré.'; var h = z.querySelector('.pr-tete h1'); if (h) h.textContent = c; });
    }
  });
  document.addEventListener('click', function (e) {
    var b;
    if ((b = e.target.closest('[data-notes]'))) notes(b.getAttribute('data-notes'));
    else if ((b = e.target.closest('[data-partager]'))) partager(b.getAttribute('data-partager'));
    else if ((b = e.target.closest('[data-exemple]'))) dossierExemple(b);
    else if ((b = e.target.closest('[data-debut-masquer]'))) { marquer('debut-masque'); debut(); }
    else if ((b = e.target.closest('[data-renommer]'))) {
      var d = dossier(b.getAttribute('data-renommer')), n = prompt('Nouveau nom du dossier', d ? d.nom : ''); if (!n || !n.trim()) return;
      sb.from('arbres_supp').update({ nom: n.trim().slice(0, 60) }).eq('id', d.id).then(function (r) { if (!r.error) chargerDossiers(); });
    } else if ((b = e.target.closest('[data-supprimer]'))) {
      var d2 = dossier(b.getAttribute('data-supprimer'));
      if (!confirm('Supprimer le dossier « ' + (d2 ? d2.nom : '') + ' » et son arbre ? Ce n’est pas réversible.')) return;
      sb.from('carnets').delete().eq('user_id', user.id).eq('mois', 'seances-' + d2.id).then(function () { return sb.from('arbres_supp').delete().eq('id', d2.id); }).then(function (r) { if (r && r.error) { alert('La suppression n’a pas abouti.'); return; } chargerDossiers(); });
    } else if ((b = e.target.closest('[data-vers-client]'))) {
      var pd = (window.__persoPr || []).filter(function (x) { return x.id === b.getAttribute('data-vers-client'); })[0]; if (!pd) return;
      if (!confirm('Classer « ' + (pd.nom || '') + ' » dans tes dossiers client·es ?')) return;
      var nd = Object.assign({}, pd.data || {}, { dossier: 'client' });
      sb.from('arbres_supp').update({ data: nd }).eq('id', pd.id).then(function (r) { if (!r.error) chargerDossiers(); });
    }
  });

  /* ───────── Démarrage ───────── */
  if (!sb || !CF) { indispo(); return; }
  sb.auth.getSession().then(function (r) {
    var s = r && r.data && r.data.session; if (!s) { porte(); return; }
    user = s.user;
    sb.from('praticiens').select('*').eq('user_id', user.id).maybeSingle().then(function (x) {
      if (x.error) { if (/relation|does not exist|schema cache|PGRST20/i.test(x.error.message || '')) { indispo(); return; } z.innerHTML = '<p class="pr-vide">Ton cabinet n’a pas pu s’ouvrir. Recharge la page.</p>'; return; }
      if (!x.data) { inscription(); return; }
      prat = x.data; cabinet();
    });
  });
})();
