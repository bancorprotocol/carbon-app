import { Order, StrategyStatus } from 'libs/queries';
import { prettifyNumber, sanitizeNumberInput } from 'utils/helpers';

export const getStatusText = (status: StrategyStatus) => {
  return status === StrategyStatus.Active
    ? 'Active'
    : status === StrategyStatus.NoBudget
    ? 'No Budget - Inactive'
    : status === StrategyStatus.Paused
    ? 'Paused - Inactive'
    : 'Inactive';
};

export const getTooltipTextByStatus = (
  isExplorer: boolean | undefined,
  status: StrategyStatus
) => {
  return status === StrategyStatus.Active
    ? isExplorer
      ? 'This strategy is currently active and ready to process trades.'
      : 'Your strategy is active and ready.'
    : status === StrategyStatus.NoBudget
    ? isExplorer
      ? 'This strategy has no associated funds and will not process trades.'
      : 'Your strategy has no associated funds. Consider depositing funds to activate it.'
    : status === StrategyStatus.Paused
    ? isExplorer
      ? 'This strategy is currently paused and will not process trades.'
      : 'Your strategy is currently paused. Edit the prices to activate it.'
    : isExplorer
    ? 'This strategy is currently inactive and will not process trades.'
    : 'Your strategy is currently inactive. Consider activating it with funds and rates.';
};

const tooltipTextByStrategyEditOptionsId = {
  duplicateStrategy: 'Create a new strategy with the same details',
  deleteStrategy:
    'Delete the strategy and withdraw all associated funds to your wallet',
  pauseStrategy: 'Deactivate the strategy by nulling the prices',
  withdrawFunds: 'Withdraw funds from an existing strategy',
  depositFunds: 'Deposit additional funds into an existing strategy',
  editPrices:
    'Edit the prices of your buy/sell orders within an existing strategy',
  renewStrategy: 'Renew an inactive strategy',
  manageNotifications: 'Get notified when someone trades against your strategy',
};

export const getTooltipTextByStrategyEditOptionsId = (
  isExplorer: boolean | undefined
) => {
  return {
    ...tooltipTextByStrategyEditOptionsId,
    ...(isExplorer && {
      manageNotifications:
        'Get notified when someone trades against this strategy',
    }),
  };
};

type StrategyEditOption = typeof tooltipTextByStrategyEditOptionsId;
export type StrategyEditOptionId = keyof StrategyEditOption;

type getPriceParams = {
  prettified?: boolean;
  limit?: boolean;
  order: Order;
  decimals: number;
};

export const getPrice = ({
  prettified = false,
  limit = false,
  order,
  decimals,
}: getPriceParams) => {
  if (prettified) {
    return `${prettifyNumber(order.startRate, {
      abbreviate: order.startRate.length > 10,
      round: true,
    })} ${
      !limit
        ? ` - ${prettifyNumber(order.endRate, {
            abbreviate: order.endRate.length > 10,
            round: true,
          })}`
        : ''
    }`;
  }
  return `${sanitizeNumberInput(order.startRate, decimals)} ${
    !limit ? ` - ${sanitizeNumberInput(order.endRate, decimals)}` : ''
  }`;
};
