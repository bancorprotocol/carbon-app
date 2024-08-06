import { Dispatch, SetStateAction } from 'react';
import { ONE_AND_A_HALF_SECONDS_IN_MS } from 'utils/time';
import { NavigateOptions } from 'libs/routing';
import { TradeRecurringSearch } from 'libs/routing/routes/trade';
import { checkIfOrdersOverlap, checkIfOrdersReversed } from '../utils';

export const handleTxStatusAndRedirectToOverview = (
  setIsProcessing: Dispatch<SetStateAction<boolean>>,
  navigate?: (opts: NavigateOptions) => Promise<void>
) => {
  setIsProcessing(true);
  setTimeout(() => {
    navigate?.({ to: '/', params: {}, search: {} });
    setIsProcessing(false);
  }, ONE_AND_A_HALF_SECONDS_IN_MS);
};

export const getRecurringError = (search: TradeRecurringSearch) => {
  const { buyMin, buyMax, sellMin, sellMax } = search;
  const buyOrder = { min: buyMin ?? '', max: buyMax ?? '' };
  const sellOrder = { min: sellMin ?? '', max: sellMax ?? '' };
  if (checkIfOrdersReversed(buyOrder, sellOrder)) {
    return 'Orders are reversed. This strategy is currently set to Buy High and Sell Low. Please adjust your prices to avoid an immediate loss of funds upon creation.';
  }
};

export const getRecurringWarning = (search: TradeRecurringSearch) => {
  const { buyMin, buyMax, sellMin, sellMax } = search;
  const buyOrder = { min: buyMin ?? '', max: buyMax ?? '' };
  const sellOrder = { min: sellMin ?? '', max: sellMax ?? '' };
  if (checkIfOrdersOverlap(buyOrder, sellOrder)) {
    return 'Notice: your Buy and Sell orders overlap';
  }
};
