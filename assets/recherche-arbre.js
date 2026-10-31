/* Recherche par nom dans l'arbre (Mon arbre et dossiers de l'Espace praticien)
   Les personnes trouvées s'allument ; Entrée ou la flèche passe à la suivante et l'amène à l'écran.
   L'allumage passe par une feuille de style (data-id) : il reste visible quand l'arbre se redessine. */
(function () {
  var toile = document.getElementById('toile');
  if (!toile || document.getElementById('rech-arbre')) return;

  var css = document.createElement('style');
  css.textContent =
    '#rech-arbre{position:absolute;top:12px;left:12px;z-index:5;display:flex;align-items:center;gap:6px;background:#fff;border:1px solid var(--rose-fonce,#EBCFD5);border-radius:999px;padding:5px 6px 5px 12px;box-shadow:0 2px 10px rgba(107,47,91,.12);font:14px var(--texte,system-ui,sans-serif);color:var(--prune,#6B2F5B);cursor:auto}' +
    '#rech-arbre svg{width:15px;height:15px;flex:none}' +
    '#rech-arbre input{border:0;outline:0;background:transparent;width:160px;font:inherit;color:inherit}' +
    '#rech-arbre .nb{font-size:12px;color:var(--prune-doux,#8E6383);white-space:nowrap}' +
    '#rech-arbre button{border:0;background:var(--prune,#6B2F5B);color:#fff;border-radius:999px;width:26px;height:26px;cursor:pointer;font-size:12px;line-height:1}' +
    '#rech-arbre button:disabled{opacity:.35;cursor:default}' +
    '@media (max-width:600px){#rech-arbre input{width:110px}}';
  document.head.appendChild(css);
  var allume = document.createElement('style');
  document.head.appendChild(allume);

  var box = document.createElement('div');
  box.id = 'rech-arbre';
  box.setAttribute('role', 'search');
  box.innerHTML =
    '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M11 11l3.5 3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>' +
    '<input type="search" placeholder="Chercher un nom" aria-label="Chercher une personne dans l\u2019arbre">' +
    '<span class="nb" aria-live="polite"></span>' +
    '<button type="button" title="Aller à la personne (Entrée)" aria-label="Aller à la personne suivante" disabled>&#9660;</button>';
  toile.appendChild(box);

  var champ = box.querySelector('input'), nb = box.querySelector('.nb'), suivant = box.querySelector('button');
  /* la toile se déplace à la souris et réagit au clavier : la barre ne doit pas déclencher ces gestes */
  ['pointerdown', 'mousedown', 'touchstart', 'wheel', 'click', 'dblclick'].forEach(function (ev) {
    box.addEventListener(ev, function (e) { e.stopPropagation(); }, { passive: true });
  });
  champ.addEventListener('keyup', function (e) { e.stopPropagation(); });

  var norm = function (s) { return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(); };
  var trouves = [], i = 0;

  function personnes() {
    return (window.GenoArbre && GenoArbre.personnes) ? GenoArbre.personnes() : [];
  }
  function peindre() {
    var cible = function (id) { return 'g.personne[data-id="' + String(id).replace(/["\\]/g, '\\$&') + '"]'; };
    if (!trouves.length) { allume.textContent = ''; return; }
    allume.textContent =
      trouves.map(cible).join(',') + '{filter:drop-shadow(0 0 5px #B98A55) drop-shadow(0 0 2px #B98A55)}' +
      cible(trouves[i]) + '{filter:drop-shadow(0 0 9px #6B2F5B) drop-shadow(0 0 3px #6B2F5B)}';
  }
  function montrer() {
    peindre();
    if (trouves.length && window.GenoArbre && GenoArbre.allerA) GenoArbre.allerA(trouves[i]);
    champ.focus();
  }
  function chercher() {
    var q = norm(champ.value);
    trouves = [];
    if (q.length >= 2) {
      personnes().forEach(function (p) { if (norm(p.nom).indexOf(q) !== -1) trouves.push(p.id); });
    }
    i = 0; vu = false;
    nb.textContent = q.length < 2 ? '' : (trouves.length ? '1 / ' + trouves.length : 'Personne');
    suivant.disabled = !trouves.length;
    peindre();
  }
  var vu = false;   /* le premier appui montre la première personne trouvée, les suivants passent à la suivante */
  function aller(pas) {
    if (!trouves.length) return;
    if (vu) i = (i + pas + trouves.length) % trouves.length;
    vu = true;
    nb.textContent = (i + 1) + ' / ' + trouves.length;
    montrer();
  }

  champ.addEventListener('input', chercher);
  champ.addEventListener('keydown', function (e) {
    e.stopPropagation();
    if (e.key === 'Enter') { e.preventDefault(); aller(e.shiftKey ? -1 : 1); }
    else if (e.key === 'Escape') { champ.value = ''; chercher(); champ.blur(); }
  });
  suivant.addEventListener('click', function () { aller(1); });
})();
