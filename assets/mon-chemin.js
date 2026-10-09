/* Genesolia — « Mon chemin » : chaque test fait sur le site est gardé dans l'espace de la personne, avec sa date.
   GenesoliaChemin.enregistrer({ outil, titre, resume, donnees })
   - connectée : enregistré dans Supabase (table resultats) ;
   - pas de compte : proposé de créer son espace, le résultat attend et s'enregistre après la connexion. */
(function () {
  'use strict';
  var SB_URL = 'https://qsvzzkjtjsznfntahvvh.supabase.co', SB_KEY = 'sb_publishable_6iEVxXmtB_u1hJ6mPS9fNg_CJhLjYkg';
  var CLE_SESSION = 'sb-qsvzzkjtjsznfntahvvh-auth-token', CLE_ATTENTE = 'genesolia-chemin-attente';
  var NOMS = { 'arbre-de-vie': 'Test de l’arbre de vie', blessures: 'Les blessures de l’âme', numerologie: 'Thème numérologique', astral: 'Thème astral', maya: 'Signe maya', prenom: 'Ton prénom', synthese: 'Ma synthèse', 'prenoms-famille': 'Les prénoms de ma famille', 'maya-duo': 'Signes maya à deux', meteo: 'Ma météo intérieure' };
  var client = null, chargement = null;

  function aUneSession() { try { var s = JSON.parse(localStorage.getItem(CLE_SESSION) || 'null'); return !!(s && (s.access_token || (s.currentSession && s.currentSession.access_token))); } catch (e) { return false; } }
  function obtenirClient() {
    if (client) return Promise.resolve(client);
    if (!chargement) chargement = new Promise(function (ok, ko) {
      function creer() { try { client = window.supabase.createClient(SB_URL, SB_KEY); ok(client); } catch (e) { ko(e); } }
      if (window.supabase && window.supabase.createClient) return creer();
      var sc = document.createElement('script'); sc.src = 'assets/supabase.js'; sc.onload = creer; sc.onerror = ko; document.head.appendChild(sc);
    });
    return chargement;
  }
  function lireAttente() { try { return JSON.parse(localStorage.getItem(CLE_ATTENTE) || '[]'); } catch (e) { return []; } }
  function ecrireAttente(l) { try { localStorage.setItem(CLE_ATTENTE, JSON.stringify(l.slice(-8))); } catch (e) {} }
  function propre(r) {
    return { outil: r.outil, titre: String(r.titre || NOMS[r.outil] || 'Test').slice(0, 200), resume: r.resume ? String(r.resume).slice(0, 2000) : null, donnees: r.donnees || {} };
  }
  function inserer(lignes) {
    return obtenirClient().then(function (sb) {
      return sb.auth.getSession().then(function (r) {
        if (!r.data || !r.data.session) return { connecte: false };
        return sb.from('resultats').insert(lignes).then(function (x) { return { connecte: true, erreur: x.error }; });
      });
    });
  }

  function toast(html, duree) {
    var t = document.querySelector('.chemin-toast');
    if (!t) { t = document.createElement('div'); t.className = 'chemin-toast'; t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite'); document.body.appendChild(t); }
    t.innerHTML = '<button type="button" class="ct-fermer" aria-label="Fermer">×</button>' + html;
    t.classList.add('visible');
    t.querySelector('.ct-fermer').onclick = function () { t.classList.remove('visible'); };
    clearTimeout(t._m); if (duree) t._m = setTimeout(function () { t.classList.remove('visible'); }, duree);
  }
  function inviter(r) {
    var page = (location.pathname.split('/').pop() || 'index.html');
    toast('<p class="ct-titre">Garde ce résultat dans ton espace</p><p>Crée ton espace gratuit : tous tes tests y sont gardés avec leur date, pour voir ton évolution. Tu peux tout effacer quand tu veux.</p>' +
      '<div class="ct-actions"><a class="btn btn-plein" href="login.html?inscription&retour=' + encodeURIComponent(page) + '">Créer mon espace</a><a class="ct-lien" href="login.html?retour=' + encodeURIComponent(page) + '">J’ai déjà un compte</a></div>');
  }

  function enregistrer(r) {
    if (!r || !NOMS[r.outil]) return Promise.resolve(false);
    var l = propre(r), cle = l.outil + '|' + l.titre + '|' + JSON.stringify(l.donnees).length;
    try { var d = JSON.parse(sessionStorage.getItem('chemin-dernier') || '{}'); if (d.cle === cle && Date.now() - d.t < 10 * 60e3) return Promise.resolve(true); sessionStorage.setItem('chemin-dernier', JSON.stringify({ cle: cle, t: Date.now() })); } catch (e) {}
    if (!aUneSession()) { var a = lireAttente(); a.push(Object.assign({ quand: new Date().toISOString() }, l)); ecrireAttente(a); inviter(l); return Promise.resolve(false); }
    return inserer([l]).then(function (x) {
      if (!x.connecte) { var a = lireAttente(); a.push(l); ecrireAttente(a); inviter(l); return false; }
      if (x.erreur) return false;
      toast('<p class="ct-titre">Enregistré dans ton espace</p><p>Retrouve ce résultat et ton évolution dans <a href="login.html#mon-chemin">Mon chemin</a>.</p>', 6000);
      return true;
    }).catch(function () { return false; });
  }
  /* Après la connexion : on enregistre ce qui attendait */
  function viderAttente(sb) {
    var a = lireAttente(); if (!a.length) return Promise.resolve(0);
    var lignes = a.map(function (x) { var l = propre(x); if (x.quand) l.cree_le = x.quand; return l; });
    return sb.from('resultats').insert(lignes).then(function (r) { if (!r.error) { ecrireAttente([]); return lignes.length; } return 0; });
  }

  window.GenesoliaChemin = { enregistrer: enregistrer, viderAttente: viderAttente, noms: NOMS, aUneSession: aUneSession };
})();
