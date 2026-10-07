// Génère la page pilier « année personnelle 2027 » et les 9 pages « année personnelle N en 2027 ».
// Usage : node outils-internes/generer-annee-2027.js
// Textes : outils-internes/annees-personnelles-2027.json. Calcul : assets/numerologie.js (même règle que le thème).
const fs = require('fs'), path = require('path'), R = path.join(__dirname, '..') + '/';
global.window = global;
eval(fs.readFileSync(R + 'assets/numerologie.js', 'utf8'));
const N = window.Numerologie, T = JSON.parse(fs.readFileSync(__dirname + '/annees-personnelles-2027.json', 'utf8'));
const AN = 2027, PUB = '2026-10-07';
const MOIS_NOMS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const TITRES = { 1: 'Une année de commencement', 2: 'Une année de patience et de liens', 3: "Une année d'expression", 4: 'Une année de construction', 5: 'Une année de changement', 6: "Une année de foyer et d'engagements", 7: "Une année d'introspection", 8: 'Une année de réalisation', 9: 'Une année de fin de cycle' };
const MOIS_TXT = { 1: "Un mois pour initier : commence ce que tu repousses.", 2: "Un mois pour écouter, coopérer et prendre ton temps.", 3: "Un mois pour t'exprimer, créer et voir du monde.", 4: "Un mois pour t'organiser et avancer pas à pas.", 5: "Un mois pour bouger et accueillir le changement.", 6: "Un mois tourné vers ton foyer et tes proches.", 7: "Un mois pour prendre du recul et te retrouver.", 8: "Un mois pour agir concrètement et oser demander.", 9: "Un mois pour terminer, trier et alléger." };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const red = n => N.reduire(n, false);
const slug = n => `annee-personnelle-${n}-en-${AN}.html`;
const pilier = `annee-personnelle-${AN}.html`;

const CSS = `
    .colonne{width:min(42rem,100% - 2.5rem);margin-inline:auto}
    .colonne p{max-width:none}
    .fil{font-size:.9rem;color:var(--prune-doux);margin-bottom:1.2rem}
    .fil a{color:var(--prune-doux);text-decoration-color:var(--rose-fonce);text-underline-offset:3px}
    .fil span{margin:0 .4rem;color:var(--champagne)}
    .page-tete .publie{margin-top:1.4rem;font-size:.9rem;color:var(--prune-doux)}
    .page-tete .mots{margin-top:.8rem;font-family:var(--display);color:var(--champagne);font-size:1.15rem}
    .article{padding:3.5rem 0 1rem}
    .article h2{margin:3.2rem 0 1rem}
    .article h2:first-child{margin-top:0}
    .article h3{font-size:1.25rem;margin:1.8rem 0 .4rem}
    .article p+p{margin-top:1rem}
    .article a{text-decoration-color:var(--champagne);text-underline-offset:3px}
    .rappel{margin:1.6rem 0;padding:1.2rem 1.4rem;border-left:4px solid var(--champagne);background:#FFF6EC;border-radius:0 16px 16px 0}
    .gestes{margin:1.4rem 0;padding-left:1.2rem;display:grid;gap:.6rem}
    .gestes li::marker{color:var(--champagne)}
    .deux{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:1.6rem 0}
    .deux div{padding:1.3rem 1.3rem 1.2rem;border-radius:16px;border:1px solid var(--rose);background:var(--blanc)}
    .deux .nom{font-family:var(--display);color:var(--champagne)}
    .deux h3{margin:.1rem 0 .5rem}
    .deux p{color:var(--prune-doux);font-size:.97rem}
    .tableau{width:100%;border-collapse:collapse;margin:1.4rem 0;font-size:.97rem}
    .tableau th,.tableau td{padding:.65rem .5rem;border-top:1px solid var(--rose);text-align:left;vertical-align:top}
    .tableau th{font-weight:600;white-space:nowrap}
    .tableau td.n{font-family:var(--display);font-size:1.2rem;color:var(--prune);width:2.5rem;text-align:center}
    .calcul{margin:1.8rem 0;padding:1.6rem;border-radius:var(--rayon);background:linear-gradient(180deg,#FCEFF3,var(--blanc) 80%);border:1px solid var(--rose-fonce)}
    .calcul .champs{display:flex;flex-wrap:wrap;gap:.8rem;align-items:end}
    .calcul label{display:grid;gap:.3rem;font-size:.92rem;color:var(--prune-doux)}
    .calcul select{font:inherit;padding:.6rem .8rem;border-radius:12px;border:1px solid var(--rose-fonce);background:var(--blanc);color:var(--prune)}
    .resultat{margin-top:1.2rem}
    .resultat .chiffre{font-family:var(--display);font-size:3rem;line-height:1;color:var(--prune)}
    .resultat h3{margin:.3rem 0 .4rem}
    .neuf{list-style:none;display:grid;grid-template-columns:repeat(3,1fr);gap:.8rem;margin:1.6rem 0}
    .neuf a{display:block;height:100%;padding:1rem 1.1rem;border:1px solid var(--rose);border-radius:16px;background:var(--blanc);text-decoration:none}
    .neuf a:hover{border-color:var(--prune)}
    .neuf b{display:block;font-family:var(--display);font-weight:400;font-size:1.8rem;color:var(--prune);line-height:1}
    .neuf span{display:block;margin-top:.3rem;color:var(--prune-doux);font-size:.93rem}
    .voisins{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:1rem}
    .voisins a{border:1px solid var(--rose-fonce);border-radius:999px;padding:.3rem .9rem;text-decoration:none;font-size:.95rem;background:var(--blanc)}
    .voisins a[aria-current]{background:var(--prune);color:var(--blanc);border-color:var(--prune)}
    .faq dt{font-weight:600;margin-top:1.4rem}
    .faq dd{margin:.4rem 0 0;color:var(--prune-doux)}
    .article .actions{margin-top:1.6rem;display:flex;flex-wrap:wrap;gap:.6rem}
    .sr-seul{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
    .note-fin{font-size:.93rem;color:var(--prune-doux);margin-top:2.4rem}
    @media (max-width:640px){
      .deux{grid-template-columns:1fr}
      .neuf{grid-template-columns:1fr 1fr}
      .article{padding-top:2.5rem}
      .article .actions .btn{width:100%}
    }`;

