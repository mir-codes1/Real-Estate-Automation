const db = require('../db/connection');

function savePost({ listing_id, caption, platform = 'draft', status = 'pending' }) {
  const result = db.prepare(`
    INSERT INTO posts (listing_id, caption, platform, status)
    VALUES (@listing_id, @caption, @platform, @status)
  `).run({ listing_id, caption, platform, status });

  return db.prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid);
}

module.exports = { savePost };
