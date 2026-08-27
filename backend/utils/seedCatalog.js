/**
 * Seeds demo categories and products (Unsplash stock photography) so the shop
 * and homepage have content to display. Replace with real photos via the Admin
 * panel (Cloudinary-backed) whenever you're ready.
 *
 * Run: node utils/seedCatalog.js
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

const img = (id, w = 800) => ({ url: `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop` });

await connectDB();

console.log('Clearing existing categories and products...');
await Promise.all([Category.deleteMany({}), Product.deleteMany({})]);

console.log('Seeding categories...');
const categoryDefs = [
  { name: 'Crochet Bags', description: 'Handmade crochet handbags and purses.', photo: '1591561954557-26941169b49e' },
  { name: 'Tapestry Bags', description: 'Woven tapestry-style bags with rich texture.', photo: '1601924994987-69e26d50dc26' },
  { name: 'Sewn Bags', description: 'Carefully sewn fabric bags.', photo: '1544816155-12df9643f363' },
  { name: 'Shoulder Bags', description: 'Everyday handmade shoulder bags.', photo: '1548036328-c9fa89d128fa' },
  { name: 'Tote Bags', description: 'Spacious handmade totes.', photo: '1584917865442-de89df76afd3' },
  { name: 'Crossbody Bags', description: 'Compact handmade crossbody bags.', photo: '1553062407-98eeb64c6a62' },
];
const categories = await Category.insertMany(
  categoryDefs.map((c) => ({ name: c.name, description: c.description, image: img(c.photo), isActive: true }))
);
const catByName = Object.fromEntries(categories.map((c) => [c.name, c]));

console.log('Seeding products...');
const productDefs = [
  { name: 'Everyday Shoulder Bag', category: 'Shoulder Bags', productType: 'shoulder-bag', price: 40, photo: '1548036328-c9fa89d128fa', featured: true },
  { name: 'Chain Handle Tote', category: 'Tote Bags', productType: 'tote', price: 65, photo: '1584917865442-de89df76afd3', featured: true },
  { name: 'Classic Crochet Shoulder Bag', category: 'Crochet Bags', productType: 'crochet', price: 85, photo: '1590874103328-eac38a683ce7', featured: true },
  { name: 'Bow Basket Bag', category: 'Crochet Bags', productType: 'crochet', price: 120, photo: '1596462502278-27bfdc403348', featured: true },
  { name: 'Woven Tapestry Crossbody', category: 'Tapestry Bags', productType: 'tapestry', price: 58, photo: '1601924994987-69e26d50dc26', newArrival: true },
  { name: 'Linen Sewn Shoulder Bag', category: 'Sewn Bags', productType: 'sewn', price: 72, photo: '1544816155-12df9643f363', newArrival: true },
  { name: 'Mini Crochet Crossbody', category: 'Crossbody Bags', productType: 'crossbody', price: 45, photo: '1553062407-98eeb64c6a62', newArrival: true },
  { name: 'Market Day Tote', category: 'Tote Bags', productType: 'tote', price: 95, photo: '1605733160314-4fc7dac4bb16', newArrival: true },
];

for (const p of productDefs) {
  await Product.create({
    name: p.name,
    description: `The ${p.name} is thoughtfully handcrafted with care, individuality and timeless craftsmanship — a true FilatoCo original.`,
    shortDescription: 'Handmade with love, one stitch at a time.',
    price: p.price,
    category: catByName[p.category]._id,
    materials: ['Cotton Yarn'],
    colors: ['Beige', 'Cream'],
    dimensions: '30cm x 25cm x 12cm',
    stock: 5,
    productType: p.productType,
    madeType: 'ready-made',
    images: [img(p.photo)],
    isFeatured: !!p.featured,
    isNewArrival: !!p.newArrival,
    status: 'published',
  });
}

console.log('Catalog seeded successfully.');
await mongoose.disconnect();
process.exit(0);
