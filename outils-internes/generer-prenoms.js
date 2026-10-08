const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..') + '/';
global.window = global;
for (const f of ['numerologie.js', 'guematrie.js', 'prenoms.js', 'prenom-lecture.js']) eval(fs.readFileSync(R + 'assets/' + f, 'utf8'));
const P = window.PrenomLecture, L = window.PRENOMS, esc = P.esc;
const tete = (titre, desc, canon, extra) => `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <base href="/">
  <link rel="icon" href="/favicon.ico" sizes="48x48">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <meta name="theme-color" content="#6B2F5B">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(titre)}</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="https://genesolia.fr/${canon}">
  <meta property="og:title" content="${esc(titre)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:image" content="https://genesolia.fr/assets/formation/spirale.jpg">
  <link rel="stylesheet" href="assets/site.css">
  <style>.fil{font-size:.9rem;color:var(--prune-doux);margin-bottom:1.2rem}.fil a{color:var(--prune-doux)}.fil span{margin:0 .4rem;color:var(--champagne)}.voisins{display:flex;flex-wrap:wrap;gap:.4rem}.voisins a{border:1px solid var(--rose-fonce);border-radius:999px;padding:.3rem .8rem;text-decoration:none;font-size:.9rem;background:var(--blanc)}.voisins a:hover{border-color:var(--prune)}.lettres-az{display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:1.6rem}.lettres-az a{width:2.2rem;height:2.2rem;display:grid;place-items:center;border-radius:50%;border:1px solid var(--rose-fonce);text-decoration:none;background:var(--blanc)}.groupe{margin-bottom:1.8rem}.groupe h2{font-size:1.6rem;margin-bottom:.6rem}.groupe ul{list-style:none;columns:4 10rem;gap:1.2rem}.groupe li a{display:block;padding:.2rem 0;text-decoration:none}.groupe li a:hover{color:var(--champagne)}.groupe li small{color:var(--prune-doux)}
${P.CSS}</style>
${extra || ''}
</head>
<body class="nouveau">
  <header data-entete></header>
  <main>`;
const pied = `  </main>
  <footer data-pied></footer>
  <script src="assets/site.js"></script>
</body>
</html>
`;
let n = 0;
for (const f of L) {
  const coupe = t => t.length <= 160 ? t : t.slice(0, 158).replace(/[\s,;:]+\S*$/, '') + '…';
  const desc = coupe(`Prénom ${f.prenom} en psychogénéalogie : origine ${f.origine}, signification, ce qu'il porte de ta lignée, son nombre et sa place sur l'arbre de vie.`);
  const ld = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: `Prénom ${f.prenom} en psychogénéalogie : signification et histoire familiale`, description: desc, inLanguage: 'fr', datePublished: '2026-10-07', author: { '@type': 'Organization', name: 'Genesolia' }, publisher: { '@type': 'Organization', name: 'Genesolia' }, url: `https://genesolia.fr/prenoms/${f.slug}.html` });
  const memeLettre = L.filter(x => x.slug[0] === f.slug[0] && x.slug !== f.slug).slice(0, 18);
  const titreCourt = `Prénom ${f.prenom} : signification, origine et histoire familiale`.length <= 62 ? `Prénom ${f.prenom} : signification, origine et histoire familiale` : `Prénom ${f.prenom} : signification et histoire familiale`;
  const fil = JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://genesolia.fr/' }, { '@type': 'ListItem', position: 2, name: 'Prénoms', item: 'https://genesolia.fr/prenoms.html' }, { '@type': 'ListItem', position: 3, name: `Le prénom ${f.prenom} en psychogénéalogie`, item: `https://genesolia.fr/prenoms/${f.slug}.html` }] });
  const html = tete(titreCourt, desc, `prenoms/${f.slug}.html`, `  <script type="application/ld+json">${ld}</script>\n  <script type="application/ld+json">${fil}</script>`) + `
    <section class="page-tete"><div class="conteneur">
      <nav class="fil" aria-label="Fil d'Ariane"><a href="ton-prenom.html">Prénoms</a><span aria-hidden="true">/</span><a href="prenoms.html">De A à Z</a><span aria-hidden="true">/</span>${esc(f.prenom)}</nav>
      <h1>Le prénom ${esc(f.prenom)} en psychogénéalogie</h1>
      <p class="intro">Origine, signification et histoire du prénom ${esc(f.prenom)}, son nombre en numérologie et sa place sur l'arbre de vie, pour comprendre ce qu'il porte de ton histoire familiale.</p>
    </div></section>
    <section class="bloc"><div class="conteneur">
${P.html(f.prenom, { fiche: f })}
${P.ORIGINE}
      <div class="p-bloc"><p class="p-etiq">Et ton prénom à toi ?</p><h2>Lire un autre prénom</h2><p>La lecture fonctionne pour tous les prénoms, même les plus rares.</p><div class="p-actions" style="margin-bottom:1.4rem"><a class="btn btn-plein" href="ton-prenom.html">Découvrir mon prénom</a><a class="btn btn-trait" href="prenoms.html">Tous les prénoms</a></div>
      ${memeLettre.length ? `<p class="p-note" style="margin-bottom:.6rem">D'autres prénoms en ${f.slug[0].toUpperCase()} :</p><div class="voisins">${memeLettre.map(x => `<a href="prenoms/${x.slug}.html">${esc(x.prenom)}</a>`).join('')}</div>` : ''}</div>
    </div></section>
