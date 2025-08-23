import React from 'react';

const Header = () => {
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

        .header::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(102, 126, 234, 0.05) 0%, transparent 70%);
          animation: float 6s ease-in-out infinite;
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
};

export default Header;
