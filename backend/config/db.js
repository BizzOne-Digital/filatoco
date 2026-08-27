import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  const conn = await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    bufferCommands: false,
  });
  console.log(`MongoDB connected: ${conn.connection.host}`);
  return conn.connection;
};

export default connectDB;
