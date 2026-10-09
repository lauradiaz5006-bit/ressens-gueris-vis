/* Genesolia — éléments communs à toutes les pages.
   Le nom de la marque, le menu et le pied de page se modifient ICI, une seule fois. */
/* ===== Données gardées dans le navigateur, comme sur les autres sites =====
   - Connectée : ton arbre et tes résultats sont dans ton compte ; le navigateur n'en garde qu'une copie de travail.
     À la déconnexion (ou si la session a expiré), cette copie est effacée de l'appareil.
   - Sans compte : ton travail est gardé tant que le navigateur reste ouvert (cookie de session « genesolia_s »,
     strictement nécessaire), puis effacé à sa fermeture. Un message propose de créer son espace pour le garder.
   Ne sont jamais effacés : les choix de cookies et quelques repères techniques sans donnée personnelle. */
window.GenesoliaDonnees = (function () {
  var JETON = 'sb-qsvzzkjtjsznfntahvvh-auth-token', MARQUE_COMPTE = 'genesolia-donnees-compte', REGLE = 'genesolia-regle-v2';
  var GARDER = /^(consentement-mesure(-date)?|info-cookies|carnet-inscrit|liste-formation|genesolia-regle-v2|genesolia-retour|retour-apres-connexion|genesolia-tuto-arbre-vu|vingt-ans-vues|jaime-.*|sb-.*)$/;
  function connectee() { try { var x = JSON.parse(localStorage.getItem(JETON) || 'null'); return !!(x && x.refresh_token); } catch (e) { return false; } }
  function idCompte() { try { var x = JSON.parse(localStorage.getItem(JETON) || 'null'); return (x && x.user && x.user.id) || '1'; } catch (e) { return '1'; } }
  function effacer() {
    try {
      Object.keys(localStorage).forEach(function (k) { if (!GARDER.test(k)) localStorage.removeItem(k); });
      localStorage.removeItem(MARQUE_COMPTE);
    } catch (e) {}
  }
  function sessionOuverte() { return /(?:^|; )genesolia_s=1/.test(document.cookie); }
  try {
    var premiere = !localStorage.getItem(REGLE);
    if (connectee()) {
      var id = idCompte(), avant = localStorage.getItem(MARQUE_COMPTE);
      if (avant && avant !== '1' && id !== '1' && avant !== id) effacer();   /* autre compte sur le même appareil : on efface la copie du précédent */
      localStorage.setItem(MARQUE_COMPTE, id);
    }
    else if (localStorage.getItem(MARQUE_COMPTE)) effacer();          /* copie d'un compte dont la session est terminée */
    else if (!sessionOuverte() && !premiere) effacer();                 /* sans compte : navigateur fermé depuis la dernière visite */
    if (premiere) localStorage.setItem(REGLE, '1');                     /* première visite avec cette règle : rien n'est effacé */
    document.cookie = 'genesolia_s=1; path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
  } catch (e) {}
  return { effacer: effacer, connectee: connectee };
})();

/* Mesure d'audience anonyme et sans cookie (Umami) */
(function () {
  var s = document.createElement('script');
  s.defer = true;
  s.src = 'https://cloud.umami.is/script.js';
  s.setAttribute('data-website-id', '5107e0ec-0aab-459d-8890-e040d9bb893e');
  document.head.appendChild(s);
})();

/* Google Analytics : chargé SEULEMENT si la visiteuse clique « Accepter » sur le bandeau.
   Refus ou pas de réponse : rien n'est chargé, aucun cookie Google. Umami continue de compter toutes les visites. */
window.GENESOLIA_GA = 'G-CL135D3MXM';
window.GenesoliaMesure = (function () {
  var CLE = 'consentement-mesure', id = window.GENESOLIA_GA, charge = false;
  function choix() { try { return localStorage.getItem(CLE); } catch (e) { return null; } }
  function charger() {
    if (charge || !id) return;
    charge = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', id, { allow_google_signals: false, allow_ad_personalization_signals: false });
    var g = document.createElement('script');
    g.async = true;
    g.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.appendChild(g);
  }
  function effacer() {
    var hote = location.hostname.replace(/^www\./, '');
    document.cookie.split(';').forEach(function (c) {
      var nom = c.split('=')[0].trim();
      if (/^_ga/.test(nom)) {
        ['', '; domain=' + hote, '; domain=.' + hote].forEach(function (d) {
          document.cookie = nom + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
        });
      }
    });
  }
  function enregistrer(v) {
    try { localStorage.setItem(CLE, v); localStorage.setItem(CLE + '-date', new Date().toISOString().slice(0, 10)); } catch (e) {}
    if (v === 'oui') charger();
    else { if (charge) window['ga-disable-' + id] = true; effacer(); }
  }
  /* Le choix est redemandé au bout de 6 mois (recommandation CNIL) */
  function expire() {
    try { var d = localStorage.getItem(CLE + '-date'); return !d || (new Date() - new Date(d)) > 182 * 864e5; } catch (e) { return true; }
  }
  var c = choix();
  if (c && expire()) { try { localStorage.removeItem(CLE); } catch (e) {} c = null; }
  if (c === 'oui') charger();
  return { choix: choix, enregistrer: enregistrer };
})();

/* ===== Paiements Stripe : coller ici chaque lien de paiement (Stripe > Liens de paiement) =====
   Abonnements : activer « essai gratuit de 30 jours » dans Stripe, et la page de confirmation
   https://genesolia.fr/bienvenue.html. Tant qu'un lien est vide, le bouton propose d'être prévenu·e. */
window.GENESOLIA_STRIPE = {
  cercleMois: '',     /* Le Cercle 29 €/mois, essai 30 jours */
  cercleAn: '',       /* Le Cercle 24,90 €/mois avec engagement 12 mois, essai 30 jours */
  carnet: '',         /* un carnet du mois, 9 € */
  rapport: '',        /* le rapport de ton arbre, 9 € */
  numerologie: '',    /* ton livret de numérologie, 12 € */
  saisons: '',        /* Les 12 saisons, 15 € */
  packLignee: '',     /* Pack Lignée, 35 € */
  packAnnee: '',      /* Pack L'année complète, 79 € */
  astral: '',         /* ton livret du thème astral */
  arbreDeVie: '',     /* ton livret de l'arbre de vie */
  mayaDuo: '',        /* votre analyse maya à deux */
  arbreEncadrer: '',  /* ton arbre à encadrer (fichier HD) */
  impressionA4: '',   /* arbre imprimé, poster A4 */
  impressionA3: '',   /* arbre imprimé, poster A3 */
  impressionA4Cadre: '', /* arbre imprimé, A4 encadré */
  impressionA3Cadre: '', /* arbre imprimé, A3 encadré */
  gestion: ''         /* lien du portail client Stripe (gérer ou arrêter son abonnement) */
};

/* ===== Produits : gratuit ou payant, UN SEUL réglage par produit =====
   payant: false  : gratuit pour toute personne connectée (comme aujourd'hui).
   payant: true   : une personne connectée qui n'a pas acheté voit « Débloquer pour … ».
   Les membres du Cercle (et les accès « offert ») ont tout, sans payer en plus.
   Le lien de paiement de chaque produit se colle plus haut, dans GENESOLIA_STRIPE (même nom). */
window.GENESOLIA_PRODUITS = {
  numerologie:   { payant: false, prix: '12 €', nom: 'ton livret de numérologie', inclus: ['30 pages sur tes nombres', 'Ton chemin de vie, tes cycles et tes défis', 'À garder, imprimer ou offrir'] },
  astral:        { payant: false, prix: '12 €', nom: 'ton livret du thème astral', inclus: ['10 pages sur ton ciel de naissance', 'Soleil, Lune, ascendant et planètes', 'À garder ou imprimer'] },
  arbreDeVie:    { payant: false, prix: '9 €',  nom: "ton livret de l'arbre de vie", inclus: ['16 pages sur tes 10 sphères', 'Tes deux cycles et ce qui est à nourrir', 'Des gestes pour chaque sphère'] },
  mayaDuo:       { payant: false, prix: '9 €',  nom: 'votre analyse à deux', inclus: ['Vos deux signes mayas', 'Ce qui vous rapproche et ce qui frotte', 'Des pistes pour avancer ensemble'] },
  rapport:       { payant: false, prix: '9 €',  nom: 'le rapport de ton arbre', inclus: ['Ton arbre et tes chiffres clés', 'Chaque répétition expliquée', 'Les questions à poser à ta famille'] },
  arbreEncadrer: { payant: false, prix: '12 €', nom: 'ton arbre à encadrer', inclus: ['Ton arbre doré, en haute définition', 'Prêt à imprimer en A4 ou A3', 'Une belle idée de cadeau'] },
  cercle:        { payant: false, prix: '29 € par mois', nom: 'Le Cercle', inclus: [] }
};

