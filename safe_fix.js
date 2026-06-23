const fs = require('fs');
const path = require('path');

const corrections = {
  'S\ufffdn\ufffdgal': 'Sénégal',
  'S\ufffdN\ufffdGal': 'SÉNÉGAL',
  'S\ufffdN\ufffdGAL': 'SÉNÉGAL',
  'Acc\ufffdder': 'Accéder',
  'exp\ufffdriences': 'expériences',
  '\ufffdtapes': 'étapes',
  '\ufffdtape': 'étape',
  "jusqu'\ufffd": "jusqu'à",
  'r\ufffdactivit\ufffd': 'réactivité',
  'Fr\ufffdquemment': 'Fréquemment',
  'Pos\ufffdes': 'Posées',
  'compil\ufffd': 'compilé',
  'fr\ufffdquentes': 'fréquentes',
  'd\ufffdmarches': 'démarches',
  'Exp\ufffdrience': 'Expérience',
  'C\ufffdur': 'Cœur',
  '\ufffdco-tourisme': 'Éco-tourisme',
  'certifi\ufffds': 'certifiés',
  'D\ufffdcouvrir': 'Découvrir',
  'pens\ufffds': 'pensés',
  'R\ufffdservation': 'Réservation',
  's\ufffdcuris\ufffd': 'sécurisé',
  'imm\ufffddiate': 'immédiate',
  'Gor\ufffde': 'Gorée',
  'D\ufffdcouvrez': 'Découvrez',
  'r\ufffdserver': 'réserver',
  'G\ufffdn\ufffdrales': 'Générales',
  'S\ufffdcurit\ufffd': 'Sécurité',
  'd\ufffdtails': 'détails',
  'T\ufffdl\ufffdphone': 'Téléphone',
  't\ufffdl\ufffdphone': 'téléphone',
  'T\ufffdl\ufffdcharger': 'Télécharger',
  't\ufffdl\ufffdcharger': 'télécharger',
  'M\ufffdme': 'Même',
  'm\ufffdme': 'même',
  '\ufffdv\ufffdnements': 'événements',
  'v\ufffdt\ufffdrinaire': 'vétérinaire',
  '\ufffdquipement': 'équipement',
  '\ufffdquipements': 'équipements',
  '\ufffdch\ufffdance': 'échéance',
  'pr\ufffdc\ufffddente': 'précédente',
  'pr\ufffdc\ufffddent': 'précédent',
  'D\ufffdbut': 'Début',
  'd\ufffdbut': 'début',
  'Dur\ufffde': 'Durée',
  'dur\ufffde': 'durée',
  'Qualit\ufffd': 'Qualité',
  'qualit\ufffd': 'qualité',
  'Num\ufffdro': 'Numéro',
  'num\ufffdro': 'numéro',
  'Cat\ufffdgorie': 'Catégorie',
  'cat\ufffdgorie': 'catégorie',
  'D\ufffdclaration': 'Déclaration',
  'd\ufffdclaration': 'déclaration',
  'V\ufffdrifier': 'Vérifier',
  'v\ufffdrifier': 'vérifier',
  'B\ufffdtail': 'Bétail',
  'b\ufffdtail': 'bétail',
  'cr\ufffd\ufffde': 'créée',
  'propri\ufffdt\ufffd': 'propriété',
  'param\ufffdtre': 'paramètre',
  'd\ufffdj\ufffd': 'déjà',
  'Tr\ufffds': 'Très',
  'tr\ufffds': 'très',
  '\ufffdcran': 'écran',
  'cach\ufffd': 'caché',
  'R\ufffdseaux': 'Réseaux',
  'r\ufffdseaux': 'réseaux',
  'S\ufffdcuris\ufffd': 'Sécurisé',
  'v\ufffdtre': 'vôtre',
  'cr\ufffder': 'créer',
  'Cr\ufffder': 'Créer',
  'co\ufffdt': 'coût',
  'H\ufffdbergement': 'Hébergement',
  'h\ufffdbergement': 'hébergement',
  'D\ufffdtails': 'Détails',
  's\ufffdjour': 'séjour',
  'S\ufffdjour': 'Séjour',
  'pr\ufffdts': 'prêts',
  'Pr\ufffdts': 'Prêts',
  'D\ufffdvelopp\ufffd': 'Développé',
  'd\ufffdvelopp\ufffd': 'développé',
  'prot\ufffdg\ufffds': 'protégés',
  'r\ufffdserv\ufffds': 'réservés',
  'R\ufffdserv\ufffds': 'Réservés',
  'acc\ufffds': 'accès',
  'Acc\ufffds': 'Accès',
  'B\ufffdtiment': 'Bâtiment',
  'b\ufffdtiment': 'bâtiment',
  'O\ufffd': 'Où',
  'o\ufffd': 'où',
  'R\ufffdsum\ufffd': 'Résumé',
  'r\ufffdsum\ufffd': 'résumé',
  'v\ufffdrifi\ufffd': 'vérifié',
  'V\ufffdrifi\ufffd': 'Vérifié',
  'cl\ufffdturer': 'clôturer',
  'Cl\ufffdturer': 'Clôturer',
  'r\ufffdgler': 'régler',
  'R\ufffdgler': 'Régler'
};

function fixEncoding(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      fixEncoding(file);
    } else {
      if (file.endsWith('.ts') || file.endsWith('.html') || file.endsWith('.scss')) {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;
        
        for (const [bad, good] of Object.entries(corrections)) {
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

fixEncoding('C:/Users/Ismaila Ngom/Documents/portail-tourisme/src');
