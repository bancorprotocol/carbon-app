import PoolCollectionProxyAbi from 'abis/PoolCollection_Proxy.json';
import BancorNetworkProxyAbi from 'abis/BancorNetwork_Proxy.json';
import VoucherAbi from 'abis/Voucher.json';
import conf from './config.json';

export interface Config {
  tokens: {
    ETH: string;
    WETH: string;
    BNT: string;
    ZERO: string;
  };
  carbon: {
    poolCollection: string;
    bancorNetwork: string;
    voucher: string;
  };
  utils: {
    multicall: string;
  };
}

export const config: Config = {
  ...conf,
  carbon: {
    poolCollection: PoolCollectionProxyAbi.address,
    bancorNetwork: BancorNetworkProxyAbi.address,
    voucher: VoucherAbi.address,
  },
};
