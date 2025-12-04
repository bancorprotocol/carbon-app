import {
  TonConnectUIProvider,
  useTonAddress,
  useTonConnectUI,
} from '@tonconnect/ui-react';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { TonToken, useTonTokenMapping } from './tokenMap';
import { tokenParserMap } from 'config/utils';
import { wagmiConfig } from 'libs/wagmi/config';
import { WagmiProvider } from 'wagmi';
import { useWagmiNetwork } from 'libs/wagmi/useWagmiNetwork';
import { useWagmiImposter } from 'libs/wagmi/useWagmiImposter';
import { useWagmiTenderly } from 'libs/wagmi/useWagmiTenderly';
import { useWagmiUser } from 'libs/wagmi/useWagmiUser';
import { Contract, getAddress, Interface, TransactionRequest } from 'ethers';
import {
  AssetType,
  SenderFactory,
  TransactionLinker,
  OperationTracker,
  OperationType,
  StageName,
  RawAssetBridgingData,
} from '@tonappchain/sdk';
import { Address } from '@ton/ton';
import { getTacSDK } from './sdk';
import controller from 'abis/controller.json' with { type: 'json' };
import batcher from 'abis/batcher.json' with { type: 'json' };
import { getTonBalance } from './api';
import config from 'config';
import { TrackerDialog } from './TrackerDialog';
import { CarbonWagmiCTX } from 'libs/wagmi/context';

interface TxResult {
  success: boolean;
  error?: string;
}
interface RawAsset {
  address: string;
  rawAmount: number | string;
}
type TonAsset = RawAssetBridgingData;

const TON = config.addresses.tokens.TON;
const smartAccountFactory = config.addresses.tac?.smartAccountFactory;
const proxyContract = config.addresses.tac?.proxy;

const manifestUrl =
  config.mode === 'development'
    ? 'https://ton-connect.github.io/demo-dapp-with-wallet/tonconnect-manifest.json'
    : 'https://ton.carbondefi.xyz/tonconnect-manifest.json';

export default function TonProvider({ children }: { children: ReactNode }) {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <WagmiProvider config={wagmiConfig} reconnectOnMount={true}>
        <CarbonTonWagmiProvider>{children}</CarbonTonWagmiProvider>
      </WagmiProvider>
    </TonConnectUIProvider>
  );
}

async function repeat<T>(cb: () => Promise<T>): Promise<T> {
  let remaining = 60;
  while (remaining) {
    try {
      const value = await cb();
      if (value) return value;
    } catch {
      // Do nothing
    } finally {
      --remaining;
      await new Promise((res) => setTimeout(res, 5_000));
    }
  }
  throw new Error('Too many attempts');
}

const awaitOperationId = async (
  tracker: OperationTracker,
  linker: TransactionLinker,
) => {
  return repeat(() => tracker.getOperationId(linker));
};
const awaitStage = async (
  tracker: OperationTracker,
  operationId: string,
  step: StageName,
) => {
  return repeat(async () => {
    const stage = await tracker.getStageProfiling(operationId);
    if (stage[step].exists) return stage;
  });
};

const awaitTransactionIsDone = async (
  tracker: OperationTracker,
  operationId: string,
) => {
  return repeat(async () => {
    const stage = await tracker.getStageProfiling(operationId);
    if (stage.operationType !== OperationType.PENDING) {
      if (stage.operationType !== OperationType.UNKNOWN) return stage;
      throw new Error('Unknown state of transaction');
    }
  });
};

const parseTransaction = (tx: TransactionRequest) => {
  if (tx.to === config.addresses.carbon.carbonController) {
    const abi = controller.abi;
    return new Interface(abi).parseTransaction({ data: tx.data! });
  } else {
    const abi = batcher.abi;
    return new Interface(abi).parseTransaction({ data: tx.data! });
  }
};

