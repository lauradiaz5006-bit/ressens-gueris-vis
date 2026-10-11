/* Genesolia · Ton autel de saison (autel-de-saison.html?mois=AAAA-MM)
   Le contenu vient du suivi du mois : assets/suivi/AAAA-MM.js, objet coeur.autel. L'image : assets/autels/AAAA-MM.jpg (un fond doux si elle manque). */
(function () {
  'use strict';
  var z = document.getElementById('autel'); if (!z) return;
  var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  var d = new Date(), actuel = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2);
  var m = new URLSearchParams(location.search).get('mois') || actuel;
  if (!/^\d{4}-\d{2}$/.test(m)) m = actuel;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function liste(l) { return '<ul>' + (l || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>'; }
  function bloc(n, t, c) { return '<section class="au-bloc"><h2><span>' + n + '</span>' + esc(t) + '</h2>' + c + '</section>'; }
  function afficher() {
    var C = window.GENESOLIA_CARNET, A = C && C.coeur && C.coeur.autel;
    var nm = MOIS[+m.split('-')[1] - 1];
    if (!A) { z.innerHTML = '<div class="au-tete"><p class="au-sur">Le Cercle · ' + esc(nm) + '</p><h1>Ton autel de saison</h1><p>L’autel de ce mois arrive bientôt. En attendant, retrouve ton suivi du mois.</p></div><p class="au-boutons"><a class="btn btn-plein" href="mon-suivi-mois.html">Mon suivi du mois</a></p>'; return; }
    z.innerHTML = '<div class="au-tete"><p class="au-sur">Le Cercle · ' + esc(nm) + ' ' + esc(m.split('-')[0]) + '</p><h1>Ton autel de saison</h1><p>Un petit espace qui protège ton énergie intérieure, célèbre ta beauté et honore l’être de la création que tu es.</p></div>' +
      '<figure class="au-image" data-image><img src="assets/autels/' + esc(m) + '.jpg" alt="Un autel de saison de ' + esc(nm) + '" width="1024" height="1024"></figure>' +
      bloc(1, 'L’intention', '<p>' + esc(A.intention) + '</p>') +
      bloc(2, 'La cueillette', '<p>Pendant ta balade, cherche :</p>' + liste(A.cueillette)) +
      bloc(3, 'Les couleurs et les bougies', '<p>' + esc(A.couleurs) + '</p>') +
      bloc(4, 'La mise en place', '<p>Pose sur ton autel un élément pour chacun :</p><div class="au-el">' + (A.elements || []).map(function (e) { return '<div><b>' + esc(e.nom) + '</b>' + esc(e.texte) + '</div>'; }).join('') + '</div>') +
      bloc(5, 'Pour ouvrir ton autel', '<p>Allume les bougies, pose ta main sur ton cœur, et dis :</p><p class="au-phrase">' + esc(A.ouverture) + '</p>') +
      bloc(6, 'L’entretien, au fil des semaines', liste(A.entretien)) +
      bloc(7, 'La clôture, en fin de mois', '<p>' + esc(A.cloture) + '</p>') +
      '<p class="au-boutons"><a class="btn btn-plein" href="mon-suivi-mois.html?mois=' + esc(m) + '#saison">Revenir à mon suivi</a><button type="button" class="btn btn-trait" onclick="window.print()">Imprimer ma fiche</button></p>' +
      '<p class="note" style="text-align:center;margin-top:1rem">Ne laisse jamais une bougie allumée sans surveillance.</p>';
    var img = z.querySelector('[data-image] img');
    img.addEventListener('error', function () { img.parentNode.innerHTML = '<p>Ton autel de ' + esc(nm) + '</p>'; });
  }
  var s = document.createElement('script');
  s.src = 'assets/suivi/' + m + '.js';
  s.onload = afficher; s.onerror = function () { window.GENESOLIA_CARNET = null; afficher(); };
  document.body.appendChild(s);
})();
