/* Genesolia · « Ta carte de naissance » sur l'accueil : un seul chemin en écrans
   (2 slides d'accueil, puis la date de naissance, un résultat éclair, et 3 portes).
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
    '.pdn-form{text-align:left;max-width:16rem;margin:0 auto 1rem}.pdn-form label{display:block;font-size:.85rem;color:var(--prune-doux);margin:0 0 .3rem}' +
    '.pdn-form input{width:100%;font:inherit;padding:.6rem .8rem;border:1px solid var(--champagne-clair);border-radius:12px;background:#FFFBF9;color:var(--prune)}' +
    '.pdn-flash{font-size:1.08rem;color:var(--prune);margin:0 0 .6rem}.pdn-flash strong{display:block;font-family:var(--display);font-weight:400;font-size:2rem;color:var(--champagne);margin-bottom:.2rem}' +
    '.pdn-bascule{color:var(--prune-doux)}' +
    '.pdn-actions{display:flex;gap:.7rem;justify-content:center;flex-wrap:wrap;margin-top:1.1rem}' +
    '.pdn-cartes{display:grid;gap:.6rem;text-align:left;margin-top:.4rem}' +
    '.pdn-carte{display:flex;align-items:center;gap:.85rem;padding:.8rem .95rem;border:1px solid var(--champagne-clair);border-radius:14px;background:#FFF9F5;text-decoration:none;color:inherit;transition:border-color .2s,transform .2s}' +
    '.pdn-carte:hover{border-color:var(--champagne);transform:translateY(-2px)}' +
    '.pdn-carte-ico{flex:none;width:38px;height:38px;border-radius:50%;background:#fff;display:grid;place-items:center}' +
    '.pdn-carte-ico svg{width:19px;height:19px;fill:none;stroke:var(--prune);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round}' +
    '.pdn-carte b{display:block;font-family:var(--display);font-weight:400;font-size:1.05rem;color:var(--prune)}' +
    '.pdn-carte span{display:block;font-size:.85rem;color:var(--prune-doux)}' +
    '.pdn-note{font-size:.8rem;color:var(--prune-doux);opacity:.85;margin-top:.9rem}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var ECRANS = [
    { sur: 'Bienvenue sur Genesolia', h: 'Merci pour ta présence ici.', p: 'Et si ton âme avait choisi cette famille, ces parents et ces expériences pour vivre son propre chemin d’évolution ?' },
    { sur: 'Un parchemin sacré', h: 'Des indices étaient là dès le premier jour.', p: 'La numérologie et l’astrologie sont comme un parchemin : des indices symboliques sur ta naissance et ton chemin de vie.' }
  ];
  var ICONES = {
    arbre: '<svg viewBox="0 0 24 24"><path d="M12 21V9M12 9c-3-3.2-7-1.8-7 1.4S9 13.4 12 10.6M12 9c3-3.2 7-1.8 7 1.4S15 13.4 12 10.6M8 21h8"/></svg>',
    cercle: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg>',
    spirale: '<svg viewBox="0 0 24 24"><path d="M12 12.2c-1 0-1.6-.9-1.1-1.7.6-1 2.2-1.1 3.1-.1 1.1 1.1 1 3.1-.3 4.2-1.6 1.3-4 1.1-5.3-.5-1.5-1.8-1.3-4.6.5-6.1 2.1-1.8 5.2-1.5 6.9.7"/></svg>'
  };

  function ecranHtml(e, i, n) {
    return '<div class="pdn-ecran' + (i === 0 ? ' actif' : '') + '" data-pdn-e="' + i + '"><p class="pdn-sur">' + e.sur + '</p><h3>' + e.h + '</h3><p>' + e.p + '</p>' +
      '<div class="pdn-actions"><button type="button" class="btn btn-plein" data-pdn-suiv>' + (i < n - 1 ? 'Suivant' : 'Voir ce que je porte en arrivant') + '</button></div></div>';
  }

  var NB_PAS = ECRANS.length + 3; /* 2 slides + date + éclair + choix */
  var html = '<div class="pdn"><div class="pdn-pas">';
  for (var d = 0; d < NB_PAS; d++) html += '<span' + (d === 0 ? ' class="fait"' : '') + '></span>';
  html += '</div>';
  ECRANS.forEach(function (e, i) { html += ecranHtml(e, i, ECRANS.length); });
  html += '<div class="pdn-ecran" data-pdn-e="date"><p class="pdn-sur">Ta carte de naissance</p><h3>Ta date de naissance</h3>' +
    '<div class="pdn-form"><label for="pdn-date">Ta date de naissance</label><input type="date" id="pdn-date"></div>' +
    '<p class="pdn-note">Le calcul se fait sur ton appareil, rien n’est envoyé ni gardé.</p>' +
    '<div class="pdn-actions"><button type="button" class="btn btn-plein" data-pdn-calc disabled>Voir</button></div></div>';
  html += '<div class="pdn-ecran" data-pdn-e="eclair"><p class="pdn-sur">Ce que tu portes en arrivant</p><div id="pdn-eclair"></div>' +
    '<p class="pdn-bascule">Mais ce qui se répète dans ta vie vient aussi d’avant toi, de ta lignée.</p>' +
    '<div class="pdn-actions"><button type="button" class="btn btn-plein" data-pdn-continuer>Continuer</button></div></div>';
  html += '<div class="pdn-ecran" data-pdn-e="choix"><p class="pdn-sur">Et maintenant&nbsp;?</p>' +
    '<div class="pdn-cartes">' +
    '<a class="pdn-carte" href="genosociogramme.html"><span class="pdn-carte-ico" aria-hidden="true">' + ICONES.arbre + '</span><span><b>Je découvre ma lignée</b><span>Ton arbre familial, gratuit.</span></span></a>' +
    '<a class="pdn-carte" href="abonnement.html"><span class="pdn-carte-ico" aria-hidden="true">' + ICONES.cercle + '</span><span><b>Je travaille déjà sur moi</b><span>Le Cercle, ton accompagnement du mois.</span></span></a>' +
    '<a class="pdn-carte" href="ma-spirale.html"><span class="pdn-carte-ico" aria-hidden="true">' + ICONES.spirale + '</span><span><b>Je me connais déjà</b><span>Ma spirale, ton outil d’introspection.</span></span></a>' +
    '</div></div>';
  html += '</div>';
  zone.innerHTML = html;

  function pas(n) { var dots = zone.querySelectorAll('.pdn-pas span'); dots.forEach(function (x, i) { x.classList.toggle('fait', i <= n); }); }
  function montrer(cle) {
    zone.querySelectorAll('.pdn-ecran').forEach(function (e) { e.classList.remove('actif'); });
    zone.querySelector('[data-pdn-e="' + cle + '"]').classList.add('actif');
  }

  function sommeChiffres(s) { var t = 0; for (var i = 0; i < s.length; i++) { var c = s.charAt(i); if (c >= '0' && c <= '9') t += +c; } return t; }
  function cheminDeVie(dte) { /* AAAA-MM-JJ : tous les chiffres d'un coup, nombres maîtres gardés */
    var total = sommeChiffres(dte.split('-').join('')), v = total;
    while (v > 9 && v !== 11 && v !== 22 && v !== 33) v = sommeChiffres(String(v));
    return v;
  }

  zone.addEventListener('click', function (ev) {
    var suiv = ev.target.closest('[data-pdn-suiv]');
    if (suiv) {
      var cur = +suiv.closest('.pdn-ecran').getAttribute('data-pdn-e');
      if (cur < ECRANS.length - 1) { montrer(cur + 1); pas(cur + 1); }
      else { montrer('date'); pas(ECRANS.length); }
      return;
    }
    if (ev.target.closest('[data-pdn-calc]')) {
      var dm = zone.querySelector('#pdn-date').value;
      if (!dm) return;
      var n = cheminDeVie(dm);
      zone.querySelector('#pdn-eclair').innerHTML = '<p class="pdn-flash"><strong>' + n + '</strong>c’est ton chemin de vie, calculé à partir de ta date de naissance.</p>';
      montrer('eclair'); pas(ECRANS.length + 1);
      return;
    }
    if (ev.target.closest('[data-pdn-continuer]')) { montrer('choix'); pas(ECRANS.length + 2); return; }
  });
  function pret() { zone.querySelector('[data-pdn-calc]').disabled = !zone.querySelector('#pdn-date').value; }
  zone.addEventListener('input', pret);
  zone.addEventListener('change', pret);
})();
