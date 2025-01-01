const express = require('express');
const ytsr = require('@distube/ytsr');

const app = express();
const PORT = 3000;

// YouTube検索APIエンドポイント
app.get('/apis', async (req, res) => {
  const query = req.query.q; // クエリから検索ワードを取得
  if (!query) {
    return res.status(400).json({ error: '検索クエリが必要です' });
  }

  try {
    // ytsrを使用して検索
    const searchResults = await ytsr(query, { limit: 10 });
    const items = searchResults.items.map(item => ({
      type: item.type,
      title: item.title || 'No Title',
      url: item.url || 'No URL',
      duration: item.duration || 'No Duration',
      thumbnail: item.bestThumbnail?.url || 'No Thumbnail',
      channel: item.author?.name || 'No Channel Name',
    }));

    res.json(items); // 結果を返却
  } catch (error) {
    console.error('エラー:', error);
    res.status(500).json({ error: '検索中にエラーが発生しました' });
  }
});

// サーバーを起動
app.listen(PORT, () => {
  console.log(`サーバーは http://localhost:${PORT} で稼働中です`);
});
