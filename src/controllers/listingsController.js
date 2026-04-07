const db = require('../db/connection');

const REQUIRED_FIELDS = ['address', 'price', 'beds', 'baths', 'neighborhood', 'sold_date'];

// Matches YYYY-MM-DD only
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function getAllListings(req, res) {
  const listings = db.prepare('SELECT * FROM listings ORDER BY created_at DESC').all();
  res.json({ count: listings.length, listings });
}

function getListingById(req, res) {
  const listing = db.prepare('SELECT * FROM listings WHERE id = ?').get(req.params.id);

  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  res.json(listing);
}

function createListing(req, res) {
  const body = req.body;

  // null and undefined both fail this check (== null catches both)
  const missing = REQUIRED_FIELDS.filter((f) => body[f] == null || body[f] === '');
  if (missing.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
  }

  if (isNaN(Number(body.price)) || Number(body.price) <= 0) {
    return res.status(400).json({ error: 'price must be a positive number' });
  }

  if (!Number.isInteger(Number(body.beds)) || Number(body.beds) <= 0) {
    return res.status(400).json({ error: 'beds must be a positive integer' });
  }

  if (!Number.isInteger(Number(body.baths)) || Number(body.baths) <= 0) {
    return res.status(400).json({ error: 'baths must be a positive integer' });
  }

  if (!DATE_RE.test(body.sold_date)) {
    return res.status(400).json({ error: 'sold_date must be in YYYY-MM-DD format' });
  }

  if (body.image_url != null && body.image_url !== '') {
    try {
      const u = new URL(body.image_url);
      if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error();
    } catch {
      return res.status(400).json({ error: 'image_url must be a valid http or https URL' });
    }
  }

  const result = db.prepare(`
    INSERT INTO listings (address, price, beds, baths, neighborhood, sold_date, image_url)
    VALUES (@address, @price, @beds, @baths, @neighborhood, @sold_date, @image_url)
  `).run({
    address:      body.address,
    price:        Number(body.price),
    beds:         Number(body.beds),
    baths:        Number(body.baths),
    neighborhood: body.neighborhood,
    sold_date:    body.sold_date,
    image_url:    body.image_url || null,
  });

  const created = db.prepare('SELECT * FROM listings WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(created);
}

module.exports = { getAllListings, getListingById, createListing };
