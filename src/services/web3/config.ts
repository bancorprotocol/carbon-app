import conf from './config.json';

export interface Config {
  tokens: {
    ETH: string;
    WETH: string;
    BNT: string;
    ZERO: string;
    USDT: string;
    USDC: string;
    DAI: string;
    WBTC: string;
    SHIB: string;
  };
  carbon: {
    carbonController: string;
    voucher: string;
  };
  utils: {
    multicall: string;
  };
}

export const config: Config = {
  ...conf,
};
