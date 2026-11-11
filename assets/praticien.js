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
  /* Offre de Noël : tout abonnement pris avant le 31/12/2026 paie 19 € par mois (190 € l'année) et garde ce prix ; ensuite 24 € / 240 € */
  function fondateur() { return !!(prat && (prat.fondateur || new Date() < new Date('2027-01-01T00:00:00+01:00'))); }
  function fait(k) { try { return localStorage.getItem('pr-fait-' + k) === '1'; } catch (e) { return false; } }
  function marquer(k) { try { localStorage.setItem('pr-fait-' + k, '1'); } catch (e) {} }
  function cleAn() { return fondateur() && (window.GENESOLIA_STRIPE || {}).praticienFondateurAn ? 'praticienFondateurAn' : 'praticienAn'; }
  function joursRestants() { return prat ? Math.max(0, Math.ceil((new Date(prat.acces_jusqu) - Date.now()) / 864e5)) : 0; }
  function indispo() { z.innerHTML = '<div class="pr-carte"><h2>L’Espace praticien ouvre très bientôt</h2><p class="pr-aide">Il est en cours de mise en place. Revenez dans quelques jours.</p><a class="btn btn-plein" href="espace-praticien.html">Découvrir l’Espace praticien</a></div>'; }
  function etiq() { return (user && user.user_metadata && user.user_metadata.etiquette_app) || 'Espace praticien'; }
  function majEtiquetteEcran() { var h = document.querySelector('.pro-haut small'); if (h) h.textContent = etiq(); }

  /* ───────── Sans compte ───────── */
  var ICI = /pro\.html$/.test(location.pathname) ? 'pro.html' : 'praticien.html';   /* appli Genesolia Pro ou page du site */
  function porte() {
    z.innerHTML = '<p class="pr-etiq">' + esc(etiq()) + '</p><h1 style="font-size:clamp(1.8rem,4vw,2.4rem)">Votre ' + esc(etiq()) + '</h1>' +
      '<div class="pr-carte"><p class="pr-aide">Créez votre espace (ou connectez-vous), puis ouvrez votre Espace praticien : <b>30 jours offerts, sans carte bancaire</b>. Autant de dossiers client·es que vous voulez, des notes par séance chiffrées, et un lien pour montrer son arbre à votre client·e.</p>' +
      '<div class="pr-nouveau"><a class="btn btn-plein" href="login.html?inscription&amp;retour=' + ICI + '">Commencer mes 30 jours offerts</a><a class="btn btn-trait" href="login.html?retour=' + ICI + '">J’ai déjà un espace</a></div><p class="pr-aide" style="margin:.9rem 0 0">30 jours offerts, sans carte bancaire · puis <b>19 € par mois</b> (offre de Noël, avant le 31 décembre)</p></div>';
    /* Arrivée depuis la page « pub » (lien « Voir la démo ») sans compte : on propose tout de suite le choix arbre/constellation */
    if (location.hash === '#demo') { history.replaceState(null, '', location.pathname + location.search); window.GenesoliaPro.demo(); }
  }

  /* ───────── Ouvrir son cabinet (essai de 30 jours) ───────── */
  function inscription() {
    z.innerHTML = '<p class="pr-etiq">Espace praticien · 30 jours offerts</p><h1 style="font-size:clamp(1.8rem,4vw,2.4rem)">Ouvrez votre Espace praticien</h1>' +
      '<div class="pr-carte"><form class="pr-form" id="pr-ins" novalidate>' +
      '<label>Le nom de votre activité<input type="text" name="cabinet" maxlength="80" autocomplete="organization" placeholder="Claire Martin, psychogénéalogie"></label>' +
      '<div class="pr-deux"><label>Votre pratique <small>(facultatif)</small><select name="pratique"><option value="">Choisissez…</option><option>Psychogénéalogiste</option><option>Praticien·ne en relation d’aide</option><option>Coach</option><option>Sophrologue</option><option>Hypnose</option><option>Astrologue ou numérologue</option><option>Autre</option></select></label>' +
      '<label>Votre ville <small>(facultatif)</small><input type="text" name="ville" maxlength="80" autocomplete="address-level2"></label></div>' +
      '<label class="pr-case"><input type="checkbox" name="cgu"> <span>J’accepte les <a href="conditions-praticien.html" target="_blank" rel="noopener">conditions de l’Espace praticien</a> et l’<a href="accord-sous-traitance.html" target="_blank" rel="noopener">accord de sous-traitance des données (RGPD)</a> : je l’utilise pour mon activité d’accompagnement, j’informe mes client·es et je recueille leur accord avant de créer leur dossier, et je n’y note pas d’informations médicales (diagnostics, traitements).</span></label>' +
      '<label class="pr-case"><input type="checkbox" name="coffre"' + (CF && CF.accord(user) ? ' checked disabled' : '') + '> <span>J’accepte que mes notes de séance soient gardées dans mon Espace praticien, <b>chiffrées</b> : elles ne s’ouvrent que depuis mon compte.</span></label>' +
      '<p class="pr-err" id="pr-err" role="alert"></p><div><button class="btn btn-plein" type="submit">Commencer mes 30 jours offerts</button></div>' +
      '<p class="pr-aide" style="margin:0">Sans carte bancaire. Ensuite : 24 € par mois sans engagement, ou 240 € l’année. <b>Offre de Noël : 19 € par mois ou 190 € l’année</b> pour tout abonnement pris avant le 31 décembre, garanti tant que votre abonnement continue. <span style="white-space:nowrap">TVA non applicable, art. 293 B du CGI.</span></p></form></div>';
    var f = document.getElementById('pr-ins'), err = document.getElementById('pr-err');
    f.addEventListener('submit', function (e) {
      e.preventDefault(); err.textContent = '';
      var cab = f.cabinet.value.trim();
      if (!cab) { err.textContent = 'Indiquez le nom de votre activité.'; f.cabinet.focus(); return; }
      if (!f.cgu.checked) { err.textContent = 'Cochez la case sur l’usage de l’Espace praticien.'; return; }
      if (!f.coffre.checked) { err.textContent = 'Cochez la case pour garder vos notes de séance, chiffrées.'; return; }
      var bt = f.querySelector('button'); bt.disabled = true; bt.textContent = 'Un instant…';
      var meta = {}; if (f.pratique.value) meta.pratique = f.pratique.value; if (f.ville.value.trim()) meta.ville = f.ville.value.trim().slice(0, 80);   /* pour l'annuaire, plus tard */
      if (!(CF && CF.accord(user))) meta.coffre_accord = new Date().toISOString();
      meta.praticien_dpa = DPA_VERSION + ' ' + new Date().toISOString();   /* accord de sous-traitance accepté (version et date) */
      var accord = !Object.keys(meta).length ? Promise.resolve() : sb.auth.updateUser({ data: meta }).then(function (r) { if (r && r.data && r.data.user) user = r.data.user; });
      accord.then(function () { return sb.rpc('praticien_commencer', { p_cabinet: cab }); }).then(function (r) {
        if (r.error) { if (/function|does not exist|schema cache|PGRST20/i.test(r.error.message || '')) { indispo(); return; } throw r.error; }
        prat = r.data; cabinet();
      }).catch(function () { bt.disabled = false; bt.textContent = 'Commencer mes 30 jours'; err.textContent = 'L’ouverture n’a pas abouti. Réessayez dans un instant.'; });
    });
  }

  /* ───────── Le cabinet ───────── */
  function etat() {
    if (!actif()) return '<span class="pr-etat fini">' + (prat.formule === 'essai' ? 'Votre essai est terminé' : 'Votre abonnement est arrêté') + ' · vos dossiers restent consultables</span>';
    if (prat.formule === 'essai') return '<span class="pr-etat">Essai · encore <b>' + joursRestants() + ' jour' + (joursRestants() > 1 ? 's' : '') + '</b></span>';
    return '<span class="pr-etat">Abonnement actif jusqu’au ' + date(prat.acces_jusqu) + '</span>';
  }
  /* Accord de sous-traitance (RGPD) : version en vigueur ; un compte qui ne l'a pas encore accepté le voit en haut de son cabinet */
  var DPA_VERSION = '2026-10-31';
  function dpaAccepte() { var v = user && user.user_metadata && user.user_metadata.praticien_dpa; return !!v && v.indexOf(DPA_VERSION) === 0; }
  function carteDpa() {
    if (dpaAccepte()) return '';
    return '<div class="pr-carte" id="pr-dpa" style="border:2px solid #B0507A"><h2>Les données de vos client·es</h2><p class="pr-aide">Pour les dossiers de vos client·es, vous êtes responsable de traitement et Genesolia votre sous-traitant. Lisez et acceptez l’accord qui encadre cela (RGPD, article 28) : où sont hébergées les données, qui y accède, ce qui se passe en cas d’incident et à la fin de votre abonnement.</p>' +
      '<p style="display:flex;flex-wrap:wrap;gap:.6rem;align-items:center"><a class="btn btn-trait" href="accord-sous-traitance.html" target="_blank" rel="noopener">Lire l’accord</a><button class="btn btn-plein" type="button" data-dpa-ok>J’accepte l’accord de sous-traitance</button></p><p class="pr-aide" data-dpa-msg role="status" style="margin:0"></p></div>';
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-dpa-ok]'); if (!b || !sb) return;
    b.disabled = true;
    sb.auth.updateUser({ data: { praticien_dpa: DPA_VERSION + ' ' + new Date().toISOString() } }).then(function (r) {
      var m = document.querySelector('[data-dpa-msg]');
      if (r && r.error) { b.disabled = false; if (m) m.textContent = 'Pas enregistré. Réessayez dans un instant.'; return; }
      if (r && r.data && r.data.user) user = r.data.user;
      var c = document.getElementById('pr-dpa'); if (c) c.outerHTML = '<p class="pr-aide" style="margin:0 0 1rem">Merci, l’accord est accepté. Vous le retrouvez à tout moment en bas de votre espace.</p>';
    });
  });
  function cabinet() {
    var essai = (actif() && prat.formule === 'essai' ? '<div class="pr-carte' + (joursRestants() <= 5 ? ' pr-fin-essai' : '') + '"><h2>' + (joursRestants() <= 5 ? 'Plus que ' + joursRestants() + ' jour' + (joursRestants() > 1 ? 's' : '') + ' d’essai' : 'Après votre essai') + '</h2><p class="pr-aide">Pour garder la création de dossiers, les partages et les rapports à votre nom : ' + (fondateur() ? '<b>votre offre de Noël : 19 € par mois au lieu de 24 €, ou 190 € l’année au lieu de 240 €</b>, garanti tant que votre abonnement continue' : '24 € par mois sans engagement, ou 240 € l’année') + '. Vos dossiers restent à vous dans tous les cas. Abonnez-vous quand vous voulez avant la fin : votre Espace praticien continue sans coupure. <span style="white-space:nowrap">TVA non applicable, art. 293 B du CGI.</span></p><label class="pr-case pr-cgv" style="font-size:.9rem;margin:.6rem 0"><input type="checkbox" data-cgv> <span>J’accepte les <a href="conditions-praticien.html" target="_blank">conditions de l’Espace praticien (CGV)</a> et l’<a href="accord-sous-traitance.html" target="_blank">accord de sous-traitance</a>.</span></label><button class="btn btn-plein" type="button" disabled data-payer="' + (fondateur() ? 'praticienFondateur' : 'praticienMois') + '" data-bientot-texte="Bientôt disponible. Vos dossiers restent consultables en attendant.">' + (fondateur() ? '19 € par mois' : '24 € par mois') + '</button> <button class="btn btn-trait" type="button" disabled data-payer="' + cleAn() + '" data-bientot-texte="Bientôt disponible. Vos dossiers restent consultables en attendant.">' + (cleAn() === 'praticienFondateurAn' ? '190 € l’année' : '240 € l’année') + '</button><p class="pr-aide" data-bientot-msg style="margin-top:.6rem"></p></div>' : '');
    majEtiquetteEcran();
    z.innerHTML = '<div class="pr-tete"><div><p class="pr-etiq">' + esc(etiq()) + '</p><h1>' + esc(prat.cabinet) + '</h1></div>' + etat() + '</div>' + carteDpa() +
      '<div id="pr-panneau-dossiers"><div class="pr-grille"><section class="pr-carte" aria-labelledby="pr-dos-t"><h2 id="pr-dos-t">Mes dossiers client·es</h2>' +
      (actif() ? '<form class="pr-nouveau" id="pr-nouv" style="flex-direction:column;flex-wrap:nowrap;align-items:stretch"><div style="display:flex;flex-wrap:wrap;gap:.6rem"><input type="text" name="nom" maxlength="60" placeholder="Prénom ou initiales du·de la client·e" aria-label="Prénom ou initiales du client"><button class="btn btn-plein" type="submit">Nouveau dossier</button></div><label class="pr-case" style="font-size:.9rem"><input type="checkbox" name="accord"> <span>Mon·ma client·e est d’accord pour que je crée son dossier et que j’y note son histoire familiale, y compris des informations sensibles (deuils, naissances, secrets de famille).</span></label><p class="pr-err" id="pr-nouv-err" role="alert"></p></form>' : '') +
      '<div class="pr-sondage" id="pr-sondage" hidden></div>' +
      '<p class="pr-aide">Un dossier = un arbre. Pour la confidentialité, préférez le prénom ou les initiales.</p><div class="pr-onglets" id="pr-onglets" role="tablist" aria-label="Filtrer les dossiers"><button type="button" class="pr-onglet actif" data-type-filtre="tous">Tous</button><button type="button" class="pr-onglet" data-type-filtre="constellation">Avec plateau constellation</button></div><div class="pr-filtre" id="pr-filtre" hidden><input type="search" id="pr-cherche" placeholder="Rechercher un dossier" aria-label="Rechercher un dossier" autocomplete="off"><select id="pr-tri" aria-label="Trier les dossiers"><option value="maj">Modifiés récemment</option><option value="nom">Nom, de A à Z</option><option value="ancien">Les moins récents</option></select></div><div class="pr-liste" id="pr-liste"><p class="pr-vide">Chargement…</p></div><div id="pr-perso" style="margin-top:1rem"></div></section>' +
      '<aside><div id="pr-debut"></div></aside></div></div>' +
      '<div id="pr-panneau-activite" hidden>' +
      (!actif() ? '<div class="pr-carte"><h2>Continuer avec l’Espace praticien</h2><p class="pr-aide">24 € par mois sans engagement, ou 240 € l’année' + (fondateur() ? ' (offre de Noël avant le 31 décembre : 19 € par mois, ou 190 € l’année)' : '') + '. Vous retrouvez la création de dossiers, les partages et les rapports à votre nom. <span style="white-space:nowrap">TVA non applicable, art. 293 B du CGI.</span></p><label class="pr-case pr-cgv" style="font-size:.9rem;margin:.6rem 0"><input type="checkbox" data-cgv> <span>J’accepte les <a href="conditions-praticien.html" target="_blank">conditions de l’Espace praticien (CGV)</a> et l’<a href="accord-sous-traitance.html" target="_blank">accord de sous-traitance</a>.</span></label><button class="btn btn-plein" type="button" disabled data-payer="' + (fondateur() ? 'praticienFondateur' : 'praticienMois') + '" data-bientot-texte="Bientôt disponible. Vos dossiers restent consultables en attendant.">' + (fondateur() ? '19 € par mois' : '24 € par mois') + '</button> <button class="btn btn-trait" type="button" disabled data-payer="' + cleAn() + '" data-bientot-texte="Bientôt disponible. Vos dossiers restent consultables en attendant.">' + (cleAn() === 'praticienFondateurAn' ? '190 € l’année' : '240 € l’année') + '</button><p class="pr-aide" data-bientot-msg style="margin-top:.6rem"></p></div>' : '') +
      essai +
      '<section class="pr-carte"><h2>Mon activité</h2><form class="pr-form" id="pr-cab"><label>Nom de votre activité<input type="text" name="cabinet" maxlength="80" autocomplete="off" value="' + esc(prat.cabinet || '') + '"></label><label>Nom affiché en haut de l’appli <small>(remplace « Espace praticien »)</small><input type="text" name="etiquette" maxlength="40" autocomplete="off" placeholder="Espace praticien" value="' + esc(user.user_metadata && user.user_metadata.etiquette_app || '') + '"></label><p class="pr-aide" style="margin:0">C’est le nom qui apparaît en haut de vos rapports et de vos liens de partage.</p><p class="pr-err" id="pr-cab-msg" role="status"></p><div><button class="btn btn-trait" type="submit">Enregistrer</button></div></form></section>' +
      (appliInstallee() ? '' : '<section class="pr-carte pr-appli"><h2>L’appli sur votre téléphone</h2><p class="pr-aide">Installez Genesolia Pro sur votre écran d’accueil : vos dossiers, le mode séance et vos notes s’ouvrent d’un geste, comme une vraie appli. Gratuit, 30 secondes.</p><button class="btn btn-plein" type="button" data-pro-installer>Installer l’appli Genesolia Pro</button></section>') +
      '<section class="pr-carte" id="pr-annuaire-carte"><h2>Ma fiche dans l’annuaire</h2><div id="pr-annuaire"><p class="pr-aide">Chargement…</p></div></section>' +
      '<section class="pr-carte"><h2>Connexion en deux étapes</h2><div id="pr-deux-etapes"><p class="pr-aide">Chargement…</p></div></section>' +
      '<section class="pr-carte"><h2>Bon à savoir</h2><p class="pr-aide">Vos notes de séance sont chiffrées dans votre Espace praticien. Le lien de partage montre l’arbre à votre client·e, <b>sans vos notes</b>. Il reste valable 14 jours, vous choisissez ce qu’il montre et vous pouvez le désactiver à tout moment.</p><p class="pr-aide">Vos notes de séance vous appartiennent : elles ne sont jamais copiées dans l’espace de votre client·e. S’il ou elle vous demande ce que vous avez noté, vous pouvez les exporter en PDF depuis « Notes de séance ».</p><p class="pr-aide" style="margin:0">Pas de diagnostics ni de traitements dans les dossiers. Un·e client·e vous demande d’effacer son dossier ? Utilisez le bouton « Supprimer » de ce dossier, dans la liste.</p><p class="pr-aide" style="margin:.8rem 0 0">Depuis chaque dossier ouvert, vous pouvez aussi commander l’arbre imprimé de votre client·e : un poster livré chez lui ou chez elle, ' + ((window.GENESOLIA_IMPRESSION && GENESOLIA_IMPRESSION.formats && GENESOLIA_IMPRESSION.formats[0]) ? 'dès ' + GENESOLIA_IMPRESSION.formats[0].prix + ', livraison comprise' : 'livraison comprise') + '. Un beau cadeau de fin d’accompagnement à glisser dans votre offre. <a href="boutique.html">Voir les formats et les prix</a></p><p class="pr-aide" style="margin:.8rem 0 0">Une question sur un écran ? <a href="mode-emploi-genesolia-pro.html?appli=pro">Mode d’emploi</a>, pas à pas.</p></section>' +
      '<section class="pr-carte"><h2>Votre espace</h2><p class="pr-aide" style="margin:0 0 .6rem">Vous avez aussi un espace Genesolia personnel, avec le même compte : vos propres protocoles et exercices, séparés de votre activité de praticien·ne.</p><div style="display:flex;flex-wrap:wrap;gap:.6rem"><a class="btn btn-trait" href="login.html">Aller à mon espace Genesolia</a><button class="btn btn-trait" type="button" data-pr-fermer>Me déconnecter</button></div></section></div>';
    var ic = document.querySelector('#pr-cab input[name=cabinet]'); if (ic && !ic.value) ic.value = prat.cabinet || '';   /* certains navigateurs vident le champ en restaurant la page */
    if (window.GenesoliaDeuxEtapes) window.GenesoliaDeuxEtapes.reglage(sb, document.getElementById('pr-deux-etapes'));
    if (window.GenesoliaAnnuaire) window.GenesoliaAnnuaire.fiche(sb, user, prat, document.getElementById('pr-annuaire'), actif());
    /* Arrivée depuis la barre du bas d'un dossier (plateau, arbre) via #demo ou #activite : ouvrir directement le bon écran */
    if (location.hash === '#activite') { panneau('activite'); history.replaceState(null, '', location.pathname + location.search); }
    else { panneau(PANNEAU_ACTUEL); if (location.hash === '#demo') { history.replaceState(null, '', location.pathname + location.search); window.GenesoliaPro.demo(); } }
    chargerDossiers();
    sondage();
  }
  var PANNEAU_ACTUEL = 'dossiers';
  function panneau(nom) {
    PANNEAU_ACTUEL = nom;
    var pd = document.getElementById('pr-panneau-dossiers'), pa = document.getElementById('pr-panneau-activite');
    if (pd) pd.hidden = nom !== 'dossiers';
    if (pa) pa.hidden = nom !== 'activite';
    document.querySelectorAll('.pro-bas a[data-pro]').forEach(function (a) { a.classList.toggle('actif', a.getAttribute('data-pro') === nom); });
  }
  window.GenesoliaProPanneau = panneau;
  function choisirDossier(titre, cb) {
    if (!window.GenesoliaPratique) return;
    if (!dossiers.length) { window.GenesoliaPratique.fenetre('<h2>' + esc(titre) + '</h2><p class="pr-o-aide">Vous n’avez pas encore de dossier. Créez-en un d’abord depuis « Dossiers ».</p>'); return; }
    var f = window.GenesoliaPratique.fenetre('<h2>' + esc(titre) + '</h2><p class="pr-o-aide">Quel dossier ?</p><div class="pr-liste" style="gap:.5rem">' + dossiers.slice().sort(function (a, b) { return a.nom < b.nom ? -1 : 1; }).map(function (d) { return '<button type="button" class="btn btn-trait" style="width:100%;text-align:left;justify-content:flex-start" data-choix-dossier="' + esc(d.id) + '">' + esc(d.nom || 'Sans nom') + '</button>'; }).join('') + '</div>');
    f.addEventListener('click', function (e) { var b = e.target.closest('[data-choix-dossier]'); if (!b) return; var d = dossier(b.getAttribute('data-choix-dossier')); f.remove(); if (d) cb(d); });
  }
  /* Petit sondage : l'arbre dessiné à partir des notes intéresserait-il ? Une seule réponse par praticien·ne (modifiable), table sondage_praticiens */
  var SONDAGE = 'arbre-notes-ia';
  function sondage() {
    var z = document.getElementById('pr-sondage'); if (!z) return;
    sb.from('sondage_praticiens').select('reponse').eq('question', SONDAGE).maybeSingle().then(function (r) {
      if (r && r.error) return;   /* table absente ou hors ligne : on n'affiche rien */
      if (r && r.data) { z.innerHTML = '<p class="pr-aide" style="margin:0">Merci pour votre réponse sur l’arbre dessiné à partir de vos notes.</p>'; z.hidden = false; return; }
      z.innerHTML = '<form id="pr-sond-f"><p class="pr-sond-q"><b>Votre avis compte.</b> Une option pour dessiner l’arbre directement à partir de vos notes de séance (vous collez vos notes, l’arbre se dessine en brouillon et vous validez chaque personne) vous intéresserait-elle ? <i>(Option réservée aux abonné·es, non comprise dans l’essai gratuit.)</i></p>' +
        '<div class="pr-sond-choix"><label><input type="radio" name="rep" value="oui" required> Oui</label><label><input type="radio" name="rep" value="non"> Non</label></div>' +
        '<textarea name="note" maxlength="1000" rows="2" placeholder="Ce que vous en attendriez, ou pourquoi pas (facultatif)" aria-label="Votre remarque (facultatif)"></textarea>' +
        '<div class="pr-sond-bas"><button class="btn btn-trait" type="submit">Envoyer mon avis</button><small data-sond-msg></small></div></form>';
      z.hidden = false;
      document.getElementById('pr-sond-f').addEventListener('submit', function (e) {
        e.preventDefault();
        var f = e.target, rep = f.querySelector('input[name=rep]:checked'), m = f.querySelector('[data-sond-msg]'), b = f.querySelector('button');
        if (!rep) { m.textContent = 'Choisissez oui ou non.'; return; }
        b.disabled = true; m.textContent = '';
        sb.from('sondage_praticiens').upsert({ user_id: user.id, question: SONDAGE, reponse: rep.value, note: (f.note.value || '').trim().slice(0, 1000) || null }).then(function (r) {
          if (r && r.error) { b.disabled = false; m.textContent = 'Pas enregistré. Réessayez dans un instant.'; return; }
          z.innerHTML = '<p class="pr-aide" style="margin:0">Merci, votre réponse est bien reçue.</p>';
        });
      });
    });
  }
  function chargerDossiers() {
    sb.from('arbres_supp').select('id,nom,data,maj,remise_autorisee').eq('user_id', user.id).order('maj', { ascending: false }).then(function (r) {
      var l = document.getElementById('pr-liste'); if (!l) return;
      if (r.error) { l.innerHTML = '<p class="pr-vide">Vos dossiers n’ont pas pu être chargés. Rechargez la page dans un instant.</p>'; return; }
      var tous = r.data || [];
      dossiers = tous.filter(function (d) { return d.data && d.data.dossier === 'client'; });
      var perso = tous.filter(function (d) { return !(d.data && d.data.dossier === 'client'); });
      var zp = document.getElementById('pr-perso');
      if (zp) zp.innerHTML = perso.length ? '<details><summary>Mes arbres personnels (' + perso.length + ')</summary><p class="pr-aide">Ils ne sont pas comptés comme dossiers client·es. Si l’un d’eux est en fait le dossier d’un·e client·e, déplacez-le ici.</p>' + perso.map(function (d) { return '<div class="pr-dossier"><div><b>' + esc(d.nom || 'Sans nom') + '</b></div><div class="pr-actions"><a class="btn btn-trait" href="genosociogramme.html?arbre=' + esc(d.id) + '">Ouvrir</a><button class="pr-lien" type="button" data-vers-client="' + esc(d.id) + '">C’est un dossier client·e</button></div></div>'; }).join('') + '</details>' : '';
      zp && (window.__persoPr = perso);
      debut();
      RECUES = null;
      if (!dossiers.length) { l.innerHTML = '<p class="pr-vide">Aucun dossier pour l’instant. Créez le premier avec le prénom ou les initiales de votre client·e.</p>' + (actif() ? '<div class="pr-exemple"><p><b>Envie d’essayer d’abord ?</b> Ouvrez un dossier exemple déjà rempli, avec une famille fictive : vous verrez les répétitions ressortir tout de suite.</p><button class="btn btn-trait" type="button" data-exemple>Ouvrir un dossier exemple</button></div>' : ''); return; }
      rendreDossiers();
    });
  }
  /* La liste des dossiers, avec la recherche et le tri (dès 4 dossiers) */
  var FILTRE = { q: '', tri: 'maj', type: 'tous' };
  var DERNIER_CREE = null;   /* id du dossier qu'on vient de créer : surligné en doré jusqu'à l'ouverture d'un autre dossier */
  function rendreDossiers() {
    var l = document.getElementById('pr-liste'); if (!l) return;
    var zf = document.getElementById('pr-filtre'); if (zf) zf.hidden = dossiers.length < 4;
    var q = FILTRE.q.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    var vus = dossiers.filter(function (d) { var okQ = !q || String(d.nom || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').indexOf(q) >= 0; var okType = FILTRE.type === 'tous' || !!(d.data && d.data.constellation); return okQ && okType; });
    vus.sort(function (a, b) { return FILTRE.tri === 'nom' ? String(a.nom || '').localeCompare(String(b.nom || ''), 'fr') : FILTRE.tri === 'ancien' ? (a.maj < b.maj ? -1 : 1) : (a.maj < b.maj ? 1 : -1); });
    var aExemple = dossiers.some(function (d) { return /^(Exemple|Démo)/.test(d.nom || ''); });
    l.innerHTML = (vus.length ? '' : '<p class="pr-vide">Aucun dossier ne correspond à « ' + esc(FILTRE.q) + ' ».</p>') + vus.map(function (d) {
      var n = d.data && d.data.people ? Object.keys(d.data.people).length : 0;
      var constel = !!(d.data && d.data.constellation);
      var neuf = d.id === DERNIER_CREE;
      return '<div class="pr-dossier' + (neuf ? ' pr-dossier-neuf' : '') + '"><div><b>' + esc(d.nom || 'Sans nom') + '</b>' + (neuf ? ' <span class="pr-badge-neuf">Nouveau</span>' : '') + '<small>' + n + ' personne' + (n > 1 ? 's' : '') + (constel ? ' <span class="pr-badge">Constellation familiale</span>' : '') + (d.maj ? ' · modifié le ' + date(d.maj) : '') + '</small></div><div class="pr-actions">' +
        (constel
          ? '<a class="btn btn-plein" href="plateau-visio.html?arbre=' + esc(d.id) + '">Ouvrir le plateau pour la séance</a>'
          : '<a class="btn btn-plein" href="genosociogramme.html?arbre=' + esc(d.id) + '">Ouvrir</a>') +
        '<a class="btn btn-trait" href="genosociogramme.html?arbre=' + esc(d.id) + '&amp;seance">Mode séance</a>' +
        '<button class="btn btn-trait" type="button" data-partager="' + esc(d.id) + '">Partager</button>' +
        '<details class="pr-menu"><summary aria-label="Plus d’actions pour ce dossier" title="Plus d’actions">⋯</summary><div class="pr-menu-panel">' +
        (constel ? '<a class="pr-lien" href="genosociogramme.html?arbre=' + esc(d.id) + '">Génosociogramme</a>' : '<button class="pr-lien" type="button" data-activer-plateau="' + esc(d.id) + '">+ Constellation</button>') +
        '<a class="pr-lien" href="genosociogramme.html?arbre=' + esc(d.id) + '&amp;rapport">Rapport PDF</a>' +
        '<button class="pr-lien" type="button" data-notes="' + esc(d.id) + '">Notes de séance</button>' +
        '<button class="pr-lien" type="button" data-bilan="' + esc(d.id) + '">Bilan de suivi</button>' +
        '<button class="pr-lien" type="button" data-questionnaire="' + esc(d.id) + '">Questionnaire</button>' +
        '<button class="pr-lien" type="button" data-deontologie="' + esc(d.id) + '">Déontologie</button>' +
        '<button class="pr-lien" type="button" data-renommer="' + esc(d.id) + '">Renommer</button>' +
        '<button class="pr-lien pr-danger" type="button" data-supprimer="' + esc(d.id) + '">Supprimer</button>' +
        '</div></details></div>' +
        '<div class="pr-remise"><label><input type="checkbox" data-remise="' + esc(d.id) + '"' + (d.remise_autorisee ? ' checked' : '') + '> <span>Travail terminé : mon·ma client·e peut télécharger et garder son arbre</span></label>' +
        '<details class="pr-info"><summary aria-label="En savoir plus sur « Travail terminé »" title="En savoir plus">?</summary><p class="pr-aide">Une fois la case cochée, votre client·e peut télécharger son arbre depuis le lien de partage et le garder dans son propre espace. Avant, rien ne peut être téléchargé ni imprimé. Vos notes ne sont jamais partagées.</p></details><p class="pr-aide" data-remise-msg="' + esc(d.id) + '" role="status"></p></div></div>';
    }).join('') + (actif() && !aExemple ? '<div class="pr-exemple"><p><b>Un dossier exemple pour tout essayer :</b> une famille fictive déjà remplie, pour voir les répétitions, le mode séance et le rapport sans toucher à vos vrais dossiers.</p><button class="btn btn-trait" type="button" data-exemple>Ouvrir le dossier exemple</button></div>' : '');
    reponsesRecues();
  }
  /* Questionnaires remplis, pas encore ajoutés à l'arbre : le bouton du dossier le signale */
  var RECUES = null;
  function reponsesRecues() {
    (RECUES ? Promise.resolve({ data: RECUES }) : sb.from('questionnaires_client').select('arbre_id').not('rempli_le', 'is', null).is('importe_le', null)).then(function (r) {
      if (r.error || !r.data) return;
      RECUES = r.data;
      r.data.forEach(function (q) {
        var b = z.querySelector('[data-questionnaire="' + q.arbre_id + '"]'); if (!b) return;
        b.classList.add('pr-signal'); b.textContent = 'Réponses reçues';
        var menu = b.closest('.pr-menu'); if (menu) { var s = menu.querySelector('summary'); if (s) s.classList.add('pr-signal-point'); }
      });
    });
  }
  /* « Pour bien commencer » : 4 étapes, cochées au fil de l'usage (rien n'est envoyé, tout reste sur cet appareil) */
  function debut() {
    var zd = document.getElementById('pr-debut'); if (!zd) return;
    var et = [['Créer un premier dossier', dossiers.length > 0], ['Ouvrir le mode séance', fait('seance')], ['Générer un rapport', fait('rapport')], ['Envoyer un lien de partage', fait('partage')]];
    var n = et.filter(function (x) { return x[1]; }).length;
    if (n === et.length || fait('debut-masque')) { zd.innerHTML = ''; return; }
    zd.innerHTML = '<section class="pr-carte pr-debut"><h2>Pour bien commencer <small style="white-space:nowrap">' + n + ' sur ' + et.length + '</small></h2><ol>' + et.map(function (x) { return '<li' + (x[1] ? ' class="ok"' : '') + '><span aria-hidden="true"></span>' + x[0] + (x[1] ? '<span class="sr"> (fait)</span>' : '') + '</li>'; }).join('') + '</ol>' +
      '<p class="pr-aide" style="margin:0">Le mode séance, le rapport et le partage sont sur chaque dossier, et dans la barre du dossier ouvert. <button class="pr-lien" type="button" data-debut-masquer>Masquer</button></p></section>';
  }
  function dossierExemple(bt) {
    bt.disabled = true; bt.textContent = 'Un instant…';
    fetch('assets/exemple-genosociogramme.json').then(function (r) { return r.json(); }).then(function (ex) {
      ex.dossier = 'client';
      return sb.from('arbres_supp').insert({ user_id: user.id, nom: 'Démo · famille de Léa (fictive)', data: ex }).select('id').single();
    }).then(function (r) {
      if (r.error) throw r.error;
      location.href = 'genosociogramme.html?arbre=' + encodeURIComponent(r.data.id);
    }).catch(function () { bt.disabled = false; bt.textContent = 'Ouvrir un dossier exemple'; alert('Le dossier exemple n’a pas pu être créé. Réessayez dans un instant.'); });
  }
  function dossier(id) { return dossiers.filter(function (d) { return d.id === id; })[0]; }

  /* ───────── Notes par séance et partage : assets/praticien-outils.js (mêmes outils que dans le dossier ouvert) ───────── */
  var PO = window.GenesoliaPratique;
  function notes(id) { var d = dossier(id); PO.notes({ sb: sb, user: user, id: id, nom: d ? d.nom : '', cabinet: prat && prat.cabinet }); }
  function partager(id) { var d = dossier(id); PO.partager({ sb: sb, user: user, id: id, nom: d ? d.nom : '', actif: actif(), remise: !!(d && d.remise_autorisee) }).addEventListener('click', function () { setTimeout(debut, 50); }); }
  function bilan(id) { var d = dossier(id); PO.bilan({ sb: sb, user: user, id: id, nom: d ? d.nom : '', cabinet: prat && prat.cabinet }); }
  function deontologie(id) { var d = dossier(id); if (!PO || !PO.deontologie) { alert('Le document n’a pas pu s’ouvrir. Rechargez la page et réessayez.'); return; } PO.deontologie({ sb: sb, user: user, id: id, nom: d ? d.nom : '', cabinet: prat && prat.cabinet }); }

  /* ───────── Remise de l'arbre au·à la client·e (case par dossier) ───────── */
  document.addEventListener('change', function (e) {
    var c = e.target.closest && e.target.closest('[data-remise]'); if (!c) return;
    var id = c.getAttribute('data-remise'), v = c.checked, m = z.querySelector('[data-remise-msg="' + id + '"]');
    c.disabled = true;
    sb.from('arbres_supp').update({ remise_autorisee: v }).eq('id', id).then(function (r) {
      c.disabled = false;
      if (r.error) { c.checked = !v; if (m) m.textContent = 'Pas enregistré. Réessayez.'; return; }
      var d = dossier(id); if (d) d.remise_autorisee = v;
      if (m) m.textContent = v ? 'Enregistré. Envoyez un lien de partage : votre client·e y trouvera les boutons pour télécharger et garder son arbre.' : 'Enregistré. Ce que votre client·e a déjà gardé reste dans son espace.';
    });
  });

  document.addEventListener('input', function (e) { if (e.target.id === 'pr-cherche') { FILTRE.q = e.target.value; rendreDossiers(); } });
  document.addEventListener('click', function (e) { var b = e.target.closest('[data-type-filtre]'); if (!b) return; FILTRE.type = b.getAttribute('data-type-filtre'); document.querySelectorAll('.pr-onglet').forEach(function (x) { x.classList.toggle('actif', x === b); }); rendreDossiers(); });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-activer-plateau]'); if (!b) return;
    var id = b.getAttribute('data-activer-plateau'), d = dossier(id); if (!d) return;
    b.disabled = true;
    sb.from('arbres_supp').update({ data: Object.assign({}, d.data || {}, { constellation: true }) }).eq('id', id).then(function (r) {
      if (r && r.error) { b.disabled = false; alert('Ça n’a pas abouti. Réessayez.'); return; }
      location.href = 'plateau-visio.html?arbre=' + encodeURIComponent(id);
    });
  });
  document.addEventListener('change', function (e) { if (e.target.id === 'pr-tri') { FILTRE.tri = e.target.value; rendreDossiers(); } });

  function appliInstallee() { try { return (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true; } catch (e) { return false; } }
  document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('[data-pro-installer]') && window.GenesoliaInstaller) window.GenesoliaInstaller.ouvrir(); });
  document.addEventListener('click', function (e) {
    if (!e.target.closest || !e.target.closest('[data-pr-fermer]')) return;
    if (!confirm('Vous déconnecter et revenir au site Genesolia ?')) return;
    var fin = function () { location.href = 'index.html'; };
    sb.auth.signOut().then(fin, fin);
  });

  /* ───────── Événements ───────── */
  document.addEventListener('submit', function (e) {
    if (e.target.id === 'pr-nouv') {
      e.preventDefault(); var nom = e.target.nom.value.trim(), er = document.getElementById('pr-nouv-err'); if (!nom) { e.target.nom.focus(); return; }
      if (!e.target.accord.checked) { if (er) er.textContent = 'Cochez la case : l’accord de votre client·e est nécessaire pour créer son dossier.'; return; }
      if (er) er.textContent = '';
      var bt = e.target.querySelector('button'); bt.disabled = true;
      sb.from('arbres_supp').insert({ user_id: user.id, nom: nom.slice(0, 60), data: { people: {}, rels: [], nid: 1, v: 2, dossier: 'client', accord_client: new Date().toISOString() } }).select('id').single().then(function (r) {
        bt.disabled = false;
        if (r.error) { alert('Le dossier n’a pas pu être créé. Réessayez dans un instant.'); return; }
        DERNIER_CREE = r.data.id;
        e.target.reset();
        chargerDossiers();
      });
    }
    if (e.target.id === 'pr-cab') {
      e.preventDefault(); var c = e.target.cabinet.value.trim(), etq = (e.target.etiquette ? e.target.etiquette.value.trim() : '').slice(0, 40), m = document.getElementById('pr-cab-msg'); if (!c) return;
      sb.from('praticiens').update({ cabinet: c.slice(0, 80) }).eq('user_id', user.id).then(function (r) {
        if (r.error) { m.textContent = 'Pas enregistré. Réessayez.'; return; }
        prat.cabinet = c;
        var maj = etq ? sb.auth.updateUser({ data: { etiquette_app: etq } }) : Promise.resolve();
        maj.then(function (ur) { if (ur && ur.data && ur.data.user) user = ur.data.user; cabinet(); });
      });
    }
  });
  document.addEventListener('click', function (e) {
    var b;
    if ((b = e.target.closest('[data-notes]'))) notes(b.getAttribute('data-notes'));
    else if ((b = e.target.closest('[data-bilan]'))) bilan(b.getAttribute('data-bilan'));
    else if ((b = e.target.closest('[data-deontologie]'))) deontologie(b.getAttribute('data-deontologie'));
    else if ((b = e.target.closest('[data-partager]'))) partager(b.getAttribute('data-partager'));
    else if ((b = e.target.closest('[data-questionnaire]'))) {
      var dq = dossier(b.getAttribute('data-questionnaire'));
      if (!dq || !PO || !PO.questionnaire) { alert('Le questionnaire n’a pas pu s’ouvrir. Rechargez la page et réessayez.'); return; }
      PO.questionnaire({ sb: sb, user: user, id: dq.id, nom: dq.nom, actif: actif() });
    }
    else if ((b = e.target.closest('[data-exemple]'))) dossierExemple(b);
    else if ((b = e.target.closest('[data-debut-masquer]'))) { marquer('debut-masque'); debut(); }
    else if ((b = e.target.closest('[data-renommer]'))) {
      var d = dossier(b.getAttribute('data-renommer')); if (!d || !window.GenesoliaPratique) return;
      var menuR = b.closest('.pr-menu'); if (menuR) menuR.open = false;
      var fr = window.GenesoliaPratique.fenetre('<h2>Renommer le dossier</h2><form class="pr-o-form" data-renommer-form><label>Nom du dossier<input type="text" name="nom" maxlength="60" value="' + esc(d.nom || '') + '"></label><p class="pr-o-msg" data-renommer-msg role="status"></p><div class="pr-o-boutons"><button class="btn btn-plein bt plein" type="submit">Enregistrer</button></div></form>');
      var frm = fr.querySelector('[data-renommer-form]'); setTimeout(function () { frm.nom.focus(); frm.nom.select(); }, 30);
      frm.addEventListener('submit', function (ev) {
        ev.preventDefault(); var n = frm.nom.value.trim(); if (!n) return;
        sb.from('arbres_supp').update({ nom: n.slice(0, 60) }).eq('id', d.id).then(function (r) {
          if (r.error) { fr.querySelector('[data-renommer-msg]').textContent = 'Pas enregistré. Réessayez.'; return; }
          fr.remove(); chargerDossiers();
        });
      });
    } else if ((b = e.target.closest('[data-supprimer]'))) {
      var d2 = dossier(b.getAttribute('data-supprimer')); if (!d2 || !window.GenesoliaPratique) return;
      var menuS = b.closest('.pr-menu'); if (menuS) menuS.open = false;
      var fs = window.GenesoliaPratique.fenetre('<h2>Supprimer le dossier</h2><p class="pr-o-aide">Supprimer « ' + esc(d2.nom || '') + ' » et son arbre ? Ce n’est pas réversible.</p><p class="pr-o-msg" data-suppr-msg role="status"></p><div class="pr-o-boutons"><button class="btn btn-plein bt plein pr-danger" type="button" data-suppr-confirmer style="background:#A3324A;border-color:#A3324A">Supprimer définitivement</button></div>');
      fs.querySelector('[data-suppr-confirmer]').addEventListener('click', function () {
        sb.from('carnets').delete().eq('user_id', user.id).eq('mois', 'seances-' + d2.id).then(function () { return sb.from('arbres_supp').delete().eq('id', d2.id); }).then(function (r) {
          if (r && r.error) { fs.querySelector('[data-suppr-msg]').textContent = 'La suppression n’a pas abouti. Réessayez.'; return; }
          fs.remove(); chargerDossiers();
        });
      });
    } else if ((b = e.target.closest('[data-vers-client]'))) {
      var pd = (window.__persoPr || []).filter(function (x) { return x.id === b.getAttribute('data-vers-client'); })[0]; if (!pd || !window.GenesoliaPratique) return;
      var fc = window.GenesoliaPratique.fenetre('<h2>Dossier client·e</h2><p class="pr-o-aide">Classer « ' + esc(pd.nom || '') + ' » dans vos dossiers client·es ?</p><p class="pr-o-msg" data-vers-client-msg role="status"></p><div class="pr-o-boutons"><button class="btn btn-plein bt plein" type="button" data-vers-client-confirmer">Classer en dossier client·e</button></div>');
      fc.querySelector('[data-vers-client-confirmer]').addEventListener('click', function () {
        var nd = Object.assign({}, pd.data || {}, { dossier: 'client' });
        sb.from('arbres_supp').update({ data: nd }).eq('id', pd.id).then(function (r) {
          if (r.error) { fc.querySelector('[data-vers-client-msg]').textContent = 'Pas enregistré. Réessayez.'; return; }
          fc.remove(); chargerDossiers();
        });
      });
    }
  });

  /* ───────── Accès directs de la barre du bas : Arbre, Constellation, Démo (choix arbre ou constellation) ─────────
     Sans compte, la démo publique montre le vrai dossier « Démo · cliente fictive Léa », via un lien de partage
     dédié (lecture seule, sans notes) : jamais le dossier privé lui-même. */
  var DEMO_JETON = '9436eec3-6340-4cec-9e67-4c6b6b6303f4';
  function exempleExistant() { return dossiers.filter(function (d) { return /^(Exemple|Démo)/.test(d.nom || ''); })[0]; }
  function demoArbre() {
    var ex = exempleExistant();
    if (ex) { location.href = 'genosociogramme.html?arbre=' + encodeURIComponent(ex.id); return; }
    var bt = document.querySelector('[data-exemple]');
    if (user && actif() && bt) { dossierExemple(bt); return; }
    location.href = 'genosociogramme.html?partage=' + DEMO_JETON;
  }
  function demoConstellation() {
    var ex = exempleExistant();
    if (ex) {
      if (ex.data && ex.data.constellation) { location.href = 'plateau-visio.html?arbre=' + encodeURIComponent(ex.id); return; }
      sb.from('arbres_supp').update({ data: Object.assign({}, ex.data || {}, { constellation: true }) }).eq('id', ex.id).then(function (r) {
        if (r && r.error) { alert('Ça n’a pas abouti. Réessayez.'); return; }
        location.href = 'plateau-visio.html?arbre=' + encodeURIComponent(ex.id);
      });
      return;
    }
    if (!(user && actif())) { location.href = 'plateau-visio.html?partage=' + DEMO_JETON; return; }
    sb.from('arbres_supp').insert({ user_id: user.id, nom: 'Démo · famille de Léa (fictive)', data: { people: {}, rels: [], nid: 1, v: 2, dossier: 'client', constellation: true } }).select('id').single().then(function (r) {
      if (r.error) { alert('Le dossier exemple n’a pas pu être créé. Réessayez.'); return; }
      location.href = 'plateau-visio.html?arbre=' + encodeURIComponent(r.data.id);
    });
  }
  window.GenesoliaPro = {
    demo: function () {
      if (!window.GenesoliaPratique) { demoArbre(); return; }
      var f = window.GenesoliaPratique.fenetre('<h2>Démo</h2><p class="pr-o-aide">Laquelle voir ?</p><div class="pr-liste" style="gap:.5rem"><button type="button" class="btn btn-plein" style="width:100%" data-demo="arbre">Ouvrir arbre</button><button type="button" class="btn btn-trait" style="width:100%" data-demo="constellation">Ouvrir constellation</button></div>');
      f.addEventListener('click', function (e) { var b = e.target.closest('[data-demo]'); if (!b) return; f.remove(); if (b.getAttribute('data-demo') === 'constellation') demoConstellation(); else demoArbre(); });
    },
    arbre: function () { choisirDossier('Ouvrir un arbre', function (d) { location.href = 'genosociogramme.html?arbre=' + encodeURIComponent(d.id); }); },
    constellation: function () {
      choisirDossier('Ouvrir le plateau constellation', function (d) {
        if (d.data && d.data.constellation) { location.href = 'plateau-visio.html?arbre=' + encodeURIComponent(d.id); return; }
        sb.from('arbres_supp').update({ data: Object.assign({}, d.data || {}, { constellation: true }) }).eq('id', d.id).then(function (r) {
          if (r && r.error) { alert('Ça n’a pas abouti. Réessayez.'); return; }
          location.href = 'plateau-visio.html?arbre=' + encodeURIComponent(d.id);
        });
      });
    }
  };

  /* ───────── Démarrage ───────── */
  if (!sb || !CF) { indispo(); return; }
  sb.auth.getSession().then(function (r) {
    var s = r && r.data && r.data.session; if (!s) { porte(); return; }
    user = s.user;
    sb.from('praticiens').select('*').eq('user_id', user.id).maybeSingle().then(function (x) {
      if (x.error) { if (/relation|does not exist|schema cache|PGRST20/i.test(x.error.message || '')) { indispo(); return; } z.innerHTML = '<p class="pr-vide">Votre Espace praticien n’a pas pu s’ouvrir. Rechargez la page.</p>'; return; }
      if (!x.data) { inscription(); return; }
      prat = x.data; cabinet();
    });
  });
})();

/* Case « J'accepte les CGV » : les boutons d'abonnement restent grisés tant qu'elle n'est pas cochée */
document.addEventListener('change', function (e) {
  var c = e.target; if (!c.matches || !c.matches('[data-cgv]')) return;
  var carte = c.closest('.pr-carte'); if (!carte) return;
  carte.querySelectorAll('[data-payer]').forEach(function (b) { b.disabled = !c.checked; });
});
