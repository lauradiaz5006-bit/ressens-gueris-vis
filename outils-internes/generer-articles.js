// Génère les articles de outils-internes/articles/*.html (corps de page + en-tête en commentaire).
// En-tête : slug, title, h1, desc (160 caractères max), fil, intro, lecture, theme (psycho | deuil), securite (facultatif).
// Usage : node outils-internes/generer-articles.js
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
`;

const THEMES = {
  psycho: {
    fil: ['psychogenealogie.html', 'Psychogénéalogie'],
    voisins: [['memoire-transgenerationnelle.html', 'Mémoire transgénérationnelle'], ['loyaute-familiale-invisible.html', 'Loyautés invisibles'], ['syndrome-anniversaire.html', "Syndrome d'anniversaire"], ['syndrome-du-gisant.html', 'Syndrome du gisant'], ['enfant-de-remplacement.html', 'Enfant de remplacement'], ['place-dans-la-fratrie.html', 'Place dans la fratrie'], ['peur-de-manquer-d-argent.html', "Peur de manquer d'argent"]],
    note: "Lecture symbolique, pour réfléchir. La psychogénéalogie n'est pas une science : ses interprétations sont des pistes, pas des causes. Si ton histoire familiale te pèse au point de troubler ton quotidien, parles-en à une personne de confiance ou à un·e professionnel·le de l'accompagnement.",
    alire: [['psychogenealogie.html', 'La psychogénéalogie, sans promesse', "Ce qu'elle peut t'apporter, et ses limites, dites honnêtement."], ['heriter.html', 'Comprendre le transgénérationnel', "Mémoire familiale, loyautés, âges-clés : les bases."], ['genosociogramme.html', 'Mon arbre familial', 'Dessine ton génosociogramme : les répétitions sont repérées automatiquement.'], ['methode.html', 'La méthode des deux cycles', 'La racine et le cœur : deux besoins pour comprendre ce qui se répète.'], ['questions-a-poser-a-sa-famille.html', 'Les questions à poser à sa famille', 'Pour retrouver les histoires, les dates et les silences, avec tact.'], ['blessures-de-l-ame.html', "Les 5 blessures de l'âme", 'Rejet, abandon, humiliation, trahison, injustice : un test pour reconnaître la tienne.']]
  },
  deuil: {
    fil: ['blog.html', 'Blog'],
    voisins: [['toussaint-ancetres-et-deuils.html', 'Toussaint et lignée'], ['rever-de-ses-grands-parents-decedes.html', 'Rêver de ses grands-parents'], ['rever-des-morts-et-des-ancetres.html', 'Rêver des morts'], ['syndrome-du-gisant.html', 'Syndrome du gisant'], ['enfant-de-remplacement.html', 'Enfant de remplacement']],
    note: "Lecture symbolique, pour réfléchir. Elle ne prédit rien et ne remplace pas un accompagnement. Si un deuil te pèse au point de troubler ton quotidien, parles-en à une personne de confiance ou à un·e professionnel·le de l'accompagnement.",
    alire: [['rever-des-morts-et-des-ancetres.html', 'Rêver des morts et des ancêtres', "Ce qu'en disent les cultures et Jung, et que faire au réveil."], ['journal-de-reves.html', 'Tenir un journal de rêves', 'La méthode pas à pas, du carnet à la lignée.'], ['genosociogramme.html', 'Mon arbre familial', 'Inscris tes ancêtres et repère ce qui se répète.'], ['questions-a-poser-a-sa-famille.html', 'Les questions à poser à sa famille', 'Pour retrouver les histoires, les dates et les silences, avec tact.'], ['syndrome-anniversaire.html', "Le syndrome d'anniversaire", "Quand une date semble revenir d'une génération à l'autre."], ['le-ciel-du-mois.html', 'Le ciel du mois', 'Lunes, rétrogrades et nombres du mois, avec un geste pour ta famille.']]
  }
};

const dir = __dirname + '/articles/';
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.html'))) {
  const src = fs.readFileSync(dir + f, 'utf8');
  const m = src.match(/^<!--([\s\S]*?)-->\n/);
  const M = Object.fromEntries(m[1].trim().split('\n').map(l => { const i = l.indexOf(':'); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }));
  const T = THEMES[M.theme];
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
  <title>${esc(M.title)} · Genesolia</title>
  <meta name="description" content="${esc(M.desc)}">
  <link rel="canonical" href="https://genesolia.fr/${M.slug}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${esc(M.h1)}">
  <meta property="og:description" content="${esc(M.desc)}">
  <meta property="og:image" content="https://genesolia.fr/assets/formation/${M.theme === 'deuil' ? 'montagne' : 'spirale'}.jpg">
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
</body>
</html>
`;
  fs.writeFileSync(R + M.slug, html);
}
console.log('articles générés');
