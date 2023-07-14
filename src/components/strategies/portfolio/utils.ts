import BigNumber from 'bignumber.js';
import { Strategy } from 'libs/queries';
import { Token } from 'libs/tokens';
import { prettifyNumber } from 'utils/helpers';

export const buildPairNameByStrategy = ({ base, quote }: Strategy) => {
  return `${base.symbol}/${quote.symbol}`;
};

export const buildPercentageString = (percentage: BigNumber) => {
  return `${percentage.toFixed(2)}%`;
};

export const buildAmountString = (amount: BigNumber, { symbol }: Token) => {
  return `${prettifyNumber(amount)} ${symbol}`;
};
