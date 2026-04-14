const pool = require('../db/connection');

async function getAllPosts(req, res) {
  const result = await pool.query(`
    SELECT posts.*, listings.address, listings.neighborhood
    FROM posts
    LEFT JOIN listings ON posts.listing_id = listings.id
    ORDER BY posts.created_at DESC
  `);

  res.json({ count: result.rows.length, posts: result.rows });
}

module.exports = { getAllPosts };
