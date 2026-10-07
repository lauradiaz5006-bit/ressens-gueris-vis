/* Genesolia — éléments communs à toutes les pages.
   Le nom de la marque, le menu et le pied de page se modifient ICI, une seule fois. */
/* Mesure d'audience anonyme et sans cookie (Umami) */
(function () {
  var s = document.createElement('script');
  s.defer = true;
  s.src = 'https://cloud.umami.is/script.js';
  s.setAttribute('data-website-id', '5107e0ec-0aab-459d-8890-e040d9bb893e');
  document.head.appendChild(s);
})();

(function () {
  var MARQUE = 'Genesolia';
  var MENU = [
    ['heriter.html', 'Comprendre'],
    ['methode.html', 'La méthode'],
    ['arbre-de-vie.html', "L'arbre de vie"],
    ['genosociogramme.html', 'Mon arbre familial'],
    ['blog.html', 'Blog'],
    ['login.html', 'Mon espace']
  ];
  var BOUTON = ['arbre-de-vie.html', 'Faire le test gratuit'];

  var logo = '<svg viewBox="0 0 26 26" fill="none" aria-hidden="true"><circle cx="13" cy="5" r="3" fill="#B98A55"/><circle cx="7" cy="11" r="2.2" stroke="#6B2F5B" stroke-width="1.3"/><circle cx="19" cy="11" r="2.2" stroke="#6B2F5B" stroke-width="1.3"/><circle cx="13" cy="15" r="2.4" fill="#6B2F5B"/><path d="M13 17.5v4M13 21.5l-4 3M13 21.5l4 3" stroke="#6B2F5B" stroke-width="1.3" stroke-linecap="round"/></svg>';
  var page = location.pathname.split('/').pop() || 'index.html';

  var entete = document.querySelector('[data-entete]');
  if (entete) {
    var liens = MENU.map(function (l) {
      return '<a href="' + l[0] + '"' + (l[0] === page ? ' aria-current="page"' : '') + '>' + l[1] + '</a>';
    }).join('');
    entete.className = 'entete';
    entete.innerHTML =
      '<div class="conteneur">' +
        '<a class="marque" href="index.html">' + logo + MARQUE + '</a>' +
        '<button class="burger" type="button" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="menu">' +
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>' +
        '</button>' +
        '<nav class="menu" id="menu" aria-label="Menu principal">' + liens +
          '<a class="btn btn-plein" href="' + BOUTON[0] + '">' + BOUTON[1] + '</a>' +
        '</nav>' +
      '</div>';
    var burger = entete.querySelector('.burger'), menu = entete.querySelector('.menu');
    burger.addEventListener('click', function () {
      var ouvert = menu.classList.toggle('ouvert');
      burger.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
    });
  }

  var pied = document.querySelector('[data-pied]');
  if (pied) {
    pied.className = 'pied';
    pied.innerHTML =
      '<div class="conteneur">' +
        '<div class="pied-grille">' +
          '<div><a class="marque" href="index.html">' + MARQUE + '</a>' +
            '<p>Des outils pour comprendre ce qui se répète dans ta vie, à partir de ton histoire familiale et de l\'arbre de vie.</p></div>' +
          '<div><h4>Les outils</h4><ul>' +
            '<li><a href="arbre-de-vie.html">Test de l\'arbre de vie</a></li>' +
            '<li><a href="parcours.html">Parcours guidé</a></li>' +
            '<li><a href="tes-20-ans.html">Tes 20 ans</a></li>' +
            '<li><a href="cartes.html">Images à partager</a></li>' +
            '<li><a href="genosociogramme.html">Mon arbre familial</a></li>' +
            '<li><a href="vibration.html">Ma fréquence intérieure</a></li>' +
            '<li><a href="outils.html">Tous les outils</a></li></ul></div>' +
          '<div><h4>Guides</h4><ul>' +
            '<li><a href="quest-ce-qu-un-genosociogramme.html">Qu\'est-ce qu\'un génosociogramme ?</a></li>' +
            '<li><a href="comment-faire-son-genosociogramme.html">Comment faire son génosociogramme</a></li>' +
            '<li><a href="exemple-genosociogramme.html">Exemple de génosociogramme</a></li>' +
            '<li><a href="genosociogramme-vierge.html">Génosociogramme vierge (PDF)</a></li>' +
            '<li><a href="symboles-genosociogramme.html">Les symboles</a></li></ul></div>' +
          '<div><h4>Comprendre</h4><ul>' +
            '<li><a href="blog.html">Le blog</a></li>' +
            '<li><a href="methode.html">La méthode des deux cycles</a></li>' +
            '<li><a href="heriter.html">Le transgénérationnel</a></li>' +
            '<li><a href="les-10-sephiroth.html">Les 10 Séphiroth</a></li>' +
            '<li><a href="syndrome-anniversaire.html">Le syndrome d\'anniversaire</a></li>' +
            '<li><a href="psychogenealogie.html">La psychogénéalogie</a></li>' +
            '<li><a href="index.html#questions">Questions fréquentes</a></li></ul></div>' +
          '<div><h4>Informations</h4><ul>' +
            '<li><a href="mentions-legales.html">Mentions légales</a></li>' +
            '<li><a href="confidentialite.html">Confidentialité et cookies</a></li>' +
            '<li><a href="login.html">Mon espace</a></li></ul></div>' +
        '</div>' +
        '<div class="pied-bas">' +
          '<span>Ce site propose une lecture symbolique de ton histoire. Il ne remplace pas un avis médical ou psychologique.</span>' +
          '<span>© ' + MARQUE + ' ' + new Date().getFullYear() + '</span>' +
        '</div>' +
      '</div>';
  }

  /* Cadeau : le carnet des deux cycles contre un e-mail (Formspree).
     Placer <div data-cadeau></div> là où le bloc doit apparaître. */
  var FORMSPREE = 'https://formspree.io/f/xdawvnby';
  var CARNET = 'assets/carnet-des-deux-cycles.pdf';
  function telecharger() {
    var a = document.createElement('a');
    a.href = CARNET; a.download = 'carnet-des-deux-cycles-genesolia.pdf';
    document.body.appendChild(a); a.click(); a.remove();
  }
  function merci(zone, prenom) {
    zone.innerHTML =
      '<p class="cadeau-merci">' + (prenom ? 'Merci ' + prenom.replace(/[<>&"]/g, '') + ' !' : 'Merci !') + ' Ton carnet se télécharge.</p>' +
      '<a class="btn btn-plein" href="' + CARNET + '" download="carnet-des-deux-cycles-genesolia.pdf">Télécharger mon carnet</a>';
  }
  var inscrit = false;
  try { inscrit = localStorage.getItem('carnet-inscrit') === 'oui'; } catch (e) {}
  document.querySelectorAll('[data-cadeau]').forEach(function (el, n) {
    var id = 'cadeau-' + n;
    el.className = 'cadeau';
    el.innerHTML =
      '<img class="cadeau-couv" src="assets/carnet-apercu.jpg" width="662" height="936" alt="Couverture du carnet des deux cycles" loading="lazy">' +
      '<div class="cadeau-texte">' +
        '<h2>Reçois le carnet des deux cycles, offert</h2>' +
        '<p>Neuf pages à imprimer et à remplir : la boucle et la spirale, tes deux cycles, les neuf étapes, les questions à poser à ta famille et ton arbre sur trois générations.</p>' +
        '<div class="cadeau-zone" aria-live="polite">' +
          (inscrit
            ? '<a class="btn btn-plein" href="' + CARNET + '" download="carnet-des-deux-cycles-genesolia.pdf">Télécharger mon carnet</a>'
            : '<form class="cadeau-form" novalidate>' +
                '<div class="cadeau-champs">' +
                  '<label for="' + id + '-prenom">Prénom<input id="' + id + '-prenom" name="prenom" autocomplete="given-name" required></label>' +
                  '<label for="' + id + '-email">E-mail<input id="' + id + '-email" name="email" type="email" autocomplete="email" required></label>' +
                '</div>' +
                '<label class="cadeau-accord"><input type="checkbox" name="accord" value="oui" required><span>J\'accepte de recevoir le carnet et des nouvelles de Genesolia par e-mail. Je peux me désinscrire à tout moment. <a href="confidentialite.html">Mes données</a></span></label>' +
                '<input type="text" name="_gotcha" tabindex="-1" autocomplete="off" class="cadeau-piege" aria-hidden="true">' +
                '<button class="btn btn-plein" type="submit">Recevoir mon carnet</button>' +
                '<p class="cadeau-erreur" role="alert"></p>' +
              '</form>') +
        '</div>' +
      '</div>';
    var form = el.querySelector('form');
    if (!form) return;
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var err = form.querySelector('.cadeau-erreur'), btn = form.querySelector('button');
      var prenom = form.prenom.value.trim(), email = form.email.value.trim();
      if (!prenom || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = 'Indique ton prénom et une adresse e-mail valide.'; return; }
      if (!form.accord.checked) { err.textContent = 'Coche la case d\'accord pour recevoir le carnet.'; return; }
      err.textContent = ''; btn.disabled = true; btn.textContent = 'Envoi en cours…';
      var data = new FormData(form);
      data.append('source', page);
      data.append('_subject', 'Nouvelle inscription : carnet des deux cycles');
      fetch(FORMSPREE, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function () {
          try { localStorage.setItem('carnet-inscrit', 'oui'); } catch (e) {}
          merci(el.querySelector('.cadeau-zone'), prenom);
          telecharger();
        })
        .catch(function () {
          btn.disabled = false; btn.textContent = 'Recevoir mon carnet';
          err.textContent = 'L\'envoi n\'a pas fonctionné. Vérifie ta connexion et réessaie dans un instant.';
        });
    });
  });

  /* Bandeau d'information : le site n'utilise que des stockages nécessaires à son fonctionnement */
  var vu = false;
  try { vu = localStorage.getItem('info-cookies') === 'vu'; } catch (e) {}
  if (!vu) {
    var b = document.createElement('div');
    b.className = 'cookies visible';
    b.setAttribute('role', 'region');
    b.setAttribute('aria-label', 'Information sur les données');
    b.innerHTML =
      '<p>Aucun cookie publicitaire. Une mesure d\'audience anonyme et sans cookie (Umami) nous aide à améliorer le site. Tes réponses restent dans ton navigateur. Si tu crées un compte, tes sauvegardes sont stockées sur nos serveurs en Europe (Irlande). <a href="confidentialite.html">En savoir plus</a></p>' +
      '<button class="btn btn-plein" type="button">J\'ai compris</button>';
    b.querySelector('button').addEventListener('click', function () {
      b.classList.remove('visible');
      try { localStorage.setItem('info-cookies', 'vu'); } catch (e) {}
    });
    document.body.appendChild(b);
  }
})();
