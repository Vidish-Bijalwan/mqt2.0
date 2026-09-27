import sharp from 'sharp';
import fs from 'node:fs';
const places = ['auli','kedarnath','badrinath','mussoorie','rishikesh','nainital','corbett','uttarakhand'];
const files = places.flatMap(p => fs.readdirSync(`public/images/location-library/${p}${p==='uttarakhand'?'':'-uttarakhand'}-india`).map(f=>`public/images/location-library/${p}${p==='uttarakhand'?'':'-uttarakhand'}-india/${f}`));
const tiles = await Promise.all(files.map(async(file,i)=> ({input:await sharp(file).resize(300,169).extend({bottom:26,background:'#fff'}).composite([{input:Buffer.from(`<svg width="300" height="26"><text x="7" y="18" font-family="sans-serif" font-size="14">${file.split('/').at(-1)}</text></svg>`),top:169,left:0}]).png().toBuffer(),left:(i%4)*300,top:Math.floor(i/4)*195})));
await sharp({create:{width:1200,height:Math.ceil(files.length/4)*195,channels:3,background:'#fff'}}).composite(tiles).png().toFile('tmp/state-photos-contact.png');
