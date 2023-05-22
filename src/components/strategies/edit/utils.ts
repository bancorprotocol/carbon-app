import { StrategyTxStatus } from '../create/types';
import { EditStrategyBudget } from './EditStrategyBudgetContent';

export const getCtaButtonText = (
  type: EditStrategyBudget,
  status: StrategyTxStatus
) => {
  const ctaButtonTextByStrategyTxStatus: {
    [key in StrategyTxStatus]: string;
  } = {
    waitingForConfirmation: 'Waiting For Confirmation',
    processing: 'Processing',
    initial: `${type === 'withdraw' ? 'Confirm Withdraw' : 'Confirm Deposit'}`,
  };

  return ctaButtonTextByStrategyTxStatus[status];
};
