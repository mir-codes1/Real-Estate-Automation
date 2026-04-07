// Mock school pool — realistic Toronto school names and ratings.
// Swap getMockSchools() with a real implementation (Google Places, Nominatim, etc.)
// when ready. The controller and route stay unchanged.
const MOCK_SCHOOL_POOL = [
  { name: 'Riverdale Collegiate Institute', rating: 8.4, distance: '0.3 km' },
  { name: 'Withrow Avenue Junior Public School', rating: 9.1, distance: '0.5 km' },
  { name: 'Leslieville Public School', rating: 8.7, distance: '0.8 km' },
  { name: 'Duke of Connaught Junior & Senior Public School', rating: 7.9, distance: '1.1 km' },
  { name: 'Jackman Avenue Junior Public School', rating: 9.3, distance: '0.6 km' },
  { name: 'Eastern Commerce Collegiate Institute', rating: 7.5, distance: '1.4 km' },
  { name: 'St. Joseph Catholic School', rating: 8.2, distance: '0.9 km' },
  { name: 'Danforth Collegiate and Technical Institute', rating: 8.0, distance: '1.2 km' },
  { name: 'Pape Avenue Junior Public School', rating: 8.6, distance: '0.7 km' },
  { name: 'Monarch Park Collegiate Institute', rating: 7.8, distance: '1.5 km' },
];

// Deterministically picks 3 schools based on the address string so the same
// address always returns the same schools. Swap this entire function with a
// real geocoding + Places API call when ready.
function getMockSchools(address) {
  const seed = address
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const results = [];
  const used = new Set();

  for (let i = 0; results.length < 3; i++) {
    const index = (seed + i * 31) % MOCK_SCHOOL_POOL.length;
    if (!used.has(index)) {
      used.add(index);
      results.push(MOCK_SCHOOL_POOL[index]);
    }
  }

  return results;
}

module.exports = { getMockSchools };
