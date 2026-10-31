/* ===== Anciens iPad / Safari (iOS 13 et avant) : ils ignorent :where(), donc toute la remise à zéro de la mise en page.
   On leur redonne les mêmes règles, sans :where() et avec le même poids, pour que la page ne se décale pas. ===== */
(function () {
  try { document.querySelector(':where(body)'); return; } catch (e) {}
  var css = '*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}' +
    'img,svg{display:block;max-width:100%}a{color:inherit}' +
    'h1,h2,h3{font-family:var(--display);font-weight:400;line-height:1.15;letter-spacing:.005em}' +
    'h1{font-size:2.6rem}h2{font-size:1.9rem}h3{font-size:1.35rem}p{max-width:var(--mesure)}' +
    '.pied h4,.pied ul,.pied li,.pied p,.pied span{margin:0;padding:0}';
  var st = document.createElement('style'); st.textContent = css;
  (document.head || document.documentElement).insertBefore(st, (document.head || document.documentElement).firstChild);
  document.documentElement.className += ' vieux-navigateur';
})();
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
  var GARDER = /^(umami\.disabled|genesolia-ne-pas-compter|consentement-mesure(-date)?|info-cookies|carnet-inscrit|liste-formation|genesolia-regle-v2|genesolia-retour|retour-apres-connexion|genesolia-tuto-arbre-vu|vingt-ans-vues|jaime-.*|sb-.*|genesolia-rappels-.*|genesolia-phrase-du-jour)$/;   /* rappels : réglages de l'appareil, jamais effacés (sinon l'appli redemande les notifications à chaque ouverture) */
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

/* ===== Coffre-fort des écrits (carnets, suivi, bilan de départ) =====
   Les réponses sont chiffrées dans la base (fonctions carnet_ecrire / carnet_lire, parcours_ecrire / parcours_lire) :
   l'équipe Genesolia ne les lit pas. Avant le premier enregistrement en ligne, la personne donne son accord
   (gardé dans son compte : user_metadata.coffre_accord). Sans accord, tout reste sur l'appareil. */
/* ===== Séances audio de visualisation : « Avant de commencer », puis « J'arrête et je reviens » toujours visible =====
   GenesoliaCadre.html(audioHtml) entoure le lecteur ; le clic « Je me sens prêt·e » montre l'audio et le lance ;
   « J'arrête et je reviens » met en pause et ouvre un retour au calme, avec les lignes d'écoute. */
window.GenesoliaCadre = (function () {
  var css = '.gc-avant{background:#FFF8EA;border:1px solid #F3DCC0;border-radius:14px;padding:.9rem 1rem;margin:.6rem 0;color:#4A2142;text-align:left}.gc-avant p{margin:.3rem 0}.gc-avant ul{margin:.3rem 0 .7rem;padding-left:1.2rem}' +
    '.gc-arret{position:sticky;bottom:14px;display:block;margin:.8rem auto 0;z-index:5;box-shadow:0 6px 18px rgba(31,11,42,.18)}' +
    '.gc-fond{position:fixed;inset:0;z-index:4000;background:rgba(46,19,56,.55);display:flex;align-items:center;justify-content:center;padding:16px}' +
    '.gc-boite{background:#fff;color:#4A2142;border-radius:20px;max-width:30rem;width:100%;max-height:90vh;overflow:auto;padding:1.4rem 1.3rem}.gc-boite h2{margin:.2rem 0 .6rem}.gc-boite ol{padding-left:1.2rem;display:grid;gap:.4rem}' +
    '.gc-filet{margin-top:.9rem;padding:.7rem .9rem;border-radius:12px;background:#FCEFF3;border:1px solid #E8C9D6}.gc-filet p{margin:.2rem 0}.gc-filet a{color:inherit}';
  var pose = false;
  function style() { if (pose) return; pose = true; var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st); }
  function html(audio) {
    style();
    return '<div class="gc-cadre"><div class="gc-avant"><p><b>Avant de commencer</b></p><p>Cette séance te fait revenir vers ton histoire, les yeux fermés. Garde-la pour plus tard si :</p>' +
      '<ul><li>ce que tu as vécu a été très violent ;</li><li>tu traverses une période très fragile en ce moment (un deuil récent, une grande fatigue, des idées très sombres) ;</li><li>tu sens qu’il vaudrait mieux être accompagné·e : écoute-la alors avec un·e professionnel·le de l’accompagnement.</li></ul>' +
      '<p>Jamais en conduisant. Tu peux t’arrêter à tout moment avec « J’arrête et je reviens ».</p>' +
      '<button type="button" class="btn btn-plein" data-gc-pret>Je me sens prêt·e, je commence</button></div>' +
      '<div class="gc-ecoute" hidden>' + audio + '<button type="button" class="btn btn-trait gc-arret" data-gc-arret>J’arrête et je reviens</button></div></div>';
  }
  function calme() {
    var f = document.createElement('div'); f.className = 'gc-fond'; f.setAttribute('role', 'dialog'); f.setAttribute('aria-modal', 'true');
    f.innerHTML = '<div class="gc-boite"><p style="margin:0;font-size:.8rem;letter-spacing:.12em;text-transform:uppercase;color:#9A6E38">Tu t’arrêtes, et c’est très bien</p><h2>Reviens ici et maintenant</h2><ol>' +
      '<li>Ouvre les yeux. Pose tes deux pieds bien à plat sur le sol.</li><li>Regarde autour de toi et nomme cinq choses que tu vois.</li><li>Respire lentement : inspire en comptant jusqu’à 4, expire en comptant jusqu’à 6, cinq fois.</li><li>Bois un verre d’eau, bouge un peu, ouvre une fenêtre.</li></ol>' +
      '<div class="gc-filet"><p><b>Si c’est trop lourd à porter seul·e, parles-en à quelqu’un maintenant</b> : une personne de confiance, ou une ligne d’écoute, gratuite et ouverte jour et nuit.</p><p><a href="tel:3114"><b>3114</b></a> en France · <a href="tel:18662773553"><b>1 866 APPELLE</b></a> (1 866 277-3553) au Québec</p></div>' +
      '<p style="margin:1rem 0 0;text-align:center"><button type="button" class="btn btn-plein" data-gc-fermer>Je suis revenu·e</button></p></div>';
    document.body.appendChild(f);
    f.addEventListener('click', function (e) { if (e.target === f || e.target.closest('[data-gc-fermer]')) f.remove(); });
  }
  document.addEventListener('click', function (e) {
    var p = e.target.closest('[data-gc-pret]');
    if (p) { var c = p.closest('.gc-cadre'), z = c.querySelector('.gc-ecoute'); p.closest('.gc-avant').hidden = true; z.hidden = false; var a = z.querySelector('audio'); if (a) a.play().catch(function () {}); return; }
    var s = e.target.closest('[data-gc-arret]');
    if (s) { var au = s.closest('.gc-cadre').querySelector('audio'); if (au) au.pause(); calme(); }
  });
  return { html: html, calme: calme };
})();

window.GenesoliaCoffre = (function () {
  function accord(user) { return !!(user && user.user_metadata && user.user_metadata.coffre_accord); }
  function demander(zone, sb, ok) {
    if (!zone) return;
    zone.hidden = false;
    zone.innerHTML = '<div class="coffre-accord"><p class="coffre-t">Ton espace privé, chiffré</p><p>Pour retrouver tes réponses sur tous tes appareils, elles sont gardées dans ton espace, <b>chiffrées</b>, et l’équipe Genesolia ne les lit jamais. Tu peux tout effacer quand tu veux depuis Mon espace.</p>' +
      '<p><button type="button" class="btn btn-plein" data-coffre-oui>J’accepte que mes réponses soient gardées</button> <button type="button" class="btn btn-trait" data-coffre-non>Pas maintenant</button></p>' +
      '<p class="coffre-note">Sans ton accord, tes réponses restent seulement sur cet appareil. <a href="confidentialite.html">Mes données</a></p></div>';
    zone.querySelector('[data-coffre-oui]').onclick = function (e) {
      e.target.disabled = true;
      sb.auth.updateUser({ data: { coffre_accord: new Date().toISOString() } }).then(function (r) {
        if (r && r.error) { e.target.disabled = false; return; }
        zone.innerHTML = '<p class="coffre-merci">Merci. Tes réponses sont maintenant gardées, chiffrées, dans ton espace.</p>';
        setTimeout(function () { zone.hidden = true; }, 4000);
        ok && ok();
      });
    };
    zone.querySelector('[data-coffre-non]').onclick = function () { zone.hidden = true; };
  }
  /* Lecture et écriture chiffrées, avec repli sur la table si les fonctions ne sont pas encore installées */
  function lire(sb, user, mois) {
    var rpc = mois === null ? sb.rpc('parcours_lire') : sb.rpc('carnet_lire', { p_mois: mois });
    return rpc.then(function (r) {
      if (!r.error) return r.data;
      var q = mois === null ? sb.from('parcours').select('data').eq('user_id', user.id) : sb.from('carnets').select('data').eq('user_id', user.id).eq('mois', mois);
      return q.maybeSingle().then(function (x) { return x && x.data ? x.data.data : null; });
    });
  }
  /* Écriture TOUJOURS chiffrée : plus de repli en clair (les fonctions sont installées). En cas d'erreur, rien n'est écrit en clair : l'appelant réessaie. */
  function ecrire(sb, user, mois, data) {
    return mois === null ? sb.rpc('parcours_ecrire', { p_data: data }) : sb.rpc('carnet_ecrire', { p_mois: mois, p_data: data });
  }
  return { accord: accord, demander: demander, lire: lire, ecrire: ecrire };
})();

/* ===== Repères de naissance du Cercle (table « reperes ») =====
   Ils remplissent les livres du mois, le guide et Mon mois. Une fois enregistrés dans l'espace,
   la date, les prénoms et le nom de naissance ne se modifient plus (droits de la base) : seuls l'heure et le lieu
   se complètent. Une erreur : un e-mail à contact@genesolia.fr. Sans compte, tout reste sur l'appareil, comme avant.
   Les outils gratuits (thème, signe maya…) ne sont pas concernés : on peut y calculer pour un proche. */
/* Genesolia · demandes du site : un prénom sans fiche ou une ville introuvable.
   Seuls le type, le mot demandé (et le pays pour une ville) et la page sont envoyés : ni e-mail, ni compte.
   Table Supabase demandes_site (insertion seule, voir outils-internes/supabase-demandes.sql).
   La tâche « Demandes du site » les traite toutes les heures, de 8h à 22h. */
