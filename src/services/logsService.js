const pool = require('../db/connection');

async function createLog({ listing_id = null, event_type, message, status }) {
  const result = await pool.query(
    `INSERT INTO logs (listing_id, event_type, message, status)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [listing_id, event_type, message, status]
  );
  return result.rows[0];
}

module.exports = { createLog };
