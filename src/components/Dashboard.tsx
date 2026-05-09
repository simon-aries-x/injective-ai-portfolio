// 投资组合仪表盘主组件
import { useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useAIAnalysis } from '../hooks/useAIAnalysis';
import { WalletButton } from './WalletButton';
import { PortfolioChart } from './PortfolioChart';
import { AIAnalysisPanel } from './AIAnalysisPanel';
import type { Portfolio } from '../types';

export function Dashboard() {
  const { wallet, portfolio, isConnected, loading, error, refreshBalances } = useWallet();
  const { analyze, loading: aiLoading } = useAIAnalysis();

  // 自动刷新余额（每30秒）
  useEffect(() => {
    if (!isConnected) return;
    
    const interval = setInterval(refreshBalances, 30000);
    return () => clearInterval(interval);
  }, [isConnected, refreshBalances]);

  // 当有新数据时自动分析
  useEffect(() => {
    if (portfolio && portfolio.balances.length > 0) {
      analyze(portfolio);
    }
  }, [portfolio, analyze]);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🤖 AI Injective 投资组合分析师</h1>
        <p className="subtitle">智能分析你的 Injective 链上资产</p>
      </header>

      <section className="wallet-section">
        <WalletButton />
        {error && <p className="error-text">{error}</p>}
      </section>

      {isConnected && portfolio ? (
        <>
          <section className="portfolio-summary">
            <div className="summary-cards">
              <div className="card">
                <h3>总价值</h3>
                <p className="value">
                  ${portfolio.totalValueUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="card">
                <h3>24h 变化</h3>
                <p className={`change ${portfolio.change24h >= 0 ? 'positive' : 'negative'}`}>
                  {portfolio.change24h >= 0 ? '+' : ''}{portfolio.change24h}%
                </p>
              </div>
              <div className="card">
                <h3>资产数量</h3>
                <p className="value">{portfolio.balances.length}</p>
              </div>
              <div className="card">
                <h3>更新时间</h3>
                <p className="time">
                  {portfolio.lastUpdated.toLocaleTimeString('zh-CN')}
                </p>
              </div>
            </div>
          </section>

          <div className="main-content">
            <aside className="chart-section">
              <PortfolioChart portfolio={portfolio} />
              
              <div className="refresh-section">
                <button
                  onClick={refreshBalances}
                  disabled={loading}
                  className="btn btn-outline"
                >
                  🔄 刷新余额
                </button>
              </div>
            </aside>

            <main className="analysis-section">
              <AIAnalysisPanel portfolio={portfolio} />
            </main>
          </div>
        </>
      ) : (
        <div className="welcome-section">
          <div className="welcome-card">
            <h2>👋 欢迎使用 AI 投资组合分析师</h2>
            <p>
              连接你的 Injective 钱包，我们将自动分析你的链上资产配置，
              并提供智能优化建议。
            </p>
            <ul className="features">
              <li>✅ 实时余额查询</li>
              <li>✅ AI 驱动的投资建议</li>
              <li>✅ 风险评分与分散化分析</li>
              <li>✅ 完全运行在浏览器，私钥安全</li>
            </ul>
            <div className="notice">
              <strong>🔒 安全提示：</strong>
              <p>本工具不会存储你的私钥，所有操作都在你的浏览器本地完成。</p>
            </div>
          </div>
        </div>
      )}

      <footer className="dashboard-footer">
        <p>
          Built with ❤️ for <strong>Injective Solo AI Builder Sprint</strong>
        </p>
        <p className="links">
          <a href="https://github.com/injective-labs" target="_blank" rel="noopener noreferrer">
            Injective GitHub
          </a>
          {' | '}
          <a href="https://docs.injective.network/" target="_blank" rel="noopener noreferrer">
            Injective Docs
          </a>
        </p>
      </footer>
    </div>
  );
}
