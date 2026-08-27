import 'dotenv/config';
import connectDB from '../config/db.js';
import app from '../app.js';

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    res.status(500).json({ message: 'Database connection failed' });
    return;
  }
  app(req, res);
}
