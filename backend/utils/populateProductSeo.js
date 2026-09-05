/**
 * Populates SEO Title and SEO Description for every product that doesn't
 * already have one set manually (never overwrites existing values).
 * Uses each product's real name, category, style and materials/colors —
 * no invented information.
 *
 * Run: node utils/populateProductSeo.js
 * (Requires ADMIN_API_EMAIL / ADMIN_API_PASSWORD or defaults to the seeded admin.)
 */
import 'dotenv/config';

const API_BASE = process.env.SEO_API_BASE || 'https://filatoco-api.vercel.app/api';
const ADMIN_EMAIL = process.env.ADMIN_API_EMAIL || 'admin@filatoco.ca';
const ADMIN_PASSWORD = process.env.ADMIN_API_PASSWORD;

if (!ADMIN_PASSWORD) {
  console.error('Set ADMIN_API_PASSWORD env var before running this script.');
  process.exit(1);
}

const STYLE_LABELS = {
  'shoulder-bag': 'Shoulder Bag',
  handbag: 'Handbag',
  crossbody: 'Crossbody Bag',
  tote: 'Tote',
  clutch: 'Clutch',
};

const buildSeoTitle = (p) => {
  const style = STYLE_LABELS[p.productType] || 'Bag';
  return `${p.name} – Handmade ${style} | FilatoCo`;
};

const buildSeoDescription = (p) => {
  const style = (STYLE_LABELS[p.productType] || 'bag').toLowerCase();
  const category = (p.category?.name || 'handmade').toLowerCase();
  const materials = p.materials?.filter(Boolean).join(', ');
  const colors = p.colors?.filter(Boolean).join(', ');

  let sentence = `${p.name} is a handmade ${category} ${style} from FilatoCo`;
  if (colors) sentence += `, in ${colors.toLowerCase()}`;
  if (materials) sentence += `, made from ${materials.toLowerCase()}`;
  sentence += `. Thoughtfully crafted, one-of-a-kind, and priced at $${p.price.toFixed(2)} CAD.`;
  return sentence;
};

async function main() {
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
  const { token } = await loginRes.json();

  const productsRes = await fetch(`${API_BASE}/products?limit=200`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const { products } = await productsRes.json();

  let updated = 0;
  let skipped = 0;

  for (const p of products) {
    if (p.seoTitle && p.seoDescription) {
      skipped++;
      continue;
    }

    const fd = new FormData();
    if (!p.seoTitle) fd.append('seoTitle', buildSeoTitle(p));
    if (!p.seoDescription) fd.append('seoDescription', buildSeoDescription(p));

    const res = await fetch(`${API_BASE}/products/${p._id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    if (!res.ok) {
      console.error(`FAILED: ${p.name} (${res.status})`);
      continue;
    }
    console.log(`Updated: ${p.name}`);
    updated++;
  }

  console.log(`\nDone. Updated ${updated}, skipped ${skipped} (already had SEO fields).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
