const fs = require('fs');
let p = fs.readFileSync('D:/ai-code/karnyx/src/data/event.js','utf8');
p = p.replace("status: '\u00c0 venir'", "status: 'Finaliste Playoffs'");
p = p.replace("status: 'À venir'", "status: 'Finaliste Playoffs'");
fs.writeFileSync('D:/ai-code/karnyx/src/data/event.js', p);
console.log('done');
