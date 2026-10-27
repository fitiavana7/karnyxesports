const fs = require('fs');
let p = fs.readFileSync('D:/ai-code/karnyx/src/pages/PlayerPage.jsx','utf8');
const old = "<Portrait hue={player.hue} label={`Portrait de ${player.displayName}`} />";
const neu = "{player.photo ? <img src={player.photo} alt={'Photo de ' + player.displayName} className=\"player-page__photo\" /> : <Portrait hue={player.hue} label={`Portrait de ${player.displayName}`} />}";
if(p.includes(old)){
  p = p.replace(old, neu);
  fs.writeFileSync('D:/ai-code/karnyx/src/pages/PlayerPage.jsx', p);
  console.log('ok');
} else {
  console.log('no');
}
