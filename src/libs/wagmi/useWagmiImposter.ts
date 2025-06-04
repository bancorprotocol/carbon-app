import { useEffect, useState } from 'react';
import { lsService } from 'services/localeStorage';

export const useWagmiImposter = () => {
  const [imposterAccount, setImposterAccount] = useState<string | undefined>(
    lsService.getItem('imposterAccount'),
  );

  useEffect(() => {
    if (imposterAccount) {
      lsService.setItem('imposterAccount', imposterAccount);
    } else {
      lsService.removeItem('imposterAccount');
    }
  }, [imposterAccount]);

  return { imposterAccount, setImposterAccount };
};
