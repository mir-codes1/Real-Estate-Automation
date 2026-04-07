const { generateCaption } = require('../services/captionService');
const { savePost } = require('../services/postsService');

const REQUIRED_FIELDS = ['address', 'price', 'beds', 'baths', 'neighborhood', 'sold_date'];

async function generateCaptionHandler(req, res, next) {
  try {
    const body = req.body;

    // null and undefined both fail this check (== null catches both)
    const missing = REQUIRED_FIELDS.filter((f) => body[f] == null || body[f] === '');
    if (missing.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
    }

    const caption = await generateCaption(body);

    // If a listing_id was provided, persist the caption as a post record
    if (body.listing_id) {
      const post = savePost({ listing_id: body.listing_id, caption });
      return res.status(201).json({ caption, post });
    }

    res.json({ caption });
  } catch (err) {
    next(err);
  }
}

module.exports = { generateCaptionHandler };
