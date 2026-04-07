const db = require('../db/connection');

function createLog({ listing_id = null, event_type, message, status }) {
  const result = db.prepare(`
    INSERT INTO logs (listing_id, event_type, message, status)
    VALUES (@listing_id, @event_type, @message, @status)
  `).run({ listing_id, event_type, message, status });

  return db.prepare('SELECT * FROM logs WHERE id = ?').get(result.lastInsertRowid);
}

module.exports = { createLog };
