// 钱包连接 Hook
import { useState, useCallback } from 'react';
import { connectWallet, disconnectWallet, getBalances, calculatePortfolio } from '../services/injective';
import type { InjectiveWallet, Portfolio } from '../types';

export function useWallet() {
  const [wallet, setWallet] = useState<InjectiveWallet | null>(null);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const walletData = await connectWallet();
      if (walletData) {
        setWallet(walletData);
        // 自动获取余额
        const balances = await getBalances(walletData.address);
        const portfolioData = calculatePortfolio(balances);
        setPortfolio(portfolioData);
      } else {
        setError('未检测到钱包，请安装 Keplr 或 Leap');
      }
    } catch (err: any) {
      setError(err.message || '连接失败');
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    await disconnectWallet();
    setWallet(null);
    setPortfolio(null);
  }, []);

  const refreshBalances = useCallback(async () => {
    if (!wallet) return;
    setLoading(true);
    try {
      const balances = await getBalances(wallet.address);
      const portfolioData = calculatePortfolio(balances);
      setPortfolio(portfolioData);
    } catch (err: any) {
      setError(err.message || '刷新失败');
    } finally {
      setLoading(false);
    }
  }, [wallet]);

  return {
    wallet,
    portfolio,
    loading,
    error,
    connect,
    disconnect,
    refreshBalances,
    isConnected: !!wallet,
  };
}
