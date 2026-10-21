/* Genesolia · « Ta vie en réel » : la situation de la semaine, le vote « Ça t'est déjà arrivé ? », la question de la semaine
   et la bibliothèque filtrable. Les situations viennent de assets/vie-en-reel/situations.js.
   Le vote est anonyme : un identifiant au hasard, gardé dans ce navigateur, évite de voter deux fois pour la même situation.
   Aucun compte, aucun e-mail, aucune adresse IP enregistrée. Si la table des votes n'existe pas encore, le vote reste local. */
(function () {
  'use strict';
  var SB_URL = 'https://qsvzzkjtjsznfntahvvh.supabase.co', SB_KEY = 'sb_publishable_6iEVxXmtB_u1hJ6mPS9fNg_CJhLjYkg';
  var TOUTES = window.GENESOLIA_SITUATIONS || [], THEMES = window.GENESOLIA_THEMES || {};
  var REPONSES = [['oui', 'Oui'], ['plusieurs', 'Plusieurs fois'], ['ma-vie', 'C’est ma vie']];
  var qs = new URLSearchParams(location.search), JEUNES = qs.has('18-25');

  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; })
      .replace(/ ([:;?!»])/g, ' $1').replace(/« /g, '« ');
  }
  function lire(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function ecrire(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function aujourdhui() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function navigateur() {
    var id = lire('vie-reel-nav', null);
    if (!id || !/^[0-9a-f-]{36}$/.test(id)) {
      id = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); });
      ecrire('vie-reel-nav', id);
    }
    return id;
  }
  function copier(t, b) {
    var fini = function () { var a = b.textContent; b.textContent = 'Copié'; setTimeout(function () { b.textContent = a; }, 1600); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(t).then(fini, function () { window.prompt('Copie ce texte :', t); });
    else window.prompt('Copie ce texte :', t);
  }

  /* Ce qui est publié : sans date (premier lot) ou dont le lundi est arrivé */
  var jour = aujourdhui();
  var publiees = TOUTES.filter(function (s) { return !s.semaine || s.semaine <= jour; });
  var datees = publiees.filter(function (s) { return s.semaine; }).sort(function (a, b) { return a.semaine < b.semaine ? 1 : -1; });
  var semaine = datees[0] || publiees[0];

  /* ───────── Une situation, en entier ───────── */
  function themesHTML(s) { return '<div class="vr-themes">' + (s.themes || []).map(function (t) { return '<span>' + esc(THEMES[t] || t) + '</span>'; }).join('') + '</div>'; }
  function corps(s) {
    var h = '';
    if (s.sms && s.sms.length) h += '<div class="vr-sms" aria-label="L’échange">' + s.sms.map(function (m) { return '<p class="' + (m[0] === 'moi' ? 'moi' : 'autre') + '">' + esc(m[1]) + '</p>'; }).join('') + '</div>';
    h += '<div class="vr-part"><h3>Ce qui se joue</h3><p>' + esc(s.joue) + '</p></div>';
    if (s.lignee) h += '<div class="vr-part"><h3>Ce qui se rejoue peut-être dans ta famille</h3><p>' + esc(s.lignee) + '</p></div>';
    else if (s.question) h += '<div class="vr-part"><h3>La question à te poser</h3><p>' + esc(s.question) + '</p></div>';
    h += '<div class="vr-part vr-geste"><h3>Un geste pour aujourd’hui</h3><p>' + esc(s.geste) + '</p></div>';
    if (s.mots) h += '<div class="vr-part"><h3>Les mots pour le dire</h3><p class="vr-copie">' + esc(s.mots) + '</p><button class="vr-copier" type="button" data-copier="' + esc(s.mots) + '">Copier</button></div>';
    if (s.famille) h += '<div class="vr-part"><h3>Et dans ta famille ?</h3><p class="vr-copie">' + esc(s.famille) + '</p><button class="vr-copier" type="button" data-copier="' + esc(s.famille) + '">Copier</button><p style="font-size:.84rem;margin-top:.4rem">À envoyer à ta mère, ton père ou ta grand-mère, en changeant les mots si besoin. Seulement si tu te sens en sécurité pour le faire.</p></div>';
    h += '<div class="vr-vote" data-vote="' + esc(s.id) + '"><h3>Ça t’est déjà arrivé ?</h3><div class="vr-vote-bt" role="group" aria-label="Ça t’est déjà arrivé ?">' +
      REPONSES.map(function (r) { return '<button type="button" data-rep="' + r[0] + '" aria-pressed="false">' + r[1] + '</button>'; }).join('') + '</div><div class="vr-resultat" aria-live="polite"></div></div>';
    h += '<p class="vr-cercle-ligne">Ça se répète encore, et tu veux comprendre pourquoi ? <a href="abonnement.html">Le Cercle</a> t’accompagne chaque mois pour voir ce qui se rejoue et faire autrement. Le 1er mois est offert.</p>';
    return h;
  }

  /* ───────── Votes ───────── */
  var mesVotes = lire('vie-reel-votes', {}), totaux = {};
  function majVote(zone) {
    var id = zone.getAttribute('data-vote'), mien = mesVotes[id], t = totaux[id];
    zone.querySelectorAll('[data-rep]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-rep') === mien)); b.disabled = !!mien; });
    var res = zone.querySelector('.vr-resultat');
    if (!t) { res.innerHTML = mien ? '<p class="vr-total">Merci pour ta réponse.</p>' : '<p class="vr-total">Réponds en un clic : c’est anonyme.</p>'; return; }
    var n = t.oui + t.plusieurs + t.ma_vie;
    if (!n) { res.innerHTML = '<p class="vr-total">Sois la première personne à répondre. C’est anonyme.</p>'; return; }
    res.innerHTML = '<p class="vr-total"><b>' + n + '</b> personne' + (n > 1 ? 's ont' : ' a') + ' répondu' + (mien ? ', avec toi' : '') + '.</p><div class="vr-barres">' +
      REPONSES.map(function (r) { var v = t[r[0] === 'ma-vie' ? 'ma_vie' : r[0]], p = Math.round(v / n * 100); return '<div class="vr-barre"><span>' + r[1] + '</span><i><b style="width:' + p + '%"></b></i><span>' + p + ' %</span></div>'; }).join('') + '</div>';
  }
  function chargerTotaux(ids) {
    if (!ids.length) return Promise.resolve();
    return fetch(SB_URL + '/rest/v1/rpc/situation_totaux', { method: 'POST', headers: { apikey: SB_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ p_ids: ids }) })
      .then(function (r) { return r.ok ? r.json() : null; }).then(function (l) {
        if (!Array.isArray(l)) return;
        ids.forEach(function (id) { totaux[id] = { oui: 0, plusieurs: 0, ma_vie: 0 }; });
        l.forEach(function (x) { totaux[x.situation] = { oui: +x.oui, plusieurs: +x.plusieurs, ma_vie: +x.ma_vie }; });
      }).catch(function () {});
  }
  function voter(zone, rep) {
    var id = zone.getAttribute('data-vote');
    if (mesVotes[id]) return;
    mesVotes[id] = rep; ecrire('vie-reel-votes', mesVotes);
    if (totaux[id]) totaux[id][rep === 'ma-vie' ? 'ma_vie' : rep]++;
    majVote(zone);
    fetch(SB_URL + '/rest/v1/votes_situations', { method: 'POST', headers: { apikey: SB_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify({ situation: id, reponse: rep, navigateur: navigateur() }) })
      .then(function () { return chargerTotaux([id]); }).then(function () { majVote(zone); }).catch(function () {});
  }
  function brancher(racine) {
    racine.querySelectorAll('[data-vote]').forEach(function (z) {
      majVote(z);
      chargerTotaux([z.getAttribute('data-vote')]).then(function () { majVote(z); });
    });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-rep]'); if (b) { voter(b.closest('[data-vote]'), b.getAttribute('data-rep')); return; }
    var c = e.target.closest('[data-copier]'); if (c) copier(c.getAttribute('data-copier'), c);
  });

  /* ───────── La situation de la semaine et sa question ───────── */
  var zs = document.getElementById('semaine');
  if (semaine) {
    zs.innerHTML = '<span class="vr-badge">Cette semaine</span>' + themesHTML(semaine) + '<h2 class="vr-titre" id="' + esc(semaine.id) + '">« ' + esc(semaine.titre) + ' »</h2>' + corps(semaine);
    brancher(zs);
    if (semaine.question && semaine.lignee) {
      document.getElementById('question-semaine').innerHTML = '<div class="vr-question"><p class="vr-etiq">La question de la semaine</p><p class="q">' + esc(semaine.question) + '</p>' +
        '<p>Note la réponse dans ton fil d’or : c’est là que les répétitions de ta famille deviennent visibles, génération après génération.</p><a class="btn" href="fil-d-or.html">Ouvrir mon fil d’or</a></div>';
    }
  } else zs.innerHTML = '<p class="vr-vide">La première situation arrive très vite.</p>';

  /* ───────── La bibliothèque ───────── */
  var biblio = publiees.filter(function (s) { return s !== semaine; });
  if (JEUNES) biblio.sort(function (a, b) { return (b.jeunes ? 1 : 0) - (a.jeunes ? 1 : 0); });
  else biblio.sort(function (a, b) { return (b.semaine || '') < (a.semaine || '') ? -1 : (b.semaine || '') > (a.semaine || '') ? 1 : 0; });
  var presents = {}; biblio.forEach(function (s) { (s.themes || []).forEach(function (t) { presents[t] = 1; }); });
  var filtre = 'tout', zf = document.getElementById('filtres'), zl = document.getElementById('liste');
  zf.innerHTML = '<button type="button" data-f="tout" aria-pressed="true">Tout</button>' + Object.keys(THEMES).filter(function (t) { return presents[t]; }).map(function (t) { return '<button type="button" data-f="' + t + '" aria-pressed="false">' + esc(THEMES[t]) + '</button>'; }).join('');
  function dessinerListe() {
    var l = biblio.filter(function (s) { return filtre === 'tout' || (s.themes || []).indexOf(filtre) >= 0; });
    zl.innerHTML = l.length ? l.map(function (s) {
      return '<li class="vr-item" id="' + esc(s.id) + '"><button type="button" aria-expanded="false" aria-controls="c-' + esc(s.id) + '"><small>' + esc((s.themes || []).map(function (t) { return THEMES[t] || t; }).join(' · ')) + '</small><span>« ' + esc(s.titre) + ' »</span></button><div class="vr-corps" id="c-' + esc(s.id) + '" hidden></div></li>';
    }).join('') : '<li class="vr-vide">Pas encore de situation dans ce thème.</li>';
  }
  function ouvrir(li, defiler) {
    var b = li.querySelector(':scope > button'), c = li.querySelector('.vr-corps'), ouvert = b.getAttribute('aria-expanded') === 'true';
    zl.querySelectorAll('.vr-item > button[aria-expanded="true"]').forEach(function (x) { if (x !== b) { x.setAttribute('aria-expanded', 'false'); x.nextElementSibling.hidden = true; } });
    if (ouvert) { b.setAttribute('aria-expanded', 'false'); c.hidden = true; return; }
    var s = biblio.filter(function (x) { return x.id === li.id; })[0]; if (!s) return;
    if (!c.innerHTML) { c.innerHTML = corps(s); brancher(c); }
    b.setAttribute('aria-expanded', 'true'); c.hidden = false;
    if (defiler) li.scrollIntoView({ block: 'start', behavior: 'smooth' });
    try { history.replaceState(null, '', location.pathname + location.search + '#' + li.id); } catch (e) {}
  }
  zf.addEventListener('click', function (e) {
    var b = e.target.closest('[data-f]'); if (!b) return;
    filtre = b.getAttribute('data-f');
    zf.querySelectorAll('[data-f]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    dessinerListe();
  });
  zl.addEventListener('click', function (e) { var b = e.target.closest('.vr-item > button'); if (b) ouvrir(b.parentNode, true); });
  dessinerListe();
  /* Lien direct vers une situation : ta-vie-en-reel.html#id */
  var h = decodeURIComponent((location.hash || '').slice(1));
  if (h && semaine && h === semaine.id) setTimeout(function () { zs.scrollIntoView({ block: 'start' }); }, 50);
  else if (h) { var li = document.getElementById(h); if (li && li.classList.contains('vr-item')) setTimeout(function () { ouvrir(li, true); }, 50); else if (li) setTimeout(function () { li.scrollIntoView({ block: 'start' }); }, 120); }   /* #conflit, #phrases… : la page a grandi pendant le rendu, on revient au bon endroit */

  /* ───────── « Et toi ? » : rien n'est enregistré ───────── */
  var bt = document.getElementById('toi-copier');
  if (bt) bt.addEventListener('click', function () {
    var t = [['Ce qui se répète pour moi', 'toi-repete'], ['Ce que je ne vois peut-être pas encore', 'toi-vois'], ['Dans ma famille', 'toi-famille']]
      .map(function (x) { var v = document.getElementById(x[1]).value.trim(); return v ? x[0] + ' : ' + v : ''; }).filter(Boolean).join('\n\n');
    if (!t) { bt.textContent = 'Écris d’abord quelques mots'; setTimeout(function () { bt.textContent = 'Copier ce que j’ai écrit'; }, 1800); return; }
    copier(t, bt);
  });
})();
