/* Genesolia · Document de déontologie (deontologie.html?d=<jeton>)
   Le·la praticien·ne rédige une section personnalisée et s'engage (deontologie_signer_praticien),
   puis envoie ce lien : la cliente lit le cadre, coche les cases d'accord, indique son prénom/nom
   et valide une seule fois (deontologie_ouvrir, deontologie_signer_client,
   outils-internes/supabase-deontologie.sql). Chaque partie garde une trace horodatée. */
(function () {
  'use strict';
  var SB_URL = 'https://qsvzzkjtjsznfntahvvh.supabase.co', SB_KEY = 'sb_publishable_6iEVxXmtB_u1hJ6mPS9fNg_CJhLjYkg';
  var z = document.getElementById('gd'), sb = null;
  try { sb = window.supabase.createClient(SB_URL, SB_KEY, { auth: { persistSession: false, autoRefreshToken: false } }); } catch (e) {}
  var PARAMS = new URLSearchParams(location.search);
  var J = (PARAMS.get('d') || '').toLowerCase();
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function dateLongue(d) { return d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''; }

  /* Le cadre de base, le même pour tout le monde ; le·la praticien·ne y ajoute, en dessous, sa propre section. */
  var ACCORDS = [
    'J’ai pris connaissance du déroulement et du cadre de cet accompagnement.',
    'Je comprends que cet accompagnement est de nature symbolique : il ne constitue ni un acte médical, ni un acte de psychothérapie, et qu’il ne remplace pas un suivi médical, psychologique ou psychiatrique.',
    'Les informations que je partage sont traitées de façon confidentielle par mon·ma praticien·ne.',
    'Je participe de façon libre et volontaire, et je peux interrompre cet accompagnement à tout moment.'
  ];
  var TEXTE_BASE = 'Avant de commencer, voici le cadre de nos séances.\n\n' +
    'Cet accompagnement propose une lecture symbolique de ton histoire familiale. Il s’appuie sur l’écoute, le génosociogramme et, selon les séances, la Constellation Familiale. Ce n’est à aucun moment un acte médical, un diagnostic ou une psychothérapie : il ne remplace ni un suivi médical, ni un accompagnement psychologique ou psychiatrique, et ne s’y substitue jamais.\n\n' +
    'Ce que tu partages reste confidentiel. Je ne transmets rien de ce qui est dit en séance sans ton accord explicite.\n\n' +
    'Tu restes libre à chaque étape : tu peux poser des questions, refuser une piste de travail, ou arrêter l’accompagnement quand tu le souhaites, sans justification.';

  function formulaire(d) {
    var perso = d.texte_perso ? '<div class="gd-carte"><h2>Et pour notre accompagnement</h2><p class="gd-texte">' + esc(d.texte_perso) + '</p></div>' : '';
    z.innerHTML = '<p class="gd-etiq">Avant ta séance</p><h1>Le cadre de notre accompagnement</h1>' +
      '<p class="gd-intro">' + (d.cabinet ? esc(d.cabinet) : 'Ton·ta praticien·ne') + ' te propose de lire ce document avant de commencer, et de le valider ci-dessous.</p>' +
      '<div class="gd-carte"><p class="gd-texte">' + esc(TEXTE_BASE) + '</p></div>' + perso +
      '<div class="gd-carte"><h2>Je confirme</h2>' +
      ACCORDS.map(function (a, i) { return '<label class="gd-case"><input type="checkbox" data-accord="' + i + '"> <span>' + esc(a) + '</span></label>'; }).join('') +
      '<label>Ton prénom et ton nom<input type="text" maxlength="120" data-nom placeholder="Pour garder une trace de ta validation"></label>' +
      '<p class="gd-err" data-err></p>' +
      '<button class="bt plein rap-gros" type="button" data-valider style="padding:.8rem 1.4rem;border-radius:999px;border:0;background:var(--prune);color:#fff;font:600 1rem inherit;cursor:pointer">Je valide</button>' +
      '</div>';
    z.querySelector('[data-valider]').addEventListener('click', function () { valider(this); });
  }

  function valider(b) {
    var err = z.querySelector('[data-err]'); err.textContent = '';
    var cases = [].slice.call(z.querySelectorAll('[data-accord]'));
    if (cases.some(function (c) { return !c.checked; })) { err.textContent = 'Coche chaque case pour valider le document.'; return; }
    var nom = (z.querySelector('[data-nom]').value || '').trim();
    if (!nom) { err.textContent = 'Indique ton prénom et ton nom.'; z.querySelector('[data-nom]').focus(); return; }
    if (!confirm('Valider ce document ? Tu ne pourras plus le modifier ensuite.')) return;
    b.disabled = true; b.textContent = 'Validation…';
    var accords = cases.map(function (c, i) { return { i: i, texte: ACCORDS[i] }; });
    sb.rpc('deontologie_signer_client', { p_jeton: J, p_nom: nom, p_accords: accords }).then(function (x) {
      var d = x && x.data;
      if (x.error || !d || d.erreur) {
        b.disabled = false; b.textContent = 'Je valide';
        err.textContent = d && d.erreur === 'deja' ? 'Ce document a déjà été validé.' : d && d.erreur === 'pas-pret' ? 'Ce document n’est pas encore prêt. Vérifie avec ton·ta praticien·ne.' : d && d.erreur === 'lien' ? 'Ce lien n’est plus valable. Demande un nouveau lien.' : 'La validation n’a pas abouti. Vérifie ta connexion et réessaie.';
        return;
      }
      merci(true, nom);
    }, function () { b.disabled = false; b.textContent = 'Je valide'; err.textContent = 'La validation n’a pas abouti. Vérifie ta connexion et réessaie.'; });
  }
  function merci(maintenant, nom, quand) {
    z.innerHTML = '<div class="gd-carte gd-merci"><p class="gd-etiq">Avant ta séance</p><h1>' + (maintenant ? 'Merci, c’est validé' : 'Déjà validé') + '</h1><p class="gd-intro" style="margin:0">' +
      (maintenant ? 'Ton·ta praticien·ne garde une trace de ta validation' + (nom ? ', au nom de ' + esc(nom) : '') + '. Tu peux fermer cette page.' : 'Ce document a été validé' + (nom ? ' par ' + esc(nom) : '') + (quand ? ' le ' + esc(dateLongue(quand)) : '') + '.') + '</p></div>';
  }

  if (!sb || !/^[0-9a-f-]{36}$/.test(J)) { z.innerHTML = '<div class="gd-carte"><h1>Ce lien n’est pas complet</h1><p class="gd-intro" style="margin:0">Ouvre le lien exact reçu de ton·ta praticien·ne.</p></div>'; return; }
  sb.rpc('deontologie_ouvrir', { p_jeton: J }).then(function (x) {
    var d = x && x.data;
    if (x.error || !d || d.erreur) { z.innerHTML = '<div class="gd-carte"><h1>Ce lien n’est plus valable</h1><p class="gd-intro" style="margin:0">Il a expiré. Demande un nouveau lien à ton·ta praticien·ne.</p></div>'; return; }
    if (!d.signe_praticien) { z.innerHTML = '<div class="gd-carte"><h1>Ce document n’est pas encore prêt</h1><p class="gd-intro" style="margin:0">Vérifie avec ' + (d.cabinet ? esc(d.cabinet) : 'ton·ta praticien·ne') + '.</p></div>'; return; }
    if (d.signe_client) { merci(false, d.client_nom, d.signe_client_le); return; }
    formulaire(d);
  }, function () { z.innerHTML = '<div class="gd-carte"><h1>Le document n’a pas pu s’ouvrir</h1><p class="gd-intro" style="margin:0">Vérifie ta connexion et recharge la page.</p></div>'; });
})();
