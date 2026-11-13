/* Genesolia · « Ta carte de naissance » sur l'accueil : un petit voyage en écrans
   (textes d'accueil, puis date de naissance, puis chemin de vie + signe + échos familiaux).
   Autonome : s'injecte dans #pdn-zone, calculs faits sur l'appareil, rien n'est envoyé. */
(function () {
  var zone = document.getElementById('pdn-zone');
  if (!zone) return;

  var css = '.pdn{max-width:38rem;margin-inline:auto;background:#fff;border:1px solid var(--champagne-clair);border-radius:22px;padding:2rem 1.6rem;box-shadow:0 20px 50px rgba(107,47,91,.1)}' +
    '.pdn-pas{display:flex;gap:5px;justify-content:center;margin-bottom:1.2rem}.pdn-pas span{width:22px;height:3px;border-radius:2px;background:var(--champagne-clair)}.pdn-pas span.fait{background:var(--champagne)}' +
    '.pdn-ecran{display:none;text-align:center}.pdn-ecran.actif{display:block;animation:pdnfade .6s ease}@keyframes pdnfade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}' +
    '.pdn-sur{font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:var(--champagne);font-weight:700;margin:0 0 .6rem}' +
    '.pdn-ecran h3{font-family:var(--display);font-weight:400;font-size:clamp(1.25rem,2.6vw,1.6rem);line-height:1.3;margin:0 0 .8rem;color:var(--prune)}' +
    '.pdn-ecran p{color:var(--prune-doux);margin:0 0 1rem}' +
    '.pdn-form{text-align:left}.pdn-form label{display:block;font-size:.85rem;color:var(--prune-doux);margin:0 0 .3rem}' +
    '.pdn-form input{width:100%;font:inherit;padding:.6rem .8rem;border:1px solid var(--champagne-clair);border-radius:12px;background:#FFFBF9;color:var(--prune);margin-bottom:.9rem}' +
    '.pdn-ligne{display:grid;grid-template-columns:1fr 1fr;gap:.8rem}@media (max-width:560px){.pdn-ligne{grid-template-columns:1fr}}' +
    '.pdn-res{background:#FDF5F3;border:1px solid var(--champagne-clair);border-radius:14px;padding:1rem 1.1rem;margin-bottom:.8rem;text-align:left}' +
    '.pdn-res b{display:block;font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;color:var(--champagne)}' +
    '.pdn-res strong{font-family:var(--display);font-weight:400;font-size:1.5rem;color:var(--prune)}' +
    '.pdn-res p{font-size:.9rem;margin:.3rem 0 0}' +
    '.pdn-echo{display:flex;gap:.6rem;align-items:flex-start;background:#fff;border:1px solid var(--champagne-clair);border-radius:12px;padding:.7rem .9rem;margin-bottom:.5rem;text-align:left}.pdn-echo i{flex:none;width:8px;height:8px;border-radius:50%;background:var(--champagne);margin-top:.45rem}' +
    '.pdn-actions{display:flex;gap:.7rem;justify-content:center;flex-wrap:wrap;margin-top:1.1rem}' +
    '.pdn-plus{background:none;border:0;color:var(--champagne);font:inherit;font-size:.9rem;text-decoration:underline;text-underline-offset:3px;cursor:pointer;padding:.4rem 0;margin-bottom:.6rem}' +
    '.pdn-famille{display:none}.pdn-famille.ouvert{display:block}' +
    '.pdn-portes{display:grid;gap:.6rem;text-align:left;margin-top:.4rem}.pdn-portes a{display:block;padding:.75rem .95rem;border:1px solid var(--champagne-clair);border-radius:12px;background:#FFF9F5;text-decoration:none;color:inherit}.pdn-portes a b{display:block;color:var(--prune)}.pdn-portes a span{font-size:.88rem;color:var(--prune-doux)}' +
    '.pdn-note{font-size:.8rem;color:var(--prune-doux);opacity:.85;margin-top:.9rem}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var ECRANS = [
    { sur: 'Bienvenue sur Genesolia', h: 'Merci pour ta présence ici.', p: 'Et si ton âme avait choisi cette famille, ces parents et ces expériences pour vivre son propre chemin d’évolution ?' },
    { sur: 'Un parchemin sacré', h: 'Des indices étaient là dès le premier jour.', p: 'La numérologie et l’astrologie sont comme un parchemin : des indices symboliques sur ta naissance et ton chemin de vie. Et si certaines clés étaient déjà inscrites dans ces nombres et ces étoiles ?' },
    { sur: 'Découvre qui tu deviens', h: 'Plus tu prends conscience de ton histoire, plus tu es libre d’écrire la suite.', p: 'Ta carte de naissance, tes nombres et ta lignée t’invitent à mieux comprendre ce que tu portes.' },
    { sur: 'Tout commence par toi', h: 'Et si ce premier pas commençait aujourd’hui ?', p: 'Merci de prendre soin de toi et d’oser ce voyage vers une conscience plus grande.' }
  ];

  function ecranHtml(e, i, n) {
    return '<div class="pdn-ecran' + (i === 0 ? ' actif' : '') + '" data-pdn-e="' + i + '"><p class="pdn-sur">' + e.sur + '</p><h3>' + e.h + '</h3><p>' + e.p + '</p>' +
      '<div class="pdn-actions"><button type="button" class="btn btn-plein" data-pdn-suiv>' + (i < n - 1 ? 'Suivant' : 'Voir ma carte de naissance') + '</button></div></div>';
  }

  var html = '<div class="pdn"><div class="pdn-pas">' + ECRANS.map(function (_, i) { return '<span' + (i === 0 ? ' class="fait"' : '') + '></span>'; }).join('') + '<span></span><span></span></div>';
  ECRANS.forEach(function (e, i) { html += ecranHtml(e, i, ECRANS.length); });
  html += '<div class="pdn-ecran" data-pdn-e="form"><p class="pdn-sur">Ta carte de naissance</p><h3>Qui es-tu, et d’où viens-tu ?</h3>' +
    '<div class="pdn-form"><div class="pdn-ligne"><div><label for="pdn-prenom">Ton prénom</label><input type="text" id="pdn-prenom" autocomplete="given-name"></div><div><label for="pdn-date">Ta date de naissance</label><input type="date" id="pdn-date"></div></div>' +
    '<button type="button" class="pdn-plus" data-pdn-fam>+ Ajouter ta mère, ton père (facultatif)</button>' +
    '<div class="pdn-famille"><div class="pdn-ligne"><div><label for="pdn-prenom-mere">Ta mère : son prénom</label><input type="text" id="pdn-prenom-mere"></div><div><label for="pdn-date-mere">Sa date de naissance</label><input type="date" id="pdn-date-mere"></div></div>' +
    '<div class="pdn-ligne"><div><label for="pdn-prenom-pere">Ton père : son prénom</label><input type="text" id="pdn-prenom-pere"></div><div><label for="pdn-date-pere">Sa date de naissance</label><input type="date" id="pdn-date-pere"></div></div></div>' +
    '<p class="pdn-note">Les calculs se font sur ton appareil, le temps de cette lecture. Rien n’est envoyé ni gardé.</p></div>' +
    '<div class="pdn-actions"><button type="button" class="btn btn-plein" data-pdn-calc disabled>Voir ce que je porte en arrivant</button></div></div>';
  html += '<div class="pdn-ecran" data-pdn-e="res"><p class="pdn-sur">Ce que tu portes en arrivant</p><h3 id="pdn-res-titre">Ta carte de naissance</h3><div id="pdn-res"></div>' +
    '<div class="pdn-portes" id="pdn-portes"></div></div>';
  html += '</div>';
  zone.innerHTML = html;

  function pas(n) { var d = zone.querySelectorAll('.pdn-pas span'); d.forEach(function (x, i) { x.classList.toggle('fait', i <= n); }); }
  function montrer(cle) {
    zone.querySelectorAll('.pdn-ecran').forEach(function (e) { e.classList.remove('actif'); });
    zone.querySelector('[data-pdn-e="' + cle + '"]').classList.add('actif');
  }

  function sommeChiffres(s) { var t = 0; for (var i = 0; i < s.length; i++) { var c = s.charAt(i); if (c >= '0' && c <= '9') t += +c; } return t; }
  function cheminDeVie(d) { /* AAAA-MM-JJ : tous les chiffres d'un coup, nombres maîtres gardés */
    var total = sommeChiffres(d.split('-').join('')), v = total;
    while (v > 9 && v !== 11 && v !== 22 && v !== 33) v = sommeChiffres(String(v));
    return v;
  }
  var SIGNES = [[120, 'Capricorne'], [219, 'Verseau'], [321, 'Poissons'], [420, 'Bélier'], [521, 'Taureau'], [621, 'Gémeaux'], [723, 'Cancer'], [823, 'Lion'], [923, 'Vierge'], [1023, 'Balance'], [1122, 'Scorpion'], [1222, 'Sagittaire'], [1232, 'Capricorne']];
  function signe(d) { var p = d.split('-'), mj = +(p[1] + p[2]); for (var i = 0; i < SIGNES.length; i++) { if (mj < SIGNES[i][0]) return SIGNES[i][1]; } return 'Capricorne'; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  zone.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-pdn-suiv]');
    if (b) {
      var cur = +b.closest('.pdn-ecran').getAttribute('data-pdn-e');
      if (cur < ECRANS.length - 1) { montrer(cur + 1); pas(cur + 1); }
      else { montrer('form'); pas(ECRANS.length); }
      return;
    }
    if (ev.target.closest('[data-pdn-fam]')) {
      var z = zone.querySelector('.pdn-famille'), o = z.classList.toggle('ouvert');
      ev.target.closest('[data-pdn-fam]').textContent = o ? '− Masquer tes parents' : '+ Ajouter ta mère, ton père (facultatif)';
      return;
    }
    if (ev.target.closest('[data-pdn-calc]')) {
      var prenom = zone.querySelector('#pdn-prenom').value.trim() || 'toi', dm = zone.querySelector('#pdn-date').value;
      if (!dm) return;
      var moi = { chemin: cheminDeVie(dm), signe: signe(dm) }, h = '';
      h += '<div class="pdn-res"><b>Ton chemin de vie</b><strong>' + moi.chemin + '</strong><p>Le nombre qui, pour la numérologie, décrit une énergie de fond pour cette vie' + (moi.chemin === 11 || moi.chemin === 22 || moi.chemin === 33 ? ' — un nombre maître, gardé tel quel' : '') + '. Lecture symbolique, à toi de voir ce qu’elle t’évoque.</p></div>';
      h += '<div class="pdn-res"><b>Ton signe solaire</b><strong>' + moi.signe + '</strong><p>D’après ta date seule : un premier repère. Ton thème complet (lune, ascendant) t’attend dans tes astres.</p></div>';
      var echos = [];
      [['mere', 'ta mère'], ['pere', 'ton père']].forEach(function (r) {
        var pr = zone.querySelector('#pdn-prenom-' + r[0]).value.trim() || r[1], dd = zone.querySelector('#pdn-date-' + r[0]).value;
        if (!dd) return;
        var c = cheminDeVie(dd), s = signe(dd);
        if (c === moi.chemin) echos.push('Le chemin de vie ' + moi.chemin + ' revient aussi chez ' + esc(pr) + '.');
        if (s === moi.signe) echos.push('Le signe ' + moi.signe + ' revient aussi chez ' + esc(pr) + '.');
      });
      if (echos.length) h += '<p class="pdn-sur" style="margin-top:.8rem">Ce qui se répond déjà</p>' + echos.map(function (e) { return '<div class="pdn-echo"><i></i><span>' + e + '</span></div>'; }).join('') + '<p class="pdn-note">Des observations, pas une interprétation : à toi de voir ce que ça t’évoque.</p>';
      zone.querySelector('#pdn-res-titre').textContent = 'Ta carte de naissance, ' + prenom;
      zone.querySelector('#pdn-res').innerHTML = h;
      zone.querySelector('#pdn-portes').innerHTML =
        '<a href="genosociogramme.html"><b>Continuer dans ton arbre</b><span>Dates, prénoms, places : ce qui se répète dans ta lignée ressort tout seul.</span></a>' +
        '<a href="theme-numerologique.html"><b>Ton thème numérologique complet</b><span>Chemin de vie, année personnelle, les nombres de ton prénom.</span></a>' +
        '<a href="theme-astral.html"><b>Ton thème astral complet</b><span>Soleil, lune, ascendant : ta carte du ciel, gratuite.</span></a>';
      montrer('res'); pas(ECRANS.length + 1);
      return;
    }
  });
  function pret() {
    var ok = zone.querySelector('#pdn-prenom').value.trim().length > 0 && zone.querySelector('#pdn-date').value.length > 0;
    zone.querySelector('[data-pdn-calc]').disabled = !ok;
  }
  zone.addEventListener('input', pret);
  zone.addEventListener('change', pret);
})();
