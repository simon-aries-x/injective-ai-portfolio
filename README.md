# 🤖 AI Injective 投资组合分析师

> **Injective Solo AI Builder Sprint 参赛项目**

一个基于 AI 的 Injective 链上投资组合分析工具，实时展示资产分布并提供智能优化建议。

---

## 🎯 项目目标

- ✅ 实时连接 Injective 钱包，查看链上资产
- ✅ AI 分析投资组合风险、分散化程度
- ✅ 提供可执行的优化建议
- ✅ 完全在浏览器端运行，私钥永不离开本地

---

## 🚀 快速开始

### 前置要求

- **Node.js** 18+
- **npm** 或 **yarn**
- **MetaMask / Keplr** 钱包（用于连接 Injective）

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/simonaries/injective-ai-portfolio.git
cd injective-ai-portfolio

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 `http://localhost:5173`

### 生产构建

```bash
npm run build
npm run preview
```

---

## 📸 功能截图

![Dashboard](screenshots/dashboard.png)
![Analysis](screenshots/analysis.png)

---

## 🛠️ 技术栈

- **React 19** + **TypeScript**
- **Vite** - 构建工具
- **Injective SDK** - 区块链交互
- **TanStack Query** - 数据缓存
- **Recharts** - 数据可视化
- **OpenAI GPT-4o** - AI 分析（可选）

---

## 🏗️ 项目结构

```
injective-ai-portfolio/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx       # 主仪表盘
│   │   ├── WalletButton.tsx    # 钱包连接
│   │   ├── PortfolioChart.tsx  # 资产分布图
│   │   └── AIAnalysisPanel.tsx # AI 分析面板
│   ├── hooks/
│   │   ├── useWallet.ts        # 钱包 Hook
│   │   └── useAIAnalysis.ts    # AI 分析 Hook
│   ├── services/
│   │   ├── injective.ts        # Injective API
│   │   └── ai.ts               # AI 服务
│   ├── types/
│   │   └── index.ts            # TypeScript 类型
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── dist/                       # 构建输出
├── package.json
└── README.md
```

---

## 🔐 安全说明

⚠️ **重要**

- 本工具**不会存储**任何私钥或助记词
- 所有签名操作都在你的浏览器本地完成（通过 Keplr）
- 我们仅读取公开的链上余额数据
- 建议在测试网环境先测试

---

## 🎮 使用说明

### 1. 连接钱包

点击"连接 Injective 钱包"按钮，浏览器会弹出 Keplr 钱包授权请求。

### 2. 查看资产

连接成功后，系统会自动加载你的 INJ、USDT、USDC 等资产余额。

### 3. AI 分析

- 点击"开始分析"获取 AI 投资建议
- 可以选择"使用 GPT-4"进行深度分析（需要 OpenAI API Key）
- 默认使用本地规则引擎（无需 API Key）

### 4. 刷新数据

每 30 秒自动刷新余额，也可以手动点击"刷新余额"。

---

## 🌐 支持的 Injective 资产

| 资产 | 说明 |
|------|------|
| `inj` | Injective 原生代币 |
| `peggy0xdAC17...` | USDT（桥接） |
| `peggy0xA0b86...` | USDC（桥接） |
| 其他 | 自动识别所有 ERC-20 兼容代币 |

---

## 🐛 已知限制

- ⚠️ Injective REST API 有时不稳定（建议使用官方节点）
- ⚠️ 价格数据来自 CoinGecko，可能延迟
- ⚠️ AI 分析基于历史数据，不构成投资建议

---

## 📝 提交说明

**本次提交满足以下要求：**

1. ✅ GitHub 公开仓库
2. ✅ 完整的 README 文档
3. ✅ 可运行的 Demo（本地开发即可）
4. ✅ AI 已集成（AI 分析功能）
5. ✅ Injective 已集成（钱包连接 + 余额读取）
6. ✅ 代码结构清晰，注释完善

**演示视频（待录制）：** 将展示钱包连接、余额读取、AI 分析全过程。

---

## 📜 许可证

MIT

---

## 🙏 致谢

- Injective Labs - 区块链基础设施
- OpenAI - AI 分析能力
- TanStack - React Query
- Recharts - 数据可视化

---

**Built with ❤️ for the Injective Solo AI Builder Sprint**  
2026-05-09
