/* Genesolia · Le Cercle · le numéro de version du suivi et du carnet.
   UNE SEULE CONSTANTE À CHANGER à chaque mise à jour de : assets/mon-carnet.js, assets/suivi/*.js, assets/carnets/*.js,
   assets/plus/*.js, assets/livre.css, assets/site.js… (par exemple la date du jour, puis une lettre : '2026-10-12b').
   Elle est ajoutée en ?v=… à tous les scripts, contenus et feuilles de style de mon-suivi-mois.html et mon-carnet.html :
   le navigateur recharge alors les nouveaux fichiers au lieu de garder les anciens.
   Ce fichier lui-même est toujours rechargé (les deux pages le demandent avec ?t=heure). sw.js reste « réseau d'abord ». */
window.GENESOLIA_V = '2026-10-13c';
window.genesoliaVersion = function (src) { return src + (src.indexOf('?') < 0 ? '?' : '&') + 'v=' + encodeURIComponent(window.GENESOLIA_V); };
/* Écrit les balises pendant la lecture de la page (même ordre, même effet que des balises <script> ou <link> ordinaires) */
window.genesoliaEcrire = function (liste) {
  liste.forEach(function (s) {
    document.write(/\.css$/.test(s) ? '<link rel="stylesheet" href="' + window.genesoliaVersion(s) + '">' : '<script src="' + window.genesoliaVersion(s) + '"><\/script>');
  });
};
