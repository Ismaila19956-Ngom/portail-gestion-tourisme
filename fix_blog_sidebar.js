const fs = require('fs');
let p = 'C:/Users/Ismaila Ngom/Documents/portail-tourisme/src/app/views/blogs/blog-sidebar/blog-sidebar.component.html';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(/produits\/hf_20260311_163904_c2646f0e-6619-49af-8072-281498895f7c\.jpeg/g, 'tourisme/tourism_guide_hero.png');
c = c.replace(/agronomes et vétérinaires pour s\ufffdcuriser et optimiser\s*votre production touristique/g, 'guides touristiques et experts locaux pour vous faire vivre\n                        les meilleures expériences');
c = c.replace(/agronomes et vétérinaires pour sécuriser et optimiser\s*votre production touristique/g, 'guides touristiques et experts locaux pour vous faire vivre\n                        les meilleures expériences');
c = c.replace(/s\ufffdcuriser/g, 'sécuriser');
c = c.replace(/R\ufffdgions/g, 'Régions');
c = c.replace(/Actualit\ufffds/g, 'Actualités');
c = c.replace(/r\ufffdcent/g, 'récent');
c = c.replace(/trouv\ufffds/g, 'trouvés');
c = c.replace(/trouv\ufffd/g, 'trouvé');
c = c.replace(/R\ufffdcolte/g, 'Traditions');
c = c.replace(/Cultures & Traditions/g, 'Cultures & Traditions');

fs.writeFileSync(p, c, 'utf8');

let p2 = 'C:/Users/Ismaila Ngom/Documents/portail-tourisme/src/app/views/blogs/blog-sidebar/blog-sidebar.component.ts';
let c2 = fs.readFileSync(p2, 'utf8');
c2 = c2.replace(/Cultures & R\ufffdcolte/g, 'Cultures & Traditions');
c2 = c2.replace(/R\ufffdcolte/g, 'Traditions');
fs.writeFileSync(p2, c2, 'utf8');

console.log('Fixed blog-sidebar files');
