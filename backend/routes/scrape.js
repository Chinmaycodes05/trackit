const express = require('express');
const router = express.Router();
const db = require('../db/connect');
const { exec } = require('child_process');
const path = require('path');

// Scrape a product by URL
router.post('/', (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const scriptPath = path.join(__dirname, '../../scraper/amazon_scraper.py');
    const command = `python "${scriptPath}" "${url}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: stderr });
        }

        try {
            const result = JSON.parse(stdout);

            // Save product to database
            const existing = db.prepare('SELECT * FROM products WHERE url = ?').get(url);

            let productId;
            if (existing) {
                productId = existing.id;
            } else {
                const insert = db.prepare('INSERT INTO products (title, url, store) VALUES (?, ?, ?)');
                const info = insert.run(result.title, result.url, result.store);
                productId = info.lastInsertRowid;
            }

            // Save price to history
            db.prepare('INSERT INTO price_history (product_id, price) VALUES (?, ?)').run(productId, result.price);

            res.json({ success: true, product: result, id: productId });

        } catch (e) {
            res.status(500).json({ error: 'Failed to parse scraper output' });
        }
    });
});

module.exports = router;