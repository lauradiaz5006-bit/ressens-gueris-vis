/* Genesolia · page génosociogramme : bouton « Mon arbre à encadrer ».
   Aperçu à l'écran (filigrane « Aperçu » tant que le produit est payant et non acheté),
   téléchargement en image haute définition ou en PDF à imprimer. Réglage du prix : assets/site.js (arbreEncadrer). */
(function () {
  'use strict';
  var bt = document.getElementById('bt-encadrer'), fen = document.getElementById('fen-encadrer');
  if (!bt || !fen || !window.ArbreEncadrer || !window.GenoArbre) return;
  var corps = document.getElementById('fe-corps'), cache = {};
  var GEN = ['Une génération', 'Deux générations', 'Trois générations', 'Quatre générations'];

  function annee(d) { var m = String(d || '').match(/(\d{4})/); return m ? +m[1] : null; }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* L'arbre de la page devient une lignée : moi, mes parents, leurs parents, leurs parents */
  function lignee() {
    var S = window.GenoArbre.etat(), P = S.people || {}, rels = S.rels || [];
    var ids = Object.keys(P); if (!ids.length) return null;
    function parentsDe(id) { return rels.filter(function (r) { return r.type === 'parent' && r.to === id && P[r.from]; }).map(function (r) { return r.from; }); }
    function enfantsDe(id) { return rels.filter(function (r) { return r.type === 'parent' && r.from === id && P[r.to]; }).map(function (r) { return r.to; }); }
    var moi = ids.filter(function (id) { return P[id].role === 'moi'; })[0];
    if (!moi) { /* sans « c'est moi » : la personne la plus jeune qui a des parents */
      var avec = ids.filter(function (id) { return parentsDe(id).length; }).sort(function (a, b) { return (annee(P[b].naiss) || 0) - (annee(P[a].naiss) || 0); });
      moi = avec[0] || ids[0];
    }
    var plusVieux = null, gens = 0;
    function construire(id, g) {
      var p = P[id]; if (!p) return null;
      gens = Math.max(gens, g + 1);
      var n = annee(p.naiss); if (n && (!plusVieux || n < plusVieux)) plusVieux = n;
      var o = { prenom: p.prenom || '', nom: p.nom || '', sexe: p.sex === 'f' ? 'f' : 'm', naissance: n, deces: annee(p.deces) || (p.decede ? '?' : null) };
      if (g < 3) {
        var ps = parentsDe(id), pere = null, mere = null;
        ps.forEach(function (x) { if (P[x].sex === 'f' && !mere) mere = x; else if (P[x].sex === 'm' && !pere) pere = x; });
        ps.forEach(function (x) { if (x !== pere && x !== mere) { if (!pere) pere = x; else if (!mere) mere = x; } });
        o.pere = pere ? construire(pere, g + 1) : null; o.mere = mere ? construire(mere, g + 1) : null;
      }
      return o;
    }
    var racine = construire(moi, 0), fs = {};
    parentsDe(moi).forEach(function (par) { enfantsDe(par).forEach(function (e) { if (e !== moi) fs[e] = 1; }); });
    rels.forEach(function (r) { if (r.type === 'fratrie') { if (r.from === moi && P[r.to]) fs[r.to] = 1; if (r.to === moi && P[r.from]) fs[r.from] = 1; } });
    var freres = Object.keys(fs).slice(0, 4).map(function (id) { var p = P[id]; return { prenom: p.prenom || '', nom: '', sexe: p.sex === 'f' ? 'f' : 'm', naissance: annee(p.naiss), deces: annee(p.deces) || (p.decede ? '?' : null) }; });
    var nomFamille = racine.nom || (racine.pere && racine.pere.nom) || '';
    return {
      titre: nomFamille ? 'La famille ' + nomFamille : 'Notre famille',
      sousTitre: GEN[Math.min(gens, 4) - 1] + (plusVieux ? ' · de ' + plusVieux + ' à aujourd’hui' : ''),
      moi: racine, freresSoeurs: freres, nb: gens
    };
  }

  /* Pour l'image, le décor et les polices doivent être inclus dans le SVG */
  function enDataUrl(url) {
    if (cache[url]) return cache[url];
    cache[url] = fetch(url).then(function (r) { return r.blob(); }).then(function (b) { return new Promise(function (ok) { var f = new FileReader(); f.onload = function () { ok(f.result); }; f.readAsDataURL(b); }); });
    return cache[url];
  }
  function svgAutonome(donnees, apercu) {
    return Promise.all([enDataUrl('assets/arbre/decor-a4.jpg'), enDataUrl('assets/polices/gilda-display-latin-400-normal.woff2'), enDataUrl('assets/polices/nunito-sans-latin-400-normal.woff2'), enDataUrl('assets/polices/nunito-sans-latin-600-normal.woff2')])
      .then(function (d) {
        var polices = '@font-face{font-family:"Gilda Display";src:url(' + d[1] + ') format("woff2")}@font-face{font-family:"Nunito Sans";font-weight:400;src:url(' + d[2] + ') format("woff2")}@font-face{font-family:"Nunito Sans";font-weight:600 800;src:url(' + d[3] + ') format("woff2")}';
        return window.ArbreEncadrer.svg(donnees, { decor: d[0], apercu: apercu }).replace('<style>', '<style>' + polices);
      });
  }
  function versPng(svg, largeur, jpeg) {
    var lw = largeur || 2480, lh = Math.round(lw * 3508 / 2480);
    return new Promise(function (ok, ko) {
      var img = new Image(), url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
      img.onload = function () {
        var c = document.createElement('canvas'); c.width = lw; c.height = lh;
        c.getContext('2d').drawImage(img, 0, 0, lw, lh); URL.revokeObjectURL(url);
        var ctx = c.getContext('2d'); c.toBlob(function (b) { b ? ok(b) : ko(new Error('image')); }, jpeg ? 'image/jpeg' : 'image/png', jpeg ? .93 : undefined);
      };
      img.onerror = function () { URL.revokeObjectURL(url); ko(new Error('image')); };
      img.src = url;
    });
  }
  function nomFichier(d) { return 'arbre-' + (d.titre || 'famille').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-genesolia'; }

  var donnees = null;
  function afficher() {
    donnees = lignee();
    if (!donnees || !donnees.moi || donnees.nb < 2) {
      corps.innerHTML = '<p class="rap-texte">Ajoute au moins tes parents à ton arbre pour obtenir ton arbre à encadrer. Plus il remonte loin, plus il est beau : jusqu’à tes arrière-grands-parents.</p>';
      return;
    }
    var payant = window.GenesoliaAcces && window.GenesoliaAcces.payant('arbreEncadrer'), P = window.GenesoliaAcces ? window.GenesoliaAcces.produit('arbreEncadrer') : null;
    corps.innerHTML = '<div class="fe-grille"><div class="fe-apercu" id="fe-apercu"><p class="rap-texte">Un instant…</p></div><div class="fe-reglages">' +
      '<label class="fe-champ">Titre<input type="text" id="fe-titre" maxlength="40" value="' + esc(donnees.titre) + '"></label>' +
      '<label class="fe-champ">Sous-titre<input type="text" id="fe-sous" maxlength="60" value="' + esc(donnees.sousTitre) + '"></label>' +
      '<p class="fe-aide">Format A4 en haute définition, prêt à imprimer ou à faire encadrer. Les branches suivent ta lignée jusqu’à tes arrière-grands-parents.</p>' +
      '<button class="bt plein rap-gros" type="button" id="fe-png" data-compte="ton arbre à encadrer" data-produit="arbreEncadrer">Télécharger l’image HD</button>' +
      '<button class="bt rap-gros" type="button" id="fe-pdf" data-compte="ton arbre à encadrer" data-produit="arbreEncadrer">Imprimer ou enregistrer en PDF</button>' +
      (payant && P ? '<p class="fe-aide">' + esc(P.prix) + ', ou compris dans Le Cercle.</p>' : '') +
      '<p class="fe-aide" id="fe-statut" aria-live="polite"></p>' + blocImpression() + '</div></div>';
    dessiner();
    var t; ['fe-titre', 'fe-sous'].forEach(function (id) { document.getElementById(id).addEventListener('input', function () { clearTimeout(t); t = setTimeout(dessiner, 250); }); });
    document.getElementById('fe-png').addEventListener('click', telechargerPng);
    document.getElementById('fe-pdf').addEventListener('click', imprimer);
    brancherImpression();
  }

  /* ===== Le recevoir imprimé : la commande part dans la table demandes, le fichier HD dans Storage (impressions), puis Stripe ===== */
  var IMP = window.GENESOLIA_IMPRESSION || {};
  function ouvert() { return !IMP.ouverture || new Date() >= new Date(IMP.ouverture + 'T00:00:00') || /test-impression/.test(location.search + location.hash); }
  function blocImpression() {
    if (!IMP.actif || !IMP.formats || !IMP.formats.length) return '';
    if (!ouvert()) {
      var j = new Date(IMP.ouverture + 'T00:00:00'), quand = (j.getDate() === 1 ? '1er' : j.getDate()) + ' ' + ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'][j.getMonth()];
      return '<div class="fe-imp"><p class="fe-imp-titre">Bientôt : le recevoir imprimé, prêt à encadrer</p><p class="fe-aide">À partir du ' + quand + ', tu pourras recevoir ton arbre imprimé sur un beau papier épais, en A4 ou en A3, avec ou sans cadre, livré chez toi ou chez la personne à qui tu l’offres.</p>' +
        '<form class="fe-imp-prevenir" id="fe-imp-prevenir" novalidate><div class="fe-deux"><input name="email" type="email" autocomplete="email" placeholder="Ton e-mail" aria-label="Ton e-mail" required><button class="bt rap-gros" type="submit">Me prévenir</button></div><p class="fe-aide" id="fe-prev-statut" aria-live="polite"></p></form></div>';
    }
    return '<div class="fe-imp"><p class="fe-imp-titre">Le recevoir imprimé, prêt à encadrer</p><p class="fe-aide">Imprimé sur un beau papier mat épais et envoyé chez toi (ou chez la personne à qui tu l’offres). ' + esc(IMP.livraison || '') + '.</p>' +
      '<button class="bt rap-gros" type="button" id="fe-imp-ouvrir">Je le reçois imprimé</button>' +
      '<form class="fe-imp-form" id="fe-imp-form" hidden novalidate>' +
        '<fieldset class="fe-formats"><legend>Format</legend>' + IMP.formats.map(function (f, i) { return '<label class="fe-format"><input type="radio" name="format" value="' + esc(f.id) + '"' + (i === 1 ? ' checked' : '') + '><span>' + esc(f.nom) + '</span><b>' + esc(f.prix) + '</b></label>'; }).join('') + '</fieldset>' +
        '<div class="fe-deux"><label class="fe-champ">Ton prénom<input name="prenom" autocomplete="given-name" required></label><label class="fe-champ">Ton e-mail<input name="email" type="email" autocomplete="email" required></label></div>' +
        '<label class="fe-champ">Nom et prénom du destinataire<input name="nom_complet" autocomplete="name" required></label>' +
        '<label class="fe-champ">Adresse<input name="adresse" autocomplete="address-line1" required></label>' +
        '<label class="fe-champ">Complément (bâtiment, étage…)<input name="complement" autocomplete="address-line2"></label>' +
        '<div class="fe-deux"><label class="fe-champ">Code postal<input name="code_postal" autocomplete="postal-code" inputmode="numeric" required></label><label class="fe-champ">Ville<input name="ville" autocomplete="address-level2" required></label></div>' +
        '<label class="fe-champ">Téléphone (pour le livreur, facultatif)<input name="telephone" type="tel" autocomplete="tel"></label>' +
        '<input type="text" name="_gotcha" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true">' +
        '<label class="fe-accord"><input type="checkbox" name="accord" required> <span>J’ai vérifié l’aperçu (prénoms, dates, titre). C’est un objet personnalisé, fabriqué pour moi : il ne peut pas être repris ni échangé, sauf défaut d’impression. <a href="confidentialite.html" target="_blank">Mes données</a></span></label>' +
        '<button class="bt plein rap-gros" type="submit">Commander</button><p class="fe-aide" id="fe-imp-statut" aria-live="polite"></p>' +
      '</form></div>';
  }
  function session() { try { var x = JSON.parse(localStorage.getItem('sb-qsvzzkjtjsznfntahvvh-auth-token') || 'null'); return x && x.access_token ? x : null; } catch (e) { return null; } }
  function deposer(blob, nom) {
    var x = session(), d = new Date(), chemin = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7) + '-' + nom + '.jpg';
    var hd = { apikey: 'sb_publishable_6iEVxXmtB_u1hJ6mPS9fNg_CJhLjYkg', 'Content-Type': 'image/jpeg', 'x-upsert': 'false' };
    if (x && x.expires_at * 1000 > Date.now()) hd.Authorization = 'Bearer ' + x.access_token;
    return fetch('https://qsvzzkjtjsznfntahvvh.supabase.co/storage/v1/object/impressions/' + chemin, { method: 'POST', headers: hd, body: blob })
      .then(function (r) { return r.ok ? chemin : ''; }).catch(function () { return ''; });
  }
  function brancherImpression() {
    var pv = document.getElementById('fe-imp-prevenir');
    if (pv) {
      var xs = session(); if (xs && xs.user && xs.user.email) pv.email.value = xs.user.email;
      pv.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var st = document.getElementById('fe-prev-statut'), e = pv.email.value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) { st.textContent = 'Indique une adresse e-mail valide.'; return; }
        pv.querySelector('button').disabled = true;
        window.GenesoliaEnvoyer('Arbre imprimé : me prévenir', { email: e, ouverture: IMP.ouverture })
          .then(function () { pv.outerHTML = '<p class="fe-merci">C’est noté : tu seras prévenue dès l’ouverture.</p>'; })
          .catch(function () { pv.querySelector('button').disabled = false; st.textContent = 'L’envoi n’a pas fonctionné. Réessaie dans un instant.'; });
      });
      return;
    }
    var o = document.getElementById('fe-imp-ouvrir'), f = document.getElementById('fe-imp-form'); if (!o || !f) return;
    var x = session(); if (x && x.user && x.user.email) f.email.value = x.user.email;
    o.addEventListener('click', function () { f.hidden = false; o.hidden = true; f.prenom.focus(); });
    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var st = document.getElementById('fe-imp-statut'), bt = f.querySelector('button[type=submit]');
      if (f._gotcha.value) return;
      var manque = ['prenom', 'nom_complet', 'adresse', 'code_postal', 'ville'].filter(function (k) { return !f[k].value.trim(); });
      if (manque.length || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim())) { st.textContent = 'Complète ton prénom, ton e-mail et l’adresse de livraison.'; return; }
      if (!/^\d{5}$/.test(f.code_postal.value.trim())) { st.textContent = 'Vérifie le code postal (5 chiffres, France métropolitaine).'; return; }
      if (!f.accord.checked) { st.textContent = 'Coche la case pour confirmer l’aperçu.'; return; }
      var fmt = IMP.formats.filter(function (x2) { return x2.id === (f.querySelector('input[name=format]:checked') || {}).value; })[0] || IMP.formats[0];
      var d = lire(), lien = (window.GENESOLIA_STRIPE || {})[fmt.stripe] || '';
      bt.disabled = true; st.textContent = 'Préparation de ton arbre en haute définition…';
      svgAutonome(d, false).then(function (svg) { return versPng(svg, fmt.largeur, true); }).then(function (blob) { return deposer(blob, nomFichier(d) + '-' + fmt.id); }, function () { return ''; }).then(function (chemin) {
        var fd = new FormData(f); fd.delete('accord'); fd.delete('format');
        fd.append('format', fmt.id); fd.append('format_nom', fmt.nom); fd.append('prix', fmt.prix); fd.append('titre', d.titre); fd.append('sous_titre', d.sousTitre || '');
        fd.append('fichier', chemin || 'à régénérer depuis l’arbre de la cliente'); fd.append('pays', 'France'); fd.append('paiement', lien ? 'stripe' : 'a-envoyer');
        fd.append('arbre', JSON.stringify(d.moi).slice(0, 3000));
        return window.GenesoliaEnvoyer('Commande impression', fd, 'genesolia-commande');
      }).then(function () {
        if (window.umami) try { window.umami.track('commande-impression-' + fmt.id); } catch (e) {}
        if (lien) {
          var x3 = session(), ref = (x3 && x3.user ? x3.user.id + '__' : '') ;
          st.textContent = 'Commande enregistrée. Direction le paiement sécurisé…';
          location.href = lien + (lien.indexOf('?') < 0 ? '?' : '&') + 'prefilled_email=' + encodeURIComponent(f.email.value.trim()) + (ref ? '&client_reference_id=' + encodeURIComponent(ref + 'impression-' + fmt.id) : '');
          return;
        }
        f.outerHTML = '<p class="fe-merci">Merci ! Ta commande est bien reçue : <b>' + esc(fmt.nom) + '</b>, ' + esc(fmt.prix) + '. Tu reçois une confirmation par e-mail, puis le lien de paiement sécurisé. Ton arbre part à l’impression dès le paiement reçu.</p>';
      }).catch(function () { bt.disabled = false; st.textContent = 'L’envoi n’a pas fonctionné. Vérifie ta connexion et réessaie.'; });
    });
  }
  function lire() { donnees.titre = document.getElementById('fe-titre').value.trim() || donnees.titre; donnees.sousTitre = document.getElementById('fe-sous').value.trim(); return donnees; }
  function dessiner() {
    var z = document.getElementById('fe-apercu'); if (!z) return;
    var d = lire(), verif = window.GenesoliaAcces ? window.GenesoliaAcces.verifier('arbreEncadrer') : Promise.resolve(true);
    verif.then(function (ok) { z.innerHTML = window.ArbreEncadrer.svg(d, { apercu: !ok }); });
  }
  function statut(t) { var s = document.getElementById('fe-statut'); if (s) s.textContent = t; }
  /* Par mail d'abord : la page de l'arbre (à enregistrer en PDF ou imprimer), avec un lien de secours */
  var direct = false;
  function parMail(secours) {
    var d = lire();
    window.GenesoliaParMail.envoyer({ quoi: 'ton arbre à encadrer', secours: function () { direct = true; try { secours(); } finally { direct = false; } },
      html: svgAutonome(d, false).then(function (svg) {
        return '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>' + esc(d.titre) + ' · Genesolia</title><style>@page{size:A4;margin:0}html,body{margin:0;background:#fff}svg{display:block;width:210mm;max-width:100%;height:auto;margin:0 auto}.barre{position:sticky;top:0;padding:12px;background:#4A0F36;color:#fff;font:16px sans-serif;text-align:center}.barre button{margin-left:10px;padding:8px 16px;border-radius:99px;border:0;background:#E8C899;font-weight:700}@media print{.barre{display:none}svg{width:210mm;height:297mm}}</style></head><body><div class="barre">Ton arbre Genesolia<button onclick="print()">Enregistrer en PDF</button></div>' + svg + '</body></html>';
      }) });
  }
  function telechargerPng() {
    if (!direct && window.GenesoliaParMail) return parMail(telechargerPng);
    var d = lire(); statut('Préparation de ton image…');
    svgAutonome(d, false).then(versPng).then(function (b) {
      var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = nomFichier(d) + '.png';
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
      statut('Ton image est téléchargée.');
      if (window.umami) try { window.umami.track('arbre-encadrer-png'); } catch (e) {}
    }).catch(function () { statut('L’image n’a pas pu être créée. Essaie « Imprimer ou enregistrer en PDF ».'); });
  }
  function imprimer() {
    if (!direct && window.GenesoliaParMail) return parMail(imprimer);
    var d = lire(), w = window.open('', '_blank');
    if (!w) { statut('Autorise les fenêtres pour ce site, puis réessaie.'); return; }
    w.document.write('<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>' + esc(d.titre) + '</title><style>@page{size:A4;margin:0}html,body{margin:0}svg{display:block;width:210mm;height:297mm}.barre{position:fixed;top:0;left:0;right:0;padding:12px;background:#4A0F36;color:#fff;font:16px sans-serif;text-align:center}.barre button{margin-left:10px;padding:8px 16px;border-radius:99px;border:0;background:#E8C899;font-weight:700}@media print{.barre{display:none}}</style></head><body><div class="barre">Ton arbre est prêt<button onclick="print()">Enregistrer en PDF</button></div><p style="padding:80px 20px;font:16px sans-serif">Un instant…</p></body></html>');
    w.document.close();
    svgAutonome(d, false).then(function (svg) {
      w.document.body.innerHTML = '<div class="barre">Ton arbre est prêt<button onclick="print()">Enregistrer en PDF</button></div>' + svg;
      setTimeout(function () { try { w.focus(); w.print(); } catch (e) {} }, 700);
      if (window.umami) try { window.umami.track('arbre-encadrer-pdf'); } catch (e) {}
    });
  }
  bt.addEventListener('click', function () { afficher(); window.GenoArbre.ouvrir('fen-encadrer'); });
})();
