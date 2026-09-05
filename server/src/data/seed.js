import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Scheme from '../models/scheme.model.js';
import Partner from '../models/partner.model.js';
import { verifiedSchemes, demoPartners } from './seedData.js';

dotenv.config();

const seed = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/align_db';
  console.log(`[Seed] Connecting to ${uri}...`);

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('[Seed] Connected to MongoDB.');

    // Clear existing data
    await Scheme.deleteMany({});
    await Partner.deleteMany({});
    console.log('[Seed] Cleared existing schemes and partners.');

    // Insert schemes
    await Scheme.insertMany(verifiedSchemes);
    console.log(`[Seed] Successfully inserted ${verifiedSchemes.length} verified government schemes.`);

    // Insert partners
    await Partner.insertMany(demoPartners);
    console.log(`[Seed] Successfully inserted ${demoPartners.length} demo channel partners.`);

    console.log('[Seed] Seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error] Failed to seed database:', error.message);
    process.exit(1);
  }
};

seed();
