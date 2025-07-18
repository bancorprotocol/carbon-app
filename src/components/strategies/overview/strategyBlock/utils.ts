import {
  StaticOrder,
  StrategyStatus,
} from 'components/strategies/common/types';
import { prettifyNumber, sanitizeNumber } from 'utils/helpers';

export const statusText: Record<StrategyStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  noBudget: 'No Budget - Inactive',
  paused: 'Paused - Inactive',
};

export const getTooltipTextByStatus = (
  isExplorer: boolean | undefined,
  status: StrategyStatus,
) => {
  if (status === 'active') {
    return isExplorer
      ? 'This strategy is currently active and ready to process trades.'
      : '';
  } else if (status === 'noBudget') {
    return isExplorer
      ? 'This strategy has no associated funds and will not process trades.'
      : 'Strategy is out of budget.';
  } else if (status === 'paused') {
    return isExplorer
      ? 'This strategy is currently paused and will not process trades.'
      : 'The strategy is paused. Price indicators are reset.';
  } else {
    return isExplorer
      ? 'This strategy is currently inactive and will not process trades.'
      : 'The strategy is paused and is out of budget. Price indicators are reset.';
  }
};

const tooltipTextByStrategyEditOptionsId = {
  viewStrategy: 'Explore strategy activity',
  duplicateStrategy:
    'Create a new strategy with the same details or undercut it',
  deleteStrategy:
    'Delete the strategy and withdraw all associated funds to your wallet',
  pauseStrategy: 'Deactivate the strategy by nulling the prices',
  withdrawFunds: 'Withdraw funds from an existing strategy',
  depositFunds: 'Deposit additional funds into an existing strategy',
  editPrices:
    'Edit the prices of your buy/sell orders within an existing strategy',
  renewStrategy: 'Renew an inactive strategy',
  manageNotifications: 'Get notified when someone trades against your strategy',
  walletOwner: 'View all strategies from the owner of this strategy',
  explorePair: 'Explore all strategies for this strategy pair',
  simulate: 'Run a simulation on this strategy',
};

export const getTooltipTextByStrategyEditOptionsId = (
  isOwn: boolean | undefined,
) => {
  return {
    ...tooltipTextByStrategyEditOptionsId,
    ...(!isOwn && {
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
  order: StaticOrder;
  decimals: number;
};

export const getPrice = ({
  prettified = false,
  limit = false,
  order,
  decimals,
}: getPriceParams) => {
  if (prettified) {
    return `${prettifyNumber(order.min, {
      abbreviate: true,
      round: true,
    })} ${
      !limit
        ? ` - ${prettifyNumber(order.max, {
            abbreviate: true,
            round: true,
          })}`
        : ''
    }`;
  }
  return `${sanitizeNumber(order.min, decimals)} ${
    !limit ? ` - ${sanitizeNumber(order.max, decimals)}` : ''
  }`;
};
