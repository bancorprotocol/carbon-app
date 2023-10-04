import { Token } from 'libs/tokens';
import { FC, useMemo } from 'react';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { FullOutcomeParams, getFullOutcome } from 'utils/fullOutcome';
import { prettifyNumber } from 'utils/helpers';

interface FullOutcomeProps extends FullOutcomeParams {
  base: Token;
  quote: Token;
  /** Amount deposed on a strategy or withdrawed from it */
  budgetUpdate?: string;
  className?: string;
}

export const FullOutcome: FC<FullOutcomeProps> = (props) => {
  const result = useMemo(() => getFullOutcome(props), [props]);
  if (!result) return <></>;
  const { amount, mean } = result;
  const token = props.buy ? props.base : props.quote;
  const hasBudgetUpdate = props.budgetUpdate && Number(props.budgetUpdate) > 0;

  return (
    <p className="text-12 text-white/60" data-testid="full-outcome">
      {hasBudgetUpdate && 'Based on updated budget, '}
      If the order is 100% filled, you will receive&nbsp;
      <b className="break-words font-weight-500" data-testid="outcome-value">
        {prettifyNumber(amount)}&nbsp;
        {token.symbol}
      </b>
      &nbsp;at an average price of&nbsp;
      <b className="break-words font-weight-500" data-testid="outcome-quote">
        {prettifyNumber(mean)}&nbsp;
        {props.quote.symbol}
      </b>
      &nbsp;per <b className="font-weight-500">1 {props.base.symbol}</b>.&nbsp;
      <a
        href="https://faq.carbondefi.xyz/order-execution/100-fill-estimation"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-4 font-weight-500 text-green"
      >
        <span>Learn More</span>
        <IconLink className="inline h-12 w-12" />
      </a>
    </p>
  );
};
