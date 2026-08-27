/**
 * Seeds non-catalog demo content: homepage text, testimonials, gallery, site settings.
 * Categories and Products are intentionally NOT seeded here — manage them from the
 * Admin panel (/admin/categories, /admin/products), where images upload to Cloudinary.
 *
 * Run: node utils/seedDemoData.js
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Testimonial from '../models/Testimonial.js';
import Gallery from '../models/Gallery.js';
import HomepageContent from '../models/HomepageContent.js';
import SiteSettings from '../models/SiteSettings.js';

const img = (id, w = 800) => ({ url: `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop` });

await connectDB();

console.log('Clearing existing testimonials and gallery...');
await Promise.all([Testimonial.deleteMany({}), Gallery.deleteMany({})]);

console.log('Seeding homepage content...');
await HomepageContent.findOneAndUpdate(
  { key: 'homepage' },
  {
    key: 'homepage',
    heroHeading: 'Handmade Purses That Tell a Story',
    heroSubtext: 'Thoughtfully handcrafted crochet, tapestry and sewn bags created with passion, individuality and timeless craftsmanship.',
  },
  { upsert: true }
);

console.log('Seeding testimonials...');
await Testimonial.insertMany([
  { customerName: 'Sarah M.', review: 'My FilatoCo bag is stunning — the craftsmanship is incredible and I get compliments everywhere I go.', rating: 5, isPublished: true, sortOrder: 1 },
  { customerName: 'Priya K.', review: 'You can feel the love in every stitch. This is more than a bag, it truly is a story.', rating: 5, isPublished: true, sortOrder: 2 },
  { customerName: 'Emma R.', review: 'Ordered a custom piece and it exceeded every expectation. Mirella was wonderful to work with.', rating: 5, isPublished: true, sortOrder: 3 },
]);

console.log('Seeding gallery...');
const galleryPhotos = ['1590874103328-eac38a683ce7', '1548036328-c9fa89d128fa', '1584917865442-de89df76afd3', '1553062407-98eeb64c6a62', '1601924994987-69e26d50dc26', '1544816155-12df9643f363'];
await Gallery.insertMany(galleryPhotos.map((photo, i) => ({ image: img(photo, 500), isActive: true, sortOrder: i })));

console.log('Updating site settings...');
await SiteSettings.findOneAndUpdate(
  { key: 'site' },
  { key: 'site', siteName: 'FilatoCo', phone: '905 5165462', email: 'mirellascarcelli@gmail.com', instagram: 'filatoco', priceRangeMin: 40, priceRangeMax: 120 },
  { upsert: true }
);

console.log('Demo data seeded successfully. Add categories and products from /admin.');
await mongoose.disconnect();
process.exit(0);
