/* Genesolia · tutoriel de l'arbre familial (genosociogramme.html).
   Bouton #bt-tuto (et tout élément [data-tuto]) pour l'ouvrir. S'ouvre seul à la première visite quand l'arbre est vide. */
(function () {
  'use strict';
  var CLE = 'genesolia-tuto-arbre-vu';
  var P = '#6B2F5B', C = '#B98A55', R = '#F7E6E8';

  /* ── Petits dessins ── */
  function homme(x, y, t, moi) { return '<rect x="' + (x - 17) + '" y="' + (y - 17) + '" width="34" height="34" rx="3" fill="' + (moi ? P : '#fff') + '" stroke="' + P + '" stroke-width="2"/>' + lab(x, y, t); }
  function femme(x, y, t, moi) { return '<circle cx="' + x + '" cy="' + y + '" r="18" fill="' + (moi ? P : '#fff') + '" stroke="' + P + '" stroke-width="2"/>' + (moi ? '<circle cx="' + x + '" cy="' + y + '" r="25" fill="none" stroke="' + C + '" stroke-width="1.5"/>' : '') + lab(x, y, t); }
  function lab(x, y, t) { return t ? '<text x="' + x + '" y="' + (y + 38) + '" text-anchor="middle" font-size="12" fill="' + P + '">' + t + '</text>' : ''; }
  function trait(d) { return '<path d="' + d + '" fill="none" stroke="#B79A85" stroke-width="1.6"/>'; }
  function bouton(x, y, w, t, plein) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="30" rx="15" fill="' + (plein ? P : '#fff') + '" stroke="' + P + '" stroke-width="1.4"/><text x="' + (x + w / 2) + '" y="' + (y + 19.5) + '" text-anchor="middle" font-size="12" font-weight="600" fill="' + (plein ? '#fff' : P) + '">' + t + '</text>'; }
  function carte(x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="14" fill="#fff" stroke="#EBCFD5"/>'; }
  function svg(corps) { return '<svg viewBox="0 0 420 300" role="img" aria-hidden="true" font-family="Nunito Sans, Arial, sans-serif">' + corps + '</svg>'; }
  function arbre3(moiFemme) {
    return trait('M95 70 H165 M130 70 V115 H175 V140 M255 70 H325 M290 70 V115 H245 V140 M175 160 H245 M210 160 V215') +
      homme(95, 70, 'Grand-père') + femme(165, 70, 'Grand-mère') + homme(255, 70, 'Grand-père') + femme(325, 70, 'Grand-mère') +
      homme(175, 160, 'Père') + femme(245, 160, 'Mère') + (moiFemme === false ? homme(210, 232, 'Toi', true) : femme(210, 232, 'Toi', true));
  }

  var ETAPES = [
    { titre: 'Ton arbre commence <em>par toi</em>',
      texte: 'Clique sur le bouton « Me placer dans l\'arbre ». Ta case apparaît au centre : c\'est ton point de départ.',
      astuce: 'Pas besoin de tout savoir pour commencer. Un prénom suffit.',
      dessin: function () { return svg(carte(60, 40, 300, 220) + '<text x="210" y="92" text-anchor="middle" font-size="19" font-family="Gilda Display, Georgia, serif" fill="' + P + '">Ton arbre commence par toi</text><text x="210" y="122" text-anchor="middle" font-size="12" fill="#8E6383">Place-toi, puis ajoute ta famille.</text>' + bouton(120, 150, 180, 'Me placer dans l\'arbre', true) + bouton(145, 196, 130, 'Voir un exemple')); } },
    { titre: 'Remplis <em>ta fiche</em>',
      texte: 'Indique ton prénom, ton sexe et ta date de naissance. Pour la naissance, l\'année suffit (1985) ; la date complète (14/03/1985) permet plus de repérages.',
      astuce: 'Une information te manque ? Laisse le champ vide et reviens-y plus tard.',
      dessin: function () { return svg(carte(70, 30, 280, 240) + '<text x="94" y="66" font-size="18" font-family="Gilda Display, Georgia, serif" fill="' + P + '">Ma fiche</text>' + [['Prénom', 'Camille'], ['Sexe', 'Femme'], ['Naissance', '1985'], ['Lieu', 'Lyon']].map(function (l, i) { var y = 88 + i * 42; return '<text x="94" y="' + (y + 4) + '" font-size="11" fill="#8E6383">' + l[0] + '</text><rect x="168" y="' + (y - 13) + '" width="158" height="26" rx="8" fill="#FFF9F7" stroke="#EBCFD5"/><text x="178" y="' + (y + 4) + '" font-size="12" fill="' + P + '">' + l[1] + '</text>'; }).join('')); } },
    { titre: 'Clique sur une case <em>pour agir</em>',
      texte: 'Quand tu cliques sur une personne, une barre apparaît au-dessus d\'elle : Modifier, + Parents, + Conjoint·e, + Enfant, + Frère ou sœur.',
      astuce: 'C\'est depuis cette barre que tout se construit. Clique sur une autre case pour changer de personne.',
      dessin: function () { return svg('<rect x="22" y="78" width="376" height="42" rx="12" fill="#fff" stroke="#EBCFD5"/>' + ['Modifier', '+ Parents', '+ Conjoint·e', '+ Enfant', '+ Frère ou sœur'].map(function (t, i) { var w = [62, 70, 82, 62, 92][i], x = [26, 88, 158, 240, 302][i]; return '<rect x="' + x + '" y="85" width="' + (w - 4) + '" height="28" rx="8" fill="' + (i === 1 ? P : R) + '"/><text x="' + (x + (w - 4) / 2) + '" y="103" text-anchor="middle" font-size="10.5" font-weight="600" fill="' + (i === 1 ? '#fff' : P) + '">' + t + '</text>'; }).join('') + '<path d="M200 120 l10 10 l10 -10" fill="#fff" stroke="#EBCFD5"/>' + femme(210, 190, 'Toi', true)); } },
    { titre: 'Remonte <em>les générations</em>',
      texte: 'Sur ta case, choisis « + Parents » : ta mère et ton père s\'ajoutent d\'un coup. Fais de même sur chacun d\'eux pour ajouter tes grands-parents.',
      astuce: 'Trois générations suffisent pour commencer : toi, tes parents, tes grands-parents.',
      dessin: function () { return svg(arbre3()); } },
    { titre: 'Complète <em>les fiches</em>',
      texte: 'Clique sur « Modifier » pour ajouter les dates, les lieux, les métiers et les événements marquants : une union, un départ, une rupture, un deuil. Indique l\'âge ou l\'année de chaque événement.',
      astuce: 'Note ce qui est sûr. Pour une histoire racontée ou une date approximative, précise-le : « à vérifier ».',
      dessin: function () { return svg(trait('M70 40 V270') + ['Naissance · 1958', 'Départ du village · 22 ans', 'Union · 1981', 'Décès · 2004'].map(function (t, i) { var y = 62 + i * 60; return '<circle cx="70" cy="' + y + '" r="7" fill="' + C + '"/>' + carte(96, y - 22, 280, 44) + '<text x="116" y="' + (y + 5) + '" font-size="14" font-family="Gilda Display, Georgia, serif" fill="' + P + '">' + t + '</text>'; }).join('')); } },
    { titre: 'Regarde <em>ce qui se répète</em>',
      texte: 'Le bouton « Ce qui se répète » s\'allume au fil de ta saisie : prénoms transmis, mêmes âges, mêmes dates, mêmes événements. Clique sur une répétition pour la voir dans l\'arbre.',
      astuce: 'Chaque répétition est une piste de lecture, pas une vérité sur ta famille. À toi d\'y voir ce qui te parle.',
      dessin: function () { return svg('<rect x="40" y="22" width="190" height="34" rx="17" fill="' + P + '"/><text x="120" y="44" text-anchor="middle" font-size="12.5" font-weight="600" fill="#fff">Ce qui se répète</text><circle cx="208" cy="39" r="11" fill="' + C + '"/><text x="208" y="43.5" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">3</text>' + carte(40, 72, 340, 210) + [['Même prénom sur 3 générations', 'Marie · Marie · Marie'], ['Parent au même âge', '24 ans, de mère en fille'], ['Même mois de naissance', 'Mars, à deux générations']].map(function (r, i) { var y = 92 + i * 62; return '<rect x="56" y="' + y + '" width="308" height="50" rx="10" fill="' + (i === 0 ? '#FFF6EC' : '#FFF9F7') + '" stroke="' + (i === 0 ? C : '#EBCFD5') + '"/><text x="72" y="' + (y + 21) + '" font-size="12.5" font-weight="700" fill="' + P + '">' + r[0] + '</text><text x="72" y="' + (y + 38) + '" font-size="11" fill="#8E6383">' + r[1] + '</text>'; }).join('')); } },
    { titre: 'Va <em>plus loin</em>',
      texte: 'Dans la barre du haut : « Numérologie » et « Astrologie » relient les nombres et les signes de chaque personne. « Mon rapport » rassemble toute la lecture de ton arbre.',
      astuce: 'Plus ton arbre contient de dates complètes, plus ces lectures sont riches.',
      dessin: function () { return svg(bouton(40, 60, 110, 'Numérologie') + bouton(160, 60, 100, 'Astrologie') + bouton(270, 60, 110, 'Mon rapport', true) + carte(80, 120, 260, 150) + '<text x="210" y="160" text-anchor="middle" font-size="17" font-family="Gilda Display, Georgia, serif" fill="' + P + '">Le rapport de ton arbre</text>' + [0, 1, 2, 3].map(function (i) { return '<rect x="110" y="' + (180 + i * 20) + '" width="' + [200, 170, 190, 140][i] + '" height="8" rx="4" fill="' + R + '"/>'; }).join('')); } },
    { titre: 'Garde <em>ton arbre</em>',
      texte: 'Ton arbre s\'enregistre tout seul dans ton navigateur à chaque modification. Pour le retrouver sur un autre appareil, crée ton compte gratuit. Tu peux aussi le télécharger en image ou l\'imprimer.',
      astuce: 'Le bouton « Sauvegardes » garde aussi les versions précédentes, au cas où.',
      dessin: function () { return svg(carte(90, 30, 240, 150) + '<g transform="translate(-55 -10) scale(.62)">' + arbre3() + '</g>' + '<text x="210" y="168" text-anchor="middle" font-size="11" fill="#8E6383">Enregistré automatiquement</text>' + bouton(40, 210, 110, 'Sauvegardes') + bouton(160, 210, 120, 'Mon espace', true) + bouton(290, 210, 90, 'Imprimer')); } },
    { titre: 'Tu as déjà <em>un arbre ?</em>',
      texte: 'Si ta famille a un arbre fait sur Geneanet, Heredis ou un autre logiciel, clique sur « Importer un arbre » : un fichier GEDCOM ou un PDF texte suffit. Tu vérifies tout avant l\'import.',
      astuce: 'Pour voir à quoi ressemble un arbre complet, clique sur « Voir un exemple ».',
      dessin: function () { return svg(carte(70, 40, 280, 220) + '<path d="M180 80 h46 l18 18 v62 h-64 z" fill="#FFF6EC" stroke="' + C + '" stroke-width="1.6"/><path d="M226 80 v18 h18" fill="none" stroke="' + C + '" stroke-width="1.6"/><text x="212" y="140" text-anchor="middle" font-size="11" font-weight="700" fill="' + P + '">GEDCOM</text>' + bouton(130, 190, 160, 'Importer un arbre', true)); } }
  ];

  var css = '' +
    '.tuto-fond{position:fixed;inset:0;z-index:300;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(46,19,56,.55);backdrop-filter:blur(3px)}' +
    '.tuto-fond.ouvert{display:flex}' +
    '.tuto{width:min(1000px,100%);max-height:calc(100vh - 32px);overflow:auto;background:var(--nacre,#FFF9F7);border-radius:26px;box-shadow:0 30px 90px rgba(46,19,56,.35);font-family:var(--texte,"Nunito Sans",sans-serif);color:var(--prune,#6B2F5B)}' +
    '.tuto-tete{display:flex;justify-content:space-between;align-items:center;padding:18px 26px 0}' +
    '.tuto-sur{font-size:.75rem;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--champagne,#B98A55)}' +
    '.tuto-x{border:0;background:none;font-size:1.7rem;line-height:1;color:var(--prune-doux,#8E6383);cursor:pointer;padding:4px 8px;border-radius:10px}' +
    '.tuto-corps{display:grid;grid-template-columns:1fr 1.05fr;gap:28px;align-items:center;padding:18px 34px 26px}' +
    '.tuto-corps h2{font-family:var(--display,"Gilda Display",Georgia,serif);font-weight:400;font-size:clamp(1.8rem,3.6vw,2.6rem);line-height:1.12;margin:0 0 16px}' +
    '.tuto-corps h2 em{font-style:normal;color:var(--champagne,#B98A55)}' +
    '.tuto-texte{font-size:1.02rem;line-height:1.7;margin:0 0 16px;max-width:none}' +
    '.tuto-astuce{border-left:3px solid var(--champagne,#B98A55);background:#FFF6EC;border-radius:0 12px 12px 0;padding:12px 16px;font-size:.92rem;line-height:1.6;color:var(--prune-doux,#8E6383);max-width:none;margin:0}' +
    '.tuto-scene{background:radial-gradient(ellipse at 60% 25%,#FFFCF2,transparent 60%),linear-gradient(135deg,#FCEFF3,#F7E6E8);border-radius:90px 90px 20px 20px;padding:22px 14px 14px}' +
    '.tuto-scene svg{display:block;width:100%;height:auto}' +
    '.tuto-pied{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:16px 26px;border-top:1px solid var(--rose-fonce,#EBCFD5)}' +
    '.tuto-points{display:flex;flex-wrap:wrap;gap:6px}' +
    '.tuto-points button{width:30px;height:30px;border-radius:50%;border:1px solid var(--rose-fonce,#EBCFD5);background:#fff;color:var(--prune,#6B2F5B);font:600 .8rem var(--texte,sans-serif);cursor:pointer}' +
    '.tuto-points button[aria-current="step"]{background:var(--prune,#6B2F5B);border-color:var(--prune,#6B2F5B);color:#fff}' +
    '.tuto-actions{display:flex;gap:8px}' +
    '.tuto-actions .btn{padding:.7rem 1.3rem}' +
    '.tuto-anim{animation:tutoIn .3s ease}@keyframes tutoIn{from{opacity:.3;transform:translateY(6px)}to{opacity:1;transform:none}}' +
    '@media (prefers-reduced-motion:reduce){.tuto-anim{animation:none}}' +
    '@media (max-width:760px){.tuto-corps{grid-template-columns:1fr;padding:12px 20px 20px;gap:18px}.tuto-scene{order:-1;border-radius:60px 60px 18px 18px}.tuto-pied{flex-direction:column;align-items:stretch;padding:14px 18px}.tuto-actions{justify-content:space-between}.tuto-tete{padding:14px 18px 0}}';

  var fond, n = 0, dernierFocus = null;
  function q(s) { return fond.querySelector(s); }
  function construire() {
    if (fond) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    fond = document.createElement('div');
    fond.className = 'tuto-fond';
    fond.innerHTML = '<div class="tuto" role="dialog" aria-modal="true" aria-labelledby="tuto-titre">' +
      '<div class="tuto-tete"><span class="tuto-sur" id="tuto-sur"></span><button type="button" class="tuto-x" aria-label="Fermer le tutoriel">×</button></div>' +
      '<div class="tuto-corps"><div><h2 id="tuto-titre"></h2><p class="tuto-texte" id="tuto-texte"></p><p class="tuto-astuce" id="tuto-astuce"></p></div><div class="tuto-scene" id="tuto-scene"></div></div>' +
      '<div class="tuto-pied"><nav class="tuto-points" aria-label="Étapes du tutoriel"></nav><div class="tuto-actions"><button type="button" class="btn btn-trait" id="tuto-prec">Précédent</button><button type="button" class="btn btn-plein" id="tuto-suiv">Suivant</button></div></div>' +
      '</div>';
    document.body.appendChild(fond);
    var nav = q('.tuto-points');
    ETAPES.forEach(function (e, i) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = i + 1; b.setAttribute('aria-label', 'Étape ' + (i + 1));
      b.addEventListener('click', function () { montrer(i); }); nav.appendChild(b);
    });
    q('.tuto-x').addEventListener('click', fermer);
    q('#tuto-prec').addEventListener('click', function () { montrer(Math.max(0, n - 1)); });
    q('#tuto-suiv').addEventListener('click', function () {
      if (n < ETAPES.length - 1) { montrer(n + 1); return; }
      fermer();
      var vide = document.getElementById('vide'), go = document.getElementById('bt-commencer');
      if (vide && go && getComputedStyle(vide).display !== 'none') go.click();
    });
    fond.addEventListener('click', function (e) { if (e.target === fond) fermer(); });
    document.addEventListener('keydown', function (e) {
      if (!fond.classList.contains('ouvert')) return;
      if (e.key === 'Escape') fermer();
      else if (e.key === 'ArrowRight' && n < ETAPES.length - 1) montrer(n + 1);
      else if (e.key === 'ArrowLeft' && n > 0) montrer(n - 1);
    });
  }
  function montrer(i) {
    n = i; var e = ETAPES[i];
    q('#tuto-sur').textContent = 'Comment ça marche · ' + (i + 1) + ' sur ' + ETAPES.length;
    q('#tuto-titre').innerHTML = e.titre;
    q('#tuto-texte').textContent = e.texte;
    q('#tuto-astuce').textContent = e.astuce;
    q('#tuto-scene').innerHTML = e.dessin();
    q('#tuto-prec').disabled = i === 0;
    q('#tuto-prec').style.visibility = i === 0 ? 'hidden' : 'visible';
    var vide = document.getElementById('vide');
    q('#tuto-suiv').textContent = i === ETAPES.length - 1 ? (vide && getComputedStyle(vide).display !== 'none' ? 'Commencer mon arbre' : 'C\'est parti') : 'Suivant';
    fond.querySelectorAll('.tuto-points button').forEach(function (b, k) { if (k === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
    var c = q('.tuto-corps'); c.classList.remove('tuto-anim'); void c.offsetWidth; c.classList.add('tuto-anim');
  }
  function ouvrir() {
    construire(); dernierFocus = document.activeElement;
    fond.classList.add('ouvert'); document.documentElement.style.overflow = 'hidden';
    montrer(0); q('#tuto-suiv').focus();
    try { localStorage.setItem(CLE, '1'); } catch (e) {}
    if (window.umami) try { window.umami.track('tutoriel-arbre'); } catch (x) {}
  }
  function fermer() {
    if (!fond) return;
    fond.classList.remove('ouvert'); document.documentElement.style.overflow = '';
    if (dernierFocus && dernierFocus.focus) dernierFocus.focus();
  }
  window.GenesoliaTutoriel = { ouvrir: ouvrir, fermer: fermer };

  document.addEventListener('click', function (e) { var t = e.target.closest('#bt-tuto,[data-tuto]'); if (t) { e.preventDefault(); ouvrir(); } });

  /* Première visite avec un arbre vide : ouverture automatique (une seule fois) */
  window.addEventListener('load', function () {
    var vu = false; try { vu = localStorage.getItem(CLE) === '1'; } catch (e) { vu = true; }
    if (vu || /[?&](exemple|apercu)\b/.test(location.search)) return;
    setTimeout(function () {
      var vide = document.getElementById('vide');
      if (vide && getComputedStyle(vide).display !== 'none' && !document.querySelector('.fenetre-fond.ouverte')) ouvrir();
    }, 1200);
  });
})();
