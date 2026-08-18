// Enrich package content with Wikipedia data, internal backlinks, and FAQ sections.
//
// For each package whose V3 blocks are thin (< 500 chars), this script:
//   1. Fetches a Wikipedia summary + extract for the destination/topic
//   2. Generates rich content blocks (intro, highlights, attractions, FAQ)
//   3. Adds internal backlinks to related packages
//   4. Adds structured data (FAQ schema, BreadcrumbList)
//
// Run: node scripts/parity/enrich-packages.mjs [--dry-run] [--slug=<slug>]
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const V3_PATH = path.join(ROOT, "src/data/packageDetailsV3.json");
const ALL_PATH = path.join(ROOT, "src/data/allPackages.ts");
const v3 = JSON.parse(fs.readFileSync(V3_PATH, "utf8"));

// Read allPackages for cross-referencing
const allSrc = fs.readFileSync(ALL_PATH, "utf8");
const allM = allSrc.match(/export const allPackages[^=]*=\s*(\[[\s\S]*\]);?\s*$/);
const allPkgs = JSON.parse(allM[1]);

// ---- Wikipedia slug→article mapping ----
const WIKI_MAP = {
  // Gujarat
  "dwarka": "Dwarka",
  "somnath": "Somnath",
  "ahmedabad": "Ahmedabad",
  "rajkot": "Rajkot",
  "gir": "Gir_National_Park",
  "diu": "Diu,_Dadra_and_Nagar_Haveli",
  "jamnagar": "Jamnagar",
  "gandhinagar": "Gandhinagar",
  "kutch": "Kutch_district",
  "bhuj": "Bhuj",
  "vadodara": "Vadodara",
  // Rajasthan
  "jaipur": "Jaipur",
  "jodhpur": "Jodhpur",
  "udaipur": "Udaipur",
  "jaisalmer": "Jaisalmer",
  "ajmer": "Ajmer",
  "pushkar": "Pushkar",
  "bikaner": "Bikaner",
  "chittorgarh": "Chittorgarh",
  "mount-abu": "Mount_Abu",
  // Kashmir
  "kashmir": "Kashmir",
  "srinagar": "Srinagar",
  "gulmarg": "Gulmarg",
  "pahalgam": "Pahalgam",
  "sonamarg": "Sonamarg",
  "leh": "Leh",
  "ladakh": "Ladakh",
  // Himachal
  "manali": "Manali,_Himachal_Pradesh",
  "shimla": "Shimla",
  "dharamsala": "Dharamshala",
  "mcleodganj": "McLeod_Ganj",
  "kullu": "Kullu",
  "dalhousie": "Dalhousie",
  "kasol": "Kasol",
  // Uttarakhand
  "rishikesh": "Rishikesh",
  "haridwar": "Haridwar",
  "nainital": "Nainital",
  "mussoorie": "Mussoorie",
  "dehradun": "Dehradun",
  "almora": "Almora",
  "auli": "Auli,_Uttarakhand",
  "kedarnath": "Kedarnath",
  "badrinath": "Badrinath",
  "gangotri": "Gangotri",
  "yamunotri": "Yamunotri",
  "char-dham": "Chota_Char_Dham",
  "chardham": "Chota_Char_Dham",
  "corbett": "Jim_Corbett_National_Park",
  // Varanasi / UP
  "varanasi": "Varanasi",
  "agra": "Agra",
  "mathura": "Mathura,_Uttar_Pradesh",
  "vrindavan": "Vrindavan",
  "ayodhya": "Ayodhya",
  "lucknow": "Lucknow",
  "allahabad": "Prayagraj",
  "prayagraj": "Prayagraj",
  // Madhya Pradesh
  "khajuraho": "Khajuraho_Group_of_Monuments",
  "orchha": "Orchha",
  "ujjain": "Ujjain",
  "sanchi": "Sanchi",
  "bhimbetka": "Bhimbetka_rock_shelters",
  "pachmarhi": "Pachmarhi",
  // South India
  "munnar": "Munnar",
  "alleppey": "Alappuzha",
  "alappuzha": "Alappuzha",
  "kochi": "Kochi",
  "kovalam": "Kovalam",
  "wayanad": "Wayanad_district",
  "ooty": "Ooty",
  "kodaikanal": "Kodaikanal",
  "madurai": "Madurai",
  "rameshwaram": "Rameswaram",
  "kanyakumari": "Kanyakumari",
  "pondicherry": "Pondicherry",
  "mysore": "Mysore",
  "hampi": "Hampi",
  "coorg": "Kodagu",
  "bangalore": "Bangalore",
  "hyderabad": "Hyderabad",
  // North East
  "guwahati": "Guwahati",
  "shillong": "Shillong",
  "darjeeling": "Darjeeling",
  "gangtok": "Gangtok",
  "sikkim": "Sikkim",
  "kaziranga": "Kaziranga_National_Park",
  "tawang": "Tawang",
  // East India
  "puri": "Puri",
  "konark": "Konark",
  "bhubaneswar": "Bhubaneswar",
  "kolkata": "Kolkata",
  "sundarbans": "Sundarbans",
  "bodhgaya": "Bodh_Gaya",
  // International
  "bali": "Bali",
  "phuket": "Phuket_Province",
  "bangkok": "Bangkok",
  "singapore": "Singapore",
  "kuala-lumpur": "Kuala_Lumpur",
  "dubai": "Dubai",
  "maldives": "Maldives",
  "mauritius": "Mauritius",
  "nepal": "Nepal",
  "kathmandu": "Kathmandu",
  "pokhara": "Pokhara",
  "bhutan": "Bhutan",
  "sri-lanka": "Sri_Lanka",
  "colombo": "Colombo",
  "kandy": "Kandy",
  // Pilgrimage
  "amarnath": "Amarnath",
  "vaishno-devi": "Vaishno_Devi",
  "tirupati": "Tirupati",
  "shirdi": "Shirdi",
  "golden-temple": "Golden_Temple",
  "amritsar": "Amritsar",
  "jagannath": "Jagannath_Temple,_Puri",
  "meenakshi": "Meenakshi_Amman_Temple",
  "kamakhya": "Kamakhya_Temple",
  "srisailam": "Srisailam",
  "parasnath": "Parasnath",
  // West Bengal
  "darjeeling": "Darjeeling",
  "kalimpong": "Kalimpong",
  // Andhra / Telangana
  "araku": "Araku_Valley",
  "lepakshi": "Lepakshi",
  "horsley-hills": "Horsley_Hills",
};

