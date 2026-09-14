#!/usr/bin/env node
/** Remove imported brand/contact residue from every dataset rendered by MQT. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const FILES = [
  'src/data/allPackages.ts',
  'src/data/packageDetails.json',
  'src/data/fullBlogData.json',
  'src/data/fullBlogDataClean.json',
  'src/data/staticPagesData.json',
];

function normalize(text) {
  return text
    .replace(/info@namasteindiatrip\.com/gi, 'info@myquicktrippers.com')
    .replace(/(?:www\.)?namasteindiatrip\.com/gi, 'www.myquicktrippers.com')
    .replace(/\+?91[-\s]?9711616316/g, '+91-8171158569')
    .replace(/\+?91[-\s]?9704545558/g, '+91-8171158569')
    .replace(/\+?91[-\s]?7827052233/g, '+91-8171158569')
    .replace(/\+?91[-\s]?9911572642/g, '+91-8171158569')
    .replace(/\+?91[-\s]?9718779629/g, '+91-8171158569')
    .replace(/\+?91[-\s]?11[-\s]?45661383/g, '+91-8171158569')
    .replace(/Namaste India Trip/gi, 'My Quick Trippers')
    .replace(/NamasteIndiaTrip/gi, 'My Quick Trippers')
    .replace(/\bNIT3GOLD\b/g, 'MQT3GOLD');
}

for (const relativePath of FILES) {
  const filePath = path.join(ROOT, relativePath);
  const before = fs.readFileSync(filePath, 'utf8');
  const after = normalize(before);
  fs.writeFileSync(filePath, after);
  console.log(`${relativePath}: ${before === after ? 'already clean' : 'normalized'}`);
}
