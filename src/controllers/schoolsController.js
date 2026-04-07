const { getMockSchools } = require('../services/schoolsService');

function getNearbySchools(req, res) {
  const { address } = req.query;

  if (!address || address.trim() === '') {
    return res.status(400).json({ error: 'address query parameter is required' });
  }

  const schools = getMockSchools(address);
  res.json({ address, schools });
}

module.exports = { getNearbySchools };
