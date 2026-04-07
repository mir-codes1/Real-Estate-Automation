require('dotenv').config();
const db = require('../src/db/connection');
const { initializeSchema } = require('../src/db/schema');
const mockListings = require('../src/data/mockListings');

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
      console.log(`  SKIP  "${listing.address}" (already exists)`);
      skipped++;
    } else {
      insert.run(listing);
      console.log(`  INSERT "${listing.address}"`);
      inserted++;
    }
  }
});

seedAll(mockListings);

console.log(`\nDone. ${inserted} inserted, ${skipped} skipped.`);
db.close();
