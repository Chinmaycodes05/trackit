const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const productsRoute = require('./routes/products');
const scrapeRoute = require('./routes/scrape');

app.use('/products', productsRoute);
app.use('/scrape', scrapeRoute);

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Price Tracker API is running!' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});