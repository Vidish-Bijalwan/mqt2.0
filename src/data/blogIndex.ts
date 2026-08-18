import fullBlogDataRaw from "@/data/fullBlogData.json";
import { getBlogImage } from "@/data/blogImageMap";

const fullBlogData = fullBlogDataRaw as Record<string, { title: string; content: any[]; url?: string }>;

// Extract and process all blogs
export const ALL_BLOGS = Object.entries(fullBlogData).map(([key, data], globalIdx) => {
  const cleanSlug = key.startsWith('blog__') ? key.replace('blog__', '') : key;
  const contentText = data.content?.filter(c => c.type === 'p').map(c => c.text).join(' ') || '';
  const wordCount = contentText.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Detect category from title/content
  const combined = (data.title + ' ' + contentText.substring(0, 300)).toLowerCase();
  let category = 'Travel';
  if (/pilgrim|yatra|temple|dham|jyotirlinga|spiritual|shrine/.test(combined)) category = 'Pilgrimage';
  else if (/adventure|trek|safari|rafting|camping|bungee|sport/.test(combined)) category = 'Adventure';
  else if (/beach|island|sea|coastal|cruise|goa|andaman|maldives/.test(combined)) category = 'Beaches';
  else if (/hill station|mountain|glacier|snowfall|valley|shimla|manali|ooty|munnar/.test(combined)) category = 'Hill Stations';
  else if (/food|restaurant|coffee|tea|cuisine|street food|dish/.test(combined)) category = 'Food & Cuisine';
  else if (/festival|culture|dance|art|museum|heritage|craft/.test(combined)) category = 'Cultural';
  else if (/tip|guide|budget|plan|pack|travel insurance|solo/.test(combined)) category = 'Travel Tips';
  else if (/hotel|resort|homestay|hostel|accommodation/.test(combined)) category = 'Hotels';
  else if (/buddhis|meditation|monastery/.test(combined)) category = 'Buddhist';
  else if (/honeymoon|romantic|couple/.test(combined)) category = 'Honeymoon';
  else if (/wildlife|national park|tiger|bird|sanctuary/.test(combined)) category = 'Wildlife';

  return {
    slug: cleanSlug,
    title: data.title?.replace(/ - My Quick Trippers Blog$/, '').replace(/ \| My Quick Trippers$/, '') || cleanSlug.replace(/-/g, ' '),
    snippet: contentText.substring(0, 160).trim() + (contentText.length > 160 ? '...' : '') || 'Discover this amazing destination...',
    image: getBlogImage(key, globalIdx),
    category,
    readingTime,
    wordCount,
  };
}).filter(b => b.wordCount > 30); // Filter out near-empty entries

// Get unique categories with counts
export const CATEGORIES = ['All Articles', ...Array.from(new Set(ALL_BLOGS.map(b => b.category))).sort()];
export const categoryCounts: Record<string, number> = { 'All Articles': ALL_BLOGS.length };
ALL_BLOGS.forEach(b => { categoryCounts[b.category] = (categoryCounts[b.category] || 0) + 1; });
