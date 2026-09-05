import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5001;

// Start server for local development
connectDB().finally(() => {
  app.listen(PORT, () => {
    console.log(`[ALIGN Server] Listening at http://localhost:${PORT}`);
    console.log(`[ALIGN Server] Health check available at http://localhost:${PORT}/api/health`);
  });
});

export default app;
