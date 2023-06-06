import { Order, StrategyStatus } from 'libs/queries';
import { prettifyNumber, sanitizeNumberInput } from 'utils/helpers';
import { i18n } from 'libs/translations';

export const getStatusText = (status: StrategyStatus) => {
  return status === StrategyStatus.Active
    ? i18n.t('strategy.overview.block.status.active')
    : status === StrategyStatus.NoBudget
    ? i18n.t('strategy.overview.block.status.noBudget')
    : status === StrategyStatus.Paused
    ? i18n.t('strategy.overview.block.status.paused')
    : i18n.t('strategy.overview.block.status.inactive');
};

export const getTooltipTextByStatus = (status: StrategyStatus) => {
  return status === StrategyStatus.Active
    ? i18n.t('strategy.overview.block.tooltips.active')
    : status === StrategyStatus.NoBudget
    ? i18n.t('strategy.overview.block.tooltips.noBudget')
    : status === StrategyStatus.Paused
    ? i18n.t('strategy.overview.block.tooltips.paused')
    : i18n.t('strategy.overview.block.tooltips.inactive');
};

export const tooltipTextByStrategyEditOptionsId = {
  duplicateStrategy: 'Create a new strategy with the same details',
  deleteStrategy:
    'Delete the strategy and withdraw all associated funds to your wallet',
  pauseStrategy: 'Deactivate the strategy by nulling the prices',
  withdrawFunds: 'Withdraw funds from an existing strategy',
  depositFunds: 'Deposit additional funds into an existing strategy',
  editPrices:
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
