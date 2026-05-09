// AI 分析 Hook
import { useState, useCallback } from 'react';
import { analyzePortfolio, generateLocalAnalysis } from '../services/ai';
import type { Portfolio, AIAnalysis } from '../types';

export function useAIAnalysis() {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useAI, setUseAI] = useState(false); // 是否使用 OpenAI API

  const analyze = useCallback(async (portfolio: Portfolio) => {
    setLoading(true);
    setError(null);
    try {
      let result: AIAnalysis;
      if (useAI) {
        result = await analyzePortfolio(portfolio);
      } else {
        // 使用本地规则引擎（不需要 API Key）
        result = generateLocalAnalysis(portfolio);
      }
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || '分析失败');
      // 降级到本地分析
      try {
        const fallback = generateLocalAnalysis(portfolio);
        setAnalysis(fallback);
      } catch (e) {
        console.error('降级分析也失败:', e);
      }
    } finally {
      setLoading(false);
    }
  }, [useAI]);

  const clearAnalysis = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  return {
    analysis,
    loading,
    error,
    useAI,
    setUseAI,
    analyze,
    clearAnalysis,
  };
}
