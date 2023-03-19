import { StrategyStatus } from 'libs/queries';
import { StrategyEditOptionsId } from './StrategyBlockManage';

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

export const getTooltipTextByItemId = (id: StrategyEditOptionsId) => {
  return id === StrategyEditOptionsId.WithdrawFunds
    ? 'Withdraw funds from an existing strategy'
    : id === StrategyEditOptionsId.DuplicateStrategy
    ? 'Create a new strategy with the same details'
    : id === StrategyEditOptionsId.DeleteStrategy
    ? 'Delete the strategy and withdraw all associated funds to your wallet'
    : id === StrategyEditOptionsId.PauseStrategy
    ? ''
    : '';
};
