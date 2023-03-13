import conf from './config.json';
import { lsService } from 'services/localeStorage';

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
    ENJ: string;
    UNI: string;
    LINK: string;
    LDO: string;
    APE: string;
    GRT: string;
    AAVE: string;
    CRV: string;
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
  carbon: {
    ...conf.carbon,
    carbonController:
      lsService.getItem('carbonControllerAddress') ||
      conf.carbon.carbonController,
    voucher: lsService.getItem('voucherContractAddress') || conf.carbon.voucher,
  },
};
