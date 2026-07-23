const fs = require('fs');
const path = require('path');
const { allPackages } = require('../src/data/allPackages');

// Counters and trackers
let badImages = [];
const destinationCounts = {};

// Iterate through packages
allPackages.forEach(pkg => {
  const isBad = !pkg.image || pkg.image === '' || pkg.image === '/images/packages/chardham.jpg';
  
  if (isBad && !pkg.slug.includes("char-dham") && !pkg.slug.includes("chardham")) {
    badImages.push({
      slug: pkg.slug,
      name: pkg.title,
      destination: pkg.route || 'Unknown'
    });
  }
  
  const dest = pkg.route || 'Unknown';
  if (!destinationCounts[dest]) destinationCounts[dest] = 0;
  destinationCounts[dest]++;
});

// Log results
fs.writeFileSync(path.resolve(__dirname, 'missing_images.txt'), JSON.stringify(badImages, null, 2));

console.log(`✅ Audit Complete.`);
console.log(`❌ Found ${badImages.length} packages with missing or bad generic images.`);
console.log(`\n📊 Data Distribution (Top 10 Destinations):`);

Object.entries(destinationCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .forEach(([dest, count]) => {
     console.log(`  ${dest}: ${count} packages`);
  });

console.log(`\nAverage packages per unique destination route: ${Math.round(allPackages.length / Object.keys(destinationCounts).length)}`);
