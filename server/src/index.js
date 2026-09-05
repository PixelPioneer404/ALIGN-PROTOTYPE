import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, isDbConnected } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiRouter from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`[HTTP] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'ALIGN SIH 2026',
    database: isDbConnected() ? 'connected' : 'in-memory-fallback',
    timestamp: new Date().toISOString()
  });
});

// Mount modular API routes
app.use('/api', apiRouter);

// 404 handler for undefined API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `The route ${req.method} ${req.originalUrl} does not exist on this server.`
    }
  });
});

// Centralized error handler
app.use(errorHandler);

// Start server
connectDB().finally(() => {
  app.listen(PORT, () => {
    console.log(`[ALIGN Server] Listening at http://localhost:${PORT}`);
    console.log(`[ALIGN Server] Health check available at http://localhost:${PORT}/api/health`);
  });
});

export default app;
