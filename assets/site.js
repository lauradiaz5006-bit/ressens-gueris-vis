/* Schéma Répétitif — éléments communs à toutes les pages.
   Le nom de la marque, le menu et le pied de page se modifient ICI, une seule fois. */
(function () {
  var MARQUE = 'Schéma Répétitif';
  var MENU = [
    ['heriter.html', 'Comprendre'],
    ['outils.html', 'Outils'],
    ['genosociogramme.html', 'Mon arbre familial'],
    ['login.html', 'Mon espace']
  ];
  var BOUTON = ['parcours.html', 'Commencer le parcours'];

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
            '<li><a href="parcours.html">Parcours guidé</a></li>' +
            '<li><a href="genosociogramme.html">Mon arbre familial</a></li>' +
            '<li><a href="vibration.html">Ma fréquence intérieure</a></li>' +
            '<li><a href="outils.html">Tous les outils</a></li></ul></div>' +
          '<div><h4>Comprendre</h4><ul>' +
            '<li><a href="heriter.html">Le transgénérationnel</a></li>' +
            '<li><a href="index.html#questions">Questions fréquentes</a></li></ul></div>' +
          '<div><h4>Informations</h4><ul>' +
            '<li><a href="confidentialite.html">Confidentialité et cookies</a></li>' +
            '<li><a href="login.html">Mon espace</a></li></ul></div>' +
        '</div>' +
        '<div class="pied-bas">' +
          '<span>Ce site propose une lecture symbolique de ton histoire. Il ne remplace pas un avis médical ou psychologique.</span>' +
          '<span>© ' + MARQUE + ' ' + new Date().getFullYear() + '</span>' +
        '</div>' +
      '</div>';
  }

  /* Bandeau d'information : le site n'utilise que des stockages nécessaires à son fonctionnement */
  var vu = false;
  try { vu = localStorage.getItem('info-cookies') === 'vu'; } catch (e) {}
  if (!vu) {
    var b = document.createElement('div');
    b.className = 'cookies visible';
    b.setAttribute('role', 'region');
    b.setAttribute('aria-label', 'Information sur les données');
    b.innerHTML =
      '<p>Aucun cookie publicitaire ni outil de mesure d\'audience. Tes réponses restent dans ton navigateur. Si tu crées un compte, tes sauvegardes sont stockées sur nos serveurs en Europe (Irlande). <a href="confidentialite.html">En savoir plus</a></p>' +
      '<button class="btn btn-plein" type="button">J\'ai compris</button>';
    b.querySelector('button').addEventListener('click', function () {
      b.classList.remove('visible');
      try { localStorage.setItem('info-cookies', 'vu'); } catch (e) {}
    });
    document.body.appendChild(b);
  }
})();
