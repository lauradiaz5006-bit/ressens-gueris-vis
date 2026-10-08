// Génère les pages des nombres maîtres de outils-internes/articles-nombres/*.html (corps de page + en-tête en commentaire).
// En-tête : slug, title, h1, desc (160 caractères max), fil, intro, lecture, calcul (facultatif : ajoute le calculateur du chemin de vie).
// Usage : node outils-internes/generer-nombres-maitres.js
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..') + '/';
const PUB = '2026-10-07';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const base = fs.readFileSync(R + 'schemas-repetitifs-en-amour.html', 'utf8').match(/<style>([\s\S]*?)<\/style>/)[1];
const CSS = base.replace(/\n  $/, '') + `
    .voisins{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:1rem}
    .voisins a{border:1px solid var(--rose-fonce);border-radius:999px;padding:.3rem .9rem;text-decoration:none;font-size:.95rem;background:var(--blanc)}
    .voisins a[aria-current]{background:var(--prune);color:var(--blanc);border-color:var(--prune)}
    .faq dt{font-weight:600;margin-top:1.4rem}
    .faq dd{margin:.4rem 0 0;color:var(--prune-doux)}
    .note-fin{font-size:.93rem;color:var(--prune-doux);margin-top:2.4rem}
    .article .actions{display:flex;flex-wrap:wrap;gap:.6rem}
    .trois{display:grid;grid-template-columns:repeat(3,1fr);gap:.8rem;margin:1.6rem 0}
    .trois a{display:block;padding:1.1rem 1.2rem;border:1px solid var(--rose);border-radius:16px;background:var(--blanc);text-decoration:none}
    .trois a:hover{border-color:var(--prune)}
    .trois b{display:block;font-family:var(--display);font-weight:400;font-size:2.2rem;line-height:1;color:var(--prune)}
    .trois strong{display:block;margin-top:.4rem}
    .trois span{display:block;margin-top:.2rem;color:var(--prune-doux);font-size:.93rem}
    .tableau{width:100%;border-collapse:collapse;margin:1.4rem 0;font-size:.95rem}
    .tableau th,.tableau td{padding:.7rem .5rem;border-top:1px solid var(--rose);text-align:left;vertical-align:top}
    .tableau thead th{font-weight:600;color:var(--prune-doux);font-size:.88rem;border-top:0}
    .defile{overflow-x:auto}
    .calcul{margin:1.8rem 0;padding:1.6rem;border-radius:var(--rayon);background:linear-gradient(180deg,#FCEFF3,var(--blanc) 80%);border:1px solid var(--rose-fonce);display:flex;flex-wrap:wrap;gap:.8rem;align-items:end}
    .calcul label{display:grid;gap:.3rem;font-size:.92rem;color:var(--prune-doux)}
    .calcul input{font:inherit;padding:.6rem .8rem;border-radius:12px;border:1px solid var(--rose-fonce);background:var(--blanc);color:var(--prune)}
    .calcul .resultat,.calcul .note{flex-basis:100%}
    .resultat .chiffre{font-family:var(--display);font-size:3rem;line-height:1;color:var(--prune)}
    @media (max-width:640px){.trois{grid-template-columns:1fr}}
`;
const SCRIPT_CALCUL = `  <script src="assets/numerologie.js"></script>
  <script>
  (function () {
    var N = window.Numerologie, f = document.getElementById('calcul-maitre'), out = document.getElementById('nm-resultat');
    var PAGE = { 11: 'nombre-maitre-11.html', 22: 'nombre-maitre-22.html', 33: 'nombre-maitre-33.html' };
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = document.getElementById('nm-date').value; if (!d) return;
      var c = d.replace(/\\D/g, '').split(''), total = c.reduce(function (a, x) { return a + +x; }, 0), n = N.reduire(total, true);
      var t = N.NOMBRES[n], etapes = c.join(' + ') + ' = ' + total, x = total;
      while (x > 9 && [11, 22, 33].indexOf(x) < 0) { var y = String(x).split('').reduce(function (a, k) { return a + +k; }, 0); etapes += ', puis ' + String(x).split('').join(' + ') + ' = ' + y; x = y; }
      out.hidden = false;
      out.innerHTML = '<p class="chiffre">' + n + '</p><p><strong>Chemin de vie ' + n + (t ? ' · ' + t.nom : '') + '</strong></p><p>' + etapes + '.</p>' +
        (PAGE[n] ? '<p style="margin-top:.8rem">C\\'est un nombre maître. <a href="' + PAGE[n] + '">Lire tout sur le ' + n + '</a>.</p>' : '<p style="margin-top:.8rem">Ce n\\'est pas un nombre maître. Ton <a href="theme-numerologique.html">thème complet</a> peut en contenir ailleurs, dans ton nom.</p>');
    });
  })();
  </script>
`;

