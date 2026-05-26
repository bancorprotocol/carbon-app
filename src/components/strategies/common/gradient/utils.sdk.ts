import { GradientType } from '@bancor/carbon-sdk';
import {
  normalizeInvertedRate,
  normalizeRate,
} from '@bancor/carbon-sdk/strategy-management';
import { parseUnits } from 'ethers';
import { SafeDecimal } from 'libs/safedecimal';
import { FormGradientOrder } from '../types';

const ONE = new SafeDecimal(1);
const ZERO = new SafeDecimal(0);

export const STRATEGY_TYPE_SHIFT = 248n;
export const GRADIENT_STRATEGY_TYPE_MASK = 1n << 255n;
export const STRATEGY_TYPE_VALUE_MASK = (1n << STRATEGY_TYPE_SHIFT) - 1n;

export function isGradientStrategyId(id: bigint) {
  return (id & GRADIENT_STRATEGY_TYPE_MASK) !== 0n;
}

export function stripStrategyTypeBits(id: bigint) {
  return id & STRATEGY_TYPE_VALUE_MASK;
}

export function getMultiFactor(
  gradientType: number,
  startPrice: SafeDecimal,
  endPrice: SafeDecimal,
  startDate: SafeDecimal,
  endDate: SafeDecimal,
) {
  if (endDate.lt(startDate)) {
    throw new Error('expiry must be greater than tradingStartTime');
  }

  if (startPrice.eq(0)) return startPrice;

  switch (gradientType) {
    case 0:
      return endPrice.div(startPrice).sub(ONE).div(endDate.sub(startDate));
    case 1:
      return ONE.sub(endPrice.div(startPrice)).div(endDate.sub(startDate));
    case 2:
      return ONE.sub(startPrice.div(endPrice)).div(endDate.sub(startDate));
    case 3:
      return startPrice.div(endPrice).sub(ONE).div(endDate.sub(startDate));
    case 4:
      return endPrice.div(startPrice).ln().div(endDate.sub(startDate));
    case 5:
      return startPrice.div(endPrice).ln().div(endDate.sub(startDate));
  }
  throw new Error(`Invalid gradientType ${gradientType}`);
}

export function getRateAtTime(
  gradientType: number,
  initialRate: SafeDecimal,
  multiFactor: SafeDecimal,
  tradingStartTime: SafeDecimal,
  currentTime: SafeDecimal,
) {
  const timeElapsed = SafeDecimal.max(currentTime.sub(tradingStartTime), ZERO);
  const factor = multiFactor.mul(timeElapsed);

  let rate: SafeDecimal;
  switch (gradientType) {
    case 0:
      rate = initialRate.mul(ONE.add(factor));
      break;
    case 1:
      rate = initialRate.mul(ONE.sub(factor));
      break;
    case 2:
      rate = initialRate.div(ONE.sub(factor));
      break;
    case 3:
      rate = initialRate.div(ONE.add(factor));
      break;
    case 4:
      rate = initialRate.mul(factor.exp());
      break;
    case 5:
      rate = initialRate.div(factor.exp());
      break;
    default:
      throw new Error(`Invalid gradientType ${gradientType}`);
  }

  if (!rate.isFinite() || rate.lte(ZERO)) {
    return ZERO;
  }
  return rate;
}

export function getRateAtExpiry(
  gradientType: number,
  initialRate: SafeDecimal,
  multiFactor: SafeDecimal,
  tradingStartTime: SafeDecimal,
  expiry: SafeDecimal,
) {
  return getRateAtTime(
    gradientType,
    initialRate,
    multiFactor,
    tradingStartTime,
    expiry,
  );
}

export function createGradientBuyOrder(
  baseTokenDecimals: number,
  quoteTokenDecimals: number,
  type: GradientType,
  buy: FormGradientOrder,
) {
  const liquidity = parseUnits(buy.budget, quoteTokenDecimals);
  const initialPrice = normalizeRate(
    buy.startPrice,
    quoteTokenDecimals,
    baseTokenDecimals,
  );
  const endPrice = normalizeRate(
    buy.endPrice,
    quoteTokenDecimals,
    baseTokenDecimals,
  );
  const multiFactor = getMultiFactor(
    type,
    new SafeDecimal(initialPrice),
    new SafeDecimal(endPrice),
    new SafeDecimal(buy.startDate),
    new SafeDecimal(buy.endDate),
  );

  return {
    liquidity: liquidity.toString(),
    initialPrice,
    tradingStartTime: Number(buy.startDate),
    expiry: Number(buy.endDate),
    multiFactor: multiFactor.toString(),
    gradientType: type,
  };
}

export function createGradientSellOrder(
  baseTokenDecimals: number,
  quoteTokenDecimals: number,
  type: GradientType,
  sell: FormGradientOrder,
) {
  const liquidity = parseUnits(sell.budget, baseTokenDecimals);
  const initialPrice = normalizeInvertedRate(
    sell.startPrice,
    quoteTokenDecimals,
    baseTokenDecimals,
  );
  const endPrice = normalizeInvertedRate(
    sell.endPrice,
    quoteTokenDecimals,
    baseTokenDecimals,
  );
  const multiFactor = getMultiFactor(
    type,
    new SafeDecimal(initialPrice),
    new SafeDecimal(endPrice),
    new SafeDecimal(sell.startDate),
    new SafeDecimal(sell.endDate),
  );

  return {
    liquidity: liquidity.toString(),
    initialPrice,
    tradingStartTime: Number(sell.startDate),
    expiry: Number(sell.endDate),
    multiFactor: multiFactor.toString(),
    gradientType: type,
  };
}