` + pied;
  fs.writeFileSync(R + `prenoms/${f.slug}.html`, html); n++;
}
// Index A à Z
const lettres = [...new Set(L.map(x => x.slug[0].toUpperCase()))];
const idx = tete('Signification des prénoms de A à Z : origine et histoire', `L'origine, la signification et l'histoire de ${L.length} prénoms parmi les plus portés en France, avec leur nombre et leur place sur l'arbre de vie.`, 'prenoms.html', `  <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://genesolia.fr/' }, { '@type': 'ListItem', position: 2, name: 'Prénoms', item: 'https://genesolia.fr/prenoms.html' }] })}</script>`) + `
    <section class="page-tete"><div class="conteneur">
      <nav class="fil" aria-label="Fil d'Ariane"><a href="ton-prenom.html">Prénoms</a><span aria-hidden="true">/</span>De A à Z</nav>
      <h1>Les prénoms de A à Z</h1>
      <p class="intro">L'origine, la signification et l'histoire de ${L.length} prénoms parmi les plus portés en France. Ton prénom n'y est pas ? La lecture fonctionne pour tous : <a href="ton-prenom.html">découvre ton prénom</a>.</p>
    </div></section>
    <section class="bloc"><div class="conteneur">
      <nav class="lettres-az" aria-label="Aller à une lettre">${lettres.map(l => `<a href="prenoms.html#l-${l}">${l}</a>`).join('')}</nav>
      ${lettres.map(l => `<div class="groupe" id="l-${l}"><h2>${l}</h2><ul>${L.filter(x => x.slug[0].toUpperCase() === l).map(x => `<li><a href="prenoms/${x.slug}.html">${esc(x.prenom)} <small>${esc(x.origine)}</small></a></li>`).join('')}</ul></div>`).join('')}
    </div></section>
` + pied;
fs.writeFileSync(R + 'prenoms.html', idx.replace('  <base href="/">\n', ''));
console.log('pages', n);
// Plan du site : on remplace toutes les entrées prenoms/ par la liste à jour
const smPath = R + 'sitemap.xml';
let sm = fs.readFileSync(smPath, 'utf8');
sm = sm.replace(/  <url>\n    <loc>https:\/\/genesolia\.fr\/prenoms\/[^<]+<\/loc>\n(?:    <[^\n]+\n)*?  <\/url>\n\n?/g, '');
const jour = new Date().toISOString().slice(0, 10);
sm = sm.replace('</urlset>', L.map(f => `  <url>\n    <loc>https://genesolia.fr/prenoms/${f.slug}.html</loc>\n    <lastmod>${jour}</lastmod>\n    <priority>0.60</priority>\n  </url>\n\n`).join('') + '</urlset>');
fs.writeFileSync(smPath, sm);
console.log('sitemap : ' + (sm.match(/\/prenoms\//g) || []).length + ' prénoms');
