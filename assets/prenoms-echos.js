/* Genesolia · échos entre prénoms : même racine, mêmes lettres, même son, prénom caché dans un autre, même valeur.
   PrenomsEchos.comparer(a, b) -> { score, liens: [{ type, force, texte }] } ; PrenomsEchos.analyser([{ lien, prenom }]) -> paires triées. */
(function () {
  'use strict';
  /* Familles de prénoms issus d'une même racine (les formes, diminutifs et traductions d'un même prénom) */
  var FAMILLES = [
    ['Jean (hébreu Yohanan, « Dieu fait grâce »)', 'jean jeanne johann johanne johan yohann yohan yoan yoann joanne joanna yann yannick yanis yannis ivan ian iwan juan juana giovanni gianni john jane janine jeannine jeannette jeanine jonas evan sean shane hans jan janet johanna jenny ivana vanessa'],
    ['Anne (hébreu Hannah, « grâce »)', 'anne anna annie anny annette anaïs anais ana hannah hanna nina ninon nancy anouk annick anita anika annabelle anaelle anaëlle marianne anouchka nanette'],
    ['Marie (hébreu Myriam)', 'marie maria myriam miriam marion maryse manon mariette mia maryline marylène marilyne mary maureen marika maïa maya mariana marine? mariel'],
    ['Joseph', 'joseph josé jose josiane josette joséphine josephine giuseppe pepe jo yossef youssef'],
    ['Louis (germanique Hlodowig, « combat glorieux »)', 'louis louise louison ludovic ludivine clovis lou luis luigi lewis aloïs alois héloïse heloise'],
    ['Pierre (grec Petros, « la pierre »)', 'pierre peter pedro pietro perrine pierrette pierrick peyo petra'],
    ['Jacques (hébreu Yaakov)', 'jacques jacob james jacqueline jacquot jaime diego santiago iago jake jimmy jackie jacky'],
    ['Michel (hébreu Mikhaël, « qui est comme Dieu »)', 'michel michèle michele michelle michaël michael mickaël mickael mikael micheline mikhail miguel mike michka'],
    ['Catherine', 'catherine katia karine katell cathy kate katarina katherine kathleen caitlin karen catalina'],
    ['Élisabeth (hébreu Elisheva)', 'élisabeth elisabeth isabelle isabel élise elise lisa lise babette bettina elsa lili liz elizabeth isabeau ilse elisa lison'],
    ['Hélène (grec, « éclat »)', 'hélène helene éléonore eleonore elena léna lena aliénor alienor ellen eileen nell nelly leonor'],
    ['François (« le Français », « libre »)', 'françois francois françoise francoise frank franck francis fanny francesca franco paco francine'],
    ['Charles (germanique, « homme libre »)', 'charles charlotte carole caroline karl carl carla charlie charline carlos carlo carolina lola? caroll'],
    ['Paul (latin, « petit »)', 'paul paule pauline paola paulette pablo paolo paulin polly'],
    ['Jules (latin Julius)', 'jules julie julien julia juliette julian juliana juliane giulia gilian'],
    ['Nicolas (grec, « victoire du peuple »)', 'nicolas nicole colin coline nicolette colette nicola nico klaus niels nils'],
    ['Daniel (hébreu, « Dieu est mon juge »)', 'daniel danielle dany danny daniela danièle'],
    ['Emmanuel (hébreu, « Dieu avec nous »)', 'emmanuel emmanuelle manuel manuela manu immanuel'],
    ['Gabriel (hébreu, « force de Dieu »)', 'gabriel gabrielle gaby gabriela gabin? gabriella'],
    ['Matthieu (hébreu, « don de Dieu »)', 'matthieu mathieu matthias mathias mattéo matteo mathis matthew mateo mathys matéo'],
    ['André (grec, « homme courageux »)', 'andré andre andrée andree andrea andy andreas andrew drew'],
    ['Antoine (latin Antonius)', 'antoine antoinette anthony antonin antonio toni tony antonia antonella'],
    ['Victor (latin, « vainqueur »)', 'victor victoire victoria victorine vittorio vic'],
    ['Luc (latin, « lumière »)', 'luc lucas lucie lucien lucienne luce lucile lucille lucia luca lucy lucinda'],
    ['Simon (hébreu, « il a entendu »)', 'simon simone siméon simeon'],
    ['Léon (latin, « lion »)', 'léon leon léonie leonie léo leo léonard leonard léonce leonce lionel'],
    ['Marguerite (grec, « perle »)', 'marguerite margot maguy margaux maggie greta rita marjorie margaret margarita gretel'],
    ['Suzanne (hébreu, « lys »)', 'suzanne suzy susan suzette susanna susana'],
    ['Yves (germanique, « if »)', 'yves yvonne yvette ivo ivon yvon'],
    ['Henri (germanique, « maître de la maison »)', 'henri henriette harry enzo henry enrique heinrich rico'],
    ['Robert (germanique, « gloire brillante »)', 'robert roberte bob robin roberto robbie'],
    ['Christian (grec, « disciple du Christ »)', 'christian christiane christine chris kristen christophe kristell christina cristina kris christelle'],
    ['Guillaume (germanique, « volonté » et « casque »)', 'guillaume william willy wilhelm guillemette liam will guillermo'],
    ['Alexandre (grec, « qui protège les hommes »)', 'alexandre alexandra alex alexis sacha sasha sandra sandrine alessandro alejandro alexia sandro'],
    ['Claude (latin Claudius)', 'claude claudine claudia claudette claudio'],
    ['Marc (latin, de Mars)', 'marc marcel marcelle marceline marco marcus marcello marcelin'],
    ['Philippe (grec, « qui aime les chevaux »)', 'philippe philippine pippa felipe filippo phil'],
    ['Laurent (latin, « le laurier »)', 'laurent laurence laure laura lauren lorenzo loréna lorena laurine lauriane lorraine? laurette'],
    ['Nathalie (latin, « Noël »)', 'nathalie natacha natalia natasha noël noel noëlle noelle natale'],
    ['Stéphane (grec, « couronne »)', 'stéphane stephane stéphanie stephanie étienne etienne steven stefan stefano esteban stephen'],
    ['Georges (grec, « qui travaille la terre »)', 'georges georgette georgia jorge jordi youri iouri yuri georgina'],
    ['Élie (hébreu Eliyahou)', 'élie elie elias élias élia elia elliot eliott éliot elijah'],
    ['Valentin (latin valere, « être fort »)', 'valentin valentine valérie valerie valère valere valentina valéry valery'],
    ['Clément (latin, « clément »)', 'clément clement clémence clemence clémentine clementine'],
    ['Théodore (grec, « don de Dieu »)', 'théo theo théodore theodore dorothée dorothee théophile theophile thea théa dora'],
    ['Thomas (araméen, « jumeau »)', 'thomas tom tommy tomás tomas thomasine'],
    ['Sarah (hébreu, « princesse »)', 'sarah sara sarai sally'],
    ['Ève (hébreu Hawwa, « vivante »)', 'ève eve eva évelyne evelyne evelyn'],
    ['Raphaël (hébreu, « Dieu guérit »)', 'raphaël raphael raphaëlle raphaelle rafael raffaele'],
    ['Nathan', 'nathan nathanaël nathanael natan'],
    ['Benjamin', 'benjamin ben benji'],
    ['Emma / Emmanuelle', 'emma emmy'],
    ['Rose', 'rose rosalie rosine rosa rosette rosy'],
    ['Denis (de Dionysos)', 'denis denise dennis dionysos'],
    ['Hugues', 'hugues hugo hugh'],
    ['Martin (de Mars)', 'martin martine martina martial'],
    ['Gilles', 'gilles gil'],
    ['Sophie (grec, « sagesse »)', 'sophie sofia sophia sonia sofiane? sofie'],
    ['Jérôme (grec, « nom sacré »)', 'jérôme jerome geronimo'],
    ['Geneviève', 'geneviève genevieve ginette'],
    ['Odile', 'odile odette ottilie'],
    ['Patrick (latin, « patricien »)', 'patrick patrice patricia pat paddy'],
    ['Frédéric (germanique, « roi de la paix »)', 'frédéric frederic frédérique frederique fred federico'],
    ['Bernard', 'bernard bernadette bernardo'],
    ['Gérard', 'gérard gerard géraldine geraldine gérald gerald'],
    ['Dominique', 'dominique domenico dominic'],
    ['Albert / Adalbert', 'albert alberte albertine alberto bertrand? bertille'],
    ['Lily / Liliane', 'liliane lilian lily lilou lila'],
    ['Agnès', 'agnès agnes inès ines inez'],
    ['Yasmine / Jasmine', 'yasmine yasmina jasmine jasmin'],
    ['Mohamed (arabe, « digne de louange »)', 'mohamed mohammed muhammad mehmet ahmed hamid mahmoud'],
    ['Karim', 'karim karima'],
    ['Amine / Amina', 'amine amina amin'],
    ['Sami / Samuel', 'samuel sami samy sam'],
    ['Adam', 'adam adem'],
    ['Lina / Line', 'lina line linda?']
  ];
  function norm(t) { return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]/g, ''); }
  var INDEX = {};
  FAMILLES.forEach(function (f, i) { f[1].split(/\s+/).forEach(function (m) { if (!m || /\?$/.test(m)) return; var k = norm(m); (INDEX[k] = INDEX[k] || []).push(i); }); });

  function lettres(n) { var c = {}; norm(n).split('').forEach(function (l) { c[l] = (c[l] || 0) + 1; }); return c; }
  function memesLettres(a, b) {
    var A = lettres(a), B = lettres(b), inter = 0, union = 0;
    Object.keys(Object.assign({}, A, B)).forEach(function (l) { inter += Math.min(A[l] || 0, B[l] || 0); union += Math.max(A[l] || 0, B[l] || 0); });
    return union ? inter / union : 0;
  }
  /* Squelette sonore : les consonnes qu'on entend, dans l'ordre */
  function son(n) {
    var s = norm(n);
    s = s.replace(/^[yij](?=[aeiou])/, 'J').replace(/^h/, '').replace(/ph/g, 'f').replace(/ch/g, 'X').replace(/qu/g, 'k').replace(/[ckq]/g, 'k').replace(/[z]/g, 's').replace(/w/g, 'v').replace(/th/g, 't').replace(/h/g, '').replace(/y/g, 'i');
    s = s.replace(/(.)\1+/g, '$1');
    s = s.replace(/[sxt]$/, '').replace(/e$/, '');
    return s.replace(/[aeiou]/g, '');
  }
  function distance(a, b) {
    var d = []; for (var i = 0; i <= a.length; i++) { d[i] = [i]; } for (var j = 1; j <= b.length; j++) d[0][j] = j;
    for (i = 1; i <= a.length; i++) for (j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  }
  function valeur(n) { var t = 0; norm(n).split('').forEach(function (l) { t += ((l.charCodeAt(0) - 97) % 9) + 1; }); while (t > 9 && t !== 11 && t !== 22) t = String(t).split('').reduce(function (a, b) { return a + +b; }, 0); return t; }
  function cap(n) { n = String(n || '').trim(); return n.charAt(0).toUpperCase() + n.slice(1); }

  function comparer(a, b) {
    var na = norm(a), nb = norm(b), liens = [];
    if (!na || !nb) return { score: 0, liens: liens };
    if (na === nb) { liens.push({ type: 'identique', force: 3, texte: 'C\'est le même prénom.' }); return { score: 10, liens: liens }; }
    var fa = INDEX[na] || [], fb = INDEX[nb] || [], com = fa.filter(function (i) { return fb.indexOf(i) >= 0; });
    if (com.length) liens.push({ type: 'racine', force: 3, texte: 'Même racine : ce sont deux formes du prénom ' + FAMILLES[com[0]][0] + '.' });
    var court = na.length <= nb.length ? na : nb, long = court === na ? nb : na;
    if (court.length >= 3 && long.indexOf(court) >= 0) liens.push({ type: 'cache', force: 2, texte: cap(court) + ' est contenu dans ' + cap(long) + '.' });
    if (Math.min(na.length, nb.length) >= 3 && distance(na, nb) === 1 && !liens.length) liens.push({ type: 'lettre', force: 2, texte: 'Une seule lettre les sépare.' });
    var ml = memesLettres(a, b);
    if (ml >= 0.75) liens.push({ type: 'lettres', force: ml >= 0.9 ? 3 : 2, texte: ml === 1 ? 'Exactement les mêmes lettres, dans un autre ordre (une anagramme).' : 'Presque les mêmes lettres (' + Math.round(ml * 100) + ' %).' });
    var sa = son(a), sb = son(b);
    if (sa.length >= 2 && sa === sb) liens.push({ type: 'son', force: 2, texte: 'Le même squelette sonore : on y entend les mêmes consonnes, dans le même ordre.' });
    else if (Math.min(sa.length, sb.length) >= 2 && (sa.indexOf(sb) === 0 || sb.indexOf(sa) === 0)) liens.push({ type: 'son', force: 1, texte: 'Ils commencent par les mêmes sons.' });
    if (na.length >= 4 && nb.length >= 4 && na.slice(-3) === nb.slice(-3) && na[0] === nb[0]) liens.push({ type: 'forme', force: 1, texte: 'Même initiale et même finale.' });
    if (valeur(a) === valeur(b) && liens.length) liens.push({ type: 'valeur', force: 0, texte: 'Même valeur en numérologie (' + valeur(a) + ').' });
    var score = liens.reduce(function (t, l) { return t + l.force; }, 0);
    return { score: score, liens: liens };
  }
  function analyser(liste) {
    var p = liste.filter(function (x) { return norm(x.prenom); }), out = [];
    for (var i = 0; i < p.length; i++) for (var j = i + 1; j < p.length; j++) {
      var r = comparer(p[i].prenom, p[j].prenom);
      if (r.score > 0) out.push({ a: p[i], b: p[j], score: r.score, liens: r.liens });
    }
    return out.sort(function (x, y) { return y.score - x.score; });
  }
  function famille(n) { var f = INDEX[norm(n)]; return f && f.length ? FAMILLES[f[0]][0] : ''; }
  window.PrenomsEchos = { comparer: comparer, analyser: analyser, famille: famille, son: son, norm: norm };
})();
