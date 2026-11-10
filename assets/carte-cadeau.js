/* Genesolia · la carte cadeau du Cercle : son dessin (offrir.html, carte-cadeau.html) et l'appel à la fonction Supabase « carte-cadeau ».
   Les prix affichés ici doivent rester les mêmes que dans la fonction (outils-internes/fonction-carte-cadeau, CARTES). */
(function () {
  var FN = 'https://qsvzzkjtjsznfntahvvh.supabase.co/functions/v1/carte-cadeau';
  var OFFRES = { cercle3: { mois: 3, prix: '49 €' }, cercle6: { mois: 6, prix: '99 €' } };
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  /* petites étoiles et flocons dorés, toujours au même endroit pour une même carte */
  function ciel() {
    var p = [[6, 12, 1.1], [14, 78, .7], [22, 30, .5], [31, 88, .9], [44, 8, .6], [58, 92, .7], [72, 7, 1], [79, 70, .5], [88, 34, .8], [93, 86, .6], [90, 55, .4], [10, 60, .45]];
    return p.map(function (s, i) {
      var x = s[0], y = s[1], r = s[2];
      return i % 3 === 0
        ? '<g transform="translate(' + x + ' ' + y + ') scale(' + r + ')" stroke="currentColor" stroke-width=".35" stroke-linecap="round"><path d="M0-2.4V2.4M-2.1-1.2 2.1 1.2M-2.1 1.2 2.1-1.2"/></g>'
        : '<path transform="translate(' + x + ' ' + y + ') scale(' + r + ')" d="M0-2 .5-.5 2 0 .5.5 0 2-.5.5-2 0-.5-.5z" fill="currentColor"/>';
    }).join('');
  }
  function html(c) {
    c = c || {};
    var o = OFFRES[c.offre] || { mois: c.mois || 3 }, mois = c.mois || o.mois;
    return '<div class="cc-carte" role="img" aria-label="Carte cadeau : ' + mois + ' mois du Cercle' + (c.pour ? ' pour ' + esc(c.pour) : '') + '">' +
      '<svg class="cc-ciel" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' + ciel() + '</svg>' +
      '<div class="cc-int">' +
        '<p class="cc-marque">Genesolia · Carte cadeau</p>' +
        '<p class="cc-titre">Le Cercle</p>' +
        '<p class="cc-mois"><b>' + mois + ' mois</b> offerts</p>' +
        '<p class="cc-pour">' + (c.pour ? 'Pour <b>' + esc(c.pour) + '</b>' : 'Pour toi') + (c.de ? '<span> · de la part de <b>' + esc(c.de) + '</b></span>' : '') + '</p>' +
        (c.message ? '<p class="cc-mot">« ' + esc(c.message) + ' »</p>' : '') +
        '<p class="cc-code"><span>' + (c.code ? esc(c.code) : 'CERCLE-····-····') + '</span></p>' +
        '<p class="cc-valide">' + (c.valable_jusqu ? 'À activer avant le ' + esc(new Date(c.valable_jusqu + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })) : 'Valable 1 an') + '</p>' +
      '</div></div>';
  }
  function appeler(action, data, jeton) {
    var h = { 'Content-Type': 'application/json' }; if (jeton) h.Authorization = 'Bearer ' + jeton;
    return fetch(FN, { method: 'POST', headers: h, body: JSON.stringify(Object.assign({ action: action }, data || {})) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { j._statut = r.status; return j; }); })
      .catch(function () { return { erreur: 'Pas de connexion. Vérifie ton réseau et réessaie.', _statut: 0 }; });
  }
  window.GenesoliaCarte = { html: html, appeler: appeler, offres: OFFRES, esc: esc };
})();
