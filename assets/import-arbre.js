/* Genesolia : importer un arbre déjà fait, depuis un PDF (avec du texte) ou un fichier GEDCOM (.ged).
   Tout se passe dans le navigateur : le fichier n'est envoyé nulle part.
   1. lecture du fichier (PDF : texte extrait avec pdf.js ; GEDCOM : format standard des logiciels de généalogie) ;
   2. écran « Vérifie avant d'importer » ;
   3. l'arbre est rempli par window.GenoArbre.importer (défini dans genosociogramme.js). */
(function () {
  'use strict';

  /* ───────── Outils ───────── */
  var MOIS = { janvier: 1, fevrier: 2, mars: 3, avril: 4, mai: 5, juin: 6, juillet: 7, aout: 8, septembre: 9, octobre: 10, novembre: 11, decembre: 12 };
  var MOIS_GED = { JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6, JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12 };
  var NOM_MOIS = 'janvier|f[ée]vrier|mars|avril|mai|juin|juillet|ao[uû]t|septembre|octobre|novembre|d[ée]cembre';
  var RE_DATE = new RegExp('(?:\\b(1er|\\d{1,2})\\s+(' + NOM_MOIS + ')\\s+(\\d{4}))|(?:\\b(\\d{1,2})\\s*\\/\\s*(\\d{1,2})\\s*\\/\\s*(\\d{4}))|(?:\\b(' + NOM_MOIS + ')\\s+(\\d{4}))|(?:\\b(?:vers|en|env\\.?)\\s+(\\d{4}))', 'i');

  function sansAccent(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function cle(s) { return sansAccent(s).toLowerCase().replace(/[^a-z]/g, ''); }
  function pad(n) { n = String(n); return n.length < 2 ? '0' + n : n; }
  function majuscule(s) { s = String(s || '').trim(); return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
  function titre(s) { return String(s || '').toLowerCase().replace(/(^|[\s'’-])(\p{L})/gu, function (m, a, b) { return a + b.toUpperCase(); }); }
  function dateIso(y, m, d) {
    y = +y; m = +m; d = +d;
    if (!(y >= 1000 && y <= 2100)) return '';
    var t = new Date(y, m - 1, d);
    if (!m || !d || t.getFullYear() !== y || t.getMonth() !== m - 1 || t.getDate() !== d) return String(y);
    return y + '-' + pad(m) + '-' + pad(d);
  }
  function annee(d) { var m = String(d || '').match(/(\d{4})/); return m ? +m[1] : null; }

  // Première date trouvée dans un texte : { date: 'AAAA-MM-JJ' ou 'AAAA', debut, fin }
  function trouverDate(s) {
    var m = RE_DATE.exec(s); if (!m) return null;
    var d = '';
    if (m[3]) d = dateIso(m[3], MOIS[cle(m[2])], m[1] === '1er' ? 1 : m[1]);
    else if (m[6]) d = dateIso(m[6], m[5], m[4]);
    else if (m[8]) d = String(+m[8]);
    else if (m[9]) d = String(+m[9]);
    return d ? { date: d, debut: m.index, fin: m.index + m[0].length } : null;
  }

  // « (lundi) - au Chauchix - Gausson, 22 à l'âge de 74 ans » → « Gausson (22) »
  function lieuDe(s) {
    s = String(s || '').replace(/^\s*\([^)]*\)/, '').replace(/,?\s*à l['’]âge.*$/i, '').replace(/,?\s*avec\s*$/i, '');
    var parts = s.split(/\s+[-–]\s+|^\s*[-–,]\s*/).map(function (x) { return x.replace(/^[\s,;.-]+|[\s,;.-]+$/g, ''); }).filter(Boolean);
    if (!parts.length) return '';
    var l = parts[parts.length - 1].replace(/^(?:à|a|au|aux|en|dans)\s+/i, '').trim();
    var m = l.match(/^(.*?),?\s+(\d{2,3}|2A|2B)$/);
    if (m) l = m[1].trim() + ' (' + m[2] + ')';
    l = l.replace(/\s+,/g, ',');
    return /\p{L}/u.test(l) ? majuscule(l) : '';
  }

  /* Prénoms courants (dont anciens) pour deviner homme ou femme. Sinon : « né » / « née », puis le conjoint. */
  var PRENOMS_M = 'adolphe alain albert alexandre alexis alfred alphonse amedee anatole andre ange antoine armand arthur auguste augustin baptiste benjamin benoit bernard bertrand blaise bruno camille charles christian christophe claude clement cyrille damien daniel david denis didier dominique edmond edouard emile emmanuel eric ernest etienne eugene fabien felix fernand florent francis francois frederic gabriel gaston georges gerard gilbert gilles gregoire guillaume gustave guy henri herve hippolyte honore hugo hugues ignace jacques jacquot jean jeremy jerome joachim joel joseph jules julien kevin laurent leon leonard lionel louis luc lucas lucien marc marcel marius martin mathieu mathurin matthieu maurice maxime michel nicolas noel olivier pascal patrice patrick paul philippe pierre raoul raphael raymond remi rene robert roger roland romain sebastien serge simon stephane sylvain theo theodore thierry thomas tristan valentin victor vincent xavier yann yannick yves'.split(' ');
  var PRENOMS_F = 'adele adrienne agathe agnes albertine alexandrine alice aline amelie anais anastasie angele angelique anne annette annick antoinette augustine aurelie berthe blanche brigitte camille caroline catherine cecile celine celestine chantal charlotte christine claire claudine clemence colette danielle delphine denise eleonore elisabeth elise elodie emilie emma estelle eugenie eva eveline florence francine francoise gabrielle genevieve germaine ginette guillemette helene henriette huguette irene isabelle jacqueline jacquette jeanne jeannine josephine josette josiane joelle julie julienne juliette laura laure lea leonie leontine lise louise lucie lucienne lydie madeleine magdeleine marcelle marguerite maria marianne marie marine marthe martine mathilde mathurine maud melanie micheline michele monique nathalie nicole noemie odette olive pascale paule paulette pauline perrine philomene rachel raymonde reine renee rose sandrine simone solange sophie stephanie suzanne sylvie sylviane therese ursule valerie veronique victoire victorine virginie yvette yvonne zoe'.split(' ');
  function sexePrenom(prenom) {
    var p = cle(String(prenom || '').split(/[\s-]+/)[0]);
    if (!p) return '';
    if (PRENOMS_F.indexOf(p) >= 0 && PRENOMS_M.indexOf(p) < 0) return 'f';
    if (PRENOMS_M.indexOf(p) >= 0 && PRENOMS_F.indexOf(p) < 0) return 'm';
    return '';
  }

  /* ───────── Noms ───────── */
  var RE_PRENOM = /^\p{Lu}[\p{Ll}'’]+(?:-\p{Lu}[\p{Ll}'’]+)*$/u;
  var RE_NOM = /^(?=.*\p{L}{2})[\p{Lu}'’-]+$/u;

  // « Jean Baptiste LUCAS 1756-1789 33ans » → { prenom, nom, variante, reste }
  function lireNom(s) {
    var mots = String(s || '').trim().split(/\s+/), i = 0, pre = [], nom = [], fini = false;
    while (i < mots.length) {
      var w = mots[i].replace(/,$/, '');
      if (RE_NOM.test(w) && w.length >= 2) break;
      if (!RE_PRENOM.test(w)) return null;
      pre.push(w); i++;
      if (mots[i - 1].slice(-1) === ',') return null;
    }
    while (i < mots.length && !fini) {
      var v = mots[i], fin = v.slice(-1) === ',';
      v = v.replace(/,$/, '');
      if (!RE_NOM.test(v)) break;
      nom.push(v); i++;
      if (fin) fini = true;
    }
    if (!pre.length || !nom.length) return null;
    var reste = (fini ? ', ' : ' ') + mots.slice(i).join(' ');
    var variante = '';
    var mv = reste.match(/^\s*\(([^)]*)\)/);
    if (mv) { variante = mv[1].trim(); reste = reste.slice(mv[0].length); }
    return { prenom: pre.join(' '), nom: nom.join(' '), variante: variante, reste: reste.replace(/^\s+/, function (x) { return x.indexOf(',') >= 0 ? x : ''; }) };
  }

  // Nom écrit librement (« Lucienne guillaume », « christian jacque Lucas »)
  function lireNomLibre(s, famille) {
    var mots = String(s || '').replace(/[.,;]+$/, '').trim().split(/\s+/).filter(Boolean);
    if (!mots.length) return null;
    var iNom = -1;
    mots.forEach(function (w, k) { if (iNom < 0 && w.length >= 2 && RE_NOM.test(w)) iNom = k; });
    if (iNom < 0) mots.forEach(function (w, k) { if (famille[cle(w)]) iNom = k; });
    if (iNom < 0 && mots.length > 1) iNom = mots.length - 1;
    var nom = iNom >= 0 ? mots[iNom] : '';
    var pre = mots.filter(function (w, k) { return k !== iNom; });
    return { prenom: titre(pre.join(' ')), nom: nom.toUpperCase() };
  }

  var RE_RESTE_ENTETE = /^\s*(?:,.*\bn[ée]e?\s+le\b.*|,?\s*(?:\d{4}\s*-\s*(?:\d{4})?)?\s*(?:\d+\s*ans|ans)?\s*)$/i;

  /* ───────── Lecture d'un PDF de généalogie (texte) ─────────
     Format visé : listes de lignée ou de descendance comme en produisent Heredis, Geneanet ou Généatique,
     avec ou sans ajouts tapés à la main. Chaque personne principale est l'enfant de la précédente. */
  function lireLignes(lignes) {
    var personnes = [], rels = [], n = 0, famille = {}, lignee = [], freres = [];
    var pr = null, evts = false, anEvt = null, prefixe = '', attente = null;

    function nouvelle(o) {
      var p = { id: 'i' + (++n), prenom: '', nom: '', sex: '', naiss: '', deces: '', lieu: '', metier: '', notes: [], doutes: [], ne: '', events: [] };
      Object.keys(o || {}).forEach(function (k) { p[k] = o[k]; });
      personnes.push(p);
      return p;
    }
    function memeNom(a, b) { return cle(a.prenom) === cle(b.prenom) && cle(a.nom) === cle(b.nom); }
    function trouver(o) { return personnes.find(function (p) { return memeNom(p, o); }); }
    function conjoints(p) { return rels.filter(function (r) { return r.type === 'couple' && (r.from === p.id || r.to === p.id); }); }
    function naissance(p, texte) {
      var d = trouverDate(texte); if (!d) return '';
      if (!p.naiss) p.naiss = d.date;
      var m = texte.match(/\b(n[ée]e?)\s+le\b/i); if (m && !p.ne) p.ne = cle(m[1]) === 'nee' ? 'f' : 'm';
      var apres = texte.slice(d.fin);
      var d2 = apres.match(/^\s*[-–]\s*/) && trouverDate(apres);
      if (d2 && d2.debut < 6) {
        if (!p.deces) p.deces = d2.date;
        var l2 = lieuDe(apres.slice(d2.fin)); if (l2) p.notes.push('Décès : ' + l2);
        return '';
      }
      var l = lieuDe(apres); if (l && !p.lieu) p.lieu = l;
      return l;
    }
    function deces(p, texte) {
      var d = trouverDate(texte);
      if (d) { if (!p.deces) p.deces = d.date; var l = lieuDe(texte.slice(d.fin)); if (l) p.notes.push('Décès : ' + l); }
      else { var l2 = lieuDe(texte.replace(/^\s*(?:mort|morte|d[ée]c[ée]d[ée]e?|d[ée]c[èe]s)\s*/i, '')); if (l2) p.notes.push('Décès : ' + l2); }
    }
    // nouvelle personne de la lignée : on ne reprend une fiche existante que si elle n'est pas déjà dans la lignée
    // (un fils peut porter le même prénom que son père)
    function personneDepuis(nm, enTete) {
      var o = { prenom: titre(nm.prenom), nom: nm.nom.toUpperCase() };
      var ex = trouver(o);
      if (ex && enTete && lignee.indexOf(ex) >= 0) ex = null;
      var p = ex || nouvelle(o);
      if (nm.variante) p.notes.push('Nom aussi écrit : ' + nm.variante);
      var r = nm.reste || '';
      var mn = r.match(/\bn[ée]e?\s+le\b/i);
      if (mn) {
        var corps = r.slice(mn.index), cut = corps.search(/,?\s*(?:d[ée]c[ée]d[ée]e?|mort|morte)\s+le\b/i);
        naissance(p, cut >= 0 ? corps.slice(0, cut) : corps);
        if (cut >= 0) deces(p, corps.slice(cut).replace(/^,?\s*/, ''));
      } else {
        var my = r.match(/(\d{4})\s*-\s*(\d{4})?/);
        if (my) { if (!p.naiss) p.naiss = my[1]; if (my[2] && !p.deces) p.deces = my[2]; }
      }
      return p;
    }
    function lierCouple(a, b, info) {
      if (!a || !b || a === b) return;
      var r = rels.find(function (x) { return x.type === 'couple' && ((x.from === a.id && x.to === b.id) || (x.from === b.id && x.to === a.id)); });
      if (!r) { r = { type: 'couple', from: a.id, to: b.id, statut: 'marie' }; rels.push(r); }
      if (info && info.date) r.date = info.date;
      if (info && info.lieu) r.lieu = info.lieu;
      return r;
    }
    function principal(p) {
      pr = p; evts = false; anEvt = null; prefixe = ''; attente = null;
      if (lignee.indexOf(p) < 0) lignee.push(p);
      famille[cle(p.nom)] = 1;
    }
    function ajouterFrere(texte, sexe, de) {
      texte.split(/\s*(?:,|\bet\b)\s*/).forEach(function (t) {
        t = t.trim(); if (!t) return;
        var nm = lireNom(t), o;
        if (nm) o = { prenom: titre(nm.prenom), nom: nm.nom.toUpperCase() };
        else o = lireNomLibre(t, famille);
        if (!o || !o.prenom) return;
        var my = (nm && nm.reste || '').match(/(\d{4})\s*-\s*(\d{4})?/);
        var f = trouver(o) || nouvelle(o);
        if (my) { if (!f.naiss) f.naiss = my[1]; if (my[2] && !f.deces) f.deces = my[2]; }
        if (sexe && !f.ne) f.ne = sexe;
        if (o.nom && de.nom && !famille[cle(o.nom)]) f.doutes.push('Nom différent de celui de la famille : nom d’épouse ou faute de frappe ?');
        if (!freres.some(function (x) { return x.p === f && x.de === de; })) freres.push({ p: f, de: de });
      });
    }

    var brut = [];
    lignes.forEach(function (l) {
      l = String(l || '').replace(/ /g, ' ').replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim();
      if (!l) return;
      // suite d'une phrase coupée en fin de ligne : « (lundi) - au … », « le 22 novembre 1775 … »
      if (brut.length && (/^\(/.test(l) || /^le \d/.test(l))) brut[brut.length - 1] += ' ' + l;
      else brut.push(l);
    });

    brut.forEach(function (l) {
      var m, nm;
      if (/^[ÉE]v[ée]nements?\s*:?$/i.test(l)) { if (pr) evts = true; return; }

      // Une nouvelle personne de la lignée : « Prénom NOM », « Prénom NOM 1756-1789 », « Prénom NOM, né le … »
      nm = lireNom(l);
      if (nm && RE_RESTE_ENTETE.test(nm.reste)) { principal(personneDepuis(nm, true)); return; }
      // … ou écrite nom d'abord : « LUCAS PIERRE MARIE 55ans », « Lucas Alain Lucien parrain jacquot 46 ans »
      var mots = l.split(' ');
      if (mots.length > 1 && famille[cle(mots[0])] && !/^(?:fr[èe]re|s[œo]e?ur)/i.test(l)) {
        var pre = [], k = 1;
        while (k < mots.length && /^\p{L}[\p{L}'’-]*$/u.test(mots[k]) && (/^\p{Lu}/u.test(mots[k]))) { pre.push(mots[k]); k++; }
        if (pre.length) {
          var p = nouvelle({ prenom: titre(pre.join(' ')), nom: mots[0].toUpperCase() });
          var reste = mots.slice(k).join(' ').replace(/\d+\s*ans\b|\bans\b|\d+/gi, '').trim();
          if (reste) p.notes.push(majuscule(reste));
          principal(p); return;
        }
      }
      if (!pr) return;

      if (evts) {
        // Partie « Événements » : on garde le texte en notes, on repère divorces et frères ou sœurs cités.
        if ((m = l.match(/:\s*([^,:]+?),\s*(\d{4})?\s*-\s*(\d{4})?\s*,\s*(demi-)?(fr[èe]re|s[œo]e?ur)\b/iu))) ajouterFrere(m[1] + ' ' + (m[2] || '') + '-' + (m[3] || ''), /fr/i.test(m[5]) ? 'm' : 'f', pr);
        if ((m = l.match(/^Divorce\s*\(avec\s+([^)]+)\)/i))) {
          var nd = lireNom(m[1]) || lireNomLibre(m[1], famille);
          var cj = nd && conjoints(pr).map(function (r) { return personnes.find(function (x) { return x.id === (r.from === pr.id ? r.to : r.from); }); }).find(function (x) { return x && cle(x.nom) === cle(nd.nom); });
          if (cj) { var rc = lierCouple(pr, cj); rc.statut = 'divorce'; if (anEvt) rc.divorce = String(anEvt); }
        }
        if (/^(?:sources?\s*:|heure\s*:|page\b|acte\b|c[ôo]te\b|matricule\b|document\b|administrative\b)/i.test(l)) return;
        if (/^\d{1,2}$|^(?:\d{1,2}\s+)?\p{L}+$/u.test(l) && (MOIS[cle(l.replace(/^\d+\s*/, ''))] || /^\d{1,2}$/.test(l))) return;
        if ((m = l.match(/^(\d{4})\s*:\s*(.*)$/))) { anEvt = +m[1]; if (m[2]) pr.notes.push(m[1] + ' : ' + m[2]); else prefixe = m[1] + ' : '; return; }
        pr.notes.push(prefixe + l); prefixe = '';
        return;
      }

      // Union : « &1743 Marguerite SALMON 1725-1768 » (parfois plusieurs « & » sur la ligne)
      if (/^&/.test(l)) {
        l.split('&').slice(1).forEach(function (seg) {
          var my = seg.match(/^\s*(\d{4})?\s*(.*)$/), an = my[1] || '', nc = lireNom(my[2]);
          if (nc) { var c = personneDepuis(nc); lierCouple(pr, c, { date: an }); }
          else if (an) { pr.notes.push('Autre union en ' + an + ' (personne non indiquée dans le document).'); pr.doutes.push('Une union en ' + an + ' sans nom : à compléter.'); }
        });
        return;
      }
      var puce = /^[•·▪●◦*-]\s*/.test(l);
      var c = l.replace(/^[•·▪●◦*-]\s*/, '').trim();
      if (!c) return;

      // Personne annoncée par « Marié le … avec » à la ligne précédente
      if (attente && (nm = lireNom(c)) && /^\s*,?\s*n[ée]e?\s+le\b/i.test(nm.reste)) { lierCouple(pr, personneDepuis(nm), attente); attente = null; return; }
      attente = null;

      // Mariage : « Marié le 15 février 1719, Gausson, 22, avec », « marié à chatillon le 28 mai 1949 à Lucienne guillaume né le 30 mai 1926 »
      if (/^mari[ée]e?s?(?=[\s,:]|$)/i.test(c)) {
        var dm = trouverDate(c);
        if (!dm) return;
        var avant = c.slice(0, dm.debut).replace(/^mari[ée]e?s?\s*/i, '').replace(/\s*le\s*$/i, '');
        var info = { date: dm.date, lieu: lieuDe(avant) };
        var apres = c.slice(dm.fin);
        if (/,?\s*avec\s*$/i.test(apres)) { info.lieu = info.lieu || lieuDe(apres); attente = info; return; }
        var ma = apres.match(/(?:^|[\s,])(?:avec|à)\s+(\p{Lu}.*)$/u);
        if (ma) {
          var txt = ma[1], cut = txt.search(/\s+n[ée]e?\s+le\b|\s+\d{4}/i);
          var nomTxt = cut >= 0 ? txt.slice(0, cut) : txt;
          var nc2 = lireNom(nomTxt), o2 = nc2 ? { prenom: titre(nc2.prenom), nom: nc2.nom.toUpperCase() } : lireNomLibre(nomTxt, famille);
          if (o2 && o2.prenom) {
            var cj2 = trouver(o2) || nouvelle(o2);
            if (cut >= 0) naissance(cj2, txt.slice(cut));
            lierCouple(pr, cj2, info);
          }
        }
        return;
      }
      if (/^n[ée]e?\s+le\b/i.test(c)) { naissance(pr, c); return; }
      if (/^(?:mort|morte|d[ée]c[ée]d[ée]e?|d[ée]c[èe]s)(?=[\s,:]|$)/i.test(c)) { deces(pr, c); return; }
      if ((m = c.match(/^(demi[- ])?(fr[èe]res?|s[œo]e?urs?)\s*:?\s*(.+)$/i))) { ajouterFrere(m[3], /^fr/i.test(m[2]) ? 'm' : 'f', pr); return; }

      // Ligne de dates : « 03/01/1952 – 9/04/1998 », « 11/10/1982 – Saint Brieux »
      var d0 = trouverDate(c);
      if (d0 && d0.debut === 0) { naissance(pr, 'né le ' + c); return; }

      if ((m = c.match(/:\s*([^,:]+?),\s*(\d{4})?\s*-\s*(\d{4})?\s*,\s*(demi-)?(fr[èe]re|s[œo]e?ur)\b/iu))) { ajouterFrere(m[1] + ' ' + (m[2] || '') + '-' + (m[3] || ''), /fr/i.test(m[5]) ? 'm' : 'f', pr); return; }

      // Puce sans date : le métier (« Laboureur », « Employé de l'octroi de Paris »)
      if (puce && !/\d/.test(c) && c.length <= 80) { if (!pr.metier) pr.metier = majuscule(c); else pr.notes.push(c); }
    });

    // Lignée : chaque personne principale est l'enfant de la précédente (et de son conjoint, s'il y en a un seul qui convient)
    function conjointsDe(p) { return conjoints(p).map(function (r) { return { r: r, p: personnes.find(function (x) { return x.id === (r.from === p.id ? r.to : r.from); }) }; }); }
    lignee.forEach(function (enf, k) {
      if (!k) return;
      var par = lignee[k - 1], cs = conjointsDe(par), autre = null;
      var an = annee(enf.naiss);
      if (cs.length === 1) autre = cs[0].p;
      else if (cs.length > 1) {
        var possibles = cs.filter(function (c) { var am = annee(c.r.date); return !am || !an || am <= an; });
        possibles.sort(function (a, b) { return (annee(b.r.date) || 0) - (annee(a.r.date) || 0); });
        autre = possibles.length ? possibles[0].p : null;
        enf.doutes.push('Plusieurs unions pour ' + (par.prenom + ' ' + par.nom).trim() + ' : vérifie de quelle union vient cette personne.');
      }
      rels.push({ type: 'parent', from: par.id, to: enf.id });
      if (autre) rels.push({ type: 'parent', from: autre.id, to: enf.id });
      var ap = annee(par.naiss);
      if (an && ap && (an - ap < 13 || an - ap > 70)) enf.doutes.push('Écart d’âge étonnant avec ' + par.prenom + ' : vérifie que c’est bien son enfant.');
    });
    // Frères et sœurs : mêmes parents que la personne citée
    freres.forEach(function (f) {
      if (f.p === f.de) return;
      var ps = rels.filter(function (r) { return r.type === 'parent' && r.to === f.de.id; });
      if (ps.length) ps.forEach(function (r) { if (!rels.some(function (x) { return x.type === 'parent' && x.from === r.from && x.to === f.p.id; })) rels.push({ type: 'parent', from: r.from, to: f.p.id }); });
      else rels.push({ type: 'fratrie', from: f.de.id, to: f.p.id });
    });

    return finir(personnes, rels);
  }

  /* ───────── Lecture d'un fichier GEDCOM ───────── */
  function dateGed(v) {
    v = String(v || '').toUpperCase().replace(/@#D[^@]*@/g, '').replace(/^(ABT|ABOUT|EST|CAL|BEF|AFT|FROM|TO|BET|INT)\s+/, '').replace(/\s+AND\s+.*$/, '').trim();
    var m = v.match(/^(\d{1,2})\s+([A-Z]{3})\s+(\d{3,4})/);
    if (m && MOIS_GED[m[2]]) return dateIso(m[3], MOIS_GED[m[2]], m[1]);
    m = v.match(/(\d{4})/);
    return m ? m[1] : '';
  }
  function lieuGed(v) {
    var parts = String(v || '').split(',').map(function (x) { return x.trim(); }).filter(Boolean);
    if (!parts.length) return '';
    return parts[1] && /^(\d{2,3}|2A|2B)$/.test(parts[1]) ? parts[0] + ' (' + parts[1] + ')' : parts[0];
  }
  function lireGedcom(texte) {
    var indis = {}, fams = {}, cur = null, sous = '', niv1 = '';
    String(texte || '').split(/\r\n|\r|\n/).forEach(function (l) {
      var m = l.replace(/^\uFEFF/, '').replace(/^\s+/, '').match(/^(\d+)\s+(?:(@[^@]+@)\s+)?(\S+)(?:\s(.*))?$/);
      if (!m) return;
      var niv = +m[1], tag = m[3].toUpperCase(), val = tag === 'CONC' ? (m[4] || '') : (m[4] || '').trim();
      if (niv === 0) {
        cur = null;
        if (tag === 'INDI') cur = indis[m[2]] = { t: 'i', prenom: '', nom: '', sex: '', naiss: '', deces: '', decede: false, lieu: '', metier: '', notes: [] };
        else if (tag === 'FAM') cur = fams[m[2]] = { t: 'f', h: [], c: [], statut: 'marie', date: '' };
        return;
      }
      if (!cur) return;
      if (niv === 1) { niv1 = tag; sous = ''; }
      else if (niv === 2) sous = tag;
      if (cur.t === 'i') {
        if (niv === 1 && tag === 'NAME' && !cur.nom && !cur.prenom) {
          var nn = val.match(/^([^/]*)\/([^/]*)\/?(.*)$/);
          if (nn) { cur.prenom = (nn[1] + ' ' + nn[3]).trim(); cur.nom = nn[2].trim().toUpperCase(); } else cur.prenom = val;
        }
        else if (niv === 2 && niv1 === 'NAME' && tag === 'GIVN' && val) cur.prenom = val;
        else if (niv === 2 && niv1 === 'NAME' && tag === 'SURN' && val) cur.nom = val.toUpperCase();
        else if (niv === 1 && tag === 'SEX') cur.sex = /^F/i.test(val) ? 'f' : /^M/i.test(val) ? 'm' : '';
        else if (niv === 1 && tag === 'DEAT') cur.decede = true;
        else if (niv === 2 && niv1 === 'BIRT' && tag === 'DATE') cur.naiss = dateGed(val);
        else if (niv === 2 && niv1 === 'BIRT' && tag === 'PLAC') cur.lieu = lieuGed(val);
        else if (niv === 2 && niv1 === 'DEAT' && tag === 'DATE') cur.deces = dateGed(val);
        else if (niv === 2 && niv1 === 'DEAT' && tag === 'PLAC' && val) cur.notes.push('Décès : ' + lieuGed(val));
        else if (niv === 1 && tag === 'OCCU' && val && !cur.metier) cur.metier = majuscule(val);
        else if (niv === 1 && tag === 'NOTE' && val && val.charAt(0) !== '@') cur.notes.push(val);
        else if (niv === 2 && niv1 === 'NOTE' && (tag === 'CONC' || tag === 'CONT') && cur.notes.length) cur.notes[cur.notes.length - 1] += (tag === 'CONT' ? '\n' : '') + val;
      } else {
        if (niv === 1 && (tag === 'HUSB' || tag === 'WIFE')) cur.h.push(val);
        else if (niv === 1 && tag === 'CHIL') cur.c.push(val);
        else if (niv === 1 && tag === 'DIV') cur.statut = 'divorce';
        else if (niv === 2 && niv1 === 'MARR' && tag === 'DATE') cur.date = dateGed(val);
      }
    });
    var personnes = [], rels = [], ids = {}, n = 0;
    Object.keys(indis).forEach(function (x) {
      var i = indis[x];
      var p = { id: 'i' + (++n), prenom: i.prenom, nom: i.nom, sex: i.sex, naiss: i.naiss, deces: i.deces, decede: i.decede, lieu: i.lieu, metier: i.metier, notes: i.notes, doutes: [], ne: '', events: [] };
      ids[x] = p.id; personnes.push(p);
    });
    Object.keys(fams).forEach(function (x) {
      var f = fams[x], ps = f.h.map(function (h) { return ids[h]; }).filter(Boolean);
      if (ps.length === 2) rels.push({ type: 'couple', from: ps[0], to: ps[1], statut: f.statut, date: f.date });
      f.c.forEach(function (c) { if (!ids[c]) return; ps.forEach(function (p) { rels.push({ type: 'parent', from: p, to: ids[c] }); }); });
      if (!ps.length && f.c.length > 1) f.c.slice(1).forEach(function (c) { if (ids[c] && ids[f.c[0]]) rels.push({ type: 'fratrie', from: ids[f.c[0]], to: ids[c] }); });
    });
    return finir(personnes, rels);
  }

  /* ───────── Finitions communes ───────── */
  function finir(personnes, rels) {
    var parId = {};
    personnes.forEach(function (p) { parId[p.id] = p; });
    // homme ou femme : le fichier, puis le prénom, puis « né / née », puis le conjoint
    personnes.forEach(function (p) {
      var s = p.sex || sexePrenom(p.prenom);
      if (s && p.ne && p.ne !== s && !p.sex) p.doutes.push('Le document écrit « ' + (p.ne === 'f' ? 'née' : 'né') + ' » : vérifie si c’est un homme ou une femme.');
      p.sex = s || p.ne || '';
    });
    rels.forEach(function (r) {
      if (r.type !== 'couple') return;
      var a = parId[r.from], b = parId[r.to];
      if (a && b && !a.sex && b.sex) a.sex = b.sex === 'm' ? 'f' : 'm';
      if (a && b && !b.sex && a.sex) b.sex = a.sex === 'm' ? 'f' : 'm';
      // l'union et la séparation deviennent des événements datés (ils comptent dans les répétitions)
      [a, b].forEach(function (p) {
        if (!p) return;
        var ap = annee(p.naiss), am = annee(r.date), ad = annee(r.divorce);
        if (am) p.events.push({ type: 'mariage', age: ap ? String(am - ap) : '', year: String(am) });
        if (r.statut === 'divorce') p.events.push({ type: 'rupture', age: ap && ad ? String(ad - ap) : '', year: ad ? String(ad) : '' });
      });
      if (r.date || r.lieu) {
        var t = 'Mariage' + (r.date ? (/^\d{4}$/.test(r.date) ? ' en ' : ' le ') + affDate(r.date) : '') + (r.lieu ? ' à ' + r.lieu : '');
        if (a) a.notes.push(t + ' avec ' + (b ? (b.prenom + ' ' + b.nom).trim() : '') + '.');
        if (b) b.notes.push(t + ' avec ' + (a ? (a.prenom + ' ' + a.nom).trim() : '') + '.');
      }
    });
    personnes.forEach(function (p) {
      p.sex = p.sex || 'u';
      var vus = {};
      p.notes = p.notes.filter(function (x) { x = String(x).trim(); if (!x || vus[x]) return false; vus[x] = 1; return true; }).join('\n').slice(0, 3000);
      delete p.ne;
    });
    var vusRel = {};
    rels = rels.filter(function (r) {
      if (!parId[r.from] || !parId[r.to] || r.from === r.to) return false;
      var k = r.type + ':' + (r.type === 'parent' ? r.from + '>' + r.to : [r.from, r.to].sort().join('-'));
      if (vusRel[k]) return false; vusRel[k] = 1; return true;
    }).map(function (r) { return r.type === 'couple' ? { type: 'couple', from: r.from, to: r.to, statut: r.statut || 'marie' } : { type: r.type, from: r.from, to: r.to }; });
    return { personnes: personnes, rels: rels };
  }
  function affDate(d) { var m = String(d || '').match(/^(\d{4})-(\d{2})-(\d{2})$/); return m ? (+m[3]) + ' ' + Object.keys(MOIS)[+m[2] - 1].replace('fevrier', 'février').replace('aout', 'août').replace('decembre', 'décembre') + ' ' + m[1] : (d || ''); }

  var Lecteur = { lireLignes: lireLignes, lireGedcom: lireGedcom };
  if (typeof module !== 'undefined' && module.exports) { module.exports = Lecteur; return; }

  /* ───────── Dans la page ───────── */
  var G = window.GenoArbre;
  function $(id) { return document.getElementById(id); }
  function esc(x) { return String(x == null ? '' : x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  if (!G || !$('fen-import')) return;

  // pdf.js n'est chargé que lorsqu'on choisit un PDF
  var PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/', chargement = null;
  function chargerPdfJs() {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    if (!chargement) chargement = new Promise(function (ok, ko) {
      var sc = document.createElement('script'); sc.src = PDFJS + 'pdf.min.js';
      sc.onload = function () { window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS + 'pdf.worker.min.js'; ok(window.pdfjsLib); };
      sc.onerror = function () { chargement = null; ko(new Error('pdfjs')); };
      document.head.appendChild(sc);
    });
    return chargement;
  }
  // Texte du PDF, ligne par ligne (les morceaux d'une même hauteur forment une ligne)
  function lignesPdf(buf) {
    return chargerPdfJs().then(function (lib) { return lib.getDocument({ data: buf }).promise; }).then(function (doc) {
      var lignes = [], suite = Promise.resolve();
      for (var i = 1; i <= doc.numPages; i++) (function (i) {
        suite = suite.then(function () { return doc.getPage(i); }).then(function (pg) { return pg.getTextContent(); }).then(function (c) {
          var cur = null;
          c.items.forEach(function (it) {
            if (typeof it.str !== 'string') return;
            var y = Math.round(it.transform[5]);
            if (!cur || Math.abs(cur.y - y) > 3) { cur = { y: y, t: '' }; lignes.push(cur); }
            cur.t += it.str;
          });
        });
      })(i);
      return suite.then(function () { return lignes.map(function (l) { return l.t; }); });
    });
  }
  /* ───────── Arbre ascendant dessiné (Geneanet « Arbre généalogique de … ») ─────────
     Une boîte par ancêtre, rangées par génération : 1 boîte, puis 2, 4, 8… Dans chaque rangée, de gauche à droite,
     les boîtes suivent la numérotation Sosa : les parents de la boîte n sont 2n (père) et 2n+1 (mère).
     On lit les rectangles dessinés et le texte qu'ils contiennent : les liens viennent de la place des boîtes,
     pas de l'ordre du texte. */
  function geometriePdf(pg) {
    var O = window.pdfjsLib.OPS;
    return Promise.all([pg.getOperatorList(), pg.getTextContent()]).then(function (res) {
      var ops = res[0], tc = res[1], ctm = [1, 0, 0, 1, 0, 0], pile = [], rects = [], vus = {};
      function mul(m, n) { return [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3], m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]]; }
      function pt(x, y) { return [ctm[0] * x + ctm[2] * y + ctm[4], ctm[1] * x + ctm[3] * y + ctm[5]]; }
      for (var i = 0; i < ops.fnArray.length; i++) {
        var f = ops.fnArray[i], a = ops.argsArray[i];
        if (f === O.save) pile.push(ctm.slice());
        else if (f === O.restore) ctm = pile.pop() || ctm;
        else if (f === O.transform) ctm = mul(ctm, a);
        else if (f === O.constructPath && a && a[2] && a[2].length === 4) {
          var mm = a[2], p1 = pt(mm[0], mm[2]), p2 = pt(mm[1], mm[3]);
          var r = { x: Math.min(p1[0], p2[0]), y: Math.min(p1[1], p2[1]) };
          r.w = Math.abs(p2[0] - p1[0]); r.h = Math.abs(p2[1] - p1[1]);
          if (r.w < 4 || r.h < 4) continue;
          var k = Math.round(r.x) + ':' + Math.round(r.y) + ':' + Math.round(r.w) + ':' + Math.round(r.h);
          if (!vus[k]) { vus[k] = 1; rects.push(r); }
        }
      }
      var textes = tc.items.filter(function (t) { return t.str && t.str.trim(); }).map(function (t) {
        return { s: t.str.trim(), x: t.transform[4], y: t.transform[5], taille: Math.round(Math.hypot(t.transform[0], t.transform[1]) * 10) / 10, rot: Math.abs(t.transform[1]) > Math.abs(t.transform[0]) };
      });
      return { rects: rects, textes: textes };
    });
  }
  function puissance2(n) { return n > 0 && (n & (n - 1)) === 0; }
  function lireAscendant(geo) {
    // Rangées de boîtes de même taille et même hauteur : 1, 2, 4, 8… boîtes
    var rangs = {};
    geo.rects.forEach(function (r) { if (r.w > 300 || r.h > 300) return; var k = Math.round(r.y) + ':' + Math.round(r.w) + ':' + Math.round(r.h); (rangs[k] = rangs[k] || []).push(r); });
    var parN = {};
    Object.keys(rangs).forEach(function (k) {
      var l = rangs[k]; if (!puissance2(l.length) || l.length > 4096) return;
      var g = Math.log2(l.length);
      // À nombre égal, la boîte de personne est la plus haute (l'autre rangée porte les dates de mariage)
      if (!parN[g] || l[0].h > parN[g][0].h) parN[g] = l;
    });
    var gens = Object.keys(parN).map(Number).sort(function (a, b) { return a - b; });
    if (gens[0] !== 0 || gens.length < 3 || gens[1] !== 1 || gens[2] !== 2) return null;
    function dedans(t, r) { return t.x >= r.x - 1 && t.x <= r.x + r.w + 1 && t.y >= r.y - 1 && t.y <= r.y + r.h + 1; }
    var personnes = [], rels = [], parSosa = {}, parCle = {}, n = 0;
    gens.forEach(function (g) {
      var boites = parN[g].slice().sort(function (a, b) { return a.x - b.x; });
      boites.forEach(function (b, i) {
        var tx = geo.textes.filter(function (t) { return dedans(t, b); });
        if (!tx.some(function (t) { return /\p{L}{2}/u.test(t.s); })) return;
        var rot = tx[0].rot;
        // Ordre de lecture : de haut en bas (ou de gauche à droite si le texte est vertical)
        tx.sort(function (u, v) { return rot ? u.x - v.x : v.y - u.y; });
        var grand = Math.max.apply(null, tx.map(function (t) { return t.taille; }));
        var nomTxt = tx.filter(function (t) { return t.taille >= grand - 0.2; }).map(function (t) { return t.s; }).join(' ');
        var details = tx.filter(function (t) { return t.taille < grand - 0.2; }).map(function (t) { return t.s; });
        var sosa = Math.pow(2, g) + i;
        var nm = lireNom(nomTxt.replace(/\s+/g, ' ')) || lireNomLibre(nomTxt, {}) || { prenom: nomTxt, nom: '' };
        var p = { prenom: nm.prenom, nom: nm.nom, sex: sosa === 1 ? sexePrenom(nm.prenom) : (sosa % 2 ? 'f' : 'm'), naiss: '', deces: '', decede: false, lieu: '', metier: '', notes: [], doutes: [], ne: '', events: [] };
        if (nm.variante) p.notes.push('Autre graphie : ' + nm.variante);
        details.forEach(function (d) {
          var md = d.match(/^([~<>]?\s*\d{4})?\s*[–-]\s*([~<>]?\s*\d{4})?$/);
          if (md && (md[1] || md[2])) {
            if (md[1]) { p.naiss = md[1].replace(/\D/g, ''); if (/[~<>]/.test(md[1])) p.notes.push('Naissance : ' + md[1].replace(/\s+/g, ' ')); }
            if (md[2]) { p.deces = md[2].replace(/\D/g, ''); if (/[~<>]/.test(md[2])) p.notes.push('Décès : ' + md[2].replace(/\s+/g, ' ')); }
            if (/[–-]/.test(d)) p.decede = true;
          } else if (/^\(.*\)$/.test(d)) p.notes.push('Autre graphie : ' + d.slice(1, -1));
          else if (/^\p{Lu}[\p{Lu}'’ -]+$/u.test(d) && !p.nom) p.nom = d;
          else if (/^\p{Lu}[\p{Lu}'’ -]+$/u.test(d)) p.nom = (p.nom + ' ' + d).trim();
          else if (!p.metier) p.metier = d;
          else p.metier += ' / ' + d;
        });
        if (p.naiss && +p.naiss < new Date().getFullYear() - 110) p.decede = true;
        p.notes = p.notes.join('\n');
        // Un même ancêtre peut apparaître dans deux branches (implexe) : une seule fiche
        var cleP = cle(p.prenom) + '|' + cle(p.nom) + '|' + p.naiss + '|' + p.deces;
        var ex = (p.naiss || p.deces) && parCle[cleP];
        if (ex) { parSosa[sosa] = ex; return; }
        p.id = 'a' + (++n); p.notes = p.notes ? [p.notes] : [];
        personnes.push(p); parSosa[sosa] = p; parCle[cleP] = p;
      });
    });
    if (personnes.length < 3) return null;
    var dejaRel = {};
    function rel(o) { var k = o.type + o.from + '>' + o.to; if (dejaRel[k]) return; dejaRel[k] = 1; rels.push(o); }
    Object.keys(parSosa).forEach(function (s) {
      s = +s; var enf = parSosa[s], pere = parSosa[2 * s], mere = parSosa[2 * s + 1];
      if (pere) rel({ type: 'parent', from: pere.id, to: enf.id });
      if (mere) rel({ type: 'parent', from: mere.id, to: enf.id });
      if (pere && mere && !dejaRel['couple' + mere.id + '>' + pere.id]) rel({ type: 'couple', from: pere.id, to: mere.id, statut: 'marie' });
    });
    return { personnes: personnes, rels: rels, ascendant: true };
  }
  function lirePdf(buf) {
    var copie = buf.slice(0); // pdf.js garde le tampon pour lui : une copie pour la lecture ligne par ligne
    return chargerPdfJs().then(function (lib) { return lib.getDocument({ data: buf }).promise; }).then(function (doc) {
      var essai = doc.numPages === 1 ? doc.getPage(1).then(geometriePdf).then(lireAscendant).catch(function () { return null; }) : Promise.resolve(null);
      return essai.then(function (r) { return r || lignesPdf(copie); });
    });
  }
  function texteFichier(buf) {
    try { return new TextDecoder('utf-8', { fatal: true }).decode(buf); } catch (e) { return new TextDecoder('windows-1252').decode(buf); }
  }

  var resultat = null, nomFichier = '';
  function message(titre, html) {
    $('fi-titre').textContent = titre; $('fi-sous').textContent = nomFichier;
    $('fi-corps').innerHTML = html;
    $('fi-ok').hidden = true;
  }
  function choisir() {
    if (G.exemple()) { alert('Tu regardes l’exemple. Ouvre ton propre arbre pour importer le tien.'); return; }
    G.fermer('fen-sauve');
    $('fichier-import').click();
  }
  ['bt-importer', 'bt-importer-vide'].forEach(function (id) { if ($(id)) $(id).addEventListener('click', choisir); });

  $('fichier-import').addEventListener('change', function (e) {
    var f = e.target.files[0]; e.target.value = '';
    if (!f) return;
    nomFichier = f.name;
    var ext = (f.name.split('.').pop() || '').toLowerCase();
    message('Lecture du fichier…', '<p class="fi-aide">Un instant, ton arbre est en cours de lecture.</p>');
    G.ouvrir('fen-import');
    var aide = 'Si ton arbre vient d’un logiciel ou d’un site de généalogie (Geneanet, Heredis, MyHeritage, Ancestry…), exporte-le plutôt en <b>GEDCOM (.ged)</b> : c’est le format le plus fiable, et tu peux l’importer ici.';
    f.arrayBuffer().then(function (buf) {
      if (ext === 'pdf' || f.type === 'application/pdf') {
        return lirePdf(buf.slice(0)).then(function (lignes) {
          if (lignes && lignes.ascendant) return lignes;
          if (!lignes.some(function (l) { return /\p{L}{3}/u.test(l); })) {
            message('Ce PDF ne contient pas de texte', '<p class="fi-aide">C’est sans doute un scan ou une photo. Pour l’instant, l’import fonctionne avec les PDF qui contiennent du texte, comme ceux créés par un logiciel de généalogie.</p><p class="fi-aide">' + aide + '</p>');
            return null;
          }
          return lireLignes(lignes);
        });
      }
      if (ext === 'ged' || ext === 'gedcom') return lireGedcom(texteFichier(buf));
      message('Format non reconnu', '<p class="fi-aide">Choisis un fichier PDF ou GEDCOM (.ged).</p>');
      return null;
    }).then(function (r) {
      if (!r) return;
      if (!r.personnes.length) {
        message('Aucune personne reconnue', '<p class="fi-aide">La mise en page de ce fichier n’est pas encore prise en charge.</p><p class="fi-aide">' + aide + '</p>');
        return;
      }
      resultat = r; afficher();
    }).catch(function (err) {
      message('Lecture impossible', '<p class="fi-aide">' + (err && err.message === 'pdfjs' ? 'La lecture des PDF n’a pas pu se charger. Vérifie ta connexion internet et réessaie.' : 'Ce fichier n’a pas pu être lu. Il est peut-être protégé ou abîmé.') + '</p><p class="fi-aide">' + aide + '</p>');
    });
  });

  function nomP(p) { return ((p.prenom || '') + ' ' + (p.nom || '')).trim() || 'Sans prénom'; }
  function datesP(p) {
    var b = annee(p.naiss), d = annee(p.deces);
    return b && d ? b + ' – ' + d : b ? (p.sex === 'f' ? 'née en ' : p.sex === 'm' ? 'né en ' : 'naissance ') + b : d ? '† ' + d : (p.decede ? 'décédé·e' : '');
  }
  function afficher() {
    var r = resultat, par = {};
    r.personnes.forEach(function (p) { par[p.id] = p; });
    var arbre = G.personnes(), moiArbre = arbre.some(function (p) { return p.moi; });
    var opts = r.personnes.map(function (p) { return '<option value="' + p.id + '">' + esc(nomP(p)) + (datesP(p) ? ' (' + esc(datesP(p)) + ')' : '') + '</option>'; }).join('');
    var h = '<p class="fi-aide">' + (r.ascendant ? 'Arbre ascendant reconnu : les parents de chaque personne viennent de la place des boîtes dans le document. Un ancêtre présent dans deux branches n’apparaît qu’une fois.' : 'Les liens entre parents et enfants sont déduits de l’ordre du document.') + ' Décoche ce qui ne va pas : tu pourras tout compléter et corriger ensuite dans ton arbre.</p>';
    if (arbre.length) {
      h += '<div class="champ"><span class="etiq">Ton arbre contient déjà ' + arbre.length + ' personne' + (arbre.length > 1 ? 's' : '') + '</span>' +
        '<div class="choix"><label><input type="radio" name="fi-mode" value="ajouter" checked><span>Ajouter à mon arbre</span></label><label><input type="radio" name="fi-mode" value="remplacer"><span>Remplacer mon arbre</span></label></div></div>' +
        '<div class="champ" id="fi-bloc-meme"><label for="fi-meme-doc">Quelqu’un du document est déjà dans ton arbre ?</label>' +
        '<div class="deux-col"><select id="fi-meme-doc" aria-label="Personne du document"><option value="">Non</option>' + opts + '</select>' +
        '<select id="fi-meme-arbre" aria-label="Personne de ton arbre">' + arbre.map(function (p) { return '<option value="' + esc(p.id) + '">' + esc(p.nom) + '</option>'; }).join('') + '</select></div>' +
        '<span class="aide">Les deux fiches seront réunies en une seule, ce qui relie le document à ton arbre.</span></div>';
    }
    h += '<div class="champ" id="fi-bloc-moi"><label for="fi-moi">Qui es-tu dans cet arbre ?</label><select id="fi-moi"><option value="">Choisis…</option><option value="-">Je ne suis pas dans ce document</option>' + opts + '</select>' +
      '<span class="aide">Les répétitions de dates et d’âges se calculent à partir de toi.</span></div>';
    h += '<h3 class="sous-titre">' + r.personnes.length + ' personne' + (r.personnes.length > 1 ? 's' : '') + ' trouvée' + (r.personnes.length > 1 ? 's' : '') + '</h3><div class="fi-liste">';
    r.personnes.forEach(function (p) {
      var parents = r.rels.filter(function (x) { return x.type === 'parent' && x.to === p.id; }).map(function (x) { return nomP(par[x.from]); });
      var couples = r.rels.filter(function (x) { return x.type === 'couple' && (x.from === p.id || x.to === p.id); }).map(function (x) { return nomP(par[x.from === p.id ? x.to : x.from]) + (x.statut === 'divorce' ? ' (divorcé·es)' : ''); });
      var infos = [p.lieu, p.metier].filter(Boolean).join(' · ');
      var liens = [];
      if (parents.length) liens.push((p.sex === 'f' ? 'Fille de ' : p.sex === 'm' ? 'Fils de ' : 'Enfant de ') + parents.join(' et '));
      if (couples.length) liens.push('En couple avec ' + couples.join(', '));
      h += '<label class="fi-ligne"><input type="checkbox" data-fi="' + p.id + '" checked><span><b>' + esc(nomP(p)) + '</b><span class="fi-dates">' + esc(datesP(p)) + '</span>' +
        (infos ? '<span class="fi-info">' + esc(infos) + '</span>' : '') +
        (liens.length ? '<span class="fi-info">' + esc(liens.join(' · ')) + '</span>' : '') +
        p.doutes.map(function (d) { return '<span class="fi-doute">À vérifier : ' + esc(d) + '</span>'; }).join('') + '</span></label>';
    });
    h += '</div><p class="fi-aide" id="fi-limite" hidden></p><p class="erreur" id="fi-erreur" role="alert"></p>';
    $('fi-titre').textContent = 'Vérifie avant d’importer';
    $('fi-sous').textContent = nomFichier;
    $('fi-corps').innerHTML = h;
    $('fi-ok').hidden = false;
    function maj() {
      var mode = document.querySelector('input[name="fi-mode"]:checked'), remplacer = !mode || mode.value === 'remplacer';
      if ($('fi-bloc-meme')) $('fi-bloc-meme').hidden = remplacer;
      $('fi-bloc-moi').hidden = !remplacer && moiArbre;
      var n = document.querySelectorAll('[data-fi]:checked').length;
      $('fi-ok').textContent = 'Importer ' + n + ' personne' + (n > 1 ? 's' : '');
      $('fi-ok').disabled = !n;
    }
    // Limite à 6 générations autour de toi : toi, tes parents… jusqu'à tes arrière-arrière-arrière-grands-parents (et 3 générations de descendants)
    function limiter(moiId) {
      var z = $('fi-limite'), dist = {}, file = [moiId]; dist[moiId] = 0;
      if (!moiId || !par[moiId]) { z.hidden = true; return; }
      while (file.length) {
        var a = file.shift(), g = dist[a];
        r.rels.forEach(function (x) {
          var b = null, ng = g;
          if (x.type === 'parent' && x.to === a) { b = x.from; ng = g + 1; }
          else if (x.type === 'parent' && x.from === a) { b = x.to; ng = g - 1; }
          else if ((x.type === 'couple' || x.type === 'fratrie') && (x.from === a || x.to === a)) b = x.from === a ? x.to : x.from;
          if (b && dist[b] === undefined && ng <= 5 && ng >= -3) { dist[b] = ng; file.push(b); }
        });
      }
      var n = 0;
      document.querySelectorAll('[data-fi]').forEach(function (c) {
        var dedans = dist[c.getAttribute('data-fi')] !== undefined;
        c.checked = dedans; c.closest('.fi-ligne').classList.toggle('off', !dedans);
        if (!dedans) n++;
      });
      z.hidden = !n;
      z.innerHTML = n ? '<b>' + n + ' personne' + (n > 1 ? 's' : '') + ' décochée' + (n > 1 ? 's' : '') + '</b> : l’arbre est limité à 6 générations autour de toi, pour rester lisible. Tu peux en recocher si tu le souhaites.' : '';
    }
    $('fi-corps').onchange = function (e) {
      if (e.target.matches('[data-fi]')) e.target.closest('.fi-ligne').classList.toggle('off', !e.target.checked);
      if (e.target.id === 'fi-moi') limiter(e.target.value === '-' ? '' : e.target.value);
      maj();
    };
    maj();
  }

  $('fi-ok').addEventListener('click', function () {
    if (!resultat) return;
    var err = $('fi-erreur');
    var garder = {};
    document.querySelectorAll('[data-fi]:checked').forEach(function (c) { garder[c.getAttribute('data-fi')] = 1; });
    var mode = document.querySelector('input[name="fi-mode"]:checked'), remplacer = !mode || mode.value === 'remplacer';
    var moi = $('fi-bloc-moi').hidden ? '' : $('fi-moi').value;
    if (!$('fi-bloc-moi').hidden && !moi) { err.textContent = 'Indique qui tu es dans cet arbre, ou choisis « Je ne suis pas dans ce document ».'; $('fi-moi').focus(); return; }
    if (moi && moi !== '-' && !garder[moi]) { err.textContent = 'La personne que tu as choisie comme « toi » est décochée.'; return; }
    var meme = null;
    if (!remplacer && $('fi-meme-doc') && $('fi-meme-doc').value) {
      meme = { fichier: $('fi-meme-doc').value, arbre: $('fi-meme-arbre').value };
      if (!garder[meme.fichier]) { err.textContent = 'La personne à réunir avec ton arbre est décochée.'; return; }
    }
    if (remplacer && G.personnes().length && !confirm('Remplacer ton arbre actuel par celui du fichier ? Tu pourras revenir en arrière avec « Annuler ».')) return;
    var people = {};
    resultat.personnes.forEach(function (p) {
      if (!garder[p.id]) return;
      people[p.id] = { prenom: p.prenom, nom: p.nom, sex: p.sex, naiss: p.naiss, deces: p.deces, decede: !!(p.deces || p.decede), metier: p.metier, lieu: p.lieu, notes: p.notes, events: p.events };
    });
    var rels = resultat.rels.filter(function (x) { return garder[x.from] && garder[x.to]; });
    G.importer({ people: people, rels: rels }, { remplacer: remplacer, moi: moi && moi !== '-' ? moi : '', meme: meme });
    resultat = null;
    G.fermer('fen-import');
  });
})();