function tete(titre, desc, canon, ld) {
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
  <title>${esc(titre)}</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="https://genesolia.fr/${canon}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${esc(titre.replace(' · Genesolia', ''))}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:image" content="https://genesolia.fr/assets/formation/spirale.jpg">
  <link rel="stylesheet" href="assets/site.css">
  <style>${CSS}
  </style>
  <script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body class="nouveau">
  <header data-entete></header>
  <main>
`;
}
const pied = (scripts = '') => `  </main>
  <footer data-pied></footer>
  <script src="assets/site.js"></script>
${scripts}</body>
</html>
`;
const article = (titre, desc, url, faq) => {
  const a = { '@context': 'https://schema.org', '@type': 'Article', headline: titre, description: desc, datePublished: PUB, dateModified: PUB, inLanguage: 'fr', author: { '@type': 'Organization', name: 'Genesolia', url: 'https://genesolia.fr/' }, publisher: { '@type': 'Organization', name: 'Genesolia', url: 'https://genesolia.fr/' }, url: 'https://genesolia.fr/' + url, mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://genesolia.fr/' + url } };
  if (!faq) return a;
  return [a, { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([q, r]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: r.replace(/<[^>]+>/g, '') } })) }];
};
const coupe = t => t.length <= 160 ? t : t.slice(0, 158).replace(/[\s,;:]+\S*$/, '') + '…';

// Exemples de dates de naissance qui donnent n en 2027
function exemples(n) {
  const out = [];
  for (let m = 1; m <= 12 && out.length < 4; m += 3) for (let j = 1; j <= 28; j++) if (N.anneePerso(j, m, AN) === n) { out.push([j, m]); break; }
  return out;
}
const dateTxt = ([j, m]) => `${j === 1 ? '1er' : j} ${MOIS_NOMS[m - 1]}`;
const calculTxt = ([j, m]) => {
  const total = String(j).split('').reduce((a, c) => a + +c, 0) + String(m).split('').reduce((a, c) => a + +c, 0) + 11;
  let txt = `${String(j).split('').join(' + ')} + ${String(m).split('').join(' + ')} + 2 + 0 + 2 + 7 = ${total}`, x = total;
  while (x > 9) { const y = String(x).split('').reduce((a, c) => a + +c, 0); txt += `, puis ${String(x).split('').join(' + ')} = ${y}`; x = y; }
  return txt;
};

const voisins = cur => `<nav class="voisins" aria-label="Les neuf années personnelles">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(k => `<a href="${slug(k)}"${k === cur ? ' aria-current="page"' : ''}>Année ${k}</a>`).join('')}</nav>`;
const aLire = `
    <section class="bloc">
      <div class="conteneur">
        <div class="bloc-tete"><h2>À lire aussi</h2></div>
        <div class="liste-outils">
          <a class="outil" href="theme-numerologique.html"><h3>Ton thème numérologique complet</h3><p>Chemin de vie, expression, nombre héréditaire et année personnelle, calculés gratuitement.</p></a>
          <a class="outil" href="genosociogramme.html?numerologie"><h3>Ta lignée en nombres</h3><p>Les nombres de chaque membre de ta famille, et ceux qui reviennent d'une génération à l'autre.</p></a>
          <a class="outil" href="methode.html"><h3>La méthode des deux cycles</h3><p>La racine et le cœur : deux besoins pour comprendre ce qui se répète.</p></a>
          <a class="outil" href="le-ciel-du-mois.html"><h3>Le ciel du mois</h3><p>Lunes, rétrogrades et nombres du mois, avec un geste pour ta famille.</p></a>
        </div>
      </div>
    </section>
