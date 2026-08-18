// Replace the reference site's brand name ("Namaste India trip") with MQT's
// own ("My Quick Trippers") across scraped data files. Skips the image caption
// "Namaste Indian Culture" / filename "Namaste-Indian-Culture" via lookahead.
import fs from 'fs';

const FILES = [
  'src/data/allPackages.ts',
  'src/data/staticPagesDataV2.json',
  'src/data/fullBlogData.json',
  'src/data/fullBlogDataClean.json',
  'src/data/fullBlogDataV2.json',
  'src/data/packageDetailsV3.json',
  'src/data/packageDetailsV2.json',
  'src/data/packageDetails.json',
];

const RE = /Namaste India(?!n)/gi; // "Namaste India" not followed by "n..." (Indian, India's filename)

let total = 0;
for (const f of FILES) {
  let s = fs.readFileSync(f, 'utf8');
  const before = (s.match(RE) || []).length;
  if (before > 0) {
    s = s.replace(RE, 'My Quick Trippers');
    fs.writeFileSync(f, s);
    total += before;
    console.log(`${f}: replaced ${before}`);
  } else {
    console.log(`${f}: none`);
  }
}
console.log('TOTAL replaced:', total);
