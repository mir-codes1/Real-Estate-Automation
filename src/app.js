const express = require('express');
const cors = require('cors');
const requestLogger = require('./middleware/requestLogger');
const healthRouter = require('./routes/health');
const listingsRouter = require('./routes/listings');
const schoolsRouter = require('./routes/schools');
const aiRouter = require('./routes/ai');
const postsRouter = require('./routes/posts');
const logsRouter = require('./routes/logs');
const automationRouter = require('./routes/automation');

const app = express();

// CORS — allow requests from the frontend origin (set CORS_ORIGIN in production)
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: corsOrigin }));

// Middleware
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/api/health', healthRouter);
app.use('/api/listings', listingsRouter);
app.use('/api/schools', schoolsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/posts', postsRouter);
app.use('/api/logs', logsRouter);
app.use('/api/automation', automationRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
// Respects err.status/err.statusCode set by upstream middleware (e.g. Express's
// JSON body-parser sets status 400 on malformed JSON).
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  console.error(`[ERROR] ${req.method} ${req.url} ${status}:`, err.stack ?? err.message);
  res.status(status).json({ error: err.message || 'Internal server error' });
});

module.exports = app;
