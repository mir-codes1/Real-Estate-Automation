const pool = require('../db/connection');

async function getAllLogs(req, res) {
  const result = await pool.query(`
    SELECT logs.*, listings.address
    FROM logs
    LEFT JOIN listings ON logs.listing_id = listings.id
    ORDER BY logs.created_at DESC
  `);

  res.json({ count: result.rows.length, logs: result.rows });
}

async function getLogsByListingId(req, res) {
  const listing = await pool.query('SELECT id FROM listings WHERE id = $1', [req.params.listingId]);
  if (listing.rows.length === 0) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  const result = await pool.query(
    `SELECT * FROM logs WHERE listing_id = $1 ORDER BY created_at DESC`,
    [req.params.listingId]
  );

  res.json({ count: result.rows.length, logs: result.rows });
}

module.exports = { getAllLogs, getLogsByListingId };
