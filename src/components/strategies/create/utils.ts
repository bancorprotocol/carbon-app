import { OrderCreate } from 'components/strategies/create/useOrder';
import { Dispatch, SetStateAction } from 'react';
import { ONE_AND_A_HALF_SECONDS_IN_MS } from 'utils/time';
import { NavigateOptions } from 'libs/routing';

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

export const checkErrors = (
  order: OrderCreate,
  otherOrder: OrderCreate,
  balance?: string
) => {
  const minMaxCorrect =
    Number(order.min) > 0 && Number(order.max) > Number(order.min);
  const priceCorrect = Number(order.price) >= 0;
  const budgetCorrect =
    !order.budget || Number(order.budget) <= Number(balance);

  return (minMaxCorrect || priceCorrect) && budgetCorrect;
};
