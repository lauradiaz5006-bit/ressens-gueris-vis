import re, json, html
src = open('annee-personnelle-1-en-2027.html', encoding='utf8').read()
css = re.search(r'<style>(.*?)</style>', src, re.S).group(1)
css += """    .periodes{width:100%;border-collapse:collapse;margin:1.4rem 0;font-size:.95rem}
    .periodes th,.periodes td{padding:.7rem .5rem;border-top:1px solid var(--rose);text-align:left;vertical-align:top}
    .periodes thead th{font-weight:600;color:var(--prune-doux);font-size:.88rem;border-top:0}
    .periodes small{display:block;color:var(--prune-doux)}
    .defile{overflow-x:auto}
    .phase{padding:1.4rem 1.4rem 1.2rem;border-radius:16px;border:1px solid var(--rose);background:var(--blanc);margin:1.4rem 0}
    .phase .nom{font-family:var(--display);color:var(--champagne)}
    .phase h3{margin:.1rem 0 .6rem}
    .phase p{color:var(--prune-doux)}
    .phase .question{margin-top:.8rem;color:var(--prune)}
"""
URL = 'mercure-retrograde-2027.html'
titre = 'Mercure rétrograde 2027 : dates, heures et signification · Genesolia'
h1 = 'Mercure rétrograde 2027 : les dates et leur signification'
desc = "Mercure rétrograde 2027 : les trois périodes (février, juin, octobre), heures de Paris et du Québec, phases d'ombre et lecture symbolique pour ta famille."
assert len(desc) <= 160, len(desc)
FAQ = [
 ("Combien de fois Mercure est-il rétrograde en 2027 ?", "Trois fois : du 9 février au 3 mars, du 10 juin au 4 juillet et du 7 au 28 octobre 2027. C'est le rythme habituel de Mercure, qui semble reculer environ trois fois par an, pendant trois semaines."),
 ("Quand est le prochain Mercure rétrograde après 2027 ?", "Le suivant commence le 24 janvier 2028, en Verseau. Avant 2027, la dernière période a lieu du 24 octobre au 13 novembre 2026, en Scorpion."),
 ("Faut-il éviter de signer un contrat pendant Mercure rétrograde ?", "Rien ne l'interdit. La tradition astrologique invite simplement à relire deux fois, à vérifier les détails et à prendre le temps de la réflexion. Une décision bien préparée reste une décision bien préparée."),
 ("Mercure recule-t-il vraiment ?", "Non. C'est un effet de perspective : vue depuis la Terre, qui tourne elle aussi autour du Soleil, Mercure semble ralentir, s'arrêter puis repartir en arrière sur le fond des étoiles, avant de reprendre sa course."),
]
ld = [{"@context":"https://schema.org","@type":"Article","headline":h1,"description":desc,"datePublished":"2026-10-07","dateModified":"2026-10-07","inLanguage":"fr","author":{"@type":"Organization","name":"Genesolia","url":"https://genesolia.fr/"},"publisher":{"@type":"Organization","name":"Genesolia","url":"https://genesolia.fr/"},"url":"https://genesolia.fr/"+URL,"mainEntityOfPage":{"@type":"WebPage","@id":"https://genesolia.fr/"+URL}},
      {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":r}} for q,r in FAQ]}]
e = html.escape
page = f'''<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <link rel="icon" href="/favicon.ico" sizes="48x48">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <meta name="theme-color" content="#6B2F5B">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{e(titre)}</title>
  <meta name="description" content="{e(desc)}">
  <link rel="canonical" href="https://genesolia.fr/{URL}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="{e(h1)}">
  <meta property="og:description" content="{e(desc)}">
  <meta property="og:image" content="https://genesolia.fr/assets/formation/montagne.jpg">
  <link rel="stylesheet" href="assets/site.css">
  <style>{css}  </style>
  <script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>
</head>
<body class="nouveau">
  <header data-entete></header>
  <main>
    <section class="page-tete">
      <div class="colonne">
        <nav class="fil" aria-label="Fil d'Ariane"><a href="blog.html">Blog</a><span aria-hidden="true">/</span><a href="le-ciel-du-mois.html">Le ciel du mois</a><span aria-hidden="true">/</span>Mercure rétrograde 2027</nav>
        <h1>{e(h1)}</h1>
        <p class="intro">En 2027, Mercure semble reculer dans le ciel à trois reprises : en février, en juin et en octobre. Voici les dates et les heures exactes, ce que ces périodes symbolisent, et une question à poser à ton histoire familiale pour chacune.</p>
        <p class="publie">Publié le 7 octobre 2026 · lecture 7 min</p>
      </div>
    </section>

    <article class="article">
      <div class="colonne">
        <h2>Les dates de Mercure rétrograde en 2027</h2>
        <p>Les heures sont calculées astronomiquement. Au Québec, retire six heures à l'heure de Paris : l'écart est le même pour les six dates.</p>
        <div class="defile">
        <table class="periodes">
          <thead><tr><th scope="col">Période</th><th scope="col">Début</th><th scope="col">Fin</th><th scope="col">Signes</th></tr></thead>
          <tbody>
            <tr><th scope="row">Hiver</th><td>9 février<small>18 h 35 à Paris · 12 h 35 au Québec</small></td><td>3 mars<small>13 h 37 à Paris · 7 h 37 au Québec</small></td><td>Poissons, puis Verseau<small>retour en Verseau le 18 février</small></td></tr>
            <tr><th scope="row">Été</th><td>10 juin<small>20 h 19 à Paris · 14 h 19 au Québec</small></td><td>4 juillet<small>21 h 38 à Paris · 15 h 38 au Québec</small></td><td>Cancer, puis Gémeaux<small>retour en Gémeaux le 26 juin</small></td></tr>
            <tr><th scope="row">Automne</th><td>7 octobre<small>16 h 36 à Paris · 10 h 36 au Québec</small></td><td>28 octobre<small>16 h 12 à Paris · 10 h 12 au Québec</small></td><td>Scorpion, puis Balance<small>retour en Balance le 16 octobre</small></td></tr>
          </tbody>
        </table>
        </div>
        <p class="rappel"><strong>Les phases d'ombre.</strong> Avant chaque période, Mercure parcourt déjà les degrés qu'il va revisiter : c'est l'ombre d'entrée. Après, il les retraverse une dernière fois : c'est l'ombre de sortie. En 2027, elles vont du 25 janvier au 23 mars, du 26 mai au 19 juillet et du 17 septembre au 13 novembre.</p>

        <h2>Pourquoi Mercure semble reculer</h2>
        <p>Mercure ne fait jamais demi-tour. Il tourne autour du Soleil plus vite que la Terre, et à certains moments de son orbite, la position de la Terre crée une illusion : vue d'ici, la planète paraît ralentir, s'arrêter, puis repartir en arrière sur le fond des étoiles. Quelques semaines plus tard, elle semble s'arrêter à nouveau et reprend sa marche habituelle.</p>
        <p>Ce phénomène revient trois ou quatre fois par an et dure environ trois semaines. Les astronomes de l'Antiquité l'observaient déjà, et l'astrologie lui a donné un sens symbolique.</p>

        <h2>Ce que symbolise Mercure rétrograde</h2>
        <p>En astrologie, Mercure représente la pensée, la parole, les échanges, les écrits et les déplacements. Quand il semble reculer, la lecture symbolique invite à revenir en arrière plutôt qu'à foncer : relire, revoir, reprendre contact, vérifier avant de signer ou d'envoyer.</p>
        <p>On l'associe souvent aux malentendus et aux retards. Mais c'est surtout un temps pour revisiter ce qui a été dit, ou ce qui ne l'a jamais été. C'est là que la lecture rejoint ton histoire familiale : les conversations restées en suspens, les mots que personne n'a prononcés, les histoires qu'on raconte toujours de la même façon.</p>

        <h2>Les trois périodes, une à une</h2>
        <div class="phase">
          <span class="nom">9 février au 3 mars</span>
          <h3>En Poissons, puis en Verseau : ce qu'on devine sans le dire</h3>
          <p>Les Poissons symbolisent l'intuition, les rêves et ce qui flotte sans être nommé. Le Verseau parle du groupe, des idées et de la place de chacun·e. Cette première période invite à écouter tes pressentiments et à repérer ce qui se comprend, dans ta famille, sans jamais être dit à voix haute. C'est un bon moment pour noter tes rêves et relire les souvenirs flous.</p>
          <p class="question">Pour ta famille : qu'est-ce que tout le monde sait, sans que personne ne l'ait jamais dit ?</p>
        </div>
        <div class="phase">
          <span class="nom">10 juin au 4 juillet</span>
          <h3>En Cancer, puis en Gémeaux : la maison d'enfance et les mots de la fratrie</h3>
          <p>Le Cancer est le signe du foyer, des racines et des souvenirs d'enfance. Les Gémeaux parlent des frères et sœurs, des cousins et des mots échangés. C'est la période la plus familiale de l'année : un moment pour reprendre contact avec un proche, retrouver des photos ou des lettres, et réécouter les récits de famille avec une oreille neuve.</p>
          <p class="question">Pour ta famille : quelle histoire de ton enfance aimerais-tu entendre raconter par quelqu'un d'autre ?</p>
        </div>
        <div class="phase">
          <span class="nom">7 au 28 octobre</span>
          <h3>En Scorpion, puis en Balance : secrets, héritages et accords</h3>
          <p>Le Scorpion explore ce qui se cache sous la surface : les secrets, les héritages, les pertes. La Balance parle des couples, des accords et de la justice entre les personnes. Cette dernière période, juste avant la Toussaint, invite à regarder les non-dits avec douceur, et à revenir sur un accord, une promesse ou un partage qui pèse encore.</p>
          <p class="question">Pour ta famille : quel secret, petit ou grand, serait prêt à être regardé aujourd'hui ?</p>
        </div>

        <h2>Pendant Mercure rétrograde, concrètement</h2>
        <ul class="gestes">
          <li>Relire tes messages importants avant de les envoyer, et vérifier les dates et les adresses.</li>
          <li>Reprendre contact avec une personne perdue de vue, ou terminer une conversation laissée en suspens.</li>
          <li>Vérifier les dates de ton arbre familial dans l'état civil ou les archives : c'est le moment idéal pour corriger et compléter.</li>
          <li>Relire un ancien carnet, de vieilles lettres, un journal de rêves.</li>
          <li>Laisser mûrir une décision importante plutôt que la précipiter.</li>
        </ul>
        <p class="rappel"><strong>Rien de grave n'est annoncé.</strong> Mercure rétrograde n'est pas une période de malchance. Les trains en retard et les messages mal compris existent toute l'année. La lecture symbolique propose seulement de ralentir et de revenir sur ce qui compte.</p>

        <h2>Questions fréquentes</h2>
        <dl class="faq">
          {"".join(f'<dt>{e(q)}</dt><dd>{e(r)}</dd>' for q,r in FAQ)}
        </dl>

        <p class="note-fin">Les dates et les heures sont calculées astronomiquement. Les interprétations sont symboliques : elles proposent des pistes de réflexion, pas des prédictions.</p>
        <div class="actions">
          <a class="btn btn-plein" href="le-ciel-du-mois.html">Le ciel de chaque mois</a>
          <a class="btn btn-trait" href="genosociogramme.html">Vérifier les dates de mon arbre</a>
        </div>
      </div>
    </article>

    <section class="bloc"><div class="conteneur"><div data-cadeau></div></div></section>

    <section class="bloc">
      <div class="conteneur">
        <div class="bloc-tete"><h2>À lire aussi</h2></div>
        <div class="liste-outils">
          <a class="outil" href="ciel-fevrier-2027.html"><h3>Le ciel de février 2027</h3><p>Le premier Mercure rétrograde de l'année, la pleine lune en Vierge et l'éclipse.</p></a>
          <a class="outil" href="ciel-juin-2027.html"><h3>Le ciel de juin 2027</h3><p>Mercure rétrograde en Cancer, nouvelle lune en Gémeaux et pleine lune en Sagittaire.</p></a>
          <a class="outil" href="annee-personnelle-2027.html"><h3>Ton année personnelle 2027</h3><p>Calcule ton année en numérologie et découvre ce qu'elle t'invite à vivre.</p></a>
          <a class="outil" href="theme-astral.html"><h3>Ton thème astral</h3><p>Le Soleil, la Lune et les planètes au moment de ta naissance, reliés à ta lignée.</p></a>
          <a class="outil" href="journal-de-reves.html"><h3>Tenir un journal de rêves</h3><p>La méthode pas à pas, du carnet à la lignée.</p></a>
          <a class="outil" href="syndrome-anniversaire.html"><h3>Le syndrome d'anniversaire</h3><p>Quand une date semble revenir d'une génération à l'autre.</p></a>
        </div>
      </div>
    </section>
  </main>
  <footer data-pied></footer>
  <script src="assets/site.js"></script>
</body>
</html>
'''
open(URL, 'w', encoding='utf8').write(page)
