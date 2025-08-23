// YouTube API 处理器
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { videoId } = req.query;

  if (!videoId) {
    return res.status(400).json({ error: '缺少视频ID参数' });
  }

  // 验证视频ID格式
  if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    return res.status(400).json({ error: '无效的视频ID格式' });
  }

  const API_KEY = process.env.YOUTUBE_API_KEY;
  
  if (!API_KEY) {
    return res.status(500).json({ error: 'YouTube API key 未配置' });
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${API_KEY}&part=snippet,statistics`
    );

    if (!response.ok) {
      if (response.status === 403) {
        return res.status(403).json({ error: 'API配额已用完或密钥无效' });
      }
      throw new Error(`YouTube API 响应错误: ${response.status}`);
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return res.status(404).json({ error: '未找到指定的视频' });
    }

    const videoData = data.items[0];

    // 检查视频是否可用
    if (!videoData.snippet) {
      return res.status(404).json({ error: '视频信息不可用' });
    }

    return res.status(200).json(videoData);

  } catch (error) {
    console.error('YouTube API 错误:', error);
    return res.status(500).json({ 
      error: '获取视频信息失败',
      details: error.message 
    });
  }
}