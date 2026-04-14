const pool = require('./connection');

async function initializeSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS listings (
      id            SERIAL PRIMARY KEY,
      address       TEXT    NOT NULL,
      price         NUMERIC NOT NULL,
      beds          INTEGER NOT NULL,
      baths         INTEGER NOT NULL,
      neighborhood  TEXT    NOT NULL,
      sold_date     TEXT    NOT NULL,
      image_url     TEXT,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS posts (
      id            SERIAL PRIMARY KEY,
      listing_id    INTEGER NOT NULL REFERENCES listings(id),
      caption       TEXT    NOT NULL,
      platform      TEXT    NOT NULL,
      status        TEXT    NOT NULL DEFAULT 'pending',
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS logs (
      id            SERIAL PRIMARY KEY,
      listing_id    INTEGER REFERENCES listings(id),
      event_type    TEXT    NOT NULL,
      message       TEXT    NOT NULL,
      status        TEXT    NOT NULL,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  console.log('Database schema initialized.');
}

module.exports = { initializeSchema };
