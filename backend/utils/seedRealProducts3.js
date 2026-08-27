/**
 * Uploads 5 more real product photos (img16.jpg .. img20.jpg) to Cloudinary and
 * adds them as new products alongside the existing catalog. Also assigns
 * cat3.jpg to the "Crochet Bags" category image (still missing one).
 *
 * Run: node utils/seedRealProducts3.js
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
  { file: 'img16.jpg', name: 'Golden Tote with Leather Straps', category: 'Tote Bags', productType: 'tote', price: 80, colors: ['Gold'] },
  { file: 'img17.jpg', name: 'Noir Gold Braid Handle Bag', category: 'Shoulder Bags', productType: 'shoulder-bag', price: 90, colors: ['Black', 'Gold'], isFeatured: true },
  { file: 'img18.jpg', name: 'Two-Tone Braided Shoulder Bag', category: 'Shoulder Bags', productType: 'shoulder-bag', price: 76, colors: ['Taupe', 'Charcoal'] },
  { file: 'img19.jpg', name: '"Lydi" Top Handle Bag', category: 'Tote Bags', productType: 'top-handle', price: 84, colors: ['Brown'], isFeatured: true },
  { file: 'img20.jpg', name: 'Mini Knit Basket Bag', category: 'Crochet Bags', productType: 'top-handle', price: 58, colors: ['Taupe'] },
];

await connectDB();

const categories = await Category.find({});
const catByName = Object.fromEntries(categories.map((c) => [c.name, c]));

console.log('Uploading products...');
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

console.log('Assigning cat3.jpg to Crochet Bags category image...');
const crochetCat = catByName['Crochet Bags'];
if (crochetCat) {
  const catResult = await cloudinary.uploader.upload(path.join(FRONTEND_PUBLIC, 'cat3.jpg'), { folder: 'filatoco/categories' });
  crochetCat.image = { url: catResult.secure_url, publicId: catResult.public_id };
  await crochetCat.save();
  console.log('Crochet Bags category image updated.');
} else {
  console.log('Crochet Bags category not found — skipped.');
}

console.log('Done. Note: "Tote Bags" category still has no image.');
await mongoose.disconnect();
process.exit(0);
