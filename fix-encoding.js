const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(file));
        } else {
            if (file.endsWith('.ts') || file.endsWith('.html') || file.endsWith('.scss') || file.endsWith('.css')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walkDir('./src');
let fixedCount = 0;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content
        .replace(/Ã©/g, 'é')
        .replace(/Ã¨/g, 'è')
        .replace(/Ã /g, 'à')
        .replace(/Ã¢/g, 'â')
        .replace(/Ãª/g, 'ê')
        .replace(/Ã®/g, 'î')
        .replace(/Ã´/g, 'ô')
        .replace(/Ã¹/g, 'ù')
        .replace(/Ã§/g, 'ç')
        .replace(/Ã‰/g, 'É')
        .replace(/â€“/g, '–')
        .replace(/â€™/g, '’')
        .replace(/Â/g, '');
    
    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        fixedCount++;
    }
}
console.log('Fixed ' + fixedCount + ' files.');
