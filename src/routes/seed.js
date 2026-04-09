const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { initializeSchema } = require('../db/schema');
const mockListings = require('../data/mockListings');

router.post('/', (req, res) => {
  initializeSchema();

  const insert = db.prepare(`
    INSERT INTO listings (address, price, beds, baths, neighborhood, sold_date, image_url)
    VALUES (@address, @price, @beds, @baths, @neighborhood, @sold_date, @image_url)
  `);

  const checkExists = db.prepare(`
    SELECT id FROM listings WHERE address = @address AND sold_date = @sold_date
  `);

  let inserted = 0;
  let skipped = 0;

  const seedAll = db.transaction((listings) => {
    for (const listing of listings) {
      const existing = checkExists.get({ address: listing.address, sold_date: listing.sold_date });
      if (existing) {
        skipped++;
      } else {
        insert.run(listing);
        inserted++;
      }
    }
  });

  seedAll(mockListings);

  res.json({ inserted, skipped });
});

module.exports = router;