/* ===== Arbre imprimé et envoyé (Mon arbre à encadrer) : prix TTC affichés, livraison comprise =====
   actif: false cache l'offre. Chaque format a son lien Stripe dans GENESOLIA_STRIPE (même nom que « stripe »).
   Prix à ajuster après ta commande test : prix TTC = coût livré TTC + au moins 30 € (25 € HT de marge). */
window.GENESOLIA_IMPRESSION = {
  actif: true,
  ouverture: '2026-11-01',   /* avant cette date : « Bientôt disponible », sans commande (test possible avec ?test-impression dans l'adresse) */
  livraison: 'Livraison comprise en France métropolitaine, en 3 à 7 jours ouvrés',
  formats: [
    { id: 'a4',      nom: 'Poster A4 (21 × 29,7 cm)',          prix: '45 €', stripe: 'impressionA4',      largeur: 2480 },
    { id: 'a3',      nom: 'Poster A3 (29,7 × 42 cm)',          prix: '49 €', stripe: 'impressionA3',      largeur: 3508 },
    { id: 'a4cadre', nom: 'A4 encadré, cadre bois naturel',    prix: '59 €', stripe: 'impressionA4Cadre', largeur: 2480 },
    { id: 'a3cadre', nom: 'A3 encadré, cadre bois naturel',    prix: '69 €', stripe: 'impressionA3Cadre', largeur: 3508 }
  ]
};

