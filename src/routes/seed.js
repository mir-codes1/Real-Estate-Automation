const express = require('express');
const router = express.Router();
const pool = require('../db/connection');
const { initializeSchema } = require('../db/schema');
const mockListings = require('../data/mockListings');

router.post('/', async (req, res) => {
  await initializeSchema();

  let inserted = 0;
  let skipped = 0;

  for (const listing of mockListings) {
    const existing = await pool.query(
      'SELECT id FROM listings WHERE address = $1 AND sold_date = $2',
      [listing.address, listing.sold_date]
    );

    if (existing.rows.length > 0) {
      skipped++;
    } else {
      await pool.query(
        `INSERT INTO listings (address, price, beds, baths, neighborhood, sold_date, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [listing.address, listing.price, listing.beds, listing.baths, listing.neighborhood, listing.sold_date, listing.image_url]
      );
      inserted++;
    }
  }

  res.json({ inserted, skipped });
});

module.exports = router;
