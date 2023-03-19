import { StrategyStatus } from 'libs/queries';
import { ItemId } from './StrategyBlockManage';

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

export const tooltipTextByItemId: { [key in ItemId]: string } = {
  [ItemId.DuplicateStrategy]: 'Create a new strategy with the same details',
  [ItemId.DeleteStrategy]:
    'Delete the strategy and withdraw all associated funds to your wallet',
  [ItemId.PauseStrategy]: 'Deactivate the strategy by nulling the prices',
  [ItemId.WithdrawFunds]: 'Withdraw funds from an existing strategy',
  [ItemId.DepositFunds]: 'Deposit additional funds into an existing strategy',
  [ItemId.ChangeRates]:
    'Edit the prices of your buy/sell orders within an existing strategy',
  [ItemId.RenewStrategy]: 'Renew an inactive strategy',
};
