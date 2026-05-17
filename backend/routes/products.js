const express = require('express');
const router = express.Router();
const db = require('../db/connect');

// Get all products
router.get('/', (req, res) => {
    const products = db.prepare('SELECT * FROM products').all();
    res.json(products);
});

// Get single product with price history
router.get('/:id', (req, res) => {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    const history = db.prepare('SELECT * FROM price_history WHERE product_id = ? ORDER BY scraped_at DESC').all(req.params.id);
    res.json({ product, history });
});

module.exports = router;