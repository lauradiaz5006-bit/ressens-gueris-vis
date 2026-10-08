// Génère les pages des blessures de l'âme :
//  - 5 pages par blessure à partir de outils-internes/blessures.json
//  - les articles de outils-internes/blessures-articles/*.html (corps de page + en-tête en commentaire)
// Usage : node outils-internes/generer-blessures.js
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..') + '/';
const B = JSON.parse(fs.readFileSync(__dirname + '/blessures.json', 'utf8'));
const PUB = '2026-10-07';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Styles : ceux des articles du blog, plus tableaux et encadrés
const base = fs.readFileSync(R + 'schemas-repetitifs-en-amour.html', 'utf8').match(/<style>([\s\S]*?)<\/style>/)[1];
const CSS = base.replace(/\n  $/, '') + `
    .tableau{width:100%;border-collapse:collapse;margin:1.4rem 0;font-size:.95rem}
    .tableau th,.tableau td{padding:.7rem .5rem;border-top:1px solid var(--rose);text-align:left;vertical-align:top}
    .tableau thead th{font-weight:600;color:var(--prune-doux);font-size:.88rem;border-top:0}
    .tableau tbody th{font-weight:600}
    .defile{overflow-x:auto}
    .comparer{min-width:34rem}
    .phase{padding:1.4rem 1.4rem 1.2rem;border-radius:16px;border:1px solid var(--rose);background:var(--blanc);margin:1.4rem 0}
    .phase .nom{font-family:var(--display);color:var(--champagne)}
    .phase h2,.phase h3{margin:.1rem 0 .6rem!important}
    .phase p{color:var(--prune-doux)}
    .phase p+p{margin-top:.7rem}
    .phase .question{color:var(--prune)}
    .b-cycle{font-family:var(--display);color:var(--champagne);font-size:1.1rem;margin-top:.8rem}
    .voisins{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:1rem}
    .voisins a{border:1px solid var(--rose-fonce);border-radius:999px;padding:.3rem .9rem;text-decoration:none;font-size:.95rem;background:var(--blanc)}
    .voisins a[aria-current]{background:var(--prune);color:var(--blanc);border-color:var(--prune)}
    .faq dt{font-weight:600;margin-top:1.4rem}
    .faq dd{margin:.4rem 0 0;color:var(--prune-doux)}
    .note-fin{font-size:.93rem;color:var(--prune-doux);margin-top:2.4rem}
    .article .actions{display:flex;flex-wrap:wrap;gap:.6rem}
`;

const SECURITE = `
        <div class="encart securite" role="note">
          <svg viewBox="0 0 36 36" aria-hidden="true"><path d="M18 3l12 4.5v9c0 7.6-5.1 13.6-12 16.5C11.1 30.1 6 24.1 6 16.5v-9z" fill="none" stroke="#F3DCC0" stroke-width="1.6" stroke-linejoin="round"/><path d="M18 11v8M18 23.5v.5" stroke="#F3DCC0" stroke-width="2" stroke-linecap="round"/></svg>
          <p><strong>Si une relation te met en danger, ce n'est pas une blessure à comprendre.</strong> C'est une situation dont il faut te protéger, et tu n'as pas à le faire seul·e. En France, tu peux appeler le 3919, gratuit et anonyme, ou le 17 en urgence. Au Québec, en cas d'urgence, compose le 911.</p>
        </div>
`;

const BLESSURES = ['rejet', 'abandon', 'humiliation', 'trahison', 'injustice'];
const NOMS = { rejet: 'Rejet', abandon: 'Abandon', humiliation: 'Humiliation', trahison: 'Trahison', injustice: 'Injustice' };
const voisins = cur => `<nav class="voisins" aria-label="Les cinq blessures">${BLESSURES.map(k => `<a href="${B[k].slug}"${k === cur ? ' aria-current="page"' : ''}>${NOMS[k]}</a>`).join('')}<a href="masques-des-5-blessures.html"${cur === 'masques' ? ' aria-current="page"' : ''}>Les 5 masques</a><a href="blessure-rejet-ou-abandon.html"${cur === 'comparatif' ? ' aria-current="page"' : ''}>Rejet ou abandon ?</a></nav>`;

