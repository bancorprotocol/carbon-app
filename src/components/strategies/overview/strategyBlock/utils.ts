import { Order, StrategyStatus } from 'libs/queries';
import { prettifyNumber, sanitizeNumberInput } from 'utils/helpers';

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
