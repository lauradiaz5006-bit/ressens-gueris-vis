/* Genesolia · l'appli du Pass, « Ma spirale » (pass.html ; anciennement « Mon enquête »).
   Quatre espaces liés, en bas sur téléphone et à gauche sur ordinateur :
   1. Moi (#)            : tes repères (astro et nombres), ta base (arbre ou fil d'or), « je dépose un ressenti », tes fils en cours.
   2. Mon fil d'or (#fil): ta base (ton fil d'or et ce qui se répète dans ton arbre) et chaque ressenti devenu un fil à suivre :
                           Voir → À qui ça appartient (moi ou ma lignée, racine ou cœur) → Enquêter → Libérer → La spirale.
   3. Mon agenda (#agenda): les dates de la lignée, les dates qui reviennent, les échos d'âge, les lunes, tes jours personnels,
                           tes ressentis, tes libérations, tes notes et tes rappels (.ics).
   4. Mon bilan (#bilan) : ta lignée en sphères, avec le lien que tu ressens (cercle de lumière : paix ; orange : mitigé),
                           les peurs partagées, les loyautés, et tout ton chemin.
   Données :
   - l'arbre : table arbres (avec « lecture » : ce qui se répète, gardé par genosociogramme.js), sinon cet appareil (geno4) ;
   - le fil d'or : coffre « fil-d-or » (sinon cet appareil) ; un ressenti peut y être ajouté (dans « toi ») ;
   - les repères de naissance : reperes (sinon la fiche « moi » de l'arbre) ;
   - l'enquête (ressentis, liens, notes, rappels) : coffre chiffré « enquete » si la personne a donné son accord,
     sinon seulement sur cet appareil. Genesolia ne lit jamais ces réponses.
   Accès : le Pass ou Le Cercle (GenesoliaAcces.pass). ?exemple : l'appli remplie avec la famille d'exemple. */
(function () {
  'use strict';
  var SB_URL = 'https://qsvzzkjtjsznfntahvvh.supabase.co', SB_KEY = 'sb_publishable_6iEVxXmtB_u1hJ6mPS9fNg_CJhLjYkg';
  var sb = null; try { sb = window.supabase.createClient(SB_URL, SB_KEY); } catch (e) {}
  var PISTES = window.PASS_ENQUETE || [], QUESTIONS = window.PASS_QUESTIONS || [], PF = window.PASS_FIL || {}, N = window.Numerologie, A = window.Astronomy;
  var EXEMPLE = /[?&]exemple\b/.test(location.search);
  /* Le lien test (avant l'ouverture du Pass) : pass.html?test=k7q3-spirale, ouvert avec un compte connecté.
     Il marque le compte (user_metadata.spirale_test) : ensuite Ma spirale s'ouvre sur tous ses appareils, avec sa vraie sauvegarde.
     Rien à voir avec Le Cercle : ni son accès, ni son essai ne changent. */
  var CODE_TEST = 'k7q3-spirale', LIEN_TEST = new RegExp('[?&]test=' + CODE_TEST + '\\b').test(location.search);
  /* pas encore connectée : le lien est retenu sur cet appareil le temps de la connexion (login.html ne garde que « pass.html ») */
  try { if (LIEN_TEST) localStorage.setItem('genesolia-spirale-test', '1'); else if (localStorage.getItem('genesolia-spirale-test') === '1') LIEN_TEST = true; } catch (e) {}
  var vue = document.getElementById('pa-vue');
  /* Installée sur l'écran d'accueil : Ma spirale seule, sans l'en-tête du site */
  var AUTONOME = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  if (AUTONOME) document.documentElement.classList.add('pa-autonome');
  var D = { user: null, acces: false, arbre: null, fil: null, naissance: null, prenoms: '', nom: '', prenom: '', etat: null, accord: false, cercle: false, pro: false };
  var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  var JS = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'];
  var EVT = { deuil: 'un deuil', 'deces-precoce': 'un départ trop tôt', rupture: 'une séparation', abandon: 'un abandon', secret: 'un secret', guerre: 'une guerre ou un exil', demenagement: 'un départ, un déracinement', pauvrete: 'un manque d’argent', faillite: 'une perte de biens', heritage: 'un héritage difficile', 'perte-emploi': 'une perte de travail', ascension: 'une ascension', declassement: 'un déclassement', 'hors-mariage': 'une naissance hors mariage', maladie: 'une épreuve', sacrifice: 'un effacement', trahison: 'une trahison', injustice: 'une injustice', honte: 'une honte', mariage: 'un mariage', naissance: 'une naissance', reussite: 'une réussite' };
  var ETAPES = PF.ETAPES || [];

  function esc(t) { return String(t == null ? '' : t).replace(/ ([?!:;»])/g, '\u00a0$1').replace(/« /g, '«\u00a0').replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }   /* espaces insécables avant ? ! : ; » */
  function lireL(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function ecrireL(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function iso(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function cap(t) { t = String(t || ''); return t.charAt(0).toUpperCase() + t.slice(1); }
  function prenom1(p) { return String((p && p.prenom) || '').trim().split(/\s+/)[0] || 'Quelqu’un'; }
  function dateComplete(t) { var m = String(t || '').match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? { a: +m[1], m: +m[2], j: +m[3] } : null; }
  function dateCourte(k) { var d = dateComplete(k); return d ? d.j + ' ' + MOIS[d.m - 1] + ' ' + d.a : ''; }
  function ageNum(s) { var m = String(s || '').match(/\d{1,3}/); return m ? +m[0] : null; }
  function liste(l) { return l.length < 2 ? l.join('') : l.slice(0, -1).join(', ') + ' et ' + l[l.length - 1]; }

  /* ───── L'état : ressentis, liens, notes et rappels ───── */
  var CLE = 'genesolia-enquete', minuteur = null;
  function etatVide() { return { v: 2, ressentis: [], liens: {}, notes: {}, rappels: {} }; }
  function completer(e) {
    e = e || etatVide();
    e.v = 2; e.ressentis = Array.isArray(e.ressentis) ? e.ressentis : []; e.liens = e.liens || {}; e.notes = e.notes || {}; e.rappels = e.rappels || {};
    return e;
  }
  function sauver() {
    if (EXEMPLE) return;
    ecrireL(CLE, D.etat);
    clearTimeout(minuteur);
    marque('Enregistrement…');
    minuteur = setTimeout(function () {
      if (!(sb && D.user && D.accord)) { marque(texteSauve()); return; }
      window.GenesoliaCoffre.ecrire(sb, D.user, 'enquete', D.etat).then(function (r) { marque(r && r.error ? 'Pas encore enregistré dans ton espace : réessaie dans un instant.' : 'Gardé dans ton espace, chiffré.'); }, function () { marque('Pas encore enregistré dans ton espace : réessaie dans un instant.'); });
    }, 700);
  }
  /* Où est gardée l'enquête : dans l'espace, chiffrée (avec l'accord), jamais seulement dans le navigateur pour une cliente connectée */
  function texteSauve() { return EXEMPLE ? 'Exemple : rien n’est enregistré.' : D.accord ? 'Gardé dans ton espace, chiffré. Genesolia ne le lit pas.' : 'Pas encore gardé dans ton espace : donne ton accord en haut de la page.'; }
  function flush() { if (minuteur && sb && D.user && D.accord && !EXEMPLE) { clearTimeout(minuteur); minuteur = null; window.GenesoliaCoffre.ecrire(sb, D.user, 'enquete', D.etat); } }
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') flush(); });
  window.addEventListener('pagehide', flush);
  function marque(t) { document.querySelectorAll('[data-sauve]').forEach(function (z) { z.textContent = t; }); }
  /* Le bouton « Enregistrer » : tout de suite, puis « C'est gardé » dans le pied de la fenêtre */
  function msgPied(t, ok, accord) { document.querySelectorAll('[data-sauve-f]').forEach(function (z) { z.innerHTML = esc(t) + (accord ? '<br><button type="button" class="pa-bt or" data-accord>J’accepte, garder mes notes</button>' : ''); z.classList.toggle('ok', !!ok); }); }
  function sauverMaintenant(fin) {
    var dit = function (t, ok, ac) { msgPied(t, ok, ac); if (fin) fin(t); };
    if (EXEMPLE) return dit('C’est gardé pour cette visite (exemple : rien n’est enregistré).', true);
    ecrireL(CLE, D.etat); clearTimeout(minuteur); minuteur = null;
    if (D.fil) sauverFil(true);
    if (!(sb && D.user && D.accord)) return dit('Pas encore gardé dans ton espace : il nous faut ton accord une fois.', false, !!(sb && D.user));
    msgPied('Enregistrement…');
    window.GenesoliaCoffre.ecrire(sb, D.user, 'enquete', D.etat).then(function (r) { if (r && r.error) dit('Pas encore enregistré : réessaie dans un instant.'); else { dit('C’est gardé.', true); marque(texteSauve()); } }, function () { dit('Pas encore enregistré : réessaie dans un instant.'); });
  }
  /* L'accord pour garder l'enquête dans l'espace (chiffrée) */
  function donnerAccord(acb) {
    if (!(sb && D.user)) return; acb.disabled = true;
    sb.auth.updateUser({ data: { coffre_accord: new Date().toISOString() } }).then(function (r) {
      if (r && r.error) { acb.disabled = false; return; }
      D.accord = true; D.user.user_metadata = Object.assign({}, D.user.user_metadata, { coffre_accord: new Date().toISOString() });
      if (document.querySelector('.pa-feuille')) { sauverMaintenant(); document.querySelectorAll('.pa-accord').forEach(function (x) { x.remove(); }); } else { sauver(); if (D.fil) sauverFil(true); rafraichir(); }
    });
  }
  document.addEventListener('click', function (e) {
    var acb = e.target.closest('[data-accord]'); if (acb) { donnerAccord(acb); return; }
    var rs = e.target.closest('[data-respirer]'); if (rs) { respirer(rs.closest('.pa-resp')); return; }
  });

  /* ───── Le chargement ───── */
  function charger() {
    if (EXEMPLE) return chargerExemple();
    if (!sb) return Promise.resolve();
    return sb.auth.getSession().then(function (r) {
      var s = r && r.data && r.data.session; D.user = s ? s.user : null;
      if (!D.user) return;
      D.accord = !!(window.GenesoliaCoffre && window.GenesoliaCoffre.accord(D.user));
      var C = window.GenesoliaCoffre, GA = window.GenesoliaAcces || {};
      return Promise.all([
        GA.spirale ? GA.spirale() : GA.pass ? GA.pass() : Promise.resolve(false),
        sb.from('arbres').select('data').eq('user_id', D.user.id).maybeSingle().then(function (x) { return x && x.data ? x.data.data : null; }, function () { return null; }),
        C && D.accord ? C.lire(sb, D.user, 'fil-d-or').then(function (x) { return x && x.etat ? x.etat : null; }, function () { return null; }) : Promise.resolve(null),
        window.GenesoliaReperes ? window.GenesoliaReperes.lire(sb, D.user) : Promise.resolve(null),
        C && D.accord ? C.lire(sb, D.user, 'enquete').then(function (x) { return x; }, function () { return null; }) : Promise.resolve(null),
        GA.membre ? GA.membre() : Promise.resolve(false),
        sb.from('praticiens').select('user_id').eq('user_id', D.user.id).then(function (x) { return !!(x && x.data && x.data.length); }, function () { return false; })
      ]).then(function (x) {
        var meta = D.user.user_metadata || {};
        D.acces = !!x[0] || !!meta.spirale_test || LIEN_TEST;
        if (LIEN_TEST && !meta.spirale_test) sb.auth.updateUser({ data: { spirale_test: new Date().toISOString() } }).then(function (r) { if (!(r && r.error)) { try { localStorage.removeItem('genesolia-spirale-test'); } catch (e) {} } }, function () {});
        else if (meta.spirale_test) { try { localStorage.removeItem('genesolia-spirale-test'); } catch (e) {} }
        D.arbre = x[1] && x[1].people && Object.keys(x[1].people).length ? x[1] : lireL('geno4');
        D.fil = x[2] || lireL('genesolia-arbre-ressentis');
        if (x[3] && x[3].date) { D.naissance = x[3].date; D.prenoms = x[3].prenoms || ''; D.nom = x[3].nom || ''; D.prenom = x[3].prenom; }
        D.etat = completer(x[4] || lireL(CLE));
        D.cercle = !!x[5]; D.pro = !!x[6];
      });
    });
  }
  function chargerExemple() {
    D.acces = true; D.user = { id: 'exemple' }; D.prenom = 'Léa';
    return fetch('assets/exemple-genosociogramme.json').then(function (r) { return r.json(); }).then(function (a) {
      D.arbre = a;
      D.arbre.lecture = { reps: [{ type: 'anniversaire', label: 'Syndrome anniversaire : Hélène Durand', desc: 'Tu as 32 ans. Hélène Durand a vécu « séparation » à 32 ans, l’âge que tu as aujourd’hui.' }, { type: 'date', jm: '12/11', label: 'Une date qui revient : le 12 novembre', desc: 'naissance de Paul, décès de Marcel.' }, { type: 'schema', label: 'Des femmes qui s’effacent', desc: 'Hélène, Jeanne.' }] };
      D.fil = { personnes: { toi: { rel: 'toi', prenom: 'Léa', etapes: [{ age: '8', evt: 'Le départ de mon père', em: ['Tristesse'], bl: ['abandon'] }, { age: '31', evt: 'Ma séparation', em: ['Peur', 'Solitude'], bl: ['abandon'] }] }, m: { rel: '', prenom: 'Hélène', etapes: [{ age: '32', evt: 'Son divorce', em: ['Colère', 'Solitude'], bl: ['abandon'] }] }, mm: { rel: '', prenom: 'Jeanne', etapes: [{ age: '30', evt: 'Veuve avec trois enfants', em: ['Peur de manquer'], bl: [] }] } }, ordre: ['m', 'mm'] };
      var auj = new Date(), il = function (j) { return iso(new Date(auj.getTime() - j * 864e5)); };
      D.etat = completer({
        ressentis: [
          { id: 'r1', date: il(3), quoi: 'Mon amie a annulé notre week-end au dernier moment, je me suis sentie comme une petite fille laissée sur le quai.', em: ['Tristesse', 'Solitude'], bl: ['abandon'], force: 8, corps: ['La gorge'], revient: 'oui', ages: '8, 31', phrase: 'On finit toujours par me laisser', aqui: 'parent', qui: 'a:p2', cycle: 'coeur', nom: 'la mémoire d’abandon', etape: 2, enquete: { q: {} }, intuition: {} },
          { id: 'r2', date: il(40), quoi: 'Une angoisse en regardant mon compte en banque, alors que tout va bien.', em: ['Peur de manquer'], bl: [], force: 6, corps: ['Le ventre'], revient: 'oui', ages: '', phrase: 'L’argent ne dure jamais', aqui: 'loin', qui: 'a:p4', cycle: 'racine', nom: 'la mémoire de peur de manquer', etape: 4, libere: il(20), geste: 'Mettre 5 € de côté', gesteDate: il(19), enquete: { q: {} }, intuition: {} }
        ],
        liens: { 'a:p2': { t: 'mitige', peurs: ['Peur d’être abandonné·e'], loyaute: true, note: 'Beaucoup d’amour, et la même peur d’être quittée.' }, 'a:p4': { t: 'paix', peurs: ['Peur de manquer'] } }
      });
      D.etat.reves = [{ id: 'v1', date: il(5), texte: 'J’étais dans la maison de Jeanne, l’eau montait dans la cuisine et je cherchais ma valise.', types: ['symbole', 'lignee'], symboles: ['Maison', 'Eau', 'Perdre quelque chose'], em: ['Peur'], qui: ['a:p4'] }];
      var r2 = D.etat.ressentis[1]; r2.porte = 'lignee'; r2.intention = 'Je suis en sécurité. Je peux recevoir et garder.'; r2.intentionPosee = il(18); r2.vois = 'Je vois que la peur de manquer de Jeanne vit dans mon ventre.'; r2.voisDate = il(30); r2.roles = ['sauveur'];
      D.etat.schemas = [
        { id: 's1', cree: il(40), nom: 'la peur d’être quittée', cycle: 'coeur', blessure: 'abandon', domaines: ['Couple', 'Amis'], corps: ['La gorge'], sensation: ['Serré'], pensee: 'On finit toujours par me laisser', reactions: ['Tout donner', 'Me taire'],
          fois: [{ age: '8', premiere: true, qui: 'mon père', contexte: 'Un matin d’hiver, il part avec sa valise', quoi: 'Le départ de mon père', perso: 'la Petite fille' }, { age: '19', qui: 'mon premier amour', quoi: 'Il me quitte par message' }, { age: '31', qui: 'Tom', quoi: 'Notre séparation', perso: 'la Délaissée' }],
          lignee: [{ qui: 'a:p2', age: '32', tiroir: 'sais', quoi: 'Son divorce', perso: 'la Délaissée' }], croyance: 'Les hommes finissent toujours par partir', libVie: il(10) },
        { id: 's2', cree: il(40), nom: 'la peur de manquer', cycle: 'racine', blessure: 'injustice', domaines: ['Argent'], corps: ['Le ventre'], sensation: ['Serré'], pensee: 'L’argent ne dure jamais', reactions: ['Contrôler'],
          fois: [{ age: '12', premiere: true, qui: 'ma mère', contexte: 'Les fins de mois, les enveloppes', quoi: 'Les huissiers à la maison', perso: 'la Gardienne' }, { age: '24', quoi: 'Mon premier découvert' }, { age: '32', quoi: 'L’angoisse devant mon compte' }],
          lignee: [{ qui: 'a:p4', age: '30', tiroir: 'raconte', quoi: 'Veuve avec trois enfants, sans argent', perso: 'le Soldat' }], croyance: 'L’argent, ça ne pousse pas sur les arbres', profond: 'Si j’ai de l’argent, on va me le reprendre.',
          libVie: il(25), libLignee: il(20), aLaPlace: 'La sécurité : recevoir et garder, sans peur.', intention: 'Je suis en sécurité. Je peux recevoir et garder.', intentionPosee: il(18),
          actions: [{ t: 'Mettre 5 € de côté chaque semaine', fait: il(17) }, { t: 'Ouvrir mes relevés le lundi, calmement', fait: '' }],
          suivis: [{ date: il(12), rep: 'oui', quand: il(12), qui: 'mon banquier', corps: ['Le ventre', 'Serré'], pense: 'Ça va mal finir', fait: 'J’ai respiré, puis j’ai appelé', role: 'victime', gere: 'oui', note: 6 }, { date: il(3), rep: 'non', note: 7 }], rolesSortir: ['victime', 'controle'] }
      ];
      D.etat.schemas.unshift({ id: 's0', cree: il(200), nom: 'la peur de déranger', cycle: 'coeur', blessure: 'rejet', domaines: ['Travail'], corps: ['La gorge'], sensation: ['Serré'], pensee: 'Je ne veux pas déranger', reactions: ['Me taire'],
        fois: [{ age: '6', premiere: true, qui: 'ma maîtresse', quoi: 'Je n’ose pas lever la main' }, { age: '27', quoi: 'Je ne demande pas d’augmentation' }], lignee: [], liaison: 'aucune', libVie: il(150), intention: 'Ma place existe, je la prends.', intentionPosee: il(140), suivis: [{ date: il(60), rep: 'oui', gere: 'oui', note: 10 }], classe: il(60) });
      D.etat.theatre = { persos: [
          { id: 'pt1', nom: 'Marc', qui: 'lignee', cle: 'a:p3', couleur: '#8A8494', symptomes: ['Froid', 'Absent', 'Les hommes finissent toujours par partir'] },
          { id: 'pt2', nom: 'Henri', qui: 'lignee', cle: 'a:p5', couleur: '#2E2433', symptomes: ['Froid', 'Distant'] },
          { id: 'pt3', nom: 'Tom', qui: 'vie', role: 'Ex', genre: 'm', couleur: '#7FA7D9', symptomes: ['Froid', 'Qui part', 'Les hommes finissent toujours par partir'] },
          { id: 'pt4', nom: 'Le Chef', qui: 'vie', role: 'Patron·ne', genre: 'm', couleur: '#4E5D94', symptomes: ['Froid', 'Qui juge'] },
          { id: 'pt5', nom: 'Sarah', qui: 'vie', role: 'Ami·e', genre: 'f', couleur: '#D4A24C', symptomes: ['Qui protège'] },
          { id: 'pt6', nom: 'L’amour', type: 'desir', couleur: '#D4A24C', symptomes: [] },
          { id: 'pt7', nom: 'Les factures', type: 'symbole', couleur: '#8A8494', symptomes: [] }],
        scenes: [{ id: 'sn1', titre: 'Les hommes de ma vie', schema: 's1', cree: il(30), moi: { x: 50, y: 58 }, places: { pt1: { x: 24, y: 18, dos: true, poids: 'lourd' }, pt2: { x: 22, y: 40, poids: 'leger' }, pt3: { x: 72, y: 32, poids: 'lourd', taille: '3' }, pt4: { x: 76, y: 76, poids: 'present' }, pt5: { x: 40, y: 84, poids: 'leger' }, pt6: { x: 70, y: 9, taille: '3' }, pt7: { x: 24, y: 64, taille: '3', poids: 'lourd' } },
          ressentis: { pt1: 'Je l’attends encore, comme sur le quai.', pt3: 'Il est loin, et je cours après lui.' }, devient: { pt1: ['La Petite fille', 'Gorge serrée'], pt3: ['Je cours après', 'Je donne tout'] }, filsVus: ['pt1|pt3', 'pt1|pt4', 'pt2|pt3', 'pt2|pt4'],
          photos: [{ date: il(30), moi: { x: 50, y: 60 }, places: { pt1: { x: 42, y: 40, poids: 'lourd' }, pt2: { x: 20, y: 40, poids: 'present' }, pt3: { x: 60, y: 44, poids: 'lourd' }, pt4: { x: 70, y: 70, poids: 'lourd' } }, note: 'Tout le monde est collé à moi.' }] }] };
      D.etat.notesJour = {}; D.etat.notesJour[il(4)] = { corps: ['La gorge'], sens: ['Serré'], pense: 'Elle va encore annuler' };
      D.etat.schemas[1].prises = [{ date: il(20), texte: 'Je vois que je cherche chez Tom ce que je n’ai pas eu de mon père.', source: 'Mon théâtre · Les hommes de ma vie' }];
      D.etat.ressentis[0].schema = 's1'; D.etat.ressentis[1].schema = 's2'; D.etat.reves[0].schema = 's2';
      D.etat.humeurs = {}; D.etat.humeurs[il(2)] = ['Fatigue', 'Inquiétude']; D.etat.humeurs[il(3)] = ['Tristesse']; D.etat.humeurs[il(6)] = ['Joie'];
    });
  }

  /* ───── Toi : naissance, nombres, ciel ───── */
  function moiDeLArbre() { var P = (D.arbre && D.arbre.people) || {}; for (var k in P) if (P[k].role === 'moi') return P[k]; return null; }
  function naissance() { var d = dateComplete(D.naissance); if (d) return d; var m = moiDeLArbre(); return m ? dateComplete(m.naiss) : null; }
  function ageA(dt) { var b = naissance(); if (!b) return null; var a = dt.getFullYear() - b.a; if (dt.getMonth() + 1 < b.m || (dt.getMonth() + 1 === b.m && dt.getDate() < b.j)) a--; return a; }
  function jourPerso(dt) { var b = naissance(); if (!b || !N) return null; var ap = N.anneePerso(b.j, b.m, dt.getFullYear()), mp = N.reduire(ap + dt.getMonth() + 1, false); return N.reduire(mp + dt.getDate(), false); }
  function moisPerso(dt) { var b = naissance(); if (!b || !N) return null; return N.reduire(N.anneePerso(b.j, b.m, dt.getFullYear()) + dt.getMonth() + 1, false); }
  function chemin() {
    var b = naissance(); if (!b || !N) return null;
    try { var m = moiDeLArbre(), t = N.theme(D.prenoms || (m && m.prenom) || D.prenom || '', D.nom || (m && m.nom) || '', b.a + '-' + ('0' + b.m).slice(-2) + '-' + ('0' + b.j).slice(-2)); return t && t.chemin ? t.chemin : null; } catch (e) { return null; }
  }
  var SIGNES = [[1, 20, 'Capricorne'], [2, 19, 'Verseau'], [3, 21, 'Poissons'], [4, 20, 'Bélier'], [5, 21, 'Taureau'], [6, 21, 'Gémeaux'], [7, 23, 'Cancer'], [8, 23, 'Lion'], [9, 23, 'Vierge'], [10, 23, 'Balance'], [11, 22, 'Scorpion'], [12, 22, 'Sagittaire']];
  function signeDe(d) { if (!d) return null; var s = SIGNES[d.m - 1]; return d.j < s[1] ? s[2] : (SIGNES[d.m % 12][2]); }
  function soleil() { return signeDe(naissance()); }
  function cheminDe(d) { if (!d || !N) return null; var t = String(d.a) + ('0' + d.m).slice(-2) + ('0' + d.j).slice(-2); return N.reduire(t.split('').reduce(function (x, c) { return x + +c; }, 0), true); }
  /* Ce que tu partages avec quelqu'un de ta lignée : chemin de vie, signe, jour ou mois de naissance */
  function communs(p) {
    var b = naissance(), d = p && p.anneeN; if (!b || !d) return [];
    var l = [], c1 = cheminDe(b), c2 = cheminDe(d), s1 = signeDe(b), s2 = signeDe(d);
    if (c1 && c1 === c2) l.push('le même chemin de vie, ' + c1);
    if (s1 && s1 === s2) l.push('le même Soleil, en ' + s1);
    if (b.j === d.j && b.m === d.m) l.push('le même jour d’anniversaire');
    else if (b.j === d.j) l.push('le même jour de naissance dans le mois, le ' + d.j);
    else if (b.m === d.m) l.push('le même mois de naissance');
    return l;
  }
  var LUNES = {};
  function lunesDuMois(a, m) {
    var k = a + '-' + m; if (LUNES[k]) return LUNES[k];
    var r = {}; if (!A) return r;
    [[0, 'Nouvelle lune'], [180, 'Pleine lune']].forEach(function (ph) {
      var t = new Date(a, m, 1), fin = new Date(a, m + 1, 1);
      for (var i = 0; i < 3; i++) { var x = A.SearchMoonPhase(ph[0], t, 40); if (!x || x.date >= fin) break; r[iso(x.date)] = ph[1]; t = new Date(x.date.getTime() + 864e5); }
    });
    LUNES[k] = r; return r;
  }
  /* La phase du jour : la nouvelle lune, le premier quartier, la pleine lune et le dernier quartier seulement le jour exact */
  function phaseDuJour(dt) {
    if (!A) return '';
    var d0 = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()), d1 = new Date(d0.getTime() + 864e5), nom = '';
    [[0, 'Nouvelle lune'], [90, 'Premier quartier'], [180, 'Pleine lune'], [270, 'Dernier quartier']].forEach(function (x) { if (nom) return; var t = A.SearchMoonPhase(x[0], d0, 1.2); if (t && t.date < d1) nom = x[1]; });
    if (nom) return nom;
    var ph = A.MoonPhase(new Date(d0.getTime() + 432e5));
    return ph < 90 ? 'Premier croissant' : ph < 180 ? 'Lune gibbeuse croissante' : ph < 270 ? 'Lune gibbeuse décroissante' : 'Dernier croissant';
  }

  /* ───── La lignée : personnes, générations et liens avec toi ───── */
  var BASE_FIL = { p: ['Ton père', 1, 'm'], m: ['Ta mère', 1, 'f'], pp: ['Ton grand-père paternel', 2, 'm'], pm: ['Ta grand-mère paternelle', 2, 'f'], mp: ['Ton grand-père maternel', 2, 'm'], mm: ['Ta grand-mère maternelle', 2, 'f'] };
  var REL_FIL = { frere: ['Ton frère', 0, 'm'], soeur: ['Ta sœur', 0, 'f'], enfant: ['Ton enfant', -1, 'u'], tante_m: ['Ta tante maternelle', 1, 'f'], oncle_m: ['Ton oncle maternel', 1, 'm'], tante_p: ['Ta tante paternelle', 1, 'f'], oncle_p: ['Ton oncle paternel', 1, 'm'] };
  var CACHE_P = null;
  function personnes() {
    if (CACHE_P) return CACHE_P;
    var l = [], P = (D.arbre && D.arbre.people) || {}, R = (D.arbre && D.arbre.rels) || [], moi = moiDeLArbre();
    if (moi && Object.keys(P).length > 1) {
      var par = {}, enf = {}, cpl = {};
      R.forEach(function (r) {
        if (r.type === 'parent') { (par[r.to] = par[r.to] || []).push(r.from); (enf[r.from] = enf[r.from] || []).push(r.to); }
        else if (r.type === 'couple') { (cpl[r.from] = cpl[r.from] || []).push(r.to); (cpl[r.to] = cpl[r.to] || []).push(r.from); }
      });
      var gen = {}, file = [moi.id]; gen[moi.id] = 0;
      while (file.length) {
        var x = file.shift();
        (par[x] || []).forEach(function (y) { if (gen[y] == null) { gen[y] = gen[x] + 1; file.push(y); } });
        (enf[x] || []).forEach(function (y) { if (gen[y] == null) { gen[y] = gen[x] - 1; file.push(y); } });
        (cpl[x] || []).forEach(function (y) { if (gen[y] == null) { gen[y] = gen[x]; file.push(y); } });
      }
      var anc = {}; (function monter(id, n) { (par[id] || []).forEach(function (y) { anc[y] = n; monter(y, n + 1); }); })(moi.id, 1);
      var desc = {}; (function descendre(id, n) { (enf[id] || []).forEach(function (y) { desc[y] = n; descendre(y, n + 1); }); })(moi.id, 1);
      var freres = {}; (par[moi.id] || []).forEach(function (pp) { (enf[pp] || []).forEach(function (y) { if (y !== moi.id) freres[y] = 1; }); });
      Object.keys(P).forEach(function (id) {
        if (id === moi.id || gen[id] == null) return;
        var p = P[id], f = p.sex === 'f', g = gen[id], lien;
        if (anc[id] === 1) lien = f ? 'Ta mère' : 'Ton père';
        else if (anc[id] === 2) lien = f ? 'Ta grand-mère' : 'Ton grand-père';
        else if (anc[id]) lien = f ? 'Ton aïeule' : 'Ton aïeul';
        else if (desc[id] === 1) lien = f ? 'Ta fille' : p.sex === 'm' ? 'Ton fils' : 'Ton enfant';
        else if (desc[id]) lien = f ? 'Ta petite-fille' : 'Ton petit-fils';
        else if (freres[id]) lien = f ? 'Ta sœur' : 'Ton frère';
        else if ((cpl[moi.id] || []).indexOf(id) >= 0) lien = 'Ton couple';
        else lien = g >= 2 ? (f ? 'Ton aïeule' : 'Ton aïeul') : g === 1 ? (f ? 'Ta tante' : 'Ton oncle') : g === 0 ? 'Ta famille' : (f ? 'Ta nièce' : 'Ton neveu');
        var proche = anc[id] === 1 || desc[id] === 1 || freres[id] || lien === 'Ton couple';
        l.push({ k: 'a:' + id, id: id, prenom: prenom1(p), lien: lien, gen: g, f: f, parti: !!p.deces, anneeD: dateComplete(p.deces), anneeN: dateComplete(p.naiss), rang: proche ? 1 : (anc[id] === 2 || desc[id] === 2 || Math.abs(g) === 1) ? 2 : 3 });
      });
    } else {
      var F = (D.fil && D.fil.personnes) || {};
      Object.keys(F).forEach(function (id) {
        if (id === 'toi') return; var p = F[id], b = BASE_FIL[id] || REL_FIL[p.rel], g = b ? b[1] : (/^[pm]{3}$/.test(id) ? 3 : 1);
        var lien = b ? b[0] : /^[pm]{3}$/.test(id) ? (id.slice(-1) === 'm' ? 'Une arrière-grand-mère' : 'Un arrière-grand-père') : 'Ta famille';
        l.push({ k: 'f:' + id, id: id, prenom: p.prenom || lien.replace(/^(Ton|Ta|Une|Un) /, ''), lien: lien, gen: g, f: b ? b[2] === 'f' : /m$/.test(id), parti: false, rang: Math.abs(g) <= 1 && !/^(tante|oncle)/.test(p.rel || '') ? 1 : g === 2 || /^(tante|oncle)/.test(p.rel || '') ? 2 : 3 });
      });
    }
    CACHE_P = l; return l;
  }
  function personne(k) { var l = personnes(); for (var i = 0; i < l.length; i++) if (l[i].k === k) return l[i]; return null; }
  function nomPers(k) { var p = personne(k); return p ? p.prenom + ' (' + p.lien.toLowerCase() + ')' : ''; }

  /* ───── Le fil d'or ───── */
  function filPersonnes() { var p = (D.fil && D.fil.personnes) || {}; return Object.keys(p).filter(function (k) { var x = p[k]; return x && (x.prenom || (x.etapes || []).some(plein)); }); }
  function plein(e) { return !!(e && (e.age || e.evt || e.texte)); }
  function nbMoments() { var p = (D.fil && D.fil.personnes) || {}, n = 0; Object.keys(p).forEach(function (k) { n += (p[k].etapes || []).filter(plein).length; }); return n; }
  function nomFil(id) { if (id === 'toi') return 'Toi'; var p = (D.fil.personnes || {})[id] || {}, b = BASE_FIL[id] || REL_FIL[p.rel]; var l = b ? b[0].toLowerCase() : 'quelqu’un de ta lignée'; return p.prenom ? p.prenom + ', ' + l : cap(l); }
  /* Toujours le lien de parenté après le prénom (deux Jeanne ne se confondent pas) */
  function nomL(p) { return p ? p.prenom + ', ' + p.lien.toLowerCase() : ''; }
  function nomA(k, P) { var x = personne('a:' + k); return x ? nomL(x) : prenom1(P[k]); }
  function nbArbre() { return Object.keys((D.arbre && D.arbre.people) || {}).length; }
  function baseOk() { return nbArbre() >= 3 || nbMoments() >= 1; }
  function reps() { return (D.arbre && D.arbre.lecture && D.arbre.lecture.reps) || []; }
  /* Un ressenti ajouté au fil d'or, dans « toi » (le fil d'or s'ouvre ensuite avec ce moment) */
  function ajouterAuFil(r) {
    var F = D.fil && D.fil.personnes && D.fil.personnes.toi ? D.fil : { v: 1, ordre: [], seq: 0, visionsPerso: [], personnes: { toi: { id: 'toi', rel: '', prenom: D.prenom || '', global: { bl: [], em: [], vi: [] }, etapes: [] } } };
    var t = F.personnes.toi; t.etapes = (t.etapes || []).filter(plein);
    var age = ageA(new Date());
    var vi = [];
    if (r.phrase) { vi.push(r.phrase); F.visionsPerso = F.visionsPerso || []; if (F.visionsPerso.indexOf(r.phrase) < 0) F.visionsPerso.push(r.phrase); }
    t.etapes.push({ age: age != null ? String(age) : '', evt: String(r.quoi || '').slice(0, 140), bl: (r.bl || []).slice(), em: (r.em || []).slice(), vi: vi, texte: 'Déposé dans Ma spirale le ' + dateCourte(r.date) + '.' });
    D.fil = F; r.fil = true;
    sauverFil(true);
  }
  var minuteurFil = null;
  function sauverFil(tout) {
    CACHE_P = null;
    if (EXEMPLE) return;
    clearTimeout(minuteurFil);
    minuteurFil = setTimeout(function () {
      var maj = new Date().toISOString();
      try { localStorage.setItem('genesolia-arbre-ressentis', JSON.stringify(D.fil)); localStorage.setItem('genesolia-arbre-ressentis-maj', maj); } catch (e) {}
      if (sb && D.user && D.accord) window.GenesoliaCoffre.ecrire(sb, D.user, 'fil-d-or', { etat: D.fil, maj: maj, v: 1 });
    }, tout ? 0 : 700);
  }
  function filEtat() {
    if (!D.fil || !D.fil.personnes || !D.fil.personnes.toi) D.fil = { v: 1, ordre: [], seq: 0, visionsPerso: [], personnes: { toi: nouvPers('toi', '') } };
    D.fil.ordre = D.fil.ordre || []; return D.fil;
  }
  function nouvPers(id, rel) { return { id: id, rel: rel || '', prenom: '', global: { bl: [], em: [], vi: [] }, etapes: [] }; }
  function etiquetteFil(id) { if (id === 'toi') return 'Toi'; var p = D.fil.personnes[id] || {}, b = BASE_FIL[id] || REL_FIL[p.rel]; return b ? b[0].replace(/^(Ton|Ta) /, '').replace(/^./, function (c) { return c.toUpperCase(); }) : /^[pm]{3}$/.test(id) ? (id.slice(-1) === 'm' ? 'Arrière-grand-mère' : 'Arrière-grand-père') : 'Quelqu’un'; }

  /* ───── Les échos : ce qui, dans ta lignée, répond à un ressenti ───── */
  function echosRessenti(r) {
    var l = [], F = (D.fil && D.fil.personnes) || {}, age = r.date ? ageA(new Date(r.date)) : null;
    Object.keys(F).forEach(function (id) {
      if (id === 'toi') return;
      (F[id].etapes || []).forEach(function (e) {
        var com = (e.em || []).filter(function (x) { return (r.em || []).indexOf(x) >= 0; }), bl = (e.bl || []).filter(function (x) { return (r.bl || []).indexOf(x) >= 0; });
        var ea = ageNum(e.age);
        if (com.length) l.push('La même émotion chez ' + nomFil(id) + ' : ' + com.join(', ').toLowerCase() + (e.evt ? ', « ' + e.evt + ' »' : '') + (ea != null ? ', à ' + ea + ' ans' : '') + '.');
        else if (bl.length) l.push('La même blessure chez ' + nomFil(id) + (e.evt ? ' : « ' + e.evt + ' »' : '') + '.');
        else if (age != null && ea != null && Math.abs(ea - age) <= 1 && e.evt) l.push(nomFil(id) + ' avait ton âge : « ' + e.evt + ' », à ' + ea + ' ans.');
      });
    });
    var P = (D.arbre && D.arbre.people) || {}, moi = moiDeLArbre();
    if (age != null) Object.keys(P).forEach(function (k) {
      if (moi && k === moi.id) return;
      (P[k].events || []).forEach(function (e) { if (Math.abs(+e.age - age) <= 1 && EVT[e.type]) l.push(nomA(k, P) + ' a vécu ' + EVT[e.type] + ' à ' + e.age + ' ans, à peu près ton âge ce jour-là.'); });
    });
    return l.filter(function (v, i, a) { return a.indexOf(v) === i; }).slice(0, 6);
  }
  function cycleSuggere(r) {
    var em = (r.em || []).join(' '), bl = (r.bl || []).join(' ');
    var ra = /manquer|Impuissance|Honte/.test(em) || /humiliation|injustice|rejet/.test(bl), co = /Solitude|Tristesse/.test(em) || /abandon|trahison/.test(bl);
    return ra && co ? 'deux' : ra ? 'racine' : co ? 'coeur' : '';
  }

  /* ───── Affichage ───── */
  function afficher(h) { vue.innerHTML = bandeauAccord() + h; aller(0); centrerFrises(vue); }
  /* Cliente connectée sans accord : un seul bandeau, en haut de chaque écran, pour garder l'enquête dans son espace */
  function bandeauAccord() {
    if (EXEMPLE || !D.user || D.accord) return '';
    return '<section class="pa-carte pa-accord"><p class="pa-etiq">Ce que tu écris, gardé dans ton espace</p><p>Pour le retrouver sur tous tes appareils, ce que tu écris dans Ma spirale est gardé dans ton espace Genesolia, <b>chiffré</b> : personne d’autre que toi ne le lit. Il nous faut ton accord une fois, c’est la loi pour des données aussi personnelles.</p><button type="button" class="pa-bt or" data-accord>J’accepte, garder mes notes</button><p class="pa-discret">Tes rêves restent privés aussi : seuls ceux que tu choisis de partager, sans ton nom, peuvent servir à écrire des articles.</p></section>';
  }
  /* chaque frise s'ouvre cadrée sur ses points (de la première fois à aujourd'hui) ; si tout ne tient pas, elle part de la première fois */
  function centrerFrises(z) { (z || document).querySelectorAll('.pa-fr-defil[data-ici]').forEach(function (el) { var a = +el.getAttribute('data-min'), b = +el.getAttribute('data-max'), w = el.clientWidth; if (!w) return; el.scrollLeft = isNaN(a) ? Math.max(0, +el.getAttribute('data-ici') - w / 2) : b - a + 40 <= w ? Math.max(0, (a + b) / 2 - w / 2) : Math.max(0, a - 50); }); }
  /* Une fenêtre. o : { cle (même clé : on garde la position), enregistrer (avant de garder), suite: [libellé, fonction], msg } */
  var cleFeuille = '', flash = '';
  function feuille(h, o) {
    o = o || {};
    var avant = document.querySelector('.pa-feuille'), y = avant && o.cle && o.cle === cleFeuille ? avant.querySelector('.pa-f-corps').scrollTop : 0;
    document.querySelectorAll('.pa-voile,.pa-feuille').forEach(function (x) { x.remove(); });
    var v = document.createElement('div'); v.className = 'pa-voile' + (avant ? ' ouvert' : ''); v.addEventListener('click', fermerFeuille);
    var f = document.createElement('section'); f.className = 'pa-feuille' + (avant ? ' ouvert' : ''); f.setAttribute('role', 'dialog'); f.setAttribute('aria-modal', 'true');
    var m = o.msg || flash; flash = '';
    f.innerHTML = '<div class="pa-f-tete"><button type="button" class="pa-f-fermer" aria-label="Fermer">×</button></div><div class="pa-f-corps">' + h + '</div>' +
      '<div class="pa-f-pied"><p class="pa-f-msg' + (m ? ' ok' : '') + '" data-sauve-f aria-live="polite">' + esc(m || '') + '</p><div class="pa-f-bts"><button type="button" class="pa-bt ' + (o.libelle ? 'or' : 'clair') + '" data-f-enr>' + esc(o.libelle || 'Enregistrer') + '</button>' + (o.suite ? '<button type="button" class="pa-bt or" data-f-suite>' + esc(o.suite[0]) + '</button>' : '') + '</div></div>';
    f.querySelector('.pa-f-fermer').addEventListener('click', fermerFeuille);
    f.querySelector('[data-f-enr]').addEventListener('click', function () { if (o.enregistrer && o.enregistrer() === false) return; sauverMaintenant(); });
    if (o.suite) f.querySelector('[data-f-suite]').addEventListener('click', function () { if (o.enregistrer && o.enregistrer() === false) return; sauverMaintenant(); flash = 'C’est gardé.'; o.suite[1](); });
    document.body.appendChild(v); document.body.appendChild(f);
    if (!document.body.classList.contains('pa-fige')) { yFige = window.scrollY; document.body.style.top = -yFige + 'px'; document.body.classList.add('pa-fige'); }
    cleFeuille = o.cle || '';
    centrerFrises(f);
    if (y) f.querySelector('.pa-f-corps').scrollTop = y;
    if (!avant) requestAnimationFrame(function () { v.classList.add('ouvert'); f.classList.add('ouvert'); });
    return f.querySelector('.pa-f-corps');
  }
  var yFige = 0;
  function aller(y) { try { window.scrollTo({ top: y, left: 0, behavior: 'instant' }); } catch (e) { window.scrollTo(0, y); } }
  function defiger() { if (!document.body.classList.contains('pa-fige')) return; document.body.classList.remove('pa-fige'); document.body.style.top = ''; aller(yFige); }
  function fermerFeuille() {
    var avait = !!document.querySelector('.pa-feuille');
    document.querySelectorAll('.pa-voile,.pa-feuille').forEach(function (x) { x.remove(); }); defiger();
    if (avait && D.acces) rafraichir();
  }
  var rafraichir = function () {};
  function puces(nom, liste, choisis, multi) {
    return '<div class="pa-puces" data-groupe="' + nom + '"' + (multi ? ' data-multi' : '') + '>' + liste.map(function (x) { var v = Array.isArray(x) ? x[0] : x, t = Array.isArray(x) ? x[1] : x; return '<button type="button" data-v="' + esc(v) + '" aria-pressed="' + ((choisis || []).indexOf(v) >= 0) + '">' + esc(t) + '</button>'; }).join('') + '</div>';
  }
  function lirePuces(z, nom) { var g = z.querySelector('[data-groupe="' + nom + '"]'); return g ? [].map.call(g.querySelectorAll('[aria-pressed="true"]'), function (b) { return b.getAttribute('data-v'); }) : []; }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.pa-puces button'); if (!b || b.closest('.pa-exemples')) return;
    var g = b.parentNode;
    if (!g.hasAttribute('data-multi')) g.querySelectorAll('button').forEach(function (x) { if (x !== b) x.setAttribute('aria-pressed', 'false'); });
    b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
    g.dispatchEvent(new Event('change', { bubbles: true }));
  });
  function points(r) {
    var n = r.spirale ? ETAPES.length : (r.etape || 0);
    return '<span class="pa-points" aria-label="' + n + ' étape' + (n > 1 ? 's' : '') + ' sur ' + ETAPES.length + '">' + ETAPES.map(function (E, i) { return '<i class="' + (i < n ? 'fait' : i === n ? 'ici' : '') + '"></i>'; }).join('') + '</span>';
  }
  function carteFil(r) {
    var E = ETAPES[Math.min(r.etape || 0, ETAPES.length - 1)];
    return '<button type="button" class="pa-carte pa-fil" data-fil="' + esc(r.id) + '"><span class="pa-etiq">' + esc(dateCourte(r.date)) + (r.spirale ? ' · devenu spirale' : ' · ' + esc(E.titre)) + '</span>' +
      '<b>' + esc(String(r.quoi || 'Un ressenti').slice(0, 110)) + (String(r.quoi || '').length > 110 ? '…' : '') + '</b>' +
      '<span class="pa-ligne">' + ((r.em || []).length ? '<span class="pa-em">' + esc(r.em.join(' · ')) + '</span>' : '<span></span>') + points(r) + '</span></button>';
  }

  /* ── Sans le Pass ── */
  function vuePorte() {
    var u = !!D.user;
    afficher('<section class="pa-carte pa-porte"><img src="assets/icones/pass-192.png" alt="" width="84" height="84" style="border-radius:22px;box-shadow:0 10px 26px rgba(31,11,42,.25)">' +
      '<h1 class="pa-h1">Ma spirale</h1><p>L’espace pour regarder ce qui se répète dans ta vie, comprendre d’où ça vient, le libérer et avancer : de la boucle à la spirale.</p>' +
      '<ul><li>Moi : déposer un ressenti ou un rêve, ta note du jour, tes schémas en cours</li><li>Mon fil d’or : ta frise de vie et celle de ta lignée</li><li>Mon agenda : les dates de ta lignée, les lunes, tes libérations et tes gestes</li><li>Mon bilan : ta lignée en sphères de lumière, et tes schémas devenus spirale</li><li>Mes actions : tous les protocoles, prêts à suivre</li></ul>' +
      '<p><b>Le Pass</b> · 10 € par mois, sans engagement, ou 27 € les 3 mois.</p>' +
      '<div style="display:flex;flex-wrap:wrap;gap:.6rem;justify-content:center">' + (u ? '<a class="pa-bt" href="ma-spirale.html#bientot">S’abonner · bientôt disponible</a>' : '<a class="pa-bt" href="login.html?retour=pass.html">' + (LIEN_TEST ? 'Me connecter pour tester Ma spirale' : 'Me connecter') + '</a><a class="pa-bt clair" href="ma-spirale.html">Découvrir Ma spirale</a>') +
      '<a class="pa-bt clair" href="pass.html?exemple">Voir un exemple</a></div>' +
      (u ? '<form class="pa-code" id="pa-code" novalidate><label for="pa-code-t">Tu as un code test ?</label><div><input id="pa-code-t" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Ton code"><button type="submit" class="pa-bt">Ouvrir</button></div><p class="pa-erreur" role="alert"></p></form>' : '') + '</section>');
    var fc = document.getElementById('pa-code');
    if (fc) fc.addEventListener('submit', function (e) {
      e.preventDefault();
      if (fc.querySelector('#pa-code-t').value.trim().toLowerCase() !== CODE_TEST) { fc.querySelector('.pa-erreur').textContent = 'Ce code ne fonctionne pas.'; return; }
      sb.auth.updateUser({ data: { spirale_test: new Date().toISOString() } }).then(function (r) { if (r && r.error) { fc.querySelector('.pa-erreur').textContent = 'Réessaie dans un instant.'; return; } location.reload(); });
    });
  }

  /* ── 1. Moi ── */
  function vueMoi() {
    var dt = new Date(), jp = jourPerso(dt), mp = moisPerso(dt), b = naissance(), ap = b && N ? N.anneePerso(b.j, b.m, dt.getFullYear()) : null, ch = chemin(), so = soleil();
    var SC = (D.etat.schemas || []).map(completerSchema), enCours = SC.filter(function (x) { return !x.classe; }), classes = SC.filter(function (x) { return x.classe; });
    var h = '<h1 class="pa-h1">' + (D.prenom ? 'Bonjour ' + esc(D.prenom) : 'Bonjour') + '</h1><p class="pa-sous">' + cap(dt.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })) + ' · ' + esc(phaseDuJour(dt)) + ' <span class="pa-offre">Ton offre : ' + (D.cercle ? 'Le Cercle' : 'Le Pass') + '</span></p><div class="pa-2col"><div>';
    h += '<section class="pa-carte pa-depot"><p class="pa-etiq">Quand quelque chose remonte</p><h2>Qu’est-ce que tu ressens ?</h2><p>Une émotion, une situation qui se répète : dépose-la ici. Elle rejoint un schéma, et on avance pas à pas : ta frise, la libération, ton intention, ton suivi.</p><div class="pa-outils"><button type="button" class="pa-bt or" data-depot>Je dépose un ressenti</button><button type="button" class="pa-bt clair" data-reve="new">Je note un rêve</button></div></section>';
    if (enCours.length) h += '<p class="pa-titre-s">Mes schémas en cours</p><p class="pa-def">Un schéma, c’est ce qui se répète. Chacun avance dans les 9 étapes du cycle, jusqu’à devenir spirale.</p>' + enCours.map(carteSchema).join('');
    var sv3 = enCours.filter(function (x) { return x.attenteSouvenir && !premiereDe(x) && joursDepuis(x.attenteSouvenir) >= 3; });
    if (sv3.length) h += '<section class="pa-carte pa-intentions"><p class="pa-etiq">Laisser venir</p>' + sv3.map(function (x) { return '<p class="pa-int-t">Un souvenir est revenu, pour « ' + esc(x.nom) + ' » ?</p><button type="button" class="pa-bt or" data-schema="' + esc(x.id) + '" data-onglet-s="ou">Je le note</button>'; }).join('') + '</section>';
    var gd = enCours.filter(gesteDu);
    if (gd.length) h += '<section class="pa-carte pa-intentions"><p class="pa-etiq">Ton geste, 48 heures après</p>' + gd.map(function (x) { return '<p class="pa-int-t">« ' + esc(x.geste.t) + ' »</p><button type="button" class="pa-bt or" data-schema="' + esc(x.id) + '" data-onglet-s="liberer">Tu as fait ton geste ? Qu’as-tu ressenti ?</button>'; }).join('') + '</section>';
    var lune = enCours.filter(function (x) { return x.intentionPosee && lunesApres(x.intentionPosee, 6).indexOf(iso(dt)) >= 0; });
    if (lune.length) h += '<section class="pa-carte pa-intentions"><p class="pa-etiq">C’est la nouvelle lune</p>' + lune.map(function (x) { return '<p class="pa-int-t">« ' + esc(x.intention || '') + ' »</p><button type="button" class="pa-bt or" data-schema="' + esc(x.id) + '" data-onglet-s="reapprendre">Qu’est-ce qui a bougé ?</button>'; }).join('') + '</section>';
    if (classes.length) h += '<p class="pa-titre-s">Devenus spirale</p><p class="pa-def">La boucle tourne toujours au même endroit ; la spirale monte : le thème peut revenir, mais tu le reconnais et tu réagis autrement.</p>' + classes.map(carteSchema).join('');
    h += '</div><div>';
    if (!b) {
      h += '<section class="pa-carte" style="border-color:#B0507A"><p class="pa-etiq">Pour commencer · 1 minute</p><h2>Tes repères</h2><p>Ta date de naissance et tes prénoms placent ta frise et ouvrent tes nombres.</p>' +
        '<form id="pa-reperes" class="pa-form" novalidate><label for="pa-pr">Tes prénoms</label><input id="pa-pr" autocomplete="given-name" maxlength="120" required>' +
        '<label for="pa-nom">Ton nom de naissance</label><input id="pa-nom" autocomplete="family-name" maxlength="80">' +
        '<label for="pa-dn">Ta date de naissance</label><input id="pa-dn" type="date" required min="1900-01-01" max="' + iso(dt) + '">' +
        (D.user && !EXEMPLE ? '<p class="pa-discret">' + ((window.GenesoliaReperes || {}).AVANT || '') + '</p>' : '') +
        '<button class="pa-bt" type="submit">C’est noté</button><p class="pa-erreur" role="alert"></p></form></section>';
    } else {
      h += '<section class="pa-carte pa-nuit"><p class="pa-etiq">Ton ciel et tes nombres</p><div class="pa-chiffres">' +
        (ch ? '<span><b>' + ch + '</b>chemin de vie</span>' : '') + (ap ? '<span><b>' + ap + '</b>année</span>' : '') + (mp ? '<span><b>' + mp + '</b>mois</span>' : '') + (jp ? '<span><b>' + jp + '</b>jour</span>' : '') + '</div>' +
        '<p>' + (so ? 'Soleil en ' + esc(so) + '. ' : '') + esc((N.JOURNEES || {})[jp] || '') + '</p></section>';
    }
    h += blocNoteJour(dt);
    if (!nbMoments()) h += '<a class="pa-carte pa-base" href="#fil"><p class="pa-etiq">Ta base</p><h2>Ton fil d’or</h2><p>Quelques moments de ta vie et de celle des tiens : ils s’inscrivent sur ta frise familiale.</p><span class="pa-plus">Remplir mon fil d’or</span></a>';
    h += '<section class="pa-carte pa-grande-q"><p class="pa-etiq">La question à te poser, chaque fois</p><p>' + esc(PF.QUESTION || '') + '</p></section>';
    h += '<a class="pa-carte" href="#actions"><p class="pa-etiq">Mes actions</p><p>Les protocoles pour libérer, poser une intention, et revenir au calme si ça monte fort.</p><span class="pa-plus">Ouvrir mes actions</span></a>';
    h += '</div></div>';
    /* sur ordinateur seulement : les liens vers le reste du site (sur téléphone, on reste dans l'appli) */
    h += '<div class="pa-bureau">';
    if (b) h += '<section class="pa-carte"><p class="pa-etiq">Ton ciel, en détail</p><div class="pa-outils"><a class="pa-bt clair" href="mon-mois.html">Mon mois</a><a class="pa-bt clair" href="theme-numerologique.html">Mes nombres</a><a class="pa-bt clair" href="theme-astral.html">Mon ciel de naissance</a></div></section>';
    if (!D.cercle) h += '<section class="pa-carte pa-cercle-plus"><p class="pa-etiq">Une autre offre : Le Cercle</p><p>Envie d’un parcours guidé, mois par mois ? Le Cercle est un programme accompagné, différent de Ma spirale :</p><ul class="pa-echos"><li>Un carnet chaque mois (Renaissance) et un livret pour déposer ce qui se rejoue (Libération)</li><li>Deux séances audio guidées par mois</li><li>La formation « Sors de la boucle », en 8 modules</li><li>Ton guide du mois et la question du mois</li></ul><a class="pa-bt clair" href="abonnement.html">Découvrir Le Cercle</a></section>';
    h += '<section class="pa-carte"><p class="pa-etiq">Mes livrets, compris dans ton Pass</p><div class="pa-outils">' + [['Mes nombres', 'theme-numerologique.html'], ['Mon thème astral', 'theme-astral.html'], ['L’arbre de vie', 'arbre-de-vie.html'], ['Le rapport de mon arbre', 'genosociogramme.html'], ['Les 12 saisons', 'assets/cercle/les-12-saisons-c4709f2dad.pdf'], ['Ma lignée en lumière', 'genosociogramme.html#lumiere']].map(function (x) { return '<a class="pa-bt clair" href="' + x[1] + '"' + (/\.pdf$/.test(x[1]) ? ' download' : '') + '>' + x[0] + '</a>'; }).join('') + '</div></section></div>';
    afficher(h);
    var f = document.getElementById('pa-reperes'); if (f) f.addEventListener('submit', garderReperes);
  }
  /* Les intentions posées : la nouvelle lune qui revient, et le corps qui réapprend chaque jour */
  function blocIntentions() {
    var auj = iso(new Date()), I = D.etat.ressentis.filter(function (r) { return r.intentionPosee && !r.spirale; });
    if (!I.length) return '';
    return '<section class="pa-carte pa-intentions"><p class="pa-etiq">Mes intentions posées</p>' + I.map(function (r) {
      var lu = lunesApres(r.intentionPosee, 6), due = lu.filter(function (d) { return d === auj && !((r.lunes || {})[d] && Object.keys(r.lunes[d]).length); })[0], proch = lu.filter(function (d) { return d > auj; })[0], fait = !!(r.corpsJ || {})[auj];
      return '<div class="pa-int"><div class="pa-graine petite"></div><div><p class="pa-int-t">« ' + esc(r.intention || '') + ' »</p>' +
        (due ? '<button type="button" class="pa-bt or" data-fil="' + esc(r.id) + '" data-etape="4">Nouvelle lune : qu’est-ce qui a bougé ?</button>' : '<p class="pa-discret">Elle revient à la nouvelle lune du ' + esc(dateCourte(proch || '')) + '.</p>') +
        '<button type="button" class="pa-corps-j" data-corps-j="' + esc(r.id) + '" aria-pressed="' + fait + '">' + (fait ? '✓ Ton corps a eu sa minute de sécurité aujourd’hui' : 'Ma minute de sécurité pour le corps, aujourd’hui') + '</button></div></div>';
    }).join('') + '</section>';
  }
  /* La libération en cours, avec les personnes concernées */
  function carteEnCours(r) {
    var n = Math.min(r.etape || 0, ETAPES.length - 1), E = ETAPES[n], q = r.qui ? personne(r.qui) : null, L = D.etat.liens || {}, gens = [];
    if (q) gens.push(q);
    echosPers(r).forEach(function (p) { if (gens.indexOf(p) < 0) gens.push(p); });
    var h = '<section class="pa-carte pa-en-cours"><p class="pa-etiq">Ta libération en cours · étape ' + (n + 1) + ' sur ' + ETAPES.length + ' · ' + esc(E.titre) + '</p>' +
      '<h2>' + esc(r.nom ? cap(r.nom) : String(r.quoi || 'Un ressenti').slice(0, 90)) + '</h2>' + (r.schema && trouverSchema(r.schema) ? '<button type="button" class="pa-lien-sch" data-schema="' + esc(r.schema) + '"><i class="pa-bl" style="background:' + couleurBl(trouverSchema(r.schema).blessure) + '"></i>Schéma : ' + esc(trouverSchema(r.schema).nom) + '</button>' : '') + ((r.em || []).length ? '<p class="pa-em">' + esc(r.em.join(' · ')) + ' · ' + esc(dateCourte(r.date)) + '</p>' : '') + points(r);
    if (gens.length) h += '<p class="pa-lab">Les personnes concernées</p><ul class="pa-gens">' + gens.slice(0, 4).map(function (p) { var t = (L[p.k] || {}).t; return '<li><button type="button" data-personne="' + esc(p.k) + '"><i class="pa-mini ' + (t || '') + '"></i><span><b>' + esc(p.prenom) + '</b>' + esc(p.lien.toLowerCase()) + (p === q ? ' · à qui ça appartient' : ' · le même ressenti') + '</span></button></li>'; }).join('') + '</ul>';
    else h += '<p class="pa-discret">À qui appartient-elle ? Un parent, plus loin, ou cette vie ? C’est la prochaine question.</p>';
    return h + '<button type="button" class="pa-bt or" data-fil="' + esc(r.id) + '">Continuer</button></section>';
  }
  /* Les personnes de ta lignée qui ont noté la même émotion ou la même blessure dans le fil d'or */
  function echosPers(r) {
    var F = (D.fil && D.fil.personnes) || {}, l = [];
    Object.keys(F).forEach(function (id) {
      if (id === 'toi') return;
      if ((F[id].etapes || []).some(function (e) { return (e.em || []).some(function (x) { return (r.em || []).indexOf(x) >= 0; }) || (e.bl || []).some(function (x) { return (r.bl || []).indexOf(x) >= 0; }); })) {
        var p = personneDuFil(id); if (p) l.push(p);
      }
    });
    return l;
  }
  function personneDuFil(id) {
    var p = personne('f:' + id); if (p) return p;
    var F = (D.fil.personnes || {})[id] || {}, pr = String(F.prenom || '').toLowerCase();
    if (pr) { var l = personnes(); for (var i = 0; i < l.length; i++) if (l[i].prenom.toLowerCase() === pr) return l[i]; }
    return null;
  }
  /* « Tiens… » : l'appli montre une ressemblance ; ce qu'elle rejoint n'apparaît que si elle touche la bulle */
  function bulleTiens(t, rev) { return '<div class="pa-tiens-z"><button type="button" class="pa-tiens" data-tiens-rev>' + esc(t) + '</button><div class="pa-tiens-nom" hidden>' + rev + '</div></div>'; }
  document.addEventListener('click', function (e) { var b = e.target.closest('[data-tiens-rev]'); if (b) { var n = b.parentNode.querySelector('.pa-tiens-nom'); if (n) n.hidden = !n.hidden; } });
  function tonCorps(c) { c = String(c || ''); if (c === 'Partout') return 'partout dans ton corps'; return c.replace(/^La /, 'ta ').replace(/^Le /, 'ton ').replace(/^Les /, 'tes ').replace(/^L’/, 'ton '); }
  /* Où ce corps a déjà parlé : les notes du jour passées et les schémas */
  function dejaCorps(corps, sauf) {
    var l = [], NJ = D.etat.notesJour || {};
    Object.keys(NJ).sort().reverse().forEach(function (k) { if (k === sauf) return; if ((NJ[k].corps || []).indexOf(corps) >= 0) l.push({ t: 'le ' + dateCourte(k) + ', dans ta note du jour' }); });
    (D.etat.schemas || []).forEach(function (x) { if ((x.corps || []).indexOf(corps) >= 0) l.push({ t: 'dans ton schéma « ' + x.nom + ' »', sc: x.id }); });
    return l;
  }
  function tiensCorps(corpsL, sauf, rejoindre) {
    for (var i = 0; i < corpsL.length; i++) {
      var c = corpsL[i]; if (c === 'Je ne sens rien') continue;
      var d = dejaCorps(c, sauf); if (!d.length) continue;
      return bulleTiens('Tiens… tu as déjà senti ça dans ' + tonCorps(c) + '.', '<p>' + esc(cap(liste(d.slice(0, 3).map(function (x) { return x.t; })))) + '.</p>' + (rejoindre ? d.filter(function (x) { return x.sc; }).slice(0, 2).map(function (x) { return '<button type="button" class="pa-bt clair" data-rejoindre="' + esc(x.sc) + '">Ça rejoint « ' + esc(trouverSchema(x.sc).nom) + ' »</button>'; }).join('') : ''));
    }
    return '';
  }
  /* La note du jour, en une minute */
  function blocNoteJour(dt) {
    var k = iso(dt), NJ = (D.etat.notesJour = D.etat.notesJour || {}), n = NJ[k] || {}, hm = (D.etat.humeurs || {})[k] || [], S = PF.SCHEMA || {};
    var h = '<section class="pa-carte pa-note-j"><p class="pa-etiq">Ma note du jour · 1 minute</p>' +
      '<p class="pa-lab">Mon corps</p>' + puces('nj-corps', PF.CORPS || [], n.corps || [], true) + puces('nj-sens', PF.SENSATIONS || [], n.sens || [], true) + '<div id="pa-nj-tiens">' + tiensCorps(n.corps || [], k) + '</div>' +
      '<label for="pa-nj-pense">Mes pensées</label><input id="pa-nj-pense" data-nj="pense" maxlength="160" value="' + esc(n.pense || '') + '" placeholder="Ce qui tourne dans ma tête aujourd’hui">' +
      '<p class="pa-lab">Mon émotion</p>' + puces('humeur', PF.HUMEURS || [], hm, true) +
      '<p class="pa-lab">Ce que j’ai fait</p>' + puces('nj-fait', [['habitude', 'Ma réaction habituelle'], ['nouveau', 'Mon nouveau geste']], [n.fait || ''], false) + '<input data-nj="faitT" maxlength="160" value="' + esc(n.faitT || '') + '" placeholder="En quelques mots" aria-label="Ce que j’ai fait, en quelques mots">' +
      (D.etat.schemas || []).filter(function (x) { return x.observer && joursDepuis(x.observer) < 7 && !x.classe; }).map(function (x) { return '<label for="pa-nj-obs-' + esc(x.id) + '">J’observe « ' + esc(x.nom) + ' » : qu’as-tu fait quand ça s’est montré ?</label><input id="pa-nj-obs-' + esc(x.id) + '" data-nj="obs-' + esc(x.id) + '" maxlength="160" value="' + esc(n['obs-' + x.id] || '') + '" placeholder="Je me suis tu·e, j’ai souri, je suis parti·e…">'; }).join('') +
      ((D.etat.schemas || []).length ? '<label for="pa-nj-sc">Ça rejoint un schéma ? <small>(facultatif)</small></label><select id="pa-nj-sc" data-nj="schema"><option value="">Non</option>' + D.etat.schemas.map(function (x) { return '<option value="' + esc(x.id) + '"' + (n.schema === x.id ? ' selected' : '') + '>' + esc(cap(x.nom)) + '</option>'; }).join('') + '</select>' : '') +
      '<div class="pa-outils"><button type="button" class="pa-bt clair" data-reve="new">J’ai rêvé cette nuit</button></div>' +
      '<div class="pa-note-ok"><button type="button" class="pa-bt or" data-nj-ok>Je note</button><span data-nj-msg aria-live="polite"></span></div>';
    var pi = rapprochements(k);
    if (pi.length) h += '<div class="pa-pistes"><p class="pa-etiq">Des rapprochements · une piste, pas une preuve</p><ul class="pa-echos">' + pi.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>';
    return h + '<p class="pa-discret" data-sauve>' + esc(texteSauve()) + '</p></section>';
  }
  function rapprochements(k) {
    var NJ = D.etat.notesJour || {}, HU = D.etat.humeurs || {}, l = [], jours = Object.keys(NJ).concat(Object.keys(HU)).filter(function (v, i, a) { return a.indexOf(v) === i; }).sort().slice(-21);
    var cz = {}; jours.forEach(function (j) { ((NJ[j] || {}).corps || []).forEach(function (c) { cz[c] = (cz[c] || 0) + 1; }); });
    Object.keys(cz).forEach(function (c) { if (cz[c] >= 3) l.push(c + ' revient ' + cz[c] + ' fois ces trois dernières semaines.'); });
    var JSN = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'], wd = {};
    jours.forEach(function (j) { var d = dateComplete(j); if (!d) return; var w = new Date(d.a, d.m - 1, d.j).getDay(); (HU[j] || []).forEach(function (e) { var c = e + '|' + w; wd[c] = (wd[c] || 0) + 1; }); });
    Object.keys(wd).forEach(function (c) { if (wd[c] >= 2) { var p = c.split('|'); l.push(p[0] + ' revient le ' + JSN[+p[1]] + '.'); } });
    var hm = HU[k] || [], F = (D.fil && D.fil.personnes) || {};
    Object.keys(F).forEach(function (id) { if (id === 'toi') return; (F[id].etapes || []).forEach(function (e) { (e.em || []).forEach(function (x) { if (hm.some(function (y) { return x.toLowerCase().indexOf(y.toLowerCase()) >= 0; })) l.push(x + ', comme ' + nomFil(id) + (e.age ? ', à ' + e.age + ' ans' : '') + (e.evt ? ' (« ' + e.evt + ' »)' : '') + '.'); }); }); });
    var pense = String((NJ[k] || {}).pense || '').toLowerCase(), mots = pense.split(/[^a-zà-ÿ’']+/).filter(function (w) { return w.length > 4; });
    if (mots.length) (D.etat.schemas || []).forEach(function (x) { var t = String((x.pensee || '') + ' ' + (x.croyance || '')).toLowerCase(); if (mots.some(function (w) { return t.indexOf(w) >= 0; })) l.push('Ta pensée d’aujourd’hui ressemble à celle de ton schéma « ' + x.nom + ' ».'); });
    var rv = (D.etat.reves || []).map(function (v) { return String(v.texte || '').toLowerCase(); }), cm = {};
    rv.forEach(function (t) { t.split(/[^a-zà-ÿ’']+/).filter(function (w) { return w.length > 4; }).filter(function (v, i, a) { return a.indexOf(v) === i; }).forEach(function (w) { cm[w] = (cm[w] || 0) + 1; }); });
    Object.keys(cm).forEach(function (w) { if (cm[w] >= 2) l.push('Le mot « ' + w + ' » revient dans ' + cm[w] + ' de tes rêves.'); });
    return l.filter(function (v, i, a) { return a.indexOf(v) === i; }).slice(0, 4);
  }
  function espacesLiens(cl) {
    return '<a class="' + cl + '" href="login.html">Mon compte</a>' + (D.cercle ? '<a class="' + cl + '" href="cercle.html">Le Cercle</a>' : '') + (D.pro ? '<a class="' + cl + '" href="pro.html">Genesolia Pro</a>' : '') + '<a class="' + cl + '" href="genosociogramme.html">Mon arbre</a>';
  }
  function garderReperes(e) {
    e.preventDefault();
    var pr = document.getElementById('pa-pr').value.trim(), nom = document.getElementById('pa-nom').value.trim(), dn = document.getElementById('pa-dn').value, err = document.querySelector('#pa-reperes .pa-erreur');
    if (!pr || !/^\d{4}-\d{2}-\d{2}$/.test(dn)) { err.textContent = 'Il manque tes prénoms ou ta date de naissance.'; return; }
    D.naissance = dn; D.prenoms = pr; D.nom = nom; D.prenom = pr.split(/\s+/)[0];
    if (!EXEMPLE && sb && D.user && window.GenesoliaReperes) window.GenesoliaReperes.enregistrer(sb, D.user, { prenoms: pr, nom: nom, date: dn });
    else ecrireL('genesolia-guide', { prenom: D.prenom, prenoms: pr, nom: nom, date: dn });
    vueMoi();
  }

  /* ── Les aides « Je ne sais pas » : des relances au lieu d'une case vide ── */
  function aide(h, titre) { return '<details class="pa-aide"><summary>' + esc(titre || 'Je ne sais pas') + '</summary><div class="pa-aide-c">' + h + '</div></details>'; }
  function debuts(l, cible) { return '<div class="pa-debuts">' + l.map(function (t) { return '<button type="button" data-debut="' + esc(t) + '" data-cible="' + cible + '">' + esc(t) + '</button>'; }).join('') + '</div>'; }
  var AIDE_EM = '<p>Commence par où tu le sens :</p><ul class="pa-echos"><li>Serré dans la gorge : souvent une tristesse, ou des mots retenus.</li><li>Noué dans le ventre : souvent une peur.</li><li>Chaud dans la poitrine, les mâchoires, les poings : souvent une colère.</li><li>Le visage qui chauffe, l’envie de disparaître : souvent une honte.</li><li>Lourd sur les épaules : souvent une fatigue, ou trop de choses portées.</li><li>Vide, froid : souvent une solitude.</li></ul><p class="pa-discret">Tu peux aussi écrire juste « mal » ou « pas bien » : c’est déjà un début.</p>';
  function aideCorps() { return '<p>Un scan de 20 secondes : ferme les yeux, descends de la tête aux pieds. Où c’est différent ?</p><button type="button" class="pa-bt clair" data-scan>Faire le scan avec moi</button><p class="pa-scan" aria-live="polite"></p><p class="pa-discret">« Je ne sens rien » est une vraie réponse : beaucoup de gens sont coupés de leur corps. Ça revient avec le temps.</p>'; }
  var scanM = null;
  function scan(b) {
    var z = b.parentNode.querySelector('.pa-scan'), l = ['Ferme les yeux, respire.', 'Ta tête, ton visage…', 'Ta gorge, ta nuque…', 'Tes épaules, ta poitrine…', 'Ton ventre…', 'Ton dos…', 'Tes jambes, tes pieds…', 'Où c’était différent ? Touche-le dans la liste.'];
    clearTimeout(scanM); b.disabled = true;
    (function pas(k) { if (!document.body.contains(z)) return; z.textContent = l[k]; if (k < l.length - 1) scanM = setTimeout(function () { pas(k + 1); }, 2700); else b.disabled = false; })(0);
  }
  document.addEventListener('click', function (e) {
    var d = e.target.closest('[data-debut]');
    if (d) { var c = document.querySelector(d.getAttribute('data-cible')); if (c) { c.value = c.value.trim() ? c.value.trim() + ' ' + d.getAttribute('data-debut') : d.getAttribute('data-debut'); c.focus(); c.dispatchEvent(new Event('input', { bubbles: true })); } return; }
    var sb2 = e.target.closest('[data-scan]'); if (sb2) scan(sb2);
  });
  function pucesBl(nom, choisis, multi) { var P = PF.BLESSURES_P || {}; return puces(nom, (PF.BLESSURES || []).map(function (b) { return [b[0], (P[b[0]] ? '« ' + P[b[0]] + ' » · ' : '') + b[1].toLowerCase()]; }), choisis, multi); }
  function blocMonte() { var M = (PF.ACTIONS || []).filter(function (x) { return x.id === 'monte'; })[0] || { etapes: [] }; return '<div class="pa-fort"><p><b>C’est fort.</b> Avant tout, reviens ici et maintenant.</p>' + sphereResp() + '<ol>' + M.etapes.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ol><p>On remplit le reste plus tard : dépose juste ces quelques mots, ta fiche se complétera les jours suivants.</p>' + (M.securite ? '<p class="pa-discret">' + esc(M.securite) + '</p>' : '') + '</div>'; }

  /* ── Déposer un ressenti : un mode rapide en 3 questions, le reste plus tard ── */
  function ouvrirDepot(schemaId) {
    var z = feuille('<p class="pa-etiq">Je dépose un ressenti</p><h2>Qu’est-ce qui se passe ?</h2><p class="pa-def">Trois questions suffisent. Le reste se complète les jours suivants : ta fiche te montre ce qui manque.</p>' +
      '<form class="pa-form" id="pa-depot" novalidate><label for="pa-quoi">1 · Ce qui s’est passé, en quelques mots</label><textarea id="pa-quoi" maxlength="1500" placeholder="Ce matin, quand…"></textarea>' +
      aide(debuts(['Aujourd’hui, quand…', 'J’ai senti…', 'J’aurais voulu…'], '#pa-quoi') + '<p class="pa-discret">Trois mots suffisent.</p>') +
      '<p class="pa-lab">2 · Ce que tu ressens</p>' + puces('em', PF.EMOTIONS || [], [], true) + aide(AIDE_EM) +
      '<p class="pa-lab">3 · Où le sens-tu dans ton corps ?</p>' + puces('corps', PF.CORPS || [], [], true) + '<div id="pa-dep-tiens"></div>' + aide(aideCorps()) +
      '<label for="pa-force">Avec quelle force ? <b id="pa-force-v">5</b>/10</label><input type="range" id="pa-force" min="0" max="10" value="5"><div id="pa-fort-z" hidden>' + blocMonte() + '</div>' +
      ((D.etat.schemas || []).length ? '<label for="pa-schema">Ça rejoint quel schéma ?</label><select id="pa-schema"><option value="nouveau">Un nouveau schéma</option>' + (D.etat.schemas || []).map(function (x) { return '<option value="' + esc(x.id) + '">' + esc(cap(x.nom || 'Un schéma')) + '</option>'; }).join('') + '</select><p class="pa-discret">Un schéma, c’est ce qui se répète : il relie tes ressentis qui se ressemblent.</p>' : '<input type="hidden" id="pa-schema" value="nouveau">') +
      '<details class="pa-plus-loin" id="pa-plus"><summary>Aller plus loin maintenant <small>(facultatif)</small></summary>' +
      '<p class="pa-lab">Une phrase que tu te dis ? <small>(la blessure qui se réveille)</small></p>' + pucesBl('bl', [], true) +
      '<p class="pa-lab">Comment le sens-tu ?</p>' + puces('sensation', PF.SENSATIONS || [], [], true) +
      '<p class="pa-lab">Ce que tu fais à chaque fois</p>' + puces('reaction', (PF.SCHEMA || {}).reactions || [], [], true) +
      '<p class="pa-lab">Est-ce que ça revient dans ta vie ?</p>' + puces('revient', [['oui', 'Oui, souvent'], ['parfois', 'Parfois'], ['non', 'C’est la première fois']], [], false) +
      '<label for="pa-premiere">La première fois, tu avais quel âge ? <small>(à peu près)</small></label><input id="pa-premiere" inputmode="numeric" maxlength="12" placeholder="8 ans">' +
      '<div class="pa-puces pa-exemples"><button type="button" data-age-inconnu aria-pressed="false">Je ne sais pas : le protocole va m’aider à le trouver</button></div>' +
      '<div id="pa-ages-z" hidden><label for="pa-ages">Et les autres fois ?</label><input id="pa-ages" maxlength="60" placeholder="15 ans, 31 ans…"></div>' +
      '<label for="pa-phrase">Une phrase qui tourne dans ta tête ?</label><input id="pa-phrase" maxlength="120" placeholder="On finit toujours par…">' + aide(debuts(['Je vais encore…', 'On finit toujours par…', 'Je ne suis pas assez…', 'Personne ne…'], '#pa-phrase')) +
      '<label class="pa-coche"><input type="checkbox" id="pa-afil" checked> Ajouter ce moment à mon fil d’or</label></details>' +
      '<p class="pa-erreur" role="alert"></p></form>', { libelle: 'Déposer', enregistrer: function () { var fm = document.getElementById('pa-depot'); if (fm) { if (fm.requestSubmit) fm.requestSubmit(); else fm.dispatchEvent(new Event('submit', { cancelable: true })); } return false; } });
    var f = z.querySelector('#pa-depot');
    if (schemaId) f.querySelector('#pa-schema').value = schemaId; else if (!(D.etat.schemas || []).length) f.querySelector('#pa-schema').value = 'nouveau';
    var ageInconnu = f.querySelector('[data-age-inconnu]');
    ageInconnu.addEventListener('click', function () { ageInconnu.setAttribute('aria-pressed', ageInconnu.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); });
    /* à 8 sur 10 ou plus : d'abord revenir au calme */
    f.querySelector('#pa-force').addEventListener('input', function (e) { f.querySelector('#pa-force-v').textContent = e.target.value; var fo = +e.target.value >= 8, zz = f.querySelector('#pa-fort-z'); if (fo && zz.hidden) { zz.hidden = false; f.querySelector('#pa-plus').open = false; } else if (!fo) zz.hidden = true; });
    f.addEventListener('change', function (e) { if (e.target.closest('[data-groupe="corps"]')) f.querySelector('#pa-dep-tiens').innerHTML = tiensCorps(lirePuces(f, 'corps'), '', !!f.querySelector('select#pa-schema')); });
    f.addEventListener('click', function (e) { var rj = e.target.closest('[data-rejoindre]'); if (rj) { var se = f.querySelector('select#pa-schema'); if (se) { se.value = rj.getAttribute('data-rejoindre'); rj.textContent = '✓ C’est noté'; } } });
    f.addEventListener('change', function () { var rv = lirePuces(f, 'revient')[0]; f.querySelector('#pa-ages-z').hidden = !(rv === 'oui' || rv === 'parfois'); });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var quoi = f.querySelector('#pa-quoi').value.trim(), em = lirePuces(f, 'em');
      if (!quoi && !em.length) { f.querySelector('.pa-erreur').textContent = 'Écris quelques mots ou choisis ce que tu ressens.'; return; }
      var r = { id: 'r' + Date.now().toString(36), date: iso(new Date()), quoi: quoi, em: em, bl: lirePuces(f, 'bl'), force: +f.querySelector('#pa-force').value, corps: lirePuces(f, 'corps'), revient: lirePuces(f, 'revient')[0] || '', ages: f.querySelector('#pa-ages').value.trim(), phrase: f.querySelector('#pa-phrase').value.trim(), sensation: lirePuces(f, 'sensation'), reaction: lirePuces(f, 'reaction'), premiere: f.querySelector('#pa-premiere').value.trim(), etape: 0, intuition: {}, enquete: { q: {} } };
      if (f.querySelector('#pa-afil').checked) ajouterAuFil(r);
      D.etat.ressentis.push(r);
      var sv = f.querySelector('#pa-schema').value;
      var sc = sv === 'nouveau' || !trouverSchema(sv) ? creerSchema(r) : trouverSchema(sv); lierSchema(sc, r);
      sauver();
      if (ageInconnu.getAttribute('aria-pressed') === 'true' && !premiereDe(sc)) { flash = ''; location.hash = 'actions/vie/' + sc.id + '/age'; return; }
      if (r.force >= 8) { flash = 'C’est gardé. Le reste peut attendre : tu as le temps.'; ouvrirSchema(sc.id, 'voir'); return; }
      flash = 'C’est gardé.';
      ouvrirSchema(sc.id, 'ou');
    });
  }

  /* ── Le schéma : le cœur de l'appli ──
     Un schéma suit les 5 étapes (Voir, Où est-elle, Libérer, L'intention, Réapprendre) et avance dans les 9 étapes du cycle
     (de l'Émergence à la Renaissance) selon ce qui est fait :
     1 Émergence : un ressenti déposé · 2 Initiation : la première fois sur la frise de vie · 3 Rencontre avec l'ombre : le lien avec la lignée regardé
     4 Épreuves : la mémoire de ta vie libérée (et quand ça revient plus fort) · 5 Lâcher l'ancien : la mémoire de la lignée libérée
     6 Transformation : l'intention posée · 7 Élévation : note de 5 · 8 Transmission : note de 8 · 9 Renaissance : 10/10, devenu spirale. */
  var ONGLETS_S = [['voir', 'Voir', [0]], ['ou', 'Où est-elle ?', [1, 2]], ['liberer', 'Libérer', [3, 4]], ['intention', 'L’intention', [5]], ['reapprendre', 'Réapprendre', [6, 7, 8]]];
  function trouverSchema(id) { var l = D.etat.schemas || []; for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i]; return null; }
  function ressentisDe(sc) { return D.etat.ressentis.filter(function (r) { return r.schema === sc.id; }).sort(function (a, b) { return a.date < b.date ? -1 : 1; }); }
  function couleurBl(b) { return ((PF.SCHEMA || {}).couleurs || {})[b] || '#B98A55'; }
  function completerSchema(sc) { if (sc.geste === undefined) sc.geste = null; return completerSchema0(sc); }
  function completerSchema0(sc) { ['fois', 'lignee', 'actions', 'suivis', 'domaines', 'corps', 'sensation', 'reactions', 'rolesSortir'].forEach(function (k) { if (!Array.isArray(sc[k])) sc[k] = []; }); if (!sc.fois.length && sc.premiere) sc.fois.push({ age: String(sc.premiere), premiere: true }); return sc; }
  /* Le nom proposé : ce qui se répète (la peur, la blessure), pas l'émotion. Il reste modifiable. */
  function nomPropose(r) {
    var NM = PF.NOMS || {}, em = r.em || [], bl = (r.bl || [])[0];
    if (em.indexOf('Peur de manquer') >= 0) return NM['Peur de manquer'];
    if (bl && NM[bl]) return NM[bl];
    for (var i = 0; i < em.length; i++) if (NM[em[i]]) return NM[em[i]];
    return 'ce qui se répète';
  }
  function creerSchema(r) {
    var sc = completerSchema({ id: 's' + Date.now().toString(36), cree: iso(new Date()), nom: nomPropose(r), cycle: '', cycleSug: cycleSuggere(r) || '', blessure: (r.bl || [])[0] || '', pensee: '', croyance: '', profond: '' });
    D.etat.schemas = D.etat.schemas || []; D.etat.schemas.push(sc); return sc;
  }
  /* Un ressenti rejoint un schéma : ce qui manque est complété, rien n'est écrasé */
  function lierSchema(sc, r) {
    if (!sc || !r) return; completerSchema(sc); r.schema = sc.id;
    function plus(cle, val) { (val || []).forEach(function (v) { if (sc[cle].indexOf(v) < 0) sc[cle].push(v); }); }
    plus('corps', r.corps); plus('sensation', r.sensation); plus('reactions', r.reaction);
    if (!sc.blessure && (r.bl || [])[0]) sc.blessure = r.bl[0];
    if (!sc.pensee && r.phrase) sc.pensee = r.phrase;
    if (!sc.cycle && !sc.cycleSug) sc.cycleSug = cycleSuggere(r) || '';
    if (r.premiere && ageNum(r.premiere) != null && !premiereDe(sc)) { sc.fois = sc.fois.filter(function (f) { return !(f.premiere && !f.age && !f.quoi); }); sc.fois.unshift({ age: String(ageNum(r.premiere)), premiere: true, quoi: '' }); }
    var ag = ageA(new Date(r.date)); if (ag != null && sc.fois.length < 10 && !sc.fois.some(function (f) { return ageNum(f.age) === ag; })) sc.fois.push({ age: String(ag), quoi: String(r.quoi || '').slice(0, 120), date: r.date, declencheur: true });
    if (sc.classe) { sc.classe = ''; sc.revenu = iso(new Date()); }   /* ça revient : on rouvre le dossier, en couche profonde */
  }
  /* La première fois trouvée (avec un âge), ou « avant mes souvenirs » */
  function premiereDe(sc) { return sc.fois.filter(function (f) { return f.premiere && ageNum(f.age) != null; })[0] || null; }
  function premiereOk(sc) { return !!(premiereDe(sc) || sc.avantSouvenirs); }
  function prochaineLune(sc) { if (!sc.intentionPosee) return ''; var auj = iso(new Date()); return lunesApres(sc.intentionPosee, 14).filter(function (d) { return d >= auj; })[0] || ''; }
  /* La jauge de compréhension : 9 parties, et ce qui manque, en clair */
  function jaugeDe(sc) {
    var RV = (D.etat.reves || []).filter(function (v) { return v.schema === sc.id; }).length;
    var parts = [['ton corps', 'voir', sc.corps.length || sc.sensation.length], ['tes pensées', 'voir', sc.pensee], ['tes comportements', 'voir', sc.reactions.length || sc.comportement], ['la première fois', 'ou', premiereOk(sc)], ['les autres fois', 'ou', sc.fois.length >= 2], ['ta lignée', 'ou', sc.lignee.length || sc.liaison === 'aucune'], ['la croyance de famille', 'ou', sc.croyance], ['tes rêves', 'voir', RV || sc.pasDeReve], ['la couche profonde', 'voir', sc.profond]];
    return { n: parts.filter(function (x) { return !!x[2]; }).length, manque: parts.filter(function (x) { return !x[2]; }) };
  }
  /* La compréhension en mots (pas un second « sur 9 », qui se confondrait avec l'étape) */
  function motsJauge(n) { return n >= 9 ? 'complète' : n >= 7 ? 'presque complète' : n >= 4 ? 'en cours' : n >= 1 ? 'commencée' : 'à commencer'; }
  function pctJauge(n) { return Math.round(n / 9 * 100) + ' %'; }
  function blocJauge(sc) {
    var j = jaugeDe(sc);
    return '<div class="pa-jauge-c"><p class="pa-etiq">Ta compréhension · ' + motsJauge(j.n) + ' (' + pctJauge(j.n) + ')</p><div class="pa-jauge9">' + [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (k) { return '<i class="' + (k < j.n ? 'ok' : '') + '"></i>'; }).join('') + '</div>' +
      (j.manque.length ? '<p>Il manque ' + esc(liste(j.manque.map(function (x) { return x[0]; }))) + '.</p>' : '<p>Ta fiche est complète : tu peux libérer en profondeur.</p>') + '<p class="pa-discret">Plus tu es précis·e, plus la libération va loin.</p></div>';
  }
  function noteDe(sc) { var s = sc.suivis || []; return s.length ? +s[s.length - 1].note || 0 : null; }
  function etapeDe(sc) {
    var e = 0, n = noteDe(sc) || 0;
    if (premiereOk(sc)) e = 1;
    if (sc.lignee.length || sc.liaison === 'aucune') e = Math.max(e, 2);
    if (sc.libVie) e = Math.max(e, 3);
    if (sc.libLignee || (sc.libVie && sc.liaison === 'aucune')) e = Math.max(e, 4);
    if (sc.intentionPosee) e = Math.max(e, 5);
    if (sc.intentionPosee && n >= 5) e = 6;
    if (sc.intentionPosee && n >= 8) e = 7;
    if (sc.classe) e = 8;
    if (sc.revenu && !sc.classe && !(sc.libVie2 && sc.libVie2 >= sc.revenu)) e = 3;
    return e;
  }
  function statutDe(sc) { return sc.classe ? 'classe' : sc.intentionPosee ? 'suivi' : (sc.libVie || sc.libLignee) ? 'liberation' : 'comprendre'; }
  function nomStatut(k) { var l = (PF.SCHEMA || {}).statuts || []; for (var i = 0; i < l.length; i++) if (l[i][0] === k) return l[i][1]; return ''; }
  function libreDeux(sc) { return !!(sc.libVie && (sc.libLignee || sc.liaison === 'aucune')); }
  /* La prochaine chose à faire, et l'onglet où la faire */
  function prochaine(sc) {
    if (sc.revenu && !sc.classe && !(sc.libVie2 && sc.libVie2 >= sc.revenu)) return ['liberer', 'Ça revient plus fort : regarde la couche profonde'];
    if (!premiereOk(sc)) return ['ou', 'Trouve la première fois sur ta frise de vie'];
    if (!sc.libVie) return ['liberer', 'Libère la mémoire de ta vie'];
    if (!sc.lignee.length && sc.liaison !== 'aucune') return ['ou', 'Regarde ta frise familiale : qui l’a vécu avant toi ?'];
    if (!sc.libLignee && sc.liaison !== 'aucune') return ['liberer', 'Libère la mémoire de ta lignée'];
    if (!sc.intentionPosee) return ['intention', 'Pose ton intention'];
    if (sc.classe) return ['reapprendre', 'Devenu spirale'];
    return ['reapprendre', 'Note ton suivi : as-tu géré ?'];
  }
  function carteSchema(sc) {
    completerSchema(sc);
    var R = ressentisDe(sc), st = statutDe(sc), e = etapeDe(sc), n = noteDe(sc), pr = prochaine(sc), NE = (PF.SCHEMA || {}).neuf || [];
    return '<button type="button" class="pa-carte pa-schema" data-schema="' + esc(sc.id) + '" data-onglet-s="' + pr[0] + '" style="--bl:' + couleurBl(sc.blessure) + '"><span class="pa-etiq">' + esc(nomStatut(st)) + ' · étape ' + (e + 1) + ' sur 9 · ' + esc((NE[e] || [''])[0]) + '</span>' +
      '<b>' + esc(cap(sc.nom || 'Un schéma')) + '</b>' + neufPoints(e) +
      '<span class="pa-ligne"><span class="pa-em">' + (sc.blessure ? '<i class="pa-bl" style="background:' + couleurBl(sc.blessure) + '"></i>' + esc(cap(sc.blessure)) + ' · ' : '') + (R.length ? R.length : 'aucun') + ' ressenti' + (R.length > 1 ? 's' : '') + (n != null ? ' · ' + n + '/10' : ' · compréhension ' + motsJauge(jaugeDe(sc).n)) + '</span></span>' +
      (sc.classe ? '' : '<span class="pa-proch">' + esc(pr[1]) + '</span>') + '</button>';
  }
  function neufPoints(e) { return '<span class="pa-neuf" aria-label="Étape ' + (e + 1) + ' sur 9">' + [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (k) { return '<i class="' + (k < e ? 'fait' : k === e ? 'ici' : '') + '"></i>'; }).join('') + '</span>'; }

  /* La frise : une ligne pour toi, une ligne par personne de ta lignée, par âge. sc : un schéma (ou null pour tout voir) */
  function lignesFrise(sc) {
    var moi = [], fam = {}, ordre = [];
    function famille(cle, nom, gen) { if (!fam[cle]) { fam[cle] = { nom: nom, gen: gen, pts: [] }; ordre.push(cle); } return fam[cle]; }
    var S = sc ? [sc] : (D.etat.schemas || []).filter(function (x) { return !x.classe; });
    S.forEach(function (x) {
      completerSchema(x);
      x.fois.forEach(function (f) { var a = ageNum(f.age); if (a != null) moi.push({ a: a, t: f.quoi || (f.premiere ? 'La première fois' : ''), p: f.perso, c: couleurBl(x.blessure), fort: f.premiere }); });
      x.lignee.forEach(function (l) { var a = ageNum(l.age), q = l.qui ? personne(l.qui) : null; if (a == null) return; famille(l.qui || 'libre:' + (l.nomLibre || ''), q ? nomL(q) : l.nomLibre || 'Quelqu’un de ma lignée', q ? q.gen : 3).pts.push({ a: a, t: l.quoi || '', p: l.perso, c: couleurBl(x.blessure), fort: true, tiroir: l.tiroir }); });
    });
    if (!sc) {
      var F = (D.fil && D.fil.personnes) || {};
      Object.keys(F).forEach(function (id) { (F[id].etapes || []).forEach(function (e) { var a = ageNum(e.age); if (a == null || !plein(e)) return; var c = (e.bl || [])[0] ? couleurBl(e.bl[0]) : '#C9B6C4'; if (id === 'toi') moi.push({ a: a, t: e.evt || '', c: c, fil: true }); else { var p = personneDuFil(id); famille(p ? p.k : 'f:' + id, p ? nomL(p) : nomFil(id), p ? p.gen : (BASE_FIL[id] || [0, 1])[1]).pts.push({ a: a, t: e.evt || '', c: c, fil: true }); } }); });
      var P = (D.arbre && D.arbre.people) || {}, me = moiDeLArbre();
      Object.keys(P).forEach(function (k) { if (me && k === me.id) return; (P[k].events || []).forEach(function (e) { var a = ageNum(e.age); if (a == null || !EVT[e.type]) return; var p = personne('a:' + k); famille('a:' + k, p ? nomL(p) : prenom1(P[k]), p ? p.gen : 1).pts.push({ a: a, t: EVT[e.type], c: '#C9B6C4', gen: true }); }); });
    } else {
      /* le fil d'or s'inscrit aussi sur la frise familiale : les moments des personnes liées */
      sc.lignee.forEach(function (l) { if (!l.qui) return; var F2 = (D.fil && D.fil.personnes) || {}; Object.keys(F2).forEach(function (id) { var p = personneDuFil(id); if (!p || p.k !== l.qui) return; (F2[id].etapes || []).forEach(function (e) { var a = ageNum(e.age); if (a != null && plein(e)) famille(l.qui, nomL(p), p.gen).pts.push({ a: a, t: e.evt || '', c: '#C9B6C4' }); }); }); });
    }
    /* un même moment noté deux fois (fiche et fil d'or) ne s'affiche qu'une fois, en gardant le personnage */
    function unique(l) { var o = []; l.forEach(function (p) { var tp = String(p.t).toLowerCase(), d = o.filter(function (q) { var tq = String(q.t).toLowerCase(); return q.a === p.a && (tq === tp || (tp && tq && (tq.indexOf(tp) === 0 || tp.indexOf(tq) === 0))); })[0]; if (d && String(p.t).length > String(d.t).length) d.t = p.t; if (d) { if (p.p && !d.p) d.p = p.p; if (p.fort) d.fort = true; } else o.push(p); }); return o; }
    /* les mots de l'arbre (« un deuil », « un effacement ») cèdent la place au moment raconté au même âge */
    /* et un moment du fil d'or cède la place au même âge noté dans un schéma */
    function sansGenerique(l) {
      l = l.filter(function (p) { return !p.fil || !l.some(function (q) { return !q.fil && !q.gen && q.a === p.a; }); });
      l = l.filter(function (p) { return !p.gen || !l.some(function (q) { return !q.gen && Math.abs(q.a - p.a) <= 3; }); });
      return l.filter(function (p, i) { return !p.gen || !l.some(function (q, j) { return j < i && q.gen && q.a === p.a; }); });
    }
    moi = sansGenerique(unique(moi)); ordre.forEach(function (k) { fam[k].pts = sansGenerique(unique(fam[k].pts)); });
    return { moi: moi, fam: ordre.map(function (k) { return fam[k]; }).sort(function (x, y) { return x.gen - y.gen; }) };
  }
  function frise(sc, famille) {
    var L = lignesFrise(sc), age = ageA(new Date()), rows = [{ nom: D.prenom || 'Toi', pts: L.moi, toi: true }].concat(famille === false ? [] : L.fam);
    var max = 60; rows.forEach(function (r) { r.pts.forEach(function (p) { if (p.a > max) max = p.a; }); }); if (age != null && age > max) max = age; max = Math.min(100, Math.ceil((max + 5) / 10) * 10);
    var mn = 999, mx = age != null ? age : 0; rows.forEach(function (r) { r.pts.forEach(function (p) { if (p.a < mn) mn = p.a; if (p.a > mx) mx = p.a; }); }); if (mn === 999) mn = mx;
    /* la frise d'un schéma : l'échelle se resserre pour que la première fois et aujourd'hui tiennent ensemble à l'écran */
    var X = sc ? Math.max(7, Math.min(26, Math.round(190 / (mx - mn + 4)))) : 26, G = 24, T = 44;
    function court(t) { t = String(t || ''); return t.length > 24 ? t.slice(0, 23) + '…' : t; }
    /* le placement des textes : au-dessus, en dessous, puis un cran plus loin, pour que rien ne se chevauche */
    var deux = false;
    rows.forEach(function (r) {
      var der = [-999, -999, -999, -999];
      r.pts = r.pts.slice().sort(function (u, v) { return u.a - v.a; });
      r.pts.forEach(function (p) { var x = G + p.a * X, n = -1; for (var k = 0; k < 4; k++) if (x - der[k] >= 175) { n = k; break; } if (n < 0) { n = 0; for (var k2 = 1; k2 < 4; k2++) if (der[k2] < der[n]) n = k2; } der[n] = x; p.niv = n; if (n > 1) deux = true; });
    });
    var H = deux ? 150 : 92, Y0 = deux ? 58 : 18, W = G + max * X + 90, Ht = rows.length * H + T;
    var s = '<svg width="' + W + '" height="' + Ht + '" viewBox="0 0 ' + W + ' ' + Ht + '" class="pa-frise-svg" style="width:' + W + 'px;height:' + Ht + 'px;max-width:none" role="img" aria-label="Ta frise, par âge">';
    for (var a = 0; a <= max; a += 5) s += '<line x1="' + (G + a * X) + '" y1="' + (T - 16) + '" x2="' + (G + a * X) + '" y2="' + (Ht - 18) + '" stroke="' + (a % 10 ? '#F8EEF2' : '#F1E3E8') + '"/>' + (a % 10 ? '' : '<text x="' + (G + a * X) + '" y="' + (Ht - 4) + '" text-anchor="middle" class="pa-fr-age">' + a + ' ans</text>');
    rows.forEach(function (r, i) { var y = i * H + T + Y0; s += '<line x1="' + G + '" y1="' + y + '" x2="' + (W - 10) + '" y2="' + y + '" stroke="' + (r.toi ? '#E2C48E' : '#EBD3DC') + '" stroke-width="' + (r.toi ? 3 : 1.5) + '"/>'; });
    L.moi.forEach(function (m) { rows.forEach(function (r, i) { if (r.toi) return; r.pts.forEach(function (p) { if (Math.abs(p.a - m.a) <= 2) s += '<line x1="' + (G + m.a * X) + '" y1="' + (T + Y0) + '" x2="' + (G + p.a * X) + '" y2="' + (i * H + T + Y0) + '" stroke="#B0507A" stroke-width="1.4" stroke-dasharray="4 4" opacity=".5"/>'; }); }); });
    if (age != null) s += '<line x1="' + (G + age * X) + '" y1="' + (T - 22) + '" x2="' + (G + age * X) + '" y2="' + (Ht - 18) + '" stroke="#9A3A68" stroke-width="1.5"/><rect x="' + (G + age * X - 34) + '" y="2" width="68" height="18" rx="9" fill="#9A3A68"/><text x="' + (G + age * X) + '" y="15" text-anchor="middle" class="pa-fr-ici">tu es ici</text>';
    rows.forEach(function (r, i) {
      var y = i * H + T + Y0;
      r.pts.forEach(function (p) {
        var x = G + p.a * X; s += '<circle cx="' + x + '" cy="' + y + '" r="' + (p.fort ? 8 : 6) + '" fill="' + p.c + '" stroke="#fff" stroke-width="2"><title>' + esc(p.a + ' ans' + (p.t ? ' · ' + p.t : '') + (p.p ? ' · ' + p.p : '')) + '</title></circle>';
        var haut = p.niv % 2 === 0, loin = p.niv > 1, ty = haut ? y - 14 - (loin ? 28 : 0) : y + 24 + (loin ? 28 : 0);
        if (p.t) s += '<text x="' + x + '" y="' + ty + '" text-anchor="middle" class="pa-fr-t">' + esc(court(p.t)) + '</text>';
        if (p.p) s += '<text x="' + x + '" y="' + (haut ? ty - 13 : ty + 13) + '" text-anchor="middle" class="pa-fr-t perso">« ' + esc(court(p.p)) + ' »</text>';
      });
    });
    s += '</svg>';
    return '<div class="pa-frise-b"><div class="pa-fr-noms" style="padding-top:' + T + 'px">' + rows.map(function (r) { return '<span' + (r.toi ? ' class="toi"' : '') + ' style="height:' + H + 'px;padding-top:' + (Y0 - 8) + 'px">' + esc(r.nom) + '</span>'; }).join('') + '</div><div class="pa-fr-defil" data-ici="' + (G + (age != null ? age : mx) * X) + '" data-min="' + (G + mn * X) + '" data-max="' + (G + mx * X) + '">' + s + '</div></div><p class="pa-discret">Fais glisser la frise de côté pour voir toute ta vie. Touche un point pour lire tout le texte.</p>';
  }

  /* La fiche d'un schéma, en 5 onglets */
  function ouvrirSchema(id, ong) {
    var sc = trouverSchema(id); if (!sc) return; completerSchema(sc);
    ong = ong || prochaine(sc)[0];
    /* la première fois a toujours sa place, en haut de la frise de vie, même vide */
    if (!sc.fois.some(function (f) { return f.premiere; }) && !sc.avantSouvenirs) sc.fois.unshift({ age: '', premiere: true });
    var S = PF.SCHEMA || {}, e = etapeDe(sc), NE = S.neuf || [], h = '';
    h += '<p class="pa-etiq">Mon schéma · ' + esc(nomStatut(statutDe(sc))) + '</p><input class="pa-titre-in" data-s="nom" maxlength="80" value="' + esc(sc.nom || '') + '" aria-label="Le nom de ton schéma"><p class="pa-nom-aide">Le nom de ce qui se répète. Touche-le pour le changer.</p>' +
      '<div class="pa-neuf-b"><p><b>Étape ' + (e + 1) + ' sur 9 · ' + esc((NE[e] || [''])[0]) + '</b> · ' + esc((NE[e] || ['', ''])[1]) + '</p>' + neufPoints(e) + '</div>' +
      '<div class="pa-onglets-s" role="tablist">' + ONGLETS_S.map(function (o) { var fait = o[2][o[2].length - 1] < e, ici = o[2].indexOf(e) >= 0; return '<button type="button" role="tab" data-ong="' + o[0] + '" aria-selected="' + (o[0] === ong) + '" class="' + (fait ? 'fait' : ici ? 'ici' : '') + '">' + esc(o[1]) + '<small>' + (o[2].length > 1 ? 'étapes ' + (o[2][0] + 1) + ' à ' + (o[2][o[2].length - 1] + 1) : 'étape ' + (o[2][0] + 1)) + '</small></button>'; }).join('') + '</div>' +
      (function () { var o = ONGLETS_S.filter(function (x) { return x[0] === ong; })[0]; return '<p class="pa-def">Cet onglet couvre ' + o[2].map(function (k) { return (k + 1) + '. ' + (NE[k] || [''])[0]; }).join(', ') + '.</p>'; })() + '<p class="pa-conf">' + esc(PF.CONFIANCE || '') + '</p><div class="pa-ong-c">';
    if (ong === 'voir') {
      var R = ressentisDe(sc);
      h += blocJauge(sc);
      h += '<div class="pa-bloc"><h4>Tes ressentis</h4>' + (R.length ? '<ul class="pa-liste">' + R.map(function (r) { return '<li><span class="pa-pastille">' + (dateComplete(r.date) || {}).j + '</span><span><b>' + esc(dateCourte(r.date)) + '</b> · ' + esc((r.em || []).join(', ').toLowerCase()) + '<br><small>' + esc(String(r.quoi || '').slice(0, 140)) + '</small></span></li>'; }).join('') + '</ul>' : '') + '<button type="button" class="pa-bt clair" data-depot-s="' + esc(sc.id) + '">Ça recommence : je dépose un ressenti</button></div>';
      h += '<div class="pa-bloc"><h4>Cycle et blessure</h4>' + puces('s-cycle', [['racine', 'Cycle 1'], ['coeur', 'Cycle 2'], ['deux', 'Les deux']], [sc.cycle], false) + (!sc.cycle && sc.cycleSug ? '<p class="pa-discret">Proposé : ' + (sc.cycleSug === 'racine' ? 'cycle 1' : sc.cycleSug === 'coeur' ? 'cycle 2' : 'les deux cycles') + ', à vérifier. C’est toi qui sens.</p>' : '') + '<p class="pa-lab">La phrase que tu te dis</p><div class="pa-puces pa-bls" data-groupe="s-bl">' + (PF.BLESSURES || []).map(function (b) { return '<button type="button" data-v="' + b[0] + '" aria-pressed="' + (sc.blessure === b[0]) + '" style="--bl:' + couleurBl(b[0]) + '"><i class="pa-bl" style="background:' + couleurBl(b[0]) + '"></i>' + esc(((PF.BLESSURES_P || {})[b[0]] ? '« ' + PF.BLESSURES_P[b[0]] + ' » · ' : '') + b[1].toLowerCase()) + '</button>'; }).join('') + '</div></div>';
      h += '<div class="pa-bloc"><h4>Les domaines de ta vie</h4>' + puces('s-dom', S.domaines || [], sc.domaines, true) + '</div>';
      h += '<div class="pa-bloc"><h4>Ton corps</h4>' + puces('s-corps', PF.CORPS || [], sc.corps, true) + '<p class="pa-lab">Comment</p>' + puces('s-sens', PF.SENSATIONS || [], sc.sensation, true) + aide(aideCorps()) + '</div>';
      h += '<div class="pa-bloc"><h4>Tes pensées et tes gestes</h4>' + champS('pensee', 'La phrase qui tourne', sc.pensee, 'On finit toujours par me laisser') + aide('<p>Elle est si familière qu’on ne l’entend plus. Commence par :</p>' + debuts(['Je vais encore…', 'On finit toujours par…', 'Je ne suis pas assez…', 'Personne ne…'], '#pa-s-pensee')) +
        '<p class="pa-lab">Ce que tu fais à chaque fois</p>' + puces('s-reac', S.reactions || [], sc.reactions, true) +
        aide('<p>On voit mal ses propres réactions, et on se juge. Demande-toi : <b>que dirait ta meilleure amie que tu fais</b>, quand ça arrive ?</p>' + (sc.observer && joursDepuis(sc.observer) < 7 ? '<p>✓ Tu observes depuis le ' + esc(dateCourte(sc.observer)) + ' : la question est dans ta note du jour.</p>' : '<button type="button" class="pa-bt clair" data-observer>Je vais observer pendant une semaine</button><p class="pa-discret">La question s’ajoute à ta note du jour pendant 7 jours.</p>')) + '</div>';
      var RVa = D.etat.reves || [];
      h += '<div class="pa-bloc"><h4>Tes rêves liés</h4>' + (RVa.length ? '<div class="pa-puces" data-groupe="s-reves">' + RVa.map(function (v) { return '<button type="button" data-v="' + esc(v.id) + '" aria-pressed="' + (v.schema === sc.id) + '">' + esc(dateCourte(v.date) + ' · ' + String(v.texte || 'un rêve').slice(0, 34)) + '</button>'; }).join('') + '</div>' : '') +
        '<div class="pa-outils"><button type="button" class="pa-bt clair" data-reve-s="' + esc(sc.id) + '">Je note un rêve pour ce schéma</button>' + (!RVa.some(function (v) { return v.schema === sc.id; }) ? '<button type="button" class="pa-lien-s" data-pas-reve aria-pressed="' + !!sc.pasDeReve + '">' + (sc.pasDeReve ? '✓ ' : '') + 'Pas de rêve lié pour l’instant</button>' : '') + '</div></div>';
      if ((sc.prises || []).length) h += '<div class="pa-bloc"><h4>Tes prises de conscience</h4><ul class="pa-liste">' + sc.prises.slice().reverse().map(function (x) { return '<li><span class="pa-pastille or">✦</span><span><b>' + esc(dateCourte(x.date)) + '</b>' + (x.source ? ' · ' + esc(x.source) : '') + '<br><small>' + esc(x.texte) + '</small></span></li>'; }).join('') + '</ul></div>';
      h += '<div class="pa-bloc"><h4>La couche profonde</h4><p class="pa-def">Trois marches, doucement. Tu peux t’arrêter où tu veux.</p>' + zoneS('profond1', '1 · Et si ça arrivait ?', sc.profond1, 'S’il partait vraiment…') + zoneS('profond2', '2 · Et alors, qu’est-ce que ça voudrait dire de toi ?', sc.profond2, 'Que je ne vaux pas qu’on reste…') + zoneS('profond', '3 · Et le pire, ce serait ?', sc.profond, 'Être seul·e pour toujours…') + '</div>';
    } else if (ong === 'ou') {
      h += '<div class="pa-bloc pa-grande-q"><h4>La question</h4><p>' + esc(PF.QUESTION || '') + '</p></div>' + blocJauge(sc);
      h += '<div class="pa-bloc"><h4>1 · Ma frise de vie</h4><p class="pa-def">La première fois que tu as ressenti ça, puis toutes les autres fois (10 au plus). Donne un nom à ce qui se joue, « la Petite fille », « l’Invisible », pour le regarder de l’extérieur.</p>' + frise(sc, false) +
        aide('<p>Des personnages possibles : ' + esc(((S.personnages || []).slice(0, 13)).join(', ')) + '. Invente le tien si aucun ne va.</p>', 'Des exemples de personnages') +
        sc.fois.map(function (f, k) { return blocFois(f, k, sc); }).join('') + (sc.fois.length < 10 ? '<button type="button" class="pa-bt clair" data-fois-ajout>Ajouter une autre fois</button>' : '<p class="pa-discret">Tu as noté 10 fois : c’est assez pour voir la boucle.</p>') +
        aide('<p>On ne pense qu’aux gros événements. Parcours ta vie par domaine :</p><ul class="pa-echos"><li>En couple, avec qui ça s’est déjà rejoué ?</li><li>Au travail, à l’école ?</li><li>Avec tes amis, ta famille ?</li><li>Avec l’argent ?</li>' + (sc.corps.length ? '<li>Où as-tu déjà senti ' + esc(sc.corps[0].toLowerCase()) + (sc.sensation[0] ? ' ' + esc(sc.sensation[0].toLowerCase()) : '') + ', exactement comme ça ?</li>' : '') + '</ul>', 'Je ne trouve pas d’autres fois') + '</div>';
      h += '<div class="pa-bloc"><h4>2 · Ma frise familiale</h4><p class="pa-def">Regarde si quelqu’un de ta lignée a vécu la même chose. Les moments de ton fil d’or s’y inscrivent aussi.</p>' + (sc.liaison === 'elevee' ? '<p class="pa-securite">Tu travailles sur la famille qui t’a élevé·e : ce qu’on t’a transmis compte aussi, par les gestes, les phrases, les silences. Ajoute ces personnes avec leur prénom.</p>' : '') + (sc.lignee.length ? frise(sc) : '') +
        sc.lignee.map(function (l, k) { return blocLignee(l, k); }).join('') + '<div class="pa-outils"><button type="button" class="pa-bt clair" data-t-de-schema>Mettre en scène dans Mon théâtre</button><button type="button" class="pa-bt clair" data-lg-ajout>C’est lié à quelqu’un</button>' + (!sc.lignee.length ? '<button type="button" class="pa-lien-s" data-liaison-aucune aria-pressed="' + (sc.liaison === 'aucune') + '">' + (sc.liaison === 'aucune' ? '✓ ' : '') + 'Je ne vois personne pour l’instant</button>' : '') + '</div>' +
        aide('<p>Regarder n’est pas accuser : tu cherches ce qui se répète, pas un coupable.</p><ul class="pa-echos"><li>Qui, dans ta famille, réagit comme toi ?</li><li>Qui disait la même phrase que toi ?</li></ul><p>Des questions à poser à tes proches :</p><ul class="pa-echos">' + ((PF.QUESTIONS || {})[sc.cycle === 'racine' ? 'racine' : 'coeur'] || []).slice(0, 3).concat((PF.BLESSURE_Q || {})[sc.blessure] ? [PF.BLESSURE_Q[sc.blessure]] : []).map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') + '</ul>' +
          '<p>Tu ne connais pas ta famille (adoption, rupture, décès, secrets) ?</p><button type="button" class="pa-bt clair" data-liaison-elevee aria-pressed="' + (sc.liaison === 'elevee') + '">' + (sc.liaison === 'elevee' ? '✓ ' : '') + 'Je ne connais pas ma lignée</button>') +
        champS('croyance', 'La phrase qu’on entendait dans ta famille', sc.croyance, 'L’argent, ça ne pousse pas sur les arbres') + aide('<p>Elle semble normale, donc invisible. Commence par :</p>' + debuts(['Chez nous, on…', 'Les hommes sont…', 'Les femmes sont…', 'L’argent, c’est…', 'L’amour, c’est…', 'Il ne faut jamais…'], '#pa-s-croyance')) + '</div>';
    } else if (ong === 'liberer') {
      var pf = premiereDe(sc), lq = sc.lignee[0] && sc.lignee[0].qui ? personne(sc.lignee[0].qui) : null, jg = jaugeDe(sc);
      if (jg.n < 9) h += '<div class="pa-verrou"><p><b>Comprendre avant de libérer.</b> Ta compréhension est ' + motsJauge(jg.n) + ' (' + pctJauge(jg.n) + ') : il manque ' + esc(liste(jg.manque.map(function (x) { return x[0]; }))) + '.</p><div class="pa-outils">' + ['voir', 'ou'].filter(function (o) { return jg.manque.some(function (x) { return x[1] === o; }); }).map(function (o) { return '<button type="button" class="pa-bt clair" data-ong="' + o + '">Compléter « ' + (o === 'voir' ? 'Voir' : 'Où est-elle ?') + ' »</button>'; }).join('') + '</div></div>';
      var scT = sceneDuSchema(sc.id), dl = [sc.libVie, sc.libLignee, sc.libVie2].filter(Boolean).sort().pop();
      if (scT && dl && !(scT.poidsMaj && scT.poidsMaj >= dl)) h += '<div class="pa-bloc pa-tiens-c"><h4>Et ce lien, il pèse comment maintenant ?</h4><p>Tu as libéré une mémoire le ' + esc(dateCourte(dl)) + '. Regarde ta scène « ' + esc(scT.titre) + ' » : un lien s’est peut-être affiné.</p><a class="pa-bt or" href="#theatre/' + esc(scT.id) + '" data-ferme>Ouvrir ma scène</a></div>';
      if (sc.revenu && !(sc.libVie2 && sc.libVie2 >= sc.revenu)) h += '<div class="pa-bloc pa-grande-q"><h4>Ça revient plus fort</h4><p>Ce n’est pas un retour en arrière : c’est une couche plus profonde qui se montre.</p><a class="pa-bt or" href="#actions/profond" data-ferme>Ouvrir « La couche profonde »</a> <button type="button" class="pa-bt nuit" data-lib="libVie2">C’est fait</button></div>';
      h += '<p class="pa-image">' + esc(PF.IMAGE || '') + ' <a class="pa-monte-l" href="#actions/monte" data-ferme>Si ça monte fort</a></p>';
      h += pf || sc.avantSouvenirs ? carteLib('vie', '1 · La mémoire de ma vie', pf ? 'La première fois, à ' + ageNum(pf.age) + ' ans' + (pf.qui ? ', avec ' + pf.qui : '') + '.' : 'Avant tes souvenirs : la mémoire vient sans doute de ta lignée, ou de ta venue au monde.', sc.libVie, 'libVie', jg.n >= 9, sc.id)
        : '<div class="pa-carte-lib"><p class="pa-etiq">1 · La mémoire de ma vie</p><p>Ta première fois n’est pas encore trouvée. Le protocole peut t’aider à la laisser venir : l’âge que tu te sens, une scène, même floue.</p><div class="pa-outils"><a class="pa-bt or" href="#actions/vie/' + esc(sc.id) + '/age" data-ferme>Trouver ma première fois avec le protocole</a><button type="button" class="pa-bt clair" data-ong="ou">Je m’en souviens : je la note</button></div></div>';
      h += sc.liaison === 'aucune' && !sc.lignee.length ? '<p class="pa-discret">Tu n’as vu personne dans ta lignée pour l’instant : tu peux passer à l’intention. Si quelqu’un te vient plus tard, ajoute-le dans « Où est-elle ? ».</p>'
        : carteLib('lignee', '2 · La mémoire de ma lignée', lq ? nomL(lq) + (sc.lignee[0].age ? ', à ' + sc.lignee[0].age + ' ans' : '') + '.' : 'Regarde d’abord ta frise familiale.', sc.libLignee, 'libLignee', jg.n >= 9, sc.id);
      h += blocGeste(sc);
    } else if (ong === 'intention') {
      if (!libreDeux(sc)) h += '<p class="pa-discret pa-verrou">L’intention se pose une fois les deux libérations faites (ta vie, puis ta lignée). Tu peux déjà l’écrire.</p>';
      h += '<div class="pa-bloc"><a class="pa-bt clair" href="#actions/intention" data-ferme>Comment poser une intention</a></div>';
      var PB = (PF.PAR_BLESSURE || {})[sc.blessure] || {};
      h += '<div class="pa-bloc"><h4>Ce que je veux à la place</h4>' + zoneS('aLaPlace', 'À la place de ' + (sc.nom || 'ce schéma') + ', je veux…', sc.aLaPlace, PB.place || 'La sécurité, une vie entourée…') + '<p class="pa-neg" data-neg-pour="aLaPlace"' + (negatif(sc.aLaPlace) ? '' : ' hidden') + '>Dis ce que tu veux à la place, plutôt que ce que tu ne veux plus : « je reste calme » plutôt que « je n’ai plus peur ».</p></div>';
      h += '<div class="pa-bloc"><h4>Mes gestes</h4><p class="pa-def">Des petits gestes concrets, dans le sens de ce que tu veux à la place.</p>' + sc.actions.map(function (x, k) { return '<label class="pa-coche"><input type="checkbox" data-act="' + k + '"' + (x.fait ? ' checked' : '') + '> ' + esc(x.t) + '</label>'; }).join('') + '<div class="pa-note"><input type="text" id="pa-act-t" maxlength="120" placeholder="' + esc((PB.gestes || ['Dire oui à une invitation'])[0]) + '…"><button type="button" class="pa-bt" style="margin:0" data-act-ajout>Ajouter</button></div></div>';
      if (sc.intentionPosee) h += '<div class="pa-posee"><div class="pa-graine"></div><p class="pa-etiq">Intention posée le ' + esc(dateCourte(sc.intentionPosee)) + '</p><p class="pa-phrase">' + esc(sc.intention || '') + '</p><p class="pa-discret">Elle revient à la nouvelle lune du ' + esc(dateCourte(prochaineLune(sc))) + '.</p></div>';
      else h += '<div class="pa-bloc"><h4>Mon intention</h4>' + zoneS('intention', 'Au présent, comme si c’était déjà vrai', sc.intention, PB.intention || 'Je suis en sécurité, ici et maintenant.') + '<p class="pa-neg" data-neg-pour="intention"' + (negatif(sc.intention) ? '' : ' hidden') + '>Dis ce que tu veux à la place : une intention s’écrit au positif. Par exemple : « ' + esc(PB.intention || 'Je suis en sécurité, ici et maintenant.') + ' »</p>' + sphereResp() + '<button type="button" class="pa-tenir" data-tenir aria-label="Garder appuyé pour poser mon intention"' + (libreDeux(sc) ? '' : ' disabled') + '><i></i><span>' + (libreDeux(sc) ? 'Garder appuyé' : 'Après les deux libérations') + '</span></button></div>';
    } else if (ong === 'reapprendre') {
      var n = noteDe(sc), lu = prochaineLune(sc);
      h += '<div class="pa-jauge-note"><div><b>' + (n != null ? n : '·') + '</b><span>' + (n != null ? '/10' : 'pas encore noté') + '</span></div><p>' + (sc.classe ? 'Devenu spirale le ' + esc(dateCourte(sc.classe)) + '. Si ça revient plus fort, tu peux rouvrir le dossier.' : 'Ta note, c’est toi qui la donnes : où en es-tu de cette libération ? À 10, ton schéma devient spirale.') + '</p></div>';
      if (lu) h += '<p class="pa-discret">Ton intention revient à la nouvelle lune du ' + esc(dateCourte(lu)) + '.</p>';
      h += '<div class="pa-bloc"><h4>Les rôles dont je veux sortir</h4>' + puces('s-roles', S.roles || [], sc.rolesSortir, true) + '</div>';
      if (sc.classe) h += '<button type="button" class="pa-bt or" data-revient>Ça revient plus fort : je rouvre</button>';
      else if (!libreDeux(sc)) h += '<div class="pa-verrou"><p><b>Le suivi commence après tes deux libérations</b> (ta vie, puis ta lignée). Tu peux déjà choisir les rôles dont tu veux sortir.</p><div class="pa-outils"><button type="button" class="pa-bt clair" data-ong="liberer">Aller à « Libérer »</button></div></div>';
      else h += '<div class="pa-bloc pa-suivi-f"><h4>Mon suivi</h4>' +
        '<p class="pa-lab">Y a-t-il eu une répétition ?</p>' + puces('sv-rep', [['oui', 'Oui'], ['non', 'Non']], [], false) +
        '<div id="pa-sv-oui" hidden><div class="pa-securite"><b>Ce n’est pas un retour en arrière.</b> Une répétition après une libération, c’est souvent une couche plus profonde qui se montre. <a class="pa-monte-l" href="#actions/profond/' + esc(sc.id) + '" data-ferme>Ouvrir « La couche profonde »</a></div><label for="pa-sv-quand">Quand</label><input id="pa-sv-quand" type="date" value="' + iso(new Date()) + '"><label for="pa-sv-qui">Avec qui</label><input id="pa-sv-qui" maxlength="80">' +
        '<p class="pa-lab">Ce que ton corps a senti</p>' + puces('sv-corps', (PF.CORPS || []).concat(PF.SENSATIONS || []), [], true) +
        '<label for="pa-sv-pense">Ce que tu as pensé à ce moment-là</label><input id="pa-sv-pense" maxlength="160">' +
        '<label for="pa-sv-fait">Ce que tu as fait</label><input id="pa-sv-fait" maxlength="160">' +
        '<p class="pa-lab">Le rôle que tu as pris</p>' + puces('sv-role', (S.roles || []).concat([['aucun', 'Aucun, je suis resté·e moi-même']]), [], false) +
        '<p class="pa-lab">As-tu géré ?</p>' + puces('sv-gere', [['oui', 'Oui'], ['non', 'Pas encore']], [], false) + '</div>' +
        '<label for="pa-sv-note">Ta note de libération : <b id="pa-sv-note-v">' + (n != null ? n : 5) + '</b>/10</label><input type="range" id="pa-sv-note" min="0" max="10" value="' + (n != null ? n : 5) + '">' +
        '<ul class="pa-reperes">' + (PF.NOTE || []).map(function (x) { return '<li><b>' + x[0] + '</b> ' + esc(x[1]) + '</li>'; }).join('') + '</ul>' +
        '<button type="button" class="pa-bt or" data-sv-ok>Noter mon suivi</button></div>';
      var scR = sceneDuSchema(sc.id);
      h += '<div class="pa-bloc"><h4>Ta scène, avant et après</h4>' + (scR ? ((scR.photos || []).length ? '<div class="pa-photos">' + [scR.photos[0]].concat(scR.photos.length > 1 ? [scR.photos[scR.photos.length - 1]] : []).map(function (ph, k) { return '<figure>' + miniScene(ph.moi, ph.places) + '<figcaption><b>' + (k ? 'Après' : 'Avant') + ' · ' + esc(dateCourte(ph.date)) + '</b>' + esc(ph.note || '') + '</figcaption></figure>'; }).join('') + '</div>' : '<p class="pa-discret">Garde une photo de ta scène avant de libérer, puis une après : tu verras ce qui a bougé.</p>') + '<button type="button" class="pa-bt clair" data-t-photo-sc="' + esc(scR.id) + '">Garder une photo de la scène maintenant</button>' : '<p class="pa-discret">Mets ce schéma en scène pour voir, avant et après, ce qui bouge dans tes liens.</p><button type="button" class="pa-bt clair" data-t-de-schema>Mettre en scène dans Mon théâtre</button>') + '</div>';
      if (sc.suivis.length) h += '<div class="pa-bloc"><h4>Mon chemin</h4><ul class="pa-liste">' + sc.suivis.slice().reverse().map(function (x) { return '<li><span class="pa-pastille' + (x.gere === 'oui' ? ' or' : '') + '">' + x.note + '</span><span><b>' + esc(dateCourte(x.date)) + '</b> · ' + esc(x.rep === 'oui' ? 'répétition' + (x.qui ? ' avec ' + x.qui : '') + (x.gere === 'oui' ? ', gérée' : ', pas encore gérée') : 'pas de répétition') + (x.pense || x.fait ? '<br><small>' + esc([x.pense, x.fait].filter(Boolean).join(' · ')) + '</small>' : '') + '</span></li>'; }).join('') + '</ul></div>';
    }
    h += '</div><p class="pa-actions"><button type="button" class="pa-lien-s" data-s-suppr>Supprimer ce schéma</button></p>';
    var io = ONGLETS_S.map(function (x) { return x[0]; }).indexOf(ong), suiv = ONGLETS_S[io + 1];
    var z = feuille(h, { cle: 'sc:' + sc.id + ':' + ong, suite: suiv ? ['Enregistrer et continuer', function () { ouvrirSchema(sc.id, suiv[0]); }] : ['Enregistrer et fermer', function () { fermerFeuille(); }] });
    var sel = z.querySelector('.pa-onglets-s [aria-selected="true"]'); if (sel && sel.scrollIntoView) { var bar = sel.parentNode; bar.scrollLeft = sel.offsetLeft - bar.clientWidth / 2 + sel.clientWidth / 2; }
    brancherSchema(z, sc, ong);
  }
  function libFois(f) { return f.premiere ? 'La première fois' : f.declencheur || f.date ? (f.date === iso(new Date()) ? 'Aujourd’hui · le déclencheur' : 'Le déclencheur · ' + dateCourte(f.date)) : 'Une autre fois'; }
  function blocFois(f, k, sc) {
    var inconnu = f.premiere && ageNum(f.age) == null;
    return '<div class="pa-fiche-f' + (f.premiere ? ' pa-prem' : '') + '"><p class="pa-lab">' + esc(libFois(f)) + '</p>' +
      (inconnu ? '<p class="pa-q-age">À quel âge as-tu vécu ça la première fois ?</p><a class="pa-bt or pa-inconnu" href="#actions/vie/' + esc(sc.id) + '/age" data-ferme>Je ne sais pas : le protocole va m’aider à le trouver</a>' + aide(cheminsPremiere(sc), 'Je préfère chercher par moi-même') : '') + '<div class="pa-deux-c"><div><label>Âge</label><input data-fo="' + k + '" data-c="age" inputmode="numeric" maxlength="10" placeholder="8 ans" value="' + esc(f.age || '') + '"></div><div><label>Avec qui</label><input data-fo="' + k + '" data-c="qui" maxlength="80" placeholder="Mon père, mon amie…" value="' + esc(f.qui || '') + '"></div></div>' +
      '<label>Le contexte</label><input data-fo="' + k + '" data-c="contexte" maxlength="140" placeholder="Où, quand, ce qui se passait autour" value="' + esc(f.contexte || '') + '"><label>Ce qui s’est passé</label><input data-fo="' + k + '" data-c="quoi" maxlength="140" placeholder="Il est parti, on s’est moqué de moi…" value="' + esc(f.quoi || '') + '">' +
      '<label>Son personnage <small>(facultatif)</small></label>' + persoChamp('fo', k, f.perso) + '<button type="button" class="pa-lien-s" data-fo-suppr="' + k + '">Retirer</button></div>';
  }
  /* Les chemins pour retrouver la première fois, un par un */
  function cheminsPremiere(sc) {
    var cs = sc.corps[0] ? sc.corps[0].toLowerCase() + (sc.sensation[0] ? ' ' + sc.sensation[0].toLowerCase() : '') : 'cette sensation';
    var PER = [['4', 'à la maternelle', 'Maternelle'], ['8', 'en primaire', 'Primaire'], ['12', 'au collège', 'Collège'], ['15', 'à l’adolescence', 'Adolescence'], ['17', 'au premier amour', 'Premier amour'], ['20', 'au premier travail', 'Premier travail']];
    return '<ol class="pa-chemins"><li><b>L’âge ressenti</b>Quand ça t’arrive, tu te sens quel âge ? C’est souvent la porte la plus directe. Écris-le dans « Âge ».</li>' +
      '<li><b>Par le corps</b>Quand as-tu senti exactement ' + esc(cs) + ', plus jeune ?</li>' +
      '<li><b>Par périodes</b>Est-ce que ça existait déjà à cette période ?<div class="pa-debuts">' + PER.map(function (x) { return '<button type="button" data-periode="' + x[0] + '" data-ctx="' + esc(x[1]) + '">' + esc(x[2]) + '</button>'; }).join('') + '</div></li>' +
      '<li><b>Par lieux et personnes</b>La maison d’enfance, l’école, les vacances. Qui était là ?</li>' +
      '<li><b>Ce qu’on t’a raconté</b>Qu’est-ce qu’on t’a dit de ta naissance, de tes premières années ?</li>' +
      '<li><b>Avant mes souvenirs</b>C’est une vraie réponse : la mémoire vient sans doute de ta lignée, ou de ta venue au monde.<br><button type="button" class="pa-bt clair" data-avant-souv aria-pressed="' + !!sc.avantSouvenirs + '">' + (sc.avantSouvenirs ? '✓ ' : '') + 'C’est avant mes souvenirs</button></li>' +
      '<li><b>Laisser venir</b>' + (sc.attenteSouvenir ? 'Dans 3 jours, l’appli te demandera si un souvenir est revenu. Tes rêves rattachés à ce schéma peuvent aussi l’apporter.' : 'Tu peux attendre : l’appli te demandera dans 3 jours si un souvenir est revenu.<br><button type="button" class="pa-bt clair" data-attente-souv>Je ne sais pas encore</button>') + '</li></ol>' +
      '<p class="pa-discret">Tu n’as pas besoin de la date exacte. Un âge à peu près, une scène floue, c’est déjà assez.</p>';
  }
  function joursDepuis(k) { var d = dateComplete(k); if (!d) return 999; return Math.floor((Date.now() - new Date(d.a, d.m - 1, d.j).getTime()) / 864e5); }
  function blocLignee(l, k) {
    var S = PF.SCHEMA || {};
    return '<div class="pa-fiche-f"><label>Qui</label><select data-lg="' + k + '" data-c="qui"><option value="">Quelqu’un de ma lignée</option>' + personnes().map(function (p) { return '<option value="' + esc(p.k) + '"' + (l.qui === p.k ? ' selected' : '') + '>' + esc(nomL(p)) + '</option>'; }).join('') + '</select>' +
      '<label>À quel âge</label><input data-lg="' + k + '" data-c="age" inputmode="numeric" maxlength="10" placeholder="32 ans" value="' + esc(l.age || '') + '">' +
      '<label>Comment tu le sais</label><div class="pa-puces" data-groupe="lg-' + k + '">' + (S.tiroirs || []).map(function (t) { return '<button type="button" data-v="' + t[0] + '" aria-pressed="' + (l.tiroir === t[0]) + '">' + esc(t[1]) + '</button>'; }).join('') + '</div>' +
      (!l.qui ? '<label>Ou son prénom <small>(si elle ou il n’est pas dans la liste)</small></label><input data-lg="' + k + '" data-c="nomLibre" maxlength="60" placeholder="Tante Marie, mon parrain…" value="' + esc(l.nomLibre || '') + '">' : '') +
      '<label>Ce qu’elle ou il a vécu</label><input data-lg="' + k + '" data-c="quoi" maxlength="140" placeholder="Son divorce, la guerre, la faillite…" value="' + esc(l.quoi || '') + '"><label class="pa-coche"><input type="checkbox" data-lg-lourd="' + k + '"' + (l.lourd ? ' checked' : '') + '> C’est une histoire très lourde</label>' + (l.lourd ? '<p class="pa-securite">Certaines histoires se travaillent mieux accompagné·e. Tu peux avancer ici à ton rythme, et en parler à un·e professionnel·le de l’accompagnement si c’est trop lourd à porter seul·e.</p>' : '') + '<label>Son personnage <small>(facultatif)</small></label>' + persoChamp('lg', k, l.perso) + '<button type="button" class="pa-lien-s" data-lg-suppr="' + k + '">Retirer</button></div>';
  }
  function persoChamp(t, k, v) { return '<input data-' + t + '="' + k + '" data-c="perso" maxlength="40" placeholder="la Victime, la Peur, la Petite fille…" value="' + esc(v || '') + '" list="pa-persos">'; }
  /* Le geste, à faire sous 48 heures, puis « Tu as fait ton geste ? » dans l'appli (aucun e-mail) */
  function gesteDu(sc) { var g = sc.geste; if (!g || g.fait || !g.cree) return false; var d = dateComplete(g.cree); return d && (Date.now() - new Date(d.a, d.m - 1, d.j).getTime()) >= 2 * 864e5; }
  function blocGeste(sc) {
    var Lb = PF.LIBERER || {}, g = sc.geste;
    if (!sc.libVie && !sc.libLignee) return '';
    if (g && g.t) {
      var h = '<div class="pa-bloc pa-geste"><h4>Ton geste dans les 48 heures</h4><p style="margin:0 0 .4rem">« ' + esc(g.t) + ' » · prévu le ' + esc(dateCourte(g.date)) + '</p>';
      if (g.fait) return h + '<p style="margin:0">✓ Fait. ' + esc(g.ressenti ? 'Ce que tu as ressenti : ' + g.ressenti : '') + '</p></div>';
      if (gesteDu(sc)) return h + '<p style="margin:0 0 .4rem"><b>Tu as fait ton geste ? Qu’as-tu ressenti ?</b></p><textarea data-s-geste="ressenti" maxlength="400" placeholder="Ce que j’ai senti dans mon corps, ce qui a changé…">' + esc(g.ressenti || '') + '</textarea><div class="pa-outils"><button type="button" class="pa-bt or" data-geste-fait="oui">Oui, je l’ai fait</button><button type="button" class="pa-bt nuit" data-geste-fait="non">Pas encore</button></div></div>';
      return h + '<p class="pa-discret" style="color:#F3DCC0">Dans 48 heures, l’appli te demandera comment ça s’est passé.</p></div>';
    }
    var PB = (PF.PAR_BLESSURE || {})[sc.blessure], idees = PB ? PB.gestes.map(function (x) { return [x, x]; }) : (Lb.gestes || []).map(function (x) { return [x[1], x[0] + ' : ' + x[1].toLowerCase()]; });
    return '<div class="pa-bloc pa-geste"><h4>Ton geste dans les 48 heures</h4><p style="margin:0 0 .5rem">Un petit acte concret, dans le sens de ce que tu veux à la place : c’est lui qui ancre la libération dans ton corps. <b>Petit, et faisable en 48 heures</b> : mieux vaut un geste minuscule que tu fais qu’un grand que tu repousses.</p>' +
      '<div class="pa-puces pa-exemples">' + idees.map(function (x) { return '<button type="button" data-geste-idee="' + esc(x[0]) + '">' + esc(x[1]) + '</button>'; }).join('') + '</div>' +
      '<label for="pa-geste-t" style="color:#fff">Mon geste</label><input id="pa-geste-t" maxlength="140"><label for="pa-geste-d" style="color:#fff">Le jour</label><input id="pa-geste-d" type="date" value="' + iso(new Date(Date.now() + 864e5)) + '"><button type="button" class="pa-bt or" data-geste-ok>Je m’engage</button></div>';
  }
  function carteLib(id, titre, texte, fait, cle, pret, sid) {
    return '<div class="pa-carte-lib' + (fait ? ' fait' : '') + '"><p class="pa-etiq">' + esc(titre) + '</p><p>' + esc(texte) + '</p><div class="pa-outils"><a class="pa-bt' + (fait || pret === false ? ' clair' : ' or') + '" href="#actions/' + id + (sid ? '/' + esc(sid) : '') + '" data-ferme>Ouvrir le protocole</a><button type="button" class="pa-bt ' + (fait ? 'clair' : 'nuit') + '" data-lib="' + cle + '">' + (fait ? '✓ Fait le ' + esc(dateCourte(fait)) : 'C’est fait') + '</button></div></div>';
  }
  function brancherSchema(z, sc, ong) {
    function rouvrir() { ouvrirSchema(sc.id, ong); }
    z.addEventListener('input', function (e) {
      var t = e.target, k = t.getAttribute('data-s'); if (k) { sc[k] = t.value; var ng = z.querySelector('[data-neg-pour="' + k + '"]'); if (ng) ng.hidden = !negatif(t.value); sauver(); return; }
      if (t.getAttribute('data-s-geste') && sc.geste) { sc.geste.ressenti = t.value; sauver(); return; }
      var fo = t.getAttribute('data-fo'); if (fo != null) { sc.fois[+fo][t.getAttribute('data-c')] = t.value; sauver(); return; }
      var lg = t.getAttribute('data-lg'); if (lg != null && t.tagName === 'INPUT') { sc.lignee[+lg][t.getAttribute('data-c')] = t.value; sauver(); return; }
      if (t.id === 'pa-sv-note') z.querySelector('#pa-sv-note-v').textContent = t.value;
    });
    z.addEventListener('change', function (e) {
      var t = e.target;
      var lg = t.getAttribute('data-lg'); if (lg != null && t.tagName === 'SELECT') { sc.lignee[+lg].qui = t.value; sauver(); return; }
      var lo = t.getAttribute('data-lg-lourd'); if (lo != null) { sc.lignee[+lo].lourd = t.checked; sauver(); rouvrir(); return; }
      var ac = t.getAttribute('data-act'); if (ac != null) { sc.actions[+ac].fait = t.checked ? iso(new Date()) : ''; sauver(); return; }
      var g = t.closest('[data-groupe]'); if (!g) return;
      var n = g.getAttribute('data-groupe'), v = lirePuces(z, n);
      if (n === 'sv-rep') { z.querySelector('#pa-sv-oui').hidden = v[0] !== 'oui'; return; }
      if (/^sv-/.test(n)) return;
      if (n === 's-cycle') sc.cycle = v[0] || '';
      else if (n === 's-bl') sc.blessure = v[0] || '';
      else if (n === 's-dom') sc.domaines = v;
      else if (n === 's-corps') sc.corps = v;
      else if (n === 's-sens') sc.sensation = v;
      else if (n === 's-reac') sc.reactions = v;
      else if (n === 's-roles') sc.rolesSortir = v;
      else if (n === 's-reves') (D.etat.reves || []).forEach(function (x) { if (v.indexOf(x.id) >= 0) x.schema = sc.id; else if (x.schema === sc.id) delete x.schema; });
      else if (/^lg-/.test(n)) sc.lignee[+n.slice(3)].tiroir = v[0] || '';
      sauver();
    });
    z.addEventListener('click', function (e) {
      var o = e.target.closest('[data-ong]'); if (o) { ouvrirSchema(sc.id, o.getAttribute('data-ong')); return; }
      if (e.target.closest('[data-ferme]')) { fermerFeuille(); return; }
      var tps = e.target.closest('[data-t-photo-sc]'); if (tps) { photoApres = tps.getAttribute('data-t-photo-sc'); fermerFeuille(); location.hash = 'theatre/' + photoApres; return; }
      if (e.target.closest('[data-t-de-schema]')) { fermerFeuille(); var ex = theatre().scenes.filter(function (s0) { return s0.schema === sc.id; })[0]; if (ex) location.hash = 'theatre/' + ex.id; else nouvelleScene(sc.id); return; }
      if (e.target.closest('[data-fois-ajout]')) { sc.fois.push({ age: '', premiere: !sc.fois.some(function (f) { return f.premiere; }) }); sauver(); rouvrir(); return; }
      var fs = e.target.closest('[data-fo-suppr]'); if (fs) { sc.fois.splice(+fs.getAttribute('data-fo-suppr'), 1); sauver(); rouvrir(); return; }
      if (e.target.closest('[data-lg-ajout]')) { sc.lignee.push({ qui: '', age: '', tiroir: '', quoi: '' }); sc.liaison = ''; sauver(); rouvrir(); return; }
      var ls = e.target.closest('[data-lg-suppr]'); if (ls) { sc.lignee.splice(+ls.getAttribute('data-lg-suppr'), 1); sauver(); rouvrir(); return; }
      if (e.target.closest('[data-liaison-elevee]')) { sc.liaison = sc.liaison === 'elevee' ? '' : 'elevee'; sauver(); rouvrir(); return; }
      if (e.target.closest('[data-observer]')) { sc.observer = iso(new Date()); sauver(); rouvrir(); return; }
      if (e.target.closest('[data-avant-souv]')) { sc.avantSouvenirs = sc.avantSouvenirs ? '' : iso(new Date()); sauver(); rouvrir(); return; }
      if (e.target.closest('[data-attente-souv]')) { sc.attenteSouvenir = iso(new Date()); sauver(); rouvrir(); return; }
      var pe = e.target.closest('[data-periode]'); if (pe) { var fk = sc.fois.filter(function (f) { return f.premiere; })[0]; if (fk) { fk.age = pe.getAttribute('data-periode'); if (!fk.contexte) fk.contexte = pe.getAttribute('data-ctx'); sauver(); rouvrir(); } return; }
      if (e.target.closest('[data-liaison-aucune]')) { sc.liaison = sc.liaison === 'aucune' ? '' : 'aucune'; sauver(); rouvrir(); return; }
      var lb = e.target.closest('[data-lib]'); if (lb) { var c = lb.getAttribute('data-lib'); sc[c] = sc[c] ? '' : iso(new Date()); sauver(); rouvrir(); return; }
      if (e.target.closest('[data-act-ajout]')) { var it = z.querySelector('#pa-act-t'), v = it && it.value.trim(); if (v) { sc.actions.push({ t: v.slice(0, 120), fait: '' }); sauver(); rouvrir(); } return; }
      var ds = e.target.closest('[data-depot-s]'); if (ds) { ouvrirDepot(sc.id); return; }
      var rs = e.target.closest('[data-reve-s]'); if (rs) { ouvrirReve('new', sc.id); return; }
      if (e.target.closest('[data-pas-reve]')) { sc.pasDeReve = !sc.pasDeReve; sauver(); rouvrir(); return; }
      var gf = e.target.closest('[data-geste-fait]'); if (gf) { sc.geste.fait = gf.getAttribute('data-geste-fait') === 'oui' ? iso(new Date()) : ''; sc.geste.vu = iso(new Date()); sauver(); rouvrir(); return; }
      if (e.target.closest('[data-geste-ok]')) { var gt = z.querySelector('#pa-geste-t'), gd = z.querySelector('#pa-geste-d'); if (gt && gt.value.trim()) { sc.geste = { t: gt.value.trim().slice(0, 140), date: gd.value || iso(new Date(Date.now() + 864e5)), cree: iso(new Date()), fait: '', ressenti: '' }; sauver(); rouvrir(); } return; }
      var gi = e.target.closest('[data-geste-idee]'); if (gi) { var gt2 = z.querySelector('#pa-geste-t'); if (gt2) gt2.value = gi.getAttribute('data-geste-idee'); return; }
      if (e.target.closest('[data-revient]')) { sc.classe = ''; sc.revenu = iso(new Date()); sauver(); ouvrirSchema(sc.id, 'liberer'); return; }
      if (e.target.closest('[data-sv-ok]')) {
        var rep = lirePuces(z, 'sv-rep')[0] || '', note = +z.querySelector('#pa-sv-note').value;
        var x = { date: iso(new Date()), rep: rep, note: note };
        if (rep === 'oui') { x.quand = z.querySelector('#pa-sv-quand').value; x.qui = z.querySelector('#pa-sv-qui').value.trim(); x.corps = lirePuces(z, 'sv-corps'); x.pense = z.querySelector('#pa-sv-pense').value.trim(); x.fait = z.querySelector('#pa-sv-fait').value.trim(); x.role = lirePuces(z, 'sv-role')[0] || ''; x.gere = lirePuces(z, 'sv-gere')[0] || ''; }
        sc.suivis.push(x);
        if (note >= 10 && confirm('10/10 : ton schéma est devenu spirale ? Tu pourras le rouvrir si ça revient plus fort.')) sc.classe = iso(new Date());
        sauver(); rouvrir(); return;
      }
      if (e.target.closest('[data-s-suppr]') && confirm('Supprimer ce schéma ? Tes ressentis restent, ils ne seront plus reliés.')) {
        D.etat.ressentis.forEach(function (r) { if (r.schema === sc.id) delete r.schema; }); (D.etat.reves || []).forEach(function (x) { if (x.schema === sc.id) delete x.schema; });
        D.etat.schemas = D.etat.schemas.filter(function (x) { return x.id !== sc.id; }); sauver(); fermerFeuille();
      }
    });
    var tb = z.querySelector('[data-tenir]');
    if (tb && !tb.disabled) {
      var tm = null;
      var debut = function (e) { e.preventDefault(); if (!String(sc.intention || '').trim()) { tb.querySelector('span').textContent = 'Écris d’abord ton intention'; return; } tb.classList.add('tient'); tb.querySelector('span').textContent = 'Reste centré·e…'; tm = setTimeout(function () { sc.intentionPosee = iso(new Date()); if (navigator.vibrate) navigator.vibrate(60); sauver(); rouvrir(); }, 3000); };
      var fin = function () { if (tm) { clearTimeout(tm); tm = null; } if (!sc.intentionPosee) { tb.classList.remove('tient'); tb.querySelector('span').textContent = 'Garder appuyé'; } };
      tb.addEventListener('pointerdown', debut); tb.addEventListener('pointerup', fin); tb.addEventListener('pointerleave', fin); tb.addEventListener('pointercancel', fin);
    }
  }
  /* « Je n'ai plus peur » : une intention au négatif */
  function negatif(t) { return /\bne\b[^.]*\b(plus|pas|jamais)\b|\bn’(ai|est|a|y)\b|\bpas\b|\bjamais\b/i.test(String(t || '')); }
  function champS(cle, label, val, ph) { return '<label for="pa-s-' + cle + '">' + esc(label) + '</label><input id="pa-s-' + cle + '" data-s="' + cle + '" maxlength="160" value="' + esc(val || '') + '"' + (ph ? ' placeholder="' + esc(ph) + '"' : '') + '>'; }
  function zoneS(cle, label, val, ph) { return '<label for="pa-s-' + cle + '">' + esc(label) + '</label><textarea id="pa-s-' + cle + '" data-s="' + cle + '" maxlength="2000"' + (ph ? ' placeholder="' + esc(ph) + '"' : '') + '>' + esc(val || '') + '</textarea>'; }

  /* ── 5. Mes actions : les protocoles et les fiches, sur une page à part ── */
  /* Le protocole rempli avec la fiche : l'âge, avec qui, le nom du schéma, la personne de la lignée */
  function tuMoi(t) { return String(t || '').replace(/\b(mon|ma|mes|moi|me)(?=[\s,.;:!?]|$)|\bm’/gi, function (m) { var x = { mon: 'ton', ma: 'ta', mes: 'tes', moi: 'toi', me: 'te', 'm’': 't’' }[m.toLowerCase()]; return m.charAt(0) === m.charAt(0).toUpperCase() ? cap(x) : x; }); }
  function ctxProto(sc) {
    var c = { age: 'à l’âge de la première fois', avec: '', scene: ', dans la scène, avec les personnes qui étaient là', nom: '…', qui: 'la personne de ta lignée liée à ce schéma', quiage: '', quoi: '', intention: 'Je suis en sécurité, ici et maintenant.', elle: 'elle ou il', lui: 'elle ou lui', Elle: 'Elle ou il' };
    if (!sc) return protoPersoCtx(c, null);
    var pf = premiereDe(sc), l = sc.lignee[0], q = l && l.qui ? personne(l.qui) : null, PB = (PF.PAR_BLESSURE || {})[sc.blessure] || {};
    c.nom = sc.nom || c.nom;
    if (pf) { c.age = 'à ' + ageNum(pf.age) + ' ans'; c.avec = pf.qui ? ', avec ' + tuMoi(pf.qui) : ''; c.scene = pf.quoi || pf.contexte ? ', dans la scène : « ' + tuMoi(pf.quoi || pf.contexte) + ' »' : ', dans la scène'; }
    if (q) { c.elle = q.f ? 'elle' : 'il'; c.lui = q.f ? 'elle' : 'lui'; c.Elle = q.f ? 'Elle' : 'Il'; }
    if (l) { c.qui = q ? nomL(q) : l.nomLibre || c.qui; c.quiage = l.age ? ', à ' + ageNum(l.age) + ' ans' : ''; c.quoi = l.quoi ? ' : « ' + tuMoi(l.quoi).toLowerCase() + ' »' : ''; }
    c.intention = sc.intention || PB.intention || c.intention;
    return protoPersoCtx(c, sc);
  }
  /* Depuis Mon théâtre : « Libérer ce que je porte de Marc, ton père » */
  function protoPersoCtx(c, sc) {
    if (!protoPerso) return c;
    var l = sc && protoPerso.cle ? sc.lignee.filter(function (x) { return x.qui === protoPerso.cle; })[0] : null;
    c.qui = protoPerso.nom + ', ' + protoPerso.lien; c.elle = protoPerso.f ? 'elle' : 'il'; c.lui = protoPerso.f ? 'elle' : 'lui'; c.Elle = protoPerso.f ? 'Elle' : 'Il';
    c.quiage = l && l.age ? ', à ' + ageNum(l.age) + ' ans' : ''; c.quoi = l && l.quoi ? ' : « ' + tuMoi(l.quoi).toLowerCase() + ' »' : '';
    return c;
  }
  function remplir(t, c) { return String(t).replace(/\{(\w+)\}/g, function (m, k) { return c[k] != null ? c[k] : m; }); }
  function vueActions(id, sid, mode) {
    var L = PF.ACTIONS || [], A0 = null; L.forEach(function (x) { if (x.id === id) A0 = x; });
    var h;
    if (!A0) {
      h = '<h1 class="pa-h1">Mes actions</h1><p class="pa-sous">Les protocoles pour libérer, et les fiches pour avancer. Reviens-y autant de fois que tu veux.</p><div class="pa-grille-a">' +
        L.map(function (x) { return '<a class="pa-carte pa-action" href="#actions/' + x.id + '"><p class="pa-etiq">' + esc(x.pour === 'vie' ? 'Libérer · ta vie' : x.pour === 'lignee' ? 'Libérer · ta lignée' : x.pour === 'intention' ? 'Après les libérations' : 'Pour t’aider') + '</p><h3>' + esc(x.titre) + '</h3><p>' + esc(x.court) + '</p></a>'; }).join('') + '</div>';
    } else {
      var SC = (D.etat.schemas || []).map(completerSchema).filter(function (x) { return !x.classe; }), cle = A0.pour === 'vie' ? 'libVie' : A0.pour === 'lignee' ? 'libLignee' : '';
      /* sans schéma choisi : celui qui en est à cette étape, sinon le plus récent ; les puces permettent d'en changer */
      var sc = sid ? trouverSchema(sid) : null;
      if (!sc && A0.pour && SC.length) sc = SC.filter(function (x) { return A0.pour === 'vie' ? !x.libVie : A0.pour === 'lignee' ? x.libVie && !x.libLignee : A0.pour === 'intention' ? !x.intentionPosee : false; })[0] || SC[SC.length - 1];
      if (sc) completerSchema(sc);
      var trouver = A0.trouver && sc && (mode === 'age' || !premiereOk(sc)), etapes = trouver ? A0.trouver : A0.etapes, c = ctxProto(sc);
      h = '<a class="pa-retour" href="#actions">‹ Mes actions</a><h1 class="pa-h1">' + esc(trouver ? 'Trouver ma première fois' : A0.titre) + '</h1><p class="pa-sous">' + esc(trouver ? 'Le protocole de la mémoire de ta vie, pour laisser venir l’âge que tu te sens.' : A0.court) + '</p>';
      if (A0.pour && SC.length > 1) h += '<div class="pa-puces pa-exemples pa-pour">' + SC.map(function (x) { return '<a class="pa-puce-l" href="#actions/' + A0.id + '/' + esc(x.id) + '" aria-pressed="' + (sc === x) + '">' + esc(cap(x.nom)) + '</a>'; }).join('') + '</div>';
      h += '<div class="pa-2col"><div><section class="pa-carte">' + (sc ? '<p class="pa-etiq">Pour « ' + esc(sc.nom) + ' »</p>' : '') + (A0.image ? '<p class="pa-image">' + esc(PF.IMAGE || '') + '</p>' : '') + (A0.douceur ? '<p class="pa-securite">' + esc(A0.douceur) + '</p>' : '') + sphereResp() +
        '<ol class="pa-proto">' + etapes.map(function (t) { return '<li>' + esc(remplir(t, c)) + '</li>'; }).join('') + '</ol>' +
        (A0.securite ? '<p class="pa-securite">' + esc(A0.securite) + '</p>' : '<a class="pa-monte-l" href="#actions/monte">Si ça monte fort</a>') + '</section></div><div>';
      if (trouver) {
        var pf0 = sc.fois.filter(function (f) { return f.premiere; })[0] || {};
        h += '<section class="pa-carte pa-venu"><p class="pa-etiq">Ce qui est venu</p><form class="pa-form" id="pa-venu" novalidate onsubmit="return false">' +
          '<label for="pa-venu-age">L’âge qui est venu <small>(à peu près)</small></label><input id="pa-venu-age" inputmode="numeric" maxlength="10" placeholder="6 ans" value="' + esc(pf0.age || '') + '">' +
          '<label for="pa-venu-qui">Qui était là <small>(si c’est venu)</small></label><input id="pa-venu-qui" maxlength="80" placeholder="Ma mère, personne…" value="' + esc(pf0.qui || '') + '">' +
          '<label for="pa-venu-scene">La scène qui est venue, même floue</label><textarea id="pa-venu-scene" maxlength="400" placeholder="Une cuisine, une porte qui claque, je suis petite…">' + esc(pf0.quoi || '') + '</textarea>' +
          '<button type="button" class="pa-bt or" data-venu="' + esc(sc.id) + '">C’est venu : je le note</button><p class="pa-erreur" role="alert"></p></form>' +
          '<p class="pa-discret">Tu n’as pas besoin de la date exacte. Un âge à peu près, une scène floue, c’est déjà assez. Ta fiche et ta frise se remplissent toutes seules.</p></section>';
      } else if (cle && sc) h += '<section class="pa-carte"><p class="pa-etiq">Quand c’est fait</p><button type="button" class="pa-bt' + (sc[cle] ? ' clair' : '') + '" data-action-fait="' + esc(sc.id) + '" data-cle="' + cle + '">' + (sc[cle] ? '✓ Fait le ' + esc(dateCourte(sc[cle])) : 'C’est fait pour « ' + esc(sc.nom) + ' »') + '</button><p class="pa-discret">Le schéma avance tout seul, et la libération rejoint ton agenda.</p><button type="button" class="pa-bt clair" data-schema="' + esc(sc.id) + '" data-onglet-s="liberer">Revenir à mon schéma</button></section>';
      else if (cle && SC.length) h += '<section class="pa-carte"><p class="pa-etiq">C’était pour quel schéma ?</p>' + SC.map(function (x) { return '<button type="button" class="pa-bt' + (x[cle] ? ' clair' : '') + '" data-action-fait="' + esc(x.id) + '" data-cle="' + cle + '">' + (x[cle] ? '✓ ' : '') + esc(cap(x.nom)) + '</button>'; }).join(' ') + '<p class="pa-discret">Le schéma avance tout seul, et la libération rejoint ton agenda.</p></section>';
      if (A0.pour === 'intention' && SC.length) h += '<section class="pa-carte"><p class="pa-etiq">Poser ton intention</p>' + SC.map(function (x) { return '<button type="button" class="pa-bt clair" data-schema="' + esc(x.id) + '" data-onglet-s="intention">' + esc(cap(x.nom)) + '</button>'; }).join(' ') + '</section>';
      h += '</div></div>';
    }
    afficher(h);
  }
  /* Ce qui est venu pendant le protocole : la première fois se remplit, la fiche et la frise aussi */
  function noterVenu(b) {
    var sc = trouverSchema(b.getAttribute('data-venu')), f = document.getElementById('pa-venu'); if (!sc || !f) return;
    var age = ageNum(f.querySelector('#pa-venu-age').value), qui = f.querySelector('#pa-venu-qui').value.trim(), sce = f.querySelector('#pa-venu-scene').value.trim();
    if (age == null) { f.querySelector('.pa-erreur').textContent = 'Écris l’âge qui est venu, même à peu près.'; return; }
    completerSchema(sc);
    var pf = sc.fois.filter(function (x) { return x.premiere; })[0]; if (!pf) { pf = { premiere: true }; sc.fois.unshift(pf); }
    pf.age = String(age); if (qui) pf.qui = qui.slice(0, 80); if (sce) pf.quoi = sce.slice(0, 140); if (sce.length > 140) pf.contexte = sce.slice(140, 280);
    pf.trouve = iso(new Date()); sc.attenteSouvenir = '';
    sauver(); flash = 'C’est noté : ta fiche et ta frise sont remplies.';
    history.pushState(null, '', location.pathname + location.search); router(); ouvrirSchema(sc.id, 'ou');
  }
  /* ── Le chemin d'un ressenti ── */
  function trouver(id) { for (var i = 0; i < D.etat.ressentis.length; i++) if (D.etat.ressentis[i].id === id) return D.etat.ressentis[i]; return null; }
  function ouvrirFil(id, voir) {
    var r = trouver(id); if (!r) return;
    var n = r.spirale ? ETAPES.length - 1 : Math.min(r.etape || 0, ETAPES.length - 1), i = voir != null ? voir : n, E = ETAPES[i];
    var h = '<p class="pa-etiq">' + esc(dateCourte(r.date)) + (r.force != null ? ' · force ' + r.force + '/10' : '') + '</p><h2 class="pa-quoi">' + esc(r.quoi || 'Un ressenti') + '</h2>' +
      ((r.em || []).length ? '<p class="pa-em">' + esc(r.em.join(' · ')) + '</p>' : '') +
      (r.schema && trouverSchema(r.schema) ? '<button type="button" class="pa-lien-sch" data-schema-f="' + esc(r.schema) + '"><i class="pa-bl" style="background:' + couleurBl(trouverSchema(r.schema).blessure) + '"></i>Schéma : ' + esc(trouverSchema(r.schema).nom) + '</button>' : '') +
      '<ol class="pa-pas">' + ETAPES.map(function (x, k) { var ok = k <= n; return '<li><button type="button" data-pas="' + k + '"' + (ok ? '' : ' disabled') + ' class="' + (k < n || r.spirale ? 'fait' : '') + (k === i ? ' ici' : '') + '"><i>' + (k < n || (r.spirale && k <= n) ? '✓' : k + 1) + '</i><span>' + esc(x.titre) + '</span></button></li>'; }).join('') + '</ol><p class="pa-def">Les 5 étapes d’une mémoire : la voir, la situer sur ta ligne du temps, la libérer, poser une intention, puis réapprendre au quotidien.</p>' +
      '<div class="pa-etape-c"><h3 class="pa-h3">' + esc(E.titre) + '</h3><p class="pa-souffle">' + esc(E.souffle) + '</p>' + contenuEtape(r, E.id) + '</div>' +
      '<p class="pa-discret" data-sauve>' + esc(texteSauve()) + '</p>' +
      '<p class="pa-actions">' + (i === n && !r.spirale ? boutonSuite(r, E.id) : i < n ? '<button type="button" class="pa-bt clair" data-pas="' + n + '">Revenir à l’étape en cours</button>' : '') + '<button type="button" class="pa-lien-s" data-suppr-fil>Supprimer ce ressenti</button></p>';
    var z = feuille(h);
    brancherEtape(z, r, i);
  }
  function boutonSuite(r, id) {
    if (id === 'liberer') return '<button type="button" class="pa-bt or" data-suite>J’ai libéré cette mémoire</button>';
    if (id === 'intention') return r.intentionPosee ? '<button type="button" class="pa-bt" data-suite>Continuer : réapprendre</button>' : '';
    if (id === 'reapprendre') return '<button type="button" class="pa-bt or" data-suite>Ma mémoire est devenue spirale</button>';
    return '<button type="button" class="pa-bt" data-suite>Étape suivante</button>';
  }
  function zoneTexte(cle, label, val, ph) { return '<label for="pa-t-' + cle + '">' + esc(label) + '</label><textarea id="pa-t-' + cle + '" data-t="' + cle + '" maxlength="3000"' + (ph ? ' placeholder="' + esc(ph) + '"' : '') + '>' + esc(val || '') + '</textarea>'; }
  function champ(cle, label, val, ph, max) { return '<label for="pa-t-' + cle + '">' + esc(label) + '</label><input id="pa-t-' + cle + '" data-t="' + cle + '" maxlength="' + (max || 160) + '" value="' + esc(val || '') + '"' + (ph ? ' placeholder="' + esc(ph) + '"' : '') + '>'; }
  function porteDe(r) { if (r.porte) return r.porte; var a = r.aqui; return a === 'moi' ? 'vie' : a === 'parent' || a === 'loin' || a === 'lignee' ? 'lignee' : a === 'ancienne' || a === '?' ? 'ancienne' : ''; }
  /* Les mêmes émotions déjà déposées */
  function memesRessentis(r) { return D.etat.ressentis.filter(function (x) { return x.id !== r.id && (x.em || []).some(function (e) { return (r.em || []).indexOf(e) >= 0; }); }); }
  function contenuEtape(r, id) {
    var h = '', qp = r.qui ? personne(r.qui) : null, porte = porteDe(r);
    if (id === 'voir') {
      h += '<div class="pa-resume">' + (r.corps && r.corps.length ? '<p><b>Dans ton corps :</b> ' + esc(r.corps.join(', ').toLowerCase()) + '</p>' : '') + (r.revient ? '<p><b>Ça revient :</b> ' + esc({ oui: 'oui, souvent', parfois: 'parfois', non: 'c’est la première fois' }[r.revient] || '') + (r.ages ? ' (' + esc(r.ages) + ')' : '') + '</p>' : '') + (r.phrase ? '<p><b>La phrase :</b> « ' + esc(r.phrase) + ' »</p>' : '') + (r.fil ? '<p class="pa-discret">Ajouté à ton fil d’or.</p>' : '') + '</div>';
      var ec = echosRessenti(r), ms = memesRessentis(r);
      if (ms.length) ec.unshift('Tu as déjà déposé ' + (ms.length > 1 ? ms.length + ' fois' : 'une fois') + ' cette émotion : ' + liste(ms.slice(0, 3).map(function (x) { return dateCourte(x.date); })) + '. Elle revient : c’est une mémoire qui se montre.');
      reps().forEach(function (x) { if ((r.bl || []).indexOf('abandon') >= 0 && /départ|absent|parti/i.test(x.label + x.desc)) ec.push('Dans ton arbre : ' + x.label + '.'); });
      h += ec.length ? '<div class="pa-bloc pa-miroir"><h4>Ce que ta vie et ta lignée te montrent</h4><ul class="pa-echos">' + ec.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>'
        : '<p class="pa-discret">Plus ton fil d’or et ton arbre se remplissent, plus l’appli te montre ce qui, dans ta vie et ta lignée, ressemble à ce que tu vis.</p>';
      h += '<div class="pa-bloc pa-prise">' + zoneTexte('vois', 'Je vois que…', r.vois, 'Je vois que chaque fois qu’on s’éloigne, je redeviens la petite fille qui attend sur le quai…') + '<p class="pa-discret">C’est ta prise de conscience. Elle est datée et rejoint ton agenda.</p></div>';
    } else if (id === 'aqui') {
      h += '<div class="pa-bloc pa-grande-q"><h4>La question</h4><p>' + esc(PF.QUESTION || '') + '</p></div>';
      h += '<div class="pa-bloc"><h4>Où est la mémoire sur ta ligne du temps ?</h4><div class="pa-portes">' + (PF.PORTES || []).map(function (x) { return '<button type="button" data-porte="' + x[0] + '" aria-pressed="' + (porte === x[0]) + '"><b>' + esc(x[1]) + '</b><span>' + esc(x[2]) + '</span></button>'; }).join('') + '</div>';
      if (porte === 'vie') {
        var ag = ageA(new Date()) || 60, vAge = r.ageFige != null ? r.ageFige : '';
        var F = (D.fil && D.fil.personnes && D.fil.personnes.toi && D.fil.personnes.toi.etapes) || [];
        h += '<div class="pa-frise-vie"><label for="pa-age-f">À quel âge cette partie de toi s’est-elle figée ? <b id="pa-age-v">' + (vAge !== '' ? vAge + ' ans' : '') + '</b></label><input type="range" id="pa-age-f" min="0" max="' + ag + '" value="' + (vAge !== '' ? vAge : Math.min(8, ag)) + '">' +
          (F.filter(plein).length ? '<p class="pa-discret">Tes moments du fil d’or :</p><div class="pa-puces">' + F.filter(plein).map(function (e) { var a = ageNum(e.age); return a != null ? '<button type="button" data-age="' + a + '" aria-pressed="' + (+vAge === a) + '">' + a + ' ans · ' + esc(String(e.evt || '').slice(0, 30)) + '</button>' : ''; }).join('') + '</div>' : '') + '</div>';
      } else if (porte === 'lignee') {
        var P = personnes().filter(function (p) { return p.gen > 0 || /couple|sœur|frère/i.test(p.lien); }).sort(function (x, y) { return x.gen - y.gen; });
        h += '<p class="pa-discret">Qui l’a portée avant toi ? Laisse venir le premier nom.</p><div class="pa-qui-l">' + P.map(function (p) { return '<button type="button" data-qui="' + esc(p.k) + '" aria-pressed="' + (r.qui === p.k) + '"><i class="pa-mini ' + (((D.etat.liens || {})[p.k] || {}).t || '') + '"></i><b>' + esc(p.prenom) + '</b><span>' + esc(p.lien.replace(/^(Ton|Ta|Une|Un) /, '')) + '</span></button>'; }).join('') + '<button type="button" data-qui="" aria-pressed="' + (!r.qui) + '"><i class="pa-mini"></i><b>Je ne sais pas</b><span>quelqu’un d’avant</span></button></div>' + (P.length ? '' : '<p class="pa-discret">Ajoute les tiens dans ton fil d’or pour les retrouver ici.</p>');
      }
      h += '</div>';
      h += '<div class="pa-bloc"><h4>Écoute ton intuition</h4>' + (PF.INTUITION || []).map(function (q, k) { return zoneTexte('i' + k, q, (r.intuition || {})[k]); }).join('') + '</div>';
      h += '<div class="pa-bloc"><h4>Nomme la mémoire</h4>' + champ('nom', 'Mémoire de…', r.nom, nomSuggere(r), 80) + '</div>';
      var sug = cycleSuggere(r), C = PF.CYCLES || {};
      h += '<div class="pa-bloc"><h4>Cycle 1 ou cycle 2 ?</h4><div class="pa-cycles">' + ['racine', 'coeur'].map(function (c) { return '<div><b>' + esc(C[c].nom) + '</b><span>' + esc(C[c].texte) + '</span></div>'; }).join('') + '</div>' +
        puces('cycle', [['racine', 'Cycle 1'], ['coeur', 'Cycle 2'], ['deux', 'Les deux']], [r.cycle || ''], false) + (sug && !r.cycle ? '<p class="pa-discret">Ce que tu as déposé fait penser ' + (sug === 'deux' ? 'aux deux cycles' : sug === 'racine' ? 'au cycle 1' : 'au cycle 2') + '. C’est toi qui sens.</p>' : '') + '</div>';
      h += '<details class="pa-plus-loin"' + (porte === 'lignee' || porte === 'ancienne' ? ' open' : '') + '><summary>Enquêter plus loin</summary>' + blocEnquete(r) + '</details>';
    } else if (id === 'liberer') {
      var Lb = PF.LIBERER || {}, pid = protoDe(r), prof = pid === 'cle2', PR = PF.PROTOCOLES || [], P0 = null;
      PR.forEach(function (x) { if (x.id === pid) P0 = x; });
      var LP = (PF.LIB_PORTE || {})[porte];
      if (LP) {
        var qui = qp ? qp.prenom : 'celle ou celui qui l’a portée', ageT = r.ageFige != null ? r.ageFige + ' ans' : 'l’âge où tout s’est figé';
        h += '<div class="pa-bloc pa-geste"><h4>' + esc(LP.titre.replace('{qui}', qui)) + '</h4><ol>' + LP.etapes.map(function (t) { return '<li>' + esc(t.replace(/\{qui\}/g, qui).replace('{age}', ageT)) + '</li>'; }).join('') + '</ol></div>';
      } else h += '<p class="pa-discret">Tu n’as pas encore situé la mémoire sur ta ligne du temps. Tu peux revenir à l’étape « Où est-elle ? », ou libérer quand même.</p>';
      if (PR.length > 1) h += '<div class="pa-bloc"><h4>Ton protocole</h4><div class="pa-protos">' + PR.map(function (x) { return '<button type="button" data-proto="' + esc(x.id) + '" aria-pressed="' + (x.id === pid) + '"><b>' + esc(x.titre) + '</b><span>' + esc(x.court) + '</span></button>'; }).join('') + '</div>' + (prof ? '<p class="pa-discret">Ce n’est pas un retour en arrière : tu creuses le même trou, plus profond.</p>' : '') + '</div>';
      if (P0 && P0.etapes) {
        h += '<div class="pa-lib">' + P0.etapes.map(function (x, k) { return '<div class="pa-lib-e"><span>' + (k + 1) + '</span><div><h4>' + esc(x.titre) + '</h4><p>' + esc(x.texte) + '</p></div></div>'; }).join('') + '</div>' + (P0.questions || []).map(function (q, k) { return zoneTexte('p' + pid + k, q, r['p' + pid + k]); }).join('');
      } else {
        h += '<div class="pa-lib"><div class="pa-lib-e"><span>1</span><div><h4>Respirer</h4><p>' + esc(Lb.respirer) + '</p>' + sphereResp() + '</div></div>';
        h += '<div class="pa-lib-e"><span>2</span><div><h4>Nommer</h4>' + (prof ? (Lb.couches || []).map(function (q, k) { return zoneTexte('c' + k, q, r['c' + k]); }).join('') : '') + champ('nom', 'Le nom de la mémoire', r.nom, nomSuggere(r), 80) + champ('source', 'Mémoire de qui, ou de quoi ?', r.source || sourceSuggeree(r) || (porte === 'vie' && r.ageFige != null ? 'moi à ' + r.ageFige + ' ans' : ''), 'ma grand-mère qui a tout perdu, moi à 8 ans…', 120) + '</div></div>';
        h += '<div class="pa-lib-e"><span>3</span><div><h4>Reconnaître</h4><p class="pa-discret">Dis-la à voix haute si tu peux, sinon intérieurement.</p><blockquote class="pa-phrase" id="pa-phrase-lib">' + esc(phraseLib(r, prof)) + '</blockquote></div></div>';
        h += '<div class="pa-lib-e"><span>4</span><div><h4>Transmuter</h4><ol>' + (Lb.transmuter || []).concat(prof ? Lb.profond || [] : []).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ol><p class="pa-discret">Tu peux répéter doucement : ' + (Lb.mantras || []).map(function (m) { return '« ' + esc(m) + ' »'; }).join(' ') + '</p></div></div>';
        h += '<div class="pa-lib-e"><span>5</span><div><h4>Réorienter</h4>' + (Lb.reorienter || []).map(function (q, k) { return zoneTexte('o' + k, q, r['o' + k]); }).join('') + '<div class="pa-deux-c"><div>' + zoneTexte('ancienne', 'Mon ancienne réaction', r.ancienne, 'Je me justifie, je fuis…') + '</div><div>' + zoneTexte('nouvelle', 'Ma nouvelle réponse', r.nouvelle, '« Merci, je vais y réfléchir. »') + '</div></div></div></div></div>';
      }
      h += '<div class="pa-bloc pa-geste"><h4>Ton geste dans les 48 heures</h4><p style="margin:0 0 .5rem">Un petit acte concret, dans le sens de ce que tu choisis, crée une nouvelle empreinte.</p><p class="pa-discret" style="color:#F3DCC0">' + esc((Lb.gestes || []).map(function (g) { return g[0] + ' : ' + g[1]; }).join(' · ')) + '</p>' +
        '<label for="pa-t-geste" style="color:#fff">Mon geste</label><input id="pa-t-geste" data-t="geste" maxlength="140" value="' + esc(r.geste || '') + '"><label for="pa-t-gdate" style="color:#fff">Le jour</label><input id="pa-t-gdate" type="date" data-t="gesteDate" value="' + esc(r.gesteDate || iso(new Date(Date.now() + 864e5))) + '"></div>';
    } else if (id === 'intention') {
      var I = PF.INTENTION || {}, op = (PF.OPPOSES || {})[(r.em || [])[0]] || '';
      if (r.intentionPosee) {
        h += '<div class="pa-posee"><div class="pa-graine"></div><p class="pa-etiq">Intention posée le ' + esc(dateCourte(r.intentionPosee)) + '</p><p class="pa-phrase">' + esc(r.intention || '') + '</p><p>' + esc(I.lacher) + '</p><p class="pa-discret">Elle reviendra le ' + esc(lunesApres(r.intentionPosee, 1).map(dateCourte).join('')) + ', à la nouvelle lune.</p></div>';
      } else {
        h += '<div class="pa-lib"><div class="pa-lib-e"><span>1</span><div><h4>Te centrer</h4><p>' + esc(I.centrer) + '</p>' + sphereResp() + '</div></div>';
        h += '<div class="pa-lib-e"><span>2</span><div><h4>L’écrire</h4><p>' + esc(I.ecrire) + '</p>' + (op ? '<p class="pa-discret">L’opposé de ta mémoire : ' + esc(op.toLowerCase()) + '.</p>' : '') + zoneTexte('intention', 'Mon intention', r.intention, I.exemples ? I.exemples[0] : '') +
          '<div class="pa-puces pa-exemples">' + (I.exemples || []).map(function (x) { return '<button type="button" data-exemple="' + esc(x) + '">' + esc(x) + '</button>'; }).join('') + '</div></div></div>';
        h += '<div class="pa-lib-e"><span>3</span><div><h4>La poser</h4><p>' + esc(I.acter) + '</p><button type="button" class="pa-tenir" data-tenir aria-label="Garder appuyé pour poser mon intention"><i></i><span>Garder appuyé</span></button></div></div></div>';
      }
      h += '<details class="pa-plus-loin"><summary>Ce que je veux avoir, faire, être</summary>' + champ('choix', 'Ce que je choisis à la place de ma mémoire', r.choix, op || 'La sécurité, l’abondance…', 120) + (PF.ENVIES || []).map(function (q, k) { return champ('e' + k, q, r['e' + k], '', 120); }).join('') + '</details>';
    } else if (id === 'reapprendre') {
      var RP = PF.REAPPRENDRE || {}, auj = new Date();
      h += '<div class="pa-bloc"><h4>Ton corps · réapprendre la sécurité</h4><p>' + esc(RP.corps) + '</p>' + (r.corps && r.corps.length ? '<p class="pa-discret">Ton corps se met en alerte : ' + esc(r.corps.join(', ').toLowerCase()) + '. Cette alerte appartient ' + (porte === 'vie' ? 'à la petite fille de ' + (r.ageFige != null ? r.ageFige + ' ans' : 'ton passé') : porte === 'lignee' ? (qp ? 'à ' + qp.prenom : 'à ta lignée') : 'à une mémoire ancienne') + ', pas à aujourd’hui.</p>' : '') +
        '<div class="pa-semaine">' + [6, 5, 4, 3, 2, 1, 0].map(function (n) { var d = new Date(auj.getTime() - n * 864e5), k = iso(d), on = !!(r.corpsJ || {})[k]; return '<button type="button" data-corps="' + k + '" aria-pressed="' + on + '"><small>' + JS[(d.getDay() + 6) % 7] + '</small>' + (on ? '✓' : d.getDate()) + '</button>'; }).join('') + '</div></div>';
      h += '<div class="pa-bloc"><h4>Tes pensées</h4><p class="pa-discret">' + esc(RP.pensees) + '</p>' + champ('phrase', 'L’ancienne phrase', r.phrase, 'On finit toujours par me laisser', 120) + champ('nphrase', 'Ma nouvelle phrase', r.nphrase, r.intention || 'Je mérite qu’on reste.', 160) + '</div>';
      h += '<div class="pa-bloc"><h4>Tes gestes</h4><p class="pa-discret">' + esc(RP.gestes) + '</p><div class="pa-deux-c"><div>' + zoneTexte('ancienne', 'Avant, je…', r.ancienne) + '</div><div>' + zoneTexte('nouvelle', 'Maintenant, je…', r.nouvelle) + '</div></div></div>';
      h += '<div class="pa-bloc"><h4>Le rôle que tu prends</h4><p class="pa-discret">Dans cette situation, sans te juger : quel rôle joues-tu ?</p>' + puces('role', (PF.ROLES || []).map(function (x) { return [x[0], x[1]]; }), r.roles || [], true) +
        (PF.ROLES || []).filter(function (x) { return (r.roles || []).indexOf(x[0]) >= 0; }).map(function (x) { return '<div class="pa-role"><p><b>' + esc(x[1]) + '</b> · ' + esc(x[2]) + '</p><p class="pa-or">' + esc(x[3]) + '</p></div>'; }).join('') +
        ((r.roles || []).length ? '<label for="pa-role-qui">Qui jouait ce rôle dans ta lignée ?</label><select id="pa-role-qui"><option value="">Je ne sais pas</option>' + personnes().map(function (p) { return '<option value="' + esc(p.k) + '"' + (r.roleQui === p.k ? ' selected' : '') + '>' + esc(p.prenom + ' · ' + p.lien.toLowerCase()) + '</option>'; }).join('') + '</select>' : '') + '</div>';
      var lu = r.intentionPosee ? lunesApres(r.intentionPosee, 6) : [], passees = lu.filter(function (d) { return d <= iso(auj); });
      h += '<div class="pa-bloc"><h4>À chaque nouvelle lune</h4>' + (r.intentionPosee ? '' : '<p class="pa-discret">Pose d’abord ton intention : elle reviendra à chaque nouvelle lune.</p>');
      if (r.intentionPosee) h += '<p class="pa-discret">Ton intention : « ' + esc(r.intention || '') + ' ». Prochaine nouvelle lune : ' + esc(dateCourte(lu.filter(function (d) { return d > iso(auj); })[0] || '')) + '.</p>' +
        passees.reverse().map(function (d) { var L = (r.lunes || {})[d] || {}; return '<div class="pa-lune"><p class="pa-etiq">Nouvelle lune du ' + esc(dateCourte(d)) + '</p>' + (RP.lune || []).map(function (q, k) { return '<label for="pa-l-' + d + k + '">' + esc(q) + '</label><input id="pa-l-' + d + k + '" data-lune="' + d + '" data-k="' + k + '" maxlength="200" value="' + esc(L[k] || '') + '">'; }).join('') + '</div>'; }).join('');
      h += '</div>';
    }
    return h;
  }
  function blocEnquete(r) {
    var h = '', cyc = r.cycle === 'racine' || r.cycle === 'coeur' ? [r.cycle] : ['racine', 'coeur'], Q = [], vus = r.enquete && r.enquete.q || {}, qui = r.qui ? personne(r.qui) : null;
    cyc.forEach(function (c) { Q = Q.concat(((PF.QUESTIONS || {})[c] || []).slice(0, cyc.length > 1 ? 3 : 5)); });
    (r.bl || []).forEach(function (b) { if ((PF.BLESSURE_Q || {})[b]) Q.push(PF.BLESSURE_Q[b]); });
    h += '<div class="pa-bloc"><h4>Les questions à poser' + (qui ? ' autour de ' + esc(qui.prenom) : '') + '</h4><ul class="pa-coches">' + Q.map(function (q, k) { return '<li><label><input type="checkbox" data-q="' + k + '"' + (vus[k] ? ' checked' : '') + '> ' + esc(q) + '</label></li>'; }).join('') + '</ul></div>';
    var OU = []; cyc.forEach(function (c) { OU = OU.concat(((PF.OU || {})[c] || []).slice(0, cyc.length > 1 ? 2 : 4)); }); OU = OU.concat((PF.OU || {}).tous || []);
    h += '<div class="pa-bloc"><h4>Où chercher</h4><ul class="pa-ou">' + OU.map(function (o) { return '<li><b>' + esc(o[0]) + '</b><span>' + esc(o[1]) + '</span></li>'; }).join('') + '</ul></div>';
    h += '<div class="pa-bloc">' + zoneTexte('trouve', 'Ce que j’ai trouvé, entendu ou senti', (r.enquete || {}).trouve, 'Une date, une phrase, un papier, un rêve…') + '</div>';
    return h + livre('Le livre te donne une page pour chaque personne de ta lignée, à remplir à la main et à transmettre.');
  }
  function sphereResp() { return '<div class="pa-resp" aria-live="polite"><i></i><button type="button" class="pa-bt clair" data-respirer>Respirer avec moi</button></div>'; }
  /* Les nouvelles lunes après une date (iso) */
  function lunesApres(k, n) {
    var d = dateComplete(k), l = []; if (!d || !A) return l;
    var t = new Date(d.a, d.m - 1, d.j + 1);
    for (var i = 0; i < n; i++) { var x = A.SearchMoonPhase(0, t, 40); if (!x) break; l.push(iso(x.date)); t = new Date(x.date.getTime() + 2 * 864e5); }
    return l;
  }
  function aquiDe(r) { return porteDe(r); }
  function protoDe(r) { return r.protocole || (r.profond ? 'cle2' : dejaLibere(r) ? 'cle2' : 'cle1'); }
  function nomSuggere(r) { var e = (r.em || [])[0]; return e ? 'la mémoire de ' + e.toLowerCase() : 'la mémoire de peur'; }
  function sourceSuggeree(r) { var q = r.qui ? personne(r.qui) : null; return q ? q.lien.toLowerCase().replace(/^(ton|ta|un|une) /, function (m) { return { 'ton ': 'mon ', 'ta ': 'ma ', 'un ': 'un ', 'une ': 'une ' }[m]; }) + ' ' + q.prenom : ''; }
  function phraseLib(r, prof) {
    var L = PF.LIBERER || {}, nom = String(r.nom || nomSuggere(r)).replace(/^(la )?mémoire de /i, ''), src = r.source || sourceSuggeree(r) || 'celle ou celui qui l’a portée avant moi';
    return (prof ? L.phraseProfonde : L.phrase || '').replace('{nom}', nom).replace('{source}', src);
  }
  function dejaLibere(r) { return D.etat.ressentis.some(function (x) { return x.id !== r.id && x.libere && x.date <= r.date && (x.em || []).some(function (e) { return (r.em || []).indexOf(e) >= 0; }); }); }
  var respMinuteur = null;
  function respirer(z) {
    var rond = z.querySelector('i'), bt = z.querySelector('button'), n = 0, temps = [['Inspire…', 5000, 1.35], ['Retiens…', 2000, 1.35], ['Expire…', 7000, .7]];
    clearTimeout(respMinuteur); bt.disabled = true;
    (function pas(k) {
      if (!document.body.contains(z)) return;
      if (k === 3) { n++; if (n >= 3) { rond.textContent = 'C’est bien.'; rond.style.transform = 'scale(1)'; bt.disabled = false; bt.textContent = 'Encore une fois'; return; } k = 0; }
      var t = temps[k]; rond.textContent = t[0]; rond.style.transitionDuration = (t[1] / 1000) + 's'; rond.style.transform = 'scale(' + t[2] + ')';
      respMinuteur = setTimeout(function () { pas(k + 1); }, t[1]);
    })(0);
  }
  function livre(t) { return '<a class="pa-livre" href="enquete-de-ma-lignee.html"><img src="assets/livres/enquete-de-ma-lignee-3d.webp" alt="" width="64" height="106" loading="lazy"><span><b>Le livre « L’enquête de ma lignée »</b><span>' + esc(t) + '</span><span class="pa-plus">Voir le livre</span></span></a>'; }
  function brancherEtape(z, r, i) {
    var E = ETAPES[i];
    z.addEventListener('input', function (e) {
      var lu = e.target.closest('[data-lune]'); if (lu) { r.lunes = r.lunes || {}; var d = lu.getAttribute('data-lune'); r.lunes[d] = r.lunes[d] || {}; r.lunes[d][lu.getAttribute('data-k')] = lu.value; sauver(); return; }
      if (e.target.id === 'pa-age-f') { r.ageFige = +e.target.value; z.querySelector('#pa-age-v').textContent = r.ageFige + ' ans'; sauver(); return; }
      var t = e.target.closest('[data-t]'); if (!t) return;
      var k = t.getAttribute('data-t'), v = t.value;
      if (/^i\d$/.test(k)) { r.intuition = r.intuition || {}; r.intuition[k.slice(1)] = v; }
      else if (/^s\d$/.test(k)) { r.sp = r.sp || {}; r.sp[k.slice(1)] = v; }
      else if (k === 'trouve') { r.enquete = r.enquete || { q: {} }; r.enquete.trouve = v; }
      else { r[k] = v; if (k === 'vois' && v && !r.voisDate) r.voisDate = iso(new Date()); }
      var ph = z.querySelector('#pa-phrase-lib'); if (ph && (k === 'nom' || k === 'source')) ph.textContent = phraseLib(r, protoDe(r) === 'cle2');
      sauver();
    });
    z.addEventListener('change', function (e) {
      var q = e.target.closest('[data-q]'); if (q) { r.enquete = r.enquete || { q: {} }; r.enquete.q = r.enquete.q || {}; if (q.checked) r.enquete.q[q.getAttribute('data-q')] = iso(new Date()); else delete r.enquete.q[q.getAttribute('data-q')]; sauver(); return; }
      if (e.target.id === 'pa-role-qui') { r.roleQui = e.target.value; sauver(); return; }
      var g = e.target.closest('[data-groupe]'); if (!g) return;
      var nom = g.getAttribute('data-groupe');
      if (nom === 'cycle') r.cycle = lirePuces(z, nom)[0] || '';
      if (nom === 'role') { r.roles = lirePuces(z, 'role'); sauver(); ouvrirFil(r.id, i); return; }
      sauver();
    });
    z.addEventListener('click', function (e) {
      var p = e.target.closest('[data-pas]'); if (p && !p.disabled) { ouvrirFil(r.id, +p.getAttribute('data-pas')); return; }
      var sf = e.target.closest('[data-schema-f]'); if (sf) { ouvrirSchema(sf.getAttribute('data-schema-f')); return; }
      var pr = e.target.closest('[data-proto]'); if (pr) { r.protocole = pr.getAttribute('data-proto'); sauver(); ouvrirFil(r.id, i); return; }
      var po = e.target.closest('[data-porte]'); if (po) { r.porte = po.getAttribute('data-porte'); if (r.porte !== 'lignee') r.qui = r.porte === 'vie' ? '' : r.qui; sauver(); ouvrirFil(r.id, i); return; }
      var qb = e.target.closest('[data-qui]'); if (qb) { r.qui = qb.getAttribute('data-qui'); z.querySelectorAll('[data-qui]').forEach(function (b) { b.setAttribute('aria-pressed', b === qb); }); sauver(); return; }
      var ab = e.target.closest('[data-age]'); if (ab) { r.ageFige = +ab.getAttribute('data-age'); sauver(); ouvrirFil(r.id, i); return; }
      var ex = e.target.closest('[data-exemple]'); if (ex) { var ta = z.querySelector('#pa-t-intention'); if (ta) { ta.value = ex.getAttribute('data-exemple'); r.intention = ta.value; sauver(); } return; }
      var cp = e.target.closest('[data-corps]'); if (cp) { r.corpsJ = r.corpsJ || {}; var ck = cp.getAttribute('data-corps'); if (r.corpsJ[ck]) delete r.corpsJ[ck]; else r.corpsJ[ck] = 1; sauver(); ouvrirFil(r.id, i); return; }
      if (e.target.closest('[data-suite]')) {
        var auj = iso(new Date());
        if (E.id === 'liberer') r.libere = auj;
        if (E.id === 'reapprendre') { r.spirale = auj; var sc0 = r.schema && trouverSchema(r.schema); if (sc0 && sc0.statut !== 'spirale' && confirm('Ton schéma « ' + sc0.nom + ' » est-il devenu spirale lui aussi ?')) { sc0.statut = 'spirale'; sc0.spirale = auj; } sauver(); fermerFeuille(); return; }
        r.etape = Math.max(r.etape || 0, i + 1); sauver(); ouvrirFil(r.id); return;
      }
      if (e.target.closest('[data-suppr-fil]') && confirm('Supprimer ce ressenti et tout ce que tu as écrit dessus ?')) {
        D.etat.ressentis = D.etat.ressentis.filter(function (x) { return x.id !== r.id; }); sauver(); fermerFeuille();
      }
    });
    /* Poser l'intention : garder le doigt appuyé trois secondes */
    var tb = z.querySelector('[data-tenir]');
    if (tb) {
      var tm = null;
      var debut = function (e) { e.preventDefault(); if (!String(r.intention || '').trim()) { tb.querySelector('span').textContent = 'Écris d’abord ton intention'; return; } tb.classList.add('tient'); tb.querySelector('span').textContent = 'Reste centré·e…'; tm = setTimeout(function () { r.intentionPosee = iso(new Date()); r.etape = Math.max(r.etape || 0, i + 1); if (navigator.vibrate) navigator.vibrate(60); sauver(); ouvrirFil(r.id, i); }, 3000); };
      var fin = function () { if (tm) { clearTimeout(tm); tm = null; } if (!r.intentionPosee) { tb.classList.remove('tient'); tb.querySelector('span').textContent = 'Garder appuyé'; } };
      tb.addEventListener('pointerdown', debut); tb.addEventListener('pointerup', fin); tb.addEventListener('pointerleave', fin); tb.addEventListener('pointercancel', fin);
      tb.addEventListener('keydown', function (e) { if ((e.key === ' ' || e.key === 'Enter') && !tm) debut(e); });
      tb.addEventListener('keyup', fin);
    }
  }

  /* ── Les rêves ── */
  function trouverReve(id) { var l = D.etat.reves || []; for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i]; return null; }
  /* Pour un partage anonyme : on retire les prénoms connus, les adresses e-mail et les numéros */
  function anonymiser(t) {
    var noms = [D.prenom].concat(String(D.prenoms || '').split(/\s+/), D.nom).concat(personnes().map(function (p) { return p.prenom; }));
    var F = (D.fil && D.fil.personnes) || {}; Object.keys(F).forEach(function (k) { if (F[k].prenom) noms.push(F[k].prenom); });
    t = String(t || '').replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '[e-mail]').replace(/(\+?\d[\d .-]{7,}\d)/g, '[numéro]');
    noms.filter(function (n) { return n && n.length > 1; }).forEach(function (n) { t = t.replace(new RegExp('(^|[^\\wÀ-ÿ])' + n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?=$|[^\\wÀ-ÿ])', 'gi'), '$1[prénom]'); });
    return t;
  }
  function ouvrirReve(id, schemaId) {
    var R = D.etat.reves = D.etat.reves || [], v = id === 'new' ? null : trouverReve(id), neuf = !v;
    if (neuf) v = { id: 'v' + Date.now().toString(36), date: iso(new Date()), texte: '', types: [], symboles: [], em: [], qui: [], schema: schemaId || '' };
    var RV = PF.REVES || {}, P = personnes();
    var h = '<p class="pa-etiq">' + (neuf ? 'Je note un rêve' : 'Mon rêve du ' + esc(dateCourte(v.date))) + '</p><h2>Ton rêve</h2><p class="pa-souffle">Note-le vite, avant qu’il ne s’efface : les images, les lieux, les personnes, ce que tu as ressenti au réveil. Certains rêves rangent ce que tu vis en ce moment, d’autres portent des symboles forts, ou la visite de quelqu’un de ta lignée.</p>' +
      '<form class="pa-form" novalidate onsubmit="return false"><label for="pa-rv-t">Ce que j’ai rêvé</label><textarea id="pa-rv-t" maxlength="4000" placeholder="J’étais dans la maison de ma grand-mère…">' + esc(v.texte) + '</textarea>' +
      '<p class="pa-lab">Ce rêve…</p>' + puces('rv-types', RV.types || [], v.types, true) +
      '<p class="pa-lab">Les symboles</p>' + puces('rv-sym', (RV.symboles || []).map(function (x) { return x[0]; }), v.symboles, true) + '<div id="pa-rv-pistes"></div>' +
      '<p class="pa-lab">Au réveil, je ressentais</p>' + puces('rv-em', (PF.EMOTIONS || []).concat(['Paix', 'Joie']), v.em, true) +
      (P.length ? '<p class="pa-lab">Quelqu’un de ma lignée y était</p>' + puces('rv-qui', P.map(function (p) { return [p.k, nomL(p)]; }), v.qui, true) : '') + '<div id="pa-rv-echos"></div>' +
      ((D.etat.schemas || []).length ? '<label for="pa-rv-sc">Ce rêve rejoint quel schéma ?</label><select id="pa-rv-sc"><option value="">Aucun pour l’instant</option>' + D.etat.schemas.map(function (x) { return '<option value="' + esc(x.id) + '"' + (v.schema === x.id ? ' selected' : '') + '>' + esc(cap(x.nom)) + '</option>'; }).join('') + '</select>' : '') +
      '<div class="pa-partage"><label class="pa-coche"><input type="checkbox" id="pa-rv-ok"' + (v.partage ? ' checked disabled' : '') + '> J’accepte que Genesolia utilise ce rêve, de façon totalement anonyme, pour écrire des articles sur les rêves</label>' +
      '<div id="pa-rv-apercu"' + (v.partage ? '' : ' hidden') + '></div></div>' +
      '<div class="pa-outils"><button type="button" class="pa-bt or" data-rv-ok>' + (neuf ? 'Garder mon rêve' : 'C’est noté') + '</button>' + (!neuf ? '<button type="button" class="pa-bt clair" data-rv-fil>Ce rêve parle d’une mémoire : la suivre</button><button type="button" class="pa-lien-s" data-rv-suppr>Supprimer ce rêve</button>' : '') + '</div></form>';
    var z = feuille(h, { enregistrer: function () { lire(); if (R.indexOf(v) < 0 && (v.texte.trim() || v.symboles.length)) R.push(v); return true; } });
    function lire() { var scs = z.querySelector('#pa-rv-sc'); if (scs) v.schema = scs.value; v.texte = z.querySelector('#pa-rv-t').value; v.types = lirePuces(z, 'rv-types'); v.symboles = lirePuces(z, 'rv-sym'); v.em = lirePuces(z, 'rv-em'); v.qui = lirePuces(z, 'rv-qui'); }
    function pistes() {
      var sy = lirePuces(z, 'rv-sym'), m = {}; (RV.symboles || []).forEach(function (x) { m[x[0]] = x[1]; });
      z.querySelector('#pa-rv-pistes').innerHTML = sy.length ? '<ul class="pa-echos">' + sy.map(function (x) { return '<li><b>' + esc(x) + '</b> · ' + esc(m[x]) + '</li>'; }).join('') + '</ul><p class="pa-discret">Des pistes, jamais des certitudes : c’est toi qui sens ce que ton rêve veut dire.</p>' : '';
      var ec = [], qs = lirePuces(z, 'rv-qui');
      qs.forEach(function (k) { var p = personne(k); if (!p) return; var t = p.prenom + ' (' + p.lien.toLowerCase() + ')'; if (p.parti && p.anneeD) t += ' est parti' + (p.f ? 'e' : '') + ' le ' + p.anneeD.j + ' ' + MOIS[p.anneeD.m - 1] + ' ' + p.anneeD.a; var c = communs(p); if (c.length) t += ' · vous avez ' + c.join(', '); var dr = (D.etat.reves || []).filter(function (x) { return x.id !== v.id && (x.qui || []).indexOf(k) >= 0; }).length; if (dr) t += ' · déjà venu' + (p.f ? 'e' : '') + ' dans ' + dr + ' autre' + (dr > 1 ? 's' : '') + ' rêve' + (dr > 1 ? 's' : ''); ec.push(t + '. Que vient-' + (p.f ? 'elle' : 'il') + ' te dire, ou te rendre ?'); });
      var memes = (D.etat.reves || []).filter(function (x) { return x.id !== v.id && (x.symboles || []).some(function (y) { return sy.indexOf(y) >= 0; }); });
      var tiensRv = memes.length ? bulleTiens('Tiens… ce symbole est déjà venu dans tes rêves.', '<p>' + esc(cap(liste(memes.slice(0, 3).map(function (x) { return 'le ' + dateCourte(x.date) + ' (' + (x.symboles || []).filter(function (y) { return sy.indexOf(y) >= 0; }).join(', ').toLowerCase() + ')'; })))) + '. Il insiste : qu’est-ce qu’il vient te dire ?</p>') : '';
      z.querySelector('#pa-rv-echos').innerHTML = tiensRv + (ec.length ? '<div class="pa-bloc"><h4>Ce que ce rêve réveille</h4><ul class="pa-echos">' + ec.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>' : '');
    }
    function apercu() { var ok = z.querySelector('#pa-rv-ok'), a = z.querySelector('#pa-rv-apercu'); a.hidden = !ok.checked; if (ok.checked) a.innerHTML = v.partage ? '<p class="pa-discret">Partagé anonymement le ' + esc(dateCourte(v.partage)) + '. Merci.</p>' : '<p class="pa-discret">Voici exactement ce qui sera envoyé, sans ton nom, ton e-mail ni ton compte. Les prénoms sont retirés : relis et enlève tout ce qui pourrait te reconnaître.</p><blockquote class="pa-apercu">' + esc(anonymiser(z.querySelector('#pa-rv-t').value)) + '</blockquote>'; }
    pistes(); if (v.partage) apercu();
    z.addEventListener('change', function (e) { if (e.target.id === 'pa-rv-ok') apercu(); else pistes(); });
    z.addEventListener('input', function (e) { if (e.target.id === 'pa-rv-t' && z.querySelector('#pa-rv-ok').checked && !v.partage) apercu(); });
    z.addEventListener('click', function (e) {
      if (e.target.closest('[data-rv-ok]')) {
        lire(); if (!v.texte.trim() && !v.symboles.length) { fermerFeuille(); return; }
        if (R.indexOf(v) < 0) R.push(v);
        if (z.querySelector('#pa-rv-ok').checked && !v.partage) partagerReve(v);
        sauver(); fermerFeuille(); return;
      }
      if (e.target.closest('[data-rv-fil]')) {
        lire(); var r = { id: 'r' + Date.now().toString(36), date: iso(new Date()), quoi: 'Mon rêve : ' + String(v.texte || '').slice(0, 300), em: v.em.filter(function (x) { return (PF.EMOTIONS || []).indexOf(x) >= 0; }), bl: [], corps: [], revient: v.types.indexOf('revient') >= 0 ? 'oui' : '', etape: 0, intuition: {}, enquete: { q: {} }, reve: v.id, qui: v.qui[0] || '', porte: v.qui.length ? 'lignee' : '' };
        D.etat.ressentis.push(r); v.fil = r.id; sauver(); ouvrirFil(r.id); return;
      }
      if (e.target.closest('[data-rv-suppr]') && confirm('Supprimer ce rêve ?')) { D.etat.reves = R.filter(function (x) { return x.id !== v.id; }); sauver(); fermerFeuille(); }
    });
  }
  function partagerReve(v) {
    v.partage = iso(new Date());
    if (EXEMPLE || !sb) return;
    sb.from('reves_anonymes').insert({ mois: v.date.slice(0, 7), texte: anonymiser(v.texte).slice(0, 4000), symboles: v.symboles, emotions: v.em, types: v.types }).then(function (r) { if (r && r.error) { delete v.partage; sauver(); } }, function () { delete v.partage; sauver(); });
  }
  function blocReves() {
    var R = (D.etat.reves || []).slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    var h = '<section class="pa-carte"><p class="pa-etiq">Mes rêves</p>';
    if (!R.length) h += '<p>Tes rêves sont remplis d’indices. Note-les ici : l’appli relie leurs symboles et les personnes qui y viennent à ta lignée.</p>';
    else {
      var sy = {}; R.forEach(function (v) { (v.symboles || []).forEach(function (x) { sy[x] = (sy[x] || 0) + 1; }); });
      var rec = Object.keys(sy).filter(function (x) { return sy[x] > 1; });
      if (rec.length) h += '<p class="pa-discret"><b>Les symboles qui reviennent :</b> ' + esc(rec.map(function (x) { return x.toLowerCase() + ' (' + sy[x] + ')'; }).join(', ')) + '</p>';
      h += '<ul class="pa-moments">' + R.slice(0, 5).map(function (v) { return '<li><button type="button" data-reve="' + esc(v.id) + '"><span class="pa-age rv">☾</span><span><b>' + esc(String(v.texte || 'Un rêve').slice(0, 70)) + '</b><small>' + esc(dateCourte(v.date) + ((v.symboles || []).length ? ' · ' + v.symboles.join(', ').toLowerCase() : '')) + '</small></span></button></li>'; }).join('') + '</ul>';
    }
    return h + '<div class="pa-outils"><button type="button" class="pa-bt clair" data-reve="new">Je note un rêve</button></div></section>';
  }

  /* ── 2. Mon fil d'or ── */
  function vueFil() {
    var h = '<h1 class="pa-h1">Mon fil d’or</h1><p class="pa-sous">Ta base, et chaque ressenti que tu tires, jusqu’à ce que la boucle devienne spirale.</p>';
    var SCs = (D.etat.schemas || []).map(completerSchema), EC = SCs.filter(function (x) { return !x.classe; });
    if (!EC.some(function (x) { return x.id === friseSel; })) friseSel = EC.length ? EC[EC.length - 1].id : '';
    h += '<section class="pa-carte pa-frise-c"><p class="pa-etiq">Ma frise · le schéma en cours</p><p class="pa-def">Ta vie en haut, ta lignée en dessous, par âge. Les traits relient les âges qui se répondent, à 2 ans près. Quand un schéma devient spirale, ses moments rejoignent ton bilan.</p>' +
      (EC.length > 1 ? '<div class="pa-puces pa-filtre-f">' + EC.map(function (x) { return '<button type="button" data-frise="' + esc(x.id) + '" aria-pressed="' + (friseSel === x.id) + '">' + esc(cap(x.nom)) + '</button>'; }).join('') + '</div>' : '') +
      (friseSel ? frise(trouverSchema(friseSel)) : '<p class="pa-discret">Ta frise montre le schéma en cours. Dépose un ressenti pour commencer.</p>') +
      '<div class="pa-outils"><button type="button" class="pa-bt clair" data-toute-vie>Voir toute ma vie</button></div></section><div class="pa-2col"><div>';
    h += blocFil();
    var R = reps();
    h += '<section class="pa-carte"><p class="pa-etiq">Ta base · ce qui se répète dans ton arbre</p>';
    if (R.length) h += R.slice(0, 8).map(function (x) { return '<details class="pa-rep"><summary>' + esc(x.label) + '</summary><p>' + esc(x.desc) + '</p></details>'; }).join('') + (R.length > 8 ? '<p class="pa-discret">Et ' + (R.length - 8) + ' autres pistes dans ton arbre.</p>' : '');
    else if (nbArbre()) h += '<p>Ouvre ton arbre une fois : ce qui se répète s’affichera ici, et dans ton agenda.</p>';
    else h += '<p>Avec ton arbre, les répétitions (âges, dates, prénoms, métiers) se repèrent toutes seules et rejoignent ton agenda.</p>';
    h += '<div class="pa-outils pa-bureau"><a class="pa-bt clair" href="genosociogramme.html">Ouvrir mon arbre</a></div></section>';
    h += blocCiel();
    h += '</div><div>';
    h += '<p class="pa-titre-s">Mes schémas</p><p class="pa-def">Un schéma, c’est ce qui se répète. Il relie tes ressentis qui se ressemblent, ta lignée, ton corps et tes rêves.</p>' + (EC.length ? EC.map(carteSchema).join('') : '<p class="pa-discret">' + (SCs.length ? 'Aucun schéma en cours.' : 'Ton premier schéma se crée quand tu déposes un ressenti.') + '</p>') +
      (SCs.length > EC.length ? '<p class="pa-titre-s">Devenus spirale</p>' + SCs.filter(function (x) { return x.classe; }).map(carteSchema).join('') : '');
    h += '<button type="button" class="pa-bt or" data-depot>Je dépose un ressenti</button>';
    h += blocReves();
    h += livre('Pour écrire ton enquête à la main, la remplir en famille et la transmettre : 166 pages, 18 thèmes expliqués.');

    h += '</div></div>';
    afficher(h);

  }

  var filSel = 'toi', friseSel = '';
  /* Toute ma vie, en plein écran : tes schémas en cours, ton fil d'or et ton arbre */
  function ouvrirTouteVie() {
    document.querySelectorAll('.pa-plein').forEach(function (x) { x.remove(); });
    var d = document.createElement('section'); d.className = 'pa-plein'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true'); d.setAttribute('aria-label', 'Toute ma vie');
    var nc = (D.etat.schemas || []).filter(function (x) { return x.classe; }).length;
    d.innerHTML = '<div class="pa-plein-t"><h2>Toute ma vie</h2><button type="button" class="pa-f-fermer" style="position:static" aria-label="Fermer">×</button></div><div class="pa-plein-c">' + frise(null) +
      '<p class="pa-discret">Tes schémas en cours, ton fil d’or et ton arbre.' + (nc ? ' Tes schémas devenus spirale sont rangés dans ton bilan.' : '') + ' Sur téléphone, tourne-le pour voir plus large.</p></div>';
    var y = window.scrollY; document.body.appendChild(d); if (!document.body.classList.contains('pa-fige')) { yFige = y; document.body.style.top = -y + 'px'; document.body.classList.add('pa-fige'); }
    centrerFrises(d);
    var fermer = function () { d.remove(); if (!document.querySelector('.pa-feuille')) defiger(); document.removeEventListener('keydown', esc1); };
    var esc1 = function (e) { if (e.key === 'Escape') fermer(); };
    d.querySelector('.pa-f-fermer').addEventListener('click', fermer); document.addEventListener('keydown', esc1);
  }
  function blocFil() {
    var F = filEtat(), ids = ['toi'].concat(F.ordre.filter(function (id) { return F.personnes[id] && id !== 'toi'; })), P = F.personnes[filSel] ? filSel : 'toi', x = F.personnes[P];
    var h = '<section class="pa-carte pa-fil-ed"><p class="pa-etiq">Ta base · ton fil d’or</p>';
    if (!(D.etat.vu || {}).fil) h += '<div class="pa-intro"><p><b>Ton fil d’or, c’est ta vie en quelques moments.</b> Pour chacun : l’âge que tu avais, ce qui s’est passé, ce que tu as ressenti. Puis fais la même chose pour ta mère, ton père, tes grands-parents, même si tu en sais peu. En mettant les ressentis côte à côte, les ressemblances d’une génération à l’autre apparaissent : c’est d’elles que naît ton enquête.</p><button type="button" class="pa-bt clair" data-fil-vu>J’ai compris</button></div>';
    h += '<div class="pa-onglets-f" role="tablist">' + ids.map(function (id) { var n = (F.personnes[id].etapes || []).filter(plein).length; return '<button type="button" role="tab" data-fil-p="' + id + '" aria-selected="' + (id === P) + '">' + esc(F.personnes[id].prenom || etiquetteFil(id)) + (F.personnes[id].prenom && id !== 'toi' ? ' <em>' + esc(etiquetteFil(id).toLowerCase()) + '</em>' : '') + (n ? ' <small>' + n + '</small>' : '') + '</button>'; }).join('') +
      '<select data-fil-ajout aria-label="Ajouter quelqu’un"><option value="">+ Ajouter</option>' + [['m', 'Ma mère'], ['p', 'Mon père'], ['mm', 'Ma grand-mère maternelle'], ['mp', 'Mon grand-père maternel'], ['pm', 'Ma grand-mère paternelle'], ['pp', 'Mon grand-père paternel']].filter(function (o) { return !F.personnes[o[0]]; }).concat([['r:soeur', 'Une sœur'], ['r:frere', 'Un frère'], ['r:enfant', 'Un enfant'], ['r:tante_m', 'Une tante maternelle'], ['r:oncle_m', 'Un oncle maternel'], ['r:tante_p', 'Une tante paternelle'], ['r:oncle_p', 'Un oncle paternel']]).map(function (o) { return '<option value="' + o[0] + '">' + esc(o[1]) + '</option>'; }).join('') + '</select></div>';
    h += '<div class="pa-pers-f"><label for="pa-fil-prenom">' + (P === 'toi' ? 'Ton prénom' : 'Son prénom') + '</label><input id="pa-fil-prenom" data-fil-prenom maxlength="40" value="' + esc(x.prenom || '') + '" placeholder="' + esc(etiquetteFil(P)) + '">';
    var et = (x.etapes || []).map(function (e, k) { return [e, k]; }).filter(function (y) { return plein(y[0]); }).sort(function (u, v) { return (ageNum(u[0].age) || 0) - (ageNum(v[0].age) || 0); });
    h += et.length ? '<ul class="pa-moments">' + et.map(function (y) { var e = y[0]; return '<li><button type="button" data-fil-m="' + y[1] + '"><span class="pa-age">' + (ageNum(e.age) != null ? ageNum(e.age) + '<small>ans</small>' : '·') + '</span><span><b>' + esc(e.evt || 'Un moment') + '</b>' + ((e.em || []).length ? '<small>' + esc(e.em.join(' · ')) + '</small>' : '') + '</span></button></li>'; }).join('') + '</ul>'
      : '<p class="pa-discret">' + (P === 'toi' ? 'Aucun moment encore. Commence par un moment qui t’a marqué·e.' : 'Même un seul moment suffit : ce que tu sais, ou ce que tu sens.') + '</p>';
    h += '<div class="pa-outils"><button type="button" class="pa-bt" data-fil-m="new">Ajouter un moment</button>' + (P !== 'toi' ? '<button type="button" class="pa-lien-s" data-fil-suppr>Retirer cette personne</button>' : '') + '</div></div>';
    var em = {}; ids.forEach(function (id) { (F.personnes[id].etapes || []).forEach(function (e) { (e.em || []).forEach(function (y) { if ((em[y] = em[y] || []).indexOf(id) < 0) em[y].push(id); }); }); });
    var top = Object.keys(em).filter(function (y) { return em[y].length > 1; }).sort(function (a, b) { return em[b].length - em[a].length; }).slice(0, 4);
    if (top.length) h += '<p class="pa-discret" style="margin-top:.8rem"><b>Les émotions qui voyagent :</b> ' + top.map(function (y) { return esc(y.toLowerCase()) + ' (' + em[y].map(function (id) { return esc(id === 'toi' ? 'toi' : (F.personnes[id].prenom || etiquetteFil(id))); }).join(', ') + ')'; }).join(' · ') + '</p>';
    var ages = {}; ids.forEach(function (id) { (F.personnes[id].etapes || []).forEach(function (e) { var a = ageNum(e.age); if (a != null && plein(e)) { if ((ages[a] = ages[a] || []).indexOf(id) < 0) ages[a].push(id); } }); });
    var ag = Object.keys(ages).filter(function (a) { return ages[a].length > 1; });
    if (ag.length) h += '<p class="pa-discret"><b>Les âges qui se répondent :</b> ' + ag.map(function (a) { return a + ' ans (' + ages[a].map(function (id) { return esc(id === 'toi' ? 'toi' : (F.personnes[id].prenom || etiquetteFil(id))); }).join(', ') + ')'; }).join(' · ') + '</p>';
    return h + '</section>';
  }
  function ouvrirMoment(k) {
    var F = filEtat(), P = F.personnes[filSel] ? filSel : 'toi', x = F.personnes[P], neuf = k === 'new';
    if (neuf) { x.etapes = (x.etapes || []).filter(plein); x.etapes.push({ age: '', evt: '', bl: [], em: [], vi: [], texte: '' }); k = x.etapes.length - 1; }
    var e = x.etapes[+k];
    var z = feuille('<p class="pa-etiq">Fil d’or · ' + esc(x.prenom || etiquetteFil(P)) + '</p><h2>' + (neuf ? 'Un nouveau moment' : 'Ce moment') + '</h2><form class="pa-form" novalidate onsubmit="return false">' +
      '<label for="pa-m-age">' + (P === 'toi' ? 'L’âge que tu avais' : 'L’âge qu’' + (/m$/.test(P) || /soeur|tante/.test(x.rel) ? 'elle' : 'il') + ' avait') + ' <small>(à peu près)</small></label><input id="pa-m-age" data-m="age" inputmode="numeric" maxlength="12" value="' + esc(e.age || '') + '">' +
      '<label for="pa-m-evt">Ce qui s’est passé</label><input id="pa-m-evt" data-m="evt" maxlength="140" value="' + esc(e.evt || '') + '" placeholder="Le départ de mon père, une séparation, un déménagement…">' +
      '<p class="pa-lab">Ce qui a été ressenti</p>' + puces('m-em', PF.EMOTIONS || [], e.em || [], true) +
      '<p class="pa-lab">Une blessure ?</p>' + puces('m-bl', PF.BLESSURES || [], e.bl || [], true) +
      '<label for="pa-m-texte">Ce que tu sais, ou ce que tu sens <small>(facultatif)</small></label><textarea id="pa-m-texte" data-m="texte" maxlength="2000">' + esc(e.texte || '') + '</textarea>' +
      '<div class="pa-outils"><button type="button" class="pa-bt or" data-m-ok>C’est noté</button><button type="button" class="pa-lien-s" data-m-suppr>Supprimer ce moment</button></div></form>');
    z.addEventListener('input', function (ev) { var t = ev.target.getAttribute('data-m'); if (t) { e[t] = ev.target.value; sauverFil(); } });
    z.addEventListener('change', function () { e.em = lirePuces(z, 'm-em'); e.bl = lirePuces(z, 'm-bl'); sauverFil(); });
    z.addEventListener('click', function (ev) {
      if (ev.target.closest('[data-m-ok]')) fermerFeuille();
      if (ev.target.closest('[data-m-suppr]')) { x.etapes.splice(+k, 1); sauverFil(); fermerFeuille(); }
    });
  }
  /* Le ciel et les nombres de ta lignée : ce qui se répète d'une personne à l'autre */
  function astroLignee() {
    var l = [], b = naissance();
    if (b) l.push({ nom: 'toi', d: b, moi: true });
    personnes().forEach(function (p) { if (p.anneeN) l.push({ nom: p.prenom, d: p.anneeN, p: p }); });
    var g = { chemin: {}, signe: {}, mois: {}, jour: {} };
    l.forEach(function (x) {
      var c = cheminDe(x.d), s2 = signeDe(x.d);
      if (c) (g.chemin[c] = g.chemin[c] || []).push(x);
      if (s2) (g.signe[s2] = g.signe[s2] || []).push(x);
      (g.mois[x.d.m] = g.mois[x.d.m] || []).push(x);
      (g.jour[x.d.j] = g.jour[x.d.j] || []).push(x);
    });
    var out = [];
    function noms(t) { return liste(t.map(function (x) { return x.p ? nomL(x.p) : x.nom; })); }
    Object.keys(g.chemin).forEach(function (k) { if (g.chemin[k].length > 1) out.push({ moi: g.chemin[k].some(function (x) { return x.moi; }), t: 'Chemin de vie ' + k + ' : ' + noms(g.chemin[k]) }); });
    Object.keys(g.signe).forEach(function (k) { if (g.signe[k].length > 1) out.push({ moi: g.signe[k].some(function (x) { return x.moi; }), t: 'Soleil en ' + k + ' : ' + noms(g.signe[k]) }); });
    Object.keys(g.jour).forEach(function (k) { if (g.jour[k].length > 1) out.push({ moi: g.jour[k].some(function (x) { return x.moi; }), t: 'Né·es un ' + k + ' : ' + noms(g.jour[k]) }); });
    Object.keys(g.mois).forEach(function (k) { if (g.mois[k].length > 2) out.push({ moi: g.mois[k].some(function (x) { return x.moi; }), t: g.mois[k].length + ' naissances en ' + MOIS[k - 1] + ' : ' + noms(g.mois[k]) }); });
    return out.sort(function (a, b) { return b.moi - a.moi; });
  }
  function blocCiel() {
    var A2 = astroLignee();
    if (!A2.length) return '<section class="pa-carte"><p class="pa-etiq">Ta base · le ciel et les nombres de ta lignée</p><p>Avec les dates de naissance complètes dans ton arbre, tu verras ici les chemins de vie, les signes et les dates qui se répètent d’une génération à l’autre.</p></section>';
    return '<section class="pa-carte"><p class="pa-etiq">Ta base · le ciel et les nombres de ta lignée</p><ul class="pa-echos">' + A2.slice(0, 8).map(function (x) { return '<li>' + (x.moi ? '<b>' : '') + esc(x.t) + (x.moi ? '</b>' : '') + '</li>'; }).join('') + '</ul><p class="pa-discret">En gras, ce que tu partages. Un nombre ou un signe qui revient est une invitation à regarder, pas une explication.</p></section>';
  }

  /* ── 3. Mon agenda ── */
  function datesLignee(a, m) {
    var P = (D.arbre && D.arbre.people) || {}, l = [];
    Object.keys(P).forEach(function (k) {
      var p = P[k], n = dateComplete(p.naiss), d = dateComplete(p.deces), moi = p.role === 'moi';
      if (n && n.m === m + 1) l.push({ j: n.j, type: 'l', cle: 'n-' + k, texte: moi ? 'Ton anniversaire' : 'Naissance de ' + nomA(k, P) + ' (' + n.a + ')', sous: (cheminDe(n) ? 'Chemin de vie ' + cheminDe(n) + ' · ' : '') + 'Soleil en ' + signeDe(n), ans: a - n.a });
      if (d && d.m === m + 1) l.push({ j: d.j, type: 'f', cle: 'd-' + k, texte: 'Départ de ' + nomA(k, P) + ' (' + d.a + ')', ans: a - d.a });
    });
    return l;
  }
  /* Les échos d'âge, regroupés par personne : ce qu'ont vécu les tiens à l'âge que tu as cette année */
  function echosAge(annee) {
    var P = (D.arbre && D.arbre.people) || {}, b = naissance(), moi = moiDeLArbre(); if (!b) return { age: null, l: [] };
    var age = annee - b.a, G = {}, ordre = [];
    function add(cle, nom, t) { if (!G[cle]) { G[cle] = { nom: nom, t: [] }; ordre.push(cle); } if (G[cle].t.indexOf(t) < 0) G[cle].t.push(t); }
    Object.keys(P).forEach(function (k) {
      if (moi && k === moi.id) return; var p = P[k];
      (p.events || []).forEach(function (e) { if (+e.age === age && EVT[e.type]) add('a:' + k, nomA(k, P), EVT[e.type] + (e.year ? ' (' + e.year + ')' : '')); });
      var dd = dateComplete(p.deces), nn = dateComplete(p.naiss); if (dd && nn && dd.a - nn.a === age) add('a:' + k, nomA(k, P), 'son départ (' + dd.a + ')');
    });
    var F = (D.fil && D.fil.personnes) || {};
    Object.keys(F).forEach(function (k) { if (k === 'toi') return; var x = personneDuFil(k); (F[k].etapes || []).forEach(function (e) { if (ageNum(e.age) === age && e.evt) add(x ? x.k : 'f:' + k, x ? nomL(x) : nomFil(k), '« ' + e.evt + ' »'); }); });
    return { age: age, l: ordre.map(function (c) { return G[c]; }) };
  }
  function evenements(a, m) {
    var E = {}, L = lunesDuMois(a, m);
    function add(j, e) { (E[j] = E[j] || []).push(e); }
    datesLignee(a, m).forEach(function (x) { add(x.j, { type: x.type, cle: x.cle, texte: x.texte + (x.ans > 0 ? ' · il y a ' + x.ans + ' ans' : ''), sous: x.sous }); });
    var HU = D.etat.humeurs || {};
    Object.keys(HU).forEach(function (k) { var d = dateComplete(k); if (d && d.a === a && d.m === m + 1 && (HU[k] || []).length) add(d.j, { type: 'h', cle: 'hum-' + k, texte: 'État d’âme : ' + HU[k].join(', ').toLowerCase(), humeur: true }); });
    reps().forEach(function (x) { var p = String(x.jm || '').split('/'); if (p.length === 2 && +p[1] === m + 1) add(+p[0], { type: 'r', cle: 'rep-' + x.jm, texte: x.label, sous: x.desc }); });
    Object.keys(L).forEach(function (k) { add(+k.slice(8, 10), { type: 'm', cle: 'lune-' + k, texte: L[k] }); });
    D.etat.ressentis.forEach(function (r) {
      var q = r.qui ? personne(r.qui) : null, qt = q ? q.prenom + ' (' + q.lien.toLowerCase() + ')' : '';
      var d = dateComplete(r.date); if (d && d.a === a && d.m === m + 1) add(d.j, { type: 'e', cle: 'res-' + r.id, texte: 'Ressenti : ' + (r.em && r.em.length ? r.em.join(', ').toLowerCase() : String(r.quoi || '').slice(0, 60)), sous: String(r.quoi || '').slice(0, 100) + (qt ? ' · lié à ' + qt : ''), fil: r.id });
      var l = dateComplete(r.libere); if (l && l.a === a && l.m === m + 1) add(l.j, { type: 'lib', cle: 'lib-' + r.id, texte: 'Mémoire libérée' + (r.nom ? ' : ' + r.nom.replace(/^la /, '') : ''), sous: qt ? 'Rendue à ' + qt + liensDates(q) : '', fil: r.id });
      var s = dateComplete(r.spirale); if (s && s.a === a && s.m === m + 1) add(s.j, { type: 'lib', cle: 'spi-' + r.id, texte: 'Un fil devenu spirale', fil: r.id });
      var g = dateComplete(r.gesteDate); if (g && r.geste && g.a === a && g.m === m + 1) add(g.j, { type: 'g', cle: 'geste-' + r.id, texte: 'Mon geste : ' + r.geste, fil: r.id });
      var ip = dateComplete(r.intentionPosee); if (ip && ip.a === a && ip.m === m + 1) add(ip.j, { type: 'int', cle: 'int-' + r.id, texte: 'Intention posée : « ' + (r.intention || '') + ' »', fil: r.id });
      if (r.intentionPosee && !r.spirale) lunesApres(r.intentionPosee, 6).forEach(function (k) { var x = dateComplete(k); if (x.a === a && x.m === m + 1) add(x.j, { type: 'int', cle: 'lun-' + r.id + k, texte: 'Nouvelle lune : ton intention revient', sous: '« ' + (r.intention || '') + ' » · qu’est-ce qui a bougé ?', fil: r.id, etape: 4 }); });
      var vs = dateComplete(r.voisDate); if (vs && vs.a === a && vs.m === m + 1) add(vs.j, { type: 'e', cle: 'vois-' + r.id, texte: 'Prise de conscience', sous: String(r.vois || '').slice(0, 120), fil: r.id });
      /* un an après une libération : une date à fêter */
      if (l && l.a < a && l.m === m + 1) add(l.j, { type: 'lib', cle: 'anlib-' + r.id, texte: 'Il y a ' + (a - l.a) + ' an' + (a - l.a > 1 ? 's' : '') + ', tu libérais une mémoire', fil: r.id });
    });
    (D.etat.schemas || []).forEach(function (x) {
      completerSchema(x); var nm = cap(x.nom || 'un schéma');
      [['libVie', 'lib', 'Mémoire de ta vie libérée'], ['libLignee', 'lib', 'Mémoire de ta lignée libérée'], ['libVie2', 'lib', 'Couche profonde libérée'], ['intentionPosee', 'int', 'Intention posée'], ['classe', 'lib', 'Devenu spirale'], ['revenu', 'e', 'Ça revient plus fort']].forEach(function (c) { var d = dateComplete(x[c[0]]); if (d && d.a === a && d.m === m + 1) add(d.j, { type: c[1], cle: c[0] + '-' + x.id, texte: c[2] + ' · ' + nm, sous: c[0] === 'intentionPosee' ? '« ' + (x.intention || '') + ' »' : c[0] === 'libLignee' && x.lignee[0] && personne(x.lignee[0].qui) ? 'Rendue à ' + nomL(personne(x.lignee[0].qui)) + liensDates(personne(x.lignee[0].qui)) : '', schema: x.id }); });
      x.suivis.forEach(function (sv) { var d = dateComplete(sv.date); if (d && d.a === a && d.m === m + 1) add(d.j, { type: 'sv', cle: 'sv-' + x.id + sv.date, texte: 'Suivi · ' + nm + ' · ' + sv.note + '/10', sous: sv.rep === 'oui' ? 'Répétition' + (sv.qui ? ' avec ' + sv.qui : '') + (sv.gere === 'oui' ? ', gérée' : ', pas encore gérée') + (sv.role && sv.role !== 'aucun' ? ' · rôle : ' + sv.role : '') : 'Pas de répétition', schema: x.id }); });
      x.actions.forEach(function (ac) { var d = dateComplete(ac.fait); if (d && d.a === a && d.m === m + 1) add(d.j, { type: 'g', cle: 'act-' + x.id + ac.t, texte: 'Action faite · ' + ac.t, schema: x.id }); });
      if (x.intentionPosee && !x.classe) lunesApres(x.intentionPosee, 6).forEach(function (k) { var y = dateComplete(k); if (y.a === a && y.m === m + 1) add(y.j, { type: 'int', cle: 'lun-' + x.id + k, texte: 'Nouvelle lune : ton intention revient', sous: '« ' + (x.intention || '') + ' » · qu’est-ce qui a bougé ?', schema: x.id, ong: 'reapprendre' }); });
    });
    var NJ = D.etat.notesJour || {};
    Object.keys(NJ).forEach(function (k) { var d = dateComplete(k), n = NJ[k] || {}; if (!d || d.a !== a || d.m !== m + 1) return; var t = [(n.corps || []).concat(n.sens || []).join(', ').toLowerCase(), n.pense, n.fait === 'nouveau' ? 'nouveau geste' + (n.faitT ? ' : ' + n.faitT : '') : n.fait === 'habitude' ? 'réaction habituelle' + (n.faitT ? ' : ' + n.faitT : '') : n.faitT].filter(Boolean).join(' · '); if (t) add(d.j, { type: 'h', cle: 'nj-' + k, texte: 'Ma note du jour', sous: t, humeur: true }); });
    (D.etat.schemas || []).forEach(function (x) { var g = x.geste, d = g && dateComplete(g.date); if (d && d.a === a && d.m === m + 1) add(d.j, { type: 'g', cle: 'geste-s-' + x.id, texte: 'Mon geste · ' + g.t, sous: g.fait ? 'Fait' + (g.ressenti ? ' · ' + g.ressenti : '') : 'À faire', schema: x.id, ong: 'liberer' }); });
    (D.etat.reves || []).forEach(function (v) { var d = dateComplete(v.date); if (d && d.a === a && d.m === m + 1) add(d.j, { type: 'rv', cle: 'reve-' + v.id, texte: 'Un rêve' + ((v.symboles || []).length ? ' : ' + v.symboles.join(', ').toLowerCase() : ''), sous: String(v.texte || '').slice(0, 100), reve: v.id }); });
    var notes = D.etat.notes || {};
    Object.keys(notes).forEach(function (k) { if (+k.slice(0, 4) === a && +k.slice(5, 7) === m + 1) (notes[k] || []).forEach(function (t, n) { add(+k.slice(8, 10), { type: 'n', cle: 'note-' + k + '-' + n, texte: t, note: true }); }); });
    return E;
  }
  /* Les dates de la personne concernée par une libération, pour voir le lien avec elle */
  function liensDates(q) {
    if (!q) return ''; var t = [];
    if (q.anneeN) t.push((q.f ? 'née' : 'né') + ' le ' + q.anneeN.j + ' ' + MOIS[q.anneeN.m - 1] + ' ' + q.anneeN.a + (cheminDe(q.anneeN) ? ', chemin de vie ' + cheminDe(q.anneeN) : ''));
    if (q.anneeD) t.push((q.f ? 'partie' : 'parti') + ' le ' + q.anneeD.j + ' ' + MOIS[q.anneeD.m - 1] + ' ' + q.anneeD.a);
    var c = communs(q); if (c.length) t.push('vous avez ' + c.join(', '));
    return t.length ? ' · ' + t.join(' · ') : '';
  }
  /* Ton chemin du mois : ressentis, états d'âme, libérations et gestes, avec les personnes de ta lignée */
  function cheminMois(a, m) {
    var l = [];
    D.etat.ressentis.forEach(function (r) {
      var q = r.qui ? personne(r.qui) : null;
      [['date', 'Tu déposes'], ['voisDate', 'Tu prends conscience'], ['libere', 'Tu libères'], ['gesteDate', 'Ton geste'], ['intentionPosee', 'Tu poses ton intention'], ['spirale', 'Devenu spirale']].forEach(function (c) {
        var d = dateComplete(r[c[0]]); if (!d || d.a !== a || d.m !== m + 1) return;
        if (c[0] === 'gesteDate' && !r.geste) return;
        var t = c[0] === 'date' ? (r.em || []).join(', ').toLowerCase() || String(r.quoi || '').slice(0, 50) : c[0] === 'voisDate' ? String(r.vois || '').slice(0, 70) : c[0] === 'libere' ? (r.nom || 'une mémoire') : c[0] === 'gesteDate' ? r.geste : c[0] === 'intentionPosee' ? '« ' + String(r.intention || '').slice(0, 70) + ' »' : '';
        l.push({ j: d.j, k: c[0], fil: r.id, t: c[1] + (t ? ' : ' + t : ''), q: q });
      });
    });
    (D.etat.reves || []).forEach(function (v) { var d = dateComplete(v.date); if (d && d.a === a && d.m === m + 1) l.push({ j: d.j, k: 'reve', reve: v.id, t: 'Un rêve' + ((v.symboles || []).length ? ' : ' + v.symboles.join(', ').toLowerCase() : ''), q: null }); });
    (D.etat.schemas || []).forEach(function (x) {
      completerSchema(x); var q = x.lignee[0] && x.lignee[0].qui ? personne(x.lignee[0].qui) : null;
      [['libVie', 'Tu libères la mémoire de ta vie'], ['libLignee', 'Tu libères la mémoire de ta lignée'], ['intentionPosee', 'Tu poses ton intention'], ['classe', 'Devenu spirale']].forEach(function (c) { var d = dateComplete(x[c[0]]); if (d && d.a === a && d.m === m + 1) l.push({ j: d.j, k: c[0] === 'intentionPosee' ? 'intentionPosee' : 'libere', schema: x.id, t: c[1] + ' : ' + x.nom, q: c[0] === 'libLignee' ? q : null }); });
      x.suivis.forEach(function (sv) { var d = dateComplete(sv.date); if (d && d.a === a && d.m === m + 1) l.push({ j: d.j, k: 'suivi', schema: x.id, t: 'Suivi ' + sv.note + '/10 · ' + x.nom + (sv.rep === 'oui' ? (sv.gere === 'oui' ? ' · gérée' : ' · pas encore gérée') : ''), q: null }); });
    });
    var HU = D.etat.humeurs || {}, cpt = {};
    Object.keys(HU).forEach(function (k) { var d = dateComplete(k); if (d && d.a === a && d.m === m + 1) (HU[k] || []).forEach(function (x) { cpt[x] = (cpt[x] || 0) + 1; }); });
    return { l: l.sort(function (x, y) { return x.j - y.j; }), humeurs: cpt };
  }
  /* Les périodes qui reviennent : ce que ce mois-là porte dans ta lignée, d'une année sur l'autre */
  function periodeMois(a, m) {
    var P = (D.arbre && D.arbre.people) || {}, dep = [], l = [];
    Object.keys(P).forEach(function (k) { var d = dateComplete(P[k].deces); if (d && d.m === m + 1) dep.push(nomA(k, P) + ' (' + d.a + ')'); });
    if (dep.length >= 2) l.push(dep.length + ' départs en ' + MOIS[m] + ' dans ta lignée : ' + liste(dep) + '.');
    var avant = D.etat.ressentis.filter(function (r) { var d = dateComplete(r.date); return d && d.m === m + 1 && d.a < a; });
    if (avant.length) l.push('Tu avais déposé ' + avant.length + ' ressenti' + (avant.length > 1 ? 's' : '') + ' en ' + MOIS[m] + ' les années passées : ' + liste(avant.map(function (r) { return (r.em || [])[0] ? r.em[0].toLowerCase() : 'un ressenti'; }).filter(function (v, i, x) { return x.indexOf(v) === i; })) + '.');
    var rp = reps().filter(function (x) { var p = String(x.jm || '').split('/'); return p.length === 2 && +p[1] === m + 1; });
    rp.forEach(function (x) { l.push(x.label + '.'); });
    var b = naissance(), nes = personnes().filter(function (p) { return p.anneeN && p.anneeN.m === m + 1; });
    if (b && b.m === m + 1) l.push('C’est ton mois de naissance' + (nes.length ? ' : ' + liste(nes.map(nomL)) + ' aussi' : '') + '.');
    else if (nes.length >= 2) l.push(nes.length + ' naissances en ' + MOIS[m] + ' : ' + liste(nes.map(function (p) { return nomL(p) + ' (' + signeDe(p.anneeN) + ')'; })) + '.');
    var lib = D.etat.ressentis.filter(function (r) { var d = dateComplete(r.libere); return d && d.m === m + 1 && d.a < a; });
    lib.forEach(function (r) { var d = dateComplete(r.libere), q = r.qui ? personne(r.qui) : null; l.push('En ' + MOIS[m] + ' ' + d.a + ', tu libérais ' + (r.nom || 'une mémoire') + (q ? ', rendue à ' + nomL(q) : '') + '.'); });
    return l;
  }
  var vueMoisD = null, jourChoisi = null;
  function vueAgenda() {
    var auj = new Date(); if (!vueMoisD) vueMoisD = new Date(auj.getFullYear(), auj.getMonth(), 1);
    var a = vueMoisD.getFullYear(), m = vueMoisD.getMonth(), E = evenements(a, m), dec = (new Date(a, m, 1).getDay() + 6) % 7, nb = new Date(a, m + 1, 0).getDate();
    if (!jourChoisi || jourChoisi.getMonth() !== m || jourChoisi.getFullYear() !== a) jourChoisi = auj.getMonth() === m && auj.getFullYear() === a ? auj : new Date(a, m, 1);
    var h = '<h1 class="pa-h1">Mon agenda</h1><p class="pa-sous">Les dates de ta lignée et ce qui revient, tes ressentis et tes libérations, les lunes et tes jours personnels.</p><div class="pa-2col pa-ag"><div>' +
      '<div class="pa-mois-tete"><button type="button" data-mois="-1" aria-label="Mois précédent">‹</button><h2>' + MOIS[m] + ' ' + a + '</h2><button type="button" data-mois="1" aria-label="Mois suivant">›</button></div>' +
      (naissance() ? '<p class="pa-jp-opt"><button type="button" data-jp aria-pressed="' + voirJP() + '">Mes jours personnels</button></p>' : '') +
      '<div class="pa-grille">' + JS.map(function (j) { return '<span class="js">' + j + '</span>'; }).join('');
    for (var k = 0; k < dec; k++) h += '<span class="pa-jour vide"></span>';
    for (var j = 1; j <= nb; j++) {
      var dt = new Date(a, m, j), ev = E[j] || [], jp = voirJP() ? jourPerso(dt) : null, cl = (iso(dt) === iso(auj) ? ' auj' : '') + (iso(dt) === iso(jourChoisi) ? ' choisi' : '');
      h += '<button type="button" class="pa-jour' + cl + '" data-jour="' + j + '"><span class="n">' + j + '</span>' + (jp ? '<span class="jp">' + jp + '</span>' : '') + '<span class="pts">' + ev.slice(0, 5).map(function (e) { return '<i class="' + e.type + '"></i>'; }).join('') + '</span></button>';
    }
    h += '</div><details class="pa-legende-d"><summary>Légende</summary><p class="pa-legende"><span><i class="l"></i>naissance</span><span><i class="f"></i>départ</span><span><i class="r"></i>date qui revient</span><span><i class="e"></i>ressenti</span><span><i class="lib"></i>libération</span><span><i class="g"></i>mon geste</span><span><i class="h"></i>état d’âme</span><span><i class="int"></i>intention</span><span><i class="rv"></i>rêve</span><span><i class="sv"></i>suivi</span><span><i class="m"></i>lune</span><span><i class="n"></i>note</span>' + (voirJP() ? '<span><b class="jpl">5</b> jour personnel (ton nombre du jour)</span>' : '') + '</p></details>';
    var pm = periodeMois(a, m), ea = a === auj.getFullYear() ? echosAge(a) : { l: [] }, cm = cheminMois(a, m);
    if (cm.l.length || Object.keys(cm.humeurs).length) {
      h += '<section class="pa-carte"><p class="pa-etiq">Ton chemin en ' + MOIS[m] + '</p>';
      if (cm.l.length) h += '<ul class="pa-frise">' + cm.l.map(function (x) { return '<li class="' + x.k + '"><b>' + x.j + '</b><button type="button" ' + (x.reve ? 'data-reve="' + esc(x.reve) + '"' : x.schema ? 'data-schema="' + esc(x.schema) + '"' : 'data-fil="' + esc(x.fil) + '"') + '><span>' + esc(x.t) + '</span>' + (x.q ? '<small>avec ' + esc(x.q.prenom + ', ' + x.q.lien.toLowerCase()) + '</small>' : '') + '</button></li>'; }).join('') + '</ul>';
      var hk = Object.keys(cm.humeurs).sort(function (x, y) { return cm.humeurs[y] - cm.humeurs[x]; });
      if (hk.length) h += '<p class="pa-discret"><b>Tes états d’âme :</b> ' + hk.map(function (x) { return esc(x.toLowerCase()) + ' (' + cm.humeurs[x] + ' jour' + (cm.humeurs[x] > 1 ? 's' : '') + ')'; }).join(', ') + '</p>';
      h += '</section>';
    }
    if (pm.length) h += '<section class="pa-carte"><p class="pa-etiq">Ce qui revient en ' + MOIS[m] + '</p><ul class="pa-echos">' + pm.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></section>';
    if (ea.l && ea.l.length) h += '<section class="pa-carte"><p class="pa-etiq">Échos d’âge, cette année</p><p>Tu as ' + ea.age + ' ans cette année. Au même âge, dans ta lignée :</p><ul class="pa-echos">' + ea.l.slice(0, 6).map(function (x) { return '<li><b>' + esc(x.nom) + '</b> : ' + esc(x.t.join(' · ')) + '</li>'; }).join('') + '</ul><p class="pa-discret">Une piste, pas une prédiction : un âge qui se répond invite à poser une question.</p></section>';
    h += '</div><div><section class="pa-carte" id="pa-jour-detail"></section>';
    var nR = Object.keys(D.etat.rappels || {}).length;
    h += '<section class="pa-carte"><p class="pa-etiq">Mes rappels</p><p>' + (nR ? nR + ' rappel' + (nR > 1 ? 's choisis' : ' choisi') + '. ' : 'Touche la cloche d’une date pour la choisir. ') + 'Ajoute-les au calendrier de ton téléphone : chaque date de ta lignée revient tous les ans, la veille au soir et le jour même.</p>' +
      '<button type="button" class="pa-bt' + (nR ? '' : ' clair') + '" data-ics' + (nR ? '' : ' disabled') + '>Ajouter mes rappels à mon calendrier</button></section>';
    if (!baseOk()) h += '<section class="pa-carte"><p class="pa-etiq">Pour un agenda plus riche</p><p>Ton arbre (avec les dates complètes) et ton fil d’or nourrissent ton agenda.</p><div class="pa-outils"><a class="pa-bt clair" href="genosociogramme.html">Mon arbre</a><a class="pa-bt clair" href="#fil">Mon fil d’or</a></div></section>';
    h += '</div></div>';
    afficher(h); detailJour();
  }
  function voirJP() { var v = lireL('genesolia-pass-jp'); return v == null ? window.innerWidth >= 700 : !!v; }
  var CLOCHE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>';
  function detailJour() {
    var z = document.getElementById('pa-jour-detail'); if (!z) return;
    var dt = jourChoisi, ev = evenements(dt.getFullYear(), dt.getMonth())[dt.getDate()] || [], jp = jourPerso(dt), k = iso(dt);
    var h = '<p class="pa-etiq">' + cap(dt.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })) + '</p>';
    if (jp) h += '<p><b class="jpl">' + jp + '</b> · ' + esc((N.JOURNEES || {})[jp] || '') + '</p>';
    h += ev.length ? ev.map(function (e) {
      var on = !!(D.etat.rappels || {})[e.cle], btn;
      if (e.note) btn = '<button type="button" class="pa-cloche" data-suppr="' + esc(e.cle) + '" aria-label="Supprimer cette note">×</button>';
      else if (e.humeur) btn = '';
      else if (e.schema) btn = '<button type="button" class="pa-cloche" data-schema="' + esc(e.schema) + '"' + (e.ong ? ' data-onglet-s="' + e.ong + '"' : '') + ' aria-label="Ouvrir le schéma">›</button>';
      else if (e.reve) btn = '<button type="button" class="pa-cloche" data-reve="' + esc(e.reve) + '" aria-label="Ouvrir ce rêve">›</button>';
      else if (e.fil) btn = '<button type="button" class="pa-cloche" data-fil="' + esc(e.fil) + '"' + (e.etape != null ? ' data-etape="' + e.etape + '"' : '') + ' aria-label="Ouvrir">›</button>';
      else btn = '<button type="button" class="pa-cloche" data-rappel="' + esc(e.cle) + '" data-texte="' + esc(e.texte) + '" data-date="' + k + '" aria-pressed="' + on + '" aria-label="' + (on ? 'Retirer le rappel' : 'Me le rappeler') + '">' + CLOCHE + '</button>';
      return '<div class="pa-evt"><p><i class="pa-pt ' + e.type + '"></i>' + esc(e.texte) + (e.sous ? '<small>' + esc(e.sous) + '</small>' : '') + (e.note ? '<small>Ta note</small>' : '') + '</p>' + btn + '</div>';
    }).join('') : '<p class="pa-discret">Rien de particulier dans ta lignée ce jour-là.</p>';
    if (dt <= new Date()) h += '<p class="pa-lab">Mon état d’âme ce jour-là</p>' + puces('humeur', PF.HUMEURS || [], (D.etat.humeurs || {})[k] || [], true);
    h += '<div class="pa-note"><input type="text" id="pa-note-t" maxlength="140" placeholder="Une action, un ressenti, un rêve…" aria-label="Ajouter une note à ce jour"><button type="button" class="pa-bt" style="margin:0" data-note>Noter</button></div>';
    z.innerHTML = h;
  }
  function telechargerIcs() {
    var R = D.etat.rappels || {}, l = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Genesolia//Mon enquete//FR', 'CALSCALE:GREGORIAN'];
    Object.keys(R).forEach(function (cle) {
      var r = R[cle], d = String(r.date || '').replace(/-/g, ''); if (!/^\d{8}$/.test(d)) return;
      var annuel = !/^lune-|^note-/.test(cle), t = String(r.texte || '').replace(/[,;\\]/g, ' ');
      l.push('BEGIN:VEVENT', 'UID:' + cle + '@genesolia.fr', 'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z', 'DTSTART;VALUE=DATE:' + d, 'SUMMARY:' + t, 'DESCRIPTION:Ma spirale Genesolia · genesolia.fr/pass.html#agenda');
      if (annuel) l.push('RRULE:FREQ=YEARLY');
      l.push('BEGIN:VALARM', 'TRIGGER:-PT15H', 'ACTION:DISPLAY', 'DESCRIPTION:' + t, 'END:VALARM', 'BEGIN:VALARM', 'TRIGGER:PT9H', 'ACTION:DISPLAY', 'DESCRIPTION:' + t, 'END:VALARM', 'END:VEVENT');
    });
    l.push('END:VCALENDAR');
    var x = document.createElement('a'); x.href = URL.createObjectURL(new Blob([l.join('\r\n')], { type: 'text/calendar' })); x.download = 'mon-enquete-rappels.ics';
    document.body.appendChild(x); x.click(); x.remove();
  }

  /* ── 4. Mon bilan ── */
  function dessinLignee() {
    var P = personnes().slice().sort(function (x, y) { return x.rang - y.rang || y.gen - x.gen; }), W = 640, C = W / 2, RAY = [0, 118, 200, 272], L = D.etat.liens || {};
    var rangs = [[], [], [], []]; P.forEach(function (p) { if (rangs[p.rang].length < [0, 10, 14, 16][p.rang]) rangs[p.rang].push(p); });
    var s = '<svg class="pa-lignee" viewBox="0 0 ' + W + ' ' + W + '" role="img" aria-label="Ta lignée en sphères de lumière"><defs>' +
      '<radialGradient id="pa-g-paix"><stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="#FFF4DA"/><stop offset="1" stop-color="#F2D9A0" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="pa-g-mit"><stop offset="0" stop-color="#FFE7CC"/><stop offset=".6" stop-color="#F3A65A" stop-opacity=".55"/><stop offset="1" stop-color="#E8893A" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="pa-g-sph"><stop offset="0" stop-color="#fff"/><stop offset=".7" stop-color="#F6EAF2"/><stop offset="1" stop-color="#D9C2D3"/></radialGradient>' +
      '<radialGradient id="pa-g-toi"><stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="#FFF1CF"/><stop offset="1" stop-color="#E2C48E" stop-opacity="0"/></radialGradient></defs>';
    RAY.slice(1).forEach(function (r, k) { if (rangs[k + 1].length) s += '<circle cx="' + C + '" cy="' + C + '" r="' + r + '" fill="none" stroke="rgba(255,255,255,.08)"/>'; });
    var pos = [];
    [1, 2, 3].forEach(function (rg) {
      var l = rangs[rg], n = l.length; if (!n) return;
      var anc = l.filter(function (p) { return p.gen > 0; }).length, debut = -90 - (anc / n * 360) / 2 + (360 / n) / 2;
      l.forEach(function (p, i) { var ang = (debut + i * 360 / n + (rg === 2 ? 360 / n / 3 : 0)) * Math.PI / 180; pos.push({ p: p, x: C + RAY[rg] * Math.cos(ang), y: C + RAY[rg] * Math.sin(ang) }); });
    });
    pos.forEach(function (o) {
      var t = (L[o.p.k] || {}).t;
      s += '<line x1="' + C + '" y1="' + C + '" x2="' + o.x.toFixed(1) + '" y2="' + o.y.toFixed(1) + '" stroke="' + (t === 'paix' ? '#F2D9A0' : t === 'mitige' ? '#E8893A' : 'rgba(255,255,255,.18)') + '" stroke-width="' + (t ? 2.6 : 1.2) + '"' + (t ? '' : ' stroke-dasharray="3 5"') + (t === 'paix' ? ' opacity=".9"' : '') + '/>';
    });
    s += '<circle cx="' + C + '" cy="' + C + '" r="64" fill="url(#pa-g-toi)"/><circle cx="' + C + '" cy="' + C + '" r="30" fill="#fff"/><text x="' + C + '" y="' + (C + 5) + '" text-anchor="middle" class="pa-sv-toi">' + esc(D.prenom || 'Toi') + '</text>';
    pos.forEach(function (o) {
      var t = (L[o.p.k] || {}).t, r = o.p.rang === 1 ? 22 : o.p.rang === 2 ? 19 : 16;
      s += '<g class="pa-sph" data-personne="' + esc(o.p.k) + '" tabindex="0" role="button" aria-label="' + esc(o.p.prenom + ', ' + o.p.lien.toLowerCase() + (t === 'paix' ? ', lien de paix' : t === 'mitige' ? ', lien mitigé' : '')) + '">' +
        (t === 'paix' ? '<circle cx="' + o.x.toFixed(1) + '" cy="' + o.y.toFixed(1) + '" r="' + (r + 18) + '" fill="url(#pa-g-paix)"/>' : t === 'mitige' ? '<circle cx="' + o.x.toFixed(1) + '" cy="' + o.y.toFixed(1) + '" r="' + (r + 14) + '" fill="url(#pa-g-mit)"/>' : '') +
        '<circle cx="' + o.x.toFixed(1) + '" cy="' + o.y.toFixed(1) + '" r="' + r + '" fill="url(#pa-g-sph)" stroke="' + (t === 'paix' ? '#FFF4DA' : t === 'mitige' ? '#E8893A' : 'rgba(255,255,255,.45)') + '" stroke-width="' + (t ? 3 : 1.4) + '"' + (o.p.parti ? ' opacity=".82"' : '') + '/>' +
        (communs(o.p).length ? '<text x="' + (o.x + r * .8).toFixed(1) + '" y="' + (o.y - r * .55).toFixed(1) + '" class="pa-sv-et">✦</text>' : '') +
        '<text x="' + o.x.toFixed(1) + '" y="' + (o.y + r + 15).toFixed(1) + '" text-anchor="middle" class="pa-sv-nom">' + esc(o.p.prenom.slice(0, 13)) + '</text>' +
        '<text x="' + o.x.toFixed(1) + '" y="' + (o.y + r + 28).toFixed(1) + '" text-anchor="middle" class="pa-sv-lien">' + esc(o.p.lien.replace(/^(Ton|Ta|Une|Un) /, '')) + '</text></g>';
    });
    return s + '</svg>';
  }
  function vueBilan() {
    var Rs = D.etat.ressentis, L = D.etat.liens || {}, P = personnes();
    var h = '<h1 class="pa-h1">Mon bilan</h1><p class="pa-sous">Ta lignée telle que tu la sens aujourd’hui. Touche une sphère pour poser le lien que tu ressens.</p><div class="pa-2col pa-bil"><div>';
    if (P.length) {
      h += '<section class="pa-carte pa-nuit pa-ciel-l">' + dessinLignee() + '<p class="pa-leg-l"><span><i class="paix"></i>Lien de paix · cercle de lumière</span><span><i class="mit"></i>Lien mitigé · même avec de l’amour</span><span><i class="vide"></i>Pas encore regardé</span><span><b class="pa-et">✦</b>Te ressemble (nombres, ciel)</span></p></section>';
    } else h += '<section class="pa-carte"><p class="pa-etiq">Ta lignée en sphères</p><p>Ajoute les tiens dans ton arbre ou ton fil d’or : ils apparaîtront ici, chacun dans sa sphère, reliés à toi.</p><div class="pa-outils"><a class="pa-bt clair" href="#fil">Mon fil d’or</a><a class="pa-bt clair" href="genosociogramme.html">Mon arbre</a></div></section>';
    h += '</div><div>';
    var SC = (D.etat.schemas || []).map(completerSchema), cl = SC.filter(function (x) { return x.classe; }), NE = (PF.SCHEMA || {}).neuf || [];
    h += '<section class="pa-carte"><p class="pa-etiq">Ton chemin</p><p class="pa-stats"><span><b>' + Rs.length + '</b>ressenti' + (Rs.length > 1 ? 's' : '') + ' déposé' + (Rs.length > 1 ? 's' : '') + '</span><span><b>' + SC.length + '</b>schéma' + (SC.length > 1 ? 's' : '') + '</span><span><b>' + cl.length + '</b>devenu' + (cl.length > 1 ? 's' : '') + ' spirale</span></p>';
    if (SC.length) h += '<ul class="pa-liste">' + SC.map(function (x) { var e = etapeDe(x), n = noteDe(x); return '<li><span class="pa-pastille" style="background:' + couleurBl(x.blessure) + ';color:#fff">' + (n != null ? n : '·') + '</span><span><button type="button" class="pa-lien-b" data-schema="' + esc(x.id) + '"><b>' + esc(cap(x.nom)) + '</b></button><br><small>Étape ' + (e + 1) + ' · ' + esc((NE[e] || [''])[0]) + (n != null ? ' · ' + n + '/10' : ' · pas encore noté') + '</small></span></li>'; }).join('') + '</ul>';
    if (Rs.length) {
      var prem = Rs.map(function (r) { return r.date; }).sort()[0], d0 = dateComplete(prem), now = new Date(), mois = d0 ? (now.getFullYear() - d0.a) * 12 + now.getMonth() + 1 - d0.m : 0, ph = null;
      (PF.PHASES || []).some(function (x) { if (mois < x[0]) { ph = x; return true; } return false; });
      if (ph) h += '<p class="pa-lab">Où tu en es · ' + esc(ph[1]) + '</p><p class="pa-def">Le chemin a 5 phases, de la surface à l’intégration, comptées depuis ton premier ressenti.</p><p class="pa-discret" style="margin-top:0">' + esc(ph[2]) + '</p>';
    }
    if (cl.length) h += '<p class="pa-lab">Mes schémas devenus spirale</p>' + cl.map(function (x) { return '<details class="pa-rep pa-spi"><summary>' + esc(cap(x.nom)) + ' · devenu spirale le ' + esc(dateCourte(x.classe)) + '</summary>' + frise(x, false) + '</details>'; }).join('');
    var ra = SC.filter(function (x) { return x.cycle === 'racine' || x.cycle === 'deux'; }).length, co = SC.filter(function (x) { return x.cycle === 'coeur' || x.cycle === 'deux'; }).length;
    if (ra + co) h += '<p class="pa-lab">Cycle 1 ou cycle 2</p><div class="pa-barres"><span style="flex:' + (ra || .001) + '" class="ra">Cycle 1 · ' + ra + '</span><span style="flex:' + (co || .001) + '" class="co">Cycle 2 · ' + co + '</span></div>';
    var em = {}; Rs.forEach(function (r) { (r.em || []).forEach(function (x) { em[x] = (em[x] || 0) + 1; }); });
    var tE = Object.keys(em).sort(function (a, b) { return em[b] - em[a]; }).slice(0, 4);
    if (tE.length) h += '<p class="pa-discret"><b>Ce qui revient le plus :</b> ' + tE.map(function (x) { return esc(x.toLowerCase()) + ' (' + em[x] + ')'; }).join(', ') + '</p>';
    h += '</section>';
    var paix = P.filter(function (p) { return (L[p.k] || {}).t === 'paix'; }), mit = P.filter(function (p) { return (L[p.k] || {}).t === 'mitige'; });
    if (paix.length || mit.length) h += '<section class="pa-carte"><p class="pa-etiq">Tes liens</p>' + (paix.length ? '<p><b class="pa-or">En paix :</b> ' + esc(liste(paix.map(nomL))) + '</p>' : '') + (mit.length ? '<p><b class="pa-orange">Mitigés :</b> ' + esc(liste(mit.map(nomL))) + '</p>' : '') + '</section>';
    var peurs = {}; P.forEach(function (p) { ((L[p.k] || {}).peurs || []).forEach(function (x) { (peurs[x] = peurs[x] || []).push(nomL(p)); }); });
    if (Object.keys(peurs).length) h += '<section class="pa-carte"><p class="pa-etiq">Les peurs que tu partages</p><ul class="pa-echos">' + Object.keys(peurs).map(function (x) { return '<li><b>' + esc(x) + '</b> · avec ' + esc(liste(peurs[x])) + '</li>'; }).join('') + '</ul></section>';
    var loy = P.filter(function (p) { return (L[p.k] || {}).loyaute; });
    if (loy.length) h += '<section class="pa-carte"><p class="pa-etiq">Les loyautés que tu sens</p><p>' + esc(liste(loy.map(nomL))) + '</p><p class="pa-discret">Une loyauté n’est pas un manque d’amour : c’est souvent beaucoup d’amour, qui garde la même peur pour rester proche.</p></section>';
    var libs = []; SC.forEach(function (x) { [['libVie', 'la mémoire de ta vie'], ['libLignee', 'la mémoire de ta lignée'], ['libVie2', 'la couche profonde']].forEach(function (c) { if (x[c[0]]) libs.push({ d: x[c[0]], t: cap(x.nom) + ' · ' + c[1], q: c[0] === 'libLignee' && x.lignee[0] ? personne(x.lignee[0].qui) : null }); }); }); libs.sort(function (a, b) { return a.d < b.d ? 1 : -1; });
    if (libs.length) h += '<section class="pa-carte"><p class="pa-etiq">Tes libérations</p><ul class="pa-liste">' + libs.map(function (x) { return '<li><span class="pa-pastille or">✦</span><span><b>' + esc(dateCourte(x.d)) + '</b><br><small>' + esc(x.t + (x.q ? ' · rendue à ' + nomL(x.q) : '')) + '</small></span></li>'; }).join('') + '</ul></section>';
    var sem = P.map(function (p) { return { p: p, c: communs(p) }; }).filter(function (x) { return x.c.length; });
    if (sem.length) h += '<section class="pa-carte"><p class="pa-etiq">Ceux qui te ressemblent</p><ul class="pa-gens">' + sem.slice(0, 6).map(function (x) { var t = (L[x.p.k] || {}).t; return '<li><button type="button" data-personne="' + esc(x.p.k) + '"><i class="pa-mini ' + (t || '') + '"></i><span><b>' + esc(x.p.prenom) + '</b>' + esc(x.p.lien.toLowerCase() + ' · ' + x.c.join(', ')) + '</span></button></li>'; }).join('') + '</ul><p class="pa-discret">Par les nombres ou par le ciel, ces personnes te ressemblent : elles méritent qu’on les regarde. Qu’ont-elles vécu à ton âge ? Que portent-elles que tu reconnais ?</p></section>';
    var parP = {}; SC.forEach(function (x) { x.lignee.forEach(function (l) { if (l.qui) (parP[l.qui] = parP[l.qui] || []).push(cap(x.nom) + (l.age ? ' à ' + l.age + ' ans' : '') + (l.perso ? ', « ' + l.perso + ' »' : '') + (x.libLignee ? ' (libérée)' : '')); }); });
    if (Object.keys(parP).length) h += '<section class="pa-carte"><p class="pa-etiq">Tes schémas et tes ancêtres</p><ul class="pa-echos">' + Object.keys(parP).map(function (k) { var q = personne(k); return q ? '<li><b>' + esc(nomL(q)) + '</b> : ' + esc(parP[k].join(' ; ')) + '</li>' : ''; }).join('') + '</ul></section>';
    var ints = SC.filter(function (x) { return x.intentionPosee; });
    if (ints.length) h += '<section class="pa-carte"><p class="pa-etiq">Tes intentions</p><ul class="pa-liste">' + ints.map(function (x) { var fa = x.actions.filter(function (a) { return a.fait; }).length; return '<li><span class="pa-pastille or">' + (x.classe ? '✓' : '✦') + '</span><span><b>« ' + esc(x.intention || '') + ' »</b><br><small>' + esc('Posée le ' + dateCourte(x.intentionPosee) + ' · ' + x.nom + (x.actions.length ? ' · ' + fa + ' action' + (fa > 1 ? 's' : '') + ' faite' + (fa > 1 ? 's' : '') + ' sur ' + x.actions.length : '')) + '</small></span></li>'; }).join('') + '</ul></section>';
    var ro = {}, RL = (PF.SCHEMA || {}).roles || []; SC.forEach(function (x) { x.suivis.forEach(function (sv) { if (sv.role && sv.role !== 'aucun') ro[sv.role] = (ro[sv.role] || 0) + 1; }); });
    var rs = {}; SC.forEach(function (x) { if (!x.classe) x.rolesSortir.forEach(function (k) { rs[k] = 1; }); });
    if (Object.keys(ro).length || Object.keys(rs).length) h += '<section class="pa-carte"><p class="pa-etiq">Tes rôles</p>' + (Object.keys(rs).length ? '<p><b>Ceux dont tu veux sortir :</b> ' + esc(RL.filter(function (x) { return rs[x[0]]; }).map(function (x) { return x[1]; }).join(' · ')) + '</p>' : '') + (Object.keys(ro).length ? '<p><b>Ceux que tu prends encore :</b> ' + esc(RL.filter(function (x) { return ro[x[0]]; }).map(function (x) { return x[1] + ' (' + ro[x[0]] + ' fois)'; }).join(' · ')) + '</p>' : '') + '<p class="pa-discret">Les voir, c’est déjà pouvoir en sortir.</p></section>';
    var RVs = D.etat.reves || [];
    if (RVs.length) { var syb = {}; RVs.forEach(function (v) { (v.symboles || []).forEach(function (x) { syb[x] = (syb[x] || 0) + 1; }); }); var tsy = Object.keys(syb).sort(function (a, b) { return syb[b] - syb[a]; }).slice(0, 4); h += '<section class="pa-carte"><p class="pa-etiq">Tes rêves</p><p>' + RVs.length + ' rêve' + (RVs.length > 1 ? 's' : '') + ' noté' + (RVs.length > 1 ? 's' : '') + (tsy.length ? ' · ' + esc(tsy.map(function (x) { return x.toLowerCase(); }).join(', ')) : '') + '</p></section>'; }
    var nr = reps().length; if (nr) h += '<a class="pa-carte" href="#fil"><p class="pa-etiq">Ce qui se répète</p><p>' + nr + ' piste' + (nr > 1 ? 's' : '') + ' repérée' + (nr > 1 ? 's' : '') + ' dans ton arbre.</p><span class="pa-plus">Voir ma base</span></a>';
    h += '<p class="pa-outils"><button type="button" class="pa-bt clair" data-imprimer>Imprimer mon bilan</button><a class="pa-bt clair" href="genosociogramme.html#lumiere">Ma lignée en lumière (poster)</a></p>';
    h += '</div></div>';
    afficher(h);
  }
  function ouvrirPersonne(k) {
    var p = personne(k); if (!p) return;
    var L = D.etat.liens[k] = D.etat.liens[k] || {}, lies = (D.etat.schemas || []).filter(function (x) { return (x.lignee || []).some(function (l) { return l.qui === k; }); });
    var h = '<p class="pa-etiq">' + esc(p.lien) + (p.anneeN ? ' · ' + (p.f ? 'née' : 'né') + ' en ' + p.anneeN.a : '') + (p.parti && p.anneeD ? ' · ' + (p.f ? 'partie' : 'parti') + ' en ' + p.anneeD.a : '') + '</p><h2>' + esc(p.prenom) + '</h2>' +
      (communs(p).length ? '<p class="pa-commun">✦ Vous avez ' + esc(communs(p).join(', ')) + '. Regarde ce qu’' + (p.f ? 'elle' : 'il') + ' a vécu : ça mérite d’être vu.</p>' : '') +
      '<div class="pa-bloc"><h4>Le lien que tu ressens</h4>' + puces('lien', [['paix', 'Lien de paix'], ['mitige', 'Lien mitigé'], ['', 'Je ne sais pas encore']], [L.t || ''], false) + '<p class="pa-discret">La paix : tu peux penser à ' + (p.f ? 'elle' : 'lui') + ' sans que rien ne se serre. Mitigé : il y a de l’amour, et aussi quelque chose qui pèse ou qui se ressemble.</p></div>' +
      '<div class="pa-bloc"><h4>Les peurs que vous partagez</h4>' + puces('peurs', PF.PEURS || [], L.peurs || [], true) + '</div>' +
      '<label class="pa-coche"><input type="checkbox" id="pa-loy"' + (L.loyaute ? ' checked' : '') + '> Je sens une loyauté envers ' + (p.f ? 'elle' : 'lui') + ', même avec beaucoup d’amour</label>' +
      '<div class="pa-bloc">' + zoneTexte('note', 'Ce que je sens de ce lien', L.note, 'Quand je pense à ' + p.prenom + '…') + '</div>' +
      (lies.length ? '<div class="pa-bloc"><h4>Tes schémas liés à ' + esc(p.prenom) + '</h4>' + lies.map(carteSchema).join('') + '</div>' : '') +
      '<p class="pa-discret" data-sauve>' + esc(texteSauve()) + '</p>';
    var z = feuille(h);
    z.addEventListener('change', function (e) {
      if (e.target.id === 'pa-loy') L.loyaute = e.target.checked;
      else { L.t = lirePuces(z, 'lien')[0] || ''; L.peurs = lirePuces(z, 'peurs'); }
      sauver();
    });
    z.addEventListener('input', function (e) { if (e.target.getAttribute('data-t') === 'note') { L.note = e.target.value; sauver(); } });
    z.addEventListener('click', function (e) { var f = e.target.closest('[data-schema]'); if (f) ouvrirSchema(f.getAttribute('data-schema'), f.getAttribute('data-onglet-s')); });
  }

  /* ── 6. Mon théâtre : les personnages qui se rejouent dans sa vie ──
     C'est SON ressenti : ce qu'elle ressent de chacun, depuis sa place (l'autre aurait sûrement un autre point de vue).
     D.etat.theatre = { persos: [{ id, nom, qui: 'lignee'|'vie', cle, role, genre: 'f'|'m'|'', couleur, symptomes: [] (comment je le ressens + phrases de famille) }],
       scenes: [{ id, titre, schema, cree, moi: {x, y}, places: { id: {x, y, dos, poids} }, ressentis: { id: '…' }, devient: { id: [] },
                  photos: [{ date, moi, places, note }], filsVus: ['a|b'], filNouveau: 'a|b', prises: [], poidsMaj }] }
     Positions en % de la scène. Le miroir relie une personne de sa vie et une de sa lignée qu'elle ressent de la même façon. */
  var COULEURS_T = [['#D4A24C', 'Or'], ['#C2466E', 'Rose'], ['#6B2F5B', 'Prune'], ['#4E5D94', 'Bleu nuit'], ['#7FA7D9', 'Ciel'], ['#B83A3A', 'Rouge'], ['#8A8494', 'Gris'], ['#2E2433', 'Noir'], ['#EDE4DA', 'Blanc']];
  var ROLES_VIE = ['Ami·e', 'Couple', 'Ex', 'Patron·ne', 'Collègue', 'Voisin·e', 'Enfant', 'Frère ou sœur', 'Parent', 'Autre'];
  var T_RESSENS = ['Froid', 'Absent', 'Qui part', 'Qui juge', 'Qui critique', 'Imprévisible', 'Qui contrôle', 'Fragile', 'Qui protège', 'Qui étouffe', 'Qui ne me voit pas', 'Distant'];
  var T_PHRASES = ['Les hommes finissent toujours par partir', 'Il faut se débrouiller seul·e', 'On ne parle pas de ses émotions', 'Il faut être parfait·e pour être aimé·e', 'L’argent ne dure jamais'];
  var T_DEVIENT = ['Je me tais', 'Je cours après', 'Je me fais petit·e', 'Je me justifie', 'Je fuis', 'Je contrôle tout', 'Je donne tout', 'Gorge serrée', 'Ventre noué'];
  var POIDS = [['lourd', 'Très lourd', 7, '#8E2E63', ''], ['present', 'Présent', 3.5, '#C26A95', ''], ['leger', 'Léger', 1.6, '#E3B6CB', ''], ['parti', 'Presque parti', 1.4, '#F1DCE6', '3 5']];
  function poidsDe(k) { return POIDS.filter(function (x) { return x[0] === k; })[0] || POIDS[1]; }
  function theatre() { var T = D.etat.theatre = D.etat.theatre || {}; T.persos = T.persos || []; T.scenes = T.scenes || []; return T; }
  function persoT(id) { return theatre().persos.filter(function (p) { return p.id === id; })[0] || null; }
  function sceneT(id) { return theatre().scenes.filter(function (s) { return s.id === id; })[0] || null; }
  function clair(c) { var h = String(c || '').replace('#', ''); if (h.length !== 6) return false; var r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16); return (r * 299 + g * 587 + b * 114) / 1000 > 160; }
  function genreDe(p) { if (p.qui === 'lignee' && p.cle && personne(p.cle)) return personne(p.cle).f ? 'f' : 'm'; return p.genre || ''; }
  function leLa(p) { var g = genreDe(p); return g === 'f' ? 'la' : g === 'm' ? 'le' : 'le ou la'; }
  /* Sur la scène, en plus des personnages : ce qu'elle désire (« L'amour ») et ses symboles (« La peur », « Les factures ») */
  var TAILLES = [['1', 'Petite', .8], ['2', 'Moyenne', 1], ['3', 'Grande', 1.3], ['4', 'Très grande', 1.65]];
  var T_DESIRS = ['L’amour', 'La paix', 'La sécurité', 'La liberté', 'L’abondance', 'Un foyer', 'La confiance', 'Ma place', 'Mon projet', 'La joie'];
  var T_SYMBOLES = ['La peur', 'Les factures', 'Les impôts', 'L’argent', 'Le travail', 'Le temps', 'La solitude', 'Le regard des autres', 'Le passé', 'La colère'];
  function typeDe(p) { return p && (p.type === 'desir' || p.type === 'symbole') ? p.type : 'perso'; }
  function tailleDe(pl) { var t = TAILLES.filter(function (x) { return x[0] === String((pl && pl.taille) || '2'); })[0]; return t ? t[2] : 1; }
  function lienPerso(p) { if (typeDe(p) === 'desir') return 'ce que je désire'; if (typeDe(p) === 'symbole') return 'symbole'; if (p.qui === 'lignee') { var q = p.cle ? personne(p.cle) : null; return q ? q.lien.replace(/^(Ton|Ta) /, '').toLowerCase() : 'ma lignée'; } return String(p.role || 'ma vie').toLowerCase(); }
  /* « ton père », « ta patronne », « ton ex » */
  function lienTon(p) {
    if (p.qui === 'lignee') { var q = p.cle ? personne(p.cle) : null; return q ? q.lien.toLowerCase() : 'quelqu’un de ta lignée'; }
    var g = genreDe(p), M = { 'Ami·e': ['ton amie', 'ton ami', 'ton ami·e'], 'Couple': ['ta compagne', 'ton compagnon', 'la personne qui partage ta vie'], 'Ex': ['ton ex', 'ton ex', 'ton ex'], 'Patron·ne': ['ta patronne', 'ton patron', 'ton ou ta patron·ne'], 'Collègue': ['ta collègue', 'ton collègue', 'ton ou ta collègue'], 'Voisin·e': ['ta voisine', 'ton voisin', 'ton voisin·e'], 'Enfant': ['ta fille', 'ton fils', 'ton enfant'], 'Frère ou sœur': ['ta sœur', 'ton frère', 'ta sœur ou ton frère'], 'Parent': ['ta mère', 'ton père', 'ton parent'] }[p.role];
    return M ? M[g === 'f' ? 0 : g === 'm' ? 1 : 2] : 'quelqu’un de ta vie';
  }
  function petit(t) { t = String(t || ''); return /^[A-ZÀ-Ý][a-zà-ÿ]/.test(t) && !/^(Les|L’|Il|On|Je) /.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t.charAt(0).toLowerCase() + t.slice(1); }
  /* Ce qu'elle a déjà écrit, en plus des suggestions par défaut */
  function phrasesFamille() { var l = []; (D.etat.schemas || []).forEach(function (x) { if (x.croyance) l.push(x.croyance); }); return l.concat(T_PHRASES).filter(function (v, i, a) { return v && a.indexOf(v) === i; }); }
  function devientProposes() { var l = T_DEVIENT.slice(), S = PF.SCHEMA || {}; (D.etat.schemas || []).forEach(function (x) { (x.fois || []).concat(x.lignee || []).forEach(function (f) { if (f.perso) l.push(cap(f.perso)); }); }); (S.reactions || []).forEach(function (r) { l.push(r); }); return l.filter(function (v, i, a) { return v && a.indexOf(v) === i; }).slice(0, 24); }
  function ressensProposes(p) { var l = T_RESSENS.slice(); theatre().persos.forEach(function (x) { (x.symptomes || []).forEach(function (t) { if (phrasesFamille().indexOf(t) < 0) l.push(t); }); }); ((p && p.symptomes) || []).forEach(function (t) { if (phrasesFamille().indexOf(t) < 0) l.push(t); }); return l.filter(function (v, i, a) { return v && a.indexOf(v) === i; }); }
  function cleFil(a, b) { return a + '|' + b; }
  function filsDores(sc) {
    var ids = Object.keys(sc.places || {}), l = [];
    ids.forEach(function (a) { ids.forEach(function (b) { var A = persoT(a), B = persoT(b); if (!A || !B || A.qui !== 'lignee' || B.qui !== 'vie') return; var com = (A.symptomes || []).filter(function (t) { return (B.symptomes || []).indexOf(t) >= 0; }); if (com.length) l.push({ a: a, b: b, com: com, cle: cleFil(a, b) }); }); });
    return l;
  }
  /* Ses mots (froid, qui part) d'un côté, les phrases de famille de l'autre */
  function estPhrase(t) { return phrasesFamille().indexOf(t) >= 0 || String(t).split(' ').length > 4; }
  function descPerso(p, l) { var mots = (l || p.symptomes || []).filter(function (t) { return !estPhrase(t); }), ph = (l || p.symptomes || []).filter(estPhrase); return { mots: mots, ph: ph }; }
  function phraseMiroir(f) {
    var A = persoT(f.a), B = persoT(f.b), d = descPerso(null, f.com), t = 'Tu ressens ' + B.nom + ' (' + lienTon(B) + ') comme tu ressens ' + A.nom + ' (' + lienTon(A) + ')';
    t += d.mots.length ? ' : ' + liste(d.mots.map(petit)) + '.' : '.';
    if (d.ph.length) t += ' Chez les deux, tu retrouves « ' + d.ph.join(' », « ') + ' ».';
    return t;
  }
  var ICONES_T = { perso: '<circle cx="8" cy="4.5" r="3"/><path d="M2.5 15c.6-3.6 2.8-5.6 5.5-5.6s4.9 2 5.5 5.6z"/>', desir: '<path d="M8 1.2l1.9 4.3 4.6.4-3.5 3 1.1 4.6L8 11l-4.1 2.5 1.1-4.6-3.5-3 4.6-.4z"/>', symbole: '<path d="M8 1.5l6 6.5-6 6.5-6-6.5z"/>' };
  function bulleT(p, pl, sel) {
    var c = p.couleur || '#6B2F5B', ty = typeDe(p);
    return '<button type="button" class="pa-bulle t-' + ty + (pl.dos ? ' dos' : '') + (sel ? ' sel' : '') + '" data-bulle="' + esc(p.id) + '" style="left:' + pl.x + '%;top:' + pl.y + '%;--t:' + tailleDe(pl) + ';background:' + c + ';color:' + (clair(c) ? '#2E1338' : '#fff') + '" aria-label="' + esc(p.nom + ', ' + lienPerso(p)) + '"><svg viewBox="0 0 16 16" aria-hidden="true">' + ICONES_T[ty] + '</svg><span><b>' + esc(p.nom) + '</b><small>' + esc(lienPerso(p)) + '</small></span></button>';
  }
  /* Ce que la scène montre : entre elle et ce qu'elle désire, qui prend le plus de place, qui est collé à elle */
  function lectureScene(sc) {
    var l = [], ids = Object.keys(sc.places).filter(persoT), m = sc.moi;
    function dist(a, b) { return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)); }
    ids.filter(function (k) { return typeDe(persoT(k)) === 'desir'; }).forEach(function (k) {
      var D0 = persoT(k), d = sc.places[k], dd = dist(m, d), entre = [];
      ids.forEach(function (j) { if (j === k) return; var q = sc.places[j], vx = d.x - m.x, vy = d.y - m.y, L2 = vx * vx + vy * vy || 1, t = ((q.x - m.x) * vx + (q.y - m.y) * vy) / L2; if (t <= .08 || t >= .95) return; var px = m.x + t * vx, py = m.y + t * vy; if (dist(q, { x: px, y: py }) < 11 + 4 * tailleDe(q)) entre.push(persoT(j)); });
      l.push((dd < 25 ? D0.nom + ' est près de toi.' : dd > 45 ? D0.nom + ' est loin de toi.' : D0.nom + ' est à mi-chemin.') + (entre.length ? ' Entre toi et ' + petit(D0.nom) + ', il y a ' + liste(entre.map(function (x) { return x.nom + (typeDe(x) === 'perso' ? ' (' + lienTon(x) + ')' : ''); })) + '.' : ''));
    });
    var gros = ids.filter(function (k) { return tailleDe(sc.places[k]) >= 1.3; }).sort(function (a, b) { return tailleDe(sc.places[b]) - tailleDe(sc.places[a]); });
    if (gros.length) l.push(liste(gros.slice(0, 3).map(function (k) { return persoT(k).nom; })) + (gros.length > 1 ? ' prennent' : ' prend') + ' beaucoup de place sur ta scène.');
    var colles = ids.filter(function (k) { return typeDe(persoT(k)) !== 'desir' && dist(m, sc.places[k]) < 20; });
    if (colles.length) l.push('Tout près de toi : ' + liste(colles.map(function (k) { return persoT(k).nom; })) + '.');
    var lourds = ids.filter(function (k) { return sc.places[k].poids === 'lourd'; });
    if (lourds.length) l.push('Le lien le plus lourd : ' + liste(lourds.map(function (k) { return persoT(k).nom; })) + '.');
    return l;
  }
  /* Les liens de toi à chacun (épaisseur = ce que ça pèse), et les fils dorés du miroir */
  function svgLiens(sc) {
    var s = '<svg class="pa-fils" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">';
    Object.keys(sc.places).forEach(function (k) { var pl = sc.places[k], P = poidsDe(pl.poids), pp = persoT(k); if (!pp) return; if (typeDe(pp) === 'desir') { s += '<line class="lien chemin" data-lien="' + esc(k) + '" x1="' + sc.moi.x + '" y1="' + sc.moi.y + '" x2="' + pl.x + '" y2="' + pl.y + '"/>'; return; } s += '<line class="lien" data-lien="' + esc(k) + '" x1="' + sc.moi.x + '" y1="' + sc.moi.y + '" x2="' + pl.x + '" y2="' + pl.y + '" style="stroke:' + P[3] + ';stroke-width:' + P[2] + 'px' + (P[4] ? ';stroke-dasharray:' + P[4] : '') + '"/>'; });
    if (!sc.sansFils) filsDores(sc).forEach(function (f) { var a = sc.places[f.a], b = sc.places[f.b], w = Math.max(poidsDe(a.poids)[2], poidsDe(b.poids)[2]); s += '<line class="or' + (sc.filNouveau === f.cle ? ' nouveau' : '') + '" pathLength="100" data-fil-a="' + esc(f.a) + '" data-fil-b="' + esc(f.b) + '" x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '" style="stroke-width:' + Math.max(2, w * .5) + 'px"/>'; });
    return s + '</svg>';
  }
  function miniScene(moi, places) {
    var ks = Object.keys(places || {});
    return '<svg class="pa-mini-sc" viewBox="0 0 100 100" aria-hidden="true"><rect x="0" y="0" width="100" height="100" rx="8"/>' + (moi ? ks.map(function (k) { var x = places[k], P = poidsDe(x.poids); return persoT(k) ? '<line x1="' + moi.x + '" y1="' + moi.y + '" x2="' + x.x + '" y2="' + x.y + '" stroke="' + P[3] + '" stroke-width="' + (P[2] / 2.2) + '"' + (P[4] ? ' stroke-dasharray="2 3"' : '') + '/>' : ''; }).join('') : '') + ks.map(function (k) { var p = persoT(k), x = places[k], r = 5 * tailleDe(x); return !p ? '' : typeDe(p) === 'symbole' ? '<rect x="' + (x.x - r) + '" y="' + (x.y - r) + '" width="' + 2 * r + '" height="' + 2 * r + '" transform="rotate(45 ' + x.x + ' ' + x.y + ')" fill="' + (p.couleur || '#6B2F5B') + '"/>' : '<circle cx="' + x.x + '" cy="' + x.y + '" r="' + r + '" fill="' + (p.couleur || '#6B2F5B') + '"' + (typeDe(p) === 'desir' ? ' stroke="#FFF4DA" stroke-width="1.5"' : '') + '/>'; }).join('') + (moi ? '<circle cx="' + moi.x + '" cy="' + moi.y + '" r="6" fill="#F2D9A0" stroke="#fff" stroke-width="1.5"/>' : '') + '</svg>';
  }
  function placeLibre(sc) { var n = Object.keys(sc.places).length, ang = n * 2.4 + .6; return { x: Math.round(50 + 30 * Math.cos(ang)), y: Math.round(50 + 30 * Math.sin(ang)), poids: 'present' }; }
  var choixT = '', photoApres = '', protoPerso = null;
  function vueTheatre(id) {
    var T = theatre(), sc = id ? sceneT(id) : null, h;
    if (!sc) {
      h = '<h1 class="pa-h1">Mon théâtre</h1><p class="pa-sous">Les personnages qui se rejouent dans ta vie. Place-les sur la scène, autour de toi, là où tu les sens.</p>';
      if (!(D.etat.vu || {}).theatre) h += '<section class="pa-carte pa-intro"><p><b>Comment ça marche.</b> Tu crées une scène, puis tes personnages : des personnes de ta lignée et des personnes de ta vie (ton patron, une amie, ton ex…), avec un nom et une couleur. Tu les places sur la scène, plus près ou plus loin de toi. Puis tu notes ce que tu ressens de chacun : comment tu le ou la vois, toi, depuis ta place. Un fil doré relie ceux de ta vie que tu ressens comme quelqu’un de ta lignée.</p><button type="button" class="pa-bt clair" data-t-vu>J’ai compris</button></section>';
      h += '<div class="pa-2col"><div><p class="pa-titre-s">1 · Mes scènes</p><button type="button" class="pa-bt or" data-t-scene-new>Nouvelle scène</button>' + (T.scenes.length ? T.scenes.map(function (s) { var n = Object.keys(s.places || {}).length, x = s.schema ? trouverSchema(s.schema) : null; return '<a class="pa-carte pa-scene-c" href="#theatre/' + esc(s.id) + '">' + miniScene(s.moi, s.places) + '<span><span class="pa-etiq">' + n + ' personnage' + (n > 1 ? 's' : '') + (s.photos && s.photos.length ? ' · ' + s.photos.length + ' photo' + (s.photos.length > 1 ? 's' : '') : '') + '</span><b>' + esc(s.titre || 'Ma scène') + '</b>' + (x ? '<small>Schéma : ' + esc(x.nom) + '</small>' : '') + '</span></a>'; }).join('') : '<p class="pa-discret">Commence par une scène : tes personnages se créent ensuite, depuis la scène. Tu peux aussi mettre en scène un schéma, depuis sa fiche.</p>') +
        '</div><div><p class="pa-titre-s">2 · Mes personnages</p>' + (T.persos.length ? '<div class="pa-persos-l">' + T.persos.filter(function (p) { return typeDe(p) === 'perso'; }).map(lignePerso).join('') + '</div>' + (T.persos.some(function (p) { return typeDe(p) !== 'perso'; }) ? '<p class="pa-titre-s">Mes désirs et mes symboles</p><div class="pa-persos-l">' + T.persos.filter(function (p) { return typeDe(p) !== 'perso'; }).map(lignePerso).join('') + '</div>' : '') : '<p class="pa-discret">Tes personnages se créent depuis une scène, et restent gardés pour toutes tes scènes.</p>') + '</div></div>';
      return afficher(h);
    }
    sc.places = sc.places || {}; sc.moi = sc.moi || { x: 50, y: 50 }; sc.ressentis = sc.ressentis || {}; sc.devient = sc.devient || {}; sc.photos = sc.photos || []; sc.filsVus = sc.filsVus || [];
    var F = filsDores(sc);
    /* un fil doré qui vient d'apparaître : tracé sous ses yeux, puis « Qu'est-ce que ça te fait de voir ça ? » */
    F.forEach(function (f) { if (sc.filsVus.indexOf(f.cle) < 0) { sc.filsVus.push(f.cle); sc.filNouveau = f.cle; sauver(); } });
    var dans = Object.keys(sc.places).map(persoT).filter(Boolean), sel = choixT && sc.places[choixT] ? persoT(choixT) : null, fn = sc.filNouveau ? F.filter(function (f) { return f.cle === sc.filNouveau; })[0] : null;
    h = '<a class="pa-retour" href="#theatre">‹ Mon théâtre</a><input class="pa-titre-in pa-titre-sc" data-t-titre maxlength="60" value="' + esc(sc.titre || '') + '" aria-label="Le nom de ta scène"><p class="pa-sous">Fais glisser chaque personnage là où tu le sens. Touche-le pour noter ce que tu ressens face à lui.</p>' +
      '<div class="pa-2col pa-theatre"><div><div class="pa-scene" id="pa-scene">' + svgLiens(sc) +
      '<button type="button" class="pa-bulle moi" data-bulle="moi" style="left:' + sc.moi.x + '%;top:' + sc.moi.y + '%" aria-label="Toi"><svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="4.5" r="3"/><path d="M2.5 15c.6-3.6 2.8-5.6 5.5-5.6s4.9 2 5.5 5.6z"/></svg><span><b>' + esc(D.prenom || 'Moi') + '</b><small>moi</small></span></button>' +
      dans.map(function (p) { return bulleT(p, sc.places[p.id], sel === p); }).join('') + (dans.length ? '' : '<p class="pa-scene-vide">Ajoute tes personnages sur la scène</p>') + '</div>' +
      '<p class="pa-discret pa-sous-scene">Un lien qui s’affine ne veut pas dire que tu aimes moins. Ça veut dire que tu portes moins.</p>' +
      '<div class="pa-outils"><button type="button" class="pa-bt or" data-t-ajout>Ajouter un personnage</button><button type="button" class="pa-bt clair" data-t-elem="desir">Ce que je désire</button><button type="button" class="pa-bt clair" data-t-elem="symbole">Un symbole</button><button type="button" class="pa-bt clair" data-t-photo>Garder une photo de la scène</button></div></div><div>';
    if (fn) h += '<section class="pa-carte pa-tiens-c"><p class="pa-etiq">Un fil doré vient d’apparaître</p><p>' + esc(phraseMiroir(fn)) + '</p><label for="pa-t-prise">Qu’est-ce que ça te fait de voir ça ?</label><textarea id="pa-t-prise" maxlength="600" placeholder="Je vois que je cherche chez Tom ce que je n’ai pas eu de mon père…"></textarea><div class="pa-outils"><button type="button" class="pa-bt or" data-t-prise>Je le note</button><button type="button" class="pa-lien-s" data-t-prise-plus-tard>Plus tard</button></div>' + (sc.schema ? '<p class="pa-discret">Ta réponse rejoint ton schéma comme une prise de conscience.</p>' : '') + '</section>';
    var lec = lectureScene(sc);
    if (lec.length) h += '<section class="pa-carte pa-lecture"><p class="pa-etiq">Ce que ta scène montre · une piste, pas une preuve</p><ul class="pa-echos">' + lec.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul><label for="pa-t-genere">Entre ce que tu veux et ce que tu vis, qu’est-ce que ta scène te dit ?</label><textarea id="pa-t-genere" maxlength="600" placeholder="Je veux l’amour, mais je garde mes ex tout près de moi…"></textarea><div class="pa-outils"><button type="button" class="pa-bt clair" data-t-genere>Je le note</button></div></section>';
    var tailleH = function (pl0) { return '<p class="pa-lab">La place que ça prend</p><div class="pa-puces" data-groupe="t-taille">' + TAILLES.map(function (x) { return '<button type="button" data-v="' + x[0] + '" aria-pressed="' + (String(pl0.taille || '2') === x[0]) + '">' + esc(x[1]) + '</button>'; }).join('') + '</div>'; };
    if (sel && typeDe(sel) !== 'perso') {
      var ple = sc.places[sel.id];
      h += '<section class="pa-carte pa-face"><p class="pa-etiq">' + (typeDe(sel) === 'desir' ? 'Ce que je désire' : 'Symbole') + ' · ' + esc(sel.nom) + '</p>' + tailleH(ple) +
        (typeDe(sel) === 'symbole' ? '<p class="pa-lab">Ça pèse comment aujourd’hui ?</p><div class="pa-puces" data-groupe="t-poids">' + POIDS.map(function (x) { return '<button type="button" data-v="' + x[0] + '" aria-pressed="' + ((ple.poids || 'present') === x[0]) + '"><i class="pa-trait" style="border-top:' + Math.max(1.5, x[2] * .6) + 'px ' + (x[4] ? 'dashed' : 'solid') + ' ' + x[3] + '"></i>' + esc(x[1]) + '</button>'; }).join('') + '</div>' : '<p class="pa-discret">Un chemin doré va de toi à ce que tu désires. Regarde ce qui se trouve dessus.</p>') +
        '<label for="pa-t-ress">' + (typeDe(sel) === 'desir' ? 'Qu’est-ce que tu ressens en regardant ' + esc(petit(sel.nom)) + ', à cette place ?' : 'Qu’est-ce que tu ressens face à ' + esc(petit(sel.nom)) + ', à cette place ?') + '</label><textarea id="pa-t-ress" data-t-ress="' + esc(sel.id) + '" maxlength="600">' + esc(sc.ressentis[sel.id] || '') + '</textarea>' +
        '<div class="pa-outils"><button type="button" class="pa-bt clair" data-t-elem-mod="' + esc(sel.id) + '">Modifier</button><button type="button" class="pa-lien-s" data-t-retirer="' + esc(sel.id) + '">Retirer de la scène</button></div></section>';
    }
    if (sel && typeDe(sel) === 'perso') {
      var pl = sc.places[sel.id];
      h += '<section class="pa-carte pa-face"><p class="pa-etiq">Face à ' + esc(sel.nom) + ' · ' + esc(lienPerso(sel)) + '</p>' + (function () { var d = descPerso(sel); return (d.mots.length ? '<p class="pa-discret" style="margin-top:0">Tu ' + leLa(sel) + ' ressens ' + esc(liste(d.mots.map(petit))) + '.' + (d.ph.length ? ' Tu retrouves chez ' + (genreDe(sel) === 'f' ? 'elle' : 'lui') + ' « ' + esc(d.ph.join(' », « ')) + ' ».' : '') + '</p>' : d.ph.length ? '<p class="pa-discret" style="margin-top:0">Tu retrouves chez ' + (genreDe(sel) === 'f' ? 'elle' : 'lui') + ' « ' + esc(d.ph.join(' », « ')) + ' ».</p>' : ''); })() +
        tailleH(pl) + '<p class="pa-lab">Ce lien pèse comment aujourd’hui ?</p><div class="pa-puces" data-groupe="t-poids">' + POIDS.map(function (x) { return '<button type="button" data-v="' + x[0] + '" aria-pressed="' + ((pl.poids || 'present') === x[0]) + '"><i class="pa-trait" style="border-top:' + Math.max(1.5, x[2] * .6) + 'px ' + (x[4] ? 'dashed' : 'solid') + ' ' + x[3] + '"></i>' + esc(x[1]) + '</button>'; }).join('') + '</div>' +
        '<label for="pa-t-ress">Qu’est-ce que tu ressens face à ' + esc(sel.nom) + ', à cette place ?</label><textarea id="pa-t-ress" data-t-ress="' + esc(sel.id) + '" maxlength="600" placeholder="Je me sens petite, j’ai envie de reculer…">' + esc(sc.ressentis[sel.id] || '') + '</textarea>' +
        '<p class="pa-lab">Ce que je deviens face à ' + (genreDe(sel) === 'f' ? 'elle' : genreDe(sel) === 'm' ? 'lui' : 'lui ou elle') + '</p>' + puces('t-dev', devientProposes().concat((sc.devient[sel.id] || []).filter(function (t) { return devientProposes().indexOf(t) < 0; })), sc.devient[sel.id] || [], true) +
        '<div class="pa-puces"><button type="button" data-t-dos aria-pressed="' + !!pl.dos + '">Il ou elle me tourne le dos</button></div><div class="pa-outils"><button type="button" class="pa-bt clair" data-t-perso="' + esc(sel.id) + '">Ce que je ressens de ' + (genreDe(sel) === 'f' ? 'elle' : genreDe(sel) === 'm' ? 'lui' : 'lui ou elle') + '</button><button type="button" class="pa-lien-s" data-t-retirer="' + esc(sel.id) + '">Retirer de la scène</button></div></section>';
    }
    h += '<section class="pa-carte"><p class="pa-etiq">Le miroir · une piste, pas une preuve</p>' + (F.length ? '<ul class="pa-echos">' + F.map(function (f) { return '<li>' + esc(phraseMiroir(f)) + '</li>'; }).join('') + '</ul><p class="pa-discret">Quelle place prends-tu face à eux ? Qu’est-ce qui se rejoue, de ta lignée à ta vie ?</p>' +
      '<div class="pa-outils">' + F.map(function (f) { return f.a; }).filter(function (v, i, a) { return a.indexOf(v) === i; }).map(function (a) { var A = persoT(a); return '<button type="button" class="pa-bt or" data-t-liberer="' + esc(a) + '">Libérer ce que je porte de ' + esc(A.nom) + ', ' + esc(lienTon(A)) + '</button>'; }).join('') + '</div><div class="pa-puces"><button type="button" data-t-fils aria-pressed="' + !sc.sansFils + '">Montrer les fils dorés</button></div>'
      : '<p class="pa-discret">Quand tu ressens une personne de ta vie comme une personne de ta lignée, un fil doré les relie ici.</p>') + '</section>';
    if (sc.photos.length) h += '<section class="pa-carte"><p class="pa-etiq">Les photos de ta scène</p><div class="pa-photos">' + sc.photos.slice().reverse().map(function (ph) { return '<figure>' + miniScene(ph.moi, ph.places) + '<figcaption><b>' + esc(dateCourte(ph.date)) + '</b>' + (ph.note ? esc(ph.note) : '') + '</figcaption></figure>'; }).join('') + '</div><p class="pa-discret">Compare : qui s’est rapproché, qui s’est éloigné, quel lien s’est affiné ?</p></section>';
    h += '<section class="pa-carte"><label for="pa-t-sc">Cette scène rejoint un schéma ? <small>(facultatif)</small></label><select id="pa-t-sc" data-t-schema><option value="">Aucun</option>' + (D.etat.schemas || []).map(function (x) { return '<option value="' + esc(x.id) + '"' + (sc.schema === x.id ? ' selected' : '') + '>' + esc(cap(x.nom)) + '</option>'; }).join('') + '</select><p class="pa-discret" data-sauve>' + esc(texteSauve()) + '</p><button type="button" class="pa-lien-s" data-t-scene-suppr>Supprimer cette scène</button></section>';
    h += '</div></div>';
    afficher(h);
    if (fn) setTimeout(function () { if (sc.filNouveau === fn.cle) { var l = document.querySelector('.pa-fils line.nouveau'); if (l) l.classList.remove('nouveau'); } }, 2200);
    brancherScene(sc);
    if (photoApres === sc.id) { photoApres = ''; photoScene(sc); }
  }
  function lignePerso(p) { return '<button type="button" class="pa-perso-l t-' + typeDe(p) + '" data-t-' + (typeDe(p) === 'perso' ? 'perso' : 'elem-mod') + '="' + esc(p.id) + '"><i style="background:' + esc(p.couleur || '#6B2F5B') + '"></i><span><b>' + esc(p.nom) + '</b><small>' + esc(lienPerso(p)) + (descPerso(p).mots.length ? ' · je ' + leLa(p) + ' ressens ' + esc(liste(descPerso(p).mots.slice(0, 2).map(petit))) : '') + '</small></span></button>'; }
  /* Glisser les bulles : la place se garde en % de la scène, les liens suivent */
  function brancherScene(sc) {
    var z = document.getElementById('pa-scene'); if (!z) return;
    var drag = null;
    function majLignes() {
      z.querySelectorAll('.pa-fils line.lien').forEach(function (l) { var p = sc.places[l.getAttribute('data-lien')]; if (!p) return; l.setAttribute('x1', sc.moi.x); l.setAttribute('y1', sc.moi.y); l.setAttribute('x2', p.x); l.setAttribute('y2', p.y); });
      z.querySelectorAll('.pa-fils line.or').forEach(function (l) { var a = sc.places[l.getAttribute('data-fil-a')], b2 = sc.places[l.getAttribute('data-fil-b')]; if (a && b2) { l.setAttribute('x1', a.x); l.setAttribute('y1', a.y); l.setAttribute('x2', b2.x); l.setAttribute('y2', b2.y); } });
    }
    z.addEventListener('pointerdown', function (e) {
      var b = e.target.closest('[data-bulle]'); if (!b) return;
      e.preventDefault(); try { b.setPointerCapture(e.pointerId); } catch (x) {}
      drag = { b: b, id: b.getAttribute('data-bulle'), x0: e.clientX, y0: e.clientY, bouge: false };
      b.classList.add('prise');
    });
    z.addEventListener('pointermove', function (e) {
      if (!drag) return;
      if (Math.abs(e.clientX - drag.x0) + Math.abs(e.clientY - drag.y0) > 5) drag.bouge = true;
      if (!drag.bouge) return;
      var r = z.getBoundingClientRect(), x = Math.max(8, Math.min(92, (e.clientX - r.left) / r.width * 100)), y = Math.max(6, Math.min(94, (e.clientY - r.top) / r.height * 100));
      x = Math.round(x * 10) / 10; y = Math.round(y * 10) / 10;
      drag.b.style.left = x + '%'; drag.b.style.top = y + '%';
      var pl = drag.id === 'moi' ? sc.moi : sc.places[drag.id]; pl.x = x; pl.y = y; majLignes();
    });
    var fin = function () {
      if (!drag) return; var d = drag; drag = null; d.b.classList.remove('prise');
      if (d.bouge) { sauver(); if (d.id !== 'moi') { choixT = d.id; rafraichir(); } }
      else if (d.id !== 'moi') { choixT = choixT === d.id ? '' : d.id; rafraichir(); }
    };
    z.addEventListener('pointerup', fin); z.addEventListener('pointercancel', fin);
  }
  /* Créer ou modifier un personnage : ce qu'elle ressent de lui ou d'elle, avec le « tiens… » */
  function ouvrirPersoT(id, pourScene, pre) {
    var T = theatre(), p = id === 'new' ? null : persoT(id), neuf = !p;
    if (neuf) p = { id: 'pt' + Date.now().toString(36), nom: '', qui: 'vie', role: '', genre: '', couleur: '#4E5D94', symptomes: pre ? [pre] : [] };
    var RS = ressensProposes(p), PH = phrasesFamille().concat((p.symptomes || []).filter(function (t) { return RS.indexOf(t) < 0 && phrasesFamille().indexOf(t) < 0; }));
    var h = '<p class="pa-etiq">' + (neuf ? 'Nouveau personnage' : 'Mon personnage') + '</p><h2>' + (neuf ? 'Qui est-ce ?' : esc(p.nom) + ' · ' + esc(lienPerso(p))) + '</h2><form class="pa-form" novalidate onsubmit="return false">' +
      '<p class="pa-lab">De ma lignée, ou de ma vie ?</p>' + puces('t-qui', [['vie', 'De ma vie'], ['lignee', 'De ma lignée']], [p.qui], false) +
      '<div id="pa-t-lignee"' + (p.qui === 'lignee' ? '' : ' hidden') + '><label for="pa-t-cle">Qui, dans ta lignée</label><select id="pa-t-cle"><option value="">Quelqu’un de ma lignée</option>' + personnes().map(function (q) { return '<option value="' + esc(q.k) + '"' + (p.cle === q.k ? ' selected' : '') + '>' + esc(nomL(q)) + '</option>'; }).join('') + '</select></div>' +
      '<div id="pa-t-vie"' + (p.qui === 'vie' ? '' : ' hidden') + '><p class="pa-lab">Qui est-ce pour toi ?</p>' + puces('t-role', ROLES_VIE, [p.role], false) + puces('t-genre', [['m', 'Il'], ['f', 'Elle']], [p.genre], false) + '</div>' +
      '<label for="pa-t-nom">Le nom que tu lui donnes</label><input id="pa-t-nom" maxlength="30" value="' + esc(p.nom) + '" placeholder="Marc, le Chef, le Froid…">' +
      '<p class="pa-lab">Sa couleur</p><div class="pa-couleurs">' + COULEURS_T.map(function (c) { return '<button type="button" data-t-coul="' + c[0] + '" aria-pressed="' + (p.couleur === c[0]) + '" style="background:' + c[0] + '" aria-label="' + c[1] + '"></button>'; }).join('') + '</div>' +
      '<h3 class="pa-h3" style="margin-top:1rem">Ce que je ressens de lui ou d’elle</h3><p class="pa-discret" style="margin-top:0">C’est ta vision, avec ton vécu. Lui ou elle aurait sûrement un autre point de vue, et c’est normal : ici, on regarde ce qui se rejoue en toi.</p>' +
      '<p class="pa-lab">Comment je le ou la ressens</p>' + puces('t-sym', RS, p.symptomes, true) +
      '<p class="pa-lab">La phrase de famille que je retrouve chez lui ou elle</p>' + puces('t-phr', PH, p.symptomes, true) +
      '<div class="pa-note"><input type="text" id="pa-t-sym" maxlength="80" placeholder="Je le sens froid et absent, j’ai l’impression qu’il va partir…" aria-label="Ajouter ce que tu ressens de lui ou d’elle"><button type="button" class="pa-bt" style="margin:0" data-t-sym-ajout>Ajouter</button></div>' +
      '<p class="pa-discret">Choisis le même mot si tu sens que c’est la même chose : c’est ce qui permet au miroir de faire le lien.</p><div id="pa-tiens" aria-live="polite"></div>' +
      '<div class="pa-outils"><button type="button" class="pa-bt or" data-t-ok>' + (neuf ? (pourScene ? 'Créer et placer sur la scène' : 'Créer') : 'C’est noté') + '</button>' + (neuf ? '' : '<button type="button" class="pa-lien-s" data-t-suppr>Supprimer ce personnage</button>') + '</div><p class="pa-erreur" role="alert"></p></form>';
    var z = feuille(h, { enregistrer: function () { return lire(); } });
    function syms() { return lirePuces(z, 't-sym').concat(lirePuces(z, 't-phr')); }
    function lire() {
      var nom = z.querySelector('#pa-t-nom').value.trim(), cle = z.querySelector('#pa-t-cle').value;
      p.qui = lirePuces(z, 't-qui')[0] || 'vie'; p.cle = p.qui === 'lignee' ? cle : ''; p.role = p.qui === 'vie' ? lirePuces(z, 't-role')[0] || '' : ''; p.genre = p.qui === 'vie' ? lirePuces(z, 't-genre')[0] || '' : '';
      if (!nom && p.qui === 'lignee' && cle && personne(cle)) nom = personne(cle).prenom;
      if (!nom) { z.querySelector('.pa-erreur').textContent = 'Donne-lui un nom.'; return false; }
      p.nom = nom.slice(0, 30); p.symptomes = syms();
      if (T.persos.indexOf(p) < 0) T.persos.push(p);
      return true;
    }
    /* « Tiens… » : ce ressenti, elle l'a déjà donné à quelqu'un ; le nom n'apparaît que si elle touche la bulle */
    function tiens(v) {
      var zt = z.querySelector('#pa-tiens'), autres = T.persos.filter(function (x) { return x !== p && (x.symptomes || []).indexOf(v) >= 0; });
      if (autres.length) { zt.innerHTML = '<button type="button" class="pa-tiens" data-t-tiens>Tiens… tu as déjà ressenti ça pour quelqu’un.</button><p class="pa-tiens-nom" hidden>' + esc(liste(autres.map(function (x) { return x.nom + ', ' + lienTon(x); }))) + ' : « ' + esc(petit(v)) + ' ».</p>'; return; }
      var aut = T.persos.filter(function (x) { return x !== p && typeDe(x) === 'perso'; });
      zt.innerHTML = '<div class="pa-tiens-q"><p>Qui d’autre tu sens comme ça, dans ta vie ou dans ta lignée ?</p>' + (aut.length ? '<div class="pa-puces pa-exemples">' + aut.map(function (x) { return '<button type="button" data-t-aussi="' + esc(x.id) + '" data-v2="' + esc(v) + '">' + esc(x.nom) + '</button>'; }).join('') + '</div>' : '') + '<button type="button" class="pa-lien-s" data-t-aussi-new="' + esc(v) + '">Créer un nouveau personnage</button></div>';
    }
    z.addEventListener('change', function (e) {
      if (e.target.closest('[data-groupe="t-qui"]')) { var q = lirePuces(z, 't-qui')[0]; z.querySelector('#pa-t-lignee').hidden = q !== 'lignee'; z.querySelector('#pa-t-vie').hidden = q !== 'vie'; }
    });
    z.addEventListener('click', function (e) {
      var sb2 = e.target.closest('[data-groupe="t-sym"] button, [data-groupe="t-phr"] button');
      if (sb2) { setTimeout(function () { if (sb2.getAttribute('aria-pressed') === 'true') tiens(sb2.getAttribute('data-v')); else z.querySelector('#pa-tiens').innerHTML = ''; }, 0); return; }
      if (e.target.closest('[data-t-tiens]')) { var n = z.querySelector('.pa-tiens-nom'); if (n) n.hidden = false; return; }
      var au = e.target.closest('[data-t-aussi]'); if (au) { var x = persoT(au.getAttribute('data-t-aussi')), v = au.getAttribute('data-v2'); if (x && (x.symptomes || []).indexOf(v) < 0) { x.symptomes = (x.symptomes || []).concat([v]); } au.setAttribute('aria-pressed', 'true'); au.textContent = '✓ ' + x.nom; sauver(); return; }
      var an = e.target.closest('[data-t-aussi-new]'); if (an) { if (!lire()) return; placerSi(p); sauver(); ouvrirPersoT('new', pourScene, an.getAttribute('data-t-aussi-new')); return; }
      var c = e.target.closest('[data-t-coul]'); if (c) { p.couleur = c.getAttribute('data-t-coul'); z.querySelectorAll('[data-t-coul]').forEach(function (b) { b.setAttribute('aria-pressed', b === c); }); return; }
      if (e.target.closest('[data-t-sym-ajout]')) { var i = z.querySelector('#pa-t-sym'), v2 = i.value.trim(); if (!v2) return; var g = z.querySelector('[data-groupe="t-sym"]'), b = document.createElement('button'); b.type = 'button'; b.setAttribute('data-v', v2); b.setAttribute('aria-pressed', 'true'); b.textContent = v2; g.appendChild(b); i.value = ''; tiens(v2); return; }
      if (e.target.closest('[data-t-ok]')) { if (!lire()) return; placerSi(p); sauver(); fermerFeuille(); return; }
      if (e.target.closest('[data-t-suppr]') && confirm('Supprimer ce personnage de toutes tes scènes ?')) { T.persos = T.persos.filter(function (x) { return x !== p; }); T.scenes.forEach(function (s) { delete (s.places || {})[p.id]; }); sauver(); fermerFeuille(); }
    });
    function placerSi(pp) { if (!pourScene) return; var sc = sceneT(pourScene); if (sc && !sc.places[pp.id]) { sc.places[pp.id] = placeLibre(sc); choixT = pp.id; } }
  }
  function ouvrirElementT(id, type, pourScene) {
    var T = theatre(), p = id ? persoT(id) : null, neuf = !p; type = p ? typeDe(p) : type;
    if (neuf) p = { id: 'pt' + Date.now().toString(36), nom: '', type: type, couleur: type === 'desir' ? '#D4A24C' : '#8A8494', symptomes: [] };
    var deja = T.persos.filter(function (x) { return typeDe(x) === type && x !== p && pourScene && !sceneT(pourScene).places[x.id]; });
    var SUG = (type === 'desir' ? T_DESIRS : T_SYMBOLES).filter(function (t) { return !T.persos.some(function (x) { return x.nom === t; }); });
    var h = '<p class="pa-etiq">' + (type === 'desir' ? 'Ce que je désire' : 'Un symbole') + '</p><h2>' + (type === 'desir' ? 'Qu’est-ce que tu veux dans ta vie ?' : 'Qu’est-ce qui prend de la place dans ta vie ?') + '</h2>' +
      '<p class="pa-discret">' + (type === 'desir' ? 'Place-le sur la scène, là où tu le sens aujourd’hui : près de toi, ou loin. Tu verras ce qui se trouve entre toi et lui.' : 'Une peur, les factures, le travail… C’est toi qui l’écris. Place-le là où tu le sens, et donne-lui la taille qu’il prend.') + '</p>' +
      (neuf && deja.length ? '<p class="pa-lab">Déjà créés</p><div class="pa-persos-l">' + deja.map(function (x) { return '<button type="button" class="pa-perso-l" data-t-place-el="' + esc(x.id) + '"><i style="background:' + esc(x.couleur) + '"></i><span><b>' + esc(x.nom) + '</b></span></button>'; }).join('') + '</div>' : '') +
      '<form class="pa-form" novalidate onsubmit="return false"><label for="pa-el-nom">' + (type === 'desir' ? 'Ce que je désire' : 'Mon symbole') + '</label><input id="pa-el-nom" maxlength="40" value="' + esc(p.nom) + '" placeholder="' + (type === 'desir' ? 'L’amour, la paix, mon projet…' : 'La peur, les factures, les impôts…') + '">' +
      (SUG.length ? '<div class="pa-debuts">' + SUG.map(function (t) { return '<button type="button" data-el-sug="' + esc(t) + '">' + esc(t) + '</button>'; }).join('') + '</div>' : '') +
      '<p class="pa-lab">Sa couleur</p><div class="pa-couleurs">' + COULEURS_T.map(function (c) { return '<button type="button" data-t-coul="' + c[0] + '" aria-pressed="' + (p.couleur === c[0]) + '" style="background:' + c[0] + '" aria-label="' + c[1] + '"></button>'; }).join('') + '</div>' +
      '<div class="pa-outils"><button type="button" class="pa-bt or" data-el-ok>' + (neuf && pourScene ? 'Placer sur la scène' : 'C’est noté') + '</button>' + (neuf ? '' : '<button type="button" class="pa-lien-s" data-el-suppr>Supprimer</button>') + '</div><p class="pa-erreur" role="alert"></p></form>';
    var z = feuille(h, { enregistrer: function () { return lire(); } });
    function lire() { var n = z.querySelector('#pa-el-nom').value.trim(); if (!n) { z.querySelector('.pa-erreur').textContent = 'Écris-le en quelques mots.'; return false; } p.nom = n.slice(0, 40); if (T.persos.indexOf(p) < 0) T.persos.push(p); return true; }
    function placer(x) { var sc = pourScene && sceneT(pourScene); if (sc && !sc.places[x.id]) { var pl = placeLibre(sc); if (type === 'desir') { pl.x = 85; pl.y = 12; } sc.places[x.id] = pl; choixT = x.id; } }
    z.addEventListener('click', function (e) {
      var sg = e.target.closest('[data-el-sug]'); if (sg) { z.querySelector('#pa-el-nom').value = sg.getAttribute('data-el-sug'); return; }
      var c = e.target.closest('[data-t-coul]'); if (c) { p.couleur = c.getAttribute('data-t-coul'); z.querySelectorAll('[data-t-coul]').forEach(function (b) { b.setAttribute('aria-pressed', b === c); }); return; }
      var pe = e.target.closest('[data-t-place-el]'); if (pe) { placer(persoT(pe.getAttribute('data-t-place-el'))); sauver(); fermerFeuille(); return; }
      if (e.target.closest('[data-el-ok]')) { if (!lire()) return; placer(p); sauver(); fermerFeuille(); return; }
      if (e.target.closest('[data-el-suppr]') && confirm('Supprimer de toutes tes scènes ?')) { T.persos = T.persos.filter(function (x) { return x !== p; }); T.scenes.forEach(function (s0) { delete (s0.places || {})[p.id]; }); sauver(); fermerFeuille(); }
    });
  }
  function ajouterSurScene(sc) {
    var hors = theatre().persos.filter(function (p) { return !sc.places[p.id] && typeDe(p) === 'perso'; });
    if (!hors.length) return ouvrirPersoT('new', sc.id);
    var z = feuille('<p class="pa-etiq">Ajouter sur la scène</p><h2>Qui vient sur la scène ?</h2><div class="pa-persos-l">' + hors.map(function (p) { return lignePerso(p).replace(/data-t-(perso|elem-mod)=/, 'data-t-place='); }).join('') + '</div><button type="button" class="pa-bt or" data-t-nouveau>Créer un nouveau personnage</button>');
    z.addEventListener('click', function (e) {
      var b = e.target.closest('[data-t-place]'); if (b) { var id = b.getAttribute('data-t-place'); sc.places[id] = placeLibre(sc); choixT = id; sauver(); fermerFeuille(); return; }
      if (e.target.closest('[data-t-nouveau]')) ouvrirPersoT('new', sc.id);
    });
  }
  function photoScene(sc) {
    var z = feuille('<p class="pa-etiq">Une photo de ta scène</p><h2>Comment tu te sens, aujourd’hui ?</h2>' + miniScene(sc.moi, sc.places) + '<form class="pa-form" novalidate onsubmit="return false"><label for="pa-t-ph">En quelques mots <small>(facultatif)</small></label><input id="pa-t-ph" maxlength="140" placeholder="Je me sens plus libre face à Marc…"><button type="button" class="pa-bt or" data-t-ph-ok>Garder cette photo</button></form>');
    z.addEventListener('click', function (e) { if (!e.target.closest('[data-t-ph-ok]')) return; sc.photos.push({ date: iso(new Date()), moi: { x: sc.moi.x, y: sc.moi.y }, places: JSON.parse(JSON.stringify(sc.places)), note: z.querySelector('#pa-t-ph').value.trim().slice(0, 140) }); sauver(); fermerFeuille(); });
  }
  /* Une scène depuis un schéma : les personnes de la frise (« avec qui », la lignée) arrivent déjà sur la scène */
  function nouvelleScene(schemaId) {
    var T = theatre(), x = schemaId ? trouverSchema(schemaId) : null, sc = { id: 'sn' + Date.now().toString(36), titre: x ? cap(x.nom) : 'Ma scène', schema: x ? x.id : '', cree: iso(new Date()), moi: { x: 50, y: 52 }, places: {}, ressentis: {}, devient: {}, photos: [], filsVus: [] };
    if (x) {
      completerSchema(x);
      var trouve = function (o) { return T.persos.filter(function (p) { return (o.cle && p.cle === o.cle) || (!o.cle && p.nom.toLowerCase() === o.nom.toLowerCase()); })[0]; };
      var ajoute = function (o, sym, dev) {
        var p = trouve(o); if (!p) { p = { id: 'pt' + Date.now().toString(36) + T.persos.length, nom: o.nom, qui: o.cle ? 'lignee' : 'vie', cle: o.cle || '', role: o.role || '', genre: '', couleur: o.cle ? '#8A8494' : '#7FA7D9', symptomes: [] }; T.persos.push(p); }
        (sym || []).forEach(function (t) { if (t && p.symptomes.indexOf(t) < 0) p.symptomes.push(t); });
        if (!sc.places[p.id]) sc.places[p.id] = placeLibre(sc);
        if (dev) sc.devient[p.id] = (sc.devient[p.id] || []).concat([dev]).filter(function (v, i, a) { return a.indexOf(v) === i; });
      };
      x.lignee.forEach(function (l) { var q = l.qui ? personne(l.qui) : null; if (q) ajoute({ nom: q.prenom, cle: q.k }, x.croyance ? [x.croyance] : []); else if (l.nomLibre) ajoute({ nom: l.nomLibre }, x.croyance ? [x.croyance] : []); });
      x.fois.forEach(function (f) {
        var t = String(f.qui || '').trim(); if (!t) return;
        var tu = tuMoi(t).toLowerCase(), q = personnes().filter(function (pp) { return pp.lien.toLowerCase() === tu; })[0];
        if (q) ajoute({ nom: q.prenom, cle: q.k }, [], f.perso ? cap(f.perso) : '');
        else ajoute({ nom: cap(t.replace(/^(mon|ma|mes) /i, '')).slice(0, 30) }, [], f.perso ? cap(f.perso) : '');
      });
    }
    T.scenes.push(sc); sauver(); location.hash = 'theatre/' + sc.id;
  }
  function sceneDuSchema(id) { return theatre().scenes.filter(function (s) { return s.schema === id; })[0] || null; }
  /* Les clics et saisies de Mon théâtre */
  vue.addEventListener('click', function (e) {
    var hs = (location.hash.match(/^#theatre\/(\w+)/) || [])[1], sc = hs ? sceneT(hs) : null;
    if (e.target.closest('[data-t-vu]')) { D.etat.vu = D.etat.vu || {}; D.etat.vu.theatre = iso(new Date()); sauver(); rafraichir(); return; }
    if (e.target.closest('[data-t-scene-new]')) { nouvelleScene(); return; }
    var tp = e.target.closest('[data-t-perso]'); if (tp) { ouvrirPersoT(tp.getAttribute('data-t-perso'), sc ? sc.id : ''); return; }
    var em = e.target.closest('[data-t-elem-mod]'); if (em) { ouvrirElementT(em.getAttribute('data-t-elem-mod'), '', sc ? sc.id : ''); return; }
    var ne = e.target.closest('[data-t-elem]'); if (ne && sc) { ouvrirElementT('', ne.getAttribute('data-t-elem'), sc.id); return; }
    if (!sc) return;
    if (e.target.closest('[data-t-ajout]')) { ajouterSurScene(sc); return; }
    if (e.target.closest('[data-t-photo]')) { photoScene(sc); return; }
    if (e.target.closest('[data-t-dos]')) { var pl = sc.places[choixT]; if (pl) { pl.dos = !pl.dos; sauver(); rafraichir(); } return; }
    if (e.target.closest('[data-t-fils]')) { sc.sansFils = !sc.sansFils; sauver(); rafraichir(); return; }
    if (e.target.closest('[data-t-prise]')) {
      var t = (document.getElementById('pa-t-prise') || {}).value || ''; t = t.trim();
      if (t) { var pr = { date: iso(new Date()), texte: t.slice(0, 600), source: 'Mon théâtre · ' + (sc.titre || '') }, x = sc.schema ? trouverSchema(sc.schema) : null; if (x) { x.prises = x.prises || []; x.prises.push(pr); } else { sc.prises = sc.prises || []; sc.prises.push(pr); } }
      sc.filNouveau = ''; sauver(); rafraichir(); return;
    }
    if (e.target.closest('[data-t-genere]')) {
      var tg = ((document.getElementById('pa-t-genere') || {}).value || '').trim(); if (!tg) return;
      var prg = { date: iso(new Date()), texte: tg.slice(0, 600), source: 'Mon théâtre · ' + (sc.titre || '') }, xs = sc.schema ? trouverSchema(sc.schema) : null;
      if (xs) { xs.prises = xs.prises || []; xs.prises.push(prg); } else { sc.prises = sc.prises || []; sc.prises.push(prg); }
      sauver(); var bt = e.target.closest('[data-t-genere]'); bt.textContent = '✓ C’est noté'; bt.disabled = true; return;
    }
    if (e.target.closest('[data-t-prise-plus-tard]')) { sc.filNouveau = ''; sauver(); rafraichir(); return; }
    var lb = e.target.closest('[data-t-liberer]'); if (lb) { var A = persoT(lb.getAttribute('data-t-liberer')); protoPerso = A ? { cle: A.cle, nom: A.nom, lien: lienTon(A), f: genreDe(A) === 'f' } : null; location.hash = 'actions/lignee' + (sc.schema ? '/' + sc.schema : ''); return; }
    var rt = e.target.closest('[data-t-retirer]'); if (rt) { delete sc.places[rt.getAttribute('data-t-retirer')]; choixT = ''; sauver(); rafraichir(); return; }
    if (e.target.closest('[data-t-scene-suppr]') && confirm('Supprimer cette scène ? Tes personnages restent gardés.')) { theatre().scenes = theatre().scenes.filter(function (s) { return s !== sc; }); sauver(); location.hash = 'theatre'; }
  });
  vue.addEventListener('input', function (e) {
    var hs = (location.hash.match(/^#theatre\/(\w+)/) || [])[1], sc = hs ? sceneT(hs) : null; if (!sc) return;
    if (e.target.hasAttribute('data-t-titre')) { sc.titre = e.target.value.slice(0, 60); sauver(); }
    var r = e.target.getAttribute('data-t-ress'); if (r) { sc.ressentis[r] = e.target.value; sauver(); }
  });
  vue.addEventListener('change', function (e) {
    var hs = (location.hash.match(/^#theatre\/(\w+)/) || [])[1], sc = hs ? sceneT(hs) : null; if (!sc) return;
    if (e.target.hasAttribute('data-t-schema')) { sc.schema = e.target.value; sauver(); return; }
    var g = e.target.closest('[data-groupe]'); if (!g || !choixT || !sc.places[choixT]) return;
    var n = g.getAttribute('data-groupe');
    if (n === 't-taille') { sc.places[choixT].taille = lirePuces(g.parentNode, 't-taille')[0] || '2'; sauver(); rafraichir(); return; }
    if (n === 't-poids') { sc.places[choixT].poids = lirePuces(g.parentNode, 't-poids')[0] || 'present'; sc.poidsMaj = iso(new Date()); sauver(); rafraichir(); }
    else if (n === 't-dev') { sc.devient[choixT] = lirePuces(g.parentNode, 't-dev'); sauver(); }
  });

  /* ───── Navigation ───── */
  var ANCIENS = { enquete: 'fil', ciel: '', livrets: '' };
  function onglet() { var h = (location.hash || '').replace('#', ''); if (ANCIENS.hasOwnProperty(h)) h = ANCIENS[h]; return ['fil', 'agenda', 'bilan'].indexOf(h) >= 0 || /^actions(\/[a-z]+(\/[a-z0-9]+(\/age)?)?)?$/.test(h) || /^theatre(\/\w+)?$/.test(h) ? h : ''; }
  function router() {
    var h = onglet(); CACHE_P = null;
    document.querySelectorAll('.pa-feuille,.pa-voile').forEach(function (x) { x.remove(); }); defiger();
    document.querySelectorAll('.pa-barre [data-onglet]').forEach(function (a) { if (a.getAttribute('data-onglet') === (/^actions/.test(h) ? 'actions' : /^theatre/.test(h) ? 'theatre' : h || 'moi')) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    var barre = document.querySelector('.pa-barre');
    if (!D.acces) { barre.hidden = true; document.body.classList.add('pa-porte-b'); return vuePorte(); }
    barre.hidden = false; document.body.classList.remove('pa-porte-b');
    var z = document.getElementById('pa-espaces'); if (z) z.innerHTML = espacesLiens('');
    var ac = /^actions/.test(h) ? h.split('/')[1] || '' : null, acS = h.split('/')[2] || '', acM = h.split('/')[3] || '';
    var th = /^theatre/.test(h) ? h.split('/')[1] || '' : null; if (th === null || !sceneT(th)) choixT = '';
    if (!/^actions\/lignee/.test(h)) protoPerso = null;
    /* Dans l'exemple, Mes actions reste fermé tant que les protocoles ne sont pas en ligne (1er novembre) */
    if (EXEMPLE) { var la = document.querySelector('.pa-barre [data-onglet="actions"]'); if (la && !la.classList.contains('pa-ferme')) { la.classList.add('pa-ferme'); la.setAttribute('aria-disabled', 'true'); la.insertAdjacentHTML('beforeend', '<em>1er nov.</em>'); } }
    var fn = th != null ? function () { vueTheatre(th); } : ac != null ? (EXEMPLE ? vueActionsFermee : function () { vueActions(ac, acS, acM); }) : h === 'fil' ? vueFil : h === 'agenda' ? vueAgenda : h === 'bilan' ? vueBilan : vueMoi;
    rafraichir = function () { var y = window.scrollY; fn(); aller(y); };
    fn();
  }
  function vueActionsFermee() {
    afficher('<section class="pa-carte pa-porte"><p class="pa-etiq">Mes actions</p><h1 class="pa-h1">Les protocoles arrivent le 1<sup>er</sup> novembre</h1><p>Dans Ma spirale, « Mes actions » réunit tous les protocoles : trouver la première fois, libérer la mémoire de ta vie et de ta lignée, poser une intention, revenir au calme. Ils se remplissent avec ta fiche.</p><p>Dans cet exemple, ils ne sont pas encore ouverts. Reviens à partir du 1<sup>er</sup> novembre : tout sera en ligne.</p><div class="pa-outils" style="justify-content:center"><a class="pa-bt or" href="#">Revenir à l’exemple</a><a class="pa-bt clair" href="#theatre">Voir Mon théâtre</a></div></section>');
  }
  function vueAgendaSansHaut() { var y = window.scrollY; vueAgenda(); aller(y); }
  window.addEventListener('hashchange', router);
  document.querySelector('.pa-barre').addEventListener('click', function (e) {
    var a = e.target.closest('[data-onglet]'); if (!a) return;
    if (a.classList.contains('pa-ferme')) { e.preventDefault(); return; }
    if (a.getAttribute('data-onglet') === 'moi') { e.preventDefault(); history.pushState(null, '', location.pathname + location.search); router(); }
  });
  vue.addEventListener('click', function (e) {
    if (e.target.closest('[data-depot]')) { ouvrirDepot(); return; }
    if (e.target.closest('[data-fil-vu]')) { D.etat.vu = D.etat.vu || {}; D.etat.vu.fil = iso(new Date()); sauver(); rafraichir(); return; }
    var fp = e.target.closest('[data-fil-p]'); if (fp) { filSel = fp.getAttribute('data-fil-p'); rafraichir(); return; }
    var fm = e.target.closest('[data-fil-m]'); if (fm) { ouvrirMoment(fm.getAttribute('data-fil-m')); return; }
    if (e.target.closest('[data-fil-suppr]')) { var F0 = filEtat(), x0 = F0.personnes[filSel]; if (x0 && (!(x0.etapes || []).some(plein) || confirm('Retirer cette personne et ses moments de ton fil d’or ?'))) { delete F0.personnes[filSel]; F0.ordre = F0.ordre.filter(function (k) { return k !== filSel; }); filSel = 'toi'; sauverFil(); rafraichir(); } return; }
    var cj = e.target.closest('[data-corps-j]'); if (cj) { var rr = trouver(cj.getAttribute('data-corps-j')), kk = iso(new Date()); if (rr) { rr.corpsJ = rr.corpsJ || {}; if (rr.corpsJ[kk]) delete rr.corpsJ[kk]; else rr.corpsJ[kk] = 1; sauver(); rafraichir(); } return; }
    var scb = e.target.closest('[data-schema]'); if (scb) { ouvrirSchema(scb.getAttribute('data-schema'), scb.getAttribute('data-onglet-s') || null); return; }
    if (e.target.closest('[data-toute-vie]')) { ouvrirTouteVie(); return; }
    var fr = e.target.closest('[data-frise]'); if (fr) { friseSel = fr.getAttribute('data-frise'); rafraichir(); return; }
    var vn = e.target.closest('[data-venu]'); if (vn) { noterVenu(vn); return; }
    var af = e.target.closest('[data-action-fait]'); if (af) { var sx = trouverSchema(af.getAttribute('data-action-fait')), ck = af.getAttribute('data-cle'); if (sx) { sx[ck] = sx[ck] ? '' : iso(new Date()); sauver(); rafraichir(); } return; }
    var rv = e.target.closest('[data-reve]'); if (rv) { ouvrirReve(rv.getAttribute('data-reve')); return; }
    var f = e.target.closest('[data-fil]'); if (f && trouver(f.getAttribute('data-fil')) && trouver(f.getAttribute('data-fil')).schema) { ouvrirSchema(trouver(f.getAttribute('data-fil')).schema); return; }
    if (f) { ouvrirFil(f.getAttribute('data-fil'), f.hasAttribute('data-etape') ? +f.getAttribute('data-etape') : null); return; }
    var pe = e.target.closest('[data-personne]'); if (pe) { ouvrirPersonne(pe.getAttribute('data-personne')); return; }
    if (e.target.closest('[data-imprimer]')) { window.print(); return; }
    if (e.target.closest('[data-nj-ok]')) { sauverMaintenant(function (t) { var z = document.querySelector('[data-nj-msg]'); if (z) z.textContent = /gardé/.test(t) && !/Pas encore/.test(t) ? 'Noté.' : t; }); return; }
    if (e.target.closest('[data-jp]')) { ecrireL('genesolia-pass-jp', !voirJP()); vueAgendaSansHaut(); return; }
    var m = e.target.closest('[data-mois]'); if (m) { vueMoisD = new Date(vueMoisD.getFullYear(), vueMoisD.getMonth() + +m.getAttribute('data-mois'), 1); jourChoisi = null; vueAgenda(); return; }
    var j = e.target.closest('[data-jour]'); if (j) { jourChoisi = new Date(vueMoisD.getFullYear(), vueMoisD.getMonth(), +j.getAttribute('data-jour')); document.querySelectorAll('.pa-jour.choisi').forEach(function (x) { x.classList.remove('choisi'); }); j.classList.add('choisi'); detailJour(); if (window.innerWidth < 1000) { var d = document.getElementById('pa-jour-detail'); if (d) d.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } return; }
    var r = e.target.closest('[data-rappel]');
    if (r) { var c = r.getAttribute('data-rappel'), R = D.etat.rappels = D.etat.rappels || {}; if (R[c]) delete R[c]; else R[c] = { texte: r.getAttribute('data-texte'), date: r.getAttribute('data-date') }; sauver(); vueAgendaSansHaut(); return; }
    var s = e.target.closest('[data-suppr]');
    if (s) { var p = s.getAttribute('data-suppr').split('-'), dk = p.slice(1, 4).join('-'), n = +p[4], N2 = D.etat.notes[dk] || []; N2.splice(n, 1); if (!N2.length) delete D.etat.notes[dk]; sauver(); vueAgendaSansHaut(); return; }
    if (e.target.closest('[data-note]')) { var t = document.getElementById('pa-note-t'), v = t && t.value.trim(); if (!v) return; var k = iso(jourChoisi); (D.etat.notes[k] = D.etat.notes[k] || []).push(v.slice(0, 140)); sauver(); vueAgendaSansHaut(); return; }
    if (e.target.closest('[data-ics]')) { telechargerIcs(); }
  });
  vue.addEventListener('change', function (e) {
    var g = e.target.closest('[data-groupe="humeur"]');
    if (g) { var k = document.getElementById('pa-jour-detail') && jourChoisi && g.closest('#pa-jour-detail') ? iso(jourChoisi) : iso(new Date()), H = D.etat.humeurs = D.etat.humeurs || {}, v = lirePuces(g.parentNode, 'humeur'); if (v.length) H[k] = v; else delete H[k]; sauver(); if (g.closest('#pa-jour-detail')) rafraichir(); return; }
    var gj = e.target.closest('[data-groupe^="nj-"]');
    if (gj) { var kj = iso(new Date()), NJ2 = D.etat.notesJour = D.etat.notesJour || {}, nn = gj.getAttribute('data-groupe').slice(3), vv = lirePuces(gj.parentNode, gj.getAttribute('data-groupe')); (NJ2[kj] = NJ2[kj] || {})[nn] = nn === 'fait' ? vv[0] || '' : vv; sauver(); if (nn === 'corps') { var zt = document.getElementById('pa-nj-tiens'); if (zt) zt.innerHTML = tiensCorps(vv, kj); } return; }
    if (e.target.getAttribute('data-nj') === 'schema') { var kj2 = iso(new Date()), NJ3 = D.etat.notesJour = D.etat.notesJour || {}; (NJ3[kj2] = NJ3[kj2] || {}).schema = e.target.value; sauver(); return; }
    var aj = e.target.closest('[data-fil-ajout]');
    if (aj && aj.value) { var F = filEtat(), v2 = aj.value, id; if (/^r:/.test(v2)) { F.seq = (F.seq || 0) + 1; id = 'a' + F.seq; F.personnes[id] = nouvPers(id, v2.slice(2)); } else { id = v2; F.personnes[id] = nouvPers(id, ''); } F.ordre.push(id); filSel = id; sauverFil(); rafraichir(); }
  });
  vue.addEventListener('input', function (e) { var nj = e.target.getAttribute('data-nj'); if (nj) { var kk = iso(new Date()), NJ = D.etat.notesJour = D.etat.notesJour || {}; (NJ[kk] = NJ[kk] || {})[nj] = e.target.value; sauver(); return; } if (e.target.hasAttribute('data-fil-prenom')) { var F = filEtat(); F.personnes[filSel].prenom = e.target.value.trim().slice(0, 40); sauverFil(); } });
  vue.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('[data-personne]')) { e.preventDefault(); ouvrirPersonne(e.target.closest('[data-personne]').getAttribute('data-personne')); } });

  if (EXEMPLE) {
    var cadre = document.getElementById('pass'), lien = 'login.html?inscription&retour=' + encodeURIComponent('pass.html');
    var bandeau = function (bas) { var d = document.createElement('div'); d.className = 'pa-exemple-b' + (bas ? ' bas' : ''); d.innerHTML = '<p><b>Exemple</b> · Léa est fictive : rien de ce que tu touches ici n’est enregistré. Ma spirale ouvre le 1<sup>er</sup> novembre.</p><div class="pa-aime" data-aime-zone><button type="button" class="pa-bt clair" data-aime aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18"><path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z"/></svg>J’aime</button><button type="button" class="pa-bt clair" data-partager><svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18"><circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="M8.2 10.8l7.6-4M8.2 13.2l7.6 4"/></svg>Partager</button><p class="pa-aime-msg" data-aime-msg aria-live="polite"></p></div>' +
      '<div class="pa-prevenir" data-prevenir-zone><button type="button" class="pa-bt or" data-prevenir-spirale>Être prévenue à l’ouverture</button><form hidden novalidate><input type="email" autocomplete="email" required placeholder="Ton e-mail" aria-label="Ton e-mail, pour être prévenue de l’ouverture"><button type="submit" class="pa-bt or">Me prévenir</button></form><p class="pa-prev-msg" aria-live="polite"></p></div>'; return d; };
    cadre.insertBefore(bandeau(false), vue); cadre.appendChild(bandeau(true));
  }
  (function () { var dl = document.getElementById('pa-persos'); if (dl) dl.innerHTML = ((PF.SCHEMA || {}).personnages || []).map(function (x) { return '<option value="' + esc(x) + '">'; }).join(''); })();
  /* ?exemple&schema=s1 : l'exemple s'ouvre directement sur la fiche d'un schéma */
  function ouvrirDemande() { var m = location.search.match(/[?&]schema=(\w+)/); if (m && D.acces && trouverSchema(m[1])) ouvrirSchema(m[1], 'ou'); }
  charger().then(function () { if (!D.etat) D.etat = completer(lireL(CLE)); router(); ouvrirDemande(); }, function () { D.etat = completer(null); router(); });
})();
