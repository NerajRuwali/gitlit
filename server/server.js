/**
 * GitHub Contribution Visualizer — Express Server
 * Optimized for Render deployment.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5001;

// ─── CORS Configuration ───────────────────────────────────────────────────────
// Hardcode the production frontend origin so it always works,
// even if FRONTEND_URL env var is missing on Render.
const allowedOrigins = [
  'https://git-lit.vercel.app',
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Render health checks)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // In development, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    console.warn(`CORS blocked origin: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());

// ─── Request Logger (lightweight, production-safe) ────────────────────────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} — origin: ${req.headers.origin || 'none'}`);
  next();
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api', apiRoutes);
app.use('/api', aiRoutes);

// ─── Test Endpoint ────────────────────────────────────────────────────────────
app.get('/api/test', (_req, res) => {
  res.json({ message: 'Backend working', timestamp: new Date().toISOString() });
});

// ─── Health Check / Wake-up Endpoint ──────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'GitLit API is active',
  });
});

// ─── Root Route ───────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'GitHub Contribution Visualizer API' });
});

// ─── Production Error Handler ─────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  const statusCode = err.status || 500;
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.url} >> ${err.message}`);

  res.status(statusCode).json({
    error: process.env.NODE_ENV === 'production'
      ? 'An internal server error occurred'
      : err.message,
    status: 'error',
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`\n🚀 GitLit Server running on port ${PORT}`);
  console.log(`📡 GitHub Token: ${process.env.GITHUB_TOKEN ? 'Loaded (Authenticated)' : 'Not Loaded (Unauthenticated)'}`);
  console.log(`🌐 Allowed Origins: ${allowedOrigins.join(', ')}`);
  console.log(`✨ Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
const shutdown = () => {
  console.log('\n🛑 Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 5000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
