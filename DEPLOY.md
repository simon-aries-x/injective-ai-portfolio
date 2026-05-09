# 部署指南

## 步骤 1: 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 仓库名填写：`injective-ai-portfolio`
3. 选择 **Public**
4. 点击 "Create repository"

## 步骤 2: 推送代码

```bash
cd ~/injective-ai-portfolio
./deploy.sh
```

或者手动推送：

```bash
git remote add origin git@github.com:simonaries/injective-ai-portfolio.git
git push -u origin master
```

## 步骤 3: 部署到 Vercel（推荐）

1. 访问 https://vercel.com/new
2. 选择 "Import Git Repository"
3. 找到 `injective-ai-portfolio` 并导入
4. 框架会自动识别为 Vite 项目
5. 点击 "Deploy"
6. 等待部署完成，你将获得一个 `*.vercel.app` 域名

## 步骤 4: 提交参赛

- GitHub 仓库：`https://github.com/simonaries/injective-ai-portfolio`
- Demo 链接：Vercel 提供的 `*.vercel.app` 域名
- 在 HackQuest Typeform 提交上述链接

---

**注意：** 如果使用自定义域名，需要配置 DNS 并等待 SSL 证书生效。
