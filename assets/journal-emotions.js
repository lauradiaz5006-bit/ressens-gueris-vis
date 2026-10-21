/* Genesolia · Mon journal des émotions (espace client, panneau « Mon journal »).
   Données : table journal_emotions (outils-internes/supabase-journal.sql), chaque personne ne lit que ses lignes (RLS).
   Tant que ces tables n'existent pas, ou sans compte, le journal reste dans ce navigateur (localStorage), et il le dit.
   Les émotions viennent de assets/emotions.js (mêmes clés que la roue des émotions).
   Le cycle est facultatif et demande un accord explicite ; il sert seulement de repère (jour du cycle, saison intérieure).
   Par prudence (données de santé), les dates du cycle ne quittent JAMAIS l'appareil : elles restent dans ce navigateur,
   sous une clé propre à chaque compte, et le jour du cycle est recalculé à l'affichage. Rien du cycle n'est envoyé à Supabase. */
(function () {
  'use strict';
  var D = window.GENESOLIA_EMOTIONS || [];
  var CLE_L = 'genesolia-journal', CLE_C0 = 'genesolia-journal-cycle';
  function CLE_C() { return CLE_C0 + (user ? '-' + user.id : ''); }
  var ZONES = ['Tête', 'Gorge', 'Poitrine', 'Ventre', 'Épaules', 'Dos', 'Mains', 'Jambes'];
  var SAISONS = {
    hiver: ['Hiver intérieur', 'Le temps de tes règles : un moment pour ralentir et te retirer un peu.', '#4E5D94'],
    printemps: ['Printemps intérieur', 'L’énergie revient, et l’envie de commencer des choses.', '#D97D8B'],
    ete: ['Été intérieur', 'Un temps d’élan, d’ouverture aux autres et de parole facile.', '#D9A441'],
    automne: ['Automne intérieur', 'Un temps pour trier, dire ce qui te pèse et te recentrer.', '#9C6B78']
  };
  var sb = null, user = null, mode = 'local', E = [], C = null, racine = null, choix = null, moisVu = null, prepare = null;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function iso(d) { var x = new Date(d); x.setMinutes(x.getMinutes() - x.getTimezoneOffset()); return x.toISOString().slice(0, 10); }
  function auj() { return iso(new Date()); }
  function jours(a, b) { return Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 864e5); }
  function trouver(cle) {
    var x = String(cle || '').split('|'), c = D.filter(function (e) { return e.id === x[0]; })[0]; if (!c) return null;
    var s = x.length > 1 ? c.sous[+x[1]] : null, t = x.length > 2 && s ? s.t[+x[2]] : null;
    return { c: c, s: s, t: t, nom: t || (s && s.n) || c.nom };
  }
  function lireL(k, d) { try { var v = JSON.parse(localStorage.getItem(k) || 'null'); return v == null ? d : v; } catch (e) { return d; } }
  function ecrireL(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function absente(err) { var t = String((err && (err.message || err.code)) || ''); return /42P01|does not exist|relation|schema cache|PGRST20/i.test(t); }

  /* ---------- Cycle ---------- */
  function infoCycle(jour) {
    if (!C || !C.suivre || !C.debut) return null;
    var dif = jours(C.debut, jour); if (dif < 0) return null;
    var duree = C.duree || 28, regles = C.regles || 5, j = (dif % duree) + 1, ov = duree - 14;
    var s = j <= regles ? 'hiver' : j <= ov - 3 ? 'printemps' : j <= ov + 2 ? 'ete' : 'automne';
    return { jour: j, saison: s };
  }

  /* ---------- Stockage ---------- */
  /* Accord : comme les carnets, rien ne part dans l'espace avant « J'accepte que mes réponses soient gardées » (GenesoliaCoffre) */
  var enLigneSansAccord = 0;
  function accordDonne() { var CF = window.GenesoliaCoffre; return !!(CF && user && CF.accord(user)); }
  function charger() {
    if (!sb || !user) { mode = 'local'; E = lireL(CLE_L, []); C = lireL(CLE_C(), null); return Promise.resolve(); }
    if (!accordDonne()) {
      mode = 'local'; E = lireL(CLE_L, []); C = lireL(CLE_C(), null);
      /* journal déjà gardé en ligne avant cette règle : on le signale pour qu'elle confirme ou l'efface */
      return sb.from('journal_emotions').select('id', { count: 'exact', head: true }).then(function (r) { enLigneSansAccord = (r && r.count) || 0; }, function () {});
    }
    return sb.from('journal_emotions').select('id,jour,cree_le,emotion,intensite,zones,note,besoin').order('jour', { ascending: false }).order('cree_le', { ascending: false }).limit(500).then(function (r) {
      if (r.error) { if (absente(r.error)) { mode = 'local'; E = lireL(CLE_L, []); C = lireL(CLE_C(), null); return; } throw r.error; }
      mode = 'compte'; E = r.data || []; C = lireL(CLE_C(), null);
    });
  }
  function ajouter(e) {
    if (mode === 'compte') return sb.from('journal_emotions').insert(e).select('id,jour,cree_le,emotion,intensite,zones,note,besoin').single().then(function (r) { if (r.error) throw r.error; E.unshift(r.data); });
    e.id = 'l' + Date.now(); e.cree_le = new Date().toISOString(); E.unshift(e); E = E.slice(0, 500); ecrireL(CLE_L, E); return Promise.resolve();
  }
  function retirer(id) {
    E = E.filter(function (x) { return x.id !== id; });
    if (mode === 'compte') return sb.from('journal_emotions').delete().eq('id', id).then(function (r) { if (r.error) throw r.error; });
    ecrireL(CLE_L, E); return Promise.resolve();
  }
  /* Le cycle reste sur l'appareil, quel que soit le mode */
  function sauverCycle(c) { C = c; ecrireL(CLE_C(), c); return Promise.resolve(); }
  function effacerCycle() { C = null; try { localStorage.removeItem(CLE_C()); } catch (e) {} return Promise.resolve(); }

  /* ---------- Affichage ---------- */
  function message(t, erreur) { var m = racine.querySelector('.jo-msg'); if (m) { m.textContent = t || ''; m.className = 'jo-msg' + (erreur ? ' erreur' : ''); } }
  function puces() {
    var h = '<div class="jo-puces">' + D.map(function (c) { return '<button type="button" class="jo-puce jo-base" style="--c:' + c.c + '" data-em="' + c.id + '" aria-pressed="' + (choix && choix.split('|')[0] === c.id) + '">' + esc(c.nom) + '</button>'; }).join('') + '</div>';
    var f = trouver(choix);
    if (f) {
      h += '<div class="jo-puces">' + f.c.sous.map(function (s, j) { var k = f.c.id + '|' + j; return '<button type="button" class="jo-puce" style="--c:' + f.c.c + '" data-em="' + k + '" aria-pressed="' + (choix === k || choix.indexOf(k + '|') === 0) + '">' + esc(s.n) + '</button>'; }).join('') + '</div>';
      if (f.s) { var b = choix.split('|').slice(0, 2).join('|'); h += '<div class="jo-puces">' + f.s.t.map(function (t, k) { var kk = b + '|' + k; return '<button type="button" class="jo-puce jo-fin" style="--c:' + f.c.c + '" data-em="' + kk + '" aria-pressed="' + (choix === kk) + '">' + esc(t) + '</button>'; }).join('') + '</div>'; }
      h += '<p class="jo-choisi"><i style="background:' + f.c.c + '"></i>' + esc(f.nom) + ' · <span>' + esc(f.c.besoin) + '</span></p>';
    }
    return h;
  }
  function dessiner() {
    if (!racine) return;
    var ic = infoCycle(auj()), sa = ic ? SAISONS[ic.saison] : null;
    var aujE = E.filter(function (x) { return x.jour === auj(); });
    var h = '<div class="jo-tete"><div><h2>Mon journal des émotions</h2><p class="tb-aide">Note ce que tu ressens, jour après jour. Au fil des semaines, tu vois ce qui revient, et ce dont tu as le plus souvent besoin.</p></div>' +
      (sa ? '<div class="jo-saison" style="--c:' + sa[2] + '"><b>Jour ' + ic.jour + ' de ton cycle</b><span>' + esc(sa[0]) + '</span></div>' : '') + '</div>' +
      (mode === 'local' ? (user && !accordDonne()
        ? '<div class="jo-local"><p>' + (enLigneSansAccord ? 'Ton espace contient déjà ' + enLigneSansAccord + ' émotion' + (enLigneSansAccord > 1 ? 's' : '') + ' notée' + (enLigneSansAccord > 1 ? 's' : '') + '. Confirme que tu acceptes qu’elles y soient gardées, ou efface-les.' : 'Ton journal est gardé sur cet appareil. Pour le retrouver sur tous tes appareils, accepte qu’il soit gardé dans ton espace.') + '</p><div id="jo-accord-zone"></div>' + (enLigneSansAccord ? '<p><button type="button" class="btn btn-trait" id="jo-effacer-ligne">Effacer mon journal en ligne</button></p>' : '') + '</div>'
        : '<p class="jo-local">Sans compte, ton journal reste sur cet appareil.</p>')
      : '<p class="jo-local">Ton journal est gardé dans ton espace. Il n’est jamais partagé, et l’équipe Genesolia ne le consulte pas.</p>') +
      '<p class="jo-msg" role="status" aria-live="polite"></p>' +
      '<div class="jo-grille">' +
      '<form class="tb-carte jo-form" id="jo-form"><h3>Aujourd’hui' + (aujE.length ? ' <small>(' + aujE.length + ' déjà notée' + (aujE.length > 1 ? 's' : '') + ')</small>' : '') + '</h3>' +
      '<p class="tb-aide">Choisis la grande émotion, puis précise si tu veux. <a href="roue-des-emotions.html">Tu hésites ? Ouvre la roue des émotions.</a></p>' +
      '<div id="jo-puces">' + puces() + '</div>' +
      '<label class="champ"><span class="tb-etiq">Son intensité : <b id="jo-val">5</b> sur 10</span><input type="range" id="jo-int" min="1" max="10" value="5"></label>' +
      '<div class="champ"><span class="tb-etiq">Où je la sens dans mon corps</span><div class="jo-puces" id="jo-zones">' + ZONES.map(function (z) { return '<button type="button" class="jo-puce" data-zone="' + z + '" aria-pressed="false">' + z + '</button>'; }).join('') + '</div></div>' +
      '<div class="champ"><label for="jo-note">Ce qui s’est passé</label><textarea id="jo-note" maxlength="600" placeholder="Quelques mots suffisent"></textarea></div>' +
      '<div class="champ"><label for="jo-besoin">Ce dont j’ai besoin</label><input id="jo-besoin" type="text" maxlength="200" placeholder="Me reposer, en parler, poser une limite…"></div>' +
      '<div class="champ"><label for="jo-jour">Le jour</label><input id="jo-jour" type="date" value="' + auj() + '" max="' + auj() + '"></div>' +
      '<button type="submit" class="btn btn-plein">Noter cette émotion</button></form>' +
      '<div class="tb-carte jo-cal"><div class="jo-cal-tete"><button type="button" class="jo-nav" data-mois="-1" aria-label="Mois précédent">‹</button><h3 id="jo-mois"></h3><button type="button" class="jo-nav" data-mois="1" aria-label="Mois suivant">›</button></div><div id="jo-grillecal"></div><div id="jo-jourdetail"></div></div>' +
      '<div class="tb-carte jo-bilan"><h3>Ce qui revient</h3><div id="jo-revient"></div></div>' +
      '<div class="tb-carte jo-cycle" id="jo-cycle"></div>' +
      '<div class="tb-carte jo-hist tb-large-j"><h3>Mes dernières émotions</h3><ul id="jo-liste"></ul><div class="tb-actions"><button type="button" class="btn btn-trait" id="jo-imprimer">Imprimer ou PDF</button></div></div>' +
      '</div>';
    racine.innerHTML = h;
    dessinerCal(); dessinerRevient(); dessinerCycle(); dessinerListe();
    var z = racine.querySelector('#jo-accord-zone'), CF = window.GenesoliaCoffre;
    if (z && CF && sb && user) CF.demander(z, sb, function () {
      /* accord donné : les émotions notées sur cet appareil passent dans l'espace, puis on recharge */
      sb.auth.getUser().then(function (r) { if (r && r.data && r.data.user) user = r.data.user; }).then(function () {
        var locales = lireL(CLE_L, []).map(function (x) { return { jour: x.jour, emotion: x.emotion, intensite: x.intensite, zones: x.zones, note: x.note, besoin: x.besoin }; });
        return locales.length ? sb.from('journal_emotions').insert(locales).then(function (r) { if (!r.error) { try { localStorage.removeItem(CLE_L); } catch (e) {} } }) : null;
      }).then(function () { return charger(); }).then(dessiner, dessiner);
    });
    var ef = racine.querySelector('#jo-effacer-ligne');
    if (ef) ef.onclick = function () {
      if (!confirm('Effacer toutes les émotions gardées dans ton espace ? Ce n’est pas réversible.')) return;
      sb.from('journal_emotions').delete().eq('user_id', user.id).then(function (r) { if (r && r.error) { message('L’effacement n’a pas abouti. Réessaie dans un instant.', true); return; } enLigneSansAccord = 0; dessiner(); });
    };
  }
  function couleurJour(liste) {
    if (!liste.length) return null;
    var m = liste.slice().sort(function (a, b) { return (b.intensite || 0) - (a.intensite || 0); })[0], f = trouver(m.emotion);
    return f ? f.c.c : null;
  }
  function dessinerCal() {
    var b = moisVu || new Date(); b = new Date(b.getFullYear(), b.getMonth(), 1); moisVu = b;
    racine.querySelector('#jo-mois').textContent = b.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    var par = {}; E.forEach(function (x) { (par[x.jour] = par[x.jour] || []).push(x); });
    var dec = (b.getDay() + 6) % 7, nb = new Date(b.getFullYear(), b.getMonth() + 1, 0).getDate();
    var h = '<div class="jo-semaine">' + ['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(function (x) { return '<span>' + x + '</span>'; }).join('') + '</div><div class="jo-jours">';
    for (var i = 0; i < dec; i++) h += '<span></span>';
    for (var d = 1; d <= nb; d++) {
      var j = iso(new Date(b.getFullYear(), b.getMonth(), d)), l = par[j] || [], c = couleurJour(l), ic = infoCycle(j);
      h += '<button type="button" class="jo-jour' + (j === auj() ? ' jo-auj' : '') + (ic && ic.saison === 'hiver' ? ' jo-hiver' : '') + '" data-jour="' + j + '"' + (c ? ' style="--c:' + c + '"' : '') + ' aria-label="' + d + (l.length ? ', ' + l.length + ' émotion' + (l.length > 1 ? 's' : '') : '') + '"><b>' + d + '</b>' + (ic ? '<small>j' + ic.jour + '</small>' : '') + (c ? '<i></i>' : '') + '</button>';
    }
    h += '</div>' + (C && C.suivre ? '<p class="tb-aide jo-legende"><span class="jo-l-hiver"></span> tes règles (prévues d’après ton cycle) · j = jour du cycle</p>' : '');
    racine.querySelector('#jo-grillecal').innerHTML = h;
  }
  function ligneEntree(x, suppr) {
    var f = trouver(x.emotion); if (!f) return '';
    var dt = new Date(x.jour + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
    return '<li><i style="background:' + f.c.c + '"></i><div><b>' + esc(f.nom) + '</b>' + (x.intensite ? ' · ' + x.intensite + '/10' : '') + ' <small>' + esc(dt) + (infoCycle(x.jour) ? ' · ' + esc(SAISONS[infoCycle(x.jour).saison][0].toLowerCase()) : '') + '</small>' +
      (x.zones && x.zones.length ? '<br><small>' + esc(x.zones.join(', ')) + '</small>' : '') + (x.note ? '<br>' + esc(x.note) : '') + (x.besoin ? '<br><small>Besoin : ' + esc(x.besoin) + '</small>' : '') + '</div>' +
      (suppr ? '<button type="button" class="jo-suppr" data-suppr="' + esc(x.id) + '" aria-label="Effacer">×</button>' : '') + '</li>';
  }
  function dessinerListe() {
    var z = racine.querySelector('#jo-liste');
    z.innerHTML = E.length ? E.slice(0, 25).map(function (x) { return ligneEntree(x, true); }).join('') : '<li class="tb-aide">Ton journal est encore vide. Note une première émotion : elle apparaîtra ici.</li>';
  }
  function dessinerRevient() {
    var z = racine.querySelector('#jo-revient'), lim = iso(new Date(Date.now() - 90 * 864e5)), l = E.filter(function (x) { return x.jour >= lim; });
    if (l.length < 2) { z.innerHTML = '<p class="tb-aide">Après quelques jours de notes, tu verras ici les émotions qui reviennent le plus souvent sur les trois derniers mois.</p>'; return; }
    var cpt = {}; l.forEach(function (x) { var k = String(x.emotion).split('|')[0]; cpt[k] = (cpt[k] || 0) + 1; });
    var max = Math.max.apply(null, Object.keys(cpt).map(function (k) { return cpt[k]; }));
    var h = '<div class="jo-barres">' + D.filter(function (c) { return cpt[c.id]; }).sort(function (a, b) { return cpt[b.id] - cpt[a.id]; }).map(function (c) {
      return '<div class="jo-barre"><span>' + esc(c.nom) + '</span><div><span style="width:' + Math.round(cpt[c.id] / max * 100) + '%;background:' + c.c + '"></span></div><b>' + cpt[c.id] + '</b></div>';
    }).join('') + '</div>';
    var besoins = {}; l.forEach(function (x) { if (x.besoin) { var b = x.besoin.trim().toLowerCase(); besoins[b] = (besoins[b] || 0) + 1; } });
    var topB = Object.keys(besoins).filter(function (k) { return besoins[k] > 1; }).sort(function (a, b) { return besoins[b] - besoins[a]; }).slice(0, 3);
    if (topB.length) h += '<p class="tb-aide">Tes besoins qui reviennent : <b>' + topB.map(esc).join('</b>, <b>') + '</b>.</p>';
    if (C && C.suivre) {
      var phr = Object.keys(SAISONS).map(function (s) {
        var ls = l.filter(function (x) { var ic = infoCycle(x.jour); return ic && ic.saison === s; }); if (ls.length < 2) return '';
        var n = {}; ls.forEach(function (x) { var f = trouver(x.emotion); if (f) n[f.nom] = (n[f.nom] || 0) + 1; });
        var top = Object.keys(n).sort(function (a, b) { return n[b] - n[a]; }).slice(0, 3).filter(function (k) { return n[k] > 1; });
        return top.length ? '<li><b style="color:' + SAISONS[s][2] + '">' + esc(SAISONS[s][0]) + '</b> : tu notes souvent ' + top.map(function (k) { return esc(k.toLowerCase()) + ' (' + n[k] + ')'; }).join(', ') + '.</li>' : '';
      }).join('');
      h += phr ? '<h4 class="jo-h4">Selon ton cycle</h4><ul class="jo-phrases">' + phr + '</ul>' : '<p class="tb-aide">Selon ton cycle : il faut encore quelques notes dans chaque saison pour voir ce qui revient.</p>';
    }
    z.innerHTML = h;
  }
  function dessinerCycle() {
    var z = racine.querySelector('#jo-cycle');
    if (!C || !C.suivre) {
      z.innerHTML = '<h3>Relier mon journal à mon cycle</h3><p class="tb-aide">Facultatif. Si tu as des règles, ton journal peut indiquer le jour de ton cycle et ta « saison intérieure » : hiver, printemps, été, automne. Tu verras alors si certaines émotions reviennent à la même période. C’est un repère pour te connaître, pas une explication.</p>' +
        '<label class="jo-accord"><input type="checkbox" id="jo-accord"> J’accepte que les dates de mon cycle soient gardées sur cet appareil, uniquement pour ce journal. Elles ne sont envoyées nulle part, et je peux tout effacer quand je veux.</label>' +
        '<div class="jo-champs2"><div class="champ"><label for="jo-debut">Premier jour de tes dernières règles</label><input type="date" id="jo-debut" max="' + auj() + '"></div>' +
        '<div class="champ"><label for="jo-duree">Durée habituelle du cycle (jours)</label><input type="number" id="jo-duree" min="18" max="45" value="28"></div>' +
        '<div class="champ"><label for="jo-regles">Durée des règles (jours)</label><input type="number" id="jo-regles" min="1" max="10" value="5"></div></div>' +
        '<div class="tb-actions"><button type="button" class="btn btn-plein" id="jo-activer">Suivre mon cycle</button></div><p class="tb-aide">Tu n’as pas de cycle, ou ça ne te parle pas ? Ton journal fonctionne très bien sans.</p>';
      return;
    }
    var ic = infoCycle(auj()), sa = ic ? SAISONS[ic.saison] : null;
    z.innerHTML = '<h3>Mon cycle</h3>' + (sa ? '<p class="jo-saison-texte" style="--c:' + sa[2] + '"><b>Jour ' + ic.jour + ' · ' + esc(sa[0]) + '</b><br>' + esc(sa[1]) + '</p>' : '<p class="tb-aide">Indique le premier jour de tes dernières règles.</p>') +
      '<div class="tb-actions"><button type="button" class="btn btn-plein" id="jo-regles-auj">Mes règles commencent aujourd’hui</button></div>' +
      '<details class="jo-reglages"><summary>Modifier mes réglages</summary><div class="jo-champs2"><div class="champ"><label for="jo-debut">Premier jour des dernières règles</label><input type="date" id="jo-debut" max="' + auj() + '" value="' + esc(C.debut || '') + '"></div>' +
      '<div class="champ"><label for="jo-duree">Durée du cycle</label><input type="number" id="jo-duree" min="18" max="45" value="' + (C.duree || 28) + '"></div>' +
      '<div class="champ"><label for="jo-regles">Durée des règles</label><input type="number" id="jo-regles" min="1" max="10" value="' + (C.regles || 5) + '"></div></div>' +
      '<div class="tb-actions"><button type="button" class="btn btn-trait" id="jo-enreg-cycle">Enregistrer</button><button type="button" class="btn btn-trait tb-danger" id="jo-arreter">Arrêter et effacer mon cycle</button></div></details>' +
      '<p class="tb-aide">Les saisons sont calculées d’après tes réglages : ce sont des repères approximatifs. Les dates de ton cycle restent sur cet appareil uniquement.</p>';
  }

  /* ---------- Événements ---------- */
  function brancher() {
    racine.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.hasAttribute('data-em')) { choix = b.getAttribute('data-em'); racine.querySelector('#jo-puces').innerHTML = puces(); return; }
      if (b.hasAttribute('data-zone')) { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true'); return; }
      if (b.hasAttribute('data-mois')) { moisVu = new Date(moisVu.getFullYear(), moisVu.getMonth() + (+b.getAttribute('data-mois')), 1); dessinerCal(); racine.querySelector('#jo-jourdetail').innerHTML = ''; return; }
      if (b.hasAttribute('data-jour')) {
        var j = b.getAttribute('data-jour'), l = E.filter(function (x) { return x.jour === j; }), ic = infoCycle(j);
        racine.querySelector('#jo-jourdetail').innerHTML = '<h4 class="jo-h4">' + esc(new Date(j + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })) + (ic ? ' · jour ' + ic.jour + ', ' + esc(SAISONS[ic.saison][0].toLowerCase()) : '') + '</h4>' +
          (l.length ? '<ul class="jo-liste-jour">' + l.map(function (x) { return ligneEntree(x, false); }).join('') + '</ul>' : '<p class="tb-aide">Rien de noté ce jour-là.</p>');
        return;
      }
      if (b.hasAttribute('data-suppr')) { if (!confirm('Effacer cette émotion de ton journal ?')) return; retirer(b.getAttribute('data-suppr')).then(function () { dessinerListe(); dessinerCal(); dessinerRevient(); }, function () { message('Elle n’a pas pu être effacée. Réessaie.', true); }); return; }
      if (b.id === 'jo-imprimer') { window.print(); return; }
      if (b.id === 'jo-activer') {
        if (!racine.querySelector('#jo-accord').checked) { message('Coche la case d’accord pour suivre ton cycle.', true); return; }
        var deb = racine.querySelector('#jo-debut').value; if (!deb) { message('Indique le premier jour de tes dernières règles.', true); return; }
        sauverCycle({ suivre: true, accord_le: new Date().toISOString(), debut: deb, duree: lim(+racine.querySelector('#jo-duree').value, 18, 45, 28), regles: lim(+racine.querySelector('#jo-regles').value, 1, 10, 5), debuts: [deb] })
          .then(function () { dessiner(); message('Ton cycle est relié à ton journal.'); }, function () { message('Le réglage n’a pas pu être enregistré. Réessaie.', true); });
        return;
      }
      if (b.id === 'jo-regles-auj') {
        var d = auj(), deb2 = (C.debuts || []).filter(function (x) { return x !== d; }).concat([d]).slice(-12), ecarts = [];
        for (var i = 1; i < deb2.length; i++) { var g = jours(deb2[i - 1], deb2[i]); if (g >= 18 && g <= 45) ecarts.push(g); }
        var duree = ecarts.length ? Math.round(ecarts.reduce(function (a, x) { return a + x; }, 0) / ecarts.length) : C.duree;
        sauverCycle(Object.assign({}, C, { debut: d, debuts: deb2, duree: duree })).then(function () { dessiner(); message('C’est noté : jour 1 de ton cycle.' + (ecarts.length ? ' Ta durée moyenne est de ' + duree + ' jours.' : '')); }, function () { message('Le réglage n’a pas pu être enregistré. Réessaie.', true); });
        return;
      }
      if (b.id === 'jo-enreg-cycle') {
        sauverCycle(Object.assign({}, C, { debut: racine.querySelector('#jo-debut').value || C.debut, duree: lim(+racine.querySelector('#jo-duree').value, 18, 45, 28), regles: lim(+racine.querySelector('#jo-regles').value, 1, 10, 5) }))
          .then(function () { dessiner(); message('Tes réglages sont enregistrés.'); }, function () { message('Le réglage n’a pas pu être enregistré. Réessaie.', true); });
        return;
      }
      if (b.id === 'jo-arreter') { if (!confirm('Arrêter de suivre ton cycle et effacer ses dates ? Tes émotions restent dans ton journal.')) return; effacerCycle().then(function () { dessiner(); message('Ton cycle n’est plus suivi, et ses dates sont effacées.'); }); return; }
    });
    racine.addEventListener('input', function (e) { if (e.target.id === 'jo-int') racine.querySelector('#jo-val').textContent = e.target.value; });
    racine.addEventListener('submit', function (e) {
      if (e.target.id !== 'jo-form') return; e.preventDefault();
      if (!choix) { message('Choisis d’abord une émotion.', true); return; }
      var zones = [].slice.call(racine.querySelectorAll('#jo-zones [aria-pressed="true"]')).map(function (b) { return b.getAttribute('data-zone'); });
      var j = racine.querySelector('#jo-jour').value || auj(); if (j > auj()) j = auj();
      var bt = e.target.querySelector('[type=submit]'); bt.disabled = true;
      ajouter({ jour: j, emotion: choix, intensite: +racine.querySelector('#jo-int').value, zones: zones, note: racine.querySelector('#jo-note').value.trim().slice(0, 600) || null, besoin: racine.querySelector('#jo-besoin').value.trim().slice(0, 200) || null })
        .then(function () { choix = null; dessiner(); message('C’est noté. Merci de t’être écouté·e.'); }, function () { bt.disabled = false; message('L’émotion n’a pas pu être enregistrée. Réessaie.', true); });
    });
  }
  function lim(v, a, b, d) { return v >= a && v <= b ? Math.round(v) : d; }

  window.GenesoliaJournal = {
    /* conteneur : élément où dessiner ; client, u : Supabase et l'utilisateur (ou null) */
    ouvrir: function (conteneur, client, u) {
      racine = conteneur; sb = client || null; user = u || null;
      if (!racine.dataset.branche) { brancher(); racine.dataset.branche = '1'; }
      racine.innerHTML = '<p class="tb-aide">Chargement de ton journal…</p>';
      return charger().catch(function () { mode = 'local'; E = lireL(CLE_L, []); C = lireL(CLE_C(), null); }).then(function () {
        if (prepare) { choix = prepare; prepare = null; }
        dessiner();
      });
    },
    preparer: function (cle) { prepare = cle; if (racine && racine.querySelector('#jo-puces')) { choix = cle; prepare = null; racine.querySelector('#jo-puces').innerHTML = puces(); } },
    aujourdhui: function () { var l = E.filter(function (x) { return x.jour === auj(); }); return l.map(function (x) { var f = trouver(x.emotion); return f ? { nom: f.nom, couleur: f.c.c } : null; }).filter(Boolean); },
    cycle: function () { var ic = infoCycle(auj()); return ic ? { jour: ic.jour, saison: SAISONS[ic.saison][0] } : null; },
    /* Pour l'export de « Mes données » */
    exporter: function () { return { emotions: E.map(function (x) { var f = trouver(x.emotion); return Object.assign({ emotion_nom: f ? f.nom : x.emotion }, x); }), cycle_sur_cet_appareil: C }; }
  };
})();
