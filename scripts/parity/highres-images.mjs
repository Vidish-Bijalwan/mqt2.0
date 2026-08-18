// High-res image pass for the most-visited package cards (homepage sets).
//
// The reference site's own images are 300x500 / 350x600 — too small for
// today's cards. This script replaces them with high-resolution (1400px)
// free-licensed photos of the SAME subjects from Wikimedia Commons:
//
//   - A curated subject map (slug regex -> Commons search query) picks an
//     iconic landmark/scene for every homepage package.
//   - The first search result that is a photo-like landscape (0.45 < h/w < 1.9,
//     >= 1200px wide) is downloaded at 1400px width.
//   - sharp converts it to WebP at public/images/packages/hi-<slug>.webp and
//     allPackages.ts is updated to point at it.
//   - Every replacement is logged with its Commons file, author, and license
//     to public/images/packages/HI-RES-ATTRIBUTION.md (CC-BY / CC-BY-SA photos
//     need attribution — do not delete that file).
//
// Only the homepage-set packages in the map are touched; anything not in the
// map keeps its current image. The file keeps its CRLF + 2-space formatting.
//
// Run: node scripts/parity/highres-images.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "public/images/packages");
const FILE = path.join(ROOT, "src/data/allPackages.ts");
const ATTR = path.join(OUT_DIR, "HI-RES-ATTRIBUTION.md");

