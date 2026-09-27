// Extract non-solid RAR4 state files with HTTP ranges; no 193 MB national download.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const url = 'https://surveyofindia.gov.in/documents/State_District_Subdistrict_PAN%20INDIA.rar';
const first = fs.readFileSync('tmp/soi-boundaries-2026.rar');
function range(start, length) {
  length = Math.min(length, 202524438-start);
  if (start + length <= first.length) return first.subarray(start, start + length);
  if (length > 1048576) {
    const parts = [];
    for (let offset=0; offset<length; offset+=1048576) parts.push(range(start+offset,Math.min(1048576,length-offset)));
    return Buffer.concat(parts);
  }
  const cache = `tmp/soi-range-${start}-${length}.bin`;
  if (fs.existsSync(cache) && fs.statSync(cache).size===length) return fs.readFileSync(cache);
  execFileSync('curl.exe', ['-sS', '-L', '--fail', '--retry', '3', '--retry-all-errors', '--max-time', '60', '-r', `${start}-${start+length-1}`, url, '-o', cache], { maxBuffer: 40*1024*1024 });
  const bytes = fs.readFileSync(cache);
  if (bytes.length !== length) throw new Error(`Incomplete range ${start}`);
  return bytes;
}
const chunks = [first.subarray(0,20)];
let position = 20;
while (position < 202524438) {
  const header = range(position, 4096);
  const type = header[2], flags = header.readUInt16LE(3), size = header.readUInt16LE(5);
  if (type === 0x7b) break;
  const packed = flags & 0x8000 ? header.readUInt32LE(7) : 0;
  if (type === 0x74) {
    const nameLength = header.readUInt16LE(26);
    const name = header.subarray(32,32+nameLength).toString('utf8').split('\0')[0];
    console.log(JSON.stringify({ position, name, size, packed }));
    if (/State Boundary\.(shp|shx|dbf|prj|cpg)$/i.test(name)) {
      if (flags & 0x10) throw new Error('Solid archive requires full extraction');
      chunks.push(range(position, size+packed));
    }
  }
  if (!size) throw new Error('Invalid archive header');
  position += size + packed;
}
fs.writeFileSync('tmp/soi-state-only.rar', Buffer.concat(chunks));
console.log('State-only archive saved from the official source.');
