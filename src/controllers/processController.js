const db = require('../db/connection');
const { getMockSchools } = require('../services/schoolsService');
const { generateCaption } = require('../services/captionService');
const { savePost } = require('../services/postsService');
const { createLog } = require('../services/logsService');

async function processListing(req, res, next) {
  const { id } = req.params;

  // Step 1 — fetch listing
  const listing = db.prepare('SELECT * FROM listings WHERE id = ?').get(id);
  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  try {
    // Step 2 — fetch nearby schools
    const schools = getMockSchools(listing.address);

    // Step 3 — generate AI caption
    const caption = await generateCaption({ ...listing, schools });

    // Step 4 — save as draft post
    const post = savePost({ listing_id: listing.id, caption });

    // Step 5 — log success
    const log = createLog({
      listing_id: listing.id,
      event_type: 'process_listing',
      message: `Caption generated and saved as post #${post.id}`,
      status: 'success',
    });

    return res.status(201).json({ listing, schools, caption, post, log });

  } catch (err) {
    // Step 5 (failure path) — log the error before propagating
    createLog({
      listing_id: listing.id,
      event_type: 'process_listing',
      message: err.message,
      status: 'failed',
    });

    next(err);
  }
}

module.exports = { processListing };
