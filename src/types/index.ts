// Injective 相关类型定义

export interface InjectiveWallet {
  address: string;
  name: string;
  icon: string;
}

export interface TokenBalance {
  denom: string;
  amount: string;
  usdValue?: number;
  change24h?: number;
}

export interface Portfolio {
  totalValueUsd: number;
  change24h: number;
  balances: TokenBalance[];
  lastUpdated: Date;
}

export interface AIAnalysis {
  summary: string;
  riskScore: number; // 1-10
  suggestions: string[];
  marketSentiment: 'bullish' | 'neutral' | 'bearish';
  topHoldings: string[];
  diversificationScore: number; // 1-100
}

export interface AppState {
  wallet: InjectiveWallet | null;
  portfolio: Portfolio | null;
  analysis: AIAnalysis | null;
  loading: boolean;
  error: string | null;
}
