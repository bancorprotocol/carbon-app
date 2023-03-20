import { StrategyStatus } from 'libs/queries';

export const getStatusText = (status: StrategyStatus) => {
  return status === StrategyStatus.Active
    ? 'Active'
    : status === StrategyStatus.NoBudget
    ? 'No Budget · Inactive'
    : status === StrategyStatus.Paused
    ? 'Paused - Inactive'
    : 'Inactive';
};

export const getTooltipTextByStatus = (status: StrategyStatus) => {
  return status === StrategyStatus.Active
    ? 'Your strategy is active and ready'
    : status === StrategyStatus.NoBudget
    ? 'Your strategy has no associated funds. Consider depositing funds to activate it.'
    : status === StrategyStatus.Paused
    ? 'Your strategy is currently paused. Edit the prices to activate it.'
    : 'Your strategy is currently inactive. Consider activating it with funds and rates.';
};

export const tooltipTextByStrategyEditOptionsId = {
  duplicateStrategy: 'Create a new strategy with the same details',
  deleteStrategy:
    'Delete the strategy and withdraw all associated funds to your wallet',
  pauseStrategy: 'Deactivate the strategy by nulling the prices',
  withdrawFunds: 'Withdraw funds from an existing strategy',
  depositFunds: 'Deposit additional funds into an existing strategy',
  changeRates:
    'Edit the prices of your buy/sell orders within an existing strategy',
  renewStrategy: 'Renew an inactive strategy',
};

type StrategyEditOption = typeof tooltipTextByStrategyEditOptionsId;
export type StrategyEditOptionId = keyof StrategyEditOption;