`;

// ---------- Pages 1 à 9 ----------
for (let n = 1; n <= 9; n++) {
  const t = T[n], ex = exemples(n), titre = TITRES[n];
  const avant = n === 1 ? 9 : n - 1, apres = n === 9 ? 1 : n + 1;
  const url = slug(n);
  const h1 = `Année personnelle ${n} en ${AN} : ${titre.charAt(0).toLowerCase() + titre.slice(1)}`;
  const desc = coupe(`Année personnelle ${n} en ${AN} : ${t.mots.replace(/ · /g, ', ')}. Ce que l'année t'apporte en amour, au travail, mois par mois et dans ton histoire familiale.`);
  const mois = MOIS_NOMS.map((nom, i) => { const k = red(n + i + 1); return `<tr><th scope="row">${nom.charAt(0).toUpperCase() + nom.slice(1)}</th><td class="n">${k}</td><td>${esc(MOIS_TXT[k])}</td></tr>`; }).join('\n            ');
  const html = tete(`Année personnelle ${n} en ${AN} : signification, amour, travail · Genesolia`, desc, url, article(h1, desc, url)) + `    <section class="page-tete">
      <div class="colonne">
        <nav class="fil" aria-label="Fil d'Ariane"><a href="blog.html">Blog</a><span aria-hidden="true">/</span><a href="${pilier}">Année personnelle ${AN}</a><span aria-hidden="true">/</span>Année ${n}</nav>
        <h1>${esc(h1)}</h1>
        <p class="intro">${esc(t.intro)}</p>
        <p class="mots">${esc(t.mots)}</p>
        <p class="publie">Publié le 7 octobre 2026 · lecture 6 min</p>
      </div>
    </section>

    <article class="article">
      <div class="colonne">
        <h2>Es-tu en année personnelle ${n} en ${AN} ?</h2>
        <p>L'année personnelle se calcule avec ton jour et ton mois de naissance, auxquels on ajoute l'année en cours. On additionne tous les chiffres, puis on réduit jusqu'à obtenir un nombre de 1 à 9. Ton année de naissance n'entre pas dans le calcul.</p>
        <p>Par exemple, pour une personne née le ${dateTxt(ex[0])} : ${calculTxt(ex[0])}. Sont aussi en année ${n} en ${AN}, parmi d'autres, les personnes nées le ${ex.slice(1, -1).map(dateTxt).join(', le ')} et le ${dateTxt(ex[ex.length - 1])}.</p>
        <div class="actions"><a class="btn btn-trait" href="${pilier}#calcul">Calculer mon année personnelle ${AN}</a></div>

        <h2>Le sens de l'année ${n}</h2>
        ${t.theme.map(p => `<p>${esc(p)}</p>`).join('\n        ')}

        <div class="deux">
          <div><span class="nom">Amour</span><h3>Tes relations en ${AN}</h3><p>${esc(t.amour)}</p></div>
          <div><span class="nom">Travail et argent</span><h3>Tes projets en ${AN}</h3><p>${esc(t.travail)}</p></div>
        </div>

        <h2>Ton année ${n} mois par mois</h2>
        <p>Chaque mois a sa propre couleur : ton mois personnel s'obtient en ajoutant le numéro du mois à ton année personnelle, puis en réduisant. Voici les douze mois de ${AN} pour une année ${n}.</p>
        <table class="tableau">
          <caption class="sr-seul">Mois personnels ${AN} pour une année personnelle ${n}</caption>
          <tbody>
            ${mois}
          </tbody>
        </table>

        <h2>Ce que l'année ${n} réveille dans ton histoire familiale</h2>
        <p>${esc(t.famille)}</p>
        <p class="rappel">${esc(t.cycle)} <a href="methode.html">Découvrir la méthode des deux cycles</a>.</p>
        <p>Pour voir les nombres de ta famille côte à côte, tu peux ajouter tes proches dans <a href="genosociogramme.html?numerologie">ton arbre familial</a> : l'outil affiche le chemin de vie de chacun·e et repère ceux qui reviennent.</p>

        <h2>Un geste pour cette année</h2>
        <p>${esc(t.geste)}</p>
        <h3>Ce qu'il vaut mieux éviter</h3>
        <ul class="gestes">
          ${t.eviter.map(e => `<li>${esc(e)}</li>`).join('\n          ')}
        </ul>
        <p class="rappel"><strong>La question de l'année.</strong> ${esc(t.question)}</p>

        <h2>D'où tu viens, où tu vas</h2>
        <p>En 2026, tu étais en <a href="theme-numerologique.html">année personnelle ${avant}</a> : ${esc(TITRES[avant].charAt(0).toLowerCase() + TITRES[avant].slice(1))}. En 2028, tu entreras en année ${apres} : ${esc(TITRES[apres].charAt(0).toLowerCase() + TITRES[apres].slice(1))}. Les neuf années forment un cycle complet, et chacune prépare la suivante.</p>
        ${voisins(n)}

        <p class="note-fin">La numérologie propose une lecture symbolique, pour réfléchir à ton année et à ton histoire. Elle ne prédit pas l'avenir et ne décide de rien à ta place.</p>
        <div class="actions">
          <a class="btn btn-plein" href="theme-numerologique.html">Calculer mon thème complet</a>
          <a class="btn btn-trait" href="genosociogramme.html?numerologie">Voir les nombres de ma lignée</a>
        </div>
      </div>
    </article>

    <section class="bloc"><div class="conteneur"><div data-cadeau></div></div></section>
