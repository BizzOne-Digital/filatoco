/**
 * Uploads 5 more real product photos (img11.jpg .. img15.jpg) to Cloudinary and
 * adds them as new products alongside the existing catalog.
 *
 * Run: node utils/seedRealProducts2.js
 */
import 'dotenv/config';
import path from 'path';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import cloudinary from '../config/cloudinary.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

const FRONTEND_PUBLIC = path.resolve(process.cwd(), '../frontend/public');

const productDefs = [
  { file: 'img11.jpg', name: 'Terracotta Wood Handle Clutch', category: 'Crochet Bags', productType: 'top-handle', price: 72, colors: ['Terracotta'] },
  { file: 'img12.jpg', name: 'Burgundy Braided Hobo Bag', category: 'Shoulder Bags', productType: 'shoulder-bag', price: 82, colors: ['Burgundy'] },
  { file: 'img13.jpg', name: 'Duo Chain Shoulder Bag', category: 'Shoulder Bags', productType: 'shoulder-bag', price: 75, colors: ['Black', 'Brown'], isFeatured: true },
  { file: 'img14.jpg', name: 'Coral Gold Handle Tote', category: 'Tote Bags', productType: 'tote', price: 85, colors: ['Coral'], isNewArrival: true },
  { file: 'img15.jpg', name: 'Wooden Bead Top Handle Bag', category: 'Tote Bags', productType: 'top-handle', price: 88, colors: ['Mauve'], isFeatured: true },
];

await connectDB();

const categories = await Category.find({});
const catByName = Object.fromEntries(categories.map((c) => [c.name, c]));

for (const p of productDefs) {
  const filePath = path.join(FRONTEND_PUBLIC, p.file);
  const result = await cloudinary.uploader.upload(filePath, { folder: 'filatoco/products' });

  await Product.create({
    name: p.name,
    description: `The ${p.name} is thoughtfully handcrafted with care, individuality and timeless craftsmanship — a true FilatoCo original.`,
    shortDescription: 'Handmade with love, one stitch at a time.',
    price: p.price,
    category: catByName[p.category]._id,
    materials: ['Cotton Yarn'],
    colors: p.colors,
    dimensions: '25cm x 20cm x 10cm',
    stock: 3,
    productType: p.productType,
    madeType: 'ready-made',
    images: [{ url: result.secure_url, publicId: result.public_id }],
    isFeatured: !!p.isFeatured,
    isNewArrival: !!p.isNewArrival,
    status: 'published',
  });
  console.log(`Created: ${p.name}`);
}

console.log('Done.');
await mongoose.disconnect();
process.exit(0);
