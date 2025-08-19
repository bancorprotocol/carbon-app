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
import { Contract, Interface, TransactionRequest } from 'ethers';
import { AssetType, SenderFactory, startTracking } from '@tonappchain/sdk';
import { TonClient, Address } from '@ton/ton';
import { getTacSDK } from './address';
import { abi } from 'abis/controller.json' with { type: 'json' };
import config from 'config';

const TON = '0xb76d91340F5CE3577f0a056D29f6e3Eb4E88B140';
const smartAccountFactory = '0x070820Ed658860f77138d71f74EfbE173775895b';
const proxyContract = '0xd68eFC6C132315123634777F5BA52aAD6B0292C1';

// TODO: update with production URL once deployed
const manifestUrl =
  config.mode === 'development'
    ? 'https://ton-connect.github.io/demo-dapp-with-wallet/tonconnect-manifest.json'
    : 'https://add-ton-tg.carbon-app-ton-tg.pages.dev/tonconnect-manifest.json';

export const TonProvider = ({ children }: { children: ReactNode }) => {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
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
  }, [setTonTokens]);

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
      const factory = new Contract(
        smartAccountFactory,
        [
          'function getSmartAccountForApplication(string, address) view returns (address)',
        ],
        provider,
      );
      factory
        .getSmartAccountForApplication(tonUser, proxyContract)
        .then((tacAddress) => {
          if (user === tacAddress) return;
          setUser(tacAddress);
          setTonAddress(tacAddress, tonUser);
        });
    } else {
      setUser('');
    }
  }, [getEvmAddress, setTonAddress, tonUser, user, provider]);

  const openConnect = useCallback(
    () => tonConnectUI.openModal(),
    [tonConnectUI],
  );

  const sendTransaction = useCallback(
    async (tx: TransactionRequest) => {
      try {
        const toAsset = async (asset: {
          address: string;
          rawAmount: number;
        }) => ({
          type: AssetType.FT,
          address:
            asset.address === TON
              ? undefined
              : await getTVMAddress(asset.address),
          rawAmount: BigInt(asset.rawAmount),
        });
        const [sdk, sender, allAssets] = await Promise.all([
          getTacSDK(),
          SenderFactory.getSender({ tonConnect: tonConnectUI }),
          Promise.all(tx.customData?.assets?.map(toAsset) || []),
        ]);
        const parsed = new Interface(abi).parseTransaction({ data: tx.data! });
        const evmProxyMsg = {
          evmTargetAddress: proxyContract,
          methodName: `${parsed?.name}(bytes,bytes)`,
          encodedParameters: tx.data!.replace(parsed!.selector, '0x'),
        };
        const assets = allAssets.filter((asset) => !!asset.rawAmount);
        const linker = await sdk.sendCrossChainTransaction(
          evmProxyMsg,
          sender,
          assets,
        );
        return {
          hash: linker.shardsKey,
          wait: async () => {
            const stages = await startTracking(linker, sdk.network);
            if (!stages) return;
            return stages.collectedInTAC.stageData?.transactions;
          },
        };
      } catch (e: any) {
        if (e.debugInfo) {
          console.warn(
            `cast call --trace -r ${config.network.rpc.url} --block ${e.debugInfo.blockNumber} --from ${e.debugInfo.from} --data ${e.debugInfo.callData} ${e.debugInfo.to}`,
          );
        }
        throw e;
      }
    },
    [getTVMAddress, tonConnectUI],
  );

  const getBalance = useCallback(
    async (evmAddress: string) => {
      if (!tonUser) throw new Error('No TON account found');

      try {
        if (evmAddress === TON) {
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
          return BigInt(res.exists ? res.rawAmount : 0);
        }
      } catch (e) {
        console.error(e);
        return BigInt(0);
      }
    },
    [getTVMAddress, tonUser],
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
