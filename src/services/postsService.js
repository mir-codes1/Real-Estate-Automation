const pool = require('../db/connection');

async function savePost({ listing_id, caption, platform = 'draft', status = 'pending' }) {
  const result = await pool.query(
    `INSERT INTO posts (listing_id, caption, platform, status)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [listing_id, caption, platform, status]
  );
  return result.rows[0];
}

module.exports = { savePost };
