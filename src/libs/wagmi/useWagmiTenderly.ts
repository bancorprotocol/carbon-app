import { lsService } from 'services/localeStorage';

export const useWagmiTenderly = () => {
  /**
   * Sets tenderly rpc url, carbonController and voucher address to localStorage if available
   * Remove sdk and token cache data
   *
   * @param {string} url Tenderly Url to store
   * @param {string} carbonController Custom carbonController address to store
   * @param {string} voucherAddress Custom voucherAddress address to store
   */
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
