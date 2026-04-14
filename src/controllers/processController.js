const pool = require('../db/connection');
const { getMockSchools } = require('../services/schoolsService');
const { generateCaption } = require('../services/captionService');
const { savePost } = require('../services/postsService');
const { createLog } = require('../services/logsService');

async function processListing(req, res, next) {
  const { id } = req.params;

  // Step 1 — fetch listing
  const listingResult = await pool.query('SELECT * FROM listings WHERE id = $1', [id]);
  if (listingResult.rows.length === 0) {
    return res.status(404).json({ error: 'Listing not found' });
  }
  const listing = listingResult.rows[0];

  try {
    // Step 2 — fetch nearby schools
    const schools = getMockSchools(listing.address);

    // Step 3 — generate AI caption
    const caption = await generateCaption({ ...listing, schools });

    // Step 4 — save as draft post
    const post = await savePost({ listing_id: listing.id, caption });

    // Step 5 — log success
    const log = await createLog({
      listing_id: listing.id,
      event_type: 'process_listing',
      message: `Caption generated and saved as post #${post.id}`,
      status: 'success',
    });

    return res.status(201).json({ listing, schools, caption, post, log });

  } catch (err) {
    // Step 5 (failure path) — log the error before propagating
    await createLog({
      listing_id: listing.id,
      event_type: 'process_listing',
      message: err.message,
      status: 'failed',
    });

    next(err);
  }
}

module.exports = { processListing };
