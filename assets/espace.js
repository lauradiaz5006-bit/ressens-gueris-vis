/* Genesolia : tableau de bord de l'espace client (page Mon espace). */
(function () {
  'use strict';
  var BUCKET = 'photos-profil';
  var sb = null, user = null, ligne = null;
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function info(t, erreur) { var m = $('tb-message'); m.textContent = t || ''; m.className = 'tb-message' + (erreur ? ' erreur' : ''); }
  function telecharger(blob, nom) {
    var url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = nom; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }
  function aujourdhui() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function dateFr(d) { d = new Date(d); return isNaN(d) ? '' : d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) + ' à ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }); }

  /* ── En-tête et photo ── */
  function nomAffiche() { return (user.user_metadata && user.user_metadata.full_name) || ''; }
  function majEntete() {
    var nom = nomAffiche();
    $('bonjour').textContent = nom ? 'Bonjour ' + nom : 'Bonjour';
    $('email-connecte').textContent = user.email || '';
    $('p-email').textContent = user.email || '';
    $('p-prenom').value = nom;
    var initiale = (nom || user.email || '?').charAt(0).toUpperCase();
    ['avatar', 'avatar-grand'].forEach(function (id) { var a = $(id); a.textContent = initiale; a.style.backgroundImage = ''; a.classList.remove('photo'); });
    $('photo-retirer').hidden = true;
    var chemin = user.user_metadata && user.user_metadata.photo;
    if (!chemin) return;
    sb.storage.from(BUCKET).createSignedUrl(chemin, 3600).then(function (r) {
      if (r.error || !r.data) return;
      var url = r.data.signedUrl;
      ['avatar', 'avatar-grand'].forEach(function (id) { var a = $(id); a.style.backgroundImage = 'url("' + url + '")'; a.classList.add('photo'); });
      $('photo-retirer').hidden = false;
    });
  }
  function redimensionner(fichier) {
    return new Promise(function (ok, ko) {
      var img = new Image(), url = URL.createObjectURL(fichier);
      img.onload = function () {
        var t = 400, c = document.createElement('canvas'); c.width = t; c.height = t;
        var cote = Math.min(img.width, img.height), sx = (img.width - cote) / 2, sy = (img.height - cote) / 2;
        c.getContext('2d').drawImage(img, sx, sy, cote, cote, 0, 0, t, t);
        URL.revokeObjectURL(url);
        c.toBlob(function (b) { b ? ok(b) : ko(new Error('image')); }, 'image/jpeg', 0.86);
      };
      img.onerror = function () { URL.revokeObjectURL(url); ko(new Error('image')); };
      img.src = url;
    });
  }
  function brancherPhoto() {
    $('photo-fichier').addEventListener('change', function (e) {
      var f = e.target.files[0]; e.target.value = '';
      if (!f) return;
      if (!/^image\/(jpeg|png|webp)$/.test(f.type)) { info('Choisis une photo en JPG, PNG ou WEBP.', true); return; }
      if (f.size > 15 * 1024 * 1024) { info('Cette photo est trop lourde (15 Mo maximum).', true); return; }
      info('Envoi de ta photo…');
      var chemin = user.id + '/photo.jpg';
      redimensionner(f).then(function (blob) {
        return sb.storage.from(BUCKET).upload(chemin, blob, { upsert: true, contentType: 'image/jpeg', cacheControl: '60' });
      }).then(function (r) {
        if (r.error) throw r.error;
        return sb.auth.updateUser({ data: { photo: chemin, photo_maj: Date.now() } });
      }).then(function (r) {
        if (r.error) throw r.error;
        user = r.data.user; majEntete(); info('Ta photo est enregistrée.');
      }).catch(function () { info('La photo n’a pas pu être enregistrée. Réessaie dans un instant.', true); });
    });
    $('photo-retirer').addEventListener('click', function () {
      var chemin = user.user_metadata && user.user_metadata.photo; if (!chemin) return;
      sb.storage.from(BUCKET).remove([chemin]).then(function () { return sb.auth.updateUser({ data: { photo: null } }); })
        .then(function (r) { if (r.error) throw r.error; user = r.data.user; majEntete(); info('Ta photo est retirée.'); })
        .catch(function () { info('La photo n’a pas pu être retirée. Réessaie.', true); });
    });
  }

  /* ── Arbre et parcours ── */
  function generations(people, rels) {
    var par = {}; Object.keys(people).forEach(function (id) { par[id] = []; });
    (rels || []).forEach(function (r) { if (r.type === 'parent' && par[r.to] && people[r.from]) par[r.to].push(r.from); });
    var memo = {};
    function prof(id, vus) { if (memo[id] != null) return memo[id]; if (vus[id]) return 1; vus[id] = 1; var m = 1; par[id].forEach(function (p) { m = Math.max(m, 1 + prof(p, vus)); }); memo[id] = m; return m; }
    var max = 0; Object.keys(people).forEach(function (id) { max = Math.max(max, prof(id, {})); });
    return max;
  }
  function chargerArbre() {
    sb.from('arbres').select('data,updated_at').eq('user_id', user.id).maybeSingle().then(function (r) {
      var z = $('arbre-chiffres');
      if (r.error) { z.innerHTML = '<p class="tb-aide">Ton arbre n’a pas pu être chargé pour l’instant. Recharge la page dans un instant.</p>'; return; }
      ligne = r.data;
      var d = (ligne && ligne.data) || {}, people = d.people || {}, n = Object.keys(people).length;
      var outils = ['lien-image', 'lien-pdf', 'bt-copie'];
      if (!n) {
        z.innerHTML = '<p class="tb-aide">Ton espace est prêt. Ouvre ton arbre familial et place-toi dedans : <b>tout ce que tu y fais s’enregistre ici automatiquement</b>.</p>';
        outils.forEach(function (id) { $(id).hidden = true; });
      } else {
        outils.forEach(function (id) { $(id).hidden = false; });
        var g = generations(people, d.rels);
        z.innerHTML = '<div class="tb-chiffre"><b>' + n + '</b><span>personne' + (n > 1 ? 's' : '') + '</span></div>' +
          '<div class="tb-chiffre"><b>' + g + '</b><span>génération' + (g > 1 ? 's' : '') + '</span></div>' +
          '<div class="tb-chiffre"><b>' + (ligne.updated_at ? new Date(ligne.updated_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : '–') + '</b><span>dernière modification</span></div>';
      }
      var p = d.parcours, zp = $('parcours-resume');
      var THEMES = { relations: 'Relations', argent: 'Argent', energie: 'Charge mentale', confiance: 'Confiance', famille: 'Famille', corps: 'Sécurité' };
      if (p && p.theme) zp.innerHTML = '<p class="tb-aide">Ta porte d’entrée : <b>' + esc(THEMES[p.theme] || p.theme) + '</b>' + (p.emotion ? ', ressenti : ' + esc(p.emotion) : '') + (p.updatedAt ? '<br>Dernière fois le ' + esc(dateFr(p.updatedAt)) : '') + '.</p>';
      else zp.innerHTML = '<p class="tb-aide">Tu n’as pas encore fait le parcours guidé. Quelques questions pour nommer ce qui se répète dans ta vie, dix minutes environ.</p>';
    });
  }

  /* ── Formulaires ── */
  function brancherFormulaires() {
    $('form-prenom').addEventListener('submit', function (e) {
      e.preventDefault();
      var v = $('p-prenom').value.trim().slice(0, 60);
      sb.auth.updateUser({ data: { full_name: v } }).then(function (r) {
        if (r.error) throw r.error; user = r.data.user; majEntete(); info('C’est enregistré.');
      }).catch(function () { info('Ça n’a pas pu être enregistré. Réessaie.', true); });
    });
    $('form-mdp').addEventListener('submit', function (e) {
      e.preventDefault();
      var v = $('p-mdp').value;
      if (v.length < 8) { info('Le mot de passe doit faire au moins 8 caractères.', true); return; }
      sb.auth.updateUser({ password: v }).then(function (r) {
        if (r.error) {
          var t = String(r.error.message || '').toLowerCase();
          if (/different/.test(t)) throw new Error('Choisis un mot de passe différent de l’actuel.');
          if (/weak|should be/.test(t)) throw new Error('Ce mot de passe est trop simple. Choisis-en un plus long.');
          if (/reauth|recent/.test(t)) throw new Error('Par sécurité, déconnecte-toi puis reconnecte-toi avant de changer ton mot de passe.');
          throw new Error('Le mot de passe n’a pas pu être changé. Réessaie.');
        }
        $('p-mdp').value = ''; info('Ton mot de passe est changé.');
      }).catch(function (err) { info(err.message, true); });
    });
    $('bt-copie').addEventListener('click', function () {
      if (!ligne || !ligne.data) return;
      var d = ligne.data;
      telecharger(new Blob([JSON.stringify({ people: d.people, rels: d.rels, nid: d.nid, v: 2 }, null, 1)], { type: 'application/json' }), 'mon-arbre-genesolia-' + aujourdhui() + '.json');
    });
    $('bt-donnees').addEventListener('click', function () {
      info('Préparation de tes données…');
      sb.from('arbres_versions').select('numero,enregistre_le,data').eq('user_id', user.id).order('numero', { ascending: false }).then(function (r) {
        var tout = {
          export_du: new Date().toISOString(),
          compte: { email: user.email, prenom: nomAffiche(), cree_le: user.created_at, photo_de_profil: !!(user.user_metadata && user.user_metadata.photo) },
          arbre: ligne && ligne.data ? ligne.data : null,
          derniere_modification: ligne ? ligne.updated_at : null,
          versions_precedentes: r.data || []
        };
        telecharger(new Blob([JSON.stringify(tout, null, 1)], { type: 'application/json' }), 'mes-donnees-genesolia-' + aujourdhui() + '.json');
        info('Tes données sont téléchargées.');
      });
    });
    $('deconnexion').addEventListener('click', function () {
      sb.auth.signOut().then(function () {
        try { if (localStorage.getItem('geno4-synchro') === 'ok') localStorage.removeItem('geno4'); } catch (e) {}
        window.GenesoliaEspaceDeconnecte('Tu es déconnecté·e. Ton arbre reste en sécurité dans ton espace.');
      });
    });
    $('bt-supprimer').addEventListener('click', function () { $('zone-suppr').hidden = false; $('suppr-confirm').value = ''; $('suppr-confirm').focus(); });
    $('bt-suppr-annuler').addEventListener('click', function () { $('zone-suppr').hidden = true; });
    $('bt-suppr-ok').addEventListener('click', function () {
      if ($('suppr-confirm').value.trim().toUpperCase() !== 'SUPPRIMER') { info('Écris SUPPRIMER dans le champ pour confirmer.', true); return; }
      var b = this; b.disabled = true; info('Suppression en cours…');
      var photo = user.user_metadata && user.user_metadata.photo;
      Promise.resolve()
        .then(function () { return photo ? sb.storage.from(BUCKET).remove([photo]) : null; })
        .then(function () { return sb.from('arbres_versions').delete().eq('user_id', user.id); })
        .then(function (r) { if (r && r.error) throw r.error; return sb.from('arbres').delete().eq('user_id', user.id); })
        .then(function (r) { if (r && r.error) throw r.error; return sb.from('demandes_suppression').upsert({ user_id: user.id, email: user.email }, { onConflict: 'user_id', ignoreDuplicates: true }); })
        .then(function () { return sb.auth.updateUser({ data: { full_name: null, photo: null } }); })
        .then(function () {
          try { ['geno4', 'geno4-synchro', 'geno4-avant-connexion', 'parcours-guide', 'genesolia-exercices', 'genesolia-anniversaire'].forEach(function (k) { localStorage.removeItem(k); }); } catch (e) {}
          return sb.auth.signOut();
        })
        .then(function () { window.GenesoliaEspaceDeconnecte('Ton arbre, son historique et ta photo sont effacés. Ton compte sera définitivement fermé sous 30 jours au plus tard. Merci d’être passé·e par Genesolia.'); })
        .catch(function () { b.disabled = false; info('La suppression n’a pas pu aboutir. Réessaie, ou écris-nous à contact@genesolia.fr.', true); });
    });
  }

  window.GenesoliaEspaceInfo = function (t) { info(t); };
  var branche = false;
  window.GenesoliaEspace = {
    ouvrir: function (client, u) {
      sb = client; user = u;
      if (!branche) { brancherPhoto(); brancherFormulaires(); branche = true; }
      info('');
      $('zone-suppr').hidden = true;
      majEntete();
      chargerArbre();
    }
  };
})();
