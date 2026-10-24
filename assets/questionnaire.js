/* Genesolia · Questionnaire avant séance (questionnaire.html?q=<jeton>)
   La cliente d'une praticienne remplit, sans compte, sa famille proche : prénoms, dates, métiers, moments marquants
   et ce qu'elle en ressent. Les réponses partent une seule fois dans le dossier de la praticienne
   (fonctions questionnaire_ouvrir et questionnaire_envoyer, outils-internes/supabase-questionnaire.sql).
   Le brouillon reste sur cet appareil tant que ce n'est pas envoyé. Le format envoyé est celui que l'arbre sait importer. */
(function () {
  'use strict';
  var SB_URL = 'https://qsvzzkjtjsznfntahvvh.supabase.co', SB_KEY = 'sb_publishable_6iEVxXmtB_u1hJ6mPS9fNg_CJhLjYkg';
  var z = document.getElementById('gq'), sb = null;
  try { sb = window.supabase.createClient(SB_URL, SB_KEY, { auth: { persistSession: false, autoRefreshToken: false } }); } catch (e) {}
  var J = (new URLSearchParams(location.search).get('q') || '').toLowerCase();
  var CLE = 'genesolia-questionnaire-' + J;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* Les moments marquants proposés (mêmes types que dans l'arbre) */
  var EVTS = [['', 'Choisis…'], ['deuil', 'Deuil, perte d’un proche'], ['deces-precoce', 'Parent ou proche parti jeune'], ['rupture', 'Séparation, rupture'], ['abandon', 'Abandon, rejet'],
    ['secret', 'Secret de famille'], ['guerre', 'Guerre, exil'], ['demenagement', 'Départ, déracinement'], ['pauvrete', 'Manque d’argent'], ['faillite', 'Faillite, perte de biens'],
    ['perte-emploi', 'Perte d’emploi'], ['heritage', 'Héritage conflictuel'], ['sacrifice', 'Sacrifice, effacement'], ['injustice', 'Injustice'], ['trahison', 'Trahison'], ['honte', 'Honte'],
    ['maladie', 'Épreuve majeure'], ['mariage', 'Mariage, union'], ['naissance', 'Naissance d’un enfant'], ['ascension', 'Ascension sociale'], ['reussite', 'Réussite, tournant heureux']];

  /* Les personnes : clés comprises par l'arbre (toi, m = ta mère, p = ton père, mm = la mère de ta mère…) */
  var GP = [['mm', 'La mère de ta mère', 'f'], ['mp', 'Le père de ta mère', 'm'], ['pm', 'La mère de ton père', 'f'], ['pp', 'Le père de ton père', 'm']];
  var etat = { people: {}, fratrie: 1, enfants: 0, conjoint: false, couple: '', general: {} };

  function lire() { try { var d = JSON.parse(localStorage.getItem(CLE) || 'null'); if (d && d.people) etat = d; } catch (e) {} }
  var minut = null;
  function garder() {
    clearTimeout(minut);
    minut = setTimeout(function () {
      try { localStorage.setItem(CLE, JSON.stringify(etat)); var s = z.querySelector('.gq-sauve'); if (s) s.textContent = 'Brouillon gardé sur cet appareil à ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) + '.'; } catch (e) {}
    }, 400);
  }

  /* Dates : « 12/03/1958 », « 1958 » ou « vers 1958 » */
  function pad(n) { n = String(n); return n.length < 2 ? '0' + n : n; }
  function normDate(v) {
    v = String(v || '').trim(); if (!v) return '';
    var m, an = new Date().getFullYear() + 1;
    function ok(y, mo, d) { var t = new Date(+y, +mo - 1, +d); return +y >= 1500 && +y <= an && t.getFullYear() === +y && t.getMonth() === +mo - 1 && t.getDate() === +d; }
    if ((m = v.match(/^(\d{1,2})[\/.\- ](\d{1,2})[\/.\- ](\d{4})$/))) return ok(m[3], m[2], m[1]) ? m[3] + '-' + pad(m[2]) + '-' + pad(m[1]) : null;
    if ((m = v.match(/^(?:vers\s+|env\.?\s*|~\s*)?(\d{4})$/i))) return (+m[1] >= 1500 && +m[1] <= an) ? m[1] : null;
    return null;
  }

  function champ(k, c, lib, aide, place) {
    var v = ((etat.people[k] || {})[c]) || '';
    return '<label><span>' + lib + (aide ? ' <small>' + aide + '</small>' : '') + '</span><input type="text" data-p="' + k + '" data-c="' + c + '" maxlength="' + (c === 'notes' ? 2000 : 80) + '" value="' + esc(v) + '"' + (place ? ' placeholder="' + esc(place) + '"' : '') + (c === 'naiss' || c === 'deces' ? ' inputmode="text" autocomplete="off"' : '') + '></label>';
  }
  function evts(k) {
    var l = (etat.people[k] || {}).events || [];
    return '<div class="gq-evts" data-evts="' + k + '">' + l.map(function (e, i) {
      return '<div class="gq-evt"><select data-e="' + k + '" data-i="' + i + '" data-k="type" aria-label="Le moment">' + EVTS.map(function (x) { return '<option value="' + x[0] + '"' + (e.type === x[0] ? ' selected' : '') + '>' + esc(x[1]) + '</option>'; }).join('') + '</select>' +
        '<input type="text" inputmode="numeric" maxlength="3" data-e="' + k + '" data-i="' + i + '" data-k="age" value="' + esc(e.age || '') + '" placeholder="Âge" aria-label="À quel âge">' +
        '<input type="text" maxlength="200" data-e="' + k + '" data-i="' + i + '" data-k="note" value="' + esc(e.note || '') + '" placeholder="En quelques mots (facultatif)" aria-label="En quelques mots">' +
        '<button type="button" class="gq-x" data-retirer="' + k + '" data-i="' + i + '" aria-label="Retirer ce moment">×</button></div>';
    }).join('') + (l.length < 8 ? '<button type="button" class="gq-plus" data-ajouter="' + k + '">+ Un moment marquant</button>' : '') + '</div>';
  }
  function personne(k, titre, sexe, o) {
    o = o || {};
    var p = etat.people[k] || (etat.people[k] = {});
    if (sexe && !p.sex) p.sex = sexe;
    var nom = [p.prenom, p.nom].filter(Boolean).join(' ');
    return '<details class="gq-pers" data-pers="' + k + '"' + (o.ouvert ? ' open' : '') + '><summary><span>' + esc(titre) + (nom ? ' <small>· ' + esc(nom) + '</small>' : '') + '</span></summary><div class="gq-corps">' +
      '<div class="gq-grille">' + champ(k, 'prenom', 'Prénom') + champ(k, 'nom', 'Nom', o.moi ? '' : '(de naissance)') + '</div>' +
      (!sexe ? '<label>' + (o.moi ? 'Tu es' : 'C’est') + '<select data-p="' + k + '" data-c="sex"><option value="">Choisis…</option><option value="f"' + (p.sex === 'f' ? ' selected' : '') + '>' + (o.moi ? 'une femme' : 'une fille, une femme') + '</option><option value="m"' + (p.sex === 'm' ? ' selected' : '') + '>' + (o.moi ? 'un homme' : 'un garçon, un homme') + '</option><option value="u"' + (p.sex === 'u' ? ' selected' : '') + '>Je préfère ne pas préciser</option></select></label>' : '') +
      '<div class="gq-grille">' + champ(k, 'naiss', 'Né·e le', '(ou l’année)', 'jj/mm/aaaa ou 1958') + champ(k, 'lieu', 'Où', '(ville, pays)') + '</div>' +
      champ(k, 'metier', 'Métier ou activité') +
      (o.moi ? '' : '<label class="gq-case"><input type="checkbox" data-p="' + k + '" data-c="decede"' + (p.decede ? ' checked' : '') + '> Décédé·e</label>' +
        '<div data-deces="' + k + '"' + (p.decede ? '' : ' hidden') + '>' + champ(k, 'deces', 'Décédé·e le', '(ou l’année)', 'jj/mm/aaaa ou 1990') + '</div>') +
      '<div><p style="margin:0 0 .4rem;font-weight:600;font-size:.9rem">' + (o.moi ? 'Les moments marquants de ta vie' : 'Les moments marquants de sa vie') + ' <small style="font-weight:400;color:var(--prune-doux)">(avec l’âge, même approximatif)</small></p>' + evts(k) + '</div>' +
      '<label>' + (o.moi ? 'Ce que tu ressens en pensant à ton histoire familiale' : 'Ce que tu sais de cette personne, et ce que tu ressens pour elle') + '<textarea data-p="' + k + '" data-c="notes" maxlength="2000">' + esc(p.notes || '') + '</textarea></label>' +
      (o.retirer ? '<button type="button" class="gq-plus" data-enlever="' + k + '">Retirer cette personne</button>' : '') +
      '</div></details>';
  }

  function formulaire(cabinet) {
    var h = '<p class="gq-etiq">Avant ta séance' + (cabinet ? ' avec ' + esc(cabinet) : '') + '</p><h1>Ton histoire familiale, en quelques pages</h1>' +
      '<p class="gq-intro">' + (cabinet ? esc(cabinet) + ' t’a envoyé ce questionnaire' : 'Ton·ta praticien·ne t’a envoyé ce questionnaire') + ' pour préparer votre séance. Note ce que tu sais, à ton rythme : tes réponses arriveront dans son espace, et ton arbre sera déjà dessiné quand vous vous verrez.</p>' +
      '<div class="gq-astuce"><b>Une case vide est une information.</b> Laisse vide ce que tu ne sais pas, et écris « on m’a dit que… » quand c’est un récit plutôt qu’un fait. Ton brouillon reste sur cet appareil jusqu’à l’envoi : tu peux revenir plus tard avec le même lien.</div>';
    h += '<section class="gq-carte"><h2>Toi</h2><p>Commence par toi.</p>' + personne('toi', 'Toi', '', { moi: true, ouvert: true }) + '</section>';
    h += '<section class="gq-carte"><h2>Tes parents</h2><p>Les parents qui t’ont donné la vie. Si tu ne les connais pas, laisse vide : c’est une information aussi.</p>' +
      personne('m', 'Ta mère', 'f', { ouvert: true }) + personne('p', 'Ton père', 'm') +
      '<label>Tes parents sont, ou étaient<select data-couple><option value="">Je ne sais pas</option>' + [['marie', 'mariés ou pacsés'], ['union', 'en couple sans être mariés'], ['separe', 'séparés'], ['divorce', 'divorcés']].map(function (x) { return '<option value="' + x[0] + '"' + (etat.couple === x[0] ? ' selected' : '') + '>' + x[1] + '</option>'; }).join('') + '</select></label></section>';
    h += '<section class="gq-carte"><h2>Tes grands-parents</h2><p>Ce que tu sais d’eux, même peu : une date, un métier, une phrase qu’on répétait.</p>' + GP.map(function (g) { return personne(g[0], g[1], g[2]); }).join('') + '</section>';
    h += '<section class="gq-carte"><h2>Tes frères et sœurs</h2><p>Avec les mêmes parents que toi. Compte aussi ceux qui ne sont pas nés ou sont partis tôt, si tu le sais.</p>';
    for (var i = 1; i <= etat.fratrie; i++) h += personne('f' + i, 'Frère ou sœur ' + i, '', { retirer: true });
    h += (etat.fratrie < 8 ? '<button type="button" class="gq-plus" data-plus="fratrie">+ Un frère ou une sœur</button>' : '') + '</section>';
    h += '<section class="gq-carte"><h2>Ton couple et tes enfants</h2><p>Si tu le souhaites.</p>' +
      (etat.conjoint ? personne('c1', 'Ton·ta conjoint·e', '', { retirer: true }) : '<button type="button" class="gq-plus" data-plus="conjoint">+ Ton·ta conjoint·e</button> ');
    for (var e = 1; e <= etat.enfants; e++) h += personne('e' + e, 'Ton enfant ' + e, '', { retirer: true });
    h += (etat.enfants < 8 ? '<button type="button" class="gq-plus" data-plus="enfants">+ Un enfant</button>' : '') + '</section>';
    var G = etat.general || {};
    h += '<section class="gq-carte"><h2>Pour finir</h2><p>Trois questions ouvertes, toutes facultatives.</p><div style="display:grid;gap:.8rem">' +
      '<label>Ce qui te semble se répéter dans ta famille<textarea data-g="repete" maxlength="2000">' + esc(G.repete || '') + '</textarea></label>' +
      '<label>Ce qui t’amène à cet accompagnement, aujourd’hui<textarea data-g="attente" maxlength="2000">' + esc(G.attente || '') + '</textarea></label>' +
      '<label><span>Ce dont on ne parle pas dans ta famille <small>(si tu veux en dire un mot)</small></span><textarea data-g="silences" maxlength="2000">' + esc(G.silences || '') + '</textarea></label></div></section>';
    h += '<div class="gq-fin"><button class="btn btn-plein" type="button" data-envoyer style="width:100%">Envoyer mes réponses' + (cabinet ? ' à ' + esc(cabinet) : '') + '</button><p class="gq-err" role="alert"></p><p class="gq-sauve"></p>' +
      '<p class="gq-sauve">Tes réponses ne sont lues que par ' + (cabinet ? esc(cabinet) : 'ton·ta praticien·ne') + '. Elles sont hébergées en Europe (Irlande). Tu ne pourras plus les modifier après l’envoi.</p></div>';
    var ouverts = [].map.call(z.querySelectorAll('details[open]'), function (d) { return d.getAttribute('data-pers'); });
    z.innerHTML = h;
    ouverts.forEach(function (k) { var d = z.querySelector('details[data-pers="' + k + '"]'); if (d) d.open = true; });
  }

  /* Les réponses, au format que l'arbre importe : { people: { toi, m, p, mm… }, rels: [...] } */
  function resultat() {
    var people = {}, rels = [];
    Object.keys(etat.people).forEach(function (k) {
      if (/^f\d+$/.test(k) && +k.slice(1) > etat.fratrie) return;
      if (/^e\d+$/.test(k) && +k.slice(1) > etat.enfants) return;
      if (k === 'c1' && !etat.conjoint) return;
      var s = etat.people[k], ev = (s.events || []).filter(function (e) { return e.type; });
      var plein = ['prenom', 'nom', 'naiss', 'deces', 'metier', 'lieu', 'notes'].some(function (c) { return String(s[c] || '').trim(); }) || ev.length || s.decede;
      if (!plein && k !== 'toi') return;
      var notes = String(s.notes || '').trim(), nt = ev.filter(function (e) { return String(e.note || '').trim(); }).map(function (e) { return (e.age ? 'À ' + e.age + ' ans' : 'Un moment') + ' : ' + String(e.note).trim(); });
      if (nt.length) notes = (notes ? notes + '\n' : '') + nt.join('\n');
      people[k] = { prenom: String(s.prenom || '').trim(), nom: String(s.nom || '').trim(), sex: s.sex || 'u', naiss: normDate(s.naiss) || '', deces: s.decede ? (normDate(s.deces) || '') : '', decede: !!s.decede,
        metier: String(s.metier || '').trim(), lieu: String(s.lieu || '').trim(), notes: notes ? 'Questionnaire avant séance :\n' + notes : '',
        events: ev.map(function (e) { var a = parseInt(e.age, 10); return a >= 0 && a < 130 ? { type: e.type, age: String(a) } : { type: e.type }; }) };
    });
    function enfantDe(k) { return k.length === 1 ? 'toi' : k.slice(0, -1); }
    Object.keys(people).filter(function (k) { return /^[pm]{1,2}$/.test(k); }).forEach(function (k) { if (people[enfantDe(k)]) rels.push({ from: k, to: enfantDe(k), type: 'parent' }); });
    if (people.p && people.m) rels.push({ from: 'p', to: 'm', type: 'couple', statut: etat.couple || 'union' });
    if (people.pp && people.pm) rels.push({ from: 'pp', to: 'pm', type: 'couple', statut: 'marie' });
    if (people.mp && people.mm) rels.push({ from: 'mp', to: 'mm', type: 'couple', statut: 'marie' });
    Object.keys(people).filter(function (k) { return /^f\d+$/.test(k); }).forEach(function (k) {
      var par = ['m', 'p'].filter(function (x) { return people[x]; });
      if (par.length) par.forEach(function (x) { rels.push({ from: x, to: k, type: 'parent' }); }); else rels.push({ from: 'toi', to: k, type: 'fratrie' });
    });
    if (people.c1) rels.push({ from: 'toi', to: 'c1', type: 'couple', statut: 'union' });
    Object.keys(people).filter(function (k) { return /^e\d+$/.test(k); }).forEach(function (k) { rels.push({ from: 'toi', to: k, type: 'parent' }); if (people.c1) rels.push({ from: 'c1', to: k, type: 'parent' }); });
    var G = etat.general || {}, gen = {};
    ['repete', 'attente', 'silences'].forEach(function (c) { var v = String(G[c] || '').trim(); if (v) gen[c] = v.slice(0, 2000); });
    return { v: 1, people: people, rels: rels, general: gen };
  }

  function erreurs() {
    var faux = [];
    [].forEach.call(z.querySelectorAll('input[data-c=naiss],input[data-c=deces]'), function (i) {
      var bad = i.value.trim() && normDate(i.value) === null && !i.closest('[hidden]');
      i.classList.toggle('gq-faux', !!bad); if (bad) faux.push(i);
    });
    return faux;
  }

  function evenements() {
    z.addEventListener('input', function (e) {
      var t = e.target, k;
      if ((k = t.getAttribute('data-p'))) {
        var c = t.getAttribute('data-c'), p = etat.people[k] || (etat.people[k] = {});
        p[c] = t.type === 'checkbox' ? t.checked : t.value;
        if (c === 'decede') { var d = z.querySelector('[data-deces="' + k + '"]'); if (d) d.hidden = !t.checked; }
        if (c === 'prenom' || c === 'nom') { var sm = t.closest('details').querySelector('summary span'); var nm = [p.prenom, p.nom].filter(Boolean).join(' '); sm.innerHTML = esc(sm.firstChild.textContent.replace(/\s*$/, '')) + (nm ? ' <small>· ' + esc(nm) + '</small>' : ''); }
      } else if ((k = t.getAttribute('data-e'))) {
        var l = etat.people[k].events, i = +t.getAttribute('data-i'); if (l[i]) l[i][t.getAttribute('data-k')] = t.value;
      } else if ((k = t.getAttribute('data-g'))) { etat.general = etat.general || {}; etat.general[k] = t.value; }
      else if (t.hasAttribute('data-couple')) etat.couple = t.value;
      garder();
    });
    z.addEventListener('focusout', function (e) { if (e.target.matches('input[data-c=naiss],input[data-c=deces]')) erreurs(); });
    z.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var k;
      if ((k = b.getAttribute('data-ajouter'))) { var p = etat.people[k] || (etat.people[k] = {}); (p.events = p.events || []).push({ type: '', age: '' }); z.querySelector('[data-evts="' + k + '"]').outerHTML = evts(k); garder(); }
      else if ((k = b.getAttribute('data-retirer'))) { etat.people[k].events.splice(+b.getAttribute('data-i'), 1); z.querySelector('[data-evts="' + k + '"]').outerHTML = evts(k); garder(); }
      else if ((k = b.getAttribute('data-plus'))) {
        var nk = k === 'fratrie' ? 'f' + (++etat.fratrie) : k === 'enfants' ? 'e' + (++etat.enfants) : (etat.conjoint = true, 'c1');
        delete etat.people[nk]; formulaire(CAB); var d = z.querySelector('details[data-pers="' + nk + '"]'); if (d) { d.open = true; d.scrollIntoView({ block: 'center' }); } garder();
      }
      else if ((k = b.getAttribute('data-enlever'))) {
        if (!confirm('Retirer cette personne du questionnaire ?')) return;
        if (k === 'c1') { etat.conjoint = false; delete etat.people.c1; }
        else {   /* on décale les suivants pour garder f1, f2… sans trou */
          var lettre = k[0], n = +k.slice(1), max = lettre === 'f' ? etat.fratrie : etat.enfants;
          for (var i = n; i < max; i++) etat.people[lettre + i] = etat.people[lettre + (i + 1)] || {};
          delete etat.people[lettre + max];
          if (lettre === 'f') etat.fratrie--; else etat.enfants--;
        }
        formulaire(CAB); garder();
      }
      else if (b.hasAttribute('data-envoyer')) envoyer(b);
    });
  }

  function envoyer(b) {
    var err = z.querySelector('.gq-err'); err.textContent = '';
    var faux = erreurs();
    if (faux.length) { err.textContent = 'Une date n’est pas comprise. Écris-la ainsi : 12/03/1958, ou seulement l’année.'; var d = faux[0].closest('details'); if (d) d.open = true; faux[0].focus(); return; }
    var r = resultat();
    if (!r.people.toi || !r.people.toi.prenom) { err.textContent = 'Indique au moins ton prénom.'; var dt = z.querySelector('details[data-pers=toi]'); dt.open = true; dt.querySelector('input').focus(); return; }
    if (!confirm('Envoyer tes réponses ? Tu ne pourras plus les modifier ensuite.')) return;
    b.disabled = true; b.textContent = 'Envoi…';
    sb.rpc('questionnaire_envoyer', { p_jeton: J, p_reponses: r }).then(function (x) {
      var d = x && x.data;
      if (x.error || !d || d.erreur) {
        b.disabled = false; b.textContent = 'Envoyer mes réponses';
        err.textContent = d && d.erreur === 'deja' ? 'Ce questionnaire a déjà été envoyé.' : d && d.erreur === 'lien' ? 'Ce lien n’est plus valable. Demande un nouveau lien.' : d && d.erreur === 'trop-long' ? 'Tes réponses sont trop longues. Raccourcis un peu les textes.' : 'L’envoi n’a pas abouti. Vérifie ta connexion et réessaie : ton brouillon est gardé.';
        return;
      }
      try { localStorage.removeItem(CLE); } catch (e) {}
      merci(true);
    }, function () { b.disabled = false; b.textContent = 'Envoyer mes réponses'; err.textContent = 'L’envoi n’a pas abouti. Vérifie ta connexion et réessaie : ton brouillon est gardé.'; });
  }
  function merci(maintenant) {
    z.innerHTML = '<div class="gq-carte gq-merci"><p class="gq-etiq">Avant ta séance</p><h1>' + (maintenant ? 'Merci, c’est envoyé' : 'Ce questionnaire est déjà envoyé') + '</h1><p class="gq-intro" style="margin:0">' +
      (CAB ? esc(CAB) : 'Ton·ta praticien·ne') + ' retrouvera tes réponses dans son espace, et ton arbre sera prêt pour votre séance. ' + (maintenant ? 'Tu peux fermer cette page.' : '') + '</p></div>';
  }

  var CAB = '';
  if (!sb || !/^[0-9a-f-]{36}$/.test(J)) { z.innerHTML = '<div class="gq-carte"><h1>Ce lien n’est pas complet</h1><p class="gq-intro" style="margin:0">Ouvre le lien exact reçu de ton·ta praticien·ne.</p></div>'; return; }
  sb.rpc('questionnaire_ouvrir', { p_jeton: J }).then(function (x) {
    var d = x && x.data;
    if (x.error || !d || d.erreur) { z.innerHTML = '<div class="gq-carte"><h1>Ce lien n’est plus valable</h1><p class="gq-intro" style="margin:0">Il a expiré ou a été désactivé. Demande un nouveau lien à ton·ta praticien·ne.</p></div>'; return; }
    CAB = d.cabinet || '';
    if (d.rempli) { merci(false); return; }
    lire(); formulaire(CAB); evenements();
  }, function () { z.innerHTML = '<div class="gq-carte"><h1>Le questionnaire n’a pas pu s’ouvrir</h1><p class="gq-intro" style="margin:0">Vérifie ta connexion et recharge la page.</p></div>'; });
})();
