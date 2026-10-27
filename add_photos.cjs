const fs = require('fs');
const j = JSON.parse(fs.readFileSync('D:/ai-code/karnyx/extracted_contract.json','utf8'));
let p = fs.readFileSync('D:/ai-code/karnyx/src/data/players.js','utf8');
let count = 0;
for(const r of j.raw){
  let pn = r.pseudo || '';
  for(const pref of ['KARNYX_', 'KRNYX_', 'KΔRNYX_']){
    if(pn.startsWith(pref)){ pn = pn.slice(pref.length); break; }
  }
  let photo = null;
  const pnl = pn.toLowerCase();
  for(const [k,v] of Object.entries(j.photos)){
    if(k.toLowerCase().includes(pnl)){ photo = v; break; }
  }
  if(!photo) continue;
  const tagRe = new RegExp("(tag:\\s*['\"])([^'\"]*" + pn.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,'\\$&') + "[^'\"]*)(['\"])([\\s\\S]*?)(\\n  \\},|\\n\\},)", 'i');
  const m = p.match(tagRe);
  if(m){
    let body = m[4];
    if(/photo\s*:/.test(body)){ continue; }
    if(body.trim() && !body.trim().endsWith(',')){ body = body.replace(/\s*$/, ','); }
    const esc = photo.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
    body += "\n    photo: '" + esc + "',";
    p = p.replace(tagRe, m[1] + m[2] + m[3] + body + m[5]);
    count++;
  }
}
fs.writeFileSync('D:/ai-code/karnyx/src/data/players.js', p);
console.log(count);
