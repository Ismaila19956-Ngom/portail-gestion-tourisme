const fs = require('fs');
const path = require('path');

const corrections = {
  'Si\ufffdGe': 'Siège',
  'Si\ufffdge': 'Siège',
  'si\ufffdge': 'siège'
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
