const express = require('express');
const ytsr = require('ytsr');
const app = express();
const port = 3000;
const { Innertube } = require('youtubei.js');

// YouTubei.js
let youtube;

(async () => {
    youtube = await Innertube.create();
})();

// 動画 ID に基づいておすすめ動画を取得
app.get('/:id', async (req, res) => {
    const videoId = req.params.id;

    if (!youtube) {
        return res.status(500).send('YouTube API is not ready yet. Try again later.');
    }

    try {
        const video = await youtube.getDetails(videoId);
        const recommendedVideos = video.related_videos.map((vid) => ({
            title: vid.title,
            videoId: vid.id,
            views: vid.short_view_count_text,
            url: `https://www.youtube.com/watch?v=${vid.id}`
        }));

        res.json({
            videoId: videoId,
            recommendedVideos: recommendedVideos
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recommended videos', details: error.message });
    }
});
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
