import PoolCollectionProxyAbi from 'abis/PoolCollection_Proxy.json';
import BancorNetworkProxyAbi from 'abis/BancorNetwork_Proxy.json';
import VoucherAbi from 'abis/Voucher.json';

export const ADDRESS_DICT = {
  tokens: {
    ETH: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    BNT: '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C',
    ZERO: '0x0000000000000000000000000000000000000000',
  },
  carbon: {
    poolCollection: PoolCollectionProxyAbi.address,
    bancorNetwork: BancorNetworkProxyAbi.address,
    voucher: VoucherAbi.address,
  },
  utils: {
    multicall: '0x5ba1e12693dc8f9c48aad8770482f4739beed696',
  },
};
