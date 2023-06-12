import { Order, StrategyStatus } from 'libs/queries';
import { prettifyNumber, sanitizeNumberInput } from 'utils/helpers';
import { i18n } from 'libs/translations';

export const getStatusText = (status: StrategyStatus) => {
  return status === StrategyStatus.Active
    ? i18n.t('pages.strategyOverview.card.section3.statuses.status1')
    : status === StrategyStatus.NoBudget
    ? i18n.t('pages.strategyOverview.card.section3.statuses.status2')
    : status === StrategyStatus.Paused
    ? i18n.t('pages.strategyOverview.card.section3.statuses.status3')
    : i18n.t('pages.strategyOverview.card.section3.statuses.status4');
};

export const getTooltipTextByStatus = (status: StrategyStatus) => {
  return status === StrategyStatus.Active
    ? i18n.t('pages.strategyOverview.card.tooltips.tooltip7')
    : status === StrategyStatus.NoBudget
    ? i18n.t('pages.strategyOverview.card.tooltips.tooltip8')
    : status === StrategyStatus.Paused
    ? i18n.t('pages.strategyOverview.card.tooltips.tooltip9')
    : i18n.t('pages.strategyOverview.card.tooltips.tooltip10');
};

export const tooltipTextByStrategyEditOptionsId = {
  duplicateStrategy: i18n.t(
    'pages.strategyOverview.card.manageStrategy.tooltips.tooltip1'
  ),
  deleteStrategy: i18n.t(
    'pages.strategyOverview.card.manageStrategy.tooltips.tooltip2'
  ),
  pauseStrategy: i18n.t(
    'pages.strategyOverview.card.manageStrategy.tooltips.tooltip3'
  ),
  withdrawFunds: i18n.t(
    'pages.strategyOverview.card.manageStrategy.tooltips.tooltip4'
  ),
  depositFunds: i18n.t(
    'pages.strategyOverview.card.manageStrategy.tooltips.tooltip5'
  ),
  editPrices: i18n.t(
    'pages.strategyOverview.card.manageStrategy.tooltips.tooltip6'
  ),
  renewStrategy: i18n.t(
    'pages.strategyOverview.card.manageStrategy.tooltips.tooltip7'
  ),
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
