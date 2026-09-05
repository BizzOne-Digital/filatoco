/**
 * Generates public/sitemap.xml before the Vite build, including every
 * published product's real URL fetched from the live API. Falls back to
 * static pages only if the API is unreachable (so `npm run build` never
 * fails just because the backend is briefly down).
 *
 * Run automatically via package.json's "build" script.
 */
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_ORIGIN = process.env.VITE_SITE_URL || 'https://filatoco.ca';
const API_BASE = process.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/shop', priority: '0.9', changefreq: 'daily' },
  { path: '/pricing', priority: '0.6', changefreq: 'monthly' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly' },
  { path: '/custom-request', priority: '0.6', changefreq: 'monthly' },
  { path: '/faq', priority: '0.5', changefreq: 'monthly' },
  { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
  { path: '/shipping-returns', priority: '0.4', changefreq: 'yearly' },
  { path: '/care-instructions', priority: '0.4', changefreq: 'yearly' },
];

const urlEntry = ({ path: p, priority, changefreq, lastmod }) => `  <url>
    <loc>${SITE_ORIGIN}${p}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
  </url>`;

async function fetchProductUrls() {
  try {
    const res = await fetch(`${API_BASE}/products?limit=1000`);
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    const data = await res.json();
    return data.products
      .filter((p) => p.status === 'published')
      .map((p) => ({
        path: `/product/${p.slug}`,
        priority: '0.7',
        changefreq: 'weekly',
        lastmod: (p.updatedAt || p.createdAt || '').slice(0, 10) || undefined,
      }));
  } catch (err) {
    console.warn(`[generate-sitemap] Could not fetch products (${err.message}) — sitemap will only include static pages.`);
    return [];
  }
}

const productUrls = await fetchProductUrls();
const allUrls = [...STATIC_PAGES, ...productUrls];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(urlEntry).join('\n')}
</urlset>
`;

writeFileSync(path.join(__dirname, '../public/sitemap.xml'), xml);
console.log(`[generate-sitemap] Wrote sitemap.xml with ${allUrls.length} URLs (${productUrls.length} products).`);
