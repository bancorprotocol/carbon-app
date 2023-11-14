import { FC } from 'react';
import { Token } from 'libs/tokens';
import { OrderCreate } from '../useOrder';
import { UseQueryResult } from '@tanstack/react-query';
import { TokenInputField } from 'components/common/TokenInputField/TokenInputField';
import { ReactComponent as IconWarning } from 'assets/icons/warning.svg';
import { ReactComponent as IconLink } from 'assets/icons/link.svg';
import { SymmetricStrategyProps } from './CreateSymmetricStrategy';
import { MarketPricePercentage } from 'components/strategies/marketPriceIndication';
import BigNumber from 'bignumber.js';

interface Props extends SymmetricStrategyProps {
  marketPricePercentage: MarketPricePercentage;
}

export const CreateSymmerticStrategyBudget: FC<Props> = (props) => {
  const {
    base,
    quote,
    order0,
    order1,
    token0BalanceQuery,
    token1BalanceQuery,
    marketPricePercentage,
  } = props;
  const maxBelowMarket = marketPricePercentage.max.lt(0);
  const minAboveMarket = marketPricePercentage.min.gt(0);
  if (maxBelowMarket) {
    return (
      <>
        <TokenBudget token={quote} order={order0} query={token1BalanceQuery} />
        <Explaination base={base} />
      </>
    );
  } else if (minAboveMarket) {
    return (
      <>
        <TokenBudget token={base} order={order1} query={token0BalanceQuery} />
        <Explaination base={base} buy />
      </>
    );
  } else {
    return (
      <>
        <TokenBudget token={quote} order={order0} query={token1BalanceQuery} />
        <TokenBudget token={base} order={order1} query={token0BalanceQuery} />
      </>
    );
  }
};

const Explaination: FC<{ base?: Token; buy?: boolean }> = ({ base, buy }) => {
  return (
    <p className="text-12 text-white/60">
      The market price is outside the ranges you set for&nbsp;
      {buy ? 'buying' : 'selling'}&nbsp;
      {base?.symbol}. Budget for buying {base?.symbol} is not required.&nbsp;
      {/* TODO: add url */}
      <a
        href="/"
        target="_blank"
        className="inline-flex items-center gap-4 text-12 font-weight-500 text-green"
      >
        Learn More
        <IconLink className="h-12 w-12" />
      </a>
    </p>
  );
};

interface TokenBudgetProps {
  token?: Token;
  order: OrderCreate;
  query: UseQueryResult<string, any>;
}

const TokenBudget: FC<TokenBudgetProps> = (props) => {
  const { token, order, query } = props;
  if (!token) return <></>;

  const insufficientBalance =
    !query.isLoading && new BigNumber(query.data || 0).lt(order.budget);

  return (
    <>
      <TokenInputField
        id={`${token.symbol}-budget`}
        className="rounded-16 bg-black p-16"
        value={order.budget}
        setValue={order.setBudget}
        token={token}
        isBalanceLoading={query.isLoading}
        balance={query.data}
        isError={insufficientBalance}
        data-testid={`input-budget-${token.symbol}`}
      />
      {insufficientBalance && (
        <output
          htmlFor={`${token.symbol}-budget`}
          role="alert"
          aria-live="polite"
          className="flex items-center gap-10 font-mono text-12 text-red"
        >
          <IconWarning className="h-12 w-12" />
          <span className="flex-1">Insufficient balance</span>
        </output>
      )}
    </>
  );
};
