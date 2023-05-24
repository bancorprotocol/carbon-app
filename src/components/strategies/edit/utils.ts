import { TxStatus } from '../create/types';
import { ctaButtonTextByTxStatus } from '../utils';
import { EditStrategyBudget } from './EditStrategyBudgetContent';
import { EditStrategyPrices } from './EditStrategyPricesContent';

export const getCtaButtonTextStrategyBudget = (
  type: EditStrategyBudget,
  status: TxStatus
) => {
  if (status === 'initial') {
    return `${type === 'withdraw' ? 'Confirm Withdraw' : 'Confirm Deposit'}`;
  }
  return ctaButtonTextByTxStatus[status];
};

export const getCtaButtonTextEditPrices = (
  type: EditStrategyPrices,
  status: TxStatus
) => {
  if (status === 'initial') {
    return `${type === 'renew' ? 'Renew Strategy' : 'Confirm Changes'}`;
  }
  return ctaButtonTextByTxStatus[status];
};
