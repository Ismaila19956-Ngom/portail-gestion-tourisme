const fs = require('fs');
let c = fs.readFileSync('src/app/views/blogs/blog-sidebar/blog-sidebar.component.ts', 'utf8');

c = c.replace(/De l\\\\'effervescence/g, "De l'effervescence");
c = c.replace(/n\\\\'est/g, "n'est");
c = c.replace(/qu\\\\'un/g, "qu'un");
c = c.replace(/d\\\\'activit.s/g, "d'activités");
c = c.replace(/l\\\\'oc.an/g, "l'océan");
c = c.replace(/qu\\\\'il/g, "qu'il");

fs.writeFileSync('src/app/views/blogs/blog-sidebar/blog-sidebar.component.ts', c, 'utf8');
