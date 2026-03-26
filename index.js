const express = require('express');
const { getDB } = require('./database');
const userRoutes = require('./users');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    name: 'BuyerForeSight User Management API',
    version: '1.0.0',
    endpoints: {
      'GET    /users':        'List users (supports ?search=, ?sort=, ?order=)',
      'GET    /users/:id':    'Get a single user',
      'POST   /users':        'Create a new user',
      'PUT    /users/:id':    'Update a user',
      'DELETE /users/:id':    'Delete a user',
    },
  });
});

app.use('/users', userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('[Unhandled Error]', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ─── Boot ─────────────────────────────────────────────────────────────────────
(async () => {
  await getDB();           // initialise + create tables
  app.listen(PORT, () => {
    console.log(`\n🚀  BuyerForeSight API running → http://localhost:${PORT}`);
    console.log(`📋  API docs       → http://localhost:${PORT}/\n`);
  });
})();

module.exports = app;   // for testing
