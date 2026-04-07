const db = require('./connection');

function initializeSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS listings (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      address     TEXT    NOT NULL,
      price       REAL    NOT NULL,
      beds        INTEGER NOT NULL,
      baths       INTEGER NOT NULL,
      neighborhood TEXT   NOT NULL,
      sold_date   TEXT    NOT NULL,
      image_url   TEXT,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS posts (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      listing_id  INTEGER NOT NULL,
      caption     TEXT    NOT NULL,
      platform    TEXT    NOT NULL,
      status      TEXT    NOT NULL DEFAULT 'pending',
      created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (listing_id) REFERENCES listings(id)
    );

    CREATE TABLE IF NOT EXISTS logs (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      listing_id  INTEGER,
      event_type  TEXT    NOT NULL,
      message     TEXT    NOT NULL,
      status      TEXT    NOT NULL,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (listing_id) REFERENCES listings(id)
    );
  `);

  console.log('Database schema initialized.');
}

module.exports = { initializeSchema };