const aLire = `
    <section class="bloc">
      <div class="conteneur">
        <div class="bloc-tete"><h2>À lire aussi</h2></div>
        <div class="liste-outils">
          <a class="outil" href="blessures-de-l-ame.html"><h3>Le test des 5 blessures</h3><p>Coche les phrases qui te ressemblent et vois quelle blessure ressort, gratuitement.</p></a>
          <a class="outil" href="masques-des-5-blessures.html"><h3>Les 5 masques</h3><p>Fuyant, dépendant, masochiste, contrôlant, rigide : ce que chaque masque protège.</p></a>
          <a class="outil" href="blessure-rejet-ou-abandon.html"><h3>Rejet ou abandon ?</h3><p>La différence en un tableau, et le comparatif des cinq blessures.</p></a>
          <a class="outil" href="methode.html"><h3>La méthode des deux cycles</h3><p>La racine et le cœur : deux besoins pour comprendre ce qui se répète.</p></a>
          <a class="outil" href="genosociogramme.html"><h3>Mon arbre familial</h3><p>Dessine ton génosociogramme et repère ce qui se répète dans ta lignée.</p></a>
          <a class="outil" href="schemas-repetitifs-en-amour.html"><h3>Schémas répétitifs en amour</h3><p>Ce qui se rejoue d'une relation à l'autre, et ce que ta famille peut éclairer.</p></a>
        </div>
      </div>
    </section>
`;

function page({ slug, title, h1, desc, fil, intro, lecture, corps, faq, extraIntro = '' }) {
  const art = { '@context': 'https://schema.org', '@type': 'Article', headline: h1, description: desc, datePublished: PUB, dateModified: PUB, inLanguage: 'fr', author: { '@type': 'Organization', name: 'Genesolia', url: 'https://genesolia.fr/' }, publisher: { '@type': 'Organization', name: 'Genesolia', url: 'https://genesolia.fr/' }, url: 'https://genesolia.fr/' + slug, mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://genesolia.fr/' + slug } };
  const ld = faq ? [art, { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([q, r]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: r } })) }] : art;
  if (desc.length > 160) throw new Error('description trop longue : ' + slug + ' (' + desc.length + ')');
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <link rel="icon" href="/favicon.ico" sizes="48x48">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <meta name="theme-color" content="#6B2F5B">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}${title.length <= 50 ? ' · Genesolia' : ''}</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="https://genesolia.fr/${slug}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${esc(h1)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:image" content="https://genesolia.fr/assets/formation/montagne.jpg">
  <link rel="stylesheet" href="assets/site.css">
  <style>${CSS}  </style>
  <script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body class="nouveau">
  <header data-entete></header>
  <main>
    <section class="page-tete">
      <div class="colonne">
        <nav class="fil" aria-label="Fil d'Ariane"><a href="blessures-de-l-ame.html">Les blessures de l'âme</a><span aria-hidden="true">/</span>${esc(fil)}</nav>
        <h1>${esc(h1)}</h1>
        <p class="intro">${esc(intro)}</p>${extraIntro}
        <p class="publie">Publié le 7 octobre 2026 · lecture ${lecture} min</p>
      </div>
    </section>

    <article class="article">
      <div class="colonne">
${corps}
        <p class="note-fin">Lecture symbolique, pour réfléchir. Le modèle des cinq blessures n'est pas une théorie scientifique. Si une blessure ancienne te pèse au point de troubler ton quotidien, parles-en à une personne de confiance ou à un·e professionnel·le de l'accompagnement.</p>
        ${voisins(slug === 'masques-des-5-blessures.html' ? 'masques' : slug === 'blessure-rejet-ou-abandon.html' ? 'comparatif' : Object.keys(B).find(k => B[k].slug === slug))}
      </div>
    </article>

    <section class="bloc"><div class="conteneur"><div data-cadeau></div></div></section>
${aLire}  </main>
  <footer data-pied></footer>
  <script src="assets/site.js"></script>
