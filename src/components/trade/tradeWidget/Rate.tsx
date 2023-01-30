import BigNumber from 'bignumber.js';
import { Token } from 'libs/tokens';
import { prettifyNumber } from 'utils/helpers';

export type RateProps = {
  source: Token;
  target: Token;
  rate: string;
  buy?: boolean;
};

export const Rate = ({
  buy,
  source: { symbol: sourceSymbol },
  target: { symbol: targetSymbol },
  rate,
}: RateProps) => {
  if (!rate) return <>...</>;

  return buy ? (
    <>
      1 {targetSymbol} = {rate ? prettifyNumber(rate) : '--'} {sourceSymbol}
    </>
  ) : (
    <>
      1 {sourceSymbol} ={' '}
      {rate ? prettifyNumber(new BigNumber(1).div(rate)) : '--'} {targetSymbol}
    </>
  );
};
