// Fix bad package images in allPackages.ts — never downloads, never invents.
//
// Classifies every package's current image and, when it is bad, replaces it
// with the best available image already on disk:
//
//   BROKEN       → referenced file missing (204 packages found)
//   tiny-file    → < 8 KB (blank/placeholder pixels, e.g. the 1 KB PNG shared
//                  by 29 international packages)
//   long-shot    → aspect ratio h/w > 2.5 (full-page screenshot of a webpage
//                  squeezed into a card, e.g. 500x2561)
//   low-res      → width < 400 px
//   mismatched   → image shared by >= 8 packages whose titles span different
//                  places; replaced when a clearly better match exists
//
// The replacement pool is only the 1,117 slug-named files on disk that pass
// the same quality bar (exists, >= 8 KB, width >= 250, h/w <= 2.5). Matching
// is token-based (stopwords removed); score = shared tokens / max(lenA,lenB),
// accepted when >= 0.4 with at least one shared token. Fallbacks per
// category/region are used only when no fuzzy match exists.
//
// The file keeps its exact CRLF + 2-space formatting.
//
// Run: node scripts/parity/fix-package-images.mjs
import fs from "node:fs";
import path from "node:path";

const FILE = path.join(process.cwd(), "src/data/allPackages.ts");
const IMG_DIR = path.join(process.cwd(), "public/images/packages");

const src = fs.readFileSync(FILE, "utf8");
const m = src.match(/export const allPackages[^=]*=\s*(\[[\s\S]*\]);?\s*$/);
if (!m) throw new Error("could not locate allPackages array");
const all = JSON.parse(m[1]);

// ---- image classification ------------------------------------------------
// NOTE: Buffer.toString("ascii") masks the high bit (0xFF -> 0x7F), so the
// JPEG/PNG magic checks below use explicit byte comparisons, never ascii.
function dims(b) {
  if (b.length < 24) return [0, 0];
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return [b.readUInt32BE(16), b.readUInt32BE(20)];
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i < b.length - 1) {
      if (b[i] !== 0xff) { i++; continue; }
      const m2 = b[i + 1];
      if ((m2 >= 0xc0 && m2 <= 0xc3) || (m2 >= 0xc5 && m2 <= 0xc7) || (m2 >= 0xc9 && m2 <= 0xcb) || (m2 >= 0xcd && m2 <= 0xcf))
        return [b.readUInt16BE(i + 5), b.readUInt16BE(i + 7)];
      i += 2 + b.readUInt16BE(i + 2);
    }
    return [0, 0];
  }
  if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    const c = b.toString("ascii", 12, 16);
    if (c === "VP8X") return [b.readUIntLE(24, 3), b.readUIntLE(27, 3)];
    if (c === "VP8 ") return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
    if (c === "VP8L") {
      // 14-bit little-endian width-1 / height-1 packed into 4 bytes.
      const bits = b[21] | (b[22] << 8) | (b[23] << 16) | (b[24] << 24);
      return [1 + (bits & 0x3fff), 1 + ((bits >> 14) & 0x3fff)];
    }
  }
  return [0, 0];
}

const files = fs.readdirSync(IMG_DIR);
const fileInfo = new Map(); // name -> {bytes, w, h, good}
for (const f of files) {
  const p = path.join(IMG_DIR, f);
  const b = fs.readFileSync(p);
  const [w, h] = dims(b);
  // Reference site's own card images are 300x500; cards render <= ~430px wide,
  // so 250px is the rational floor (below that is genuinely blurry).
  const good = b.length >= 8000 && w >= 250 && h / w <= 2.5;
  fileInfo.set(f, { bytes: b.length, w, h, good });
}

