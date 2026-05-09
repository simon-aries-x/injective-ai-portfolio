// AI 分析面板
import { useAIAnalysis } from '../hooks/useAIAnalysis';
import type { Portfolio } from '../types';

interface AIAnalysisPanelProps {
  portfolio: Portfolio;
}

export function AIAnalysisPanel({ portfolio }: AIAnalysisPanelProps) {
  const { analysis, loading, error, useAI, setUseAI, analyze, clearAnalysis } = useAIAnalysis();

  const handleAnalyze = () => {
    analyze(portfolio);
  };

  return (
    <div className="ai-analysis">
      <div className="ai-header">
        <h3>🤖 AI 投资组合分析</h3>
        <div className="ai-controls">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={useAI}
              onChange={(e) => setUseAI(e.target.checked)}
            />
            <span className="toggle-label">使用 GPT-4</span>
          </label>
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? '分析中...' : '开始分析'}
          </button>
          {analysis && (
            <button onClick={clearAnalysis} className="btn btn-secondary">
              清除
            </button>
          )}
        </div>
      </div>

      {error && <div className="error-message">⚠️ {error}</div>}

      {analysis && (
        <div className="analysis-content">
          <div className="analysis-summary">
            <p>{analysis.summary}</p>
          </div>

          <div className="analysis-scores">
            <div className="score-item">
              <span className="score-label">风险评分</span>
              <span className="score-value" data-risk={analysis.riskScore}>
                {analysis.riskScore}/10
              </span>
            </div>
            <div className="score-item">
              <span className="score-label">分散化评分</span>
              <span className="score-value">
                {analysis.diversificationScore}/100
              </span>
            </div>
            <div className="score-item">
              <span className="score-label">市场情绪</span>
              <span className={`sentiment-badge sentiment-${analysis.marketSentiment}`}>
                {analysis.marketSentiment === 'bullish' ? '看涨 📈' : 
                 analysis.marketSentiment === 'bearish' ? '看跌 📉' : '中性 ➡️'}
              </span>
            </div>
          </div>

          <div className="analysis-section">
            <h4>💡 优化建议</h4>
            <ul>
              {analysis.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>

          {analysis.topHoldings.length > 0 && (
            <div className="analysis-section">
              <h4>🏆 主要持仓</h4>
              <div className="holdings-tags">
                {analysis.topHoldings.map((holding, index) => (
                  <span key={index} className="tag">
                    {holding}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!analysis && !loading && (
        <div className="analysis-placeholder">
          <p>点击“开始分析”获取 AI 投资建议</p>
          {!useAI && (
            <p className="hint">
              <small>当前使用本地规则引擎（无需 API Key）</small>
            </p>
          )}
        </div>
      )}

      {loading && (
        <div className="analysis-loading">
          <div className="spinner"></div>
          <p>AI 正在分析您的投资组合...</p>
        </div>
      )}
    </div>
  );
}
