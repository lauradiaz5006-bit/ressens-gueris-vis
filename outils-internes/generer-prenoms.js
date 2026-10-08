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
${P.CSS}.p-psy ul{margin:1rem 0 1rem 1.2rem;display:grid;gap:.6rem}.p-psy p+p{margin-top:.9rem}.p-psy a,.p-faq a{text-decoration-color:var(--champagne);text-underline-offset:3px}.p-faq dt{font-weight:600;margin-top:1.1rem}.p-faq dd{margin:.35rem 0 0;color:var(--prune-doux)}</style>
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

// ---------- Partie familiale (psychogénéalogie) ----------
const GEN = [
  [1915, "de tes arrière-grands-parents, voire d'avant"],
  [1935, "de tes arrière-grands-parents ou de tes grands-parents"],
  [1955, "de tes grands-parents ou de tes parents"],
  [1975, "de tes parents, ou de la tienne"],
  [1995, "de ta génération, celle de tes frères, sœurs et cousin·es"],
  [9999, "des enfants, neveux et nièces d'aujourd'hui"]
];
function epoque(f) {
  const m = f.histoire.match(/années (\d{4})/);
  if (m) return { an: +m[1], txt: `dans les années ${m[1]}` };
  if (/XIXe siècle/.test(f.histoire) && /(porté|donné|popularité|répandu)/.test(f.histoire)) return { an: 1890, txt: 'au XIXe siècle' };
  return null;
}
function lignee(f) {
  const p = esc(f.prenom), e = epoque(f), elle = f.genre === 'm' ? 'il' : f.genre === 'f' ? 'elle' : 'il ou elle';
  let gen = '';
  if (e) {
    const g = GEN.find(([an]) => e.an <= an)[1];
    gen = `<p>Très donné en France ${e.txt}, ${p} est souvent, dans un arbre familial d'aujourd'hui, un prénom de la génération ${g}. Le retrouver dans plusieurs branches de ta famille peut simplement refléter la mode de l'époque : c'est une coïncidence à noter, pas forcément un message.</p>`;
  } else {
    gen = `<p>Quand un prénom revient dans une famille, c'est souvent un choix : en souvenir d'un grand-parent, d'un parrain, d'une marraine ou d'une personne disparue. Si ${p} apparaît plusieurs fois dans ton arbre, la question « qui l'a choisi, et pour qui ? » est souvent parlante.</p>`;
  }
  const v = f.variantes && f.variantes.length ? `<p>Un prénom revient aussi sous d'autres formes. Dans une famille, ${p} peut faire écho à ${f.variantes.length > 1 ? f.variantes.slice(0, -1).map(esc).join(', ') + ' ou ' + esc(f.variantes[f.variantes.length - 1]) : esc(f.variantes[0])}, porté par quelqu'un d'une autre branche, d'une autre région ou d'un autre pays. Pense aussi aux seconds prénoms, souvent oubliés.</p>` : '';
  const fete = f.fete ? `<p>Sa fête tombe le ${esc(f.fete)}. Si une naissance, une union ou un décès de ta famille a eu lieu à cette date, note-le : c'est une piste à regarder, avec prudence, comme l'explique la page sur <a href="syndrome-anniversaire.html">le syndrome d'anniversaire</a>.</p>` : '';
  const html = `
<section class="p-bloc p-psy" id="psychogenealogie"><p class="p-etiq">Psychogénéalogie</p><h2>Le prénom ${p} dans une lignée</h2>
${gen}
${v}
${fete}
<p>En psychogénéalogie, ce qui compte n'est pas le sens du prénom, mais l'histoire de sa transmission. Quatre situations méritent un regard particulier :</p>
<ul>
<li><strong>Le prénom d'un défunt.</strong> Porter le prénom d'une personne disparue peu avant ta naissance, c'est parfois porter un peu de son histoire. Voir <a href="syndrome-du-gisant.html">le syndrome du gisant</a> et <a href="enfant-de-remplacement.html">l'enfant de remplacement</a>.</li>
<li><strong>Le prénom d'un grand-parent.</strong> Une façon d'honorer la lignée, qui peut aussi créer une <a href="loyaute-familiale-invisible.html">loyauté invisible</a> envers cette personne.</li>
<li><strong>Le prénom caché.</strong> Un second ou troisième prénom, rarement utilisé, qui rattache souvent à quelqu'un qu'on ne nomme plus.</li>
<li><strong>Le prénom de rupture.</strong> Choisi au contraire pour ne ressembler à personne, il dit aussi quelque chose de ce que la famille voulait laisser derrière elle.</li>
</ul>
<p>Si tu t'appelles ${p}, ou si ${elle} fait partie de ta famille, tu peux noter dans ton <a href="genosociogramme.html">arbre familial</a> qui l'a porté, à quelle date et à quelle place : l'outil repère automatiquement les prénoms qui reviennent.</p>
</section>`;
  const faq = [[`Que signifie le prénom ${f.prenom} en psychogénéalogie ?`, `La psychogénéalogie s'intéresse moins au sens du prénom (${(t => t.charAt(0).toLowerCase() + t.slice(1))(f.sens.trim().replace(/\.$/, ''))}) qu'à son histoire dans ta famille : qui l'a porté avant toi, s'il a été donné en souvenir d'une personne disparue, et à quelle place il revient d'une génération à l'autre.`]];
  if (e) faq.push([`Le prénom ${f.prenom} était-il courant ?`, `Oui, il a été très donné en France ${e.txt}. Le retrouver plusieurs fois dans un arbre peut donc refléter la mode de l'époque autant qu'une transmission familiale.`]);
  if (f.fete) faq.push([`Quand fête-t-on les ${f.prenom} ?`, `La fête des ${f.prenom} est le ${f.fete}.`]);
  const faqHtml = `
<section class="p-bloc p-faq" id="questions"><p class="p-etiq">Questions</p><h2>Questions sur le prénom ${p}</h2><dl>${faq.map(([q, r]) => `<dt>${esc(q)}</dt><dd>${esc(r)}</dd>`).join('')}</dl></section>`;
  return { html: html + faqHtml, faq };
}

let n = 0;
for (const f of L) {
  const coupe = t => t.length <= 160 ? t : t.slice(0, 158).replace(/[\s,;:]+\S*$/, '') + '…';
  const desc = coupe(`Prénom ${f.prenom} en psychogénéalogie : origine ${f.origine}, signification, ce qu'il porte de ta lignée, son nombre et sa place sur l'arbre de vie.`);
  const LG = lignee(f);
  const ld = JSON.stringify([{ '@context': 'https://schema.org', '@type': 'Article', headline: `Prénom ${f.prenom} en psychogénéalogie : signification et histoire familiale`, description: desc, inLanguage: 'fr', datePublished: '2026-10-07', author: { '@type': 'Organization', name: 'Genesolia' }, publisher: { '@type': 'Organization', name: 'Genesolia' }, url: `https://genesolia.fr/prenoms/${f.slug}.html` }, { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: LG.faq.map(([q, r]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: r } })) }]);
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
${LG.html}
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
