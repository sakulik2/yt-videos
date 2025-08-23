# YouTube 视频展览馆

一个基于 Next.js 构建的 YouTube 视频收藏和管理平台，支持自定义字幕文件上传。

## 功能特点

- 🎥 添加 YouTube 视频（支持 URL 或视频 ID）
- 📝 自定义字幕文件上传和管理（支持 .srt、.vtt、.ass、.txt 格式）
- 🎨 现代化的响应式设计
- 💾 本地数据存储（可扩展为数据库存储）
- 🔍 视频信息自动获取（标题、描述、缩略图等）
- 📱 移动端适配

## 技术栈

- **框架**: Next.js 14
- **前端**: React 18
- **样式**: CSS-in-JS (styled-jsx)
- **API**: YouTube Data API v3
- **存储**: localStorage (可扩展)

## 快速开始

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd youtube-video-gallery
```

### 2. 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 3. 配置环境变量

复制 `.env.local.example` 为 `.env.local`：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 文件，添加你的 YouTube API 密钥：

```
YOUTUBE_API_KEY=your_youtube_api_key_here
```

### 4. 获取 YouTube API 密钥

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 YouTube Data API v3
4. 创建 API 密钥
5. 将密钥添加到 `.env.local` 文件

### 5. 运行开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

```
├── components/
│   ├── Header.js              # 页面头部组件
│   ├── AddVideoSection.js     # 添加视频表单组件
│   └── VideoCard.js           # 视频卡片组件
├── pages/
│   ├── api/
│   │   └── youtube.js         # YouTube API 端点
│   ├── _app.js               # Next.js 应用配置
│   └── index.js              # 主页面
├── styles/
│   └── globals.css           # 全局样式
├── utils/
│   └── videoUtils.js         # 视频相关工具函数
├── .env.local.example        # 环境变量示例
├── next.config.js           # Next.js 配置
└── package.json             # 项目依赖
```

## 使用说明

### 添加视频

1. 在输入框中粘贴 YouTube 视频 URL 或直接输入 11 位视频 ID
2. 点击"添加视频"按钮
3. 系统会自动获取视频信息并添加到列表

### 管理字幕

1. 点击视频卡片上的"字幕"按钮
2. 展开字幕面板后，点击"选择文件"上传字幕文件
3. 支持的文件格式：.srt、.vtt、.ass、.txt
4. 可以下载或删除已上传的字幕文件

### 删除视频

悬停在视频卡片上，点击右上角的删除按钮（×）即可删除视频。

## 部署

### Vercel 部署（推荐）

#### 方法 1：通过 GitHub 自动部署

1. **准备 GitHub 仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/youtube-video-gallery.git
   git push -u origin main
   ```

2. **连接 Vercel**
   - 访问 [Vercel](https://vercel.com)
   - 点击 "New Project"
   - 选择你的 GitHub 仓库
   - 点击 "Import"

3. **配置环境变量**
   - 在项目导入页面，点击 "Environment Variables"
   - 添加环境变量：
     - **Name**: `YOUTUBE_API_KEY`
     - **Value**: 你的 YouTube API 密钥
     - **Environment**: 选择 "Production", "Preview", 和 "Development"
   - 点击 "Add"

4. **部署**
   - 点击 "Deploy" 开始部署
   - 等待部署完成

#### 方法 2：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 在项目根目录运行
vercel

# 设置环境变量
vercel env add YOUTUBE_API_KEY

# 重新部署
vercel --prod
```

#### 获取 YouTube API 密钥

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 导航到 "APIs & Services" > "Library"
4. 搜索并启用 "YouTube Data API v3"
5. 前往 "APIs & Services" > "Credentials"
6. 点击 "Create Credentials" > "API Key"
7. 复制生成的 API 密钥
8. （可选）限制 API 密钥使用范围以提高安全性

#### Vercel 环境变量设置

在 Vercel Dashboard 中：
1. 选择你的项目
2. 进入 "Settings" 标签
3. 点击左侧菜单的 "Environment Variables"
4. 添加以下变量：
   - **Name**: `YOUTUBE_API_KEY`
   - **Value**: 你的 YouTube API 密钥
   - **Environment**: Production, Preview, Development

### 其他平台部署

该项目是标准的 Next.js 应用，可以部署到任何支持 Node.js 的平台：

#### Netlify
1. 连接 GitHub 仓库
2. 构建命令：`npm run build`
3. 发布目录：`.next`
4. 在 "Site settings" > "Environment variables" 中添加 `YOUTUBE_API_KEY`

#### Railway
```bash
# 安装 Railway CLI
npm install -g @railway/cli

# 登录并部署
railway login
railway link
railway up
```

#### 环境变量注意事项

- **本地开发**: 使用 `.env.local` 文件
- **生产环境**: 在部署平台设置环境变量
- **安全性**: 永远不要将 API 密钥提交到代码仓库中

## 数据存储扩展

当前版本使用 localStorage 存储数据。在生产环境中，建议扩展为数据库存储：

1. **数据库选择**: PostgreSQL、MySQL、MongoDB 等
2. **ORM**: Prisma、TypeORM 等
3. **API 扩展**: 添加 CRUD 操作的 API 端点

## 注意事项

⚠️ **重要**: 在 Claude.ai 环境中运行此项目时，localStorage 不可用。建议：

1. 使用 React state 进行临时存储
2. 或者部署到支持 localStorage 的环境中使用

## 贡献

欢迎提交 Issue 和 Pull Request 来改进项目！

## 许可证

MIT License