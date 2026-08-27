/**
 * One-time cleanup: removes all Category and Product documents so the catalog
 * can be rebuilt from scratch through the Admin panel with real Cloudinary images.
 * Run: node utils/clearCatalog.js
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

await connectDB();
const [catResult, prodResult] = await Promise.all([Category.deleteMany({}), Product.deleteMany({})]);
console.log(`Removed ${catResult.deletedCount} categories and ${prodResult.deletedCount} products.`);
await mongoose.disconnect();
process.exit(0);
