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
      chargerArbresSupp();
    });
  }

  /* ── Plusieurs arbres (table arbres_supp) ── */
  var arbresSupp = [];
  function nbPers(d) { return d && d.people ? Object.keys(d.people).length : 0; }
  function ligneArbre(url, nom, n, quand) {
    return '<a class="tb-arbre" href="' + url + '"><b>' + esc(nom) + '</b><span>' + n + ' personne' + (n > 1 ? 's' : '') + '</span>' + (quand ? '<span>modifié le ' + esc(new Date(quand).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })) + '</span>' : '') + '</a>';
  }
  function texteLimite(lim) {
    var debut = lim >= 100000 ? 'Tu as atteint le nombre d’arbres de ta formule.'
      : lim > 0 ? 'Tu as déjà tes 3 arbres : c’est le maximum de ta formule. L’Espace praticien permet des arbres illimités.'
      : 'Avec la formule gratuite, tu as un arbre. Le Cercle te permet d’avoir 3 arbres, et l’Espace praticien des arbres illimités.';
    return debut + '<br><a href="abonnement.html">Découvrir Le Cercle</a> · <a href="espace-praticien.html">Découvrir l’Espace praticien</a>';
  }
  function limite(t) { var z = $('arbres-limite'); z.innerHTML = t || ''; z.hidden = !t; }
  function chargerArbresSupp() {
    sb.from('arbres_supp').select('id,nom,data,maj').eq('user_id', user.id).order('cree_le', { ascending: true }).then(function (r) {
      arbresSupp = r.error ? [] : (r.data || []);
      var d = (ligne && ligne.data) || {};
      $('liste-arbres').innerHTML = ligneArbre('genosociogramme.html', 'Mon arbre (principal)', nbPers(d), ligne && ligne.updated_at) +
        arbresSupp.map(function (a) { return ligneArbre('genosociogramme.html?arbre=' + encodeURIComponent(a.id), a.nom || 'Autre arbre', nbPers(a.data), a.maj); }).join('') +
        (r.error ? '<p class="tb-aide">Tes autres arbres n’ont pas pu être chargés pour l’instant.</p>' : '');
      $('mes-arbres').hidden = false;
    });
  }
  function creerArbre() {
    var b = $('bt-creer-arbre'); b.disabled = true; limite('');
    sb.rpc('limite_arbres_supp', { uid: user.id }).then(function (r) {
      var lim = r && !r.error && r.data != null ? Number(r.data) : null;
      if (lim !== null && arbresSupp.length >= lim) { limite(texteLimite(lim)); return; }
      var nom = prompt('Nom du nouvel arbre (par exemple « Famille de Paul » ou « Dossier Mme D. ») :', '');
      nom = nom == null ? '' : nom.trim().slice(0, 80);
      if (!nom) return;
      return sb.from('arbres_supp').insert({ user_id: user.id, nom: nom, data: { people: {}, rels: [], nid: 1, v: 2 } }).select('id').single().then(function (ins) {
        if (ins.error || !ins.data) {
          var refus = ins.error && (ins.error.code === '42501' || /row-level|policy|limite/i.test(ins.error.message || ''));
          if (refus) limite(texteLimite(lim || 0)); else info('Le nouvel arbre n’a pas pu être créé. Réessaie dans un instant.', true);
          return;
        }
        location.href = 'genosociogramme.html?arbre=' + encodeURIComponent(ins.data.id);
      });
    }).then(function () { b.disabled = false; }, function () { b.disabled = false; info('Le nouvel arbre n’a pas pu être créé. Réessaie dans un instant.', true); });
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
    $('bt-creer-arbre').addEventListener('click', creerArbre);
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
          versions_precedentes: r.data || [],
          autres_arbres: arbresSupp.map(function (a) { return { nom: a.nom, derniere_modification: a.maj, arbre: a.data }; })
        };
        telecharger(new Blob([JSON.stringify(tout, null, 1)], { type: 'application/json' }), 'mes-donnees-genesolia-' + aujourdhui() + '.json');
        info('Tes données sont téléchargées.');
      });
    });
    $('deconnexion').addEventListener('click', function () {
      sb.auth.signOut().then(function () {
        try { if (localStorage.getItem('geno4-synchro') === 'ok') localStorage.removeItem('geno4'); } catch (e) {}
        try { Object.keys(localStorage).forEach(function (k) { if (/^geno4-[0-9a-f-]{32,36}$/.test(k)) localStorage.removeItem(k); }); } catch (e) {}   // copies locales des autres arbres
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
        .then(function (r) { if (r && r.error) throw r.error; return sb.from('arbres_supp').delete().eq('user_id', user.id); })   // leurs versions partent avec
        .then(function (r) { if (r && r.error) throw r.error; return sb.from('arbres').delete().eq('user_id', user.id); })
        .then(function (r) { if (r && r.error) throw r.error; return sb.from('demandes_suppression').upsert({ user_id: user.id, email: user.email }, { onConflict: 'user_id', ignoreDuplicates: true }); })
        .then(function () { return sb.auth.updateUser({ data: { full_name: null, photo: null } }); })
        .then(function () {
          try {
            ['geno4', 'geno4-synchro', 'geno4-avant-connexion', 'parcours-guide', 'genesolia-exercices', 'genesolia-anniversaire'].forEach(function (k) { localStorage.removeItem(k); });
            arbresSupp.forEach(function (a) { localStorage.removeItem('geno4-' + a.id); });
          } catch (e) {}
          return sb.auth.signOut();
        })
        .then(function () { window.GenesoliaEspaceDeconnecte('Tes arbres, leur historique et ta photo sont effacés. Ton compte sera définitivement fermé sous 30 jours au plus tard. Merci d’être passé·e par Genesolia.'); })
        .catch(function () { b.disabled = false; info('La suppression n’a pas pu aboutir. Réessaie, ou écris-nous à contact@genesolia.fr.', true); });
    });
  }


  /* ===== Mon chemin : tous les tests, avec leur date ===== */
  var PAGES_OUTILS = { 'arbre-de-vie': ['arbre-de-vie.html', 'Refaire le test'], blessures: ['blessures-de-l-ame.html', 'Refaire'], numerologie: ['theme-numerologique.html', 'Ouvrir'], astral: ['theme-astral.html', 'Ouvrir'], maya: ['ton-signe-maya.html', 'Ouvrir'], prenom: ['ton-prenom.html', 'Lire un autre prénom'], 'prenoms-famille': ['ton-prenom.html#famille', 'Comparer d\u2019autres prénoms'], 'maya-duo': ['ton-signe-maya.html#duo', 'Comparer avec un autre proche'] };
  var NOMS_OUTILS = { 'arbre-de-vie': 'Test de l’arbre de vie', blessures: 'Les blessures de l’âme', numerologie: 'Thème numérologique', astral: 'Thème astral', maya: 'Signe maya', prenom: 'Prénoms', synthese: 'Ma synthèse', 'prenoms-famille': 'Prénoms de ma famille', 'maya-duo': 'Signes maya à deux' };
  function dateCourte(d) { return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }); }
  function evolution(outil, l) {
    if (l.length < 2) return '';
    var a = l[0].donnees || {}, b = l[1].donnees || {};
    if (outil === 'arbre-de-vie' && a.cycles && b.cycles) {
      var noms = { racine: 'Racine', coeur: 'Cœur', elan: 'Élan' };
      return 'Depuis le ' + dateCourte(l[1].cree_le) + ' : ' + Object.keys(noms).map(function (k) { var d = (a.cycles[k] || 0) - (b.cycles[k] || 0); return noms[k] + ' ' + (d > 0 ? '+' : d < 0 ? '−' : '±') + Math.abs(d); }).join(' · ');
    }
    if (outil === 'blessures' && a.scores && b.scores) {
      var ch = Object.keys(a.scores).filter(function (k) { return (a.scores[k] || 0) !== (b.scores[k] || 0); });
      return ch.length ? 'Depuis le ' + dateCourte(l[1].cree_le) + ' : ' + ch.map(function (k) { var d = (a.scores[k] || 0) - (b.scores[k] || 0); return k + ' ' + (d > 0 ? '+' : '−') + Math.abs(d); }).join(' · ') : 'Même résultat que le ' + dateCourte(l[1].cree_le) + '.';
    }
    return l.length + ' fois depuis le ' + dateCourte(l[l.length - 1].cree_le);
  }
  function chargerChemin() {
    var z = $('chemin-liste'); if (!z) return;
    var vider = window.GenesoliaChemin && window.GenesoliaChemin.viderAttente ? window.GenesoliaChemin.viderAttente(sb) : Promise.resolve(0);
    vider.catch(function () { return 0; }).then(function (n) {
      if (n) info(n > 1 ? n + ' résultats faits avant ta connexion ont été ajoutés à ton chemin.' : 'Le résultat fait avant ta connexion a été ajouté à ton chemin.');
      return sb.from('resultats').select('id,outil,titre,resume,donnees,cree_le').order('cree_le', { ascending: false }).limit(300);
    }).then(function (r) {
      if (r.error) { z.innerHTML = '<p class="tb-aide">Ton chemin n’a pas pu être chargé pour l’instant.</p>'; return; }
      var l = r.data || [];
      $('chemin-pied').hidden = !l.length;
      if (!l.length) {
        z.innerHTML = '<p class="tb-aide">Ton chemin est encore vide. Fais un premier test : il s’enregistre ici automatiquement, avec sa date.</p><div class="ch-vide">' +
          ['arbre-de-vie', 'blessures', 'numerologie', 'astral', 'maya', 'prenom'].map(function (k) { return '<a href="' + PAGES_OUTILS[k][0] + '">' + esc(NOMS_OUTILS[k]) + '</a>'; }).join('') + '</div>';
        return;
      }
      var par = {}; l.forEach(function (x) { (par[x.outil] = par[x.outil] || []).push(x); });
      var nbOutils = Object.keys(par).filter(function (k) { return k !== 'synthese'; }).length;
      var zs = $('chemin-synthese');
      if (zs) {
        zs.innerHTML = nbOutils >= 2 ? '<div class="sy-appel"><div><b>Ma synthèse</b><span>Tes ' + nbOutils + ' outils croisés en une lecture d’ensemble : ce qui revient, tes ressources, ce qui demande de l’attention.</span></div><button type="button" class="btn btn-plein" id="bt-synthese">Voir ma synthèse</button></div>'
          : '<p class="tb-aide">Fais au moins deux tests différents pour débloquer <b>ta synthèse</b> : une lecture d’ensemble de tous tes résultats.</p>';
        var bs = $('bt-synthese');
        if (bs) bs.onclick = function () {
          bs.disabled = true; bs.textContent = 'Préparation…';
          var charge = window.GenesoliaSynthese ? Promise.resolve() : new Promise(function (ok) { var sc = document.createElement('script'); sc.src = 'assets/synthese.js?v=1'; sc.onload = ok; sc.onerror = ok; document.head.appendChild(sc); });
          charge.then(function () { return window.GenesoliaSynthese ? window.GenesoliaSynthese.construire(l) : null; }).then(function (res) {
            bs.disabled = false; bs.textContent = 'Voir ma synthèse';
            if (!res) return;
            zs.innerHTML = res.html + '<div class="tb-actions"><button type="button" class="btn btn-trait" id="sy-imprimer">Télécharger ma synthèse</button><button type="button" class="btn btn-trait" id="sy-garder">Garder cette synthèse datée</button></div>';
            $('sy-imprimer').onclick = function () {
              var w = window.open('', '_blank'); if (!w) return;
              w.document.write('<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Ma synthèse · Genesolia</title><style>body{font:15px/1.7 Georgia,serif;color:#4a2342;max-width:44rem;margin:0 auto;padding:1.2rem}h1,h3{font-weight:400;color:#6B2F5B}h1{font-size:30px}.sy-sur{color:#B98A55;font:700 11px sans-serif;letter-spacing:1.5px;text-transform:uppercase}.sy-bloc{border:1px solid #EBCFD5;border-radius:12px;padding:.8rem 1.1rem;margin:.8rem 0;break-inside:avoid}.sy-cycle{background:#FBF0E4}.btn{display:none}.sy-note{font-size:12px;color:#8E6383}.b{position:sticky;top:0;background:#6B2F5B;color:#fff;padding:.6rem 1rem;display:flex;justify-content:space-between;align-items:center;font:600 14px sans-serif}.b button{border:0;border-radius:99px;padding:.5rem 1rem;background:#F3DCC0;color:#6B2F5B;font:700 14px sans-serif}@media print{.b{display:none}}</style></head><body><div class="b"><span>Ta synthèse Genesolia</span><button onclick="window.print()">Enregistrer en PDF</button></div><h1>Ma synthèse</h1><p>Le ' + new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) + ' · genesolia.fr</p>' + res.html + '</body></html>');
              w.document.close();
            };
            $('sy-garder').onclick = function () { var bt = this; sb.from('resultats').insert({ outil: 'synthese', titre: 'Ma synthèse', resume: res.resume, donnees: res.donnees }).then(function (x) { bt.textContent = x.error ? 'Réessaie' : 'Synthèse gardée'; }); };
          });
        };
      }
      z.innerHTML = '<div class="ch-outils">' + Object.keys(par).map(function (k) {
        var g = par[k], d = g[0], ev = evolution(k, g), p = PAGES_OUTILS[k];
        return '<article class="ch-outil"><span class="ch-nb">' + g.length + ' résultat' + (g.length > 1 ? 's' : '') + '</span><h3>' + esc(NOMS_OUTILS[k] || k) + '</h3>' +
          '<p class="ch-dernier"><b>' + esc(dateCourte(d.cree_le)) + '</b> · ' + esc(d.titre) + (d.resume ? '<br>' + esc(d.resume) : '') + '</p>' +
          (ev ? '<p class="ch-evol">' + esc(ev) + '</p>' : '') +
          '<details><summary>Voir tout l’historique</summary><ul class="ch-hist">' + g.map(function (x) {
            return '<li><time datetime="' + esc(x.cree_le) + '">' + esc(dateCourte(x.cree_le)) + '</time><span>' + esc(x.titre) + (x.resume ? ' · ' + esc(x.resume) : '') + '</span><button type="button" class="ch-suppr" data-suppr="' + esc(x.id) + '" aria-label="Effacer ce résultat">×</button></li>';
          }).join('') + '</ul></details>' +
          (p ? '<div class="ch-liens"><a href="' + p[0] + '">' + esc(p[1]) + '</a></div>' : '') + '</article>';
      }).join('') + '</div>';
    });
    sb.from('mes_jaimes').select('page,titre,cree_le').order('cree_le', { ascending: false }).limit(60).then(function (r) {
      var zj = $('chemin-jaimes'); if (!zj || r.error) return;
      var l = r.data || [];
      zj.innerHTML = l.length ? '<div class="ch-jaimes"><h3>Mes coups de cœur</h3><ul>' + l.map(function (x) { return '<li><a href="' + esc(x.page) + '.html">' + esc(x.titre || x.page) + '</a></li>'; }).join('') + '</ul></div>' : '';
    });
  }
  function brancherChemin() {
    var z = $('mon-chemin'); if (!z) return;
    z.addEventListener('click', function (e) {
      var b = e.target.closest('[data-suppr]'); if (!b) return;
      if (!confirm('Effacer ce résultat de ton chemin ?')) return;
      sb.from('resultats').delete().eq('id', b.getAttribute('data-suppr')).then(function (r) { if (r.error) info('Le résultat n’a pas pu être effacé. Réessaie.', true); else { info('Résultat effacé.'); chargerChemin(); } });
    });
    $('chemin-tout-effacer').addEventListener('click', function () {
      if (!confirm('Effacer tout ton chemin ? Tous tes résultats seront supprimés, ton arbre ne change pas.')) return;
      sb.from('resultats').delete().eq('user_id', user.id).then(function (r) { if (r.error) info('Ton chemin n’a pas pu être effacé. Réessaie.', true); else { info('Ton chemin est effacé.'); chargerChemin(); } });
    });
  }
  window.GenesoliaEspaceInfo = function (t) { info(t); };
  var branche = false;
  window.GenesoliaEspace = {
    ouvrir: function (client, u) {
      sb = client; user = u;
      if (!branche) { brancherPhoto(); brancherFormulaires(); brancherChemin(); branche = true; }
      info('');
      $('zone-suppr').hidden = true;
      majEntete();
      chargerArbre();
      chargerChemin();
    }
  };
})();
