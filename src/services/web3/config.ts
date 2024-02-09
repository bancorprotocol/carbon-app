import conf from 'config';
import { lsService } from 'services/localeStorage';

export const config = {
  ...conf.addresses,
  carbon: {
    ...conf.addresses.carbon,
    carbonController:
      lsService.getItem('carbonControllerAddress') ||
      conf.addresses.carbon.carbonController,
    voucher:
      lsService.getItem('voucherContractAddress') ||
      conf.addresses.carbon.voucher,
  },
};
