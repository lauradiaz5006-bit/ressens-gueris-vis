/* Genesolia · Ma fiche dans l'annuaire (Espace praticien) : la praticienne remplit sa fiche et choisit de la publier.
   Elle apparaît sur annuaire.html après validation par Genesolia (colonne « valide », réservée), et tant que l'Espace praticien est actif.
   Table annuaire_praticiens, outils-internes/supabase-annuaire.sql. */
window.GenesoliaAnnuaire = (function () {
  'use strict';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var PRATIQUES = ['Psychogénéalogiste', 'Praticien·ne en relation d’aide', 'Coach', 'Sophrologue', 'Hypnose', 'Astrologue ou numérologue', 'Autre'];
  function url(v) { v = String(v || '').trim(); if (!v) return null; if (!/^https?:\/\//i.test(v)) v = 'https://' + v; return /^https?:\/\/[^\s.]+\.[^\s]+$/i.test(v) ? v.slice(0, 200) : false; }

  function fiche(sb, user, prat, z, actif) {
    if (!z || !sb) return;
    var meta = (user && user.user_metadata) || {};
    sb.from('annuaire_praticiens').select('*').eq('user_id', user.id).maybeSingle().then(function (r) {
      if (r.error && /relation|does not exist|schema cache/i.test(r.error.message || '')) { z.innerHTML = '<p class="pr-aide">L’annuaire arrive très bientôt.</p>'; return; }
      var f = (r && r.data) || { nom: '', activite: prat && prat.cabinet || '', pratique: meta.pratique || '', ville: meta.ville || '', visio: true, presentiel: true };
      var etat = !r.data ? '' : !f.publie ? '<span class="de-etat non">Pas publiée</span>' : f.valide ? '<span class="de-etat">En ligne</span> <a href="annuaire.html" target="_blank" rel="noopener" style="font-size:.88rem">Voir l’annuaire</a>' : '<span class="de-etat non">En attente de validation</span>';
      z.innerHTML = (etat ? '<p style="margin:0 0 .6rem">' + etat + '</p>' : '') +
        '<p class="pr-aide">Les personnes qui dessinent leur arbre sur Genesolia cherchent parfois quelqu’un pour les accompagner. Votre fiche les mène à vous. ' + (actif ? '' : '<b>Elle n’est visible que pendant que votre Espace praticien est actif.</b>') + '</p>' +
        '<form class="pr-form" id="an-form" novalidate>' +
        '<label>Votre nom, tel qu’il apparaîtra<input type="text" name="nom" maxlength="80" value="' + esc(f.nom) + '" placeholder="Claire Martin"></label>' +
        '<label>Votre activité<input type="text" name="activite" maxlength="80" value="' + esc(f.activite) + '"></label>' +
        '<label>Votre pratique<select name="pratique"><option value="">Choisissez…</option>' + PRATIQUES.map(function (p) { return '<option' + (f.pratique === p ? ' selected' : '') + '>' + p + '</option>'; }).join('') + '</select></label>' +
        '<div class="pr-deux"><label>Ville<input type="text" name="ville" maxlength="80" value="' + esc(f.ville) + '"></label><label>Code postal<input type="text" name="code_postal" maxlength="10" value="' + esc(f.code_postal) + '"></label></div>' +
        '<label>Pays<input type="text" name="pays" maxlength="40" value="' + esc(f.pays || 'France') + '"></label>' +
        '<label class="pr-case"><input type="checkbox" name="presentiel"' + (f.presentiel ? ' checked' : '') + '> <span>Je reçois en présentiel</span></label>' +
        '<label class="pr-case"><input type="checkbox" name="visio"' + (f.visio ? ' checked' : '') + '> <span>J’accompagne en visio</span></label>' +
        '<label><span>Votre présentation <small>(700 caractères au plus)</small></span><textarea name="presentation" maxlength="700" rows="5" style="font:inherit;font-weight:400;padding:.75rem .9rem;border:1px solid #E5C6CF;border-radius:12px;color:var(--prune)">' + esc(f.presentation) + '</textarea></label>' +
        '<label><span>Votre site <small>(facultatif)</small></span><input type="text" name="site_web" maxlength="200" value="' + esc(f.site_web) + '" placeholder="https://"></label>' +
        '<label><span>Votre lien de prise de rendez-vous <small>(facultatif)</small></span><input type="text" name="lien_rdv" maxlength="200" value="' + esc(f.lien_rdv) + '" placeholder="https://"></label>' +
        '<div class="pr-deux"><label><span>Téléphone <small>(facultatif)</small></span><input type="text" name="telephone" maxlength="25" value="' + esc(f.telephone) + '"></label><label><span>E-mail de contact <small>(facultatif)</small></span><input type="text" name="email_public" maxlength="120" value="' + esc(f.email_public) + '"></label></div>' +
        '<label class="pr-case"><input type="checkbox" name="publie"' + (f.publie ? ' checked' : '') + '> <span>Je publie ma fiche dans l’annuaire Genesolia. J’accepte que ces informations soient visibles par tous sur genesolia.fr. Je peux la retirer à tout moment en décochant cette case.</span></label>' +
        '<p class="pr-err" id="an-msg" role="status"></p><div><button class="btn btn-plein" type="submit">Enregistrer ma fiche</button></div>' +
        '<p class="pr-aide" style="margin:0">Chaque fiche est relue par Genesolia avant sa mise en ligne (sous 48 h). Une modification du nom, de la présentation ou des liens repasse par cette relecture.</p></form>';
      var fm = z.querySelector('#an-form'), msg = z.querySelector('#an-msg');
      fm.addEventListener('submit', function (e) {
        e.preventDefault(); msg.textContent = '';
        var nom = fm.nom.value.trim(), site = url(fm.site_web.value), rdv = url(fm.lien_rdv.value), mail = fm.email_public.value.trim();
        if (!nom) { msg.textContent = 'Indiquez votre nom.'; fm.nom.focus(); return; }
        if (site === false || rdv === false) { msg.textContent = 'Un lien n’est pas valide. Écrivez-le en entier, par exemple https://monsite.fr'; return; }
        if (mail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail)) { msg.textContent = 'L’e-mail de contact n’est pas valide.'; return; }
        if (fm.publie.checked && !fm.presentation.value.trim()) { msg.textContent = 'Écrivez quelques lignes de présentation avant de publier.'; fm.presentation.focus(); return; }
        var ligne = { user_id: user.id, nom: nom, activite: fm.activite.value.trim() || null, pratique: fm.pratique.value || null, ville: fm.ville.value.trim() || null, code_postal: fm.code_postal.value.trim() || null, pays: fm.pays.value.trim() || 'France',
          presentiel: fm.presentiel.checked, visio: fm.visio.checked, presentation: fm.presentation.value.trim() || null, site_web: site, lien_rdv: rdv, telephone: fm.telephone.value.trim() || null, email_public: mail || null,
          publie: fm.publie.checked, accord_public: fm.publie.checked ? (f.accord_public || new Date().toISOString()) : f.accord_public || null };
        var bt = fm.querySelector('button'); bt.disabled = true;
        sb.from('annuaire_praticiens').upsert(ligne, { onConflict: 'user_id' }).then(function (x) {
          bt.disabled = false;
          if (x.error) { msg.textContent = /row-level|policy/i.test(x.error.message || '') ? 'Votre fiche ne peut être créée que pendant que votre Espace praticien est actif.' : 'Pas enregistré. Réessayez dans un instant.'; return; }
          fiche(sb, user, prat, z, actif);
        });
      });
    });
  }
  return { fiche: fiche, esc: esc };
})();
