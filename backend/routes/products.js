const express = require('express');
const router = express.Router();
const db = require('../db/connect');

router.get('/', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

router.get('/:id', (req, res) => {
    db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, product) => {
        if (err) return res.status(500).json({ error: err.message });
        db.all('SELECT * FROM price_history WHERE product_id = ? ORDER BY scraped_at DESC', [req.params.id], (err, history) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ product, history });
        });
    });
});

module.exports = router;