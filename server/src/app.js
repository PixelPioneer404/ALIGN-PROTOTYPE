import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { isDbConnected } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiRouter from './routes/index.js';

dotenv.config();

const app = express();

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

export default app;
