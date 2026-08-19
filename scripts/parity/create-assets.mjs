#!/usr/bin/env node
/**
 * Generate all missing image assets for MQT site.
 * Creates SVG-based placeholders that look professional.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');

// Color palettes for destinations
const DEST_COLORS = {
  'kashmir': { bg: '#1e40af', accent: '#60a5fa' },
  'kerala': { bg: '#065f46', accent: '#34d399' },
  'rajasthan': { bg: '#92400e', accent: '#fbbf24' },
  'himachal-pradesh': { bg: '#1e3a5f', accent: '#7dd3fc' },
  'uttarakhand': { bg: '#166534', accent: '#4ade80' },
  'goa': { bg: '#0e7490', accent: '#22d3ee' },
  'andaman': { bg: '#0369a1', accent: '#38bdf8' },
  'dubai': { bg: '#78350f', accent: '#fcd34d' },
  'bali': { bg: '#166534', accent: '#86efac' },
  'thailand': { bg: '#7c2d12', accent: '#fb923c' },
  'singapore': { bg: '#1e1b4b', accent: '#a78bfa' },
  'nepal': { bg: '#1e3a5f', accent: '#93c5fd' },
  'ladakh': { bg: '#1e293b', accent: '#cbd5e1' },
  'varanasi': { bg: '#78350f', accent: '#fbbf24' },
  'darjeeling': { bg: '#14532d', accent: '#4ade80' },
};

// Avatar names from reviews.ts
const AVATARS = [
  'rahul', 'priya', 'amit', 'sarah', 'vikram', 'deepa', 'rajesh', 'meera',
  'arjun', 'kavitha', 'sanjay', 'neha', 'manoj', 'anjali', 'prakash'
];

// Tour thumbnails from popularTourReviews
const TOURS = [
  'kashmir', 'kerala', 'rajasthan', 'bali', 'ladakh', 'andaman'
];

function createAvatarSVG(initial, colors) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors[0]}"/>
      <stop offset="100%" style="stop-color:${colors[1]}"/>
    </linearGradient>
  </defs>
  <circle cx="100" cy="100" r="100" fill="url(#bg)"/>
  <text x="100" y="115" font-family="Arial,sans-serif" font-size="72" font-weight="bold" fill="white" text-anchor="middle">${initial}</text>
</svg>`;
}

function createDestinationSVG(name, colors) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.bg}"/>
      <stop offset="100%" style="stop-color:${colors.accent}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="url(#bg)"/>
  <text x="400" y="240" font-family="Arial,sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle" opacity="0.3">${name.charAt(0)}</text>
  <text x="400" y="290" font-family="Arial,sans-serif" font-size="28" font-weight="600" fill="white" text-anchor="middle">${name}</text>
  <text x="400" y="320" font-family="Arial,sans-serif" font-size="16" fill="white" text-anchor="middle" opacity="0.7">My Quick Trippers</text>
</svg>`;
}

function createTourSVG(name, colors) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.bg}"/>
      <stop offset="100%" style="stop-color:${colors.accent}"/>
    </linearGradient>
  </defs>
  <rect width="600" height="400" rx="12" fill="url(#bg)"/>
  <text x="300" y="190" font-family="Arial,sans-serif" font-size="64" font-weight="bold" fill="white" text-anchor="middle" opacity="0.2">${name.charAt(0).toUpperCase()}</text>
  <text x="300" y="230" font-family="Arial,sans-serif" font-size="24" font-weight="600" fill="white" text-anchor="middle">${name} Tour Package</text>
  <text x="300" y="260" font-family="Arial,sans-serif" font-size="14" fill="white" text-anchor="middle" opacity="0.7">My Quick Trippers</text>
</svg>`;
}

function createHeroSVG(text, subtext) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="800" viewBox="0 0 1920 800">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#061b30"/>
      <stop offset="50%" style="stop-color:#1a2744"/>
      <stop offset="100%" style="stop-color:#061b30"/>
    </linearGradient>
  </defs>
  <rect width="1920" height="800" fill="url(#bg)"/>
  <circle cx="960" cy="400" r="300" fill="none" stroke="#fb4d00" stroke-width="0.5" opacity="0.15"/>
  <circle cx="960" cy="400" r="200" fill="none" stroke="#fb4d00" stroke-width="0.5" opacity="0.1"/>
  <text x="960" y="380" font-family="Arial,sans-serif" font-size="56" font-weight="bold" fill="white" text-anchor="middle" opacity="0.9">${text}</text>
  <text x="960" y="430" font-family="Arial,sans-serif" font-size="20" fill="#fb4d00" text-anchor="middle">${subtext}</text>
</svg>`;
}

// 1. Create avatars
const AVATAR_COLORS = [
  ['#3b82f6', '#8b5cf6'],
  ['#ec4899', '#f43f5e'],
  ['#10b981', '#06b6d4'],
  ['#f59e0b', '#ef4444'],
  ['#6366f1', '#a855f7'],
  ['#14b8a6', '#22d3ee'],
  ['#f97316', '#eab308'],
  ['#8b5cf6', '#d946ef'],
  ['#0ea5e9', '#3b82f6'],
  ['#22c55e', '#84cc16'],
  ['#e11d48', '#be123c'],
  ['#0891b2', '#06b6d4'],
  ['#7c3aed', '#c084fc'],
  ['#ea580c', '#f59e0b'],
  ['#2563eb', '#7c3aed'],
];

AVATARS.forEach((name, i) => {
  const initial = name.charAt(0).toUpperCase();
  const colors = AVATAR_COLORS[i % AVATAR_COLORS.length];
  const svg = createAvatarSVG(initial, colors);
  fs.writeFileSync(path.join(root, 'public/avatars', `${name}.svg`), svg);
});
console.log(`Created ${AVATARS.length} avatars`);

// 2. Create destination thumbnails
Object.entries(DEST_COLORS).forEach(([slug, colors]) => {
  const name = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const svg = createDestinationSVG(name, colors);
  fs.writeFileSync(path.join(root, 'public/destinations', `${slug}.svg`), svg);
});
console.log(`Created ${Object.keys(DEST_COLORS).length} destination thumbnails`);

// 3. Create tour thumbnails
TOURS.forEach(slug => {
  const name = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const colors = DEST_COLORS[slug] || { bg: '#1e293b', accent: '#94a3b8' };
  const svg = createTourSVG(name, colors);
  fs.writeFileSync(path.join(root, 'public/tours', `${slug}.svg`), svg);
});
console.log(`Created ${TOURS.length} tour thumbnails`);

// 4. Create hero backgrounds
const heroes = [
  { file: 'hero-bg-1.svg', text: 'Explore India', sub: 'Curated Tour Packages with Expert Guidance' },
  { file: 'hero-bg-2.svg', text: 'Your Journey', sub: 'Our Expertise — My Quick Trippers' },
];
heroes.forEach(h => {
  fs.writeFileSync(path.join(root, 'public/images/hero', h.file), createHeroSVG(h.text, h.sub));
});
console.log(`Created ${heroes.length} hero backgrounds`);

// 5. Create OG image
const ogImage = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#061b30"/>
      <stop offset="100%" style="stop-color:#1a2744"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="40" y="40" width="1120" height="550" rx="20" fill="none" stroke="#fb4d00" stroke-width="2" opacity="0.3"/>
  <text x="600" y="250" font-family="Arial,sans-serif" font-size="64" font-weight="bold" fill="white" text-anchor="middle">My Quick Trippers</text>
  <text x="600" y="310" font-family="Arial,sans-serif" font-size="28" fill="#fb4d00" text-anchor="middle">Your Journey, Our Expertise</text>
  <text x="600" y="370" font-family="Arial,sans-serif" font-size="20" fill="#94a3b8" text-anchor="middle">Curated India & International Tour Packages</text>
  <text x="600" y="420" font-family="Arial,sans-serif" font-size="16" fill="#64748b" text-anchor="middle">www.myquicktrippers.com</text>
</svg>`;
fs.writeFileSync(path.join(root, 'public/images/og-default.svg'), ogImage);
console.log('Created OG image');

// 6. Create favicon
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <circle cx="16" cy="16" r="16" fill="#061b30"/>
  <text x="16" y="22" font-family="Arial,sans-serif" font-size="16" font-weight="bold" fill="#fb4d00" text-anchor="middle">M</text>
</svg>`;
fs.writeFileSync(path.join(root, 'public/favicon.svg'), favicon);
console.log('Created favicon');

console.log('\n✅ All assets created successfully!');
