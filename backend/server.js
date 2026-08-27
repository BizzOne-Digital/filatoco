import 'dotenv/config';
import connectDB from './config/db.js';
import app from './app.js';

try {
  await connectDB();
} catch (err) {
  console.error(`MongoDB connection error: ${err.message}`);
  process.exit(1);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`FilatoCo API running on port ${PORT}`));
