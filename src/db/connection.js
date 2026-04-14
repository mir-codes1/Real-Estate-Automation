const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Heroku Postgres requires SSL; skip cert verification (self-signed)
  ...(process.env.DATABASE_URL && { ssl: { rejectUnauthorized: false } }),
});

module.exports = pool;
