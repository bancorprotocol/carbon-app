import { Order, StrategyStatus } from 'libs/queries';
import { TFunction } from 'libs/translations';
import { prettifyNumber, sanitizeNumberInput } from 'utils/helpers';

export const getStatusText = (
  status: StrategyStatus,
  t: TFunction<string, undefined, string>
) => {
  return status === StrategyStatus.Active
    ? t('pages.strategyOverview.card.section3.statuses.status1')
    : status === StrategyStatus.NoBudget
    ? t('pages.strategyOverview.card.section3.statuses.status2')
    : status === StrategyStatus.Paused
    ? t('pages.strategyOverview.card.section3.statuses.status3')
    : t('pages.strategyOverview.card.section3.statuses.status4');
};

export const getTooltipTextByStatus = (
  status: StrategyStatus,
  t: TFunction<string, undefined, string>
) => {
  return status === StrategyStatus.Active
    ? t('pages.strategyOverview.card.tooltips.tooltip7')
    : status === StrategyStatus.NoBudget
    ? t('pages.strategyOverview.card.tooltips.tooltip8')
    : status === StrategyStatus.Paused
    ? t('pages.strategyOverview.card.tooltips.tooltip9')
    : t('pages.strategyOverview.card.tooltips.tooltip10');
};

const tooltipTextByStrategyEditOptionsId = (
  t: TFunction<string, undefined, string>
) => {
  return {
    duplicateStrategy: t(
      'pages.strategyOverview.card.manageStrategy.tooltips.tooltip1'
    ),
    deleteStrategy: t(
      'pages.strategyOverview.card.manageStrategy.tooltips.tooltip2'
    ),
    pauseStrategy: t(
      'pages.strategyOverview.card.manageStrategy.tooltips.tooltip3'
    ),
    withdrawFunds: t(
      'pages.strategyOverview.card.manageStrategy.tooltips.tooltip4'
    ),
    depositFunds: t(
      'pages.strategyOverview.card.manageStrategy.tooltips.tooltip5'
    ),
    editPrices: t(
      'pages.strategyOverview.card.manageStrategy.tooltips.tooltip6'
    ),
    renewStrategy: t(
      'pages.strategyOverview.card.manageStrategy.tooltips.tooltip7'
    ),
    manageNotifications: t(
      'pages.strategyOverview.card.manageStrategy.tooltips.tooltip8'
    ),
  };
};

export const getTooltipTextByStrategyEditOptionsId = (
  id: StrategyEditOptionId,
  t: TFunction<string, undefined, string>
) => {
  return tooltipTextByStrategyEditOptionsId(t)[id];
};

type StrategyEditOption = typeof tooltipTextByStrategyEditOptionsId;
export type StrategyEditOptionId = keyof ReturnType<StrategyEditOption>;

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
