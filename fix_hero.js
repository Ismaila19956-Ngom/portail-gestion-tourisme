const fs = require('fs');
let c = fs.readFileSync('C:/Users/Ismaila Ngom/Documents/portail-tourisme/src/app/views/home-1/components/hero/hero.component.ts', 'utf8');

c = c.replace(/D\ufffdcouvrez le S\ufffdn\ufffdgal Authentique avec des Guides Locaux/g, 'Découvrez le Sénégal Authentique avec des Guides Locaux')
     .replace(/Excursions inoubliables - Dakar, Gor\ufffde, Saloum, Casamance/g, 'Excursions inoubliables - Dakar, Gorée, Saloum, Casamance')
     .replace(/Des Circuits Sur Mesure pour Tous les Voyageurs/g, 'Des Circuits Sur Mesure Pour Tous Les Voyageurs')
     .replace(/R\ufffdservation en ligne - Paiement s\ufffdcuris\ufffd - Confirmation imm\ufffddiate/g, 'Réservation en ligne • Paiement sécurisé • Confirmation immédiate')
     .replace(/Vivez une Exp\ufffdrience Unique au C\ufffd"ur de l\'Afrique/g, 'Vivez une Expérience Unique au Cœur de l\\'Afrique')
     .replace(/\ufffdco-tourisme responsable - Guides certifi\ufffds - Satisfaction garantie/g, 'Éco-tourisme responsable - Guides certifiés - Satisfaction garantie');

fs.writeFileSync('C:/Users/Ismaila Ngom/Documents/portail-tourisme/src/app/views/home-1/components/hero/hero.component.ts', c, 'utf8');
console.log('Fixed hero component!');
