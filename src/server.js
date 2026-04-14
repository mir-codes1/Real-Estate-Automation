require('dotenv').config();
const app = require('./app');
const { initializeSchema } = require('./db/schema');

const PORT = process.env.PORT || 3001;

initializeSchema()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database schema:', err);
    process.exit(1);
  });