${aLire}` + pied();
  fs.writeFileSync(R + url, html);
}

// ---------- Page pilier ----------
const FAQ = [
  ["Quand commence l'année personnelle 2027 ?", "Sur Genesolia, on la compte du 1er janvier au 31 décembre 2027, comme l'année universelle. D'autres numérologues la font commencer à ton anniversaire : les deux lectures existent, choisis celle qui te parle le plus."],
  ["Quelle est l'année universelle 2027 ?", "2 + 0 + 2 + 7 = 11, que l'on réduit à 2. L'année universelle 2027 est donc une année 2 : patience, coopération et liens. Certain·es y voient aussi la couleur du nombre maître 11, plus intuitive."],
  ["Les nombres maîtres 11 et 22 comptent-ils pour l'année personnelle ?", "Ici, l'année personnelle est réduite à un nombre de 1 à 9, comme dans la plupart des méthodes. Si ton calcul passe par 11 ou 22, tu peux lire aussi ce nombre maître comme une nuance de ton année 2 ou 4."],
  ["L'année personnelle prédit-elle ce qui va m'arriver ?", "Non. Elle propose un thème de réflexion pour l'année, pas un destin. Ce que tu vis dépend de tes choix, de ton histoire et des circonstances."]
];
{
  const url = pilier;
  const desc = "Calcule gratuitement ton année personnelle 2027 en numérologie avec ta date de naissance, et découvre ce que signifient les années 1 à 9 pour toi et ta famille.";
  const h1 = `Année personnelle ${AN} : calcule la tienne`;
  const jours = Array.from({ length: 31 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('');
  const moisOpt = MOIS_NOMS.map((m, i) => `<option value="${i + 1}">${m}</option>`).join('');
  const ex = [14, 7];
  const html = tete(`Année personnelle ${AN} : calcul gratuit et signification de 1 à 9 · Genesolia`, desc, url, article(h1, desc, url, FAQ)) + `    <section class="page-tete">
      <div class="colonne">
        <nav class="fil" aria-label="Fil d'Ariane"><a href="blog.html">Blog</a><span aria-hidden="true">/</span>Année personnelle ${AN}</nav>
        <h1>${esc(h1)}</h1>
        <p class="intro">En numérologie, chaque année a sa couleur pour toi : commencer, construire, changer, récolter ou terminer. Calcule ton année personnelle ${AN} en quelques secondes, puis découvre ce qu'elle t'invite à vivre, mois par mois et dans ton histoire familiale.</p>
        <p class="publie">Publié le 7 octobre 2026 · lecture 5 min</p>
      </div>
    </section>

    <article class="article">
      <div class="colonne">
        <h2 id="calcul">Calcule ton année personnelle ${AN}</h2>
        <form class="calcul" id="calcul-annee">
          <div class="champs">
            <label>Jour de naissance<select id="ap-jour" required><option value="">Jour</option>${jours}</select></label>
            <label>Mois de naissance<select id="ap-mois" required><option value="">Mois</option>${moisOpt}</select></label>
            <button class="btn btn-plein" type="submit">Voir mon année</button>
          </div>
          <div class="resultat" id="ap-resultat" aria-live="polite" hidden></div>
          <p class="note-fin" style="margin-top:1rem">Ton année de naissance n'est pas nécessaire. Rien n'est envoyé : le calcul se fait sur ton appareil.</p>
        </form>

        <h2>Comment se calcule l'année personnelle</h2>
        <p>On additionne les chiffres de ton jour de naissance, de ton mois de naissance et de l'année en cours, puis on réduit le total jusqu'à obtenir un nombre de 1 à 9.</p>
        <p>Par exemple, pour une personne née le 14 juillet : ${calculTxt(ex)}. Elle sera en <a href="${slug(red(5 + 7 + 11))}">année personnelle ${red(5 + 7 + 11)}</a> en ${AN}.</p>
        <p class="rappel"><strong>L'année universelle ${AN}.</strong> 2 + 0 + 2 + 7 = 11, réduit à 2. C'est la toile de fond commune à tout le monde : une année de patience, de coopération et de liens, que chacun·e vit à travers sa propre année personnelle.</p>

        <h2>Les neuf années personnelles en ${AN}</h2>
        <p>Les années personnelles forment un cycle de neuf ans : on sème en année 1, on construit, on change, on récolte, puis on trie en année 9 avant de recommencer. Choisis la tienne pour lire sa signification complète.</p>
        <ul class="neuf">
          ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(k => `<li><a href="${slug(k)}"><b>${k}</b><span>${esc(TITRES[k])}</span></a></li>`).join('\n          ')}
        </ul>

        <h2>Ton année personnelle et ta famille</h2>
        <p>Chaque membre de ta famille traverse sa propre année. En ${AN}, ta mère est peut-être en année de fin de cycle pendant que tu commences, ou ton frère en année de construction quand tu as envie de tout changer. Les mettre côte à côte explique parfois des tensions ou des rendez-vous manqués.</p>
        <p>Dans <a href="genosociogramme.html?numerologie">ton arbre familial</a>, l'outil affiche les nombres de chacun·e et repère ceux qui reviennent d'une génération à l'autre. C'est une autre façon de regarder ce qui se transmet, à rapprocher de la <a href="methode.html">méthode des deux cycles</a>.</p>

        <h2>Questions fréquentes</h2>
        <dl class="faq">
          ${FAQ.map(([q, r]) => `<dt>${esc(q)}</dt><dd>${esc(r)}</dd>`).join('\n          ')}
        </dl>

        <p class="note-fin">La numérologie propose une lecture symbolique, pour réfléchir à ton année et à ton histoire. Elle ne prédit pas l'avenir et ne remplace pas un avis professionnel.</p>
        <div class="actions">
          <a class="btn btn-plein" href="theme-numerologique.html">Calculer mon thème complet</a>
          <a class="btn btn-trait" href="genosociogramme.html?numerologie">Voir les nombres de ma lignée</a>
        </div>
      </div>
    </article>

    <section class="bloc"><div class="conteneur"><div data-cadeau></div></div></section>
${aLire}` + pied(`  <script src="assets/numerologie.js"></script>
  <script>
  (function () {
    var T = ${JSON.stringify(TITRES)}, X = ${JSON.stringify(Object.fromEntries([1,2,3,4,5,6,7,8,9].map(k => [k, T[k].intro])))};
    var f = document.getElementById('calcul-annee'), out = document.getElementById('ap-resultat');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var j = +document.getElementById('ap-jour').value, m = +document.getElementById('ap-mois').value;
      if (!j || !m) return;
      var n = window.Numerologie.anneePerso(j, m, ${AN});
      out.hidden = false;
      out.innerHTML = '<p class="chiffre">' + n + '</p><h3>Année personnelle ' + n + ' en ${AN} : ' + T[n].charAt(0).toLowerCase() + T[n].slice(1) + '</h3><p>' + X[n] + '</p><p style="margin-top:1rem"><a class="btn btn-plein" href="annee-personnelle-' + n + '-en-${AN}.html">Lire mon année ' + n + '</a></p>';
    });
  })();
  </script>
`);
  fs.writeFileSync(R + url, html);
}
console.log('10 pages année personnelle générées');
