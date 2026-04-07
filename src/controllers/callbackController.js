const db = require('../db/connection');
const { createLog } = require('../services/logsService');

const REQUIRED_FIELDS  = ['listing_id', 'platform', 'status', 'message'];
const VALID_STATUSES   = ['posted', 'failed'];
const VALID_PLATFORMS  = ['twitter', 'instagram', 'discord', 'draft'];

function automationResult(req, res) {
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
  const listing = db.prepare('SELECT id FROM listings WHERE id = ?').get(listingId);
  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  // Update the most recent pending post for this listing if one exists
  const post = db.prepare(`
    SELECT id FROM posts
    WHERE listing_id = ? AND status = 'pending'
    ORDER BY created_at DESC
    LIMIT 1
  `).get(listingId);

  let updatedPost = null;
  if (post) {
    db.prepare(`
      UPDATE posts SET platform = @platform, status = @status WHERE id = @id
    `).run({ platform: body.platform, status: body.status, id: post.id });

    updatedPost = db.prepare('SELECT * FROM posts WHERE id = ?').get(post.id);
  }

  // Save log entry
  const log = createLog({
    listing_id: listingId,
    event_type: `automation_result:${body.platform}`,
    message:    body.message,
    status:     body.status,
  });

  res.json({ received: true, post: updatedPost, log });
}

module.exports = { automationResult };
