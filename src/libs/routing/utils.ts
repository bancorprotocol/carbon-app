import { lsService } from 'services/localeStorage';
import { config } from 'services/web3/config';

export const getLastVisitedPair = () => {
  const [base, quote] = lsService.getItem('tradePair') || [
    config.tokens.ETH,
    config.tokens.USDC,
  ];

  return { base, quote };
};
