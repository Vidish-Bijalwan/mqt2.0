const fs = require('fs');
const path = require('path');

const metadataPath = path.resolve(__dirname, '../../scraped_data/image_metadata.json');
const packagesPath = path.resolve(__dirname, '../src/data/allPackages.ts');
const publicImagesDir = path.resolve(__dirname, '../public/images/packages');
const workspaceRoot = path.resolve(__dirname, '../../');

// Read the image metadata
const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

// Filter out missing pages, logos, and banners
const validImages = metadata.filter(img => {
  if (!img.page_url || !img.local_path || img.download_status !== 'downloaded') return false;
  // Ignore homepage/index images for packages
  if (img.page_url === 'https://www.namasteindiatrip.com/') return false;
  
  // Ignore obvious logos or awards
  if (img.url.includes('award') || img.url.includes('logo') || img.url.includes('ministry-of-tourism')) return false;

  // We want to avoid tiny thumbnails or banners. Let's rely on size.
  return true;
});

// Group by package slug (extracted from page_url)
const imagesBySlug = {};

for (const img of validImages) {
  // Extract slug from URL: https://www.namasteindiatrip.com/slug-name
  let slug = img.page_url.split('/').filter(Boolean).pop();
  if (!slug) continue;
  
  slug = slug.replace('.html', ''); // Clean up any html extensions

  if (!imagesBySlug[slug]) {
    imagesBySlug[slug] = [];
  }
  
  imagesBySlug[slug].push(img);
}

console.log(`Found images for ${Object.keys(imagesBySlug).length} distinct packages.`);

// Ensure target directory exists
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

// Map of slug -> best image path
const bestImageMap = {};
let copiedCount = 0;

for (const slug of Object.keys(imagesBySlug)) {
  const images = imagesBySlug[slug];
  
  // Sort images by resolution (width * height) descending, or by size descending if dimensions missing
  images.sort((a, b) => {
    const areaA = (a.detected_width || 0) * (a.detected_height || 0);
    const areaB = (b.detected_width || 0) * (b.detected_height || 0);
    
    if (areaA > 0 && areaB > 0) {
      return areaB - areaA;
    }
    return (b.size_bytes || 0) - (a.size_bytes || 0);
  });
  
  // The first one is the best one!
  const bestImage = images[0];
  
  const sourcePath = path.resolve(workspaceRoot, bestImage.local_path);
  const ext = path.extname(sourcePath) || '.jpg';
  
  const targetFileName = `${slug}${ext}`;
  const targetPath = path.join(publicImagesDir, targetFileName);
  
  try {
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath);
      bestImageMap[slug] = `/images/packages/${targetFileName}`;
      copiedCount++;
    }
  } catch (e) {
    console.error(`Failed to copy image for ${slug}: ${e.message}`);
  }
}

console.log(`✅ Successfully copied the best ${copiedCount} images into public directory.`);

// Now, update allPackages.ts
console.log('Updating allPackages.ts...');
let packagesContent = fs.readFileSync(packagesPath, 'utf8');

let updatedCount = 0;
for (const slug of Object.keys(bestImageMap)) {
  const bestImagePath = bestImageMap[slug];
  
  // Regex to find the object with this slug and replace its image field
  // Match: slug: "the-slug", followed by anything (non-greedily) until image: "something"
  const slugRegex = new RegExp(`"?slug"?:\\s*["']${slug}["']([\\s\\S]*?)"?image"?:\\s*["'][^"']*["']`, 'g');
  
  if (packagesContent.match(slugRegex)) {
    packagesContent = packagesContent.replace(slugRegex, `"slug": "${slug}"$1"image": "${bestImagePath}"`);
    updatedCount++;
  }
}

fs.writeFileSync(packagesPath, packagesContent);
console.log(`✅ Updated ${updatedCount} packages in allPackages.ts with accurate scenic images.`);
