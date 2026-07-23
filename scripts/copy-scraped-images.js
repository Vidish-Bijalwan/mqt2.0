const fs = require('fs');
const path = require('path');

const imagesDir = path.resolve(__dirname, '../../scraped_data/images');
const publicPackagesDir = path.resolve(__dirname, '../public/images/packages');
const allPackagesPath = path.resolve(__dirname, '../src/data/allPackages.ts');

if (!fs.existsSync(publicPackagesDir)) {
  fs.mkdirSync(publicPackagesDir, { recursive: true });
}

// 1. Copy images
console.log('Copying images from scraped_data to public/images/packages...');
let copiedCount = 0;

try {
  const dirs = fs.readdirSync(imagesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const dir of dirs) {
    // Some directories have .html at the end, slug is without it
    const slug = dir.replace(/\.html$/, '');
    
    const sourceDirPath = path.join(imagesDir, dir);
    const files = fs.readdirSync(sourceDirPath).filter(f => f.endsWith('.webp') || f.endsWith('.jpg') || f.endsWith('.png'));
    
    if (files.length > 0) {
      const sourceFile = path.join(sourceDirPath, files[0]);
      const targetFile = path.join(publicPackagesDir, `${slug}.webp`); // Most are webp, if not, Next.js Image still serves it fine or we keep ext
      
      const ext = path.extname(files[0]);
      const finalTargetFile = path.join(publicPackagesDir, `${slug}${ext}`);
      
      fs.copyFileSync(sourceFile, finalTargetFile);
      copiedCount++;
    }
  }
  
  console.log(`✅ Copied ${copiedCount} images to public/images/packages/`);
} catch (e) {
  console.error("Error copying images:", e);
}

// 2. Update allPackages.ts to point to these new specific images!
console.log('Updating allPackages.ts with new image paths...');
try {
  let content = fs.readFileSync(allPackagesPath, 'utf8');
  
  // We want to replace image: "..." with image: "/images/packages/[slug].webp" where we know it exists.
  // Actually, we can just replace all fallback images with the specific slug path if the file exists!
  
  const publicFiles = fs.readdirSync(publicPackagesDir);
  
  // Quick and dirty regex to find and replace images in the data file
  // It's a huge array of objects. It's safer to just run a quick regex replacement or rewrite.
  // But wait! We already have `imageMapper.ts` handling fallbacks! 
  // If we just change allPackages.ts to have `image: "/images/packages/" + pkg.slug + ".webp"` it will just work!
  
  let updatedContent = content;
  
  for (const file of publicFiles) {
    const slug = file.replace(/\.(webp|jpg|png)$/, '');
    const imagePath = `/images/packages/${file}`;
    
    // Find the object with slug: "slug" and update its image property.
    // Regex to match: slug: "slug", (any whitespace/other props) image: "something"
    // Since TS file is stringified JSON-like objects, we can do a global replace for that specific package
    
    const slugRegex = new RegExp(`slug:\\s*["']${slug}["']([\\s\\S]*?)image:\\s*["'][^"']*["']`, 'g');
    updatedContent = updatedContent.replace(slugRegex, `slug: "${slug}"$1image: "${imagePath}"`);
  }
  
  fs.writeFileSync(allPackagesPath, updatedContent);
  console.log('✅ Updated allPackages.ts with accurate image paths');

} catch (e) {
  console.error("Error updating allPackages.ts:", e);
}
