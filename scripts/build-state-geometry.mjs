// Builds a web-resolution boundary from the official SOI WGS84 shapefile.
// Retains the SOI Lambert Conformal Conic projection for outline and markers.
import fs from 'node:fs';
import crypto from 'node:crypto';
const base = 'tmp/soi-extracted/State_District_Subdistrict_PAN INDIA/State Boundary/State Boundary';
const requestedState = process.argv[2] || 'Uttarakhand';
const outputSlug = process.argv[3] || requestedState.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const dbf = fs.readFileSync(`${base}.dbf`);
const fields = [];
for (let p=32; dbf[p] !== 0x0d; p+=32) fields.push({name:dbf.subarray(p,p+11).toString().replace(/\0/g,''),length:dbf[p+16]});
const count=dbf.readUInt32LE(4), headerSize=dbf.readUInt16LE(8), recordSize=dbf.readUInt16LE(10);
let recordIndex=-1;
for(let i=0;i<count;i++) {
  let p=headerSize+i*recordSize+1;
  const record={};
  fields.forEach(f=>{record[f.name]=dbf.subarray(p,p+f.length).toString().trim();p+=f.length;});
  if(Object.values(record).some(v=>v.toLowerCase() === requestedState.toLowerCase())) {recordIndex=i;console.log(record);}
}
if(recordIndex<0) throw new Error(`${requestedState} not found`);
const shp=fs.readFileSync(`${base}.shp`);
let offset=100;
for(let i=0;i<recordIndex;i++) offset+=8+shp.readUInt32BE(offset+4)*2;
offset+=8;
if(![5,15,25].includes(shp.readInt32LE(offset))) throw new Error('Expected polygon shape');
const partCount=shp.readInt32LE(offset+36),pointCount=shp.readInt32LE(offset+40);
const starts=Array.from({length:partCount},(_,i)=>shp.readInt32LE(offset+44+4*i));
starts.push(pointCount);
const points=Array.from({length:pointCount},(_,i)=>[shp.readDoubleLE(offset+44+4*partCount+16*i),shp.readDoubleLE(offset+52+4*partCount+16*i)]);
const west=Math.min(...points.map(p=>p[0])),east=Math.max(...points.map(p=>p[0]));
const south=Math.min(...points.map(p=>p[1])),north=Math.max(...points.map(p=>p[1]));
const scale=960/(east-west),height=(north-south)*scale+40;
const project=([x,y])=>[(x-west)*scale+20,(north-y)*scale+20];
// Douglas–Peucker: maximum 0.35 SVG px deviation (well below one CSS pixel).
function simplify(points,tolerance) {
 if(points.length<3)return points;
 const [ax,ay]=points[0],[bx,by]=points.at(-1), dx=bx-ax,dy=by-ay;
 let max=0,index=0;
 for(let i=1;i<points.length-1;i++) {const [x,y]=points[i];const t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy||1)));const d=(x-ax-t*dx)**2+(y-ay-t*dy)**2;if(d>max){max=d;index=i;}}
 if(max<=tolerance*tolerance)return [points[0],points.at(-1)];
 return [...simplify(points.slice(0,index+1),tolerance).slice(0,-1),...simplify(points.slice(index),tolerance)];
}
const rings=starts.slice(0,-1).map((start,i)=>simplify(points.slice(start,starts[i+1]).map(project),.35));
const boundaryPath=rings.map(ring=>'M'+ring.map(p=>p.map(n=>n.toFixed(2)).join(',')).join('L')+'Z').join('');
const output={source:'Survey of India — Administrative Boundary Data Base',sourceUrl:'https://surveyofindia.gov.in/documents/State_District_Subdistrict_PAN%20INDIA.rar',retrieved:'2026-09-20',sha256:crypto.createHash('sha256').update(shp).digest('hex'),projection:{name:'LCC_WGS84',west,east,south,north,scale,padding:20,standardParallel1:12.472944,standardParallel2:35.172806,centralMeridian:80,latitudeOfOrigin:24,falseEasting:4000000,falseNorthing:4000000},width:1000,height:Number(height.toFixed(2)),boundaryPath,sourcePointCount:pointCount,renderPointCount:rings.reduce((n,r)=>n+r.length,0),maxSimplificationError:.35};
fs.mkdirSync('src/data/geography',{recursive:true});
fs.writeFileSync(`src/data/geography/${outputSlug}.json`,JSON.stringify(output,null,2)+'\n');
console.log({width:output.width,height:output.height,bounds:[west,south,east,north],sourcePoints:pointCount,renderPoints:output.renderPointCount});
