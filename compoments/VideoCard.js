import React, { useState } from 'react';

const VideoCard = ({ video, index, onDelete, onUpdateSubtitle }) => {
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

  const openYouTube = () => {
    const url = `https://www.youtube.com/watch?v=${video.id}`;
    window.open(url, '_blank');
  };

  return (
    <div className="video-card">
      <button className="delete-btn" onClick={() => onDelete(index)} title="删除视频">
        <i className="fas fa-times"></i>
      </button>
      
      {video.subtitle && (
        <div className="subtitle-indicator">
          <i className="fas fa-closed-captioning"></i> 字幕
        </div>
      )}
      
      <div className="video-thumbnail-container">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="video-thumbnail"
        />
        <div className="play-overlay" onClick={openYouTube}>
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
          <div className="meta-item" style={{color: '#999', fontSize: '0.8rem'}}>
            <i className="fas fa-plus-circle"></i>
            <span>添加于 {video.addedAt}</span>
          </div>
        </div>
        
        <div className="video-actions">
          <button 
            className={`action-btn subtitle-toggle-btn ${video.subtitle ? 'has-subtitle' : ''}`}
            onClick={() => setSubtitlePanelExpanded(!subtitlePanelExpanded)}
          >
            <i className="fas fa-closed-captioning"></i>
            字幕
          </button>
          <button className="action-btn play-btn" onClick={openYouTube}>
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
                />
                <button 
                  className="subtitle-upload-btn" 
                  onClick={() => document.querySelector('.subtitle-file-input').click()}
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
        </div>
      </div>

      <style jsx>{`
        .video-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 
            0 20px 60px rgba(0,0,0,0.08),
            0 8px 32px rgba(0,0,0,0.04);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          border: 1px solid rgba(255,255,255,0.3);
          display: flex;
          flex-direction: column;
          height: 520px;
        }

        .video-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 
            0 32px 80px rgba(0,0,0,0.12),
            0 16px 48px rgba(0,0,0,0.08);
        }

        .video-thumbnail-container {
          position: relative;
          overflow: hidden;
          border-radius: 20px 20px 0 0;
        }

        .video-thumbnail {
          width: 100%;
          height: 220px;
          object-fit: cover;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .video-card:hover .video-thumbnail {
          transform: scale(1.08);
        }

        .play-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 80px;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(10px);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.3s ease;
          cursor: pointer;
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
        }

        .video-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--text-primary);
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
          backdrop-filter: blur(10px);
          border: none;
          border-radius: 50%;
          width: 44px;
          height: 44px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: #ff4757;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          transform: scale(0.8);
          box-shadow: 0 8px 32px rgba(255, 71, 87, 0.2);
          z-index: 10;
        }

        .video-card:hover .delete-btn {
          opacity: 1;
          transform: scale(1);
        }

        .delete-btn:hover {
          background: #ff4757;
          color: white;
          transform: scale(1.1);
          box-shadow: 0 12px 40px rgba(255, 71, 87, 0.4);
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
          backdrop-filter: blur(10px);
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

        .subtitle-toggle-btn {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
        }

        .subtitle-toggle-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
        }

        .subtitle-toggle-btn.has-subtitle {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
        }

        .subtitle-toggle-btn.has-subtitle:hover {
          box-shadow: 0 6px 16px rgba(139, 92, 246, 0.3);
        }

        .play-btn {
          background: var(--primary-gradient);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        }

        .play-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3);
        }

        .subtitle-panel {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
          background: #f8fafc;
          border-radius: 0 0 16px 16px;
          margin: 0 -20px -20px -20px;
        }

        .subtitle-panel.expanded {
          max-height: 300px;
        }

        .subtitle-content {
          padding: 20px;
          border-top: 1px solid #e2e8f0;
        }

        .subtitle-upload-section {
          margin-bottom: 16px;
        }

        .subtitle-upload-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .subtitle-upload-wrapper {
          position: relative;
          display: inline-block;
        }

        .subtitle-file-input {
          display: none;
        }

        .subtitle-upload-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .subtitle-upload-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .subtitle-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px 16px;
          margin-top: 12px;
        }

        .subtitle-file-details {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .subtitle-file-name {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.9rem;
        }

        .subtitle-file-size {
          color: var(--text-muted);
          font-size: 0.8rem;
        }

        .subtitle-actions {
          display: flex;
          gap: 8px;
        }

        .subtitle-action-btn {
          padding: 6px 12px;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 4px;
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
      `}</style>
    </div>
  );
};

export default VideoCard;