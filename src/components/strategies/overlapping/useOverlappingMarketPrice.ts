import { useMarketPrice } from 'hooks/useMarketPrice';
import { Strategy } from 'libs/queries';
import { geoMean } from 'utils/fullOutcome';

export const hasNoBudget = (strategy: Strategy) => {
  const { order0, order1 } = strategy;
  return !Number(order0.balance) && !Number(order1.balance);
};

export const useOverlappingMarketPrice = (strategy: Strategy) => {
  const { base, quote, order0, order1 } = strategy;
  const { marketPrice: externalPrice } = useMarketPrice({ base, quote });
  const calculatedPrice = geoMean(order0.marginalRate, order1.marginalRate);
  return hasNoBudget(strategy)
    ? externalPrice
    : calculatedPrice?.toNumber() ?? externalPrice;
};