const T = {
  fil: ['theme-numerologique.html', 'Numérologie'],
  voisins: [['nombres-maitres.html', 'Les nombres maîtres'], ['nombre-maitre-11.html', 'Le 11'], ['nombre-maitre-22.html', 'Le 22'], ['nombre-maitre-33.html', 'Le 33'], ['annee-personnelle-2027.html', 'Année personnelle 2027']],
  note: "La numérologie propose une lecture symbolique, pour réfléchir à ton histoire. Elle ne prédit pas l'avenir et ne remplace pas un avis professionnel.",
  alire: [['theme-numerologique.html', 'Ton thème numérologique complet', 'Chemin de vie, expression, nombre intime, nombre héréditaire : tous tes nombres, gratuitement.'], ['genosociogramme.html?numerologie', 'Ta lignée en nombres', "Les nombres de chaque membre de ta famille, et ceux qui reviennent d'une génération à l'autre."], ['annee-personnelle-2027.html', 'Ton année personnelle 2027', 'Calcule ton année et découvre ce qu\'elle t\'invite à vivre.'], ['ton-prenom.html', 'Ce que porte ton prénom', 'Son origine, son nombre et sa place sur l\'arbre de vie.'], ['methode.html', 'La méthode des deux cycles', 'La racine et le cœur : deux besoins pour comprendre ce qui se répète.']]
};

const dir = __dirname + '/articles-nombres/';
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.html'))) {
  const src = fs.readFileSync(dir + f, 'utf8');
  const m = src.match(/^<!--([\s\S]*?)-->\n/);
  const M = Object.fromEntries(m[1].trim().split('\n').map(l => { const i = l.indexOf(':'); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }));
  if ([...M.desc].length > 160) throw new Error('description trop longue : ' + M.slug + ' (' + [...M.desc].length + ')');
  const corps = src.slice(m[0].length);
  const faq = [...corps.matchAll(/<dt>([^<]*)<\/dt><dd>([^<]*)<\/dd>/g)].map(x => [x[1], x[2]]);
  const art = { '@context': 'https://schema.org', '@type': 'Article', headline: M.h1, description: M.desc, datePublished: PUB, dateModified: PUB, inLanguage: 'fr', author: { '@type': 'Organization', name: 'Genesolia', url: 'https://genesolia.fr/' }, publisher: { '@type': 'Organization', name: 'Genesolia', url: 'https://genesolia.fr/' }, url: 'https://genesolia.fr/' + M.slug, mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://genesolia.fr/' + M.slug } };
  const ld = faq.length ? [art, { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([q, r]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: r } })) }] : art;
  const html = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <link rel="icon" href="/favicon.ico" sizes="48x48">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <meta name="theme-color" content="#6B2F5B">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(M.title)}${M.title.length <= 50 ? ' · Genesolia' : ''}</title>
  <meta name="description" content="${esc(M.desc)}">
  <link rel="canonical" href="https://genesolia.fr/${M.slug}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${esc(M.h1)}">
  <meta property="og:description" content="${esc(M.desc)}">
  <meta property="og:image" content="https://genesolia.fr/assets/formation/spirale.jpg">
  <link rel="stylesheet" href="assets/site.css">
  <style>${CSS}  </style>
  <script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body class="nouveau">
  <header data-entete></header>
  <main>
    <section class="page-tete">
      <div class="colonne">
        <nav class="fil" aria-label="Fil d'Ariane"><a href="${T.fil[0]}">${esc(T.fil[1])}</a><span aria-hidden="true">/</span>${esc(M.fil)}</nav>
        <h1>${esc(M.h1)}</h1>
        <p class="intro">${esc(M.intro)}</p>
        <p class="publie">Publié le 7 octobre 2026 · lecture ${M.lecture} min</p>
      </div>
    </section>

    <article class="article">
      <div class="colonne">
${corps}
        <p class="note-fin">${esc(T.note)}</p>
        <nav class="voisins" aria-label="Dans la même série">${T.voisins.map(([u, l]) => `<a href="${u}"${u === M.slug ? ' aria-current="page"' : ''}>${esc(l)}</a>`).join('')}</nav>
      </div>
    </article>

    <section class="bloc"><div class="conteneur"><div data-cadeau></div></div></section>

    <section class="bloc">
      <div class="conteneur">
        <div class="bloc-tete"><h2>À lire aussi</h2></div>
        <div class="liste-outils">
          ${T.alire.filter(([u]) => u !== M.slug).slice(0, 6).map(([u, h, p]) => `<a class="outil" href="${u}"><h3>${esc(h)}</h3><p>${esc(p)}</p></a>`).join('\n          ')}
        </div>
      </div>
    </section>
  </main>
  <footer data-pied></footer>
  <script src="assets/site.js"></script>
${M.calcul ? SCRIPT_CALCUL : ''}</body>
</html>
`;
  fs.writeFileSync(R + M.slug, html);
}
console.log('pages nombres maîtres générées');
