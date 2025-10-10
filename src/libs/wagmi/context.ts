// ********************************** //
// WAGMI CONTEXT
// ********************************** //
import { CarbonWagmiProviderContext } from './wagmi.types';
import { currentChain } from './chains';
import { createContext, useContext } from 'react';

const defaultValue: CarbonWagmiProviderContext = {
  user: undefined,
  imposterAccount: undefined,
  setImposterAccount: () => {},
  isNetworkActive: false,
  provider: undefined,
  signer: undefined,
  currentConnector: undefined,
  connectors: [],
  chainId: currentChain.id,
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

export const CarbonWagmiCTX = createContext(defaultValue);

export const useWagmi = () => useContext(CarbonWagmiCTX);
