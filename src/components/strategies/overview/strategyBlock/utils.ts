import { Order, StrategyStatus } from 'libs/queries';
import { prettifyNumber, sanitizeNumberInput } from 'utils/helpers';
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

export const getTooltipTextByItemId = (id: ItemId) => {
  return id === ItemId.WithdrawFunds
    ? 'Withdraw funds from an existing strategy'
    : id === ItemId.DuplicateStrategy
    ? 'Create a new strategy with the same details'
    : id === ItemId.DeleteStrategy
    ? 'Delete the strategy and withdraw all associated funds to your wallet'
    : id === ItemId.PauseStrategy
    ? ''
    : '';
};

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
