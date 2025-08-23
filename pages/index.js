import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import AddVideoSection from '../components/AddVideoSection';
import VideoCard from '../components/VideoCard';

export default function Home() {
  const [videos, setVideos] = useState([]);

  // 组件挂载时加载数据
  useEffect(() => {
    // 注意：在生产环境中，你可能需要用数据库或其他持久化存储替代 localStorage
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

  // 保存视频到存储
  const saveVideos = (newVideos) => {
    setVideos(newVideos);
    if (typeof window !== 'undefined') {
      localStorage.setItem('youtubeVideos', JSON.stringify(newVideos));
    }
  };

  // 添加新视频
  const handleAddVideo = (video) => {
    const newVideos = [video, ...videos];
    saveVideos(newVideos);
  };

  // 删除视频
  const handleDeleteVideo = (index) => {
    if (confirm('确定要删除这个视频吗？')) {
      const newVideos = videos.filter((_, i) => i !== index);
      saveVideos(newVideos);
    }
  };

  // 更新字幕
  const handleUpdateSubtitle = (index, subtitleData) => {
    const newVideos = [...videos];
    newVideos[index].subtitle = subtitleData;
    saveVideos(newVideos);
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
                  key={video.id}
                  video={video}
                  index={index}
                  onDelete={handleDeleteVideo}
                  onUpdateSubtitle={handleUpdateSubtitle}
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
          box-shadow: 
            0 8px 32px rgba(0,0,0,0.04),
            0 4px 16px rgba(0,0,0,0.02);
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
          
          .empty-state i {
            font-size: 2.5rem;
          }
          
          .empty-state h3 {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </>
  );
}