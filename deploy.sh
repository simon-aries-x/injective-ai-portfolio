#!/bin/bash
# 一键部署到 GitHub
# 使用前请确保已在 GitHub 创建了同名仓库：injective-ai-portfolio

set -e

echo "=== Injective AI Portfolio - GitHub 部署脚本 ==="
echo ""

# 配置
GITHUB_USER="simonaries"
REPO_NAME="injective-ai-portfolio"
REMOTE_URL="git@github.com:${GITHUB_USER}/${REPO_NAME}.git"

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
  echo "❌ 请在 injective-ai-portfolio 目录下运行此脚本"
  exit 1
fi

# 检查 Git 配置
if [ ! -d ".git" ]; then
  echo "❌ 不是 Git 仓库"
  exit 1
fi

# 检查 GitHub 仓库是否存在
echo "正在检查 GitHub 仓库是否存在..."
if ssh -T git@github.com 2>&1 | grep -q "Repository not found"; then
  echo ""
  echo "⚠️  仓库 ${GITHUB_USER}/${REPO_NAME} 不存在！"
  echo "请在 GitHub 上创建仓库：https://github.com/new"
  echo "  仓库名：${REPO_NAME}"
  echo "  可见性：Public"
  echo ""
  read -p "创建完成后按 Enter 继续..."
fi

# 添加远程（如果不存在）
if ! git remote | grep -q "^origin$"; then
  echo "添加远程仓库..."
  git remote add origin "${REMOTE_URL}"
fi

# 确保最新
git pull origin master --allow-unrelated-histories || true

# 提交更改
echo "提交代码..."
git add .
git commit -m "feat: AI Injective 投资组合分析师

- 实现 Injective 钱包连接
- 实现余额读取与资产分布图表
- 集成 OpenAI GPT-4 分析
- 本地规则引擎（无需 API Key）
- 完整的响应式 UI
- 支持 Injective Solo AI Builder Sprint 参赛"

# 推送到 GitHub
echo "推送到 GitHub..."
git push -u origin master

echo ""
echo "✅ 部署完成！"
echo ""
echo "GitHub 仓库：https://github.com/${GITHUB_USER}/${REPO_NAME}"
echo "Vercel 部署：https://vercel.com/new  (导入 GitHub 仓库)"
echo ""
