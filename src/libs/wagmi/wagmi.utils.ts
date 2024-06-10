import config from 'config';
// Interface to add new chain to injected wallets as per EIP-3085 (https://github.com/ethereum/EIPs/blob/master/EIPS/eip-3085.md)
interface AddChainParameter {
  chainId: number;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[];
}
export const getChainInfo = (): AddChainParameter => {
  return {
    chainId: config.network.chainId,
    chainName: config.network.name,
    nativeCurrency: {
      name: config.network.gasToken.name,
      symbol: config.network.gasToken.symbol,
      decimals: config.network.gasToken.decimals,
    },
    iconUrls: [config.network.gasToken.logoURI],
    rpcUrls: [config.network.rpc.url],
    blockExplorerUrls: [config.network.blockExplorer.url],
  };
};

// Error messages for EIP-1993 (https://eips.ethereum.org/EIPS/eip-1193#rpc-errors)
export const errorMessages: Record<string, string> = {
  4001: 'Connection rejected. Please approve dApp connection on your wallet.',
  4100: 'The request method/account is not authorized. Please approve dApp permissions on your wallet.',
  4200: 'The wallet does not support the required method.',
  4900: 'The wallet does not support the required method.',
  4901: 'The wallet is disconnected from the current chain.',
};
