const db = require('../db/connection');

function getAllLogs(req, res) {
  const logs = db.prepare(`
    SELECT logs.*, listings.address
    FROM logs
    LEFT JOIN listings ON logs.listing_id = listings.id
    ORDER BY logs.created_at DESC
  `).all();

  res.json({ count: logs.length, logs });
}

function getLogsByListingId(req, res) {
  const listing = db.prepare('SELECT id FROM listings WHERE id = ?').get(req.params.listingId);
  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  const logs = db.prepare(`
    SELECT * FROM logs
    WHERE listing_id = ?
    ORDER BY created_at DESC
  `).all(req.params.listingId);

  res.json({ count: logs.length, logs });
}

module.exports = { getAllLogs, getLogsByListingId };
