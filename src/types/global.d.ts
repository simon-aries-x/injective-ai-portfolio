// 全局类型扩展（如 Keplr 钱包）

interface Window {
  keplr?: {
    enable: (chainId: string) => Promise<void>;
  };
  getOfflineSigner?: (chainId: string) => {
    getAccounts: () => Promise<{ address: string }[]>;
  };
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
