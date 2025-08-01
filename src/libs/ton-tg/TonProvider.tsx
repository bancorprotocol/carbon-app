import { TonConnectUIProvider, useTonAddress } from '@tonconnect/ui-react';
import { ReactNode, useEffect } from 'react';
import { setTonTokenMap, TonToken } from './tokenMap';
import { tokenParserMap } from 'config/utils';
import { CarbonWagmiCTX } from 'libs/wagmi/WagmiProvider';
import { wagmiConfig } from 'libs/wagmi/config';
import config from 'config';
import { WagmiProvider } from 'wagmi';

export const TonProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const importTokens = async () => {
      const tokens: TonToken[] = [];
      // Static list
      for (const { uri, parser } of config.tokenLists) {
        const response = await fetch(uri);
        const result = await response.json();
        const parsedResult: { tokens: TonToken[] } = parser
          ? await tokenParserMap[parser](result)
          : (result as any);
        for (const token of parsedResult.tokens) {
          tokens.push(token);
        }
      }
      setTonTokenMap(tokens);
    };
    importTokens();
  }, []);

  return (
    <TonConnectUIProvider manifestUrl="https://ton-connect.github.io/demo-dapp-with-wallet/tonconnect-manifest.json">
      <WagmiProvider config={wagmiConfig} reconnectOnMount={true}>
        <CarbonTonWagmiProvider>{children}</CarbonTonWagmiProvider>
      </WagmiProvider>
    </TonConnectUIProvider>
  );
};

/** Use to override wagmi to use TON instead */
const CarbonTonWagmiProvider = ({ children }: { children: ReactNode }) => {
  const address = useTonAddress();
  const data = {
    user: address,
    imposterAccount: undefined,
    setImposterAccount: () => {},
    isNetworkActive: false,
    provider: undefined,
    signer: undefined,
    currentConnector: undefined,
    connectors: [],
    chainId: config.network.chainId,
    accountChainId: undefined,
    handleTenderlyRPC: () => {},
    disconnect: async () => {},
    connect: async () => {},
    networkError: undefined,
    isSupportedNetwork: true,
    switchNetwork: () => {},
    isUserBlocked: false,
    isUncheckedSigner: false,
    setIsUncheckedSigner: () => {},
  };
  return (
    <CarbonWagmiCTX.Provider value={data}>{children}</CarbonWagmiCTX.Provider>
  );
};
