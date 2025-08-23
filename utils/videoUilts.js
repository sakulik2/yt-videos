// 从URL或ID中提取视频ID
export function extractVideoId(input) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
}

// 格式化视频数据
export function formatVideoData(videoData, videoId) {
  return {
    id: videoId,
    title: videoData.snippet.title,
    description: videoData.snippet.description,
    thumbnail: videoData.snippet.thumbnails.high?.url || videoData.snippet.thumbnails.default.url,
    channelTitle: videoData.snippet.channelTitle,
    publishedAt: new Date(videoData.snippet.publishedAt).toLocaleDateString('zh-CN'),
    viewCount: parseInt(videoData.statistics.viewCount || 0).toLocaleString(),
    addedAt: new Date().toLocaleString('zh-CN'),
    subtitle: null
  };
}

// 验证视频ID格式
export function isValidVideoId(videoId) {
  return /^[a-zA-Z0-9_-]{11}$/.test(videoId);
}

// 生成YouTube URL
export function generateYouTubeUrl(videoId) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

// 下载文件工具函数
export function downloadFile(content, filename, contentType = 'text/plain') {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}