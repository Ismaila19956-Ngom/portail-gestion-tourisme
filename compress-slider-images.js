/**
 * Script de compression des images du slider CNAAS
 * Réduit les images de 4–7 MB → ~200–400 KB (WebP)
 *
 * Usage :
 *   npm install sharp --save-dev
 *   node compress-slider-images.js
 */

const sharp = require('sharp');
const path  = require('path');
const fs    = require('fs');

const IMAGES_DIR = path.join(__dirname, 'src/assets/images/produits');
const OUTPUT_DIR = path.join(__dirname, 'src/assets/images/produits/optimized');

// Créer le dossier de sortie si nécessaire
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const files = fs.readdirSync(IMAGES_DIR).filter(f =>
    /\.(png|jpg|jpeg)$/i.test(f) && !f.startsWith('.')
);

(async () => {
    console.log(`\n🗜️  Compression de ${files.length} image(s)...\n`);

    for (const file of files) {
        const inputPath  = path.join(IMAGES_DIR, file);
        const baseName   = path.parse(file).name;
        const outputPath = path.join(OUTPUT_DIR, `${baseName}.webp`);

        const before = fs.statSync(inputPath).size;

        await sharp(inputPath)
            .resize(1920, 1080, {          // max 1920×1080
                fit: 'cover',
                withoutEnlargement: true
            })
            .webp({ quality: 80 })         // WebP qualité 80 → excellent rapport taille/qualité
            .toFile(outputPath);

        const after = fs.statSync(outputPath).size;
        const gain  = (((before - after) / before) * 100).toFixed(0);

        console.log(`  ✅ ${file}`);
        console.log(`     ${(before/1024/1024).toFixed(1)} MB  →  ${(after/1024).toFixed(0)} KB  (-${gain}%)\n`);
    }

    console.log('✨ Terminé ! Images dans : src/assets/images/produits/optimized/');
    console.log('\n📌 Remplacez les chemins dans hero.component.ts :');
    console.log('   assets/images/produits/NOM.png  →  assets/images/produits/optimized/NOM.webp\n');
})();
