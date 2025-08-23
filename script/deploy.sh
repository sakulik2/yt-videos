#!/bin/bash

# YouTube 视频展览馆 - Vercel 快速部署脚本

echo "🚀 开始部署 YouTube 视频展览馆到 Vercel"
echo ""

# 检查是否安装了 vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 安装 Vercel CLI..."
    npm install -g vercel
fi

# 检查环境变量文件
if [ ! -f ".env.local" ]; then
    echo "⚠️  未找到 .env.local 文件"
    echo "请先创建 .env.local 文件并添加 YouTube API 密钥："
    echo ""
    echo "YOUTUBE_API_KEY=your_youtube_api_key_here"
    echo ""
    exit 1
fi

# 检查 API 密钥是否存在
if ! grep -q "YOUTUBE_API_KEY=" .env.local; then
    echo "⚠️  在 .env.local 中未找到 YOUTUBE_API_KEY"
    echo "请添加你的 YouTube API 密钥到 .env.local 文件"
    exit 1
fi

echo "✅ 环境配置检查通过"
echo ""

# 登录 Vercel
echo "🔐 请登录 Vercel..."
vercel login

echo ""
echo "🏗️  开始部署..."

# 部署到 Vercel
vercel --prod

echo ""
echo "🎉 部署完成！"
echo ""
echo "📝 请记住在 Vercel Dashboard 中设置环境变量："
echo "   - 项目设置 > Environment Variables"
echo "   - 添加 YOUTUBE_API_KEY 并设置你的 API 密钥"
echo ""
echo "🔗 访问你的项目：https://your-project.vercel.app"