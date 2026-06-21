const fs = require('fs');

let topbarTs = fs.readFileSync('src/app/components/topbar/topbar.component.ts', 'utf8');
topbarTs = "import { serviceData } from '../../views/home-1/components/data';\n" + topbarTs;
topbarTs = topbarTs.replace(/this\.api\.getProduits\(\)\.subscribe\(produits => \{[\s\S]*?\}\);/, `this.tousLesProduits = serviceData.map(p => ({
    id: p.id || 0,
    title: p.title || '',
    icon: p.icon || '',
    image: p.image || '',
    desc: p.content || '',
    link: \`/excursions/detail/\${p.id}\`,
    category: 'Excursions',
    categorieId: 1
}));
this.refreshDisplayedProducts();`);
fs.writeFileSync('src/app/components/topbar/topbar.component.ts', topbarTs);

let mobileMenuTs = fs.readFileSync('src/app/components/mobile-menu/mobile-menu.component.ts', 'utf8');
mobileMenuTs = mobileMenuTs.replace(/this\.api\.getProduits\(\)\.subscribe\(\{[\s\S]*?error: \(\) => \{ \/\* Garder le sous-menu statique \*\/ \}[\s\S]*?\}\);/g, '');
fs.writeFileSync('src/app/components/mobile-menu/mobile-menu.component.ts', mobileMenuTs);

let mobileMenuHtml = fs.readFileSync('src/app/components/mobile-menu/mobile-menu.component.html', 'utf8');
mobileMenuHtml = mobileMenuHtml.replace('<div class="mobile-sidebar', '<div *ngIf="isMenuOpen" class="mobile-menu-overlay" (click)="closeMenu()" style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 99;"></div>\n<div class="mobile-sidebar');
mobileMenuHtml = mobileMenuHtml.replace('z-index: 99;"></div>\n<div class="mobile-sidebar {{mobileSidebarClass}}" [ngClass]="{ \'mobile-menu-active\': isMenuOpen }" style="background-color: var(--sp-primary-1, #4CAF50);"', 'z-index: 99;"></div>\n<div class="mobile-sidebar {{mobileSidebarClass}}" [ngClass]="{ \'mobile-menu-active\': isMenuOpen }" style="background-color: var(--sp-primary-1, #4CAF50); z-index: 100;"');
fs.writeFileSync('src/app/components/mobile-menu/mobile-menu.component.html', mobileMenuHtml);

let contactTs = fs.readFileSync('src/app/views/home-1/components/contact/contact.component.ts', 'utf8');
contactTs = "import { serviceData } from '../data';\n" + contactTs;
contactTs = contactTs.replace(/this\.apiService\.getProduits\(\)\.subscribe\(\{[\s\S]*?\}\);/, `this.produits = serviceData.map(s => ({
  id: s.id,
  nom: s.title,
  description: s.content,
  image: s.image,
  categoryId: 1
})) as any;`);
fs.writeFileSync('src/app/views/home-1/components/contact/contact.component.ts', contactTs);

let heroHtml = fs.readFileSync('src/app/views/home-1/components/hero/hero.component.html', 'utf8');
heroHtml = heroHtml.replace(/routerLink="\/contact-us"/g, 'href="#devis-form"');
fs.writeFileSync('src/app/views/home-1/components/hero/hero.component.html', heroHtml);

let contactHtml = fs.readFileSync('src/app/views/home-1/components/contact/contact.component.html', 'utf8');
contactHtml = contactHtml.replace('<div class="contact1-section-area"', '<div id="devis-form" class="contact1-section-area"');
fs.writeFileSync('src/app/views/home-1/components/contact/contact.component.html', contactHtml);

console.log("All manual fixes applied!");