window.GenesoliaDemande = function (type, valeur, pays) {
  valeur = String(valeur || '').trim().slice(0, 120); pays = String(pays || '').trim().slice(0, 60);
  if (!valeur) return Promise.resolve(false);
  var cle = 'genesolia-demande-' + type + '-' + valeur.toLowerCase();
  try { if (localStorage.getItem(cle)) return Promise.resolve(true); } catch (e) {}
  return fetch('https://qsvzzkjtjsznfntahvvh.supabase.co/rest/v1/demandes_site', {
    method: 'POST',
    headers: { apikey: 'sb_publishable_6iEVxXmtB_u1hJ6mPS9fNg_CJhLjYkg', 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify({ type: type, valeur: valeur, pays: pays || null, page: location.pathname.split('/').pop().slice(0, 80) || 'index.html' })
  }).then(function (r) { if (r.ok) { try { localStorage.setItem(cle, '1'); } catch (e) {} } return r.ok; }, function () { return false; });
};

window.GenesoliaReperes = (function () {
  var CLE = 'genesolia-guide';
  function local() { try { return JSON.parse(localStorage.getItem(CLE) || 'null'); } catch (e) { return null; } }
  function garder(x) {
    var avant = local() || {};
    var p = { prenom: String(x.prenoms || '').trim().split(/\s+/)[0] || '', prenoms: x.prenoms || '', nom: x.nom || '', date: x.date_naissance,
      heure: x.heure || '', lieu: x.lieu || '', lat: x.lat, lon: x.lon, tz: x.tz || avant.tz || 'Europe/Paris', verrou: true };
    try { localStorage.setItem(CLE, JSON.stringify(p)); } catch (e) {}
    return p;
  }
  function lire(sb, user) {
    if (!sb || !user) return Promise.resolve(null);
    return sb.from('reperes').select('prenoms,nom,date_naissance,heure,lieu,lat,lon,tz').eq('user_id', user.id).maybeSingle()
      .then(function (r) { return r && !r.error && r.data ? garder(r.data) : null; }, function () { return null; });
  }
  /* p = { prenoms, nom, date, heure, lieu, lat, lon, tz } ; la première fois, tout est enregistré ; ensuite, seulement l'heure et le lieu */
  function enregistrer(sb, user, p) {
    if (!sb || !user) return Promise.resolve(null);
    var deja = local();
    if (deja && deja.verrou) {
      return sb.from('reperes').update({ heure: p.heure || null, lieu: p.lieu || null, lat: p.lat, lon: p.lon, tz: p.tz || null, maj: new Date().toISOString() }).eq('user_id', user.id)
        .then(function () { return lire(sb, user); }, function () { return null; });
    }
    return sb.from('reperes').insert({ user_id: user.id, prenoms: String(p.prenoms || '').trim().slice(0, 200), nom: String(p.nom || '').trim().slice(0, 120) || null, date_naissance: p.date,
      heure: p.heure || null, lieu: p.lieu || null, lat: p.lat, lon: p.lon, tz: p.tz || null })
      .then(function () { return lire(sb, user); }, function () { return null; });
  }
  /* Corriger la date, les prénoms ou le nom (depuis Ma spirale · Mes repères) */
  function modifier(sb, user, p) {
    if (!sb || !user) return Promise.resolve(null);
    return sb.from('reperes').update({ prenoms: String(p.prenoms || '').trim().slice(0, 200), nom: String(p.nom || '').trim().slice(0, 120) || null, date_naissance: p.date, maj: new Date().toISOString() }).eq('user_id', user.id)
      .then(function () { return lire(sb, user); }, function () { return null; });
  }
  function verrouille() { var x = local(); return !!(x && x.verrou); }
  var NOTE = 'Ta date et tes prénoms sont enregistrés dans ton espace. Pour les modifier : <a href="pass.html#moi" target="_blank" rel="noopener">Ma spirale, Mes repères</a>.';
  var AVANT = 'Ta date et tes prénoms seront enregistrés dans ton espace. Tu pourras les modifier dans Ma spirale, Mes repères. L’heure et le lieu pourront toujours être complétés.';
  return { lire: lire, enregistrer: enregistrer, modifier: modifier, verrouille: verrouille, local: local, NOTE: NOTE, AVANT: AVANT };
})();

/* Ne pas compter les visites de la propriétaire (et des tests faits dans son navigateur) :
   ouvrir une fois https://genesolia.fr/?ne-pas-me-compter sur chaque appareil ; ?me-compter pour annuler.
   Umami lit « umami.disabled » ; Google Analytics n'est alors jamais chargé. */
(function () {
  try {
    var q = location.search;
    if (/[?&]ne-pas-me-compter\b/.test(q)) { localStorage.setItem('umami.disabled', '1'); localStorage.setItem('genesolia-ne-pas-compter', '1'); alert('C’est noté : tes visites sur cet appareil ne sont plus comptées (Umami et Google Analytics).'); }
    else if (/[?&]me-compter\b/.test(q)) { localStorage.removeItem('umami.disabled'); localStorage.removeItem('genesolia-ne-pas-compter'); alert('Tes visites sur cet appareil sont de nouveau comptées.'); }
  } catch (e) {}
})();
function genesoliaPasCompter() { try { return localStorage.getItem('genesolia-ne-pas-compter') === '1'; } catch (e) { return false; } }

/* Mesure d'audience anonyme et sans cookie (Umami) */
(function () {
  if (genesoliaPasCompter()) return;
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
  /* Appli Genesolia Pro : jamais de Google Analytics (Umami seul, sans cookie), donc pas de bandeau à faire accepter */
  function pro() { try { return /\/(pro|questionnaire)\.html$/.test(location.pathname) || sessionStorage.getItem('genesolia-appli') === 'pro'; } catch (e) { return false; } }   /* questionnaire.html : la page qu'un·e client·e remplit pour sa praticienne, sans mesure Google */
  function charger() {
    if (charge || !id || genesoliaPasCompter() || pro()) return;
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
  return { choix: choix, enregistrer: enregistrer, pro: pro };
})();

/* ===== Paiements Stripe : coller ici chaque lien de paiement (Stripe > Liens de paiement) =====
   Abonnements : activer « essai gratuit de 30 jours » dans Stripe, et la page de confirmation
   https://genesolia.fr/bienvenue.html. Tant qu'un lien est vide, le bouton propose d'être prévenu·e. */
window.GENESOLIA_STRIPE = {
  cercleMois: 'https://buy.stripe.com/aFafZa6jj2NX6Yd9qD43S0h',     /* Le Cercle 29 €/mois, essai 30 jours */
  cercleFondatrice: 'https://buy.stripe.com/14AdR25ff6095U90U743S0l', /* Le Cercle, prix fondatrice 24,90 €/mois (100 premières après le mois offert) */
  cercleAn: 'https://buy.stripe.com/dRmbIU9vv3S16Yd6er43S0g',       /* Le Cercle 24 €/mois sur 12 mois : plus proposé (le prix fondatrice 24,90 € le remplace) ; gardé pour les abonnements déjà pris */
  cercleAnnee: 'https://buy.stripe.com/eVq7sE2336096Yd1Yb43S0f',    /* Le Cercle 249 € l'année en une fois */
  passMois: 'https://buy.stripe.com/14A00cbDD88h3M18mz43S0j',   /* Ma spirale 10 €/mois */
  pass3Mois: '',      /* Ma spirale 27 € les 3 mois : retirée pour l'instant (lien Stripe : https://buy.stripe.com/14AdR28rragp1DT8mz43S0k) */
  praticienMois: 'https://buy.stripe.com/00w8wIdLLcoxcixauH43S0e',      /* Espace praticien 24 €/mois */
  praticienFondateur: 'https://buy.stripe.com/fZueV64bb4W5cixcCP43S0b', /* Espace praticien, tarif fondateur 19 €/mois (espaces ouverts jusqu'au 31 mars 2027) */
  praticienFondateurAn: 'https://buy.stripe.com/3cI7sE0YZ1JTeqF9qD43S0p', /* Espace praticien, tarif fondateur 190 € l'année */
  praticienAn: 'https://buy.stripe.com/14A4gs0YZ88hgyN6er43S0a',        /* Espace praticien 240 € l'année */
  carnet: 'https://buy.stripe.com/28E6oA7nn9cl82hauH43S0m',         /* un carnet du mois, 9 € */
  rapport: 'https://buy.stripe.com/aFacMYgXXcox3M18mz43S09',        /* le rapport de ton arbre, 9 € */
  numerologie: 'https://buy.stripe.com/8x228kfTT0FP4Q546j43S06',    /* ton livret de numérologie, 12 € */
  saisons: 'https://buy.stripe.com/8x228k4bb9cl96l0U743S03',        /* Les 12 saisons, 15 € */
  astral: 'https://buy.stripe.com/eVq4gsgXX0FP5U96er43S07',         /* ton livret du thème astral */
  arbreDeVie: 'https://buy.stripe.com/9B6cMY4bb4W582hcCP43S05',     /* ton livret de l'arbre de vie */
  mayaDuo: 'https://buy.stripe.com/aFa3co6jjdsB5U9fP143S04',        /* votre analyse maya à deux */
  arbreEncadrer: 'https://buy.stripe.com/bJebIU6jj1JT4Q546j43S0n',  /* ton arbre à encadrer (fichier HD) */
  impressionA4: 'https://buy.stripe.com/3cIfZacHHagpcix32f43S0o',   /* arbre imprimé, poster A4 */
  impressionA3: 'https://buy.stripe.com/9B600cbDD9cl5U96er43S02',   /* arbre imprimé, poster A3 */
  impressionA4Cadre: 'https://buy.stripe.com/8x25kw7nn0FP2HXeKX43S01', /* arbre imprimé, A4 encadré */
  impressionA3Cadre: 'https://buy.stripe.com/7sY28k3773S1cix9qD43S00', /* arbre imprimé, A3 encadré */
  impressionG50: 'https://buy.stripe.com/8x2fZacHHewFeqF5an43S0r',   /* arbre imprimé, grand poster 50 × 70 cm, 69 € */
  impressionG70: 'https://buy.stripe.com/28EfZa4bbcoxgyNdGT43S0q',   /* arbre imprimé, très grand poster 70 × 100 cm, 89 € */
  impressionG50Cadre: '',   /* arbre imprimé, 50 × 70 cm encadré (lien Stripe à coller) */
  impressionG70Cadre: '',   /* arbre imprimé, 70 × 100 cm encadré (lien Stripe à coller) */
  gestion: 'https://billing.stripe.com/p/login/7sY28k3773S1cix9qD43S00'         /* lien du portail client Stripe (gérer ou arrêter son abonnement) */
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

/* ===== Essai de 30 jours des analyses de l'arbre =====
   Gratuit pour toujours : dessiner son arbre (1 arbre). Les analyses (ce qui se répète, le fil d'or en arbre et ce qui se répète,
   la numérologie et l'astrologie reliées à l'arbre, le rapport) : 30 jours offerts dès la création du compte, puis avec le Pass,
   Le Cercle ou l'Espace praticien (table acces_premium, offre « pass », « cercle », « praticien »…).
   actif: false tant que le Pass n'est pas payable : rien n'est bloqué. depuis : début des 30 jours pour les comptes créés avant. */
window.GENESOLIA_ESSAI = { actif: false, jours: 30, depuis: '2026-11-01' };

/* ===== Arbre imprimé et envoyé (Mon arbre à encadrer) : prix TTC affichés, livraison comprise =====
   actif: false cache l'offre. Chaque format a son lien Stripe dans GENESOLIA_STRIPE (même nom que « stripe »).
   Prix à ajuster après ta commande test : prix TTC = coût livré TTC + au moins 30 € (25 € HT de marge).
   Fichier pour l'imprimeur (normes Gelato) : PDF avec 4 mm de fond perdu (mm = taille du PDF), largeur en pixels :
   A4 en 300 dpi, A3 en 250 dpi (au-delà, les iPhone ne savent pas fabriquer l'image). */
window.GENESOLIA_IMPRESSION = {
  actif: true,
  ouverture: '2026-11-01',   /* avant cette date : « Bientôt disponible », sans commande (test possible avec ?test-impression dans l'adresse) */
  livraison: 'Livré en 3 à 7 jours ouvrés, livraison comprise, en France métropolitaine',
  formats: [
    { id: 'a4',      nom: 'Poster A4 (21 × 29,7 cm)',          prix: '45 €', stripe: 'impressionA4',      largeur: 2575, mm: [218, 305] },
    { id: 'a3',      nom: 'Poster A3 (29,7 × 42 cm)',          prix: '49 €', stripe: 'impressionA3',      largeur: 3002, mm: [305, 428] },
    /* grands formats (Lignée, Médaillons, Notre famille, Descendants, Éventail) : imprimés en Europe, livrés en 6 à 11 jours ouvrés.
       Tant que son lien Stripe (plus haut) est vide, la commande arrive quand même, sans paiement : il faut alors envoyer le lien de paiement à la main.
       largeur : réglée au moment du fichier (le plus net possible). */
    { id: 'g50',      nom: 'Grand poster 50 × 70 cm',                 prix: '69 €',  stripe: 'impressionG50',      largeur: 3300, mm: [508, 708], grand: true },
    { id: 'g70',      nom: 'Très grand poster 70 × 100 cm',           prix: '89 €',  stripe: 'impressionG70',      largeur: 3300, mm: [708, 1008], grand: true }
    /* posters seuls (plus d'encadrés depuis le 24/10/2026) : papier d'art mat 200 g/m² non couché chez Gelato */
  ]
};

/* ===== Les livres Genesolia (Amazon) =====
   Colle ici le lien Amazon de chaque livre dès qu'il est en ligne, et son prix. Tant que « amazon » est vide,
   les boutons affichent « Bientôt sur Amazon » partout sur le site (pages des livres, page Offrir, encarts des articles). */
window.GENESOLIA_LIVRES = {
  enquete: { titre: 'L’enquête de ma lignée', page: 'enquete-de-ma-lignee.html', image: 'assets/livres/enquete-de-ma-lignee-3d.webp?v=4',
    amazon: 'https://www.amazon.fr/dp/B0HPBM5BQ7', prix: '', extrait: 'assets/livres/extrait-enquete-de-ma-lignee.pdf' },
  racines: { titre: 'Racines', page: 'racines.html', image: 'assets/livres/racines-3d.webp?v=4',
    amazon: 'https://www.amazon.fr/dp/B0HP7WPZQD', prix: '18,99 €', extrait: '' }
};
/* <a data-livre-acheter="enquete"> devient « Acheter sur Amazon · prix » quand le lien existe, sinon « Bientôt sur Amazon » (sans lien) */
window.GenesoliaLivresBoutons = function (racine) {
  var L = window.GENESOLIA_LIVRES || {};
  [].forEach.call((racine || document).querySelectorAll('[data-livre-acheter]'), function (a) {
    var l = L[a.getAttribute('data-livre-acheter')]; if (!l) return;
    if (l.amazon) { a.href = l.amazon; a.target = '_blank'; a.rel = 'noopener'; a.textContent = 'Acheter sur Amazon' + (l.prix ? ' · ' + l.prix : ''); a.removeAttribute('aria-disabled'); a.classList.remove('livre-bientot'); }
    else { a.removeAttribute('href'); a.setAttribute('aria-disabled', 'true'); a.classList.add('livre-bientot'); a.textContent = 'Bientôt sur Amazon'; }
  });
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { window.GenesoliaLivresBoutons(); }); else window.GenesoliaLivresBoutons();

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
    ['genosociogramme.html', 'Ton arbre familial'],
    ['offert.html', 'Outils gratuits'],
    ['ma-spirale.html', 'Ma spirale'],
    ['boutique.html', 'Boutique'],
    ['blog.html', 'Blog'],
    ['login.html', 'Mon espace']
  ];
  var BOUTON = ['abonnement.html', 'Le Cercle'];
  var BOUTON_JEUNES = ['ta-vie-en-reel.html', 'Ta vie en réel'];  /* situations du quotidien, une par semaine (ex-espace « Jeune femme ») */

  var logo = '<svg viewBox="0 0 26 26" fill="none" aria-hidden="true"><circle cx="13" cy="5" r="3" fill="#B98A55"/><circle cx="7" cy="11" r="2.2" stroke="#6B2F5B" stroke-width="1.3"/><circle cx="19" cy="11" r="2.2" stroke="#6B2F5B" stroke-width="1.3"/><circle cx="13" cy="15" r="2.4" fill="#6B2F5B"/><path d="M13 17.5v4M13 21.5l-4 3M13 21.5l4 3" stroke="#6B2F5B" stroke-width="1.3" stroke-linecap="round"/></svg>';
  var page = location.pathname.split('/').pop() || 'index.html';
  /* Pages du tunnel d'essai : ni bandeau, ni encart, ni petit carré pour ne pas distraire */
  var tunnel = page === 'essai.html' || page === 'bienvenue.html' || page === 'questionnaire.html' || page === 'cercle.html' || page === 'pass.html'   /* cercle.html, pass.html : les applis des membres, sans publicité */
    || page === 'abonnement.html' || page === 'ma-spirale.html'                              /* les pages de vente : une seule décision, pas d'autre encart */
    || (page === 'login.html' && /[?&]retour=essai\.html/.test(location.search));          /* création du compte depuis l'essai : on reste sur les rails */

  /* ===== Mode appli =====
     « cercle » : l'appli Le Cercle. Elle commence sur cercle.html ; les pages du Cercle ouvertes depuis elle gardent
     l'allure d'appli (en-tête court, barre d'onglets en bas, sans pied de page). Installée, tout s'ouvre ainsi.
     « site » : l'appli Genesolia installée sur l'écran d'accueil (barre d'onglets du site, sans pied de page).
     Sinon : le site normal, rien ne change. */
  var PAGES_CERCLE = ['mon-carnet.html', 'mon-suivi-mois.html', 'mon-suivi.html', 'mon-module.html', 'point-de-depart.html', 'autel-de-saison.html', 'mode-emploi-suivi.html', 'arbre-de-vie-affiche.html', 'mes-seances.html', 'mon-mois.html', 'mon-guide.html', 'cercle.html', 'question-du-mois.html'];
  var ESTCERCLE = PAGES_CERCLE.indexOf(page) >= 0;
  /* Pages du Cercle : l'appli proposée à l'installation est Le Cercle (nom, icône ; manifeste cercle.webmanifest dans chaque page) */
  if (ESTCERCLE && !window.GENESOLIA_APPLI) window.GENESOLIA_APPLI = { nom: 'Le Cercle', icone: '/assets/icones/cercle-apple-180.png' };
  var autonome = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  var drapeau = ''; try { drapeau = sessionStorage.getItem('genesolia-appli') || ''; } catch (e) {}
  /* Une page du Cercle ouverte par une personne connectée reste toujours cadrée dans son espace (en-tête Le Cercle et barre du bas), même ouverte directement */
  if (page === 'cercle.html' || /[?&]appli=cercle\b/.test(location.search) || (ESTCERCLE && aUnCompte())) drapeau = 'cercle';
  else if (/[?&]appli=pro\b/.test(location.search) || (drapeau === 'pro' && (page === 'genosociogramme.html' || page === 'login.html'))) drapeau = 'pro';   /* un dossier ouvert depuis l'appli Pro reste dans l'appli Pro */
  else if (/[?&]appli=site\b/.test(location.search) || (!autonome && !ESTCERCLE)) drapeau = '';   /* dans le navigateur, une page du site ramène au site normal */
  /* Appli Genesolia Pro (pro.html) : l'Espace praticien en appli. Ni barre du bas du site, ni encarts, sur toutes ses pages */
  if (page === 'pro.html') drapeau = 'pro';
  /* Ma spirale (pass.html) : son appli à elle, avec sa propre barre du bas. Ni la barre du site, ni celle du Cercle */
  if (page === 'pass.html') drapeau = 'pass';
  try { if (drapeau) sessionStorage.setItem('genesolia-appli', drapeau); else sessionStorage.removeItem('genesolia-appli'); } catch (e) {}
  if (drapeau === 'pro') tunnel = true;
  var MODE = drapeau === 'pro' || drapeau === 'pass' ? '' : drapeau === 'cercle' && (autonome || ESTCERCLE) ? 'cercle' : (autonome ? 'site' : '');
  if (MODE) { tunnel = true; document.documentElement.classList.add('appli', 'appli-' + MODE); }
  if (tunnel && !MODE && page !== 'cercle.html') document.documentElement.classList.add('page-tunnel');   /* pas d'encart « appli gratuite » dans le pied de page du tunnel */
  /* Appli Genesolia : elle s'ouvre sur son propre accueil (appli.html), pas sur la page d'accueil du site */
  if (MODE === 'site' && page === 'index.html' && !/[?&]site\b/.test(location.search)) { location.replace('appli.html' + location.hash); return; }
  window.GenesoliaModeAppli = MODE;

  var entete = document.querySelector('[data-entete]');
  /* Les icônes et les onglets de la barre du bas (mode appli) */
  var ICO = {
    jour: '<path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',
    carnet: '<path d="M4 5c3-1.5 5.5-1.5 8 0v14c-2.5-1.5-5-1.5-8 0zM12 5c2.5-1.5 5-1.5 8 0v14c-3-1.5-5.5-1.5-8 0"/>',
    suivi: '<path d="M12 12m-1 0a1 1 0 1 0 2 0a4 4 0 1 0-8 0a7 7 0 1 0 14 0"/>',
    mois: '<path d="M15 4a8 8 0 1 0 5 13A7 7 0 0 1 15 4z"/>',
    moi: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    maison: '<path d="M4 11l8-7 8 7M6 9.5V20h12V9.5M10 20v-5h4v5"/>',
    arbre: '<circle cx="12" cy="5" r="2.2"/><circle cx="6" cy="12" r="2.2"/><circle cx="18" cy="12" r="2.2"/><circle cx="12" cy="19" r="2.2"/><path d="M12 7.2v9.6M8 13l2.5 4.5M16 13l-2.5 4.5"/>',
    outils: '<path d="M12 3l2.4 5.6 6 .5-4.6 4 1.4 5.9L12 16l-5.2 3 1.4-5.9-4.6-4 6-.5z"/>',
    module: '<rect x="3" y="5" width="18" height="13" rx="2.5"/><path d="M10.5 9.2v4.6l4-2.3z"/>',
    formation: '<path d="M2.5 9L12 4.5 21.5 9 12 13.5z"/><path d="M6.5 11v4.2c1.6 1.5 3.4 2.3 5.5 2.3s3.9-.8 5.5-2.3V11M21.5 9v5"/>',
    audio: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4.5" height="6" rx="1.8"/><rect x="16.5" y="14" width="4.5" height="6" rx="1.8"/>'
  };
  /* L'espace de formation sur Systeme.io (podcasts des modules). Vide : la page de la formation sur le site. */
  var ESPACE_FORMATION = 'https://genesolia.systeme.io/dashboard/login';   /* l'espace élève de la formation sur Systeme.io (connexion : https://genesolia.systeme.io/dashboard/login) */
  /* Avant d'ouvrir la formation sur Systeme.io : une fenêtre explique la connexion (compte séparé, mail d'accès, mot de passe).
     Elle revient tant que la personne n'a pas confirmé avoir son mot de passe. Le clic relance aussi l'inscription (sans effet si déjà faite). */
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a[href^="https://genesolia.systeme.io"]');
    if (!a || ev.metaKey || ev.ctrlKey || a.closest('.appli-fenetre')) return;
    try { if (localStorage.getItem('genesolia-formation-mdp')) return; } catch (e) {}
    ev.preventDefault();
    var cible = a.href;
    try { session().then(function (x) { if (x && x.access_token) fetch(SB_BASE + '/functions/v1/inscription-formation', { method: 'POST', headers: { Authorization: 'Bearer ' + x.access_token, 'Content-Type': 'application/json' }, body: '{}' }).catch(function () {}); }); } catch (e) {}
    var f = document.createElement('div');
    f.className = 'appli-fenetre'; f.setAttribute('role', 'dialog'); f.setAttribute('aria-modal', 'true'); f.setAttribute('aria-label', 'Ta formation');
    f.innerHTML = '<div class="appli-carte compte-carte"><button type="button" class="appli-fermer" aria-label="Fermer">×</button>' +
      '<h2>Ta formation « Sors de la boucle »</h2>' +
      '<p>Ta formation a son propre espace, sur notre plateforme de formation <b>Systeme.io</b>. Tu y entres avec un mot de passe à part.</p>' +
      '<p><b>Ton accès t’a été envoyé par e-mail</b>, par Systeme.io : ouvre-le et crée ton mot de passe (pense à regarder tes courriers indésirables). Ensuite, connecte-toi avec ton e-mail et ce mot de passe.</p>' +
      '<p class="discret">Pas reçu ce mail ? Sur la page de connexion, touche « Mot de passe oublié ? » et indique ton e-mail : tu recevras un lien pour créer ton mot de passe.</p>' +
      '<div class="compte-actions"><a class="btn btn-plein" href="' + cible + '" data-mdp>J’ai mon mot de passe, j’y vais</a>' +
      '<a class="compte-lien" href="' + cible + '">Ouvrir la page de connexion</a></div></div>';
    f.addEventListener('click', function (e) {
      if (e.target === f || e.target.closest('.appli-fermer')) { f.remove(); return; }
      if (e.target.closest('[data-mdp]')) { try { localStorage.setItem('genesolia-formation-mdp', '1'); } catch (x) {} }
    });
    document.body.appendChild(f); f.querySelector('.btn').focus();
  }, true);
  var ONGLETS = MODE === 'cercle' ? [
    /* L'appli Le Cercle : uniquement les livres du mois, la formation et les audios (l'accueil et « Moi » restent dans l'en-tête) */
    ['mon-carnet.html', 'carnet', 'Renaissance'], ['mon-suivi-mois.html', 'suivi', 'Libération'], ['mon-module.html', 'module', 'Module'],
    [ESPACE_FORMATION || 'formation.html', 'formation', 'Formation'], ['mes-seances.html', 'audio', 'Audio']
  ] : [
    ['appli.html', 'maison', 'Accueil'], ['genosociogramme.html', 'arbre', 'Mon arbre'], ['offert.html', 'outils', 'Mes outils'],
    ['mon-suivi.html', 'suivi', 'Mon suivi'], ['login.html', 'moi', 'Mon espace']
  ];
  function ongletActif() {
    var h = (location.hash || '').replace('#', '');
    document.querySelectorAll('.barre-appli a').forEach(function (a) {
      var cible = a.getAttribute('href').split('#'), ok = cible[0] === page;
      if (ok && page === 'cercle.html') ok = (cible[1] || '') === (h === 'mois' || h === 'moi' ? h : '');
      if (MODE === 'cercle' && page === 'mon-suivi.html' && cible[0] === 'mon-suivi-mois.html') ok = true;
      if (MODE === 'cercle' && page === 'mon-mois.html' && cible[0] === 'mon-carnet.html') ok = true;
      if (ok) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }
  if (MODE) {
    var barre = document.createElement('nav');
    barre.className = 'barre-appli'; barre.setAttribute('aria-label', MODE === 'cercle' ? 'Le Cercle' : 'Genesolia');
    barre.innerHTML = ONGLETS.map(function (o) { return '<a href="' + o[0] + '"><svg viewBox="0 0 24 24" aria-hidden="true">' + ICO[o[1]] + '</svg><span>' + o[2] + '</span></a>'; }).join('');
    document.body.appendChild(barre);
    ongletActif();
    window.addEventListener('hashchange', ongletActif);
  }
  /* Dans l'appli Le Cercle, les pages du Cercle ont un en-tête court : le nom de l'appli et ton initiale (vers « Moi ») */
  if (entete && MODE === 'cercle' && ESTCERCLE) {
    var jeton = null; try { jeton = JSON.parse(localStorage.getItem('sb-qsvzzkjtjsznfntahvvh-auth-token') || 'null'); } catch (e) {}
    var nomU = String((jeton && jeton.user && jeton.user.user_metadata && (jeton.user.user_metadata.full_name || jeton.user.user_metadata.prenom)) || '').trim();
    entete.className = 'entete entete-appli';
    entete.innerHTML = '<div class="conteneur"><a class="ea-marque" href="cercle.html"><img src="/assets/icones/cercle-192.png" alt="Logo du Cercle Genesolia" width="30" height="30">Le Cercle</a>' +
      '<a class="ea-moi" href="cercle.html#moi" aria-label="Moi : mon espace du Cercle">' + (nomU ? nomU.charAt(0).toUpperCase().replace(/[<>&"]/g, '') : '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICO.moi + '</svg>') + '</a></div>';
    entete = null;
  }
  /* Dans l'appli Genesolia Pro, un dossier ouvert garde l'en-tête de l'appli : le retour aux dossiers, sans le menu du site */
  if (entete && drapeau === 'pro' && page !== 'pro.html') {
    entete.className = 'entete entete-appli entete-pro';
    entete.innerHTML = '<div class="conteneur"><a class="ea-marque" href="pro.html"><img src="/assets/icones/pro-192.png" alt="" width="30" height="30">Genesolia Pro</a>' +
      '<a class="ea-retour" href="pro.html" style="margin-left:auto;display:inline-flex;align-items:center;gap:.35rem;border:1px solid var(--rose);border-radius:99px;padding:.45rem .9rem;font:600 .86rem var(--texte);color:var(--prune);text-decoration:none;background:#fff">‹ Mes dossiers</a></div>';
    entete = null;
  }
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
          '<a class="menu-pro" href="espace-praticien.html"' + (page === 'espace-praticien.html' ? ' aria-current="page"' : '') + '>Tu es praticien·ne ?</a>' +
          '<a class="btn btn-plein" href="' + BOUTON[0] + '">' + BOUTON[1] + '</a>' +
          (MODE ? '<span class="menu-legal"><a href="mentions-legales.html">Mentions légales</a><a href="confidentialite.html">Confidentialité</a><a href="#" data-cookies>Cookies</a></span>' : '') +
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
    /* Praticien·ne connecté·e : « Tu es praticien·ne ? » devient « Mon espace praticien » (et plus la page de vente) */
    (function () {
      var lien = entete.querySelector('.menu-pro'); if (!lien) return;
      function marquer(oui) { if (!oui) return; lien.href = 'pro.html'; lien.textContent = 'Mon espace praticien'; lien.removeAttribute('aria-current'); }
      var x = null; try { x = JSON.parse(localStorage.getItem('sb-qsvzzkjtjsznfntahvvh-auth-token') || 'null'); } catch (e) {}
      if (!x || !x.access_token || !x.user) { try { localStorage.removeItem('genesolia-est-praticien'); } catch (e) {} return; }
      var cle = 'genesolia-est-praticien', memo = null; try { memo = localStorage.getItem(cle); } catch (e) {}
      if (memo === x.user.id) marquer(true);
      fetch('https://qsvzzkjtjsznfntahvvh.supabase.co/rest/v1/praticiens?select=user_id&user_id=eq.' + encodeURIComponent(x.user.id), {
        headers: { apikey: 'sb_publishable_6iEVxXmtB_u1hJ6mPS9fNg_CJhLjYkg', Authorization: 'Bearer ' + x.access_token }
      }).then(function (r) { return r.ok ? r.json() : null; }).then(function (l) {
        if (!l) return;
        var oui = l.length > 0;
        try { if (oui) localStorage.setItem(cle, x.user.id); else localStorage.removeItem(cle); } catch (e) {}
        marquer(oui);
      }).catch(function () {});
    })();
    /* Sans compte, sur les outils : rappel discret que le travail s'efface à la fermeture du navigateur */
    var OUTILS = ['genosociogramme.html', 'theme-numerologique.html', 'theme-astral.html', 'arbre-de-vie.html', 'ton-signe-maya.html', 'ton-prenom.html', 'blessures-de-l-ame.html', 'parcours.html', 'mon-suivi.html', 'exercice-ressenti-ancetre.html', 'calcul-syndrome-anniversaire.html', 'roue-des-emotions.html', 'fil-d-or.html'];
    var vuNote = false; try { vuNote = sessionStorage.getItem('note-donnees') === 'vue'; } catch (e) {}
    if (OUTILS.indexOf(page) >= 0 && !vuNote && drapeau !== 'pro' && !/[?&]exemple\b/.test(location.search) && !(window.GenesoliaDonnees && window.GenesoliaDonnees.connectee())) {
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
  if (pied && MODE) { pied.remove(); pied = null; }   /* une appli n'a pas de pied de page */
  /* Le Cercle ouvert une fois en appli : on le note, pour ne plus proposer de l'installer */
  if (MODE === 'cercle' && autonome) { try { localStorage.setItem('genesolia-cercle-installe-v2', 'oui'); } catch (e) {} }   /* seulement l'appli vraiment installée (pas cercle.html ouvert dans le navigateur) */
  var cercleInstalle = autonome;
  try { cercleInstalle = cercleInstalle || localStorage.getItem('genesolia-cercle-installe-v2') === 'oui'; } catch (e) {}
  /* Le dessin « Le Cercle dans ta poche », pour installer l'appli des membres */
  function piedAppliCercle() {
    return '<div class="pied-appli">' +
      '<div class="pa-tel" aria-hidden="true"><div class="pa-ecran">' +
        '<div class="pa-barre" aria-hidden="true"><span>9:41</span><span class="pa-encoche"></span><span>●●●</span></div>' +
        '<div class="pa-grille"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>' +
        '<b><img src="/assets/icones/cercle-192.png" alt="" width="64" height="64" loading="lazy"><em>Le Cercle</em></b>' +
        '<i></i><i></i><i></i><i></i></div>' +
      '</div></div>' +
      '<div class="pa-texte"><p class="pa-sur">L’appli des membres</p><p class="pa-titre">LE CERCLE<br><span>dans ta poche</span></p>' +
        '<ul><li>Renaissance, Libération, ton module et tes audios</li><li>Une barre en bas pour passer de l’un à l’autre</li><li>Sans store, en plein écran</li></ul>' +
        '<a href="cercle.html#installer" class="btn pa-bouton">Télécharge l’appli Le Cercle</a></div>' +
    '</div>';
  }
  /* Carnet et suivi du mois, dans le navigateur : un pied de page léger, réservé aux membres */
  if (pied && (page === 'mon-carnet.html' || page === 'mon-suivi-mois.html' || page === 'mes-seances.html')) {
    pied.className = 'pied pied-membres';
    pied.innerHTML =
      '<div class="conteneur">' +
        '<p class="pm-marque"><a href="cercle.html">Le Cercle</a> · <a href="/">' + MARQUE + '</a></p>' +
        '<ul class="pm-liens">' +
          '<li><a href="login.html">Mon espace</a></li>' +
          '<li><a href="mon-carnet.html">Mon carnet du mois</a></li>' +
          '<li><a href="mon-suivi-mois.html">Mon suivi</a></li>' +
          '<li><a href="mes-seances.html">Mes séances</a></li>' +
          '<li><a href="mon-mois.html">Mes carnets précédents</a></li>' +
          '<li><a href="blog.html">Blog</a></li>' +
          '<li><a href="la-demarche.html">La démarche</a></li>' +
          '<li><a href="tarifs.html">Tarifs</a></li>' +
          '<li><a href="mentions-legales.html">Mentions légales</a></li>' + '<li><a href="cgv.html">Conditions de vente</a></li>' +
          '<li><a href="confidentialite.html">Confidentialité</a></li>' +
          '<li><a href="#" data-cookies>Gérer mes cookies</a></li>' +
          '<li><a href="mailto:contact@genesolia.fr">contact@genesolia.fr</a></li>' +
          '<li><a href="avis.html">Envoie-nous ton avis, on en a besoin</a></li></ul>' +
        (cercleInstalle ? '' : piedAppliCercle()) +
        '<div class="pied-bas">' +
          '<span>Genesolia propose un travail symbolique de connaissance de soi et de sa lignée, en complément de tout suivi médical.</span>' +
          '<span>© ' + MARQUE + ' ' + new Date().getFullYear() + '</span>' +
        '</div>' +
      '</div>';
  } else if (pied) {
    pied.className = 'pied';
    pied.innerHTML =
      '<div class="conteneur">' +
        '<div class="pied-appli">' +
          '<div class="pa-tel" aria-hidden="true"><div class="pa-ecran">' +
            '<div class="pa-barre" aria-hidden="true"><span>9:41</span><span class="pa-encoche"></span><span>●●●</span></div>' +
            '<div class="pa-grille"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>' +
            (page === 'cercle.html' ? '<b><img src="/assets/icones/cercle-192.png" alt="" width="64" height="64" loading="lazy"><em>Le Cercle</em></b>' : '<b><img src="/assets/icones/icone-192.png" alt="" width="64" height="64" loading="lazy"><em>Genesolia</em></b>') +
            '<i></i><i></i><i></i><i></i></div>' +
          '</div></div>' +
          (page === 'cercle.html'
            /* L'espace des membres : c'est l'appli Le Cercle qu'on propose. Ailleurs, l'appli Genesolia ; elle est remplacée par Le Cercle plus bas si la personne est membre */
            ? '<div class="pa-texte"><p class="pa-sur">L’appli des membres</p><p class="pa-titre">LE CERCLE<br><span>dans ta poche</span></p>' +
              '<ul><li>Renaissance, Libération, ton module et tes audios</li><li>Une barre en bas pour passer de l’un à l’autre</li><li>Sans store, en plein écran</li></ul>' +
              '<a href="cercle.html#installer" class="btn pa-bouton"' + (page === 'cercle.html' ? ' data-installer-bandeau' : '') + '>Télécharge l’appli Le Cercle</a></div>'
            : '<div class="pa-texte"><p class="pa-sur">L\'appli gratuite</p><p class="pa-titre">GENESOLIA<br><span>dans ta poche</span></p>' +
              '<ul><li>Ton arbre, tes nombres, tes étoiles en un geste</li><li>Plein écran, comme une vraie appli</li><li>Sans store, sans compte obligatoire</li></ul>' +
              (ESTCERCLE ? '<a href="appli.html#installer" class="btn pa-bouton">' : '<a href="#" class="btn pa-bouton" data-installer-bandeau>') + 'Télécharge Genesolia sur ton mobile</a></div>') +   /* pages du Cercle : leur manifeste installe Le Cercle, on passe donc par l'accueil de l'appli Genesolia */
        '</div>' +
        '<div class="pied-grille">' +
          '<div><a class="marque" href="/">' + MARQUE + '</a>' +
            '<p>Des outils pour comprendre ce qui se répète dans ta vie, à partir de ton histoire familiale et de l\'arbre de vie.</p></div>' +
          '<div><h4>Les outils</h4><ul>' +
            '<li><a href="offert.html">Outils gratuits</a></li>' +
            '<li><a href="arbre-de-vie.html">Test de l\'arbre de vie</a></li>' +
            '<li><a href="parcours.html">Parcours guidé</a></li>' +
            '<li><a href="mon-suivi.html">Mon suivi</a></li>' +
            '<li><a href="mon-guide.html">Mon guide du mois</a></li>' +
            '<li><a href="theme-numerologique.html">Thème numérologique</a></li>' +
            '<li><a href="theme-astral.html">Thème astral</a></li>' +
            '<li><a href="ton-prenom.html">Ton prénom</a></li>' +
            '<li><a href="ta-vie-en-reel.html">Ta vie en réel</a></li>' +
            '<li><a href="cartes.html">Images à partager</a></li>' +
            '<li><a href="jeux.html">Jeux pour se rapprocher</a></li>' +
            '<li><a href="jeux-en-famille.html">Jeux en famille</a></li>' +
            '<li><a href="genosociogramme.html">Mon arbre familial</a></li>' +
            '<li><a href="roue-des-emotions.html">La roue des émotions</a></li>' +
            '<li><a href="fil-d-or.html">Le fil d\'or</a></li>' +
            '<li><a href="livres.html">Les livres Genesolia</a></li>' +
            '<li><a href="boutique.html">Boutique</a></li>' +
            '<li><a href="espace-praticien.html">Espace praticien</a></li>' +
            '<li><a href="annuaire.html">Trouver un·e praticien·ne</a></li>' +
            '<li><a href="blessures-de-l-ame.html">Les blessures du cœur</a></li>' +
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
            '<li><a href="syndrome-anniversaire.html">Le syndrome d\'anniversaire</a></li>' +
            '<li><a href="psychogenealogie.html">La psychogénéalogie</a></li>' +
            '<li><a href="/#questions">Questions fréquentes</a></li></ul></div>' +
          '<div><h4>Informations</h4><ul>' +
            '<li><a href="mentions-legales.html">Mentions légales</a></li>' + '<li><a href="cgv.html">Conditions de vente</a></li>' +
            '<li><a href="confidentialite.html">Confidentialité et cookies</a></li>' +
            '<li><a href="#" data-cookies>Gérer mes cookies</a></li>' +
            '<li><a href="login.html">Mon espace</a></li>' +
            '<li><a href="abonnement.html">Le Cercle · abonnement</a></li>' +
            '<li><a href="ma-spirale.html">Ma spirale</a></li>' +
            '<li><a href="tarifs.html">Tarifs</a></li>' +
            '<li><a href="la-demarche.html">La démarche</a></li>' +
            '<li><a href="mailto:contact@genesolia.fr">Nous écrire : contact@genesolia.fr</a></li>' +
            '<li><a href="avis.html">Envoie-nous ton avis, on en a besoin</a></li>' +
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
      '<a class="btn btn-plein" href="' + CARNET + '" download="carnet-des-deux-cycles-genesolia.pdf">Télécharger mon carnet</a>' +
      ' <a class="btn btn-trait" href="carnet-des-deux-cycles.html">Le remplir en ligne</a>';
  }
  var inscrit = false;
  try { inscrit = localStorage.getItem('carnet-inscrit') === 'oui'; } catch (e) {}
  /* Encart cadeau ajouté tout seul en bas de chaque page qui n'en a pas déjà un */
  var piedPage = document.querySelector('[data-pied]');
  /* Dans les pages du Cercle (carnet, suivi, mois, guide, appli), l'encart du bas présente la formation à la place du carnet offert */
  if (piedPage && !tunnel && PAGES_CERCLE.indexOf(page) >= 0 && page !== 'mon-module.html' && page !== 'point-de-depart.html' && page !== 'mon-carnet.html' && page !== 'mon-suivi-mois.html' && page !== 'mes-seances.html' && !document.querySelector('[data-cadeau]')) {
    var zoneForm = document.createElement('section');
    zoneForm.className = 'bloc cadeau-bas';
    zoneForm.innerHTML = '<div class="conteneur"><div class="cadeau encart-formation">' +
      '<img class="cadeau-couv" src="assets/formation/module-1-apercu.jpg" width="662" height="936" alt="Aperçu du module 1 de la formation Sors de la boucle" loading="lazy">' +
      '<div class="cadeau-texte"><p class="ef-sur">La formation · Sors de la boucle</p><h2>Va plus loin que le mois : sors vraiment de ta boucle</h2>' +
      '<p>Ton carnet t’aide à avancer, ton suivi à te libérer. La formation t’emmène au bout du chemin : 8 modules en podcast, un carnet pour chacun, et à chaque étape un geste concret pour arrêter de rejouer la même histoire.</p>' +
      '<ul class="ef-liste"><li>Le module 1 offert, pour tester</li><li>Incluse dans Le Cercle, au fil de tes étapes</li><li>À ton rythme, depuis chez toi</li></ul>' +
      '<p><a class="btn btn-plein" href="formation.html">Découvrir la formation</a></p></div></div></div>';
    piedPage.parentNode.insertBefore(zoneForm, piedPage);
  }
  if (piedPage && !tunnel && PAGES_CERCLE.indexOf(page) < 0 && page !== 'carnet-des-deux-cycles.html' && page !== 'praticien.html' && page !== 'espace-praticien.html' && !document.querySelector('[data-cadeau]')) {   /* ni dans le cabinet ni sur la page pro : ce sont des outils de travail */   /* pas d'encart « carnet offert » dans le carnet lui-même */
    var zoneCadeau = document.createElement('section');
    zoneCadeau.className = 'bloc cadeau-bas';
    zoneCadeau.innerHTML = '<div class="conteneur"><div data-cadeau></div></div>';
    piedPage.parentNode.insertBefore(zoneCadeau, piedPage);
  }

  document.querySelectorAll('[data-cadeau]').forEach(function (el, n) {
    var id = 'cadeau-' + n;
    el.className = 'cadeau';
    /* L'offert du site : le point de départ (interactif, gardé dans son espace, repris tel quel si elle entre dans Le Cercle) */
    el.innerHTML =
      '<img class="cadeau-couv" src="assets/cercle/couv-point-depart.webp" width="580" height="820" alt="Couverture : Mon point de départ" loading="lazy">' +
      '<div class="cadeau-texte">' +
        '<p class="ef-sur">Offert · 15 minutes</p>' +
        '<h2>Ton point de départ</h2>' +
        '<p>Ta roue de la vie, ton mode survie (quand tu es toujours en alerte), tes blessures du cœur et tes cibles : en quinze minutes, tu vois d’où tu pars et ce qui se rejoue pour toi. Tu découvres aussi si Le Cercle est fait pour toi.</p>' +
        '<ul class="ef-liste"><li>Interactif, sur ton téléphone ou ton ordinateur</li><li>Tes résultats gardés dans ton espace</li><li>Repris tels quels si tu ouvres ton mois offert du Cercle : rien à refaire</li></ul>' +
        '<p class="cadeau-ligne"><a class="btn btn-plein" href="point-de-depart.html">Faire mon point de départ</a></p>' +
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
          btn.disabled = false; btn.textContent = 'Recevoir le PDF';
          err.textContent = 'L\'envoi n\'a pas fonctionné. Vérifie ta connexion et réessaie dans un instant.';
        });
    });
  });

  /* ===== Formation « Sors de la boucle » : annonce, encart et liste d'attente =====
     Pour changer la date ou masquer l'annonce, modifier les trois valeurs ci-dessous. */
  var FORMATION = {
    date: 'maintenant',                             /* tout est disponible (19/10/2026) */
    module1: 'tout de suite',                       /* le module 1 offert part dès l'inscription à la liste */
    page: 'formation.html',
    finAnnonce: '2026-11-08'                        /* le bandeau disparaît à cette date */
  };
  var annonceActive = new Date() < new Date(FORMATION.finAnnonce + 'T00:00:00');

  /* Bandeau fin en haut des pages du site : Le Cercle, 1er mois offert (pas dans le tunnel, ni pour les membres) */
  var fermee = false;
  try { fermee = sessionStorage.getItem('annonce-cercle') === 'fermee'; } catch (e) {}
  var PAGES_SANS_BANDEAU = ['abonnement.html', 'essai.html', 'bienvenue.html', 'login.html', 'seance-offerte.html', 'point-de-depart.html', 'praticien.html', 'espace-praticien.html'];
  var noteAffichee = !!document.querySelector('.note-donnees') && window.innerWidth < 600;   /* téléphone : pas deux bandeaux empilés avant le contenu */
  if (!fermee && !tunnel && !noteAffichee && PAGES_SANS_BANDEAU.indexOf(page) < 0 && !/[?&]partage=/.test(location.search) &&   /* arbre partagé (souvent par une praticienne) : pas de publicité pour Le Cercle */
      entete && (!ESTCERCLE || page === 'cercle.html')) {
    var bandeau = document.createElement('div');
    bandeau.className = 'annonce annonce-cercle';
    bandeau.innerHTML =
      '<a href="abonnement.html"><img class="annonce-livret" src="/assets/cercle/couv-renaissance-petite.webp" width="62" height="88" alt=""><span class="annonce-texte"><span class="annonce-pastille">Le Cercle</span> Et si ce qui se répète dans ta vie s’arrêtait enfin ? <u>Ton 1<sup>er</sup> mois est offert, sans </u><span style="white-space:nowrap"><u>carte</u><svg class="annonce-chevron" viewBox="0 0 10 16" width="8" height="12" aria-hidden="true" style="display:inline-block;margin-left:.4em;vertical-align:-1px"><path d="M2 2l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span></span></a>' +
      '<button type="button" aria-label="Fermer l\'annonce">×</button>';
    bandeau.querySelector('button').addEventListener('click', function () {
      bandeau.remove();
      try { sessionStorage.setItem('annonce-cercle', 'fermee'); } catch (e) {}
    });
    entete.parentNode.insertBefore(bandeau, entete);
    /* Cliente connectée : à la place du Cercle, le bandeau de Noël (jusqu'au 6 janvier) ; après, membre du Cercle : plus de bandeau */
    var NOEL_FIN = new Date('2027-01-06T23:59:59');
    function bandeauNoel() {
      bandeau.className = 'annonce annonce-cercle annonce-noel';
      bandeau.querySelector('a').outerHTML = '<a href="boutique.html"><span class="annonce-noel-etoile" aria-hidden="true">✦</span><span class="annonce-texte"><span class="annonce-pastille">Noël</span> Des cadeaux qui ont du sens : la carte cadeau du Cercle, les livres à remplir en famille. <span style="white-space:nowrap"><u>Voir les idées de Noël</u><svg class="annonce-chevron" viewBox="0 0 10 16" width="8" height="12" aria-hidden="true" style="display:inline-block;margin-left:.4em;vertical-align:-1px"><path d="M2 2l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span></span></a>';
    }
    setTimeout(function () {
      var A = window.GenesoliaAcces, C = window.GenesoliaCompte, connectee = !!(C && C.actif && C.actif());
      if (!connectee) return;
      if (new Date() < NOEL_FIN && page !== 'boutique.html') { bandeauNoel(); return; }
      if (new Date() < NOEL_FIN) { bandeau.remove(); return; }   /* déjà sur la page des idées de Noël */
      if (A && A.membre) A.membre().then(function (m) { if (m) bandeau.remove(); });
    }, 0);
  }

  /* Encart à placer n'importe où : <div data-formation></div> */
  document.querySelectorAll('[data-formation]').forEach(function (el) {
    el.className = 'encart-formation';
    el.innerHTML =
      '<div class="ef-texte">' +
        '<p class="ef-sur">La formation · disponible maintenant · module 1 offert</p>' +
        '<h2>Tu connais ton schéma. Maintenant, arrête de le répéter.</h2>' +
        '<p>« Sors de la boucle » : 8 modules en podcast, un cahier d\'exercices et un geste concret par module pour arrêter la boucle dès le premier jour. À ton rythme, sur ton téléphone ou ton ordinateur.</p>' +
        '<ul class="ef-avantages">' +
          '<li><b>Le module 1 offert</b>, envoyé par e-mail tout de suite</li>' +
          '<li><b>La formation complète</b>, incluse dans Le Cercle : ton premier mois est offert, sans carte</li>' +
          '<li><b>À ton rythme</b>, sur ton téléphone ou ton ordinateur</li>' +
        '</ul>' +
        '<a class="btn btn-plein" href="' + FORMATION.page + '">Découvrir la formation</a>' +
        '<p class="ef-note">Gratuit et sans engagement.</p>' +
      '</div>' +
      '<div class="ef-visuel" aria-hidden="true"><img src="assets/formation/module-1-apercu.jpg" alt="Aperçu du module 1 de la formation Sors de la boucle" width="580" height="820" loading="lazy"></div>';
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
        '<p>C\'est noté. <b>Ton module 1 offert t\'arrive par e-mail</b>, étape par étape :</p>' +
        '<ol class="liste-etapes">' +
          '<li><b>Le podcast du module</b><span>pour comprendre ta boucle</span></li>' +
          '<li><b>Le cahier d\'exercices</b><span>et ton carnet de 7 jours</span></li>' +
        '</ol>' +
        '<p class="discret">Envie de toute la formation tout de suite ? Elle est incluse dans <a href="abonnement.html">Le Cercle</a>, avec ton premier mois offert, sans carte. Pense à vérifier tes courriers indésirables et à ajouter notre adresse à tes contacts.</p></div>';
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
        '<button class="btn btn-plein" type="submit">Je reçois le module 1 offert</button>' +
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
          btn.disabled = false; btn.textContent = 'Je reçois le module 1 offert';
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
        if (auto) setTimeout(carreCercle, 200);
      });
    });
    document.body.appendChild(b);
  }
  if (!vu && !window.GenesoliaMesure.pro()) bandeauCookies(true);
  document.addEventListener('click', function (e) {
    var l = e.target.closest && e.target.closest('[data-cookies]');
    if (!l) return;
    e.preventDefault();
    bandeauCookies(false);
  });

  /* Petit carré en bas à gauche : le point de départ offert (la porte d'entrée du Cercle). Il s'affiche tout de suite.
     Jamais pour une membre, ni si son point de départ est déjà fait. Fermé, il revient à la prochaine visite. */
  var CARRE = {
    titre: 'Ton point de départ',
    image: 'assets/cercle/couv-point-depart-petite.webp',
    lien: 'point-de-depart.html'
  };
  var PETIT_ECRAN = false;
  /* Téléphone : aucun petit carré (trop gênant sur un petit écran) */
  var TELEPHONE = window.matchMedia && window.matchMedia('(max-width: 760px)').matches;
  /* Quel offert selon le sujet de la page ?
     amour, couple, liens, fratrie, parents, abandon, rejet, trahison → la séance du cycle 2 (L'arbre des liens)
     peur, argent, manque, émotions, stress, deuils, humiliation, injustice → la séance du cycle 1 (Sortir de l'alerte)
     le reste (arbre, nombres, ciel, prénoms, outils…) → le point de départ */
  function offertPertinent() {
    var p = page.replace(/\.html$/, '');
    if (/amour|couple|affecti|relation|imago|trahison|abandon|rejet|fratrie|parents|loyaute|seule|filles-garcons|choix-amoureux/.test(p)) return 'c2-10';
    if (/peur|argent|manque|emotion|hormone|alerte|survie|stress|elements|deuil|guerre|humiliation|injustice|blessure|masques|gisant|remplacement/.test(p)) return 'c1-10';
    return 'point-de-depart';
  }
  function pdFait() { try { var x = JSON.parse(localStorage.getItem('genesolia-carnet-point-de-depart') || 'null'); return !!(x && x.v && x.v.fait); } catch (e) { return false; } }
  /* Demande d'e-mail avant d'ouvrir un offert (point de départ ou séance audio), avec les grandes lignes et le mois offert du Cercle.
     window.GenesoliaDemandeMail({ offre: 'point-de-depart' | 'c1-10' | 'c2-10', fermable: true, apres: function (jeton) {} }) */
  var OFFERTS = {
    'point-de-depart': { sur: 'Offert · 15 minutes', titre: 'Ton point de départ', image: 'assets/cercle/couv-point-depart-petite.webp',
      liste: ['Ta roue de la vie : où tu en es dans les grands domaines de ta vie', 'Ton mode survie : quand tu es toujours en alerte, à tout tenir à bout de bras, comment tu réagis', 'Tes blessures du cœur : ce qui se rejoue dans tes liens', 'Tes cibles et ta synthèse, gardées dans ton espace'], bouton: 'Commencer mon point de départ' },
    'c1-10': { sur: 'Offert · séance complète', titre: 'Ta séance « Sortir de l’alerte »', image: 'assets/cercle/couv-renaissance-petite.webp',
      liste: ['Cycle 1 · De la peur à la paix', 'L’alarme qui sonne en toi baisse, cran par cran, jusqu’au silence', 'À écouter autant de fois que tu veux'], bouton: 'Écouter ma séance' },
    'c2-10': { sur: 'Offert · séance complète', titre: 'Ta séance « L’arbre des liens »', image: 'assets/cercle/couv-liberation-petite.webp',
      liste: ['Cycle 2 · Comment j’aime', 'Tu dessines l’arbre de tes liens et tu écris comment tu souhaites aimer', 'À écouter autant de fois que tu veux'], bouton: 'Écouter ma séance' }
  };
  function escO(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function demandeMail(o) {
    var O = OFFERTS[o.offre]; if (!O) return;
    var ancien = document.querySelector('.offert-fenetre'); if (ancien) ancien.remove();
    var f = document.createElement('div');
    f.className = 'appli-fenetre offert-fenetre'; f.setAttribute('role', 'dialog'); f.setAttribute('aria-modal', 'true'); f.setAttribute('aria-label', O.titre);
    f.innerHTML = '<form class="appli-carte offert-carte" novalidate>' + (o.fermable === false ? '' : '<button type="button" class="appli-fermer" aria-label="Fermer">×</button>') +
      '<img class="offert-couv" src="' + O.image + '" alt="" width="62" height="88"><p class="offert-sur">' + O.sur + '</p><h2>' + O.titre + '</h2>' +
      '<ul class="compte-liste">' + O.liste.map(function (t) { return '<li>' + escO(t) + '</li>'; }).join('') + '</ul>' +
      '<p class="offert-cercle"><b>En plus : ton accès gratuit au Cercle pendant 1 mois</b>, sans carte. Ton parcours guidé (Renaissance et Libération), tes séances audio, la formation « Sors de la boucle » et ton appli.</p>' +
      '<label class="offert-champ">Prénom<input name="prenom" autocomplete="given-name"></label>' +
      '<label class="offert-champ">E-mail<input name="email" type="email" autocomplete="email" required></label>' +
      '<label class="offert-accord"><input type="checkbox" name="accord" required><span>J’accepte de recevoir mon offert et les nouvelles de Genesolia par e-mail. Je peux me désinscrire à tout moment. <a href="confidentialite.html" target="_blank">Mes données</a></span></label>' +
      '<input type="text" name="_gotcha" tabindex="-1" autocomplete="off" style="display:none">' +
      '<button class="btn btn-plein" type="submit">' + O.bouton + '</button><p class="offert-erreur" role="alert"></p>' +
      (o.fermable === false ? '<p class="offert-retour"><a href="/">Revenir au site</a></p>' : '') + '</form>';
    var form = f.querySelector('form');
    function fermer() { f.remove(); }
    f.addEventListener('click', function (e) { if (o.fermable !== false && (e.target === f || e.target.closest('.appli-fermer'))) fermer(); });
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var err = form.querySelector('.offert-erreur'), bt = form.querySelector('button[type=submit]'), email = form.email.value.trim();
      if (form._gotcha.value) return;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { err.textContent = 'Vérifie ton adresse e-mail.'; return; }
      if (!form.accord.checked) { err.textContent = 'Coche la case pour recevoir ton offert.'; return; }
      err.textContent = ''; bt.disabled = true; bt.textContent = 'Un instant…';
      fetch('https://qsvzzkjtjsznfntahvvh.supabase.co/functions/v1/seance-offerte', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email, prenom: form.prenom.value.trim(), accord: true, seance: o.offre }) })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (!d || !d.jeton) throw new Error(d && d.erreur || 'vide');
          try { localStorage.setItem('genesolia-mail-offert', JSON.stringify({ j: d.jeton, t: Date.now() })); if (o.offre !== 'point-de-depart') localStorage.setItem('genesolia-seance-offerte', JSON.stringify({ j: d.jeton, s: o.offre })); } catch (e) {}
          if (window.umami) try { window.umami.track('offert-mail-' + o.offre); } catch (e) {}
          fermer(); if (o.apres) o.apres(d.jeton, d);
        })
        .catch(function (x) { bt.disabled = false; bt.textContent = O.bouton; err.textContent = String(x && x.message) === 'email' ? 'Vérifie ton adresse e-mail.' : 'L’envoi n’a pas fonctionné. Réessaie dans un instant.'; });
    });
    document.body.appendChild(f);
    var champ = form.querySelector('input[name=prenom]'); if (champ) setTimeout(function () { champ.focus(); }, 50);
  }
  window.GenesoliaDemandeMail = demandeMail;
  window.GenesoliaMailOffert = function () { try { return !!localStorage.getItem('genesolia-mail-offert'); } catch (e) { return false; } };
  /* Les boutons des petits carrés ouvrent d'abord la demande d'e-mail (sauf si elle l'a déjà donné) */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('.carre-cercle a[data-offre]'); if (!a) return;
    var offre = a.getAttribute('data-offre'), href = a.getAttribute('href');
    if (window.GenesoliaMailOffert()) return;   /* déjà donné : on va directement à l'offert */
    e.preventDefault();
    demandeMail({ offre: offre, apres: function (jeton) { location.href = offre === 'point-de-depart' ? href : 'seance-offerte.html?s=' + offre + '&j=' + jeton; } });
  });

  /* Deuxième petit carré : la première séance audio offerte (cycle 1 ou cycle 2), contre l'e-mail.
     Il prend la place du premier quand le point de départ est fait, ou quand le premier a été fermé. */
  function seanceRecue() { try { return !!localStorage.getItem('genesolia-seance-offerte'); } catch (e) { return false; } }
  var SEANCES_CARRE = {
    'c1-10': { cycle: 'Cycle 1 · De la peur à la paix', titre: 'Sortir de l’alerte', texte: 'L’alarme qui sonne en toi depuis des années baisse, cran par cran, jusqu’au silence. Pour souffler et retrouver ta sécurité.', image: 'assets/cercle/couv-renaissance-petite.webp' },
    'c2-10': { cycle: 'Cycle 2 · Comment j’aime', titre: 'L’arbre des liens', texte: 'Tu dessines l’arbre de tes liens et tu écris comment tu souhaites aimer. Pour comprendre ce qui se rejoue en amour.', image: 'assets/cercle/couv-liberation-petite.webp' }
  };
  function carreSeance(cible) {
    if (TELEPHONE || window.GenesoliaMembre || seanceRecue() || page === 'seance-offerte.html' || page === 'point-de-depart.html') return;
    if (tunnel || page === 'mon-carnet.html' || page === 'genosociogramme.html' || page === 'abonnement.html' || page === 'offert.html' || page === 'praticien.html' || document.querySelector('.carre-cercle')) return;
    if (document.querySelector('.appli-fenetre, .chemin-toast.visible, .cookies.visible')) return;
    try { if (sessionStorage.getItem('carre-seance-ferme') === '1') return; } catch (e) {}
    var c = document.createElement('aside');
    c.className = 'carre-cercle carre-seance';
    c.setAttribute('aria-label', 'Ta première séance audio offerte');
    var S = SEANCES_CARRE[cible];
    if (S) {   /* page en lien avec cette séance : on la propose, elle seule */
      var autre = cible === 'c1-10' ? 'c2-10' : 'c1-10';
      c.innerHTML =
        '<button type="button" class="cc-fermer" aria-label="Fermer">×</button>' +
        '<img src="' + S.image + '" alt="" width="60" height="85">' +
        '<div><p class="cc-sur">Offert · séance audio complète</p>' +
          '<p class="cc-titre">« ' + S.titre + ' »</p>' +
          '<p class="cc-texte">' + S.texte + '</p>' +
          '<a class="cc-bouton" href="seance-offerte.html?s=' + cible + '" data-offre="' + cible + '">Écouter ma séance offerte</a>' +
          '<p class="cc-autre"><a href="seance-offerte.html?s=' + autre + '" data-offre="' + autre + '">Ou « ' + SEANCES_CARRE[autre].titre + ' » (' + SEANCES_CARRE[autre].cycle.split(' · ')[0].toLowerCase() + ')</a></p></div>';
    } else c.innerHTML =
      '<button type="button" class="cc-fermer" aria-label="Fermer">×</button>' +
      '<img src="assets/cercle/couv-renaissance-petite.webp" alt="" width="60" height="85">' +
      '<div><p class="cc-sur">Offert · séance audio complète</p>' +
        '<p class="cc-titre">Ta première séance, offerte</p>' +
        '<p class="cc-texte">Laquelle te parle le plus aujourd’hui ?</p>' +
        '<a class="cc-bouton cc-choix" href="seance-offerte.html?s=c1-10" data-offre="c1-10"><b>Cycle 1 · Sortir de l’alerte</b><span>Souffler, retrouver ta sécurité</span></a>' +
        '<a class="cc-bouton cc-choix" href="seance-offerte.html?s=c2-10" data-offre="c2-10"><b>Cycle 2 · L’arbre des liens</b><span>Comprendre comment tu aimes</span></a></div>';
    c.querySelector('.cc-fermer').addEventListener('click', function () { c.remove(); try { sessionStorage.setItem('carre-seance-ferme', '1'); } catch (e) {} });
    document.body.appendChild(c);
    requestAnimationFrame(function () { c.classList.add('visible'); });
  }
  function carreCercle() {
    if (TELEPHONE || window.GenesoliaMembre || page === 'point-de-depart.html') return;
    var offre = offertPertinent();
    if (offre !== 'point-de-depart' && !seanceRecue()) { carreSeance(offre); return; }   /* page sur l'amour ou sur la peur : la séance qui lui parle */
    var pdFerme = false; try { pdFerme = sessionStorage.getItem('carre-cercle-ferme') === '1'; } catch (e) {}
    if (pdFait() || pdFerme) { carreSeance(); return; }   /* point de départ déjà fait, ou carré fermé : on propose la séance offerte */
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
    if (tunnel || page === 'mon-mois.html' || page === 'mon-carnet.html' || page === 'genosociogramme.html' || page === 'abonnement.html' || page === 'offert.html' || page === 'praticien.html' || document.querySelector('.carre-cercle')) return;
    try {
      if (sessionStorage.getItem('carre-cercle-ferme') === '1') return;
    } catch (e) {}
    var c = document.createElement('aside');
    c.className = 'carre-cercle';
    c.setAttribute('aria-label', 'Ton point de départ offert');
    c.innerHTML =
      '<button type="button" class="cc-fermer" aria-label="Fermer">×</button>' +
      '<img src="' + CARRE.image + '" alt="" width="60" height="85">' +
      '<div><p class="cc-sur">Offert · 15 minutes</p>' +
        '<p class="cc-titre">' + CARRE.titre + '</p>' +
        '<p class="cc-texte">Ta roue de la vie, ton mode survie (quand tu es toujours en alerte) et tes blessures du cœur : vois d’où tu pars, et si Le Cercle est fait pour toi.</p>' +
        '<a class="cc-bouton" href="' + CARRE.lien + '" data-offre="point-de-depart">Je commence</a></div>';
    c.querySelector('.cc-fermer').addEventListener('click', function () {
      c.remove();
      try { sessionStorage.setItem('carre-cercle-ferme', '1'); } catch (e) {}
      setTimeout(carreSeance, 600);   /* la séance offerte prend la place */
    });
    document.body.appendChild(c);
    requestAnimationFrame(function () { c.classList.add('visible'); });
  }
  if (vu) setTimeout(carreCercle, 200);

  /* ===== Typographie française sur tout ce qui s'affiche =====
     Apostrophe courbe (l’arbre) et espace insécable avant : ; ? ! » et après « , pour qu'aucun signe ne se retrouve seul en début de ligne.
     Appliquée aussi au contenu ajouté ensuite par les pages (carnets, guide, espace). Les champs de saisie et les dessins (arbre) ne sont pas touchés. */
  var SANS_TYPO = /^(SCRIPT|STYLE|TEXTAREA|NOSCRIPT|CODE|PRE|INPUT|SELECT|OPTION)$/;
  function typoTexte(t) { return t.replace(/([A-Za-zÀ-ÖØ-öø-ÿŒœ])'/g, '$1\u2019').replace(/ ([?!:;»])/g, '\u00a0$1').replace(/« /g, '«\u00a0'); }
  function typo(racine) {
    if (!racine || !document.createTreeWalker) return;
    var w = document.createTreeWalker(racine, NodeFilter.SHOW_TEXT, { acceptNode: function (n) {
      for (var e = n.parentNode; e && e !== document.body; e = e.parentNode) {
        if (SANS_TYPO.test(e.nodeName) || e.namespaceURI === 'http://www.w3.org/2000/svg' || e.isContentEditable || (e.hasAttribute && e.hasAttribute('data-sans-typo'))) return NodeFilter.FILTER_REJECT;
      }
      return /[' ]/.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    } }), n, liste = [];
    while ((n = w.nextNode())) liste.push(n);
    liste.forEach(function (x) { var u = typoTexte(x.nodeValue); if (u !== x.nodeValue) x.nodeValue = u; });
  }
  window.GenesoliaTypo = typo;
  /* « Revenir à mon livre » (data-retour) : on revient exactement là d'où l'on vient.
     Onglet ouvert depuis le livre : on le ferme (le livre est resté ouvert dans l'autre onglet) ; sinon retour en arrière ; sinon le lien par défaut. */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-retour]'); if (!a) return;
    var memeSite = false; try { memeSite = !!document.referrer && new URL(document.referrer).origin === location.origin; } catch (x) {}
    if (window.opener && !MODE) { e.preventDefault(); window.close(); setTimeout(function () { location.href = a.href; }, 300); return; }
    if (memeSite && history.length > 1) { e.preventDefault(); history.back(); }
  });
  /* Seulement sur les pages de lecture des applis : certains outils relisent leurs propres libellés pour enregistrer (parcours, blessures) */
  var PAGES_TYPO = PAGES_CERCLE.concat(['appli.html', 'login.html', 'bienvenue.html', 'abonnement.html', 'essai.html', 'carnet-des-deux-cycles.html']);
  if (document.body && PAGES_TYPO.indexOf(page) >= 0) {
    typo(document.body);
    if (window.MutationObserver) {
      var aTraiter = [], prevu = false;
      new MutationObserver(function (ms) {
        ms.forEach(function (m) { m.addedNodes.forEach(function (x) { if (x.nodeType === 1 || x.nodeType === 3) aTraiter.push(x.nodeType === 3 ? x.parentNode : x); }); });
        if (prevu || !aTraiter.length) return;
        prevu = true;
        requestAnimationFrame(function () { prevu = false; var l = aTraiter; aTraiter = []; l.forEach(function (x) { if (x && x.isConnected) typo(x); }); });
      }).observe(document.body, { childList: true, subtree: true });
    }
  }

  /* ===== Application installable (bouton « Installer l'appli ») ===== */
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', function () { navigator.serviceWorker.register('/sw.js').catch(function () {}); });
  }
  /* Une notification vient d'être touchée : si l'appli s'est ouverte ailleurs (iPhone), on va sur la page visée */
  if (window.caches && caches.open) caches.open('genesolia-notif').then(function (c) {
    return c.match('/__notif-cible').then(function (r) {
      if (!r) return;
      return r.json().then(function (d) {
        c.delete('/__notif-cible');
        if (!d || !d.url || Date.now() - d.t > 60000) return;
        var u = new URL(d.url, location.href);
        if (u.origin === location.origin && u.pathname + u.search + u.hash !== location.pathname + location.search + location.hash) location.replace(u.href);
      });
    });
  }).catch(function () {});
  var installee = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  var iOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var invite = null;
  function montrerInstall() { document.querySelectorAll('[data-installer]').forEach(function (a) { a.hidden = false; }); }
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); invite = e; if (!installee) montrerInstall(); });
  window.addEventListener('appinstalled', function () { invite = null; document.querySelectorAll('[data-installer]').forEach(function (a) { a.hidden = true; }); });
  var ua = navigator.userAgent;
  var android = /android/i.test(ua), chromeIOS = /crios/i.test(ua), samsung = /samsungbrowser/i.test(ua), firefox = /firefox|fxios/i.test(ua);
  var integre = /FBAN|FBAV|Instagram|Line\/|Snapchat|LinkedInApp|GSA\/|Pinterest|TikTok|wv\)/i.test(ua);   /* navigateur intégré à une autre appli : pas d'« écran d'accueil » */
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
      (integre ? '<p class="appli-alerte"><b>' + (/GSA\//i.test(ua) ? 'Tu es dans l’appli Google.' : 'Tu es dans le navigateur d’une autre appli.') + '</b> Pour installer ' + APPLI.nom + ', ouvre d’abord cette page dans ' + (iOS ? 'Safari' : 'Chrome') + ' (menu <b>•••</b> puis « Ouvrir dans le navigateur », ou copie le lien plus bas).</p>' : '') +
      '<p class="appli-intro">C’est gratuit et ça prend 30 secondes :</p>' +
      (iOS && chromeIOS
        ? '<ol><li>Touche le bouton <b>Partager</b> ' + partage + ' en haut à droite, dans la barre d\'adresse.</li><li>Choisis <b>Ajouter à l\'écran d\'accueil</b>.</li><li>Touche <b>Ajouter</b> : l\'icône ' + APPLI.nom + ' apparaît avec tes applis.</li></ol>'
        : iOS
        ? '<ol><li>Touche le bouton <b>Partager</b> ' + partage + ' en bas de Safari (sur les iPhone récents, il est parfois dans le menu <b>•••</b>).</li><li>Choisis <b>Sur l\'écran d\'accueil</b>.</li><li>Touche <b>Ajouter</b> : l\'icône ' + APPLI.nom + ' apparaît avec tes applis.</li></ol>'
        : android && samsung
        ? '<ol><li>Touche le menu <b>≡</b> en bas à droite.</li><li>Choisis <b>Ajouter page à</b>, puis <b>Écran d\'accueil</b>.</li><li>Ouvre ensuite ' + APPLI.nom + ' depuis son icône.</li></ol>'
        : android && firefox
        ? '<ol><li>Touche le menu <b>⋮</b>.</li><li>Choisis <b>Installer</b> (ou <b>Ajouter à l\'écran d\'accueil</b>).</li></ol><p>Pour la meilleure version, ouvre plutôt genesolia.fr dans Chrome.</p>'
        : android
        ? '<ol><li>Touche le menu <b>⋮</b> en haut à droite de Chrome.</li><li>Choisis <b>Installer l\'application</b>. Si tu ne vois que « Ajouter à l\'écran d\'accueil », touche-le puis choisis <b>Installer</b> (et non « Créer un raccourci »).</li><li>Patiente quelques secondes : l\'icône ' + APPLI.nom + ' arrive avec tes applis. Ouvre-la depuis là, pas depuis Chrome.</li></ol>'
        : '<ol><li>Dans Chrome ou Edge, clique sur l\'icône <b>Installer</b> à droite de la barre d\'adresse (un petit écran avec une flèche).</li><li>Confirme avec <b>Installer</b>.</li><li>' + APPLI.nom + ' s\'ouvre dans sa propre fenêtre, et se retrouve avec tes applications.</li></ol><p>Sur téléphone, ouvre genesolia.fr et touche « Installer l\'appli » en bas de la page.</p>') +
      (invite ? '<p><button type="button" class="btn btn-plein" data-installer-direct>Installer maintenant</button></p>' : '') +
      /* toujours : que faire si l'option n'apparaît pas */
      '<div class="appli-astuce"><p><b>Tu ne vois pas « Sur l’écran d’accueil » ou « Installer » ?</b></p><p>Ouvre cette page dans ' + (iOS ? '<b>Safari</b>' : android ? '<b>Chrome</b>' : '<b>Safari</b> (iPhone) ou <b>Chrome</b> (Android)') + ' : l’appli <b>Google</b> (la recherche Google), et les liens ouverts depuis Facebook, Instagram ou un e-mail, ne proposent pas l’option. Copie le lien, puis colle-le dans ' + (iOS ? 'Safari' : android ? 'Chrome' : 'Safari ou Chrome') + '.</p>' +
      '<p><button type="button" class="btn btn-trait" data-copier-lien>Copier le lien</button></p></div>' +
      '<p class="appli-note">Gratuit, sans téléchargement dans un store. Tes outils s\'ouvrent en plein écran, comme une vraie appli.</p></div>';
    function fermer() { f.remove(); }
    f.addEventListener('click', function (e) { if (e.target === f || e.target.closest('.appli-fermer')) fermer(); });
    document.addEventListener('keydown', function k(e) { if (e.key === 'Escape') { fermer(); document.removeEventListener('keydown', k); } });
    f.addEventListener('click', function (e) {
      if (e.target.closest('[data-installer-direct]') && invite) { invite.prompt(); invite.userChoice.then(function () { invite = null; f.remove(); }); }
      var cp = e.target.closest('[data-copier-lien]');
      if (cp) { var lien = location.origin + location.pathname; (navigator.clipboard ? navigator.clipboard.writeText(lien) : Promise.reject()).then(function () { cp.textContent = 'Lien copié'; }, function () { window.prompt('Copie ce lien :', lien); }); }
    });
    document.body.appendChild(f);
    f.querySelector('.appli-fermer').focus();
  }
  function installer() { aideInstall(); }   /* toujours le tutoriel, avec « Installer maintenant » dedans quand le navigateur le permet */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-installer],[data-installer-bandeau]'); if (!a) return;
    e.preventDefault();
    installer();
  });
  window.GenesoliaInstaller = { ouvrir: installer, aide: aideInstall, installee: function () { return installee; } };

  /* Discussion en direct (Crisp) : bulle en bas à droite. Pas dans l'appli installée ni sur ses écrans à onglets du bas (elle les cacherait),
     ni sur le lien de partage reçu par les client·es d'un·e praticien·ne, ni en mode séance. */
  (function () {
    if (MODE || drapeau === 'pro' || page === 'questionnaire.html' || /[?&]partage=/.test(location.search) || page === 'praticien-partage.html') return;   /* appli Pro : la bulle cachait l'onglet « Mon activité » */
    window.$crisp = window.$crisp || []; window.CRISP_WEBSITE_ID = '72330f82-5507-42cc-a376-22083dd99abe';
    /* sur téléphone, la bulle n'arrive qu'après un défilement ou 15 secondes : elle ne cache plus le premier écran (« Dessiner mon arbre ») */
    var charge = false;
    function charger() { if (charge) return; charge = true; window.removeEventListener('scroll', auDefile); var sc = document.createElement('script'); sc.src = 'https://client.crisp.chat/l.js'; sc.async = 1; document.head.appendChild(sc); }
    function auDefile() { if ((window.scrollY || 0) > 400) charger(); }
    if (window.matchMedia && matchMedia('(max-width: 760px)').matches) { window.addEventListener('scroll', auDefile, { passive: true }); setTimeout(charger, 15000); }
    else charger();
    var cache = null;
    function maj() {
      var c = document.body && (document.body.classList.contains('mode-seance') || document.body.classList.contains('mobile-arbre'));
      if (c === cache) return; cache = c;
      window.$crisp.push(['do', c ? 'chat:hide' : 'chat:show']);
    }
    if (document.body) { maj(); new MutationObserver(maj).observe(document.body, { attributes: true, attributeFilter: ['class'] }); }
  })();
  /* #installer (bouton « Télécharge Genesolia sur ton mobile » depuis une page du Cercle) : les instructions s'ouvrent ; cercle.html gère le sien */
  if (location.hash === '#installer' && page !== 'cercle.html') { history.replaceState(null, '', location.pathname + location.search); setTimeout(aideInstall, 300); }

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
      (quoi === 'ton abonnement' ? '<p>Pour t\'abonner, connecte-toi à ton espace Genesolia (ou crée-le, c\'est gratuit) : ton accès s\'ouvrira dessus dès le paiement.</p>' : '<p>Pour le télécharger, crée ton espace Genesolia : c\'est gratuit et ça prend une minute.</p>') +
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
        var tout = (r[1] || []).some(function (a) { return (a.offre === 'abonnement' || a.offre === 'offert' || a.offre === 'cercle' || a.offre === 'admin') && new Date(a.valide_jusqu) > new Date(); });   /* 'admin' : la propriétaire (relecture), membre comme 'offert' */
        var pass = (r[1] || []).some(function (a) { return a.offre === 'pass' && new Date(a.valide_jusqu) > new Date(); });   /* le Pass : livrets et analyses, sans le parcours du Cercle */
        var admin = (r[1] || []).some(function (a) { return a.offre === 'admin' && new Date(a.valide_jusqu) > new Date(); });
        return { uid: uid, email: x.user && x.user.email, produits: produits, tout: tout, pass: pass, admin: admin };
      });
    });
    mesAcces.then(function (a) { if (!a) mesAcces = null; });
    return mesAcces;
  }
  /* Promise<boolean> : true si la personne peut utiliser ce produit (gratuit, acheté, ou membre du Cercle) */
  function aAcces(cle) {
    if (!estPayant(cle)) return Promise.resolve(true);
    return chargerAcces().then(function (a) { return !!(a && (a.tout || a.pass || a.produits[cle])); });
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
  /* le Pass (ou Le Cercle, qui le contient) : l'appli « Ma spirale », Mon mois, l'agenda */
  function pass() { return chargerAcces().then(function (a) { return !!(a && (a.tout || a.pass)); }, function () { return false; }); }
  /* Ma spirale (pass.html) : seulement avec le Pass. Le Cercle est une autre offre et ne l'inclut pas (décision du 25 octobre 2026). La propriétaire (admin) y a accès pour relire. */
  function spirale() { return chargerAcces().then(function (a) { return !!(a && (a.pass || a.admin)); }, function () { return false; }); }
  /* Le suivi par étapes (cycle 2) : le parcours suit le mois d'abonnement, pas le mois du calendrier.
     Mois d'abonnement compté depuis acces_premium.cree_le, mois 1 le premier mois (même calcul que v_mois dans
     outils-internes/supabase-seances.sql et que moisDepuis() dans mes-seances.js). Étape en cours = min(mois, 12).
     Requête à part (la règle « membre » ci-dessus reste intacte) : en cas d'échec, null, et le suivi garde le calendrier.
     Promise<null | { mois, enCours, debloquees, fichier, debut, calendaire }> ; fichier = 'AAAA-MM' du suivi de l'étape ;
     calendaire = vrai si ce fichier est celui du mois du calendrier (alors les dates restent celles du calendrier).
     Relecture de la propriétaire : si sa ligne acces_premium a offre = 'admin' (mise à la main dans le Table Editor), les 12 étapes sont débloquées (admin: true).
     Aucune adresse dans le code : chaque compte ne lit que sa propre ligne (règle RLS « lire son acces »), donc rien ne s'ouvre pour les autres comptes. */
  var ETAPES_SUIVI = ['2026-10', '2026-11', '2026-12', '2027-01', '2027-02', '2027-03', '2027-04', '2027-05', '2027-06', '2027-07', '2027-08', '2027-09'];
  var monEtape = null;
  function etape() {
    if (monEtape) return monEtape;
    monEtape = membre().then(function (m) {
      if (!m) return null;
      return session().then(function (x) {
        if (!x) return null;
        return fetch(SB_BASE + '/rest/v1/acces_premium?select=offre,valide_jusqu,cree_le', { headers: { apikey: SB_CLE, Authorization: 'Bearer ' + x.access_token } })
          .then(function (r) { return r.ok ? r.json() : []; }).catch(function () { return []; })
          .then(function (l) {
            var n = new Date(), a = (l || []).filter(function (z) { return z.valide_jusqu && new Date(z.valide_jusqu) > n && z.cree_le; })
              .sort(function (p, q) { return new Date(q.valide_jusqu) - new Date(p.valide_jusqu); })[0];
            if (!a) return null;
            var d = new Date(a.cree_le), mo = (n.getFullYear() - d.getFullYear()) * 12 + (n.getMonth() - d.getMonth());
            if (n.getDate() < d.getDate()) mo--;
            mo = Math.max(0, mo) + 1;
            var e = Math.min(mo, 12), deb = new Date(d.getFullYear(), d.getMonth() + e - 1, d.getDate());
            var actuel = n.getFullYear() + '-' + ('0' + (n.getMonth() + 1)).slice(-2), f = ETAPES_SUIVI[e - 1];
            var admin = a.offre === 'admin';
            return { mois: mo, enCours: e, debloquees: admin ? 12 : e, admin: admin, fichier: f, calendaire: false,   /* chaque membre a son propre calendrier : sa semaine 1 commence le jour de son inscription (avant : le 1er du mois quand l'étape tombait sur le mois en cours) */
              debut: deb.getFullYear() + '-' + ('0' + (deb.getMonth() + 1)).slice(-2) + '-' + ('0' + deb.getDate()).slice(-2) };
          });
      });
    }).catch(function () { return null; });
    monEtape.then(function (x) { if (!x) monEtape = null; });
    return monEtape;
  }
  /* Quel fichier ouvrir ? Même règle pour Mon suivi (mon-suivi-mois.html, dossier assets/suivi/) et Mon carnet (mon-carnet.html, dossier assets/carnets/) :
     - ?mois=AAAA-MM (et &apercu) : le fichier de ce mois du calendrier (vérifications de Laura).
     - Membre du Cercle : le parcours suit son mois d'abonnement (etape() ci-dessus). Étape 1 = le fichier 2026-10 … étape 12 = 2027-09.
       Sans paramètre, l'étape en cours ; ?etape=N ouvre une étape déjà débloquée (toutes avec &apercu, ou pour l'offre 'admin').
       Les réponses restent liées au fichier (même clé qu'avant). Le carnet et le suivi d'une même personne sont donc toujours à la même étape.
     - Visiteur : comme avant, le plus récent déjà paru.
     L'étape est donnée au moteur (assets/mon-carnet.js) dans window.GENESOLIA_ETAPE :
     { n: numéro de ce fichier dans le parcours, enCours, debloquees, debut: 'AAAA-MM-JJ' si les semaines suivent le début de l'étape (sinon le calendrier) } */
  function ouvrirParEtapes(o) {
    var DISPONIBLES = ETAPES_SUIVI.concat(['2027-10']), ETAPES = ETAPES_SUIVI;   /* les fichiers déjà écrits (AAAA-MM.js) */
    var d = new Date(), actuel = d.getFullYear() + '-' + (d.getMonth() < 9 ? '0' : '') + (d.getMonth() + 1);
    var Q = new URLSearchParams(location.search), m = Q.get('mois'), et = parseInt(Q.get('etape'), 10);
    var apercu = /[?&]apercu\b/.test(location.search);   /* ?apercu : lire les mois à venir (relecture) */
    var demande = DISPONIBLES.indexOf(m) >= 0, mDemande = m;
    function V(s) { return window.genesoliaVersion ? window.genesoliaVersion(s) : s; }   /* ?v=… (assets/version.js) */
    function parDefaut() { return DISPONIBLES.filter(function (x) { return x <= actuel; }).pop() || DISPONIBLES[0]; }
    if (demande && m > actuel && !apercu) m = parDefaut();
    function charger(src, ok) { var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = function () { document.getElementById('carnet').innerHTML = '<p class="mc-chargement">' + o.erreur + '</p>'; }; document.body.appendChild(s); }
    function ouvrir() { charger(V(o.dossier + m + '.js'), function () { var plus = document.createElement('script'); plus.src = V('assets/plus/' + m + '.js'); plus.onload = plus.onerror = function () { charger(V('assets/mon-carnet.js'), function () {}); }; document.body.appendChild(plus); }); }
    function choisir(info) {
      var n;
      if (info) {
        if (info.admin && demande) m = mDemande;   /* la propriétaire relit aussi les mois à venir sans &apercu */
        if (!demande) { n = et >= 1 && et <= (apercu ? 12 : info.debloquees) ? et : info.enCours; m = ETAPES[n - 1]; }
        n = ETAPES.indexOf(m) + 1;
        if (n) window.GENESOLIA_ETAPE = { n: n, enCours: info.enCours, debloquees: apercu ? 12 : info.debloquees, debut: n === info.enCours && !info.calendaire && !demande ? info.debut : null };
      } else {
        if (!demande) m = apercu && et >= 1 && et <= 12 ? ETAPES[et - 1] : parDefaut();
        n = ETAPES.indexOf(m) + 1;
        if (apercu && n) window.GENESOLIA_ETAPE = { n: n, enCours: n, debloquees: 12, debut: null };
      }
      ouvrir();
    }
    var fait = false;
    function une(info) { if (fait) return; fait = true; choisir(info); }
    setTimeout(function () { une(null); }, 6000);   /* filet : la page s'ouvre quoi qu'il arrive */
    ((window.GenesoliaAcces && window.GenesoliaAcces.etape) || etape)().then(une, function () { une(null); });
  }
  /* Boutons de paiement [data-payer="clé"] : lien Stripe de GENESOLIA_STRIPE, avec l'id du compte (client_reference_id) pour que
     la fonction Supabase « stripe-webhook » ouvre le bon accès. Sans compte : création du compte d'abord. Lien vide : « Bientôt disponible ». */
  function payer(cle, el) {
    if (!(window.GENESOLIA_STRIPE || {})[cle]) {
      var txt = (el && el.getAttribute('data-bientot-texte')) || 'Bientôt disponible.';
      var zoneMsg = el && el.closest('div,section,form') && el.closest('div,section,form').querySelector('[data-bientot-msg]');
      if (zoneMsg) zoneMsg.textContent = txt;
      else if (el && !(el.nextElementSibling && el.nextElementSibling.classList.contains('tf-note'))) { var n = document.createElement('p'); n.className = 'tf-note'; n.setAttribute('role', 'status'); n.textContent = txt; el.after(n); }
      return;
    }
    if (!aUnCompte()) { demanderCompte('ton abonnement'); return; }
    chargerAcces().then(function (a) {
      var l = lienPaiement(cle, a);
      if (l) location.href = l; else demanderCompte('ton abonnement');
    });
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-payer]'); if (!el) return;
    e.preventDefault(); payer(el.getAttribute('data-payer'), el);
  });
  window.GenesoliaAcces = { payant: estPayant, verifier: aAcces, proposer: proposerAchat, produit: produit, membre: membre, pass: pass, spirale: spirale, etape: etape, etapesSuivi: ETAPES_SUIVI, ouvrirParEtapes: ouvrirParEtapes, payer: payer };
  /* Membres du Cercle : plus d'encart « carnet offert » ni de petit carré ; à la place, le lien vers leurs deux livres du mois */
  /* Membre qui arrive sur la page de vente (lien « Le Cercle » resté de sa visite avant connexion) : direct dans son espace. ?voir=1 pour relire la page. */
  if (page === 'abonnement.html' && aUnCompte() && !/[?&]voir=1\b/.test(location.search)) membre().then(function (m) { if (m) location.replace('cercle.html'); });
  /* Lien « Le Cercle » du menu cliqué après une connexion faite sur la même page : on vérifie au clic */
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a[href="abonnement.html"]');
    if (!a || window.GenesoliaMembre || !aUnCompte() || ev.metaKey || ev.ctrlKey) return;
    ev.preventDefault();
    membre().then(function (m) { location.href = m ? 'cercle.html' : 'abonnement.html'; }, function () { location.href = 'abonnement.html'; });
  });
  if (aUnCompte()) membre().then(function (m) {
    if (!m) return;
    window.GenesoliaMembre = true;
    /* Membre : dans le menu du site, « Le Cercle » (la page de vente) devient « Mon Cercle », son espace (cercle.html : même barre que l'appli). Invisible pour les autres. */
    document.querySelectorAll('.entete .menu a.btn-plein[href="abonnement.html"]').forEach(function (b) { b.href = 'cercle.html'; b.textContent = 'Mon Cercle'; b.classList.add('btn-mon-cercle'); });
    /* Membre : en bas de chaque page du site, c'est l'appli Le Cercle qu'on propose (sauf si elle est déjà installée) */
    document.querySelectorAll('.pied .pied-appli').forEach(function (b) { if (cercleInstalle) b.remove(); else b.outerHTML = piedAppliCercle(); });   /* appli Le Cercle déjà installée : plus rien à proposer */
    document.querySelectorAll('.carre-cercle').forEach(function (c) { c.remove(); });
    document.querySelectorAll('.cadeau:not(.encart-formation):not(.encart-livres)').forEach(function (bloc, n) {
      if (n > 0) { bloc.remove(); return; }
      bloc.classList.add('encart-livres');
      bloc.innerHTML = '<div class="cadeau-texte"><p class="ef-sur">Le Cercle · ton mois</p><h2>Ton étape du mois t’attend</h2>' +
        '<p>Ton carnet « Renaissance » pour construire ce que tu veux, ton livret « Libération » pour déposer ce qui se rejoue. Ils avancent ensemble, semaine après semaine.</p>' +
        '<p class="el-boutons"><a class="btn btn-plein" href="mon-carnet.html">Mon carnet « Renaissance »</a> <a class="btn btn-trait" href="mon-suivi-mois.html">Mon livret « Libération »</a></p></div>';
    });
  });

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

