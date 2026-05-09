// Injective 区块链交互服务
import { MsgSend } from '@injectivelabs/sdk-ts';
import { BigNumber } from 'bignumber.js';
import type { Portfolio, TokenBalance, InjectiveWallet } from '../types';

// Injective 主网配置
export const INJECTIVE_CHAIN_ID = 'injective-1';
export const INJECTIVE_RPC = 'https://injective-rpc.polkachu.com';
export const INJECTIVE_REST = 'https://injective-api.polkachu.com';

// 常用代币地址（Injective）
const TOKENS = {
  INJ: 'inj1...', // INJ 原生代币
  USDT: 'peggy0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
  USDC: 'peggy0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
};

// 连接钱包
export async function connectWallet(): Promise<InjectiveWallet | null> {
  try {
    // 检查是否有 Keplr 或 Leap 钱包
    if (typeof window !== 'undefined' && (window as any).keplr) {
      const chainId = INJECTIVE_CHAIN_ID;
      await (window as any).keplr.enable(chainId);
      
      const key = await (window as any).getOfflineSigner(chainId).getAccounts();
      const address = key[0].address;
      
      return {
        address,
        name: 'Keplr',
        icon: '🦊',
      };
    }
    
    // 备用：使用助记词或私钥（不推荐生产环境）
    console.warn('未检测到钱包扩展，请安装 Keplr 或 Leap');
    return null;
  } catch (error) {
    console.error('连接钱包失败:', error);
    return null;
  }
}

// 获取账户余额
export async function getBalances(address: string): Promise<TokenBalance[]> {
  try {
    // 使用 Injective REST API 获取余额
    const response = await fetch(`${INJECTIVE_REST}/cosmos/bank/v1beta1/balances/${address}`);
    const data = await response.json();
    
    const balances: TokenBalance[] = [];
    
    if (data.balances && Array.isArray(data.balances)) {
      for (const balance of data.balances) {
        const denom = balance.denom;
        const amount = balance.amount;
        
        // 获取代币价格（需要价格预言机，这里简化处理）
        let usdValue = 0;
        if (denom.includes('inj')) {
          // INJ 价格（可以从 CoinGecko API 获取）
          const price = await getTokenPrice('injective-protocol');
          usdValue = parseFloat(amount) / 1e18 * price; // INJ 精度 18
        } else if (denom.includes('usdt') || denom.includes('peggy0xdAC17F958D2ee523a2206206994597C13D831ec7')) {
          usdValue = parseFloat(amount) / 1e6; // USDT 精度 6
        } else if (denom.includes('usdc') || denom.includes('peggy0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48')) {
          usdValue = parseFloat(amount) / 1e6; // USDC 精度 6
        }
        
        balances.push({
          denom,
          amount,
          usdValue,
          change24h: 0, // 可以后续添加 24h 变化
        });
      }
    }
    
    return balances;
  } catch (error) {
    console.error('获取余额失败:', error);
    return [];
  }
}

// 获取代币价格（从 CoinGecko）
async function getTokenPrice(tokenId: string): Promise<number> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`
    );
    const data = await response.json();
    return data[tokenId]?.usd || 0;
  } catch {
    return 0;
  }
}

// 计算投资组合总价值
export function calculatePortfolio(balances: TokenBalance[]): Portfolio {
  const totalValueUsd = balances.reduce((sum, b) => sum + (b.usdValue || 0), 0);
  
  return {
    totalValueUsd,
    change24h: 0, // 暂时为 0，后续可以计算
    balances,
    lastUpdated: new Date(),
  };
}

// 断开钱包
export async function disconnectWallet(): Promise<void> {
  // Keplr 没有明确的 disconnect API，这里是占位
}
