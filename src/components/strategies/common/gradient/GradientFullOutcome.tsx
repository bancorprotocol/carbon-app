import { Token } from 'libs/tokens';
import { FC } from 'react';
import { tokenAmount } from 'utils/helpers';
import { GradientOrderBlock } from '../types';
import { SafeDecimal } from 'libs/safedecimal';
import { isZero } from '../utils';

interface Props {
  base: Token;
  quote: Token;
  order: GradientOrderBlock;
  className?: string;
}

export const GradientFullOutcome: FC<Props> = (props) => {
  const { base, quote, order } = props;
  const { _sP_, _eP_, budget, marginalPrice, direction } = order;
  if (!marginalPrice || isZero(budget)) return;
  const min = SafeDecimal.min(_sP_, _eP_, marginalPrice).mul(budget);
  const max = SafeDecimal.max(_sP_, _eP_, marginalPrice).mul(budget);
  const token = direction === 'buy' ? base : quote;

  return (
    <p className="text-12 text-main-0/60" data-testid="full-outcome">
      If the order is 100% filled, you will receive between&nbsp;
      <b className="font-semibold break-words" data-testid="outcome-value">
        {tokenAmount(min, token)}&nbsp;
      </b>
      &nbsp;and&nbsp;
      <b className="font-semibold break-words" data-testid="outcome-quote">
        {tokenAmount(max, token)}&nbsp;
      </b>
    </p>
  );
};