/** Use to override wagmi to use TON instead */
const CarbonTonWagmiProvider = ({ children }: { children: ReactNode }) => {
  if (!config.addresses.tac) {
    throw new Error('config.addresses.tac is not defined');
  }
  const [progress, setProgress] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { getTVMAddress, setTonAddress, setTonTokens } = useTonTokenMapping();

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

  useEffect(() => {
    if (tonUser) {
      if (!smartAccountFactory) {
        throw new Error('config.addresses.tac is not defined');
      }
      const abi = [
        'function getSmartAccountForApplication(string, address) view returns (address)',
      ];
      const factory = new Contract(smartAccountFactory, abi, provider);
      const bouncedAddress = Address.parse(tonUser).toString({
        bounceable: true,
      });
      factory
        .getSmartAccountForApplication(bouncedAddress, proxyContract)
        .then((tacAddress) => {
          if (user === tacAddress) return;
          setUser(tacAddress);
          setTonAddress(tacAddress, tonUser);
        });
    } else {
      setUser('');
    }
  }, [setTonAddress, tonUser, user, provider]);

  const openConnect = useCallback(
    () => tonConnectUI.openModal(),
    [tonConnectUI],
  );

  const sendTransaction = useCallback(
    async (tx: TransactionRequest) => {
      try {
        if (!proxyContract) {
          throw new Error('config.addresses.tac is not defined');
        }
        const getAssetAddress = (address: string) => {
          if (address === TON) return;
          return getTVMAddress(address);
        };
        const toAsset = async (asset: RawAsset) => {
          const address = await getAssetAddress(asset.address);
          return {
            type: AssetType.FT,
            address: address,
            rawAmount: BigInt(asset.rawAmount),
          } as TonAsset;
        };
        const rawAssets: RawAsset[] = tx.customData?.assets || [];
        const getAllAssets = Promise.all(rawAssets.map(toAsset));

        const [sdk, sender, allAssets] = await Promise.all([
          getTacSDK(),
          SenderFactory.getSender({ tonConnect: tonConnectUI }),
          getAllAssets,
        ]);
        const parsed = parseTransaction(tx);

        const evmProxyMsg = {
          evmTargetAddress: proxyContract,
          methodName: `${parsed?.name}(bytes,bytes)`,
          encodedParameters: tx.data!.replace(parsed!.selector, '0x'),
        };
        const assetExist = (asset?: TonAsset): asset is TonAsset =>
          !!asset?.rawAmount;
        const assets = allAssets.filter(assetExist);
        const linker = await sdk.sendCrossChainTransaction(
          evmProxyMsg,
          sender,
          assets,
        );
        const txResult = linker.sendTransactionResult as TxResult;
        if (txResult.error) throw txResult.error;

        const tracker = new OperationTracker(sdk.network);
        setDialogOpen(true);
        setProgress(1);
        const operationId = await awaitOperationId(tracker, linker);
        setProgress(2);
        await awaitStage(tracker, operationId, StageName.COLLECTED_IN_TAC);
        setProgress(3);
        await awaitStage(
          tracker,
          operationId,
          StageName.INCLUDED_IN_TAC_CONSENSUS,
        );
        setProgress(4);
        const stage = await awaitStage(
          tracker,
          operationId,
          StageName.EXECUTED_IN_TAC,
        );
        const hash = stage?.executedInTAC.stageData?.transactions?.[0].hash;
        setProgress(5);
        return {
          hash: hash!,
          wait: async () => {
            await awaitTransactionIsDone(tracker, operationId);
            setDialogOpen(false);
            setProgress(0);
          },
        };
      } catch (e: any) {
        if (e.debugInfo) {
          console.warn(
            `cast call --trace -r ${config.network.rpc.url} --block ${e.debugInfo.blockNumber} --from ${e.debugInfo.from} --data ${e.debugInfo.callData} ${e.debugInfo.to}`,
          );
        }
        setProgress(0);
        setDialogOpen(false);
        throw e;
      }
    },
    [getTVMAddress, tonConnectUI],
  );

  const getBalance = useCallback(
    async (address: string) => {
      if (!tonUser) throw new Error('No TON account found');
      const evmAddress = getAddress(address);
      try {
        if (!TON) {
          throw new Error('config.addresses.tac is not defined');
        }
        if (evmAddress === TON) {
          const balance = await getTonBalance(tonUser);
          return BigInt(balance);
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
    <>
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
      <TrackerDialog
        opened={dialogOpen}
        setOpened={setDialogOpen}
        progress={progress}
      />
    </>
  );
};
