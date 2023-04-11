import { lsService } from 'services/localeStorage';

export const useWeb3Tenderly = () => {
  const handleTenderlyRPC = (
    url?: string,
    carbonController?: string,
    voucherAddress?: string
  ) => {
    url
      ? lsService.setItem('tenderlyRpc', url)
      : lsService.removeItem('tenderlyRpc');

    carbonController
      ? lsService.setItem('carbonControllerAddress', carbonController)
      : lsService.removeItem('carbonControllerAddress');

    voucherAddress
      ? lsService.setItem('voucherContractAddress', voucherAddress)
      : lsService.removeItem('voucherContractAddress');

    lsService.removeItem('sdkCompressedCacheData');
    lsService.removeItem('tokenPairsCache');
    !url && lsService.removeItem('isUncheckedSigner');

    window?.location.reload();
  };

  return { handleTenderlyRPC };
};
