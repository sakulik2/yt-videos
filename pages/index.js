import React, { useState, useEffect } from 'react';
import Head from 'next/head';

// 工具函数 - 内联版本
function extractVideoId(input) {
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

// 头部组件 - 内联版本
function Header() {
  return (
    <div className="header">
      <h1>补档外嵌大合集</h1>
      <p>精选视频内容收藏，支持自定义字幕文件</p>
      
      <style jsx>{`
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding: 32px 40px;
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          border: 1px solid var(--glass-border);
          position: relative;
          overflow: hidden;
          box-shadow: 
            0 8px 32px rgba(0,0,0,0.04),
            0 4px 16px rgba(0,0,0,0.02);
        }

        .header h1 {
          color: var(--text-primary);
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 8px;
          background: var(--primary-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          position: relative;
          z-index: 1;
        }

        .header p {
          color: var(--text-secondary);
          font-size: 1.1rem;
          font-weight: 400;
          position: relative;
          z-index: 1;
        }

        @media (max-width: 768px) {
          .header {
            padding: 24px 20px;
            margin-bottom: 32px;
          }
          
          .header h1 {
            font-size: 2rem;
          }
          
          .header p {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

// 添加视频组件 - 内联版本
function AddVideoSection({ onAddVideo, videos }) {
  const [videoInput, setVideoInput] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const showMessage = (msg, type = 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const handleAddVideo = async () => {
    if (!videoInput.trim()) {
      showMessage('请输入 YouTube 视频 URL 或 ID');
      return;
    }

    const videoId = extractVideoId(videoInput.trim());
    if (!videoId) {
      showMessage('无效的 YouTube URL 或 ID');
      return;
    }

    if (videos.find(v => v.id === videoId)) {
      showMessage('该视频已存在');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/youtube?videoId=${videoId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `请求失败: ${response.status}`);
      }
      
      const videoData = await response.json();
      
      const video = {
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
      
      onAddVideo(video);
      setVideoInput('');
      showMessage('视频添加成功！', 'success');
      
    } catch (error) {
      showMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddVideo();
    }
  };

  return (
    <div className="add-video-section">
      <h2>✨ 添加新视频</h2>
      
      <div className="input-group">
        <div className="input-field">
          <label htmlFor="videoInput">
            <i className="fab fa-youtube"></i>
            YouTube 视频 URL 或 ID
          </label>
          <input 
            type="text" 
            id="videoInput"
            value={videoInput}
            onChange={(e) => setVideoInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="粘贴 YouTube 链接或输入视频 ID..."
          />
        </div>
        <button 
          className="btn" 
          onClick={handleAddVideo}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <i className="fas fa-spinner"></i>
              处理中...
            </>
          ) : (
            <>
              <i className="fas fa-plus"></i>
              添加视频
            </>
          )}
        </button>
      </div>
      
      {message && (
        <div className={`message ${messageType === 'success' ? 'success-message' : 'error-message'}`}>
          <i className={messageType === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle'}></i>
          {message}
        </div>
      )}

      <style jsx>{`
        .add-video-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          padding: 40px;
          border-radius: 32px;
          box-shadow: 
            0 20px 60px rgba(0,0,0,0.1),
            0 8px 32px rgba(0,0,0,0.05),
            inset 0 1px 0 rgba(255,255,255,0.6);
          margin-bottom: 50px;
          border: 1px solid rgba(255,255,255,0.3);
        }

        .add-video-section h2 {
          color: var(--text-primary);
          margin-bottom: 30px;
          font-size: 2rem;
          font-weight: 700;
        }

        .input-group {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
          align-items: end;
        }

        .input-field {
          flex: 1;
        }

        .input-field label {
          display: block;
          margin-bottom: 12px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .input-field input {
          width: 100%;
          padding: 18px 24px;
          border: 2px solid rgba(102, 126, 234, 0.1);
          border-radius: 18px;
          font-size: 16px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(255, 255, 255, 0.8);
        }

        .input-field input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 
            0 0 0 4px rgba(102, 126, 234, 0.1),
            0 8px 32px rgba(102, 126, 234, 0.15);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .input-group {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

// 视频卡片组件 - 内联版本
function VideoCard({ video, index, onDelete, onUpdateSubtitle }) {
  const [subtitlePanelExpanded, setSubtitlePanelExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const showMessage = (msg, type = 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const openYouTube = () => {
    window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
  };

  const handleSubtitleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
      const subtitleData = {
        name: file.name,
        size: file.size,
        content: event.target.result,
        uploadedAt: new Date().toLocaleString('zh-CN')
      };

      onUpdateSubtitle(index, subtitleData);
      showMessage('字幕已上传成功！', 'success');
    };

    reader.readAsText(file, 'UTF-8');
  };

  const downloadSubtitle = () => {
    if (!video.subtitle) return;

    const blob = new Blob([video.subtitle.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = video.subtitle.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const removeSubtitle = () => {
    if (confirm('确定要删除这个字幕文件吗？')) {
      onUpdateSubtitle(index, null);
      showMessage('字幕已删除', 'success');
    }
  };

  return (
    <div className="video-card">
      <button className="delete-btn" onClick={() => onDelete(index)}>
        <i className="fas fa-times"></i>
      </button>
      
      {video.subtitle && (
        <div className="subtitle-indicator">
          <i className="fas fa-closed-captioning"></i> 字幕
        </div>
      )}
      
      <div className="video-thumbnail-container" onClick={openYouTube}>
        <img src={video.thumbnail} alt={video.title} />
        <div className="play-overlay">
          <i className="fas fa-play"></i>
        </div>
      </div>
      
      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>
        <div className="video-meta">
          <div className="meta-item">
            <i className="fas fa-tv"></i>
            <span>{video.channelTitle}</span>
          </div>
          <div className="meta-item">
            <i className="fas fa-eye"></i>
            <span>{video.viewCount} 次观看</span>
          </div>
          <div className="meta-item">
            <i className="fas fa-calendar-alt"></i>
            <span>发布于 {video.publishedAt}</span>
          </div>
        </div>
        
        <div className="video-actions">
          <button 
            className={`action-btn subtitle-btn ${video.subtitle ? 'has-subtitle' : ''}`}
            onClick={() => setSubtitlePanelExpanded(!subtitlePanelExpanded)}
          >
            <i className="fas fa-closed-captioning"></i>
            字幕
          </button>
          <button className="action-btn youtube-btn" onClick={openYouTube}>
            <i className="fab fa-youtube"></i>
            观看视频
          </button>
        </div>

        {message && (
          <div className={`message ${messageType === 'success' ? 'success-message' : 'error-message'}`}>
            <i className={messageType === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle'}></i>
            {message}
          </div>
        )}
      </div>

      <div className={`subtitle-panel ${subtitlePanelExpanded ? 'expanded' : ''}`}>
        <div className="subtitle-content">
          <div className="subtitle-upload-section">
            <div className="subtitle-upload-row">
              <label className="subtitle-upload-label">
                <i className="fas fa-upload"></i>
                上传字幕文件
              </label>
              <div className="subtitle-upload-wrapper">
                <input 
                  type="file" 
                  className="subtitle-file-input" 
                  onChange={handleSubtitleUpload}
                  accept=".srt,.vtt,.ass,.txt"
                  style={{ display: 'none' }}
                />
                <button 
                  className="subtitle-upload-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    e.currentTarget.parentElement.querySelector('.subtitle-file-input').click();
                  }}
                >
                  <i className="fas fa-file-upload"></i>
                  选择文件
                </button>
              </div>
            </div>
          </div>
          
          {video.subtitle && (
            <div className="subtitle-info">
              <div className="subtitle-file-details">
                <i className="fas fa-file-alt"></i>
                <div className="subtitle-file-info">
                  <div className="subtitle-file-name">{video.subtitle.name}</div>
                  <div className="subtitle-file-size">{(video.subtitle.size / 1024).toFixed(1)} KB</div>
                </div>
              </div>
              <div className="subtitle-actions">
                <button className="subtitle-action-btn download-btn" onClick={downloadSubtitle}>
                  <i className="fas fa-download"></i>
                  下载
                </button>
                <button className="subtitle-action-btn remove-btn" onClick={removeSubtitle}>
                  <i className="fas fa-trash"></i>
                  删除
                </button>
              </div>
            </div>
          )}

          <div className="subtitle-tips">
            <h4>支持的字幕格式：</h4>
            <p>.srt, .vtt, .ass, .txt</p>
            <p>文件大小限制：5MB 以内</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .video-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.08);
          transition: all 0.4s ease;
          position: relative;
          cursor: pointer;
          display: flex;
          flex-direction: column;
        }

        .video-card:hover {
          transform: translateY(-8px) scale(1.02);
        }

        .video-thumbnail-container {
          position: relative;
          overflow: hidden;
          border-radius: 20px 20px 0 0;
        }

        .video-thumbnail-container img {
          width: 100%;
          height: 220px;
          object-fit: cover;
        }

        .play-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 80px;
          background: rgba(0,0,0,0.7);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .video-card:hover .play-overlay {
          opacity: 1;
        }

        .play-overlay i {
          color: white;
          font-size: 24px;
          margin-left: 4px;
        }

        .video-info {
          padding: 20px;
          flex-grow: 1;
        }

        .video-title {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 16px;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .video-meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .meta-item i {
          width: 16px;
          color: #667eea;
        }

        .delete-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(255, 255, 255, 0.95);
          border: none;
          border-radius: 50%;
          width: 44px;
          height: 44px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ff4757;
          opacity: 0;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .video-card:hover .delete-btn {
          opacity: 1;
        }

        .delete-btn:hover {
          background: #ff4757;
          color: white;
          transform: scale(1.1);
        }

        .subtitle-indicator {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(139, 92, 246, 0.9);
          color: white;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          z-index: 10;
        }

        .video-actions {
          display: flex;
          gap: 8px;
          margin-top: 16px;
        }

        .action-btn {
          flex: 1;
          padding: 10px 16px;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .subtitle-btn {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
        }

        .subtitle-btn.has-subtitle {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
        }

        .youtube-btn {
          background: var(--primary-gradient);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        }

        .action-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3);
        }

        .subtitle-panel {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease;
          background: #f8fafc;
          border-radius: 0 0 20px 20px;
          margin: 0 -20px -20px -20px;
        }

        .subtitle-panel.expanded {
          max-height: 400px;
        }

        .subtitle-content {
          padding: 30px 40px;
          border-top: 1px solid #e2e8f0;
        }

        .subtitle-upload-section {
          margin-bottom: 24px;
        }

        .subtitle-upload-row {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .subtitle-upload-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .subtitle-upload-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .subtitle-upload-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .subtitle-upload-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .subtitle-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .subtitle-file-details {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .subtitle-file-details i {
          color: #667eea;
          font-size: 1.2rem;
        }

        .subtitle-file-name {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.95rem;
        }

        .subtitle-file-size {
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        .subtitle-actions {
          display: flex;
          gap: 10px;
        }

        .subtitle-action-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .download-btn {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
        }

        .download-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .remove-btn {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
        }

        .remove-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .subtitle-tips {
          background: rgba(102, 126, 234, 0.05);
          padding: 16px 20px;
          border-radius: 12px;
          border-left: 4px solid #667eea;
        }

        .subtitle-tips h4 {
          color: var(--text-primary);
          font-size: 0.9rem;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .subtitle-tips p {
          color: var(--text-muted);
          font-size: 0.85rem;
          margin: 2px 0;
        }

        .message {
          padding: 12px 16px;
          border-radius: 12px;
          margin: 16px 0 0 0;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
      `}</style>
    </div>
  );
}

// 主页组件
export default function Home() {
  const [videos, setVideos] = useState([]);
  const [expandedPanels, setExpandedPanels] = useState({}); // 管理每个视频的展开状态

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedVideos = localStorage.getItem('youtubeVideos');
      if (savedVideos) {
        try {
          setVideos(JSON.parse(savedVideos));
        } catch (error) {
          console.error('解析存储的视频数据失败:', error);
        }
      }
    }
  }, []);

  const saveVideos = (newVideos) => {
    setVideos(newVideos);
    if (typeof window !== 'undefined') {
      localStorage.setItem('youtubeVideos', JSON.stringify(newVideos));
    }
  };

  const handleAddVideo = (video) => {
    const newVideos = [video, ...videos];
    saveVideos(newVideos);
  };

  const handleDeleteVideo = (index) => {
    if (confirm('确定要删除这个视频吗？')) {
      const newVideos = videos.filter((_, i) => i !== index);
      saveVideos(newVideos);
      // 清理对应的展开状态
      setExpandedPanels(prev => {
        const newPanels = { ...prev };
        delete newPanels[videos[index].id];
        return newPanels;
      });
    }
  };

  const handleUpdateSubtitle = (index, subtitleData) => {
    const newVideos = [...videos];
    newVideos[index].subtitle = subtitleData;
    saveVideos(newVideos);
  };

  const toggleSubtitlePanel = (videoId) => {
    setExpandedPanels(prev => ({
      ...prev,
      [videoId]: !prev[videoId]
    }));
  };

  return (
    <>
      <Head>
        <title>YouTube视频展览馆</title>
        <meta name="description" content="精选视频内容收藏，支持自定义字幕文件" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container">
        <Header />
        
        <AddVideoSection 
          onAddVideo={handleAddVideo}
          videos={videos}
        />

        <div id="videos-container">
          {videos.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-video"></i>
              <h3>还没有添加任何视频</h3>
              <p>使用上面的表单添加你的第一个 YouTube 视频吧！</p>
            </div>
          ) : (
            <div className="videos-grid">
              {videos.map((video, index) => (
                <VideoCard
                  key={`${video.id}-${index}`}
                  video={video}
                  index={index}
                  onDelete={handleDeleteVideo}
                  onUpdateSubtitle={handleUpdateSubtitle}
                  isExpanded={expandedPanels[video.id] || false}
                  onTogglePanel={() => toggleSubtitlePanel(video.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .videos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 32px;
          margin-top: 50px;
        }

        .empty-state {
          text-align: center;
          padding: 60px 40px;
          color: var(--text-muted);
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          border: 2px dashed rgba(102, 126, 234, 0.2);
        }

        .empty-state i {
          font-size: 3rem;
          margin-bottom: 16px;
          color: rgba(102, 126, 234, 0.6);
        }

        .empty-state h3 {
          font-size: 1.5rem;
          margin-bottom: 8px;
          color: var(--text-primary);
          font-weight: 600;
        }

        .empty-state p {
          font-size: 1rem;
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .videos-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          
          .empty-state {
            padding: 40px 24px;
          }
        }
      `}</style>
    </>
  );
}
