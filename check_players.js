const fs = require('fs');
const p = fs.readFileSync('D:/ai-code/karnyx/src/data/players.js', 'utf8');
const start = p.indexOf('export const players = [');
const end = p.indexOf('\n];', start);
const arrStr = p.slice(start + 'export const players = '.length, end + 2);
try {
  const arr = eval('(' + arrStr + ')');
  console.log(arr.length);
} catch(e) {
  console.log('err');
}
