import { Token } from 'libs/tokens';
import { FC, useMemo } from 'react';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { AcquireAmountProps, getAcquiredAmount } from 'utils/fullOutcome';
import Decimal from 'decimal.js';

interface FullOutcomeProps extends AcquireAmountProps {
  base: Token;
  quote: Token;
  /** Amount deposed on a strategy or withdrawed from it */
  budgetUpdate?: string;
  className?: string;
}

const roundTokenAmount = (amount: string, token: Token) => {
  const value = new Intl.NumberFormat('en-US').format(Number(amount));
  return `${value} ${token.symbol}`;
};

const tokenAmount = (amount: string, token: Token) => {
  const value = new Intl.NumberFormat('en-US', {
    maximumSignificantDigits: token.decimals,
  }).format(Number(amount));
  return `${value} ${token.symbol}`;
};

export const getUpdatedBudget = (
  type: 'deposit' | 'withdraw',
  balance?: string,
  update?: string
) => {
  const base = new Decimal(balance || '0');
  const delta = new Decimal(update || '0');
  if (type === 'deposit') return base.add(delta).toString();
  return base.sub(delta).toString();
};

export const FullOutcomeCreateStrategy: FC<FullOutcomeProps> = (props) => {
  const result = useMemo(() => getAcquiredAmount(props), [props]);
  if (!result) return <></>;
  const { amount, mean } = result;
  const targetToken = props.buy ? props.base : props.quote;
  const hasBudgetUpdate = props.budgetUpdate && Number(props.budgetUpdate) > 0;

  // Note: Tailwind merge will override text-12 with text-start for some reason
  const textClasses = [
    'text-start text-12 text-white/60',
    props.className ?? '',
  ].join(' ');

  return (
    <p className={textClasses}>
      {hasBudgetUpdate && 'Based on updated budget, '}
      If the order is 100% filled, you will receive&nbsp;
      <b title={tokenAmount(amount, targetToken)}>
        {roundTokenAmount(amount, targetToken)}
      </b>
      &nbsp;at an average price of&nbsp;
      <b title={tokenAmount(mean, props.quote)}>
        {roundTokenAmount(mean, props.quote)}
      </b>
      &nbsp;per <b>1 {props.base.symbol}</b>.&nbsp;
      <a
        href="/"
        target="_blank"
        className="inline-flex items-center gap-4 text-green underline"
      >
        <span>Learn More</span>
        <IconLink className="inline h-12 w-12" />
      </a>
    </p>
  );
};
