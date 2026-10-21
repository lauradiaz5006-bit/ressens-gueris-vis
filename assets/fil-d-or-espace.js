/* Genesolia · le fil d'or dans l'espace (fil-d-or.html).
   - Connectée ET accord donné (GenesoliaCoffre, user_metadata.coffre_accord) : le fil d'or est gardé dans la table carnets,
     ligne « fil-d-or », CHIFFRÉ (fonctions carnet_ecrire / carnet_lire, règles d'accès : chacune ne voit que la sienne).
   - Sans compte ou sans accord : tout reste dans le navigateur, comme avant.
   - Nouvel appareil : si le fil d'or de l'appareil et celui de l'espace diffèrent, on demande lequel garder. Jamais d'écrasement sans demander.
   - Copie .json (télécharger / ouvrir), effacer (ici et dans Mon espace), lien de connexion pour continuer sur ordinateur, PDF généré sur l'appareil.
   Aucun e-mail automatique : seul le lien de connexion demandé par l'utilisatrice part. */
(function () {
  'use strict';
  var F = window.FilDor; if (!F) return;
  var SB_URL = 'https://qsvzzkjtjsznfntahvvh.supabase.co', SB_KEY = 'sb_publishable_6iEVxXmtB_u1hJ6mPS9fNg_CJhLjYkg';
  var MOIS = 'fil-d-or', CF = window.GenesoliaCoffre;
  var sb = null, user = null, synchro = false, minuteur = null, essais = 0;
  try { if (window.supabase && window.supabase.createClient) sb = window.supabase.createClient(SB_URL, SB_KEY); } catch (e) { sb = null; }

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function quand(iso) { if (!iso) return 'date inconnue'; var d = new Date(iso); return isNaN(d) ? 'date inconnue' : d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) + ' à ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }); }
  function majLocale() { try { return localStorage.getItem(F.cle + '-maj'); } catch (e) { return null; } }
  function nbDans(e) { if (!e || !e.personnes) return 0; return Object.keys(e.personnes).filter(function (id) { var p = e.personnes[id]; return p && (p.prenom || (p.etapes || []).some(function (x) { return x.age || x.evt || x.texte || (x.bl || []).length || (x.em || []).length; }) || ((p.global || {}).bl || []).length || ((p.global || {}).em || []).length); }).length; }
  function accord() { return !!(CF && user && CF.accord(user)); }

  /* ───────── Texte d'état sous le titre ───────── */
  function majStatut() {
    var z = $('fd-statut'); if (!z) return;
    if (synchro) z.innerHTML = 'Ton fil d’or est enregistré dans ton espace, jamais partagé.';
    else if (user) z.innerHTML = 'Tes réponses restent dans ce navigateur, sur cet appareil. <a href="#fd-garder" data-fd-garder-lien>Garde-les dans ton espace</a> pour ne pas les perdre.';
    else z.innerHTML = 'Tes réponses restent dans ce navigateur, sur cet appareil. <a href="login.html?inscription&amp;retour=fil-d-or.html">Crée ton espace</a> pour ne pas les perdre.';
    dessinerOutils(); dessinerEncart();
  }

  /* ───────── Encart de fin d'étape 1 ───────── */
  function encartFerme() { try { return sessionStorage.getItem('fd-sans-compte') === '1'; } catch (e) { return false; } }
  function dessinerEncart() {
    var z = $('fd-garder'); if (!z) return;
    if (synchro || encartFerme()) { z.hidden = true; return; }
    z.hidden = false;
    z.innerHTML = '<div class="fd-encart"><p class="fd-encart-t">Garde ton fil d’or</p>' +
      '<p>' + (user ? 'Garde-le dans ton espace pour le retrouver sur tous tes appareils. Il y est <b>chiffré</b> : personne d’autre que toi ne le lit.' : 'Crée ton espace avec ton e-mail pour le retrouver sur tous tes appareils. Il y est <b>chiffré</b> : personne d’autre que toi ne le lit.') + '</p>' +
      '<div class="fd-encart-actions"><button type="button" class="btn btn-plein" data-fd-garder>Garder mon fil d’or</button><button type="button" class="fd-lien" data-fd-sans>Continuer sans compte</button></div>' +
      '<p class="fd-petit">Rien n’est envoyé tant que tu n’as pas choisi. <a href="confidentialite.html#fil-d-or">Mes données</a></p></div>';
  }
  function garderDansEspace() {
    if (!user) {   /* sans compte : on crée l'espace, puis le choix est appliqué au retour */
      try { sessionStorage.setItem('fd-veut-garder', '1'); } catch (e) {}
      location.href = 'login.html?inscription&retour=fil-d-or.html'; return;
    }
    if (!sb) return;
    var bt = document.querySelector('[data-fd-garder]'); if (bt) { bt.disabled = true; bt.textContent = 'Un instant…'; }
    sb.auth.updateUser({ data: { coffre_accord: new Date().toISOString() } }).then(function (r) {
      if (r && r.error) { if (bt) { bt.disabled = false; bt.textContent = 'Garder mon fil d’or'; } message('L’enregistrement n’a pas abouti. Réessaie dans un instant.'); return; }
      if (r && r.data && r.data.user) user = r.data.user;
      try { sessionStorage.removeItem('fd-veut-garder'); } catch (e) {}
      demarrerSynchro();
    });
  }

  /* ───────── Synchronisation ───────── */
  function payload() { return { etat: F.etat(), maj: majLocale() || new Date().toISOString(), v: 1 }; }
  function envoyer() {
    clearTimeout(minuteur); minuteur = null;
    if (!synchro || !sb || !user) return;
    CF.ecrire(sb, user, MOIS, payload()).then(function (r) {
      if (r && r.error) throw r.error;
      essais = 0; majStatut();
    }).catch(function () {
      essais++; minuteur = setTimeout(envoyer, Math.min(60000, 5000 * essais));
      var z = $('fd-statut'); if (z) z.textContent = 'Pas encore enregistré dans ton espace (connexion ?). Nouvel essai…';
    });
  }
  function change() { if (!synchro) return; clearTimeout(minuteur); minuteur = setTimeout(envoyer, 900); }
  /* La base réordonne les clés (jsonb) : on compare le contenu, pas le texte ; les champs vides ne comptent pas */
  function canon(v) {
    if (Array.isArray(v)) return v.map(canon);
    if (v && typeof v === 'object') { var o = {}; Object.keys(v).sort().forEach(function (k) { var x = canon(v[k]); if (x !== '' && x !== null && x !== undefined && !(Array.isArray(x) && !x.length)) o[k] = x; }); return o; }
    return v;
  }
  function memeContenu(a, b) { return JSON.stringify(canon(a)) === JSON.stringify(canon(b)); }
  function demarrerSynchro() {
    CF.lire(sb, user, MOIS).then(function (d) {
      var distant = d && d.etat ? d : null, localVide = F.vide();
      if (!distant) { synchro = true; if (!localVide) envoyer(); majStatut(); return; }
      if (localVide) { F.remplacer(distant.etat); try { localStorage.setItem(F.cle + '-maj', distant.maj || ''); } catch (e) {} synchro = true; majStatut(); return; }
      if (memeContenu(distant.etat, F.etat()) || (distant.maj && distant.maj === majLocale())) { synchro = true; majStatut(); return; }
      choisirVersion(distant);
    }).catch(function () { majStatut(); });
  }
  function choisirVersion(distant) {
    var f = document.createElement('div'); f.className = 'fd-fond'; f.setAttribute('role', 'dialog'); f.setAttribute('aria-modal', 'true'); f.setAttribute('aria-labelledby', 'fd-choix-t');
    var nL = F.nb(), nD = nbDans(distant.etat);
    f.innerHTML = '<div class="fd-fenetre"><h2 id="fd-choix-t">Deux versions de ton fil d’or</h2><p>Ton espace et cet appareil n’ont pas le même fil d’or. Lequel veux-tu garder ? L’autre sera remplacé.</p>' +
      '<div class="fd-versions"><button type="button" class="fd-version" data-v="espace"><b>Celui de mon espace</b><span>' + nD + ' personne' + (nD > 1 ? 's' : '') + ' · ' + esc(quand(distant.maj)) + '</span></button>' +
      '<button type="button" class="fd-version" data-v="local"><b>Celui de cet appareil</b><span>' + nL + ' personne' + (nL > 1 ? 's' : '') + ' · ' + esc(quand(majLocale())) + '</span></button></div>' +
      '<p class="fd-petit">Pas sûre ? Télécharge d’abord une copie de celui de cet appareil.</p><div class="fd-encart-actions"><button type="button" class="btn btn-trait" data-v="copie">Télécharger une copie de cet appareil</button></div></div>';
    document.body.appendChild(f);
    f.addEventListener('click', function (e) {
      var b = e.target.closest('[data-v]'); if (!b) return;
      var v = b.getAttribute('data-v');
      if (v === 'copie') { telecharger(); return; }
      if (v === 'espace') { F.remplacer(distant.etat); try { localStorage.setItem(F.cle + '-maj', distant.maj || ''); } catch (x) {} synchro = true; }
      else { synchro = true; envoyer(); }
      f.remove(); majStatut();
    });
  }

  /* ───────── Outils : copies, ordinateur, effacer ───────── */
  function dessinerOutils() {
    var z = $('fd-outils'); if (!z) return;
    z.innerHTML = '<div class="fd-outils">' +
      '<div class="fd-bloc"><p class="fd-bloc-t">Continuer sur mon ordinateur</p>' + (synchro
        ? '<p>Reçois un lien de connexion à ton e-mail, ouvre-le sur ton ordinateur : ton fil d’or t’y attend. Aucune réponse n’est mise dans le lien ni dans l’e-mail.</p><button type="button" class="btn btn-trait" data-fd-lien>M’envoyer le lien de connexion</button>'
        : '<p>Pour le retrouver sur ton ordinateur, garde-le d’abord dans ton espace' + (user ? '' : ' (crée-le avec ton e-mail)') + ', ou passe par une copie.</p><button type="button" class="btn btn-trait" data-fd-garder>Garder mon fil d’or</button>') + '</div>' +
      '<div class="fd-bloc"><p class="fd-bloc-t">Une copie de sauvegarde</p><p>Un fichier à garder sur ton appareil, sans compte.</p><div class="fd-encart-actions"><button type="button" class="btn btn-trait" data-fd-telecharger>Télécharger une copie</button><button type="button" class="btn btn-trait" data-fd-ouvrir>Ouvrir une copie</button></div><input type="file" accept=".json,application/json" data-fd-fichier hidden></div>' +
      '<div class="fd-bloc"><p class="fd-bloc-t">Effacer</p><p>' + (synchro ? 'Efface ton fil d’or sur cet appareil et dans ton espace.' : 'Efface ton fil d’or sur cet appareil.') + '</p><button type="button" class="btn btn-trait fd-effacer" data-fd-effacer>Effacer mon fil d’or</button></div>' +
      '<p class="fd-petit" data-fd-message role="status" aria-live="polite"></p></div>';
  }
  function message(t) { var m = document.querySelector('[data-fd-message]'); if (m) m.textContent = t; }
  function telecharger() {
    var blob = new Blob([JSON.stringify({ type: 'genesolia-fil-d-or', v: 1, maj: majLocale() || new Date().toISOString(), etat: F.etat() }, null, 1)], { type: 'application/json' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'mon-fil-d-or-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    message('Copie téléchargée. Garde-la précieusement : elle contient tes réponses.');
  }
  function ouvrir(fichier) {
    var r = new FileReader();
    r.onload = function () {
      var d = null; try { d = JSON.parse(r.result); } catch (e) {}
      var e2 = d && (d.etat || (d.personnes ? d : null));
      if (!e2 || !e2.personnes || !e2.personnes.toi) { message('Ce fichier ne contient pas de fil d’or lisible.'); return; }
      if (!F.vide() && !confirm('Remplacer ton fil d’or actuel par celui de la copie ?')) return;
      F.remplacer(e2); try { localStorage.setItem(F.cle + '-maj', new Date().toISOString()); } catch (x) {}
      change(); message('Ta copie est ouverte.');
    };
    r.readAsText(fichier);
  }
  function effacer() {
    if (!confirm(synchro ? 'Effacer ton fil d’or sur cet appareil et dans ton espace ? Ce n’est pas réversible.' : 'Effacer ton fil d’or sur cet appareil ? Ce n’est pas réversible.')) return;
    var suite = function () { F.reinitialiser(); message('Ton fil d’or est effacé.'); };
    if (synchro && sb && user) {
      clearTimeout(minuteur);
      sb.from('carnets').delete().eq('user_id', user.id).eq('mois', MOIS).then(function (r) {
        if (r && r.error) { message('L’effacement dans ton espace n’a pas abouti. Réessaie dans un instant.'); return; }
        suite();
      });
    } else suite();
  }
  function envoyerLien() {
    if (!sb || !user || !user.email) return;
    var b = document.querySelector('[data-fd-lien]'); if (b) { b.disabled = true; b.textContent = 'Un instant…'; }
    sb.auth.signInWithOtp({ email: user.email, options: { shouldCreateUser: false, emailRedirectTo: 'https://genesolia.fr/login.html?retour=fil-d-or.html' } }).then(function (r) {
      if (b) { b.disabled = false; b.textContent = 'M’envoyer le lien de connexion'; }
      message(r && r.error ? 'Le lien n’a pas pu partir. Réessaie dans quelques minutes.' : 'C’est envoyé à ' + user.email + ' : ouvre l’e-mail sur ton ordinateur.');
    });
  }

  /* ───────── PDF « Mon fil d'or », généré sur l'appareil ───────── */
  function chargerJsPDF() {
    if (window.jspdf) return Promise.resolve(window.jspdf.jsPDF);
    return new Promise(function (ok, ko) { var s = document.createElement('script'); s.src = 'assets/jspdf.umd.min.js'; s.onload = function () { ok(window.jspdf.jsPDF); }; s.onerror = ko; document.head.appendChild(s); });
  }
  function nettoie(t) { return String(t || '').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/…/g, '...').replace(/[–—]/g, '-').replace(/ | /g, ' '); }
  function pdf() {
    var C = F.contenu();
    if (!C.personnes.length) { alert('Note d’abord ce que tu as ressenti à l’étape 1.'); return; }
    var b = $('fd-pdf'); if (b) { b.disabled = true; b.textContent = 'Préparation…'; }
    chargerJsPDF().then(function (jsPDF) {
      var doc = new jsPDF({ unit: 'mm', format: 'a4' }), W = 210, M = 18, y = 22, L = W - 2 * M;
      var PRUNE = [107, 47, 91], DOUX = [142, 99, 131], OR = [185, 138, 85];
      function bas(h) { if (y + h > 280) { doc.addPage(); y = 20; } }
      function texte(t, taille, coul, style, retrait) {
        doc.setFont('helvetica', style || 'normal'); doc.setFontSize(taille); doc.setTextColor.apply(doc, coul);
        var l = doc.splitTextToSize(nettoie(t), L - (retrait || 0));
        l.forEach(function (ligne) { bas(taille * .45); doc.text(ligne, M + (retrait || 0), y); y += taille * .45; });
      }
      function titre(t) { bas(16); y += 4; doc.setDrawColor.apply(doc, OR); doc.setLineWidth(.4); doc.line(M, y, M + 12, y); y += 6; texte(t, 14, PRUNE, 'bold'); y += 1.5; }
      doc.setFillColor(251, 241, 238); doc.rect(0, 0, W, 40, 'F');
      doc.setFont('times', 'normal'); doc.setFontSize(26); doc.setTextColor.apply(doc, PRUNE); doc.text('Mon fil d\'or', M, 24);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor.apply(doc, DOUX);
      doc.text(nettoie('Genesolia · ' + new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })), M, 32);
      y = 52;
      function groupe(nom, filtre) {
        var ps = C.personnes.filter(filtre); if (!ps.length) return;
        titre(nom);
        ps.forEach(function (p) {
          bas(12); texte(p.qui, 11.5, PRUNE, 'bold'); y += .5;
          if (p.global) texte('En général : ' + p.global, 10, DOUX, 'normal', 3);
          p.etapes.forEach(function (e) { texte('- ' + [e.age ? 'Vers ' + e.age + ' ans' : '', e.evt, e.mots].filter(Boolean).join(' · ') + (e.texte ? ' : ' + e.texte : ''), 10, [74, 43, 66], 'normal', 3); });
          y += 3;
        });
      }
      groupe('Ta vie', function (p) { return /^Toi/.test(p.qui); });
      groupe('Côté de ta mère', function (p) { return p.cote === 'm'; });
      groupe('Côté de ton père', function (p) { return p.cote === 'p'; });
      groupe('Autour de toi', function (p) { return !/^Toi/.test(p.qui) && p.cote !== 'm' && p.cote !== 'p'; });
      titre('Ce qui se répète');
      [['Les blessures qui reviennent', C.blessures], ['Les émotions qui reviennent', C.emotions], ['Les âges qui se répondent', C.ages], ['Les phrases qui se transmettent', C.phrases]].forEach(function (s) {
        bas(10); texte(s[0], 11, PRUNE, 'bold'); y += .5;
        if (!s[1].length) texte('Rien de commun pour l\'instant.', 10, DOUX, 'italic', 3);
        s[1].forEach(function (l) { texte('- ' + l, 10, [74, 43, 66], 'normal', 3); });
        y += 3;
      });
      y += 4; texte('Une lecture symbolique : une ressemblance n\'est pas une preuve, elle ouvre une question. genesolia.fr', 8.5, DOUX, 'italic');
      doc.save('mon-fil-d-or.pdf');
    }).catch(function () { alert('Le PDF n’a pas pu être préparé. Utilise « Imprimer » en attendant.'); })
      .then(function () { if (b) { b.disabled = false; b.textContent = 'Télécharger mon fil d’or (PDF)'; } });
  }

  /* ───────── Événements ───────── */
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t.closest('[data-fd-garder]')) { garderDansEspace(); return; }
    if (t.closest('[data-fd-garder-lien]')) { e.preventDefault(); var g = $('fd-garder'); if (g) { if (g.closest('[hidden]') && window.FilDor) document.querySelector('[data-aller="1"]').click(); setTimeout(function () { g.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 120); } return; }
    if (t.closest('[data-fd-sans]')) { try { sessionStorage.setItem('fd-sans-compte', '1'); } catch (x) {} dessinerEncart(); return; }
    if (t.closest('[data-fd-telecharger]')) { telecharger(); return; }
    if (t.closest('[data-fd-ouvrir]')) { var i = document.querySelector('[data-fd-fichier]'); if (i) i.click(); return; }
    if (t.closest('[data-fd-effacer]')) { effacer(); return; }
    if (t.closest('[data-fd-lien]')) { envoyerLien(); return; }
    if (t.closest('#fd-pdf')) { pdf(); return; }
  });
  document.addEventListener('change', function (e) { if (e.target.matches('[data-fd-fichier]') && e.target.files[0]) { ouvrir(e.target.files[0]); e.target.value = ''; } });
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden' && minuteur) envoyer(); });

  window.FilDorEspace = { change: change };
  majStatut();
  if (sb && CF) sb.auth.getSession().then(function (r) {
    var s = r && r.data && r.data.session; if (!s) return;
    user = s.user;
    var veut = false; try { veut = sessionStorage.getItem('fd-veut-garder') === '1'; } catch (e) {}
    if (accord()) demarrerSynchro();
    else if (veut) garderDansEspace();   /* elle a choisi « Garder mon fil d'or » avant de créer son espace */
    else majStatut();
  });
})();
