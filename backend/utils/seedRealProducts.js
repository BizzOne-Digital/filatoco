/**
 * Uploads the 10 real product photos (frontend/public/img1.jpg .. img10.jpg) to
 * Cloudinary and replaces the demo product catalog with them. Categories are
 * NOT touched — this matches against categories already created in Admin.
 *
 * Run: node utils/seedRealProducts.js
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
  { file: 'img1.jpg', name: 'Chain Handle Bucket Bag', category: 'Tote Bags', productType: 'tote', price: 68, isFeatured: true },
  { file: 'img2.jpg', name: 'Cocoa Braided Shoulder Bag', category: 'Shoulder Bags', productType: 'shoulder-bag', price: 78 },
  { file: 'img3.jpg', name: 'Mini Flower Crossbody Pouch', category: 'Crossbody Bags', productType: 'crossbody', price: 42 },
  { file: 'img4.jpg', name: 'Beige Ribbon Strap Crossbody', category: 'Crossbody Bags', productType: 'crossbody', price: 45, isNewArrival: true },
  { file: 'img5.jpg', name: 'Woven Pattern Crossbody', category: 'Tapestry Bags', productType: 'tapestry', price: 55, isNewArrival: true },
  { file: 'img6.jpg', name: 'Sage Crochet Wristlet', category: 'Crochet Bags', productType: 'crochet', price: 38 },
  { file: 'img7.jpg', name: '"Maria" Crossbody Bag', category: 'Crossbody Bags', productType: 'crossbody', price: 62, isFeatured: true },
  { file: 'img8.jpg', name: 'Rust Chain Mini Bag', category: 'Crossbody Bags', productType: 'crossbody', price: 48 },
  { file: 'img9.jpg', name: 'Striped Boho Clutch', category: 'Crochet Bags', productType: 'crochet', price: 44 },
  { file: 'img10.jpg', name: 'Heart Clasp Top Handle Bag', category: 'Tote Bags', productType: 'top-handle', price: 92, isFeatured: true },
];

await connectDB();

const categories = await Category.find({});
const catByName = Object.fromEntries(categories.map((c) => [c.name, c]));

const missing = [...new Set(productDefs.map((p) => p.category))].filter((name) => !catByName[name]);
for (const name of missing) {
  const created = await Category.create({ name, description: `Handmade ${name.toLowerCase()}.`, isActive: true });
  catByName[name] = created;
  console.log(`Created missing category: ${name} (add an image for it in Admin)`);
}

console.log('Clearing existing products...');
await Product.deleteMany({});

console.log('Uploading photos to Cloudinary and creating products...');
for (const p of productDefs) {
  const filePath = path.join(FRONTEND_PUBLIC, p.file);
  const result = await cloudinary.uploader.upload(filePath, { folder: 'filatoco/products' });

  await Product.create({
    name: p.name,
    description: `The ${p.name.replace(/"/g, '')} is thoughtfully handcrafted with care, individuality and timeless craftsmanship — a true FilatoCo original.`,
    shortDescription: 'Handmade with love, one stitch at a time.',
    price: p.price,
    category: catByName[p.category]._id,
    materials: ['Cotton Yarn'],
    colors: ['Beige', 'Taupe'],
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

console.log('Done. Real product catalog is live.');
await mongoose.disconnect();
process.exit(0);