</body>
</html>
`;
}

const faqHtml = faq => `
        <h2>Questions fréquentes</h2>
        <dl class="faq">
          ${faq.map(([q, r]) => `<dt>${esc(q)}</dt><dd>${esc(r)}</dd>`).join('\n          ')}
        </dl>`;

// ---------- 5 pages par blessure ----------
const LIENS_AMOUR = { abandon: ['la blessure d\'abandon et la relation amoureuse', 'blessure-abandon-relation-amoureuse.html'], trahison: ['la blessure de trahison et la relation amoureuse', 'blessure-trahison-relation-amoureuse.html'] };
for (const k of BLESSURES) {
  const b = B[k], Art = b.article.charAt(0).toUpperCase() + b.article.slice(1), Bl = 'Blessure ' + b.de;
  let amour = esc(b.amour);
  if (LIENS_AMOUR[k]) amour = amour.replace(esc(LIENS_AMOUR[k][0]), `<a href="${LIENS_AMOUR[k][1]}">${esc(LIENS_AMOUR[k][0])}</a>`);
  const corps = `        <h2>Qu'est-ce que ${esc(b.article)} ?</h2>
        ${b.definition.map(p => `<p>${esc(p)}</p>`).join('\n        ')}
        <p>Elle fait partie des cinq blessures de l'âme décrites par Lise Bourbeau dans <em>Les cinq blessures qui empêchent d'être soi-même</em>. Sur Genesolia, nous la relions au <a href="methode.html">cycle ${b.cycle === 1 ? 'de la racine' : 'du cœur'}</a> : ${b.cycle === 1 ? 'la sécurité, la place, le droit d\'exister' : 'aimer, être aimé·e, faire confiance'}.</p>

        <h2>Les signes de ${esc(b.article)}</h2>
        <p>Ce ne sont pas des preuves, mais des réactions qui reviennent. Coche celles qui te ressemblent.</p>
        <div class="cocher">
          <p class="titre">Ce qui te ressemble</p>
          <ul>
            ${b.signes.map(s => `<li><label><input type="checkbox"> ${esc(s)}</label></li>`).join('\n            ')}
          </ul>
          <p class="note">Plusieurs cases cochées ne disent rien de définitif sur toi. Elles indiquent seulement où regarder. Pour comparer avec les autres blessures, fais <a href="blessures-de-l-ame.html">le test des 5 blessures</a>.</p>
        </div>

        <h2>${esc(b.masqueArt.charAt(0).toUpperCase() + b.masqueArt.slice(1))}</h2>
        ${b.masqueTxt.map(p => `<p>${esc(p)}</p>`).join('\n        ')}
        <p><a href="masques-des-5-blessures.html#${b.masque.normalize('NFD').replace(/[̀-ͯ]/g, '')}">Les cinq masques, comparés</a>.</p>

        <h2>${esc(b.parentTitre || Bl + ' : quel parent ?')}</h2>
        <p>${esc(b.parent)}</p>

        <h2>${esc(Art)} dans ton histoire familiale</h2>
        <p>${esc(b.famille.texte)}</p>
        <ul class="pistes">
          ${b.famille.pistes.map(([t, s]) => `<li><strong>${esc(t)}</strong><span>${esc(s)}</span></li>`).join('\n          ')}
        </ul>
        <p>Dans ton <a href="genosociogramme.html">arbre familial</a>, tu peux noter ces événements : l'outil fait apparaître ce qui revient d'une génération à l'autre.</p>

        <div class="deux">
          <div><span class="nom">En amour</span><h3>${esc(Bl)} et relation amoureuse</h3><p>${amour}</p></div>
          <div><span class="nom">Au travail</span><h3>${esc(Bl)} au travail</h3><p>${esc(b.travail)}</p></div>
        </div>
${b.colere ? `
        <h2>Blessure d'injustice et colère</h2>
        ${b.colere.map(p => `<p>${esc(p)}</p>`).join('\n        ')}
` : ''}
        <h2>Des petits pas pour commencer</h2>
        <p>Une blessure ne se referme pas d'un coup. Elle cesse peu à peu de décider à ta place, à force de petits gestes différents.</p>
        <ul class="gestes">
          ${b.pas.map(p => `<li>${esc(p)}</li>`).join('\n          ')}
        </ul>
        <p class="rappel"><strong>La question de ${esc(b.article)}.</strong> « ${esc(b.question)} » Te la poser, c'est déjà commencer à y répondre autrement.</p>
${faqHtml(b.faq)}
        <div class="actions">
          <a class="btn btn-plein" href="blessures-de-l-ame.html">Faire le test des 5 blessures</a>
          <a class="btn btn-trait" href="genosociogramme.html">Dessiner mon arbre familial</a>
        </div>
`;
  const extra = `\n        <p class="b-cycle">Cycle ${b.cycle} · ${b.cycle === 1 ? 'La racine' : 'Le cœur'} · « ${esc(b.question)} »</p>`;
  fs.writeFileSync(R + b.slug, page({ slug: b.slug, title: b.title, h1: b.h1, desc: b.desc, fil: Bl, intro: b.intro, lecture: 7, corps, faq: b.faq, extraIntro: extra }));
}

// ---------- Articles ----------
const dir = __dirname + '/blessures-articles/';
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.html'))) {
  const src = fs.readFileSync(dir + f, 'utf8');
  const m = src.match(/^<!--([\s\S]*?)-->\n/);
  const meta = Object.fromEntries(m[1].trim().split('\n').map(l => { const i = l.indexOf(':'); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }));
  let corps = src.slice(m[0].length);
  if (meta.securite) corps = corps.replace(/(\n\s*<div class="actions">)(?![\s\S]*<div class="actions">)/, SECURITE + '$1');
  // FAQ éventuelle : <dl class="faq"> dans le corps
  const faq = [...corps.matchAll(/<dt>([^<]*)<\/dt><dd>([^<]*)<\/dd>/g)].map(x => [x[1], x[2]]);
  fs.writeFileSync(R + meta.slug, page({ slug: meta.slug, title: meta.title, h1: meta.h1, desc: meta.desc, fil: meta.fil, intro: meta.intro, lecture: meta.lecture, corps, faq: faq.length ? faq : null }));
}
console.log('pages blessures générées');
