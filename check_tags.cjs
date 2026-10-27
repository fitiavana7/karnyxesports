const fs = require('fs');
const p = fs.readFileSync('D:/ai-code/karnyx/src/data/players.js','utf8');
const re = /tag:\s*['"]([^'"]+)['"]/g;
let m; const tags=[];
while((m=re.exec(p))){tags.push(m[1]);}
console.log(tags.join('\n'));