/* Liens des e-mails de connexion : si Supabase renvoie sur une autre page que Mon espace, on y redirige avec le jeton */
(function () {
  var h = location.hash || '', q = location.search || '';
  var page = location.pathname.split('/').pop() || 'index.html';
  if (page !== 'login.html' && (/(^|[#&])(access_token|error_description)=/.test(h) || /[?&](code|token_hash)=/.test(q))) {
    location.replace('/login.html' + q + h);
  }
})();

(function () {
  var MARQUE = 'Genesolia';
  var MENU = [
    ['methode.html', 'Les deux cycles'],
    ['blessures-de-l-ame.html', 'Tes blessures'],
    ['genosociogramme.html', 'Ta famille'],
    ['theme-numerologique.html', 'Tes nombres'],
    ['theme-astral.html', 'Tes étoiles'],
    ['offert.html', 'Tout est offert'],
    ['mon-suivi.html', 'Mon suivi'],
    ['blog.html', 'Blog'],
    ['login.html', 'Mon espace']
  ];
  var BOUTON = ['abonnement.html', 'Le Cercle'];
  var BOUTON_JEUNES = ['tes-20-ans.html', 'Jeune femme'];  /* espace 18-25 ans et images pour les réseaux */

  var logo = '<svg viewBox="0 0 26 26" fill="none" aria-hidden="true"><circle cx="13" cy="5" r="3" fill="#B98A55"/><circle cx="7" cy="11" r="2.2" stroke="#6B2F5B" stroke-width="1.3"/><circle cx="19" cy="11" r="2.2" stroke="#6B2F5B" stroke-width="1.3"/><circle cx="13" cy="15" r="2.4" fill="#6B2F5B"/><path d="M13 17.5v4M13 21.5l-4 3M13 21.5l4 3" stroke="#6B2F5B" stroke-width="1.3" stroke-linecap="round"/></svg>';
  var page = location.pathname.split('/').pop() || 'index.html';
  /* Pages du tunnel d'essai : ni bandeau, ni encart, ni petit carré pour ne pas distraire */
  var tunnel = page === 'essai.html' || page === 'bienvenue.html' || page === 'cercle.html';  /* cercle.html : l'appli des membres, sans publicité */

  var entete = document.querySelector('[data-entete]');
  if (entete) {
    var liens = MENU.map(function (l) {
      return '<a href="' + l[0] + '"' + (l[0] === page ? ' aria-current="page"' : '') + '>' + l[1] + '</a>';
    }).join('');
    entete.className = 'entete';
    entete.innerHTML =
      '<div class="conteneur">' +
        '<a class="marque" href="/">' + logo + MARQUE + '</a>' +
        '<button class="burger" type="button" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="menu">' +
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>' +
        '</button>' +
        '<nav class="menu" id="menu" aria-label="Menu principal">' + liens +
          '<a href="#" class="menu-appli" data-installer hidden>Installer l\'appli</a>' +
          '<a class="btn btn-jeunes"' + (BOUTON_JEUNES[0] === page ? ' aria-current="page"' : '') + ' href="' + BOUTON_JEUNES[0] + '">' + BOUTON_JEUNES[1] + '</a>' +
          '<a class="btn btn-plein" href="' + BOUTON[0] + '">' + BOUTON[1] + '</a>' +
        '</nav>' +
      '</div>';
    /* Lien de l'espace : « Me connecter » ou « Mon espace » (avec un point doré) selon l'état, mis à jour entre onglets */
    var majEspace = function () {
      var a = entete.querySelector('.menu a[href="login.html"]'); if (!a) return;
      var x = null; try { x = JSON.parse(localStorage.getItem('sb-qsvzzkjtjsznfntahvvh-auth-token') || 'null'); } catch (e) {}
      var co = !!(x && x.refresh_token);
      a.classList.toggle('espace-connecte', co);
      a.innerHTML = co ? '<span class="point-connecte" aria-hidden="true"></span>Mon espace' : 'Me connecter';
      a.setAttribute('title', co ? 'Tu es connectée' + (x.user && x.user.email ? ' (' + x.user.email + ')' : '') : 'Se connecter ou créer son espace');
    };
    majEspace();
    window.GenesoliaMajEntete = majEspace;
    /* Sans compte, sur les outils : rappel discret que le travail s'efface à la fermeture du navigateur */
    var OUTILS = ['genosociogramme.html', 'theme-numerologique.html', 'theme-astral.html', 'arbre-de-vie.html', 'ton-signe-maya.html', 'ton-prenom.html', 'blessures-de-l-ame.html', 'parcours.html', 'mon-suivi.html', 'exercice-ressenti-ancetre.html', 'calcul-syndrome-anniversaire.html'];
    var vuNote = false; try { vuNote = sessionStorage.getItem('note-donnees') === 'vue'; } catch (e) {}
    if (OUTILS.indexOf(page) >= 0 && !vuNote && !(window.GenesoliaDonnees && window.GenesoliaDonnees.connectee())) {
      var note = document.createElement('div');
      note.className = 'note-donnees'; note.setAttribute('role', 'note');
      note.innerHTML = '<div class="conteneur"><p>Sans compte, ton travail est gardé jusqu’à la fermeture de ton navigateur. <a href="login.html?inscription&amp;retour=' + page + '">Crée ton espace gratuit</a> pour le retrouver plus tard.</p><button type="button" aria-label="Fermer">×</button></div>';
      note.querySelector('button').addEventListener('click', function () { note.remove(); try { sessionStorage.setItem('note-donnees', 'vue'); } catch (e) {} });
      entete.parentNode.insertBefore(note, entete.nextSibling);
    }
    window.addEventListener('storage', function (e) { if (!e.key || e.key === 'sb-qsvzzkjtjsznfntahvvh-auth-token') majEspace(); });
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
        '<div class="pied-appli">' +
          '<div class="pa-tel" aria-hidden="true"><div class="pa-ecran">' +
            '<div class="pa-barre"><span>9:41</span><span class="pa-encoche"></span><span>●●●</span></div>' +
            '<div class="pa-grille"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>' +
            '<b><img src="/assets/icones/icone-192.png" alt="" width="64" height="64" loading="lazy"><em>Genesolia</em></b>' +
            '<i></i><i></i><i></i><i></i></div>' +
          '</div></div>' +
          '<div class="pa-texte"><p class="pa-sur">L\'appli gratuite</p><p class="pa-titre">GENESOLIA<br><span>dans ta poche</span></p>' +
            '<ul><li>Ton arbre, tes nombres, tes étoiles en un geste</li><li>Plein écran, comme une vraie appli</li><li>Sans store, sans compte obligatoire</li></ul>' +
            '<a href="#" class="btn pa-bouton" data-installer-bandeau>Installer l\'appli</a></div>' +
        '</div>' +
        '<div class="pied-grille">' +
          '<div><a class="marque" href="/">' + MARQUE + '</a>' +
            '<p>Des outils pour comprendre ce qui se répète dans ta vie, à partir de ton histoire familiale et de l\'arbre de vie.</p></div>' +
          '<div><h4>Les outils</h4><ul>' +
            '<li><a href="offert.html">Tout est offert</a></li>' +
            '<li><a href="arbre-de-vie.html">Test de l\'arbre de vie</a></li>' +
            '<li><a href="parcours.html">Parcours guidé</a></li>' +
            '<li><a href="mon-suivi.html">Mon suivi</a></li>' +
            '<li><a href="mon-guide.html">Mon guide du mois</a></li>' +
            '<li><a href="theme-numerologique.html">Thème numérologique</a></li>' +
            '<li><a href="theme-astral.html">Thème astral</a></li>' +
            '<li><a href="ton-prenom.html">Ton prénom</a></li>' +
            '<li><a href="tes-20-ans.html">Jeune femme</a></li>' +
            '<li><a href="cartes.html">Images à partager</a></li>' +
            '<li><a href="jeux.html">Jeux pour se rapprocher</a></li>' +
            '<li><a href="jeux-en-famille.html">Jeux en famille</a></li>' +
            '<li><a href="genosociogramme.html">Mon arbre familial</a></li>' +
            '<li><a href="espace-praticien.html">Espace praticien</a></li>' +
            '<li><a href="blessures-de-l-ame.html">Les blessures de l\'âme</a></li>' +
            '<li><a href="outils.html">Tous les outils</a></li></ul></div>' +
          '<div><h4>Guides</h4><ul>' +
            '<li><a href="quest-ce-qu-un-genosociogramme.html">Qu\'est-ce qu\'un génosociogramme ?</a></li>' +
            '<li><a href="comment-faire-son-genosociogramme.html">Comment faire son génosociogramme</a></li>' +
            '<li><a href="exemple-genosociogramme.html">Exemple de génosociogramme</a></li>' +
            '<li><a href="genosociogramme-vierge.html">Génosociogramme vierge (PDF)</a></li>' +
            '<li><a href="symboles-genosociogramme.html">Les symboles</a></li></ul></div>' +
          '<div><h4>Comprendre</h4><ul>' +
            '<li><a href="blog.html">Le blog</a></li>' +
            '<li><a href="histoires.html">Histoires de familles</a></li>' +
            '<li><a href="le-ciel-du-mois.html">Le ciel du mois</a></li>' +
            '<li><a href="methode.html">La méthode des deux cycles</a></li>' +
            '<li><a href="heriter.html">Le transgénérationnel</a></li>' +
            '<li><a href="les-10-sephiroth.html">Les 10 Séphiroth</a></li>' +
            '<li><a href="syndrome-anniversaire.html">Le syndrome d\'anniversaire</a></li>' +
            '<li><a href="psychogenealogie.html">La psychogénéalogie</a></li>' +
            '<li><a href="/#questions">Questions fréquentes</a></li></ul></div>' +
          '<div><h4>Informations</h4><ul>' +
            '<li><a href="mentions-legales.html">Mentions légales</a></li>' +
            '<li><a href="confidentialite.html">Confidentialité et cookies</a></li>' +
            '<li><a href="#" data-cookies>Gérer mes cookies</a></li>' +
            '<li><a href="login.html">Mon espace</a></li>' +
            '<li><a href="abonnement.html">Le Cercle · abonnement</a></li>' +
            '<li><a href="#" data-installer hidden>Installer l\'appli sur mon téléphone</a></li></ul></div>' +
        '</div>' +
        '<div class="pied-bas">' +
          '<span>Ce site propose une lecture symbolique de ton histoire. Il ne remplace pas un avis médical ou psychologique.</span>' +
          '<span>© ' + MARQUE + ' ' + new Date().getFullYear() + '</span>' +
        '</div>' +
      '</div>';
  }

  /* Cadeau : le carnet des deux cycles contre un e-mail.
     Placer <div data-cadeau></div> là où le bloc doit apparaître. */

  /* Mails automatiques (N8N) : adresse de ton N8N, terminée par /webhook/ (ex. 'https://n8n.mondomaine.fr/webhook/').
     Tant qu'elle est vide, rien n'est envoyé à N8N et le site fonctionne comme avant. */
  var N8N = 'https://strakara.app.n8n.cloud/webhook/';
  function versN8N(chemin, donnees) {
    if (!N8N) return;
    try { fetch(N8N + chemin, { method: 'POST', body: donnees, mode: 'no-cors', keepalive: true }).catch(function () {}); } catch (e) {}
  }
  window.GenesoliaN8N = versN8N;

  /* Formulaires du site (remplace Formspree) : chaque envoi est rangé dans la table « demandes » de Supabase
     et, si un chemin N8N est donné, part aussi vers N8N pour les mails. Réussi dès que l'un des deux a reçu. */
  var SB_DEMANDES = 'https://qsvzzkjtjsznfntahvvh.supabase.co/rest/v1/demandes', SB_CLE = 'sb_publishable_6iEVxXmtB_u1hJ6mPS9fNg_CJhLjYkg';
  function envoyerFormulaire(formulaire, donnees, chemin) {
    var fd = donnees instanceof FormData ? donnees : new FormData();
    if (!(donnees instanceof FormData)) Object.keys(donnees || {}).forEach(function (k) { fd.append(k, donnees[k]); });
    if (fd.get('_gotcha')) return Promise.resolve();
    var details = {}, email = String(fd.get('email') || '').trim(), prenom = String(fd.get('prenom') || '').trim();
    fd.forEach(function (v, k) { if (k !== 'email' && k !== 'prenom' && k.charAt(0) !== '_' && typeof v === 'string') details[k] = v.slice(0, 500); });
    var versSB = fetch(SB_DEMANDES, { method: 'POST', headers: { apikey: SB_CLE, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ formulaire: formulaire, email: email, prenom: prenom.slice(0, 60) || null, page: page, details: details }) })
      .then(function (r) { return r.ok; }).catch(function () { return false; });
    var versN = !chemin || !N8N ? Promise.resolve(false) : fetch(N8N + chemin, { method: 'POST', body: fd, keepalive: true })
      .then(function (r) { return r.ok; })
      .catch(function () { return navigator.onLine !== false; }); /* réponse illisible (CORS) mais requête bien partie */
    return Promise.all([versSB, versN]).then(function (r) { if (!r[0] && !r[1]) throw new Error('envoi'); });
  }
  window.GenesoliaEnvoyer = envoyerFormulaire;
  window.GenesoliaN8NAdresse = function () { return N8N; };
  var CARNET = 'assets/carnet-des-deux-cycles-8a44d6c993.pdf';
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
  /* Encart cadeau ajouté tout seul en bas de chaque page qui n'en a pas déjà un */
  var piedPage = document.querySelector('[data-pied]');
  if (piedPage && !tunnel && !document.querySelector('[data-cadeau]')) {
    var zoneCadeau = document.createElement('section');
    zoneCadeau.className = 'bloc cadeau-bas';
    zoneCadeau.innerHTML = '<div class="conteneur"><div data-cadeau></div></div>';
    piedPage.parentNode.insertBefore(zoneCadeau, piedPage);
  }

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
      envoyerFormulaire('Carnet des deux cycles', data, 'genesolia-carnet')
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

  /* ===== Formation « Sors de la boucle » : annonce, encart et liste d'attente =====
     Pour changer la date ou masquer l'annonce, modifier les trois valeurs ci-dessous. */
  var FORMATION = {
    date: 'le 7 novembre',                          /* ouverture des inscriptions */
    module1: 'le 1er novembre',                     /* envoi du module 1 offert à la liste */
    page: 'formation.html',
    finAnnonce: '2026-11-08'                        /* le bandeau disparaît à cette date */
  };
  var annonceActive = new Date() < new Date(FORMATION.finAnnonce + 'T00:00:00');

  /* Bandeau fin en haut de toutes les pages (sauf la page de la formation) */
  var fermee = false;
  try { fermee = sessionStorage.getItem('annonce-formation') === 'fermee'; } catch (e) {}
  if (annonceActive && !fermee && !tunnel && page !== FORMATION.page && entete) {
    var bandeau = document.createElement('div');
    bandeau.className = 'annonce';
    bandeau.innerHTML =
      '<a href="' + FORMATION.page + '"><span class="annonce-pastille">Nouveau</span> Formation « Sors de la boucle » : <u>rejoins la liste, reçois le module 1 offert ' + FORMATION.module1 + '</u>, teste-le, puis inscris-toi dès ' + FORMATION.date + '.</a>' +
      '<button type="button" aria-label="Fermer l\'annonce">×</button>';
    bandeau.querySelector('button').addEventListener('click', function () {
      bandeau.remove();
      try { sessionStorage.setItem('annonce-formation', 'fermee'); } catch (e) {}
    });
    entete.parentNode.insertBefore(bandeau, entete);
  }

  /* Encart à placer n'importe où : <div data-formation></div> */
  document.querySelectorAll('[data-formation]').forEach(function (el) {
    el.className = 'encart-formation';
    el.innerHTML =
      '<div class="ef-texte">' +
        '<p class="ef-sur">Nouvelle formation · module 1 offert ' + FORMATION.module1 + ' · inscriptions ' + FORMATION.date + '</p>' +
        '<h2>Tu connais ton schéma. Maintenant, arrête de le répéter.</h2>' +
        '<p>« Sors de la boucle » : 8 modules, 8 séances audio guidées et un geste concret par module pour arrêter la boucle dès le premier jour. À ton rythme, sur ton téléphone ou ton ordinateur.</p>' +
        '<ul class="ef-avantages">' +
          '<li><b>Le module 1 offert</b>, envoyé par e-mail ' + FORMATION.module1 + ' : tu le testes avant de t\'inscrire</li>' +
          '<li><b>Le tarif fondatrice</b>, réservé à la liste</li>' +
          '<li><b>Accès 48 h avant</b> tout le monde</li>' +
        '</ul>' +
        '<a class="btn btn-plein" href="' + FORMATION.page + '">Je rejoins la liste</a>' +
        '<p class="ef-note">Gratuit et sans engagement.</p>' +
      '</div>' +
      '<div class="ef-visuel" aria-hidden="true"><img src="assets/formation/module-1-apercu.jpg" alt="" width="580" height="820" loading="lazy"></div>';
  });

  /* Formulaire de liste d'attente : <div data-liste-formation></div> */
  document.querySelectorAll('[data-liste-formation]').forEach(function (el, n) {
    var id = 'liste-' + n;
    var deja = false;
    try { deja = localStorage.getItem('liste-formation') === 'oui'; } catch (e) {}
    var boucles = ['En amour', 'Avec l\'argent', 'Au travail', 'En famille', 'Dans ma confiance en moi', 'Autre'];
    var budgets = ['Moins de 50 €', 'De 50 à 100 €', 'De 100 à 200 €', 'Plus de 200 €'];
    /* Plus de téléchargement immédiat : le module 1 est envoyé par e-mail, étape par étape, quand tout est prêt. */
    function bravo(prenom) {
      return '<div class="liste-merci"><p class="liste-merci-titre">' + (prenom ? 'Bienvenue ' + prenom.replace(/[<>&"]/g, '') + ' !' : 'Bienvenue !') + '</p>' +
        '<p>Tu es bien sur la liste. <b>' + FORMATION.module1.charAt(0).toUpperCase() + FORMATION.module1.slice(1) + '</b>, ton module 1 offert t\'arrive par e-mail, étape par étape :</p>' +
        '<ol class="liste-etapes">' +
          '<li><b>La feuille de cours</b><span>pour comprendre ta boucle</span></li>' +
          '<li><b>La séance audio guidée</b><span>20 minutes pour la vivre</span></li>' +
          '<li><b>Le cahier d\'exercices</b><span>et ton carnet de 7 jours</span></li>' +
        '</ol>' +
        '<p class="discret">Tu as une semaine pour le tester. Les inscriptions ouvrent ensuite ' + FORMATION.date + ' : tu t\'inscris en priorité, au tarif fondatrice, 48 h avant l\'ouverture au public. Pense à vérifier tes courriers indésirables et à ajouter notre adresse à tes contacts.</p></div>';
    }
    el.className = 'liste-formation';
    if (deja) { el.innerHTML = bravo(''); return; }
    el.innerHTML =
      '<form class="liste-form" novalidate>' +
        '<div class="liste-champs">' +
          '<label for="' + id + '-prenom">Prénom<input id="' + id + '-prenom" name="prenom" autocomplete="given-name" required></label>' +
          '<label for="' + id + '-email">E-mail<input id="' + id + '-email" name="email" type="email" autocomplete="email" required></label>' +
        '</div>' +
        '<fieldset><legend>Quelle boucle aimerais-tu arrêter en premier ? <span>(plusieurs choix possibles)</span></legend><div class="liste-choix">' +
          boucles.map(function (b, i) { return '<label><input type="checkbox" name="boucle" value="' + b.replace(/"/g, '') + '"><span>' + b + '</span></label>'; }).join('') +
        '</div></fieldset>' +
        '<fieldset><legend>Pour une formation complète comme celle-ci, quel budget te semblerait juste ? <span>(facultatif)</span></legend><div class="liste-choix">' +
          budgets.map(function (b) { return '<label><input type="radio" name="budget" value="' + b + '"><span>' + b + '</span></label>'; }).join('') +
        '</div></fieldset>' +
        '<label class="liste-accord"><input type="checkbox" name="accord" value="oui" required><span>J\'accepte de recevoir le module 1 offert et les informations sur la formation par e-mail. Je peux me désinscrire à tout moment. <a href="confidentialite.html">Mes données</a></span></label>' +
        '<input type="text" name="_gotcha" tabindex="-1" autocomplete="off" class="cadeau-piege" aria-hidden="true">' +
        '<button class="btn btn-plein" type="submit">Je rejoins la liste et je reçois le module 1</button>' +
        '<p class="liste-erreur" role="alert"></p>' +
      '</form>';
    var form = el.querySelector('form');
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var err = form.querySelector('.liste-erreur'), btn = form.querySelector('button');
      var prenom = form.prenom.value.trim(), email = form.email.value.trim();
      if (!prenom || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = 'Indique ton prénom et une adresse e-mail valide.'; return; }
      if (!form.accord.checked) { err.textContent = 'Coche la case d\'accord pour rejoindre la liste.'; return; }
      err.textContent = ''; btn.disabled = true; btn.textContent = 'Envoi en cours…';
      var data = new FormData(form);
      var choix = [].slice.call(form.querySelectorAll('input[name=boucle]:checked')).map(function (c) { return c.value; });
      data.delete('boucle'); data.append('boucle', choix.join(', ') || 'non précisé');
      data.append('liste', 'Formation Sors de la boucle');
      data.append('source', page);
      data.append('_subject', 'Liste d\'attente : formation Sors de la boucle');
      envoyerFormulaire('Formation Sors de la boucle', data, 'genesolia-formation')
        .then(function () {
          try { localStorage.setItem('liste-formation', 'oui'); } catch (e) {}
          el.innerHTML = bravo(prenom);
        })
        .catch(function () {
          btn.disabled = false; btn.textContent = 'Je rejoins la liste et je reçois le module 1';
          err.textContent = 'L\'envoi n\'a pas fonctionné. Vérifie ta connexion et réessaie dans un instant.';
        });
    });
  });

  /* Bandeau cookies : Accepter ou Refuser la mesure Google Analytics (Umami, sans cookie, compte toujours) */
  var vu = !!window.GenesoliaMesure.choix();
  function bandeauCookies(auto) {
    var ancien = document.querySelector('.cookies');
    if (ancien) ancien.remove();
    var b = document.createElement('div');
    b.className = 'cookies visible';
    b.setAttribute('role', 'region');
    b.setAttribute('aria-label', 'Tes choix sur les cookies');
    b.innerHTML =
      '<p class="cookies-titre">Tes choix sur les cookies</p>' +
      '<p>Umami compte les visites sans cookie et sans t\'identifier. Avec ton accord, Google Analytics nous aide en plus à comprendre comment le site est utilisé (cookies de mesure, gardés 13 mois au plus). Aucune publicité, aucune revente. Tes réponses restent dans ton navigateur ; si tu crées un compte, tes sauvegardes sont stockées en Europe (Irlande). <a href="confidentialite.html#cookies">En savoir plus</a></p>' +
      '<div class="cookies-boutons"><button class="btn btn-trait" type="button" data-choix="non">Refuser</button>' +
      '<button class="btn btn-plein" type="button" data-choix="oui">Accepter</button></div>';
    Array.prototype.forEach.call(b.querySelectorAll('[data-choix]'), function (bt) {
      bt.addEventListener('click', function () {
        window.GenesoliaMesure.enregistrer(bt.getAttribute('data-choix'));
        b.classList.remove('visible');
        if (auto) setTimeout(carreCercle, 1500);
      });
    });
    document.body.appendChild(b);
  }
  if (!vu) bandeauCookies(true);
  document.addEventListener('click', function (e) {
    var l = e.target.closest && e.target.closest('[data-cookies]');
    if (!l) return;
    e.preventDefault();
    bandeauCookies(false);
  });

  /* Petit carré en bas à gauche : le premier carnet du Cercle offert (jamais sur mon-carnet.html : la personne est déjà dans le carnet).
     Pour le changer de mois : modifier les valeurs ci-dessous. Fermé, il revient à la prochaine visite. */
  var CARRE = {
    titre: 'Ce qui revient',
    image: 'assets/cercle/apercu-2026-10.jpg',
    lien: 'mon-mois.html#offert'
  };
  /* Sur téléphone, le petit carré attend que la personne ait lu un peu (60 % de la page) et ne s'ajoute jamais par-dessus une autre fenêtre */
  var PETIT_ECRAN = window.matchMedia && window.matchMedia('(max-width: 760px)').matches;
  function carreCercle() {
    if (PETIT_ECRAN && !carreCercle.pret) {
      var attendre = function () {
        var h = document.documentElement, lu = (h.scrollTop + window.innerHeight) / Math.max(1, h.scrollHeight);
        if (lu < 0.6) return;
        window.removeEventListener('scroll', attendre);
        carreCercle.pret = true; carreCercle();
      };
      window.addEventListener('scroll', attendre, { passive: true });
      return;
    }
    if (document.querySelector('.appli-fenetre, .chemin-toast.visible, .cookies.visible')) return;
    if (tunnel || page === 'mon-mois.html' || page === 'mon-carnet.html' || page === 'genosociogramme.html' || page === 'abonnement.html' || page === 'offert.html' || document.querySelector('.carre-cercle')) return;
    try {
      if (sessionStorage.getItem('carre-cercle-ferme') === '1') return;
    } catch (e) {}
    var c = document.createElement('aside');
    c.className = 'carre-cercle';
    c.setAttribute('aria-label', 'Le premier carnet du Cercle offert');
    c.innerHTML =
      '<button type="button" class="cc-fermer" aria-label="Fermer">×</button>' +
      '<img src="' + CARRE.image + '" alt="" width="60" height="85" loading="lazy">' +
      '<div><p class="cc-sur">Offert · 10 pages</p>' +
        '<p class="cc-titre">Le premier carnet du Cercle : « ' + CARRE.titre + ' »</p>' +
        '<p class="cc-texte">Le thème du mois, trois exercices, un rituel et une méditation à lire.</p>' +
        '<a class="cc-bouton" href="' + CARRE.lien + '">Je le reçois</a></div>';
    c.querySelector('.cc-fermer').addEventListener('click', function () {
      c.remove();
      try { sessionStorage.setItem('carre-cercle-ferme', '1'); } catch (e) {}
    });
    document.body.appendChild(c);
    requestAnimationFrame(function () { c.classList.add('visible'); });
  }
  if (vu) setTimeout(carreCercle, 5000);

  /* ===== Application installable (bouton « Installer l'appli ») ===== */
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', function () { navigator.serviceWorker.register('/sw.js').catch(function () {}); });
  }
  var installee = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  var iOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var invite = null;
  function montrerInstall() { document.querySelectorAll('[data-installer]').forEach(function (a) { a.hidden = false; }); }
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); invite = e; if (!installee) montrerInstall(); });
  window.addEventListener('appinstalled', function () { invite = null; document.querySelectorAll('[data-installer]').forEach(function (a) { a.hidden = true; }); });
  var ua = navigator.userAgent;
  var android = /android/i.test(ua), chromeIOS = /crios/i.test(ua), samsung = /samsungbrowser/i.test(ua), firefox = /firefox|fxios/i.test(ua);
  if (!installee && (iOS || android)) montrerInstall();
  if (installee) document.querySelectorAll('.pied-appli').forEach(function (b) { b.remove(); });
  function aideInstall() {
    /* Nom et icône de l'appli : Genesolia, ou « Le Cercle » sur cercle.html (window.GENESOLIA_APPLI) */
    var APPLI = window.GENESOLIA_APPLI || { nom: 'Genesolia', icone: '/apple-touch-icon.png' };
    var f = document.createElement('div');
    f.className = 'appli-fenetre';
    f.setAttribute('role', 'dialog'); f.setAttribute('aria-modal', 'true'); f.setAttribute('aria-label', 'Installer l\'appli ' + APPLI.nom);
    var partage = '<svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true" style="display:inline;vertical-align:-3px"><path d="M10 2v10M6 6l4-4 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 9H4v9h12V9h-1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
    f.innerHTML = '<div class="appli-carte"><button type="button" class="appli-fermer" aria-label="Fermer">×</button>' +
      '<img src="' + APPLI.icone + '" alt="" width="64" height="64"><h2>' + APPLI.nom + ' sur ton téléphone</h2>' +
      (iOS && chromeIOS
        ? '<ol><li>Touche le bouton <b>Partager</b> ' + partage + ' en haut à droite, dans la barre d\'adresse.</li><li>Choisis <b>Ajouter à l\'écran d\'accueil</b>.</li><li>Touche <b>Ajouter</b> : l\'icône ' + APPLI.nom + ' apparaît avec tes applis.</li></ol>'
        : iOS
        ? '<ol><li>Touche le bouton <b>Partager</b> ' + partage + ' en bas de Safari.</li><li>Choisis <b>Sur l\'écran d\'accueil</b>.</li><li>Touche <b>Ajouter</b> : l\'icône ' + APPLI.nom + ' apparaît avec tes applis.</li></ol>'
        : android && samsung
        ? '<ol><li>Touche le menu <b>≡</b> en bas à droite.</li><li>Choisis <b>Ajouter page à</b>, puis <b>Écran d\'accueil</b>.</li><li>Ouvre ensuite ' + APPLI.nom + ' depuis son icône.</li></ol>'
        : android && firefox
        ? '<ol><li>Touche le menu <b>⋮</b>.</li><li>Choisis <b>Installer</b> (ou <b>Ajouter à l\'écran d\'accueil</b>).</li></ol><p>Pour la meilleure version, ouvre plutôt genesolia.fr dans Chrome.</p>'
        : android
        ? '<ol><li>Touche le menu <b>⋮</b> en haut à droite de Chrome.</li><li>Choisis <b>Installer l\'application</b>. Si tu ne vois que « Ajouter à l\'écran d\'accueil », touche-le puis choisis <b>Installer</b> (et non « Créer un raccourci »).</li><li>Patiente quelques secondes : l\'icône Genesolia arrive avec tes applis. Ouvre-la depuis là, pas depuis Chrome.</li></ol>'
        : '<ol><li>Dans Chrome ou Edge, clique sur l\'icône <b>Installer</b> à droite de la barre d\'adresse (un petit écran avec une flèche).</li><li>Confirme avec <b>Installer</b>.</li><li>' + APPLI.nom + ' s\'ouvre dans sa propre fenêtre, et se retrouve avec tes applications.</li></ol><p>Sur téléphone, ouvre genesolia.fr et touche « Installer l\'appli » en bas de la page.</p>') +
      '<p class="appli-note">Gratuit, sans téléchargement dans un store. Tes outils s\'ouvrent en plein écran, comme une vraie appli.</p></div>';
    function fermer() { f.remove(); }
    f.addEventListener('click', function (e) { if (e.target === f || e.target.closest('.appli-fermer')) fermer(); });
    document.addEventListener('keydown', function k(e) { if (e.key === 'Escape') { fermer(); document.removeEventListener('keydown', k); } });
    document.body.appendChild(f);
    f.querySelector('.appli-fermer').focus();
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-installer],[data-installer-bandeau]'); if (!a) return;
    e.preventDefault();
    if (invite) { invite.prompt(); invite.userChoice.then(function () { invite = null; }); }
    else aideInstall();
  });

  /* Partage depuis le téléphone, avec l'image de la page quand c'est possible (Instagram, WhatsApp, Messenger…) */
  function partagerAvecImage(titre, adresse, image) {
    var simple = function () { return navigator.share({ title: titre, text: titre, url: adresse }); };
    if (!image || !window.fetch || !navigator.canShare) return simple();
    return fetch(image).then(function (r) { return r.ok ? r.blob() : Promise.reject(); }).then(function (b) {
      var f = new File([b], 'genesolia.' + (/png/.test(b.type) ? 'png' : 'jpg'), { type: b.type || 'image/jpeg' });
      var d = { title: titre, text: titre + ' ' + adresse, files: [f] };
      return navigator.canShare(d) ? navigator.share(d) : simple();
    }).catch(function (e) { if (e && e.name === 'AbortError') return; return simple(); });
  }
  window.GenesoliaPartager = partagerAvecImage;

  /* ===== Partage : en bas de chaque article, et partout où il y a <div data-partage></div> ===== */
  var colArticle = document.querySelector('article.article .colonne');
  if (colArticle && !document.querySelector('[data-partage]')) { var zp = document.createElement('div'); zp.setAttribute('data-partage', ''); colArticle.appendChild(zp); }
  document.querySelectorAll('[data-partage]').forEach(function (z) {
    var adresse = (document.querySelector('link[rel=canonical]') || {}).href || location.href;
    var titre = (document.querySelector('meta[property="og:title"]') || {}).content || document.title;
    var image = (document.querySelector('meta[property="og:image"]') || {}).content || '';
    var u = encodeURIComponent(adresse), t = encodeURIComponent(titre);
    var I = {
      partager: '<svg viewBox="0 0 20 20" fill="none"><circle cx="15" cy="4.5" r="2.3" stroke="currentColor" stroke-width="1.5"/><circle cx="5" cy="10" r="2.3" stroke="currentColor" stroke-width="1.5"/><circle cx="15" cy="15.5" r="2.3" stroke="currentColor" stroke-width="1.5"/><path d="M7 9l6-3.3M7 11l6 3.3" stroke="currentColor" stroke-width="1.5"/></svg>',
      fb: '<svg viewBox="0 0 20 20"><path fill="currentColor" d="M11.2 18v-6.6h2.2l.4-2.6h-2.6V7.2c0-.8.2-1.3 1.3-1.3H14V3.6c-.2 0-1-.1-2-.1-2 0-3.4 1.2-3.4 3.5v1.9H6.4v2.6h2.2V18z"/></svg>',
      wa: '<svg viewBox="0 0 20 20" fill="none"><path d="M3.5 16.5l1-3.4A7 7 0 1 1 7 15.6z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M7.6 7.3c.2-.5.5-.5.8-.5l.5 1.2-.5.7c.4.9 1.2 1.7 2.1 2.1l.7-.5 1.2.5c0 .3 0 .6-.5.8-.6.4-1.4.4-2.3 0-1-.5-2-1.5-2.4-2.4-.4-.8-.1-1.4.4-1.9z" fill="currentColor"/></svg>',
      pin: '<svg viewBox="0 0 20 20"><path fill="currentColor" d="M10.2 2.5C6 2.5 4 5.4 4 7.9c0 1.5.6 2.8 1.8 3.3.2.1.4 0 .4-.2l.2-.7c0-.2 0-.3-.1-.5-.4-.4-.6-1-.6-1.8 0-2.3 1.7-4.4 4.5-4.4 2.4 0 3.8 1.5 3.8 3.5 0 2.6-1.2 4.8-2.9 4.8-.9 0-1.6-.8-1.4-1.7.3-1.1.8-2.3.8-3.1 0-.7-.4-1.3-1.2-1.3-1 0-1.7 1-1.7 2.3 0 .8.3 1.4.3 1.4l-1.1 4.7c-.3 1.4 0 3.1 0 3.3 0 .1.2.1.2 0 .1-.1 1.1-1.4 1.4-2.7l.6-2.2c.3.5 1.1 1 2 1 2.6 0 4.4-2.4 4.4-5.6C16 4.8 13.8 2.5 10.2 2.5z"/></svg>',
      insta: '<svg viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="4" stroke="currentColor" stroke-width="1.5"/><circle cx="10" cy="10" r="3.2" stroke="currentColor" stroke-width="1.5"/><circle cx="14.2" cy="5.8" r=".9" fill="currentColor"/></svg>',
      lien: '<svg viewBox="0 0 20 20" fill="none"><path d="M8.5 11.5a3.5 3.5 0 0 0 5 0l2.5-2.5a3.5 3.5 0 0 0-5-5l-1 1M11.5 8.5a3.5 3.5 0 0 0-5 0L4 11a3.5 3.5 0 0 0 5 5l1-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
    };
    z.className = 'partage';
    z.innerHTML = '<p class="partage-titre">' + (z.getAttribute('data-partage') || 'Ça t\'a parlé ? Partage-le à quelqu\'un qui en a besoin.') + '</p><div class="partage-boutons">' +
      (navigator.share ? '<button type="button" class="pt-natif" data-pt="natif">' + I.partager + '<span>Partager <small>Instagram, Messenger, SMS…</small></span></button>' : '') +
      '<button type="button" data-pt="insta" aria-label="Partager sur Instagram">' + I.insta + '<span>Instagram</span></button>' +
      '<a href="https://www.facebook.com/sharer/sharer.php?u=' + u + '" target="_blank" rel="noopener" aria-label="Partager sur Facebook">' + I.fb + '<span>Facebook</span></a>' +
      '<a href="https://wa.me/?text=' + t + '%20' + u + '" target="_blank" rel="noopener" aria-label="Partager sur WhatsApp">' + I.wa + '<span>WhatsApp</span></a>' +
      (image ? '<a href="https://www.pinterest.fr/pin/create/button/?url=' + u + '&media=' + encodeURIComponent(image) + '&description=' + t + '" target="_blank" rel="noopener" aria-label="Épingler sur Pinterest">' + I.pin + '<span>Pinterest</span></a>' : '') +
      '<button type="button" data-pt="lien">' + I.lien + '<span>Copier le lien</span></button>' +
      '</div><p class="partage-statut" aria-live="polite"></p>';
    var st = z.querySelector('.partage-statut');
    z.addEventListener('click', function (e) {
      var b = e.target.closest('[data-pt]'); if (!b) return;
      var t = b.getAttribute('data-pt');
      if (t === 'natif' || (t === 'insta' && navigator.share)) { partagerAvecImage(titre, adresse, image); return; }
      if (t === 'insta') {
        (navigator.clipboard ? navigator.clipboard.writeText(adresse) : Promise.reject()).then(function () {
          st.innerHTML = 'Lien copié. Sur ton téléphone, le bouton Instagram ajoute aussi l\'image. Depuis l\'ordinateur : colle ce lien dans ta bio ou ta story. <a href="https://www.instagram.com/genesolia.officiel/" target="_blank" rel="noopener">Ouvrir Instagram</a>';
        }, function () { st.textContent = adresse; });
        return;
      }
      else (navigator.clipboard ? navigator.clipboard.writeText(adresse) : Promise.reject()).then(function () { st.textContent = 'Lien copié : colle-le dans ta story, un message ou ta bio.'; }, function () { st.textContent = adresse; });
    });
  });

  /* ===== Cœur « J'aime » (compteur dans Supabase, table jaimes) =====
     Le nombre ne s'affiche qu'à partir de SEUIL_JAIME, pour ne pas montrer « 1 » ou « 2 » au début. */
  var SEUIL_JAIME = 1;
  var SB = 'https://qsvzzkjtjsznfntahvvh.supabase.co/rest/v1/rpc/', SBK = 'sb_publishable_6iEVxXmtB_u1hJ6mPS9fNg_CJhLjYkg';
  var pageJaime = page.replace(/\.html$/, '').toLowerCase();
  var avecJaime = /^[a-z0-9-]{1,80}$/.test(pageJaime) && (document.querySelector('article.article') || document.querySelector('[data-partage]'));
  function rpc(nom, corps) {
    return fetch(SB + nom, { method: 'POST', headers: { apikey: SBK, Authorization: 'Bearer ' + SBK, 'Content-Type': 'application/json' }, body: JSON.stringify(corps) })
      .then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
  }
  var COEUR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.4 4.5 6.9 4.5c2 0 3.4 1.1 4.1 2.3h2c.7-1.2 2.1-2.3 4.1-2.3 3.5 0 5.5 3.5 4.2 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"/></svg>';
  var dejaAime = false, totalJaime = null;
  try { dejaAime = localStorage.getItem('jaime-' + pageJaime) === '1'; } catch (e) {}
  function majCoeurs() {
    document.querySelectorAll('.jaime').forEach(function (b) {
      b.setAttribute('aria-pressed', dejaAime ? 'true' : 'false');
      b.querySelector('.jaime-txt').textContent = dejaAime ? 'Tu aimes' : 'J\'aime';
      var n = b.querySelector('.jaime-n');
      n.textContent = totalJaime !== null && totalJaime >= SEUIL_JAIME ? totalJaime : '';
    });
  }
  function boutonCoeur() { return '<button type="button" class="jaime" aria-pressed="false">' + COEUR + '<span class="jaime-txt">J\'aime</span><span class="jaime-n"></span></button>'; }
  if (avecJaime) {
    var publie = document.querySelector('article.article') && document.querySelector('.page-tete .publie');
    if (publie) {
      var barreHaut = document.createElement('div');
      barreHaut.className = 'haut-actions';
      barreHaut.innerHTML = boutonCoeur() + '<button type="button" class="haut-partager"><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="15" cy="4.5" r="2.3" stroke="currentColor" stroke-width="1.5"/><circle cx="5" cy="10" r="2.3" stroke="currentColor" stroke-width="1.5"/><circle cx="15" cy="15.5" r="2.3" stroke="currentColor" stroke-width="1.5"/><path d="M7 9l6-3.3M7 11l6 3.3" stroke="currentColor" stroke-width="1.5"/></svg>Partager</button>';
      publie.parentNode.insertBefore(barreHaut, publie.nextSibling);
      barreHaut.querySelector('.haut-partager').addEventListener('click', function () {
        var adr = (document.querySelector('link[rel=canonical]') || {}).href || location.href;
        if (navigator.share) partagerAvecImage(document.title, adr, (document.querySelector('meta[property="og:image"]') || {}).content || '');
        else { var z = document.querySelector('.partage'); if (z) z.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      });
    }
    document.querySelectorAll('.partage-boutons').forEach(function (pb) { pb.insertAdjacentHTML('afterbegin', boutonCoeur()); });
    majCoeurs();
    rpc('genesolia_jaimes', { p_page: pageJaime }).then(function (n) { if (typeof n === 'number') { totalJaime = n; majCoeurs(); } });
    document.addEventListener('click', function (e) {
      var b = e.target.closest('.jaime'); if (!b) return;
      dejaAime = !dejaAime;
      try { localStorage.setItem('jaime-' + pageJaime, dejaAime ? '1' : '0'); } catch (er) {}
      if (totalJaime !== null) totalJaime = Math.max(0, totalJaime + (dejaAime ? 1 : -1));
      majCoeurs();
      document.querySelectorAll('.jaime').forEach(function (c) { c.classList.remove('bat'); void c.offsetWidth; if (dejaAime) c.classList.add('bat'); });
      /* Connecté·e : on garde aussi le cœur dans son espace (Mes coups de cœur) */
      try {
        var ses = JSON.parse(localStorage.getItem('sb-qsvzzkjtjsznfntahvvh-auth-token') || 'null'), jt = ses && ses.access_token;
        if (jt && (!ses.expires_at || ses.expires_at * 1000 > Date.now())) {
          var hd = { apikey: SBK, Authorization: 'Bearer ' + jt, 'Content-Type': 'application/json', Prefer: 'resolution=ignore-duplicates,return=minimal' };
          if (dejaAime) fetch('https://qsvzzkjtjsznfntahvvh.supabase.co/rest/v1/mes_jaimes', { method: 'POST', headers: hd, body: JSON.stringify({ page: pageJaime, titre: (document.querySelector('h1') || {}).textContent ? document.querySelector('h1').textContent.trim().slice(0, 200) : document.title }) }).catch(function () {});
          else fetch('https://qsvzzkjtjsznfntahvvh.supabase.co/rest/v1/mes_jaimes?page=eq.' + encodeURIComponent(pageJaime), { method: 'DELETE', headers: hd }).catch(function () {});
        }
      } catch (er2) {}
      rpc('genesolia_jaime', { p_page: pageJaime, p_delta: dejaAime ? 1 : -1 }).then(function (n) { if (typeof n === 'number') { totalJaime = n; majCoeurs(); } });
    });
  }

  /* ===== Téléchargements réservés aux comptes : tout élément avec data-compte="ton livret…" ===== */
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function aUnCompte() { try { var x = JSON.parse(localStorage.getItem('sb-qsvzzkjtjsznfntahvvh-auth-token') || 'null'); return !!(x && (x.access_token || x.refresh_token)); } catch (e) { return false; } }
  function demanderCompte(quoi) {
    var f = document.createElement('div'), ici = page;
    f.className = 'appli-fenetre'; f.setAttribute('role', 'dialog'); f.setAttribute('aria-modal', 'true'); f.setAttribute('aria-label', 'Crée ton espace pour télécharger');
    f.innerHTML = '<div class="appli-carte compte-carte"><button type="button" class="appli-fermer" aria-label="Fermer">×</button>' +
      '<img src="/assets/icones/icone-192.png" alt="" width="64" height="64"><h2>' + (quoi ? esc(quoi.charAt(0).toUpperCase() + quoi.slice(1)) : 'Ton document') + ' t\'attend</h2>' +
      '<p>Pour le télécharger, crée ton espace Genesolia : c\'est gratuit et ça prend une minute.</p>' +
      '<ul class="compte-liste"><li>Tous tes livrets et tes tests gardés au même endroit, avec leur date</li><li>Ton évolution, test après test</li><li>Ton arbre familial sauvegardé</li></ul>' +
      '<div class="compte-actions"><a class="btn btn-plein" href="login.html?inscription&retour=' + encodeURIComponent(ici) + '">Créer mon espace gratuit</a><a class="compte-lien" href="login.html?retour=' + encodeURIComponent(ici) + '">J\'ai déjà un compte</a></div></div>';
    function fermer() { f.remove(); }
    f.addEventListener('click', function (e) { if (e.target === f || e.target.closest('.appli-fermer')) fermer(); });
    document.body.appendChild(f); f.querySelector('.btn').focus();
  }
  window.GenesoliaCompte = { actif: aUnCompte, demander: demanderCompte };

  /* ===== Produits payants : qui a accès ? (achats Stripe, ou Cercle / offert dans acces_premium) ===== */
  var SB_BASE = 'https://qsvzzkjtjsznfntahvvh.supabase.co', CLE_SESSION = 'sb-qsvzzkjtjsznfntahvvh-auth-token';
  function produit(cle) { return (window.GENESOLIA_PRODUITS || {})[cle] || null; }
  function estPayant(cle) { var p = produit(cle); return !!(p && p.payant); }
  /* Session : le jeton est rafraîchi sous le même verrou que la bibliothèque Supabase (« lock:<clé> »),
     pour qu'un seul onglet le fasse à la fois. Sans ce verrou, deux onglets pouvaient utiliser le même jeton
     et Supabase fermait alors la session partout (déconnexion surprise en ouvrant un nouvel onglet). */
  function lireSession() { try { return JSON.parse(localStorage.getItem(CLE_SESSION) || 'null'); } catch (e) { return null; } }
  function sessionValide(x) { return x && x.access_token && x.expires_at && x.expires_at * 1000 > Date.now() + 60000; }
  function session() {
    var x = lireSession();
    if (!x || !x.refresh_token) return Promise.resolve(null);
    if (sessionValide(x)) return Promise.resolve(x);
    function rafraichir() {
      var y = lireSession();   /* relu sous verrou : un autre onglet l'a peut-être déjà rafraîchi */
      if (!y || !y.refresh_token) return null;
      if (sessionValide(y)) return y;
      return fetch(SB_BASE + '/auth/v1/token?grant_type=refresh_token', { method: 'POST', headers: { apikey: SB_CLE, 'Content-Type': 'application/json' }, body: JSON.stringify({ refresh_token: y.refresh_token }) })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (n) {
          if (!n || !n.access_token) return null;
          n.expires_at = n.expires_at || Math.floor(Date.now() / 1000) + (n.expires_in || 3600);
          try { var z = lireSession(); if (z && z.refresh_token === y.refresh_token) localStorage.setItem(CLE_SESSION, JSON.stringify(n)); } catch (e) {}
          return n;
        });
    }
    var p = (navigator.locks && navigator.locks.request) ? navigator.locks.request('lock:' + CLE_SESSION, { mode: 'exclusive' }, rafraichir) : Promise.resolve().then(rafraichir);
    return p.catch(function () { return null; });
  }
  var mesAcces = null;
  function chargerAcces() {
    if (mesAcces) return mesAcces;
    mesAcces = session().then(function (x) {
      if (!x) return null;
      var hd = { apikey: SB_CLE, Authorization: 'Bearer ' + x.access_token }, uid = x.user && x.user.id;
      return Promise.all([
        fetch(SB_BASE + '/rest/v1/achats?select=produit', { headers: hd }).then(function (r) { return r.ok ? r.json() : []; }).catch(function () { return []; }),
        fetch(SB_BASE + '/rest/v1/acces_premium?select=offre,valide_jusqu', { headers: hd }).then(function (r) { return r.ok ? r.json() : []; }).catch(function () { return []; })
      ]).then(function (r) {
        var produits = {}; (r[0] || []).forEach(function (a) { produits[a.produit] = true; });
        var tout = (r[1] || []).some(function (a) { return (a.offre === 'abonnement' || a.offre === 'offert' || a.offre === 'cercle') && new Date(a.valide_jusqu) > new Date(); });
        return { uid: uid, email: x.user && x.user.email, produits: produits, tout: tout };
      });
    });
    mesAcces.then(function (a) { if (!a) mesAcces = null; });
    return mesAcces;
  }
  /* Promise<boolean> : true si la personne peut utiliser ce produit (gratuit, acheté, ou membre du Cercle) */
  function aAcces(cle) {
    if (!estPayant(cle)) return Promise.resolve(true);
    return chargerAcces().then(function (a) { return !!(a && (a.tout || a.produits[cle])); });
  }
  function lienPaiement(cle, a) {
    var base = (window.GENESOLIA_STRIPE || {})[cle]; if (!base || !a || !a.uid) return '';
    return base + (base.indexOf('?') < 0 ? '?' : '&') + 'client_reference_id=' + encodeURIComponent(a.uid + '__' + cle) + (a.email ? '&prefilled_email=' + encodeURIComponent(a.email) : '');
  }
  function proposerAchat(cle) {
    var p = produit(cle) || { nom: 'ce document', prix: '', inclus: [] };
    chargerAcces().then(function (a) {
      var lien = lienPaiement(cle, a), f = document.createElement('div');
      f.className = 'appli-fenetre'; f.setAttribute('role', 'dialog'); f.setAttribute('aria-modal', 'true'); f.setAttribute('aria-label', 'Débloquer ' + p.nom);
      f.innerHTML = '<div class="appli-carte compte-carte"><button type="button" class="appli-fermer" aria-label="Fermer">×</button>' +
        '<img src="/assets/icones/icone-192.png" alt="" width="64" height="64"><h2>Débloque ' + esc(p.nom) + '</h2>' +
        (p.inclus && p.inclus.length ? '<ul class="compte-liste">' + p.inclus.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' : '') +
        '<div class="compte-actions">' + (lien
          ? '<a class="btn btn-plein" href="' + esc(lien) + '">Débloquer pour ' + esc(p.prix) + '</a>'
          : '<button class="btn btn-plein" type="button" data-prevenir>Me prévenir dès que c\'est disponible</button><p class="compte-note" aria-live="polite"></p>') +
        '<a class="compte-lien" href="abonnement.html">Compris dans Le Cercle</a></div></div>';
      function fermer() { f.remove(); }
      f.addEventListener('click', function (e) {
        if (e.target === f || e.target.closest('.appli-fermer')) return fermer();
        var b = e.target.closest('[data-prevenir]'); if (!b) return;
        b.disabled = true;
        envoyerFormulaire('Achat : ' + p.nom, { email: (a && a.email) || '', produit: cle, offre: p.nom + ' ' + p.prix }, 'genesolia-interet')
          .then(function () { b.outerHTML = '<p class="compte-note">C\'est noté : tu seras prévenue par e-mail.</p>'; })
          .catch(function () { b.disabled = false; f.querySelector('.compte-note').textContent = 'L\'envoi n\'a pas fonctionné. Réessaie dans un instant.'; });
      });
      document.body.appendChild(f); (f.querySelector('.btn') || f).focus();
    });
  }
  /* Membre du Cercle (abonnement, essai en cours ou accès offert) */
  function membre() { return chargerAcces().then(function (a) { return !!(a && a.tout); }, function () { return false; }); }
  window.GenesoliaAcces = { payant: estPayant, verifier: aAcces, proposer: proposerAchat, produit: produit, membre: membre };

  /* ===== Documents envoyés par mail =====
     Au clic sur « Télécharger », le document est enregistré (table envois) et un mail part avec son lien,
     les outils offerts, la formation et Le Cercle (Supabase prépare le mail, le moteur N8N l'envoie).
     À l'écran : « C'est envoyé », puis un lien de secours au bout d'une minute.
     Si l'enregistrement échoue, on propose tout de suite le téléchargement direct. */
  function nouvelId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); });
  }
  function fenetreEnvoi(quoi) {
    var f = document.createElement('div');
    f.className = 'appli-fenetre'; f.setAttribute('role', 'dialog'); f.setAttribute('aria-modal', 'true'); f.setAttribute('aria-label', 'Envoi de ' + quoi);
    f.innerHTML = '<div class="appli-carte compte-carte"><button type="button" class="appli-fermer" aria-label="Fermer">×</button>' +
      '<img src="/assets/icones/icone-192.png" alt="" width="64" height="64"><div class="envoi-corps" aria-live="polite"><h2>Préparation de ' + esc(quoi) + '…</h2><p>Un instant.</p></div></div>';
    f.addEventListener('click', function (e) { if (e.target === f || e.target.closest('.appli-fermer')) f.remove(); });
    document.body.appendChild(f);
    return f;
  }
  function envoyerParMail(o) {
    if (!aUnCompte()) { o.secours(); return; }
    var f = fenetreEnvoi(o.quoi), corps = f.querySelector('.envoi-corps');
    function secoursMaintenant(texte) {
      corps.innerHTML = '<h2>' + texte + '</h2><p>Tu peux le télécharger tout de suite.</p><div class="compte-actions"><button class="btn btn-plein" type="button" data-secours>Télécharger maintenant</button></div>';
    }
    f.addEventListener('click', function (e) { if (e.target.closest('[data-secours]')) { f.remove(); o.secours(); } });
    session().then(function (x) {
      if (!x || !x.user || !x.access_token) throw new Error('session');
      var m = x.user.user_metadata || {};
      return Promise.resolve(o.html || null).then(function (html) {
        return fetch(SB_BASE + '/rest/v1/envois', {
          method: 'POST',
          headers: { apikey: SB_CLE, Authorization: 'Bearer ' + x.access_token, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
          body: JSON.stringify({ id: nouvelId(), user_id: x.user.id, email: x.user.email, prenom: m.full_name || m.prenom || null, quoi: o.quoi, page: page, html: html, fichier: o.fichier || null })
        });
      }).then(function (r) {
        if (!r.ok) throw new Error('envoi ' + r.status);
        corps.innerHTML = '<h2>C\'est envoyé dans ta boîte mail</h2>' +
          '<p>' + esc(o.quoi.charAt(0).toUpperCase() + o.quoi.slice(1)) + ' arrive à <b>' + esc(x.user.email) + '</b> d\'ici quelques minutes, avec un lien pour l\'ouvrir, l\'enregistrer en PDF ou l\'imprimer.</p>' +
          '<p class="compte-note">Pense à regarder dans les spams ou l\'onglet Promotions.</p>' +
          '<div class="compte-actions"><button class="btn btn-plein" type="button" data-fermer-envoi>Parfait, merci</button>' +
          '<button class="compte-lien envoi-secours" type="button" data-secours hidden>Pas reçu ? Télécharge-le ici</button></div>';
        corps.querySelector('[data-fermer-envoi]').addEventListener('click', function () { f.remove(); });
        setTimeout(function () { var b = corps.querySelector('.envoi-secours'); if (b) b.hidden = false; }, 60000);
        if (window.umami) try { window.umami.track('document-par-mail', { quoi: o.quoi }); } catch (e) {}
      });
    }).catch(function () { secoursMaintenant('Le mail n\'a pas pu partir'); });
  }
  window.GenesoliaParMail = { envoyer: envoyerParMail };
  /* Les droits sont chargés d'avance quand la page contient un produit payant : le clic reste immédiat (utile sur mobile) */
  var accesConnus = {};
  if (aUnCompte() && Object.keys(window.GENESOLIA_PRODUITS || {}).some(estPayant)) chargerAcces().then(function (a) {
    if (a) Object.keys(window.GENESOLIA_PRODUITS).forEach(function (k) { if (a.tout || a.produits[k]) accesConnus[k] = true; });
  });

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-compte]'); if (!el) return;
    if (aUnCompte() && el.hasAttribute('data-produit') && estPayant(el.getAttribute('data-produit'))) {
      var cle = el.getAttribute('data-produit');
      if (accesConnus[cle] === true) { /* déjà vérifié : on laisse passer */ }
      else {
        e.preventDefault(); e.stopImmediatePropagation();
        aAcces(cle).then(function (ok) {
          if (ok) { accesConnus[cle] = true; el.click(); } else proposerAchat(cle);
        });
        return;
      }
    }
    if (aUnCompte()) {
      /* Fichier PDF déjà en ligne (ex. génosociogramme vierge) : il part par mail ; lien de secours pour le téléchargement direct */
      var href = el.tagName === 'A' ? (el.getAttribute('href') || '') : '';
      if (/\.pdf(\?|#|$)/i.test(href) && !el.hasAttribute('data-direct')) {
        e.preventDefault(); e.stopImmediatePropagation();
        envoyerParMail({ quoi: el.getAttribute('data-compte'), fichier: el.href, secours: function () { el.setAttribute('data-direct', ''); el.click(); el.removeAttribute('data-direct'); } });
      }
      return;
    }
    e.preventDefault(); e.stopImmediatePropagation();
    demanderCompte(el.getAttribute('data-compte'));
  }, true);
  /* ===== Mon chemin : enregistrer un test dans l'espace (le module se charge seulement quand il sert) ===== */
  if (!window.GenesoliaChemin) {
    var cheminCharge = null;
    window.GenesoliaChemin = {
      enregistrer: function (r) {
        if (!cheminCharge) cheminCharge = new Promise(function (ok) { var sc = document.createElement('script'); sc.src = 'assets/mon-chemin.js?v=1'; sc.onload = ok; sc.onerror = ok; document.head.appendChild(sc); });
        var stub = window.GenesoliaChemin;
        return cheminCharge.then(function () { return window.GenesoliaChemin !== stub ? window.GenesoliaChemin.enregistrer(r) : false; });
      }
    };
  }
})();
