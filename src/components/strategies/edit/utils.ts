import { TxStatus } from '../create/types';
import { EditStrategyBudget } from './EditStrategyBudgetContent';

export const getCtaButtonText = (
  type: EditStrategyBudget,
  status: TxStatus
) => {
  const ctaButtonTextByTxStatus: {
    [key in TxStatus]: string;
  } = {
    waitingForConfirmation: 'Waiting for Confirmation',
    processing: 'Processing',
    initial: `${type === 'withdraw' ? 'Confirm Withdraw' : 'Confirm Deposit'}`,
  };

  return ctaButtonTextByTxStatus[status];
};
