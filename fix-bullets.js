const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.ts') || file.endsWith('.html')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('src');
let changed = 0;

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    let original = content;
    
    // Replace the bullet character that incorrectly replaced o"
    content = content.replace(/•/g, 'o"');

    if (content !== original) {
        fs.writeFileSync(f, content, 'utf8');
        changed++;
    }
});

console.log(`Fixed ${changed} files where bullet • corrupted o"`);
