import {
  TonConnectUIProvider,
  useTonAddress,
  useTonConnectUI,
} from '@tonconnect/ui-react';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { TonToken, useTonTokenMapping } from './tokenMap';
import { tokenParserMap } from 'config/utils';
import { CarbonWagmiCTX } from 'libs/wagmi/WagmiProvider';
import { wagmiConfig } from 'libs/wagmi/config';
import { WagmiProvider } from 'wagmi';
import { useWagmiNetwork } from 'libs/wagmi/useWagmiNetwork';
import { useWagmiImposter } from 'libs/wagmi/useWagmiImposter';
import { useWagmiTenderly } from 'libs/wagmi/useWagmiTenderly';
import { useWagmiUser } from 'libs/wagmi/useWagmiUser';
import { TransactionRequest } from 'ethers';
import { AssetType, SenderFactory, startTracking } from '@tonappchain/sdk';
import { TonClient, Address } from '@ton/ton';
import { getTacSDK } from './address';
import config from 'config';

export const TonProvider = ({ children }: { children: ReactNode }) => {
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
  const { getTVMAddress, getEvmAddress, setTonAddress, setTonTokens } =
    useTonTokenMapping();

  // Get token list
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
      setTonTokens(tokens);
    };
    importTokens();
  }, []);

  const [tonConnectUI] = useTonConnectUI();
  const tonUser = useTonAddress();
  const [user, setUser] = useState<string>();
  const {
    chainId,
    provider,
    connectors,
    isNetworkActive,
    networkError,
    switchNetwork,
  } = useWagmiNetwork();

  const { imposterAccount, setImposterAccount } = useWagmiImposter();

  const { handleTenderlyRPC } = useWagmiTenderly();

  const {
    signer,
    currentConnector,
    connect,
    disconnect,
    isUserBlocked,
    isUncheckedSigner,
    setIsUncheckedSigner,
    isSupportedNetwork,
    accountChainId,
  } = useWagmiUser({
    imposterAccount,
    setImposterAccount,
  });

  // TODO: close SDK connection oncleanup
  useEffect(() => {
    if (tonUser) {
      getEvmAddress(tonUser).then((tacAddress) => {
        setUser(tacAddress);
        setTonAddress(tacAddress, tonUser);
      });
    } else {
      setUser('');
    }
  }, [getEvmAddress, setTonAddress, tonUser]);

  const openConnect = useCallback(
    () => tonConnectUI.openModal(),
    [tonConnectUI],
  );

  const sendTransaction = useCallback(
    async (tx: TransactionRequest) => {
      const toAsset = async (asset: { address: string; amount: string }) => ({
        type: AssetType.FT,
        address: await getTVMAddress(asset.address),
        amount: Number(asset.amount),
      });
      const [sdk, sender, assets] = await Promise.all([
        getTacSDK(),
        SenderFactory.getSender({ tonConnect: tonConnectUI }),
        Promise.all(tx.customData.assets.map(toAsset)),
      ]);
      const evmProxyMsg = {
        evmTargetAddress: tx.to!.toString(),
        encodedParameters: tx.data!,
      };
      const linker = await sdk.sendCrossChainTransaction(
        evmProxyMsg,
        sender,
        assets,
      );
      return {
        hash: linker.shardsKey,
        wait: () => startTracking(linker, sdk.network),
      };
    },
    [getTVMAddress, tonConnectUI],
  );

  const getBalance = useCallback(
    async (evmAddress: string) => {
      if (!tonUser) throw new Error('No TON account found');

      try {
        // TODO: find a better way to prevent hardcoding
        if (evmAddress === '0xb76d91340F5CE3577f0a056D29f6e3Eb4E88B140') {
          const client = new TonClient({
            endpoint:
              import.meta.env.VITE_TON_RPC ??
              'https://rp.mainnet.tac.build/api/v2/jsonRPC',
          });
          return client.getBalance(Address.parse(tonUser));
        } else {
          const sdk = await getTacSDK();
          const tvmAddress = await getTVMAddress(evmAddress);
          const res = await sdk.getUserJettonBalanceExtended(
            tonUser,
            tvmAddress,
          );
          return BigInt(res.exists ? res.amount : 0);
        }
      } catch (e) {
        console.error(e);
        return BigInt(0);
      }
    },
    [tonUser],
  );

  return (
    <CarbonWagmiCTX.Provider
      value={{
        user,
        isNetworkActive,
        provider,
        signer,
        sendTransaction,
        currentConnector,
        connectors,
        chainId,
        accountChainId,
        handleTenderlyRPC,
        imposterAccount,
        setImposterAccount,
        connect,
        openConnect,
        disconnect,
        networkError,
        isSupportedNetwork,
        switchNetwork,
        isUserBlocked,
        isUncheckedSigner,
        setIsUncheckedSigner,
        getBalance,
      }}
    >
      {children}
    </CarbonWagmiCTX.Provider>
  );
};
