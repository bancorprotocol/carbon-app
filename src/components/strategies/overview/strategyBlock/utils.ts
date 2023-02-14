import { StrategyStatus } from 'libs/queries';

export const getStatusText = (status: StrategyStatus) => {
  return status === StrategyStatus.Active
    ? 'Active'
    : status === StrategyStatus.NoBudget
    ? 'No Budget · Inactive'
    : status === StrategyStatus.OffCurve
    ? 'Off Curve · Inactive'
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
