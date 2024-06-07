import config from 'config';
// Interface to add new chain to injected wallets as per EIP-3085 (https://github.com/ethereum/EIPs/blob/master/EIPS/eip-3085.md)
interface AddChainParameter {
  chainId: number; // EIP-3085 specifies hex string but web3-react expects number
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number; // EIP-3085 specifies generic string but web3-react expects 18
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
