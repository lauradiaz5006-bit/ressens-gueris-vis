/* Genesolia · Connexion en deux étapes (code à 6 chiffres d'une appli d'authentification : Google Authenticator, Microsoft Authenticator, 1Password…)
   - verifier(sb) : si le compte a activé la double étape et que la session n'est pas encore confirmée, demande le code. Résout true une fois confirmé.
   - reglage(sb, zone) : l'encart « Connexion en deux étapes » de l'Espace praticien (activer, désactiver).
   Côté base, une règle restrictive exige la session confirmée (aal2) pour les comptes qui l'ont activée (outils-internes/supabase-deux-etapes.sql).
   Gratuit sur Supabase (méthode TOTP). */
window.GenesoliaDeuxEtapes = (function () {
  'use strict';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var CSS = '.de-fond{position:fixed;inset:0;z-index:400;background:rgba(46,19,56,.55);display:flex;align-items:center;justify-content:center;padding:16px}' +
    '.de-carte{background:#fff;color:#4A2142;border-radius:22px;max-width:24rem;width:100%;padding:1.5rem 1.3rem;box-shadow:0 20px 50px rgba(46,19,56,.3);font:400 1rem/1.5 "Nunito Sans",sans-serif;text-align:center}' +
    '.de-carte h2{font:400 1.45rem "Gilda Display",Georgia,serif;margin:0 0 .4rem;color:#4A2142}.de-carte p{margin:0 0 .9rem;color:#7A5570;font-size:.93rem}' +
    '.de-code{font:600 1.6rem/1 "Nunito Sans",monospace;letter-spacing:.35em;text-align:center;width:100%;box-sizing:border-box;padding:.7rem .5rem;border:1.5px solid #E5C6CF;border-radius:14px;color:#4A2142}' +
    '.de-err{color:#A3324B;font-size:.9rem;min-height:1.2em;margin:.5rem 0}.de-bt{display:block;width:100%;border:0;border-radius:99px;padding:.85rem;font:700 1rem "Nunito Sans",sans-serif;background:#6B2F5B;color:#fff;cursor:pointer}' +
    '.de-lien{background:none;border:0;color:#7A5570;text-decoration:underline;font:500 .88rem "Nunito Sans",sans-serif;cursor:pointer;margin-top:.7rem}' +
    '.de-qr{display:block;width:180px;height:180px;margin:.4rem auto .6rem;border:1px solid #F2D6DE;border-radius:12px;padding:6px;background:#fff}.de-cle{font:600 .85rem monospace;word-break:break-all;background:#FFF6EC;border-radius:10px;padding:.5rem .6rem;margin:0 0 .8rem;color:#4A2142}' +
    '.de-etat{display:inline-block;border-radius:99px;padding:.3rem .75rem;font-size:.85rem;font-weight:600;background:#EAF4EE;color:#2F6E52;margin:0 0 .6rem}.de-etat.non{background:#FCEFF3;color:#7A5570}';
  function styles() { if (document.getElementById('de-css')) return; var s = document.createElement('style'); s.id = 'de-css'; s.textContent = CSS; document.head.appendChild(s); }
  function champCode(f) { var i = f.querySelector('.de-code'); i.addEventListener('input', function () { i.value = i.value.replace(/\D/g, '').slice(0, 6); }); setTimeout(function () { i.focus(); }, 50); return i; }

  function totpVerifie(sb) {
    return sb.auth.mfa.listFactors().then(function (r) { var l = (r && r.data && r.data.totp) || []; return l.filter(function (f) { return f.status === 'verified'; })[0] || null; });
  }

  /* Demander le code si la session doit être confirmée */
  var enCours = null;
  function verifier(sb) {
    if (enCours) return enCours;
    if (!sb || !sb.auth || !sb.auth.mfa) return Promise.resolve(true);
    enCours = sb.auth.mfa.getAuthenticatorAssuranceLevel().then(function (r) {
      var d = r && r.data; if (!d || d.nextLevel !== 'aal2' || d.currentLevel === 'aal2') return true;
      return totpVerifie(sb).then(function (fac) {
        if (!fac) return true;
        styles();
        return new Promise(function (ok) {
          var f = document.createElement('div'); f.className = 'de-fond'; f.setAttribute('role', 'dialog'); f.setAttribute('aria-modal', 'true'); f.setAttribute('aria-labelledby', 'de-titre');
          f.innerHTML = '<form class="de-carte" novalidate><h2 id="de-titre">Ton code de connexion</h2><p>Ta connexion est protégée en deux étapes. Ouvre ton appli d’authentification et tape le code à 6 chiffres de Genesolia.</p>' +
            '<input class="de-code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" aria-label="Code à 6 chiffres"><p class="de-err" role="alert"></p><button class="de-bt" type="submit">Valider</button><button class="de-lien" type="button" data-sortir>Me déconnecter</button></form>';
          document.body.appendChild(f);
          var i = champCode(f), err = f.querySelector('.de-err'), bt = f.querySelector('.de-bt');
          f.querySelector('form').addEventListener('submit', function (e) {
            e.preventDefault(); err.textContent = '';
            if (i.value.length !== 6) { err.textContent = 'Le code fait 6 chiffres.'; return; }
            bt.disabled = true;
            sb.auth.mfa.challengeAndVerify({ factorId: fac.id, code: i.value }).then(function (x) {
              bt.disabled = false;
              if (x.error) { err.textContent = 'Ce code ne correspond pas. Prends le code affiché maintenant (il change toutes les 30 secondes).'; i.value = ''; i.focus(); return; }
              f.remove(); ok(true);
            });
          });
          f.querySelector('[data-sortir]').addEventListener('click', function () { sb.auth.signOut().then(function () { f.remove(); location.href = 'login.html'; }); });
        });
      });
    }, function () { return true; });
    enCours.then(function () { enCours = null; });
    return enCours;
  }

  /* L'encart de réglage : activer ou désactiver */
  function reglage(sb, z) {
    if (!z || !sb || !sb.auth || !sb.auth.mfa) return;
    styles();
    function rendre() {
      totpVerifie(sb).then(function (fac) {
        z.innerHTML = fac
          ? '<span class="de-etat">Activée</span><p class="pr-aide">À chaque nouvelle connexion, Genesolia te demande le code de ton appli d’authentification, en plus du mot de passe.</p><button class="btn btn-trait" type="button" data-de-off>Désactiver</button>'
          : '<span class="de-etat non">Pas activée</span><p class="pr-aide">Tes dossiers contiennent des histoires de famille sensibles. Avec la double étape, ton mot de passe seul ne suffit plus pour entrer : il faut aussi le code de ton téléphone. Gratuit, avec Google Authenticator, Microsoft Authenticator ou 1Password.</p><button class="btn btn-plein" type="button" data-de-on>Activer la connexion en deux étapes</button>';
        var on = z.querySelector('[data-de-on]'), off = z.querySelector('[data-de-off]');
        if (on) on.addEventListener('click', activer);
        if (off) off.addEventListener('click', function () {
          if (!confirm('Désactiver la connexion en deux étapes ? Ton mot de passe suffira de nouveau pour entrer.')) return;
          off.disabled = true;
          sb.auth.mfa.unenroll({ factorId: fac.id }).then(function (x) { if (x.error) { off.disabled = false; alert('La désactivation n’a pas abouti. Reconnecte-toi avec ton code, puis réessaie.'); return; } rendre(); });
        });
      });
    }
    function activer() {
      // un essai précédent resté inachevé est retiré avant d'en créer un nouveau
      sb.auth.mfa.listFactors().then(function (r) {
        var vieux = ((r && r.data && r.data.all) || []).filter(function (f) { return f.factor_type === 'totp' && f.status !== 'verified'; });
        return Promise.all(vieux.map(function (f) { return sb.auth.mfa.unenroll({ factorId: f.id }); }));
      }).then(function () {
        return sb.auth.mfa.enroll({ factorType: 'totp', friendlyName: 'Genesolia ' + new Date().toISOString().slice(0, 10), issuer: 'Genesolia' });
      }).then(function (x) {
        if (!x || x.error || !x.data) { alert('La connexion en deux étapes n’a pas pu démarrer. Réessaie dans un instant.'); return; }
        var fac = x.data, t = fac.totp || {};
        var f = document.createElement('div'); f.className = 'de-fond'; f.setAttribute('role', 'dialog'); f.setAttribute('aria-modal', 'true');
        f.innerHTML = '<form class="de-carte" novalidate><h2>Activer la double étape</h2><p>1. Dans ton appli d’authentification, ajoute un compte et scanne ce code.</p>' +
          '<img class="de-qr" alt="Code QR à scanner" src="' + esc(t.qr_code || '') + '"><p style="margin:0 0 .3rem">Ou tape cette clé :</p><div class="de-cle">' + esc(t.secret || '') + '</div>' +
          '<p>2. Tape le code à 6 chiffres que l’appli affiche.</p><input class="de-code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" aria-label="Code à 6 chiffres"><p class="de-err" role="alert"></p>' +
          '<button class="de-bt" type="submit">Activer</button><button class="de-lien" type="button" data-annuler>Annuler</button></form>';
        document.body.appendChild(f);
        var i = champCode(f), err = f.querySelector('.de-err'), bt = f.querySelector('.de-bt');
        f.querySelector('[data-annuler]').addEventListener('click', function () { sb.auth.mfa.unenroll({ factorId: fac.id }).then(function () {}); f.remove(); });
        f.querySelector('form').addEventListener('submit', function (e) {
          e.preventDefault(); err.textContent = '';
          if (i.value.length !== 6) { err.textContent = 'Le code fait 6 chiffres.'; return; }
          bt.disabled = true;
          sb.auth.mfa.challengeAndVerify({ factorId: fac.id, code: i.value }).then(function (y) {
            bt.disabled = false;
            if (y.error) { err.textContent = 'Ce code ne correspond pas. Vérifie l’heure de ton téléphone et prends le code affiché maintenant.'; i.value = ''; i.focus(); return; }
            f.remove(); rendre(); alert('C’est fait : ta connexion est protégée en deux étapes.');
          });
        });
      });
    }
    rendre();
  }
  return { verifier: verifier, reglage: reglage };
})();