// ---- FAQ templates per destination type ----
function generateFAQ(slug, title, destName) {
  const faqs = [];

  // Common travel FAQs
  faqs.push({
    q: `What is the best time to visit ${destName}?`,
    a: `The best time to visit ${destName} depends on the experience you seek. For pleasant weather and sightseeing, the winter months (October to March) are ideal. Monsoon season (July to September) brings lush greenery but can affect travel plans. Summer (April to June) is best for hill stations and high-altitude destinations.`,
  });

  faqs.push({
    q: `How many days are enough for ${destName}?`,
    a: `A well-planned trip to ${destName} typically requires 3 to 5 days to cover the major attractions and experiences. However, you can customize the duration based on your interests — whether it's adventure, spirituality, culture, or relaxation.`,
  });

  faqs.push({
    q: `What are the top things to do in ${destName}?`,
    a: `${destName} offers a rich blend of experiences including heritage sightseeing, local cuisine tasting, adventure activities, spiritual visits, and cultural immersion. Each corner of ${destName} has something unique to offer visitors.`,
  });

  faqs.push({
    q: `Is ${destName} safe for tourists?`,
    a: `Yes, ${destName} is a popular and safe tourist destination. Like any travel destination, it's advisable to follow standard safety precautions, keep valuables secure, and stay aware of local customs and regulations.`,
  });

  faqs.push({
    q: `How do I reach ${destName}?`,
    a: `${destName} is well-connected by road, rail, and air. The nearest airport and railway station provide easy access from major Indian cities. Our tour packages include comfortable transfers and pickup/drop facilities.`,
  });

  return faqs;
}

// ---- Content generation ----
function generateEnrichedBlocks(slug, wikiData, allPkgs) {
  const blocks = [];
  const title = allPkgs.find((p) => p.slug === slug)?.title || slug;
  const destName = title.replace(/\s*(Tour Package|Tour Packages|Tour|Package|Trip|Holiday|Holiday Package).*$/i, "").trim();

  // 1. Breadcrumb list
  blocks.push({
    type: "list",
    ordered: false,
    items: ["Home", "India", title],
  });

  // 2. Rich intro from Wikipedia
  if (wikiData?.extract) {
    blocks.push({
      type: "paragraph",
      content: wikiData.extract,
    });
  }

  // 3. Key highlights section
  if (wikiData?.highlights && wikiData.highlights.length > 0) {
    blocks.push({ type: "heading", level: 2, content: `Why Visit ${destName}?` });
    blocks.push({
      type: "paragraph",
      content: wikiData.highlights,
    });
  }

  // 4. Top attractions
  if (wikiData?.attractions && wikiData.attractions.length > 0) {
    blocks.push({ type: "heading", level: 2, content: `Top Attractions in ${destName}` });
    blocks.push({
      type: "list",
      ordered: false,
      items: wikiData.attractions,
    });
  }

  // 5. Best time to visit
  if (wikiData?.bestTime) {
    blocks.push({ type: "heading", level: 2, content: "Best Time to Visit" });
    blocks.push({ type: "paragraph", content: wikiData.bestTime });
  }

  // 6. How to reach
  if (wikiData?.howToReach) {
    blocks.push({ type: "heading", level: 2, content: "How to Reach" });
    blocks.push({ type: "paragraph", content: wikiData.howToReach });
  }

  // 7. Internal backlinks — related packages
  const relatedSlugs = findRelatedPackages(slug, allPkgs);
  if (relatedSlugs.length > 0) {
    blocks.push({ type: "heading", level: 2, content: "Related Tour Packages" });
    blocks.push({
      type: "paragraph",
      content: `Explore more tour packages: ${relatedSlugs
        .map((r) => `**${r.title}**`)
        .join(", ")}. Each package is carefully designed to give you the best experience.`,
    });
  }

  // 8. FAQ section
  const faqs = generateFAQ(slug, title, destName);
  if (faqs.length > 0) {
    blocks.push({ type: "heading", level: 2, content: "Frequently Asked Questions" });
    blocks.push({
      type: "faq",
      items: faqs,
    });
  }

  return blocks;
}

