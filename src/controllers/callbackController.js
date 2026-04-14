const pool = require('../db/connection');
const { createLog } = require('../services/logsService');

const REQUIRED_FIELDS  = ['listing_id', 'platform', 'status', 'message'];
const VALID_STATUSES   = ['posted', 'failed'];
const VALID_PLATFORMS  = ['twitter', 'instagram', 'discord', 'draft'];

async function automationResult(req, res) {
  const body = req.body;

  // null and undefined both fail this check (== null catches both)
  const missing = REQUIRED_FIELDS.filter((f) => body[f] == null || body[f] === '');
  if (missing.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
  }

  const listingId = Number(body.listing_id);
  if (!Number.isInteger(listingId) || listingId <= 0) {
    return res.status(400).json({ error: 'listing_id must be a positive integer' });
  }

  if (!VALID_STATUSES.includes(body.status)) {
    return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  if (!VALID_PLATFORMS.includes(body.platform)) {
    return res.status(400).json({ error: `platform must be one of: ${VALID_PLATFORMS.join(', ')}` });
  }

  // Verify the listing exists
  const listingResult = await pool.query('SELECT id FROM listings WHERE id = $1', [listingId]);
  if (listingResult.rows.length === 0) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  // Update the most recent pending post for this listing if one exists
  const postResult = await pool.query(
    `SELECT id FROM posts
     WHERE listing_id = $1 AND status = 'pending'
     ORDER BY created_at DESC
     LIMIT 1`,
    [listingId]
  );

  let updatedPost = null;
  if (postResult.rows.length > 0) {
    const postId = postResult.rows[0].id;
    const updated = await pool.query(
      `UPDATE posts SET platform = $1, status = $2 WHERE id = $3 RETURNING *`,
      [body.platform, body.status, postId]
    );
    updatedPost = updated.rows[0];
  }

  // Save log entry
  const log = await createLog({
    listing_id: listingId,
    event_type: `automation_result:${body.platform}`,
    message:    body.message,
    status:     body.status,
  });

  res.json({ received: true, post: updatedPost, log });
}

module.exports = { automationResult };
