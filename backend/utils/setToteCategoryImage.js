/**
 * One-off: sets the Tote Bags category image using img16.jpg.
 * Run: node utils/setToteCategoryImage.js
 */
import 'dotenv/config';
import path from 'path';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import cloudinary from '../config/cloudinary.js';
import Category from '../models/Category.js';

const FRONTEND_PUBLIC = path.resolve(process.cwd(), '../frontend/public');

await connectDB();

const category = await Category.findOne({ name: 'Tote Bags' });
if (!category) {
  console.error('Tote Bags category not found.');
  process.exit(1);
}

const result = await cloudinary.uploader.upload(path.join(FRONTEND_PUBLIC, 'img16.jpg'), { folder: 'filatoco/categories' });
category.image = { url: result.secure_url, publicId: result.public_id };
await category.save();

console.log('Tote Bags category image set.');
await mongoose.disconnect();
process.exit(0);
