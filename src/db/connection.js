const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../data/real_estate.db');

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');

// Enforce foreign key constraints (SQLite disables them by default)
db.pragma('foreign_keys = ON');

module.exports = db;
