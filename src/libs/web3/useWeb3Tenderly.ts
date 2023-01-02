import { lsService } from 'services/localeStorage';

export const useWeb3Tenderly = () => {
  const handleTenderlyRPC = (url?: string) => {
    if (url) {
      lsService.setItem('tenderlyRpc', url);
    } else {
      lsService.removeItem('tenderlyRpc');
    }
    window.location.reload();
  };

  return { handleTenderlyRPC };
};
