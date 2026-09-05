import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/align_db';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    isConnected = false;
    console.warn(`[MongoDB] Connection failed (${error.message}).`);
    console.warn(`[MongoDB] Operating in resilient IN-MEMORY FALLBACK mode. All verified prototype schemes and demo partners will be served seamlessly.`);
  }
};

export const isDbConnected = () => isConnected;
