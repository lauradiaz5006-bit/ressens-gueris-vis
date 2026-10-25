/* Genesolia · Ma spirale : le cœur et le partage (page de vente et exemple).
   Un cœur ou un partage = une ligne anonyme dans la table spirale_aime (aucune donnée personnelle, insertion seulement).
   Boutons : [data-aime], [data-partager] ; message : [data-aime-msg]. */
(function () {
  'use strict';
  var URL = 'https://qsvzzkjtjsznfntahvvh.supabase.co/rest/v1/spirale_aime', CLE = 'sb_publishable_6iEVxXmtB_u1hJ6mPS9fNg_CJhLjYkg', K = 'genesolia-spirale-aime';
  var MSG = 'Merci ! Reviens à partir du 1er novembre : Ma spirale sera en ligne.';
  var page = (location.pathname.split('/').pop() || 'index.html').slice(0, 40);
  function noter(g) { try { fetch(URL, { method: 'POST', headers: { apikey: CLE, Authorization: 'Bearer ' + CLE, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify({ geste: g, page: page }) }).catch(function () {}); } catch (e) {} }
  function deja() { try { return localStorage.getItem(K) === '1'; } catch (e) { return false; } }
  function dire(b, t) { var z = (b.closest('[data-aime-zone]') || document).querySelector('[data-aime-msg]'); if (z) z.textContent = t; }
  function etat() { document.querySelectorAll('[data-aime]').forEach(function (b) { b.setAttribute('aria-pressed', deja() ? 'true' : 'false'); }); }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-aime]');
    if (a) { if (!deja()) { noter('aime'); try { localStorage.setItem(K, '1'); } catch (x) {} } etat(); dire(a, MSG); return; }
    var p = e.target.closest('[data-partager]');
    if (p) {
      var d = { title: 'Ma spirale · Genesolia', text: 'Un espace pour comprendre ce qui se répète dans sa vie, et le libérer. En ligne le 1er novembre.', url: 'https://genesolia.fr/ma-spirale.html' };
      noter('partage');
      if (navigator.share) navigator.share(d).then(function () { dire(p, MSG); }, function () {});
      else if (navigator.clipboard) navigator.clipboard.writeText(d.url).then(function () { dire(p, 'Le lien est copié : tu peux le coller où tu veux. Ma spirale sera en ligne le 1er novembre.'); }, function () { dire(p, d.url); });
      else dire(p, d.url);
    }
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', etat); else etat();
})();
