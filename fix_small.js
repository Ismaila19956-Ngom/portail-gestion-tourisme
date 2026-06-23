const fs = require('fs');

// Fix topbar globe
let topbarPath = 'C:/Users/Ismaila Ngom/Documents/portail-tourisme/src/app/components/topbar/topbar.component.html';
let topbarContent = fs.readFileSync(topbarPath, 'utf8');
if (topbarContent.includes('ðŸŒ ')) {
    topbarContent = topbarContent.replace(/ðŸŒ /g, '🌍');
    fs.writeFileSync(topbarPath, topbarContent, 'utf8');
}

// Fix hero bullet points
let heroPath = 'C:/Users/Ismaila Ngom/Documents/portail-tourisme/src/app/views/home-1/components/hero/hero.component.ts';
let heroContent = fs.readFileSync(heroPath, 'utf8');
// Replace the replacement characters with bullets
heroContent = heroContent.replace(/Excursions inoubliables \ufffd Dakar, Gorée, Saloum, Casamance/g, 'Excursions inoubliables • Dakar, Gorée, Saloum, Casamance');
heroContent = heroContent.replace(/Réservation en ligne \ufffd Paiement sécurisé \ufffd Confirmation immédiate/g, 'Réservation en ligne • Paiement sécurisé • Confirmation immédiate');
heroContent = heroContent.replace(/Éco-tourisme responsable \ufffd Guides certifiés \ufffd Satisfaction garantie/g, 'Éco-tourisme responsable • Guides certifiés • Satisfaction garantie');

// Fallback: replace any remaining replacement characters with bullet point
heroContent = heroContent.replace(/\ufffd/g, '•');

fs.writeFileSync(heroPath, heroContent, 'utf8');
console.log('Fixed globe and bullets!');