// ---- subject map: slug regex -> Commons search query -----------------------
// Ordered: first match wins (put more specific patterns first).
const SUBJECTS = [
  // ---- extended regional map (used in --extended mode; beats auto-subject) ----
  [/^rajasthan/, "Amber Fort Jaipur"],
  [/^jaipur/, "Hawa Mahal Jaipur"],
  [/^jodhpur/, "Mehrangarh Fort Jodhpur"],
  [/^udaipur/, "Lake Pichola Udaipur"],
  [/^jaisalmer/, "Jaisalmer Fort"],
  [/^bikaner/, "Junagarh Fort Bikaner"],
  [/^kota/, "Kota Chambal"],
  [/^goa/, "Goa beach"],
  [/^kashmir/, "Dal Lake Srinagar"],
  [/^gulmarg/, "Gulmarg gondola"],
  [/^pahalgam/, "Pahalgam valley"],
  [/^srinagar/, "Dal Lake Srinagar"],
  [/^sonamarg/, "Sonamarg meadow"],
  [/^himachal/, "Manali mountains"],
  [/^manali/, "Manali Solang Valley"],
  [/^shimla/, "Shimla Ridge"],
  [/^dharamsala|mcleodganj/, "Dharamshala mountains"],
  [/^kullu/, "Kullu valley"],
  [/^dalhousie/, "Dalhousie hills"],
  [/^kasauli/, "Kasauli hills"],
  [/^uttarakhand/, "Nainital lake"],
  [/^nainital/, "Nainital lake"],
  [/^mussoorie/, "Mussoorie hills"],
  [/^dehradun/, "Dehradun"],
  [/^rishikesh/, "Lakshman Jhula Rishikesh"],
  [/^haridwar/, "Har Ki Pauri Haridwar"],
  [/^auli/, "Auli snow mountains"],
  [/^almora/, "Almora hills"],
  [/^kainchi/, "Kainchi Dham"],
  [/^sikkim/, "Kanchenjunga mountain"],
  [/^gangtok/, "Gangtok"],
  [/^darjeeling/, "Darjeeling tea garden"],
  [/^kalimpong/, "Kalimpong hills"],
  [/^assam/, "Kamakhya Temple Guwahati"],
  [/^guwahati/, "Kamakhya Temple Guwahati"],
  [/^meghalaya/, "Nohkalikai Falls Meghalaya"],
  [/^shillong/, "Shillong"],
  [/^kaziranga/, "Kaziranga National Park rhinoceros"],
  [/^arunachal|tawang/, "Tawang Monastery"],
  [/^mizoram/, "Mizoram hills"],
  [/^nagaland/, "Nagaland village"],
  [/^tripura/, "Tripura hills"],
  [/^manipur/, "Manipur"],
  [/^odisha|orissa/, "Konark Sun Temple"],
  [/^puri/, "Jagannath Temple Puri"],
  [/^konark/, "Konark Sun Temple"],
  [/^bhubaneswar/, "Lingaraj Temple Bhubaneswar"],
  [/^kerala/, "Kerala backwaters houseboat"],
  [/^kochi|munnar|alleppey|trivandrum|kovalam|wayanad|kannur|kozhikode|palakkad|kollam|kottayam|kumarakom|alappuzha/, "Kerala backwaters houseboat"],
  [/^tamil-nadu/, "Meenakshi temple Madurai"],
  [/^chennai/, "Chennai Marina Beach"],
  [/^madurai|rameshwaram/, "Meenakshi temple Madurai"],
  [/^kanyakumari/, "Kanyakumari Vivekananda Rock"],
  [/^ooty|kodaikanal/, "Ooty hills"],
  [/^thanjavur|mahabalipuram|trichy/, "Thanjavur Brihadeeswara Temple"],
  [/^andhra|hyderabad|visakhapatnam/, "Charminar Hyderabad"],
  [/^telangana/, "Charminar Hyderabad"],
  [/^karnataka/, "Mysore Palace"],
  [/^mysore/, "Mysore Palace"],
  [/^bangalore/, "Vidhana Soudha Bangalore"],
  [/^hampi/, "Hampi stone chariot"],
  [/^coorg/, "Coorg coffee plantation"],
  [/^mangalore/, "Mangalore beach"],
  [/^madhya-pradesh/, "Sanchi Stupa"],
  [/^bhopal|indore|ujjain|jabalpur|sanchi|orchha|gwalior|chitrakoot|pachmarhi|rewa/, "Sanchi Stupa"],
  [/^gujarat/, "Somnath temple"],
  [/^ahmedabad/, "Adalaj Stepwell"],
  [/^dwarka|somnath/, "Somnath temple"],
  [/^kutch|bhuj/, "Rann of Kutch"],
  [/^vadodara/, "Laxmi Vilas Palace Vadodara"],
  [/^gir/, "Asiatic lion Gir"],
  [/^rajkot|jamnagar|junagadh|porbandar|gandhinagar/, "Gujarat"],
  [/^maharashtra/, "Gateway of India Mumbai"],
  [/^mumbai/, "Gateway of India Mumbai"],
  [/^pune/, "Shaniwar Wada Pune"],
  [/^nashik|shirdi/, "Shirdi Sai Baba temple"],
  [/^ajanta|ellora|aurangabad/, "Ajanta Caves"],
  [/^kolhapur|satara|amravati|ratnagiri|nagpur/, "Maharashtra"],
  [/^punjab|amritsar/, "Golden Temple Amritsar"],
  [/^chandigarh/, "Rock Garden Chandigarh"],
  [/^west-bengal|kolkata/, "Victoria Memorial Kolkata"],
  [/^bihar|patna|rajgir|nalanda|vaishali/, "Mahabodhi Temple Bodhgaya"],
  [/^gaya|bodhgaya/, "Mahabodhi Temple Bodhgaya"],
  [/^jharkhand|ranchi/, "Jharkhand waterfalls"],
  [/^chhattisgarh|raipur/, "Chhattisgarh"],
  [/^sri-lanka/, "Sigiriya Sri Lanka"],
  [/^colombo|kandy|galle/, "Sigiriya Sri Lanka"],
  [/^thailand/, "Wat Arun Bangkok"],
  [/^bangkok|phuket|pattaya|krabi|koh|chiang/, "Wat Arun Bangkok"],
  [/^vietnam/, "Ha Long Bay Vietnam"],
  [/^hanoi|halong|da-nang|hoi-an|hue|nha-trang|vinh-long/, "Ha Long Bay Vietnam"],
  [/^china/, "Great Wall of China"],
  [/^hong-kong/, "Hong Kong skyline Victoria Harbour"],
  [/^macau/, "Macau Ruins of St Paul"],
  [/^japan/, "Mount Fuji"],
  [/^tokyo|kyoto|osaka/, "Mount Fuji"],
  [/^malaysia|kuala-lumpur/, "Petronas Towers Kuala Lumpur"],
  [/^singapore|sentosa/, "Marina Bay Sands Singapore"],
  [/^dubai|abu-dhabi/, "Burj Khalifa Dubai"],
  [/^qatar|doha/, "Doha skyline"],
  [/^egypt|cairo/, "Pyramids of Giza"],
  [/^turkey|istanbul/, "Hagia Sophia Istanbul"],
  [/^switzerland|zurich|interlaken/, "Swiss Alps"],
  [/^australia|sydney|melbourne/, "Sydney Opera House"],
  [/^new-zealand/, "New Zealand mountains"],
  [/^mauritius/, "Mauritius beach"],
  [/^maldives/, "Maldives beach"],
  [/^nepal|kathmandu|pokhara|lumbini|chitwan|muktinath|bhaktapur/, "Pashupatinath temple Kathmandu"],
  [/^bhutan|thimphu|paro/, "Tiger's Nest Monastery Bhutan"],
  [/^bali/, "Tanah Lot temple Bali"],
  [/^jammu/, "Vaishno Devi temple"],
  [/^vaishno/, "Vaishno Devi temple"],
  [/^varanasi/, "Varanasi ghats Ganga"],
  [/^allahabad|prayagraj/, "Triveni Sangam Prayagraj"],
  [/^lucknow/, "Bara Imambara Lucknow"],
  [/^mathura|vrindavan/, "Banke Bihari temple Vrindavan"],
  [/^agra/, "Taj Mahal"],
  [/^golden-triangle/, "Taj Mahal"],
  [/^france|paris/, "Eiffel Tower"],
  [/^europe/, "Eiffel Tower"],
  [/^america/, "New York City skyline"],
  [/^oceania/, "Sydney Opera House"],
  [/^asia/, "Great Wall of China"],
  // ---- original explicit map ----
  // Assam / North-East
  [/^10-days-assam/, "Kaziranga National Park rhinoceros"],
  [/^3-days-assam-tour/, "Kamakhya Temple Guwahati"],
  [/^3-days-guwahati/, "Kamakhya Temple Guwahati"],
  // Jyotirlinga / pilgrimage
  [/^12-jyotirlinga/, "Somnath temple Gujarat Veraval"],
  [/^3-days-srisailam/, "Srisailam Mallikarjuna temple"],
  [/^3-days-ujjain/, "Mahakaleshwar temple Ujjain"],
  [/^3-days-tripura-sundari/, "Tripura Sundari temple Udaipur Tripura"],
  [/^3-days-baidyanath/, "Baidyanath temple Deoghar"],
  [/^2-days-kainchi/, "Kainchi Dham"],
  [/^4-days-mahavatar/, "Nainital lake mountains"],
  [/^4-days-odisha/, 'intitle:"Shri Jagannath temple"'],
  [/^2nights-3days-orissa/, "Konark Sun Temple"],
  [/^2-days-khajuraho/, 'intitle:"Kandariya Mahadeva Temple at Khajuraho"'],
  // Char dham
  [/^badrinath/, "Badrinath temple"],
  [/^chardham/, "Kedarnath temple"],
  // Amarnath
  [/^amarnath/, "Amarnath cave"],
  // Ayodhya / Uttar Pradesh
  [/^ayodhya/, 'intitle:"Ayodhya Ram Mandir Inauguration"'],
  [/^2-days-ayodhya/, 'intitle:"Ayodhya Ram Mandir Inauguration"'],
  // Agra / Delhi
  [/^2-days-delhi-agra/, "Taj Mahal"],
  [/^3-days-delhi-agra/, "Taj Mahal"],
  [/^agra-sightseeing/, "Taj Mahal"],
  [/^agra-tour-packages/, "Agra Fort"],
  [/^agra$/, "Taj Mahal"],
  [/^akbar-tomb/, "Akbar's tomb Sikandra"],
  // Kumbh Mela / Prayagraj
  [/^kumbh-mela/, "Kumbh Mela Prayagraj"],
  [/^3-days-kumbh/, "Kumbh Mela Prayagraj"],
  [/^5-days-kumbh/, "Kumbh Mela Prayagraj"],
  // South India
  [/^3-days-madurai/, "Meenakshi temple Madurai"],
  // Nepal
  [/^nepal/, "Pashupatinath temple Kathmandu"],
  // Adi Kailash
  [/^adi-kailash/, "Adi Kailash"],
  // Lakshadweep / Andaman / Kerala
  [/^lakshadweep/, "Lakshadweep"],
  [/^andaman/, "Radhanagar beach Andaman"],
  [/^best-of-kerala/, "Kerala backwaters houseboat"],
  [/^enchanting-kerala/, "Kerala backwaters"],
  // Adventure
  [/^adventure-sports-in-uttarakhand/, "Rishikesh white water rafting"],
  [/^adventure-tour-packages/, "Himalayas trekking"],
  // International
  [/^africa-tour/, "African savanna elephant safari"],
  [/^bali/, "Tanah Lot temple Bali"],
  // Bangalore
  [/^bangalore/, "Vidhana Soudha Bangalore"],
];

