// 钱包连接按钮
import { useWallet } from '../hooks/useWallet';

export function WalletButton() {
  const { wallet, loading, error, connect, disconnect } = useWallet();

  if (wallet) {
    return (
      <div className="wallet-info">
        <div className="wallet-details">
          <span className="wallet-icon">{wallet.icon}</span>
          <div className="wallet-text">
            <span className="wallet-name">{wallet.name}</span>
            <span className="wallet-address">
              {wallet.address.slice(0, 6)}...{wallet.address.slice(-6)}
            </span>
          </div>
        </div>
        <button onClick={disconnect} className="btn btn-secondary">
          断开连接
        </button>
      </div>
    );
  }

  return (
    <div className="wallet-connect">
      <button
        onClick={connect}
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? '连接中...' : '🔗 连接 Injective 钱包'}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
