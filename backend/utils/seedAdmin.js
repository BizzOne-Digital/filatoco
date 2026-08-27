/**
 * Run once to create the first admin account:
 *   node utils/seedAdmin.js admin@filatoco.ca SomeStrongPassword123 Mirella Scarcelli
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';

const [, , email, password, firstName = 'Mirella', lastName = 'Scarcelli'] = process.argv;

if (!email || !password) {
  console.error('Usage: node utils/seedAdmin.js <email> <password> [firstName] [lastName]');
  process.exit(1);
}

await connectDB();

const existing = await User.findOne({ email: email.toLowerCase() });
if (existing) {
  existing.role = 'admin';
  await existing.save();
  console.log(`Existing user ${email} promoted to admin.`);
} else {
  await User.create({ firstName, lastName, email, password, role: 'admin' });
  console.log(`Admin account created for ${email}.`);
}

await mongoose.disconnect();
process.exit(0);
