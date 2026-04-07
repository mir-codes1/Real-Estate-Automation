const db = require('../db/connection');
const { createLog } = require('../services/logsService');

async function sendToAutomation(req, res, next) {
  const { id } = req.params;

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    return res.status(500).json({ error: 'N8N_WEBHOOK_URL is not configured' });
  }

  // Step 1 — fetch listing
  const listing = db.prepare('SELECT * FROM listings WHERE id = ?').get(id);
  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  // Step 2 — fetch the latest draft post for this listing
  const post = db.prepare(`
    SELECT * FROM posts
    WHERE listing_id = ? AND status = 'pending'
    ORDER BY created_at DESC
    LIMIT 1
  `).get(id);

  if (!post) {
    return res.status(404).json({ error: 'No pending post found for this listing. Run /process first.' });
  }

  // Step 3 — build payload and send to n8n
  const payload = {
    listing: {
      id: listing.id,
      address: listing.address,
      price: listing.price,
      beds: listing.beds,
      baths: listing.baths,
      neighborhood: listing.neighborhood,
      sold_date: listing.sold_date,
      image_url: listing.image_url,
    },
    post: {
      id: post.id,
      caption: post.caption,
      platform: post.platform,
      status: post.status,
    },
    triggered_at: new Date().toISOString(),
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`n8n responded with status ${response.status}`);
    }

    // Step 4 — log success
    const log = createLog({
      listing_id: listing.id,
      event_type: 'send_to_automation',
      message: `Payload sent to n8n for post #${post.id}`,
      status: 'success',
    });

    return res.json({ message: 'Payload sent to n8n', payload, log });

  } catch (err) {
    // Step 4 — log failure
    createLog({
      listing_id: listing.id,
      event_type: 'send_to_automation',
      message: err.message,
      status: 'failed',
    });

    next(err);
  }
}

module.exports = { sendToAutomation };