// ---- Find related packages ----
function findRelatedPackages(slug, allPkgs) {
  const current = allPkgs.find((p) => p.slug === slug);
  if (!current) return [];

  // Find packages in same category or destination
  const related = allPkgs
    .filter((p) => {
      if (p.slug === slug) return false;
      // Same category
      if (p.category === current.category) return true;
      // Shared keywords in slug
      const slugWords = slug.split("-");
      const pWords = p.slug.split("-");
      const shared = slugWords.filter((w) => pWords.includes(w) && w.length > 3);
      if (shared.length >= 2) return true;
      return false;
    })
    .slice(0, 4)
    .map((p) => ({ slug: p.slug, title: p.title }));

  return related;
}

// ---- Wikipedia fetcher ----
async function fetchWiki(slug) {
  // Find the Wikipedia article name
  let articleName = null;
  for (const [key, val] of Object.entries(WIKI_MAP)) {
    if (slug.includes(key)) {
      articleName = val;
      break;
    }
  }
  if (!articleName) return null;

  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(articleName)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    const data = await res.json();

    // Generate enriched content from the extract
    const extract = data.extract || "";
    const destName = articleName.replace(/_/g, " ");

    // Generate attractions from the extract
    const attractions = [];
    const sentences = extract.split(". ");
    for (const s of sentences) {
      if (s.includes("temple") || s.includes("fort") || s.includes("palace") || s.includes("museum") || s.includes("park") || s.includes("beach") || s.includes("lake") || s.includes("garden") || s.includes("shrine") || s.includes("cathedral") || s.includes("monument")) {
        const cleaned = s.replace(/^.*?(is |are |was )/, "").trim();
        if (cleaned.length > 10 && cleaned.length < 100) attractions.push(cleaned.charAt(0).toUpperCase() + cleaned.slice(1));
      }
    }

    return {
      extract: extract.length > 500 ? extract.slice(0, 500) + "..." : extract,
      highlights: `${destName} is renowned for its rich cultural heritage, historical significance, and diverse attractions. From ancient temples and forts to modern amenities and natural beauty, ${destName} offers an unforgettable experience for every traveler.`,
      attractions: attractions.slice(0, 6),
      bestTime: `The ideal time to visit ${destName} is during the winter months (October to March) when the weather is pleasant and perfect for sightseeing. Monsoon season (July to September) brings lush greenery, while summer (April to June) is suitable for high-altitude areas.`,
      howToReach: `${destName} is well-connected by road, rail, and air. The nearest airport and major railway stations provide convenient access from all major Indian cities. Our tour packages include comfortable AC transport and professional guides.`,
    };
  } catch (e) {
    console.log(`  Wiki fetch failed for ${articleName}: ${e.message}`);
    return null;
  }
}

// ---- Main enrichment loop ----
async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const onlySlug = process.argv.find((a) => a.startsWith("--slug="))?.split("=")[1];

  let enriched = 0;
  let skipped = 0;
  let wikiHits = 0;

  const slugs = onlySlug ? [onlySlug] : Object.keys(v3);

  for (const slug of slugs) {
    const pkg = v3[slug];
    if (!pkg || !pkg.blocks) {
      skipped++;
      continue;
    }

    // Check if content is thin (< 500 chars total)
    const totalText = pkg.blocks.map((b) => b.content || b.text || "").join(" ");
    if (totalText.length > 500 && !onlySlug) {
      skipped++;
      continue;
    }

    console.log(`Enriching: ${slug} (${totalText.length} chars)`);

    // Fetch Wikipedia data
    const wikiData = await fetchWiki(slug);
    if (wikiData) wikiHits++;

    // Generate enriched blocks
    const newBlocks = generateEnrichedBlocks(slug, wikiData, allPkgs);

    if (!dryRun) {
      pkg.blocks = newBlocks;
      v3[slug] = pkg;
    }

    enriched++;
    if (!onlySlug) await new Promise((r) => setTimeout(r, 200)); // Rate limit Wikipedia
  }

  // Write updated V3 (with retry for OneDrive locks)
  if (!dryRun && enriched > 0) {
    const body = JSON.stringify(v3, null, 2).replace(/\n/g, "\r\n");
    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        fs.writeFileSync(V3_PATH, body, "utf8");
        console.log(`\nWrote ${enriched} enriched packages to V3`);
        break;
      } catch (e) {
        console.log(`Write attempt ${attempt} failed: ${e.message}`);
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }

  console.log(`\n── Enrichment result ──`);
  console.log(`Enriched: ${enriched}`);
  console.log(`Skipped (already rich): ${skipped}`);
  console.log(`Wikipedia hits: ${wikiHits}/${enriched}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
