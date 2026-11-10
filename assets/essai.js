/* Genesolia · essai de 30 jours des analyses de l'arbre (réglage : GENESOLIA_ESSAI dans assets/site.js).
   Chargé par genosociogramme.html et fil-d-or.html. Tant que actif vaut false, rien n'est bloqué.
   Après les 30 jours, sans Pass / Cercle / Espace praticien : les analyses se mettent en pause, l'arbre reste visible et modifiable. */
(function () {
  'use strict';
  var C = window.GENESOLIA_ESSAI || { actif: false };
  var SB = 'https://qsvzzkjtjsznfntahvvh.supabase.co', CLE = 'sb_publishable_6iEVxXmtB_u1hJ6mPS9fNg_CJhLjYkg';
  var CIBLES = '#bt-panneau,#bt-numero,#bt-astro,#bt-rapport,.mt-nav [data-aller="reps"],.mt-nav [data-aller="rapport"],.ar-etapes [data-aller="3"],.ar-etapes [data-aller="4"],.ar-suite [data-aller="3"],.ar-suite [data-aller="4"]';
  var etatEssai = { ouvert: true, connectee: false, reste: null };
  window.GenesoliaEssai = { etat: function () { return etatEssai; } };
  if (!C.actif) return;

  function session() { try { var s = JSON.parse(localStorage.getItem('sb-qsvzzkjtjsznfntahvvh-auth-token') || 'null'); return s && s.access_token ? s : null; } catch (e) { return null; } }
  function abonnee(s) {
    var h = { headers: { apikey: CLE, Authorization: 'Bearer ' + s.access_token } };
    var lire = function (u) { return fetch(SB + u, h).then(function (r) { return r.ok ? r.json() : []; }).catch(function () { return []; }); };
    return Promise.all([lire('/rest/v1/acces_premium?select=offre,valide_jusqu'), lire('/rest/v1/praticiens?select=acces_jusqu')]).then(function (r) {
      var ap = (r[0] || []).some(function (a) { return /^(pass|cercle|abonnement|offert|pro|praticien|admin)$/.test(a.offre) && new Date(a.valide_jusqu) > new Date(); });
      var pr = (r[1] || []).some(function (p) { return new Date(p.acces_jusqu) > new Date(); });   /* praticien·ne en essai ou abonné·e */
      return ap || pr;
    });
  }
  function fenetre(titre, texte, boutons) {
    var f = document.createElement('div'); f.className = 'es-fond'; f.setAttribute('role', 'dialog'); f.setAttribute('aria-modal', 'true'); f.setAttribute('aria-labelledby', 'es-t');
    f.innerHTML = '<div class="es-fenetre"><button type="button" class="es-fermer" aria-label="Fermer">×</button><h2 id="es-t">' + titre + '</h2><p>' + texte + '</p><div class="es-actions">' + boutons + '</div></div>';
    document.body.appendChild(f);
    f.addEventListener('click', function (e) { if (e.target === f || e.target.closest('.es-fermer')) f.remove(); });
  }
  function bloquer() {
    if (!etatEssai.connectee) fenetre('Crée ton compte, c’est offert', 'Pour garder ton arbre et voir ce qui se répète, crée ton espace gratuit : <b>' + C.jours + ' jours d’analyses offerts</b>, sans carte. Ton arbre reste à toi.',
      '<a class="btn btn-plein" href="login.html?inscription&amp;retour=' + encodeURIComponent(location.pathname.split('/').pop() || 'genosociogramme.html') + '">Créer mon espace gratuit</a>');
    else fenetre('Tes ' + C.jours + ' jours d’analyses sont terminés', 'Ton arbre reste à toi : tu peux toujours le voir et le compléter. Pour retrouver ce qui se répète, la numérologie, l’astrologie et ton rapport, continue avec <b>Ma spirale</b> (offre de Noël : 7 jours offerts, puis 4,99 € par mois, sans engagement), ou essaie <b>Le Cercle</b>, ton 1<sup>er</sup> mois est offert.',
      '<a class="btn btn-plein" href="tarifs.html">Voir Ma spirale</a><a class="btn btn-trait" href="essai.html">Ouvrir mon mois offert du Cercle</a>');
  }
  var s = session();
  (s ? abonnee(s) : Promise.resolve(false)).then(function (ok) {
    if (!s) { etatEssai = { ouvert: false, connectee: false, reste: null }; }
    else {
      var u = s.user || {}, debut = new Date(Math.max(new Date(u.created_at || Date.now()).getTime(), new Date(C.depuis + 'T00:00:00').getTime()));
      var reste = Math.ceil((debut.getTime() + C.jours * 864e5 - Date.now()) / 864e5);
      etatEssai = { ouvert: ok || reste > 0, connectee: true, reste: ok ? null : Math.max(0, reste), abonnee: ok };
    }
    if (etatEssai.ouvert) {
      if (etatEssai.reste != null && etatEssai.reste > 0) { var b = document.createElement('p'); b.className = 'es-bandeau'; b.innerHTML = 'Analyses offertes : encore <b>' + etatEssai.reste + ' jour' + (etatEssai.reste > 1 ? 's' : '') + '</b>. <a href="tarifs.html">Continuer avec le Pass</a>'; document.body.appendChild(b); }
      return;
    }
    document.documentElement.classList.add('essai-fini');
    document.addEventListener('click', function (e) { if (e.target.closest(CIBLES)) { e.preventDefault(); e.stopPropagation(); bloquer(); } }, true);
  });
})();
