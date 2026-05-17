const express = require('express');
const router = express.Router();
const db = require('../db/connect');
const { exec } = require('child_process');
const path = require('path');

router.post('/', (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    const scriptPath = path.join(__dirname, '../../scraper/amazon_scraper.py');
    const command = `python "${scriptPath}" "${url}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) return res.status(500).json({ error: stderr });

        try {
            const result = JSON.parse(stdout);

            db.get('SELECT * FROM products WHERE url = ?', [url], (err, existing) => {
                if (existing) {
                    db.run('INSERT INTO price_history (product_id, price) VALUES (?, ?)', [existing.id, result.price]);
                    res.json({ success: true, product: result, id: existing.id });
                } else {
                    db.run('INSERT INTO products (title, url, store) VALUES (?, ?, ?)', [result.title, result.url, result.store], function(err) {
                        const productId = this.lastID;
                        db.run('INSERT INTO price_history (product_id, price) VALUES (?, ?)', [productId, result.price]);
                        res.json({ success: true, product: result, id: productId });
                    });
                }
            });
        } catch (e) {
            res.status(500).json({ error: 'Failed to parse scraper output' });
        }
    });
});

module.exports = router;