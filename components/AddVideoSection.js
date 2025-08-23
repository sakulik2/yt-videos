import React, { useState } from 'react';
import { extractVideoId } from '../utils/videoUtils';

const AddVideoSection = ({ onAddVideo, videos }) => {
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

    // 检查是否已存在
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

      {isLoading && (
        <div className="loading">
          <i className="fas fa-spinner"></i>
          正在获取视频信息...
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
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .input-group {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
          align-items: end;
        }

        .input-field {
          flex: 1;
          position: relative;
        }

        .input-field label {
          display: block;
          margin-bottom: 12px;
          font-weight: 600;
          color: var(--text-secondary);
          font-size: 1rem;
        }

        .input-field input {
          width: 100%;
          padding: 18px 24px;
          border: 2px solid rgba(102, 126, 234, 0.1);
          border-radius: 18px;
          font-size: 16px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
        }

        .input-field input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 
            0 0 0 4px rgba(102, 126, 234, 0.1),
            0 8px 32px rgba(102, 126, 234, 0.15);
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.95);
        }

        @media (max-width: 768px) {
          .add-video-section {
            padding: 24px;
          }
          
          .input-group {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
};

export default AddVideoSection;