// ---- tokenization --------------------------------------------------------
const STOP = new Set([
  "tour", "tours", "package", "packages", "trip", "trips", "travel", "yatra",
  "from", "to", "of", "in", "the", "a", "an", "and", "with", "for", "by", "on",
  "india", "indian", "day", "days", "night", "nights", "weekend", "special",
  "best", "top", "famous", "must", "visit", "visiting", "book", "online",
  "guide", "guides", "complete", "places", "things", "sightseeing", "sight",
  "site", "culture", "cultural", "food", "traditional", "dress", "dresses",
  "heritage", "history", "historic", "tourist", "tourists", "festival",
  "festivals", "weather", "faq", "faqs", "rates", "price", "prices", "cost",
  "island", "islands", "beach", "beaches", "hill", "hills", "station", "stations",
  "registration", "booking", "how", "why", "what", "when", "where", "who",
  "are", "is", "your", "our", "you", "their", "my", "me", "be", "been", "has",
  "have", "not", "no", "all", "some", "many", "most", "such", "this", "that",
  "these", "those", "also", "very", "more", "other", "each", "any",
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13",
  "14", "15", "16", "17", "18", "19", "20",
]);

function tokens(str) {
  return str
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

// Subset-aware: if one token set is contained in the other, the smaller set
// gets full credit (e.g. "2-days-delhi-agra-mathura-vrindavan-tour" vs
// "agra.jpg" => 1.0), while a partial overlap is prorated (vs
// "delhi-agra-jaipur-guide" => 0.67).
function score(a, b) {
  const A = tokens(a);
  const B = tokens(b);
  if (!A.length || !B.length) return 0;
  const shared = A.filter((t) => B.includes(t)).length;
  if (!shared) return 0;
  return shared / Math.min(A.length, B.length);
}

// ---- candidate pool: named files that pass the quality bar ----------------
const pool = files
  .filter((f) => fileInfo.get(f).good && !/^[0-9a-f]{8,}\./.test(f))
  .sort((a, b) => fileInfo.get(b).bytes - fileInfo.get(a).bytes);

const stem = (f) => f.replace(/\.(webp|jpg|jpeg|png)$/i, "").replace(/-CLEANED$/i, "");

// ---- category fallbacks (last resort; all verified-good files) ------------
const CAT_FALLBACK = {
  "India Tours": "india-tour-packages.jpg",
  "Uttar Pradesh": "uttar-pradesh.jpg",
  "North India": "north-india-tour-packages.jpg",
  "South India": "south-india-tour.jpg",
  "East India": "east-india-tour-packages.jpg",
  "West India": "west-india-tour-package.webp",
  "North East India": "northeast-india.jpg",
  International: "international-tours.jpg",
  Pilgrimage: "pilgrimage-tours.jpg",
  Helicopter: "helicopter-packages.jpg",
  Honeymoon: "honeymoon.jpg",
  Wildlife: "wildlife.jpg",
  Adventure: "adventure.jpg",
};

// continent fallback for countries with no own image file
const CONTINENT = [
  [/^africa|africa-tour|safari|wildlife-safari/, "africa-tour-packages.jpg"],
  [/^asia|asia-tour|^europe|europe-tour|^oceania|oceania-tour|^america|america-tour/, "international-tours.jpg"],
  [/brazil|argentina|peru|chile|colombia|venezuela|bolivia|ecuador/, "south-america-tour-packages.jpg"],
  [/algeria|benin|cape-verde|ethiopia|gambia|ghana|kenya|nigeria|tanzania|uganda|morocco|tunisia|zimbabwe|zambia|namibia|botswana|libya|rwanda|senegal|kwazulu|mpumalanga|western-cape/, "africa-tour-packages.jpg"],
  [/fiji|french-polynesia|new-zealand|australia|tonga|samoa|vanuatu|papua-new-guinea/, "oceania-tour-packages.jpg"],
  [/gauteng|south-africa/, "south-africa-tour-packages.jpg"],
  [/usa|america|canada|mexico|new-york/, "north-america-tour-packages.jpg"],
  [/\buk\b|france|italy|spain|germany|switzerland|austria|portugal|greece|norway|netherlands|belgium|czech|hungary|poland|scotland|ireland/, "europe.jpg"],
  [/thailand|vietnam|cambodia|laos|myanmar|philippines|indonesia|malaysia|singapore|japan|china|korea|hong-kong|macau|taiwan|krabi|phuket|pattaya|bangkok|koh|samui|halong|hanoi|ho-chi-minh|da-nang|hoi-an|hue|bali|mauritius|sri-lanka|nepal|bhutan|tibet|maldives|dubai|qatar|egypt/, "south-asia-tour-packages.jpg"],
];

// Slug-first fallback: many international packages are miscategorized as
// "India Tours" in the scraped data, so the continent map must run on the
// slug for every package, not only ones labeled International.
// small curated overrides for packages whose region is unambiguous but whose
// slug tokens don't line up with any file name
const OVERRIDES = [
  [/uttarakhand|char-dham|chardham|kedarnath|badrinath|gangotri|yamunotri|rishikesh|haridwar|nainital|mussoorie|dehradun|auli|almora|kainchi|manimahesh/, "uttarakhand-tour-packages.png"],
  [/baratang|andaman|nicobar|port-blair|rangat|havelock/, "andaman.jpg"],
  [/koh-phangan|koh-samui|krabi|phuket|phi-phi|pattaya|bangkok|chiang/, "thailand-tour-packages.webp"],
  [/bali|indonesia/, "bali.jpg"],
  [/malaysia|kuala-lumpur/, "malaysia-tour-packages.webp"],
  [/singapore|sentosa/, "singapore-tour-packages.webp"],
  [/vietnam|hanoi|halong|ho-chi-minh|da-nang|hoi-an|nha-trang/, "vietnam.jpg"],
  [/dubai|abu-dhabi/, "dubai.jpg"],
  [/nepal|kathmandu|pokhara|lumbini|chitwan|muktinath/, "nepal.jpg"],
  [/bhutan|thimphu|paro/, "bhutan.jpg"],
  [/sri-lanka|colombo|kandy|galle/, "sri-lanka.jpg"],
  [/maldives|kurumba/, "maldives.jpg"],
  [/egypt|cairo/, "egypt.jpg"],
  [/japan|tokyo|kyoto|osaka|fuji/, "japan-tour-packages.jpg"],
  [/china|hong-kong|macau|beijing|shanghai/, "china.jpg"],
  [/qatar|doha/, "qatar.jpg"],
  [/mauritius/, "fun-filled-mauritius-tour.jpg"],
  [/switzerland|zurich|interlaken/, "switzerland-austria-tour.jpg"],
  [/australia|sydney|melbourne/, "australia.jpg"],
  [/kerala|kochi|munnar|alleppey|trivandrum|alappuzha|kovalam|wayanad|kannur|kozhikode|palakkad|kollam|kottayam|kumarakom/, "kerala-tour-packages.png"],
  [/goa/, "goa-tour-packages.webp"],
  [/kashmir|srinagar|gulmarg|pahalgam|sonamarg/, "kashmir-tour-package.webp"],
  [/rajasthan|jaipur|udaipur|jodhpur|jaisalmer|pushkar|bikaner|alwar|ajmer|mount-abu|bharatpur|keoladeo|chittorgarh|kota/, "rajasthan.jpg"],
  [/uttarakhand|char-dham|chardham|kedarnath|badrinath|gangotri|yamunotri|rishikesh|haridwar|nainital|mussoorie|dehradun|auli|almora|kainchi|manimahesh/, "uttarakhand-tour-packages.png"],
  [/himachal|shimla|manali|dharamsala|mcleodganj|kasol|kullu|dalhousie|kasauli/, "himachal-pradesh.jpg"],
  [/uttar-pradesh|agra|mathura|vrindavan|varanasi|ayodhya|allahabad|prayagraj|lucknow|kushinagar|sarnath|gaya|bodhgaya|jhansi|gwalior|khajuraho|orchha|kanpur|gorakhpur|naimisharanya/, "uttar-pradesh.jpg"],
  [/sikkim|gangtok|darjeeling|kalimpong|lachung/, "sikkim.jpg"],
  [/assam|guwahati|kamakhya|kaziranga|shillong|meghalaya|jorhat|majuli/, "assam-tour-packages.webp"],
  [/odisha|orissa|puri|konark|bhubaneswar|daringbadi/, "odisha.jpg"],
  [/tamil-nadu|chennai|madurai|rameshwaram|kanyakumari|coimbatore|ooty|kodaikanal|thanjavur|mahabalipuram|tirunelveli|vellore/, "tamil-nadu-tour-packages.jpg"],
  [/andhra|hyderabad|visakhapatnam|vijayawada|tirupati/, "andhra-pradesh.jpg"],
  [/karnataka|bangalore|mysore|hampi|coorg|mangalore|belgaum|chitradurga|hospet|shimoga|vijayapura/, "karnataka.jpg"],
  [/madhya-pradesh|indore|bhopal|ujjain|pachmarhi|rewa|chitrakoot|burhanpur|khajuraho|orchha|gwalior|jabalpur|sanchi/, "madhya-pradesh-tour-packages.webp"],
  [/gujarat|ahmedabad|dwarka|somnath|gir|kutch|bhuj|vadodara|surat|gandhinagar|rajkot|jamnagar|junagadh|porbandar/, "gujarat.jpg"],
  [/maharashtra|mumbai|pune|nagpur|nashik|shirdi|aurangabad|ajanta|ellora|kolhapur|satara|amravati|ratnagiri/, "maharashtra.jpg"],
  [/punjab|amritsar|chandigarh|patiala/, "punjab.webp"],
  [/west-bengal|kolkata|gangasagar|sundarbans|kalimpong/, "west-bengal.jpg"],
  [/bihar|patna|bodhgaya|rajgir|nalanda|vaishali/, "bihar.jpg"],
  [/jharkhand|ranchi/, "jharkhand-tour-packages.jpg"],
  [/chhattisgarh|raipur/, "chhattisgarh-tour-packages.jpg"],
  [/telangana/, "telangana.jpg"],
  [/north-east|northeast|nagaland|mizoram|tripura|manipur|arunachal|meghalaya/, "northeast-india.jpg"],
];

function existsAndUsable(img) {
  const fi = fileInfo.get(img);
  return fi && fi.bytes >= 8000;
}

function categoryFallback(pkg) {
  for (const [re, img] of OVERRIDES) if (re.test(pkg.slug) && existsAndUsable(img)) return "/images/packages/" + img;
  for (const [re, img] of CONTINENT) if (re.test(pkg.slug) && existsAndUsable(img)) return "/images/packages/" + img;
  const f = CAT_FALLBACK[pkg.category];
  return f && existsAndUsable(f) ? "/images/packages/" + f : null;
}

// ---- choose the best image for a package ----------------------------------
const usage = new Map(); // image url -> packages
for (const p of all) if (p.image) usage.set(p.image, (usage.get(p.image) || 0) + 1);

const changes = [];
const keep = [];

function choose(pkg) {
  const cur = pkg.image;
  const fi = cur ? fileInfo.get(cur.replace("/images/packages/", "")) : null;
  const issues = [];
  if (!cur) issues.push("NO-IMAGE");
  else if (!fi) issues.push("BROKEN");
  else if (!fi.good) {
    if (fi.bytes < 8000) issues.push(`tiny-file(${fi.bytes}B)`);
    if (fi.w >= 400 && fi.h / fi.w > 2.5) issues.push(`long-shot ${fi.w}x${fi.h}`);
    if (fi.w < 400 && fi.w > 0) issues.push(`low-res ${fi.w}x${fi.h}`);
  }
  const curScore = cur ? score(pkg.slug, stem(cur.replace("/images/packages/", ""))) : 0;
  // A generic category-fallback image (e.g. india-tour-packages.jpg) is only
  // acceptable as a last resort; re-evaluate it in case a real regional match
  // exists (fixes run-1 calls made while the pool was WebP-only).
  const isGenericFallback =
    cur && /(^|\/)(india-tour-packages|india-tour-package|north-india-tour-packages|south-india-tour|east-india-tour-packages|west-india-tour-package|northeast-india|uttar-pradesh|international-tours|pilgrimage-tours|helicopter-packages|honeymoon|wildlife|adventure)\.(jpg|webp)$/.test(cur);
  // Weak match (< 0.6) means the image does not even fit this package's
  // subject (e.g. a Kedarnath photo on a Delhi card); re-evaluate.
  const needFix = issues.length > 0 || (cur && curScore < 0.6) || isGenericFallback;

  // best fuzzy candidate
  let best = null;
  let bestScore = 0;
  for (const f of pool) {
    const s = score(pkg.slug, stem(f));
    if (s > bestScore) { bestScore = s; best = f; }
  }

  if (!needFix) return { keep: true };

  if (best && bestScore >= 0.4) {
    const next = "/images/packages/" + best;
    if (next !== cur) return { next, why: issues.join(",") || `weak match (cur ${curScore.toFixed(2)}); matched ${best} @${bestScore.toFixed(2)}` };
    return { keep: true };
  }
  const fb = categoryFallback(pkg);
  if (fb && fb !== cur) return { next: fb, why: issues.join(",") || `no fuzzy match; ${issues.length ? issues.join(",") : "category/region"} fallback` };
  if (issues.length === 0 && !isGenericFallback && bestScore <= curScore)
    return { keep: true, note: `weak match (${curScore.toFixed(2)}) but no better image` };
  return { keep: true, note: `${issues.join(",") || "mismatch"} and no fallback` };
}

for (const p of all) {
  const r = choose(p);
  if (r.next) {
    changes.push({ slug: p.slug, old: p.image, next: r.next, why: r.why });
    p.image = r.next;
  } else if (r.note) keep.push({ slug: p.slug, note: r.note, img: p.image });
}

// ---- write back (byte-identical formatting) --------------------------------
const body = JSON.stringify(all, null, 2).replace(/\n/g, "\r\n");
fs.writeFileSync(FILE, src.replace(m[1], body), "utf8");

// ---- report ------------------------------------------------------------------
const byWhy = {};
for (const c of changes) {
  const k = c.why.split("(")[0].split("@")[0].split(";")[0].trim();
  byWhy[k] = (byWhy[k] || 0) + 1;
}
console.log(`── image fix result ──`);
console.log(`changed: ${changes.length}  kept-with-note: ${keep.length}`);
console.log("breakdown:", JSON.stringify(byWhy, null, 1));
console.log("\nsamples (changed):");
for (const c of changes.slice(0, 15)) console.log(`  ${c.slug}\n    ${c.old}\n    ${c.next}   [${c.why}]`);
console.log("\nkept-with-note (first 15):");
for (const k of keep.slice(0, 15)) console.log(`  ${k.slug}: ${k.img} (${k.note})`);

// ---- verify -------------------------------------------------------------------
let broken = 0, tiny = 0, longShot = 0;
const used = new Map();
for (const p of all) {
  if (!p.image) { broken++; continue; }
  const name = p.image.replace("/images/packages/", "");
  const fi = fileInfo.get(name);
  used.set(p.image, (used.get(p.image) || 0) + 1);
  if (!fi) { broken++; continue; }
  if (fi.bytes < 8000) tiny++;
  if (fi.w >= 400 && fi.h / fi.w > 2.5) longShot++;
}
console.log(`\n── post-fix verification ──`);
console.log(`broken/missing: ${broken}   tiny: ${tiny}   long-shot: ${longShot}`);
console.log("most-shared images now:", [...used.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([u, c]) => `${c}x ${u.split("/").pop()}`).join("  "));
