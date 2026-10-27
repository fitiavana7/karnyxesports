import fs from 'fs';
import path from 'path';

const root = 'D:/ai-code/karnyx';
const data = JSON.parse(fs.readFileSync(path.join(root,'extracted_contract.json'),'utf8'));
const photos = data.photos;
const raw = data.raw;

// build map from pseudo in raw to photo
const pseudoToPhoto = new Map();
for(const r of raw){
  let p = r.pseudo || '';
  for(const pref of ['KARNYX_', 'KRNYX_', 'KΔRNYX_']){
    if(p.startsWith(pref)){ p = p.slice(pref.length); break; }
  }
  const pnLow = p.toLowerCase();
  for(const [k,v] of Object.entries(photos)){
    if(pnLow && k.toLowerCase().includes(pnLow)){
      pseudoToPhoto.set(r.pseudo, v);
      break;
    }
  }
}

let playersJs = fs.readFileSync(path.join(root,'src/data/players.js'),'utf8');
let count = 0;
for(const [tag, photo] of pseudoToPhoto){
  // look for tag: 'TAG' and add photo
  const tagRe = new RegExp("(tag:\\s*['\"]" + tag.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,'\\$&') + "['\"])([\\s\\S]*?)(\\n  \\},|\\n\\},)");
  playersJs = playersJs.replace(tagRe, (m, g1, g2, g3) => {
    if(/photo\s*:/.test(g2)) return m;
    let body = g2;
    if(!body.trim().endsWith(',')) body = body.replace(/\s*$/, ',');
    const esc = photo.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
    body += "\n    photo: '" + esc + "',";
    count++;
    return g1 + body + g3;
  });
}
fs.writeFileSync(path.join(root,'src/data/players.js'), playersJs);
console.log(count);
