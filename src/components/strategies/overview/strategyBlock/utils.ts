import { StrategyStatus } from 'libs/queries';
import { ItemId } from './StrategyBlockManage';

export const getStatusText = (status: StrategyStatus) => {
  return status === StrategyStatus.Active
    ? 'Active'
    : status === StrategyStatus.NoBudget
    ? 'No Budget · Inactive'
    : status === StrategyStatus.OffCurve
    ? 'Paused - Inactive'
    : 'Inactive';
};

export const getTooltipTextByStatus = (status: StrategyStatus) => {
  return status === StrategyStatus.Active
    ? 'Your strategy is active and ready'
    : status === StrategyStatus.NoBudget
    ? 'Your strategy has no associated funds. Consider depositing funds to activate it.'
    : status === StrategyStatus.OffCurve
    ? 'Your strategy is currently paused. Update the rates to activate it.'
    : 'Your strategy is currently inactive. Consider activating it with funds and rates.';
};

export const getTooltipTextByItemId = (id: ItemId) => {
  return id === ItemId.WithdrawFunds
    ? 'Withdraw funds from an existing strategy'
    : id === ItemId.DuplicateStrategy
    ? 'Create a new strategy with the same details'
    : id === ItemId.DeleteStrategy
    ? 'Delete the strategy and withdraw all associated funds to your wallet'
    : id === ItemId.pauseStrategy
    ? ''
    : '';
};
