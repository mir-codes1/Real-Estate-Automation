const db = require('../db/connection');

function getAllPosts(req, res) {
  const posts = db.prepare(`
    SELECT posts.*, listings.address, listings.neighborhood
    FROM posts
    LEFT JOIN listings ON posts.listing_id = listings.id
    ORDER BY posts.created_at DESC
  `).all();

  res.json({ count: posts.length, posts });
}

module.exports = { getAllPosts };
