const fs = require('fs');
const path = require('path');

function fixFile(f) {
    let content;
    try {
        content = fs.readFileSync(f, 'utf8');
    } catch(e) { return; }
    
    let original = content;
    
    content = content.replace(/SǸnǸgal/g, 'Sénégal');
    content = content.replace(/sǸnǸgal/g, 'sénégal');
    content = content.replace(/SǸNǸGAL/g, 'SÉNÉGAL');
    
    content = content.replace(/DǸcouvrir/g, 'Découvrir');
    content = content.replace(/dǸtail/g, 'détail');
    content = content.replace(/DǸtail/g, 'Détail');
    content = content.replace(/SǸcurisǸ/g, 'Sécurisé');
    content = content.replace(/sǸcurisǸ/g, 'sécurisé');
    content = content.replace(/Ǹquipe/g, 'équipe');
    content = content.replace(/ǸtǸ/g, 'été');
    content = content.replace(/rǸessayer/g, 'réessayer');
    content = content.replace(/prǸcisǸ/g, 'précisé');
    content = content.replace(/souhaitǸ/g, 'souhaité');
    content = content.replace(/gǸrǸ/g, 'géré');
    content = content.replace(/cǸtǸ/g, 'côté');
    content = content.replace(/confidentialitǸ/g, 'confidentialité');
    content = content.replace(/TǸlǸphone/g, 'Téléphone');
    content = content.replace(/Sige/g, 'Siège');
    content = content.replace(/dǸfini/g, 'défini');
    content = content.replace(/rǸseaux/g, 'réseaux');
    content = content.replace(/rǸseau/g, 'réseau');
    content = content.replace(/configurǸ/g, 'configuré');
    content = content.replace(/icne/g, 'icône');
    content = content.replace(/o"/g, '•');
    content = content.replace(/YO\?/g, '📍');

    content = content.replace(/Ǹ/g, 'é');
    content = content.replace(/ǩ/g, 'à');
    content = content.replace(/Ǧ/g, 'ê');
    content = content.replace(/ǟ/g, 'è');
    
    // Fix any previous 'à ' corruptions if there were any, though git checkout should have cleared it.
    // content = content.replace(/à /g, ' ');

    if (content !== original) {
        fs.writeFileSync(f, content, 'utf8');
    }
}

// Just fix the files we are modifying
fixFile('src/app/components/topbar/topbar.component.ts');
fixFile('src/app/components/topbar/topbar.component.html');
fixFile('src/app/components/mobile-menu/mobile-menu.component.ts');
fixFile('src/app/components/mobile-menu/mobile-menu.component.html');
fixFile('src/app/components/mobile-menu/mobile-nav-item/mobile-nav-item.component.html');
fixFile('src/app/views/home-1/components/contact/contact.component.ts');
fixFile('src/app/views/home-1/components/contact/contact.component.html');
fixFile('src/app/views/home-1/components/hero/hero.component.html');
fixFile('src/app/views/home-1/components/data.ts');
fixFile('src/app/views/services/components/data.ts');
fixFile('src/app/app.routes.ts');
fixFile('src/app/views/views.route.ts');
fixFile('src/app/views/other-pages/other-pages.route.ts');
fixFile('src/app/layouts/client-layout/client-layout.component.ts');
