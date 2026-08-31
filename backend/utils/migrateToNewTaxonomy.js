/**
 * One-time migration to the client-approved taxonomy (confirmed via Instagram DM):
 *   Category (material)  = Crocheted | Tapestry
 *   productType (style)  = shoulder-bag | handbag | crossbody | tote | clutch
 *
 * Replaces the old 5-category / 7-productType structure. Carries over existing
 * category images where possible instead of re-uploading.
 *
 * Run: node utils/migrateToNewTaxonomy.js
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

// name -> { newCategory, newProductType }
const PRODUCT_MAP = {
  'Chain Handle Bucket Bag': { category: 'Crocheted', productType: 'tote' },
  'Cocoa Braided Shoulder Bag': { category: 'Crocheted', productType: 'shoulder-bag' },
  'Mini Flower Crossbody Pouch': { category: 'Crocheted', productType: 'crossbody' },
  'Beige Ribbon Strap Crossbody': { category: 'Crocheted', productType: 'crossbody' },
  'Woven Pattern Crossbody': { category: 'Tapestry', productType: 'crossbody' },
  'Sage Crochet Wristlet': { category: 'Crocheted', productType: 'clutch' },
  '"Maria" Crossbody Bag': { category: 'Crocheted', productType: 'crossbody' },
  'Rust Chain Mini Bag': { category: 'Crocheted', productType: 'crossbody' },
  'Striped Boho Clutch': { category: 'Crocheted', productType: 'clutch' },
  'Heart Clasp Top Handle Bag': { category: 'Crocheted', productType: 'handbag' },
  'Terracotta Wood Handle Clutch': { category: 'Crocheted', productType: 'clutch' },
  'Burgundy Braided Hobo Bag': { category: 'Crocheted', productType: 'shoulder-bag' },
  'Duo Chain Shoulder Bag': { category: 'Crocheted', productType: 'shoulder-bag' },
  'Coral Gold Handle Tote': { category: 'Crocheted', productType: 'tote' },
  'Wooden Bead Top Handle Bag': { category: 'Crocheted', productType: 'handbag' },
  'Golden Tote with Leather Straps': { category: 'Crocheted', productType: 'tote' },
  'Noir Gold Braid Handle Bag': { category: 'Crocheted', productType: 'shoulder-bag' },
  'Two-Tone Braided Shoulder Bag': { category: 'Crocheted', productType: 'shoulder-bag' },
  '"Lydi" Top Handle Bag': { category: 'Crocheted', productType: 'handbag' },
  'Knit tote Bag': { category: 'Crocheted', productType: 'tote' },
};

await connectDB();

const oldCategories = await Category.find({});
const findOldImage = (matchNames) => {
  const match = oldCategories.find((c) => matchNames.includes(c.name) && c.image?.url);
  return match?.image;
};

// Prefer the old "Crochet Bags" image for Crocheted, "Tapestry Bags" for Tapestry.
const crochetedImage = findOldImage(['Crochet Bags', 'Shoulder Bags', 'Tote Bags', 'Crossbody Bags']);
const tapestryImage = findOldImage(['Tapestry Bags']);

console.log('Deleting old categories...');
await Category.deleteMany({});

console.log('Creating new taxonomy categories...');
const crocheted = await Category.create({
  name: 'Crocheted',
  description: 'Handmade crochet bags — shoulder bags, handbags, crossbody, tote and clutch styles.',
  image: crochetedImage,
  isActive: true,
  sortOrder: 1,
});
const tapestry = await Category.create({
  name: 'Tapestry',
  description: 'Soft-sided sewn tapestry bags — shoulder bags, handbags, crossbody, tote and clutch styles.',
  image: tapestryImage,
  isActive: true,
  sortOrder: 2,
});

console.log('Remapping products...');
const products = await Product.find({});
let updated = 0;
let unmatched = [];
for (const p of products) {
  const mapping = PRODUCT_MAP[p.name];
  if (!mapping) {
    unmatched.push(p.name);
    continue;
  }
  p.category = mapping.category === 'Tapestry' ? tapestry._id : crocheted._id;
  p.productType = mapping.productType;
  await p.save();
  updated++;
}

console.log(`Updated ${updated} products.`);
if (unmatched.length) console.log('Unmatched (left unchanged, will fail validation on next save until fixed manually):', unmatched);

console.log('Migration complete.');
await mongoose.disconnect();
process.exit(0);
