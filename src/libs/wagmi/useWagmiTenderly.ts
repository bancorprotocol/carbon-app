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
    voucherAddress?: string,
    batcherAddress?: string,
  ) => {
    if (url) lsService.setItem('tenderlyRpc', url);
    else lsService.removeItem('tenderlyRpc');

    if (carbonController)
      lsService.setItem('carbonControllerAddress', carbonController);
    else lsService.removeItem('carbonControllerAddress');

    if (voucherAddress)
      lsService.setItem('voucherContractAddress', voucherAddress);
    else lsService.removeItem('voucherContractAddress');

    if (batcherAddress)
      lsService.setItem('batcherContractAddress', batcherAddress);
    else lsService.removeItem('batcherContractAddress');

    lsService.removeItem('sdkCompressedCacheData');
    lsService.removeItem('tokenPairsCache');
    if (!url) lsService.removeItem('isUncheckedSigner');

    window?.location.reload();
  };

  return { handleTenderlyRPC };
};
