/* Genesolia · lecture d'un prénom : histoire, nombre, arbre de vie.
   Sert à la fois à la page interactive (ton-prenom.html) et à la génération des pages statiques des prénoms. */
(function () {
  'use strict';
  var G = window.Guematrie, N = window.Numerologie;
  var POS = { 1: [150, 34], 2: [252, 96], 3: [48, 96], 4: [252, 206], 5: [48, 206], 6: [150, 266], 7: [252, 376], 8: [48, 376], 9: [150, 436], 10: [150, 504] };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function sansAccent(s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }

  function trouver(prenom) {
    var k = sansAccent(String(prenom || '').trim().split(/[\s-]+/)[0]);
    var L = window.PRENOMS || [];
    for (var i = 0; i < L.length; i++) if (L[i].slug === k) return L[i];
    for (var j = 0; j < L.length; j++) if ((L[j].variantes || []).some(function (v) { return sansAccent(v) === k; })) return L[j];
    return null;
  }

  function arbre(lecture) {
    var sp = lecture.sphere, chem = {};
    lecture.lettres.forEach(function (k) { chem[k] = 1; });
    var h = '<svg viewBox="0 0 300 540" role="img" aria-label="L\'arbre de vie, avec la sphère et les chemins de ton prénom">';
    Object.keys(G.LETTRES).forEach(function (k) {
      var c = G.LETTRES[k].chemin, a = POS[c[0]], b = POS[c[1]], on = chem[k];
      h += '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" stroke="' + (on ? '#B98A55' : '#EBCFD5') + '" stroke-width="' + (on ? 4 : 1.5) + '" stroke-linecap="round"/>';
    });
    Object.keys(POS).forEach(function (n) {
      var p = POS[n], ici = +n === sp;
      h += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (ici ? 27 : 22) + '" fill="' + (ici ? '#6B2F5B' : '#FFF9F7') + '" stroke="' + (ici ? '#6B2F5B' : '#D9B9C5') + '" stroke-width="1.5"/>' +
        '<text x="' + p[0] + '" y="' + (p[1] + 4) + '" text-anchor="middle" font-family="Gilda Display,Georgia,serif" font-size="' + (ici ? 15 : 13) + '" fill="' + (ici ? '#fff' : '#6B2F5B') + '">' + n + '</text>';
    });
    return h + '</svg>';
  }

  /* Le corps de la lecture. opts : { fiche, prenomAffiche, lettres (facultatif : transcription corrigée), editable } */
  function html(prenom, opts) {
    opts = opts || {};
    var fiche = opts.fiche === undefined ? trouver(prenom) : opts.fiche;
    var nom = (fiche && fiche.prenom) || (prenom.charAt(0).toUpperCase() + prenom.slice(1));
    var lect = opts.lettres ? G.lire(opts.lettres) : G.prenom(prenom);
    var S = lect.sphere ? G.SPHERES[lect.sphere] : null;
    var t = N.theme(prenom, '', ''), num = t.actif || t.expression;
    var h = '';
    // Histoire
    h += '<section class="p-bloc" id="histoire"><p class="p-etiq">Son histoire</p>';
    if (fiche) {
      h += '<h2>D\'où vient ' + esc(nom) + ' ?</h2><div class="p-faits">' +
        '<div><b>Origine</b>' + esc(fiche.origine.charAt(0).toUpperCase() + fiche.origine.slice(1)) + '</div>' +
        (fiche.fete ? '<div><b>Fête</b>' + esc(fiche.fete) + '</div>' : '') +
        '<div><b>Genre</b>' + ({ f: 'Féminin', m: 'Masculin', mixte: 'Mixte' }[fiche.genre] || '') + '</div>' +
        (fiche.variantes && fiche.variantes.length ? '<div><b>Formes proches</b>' + esc(fiche.variantes.join(', ')) + '</div>' : '') + '</div>' +
        '<p><b>Son sens.</b> ' + esc(fiche.sens) + '</p><p>' + esc(fiche.histoire) + '</p>';
    } else {
      h += '<h2>' + esc(nom) + '</h2><p>Ce prénom n\'est pas encore dans notre base de fiches historiques : nous l\'enrichissons régulièrement. Les lectures ci-dessous fonctionnent pour tous les prénoms.</p>';
    }
    h += '</section>';
    // Nombre
    if (num) {
      var T = N.NOMBRES[num];
      h += '<section class="p-bloc" id="nombre"><p class="p-etiq">Son nombre</p><div class="p-titre-num"><span class="p-num">' + num + '</span><div><h2>Le ' + num + ', ' + esc(T.nom.toLowerCase()) + '</h2><p class="p-mots">' + T.mots.join(' · ') + '</p></div></div>' +
        '<p>' + esc(N.texte('actif', num)) + '</p><p>' + esc(T.essence) + '</p><div class="p-duo"><div><b>Sa force</b>' + esc(T.force) + '</div><div><b>Son défi</b>' + esc(T.defi) + '</div></div>' +
        '<p class="p-note">Calculé en numérologie avec les lettres de ton prénom (A = 1, B = 2… I = 9, puis on recommence). Pour ton thème complet avec ta date de naissance : <a href="theme-numerologique.html">ton thème numérologique</a>.</p></section>';
    }
    // Arbre de vie
    if (S) {
      h += '<section class="p-bloc" id="arbre"><p class="p-etiq">Sur l\'arbre de vie</p><h2>' + esc(nom) + ' et ' + esc(S.nom.charAt(0).toLowerCase() + S.nom.slice(1)) + '</h2>' +
        '<div class="p-arbre"><div class="p-svg">' + arbre(lect) + '</div><div>' +
        '<p class="p-valeur">Valeur des lettres : <b>' + lect.total + '</b>, qui conduit à la sphère <b>' + lect.sphere + '</b>, ' + esc(S.nom.toLowerCase()) + ' <span>(' + S.ancien + ')</span>.</p>' +
        '<p class="p-mots">' + S.mots.join(' · ') + '</p><p>' + esc(S.essence) + '</p>' +
        '<div class="p-duo"><div><b>Sa force</b>' + esc(S.force) + '</div><div><b>Son défi</b>' + esc(S.defi) + '</div></div>' +
        '<p class="p-famille">' + esc(S.famille) + '</p><p class="p-question"><b>Ta question</b>' + esc(S.question) + '</p></div></div>' +
        '<h3>Les lettres de ' + esc(nom) + ' et leurs chemins</h3><p>Chaque lettre ancienne a une image et correspond à un chemin entre deux sphères de l\'arbre. Les chemins de ton prénom sont dessinés en doré.</p>' +
        '<ul class="p-lettres">' + lect.lettres.map(function (k) {
          var L = G.LETTRES[k];
          return '<li><span class="p-l-val">' + L.v + '</span><div><b>' + L.nom + ', ' + esc(L.image) + '</b><span class="p-chemin">De ' + esc(G.SPHERES[L.chemin[0]].nom.toLowerCase()) + ' à ' + esc(G.SPHERES[L.chemin[1]].nom.toLowerCase()) + '</span><p>' + esc(L.texte) + '</p></div></li>';
        }).join('') + '</ul>' +
        '<details class="p-detail"><summary>Voir le détail du calcul</summary><p>Ton prénom est transcrit selon sa prononciation dans l\'alphabet ancien à 22 lettres : <span class="p-hebreu" lang="he" dir="rtl">' + lect.lettres.map(function (k) { return G.LETTRES[k].h; }).join('') + '</span>. Les voyelles muettes ne s\'écrivent pas. Chaque lettre a sa valeur, on les additionne (' + lect.lettres.map(function (k) { return G.LETTRES[k].v; }).join(' + ') + ' = ' + lect.total + '), puis on réduit le total jusqu\'à obtenir un nombre de 1 à 10, celui d\'une sphère.</p>' +
        (opts.editable ? '<p>La transcription d\'un prénom n\'est pas toujours unique. Si la prononciation de ton prénom est différente, tu peux la corriger ci-dessous.</p><div id="p-edition"></div>' : '<p><a href="ton-prenom.html?p=' + encodeURIComponent(nom) + '">Corriger la transcription ou lire un autre prénom</a></p>') +
        '</details></section>';
    }
    // Lignée
    h += '<section class="p-bloc p-lignee" id="lignee"><p class="p-etiq">Dans ta famille</p><h2>Qui portait ce prénom avant toi ?</h2>' +
      '<p>Un prénom n\'arrive jamais par hasard : on le choisit en souvenir d\'un grand-parent, pour une personne disparue, par fidélité ou au contraire pour rompre avec une tradition. Dans ton arbre familial, l\'outil fait apparaître les prénoms transmis, et les nombres et les sphères qui reviennent d\'une génération à l\'autre.</p>' +
      '<ul><li>Qui a choisi ton prénom, et pourquoi ?</li><li>D\'autres personnes de ta famille l\'ont-elles porté ?</li><li>Est-ce un prénom de remplacement, donné après une perte ?</li></ul>' +
      '<div class="p-actions"><a class="btn btn-plein" href="genosociogramme.html?numerologie">Voir les prénoms de ma lignée</a><a class="btn btn-trait" href="questions-a-poser-a-sa-famille.html">Les questions à poser à ma famille</a></div></section>';
    return h;
  }

  var ORIGINE = '<section class="p-bloc p-origine" id="origine"><p class="p-etiq">D\'où vient cette lecture</p><h2>La valeur des lettres, une tradition universelle</h2>' +
    '<p>Très tôt, des civilisations ont donné une valeur numérique aux lettres de leur alphabet. Les Grecs pratiquaient l\'isopséphie, le monde arabe l\'abjad, et la tradition hébraïque la guématrie. Chercher ce que disent les nombres cachés dans un nom est une démarche très ancienne et largement partagée.</p>' +
    '<p>L\'arbre de vie, avec ses dix sphères reliées par vingt-deux chemins, est lui aussi un symbole que l\'on retrouve, sous des formes diverses, dans de nombreuses traditions spirituelles. La version que nous utilisons associe chacune des vingt-deux lettres de l\'alphabet ancien à un chemin de l\'arbre.</p>' +
    '<p>Nous proposons ici une lecture symbolique et contemporaine, pour réfléchir à ton prénom et à ce qu\'il porte de ton histoire. Elle ne prétend enseigner aucune tradition religieuse et ne prédit rien.</p></section>';

  var CSS = '.p-bloc{margin:0 0 2.6rem}.p-etiq{font:600 .76rem/1 var(--texte);letter-spacing:.14em;text-transform:uppercase;color:var(--champagne);margin-bottom:.5rem}' +
    '.p-bloc h2{font-size:clamp(1.6rem,3vw,2.1rem);margin-bottom:.9rem}.p-bloc h3{font-size:1.3rem;margin:1.8rem 0 .5rem}.p-bloc p{margin-bottom:.8rem;max-width:44rem}' +
    '.p-faits{display:flex;flex-wrap:wrap;gap:.6rem;margin-bottom:1rem}.p-faits div{background:var(--blanc);border:1px solid var(--rose);border-radius:14px;padding:.55rem .9rem;font-size:.95rem}.p-faits b{display:block;font:600 .7rem/1.4 var(--texte);letter-spacing:.08em;text-transform:uppercase;color:var(--prune-doux)}' +
    '.p-titre-num{display:flex;gap:1.2rem;align-items:center;margin-bottom:.6rem}.p-titre-num h2{margin:0}.p-num{flex-shrink:0;width:4.4rem;height:4.4rem;border-radius:50%;display:grid;place-items:center;font-family:var(--display);font-size:2.1rem;background:radial-gradient(circle at 30% 25%,#fff,var(--champagne-clair));border:1.5px solid var(--champagne)}' +
    '.p-mots{font-size:.9rem;color:var(--champagne);font-weight:600;margin-bottom:.6rem}' +
    '.p-duo{display:grid;grid-template-columns:1fr 1fr;gap:.7rem;margin:1rem 0;max-width:44rem}.p-duo div{border-radius:14px;padding:.8rem 1rem;font-size:.93rem;background:#FFF6EC;border:1px solid var(--champagne-clair)}.p-duo div+div{background:#FCEFF3;border-color:#F1D3DC}.p-duo b{display:block;font:600 .7rem/1 var(--texte);letter-spacing:.1em;text-transform:uppercase;margin-bottom:.35rem;color:var(--champagne)}.p-duo div+div b{color:#B5485C}' +
    '.p-note{font-size:.88rem;color:var(--prune-doux)}' +
    '.p-arbre{display:grid;grid-template-columns:minmax(0,15rem) 1fr;gap:2rem;align-items:start}.p-svg{background:var(--blanc);border:1px solid var(--rose);border-radius:var(--rayon);padding:1rem}.p-svg svg{width:100%;height:auto}' +
    '.p-valeur span{color:var(--prune-doux)}.p-famille{font-style:italic}.p-question{padding:.9rem 1rem;border-radius:14px;background:var(--blanc);border:1px solid var(--rose)}.p-question b{display:block;font:600 .7rem/1 var(--texte);letter-spacing:.1em;text-transform:uppercase;color:var(--champagne);margin-bottom:.35rem}' +
    '.p-lettres{list-style:none;display:grid;grid-template-columns:repeat(auto-fill,minmax(17rem,1fr));gap:.7rem;margin:1rem 0}.p-lettres li{display:grid;grid-template-columns:auto 1fr;gap:.8rem;padding:.9rem 1rem;border-radius:16px;background:var(--blanc);border:1px solid var(--rose)}.p-l-val{width:2.6rem;height:2.6rem;border-radius:12px;display:grid;place-items:center;font-family:var(--display);font-size:1.05rem;background:var(--rose)}.p-lettres b{display:block}.p-chemin{display:block;font-size:.8rem;color:var(--champagne);margin:.1rem 0 .3rem}.p-lettres p{font-size:.9rem;margin:0}' +
    '.p-detail{margin-top:1rem;padding:.9rem 1.1rem;border-radius:14px;background:var(--blanc);border:1px solid var(--rose)}.p-detail summary{cursor:pointer;font-weight:600}.p-detail p{margin:.7rem 0 0;font-size:.93rem}.p-hebreu{font-size:1.3rem;letter-spacing:.1em}' +
    '.p-lignee{padding:1.8rem;border-radius:var(--rayon);background:linear-gradient(135deg,#FFF6EC,#FCEFF3);border:1px solid var(--champagne-clair)}.p-lignee ul{margin:.4rem 0 1.2rem 1.2rem;display:grid;gap:.3rem}.p-actions{display:flex;flex-wrap:wrap;gap:.6rem}' +
    '.p-origine p{color:var(--prune-doux)}' +
    '@media (max-width:760px){.p-arbre{grid-template-columns:1fr}.p-svg{max-width:16rem}.p-duo{grid-template-columns:1fr}.p-lignee{padding:1.3rem}}';

  window.PrenomLecture = { html: html, trouver: trouver, arbre: arbre, ORIGINE: ORIGINE, CSS: CSS, esc: esc };
})();
