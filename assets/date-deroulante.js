/* Genesolia · dates en menus déroulants (jour, mois, année) sur téléphone et tablette.
   Sur un clavier tactile on ne peut pas taper « / » : chaque champ de date (classe « date-saisie ») est remplacé
   par trois menus. Le champ d'origine reste dans la page, caché : il garde la même valeur qu'avant
   (« 14/03/1985 », « 1985 » ou vide), donc le reste du code ne change pas. */
(function () {
  'use strict';
  var tactile = window.matchMedia && (matchMedia('(pointer: coarse)').matches || matchMedia('(max-width: 760px)').matches);
  if (!tactile) return;
  var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  var AN = new Date().getFullYear();
  var desc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
  function deux(n) { return (n < 10 ? '0' : '') + n; }
  /* « 1985-03-14 », « 14/03/1985 », « 1985 » → { j, m, a } */
  function lire(v) {
    v = String(v || '').trim(); var m;
    if ((m = v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))) return { a: +m[1], m: +m[2], j: +m[3] };
    if ((m = v.match(/^(\d{1,2})[\/.\- ](\d{1,2})[\/.\- ](\d{4})$/))) return { a: +m[3], m: +m[2], j: +m[1] };
    if ((m = v.match(/(\d{4})/))) return { a: +m[1], m: 0, j: 0 };
    return { a: 0, m: 0, j: 0 };
  }
  function options(liste, choisi, vide) {
    return '<option value="">' + vide + '</option>' + liste.map(function (x) { return '<option value="' + x[0] + '"' + (x[0] === choisi ? ' selected' : '') + '>' + x[1] + '</option>'; }).join('');
  }
  function equiper(inp) {
    if (inp.__deroulante) return; inp.__deroulante = true;
    var boite = document.createElement('span'); boite.className = 'date-menus';
    var sj = document.createElement('select'), sm = document.createElement('select'), sa = document.createElement('select');
    sj.setAttribute('aria-label', 'Jour'); sm.setAttribute('aria-label', 'Mois'); sa.setAttribute('aria-label', 'Année');
    var jours = [], mois = [], ans = [];
    for (var j = 1; j <= 31; j++) jours.push([j, j === 1 ? '1er' : String(j)]);
    MOIS.forEach(function (n, i) { mois.push([i + 1, n]); });
    for (var a = AN; a >= 1500; a--) ans.push([a, String(a)]);
    function remplir(v) {
      var d = lire(v);
      sj.innerHTML = options(jours, d.j, 'Jour'); sm.innerHTML = options(mois, d.m, 'Mois'); sa.innerHTML = options(ans, d.a, 'Année');
    }
    /* la valeur du champ d'origine : jour/mois/année complets, sinon l'année seule */
    function ecrire() {
      var a = +sa.value, m = +sm.value, j = +sj.value, v = '';
      if (a && m && j) { var t = new Date(a, m - 1, j); if (t.getMonth() !== m - 1) { j = new Date(a, m, 0).getDate(); sj.value = String(j); } v = deux(j) + '/' + deux(m) + '/' + a; }
      else if (a) v = String(a);
      desc.set.call(inp, v);
      inp.dispatchEvent(new Event('input', { bubbles: true })); inp.dispatchEvent(new Event('change', { bubbles: true }));
    }
    /* quand le code remplit le champ (fiche d'une personne), les menus suivent */
    Object.defineProperty(inp, 'value', { configurable: true, get: function () { return desc.get.call(inp); }, set: function (v) { desc.set.call(inp, v); remplir(v); } });
    [sj, sm, sa].forEach(function (s) { s.addEventListener('change', ecrire); boite.appendChild(s); });
    remplir(desc.get.call(inp));
    inp.type = 'hidden';
    inp.parentNode.insertBefore(boite, inp.nextSibling);
    var aide = document.createElement('small'); aide.className = 'date-menus-aide'; aide.textContent = 'L’année suffit. Ajoute le jour et le mois si tu les connais.';
    boite.parentNode.insertBefore(aide, boite.nextSibling);
  }
  function chercher(rac) { [].forEach.call((rac || document).querySelectorAll('input.date-saisie'), equiper); }
  var st = document.createElement('style');
  st.textContent = '.date-menus{display:grid;grid-template-columns:1fr 1.6fr 1.3fr;gap:.4rem;width:100%;margin-top:.3rem}' +
    '.date-menus select{width:100%;min-width:0;font:inherit;font-size:16px;padding:.6rem .5rem;border:1.5px solid #E3C9D3;border-radius:12px;background:#fff;color:#4A1F42}' +
    '.date-menus-aide{display:block;font-size:.78rem;color:#8E6383;margin-top:.25rem;font-weight:400}';
  document.head.appendChild(st);
  chercher();
  new MutationObserver(function (l) { l.forEach(function (x) { [].forEach.call(x.addedNodes, function (n) { if (n.nodeType === 1) { if (n.matches && n.matches('input.date-saisie')) equiper(n); else chercher(n); } }); }); })
    .observe(document.body, { childList: true, subtree: true });
})();