/* Avis publiés (Supabase, fonction « avis ») : window.GenesoliaAvis(cb) et blocs [data-avis-publies] */
(function () {
  var URL_AVIS = 'https://qsvzzkjtjsznfntahvvh.supabase.co/functions/v1/avis', attente = null;
  window.GenesoliaAvis = function (cb) {
    if (!attente) attente = fetch(URL_AVIS).then(function (r) { return r.ok ? r.json() : { avis: [] }; }).catch(function () { return { avis: [] }; })
      .then(function (r) { return (r && r.avis || []).map(function (a) { return { texte: a.texte, qui: a.prenom + (a.age ? ', ' + a.age + ' ans' : '') + (a.ville ? ' · ' + a.ville : '') }; }); });
    attente.then(cb);
  };
  var blocs = document.querySelectorAll('[data-avis-publies]');
  if (!blocs.length) return;
  var esc = function (s) { return String(s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  window.GenesoliaAvis(function (liste) {
    if (!liste.length) return;
    blocs.forEach(function (b) {
      var n = +b.getAttribute('data-avis-publies') || 3, zone = b.querySelector('[data-avis-liste]') || b;
      zone.innerHTML = liste.slice(0, n).map(function (a) { return '<figure><blockquote>« ' + esc(a.texte) + ' »</blockquote><figcaption>' + esc(a.qui) + '</figcaption></figure>'; }).join('');
      b.hidden = false;
    });
  });
})();

/* ===== Prix en dollars canadiens (Québec, Canada) =====
   Par défaut en euros ; en dollars canadiens si le fuseau horaire de l'appareil est au Canada, ou si la personne le choisit
   (choix gardé sur l'appareil). Aucune localisation par adresse IP.
   Montants calculés pour que le net reçu soit le même qu'avec une carte européenne : frais Stripe cartes internationales
   (3,15 % + 0,25 €) et conversion (2 %) inclus, au taux du 21/10/2026 (1 € = 1,58 $ CA), arrondis vers le haut. À revoir tous les 3 mois.
   Seules les pages qui parlent des offres sont converties ; l'arbre imprimé reste en euros (livraison en France). */
(function () {
  var PAGES = ['espace-praticien.html', 'praticien.html', 'abonnement.html', 'tarifs.html', 'essai.html', 'login.html', 'mon-suivi.html', 'index.html', '', 'la-demarche.html', 'mon-mois.html', 'mon-guide.html', 'cercle.html', 'seance-offerte.html', 'genosociogramme.html', 'parcours.html'];
  var CAD = { '9': '16', '12': '21', '15': '26', '29': '49', '24': '40', '249': '419', '10': '17', '27': '45', '24,90': '41', '60': '108', '99': '169', '20,75': '34,92', '19': '32', '240': '400', '190': '320', '0': '0' };   /* 19 et 240 : Espace praticien */
  var CLE = 'genesolia-devise';
  var page = location.pathname.split('/').pop();
  function auCanada() { try { return /^America\/(Toronto|Montreal|Vancouver|Edmonton|Winnipeg|Regina|Halifax|St_Johns|Moncton|Glace_Bay|Goose_Bay|Whitehorse|Dawson|Dawson_Creek|Yellowknife|Iqaluit|Rankin_Inlet|Resolute|Cambridge_Bay|Inuvik|Swift_Current|Fort_Nelson|Creston|Atikokan|Blanc-Sablon|Nipigon|Thunder_Bay|Rainy_River|Pangnirtung)$/.test(Intl.DateTimeFormat().resolvedOptions().timeZone); } catch (e) { return false; } }
  function devise() { var d = null; try { d = localStorage.getItem(CLE); } catch (e) {} return d === 'cad' || d === 'eur' ? d : (auCanada() ? 'cad' : 'eur'); }
  window.GenesoliaDevise = { actuelle: devise, choisir: function (d) { try { localStorage.setItem(CLE, d); } catch (e) {} location.reload(); } };
  var actif = devise() === 'cad' && PAGES.indexOf(page) >= 0;
  function convertir(n) {
    var t = n.nodeValue; if (!/€/.test(t)) return;
    var u = t.replace(/moins d[’']\s?1[\s  ]?€/g, 'moins de 2 $ CA')
      .replace(/(\d+(?:,\d+)?)[\s  ]?€/g, function (m, x) { return CAD[x] ? CAD[x] + ' $ CA' : m; });
    if (u !== t) n.nodeValue = u;
  }
  function parcourir(r) {
    if (!r) return;
    if (r.nodeType === 3) { convertir(r); return; }
    if (r.nodeType !== 1 || /^(SCRIPT|STYLE|TEXTAREA|INPUT)$/.test(r.nodeName) || (r.closest && r.closest('[data-garder-euros]'))) return;
    var w = document.createTreeWalker(r, NodeFilter.SHOW_TEXT, null), n;
    while ((n = w.nextNode())) { if (n.parentNode && !/^(SCRIPT|STYLE|TEXTAREA)$/.test(n.parentNode.nodeName) && !(n.parentNode.closest && n.parentNode.closest('[data-garder-euros]'))) convertir(n); }
  }
  function choix() {
    var d = devise();
    return '<span class="devise-choix" role="group" aria-label="Devise des prix"><button type="button" data-devise="eur" aria-pressed="' + (d === 'eur') + '">€</button><button type="button" data-devise="cad" aria-pressed="' + (d === 'cad') + '">$ CA</button></span>';
  }
  function demarrer() {
    /* le choix de devise, en bas de chaque page et en haut des tarifs */
    var pb = document.querySelector('.pied-bas');
    if (pb && !pb.querySelector('.devise-choix')) { var s = document.createElement('span'); s.className = 'devise-pied'; s.innerHTML = 'Prix affichés en ' + choix(); pb.appendChild(s); }
    document.querySelectorAll('[data-devise-ici]').forEach(function (z) {
      z.innerHTML = choix() + (devise() === 'cad' ? '<span class="devise-note">Prix en dollars canadiens, conversion et frais bancaires inclus.</span>' : '<span class="devise-note">Tu es au Québec ou au Canada ? Affiche les prix en dollars canadiens.</span>');
    });
    document.addEventListener('click', function (e) { var b = e.target.closest('[data-devise]'); if (b) window.GenesoliaDevise.choisir(b.getAttribute('data-devise')); });
    if (!actif) return;
    document.documentElement.classList.add('prix-cad');
    parcourir(document.body);
    if ('MutationObserver' in window) new MutationObserver(function (l) { l.forEach(function (m) { if (m.type === 'characterData') convertir(m.target); else m.addedNodes.forEach(parcourir); }); }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer); else setTimeout(demarrer, 0);
})();

/* Connexion en deux étapes : un compte qui l'a activée et dont la session n'est pas encore confirmée (aal1) doit taper son code.
   Vérification locale (le jeton de session), sans appel réseau ; la fenêtre du code ne s'ouvre que si c'est nécessaire. */
(function () {
  function aVerifier() {
    try {
      var s = JSON.parse(localStorage.getItem('sb-qsvzzkjtjsznfntahvvh-auth-token') || 'null');
      if (!s || !s.access_token || !s.user) return false;
      var f = (s.user.factors || []).some(function (x) { return x.status === 'verified'; }); if (!f) return false;
      var p = JSON.parse(decodeURIComponent(escape(atob(s.access_token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))));
      return p.aal !== 'aal2';
    } catch (e) { return false; }
  }
  function lancer() {
    if (!aVerifier() || !window.supabase) return;
    function go() {
      var sb = window.supabase.createClient('https://qsvzzkjtjsznfntahvvh.supabase.co', 'sb_publishable_6iEVxXmtB_u1hJ6mPS9fNg_CJhLjYkg');
      window.GenesoliaDeuxEtapes.verifier(sb).then(function () { setTimeout(function () { if (!aVerifier()) location.reload(); }, 400); });   /* jamais de boucle : on ne recharge que si la session est bien confirmée */
    }
    if (window.GenesoliaDeuxEtapes) go();
    else { var sc = document.createElement('script'); sc.src = 'assets/deux-etapes.js?v=1'; sc.onload = go; document.head.appendChild(sc); }
  }
  if (document.readyState === 'complete') lancer(); else window.addEventListener('load', lancer);
})();

/* Les livres Genesolia partout sur le site :
   - en bas de chaque page (avant l'encart offert), un encart publicitaire : « L'enquête de ma lignée » sur les articles de la lignée,
     « Racines » sur les pages du Cercle, les deux livres ailleurs ;
   - sur la page d'accueil, un bandeau juste sous l'ouverture.
   Jamais dans les applis (Le Cercle, Pro), le questionnaire, la connexion, l'espace membre, les pages légales ni sur les pages des livres. */
(function () {
  var page = location.pathname.split('/').pop() || 'index.html';
  var L = window.GENESOLIA_LIVRES || {}; if (!L.enquete || !L.racines) return;
  var app = document.documentElement.classList.contains('appli'), dr = '';
  try { dr = sessionStorage.getItem('genesolia-appli') || ''; } catch (e) {}
  if (app || dr === 'pro') return;
  var SANS = ['pro.html', 'praticien.html', 'praticien-partage.html', 'espace-praticien.html', 'conditions-praticien.html', 'questionnaire.html', 'login.html', 'code.html',
    'essai.html', 'bienvenue.html', 'merci-arbre.html', 'desinscription.html', 'offline.html', 'cercle.html', 'appli.html', 'mon-document.html',
    'mon-carnet.html', 'mon-suivi.html', 'mon-suivi-mois.html', 'mon-module.html', 'mon-mois.html', 'mon-guide.html', 'mes-seances.html', 'point-de-depart.html',
    'autel-de-saison.html', 'mode-emploi-suivi.html', 'arbre-de-vie-affiche.html', 'question-du-mois.html',
    'cgv.html', 'mentions-legales.html', 'confidentialite.html', 'conditions-utilisation.html',
    'livres.html', 'racines.html', 'enquete-de-ma-lignee.html', 'boutique.html', 'pass.html'];
  if (SANS.indexOf(page) >= 0) return;
  var THEMES = {
    'memoire-transgenerationnelle.html': 'la mémoire transgénérationnelle', 'syndrome-anniversaire.html': 'le syndrome d’anniversaire',
    'deuil-non-fait-mort-jeune.html': 'les deuils non faits', 'enfant-de-remplacement.html': 'l’enfant de remplacement',
    'projet-sens-conception-deuil.html': 'le projet-sens', 'jumeau-perdu.html': 'le jumeau perdu', 'secret-de-famille.html': 'les secrets de famille',
    'loyaute-familiale-invisible.html': 'les loyautés invisibles', 'prenom-transmis-psychogenealogie.html': 'le prénom transmis',
    'place-dans-la-fratrie.html': 'la place dans la fratrie', 'filles-garcons-fratrie.html': 'la place dans la fratrie', 'implexe-mariage-entre-cousins.html': 'les ancêtres communs',
    'guerre-et-memoire-familiale.html': 'la guerre et l’exil', 'argent-et-lignee.html': 'l’argent dans la lignée', 'peur-de-manquer-d-argent.html': 'la peur de manquer',
    'metiers-transmis-genealogie.html': 'les métiers transmis', 'schemas-repetitifs-en-amour.html': 'les schémas en amour', 'blessures-de-l-ame.html': 'les cinq blessures de l’âme',
    'masques-des-5-blessures.html': 'les cinq blessures de l’âme', 'reves-recurrents-et-memoire-familiale.html': 'les rêves qui reviennent', 'toussaint-ancetres-et-deuils.html': 'honorer ses ancêtres',
    'fil-d-or.html': '', 'comment-faire-son-genosociogramme.html': '', 'questions-a-poser-a-sa-famille.html': '', 'psychogenealogie.html': '', 'heriter.html': '',
    'symboles-genosociogramme.html': '', 'exemple-genosociogramme.html': '', 'genosociogramme-vierge.html': '', 'annuaire.html': ''
  };
  var CERCLE = ['abonnement.html', 'tarifs.html', 'formation.html', 'parcours.html', 'methode.html', 'la-demarche.html', 'seance-offerte.html', 'dependance-affective.html', 'relation-floue.html'];
  if (!document.getElementById('livre-encart-css')) {
    var st = document.createElement('style'); st.id = 'livre-encart-css';
    st.textContent = '.livre-encart{display:grid;grid-template-columns:150px 1fr;gap:1.6rem;align-items:center;padding:1.6rem;border-radius:var(--rayon,22px);background:linear-gradient(140deg,#FBF4EA,#F3E4D6);border:1px solid #EBD3BC;box-shadow:0 12px 34px rgba(107,47,91,.08)}' +
      '.livre-encart.le-deux{grid-template-columns:300px 1fr}.le-couv{display:flex;justify-content:center;align-items:flex-end}.le-couv a{display:block}' +
      '.livre-encart img{width:150px;height:auto;display:block;filter:drop-shadow(0 14px 22px rgba(74,33,66,.22))}.le-deux .le-couv{gap:18px}.le-deux .le-couv img{width:135px}' +
      '.livre-encart .le-sur{font:700 .75rem var(--texte);letter-spacing:.14em;text-transform:uppercase;color:#9A6E38;margin:0 0 .3rem}' +
      '.livre-encart h2{font-size:clamp(1.4rem,3vw,1.9rem);margin:0 0 .5rem}.livre-encart p{margin:0 0 .9rem}.livre-encart .le-bt{display:flex;flex-wrap:wrap;gap:.5rem}' +
      '.livre-accueil{padding:1.6rem 0 .4rem}.livre-accueil .livre-encart{padding:1.3rem 1.6rem}' +
      '.livre-bientot{opacity:.7;cursor:default;pointer-events:none}' +
      '@media (max-width:680px){.livre-encart,.livre-encart.le-deux{grid-template-columns:1fr;text-align:center;padding:1.3rem}.livre-encart img{margin:0 auto;width:120px}.le-deux .le-couv img{width:110px}.livre-encart .le-bt{justify-content:center}.livre-encart .le-bt .btn{flex:1 1 100%;min-height:46px}}';
    document.head.appendChild(st);
  }
  function img(l, alt, cl) { return '<a href="' + l.page + '"><img src="' + l.image + '" width="543" height="900" alt="' + alt + '" loading="lazy"></a>'; }
  function deux(sur, titre, texte) {
    return '<div class="livre-encart le-deux"><div class="le-couv">' + img(L.enquete, 'Le livre L’enquête de ma lignée') + img(L.racines, 'Le livre Racines') + '</div>' +
      '<div><p class="le-sur">' + sur + '</p><h2>' + titre + '</h2><p>' + texte + '</p>' +
      '<div class="le-bt"><a class="btn btn-plein" href="livres.html">Découvrir les livres</a><a class="btn btn-trait" href="' + L.enquete.extrait + '" download>Lire les premières pages offertes</a><a class="btn btn-trait" href="boutique.html">Idées à offrir</a></div></div></div>';
  }
  var html;
  if (page in THEMES) {
    var t = THEMES[page];
    html = '<div class="livre-encart">' + img(L.enquete, 'Le livre L’enquête de ma lignée') +
      '<div><p class="le-sur">Le livre · à remplir en famille</p><h2>L’enquête de ma lignée</h2>' +
      '<p>' + (t ? 'Tout ce que tu viens de lire sur ' + t + ', expliqué pas à pas parmi 18 thèmes, ' : '18 thèmes expliqués, ') + 'avec ton arbre sur 5 générations, des entretiens guidés pour recueillir le ressenti de chacun et le fil d’or pour voir ce qui se répète.</p>' +
      '<div class="le-bt"><a class="btn btn-plein" href="' + L.enquete.page + '">Découvrir le livre</a><a class="btn btn-trait" href="' + L.enquete.extrait + '" download>Lire les premières pages</a><a class="btn btn-trait" data-livre-acheter="enquete" href="' + L.enquete.page + '">Acheter</a></div></div></div>';
  } else if (CERCLE.indexOf(page) >= 0) {
    html = '<div class="livre-encart">' + img(L.racines, 'Le livre Racines') +
      '<div><p class="le-sur">Le livre · Le Cercle, livre 1</p><h2>Racines, sur papier</h2>' +
      '<p>Les exercices du Cercle en version papier. Trois mois pour sortir de l’alerte, déposer l’armure et prendre toute ta place : un cahier à écrire, un petit rendez-vous chaque jour, avec exercices, rituels et méditations.</p>' +
      '<div class="le-bt"><a class="btn btn-plein" href="' + L.racines.page + '">Découvrir Racines</a><a class="btn btn-trait" href="' + L.racines.page + '#feuilleter">Feuilleter quelques pages</a><a class="btn btn-trait" data-livre-acheter="racines" href="' + L.racines.page + '">Acheter</a></div></div></div>';
  } else if (page === 'index.html') {
    html = '';
  } else {
    html = deux('Les livres Genesolia', 'Ton histoire, sur papier', 'Deux livres à écrire, à ton rythme : <b>L’enquête de ma lignée</b>, à remplir en famille pour comprendre ce qui se transmet, et <b>Racines</b>, les exercices du Cercle en version papier, trois mois pour sortir de l’alerte et prendre ta place.');
  }
  var pied = document.querySelector('[data-pied]');
  if (html && pied) {
    var z = document.createElement('section'); z.className = 'bloc'; z.setAttribute('aria-label', 'Les livres Genesolia');
    z.innerHTML = '<div class="conteneur">' + html + '</div>';
    var avant = document.querySelector('.cadeau-bas') || pied;
    avant.parentNode.insertBefore(z, avant);
    if (window.GenesoliaLivresBoutons) window.GenesoliaLivresBoutons(z);
  }
  /* Page d'accueil : le bandeau des livres juste sous l'ouverture */
  var ouv = page === 'index.html' && document.querySelector('main > .ouverture');
  if (ouv) {
    var b = document.createElement('section'); b.className = 'livre-accueil'; b.setAttribute('aria-label', 'Les livres Genesolia');
    b.innerHTML = '<div class="conteneur">' + deux('Nouveau · les livres Genesolia', 'Ton histoire de famille, sur papier', 'À écrire seul·e ou en famille : <b>L’enquête de ma lignée</b> pour rassembler ton histoire et voir ce qui se répète, et <b>Racines</b>, les exercices du Cercle en version papier, pour sortir de l’alerte et prendre ta place. Les premières pages sont offertes.') + '</div>';
    ouv.parentNode.insertBefore(b, ouv.nextSibling);
  }
})();
