// AI 分析服务
import type { Portfolio, AIAnalysis, TokenBalance } from '../types';

// 环境变量或运行时注入
let OPENAI_API_KEY = '';

export function setOpenAIApiKey(key: string) {
  OPENAI_API_KEY = key;
}

// 构建投资组合分析的 prompt
function buildPrompt(portfolio: Portfolio): string {
  const balances = portfolio.balances
    .filter(b => b.usdValue && b.usdValue > 0)
    .map(b => `- ${b.denom}: ${b.usdValue!.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`)
    .join('\n');

  return `你是一个专业的加密货币投资组合分析师。请分析以下 Injective 链上的投资组合数据，并提供专业建议。

投资组合概览：
- 总价值：${portfolio.totalValueUsd.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
- 24h 变化：${portfolio.change24h >= 0 ? '+' : ''}${portfolio.change24h}%

持仓明细：
${balances}

请提供以下分析（用中文回答）：
1. **总体评价**（2-3句话概述）
2. **风险评分**（1-10分，10分最高风险）
3. **优化建议**（3-5条具体可执行的建议）
4. **市场情绪**（bullish/neutral/bearish）
5. **持仓亮点**（2-3个优点）
6. **分散化评分**（1-100分，100分最分散）

格式要求：
- 使用 Markdown 格式
- 评分使用粗体
- 建议使用列表`;
}

// 调用 AI 进行分析
export async function analyzePortfolio(portfolio: Portfolio): Promise<AIAnalysis> {
  if (!OPENAI_API_KEY) {
    throw new Error('请先设置 OpenAI API Key');
  }

  const prompt = buildPrompt(portfolio);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // 使用性价比高的模型
        messages: [
          {
            role: 'system',
            content: '你是一个专业的加密货币投资组合分析师，擅长分析 DeFi 投资组合并提供可执行的建议。',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API 错误: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    // 解析 AI 响应
    return parseAIAnalysis(content, portfolio);
  } catch (error) {
    console.error('AI 分析失败:', error);
    throw error;
  }
}

// 解析 AI 响应
function parseAIAnalysis(content: string, portfolio: Portfolio): AIAnalysis {
  // 简单的解析逻辑
  const riskMatch = content.match(/(\d+)\/10/);
  const riskScore = riskMatch ? parseInt(riskMatch[1]) : 5;

  const diversificationMatch = content.match(/(\d+)\/100/);
  const diversificationScore = diversificationMatch ? parseInt(diversificationMatch[1]) : 50;

  const sentimentMatch = content.match(/(bullish|neutral|bearish)/i);
  const marketSentiment = (sentimentMatch?.[1]?.toLowerCase() as 'bullish' | 'neutral' | 'bearish') || 'neutral';

  // 提取建议列表
  const suggestions: string[] = [];
  const lines = content.split('\n');
  for (const line of lines) {
    if (line.match(/^\s*[-*]\s+/) || line.match(/^\s*\d+[\.\)]\s+/)) {
      suggestions.push(line.trim().replace(/^[-*\d\.\)]\s*/, ''));
    }
  }

  // 提取持仓亮点
  const topHoldings: string[] = [];
  const holdingMatches = content.matchAll(/(?:持有|持仓|亮点)[：:]\s*([^\n]+)/g);
  for (const match of holdingMatches) {
    topHoldings.push(match[1].trim());
  }

  return {
    summary: content.substring(0, 500), // 前 500 字符作为摘要
    riskScore,
    suggestions: suggestions.length > 0 ? suggestions : ['建议保持当前仓位，关注市场动态'],
    marketSentiment,
    topHoldings: topHoldings.length > 0 ? topHoldings : portfolio.balances.slice(0, 3).map(b => b.denom),
    diversificationScore,
  };
}

// 生成 AI 建议的替代方案：本地规则引擎（不需要 API Key）
export function generateLocalAnalysis(portfolio: Portfolio): AIAnalysis {
  const totalValue = portfolio.totalValueUsd;
  const balances = portfolio.balances;
  const stablecoinRatio = balances.reduce((sum, b) => {
    if (b.denom.includes('usdt') || b.denom.includes('usdc')) {
      return sum + (b.usdValue || 0);
    }
    return sum;
  }, 0) / totalValue;

  // 基于规则的简单分析
  let riskScore = 5;
  let diversificationScore = 50;
  let marketSentiment: 'bullish' | 'neutral' | 'bearish' = 'neutral';
  const suggestions: string[] = [];

  if (stablecoinRatio > 0.7) {
    riskScore = 2;
    diversificationScore = 30;
    suggestions.push('您的投资组合中稳定币占比很高，建议适当配置一些成长型资产');
    suggestions.push('考虑添加一些 INJ 或其他蓝筹加密货币以平衡风险');
  } else if (stablecoinRatio < 0.1) {
    riskScore = 8;
    diversificationScore = 60;
    suggestions.push('您的投资组合风险较高，建议增加稳定币仓位以降低波动');
    suggestions.push('考虑设置止损或使用对冲策略');
  } else {
    riskScore = 5;
    diversificationScore = 70;
    suggestions.push('投资组合相对均衡，建议定期再平衡');
  }

  if (balances.length === 1) {
    diversificationScore = Math.min(diversificationScore, 30);
    suggestions.push('单一资产风险较高，建议分散投资');
  } else if (balances.length >= 3) {
    diversificationScore = Math.min(100, diversificationScore + 20);
    suggestions.push('资产配置较为分散，表现良好');
  }

  return {
    summary: `基于规则的自动分析：您的投资组合总价值为 ${totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}。`,
    riskScore,
    suggestions,
    marketSentiment,
    topHoldings: balances.slice(0, 3).map(b => b.denom),
    diversificationScore,
  };
}
