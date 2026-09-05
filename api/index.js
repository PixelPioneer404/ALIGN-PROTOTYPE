import app from '../server/src/app.js';
import { connectDB } from '../server/src/config/db.js';

let isInitialized = false;

export default async function handler(req, res) {
  if (!isInitialized) {
    try {
      await connectDB();
    } catch (e) {
      console.warn('[Vercel DB Init Fallback]:', e.message);
    }
    isInitialized = true;
  }
  return app(req, res);
}
