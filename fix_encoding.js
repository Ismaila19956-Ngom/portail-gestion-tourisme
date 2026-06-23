const fs = require('fs');
const path = require('path');

const R = '\uFFFD';
const replacements = {
  ['S' + R + 'n' + R + 'gal']: 'Sénégal',
  ['d' + R + 'couvrir']: 'découvrir',
  ['D' + R + 'couvrir']: 'Découvrir',
  ['T' + R + 'ranga']: 'Téranga',
  ['T' + R + 'l' + R + 'phone']: 'Téléphone',
  ['Si' + R + 'ge']: 'Siège',
  ['l' + R + 'gales']: 'légales',
  ['confidentialit' + R]: 'confidentialité',
  ['r' + R + 'seau']: 'réseau',
  ['R' + R + 'seau']: 'Réseau',
  ['r' + R + 'seaux']: 'réseaux',
  ['R' + R + 'seaux']: 'Réseaux',
  ['cr' + R + 'ation']: 'création',
  ['num' + R + 'ro']: 'numéro',
  ['Num' + R + 'ro']: 'Numéro',
  ['pr' + R + 'nom']: 'prénom',
  ['Pr' + R + 'nom']: 'Prénom',
  ['d' + R + 'tails']: 'détails',
  ['D' + R + 'tails']: 'Détails',
  ['actualit' + R + 's']: 'actualités',
  ['Actualit' + R + 's']: 'Actualités',
  ['Cat' + R + 'gorie']: 'Catégorie',
  ['cat' + R + 'gorie']: 'catégorie',
  ['assur' + R]: 'assuré',
  ['assur' + R + 's']: 'assurés',
  ['r' + R + 'gion']: 'région',
  ['R' + R + 'gion']: 'Région',
  ['dur' + R + 'e']: 'durée',
  ['g' + R + 'n' + R + 'ral']: 'général',
  ['G' + R + 'n' + R + 'rales']: 'Générales',
  ['d' + R + 'c' + R + 's']: 'décès',
  ['donn' + R + 'es']: 'données',
  ['' + R + 'tape']: 'étape',
  ['' + R + 'tapes']: 'étapes',
  ['a' + R + 'roport']: 'aéroport',
  ['A' + R + 'roport']: 'Aéroport',
  ['M' + R + 'dina']: 'Médina',
  ['S' + R + 'curit' + R]: 'Sécurité',
  ['s' + R + 'curit' + R]: 'sécurité',
  ['' + R + 'crire']: 'écrire',
  ['Ann' + R + 'e']: 'Année',
  ['ann' + R + 'e']: 'année',
  ['' + R + 'v' + R + 'nements']: 'événements',
  ['' + R + 'v' + R + 'nement']: 'événement',
  ['d' + R + 'j' + R]: 'déjà',
  ['v' + R + 'hicule']: 'véhicule',
  ['V' + R + 'hicule']: 'Véhicule',
  ['M' + R + 'me']: 'Même',
  ['m' + R + 'me']: 'même',
  ['tr' + R + 's']: 'très',
  ['Tr' + R + 's']: 'Très',
  ['apr' + R + 's']: 'après',
  ['Ao' + R + 't']: 'Août',
  ['ao' + R + 't']: 'août',
  ['D' + R + 'cembre']: 'Décembre',
  ['F' + R + 'vrier']: 'Février',
  ['f' + R + 'vrier']: 'février',
  ['b' + R + 'n' + R + 'ficier']: 'bénéficier',
  ['B' + R + 'timent']: 'Bâtiment',
  ['b' + R + 'timent']: 'bâtiment',
  ['P' + R + 'riode']: 'Période',
  ['p' + R + 'riode']: 'période',
  ['R' + R + 'servez']: 'Réservez',
  ['r' + R + 'servez']: 'réservez',
  ['Exp' + R + 'rience']: 'Expérience',
  ['exp' + R + 'rience']: 'expérience',
  ['S' + R + 'jour']: 'Séjour',
  ['s' + R + 'jour']: 'séjour',
  [' ' + R + ' ']: ' à ',
  [' o' + R + ' ']: ' où ',
  ['O' + R + ' ']: 'Où ',
  ['' + R + 'l' + R + 'gant']: 'élégant',
  ['' + R + 'l' + R + 'ments']: 'éléments',
  ['' + R + 'l' + R + 'ment']: 'élément',
  ['T' + R + 'moignages']: 'Témoignages',
  ['t' + R + 'moignages']: 'témoignages',
  ['' + R + 'quipes']: 'équipes',
  ['' + R + 'quipe']: 'équipe',
  ['D' + R + 'veloppement']: 'Développement',
  ['d' + R + 'veloppement']: 'développement',
  ['' + R + 'a']: 'ça',
  ['R' + R + 'server']: 'Réserver',
  ['r' + R + 'server']: 'réserver',
  ['D' + R + 'claration']: 'Déclaration',
  ['d' + R + 'claration']: 'déclaration',
  ['Pi' + R + 'ces']: 'Pièces',
  ['pi' + R + 'ces']: 'pièces',
  ['soci' + R + 't' + R]: 'société',
  ['Soci' + R + 't' + R]: 'Société',
  ['cl' + R]: 'clé',
  ['cl' + R + 's']: 'clés'
};

function walk(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      walk(file);
    } else {
      if (file.endsWith('.html') || file.endsWith('.ts')) {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;
        for (const [bad, good] of Object.entries(replacements)) {
          if (content.includes(bad)) {
            content = content.split(bad).join(good);
            modified = true;
          }
        }
        if (modified) {
          fs.writeFileSync(file, content, 'utf8');
          console.log('Fixed ' + file);
        }
      }
    }
  });
}

walk('src/app');
