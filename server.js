const express = require('express');
const ytsr = require('ytsr');

const app = express();
const port = 3000;

app.get('/apis', async (req, res) => {
    const searchQuery = req.query.q;

    try {
        const searchResults = await ytsr(searchQuery);
        res.json(searchResults.items); // JSON形式で返す
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '検索中にエラーが発生しました' });
    }
});

app.listen(port, () => {
    console.log(`サーバーがポート${port}で起動しました`);
});
