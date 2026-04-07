const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generates a social media caption for a sold real estate listing.
 * Called directly here and reusable in n8n webhook handlers later.
 *
 * @param {Object} listing - listing fields
 * @param {string} listing.address
 * @param {number} listing.price
 * @param {number} listing.beds
 * @param {number} listing.baths
 * @param {string} listing.neighborhood
 * @param {string} listing.sold_date
 * @param {Array}  listing.schools - optional nearby schools array
 * @returns {Promise<string>} - the generated caption
 */
async function generateCaption(listing) {
  const { address, price, beds, baths, neighborhood, sold_date, schools } = listing;

  const formattedPrice = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  }).format(price);

  const schoolLine =
    schools && schools.length > 0
      ? `Nearby schools: ${schools.map((s) => `${s.name} (rated ${s.rating})`).join(', ')}.`
      : '';

  const prompt = `
You are a real estate social media copywriter. Write an engaging "Just Sold" post for the following property.

Property details:
- Address: ${address}
- Sale price: ${formattedPrice}
- Bedrooms: ${beds}
- Bathrooms: ${baths}
- Neighborhood: ${neighborhood}, Toronto
- Sold date: ${sold_date}
${schoolLine}

Requirements:
- Under 280 characters total
- Start with "Just Sold!" or a similar exciting opener
- Mention the price, beds/baths, and neighborhood
- End with 2-3 relevant hashtags (e.g. #TorontoRealEstate #JustSold)
- Professional but energetic tone
- No line breaks

Return only the caption text. Nothing else.
`.trim();

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

module.exports = { generateCaption };