// ---- helpers ----------------------------------------------------------------
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), "utf8"));
const src = fs.readFileSync(FILE, "utf8");
const m = src.match(/export const allPackages[^=]*=\s*(\[[\s\S]*\]);?\s*$/);
if (!m) throw new Error("could not locate allPackages array");
const all = JSON.parse(m[1]);

function findSubject(slug) {
  for (const [re, q] of SUBJECTS) if (re.test(slug)) return q;
  return null;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Byte-level image dimensions (never ascii — that masks the high bit and
// breaks JPEG/PNG magic checks; see fix-package-images.mjs).
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
      const bits = b[21] | (b[22] << 8) | (b[23] << 16) | (b[24] << 24);
      return [1 + (bits & 0x3fff), 1 + ((bits >> 14) & 0x3fff)];
    }
  }
  return [0, 0];
}

function imgDims(rel) {
  // rel like "/images/packages/foo.jpg"
  if (!rel) return [0, 0];
  try {
    return dims(fs.readFileSync(path.join(ROOT, rel.replace(/^\//, ""))));
  } catch {
    return [0, 0];
  }
}

async function fetchRetry(url, tries = 4, backoffMs = 5000) {
  for (let attempt = 1; attempt <= tries; attempt++) {
    const res = await fetch(url, { signal: AbortSignal.timeout(60000) });
    if (res.status === 429) {
      await sleep(attempt * backoffMs); // back off politely
      continue;
    }
    return res;
  }
  throw new Error(`HTTP 429 after ${tries} retries`);
}

async function searchCommons(query) {
  const url =
    "https://commons.wikimedia.org/w/api.php?action=query&format=json" +
    `&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=8` +
    "&prop=imageinfo&iiprop=url%7Csize%7Cextmetadata&iiurlwidth=1400";
  const res = await fetchRetry(url);
  const j = await res.json();
  const pages = j.query?.pages ? Object.values(j.query.pages) : [];
  // Commons ranks quality images first; pick the first photo-like landscape.
  for (const p of pages) {
    const ii = p.imageinfo?.[0];
    if (!ii) continue;
    const { width, height } = ii;
    if (!width || !height || width < 1200) continue;
    const ratio = height / width;
    if (ratio < 0.45 || ratio > 1.9) continue; // skip panoramas / portraits
    const lic =
      (ii.extmetadata?.LicenseShortName?.value || "") +
      " " +
      (ii.extmetadata?.License?.value || "");
    const author = ii.extmetadata?.Artist?.value
      ? ii.extmetadata.Artist.value.replace(/<[^>]*>/g, "").trim()
      : "unknown";
    return {
      title: p.title,
      url: ii.thumburl || ii.url,
      width,
      height,
      license: lic.trim(),
      author: author.slice(0, 60),
    };
  }
  return null;
}

const STATE_FILE = path.join(ROOT, "scripts/parity/hi-res-state.json");
const loadState = () => {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch {
    return {};
  }
};

async function main() {
  const state = loadState(); // slug -> { query, title, url, license, author }
  const hits = [];
  const misses = [];
  let changed = 0;
  const force = process.argv.includes("--force");
  // --below <px>: only touch packages whose CURRENT image is narrower than px
  // (extended mode — leaves already-large images alone).
  const belowArg = process.argv.indexOf("--below");
  const below = belowArg >= 0 ? parseInt(process.argv[belowArg + 1], 10) : 0;
  // Dedupe Commons searches: many packages share one query.
  const queryCache = new Map(); // query -> search result

  for (const pkg of all) {
    const query = findSubject(pkg.slug);
    if (!query) continue; // not in the mapped set

    const outName = `hi-${pkg.slug}.webp`;
    const outPath = path.join(OUT_DIR, outName);
    if (pkg.image === "/images/packages/" + outName) continue; // already upgraded

    // --below gate: skip when the current image is already large enough.
    if (below > 0 && imgDims(pkg.image)[0] >= below) continue;

    // Fast resume path: file + search result already known.
    if (!force && state[pkg.slug] && fs.existsSync(outPath)) {
      pkg.image = "/images/packages/" + outName;
      hits.push({ pkg: pkg.slug, query, ...state[pkg.slug] });
      changed++;
      continue;
    }

    let info;
    try {
      if (state[pkg.slug]) info = { ...state[pkg.slug], query };
      else if (queryCache.has(query)) info = { ...queryCache.get(query), query };
      else {
        info = await searchCommons(query);
        if (info) queryCache.set(query, info);
        await sleep(600); // throttle only real API calls
      }
    } catch (e) {
      misses.push(`${pkg.slug} (query: ${query}) — search failed: ${e.message}`);
      await sleep(3000);
      continue;
    }
    if (!info) {
      misses.push(`${pkg.slug} (query: ${query})`);
      continue;
    }
    state[pkg.slug] = {
      query,
      title: info.title,
      url: info.url,
      license: info.license,
      author: info.author,
    };
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
    hits.push({ pkg: pkg.slug, query, ...info });

    // Download + convert (re-download only when missing or on --force).
    if (fs.existsSync(outPath) && !force) {
      pkg.image = "/images/packages/" + outName;
      changed++;
      continue;
    }
    try {
      const res = await fetchRetry(info.url, 4, 12000);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      const meta = await sharp(buf).metadata();
      // ensure at least 1200px wide
      const out = await sharp(buf)
        .resize({ width: 1400, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();
      fs.writeFileSync(outPath, out);
      console.log(
        `✅ ${pkg.slug}: ${meta.width}x${meta.height} -> ${outName} (${info.license || "?"} / ${info.author})`
      );
      pkg.image = "/images/packages/" + outName;
      changed++;
      await sleep(600); // throttle upload.wikimedia.org too
    } catch (e) {
      console.log(`⚠️  ${pkg.slug}: download failed (${e.message})`);
      misses.push(`${pkg.slug} (query: ${query}) — ${e.message}`);
    }
  }

  // ---- write allPackages.ts (CRLF + 2-space) ----
  const body = JSON.stringify(all, null, 2).replace(/\n/g, "\r\n");
  fs.writeFileSync(FILE, src.replace(m[1], body), "utf8");

  // ---- attribution log ----
  const attrs = hits
    .map(
      (h) =>
        `- **${h.pkg}** → \`hi-${h.pkg}.webp\` — [${h.title}](${h.url.replace(/\/thumb\/.*/, "")}) — ${h.license} — by ${h.author}`
    )
    .sort();
  const header = `# High-resolution image attributions\n\nImages replaced by \`scripts/parity/highres-images.mjs\` are sourced from\n[Wikimedia Commons](https://commons.wikimedia.org) under the license shown.\nCC-BY / CC-BY-SA images require attribution — keep this file in the deploy.\n\n`;
  fs.writeFileSync(ATTR, header + attrs.join("\n") + "\n", "utf8");

  console.log(`\n── high-res pass result ──`);
  console.log(`replaced: ${changed}`);
  console.log(`misses (${misses.length}):`);
  for (const mm of misses) console.log(`  ${mm}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
