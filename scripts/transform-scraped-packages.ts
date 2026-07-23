const fs = require('fs');
const path = require('path');

// Read scraped data
const rawData = fs.readFileSync(path.resolve('./../scraped_data/mqt_packages_processed.json'), 'utf-8');
const scrapedData = JSON.parse(rawData);

// Read existing packages to preserve the hand-crafted ones if needed, or we can just replace
// But let's just use the scrapedData directly and transform it to ensure all 1244 are available.
const transformedPackages = scrapedData.map((pkg: any) => {
  // Try to fix images if they all default to chardham.jpg
  let img = pkg.image;
  if (img === '/images/packages/chardham.jpg' || !img) {
      img = `/images/packages/${pkg.slug}.webp`; // we can fallback to this pattern
  }

  return {
    slug: pkg.slug,
    title: pkg.title || pkg.slug.replace(/-/g, ' '),
    category: pkg.category || 'Tours',
    image: img,
    duration: pkg.duration || '',
    route: pkg.route || '',
    description: pkg.description || '',
    highlights: Array.isArray(pkg.highlights) ? pkg.highlights.filter((h: string) => !h.includes('Customer Center')) : [],
    price: pkg.price || '',
    oldPrice: pkg.oldPrice || '',
    discount: pkg.discount || ''
  };
});

// Remove duplicates based on slug
const uniquePackages = Array.from(new Map(transformedPackages.map((p: any) => [p.slug, p])).values());

// Save to data file
fs.writeFileSync(
  path.resolve(__dirname, '../src/data/allPackages.ts'),
  `export interface Package {\n  slug: string;\n  title: string;\n  category: string;\n  image: string;\n  duration: string;\n  route: string;\n  description: string;\n  highlights: string[];\n  price: string;\n  oldPrice: string;\n  discount: string;\n}\n\nexport const allPackages: Package[] = ${JSON.stringify(uniquePackages, null, 2)};\n`
);

console.log(`✅ Transformed ${uniquePackages.length} unique packages (out of ${transformedPackages.length} total)`);

// Show empty destinations
const allDestinations = require('../src/data/destinationsData.json');

const destinationKeywords: Record<string, string[]> = {
  "uttarakhand": ["haridwar", "rishikesh", "nainital", "mussoorie", "corbett", "auli", "kedarnath", "badrinath", "gangotri", "yamunotri", "dehradun", "joshimath", "almora", "ranikhet"],
  "himachal-pradesh": ["shimla", "manali", "dharamshala", "dalhousie", "kullu", "spiti", "kinnaur", "rohtang", "kasauli"],
  "uttar-pradesh": ["agra", "varanasi", "mathura", "vrindavan", "ayodhya", "prayagraj", "lucknow", "sarnath"],
  "kashmir": ["srinagar", "gulmarg", "pahalgam", 'sonmarg', 'kashmir', "amarnath", "katra", "vaishno devi", "jammu"],
  "goa": ["goa", "panjim", "calangute", "baga"],
  "gujarat": ["ahmedabad", "somnath", "dwarka", "gir", "kutch", "statue of unity", "rajkot"],
  "rajasthan": ["jaipur", "udaipur", "jodhpur", "jaisalmer", "pushkar", "bikaner", "mount abu", "ranthambore"],
  "maharashtra": ["mumbai", "pune", "lonavala", "mahabaleshwar", "shirdi", "aurangabad", "ajanta", "ellora"],
  "kerala": ["munnar", "thekkady", "alleppey", "kovalam", "kumarakom", "wayanad", "cochin", "trivandrum"],
  "tamil-nadu": ["chennai", "ooty", "kodaikanal", "madurai", "rameshwaram", "kanyakumari", "mahabalipuram"],
  "karnataka": ["bangalore", "mysore", "coorg", "hampi", "bandipur", "gokarna"],
  "madhya-pradesh": ["khajuraho", "kanha", "bandhavgarh", "gwalior", "ujjain", "bhopal", "indore"],
  "darjeeling": ["darjeeling", "kalimpong", "kurseong"],
  "sikkim": ["gangtok", "pelling", "lachung", "nathula"],
  "assam": ["guwahati", "kaziranga", "majuli", "shillong", "cherrapunji", "meghalaya"],
};

const emptyDests: string[] = [];

Object.keys(allDestinations).forEach((destSlug) => {
  const term = destSlug.toLowerCase();
  
  const matched = uniquePackages.filter((p: any) => {
    if (p.slug.toLowerCase().includes(term)) return true;
    if (p.category.toLowerCase().includes(term)) return true;
    if (p.route && p.route.toLowerCase().includes(term)) return true;
    
    const keywords = destinationKeywords[term] || [];
    for (const kw of keywords) {
      if (p.slug.toLowerCase().includes(kw)) return true;
      if (p.category.toLowerCase().includes(kw)) return true;
      if (p.route && p.route.toLowerCase().includes(kw)) return true;
    }
    return false;
  });

  if (matched.length === 0) {
    emptyDests.push(allDestinations[destSlug].title || destSlug);
  }
});

console.log('\\n❌ Empty Destinations:');
emptyDests.forEach(d => console.log(`  ${d}`));
